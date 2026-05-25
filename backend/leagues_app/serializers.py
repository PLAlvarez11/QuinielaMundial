from rest_framework import serializers
from .models import League, LeagueMember, Invitation

class LeagueSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = League
        fields = '__all__'

class LeagueMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeagueMember
        fields = '__all__'

class InvitationSerializer(serializers.ModelSerializer):
    token = serializers.CharField(read_only=True)
    expires_at = serializers.DateTimeField(read_only=True)
    invited_by = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Invitation
        fields = '__all__'