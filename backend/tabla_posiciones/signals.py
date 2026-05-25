"""
M4 — Django Signals para automatizar recalculation de standings
Triggers cuando Match o Prediction cambian
"""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from django.db import transaction

from catalogo.models import Match
from prediction_engine.models import Prediction
from leagues_app.models import LeagueMember

from .services import ScoringService, StandingsService


@receiver(post_save, sender=Match)
def on_match_finished(sender, instance: Match, created, update_fields, **kwargs):
    """
    Trigger when a Match is marked as finished.
    
    Automatically scores all predictions and updates member points.
    
    Fired when:
    - Match.status changes to 'finished'
    - Match.home_score or away_score is updated
    
    Performance:
    - Uses transaction for atomicity
    - Batch updates member points
    - Clears relevant caches
    """
    
    # Check if this is a status change to 'finished' OR score was updated
    if instance.status != 'finished':
        return
    
    # Check if scores are set
    if instance.home_score is None or instance.away_score is None:
        return
    
    # Only process if this is an update (not creation)
    if created:
        return
    
    # Check if scores were actually modified
    if update_fields and not any(
        field in update_fields for field in ['home_score', 'away_score', 'status']
    ):
        return
    
    print(f"[SIGNAL] Processing finished match: {instance.id}")
    
    try:
        result = StandingsService.process_finished_match(instance)
        print(f"[SIGNAL] Match {instance.id} processed: {result['predictions_scored']} predictions scored")
    except Exception as e:
        print(f"[ERROR] Failed to process match {instance.id}: {str(e)}")
        # Log to proper logger in production
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error processing finished match {instance.id}", exc_info=e)


@receiver(post_save, sender=Prediction)
def on_prediction_scored(sender, instance: Prediction, created, update_fields, **kwargs):
    """
    Trigger when a Prediction is scored.
    
    Updates the member's total_points if points were assigned.
    
    Fired when:
    - Prediction.is_scored changes to True
    - Prediction.points is updated
    """
    
    # Only process if this is an update
    if created:
        return
    
    # Check if points or is_scored was updated
    if update_fields and not any(
        field in update_fields for field in ['points', 'is_scored']
    ):
        return
    
    # Only process if prediction is now scored
    if not instance.is_scored or instance.points is None:
        return
    
    print(f"[SIGNAL] Prediction scored: user={instance.user_id}, match={instance.match_id}, points={instance.points}")
    
    try:
        # Get the league member
        league_member = LeagueMember.objects.get(
            user=instance.user,
            league=instance.league
        )
        
        # Recalculate points
        total = ScoringService.recalculate_member_points(league_member)
        
        print(f"[SIGNAL] Member {league_member.id} total points updated to {total}")
    except LeagueMember.DoesNotExist:
        print(f"[WARNING] LeagueMember not found for user={instance.user_id}, league={instance.league_id}")


@receiver(post_delete, sender=Prediction)
def on_prediction_deleted(sender, instance: Prediction, **kwargs):
    """
    Trigger when a Prediction is deleted.
    
    Recalculates member's total_points (removes deleted prediction's points).
    
    Typically shouldn't happen in production, but good for data integrity.
    """
    
    print(f"[SIGNAL] Prediction deleted: user={instance.user_id}, match={instance.match_id}")
    
    try:
        league_member = LeagueMember.objects.get(
            user=instance.user,
            league=instance.league
        )
        
        # Recalculate points
        total = ScoringService.recalculate_member_points(league_member)
        
        print(f"[SIGNAL] Member {league_member.id} total points recalculated to {total}")
    except LeagueMember.DoesNotExist:
        pass


@receiver(post_save, sender=LeagueMember)
def on_league_member_joined(sender, instance: LeagueMember, created, **kwargs):
    """
    Trigger when a LeagueMember joins or is updated.
    
    Clears league standings cache to reflect new member.
    """
    
    if created:
        print(f"[SIGNAL] New member joined league: user={instance.user_id}, league={instance.league_id}")
        
        # Clear league standings cache
        cache.delete(f'league_standings_{instance.league_id}')
        cache.delete(f'league_stats_{instance.league_id}')


@receiver(post_delete, sender=LeagueMember)
def on_league_member_left(sender, instance: LeagueMember, **kwargs):
    """
    Trigger when a LeagueMember leaves or is deleted.
    
    Clears league standings cache.
    """
    
    print(f"[SIGNAL] Member left league: user={instance.user_id}, league={instance.league_id}")
    
    cache.delete(f'league_standings_{instance.league_id}')
    cache.delete(f'league_stats_{instance.league_id}')


def connect_signals():
    """
    Explicitly connect all signals.
    Call this in apps.py if needed.
    """
    print("[SIGNALS] Connected tabla_posiciones signals")
