"""
M4 — Serializers para League Standings
Optimizados para minimal queryset overhead y clarity
"""
from rest_framework import serializers
from django.core.cache import cache

from .models import LeagueStandings
from leagues_app.models import LeagueMember
from django.contrib.auth.models import User


class MemberDetailSerializer(serializers.Serializer):
    """Nested serializer for member details (read-only from User)."""
    user_id = serializers.IntegerField()
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()


class LeagueStandingsSerializer(serializers.ModelSerializer):
    """
    Primary serializer for league standings.
    
    Optimizations:
    - Only essential fields
    - Computed properties for deltas
    - Cache-aware
    """
    
    # Computed fields
    position_delta = serializers.SerializerMethodField()
    accuracy_level = serializers.CharField(read_only=True)
    hit_rate = serializers.SerializerMethodField()
    
    class Meta:
        model = LeagueStandings
        fields = [
            'league_member_id',
            'league_id',
            'user_id',
            'team_name',
            'total_points',
            'rank',
            'position_delta',
            'scored_predictions',
            'total_predictions',
            'correct_predictions',
            'exact_score_percentage',
            'accuracy_level',
            'hit_rate',
            'joined_at',
            'last_updated',
        ]
        read_only_fields = fields  # Everything is read-only (it's a VIEW)
    
    def get_position_delta(self, obj):
        """Calculate and return position change."""
        if obj.previous_rank is None:
            return 0
        return obj.previous_rank - obj.rank
    
    def get_hit_rate(self, obj):
        """Calculate hit rate percentage."""
        if obj.scored_predictions == 0:
            return 0.0
        return round((obj.correct_predictions / obj.scored_predictions) * 100, 2)


class LeagueStandingsDetailSerializer(serializers.ModelSerializer):
    """
    Extended serializer with additional context.
    Used for detailed endpoint views.
    """
    
    position_delta = serializers.SerializerMethodField()
    position_trend = serializers.SerializerMethodField()
    is_rising = serializers.SerializerMethodField()
    is_falling = serializers.SerializerMethodField()
    hit_rate = serializers.SerializerMethodField()
    accuracy_label = serializers.CharField(source='accuracy_level', read_only=True)
    
    # Member info (from FK if available)
    username = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    
    class Meta:
        model = LeagueStandings
        fields = [
            'league_member_id',
            'league_id',
            'user_id',
            'username',
            'email',
            'team_name',
            'total_points',
            'rank',
            'position_delta',
            'position_trend',
            'is_rising',
            'is_falling',
            'scored_predictions',
            'total_predictions',
            'correct_predictions',
            'exact_score_percentage',
            'hit_rate',
            'accuracy_label',
            'joined_at',
            'last_updated',
        ]
        read_only_fields = fields
    
    def get_position_delta(self, obj):
        """Position change (positive = improvement)."""
        if obj.previous_rank is None:
            return 0
        return obj.previous_rank - obj.rank
    
    def get_position_trend(self, obj):
        """Human-readable trend description."""
        delta = self.get_position_delta(obj)
        if delta > 0:
            return f'⬆ +{delta}'
        elif delta < 0:
            return f'⬇ {delta}'
        else:
            return '→ Stable'
    
    def get_is_rising(self, obj):
        """Is rank improving?"""
        delta = self.get_position_delta(obj)
        return delta > 0
    
    def get_is_falling(self, obj):
        """Is rank worsening?"""
        delta = self.get_position_delta(obj)
        return delta < 0
    
    def get_hit_rate(self, obj):
        """Hit rate percentage."""
        if obj.scored_predictions == 0:
            return 0.0
        return round((obj.correct_predictions / obj.scored_predictions) * 100, 2)
    
    def get_username(self, obj):
        """Fetch username from cache or DB."""
        cache_key = f'user_{obj.user_id}_username'
        username = cache.get(cache_key)
        
        if not username:
            try:
                user = User.objects.only('username').get(id=obj.user_id)
                username = user.username
                cache.set(cache_key, username, 3600)  # Cache 1 hour
            except User.DoesNotExist:
                username = 'Unknown'
        
        return username
    
    def get_email(self, obj):
        """Fetch email from cache or DB."""
        cache_key = f'user_{obj.user_id}_email'
        email = cache.get(cache_key)
        
        if not email:
            try:
                user = User.objects.only('email').get(id=obj.user_id)
                email = user.email
                cache.set(cache_key, email, 3600)
            except User.DoesNotExist:
                email = 'unknown@example.com'
        
        return email


class LeagueStandingsListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for list views (less data).
    Optimized for performance when returning many records.
    """
    
    position_delta = serializers.SerializerMethodField()
    hit_rate = serializers.SerializerMethodField()
    
    class Meta:
        model = LeagueStandings
        fields = [
            'league_member_id',
            'league_id',
            'user_id',
            'team_name',
            'total_points',
            'rank',
            'position_delta',
            'scored_predictions',
            'hit_rate',
        ]
        read_only_fields = fields
    
    def get_position_delta(self, obj):
        if obj.previous_rank is None:
            return 0
        return obj.previous_rank - obj.rank
    
    def get_hit_rate(self, obj):
        if obj.scored_predictions == 0:
            return 0.0
        return round((obj.correct_predictions / obj.scored_predictions) * 100, 2)


class LeagueStandingsExportSerializer(serializers.ModelSerializer):
    """
    Complete serializer for exports (CSV, PDF, JSON).
    Includes all available fields.
    """
    
    position_delta = serializers.SerializerMethodField()
    accuracy_level = serializers.CharField(read_only=True)
    hit_rate = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    
    class Meta:
        model = LeagueStandings
        fields = [
            'rank',
            'team_name',
            'username',
            'total_points',
            'scored_predictions',
            'total_predictions',
            'correct_predictions',
            'exact_score_percentage',
            'hit_rate',
            'accuracy_level',
            'position_delta',
            'joined_at',
            'last_updated',
        ]
        read_only_fields = fields
    
    def get_position_delta(self, obj):
        if obj.previous_rank is None:
            return 0
        return obj.previous_rank - obj.rank
    
    def get_hit_rate(self, obj):
        if obj.scored_predictions == 0:
            return 0.0
        return round((obj.correct_predictions / obj.scored_predictions) * 100, 2)
    
    def get_username(self, obj):
        try:
            return User.objects.only('username').get(id=obj.user_id).username
        except User.DoesNotExist:
            return 'Unknown'


class LeagueStandingsRankSerializer(serializers.Serializer):
    """
    Minimal serializer showing just ranking info.
    For ranking badges, leaderboards, etc.
    """
    
    league_member_id = serializers.IntegerField()
    rank = serializers.IntegerField()
    team_name = serializers.CharField(max_length=255)
    total_points = serializers.IntegerField()
    position_delta = serializers.SerializerMethodField()
    
    def get_position_delta(self, obj):
        """Calculate position delta if available."""
        previous_rank = getattr(obj, 'previous_rank', None)
        if previous_rank is None:
            return 0
        return previous_rank - obj.rank
