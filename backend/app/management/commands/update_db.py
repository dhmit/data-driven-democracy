"""
Django management command update_database

Updates local db with values from base csv datasets
"""

import os
import json
import pandas

from tqdm import tqdm

from django.conf import settings
from django.core.management.base import BaseCommand
from app import models


def all_configs():
    """
    Get the names of all json files (without extension) in settings.DB_UPDATE_CONFIG_DIR
    """
    config_names = []
    for entry in os.scandir(settings.DB_UPDATE_CONFIG_DIR):
        entry_name_split = entry.name.split('.')
        if not entry.is_file() or len(entry_name_split) < 2:
            continue
        config_name, ext = entry_name_split
        if ext != "json":
            continue
        config_names.append(config_name)
    return config_names


class Command(BaseCommand):
    """
    Custom django-admin command to load data from base csvs
    """

    help = "Custom django-admin command to load data from base csvs"

    def add_arguments(self, parser):
        parser.add_argument(
            "--config_names",
            type=str,
            action="store",
            nargs='*',
            help="Names of database update configs from database_update_config folder",
            default=all_configs()
        )
        parser.add_argument(
            "--hide_progress",
            action="store_true",
            help="Hide import progress bar"
        )

    def handle(self, *args, **options):
        config_names = options.get("config_names")
        hide_progress = options.get("hide_progress")

        for config_name in config_names:
            config_path = os.path.join(
                settings.DB_UPDATE_CONFIG_DIR, f"{config_name}.json"
            )
            with open(config_path, 'r', encoding="utf-8") as f:
                table_config = json.load(f)

            # Get model object
            model_name = table_config["model_name"]
            model = getattr(models, model_name)

            # Mapping of model attribute name to column in csv
            attr_to_column = table_config["attr_to_column"]

            print(f"Updating {model_name} table:")

            for file_name in table_config["file_names"]:
                file_path = os.path.join(settings.DATASET_DIR, file_name)
                df = pandas.read_csv(file_path)
                print(f"Importing from {file_name}:")

                for i in tqdm(range(len(df)), disable=hide_progress):
                    # Skip column id if it has already been loaded
                    # Should implement check based on some unique data id rather than column number
                    if model.objects.filter(id=i + 1):
                        continue
                    instance = model(**{
                        model_attr: df[df_column_name][i]
                        for model_attr, df_column_name in attr_to_column.items()
                    })
                    instance.save()
