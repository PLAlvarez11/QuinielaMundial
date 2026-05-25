"""
M4 — League Standings Services
Lógica de scoring, actualización de puntos y cálculo de rankings
"""
from decimal import Decimal
from typing import Optional, Tuple, Dict, List
from django.db import transaction
from django.core.cache import cache
from django.db.models import Sum, F, Count

from leagues_app.models import LeagueMember
from prediction_engine.models import Prediction
from catalogo.models import Match


class ScoringService:
    """
    Servicio central para cálculo de puntos según reglas de negocio.
    
    Reglas:
    - 3 puntos: Marcador exacto
    - 1 punto:  Resultado correcto (victoria/derrota/empate)
    - 0 puntos: Incorrecto
    """
    
    @staticmethod
    def calculate_prediction_points(
        prediction: Prediction,
        match: Match
    ) -> Optional[int]:
        """
        Calcula los puntos de una predicción individual.
        
        Args:
            prediction: Prediction object
            match: Match object con resultados oficiales
        
        Returns:
            3 — Marcador exacto
            1 — Resultado correcto, marcador incorrecto
            0 — Incorrecto
            None — Match sin resultado aún
        
        Raises:
            ValueError: Si los parámetros son inválidos
        """
        
        # Validate inputs
        if not prediction or not match:
            raise ValueError("prediction and match are required")
        
        # Check if match has results
        if match.home_score is None or match.away_score is None:
            return None  # Match not yet finished
        
        pred_home = prediction.predicted_home_score
        pred_away = prediction.predicted_away_score
        actual_home = match.home_score
        actual_away = match.away_score
        
        # Rule 1: Exact score = 3 points
        if pred_home == actual_home and pred_away == actual_away:
            return 3
        
        # Rule 2: Correct outcome = 1 point
        pred_outcome = ScoringService._get_outcome(pred_home, pred_away)
        actual_outcome = ScoringService._get_outcome(actual_home, actual_away)
        
        if pred_outcome == actual_outcome:
            return 1
        
        # Rule 3: Incorrect = 0 points
        return 0
    
    @staticmethod
    def _get_outcome(home: int, away: int) -> str:
        """
        Determine match outcome.
        
        Returns: 'home', 'away', or 'draw'
        """
        if home > away:
            return 'home'
        elif away > home:
            return 'away'
        else:
            return 'draw'
    
    @staticmethod
    def score_predictions_for_match(match: Match) -> Dict[str, int]:
        """
        Score all predictions for a finished match.
        Updates prediction.points and prediction.is_scored.
        
        Args:
            match: Match object (must have home_score, away_score set)
        
        Returns:
            {
                'scored_count': int,        # Number of predictions scored
                'points_distributed': int, # Total points given
                'exact_scores': int,       # Predictions with 3 points
                'correct_outcomes': int,   # Predictions with 1 point
                'incorrect': int           # Predictions with 0 points
            }
        
        Raises:
            ValueError: If match has no results
        """
        
        if match.home_score is None or match.away_score is None:
            raise ValueError(f"Match {match.id} has no results yet")
        
        predictions = Prediction.objects.filter(match=match, is_scored=False)
        
        stats = {
            'scored_count': 0,
            'points_distributed': 0,
            'exact_scores': 0,
            'correct_outcomes': 0,
            'incorrect': 0,
        }
        
        with transaction.atomic():
            for prediction in predictions.select_for_update():
                points = ScoringService.calculate_prediction_points(prediction, match)
                
                if points is not None:
                    prediction.points = points
                    prediction.is_scored = True
                    prediction.save(update_fields=['points', 'is_scored', 'updated_at'])
                    
                    # Update stats
                    stats['scored_count'] += 1
                    stats['points_distributed'] += points
                    
                    if points == 3:
                        stats['exact_scores'] += 1
                    elif points == 1:
                        stats['correct_outcomes'] += 1
                    else:
                        stats['incorrect'] += 1
        
        return stats
    
    @staticmethod
    def recalculate_member_points(league_member: LeagueMember) -> int:
        """
        Recalculate total_points for a league member.
        
        Sums all points from scored predictions in that league.
        
        Args:
            league_member: LeagueMember object
        
        Returns:
            int: Updated total_points
        
        Side Effect:
            - Updates league_member.total_points
            - Clears relevant cache entries
        """
        
        total = Prediction.objects.filter(
            user=league_member.user,
            league=league_member.league,
            is_scored=True
        ).aggregate(
            total=Sum('points', default=0)
        )['total']
        
        league_member.total_points = total or 0
        league_member.save(update_fields=['total_points'])
        
        # Invalidate cache
        cache.delete(f'user_standing_{league_member.user_id}_{league_member.league_id}')
        cache.delete(f'league_standings_{league_member.league_id}')
        
        return league_member.total_points
    
    @staticmethod
    def recalculate_all_league_members(league_id: int) -> int:
        """
        Recalculate total_points for all members in a league.
        
        Useful after bulk scoring or data fixes.
        
        Args:
            league_id: League ID
        
        Returns:
            int: Number of members recalculated
        """
        
        members = LeagueMember.objects.filter(
            league_id=league_id,
            status='active'
        )
        
        count = 0
        with transaction.atomic():
            for member in members:
                ScoringService.recalculate_member_points(member)
                count += 1
        
        # Clear league cache
        cache.delete(f'league_standings_{league_id}')
        cache.delete(f'league_stats_{league_id}')
        
        return count


class RankingService:
    """
    Servicio para cálculo y gestión de rankings.
    Maneja DENSE_RANK, empates, y variación de posiciones.
    """
    
    @staticmethod
    def get_current_ranking(league_id: int) -> List[Dict]:
        """
        Get current ranking for a league.
        
        Returns list of standings ordered by rank.
        
        Args:
            league_id: League ID
        
        Returns:
            List of standing dicts with rank and delta info
        """
        
        from .models import LeagueStandings
        
        standings = LeagueStandings.objects.filter(
            league_id=league_id
        ).values(
            'league_member_id',
            'user_id',
            'team_name',
            'total_points',
            'rank',
            'previous_rank',
        ).order_by('rank')
        
        result = []
        for standing in standings:
            delta = 0
            if standing['previous_rank']:
                delta = standing['previous_rank'] - standing['rank']
            
            standing['position_delta'] = delta
            result.append(standing)
        
        return result
    
    @staticmethod
    def get_user_rank_in_league(user_id: int, league_id: int) -> Optional[Dict]:
        """
        Get a user's current rank in a league.
        
        Args:
            user_id: User ID
            league_id: League ID
        
        Returns:
            Standing dict with rank and delta, or None if not in league
        """
        
        from .models import LeagueStandings
        
        try:
            standing = LeagueStandings.objects.get(
                user_id=user_id,
                league_id=league_id
            )
            
            return {
                'rank': standing.rank,
                'position_delta': standing.previous_rank - standing.rank if standing.previous_rank else 0,
                'total_points': standing.total_points,
                'team_name': standing.team_name,
            }
        except LeagueStandings.DoesNotExist:
            return None
    
    @staticmethod
    def handle_ties(league_id: int) -> Tuple[int, int]:
        """
        Process tie-breaking rules for a league.
        
        Tie-breakers (in order):
        1. Total points (DESC)
        2. Exact score count (DESC)
        3. Earliest join date (ASC)
        
        This is handled by the SQL VIEW using DENSE_RANK().
        This method validates the tie-breaking logic.
        
        Args:
            league_id: League ID
        
        Returns:
            Tuple (total_members, members_with_ties)
        """
        
        from .models import LeagueStandings
        
        standings = LeagueStandings.objects.filter(
            league_id=league_id
        ).order_by('rank', '-total_points')
        
        total = standings.count()
        
        # Find tied members (same points and exact scores)
        tied_count = 0
        prev_points = None
        
        for standing in standings:
            if standing.total_points == prev_points:
                tied_count += 1
            prev_points = standing.total_points
        
        return (total, tied_count)
    
    @staticmethod
    def get_competitors(
        league_member_id: int,
        league_id: int,
        radius: int = 5
    ) -> Dict:
        """
        Get competitive neighbors (ranked nearby).
        
        Args:
            league_member_id: LeagueMember ID
            league_id: League ID
            radius: How many ranks above/below to include
        
        Returns:
            Dict with current user and competitors
        """
        
        from .models import LeagueStandings
        
        try:
            user_standing = LeagueStandings.objects.get(
                id=league_member_id,
                league_id=league_id
            )
        except LeagueStandings.DoesNotExist:
            return {}
        
        min_rank = max(user_standing.rank - radius, 1)
        max_rank = user_standing.rank + radius
        
        competitors = LeagueStandings.objects.filter(
            league_id=league_id,
            rank__gte=min_rank,
            rank__lte=max_rank
        ).order_by('rank').values(
            'id',
            'rank',
            'team_name',
            'total_points',
            'user_id'
        )
        
        return {
            'current': {
                'rank': user_standing.rank,
                'team_name': user_standing.team_name,
                'total_points': user_standing.total_points,
            },
            'competitors': list(competitors),
            'total_in_league': LeagueStandings.objects.filter(
                league_id=league_id
            ).count(),
        }


class StandingsService:
    """
    Facade service combining scoring and ranking logic.
    High-level operations for standings management.
    """
    
    @staticmethod
    def process_finished_match(match: Match) -> Dict:
        """
        Process a finished match end-to-end.
        
        Steps:
        1. Score all predictions
        2. Update all member points
        3. Clear cache
        
        Args:
            match: Match object with home_score and away_score
        
        Returns:
            Dict with processing results
        
        Raises:
            ValueError: If match has no results
        """
        
        # Step 1: Score predictions
        scoring_result = ScoringService.score_predictions_for_match(match)
        
        # Step 2: Get all affected members
        affected_users = Prediction.objects.filter(
            match=match,
            is_scored=True
        ).values_list('user_id', 'league_id').distinct()
        
        members_updated = 0
        with transaction.atomic():
            for user_id, league_id in affected_users:
                try:
                    member = LeagueMember.objects.select_for_update().get(
                        user_id=user_id,
                        league_id=league_id
                    )
                    ScoringService.recalculate_member_points(member)
                    members_updated += 1
                except LeagueMember.DoesNotExist:
                    pass
        
        # Step 3: Clear caches
        affected_leagues = set(l for _, l in affected_users)
        for league_id in affected_leagues:
            cache.delete(f'league_standings_{league_id}')
            cache.delete(f'league_stats_{league_id}')
        
        return {
            'match_id': match.id,
            'predictions_scored': scoring_result['scored_count'],
            'members_updated': members_updated,
            'stats': scoring_result,
        }
    
    @staticmethod
    def get_league_statistics(league_id: int) -> Dict:
        """
        Get comprehensive statistics for a league.
        
        Args:
            league_id: League ID
        
        Returns:
            Dict with league stats
        """
        
        from .models import LeagueStandings
        
        cache_key = f'league_stats_{league_id}'
        cached = cache.get(cache_key)
        if cached:
            return cached
        
        standings = LeagueStandings.objects.filter(league_id=league_id)
        
        stats = standings.aggregate(
            total_members=Count('league_member_id'),
            avg_points=Round(Avg('total_points')),
            median_points=Percentile('total_points', 0.5),
            max_points=Max('total_points'),
            min_points=Min('total_points'),
            std_dev=StdDev('total_points'),
            top_scorer_points=Max('total_points'),
            total_predictions_scored=Sum('scored_predictions'),
            avg_accuracy=Round(Avg('exact_score_percentage'), 2),
        ) if standings.exists() else {}
        
        result = {
            'league_id': league_id,
            'stats': stats,
        }
        
        cache.set(cache_key, result, 600)  # Cache 10 minutes
        return result


# Import aggregates
from django.db.models import Avg, Max, Min, StdDev, Round, F
from django.db.models.functions import Percentile
