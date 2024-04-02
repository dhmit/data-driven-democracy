"""
Django management command load_loksabha

Updates local db with values from base csv dataset
"""

import os
import pandas

from django.conf import settings
from django.core.management.base import BaseCommand
from app.models import LSElection


class Command(BaseCommand):
    """
    Custom django-admin command used to run an analysis from the app/analysis folder
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

        # TODO: Generalize this to update correct model(s) and columns based on dataset
        for year, state_name, constituency_name, constituency_no, party_name, candidate, candidate_position, margin_percentage, vote_share in zip(
            df["Year"],
            df["State_Name"],
            df["Constituency_Name"],
            df["Constituency_No"],
            df["Party"],
            df["Candidate"],
            df["Position"],
            df["Margin_Percentage"],
            df["Vote_Share_Percentage"]
        ):
            lok_sabha = LSElection(
                election_year=year,
                state_name=state_name,
                constituency_name=constituency_name,
                constituency_no=constituency_no,
                party_name=party_name,
                candidate=candidate,
                candidate_position=candidate_position,
                margin_percentage=margin_percentage,
                vote_share=vote_share,
            )
            lok_sabha.save()
