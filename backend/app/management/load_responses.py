"""
Django management command load_responders

Updates local db with values from base csv dataset
"""

from app.models import LoknitiResponses, LoknitiCodebook
from django.db.models import Q

# pylint: disable=duplicate-code


def get_questions(year):
    """
    Returns a dict mapping question variable to question text of survey questions
    """
    q_map = {}
    questions = LoknitiCodebook.objects.filter(
        Q(election_year=year) & Q(question_var__startswith='q'))
    for i in questions:
        q_map[i.question_var] = i.question_text
    return q_map


def load_responses(responders, row):
    """
    Load Responses given Responder and Codebook instance row
    """
    # get survey questions
    questions = get_questions(responders.election_year)
    for q_var in questions:
        responses = LoknitiResponses(
            respondent_no=responders.respondent_no,
            election_year=responders.election_year,
            question_var=q_var,
            response=row[q_var],
            responder=responders,
            entry=row
        )
        responses.save()
