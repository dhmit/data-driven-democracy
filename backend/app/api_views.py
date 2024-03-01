from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import (
    TCPDElection
)

from .serializers import (
    TCPDElectionSerializer
)


@api_view(['GET'])
def all_elections(request):
    """
    API endpoint to get all elections in the database
    """
    elections = TCPDElection.objects.all()
    serializer = TCPDElectionSerializer(elections, many=True)
    return Response(serializer.data)
