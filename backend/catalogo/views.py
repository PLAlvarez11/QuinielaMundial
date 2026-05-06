from rest_framework import viewsets
from .models import (
    Venue,
    Stadium,
    Country,
    TournamentStage,
    Group,
    GroupCountry,
    Match
)
from .serializers import (
    VenueSerializer,
    StadiumSerializer,
    CountrySerializer,
    TournamentStageSerializer,
    GroupSerializer,
    GroupCountrySerializer,
    MatchSerializer
)


class VenueViewSet(viewsets.ModelViewSet):
    queryset = Venue.objects.all()
    serializer_class = VenueSerializer


class StadiumViewSet(viewsets.ModelViewSet):
    queryset = Stadium.objects.select_related('venue').all()
    serializer_class = StadiumSerializer


class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer


class TournamentStageViewSet(viewsets.ModelViewSet):
    queryset = TournamentStage.objects.all()
    serializer_class = TournamentStageSerializer


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.select_related('stage').all()
    serializer_class = GroupSerializer


class GroupCountryViewSet(viewsets.ModelViewSet):
    queryset = GroupCountry.objects.select_related('group', 'country').all()
    serializer_class = GroupCountrySerializer


class MatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.select_related(
        'home_team',
        'away_team',
        'stadium',
        'stage',
        'group'
    ).all()
    serializer_class = MatchSerializer