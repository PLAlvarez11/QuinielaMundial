from django.db.models import Count, Q
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from catalogo.models import Match
from leagues_app.models import LeagueMember

from .models import Prediction
from .serializers import (
    MatchResultInputSerializer,
    PredictionScoreboardSerializer,
    PredictionSerializer,
)
from .services import score_predictions_for_match


class PredictionViewSet(viewsets.ModelViewSet):
    """
    CRUD endpoints for predictions (vaticinios).

    - Authenticated users can only read/write their own predictions.
    - Admins can list all predictions.
    - PATCH is supported for updating an existing prediction (deadline enforced).
    - DELETE removes the prediction (deadline is also enforced here).

    Filters (query params):
      ?match=<id>    — predictions for a specific match
      ?league=<id>   — predictions within a specific league
    """

    serializer_class = PredictionSerializer
    permission_classes = [IsAuthenticated]
    # Disallow PUT (full replace) — use PATCH for partial updates
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

    # ------------------------------------------------------------------
    # Queryset
    # ------------------------------------------------------------------

    def get_queryset(self):
        qs = Prediction.objects.select_related('user', 'match', 'league')

        if not self.request.user.is_admin:
            qs = qs.filter(user=self.request.user)

        match_id = self.request.query_params.get('match')
        league_id = self.request.query_params.get('league')

        if match_id:
            qs = qs.filter(match_id=match_id)
        if league_id:
            qs = qs.filter(league_id=league_id)

        return qs

    # ------------------------------------------------------------------
    # Writes
    # ------------------------------------------------------------------

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        """
        Enforce the 15-minute deadline on DELETE as well.
        The serializer validate() only runs on create/update, not delete.
        """
        from datetime import timedelta
        from django.utils import timezone

        prediction = self.get_object()
        deadline = prediction.match.match_date - timedelta(minutes=15)

        if timezone.now() >= deadline:
            return Response(
                {'detail': 'Cannot delete a prediction after the deadline.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return super().destroy(request, *args, **kwargs)

    # ------------------------------------------------------------------
    # Extra actions
    # ------------------------------------------------------------------

    @action(detail=False, methods=['get'], url_path='scoreboard')
    def scoreboard(self, request):
        """
        GET /api/predictions/scoreboard/?league=<id>

        Returns an ordered leaderboard (highest points first) for all active
        members of the specified league.
        """
        league_id = request.query_params.get('league')
        if not league_id:
            return Response(
                {'detail': "Query param '?league=' is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        members = (
            LeagueMember.objects
            .filter(league_id=league_id, status='active')
            .select_related('user')
        )

        data = []
        for member in members:
            stats = Prediction.objects.filter(
                user=member.user,
                league_id=league_id,
                is_scored=True,
            ).aggregate(
                prediction_count=Count('id'),
                exact_score_count=Count('id', filter=Q(points=3)),
            )
            data.append({
                'user_id': str(member.user.id),
                'user_name': member.user.name,
                'league_id': int(league_id),
                'total_points': member.total_points,
                'prediction_count': stats['prediction_count'],
                'exact_score_count': stats['exact_score_count'],
            })

        data.sort(key=lambda row: row['total_points'], reverse=True)
        serializer = PredictionScoreboardSerializer(data, many=True)
        return Response(serializer.data)


class MatchResultView(APIView):
    """
    POST /api/predictions/results/<match_id>/score/

    Admin-only endpoint that:
      1. Records the official home/away score on the Match record.
      2. Marks the match as 'finished'.
      3. Scores all unscored predictions for that match.
      4. Returns a summary of how many predictions were scored.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, match_id: int):
        if not request.user.is_admin:
            return Response(
                {'detail': 'Only administrators can record match results.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        match = get_object_or_404(Match, pk=match_id)

        if match.status == 'cancelled':
            return Response(
                {'detail': 'Cannot score a cancelled match.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = MatchResultInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        validated = serializer.validated_data
        match.home_score = validated['home_score']
        match.away_score = validated['away_score']
        match.status = 'finished'
        match.save(update_fields=['home_score', 'away_score', 'status', 'updated_at'])

        scored_count = score_predictions_for_match(match)

        return Response(
            {
                'detail': f'Result recorded. {scored_count} prediction(s) scored.',
                'match_id': match.id,
                'home_score': match.home_score,
                'away_score': match.away_score,
                'predictions_scored': scored_count,
            },
            status=status.HTTP_200_OK,
        )
