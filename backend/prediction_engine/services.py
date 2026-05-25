"""
Prediction scoring service.

Public API:
  calculate_points(prediction, match) -> int | None
  score_predictions_for_match(match)  -> int   (count of predictions scored)
"""
from __future__ import annotations

from django.db.models import F

from leagues_app.models import LeagueMember


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _get_outcome(home: int, away: int) -> str:
    """Return 'home', 'away', or 'draw' based on goal totals."""
    if home > away:
        return 'home'
    if away > home:
        return 'away'
    return 'draw'


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def calculate_points(prediction, match) -> int | None:
    """
    Calculate points earned by a single prediction against the official result.

    Returns:
      3    — exact score (home AND away goals match perfectly)
      1    — correct outcome (winner / draw), wrong goal count
      0    — completely wrong
      None — match result not yet available
    """
    if match.home_score is None or match.away_score is None:
        return None

    # Exact score: 3 points
    if (
        prediction.predicted_home_score == match.home_score
        and prediction.predicted_away_score == match.away_score
    ):
        return 3

    # Correct outcome: 1 point
    predicted_outcome = _get_outcome(
        prediction.predicted_home_score,
        prediction.predicted_away_score,
    )
    real_outcome = _get_outcome(match.home_score, match.away_score)

    return 1 if predicted_outcome == real_outcome else 0


def score_predictions_for_match(match) -> int:
    """
    Score all unscored predictions for a finished match.

    Only processes predictions where ``is_scored=False`` so re-running this
    function (e.g. if the result view is called twice) does NOT double-count.

    Side effects:
      - Sets ``Prediction.points`` and ``Prediction.is_scored = True``
      - Increments ``LeagueMember.total_points`` for each scored prediction

    Returns:
      Number of predictions that were scored in this call.
    """
    # Local import avoids circular dependency (services <- models <- services)
    from .models import Prediction

    unscored_qs = Prediction.objects.filter(match=match, is_scored=False)
    scored_count = 0

    for prediction in unscored_qs:
        points = calculate_points(prediction, match)
        if points is None:
            # Match result not yet set — skip
            continue

        prediction.points = points
        prediction.is_scored = True
        prediction.save(update_fields=['points', 'is_scored', 'updated_at'])

        # Increment the running total only when points > 0 to avoid
        # unnecessary DB writes for 0-point predictions
        if points > 0:
            LeagueMember.objects.filter(
                league=prediction.league,
                user=prediction.user,
            ).update(total_points=F('total_points') + points)

        scored_count += 1

    return scored_count
