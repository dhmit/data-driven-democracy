"""
Django management command load_responders

Updates local db with values from base csv dataset
"""

import os
import pandas

from django.conf import settings
from django.core.management.base import BaseCommand
from app.models import LoknitiResponders

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

        for (state_name, constituency_no, assembly_no, respondent_no, age, gender, caste, religion, income, education_level, occupation) in zip(
            # change column names based on file/election year
            df["state_id"],
            df["pc_id"],
            df["ac_id"],
            df["resno"],
            df["z1"],
            df["z2"],
            df["z5a"],
            df["z6"],
            df["z13"],
            df["z3"],
            df["z4a"],
        ):
            try:
                age_int = int(float(age))
            except ValueError:
                age_int = 0

            try:
                res_no = (int(respondent_no))
            except ValueError:
                continue

            responders = LoknitiResponders(
                # change election year depending on the file
                election_year=2014,
                state_name=state_name.split(": ", 1)[1],
                PC_id=constituency_no,
                AC_id=assembly_no,
                respondent_no=res_no,
                age=age_int,
                gender=gender,
                caste=caste,
                religion=religion,
                income=income,
                education_level=education_level,
                occupation=occupation
            )
            responders.save()
