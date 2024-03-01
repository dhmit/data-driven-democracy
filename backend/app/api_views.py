from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import (
    TCPDElection,
    SeatShare
)

from .serializers import (
    TCPDElectionSerializer,
    SeatShareSerializer
)


@api_view(['GET'])
def all_elections(request):
    """
    API endpoint to get all elections in the database
    """
    elections = TCPDElection.objects.all()
    serializer = TCPDElectionSerializer(elections, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def all_seats(request):
    """
    API endpoint to get all elections in the database
    """
    seat_shares = SeatShare.objects.all()
    serializer = SeatShareSerializer(seat_shares, many=True)
    return Response(serializer.data)
