"""
M4 — Prediction Engine (Vaticinios)
App: prediction_engine

Tables:
  - predictions → Prediction
"""
from django.db import models
from django.conf import settings

from catalogo.models import Match
from leagues_app.models import League


class Prediction(models.Model):
    """
    A user's prediction (vaticinio) for a specific match within a league.

    Scoring rules (applied once the match is finished):
      - 3 points: exact score match
      - 1 point : correct outcome (home win / away win / draw)
      - 0 points: incorrect

    Deadline: predictions lock 15 minutes before match kick-off.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='predictions',
    )
    match = models.ForeignKey(
        Match,
        on_delete=models.CASCADE,
        related_name='predictions',
    )
    league = models.ForeignKey(
        League,
        on_delete=models.CASCADE,
        related_name='predictions',
    )

    predicted_home_score = models.PositiveIntegerField()
    predicted_away_score = models.PositiveIntegerField()

    # Populated once the official result is entered and scoring runs
    points = models.PositiveIntegerField(null=True, blank=True)
    is_scored = models.BooleanField(default=False, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'predictions'
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'match', 'league'],
                name='unique_prediction_per_user_match_league',
            )
        ]
        indexes = [
            models.Index(fields=['user', 'league']),
            models.Index(fields=['match', 'is_scored']),
        ]

    def __str__(self) -> str:
        return (
            f"{self.user} → {self.match}: "
            f"{self.predicted_home_score}-{self.predicted_away_score}"
        )
