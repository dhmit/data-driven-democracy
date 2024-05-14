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
from django.core.management import call_command
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


def default_table_updater(table_config, file_path, table_offset, hide_progress=False):
    """
    Update table by creating model instances from specific csv columns
    """
    df = pandas.read_csv(file_path)

    # Get model object
    model = getattr(models, table_config["model_name"])

    # Mapping of model attribute name to column in csv
    attr_to_column = table_config["attr_to_column"]

    num_rows = len(df)
    for i in tqdm(range(num_rows), disable=hide_progress):
        # Skip column id if it has already been loaded
        if model.objects.filter(id=table_offset + i + 1):
            # Would be better to implement this check based on some unique
            # data id in csv rather than column number
            continue

        # Save model instance
        model(**{
            model_attr: df[df_column_name][i]
            for model_attr, df_column_name in attr_to_column.items()
        }).save()

    # Increase offset by number of rows added from file
    # (Temporary fix for configs with multiple files)
    # TODO: Make duplicate checking reliable; currently depends on file
    #       length and order.
    return num_rows


def command_based_table_updater(table_config, file_path, table_offset, hide_progress=False):
    """
    Use an arbitrary django management command to update a table
    """
    call_command(
        table_config["command_name"],
        file_path,
        **table_config.get("args", {}),
        hide_progress=hide_progress
    )
    return 0


TABLE_UPDATERS = {
    "default": default_table_updater,
    "management_command": command_based_table_updater
}


class Command(BaseCommand):
    """
    Custom django-admin command to load data from base csvs

    Looks for {config_name}.json files in app/data/database_update_config
    which should be structured:
    {
        "model_name": class name of django model to update,
        "attr_to_column": dictionary of model attribute to corresponding column in csv,
        "file_names": list of file paths relative to "app/data" to load columns from
    }
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
        # pylint: disable=too-many-locals
        config_names = options.get("config_names")
        hide_progress = options.get("hide_progress")

        # Create db file if it does not exist and apply any migrations
        call_command("makemigrations")
        call_command("migrate")

        for config_name in config_names:
            config_path = os.path.join(
                settings.DB_UPDATE_CONFIG_DIR, f"{config_name}.json"
            )
            with open(config_path, 'r', encoding="utf-8") as f:
                table_config = json.load(f)

            # Get model names to print to console
            if not (model_names := table_config.get("model_names")):
                model_names = [table_config["model_name"]]            
            model_names_str = ", ".join(model_names)
            print(f"Updating tables: {model_names_str}")

            table_updater = TABLE_UPDATERS.get(
                table_config.get("config_type"),
                default_table_updater
            )

            table_offset = 0  # Index in the database table (model id)
            for file_name in table_config["file_names"]:
                file_path = os.path.join(settings.DATASET_DIR, file_name)
                print(f"Importing from {file_name}:")

                table_offset += table_updater(
                    table_config, file_path, table_offset,
                    hide_progress=hide_progress
                )
