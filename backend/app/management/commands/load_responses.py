"""
Django management command helper load_responders

Updates local db with values from base csv dataset
"""

from app.models import LoknitiResponses, LoknitiCodebook
from django.db.models import Q


def get_question_vars(year):
    """
    Returns a dict mapping question variables for the given year to their codebook entry
    """
    codebook_entries = LoknitiCodebook.objects.filter(
        Q(election_year=year) & Q(question_var__startswith='q'))
    question_vars = {question.question_var: question for question in codebook_entries}
    return question_vars


def load_responses(responder, row):
    """
    Load Responses given Responder instance and Lokniti NES csv row
    """

    # get survey questions
    question_vars = get_question_vars(responder.election_year)

    for q_var, codebook_entry in question_vars.items():
        response = LoknitiResponses(
            respondent_no=responder.respondent_no,
            election_year=responder.election_year,
            question_var=q_var,
            response=getattr(row, q_var),
            responder=responder,
            entry=codebook_entry
        )
        response.save()
