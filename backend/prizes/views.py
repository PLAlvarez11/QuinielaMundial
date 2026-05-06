from rest_framework import viewsets
from .models import PrizeDistribution
from .serializers import PrizeDistributionSerializer


class PrizeDistributionViewSet(viewsets.ModelViewSet):
    queryset = PrizeDistribution.objects.select_related(
        'league',
        'member'
    ).all()

    serializer_class = PrizeDistributionSerializer