"""
M4 — Liga Standings (Tabla de Posiciones)
App: tabla_posiciones

Models:
  - LeagueStandings → VIEW SQL (read-only)
"""
from django.db import models
from django.conf import settings
from django.db.models import F, Q, QuerySet
from django.core.cache import cache

from leagues_app.models import League, LeagueMember
from prediction_engine.models import Prediction


class LeagueStandingsQuerySet(QuerySet):
    """Optimized QuerySet for league standings with common optimizations."""
    
    def by_league(self, league_id: int):
        """Filter standings by league."""
        return self.filter(league_id=league_id)
    
    def with_rank(self, rank: int = None):
        """Filter standings by specific rank."""
        if rank:
            return self.filter(rank=rank)
        return self
    
    def top_n(self, n: int = 10):
        """Get top N performers."""
        return self.order_by('rank')[:n]
    
    def user_in_league(self, user_id: int, league_id: int):
        """Get a specific user's standings in a league."""
        return self.filter(user_id=user_id, league_id=league_id).first()
    
    def with_deltas(self):
        """Include position delta (change from previous rank)."""
        return self.annotate(
            position_delta=F('previous_rank') - F('rank')
        )


class LeagueStandingsManager(models.Manager):
    """Custom manager for LeagueStandings with helper methods."""
    
    def get_queryset(self):
        """Return optimized queryset."""
        return LeagueStandingsQuerySet(self.model, using=self._db)
    
    def by_league(self, league_id: int):
        """Get standings for specific league."""
        return self.get_queryset().by_league(league_id)
    
    def top_n(self, league_id: int, n: int = 10):
        """Get top N performers in a league."""
        return self.get_queryset().filter(league_id=league_id).order_by('rank')[:n]
    
    def user_standing(self, user_id: int, league_id: int):
        """Get specific user's standing."""
        cache_key = f'user_standing_{user_id}_{league_id}'
        cached = cache.get(cache_key)
        if cached:
            return cached
        
        standing = self.get_queryset().filter(
            user_id=user_id,
            league_id=league_id
        ).first()
        
        if standing:
            cache.set(cache_key, standing, 300)  # Cache for 5 minutes
        return standing


class LeagueStandings(models.Model):
    """
    Read-only view of league standings calculated from predictions and match results.
    
    This model maps to a PostgreSQL VIEW that aggregates:
    - User predictions per league
    - Points awarded (3 for exact, 1 for correct outcome)
    - Ranking with tie-breaking (DENSE_RANK)
    - Performance metrics (accuracy, hit rate)
    
    ** IMPORTANT: This is a view. Do NOT save to this model. **
    """
    
    # League & Member Info
    league_id = models.IntegerField(db_index=True)
    league_member_id = models.IntegerField(primary_key=True)
    user_id = models.IntegerField(db_index=True)
    team_name = models.CharField(max_length=255)
    
    # Scoring
    total_points = models.IntegerField(default=0, db_index=True)
    scored_predictions = models.IntegerField(default=0)
    total_predictions = models.IntegerField(default=0)
    
    # Accuracy Metrics
    exact_score_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        help_text="Percentage of exact score predictions"
    )
    correct_predictions = models.IntegerField(default=0)
    
    # Ranking
    rank = models.IntegerField(db_index=True)
    previous_rank = models.IntegerField(null=True, blank=True)
    
    # Timestamps
    joined_at = models.DateTimeField(auto_now_add=False)
    last_updated = models.DateTimeField(auto_now=False)
    view_timestamp = models.DateTimeField(auto_now=False)
    
    # Custom manager
    objects = LeagueStandingsManager()
    
    class Meta:
        managed = False  # ⚠️ This is a PostgreSQL VIEW, not a table
        db_table = 'league_standings'
        verbose_name = 'League Standing'
        verbose_name_plural = 'League Standings'
        permissions = [
            ('view_league_standings', 'Can view league standings'),
            ('export_league_standings', 'Can export league standings'),
        ]
        indexes = [
            models.Index(fields=['league_id', 'rank']),
            models.Index(fields=['user_id', 'league_id']),
            models.Index(fields=['total_points', '-rank']),
        ]
    
    def __str__(self) -> str:
        return f"{self.team_name} (Liga #{self.league_id}) - Rank: {self.rank}"
    
    @property
    def position_delta(self) -> int:
        """Calculate position change."""
        if self.previous_rank is None:
            return 0
        return self.previous_rank - self.rank
    
    @property
    def is_rising(self) -> bool:
        """Check if rank improved (decreased number)."""
        return self.position_delta > 0
    
    @property
    def is_falling(self) -> bool:
        """Check if rank worsened (increased number)."""
        return self.position_delta < 0
    
    @property
    def hit_rate(self) -> float:
        """Calculate hit rate percentage."""
        if self.scored_predictions == 0:
            return 0.0
        return round((self.correct_predictions / self.scored_predictions) * 100, 2)
    
    @property
    def accuracy_level(self) -> str:
        """Classify accuracy level."""
        rate = self.hit_rate
        if rate >= 80:
            return 'EXCELLENT'
        elif rate >= 60:
            return 'GOOD'
        elif rate >= 40:
            return 'FAIR'
        else:
            return 'POOR'
    
    def can_delete(self) -> bool:
        """Views cannot be deleted."""
        return False
    
    def can_edit(self) -> bool:
        """Views are read-only."""
        return False
    
    class SaveMixin:
        """Prevent saves to this view."""
        def save(self, *args, **kwargs):
            raise ValueError(
                "LeagueStandings is a VIEW and cannot be modified directly. "
                "Update predictions or matches instead."
            )
        
        def delete(self, *args, **kwargs):
            raise ValueError(
                "LeagueStandings is a VIEW and cannot be deleted directly. "
                "Delete predictions or matches instead."
            )


