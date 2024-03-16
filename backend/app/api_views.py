import os
import json

from django.conf import settings

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import (
    LSElection,
    TCPDElection,
    SeatShare
)

from .serializers import (
    LSElectionSerializaer,
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
    API endpoint to get the seats shares of each party
    in each general election in the database
    """
    seat_shares = SeatShare.objects.all()
    serializer = SeatShareSerializer(seat_shares, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def all_ls_elections(request):
    """
    API endpoint to get each Lok Sahbha election
    in the database
    """
    ls_elections = LSElection.objects.all()
    serializer = LSElectionSerializaer(ls_elections, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_ls_election_year(request, year):
    """
    API endpoint to get each Lok Sahbha election
    in the database
    """
    ls_elections = LSElection.objects.filter(election_year=year)
    serializer = LSElectionSerializaer(ls_elections, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_specific_ls_election(request, year, state, constituency):
    """
    API endpoint to get each Lok Sahbha election
    in the database
    """
    ls_elections = LSElection.objects.filter(
        election_year=year, state_name=state, constituency_name=constituency.upper())
    serializer = LSElectionSerializaer(ls_elections, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_SDE_DATA_IN_F7DSTRBND_1991(request, feature_limit=10):
    """
    API endpoint to get SDE_DATA_IN_F7DSTRBND_1991 geojson
    """
    geojson_path = os.path.join(
        settings.GEOJSON_DIR, "SDE_DATA_IN_F7DSTRBND_1991.geojson")
    with open(geojson_path, encoding='utf-8') as f:
        geojson = json.load(f)

        return Response({
            "type": geojson["type"],
            "features": geojson["features"]
        })


@api_view(['GET'])
def get_India_PC_2019_simplified(request, feature_limit=10):
    """
    API endpoint to get SDE_DATA_IN_F7DSTRBND_1991 geojson
    """
    geojson_path = os.path.join(
        settings.GEOJSON_DIR, "india_pc_2019_simplified.geojson")
    with open(geojson_path, encoding='utf-8') as f:
        geojson = json.load(f)

        return Response({
            "type": geojson["type"],
            "features": geojson["features"]
        })


@api_view(['GET'])
def get_India_PC_2019(request, feature_limit=10):
    """
    API endpoint to get SDE_DATA_IN_F7DSTRBND_1991 geojson
    """
    geojson_path = os.path.join(
        settings.GEOJSON_DIR, "India_PC_2019.geojson")
    with open(geojson_path, encoding='utf-8') as f:
        geojson = json.load(f)

        return Response({
            "type": geojson["type"],
            "features": geojson["features"]
        })
