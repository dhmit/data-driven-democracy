"""
Django management command load_responders

Updates local db with values from base csv dataset
"""

import os
import pandas as pd

from tqdm import tqdm

from django.core.management.base import BaseCommand
from app.models import LoknitiResponders, LoknitiCodebook
from .load_responses import load_responses

ATTR_TO_QUESTION = {
    "state_name": "State Name",
    "PC_id": "P.C. ID",
    "AC_id": "A.C. ID",
    "PS_id": "P.S. ID",
    "respondent_no": "Respondent Number",
    "age": "What is your age?",
    "gender": "What is your gender?",
    "caste": "What is your caste?",
    "religion": "What is your religion?",
    "income": "What is your total monthly household income?",
    "education_level": "Up to what level have you studied?",
    "occupation": "What is your main occupation?"
}

DISTINGUISHING_ATTRS = [
    "state_name",
    "PC_id",
    "AC_id",
    "PS_id",
    "respondent_no"
]


class Command(BaseCommand):
    """
    Custom django-admin command to load Lok Sabha data over the years
    """

    help = ""

    def add_arguments(self, parser):
        parser.add_argument(
            "dataset_path",
            type=str,
            action="store",
            help="Path to dataset",
        )
        parser.add_argument(
            "--hide_progress",
            action="store_true",
            help="Hide import progress bar"
        )

    def handle(self, *args, **options):
        file_path = options.get("dataset_path")
        hide_progress = options.get("hide_progress")

        df = pd.read_csv(file_path)
        _, file_name = os.path.split(file_path)
        year = file_name.split('_')[1]

        attr_to_column = {}
        if not LoknitiCodebook.objects.all():
            raise Exception("""LoknitiCodebook needs to be populated first by running:
                            'python manage.py update_db --config_names lokniticodebook'""")

        # Retrieve LoknitiCodebook question variables for each question text
        for attr_name, question_text in ATTR_TO_QUESTION.items():
            try:
                attr_to_column[attr_name] = LoknitiCodebook.objects.get(
                    election_year=year, question_text=question_text
                ).question_var
            except LoknitiCodebook.DoesNotExist:
                attr_to_column[attr_name] = None
                print(attr_name, "not recorded")

        def get_column_value(row, column_name, attr_name):
            value = getattr(row, column_name, None)
            if pd.isnull(value):
                value = None
            if value is not None and attr_name in ["PS_id", "respondent_no", "age"]:
                value = int(float(value))
            return value

        for row in tqdm(df.itertuples(), total=len(df), disable=hide_progress):
            attr_dict = {
                attr_name: get_column_value(row, column_name, attr_name)
                for attr_name, column_name in attr_to_column.items()
                if column_name is not None
            }

            # Responder already exists
            if LoknitiResponders.objects.filter(**{
                    attr: attr_dict[attr] for attr in DISTINGUISHING_ATTRS}):
                continue

            responder = LoknitiResponders(
                election_year=year, **attr_dict
            )
            responder.save()
            load_responses(responder, row)
