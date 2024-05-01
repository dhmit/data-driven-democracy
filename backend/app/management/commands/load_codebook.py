"""
Django management command load_codebook

Updates local db with values from base csv dataset
"""

import os
import pandas

from django.conf import settings
from django.core.management.base import BaseCommand
from app.models import LoknitiCodebook

# pylint: disable=duplicate-code


class Command(BaseCommand):
    """
    Custom django-admin command to load Lok Sabha data over the years
    """

    help = ""

    def add_arguments(self, parser):
        parser.add_argument(
            "dataset_name",
            type=str,
            action="store",
            help="Name of dataset in app/data folder (with extension)",
        )

    def handle(self, *args, **options):
        # pylint: disable=too-many-locals
        file_name = options.get("dataset_name")
        file_path = os.path.join(settings.DATASET_DIR, file_name)
        df = pandas.read_csv(file_path)
    # pylint: disable=duplicate-code

        for (year, var_name, question_text) in zip(
            df["year"],
            df["var_name"],
            df["question_text"],
        ):
            codebook = LoknitiCodebook(
                election_year=year,
                question_var=var_name,
                question_text=question_text
            )
            codebook.save()
