import os
import json

from django.conf import settings

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import (
    TCPDElection,
    SeatShare,
    CampaignFinance,
)

from .serializers import (
    TCPDElectionSerializer,
    SeatShareSerializer,
    CampaignFinanceSerializer,
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
def get_SDE_DATA_IN_F7DSTRBND_1991(request, feature_limit=10):
    """
    API endpoint to get SDE_DATA_IN_F7DSTRBND_1991 geojson
    """
    geojson_path = os.path.join(settings.GEOJSON_DIR, "SDE_DATA_IN_F7DSTRBND_1991.geojson")
    with open(geojson_path, encoding='utf-8') as f:
        geojson = json.load(f)
        num_features = feature_limit if feature_limit is not None else len(geojson["features"])
        return Response({
            "type": geojson["type"],
            "features": geojson["features"][:num_features]
        })

@api_view(['GET'])
def campaign_finance(request,donor_name=None, party_name=None):
    """
    API endpoint to get all campaign finance donations made by donors to parties, or a specified
    pair of donor-party donations
    """
    if donor_name is not None and party_name is not None:
        campaign_finances = CampaignFinance.objects.filter(donor_name=donor_name, party_name=party_name)
    else:
        campaign_finances = CampaignFinance.objects.all()
    serializer = CampaignFinanceSerializer(campaign_finances, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def campaign_finance_party_subset(request,party_name):
    """
    API endpoint to get campaign finance donations made by all donors to 
    a specified party
    """
    campaign_finances = CampaignFinance.objects.filter(party_name=party_name)
    serializer = CampaignFinanceSerializer(campaign_finances, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def campaign_finance_donor_subset(request, donor_name):
    """
    API endpoint to get campaign finance donations made to all parties by 
    a specified donor
    """
    campaign_finances = CampaignFinance.objects.filter(donor_name=donor_name)
    serializer = CampaignFinanceSerializer(campaign_finances, many=True)
    return Response(serializer.data)