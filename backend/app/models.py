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


class CampaignFinance(models.Model):
    """
    Represents a donation amount made by a donor to a party
    """
    full_bond_number = models.CharField(
        max_length=7,
    )
    amount = models.IntegerField()
    donor_name = models.CharField(
        max_length=61,
    )
    party_name = models.CharField(
        max_length=37,
    )


class LoknitiCodebook(models.Model):
    election_year = models.IntegerField()
    question_var = models.CharField(max_length=10)
    question_text = models.CharField(max_length=500)


class LoknitiResponders(models.Model):
    """
    Represents a responder
    """
    election_year = models.IntegerField(null=True, blank=True, default=None)
    state_name = models.CharField(
        max_length=50, null=True, blank=True, default=None)
    PC_id = models.IntegerField(null=True, blank=True, default=None)
    AC_id = models.IntegerField(null=True, blank=True, default=None)
    PS_id = models.IntegerField(default=None, null=True, blank=True)
    respondent_no = models.IntegerField(null=True, blank=True, default=None)
    age = models.IntegerField(default=None, null=True, blank=True)
    gender = models.CharField(
        max_length=50, default=None, null=True, blank=True)
    caste = models.CharField(
        max_length=50, default=None, null=True, blank=True)
    religion = models.CharField(
        max_length=100, default=None, null=True, blank=True)
    income = models.CharField(
        max_length=100, default=None, null=True, blank=True)
    education_level = models.CharField(
        max_length=50, default=None, null=True, blank=True)
    occupation = models.CharField(
        max_length=100, default=None, null=True, blank=True)


class LoknitiResponses(models.Model):
    """
    Represents a response to a survey question during
    a specific election year
    """

    respondent_no = models.IntegerField()
    election_year = models.IntegerField()
    question_var = models.CharField(max_length=20)
    response = models.CharField(max_length=500)
    responder = models.ForeignKey(LoknitiResponders, on_delete=models.CASCADE)
