from rest_framework import serializers
from .models import League, LeagueMember, Invitation


class LeagueSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.name', read_only=True)
    member_count = serializers.SerializerMethodField()
    
    class Meta:
        model = League
        fields = [
            'id', 'name', 'description', 'type', 'entry_fee', 
            'owner', 'owner_name', 'status', 'max_members', 
            'member_count', 'created_at', 'updated_at', 'deleted_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'owner']
    
    def get_member_count(self, obj):
        """Retorna el número actual de miembros"""
        return obj.members.count()
    
    def validate_max_members(self, value):
        """Validar que max_members sea al menos 1"""
        if value < 1:
            raise serializers.ValidationError("La liga debe permitir al menos 1 miembro")
        return value
    
    def validate_entry_fee(self, value):
        """Validar que entry_fee no sea negativo"""
        if value < 0:
            raise serializers.ValidationError("La cuota de inscripción no puede ser negativa")
        return value


class LeagueMemberSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    league_name = serializers.CharField(source='league.name', read_only=True)
    
    class Meta:
        model = LeagueMember
        fields = [
            'id', 'league', 'league_name', 'user', 'user_name', 
            'user_email', 'team_name', 'total_points', 'status', 'joined_at'
        ]
        read_only_fields = ['id', 'user', 'joined_at']


class InvitationSerializer(serializers.ModelSerializer):
    invited_by_name = serializers.CharField(source='invited_by.name', read_only=True)
    league_name = serializers.CharField(source='league.name', read_only=True)
    is_expired = serializers.SerializerMethodField()
    
    class Meta:
        model = Invitation
        fields = [
            'id', 'league', 'league_name', 'email', 'token', 
            'invited_by', 'invited_by_name', 'status', 
            'expires_at', 'is_expired', 'created_at'
        ]
        read_only_fields = ['id', 'token', 'expires_at', 'invited_by', 'created_at']
    
    def get_is_expired(self, obj):
        """Retorna si la invitación ha expirado"""
        from django.utils import timezone
        return timezone.now() > obj.expires_at
