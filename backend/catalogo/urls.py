from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    VenueViewSet,
    StadiumViewSet,
    CountryViewSet,
    TournamentStageViewSet,
    GroupViewSet,
    GroupCountryViewSet,
    MatchViewSet
)

router = DefaultRouter()

router.register(r'venues', VenueViewSet, basename='venues')
router.register(r'stadiums', StadiumViewSet, basename='stadiums')
router.register(r'countries', CountryViewSet, basename='countries')
router.register(r'tournament-stages', TournamentStageViewSet, basename='tournament-stages')
router.register(r'groups', GroupViewSet, basename='groups')
router.register(r'group-countries', GroupCountryViewSet, basename='group-countries')
router.register(r'matches', MatchViewSet, basename='matches')

urlpatterns = [
    path('', include(router.urls)),
]