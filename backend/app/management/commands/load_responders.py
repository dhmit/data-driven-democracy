"""
Django management command load_responders

Updates local db with values from base csv dataset
"""

import os
import pandas

from django.conf import settings
from django.core.management.base import BaseCommand
from app.models import LoknitiResponders, LoknitiCodebook

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
        file_name = options.get("dataset_name")
        file_path = os.path.join(settings.DATASET_DIR, file_name)
        df = pandas.read_csv(file_path)

        year = file_name[file_name.index("2"):file_name.index("2")+4]

        cols = {}

        question_column_mappings = [
            ("state", "State Name"),
            ("pc", "P.C. ID"),
            ("ac", "A.C. ID"),
            ("ps", "P.S. ID"),
            ("resno", "Respondent Number"),
            ("age", "What is your age?"),
            ("gender", "What is your gender?"),
            ("caste", "What is your caste?"),
            ("religion", "What is your religion?"),
            ("income", "What is your total monthly household income?"),
            ("education", "Up to what level have you studied?"),
            ("occupation", "What is your main occupation?")
        ]

        # Retrieve LoknitiCodebook question variables for each question text
        for column_name, question_text in question_column_mappings:
            try:
                cols[column_name] = LoknitiCodebook.objects.get(
                    election_year=year, question_text=question_text
                ).question_var
            except LoknitiCodebook.DoesNotExist:
                print(column_name, None)

        for (state_name, constituency_no, assembly_no, ps_no, respondent_no, age,
             gender, caste, religion, income, education_level, occupation) in zip(
            # column names based on file/election year
            df[cols.get("state", "")] if cols.get(
                "state", "") else [None]*len(df),
            df[cols.get("pc", "")] if cols.get("pc", "") else [None]*len(df),
            df[cols.get("ac", "")] if cols.get("ac", "") else [None]*len(df),
            df[cols.get("ps", "")] if cols.get("ps", "") else [None]*len(df),
            df[cols.get("resno", "")] if cols.get(
                "resno", "") else [0]*len(df),
            df[cols.get("age", "")] if cols.get("age", "") else [None]*len(df),
            df[cols.get("gender", "")] if cols.get(
                "gender", "") else [None]*len(df),
            df[cols.get("caste", "")] if cols.get(
                "caste", "") else [None]*len(df),
            df[cols.get("religion", "")] if cols.get(
                "religion", "") else [None]*len(df),
            df[cols.get("income", "")] if cols.get(
                "income", "") else [None]*len(df),
            df[cols.get("education", "")
               ] if cols.get("education", "") else [None]*len(df),
            df[cols.get("occupation", "")] if cols.get(
                "occupation", "") else [None]*len(df),
        ):

            try:
                age = int(float(age))
            except ValueError:
                age = None

            try:
                respondent_no = (int(respondent_no))
            except ValueError:
                respondent_no = None

            try:
                ps_no = (int(ps_no))
            except ValueError:
                ps_no = None

            responders = LoknitiResponders(
                election_year=year,
                state_name=state_name.split(": ", 1)[1],
                PC_id=constituency_no,
                AC_id=assembly_no,
                PS_id=ps_no,
                respondent_no=respondent_no,
                age=age,
                gender=gender,
                caste=caste,
                religion=religion,
                income=income,
                education_level=education_level,
                occupation=occupation
            )
            responders.save()
