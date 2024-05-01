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
    election_year = models.IntegerField()
    state_name = models.CharField(max_length=50)
    PC_id = models.IntegerField()
    AC_id = models.IntegerField()
    respondent_no = models.IntegerField(default=0)
    age = models.IntegerField(default=0)
    gender = models.CharField(max_length=50, default="No response")
    caste = models.CharField(max_length=50, default="No response")
    religion = models.CharField(max_length=100, default="No response")
    income = models.FloatField(default=0)
    education_level = models.CharField(max_length=50, default="No response")
    occupation = models.CharField(max_length=100, default="No response")


class LoknitiResponses(models.Model):
    """
    Represents a response to a survey question during
    a specific election year
    """
    # for in key looking up data in another model

    respondent_no = models.IntegerField()
    election_year = models.IntegerField()
    question_var = models.CharField(max_length=20)
    response = models.CharField(max_length=500)
    responder = models.ForeignKey(LoknitiResponders, on_delete=models.CASCADE)
