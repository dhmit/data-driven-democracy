"""
Serializers take models or other data structures and present them
in ways that can be transported across the backend/frontend divide, or
allow the frontend to suggest changes to the backend/database.
"""

from rest_framework import serializers
from .models import (
    TCPDElection,
    SeatShare,
    CampaignFinance,
)


class TCPDElectionSerializer(serializers.ModelSerializer):
    """
    Serializes a photo
    """
    number_of_seats = serializers.SerializerMethodField()

    # TODO: Remove
    # Not necessary, done to show how instance variables can be modified upon serialization
    @staticmethod
    def get_number_of_seats(instance):
        return instance.number_of_seats

    class Meta:
        model = TCPDElection
        fields = [
            "election_type", "number_of_seats"
        ]


class SeatShareSerializer(serializers.ModelSerializer):
    """
    Serializes seat shares
    """

    class Meta:
        model = SeatShare
        fields = [
            "election_year",
            "party_name",
            "seats_held",
            "total_seats"
        ]

class CampaignFinanceSerializer(serializers.ModelSerializer):
    """
    Serializes campaign finance donations
    """
    class Meta:
        model = CampaignFinance
        fields = [
            "donor_name",
            "party_name",
            "amount",
            "full_bond_number"
        ]