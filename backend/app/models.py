"""
Models for the the data-driven-democracy web app.
"""

from django.db import models


class TCPDElection(models.Model):
    # https://docs.djangoproject.com/en/5.0/ref/models/fields/#enumeration-types
    class ElectionType(models.TextChoices):
        AE = "AE"
        GE = "GE"

    election_type = models.CharField(
        max_length=2,
        choices=ElectionType
    )

    number_of_seats = models.IntegerField()
