from rest_framework import viewsets
from .models import League, LeagueMember, Invitation
from .serializers import LeagueSerializer, LeagueMemberSerializer, InvitationSerializer

class LeagueViewSet(viewsets.ModelViewSet):
    queryset = League.objects.all()
    serializer_class = LeagueSerializer

class LeagueMemberViewSet(viewsets.ModelViewSet):
    queryset = LeagueMember.objects.all()
    serializer_class = LeagueMemberSerializer

class InvitationViewSet(viewsets.ModelViewSet):
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer