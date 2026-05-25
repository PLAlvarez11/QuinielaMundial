from datetime import timedelta

from django.utils import timezone
from rest_framework import serializers

from .models import Prediction


class PredictionSerializer(serializers.ModelSerializer):
    """
    Full serializer for Prediction (vaticinio).

    On write: the authenticated user is injected by the view via perform_create.
    On read : match_display and user_name provide human-readable labels.
    """

    match_display = serializers.StringRelatedField(source='match', read_only=True)
    user_name = serializers.StringRelatedField(source='user', read_only=True)

    class Meta:
        model = Prediction
        fields = [
            'id',
            'user',
            'user_name',
            'match',
            'match_display',
            'league',
            'predicted_home_score',
            'predicted_away_score',
            'points',
            'is_scored',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'user',
            'points',
            'is_scored',
            'created_at',
            'updated_at',
        ]

    # ------------------------------------------------------------------
    # Validation
    # ------------------------------------------------------------------

    def _resolve_match(self, data: dict):
        """Return the match from incoming data or the existing instance."""
        return data.get('match') or (self.instance.match if self.instance else None)

    def validate(self, data: dict) -> dict:
        match = self._resolve_match(data)

        if match is None:
            raise serializers.ValidationError({'match': 'This field is required.'})

        # ── 15-minute deadline ───────────────────────────────────────────
        deadline = match.match_date - timedelta(minutes=15)
        if timezone.now() >= deadline:
            raise serializers.ValidationError(
                'Predictions are closed for this match. '
                'The deadline is 15 minutes before kick-off.'
            )

        # ── Match must be open for predictions ──────────────────────────
        if match.status in ('finished', 'cancelled'):
            raise serializers.ValidationError(
                f"Cannot submit a prediction for a match with status '{match.status}'."
            )

        return data


class PredictionScoreboardSerializer(serializers.Serializer):
    """Read-only scoreboard row: aggregated stats for one member in a league."""

    user_id = serializers.UUIDField()
    user_name = serializers.CharField()
    league_id = serializers.IntegerField()
    total_points = serializers.IntegerField()
    prediction_count = serializers.IntegerField()
    exact_score_count = serializers.IntegerField()


class MatchResultInputSerializer(serializers.Serializer):
    """Input for the admin endpoint that records an official match result."""

    home_score = serializers.IntegerField(min_value=0)
    away_score = serializers.IntegerField(min_value=0)
