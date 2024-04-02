"""
Models for the the data-driven-democracy web app.
"""

from django.db import models


class TCPDElection(models.Model):
    """
    Represents each assembly and general election from 1951-1962
    """
    # https://docs.djangoproject.com/en/5.0/ref/models/fields/#enumeration-types
    class ElectionType(models.TextChoices):
        AE = "AE"
        GE = "GE"

    election_type = models.CharField(
        max_length=2,
        choices=ElectionType
    )

    number_of_seats = models.IntegerField()


class SeatShare(models.Model):
    """
    Represents a political party and the number of seats
    it held in Lok Sahbha in a specific election year
    """
    # https://docs.djangoproject.com/en/5.0/ref/models/fields/#enumeration-types

    party_name = models.CharField(
        max_length=10,

    )

    seats_held = models.IntegerField()
    election_year = models.IntegerField()
    total_seats = models.IntegerField()


class LSElection(models.Model):
    """
    Represents a Lok Sahba election
    """
    # https://docs.djangoproject.com/en/5.0/ref/models/fields/#enumeration-types

    party_name = models.CharField(
        max_length=10,
    )

    state_name = models.CharField(
        max_length=30,
    )

    constituency_name = models.CharField(
        max_length=30,
    )

    constituency_no = models.IntegerField(default=0)

    candidate = models.CharField(
        max_length=30
    )

    election_year = models.IntegerField()

    candidate_position = models.IntegerField()
    margin_percentage = models.FloatField(null=True, blank=True, default=0)

    vote_share = models.FloatField(null=True, blank=True, default=0)
