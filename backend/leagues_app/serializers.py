from rest_framework import serializers
from .models import League, LeagueMember, Invitation

class LeagueSerializer(serializers.ModelSerializer):
    class Meta:
        model = League
        fields = '__all__'

class LeagueMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeagueMember
        fields = '__all__'

class InvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = '__all__'