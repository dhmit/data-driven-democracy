"""
Django management command load_dataset

Updates local db with values from base csv dataset
"""
import os
import pandas

from django.conf import settings
from django.core.management.base import BaseCommand
from app.models import CampaignFinance


class Command(BaseCommand):
    """
    Custom django-admin command used to run an analysis from the app/analysis folder
    """
    help = ''

    def add_arguments(self, parser):
        parser.add_argument(
            'dataset_name',
            type=str,
            action='store',
            help='Name of dataset in app/data folder (with extension)',
        )

    def handle(self, *args, **options):
        # pylint: disable=too-many-locals
        file_name = options.get('dataset_name')
        file_path = os.path.join(settings.DATASET_DIR, file_name)
        df = pandas.read_csv(file_path)

        # TODO: Generalize this to update correct model(s) and columns based on dataset
        for full_bond_number, amount, donor_name, party_name in zip(df["FullBondNumber"], df["Amount"], df["Donor"], df["Party"]):
            campaignfinance = CampaignFinance( 
                full_bond_number = full_bond_number,
                amount = amount,
                donor_name = donor_name,
                party_name = party_name,
            )
            campaignfinance.save()
