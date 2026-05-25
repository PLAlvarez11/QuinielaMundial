"""
M4 — Management Command: Score Predictions
Manually score predictions for a match or batch of matches
"""
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from catalogo.models import Match
from tabla_posiciones.services import StandingsService


class Command(BaseCommand):
    help = 'Score predictions for finished matches'
    
    def add_arguments(self, parser):
        parser.add_argument(
            'match_id',
            type=int,
            nargs='?',
            help='Score predictions for a specific match ID'
        )
        
        parser.add_argument(
            '--all',
            action='store_true',
            help='Score all finished matches that haven\'t been scored yet'
        )
        
        parser.add_argument(
            '--league',
            type=int,
            help='Score predictions for all finished matches in a specific league'
        )
        
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be done without making changes'
        )
    
    def handle(self, *args, **options):
        match_id = options.get('match_id')
        all_matches = options.get('all')
        league_id = options.get('league')
        dry_run = options.get('dry_run')
        
        # Determine which matches to process
        if match_id:
            try:
                match = Match.objects.get(id=match_id)
                if match.status != 'finished':
                    raise CommandError(f'Match {match_id} is not finished')
                matches = [match]
            except Match.DoesNotExist:
                raise CommandError(f'Match {match_id} not found')
        
        elif all_matches:
            matches = Match.objects.filter(
                status='finished',
                id__in=Match.objects.filter(
                    predictions__is_scored=False
                ).distinct()
            )
        
        elif league_id:
            # Get all finished matches in matches related to league
            from leagues_app.models import League
            try:
                league = League.objects.get(id=league_id)
            except League.DoesNotExist:
                raise CommandError(f'League {league_id} not found')
            
            matches = Match.objects.filter(
                status='finished',
                id__in=Match.objects.filter(
                    predictions__league_id=league_id,
                    predictions__is_scored=False
                ).distinct()
            )
        
        else:
            raise CommandError('Provide match_id, --all, or --league')
        
        if not matches.exists():
            self.stdout.write(
                self.style.WARNING('No matches to process')
            )
            return
        
        self.stdout.write(
            f'Found {matches.count()} matches to process'
        )
        
        if dry_run:
            self.stdout.write(
                self.style.WARNING('DRY RUN — No changes will be made')
            )
        
        # Process matches
        total_predictions_scored = 0
        total_members_updated = 0
        
        with transaction.atomic():
            for match in matches:
                self.stdout.write(
                    f'Processing: {match.home_team} vs {match.away_team} '
                    f'({match.home_score}-{match.away_score})'
                )
                
                if not dry_run:
                    result = StandingsService.process_finished_match(match)
                    total_predictions_scored += result['predictions_scored']
                    total_members_updated += result['members_updated']
                    
                    self.stdout.write(
                        self.style.SUCCESS(
                            f'  ✓ {result["predictions_scored"]} predictions scored, '
                            f'{result["members_updated"]} members updated'
                        )
                    )
                else:
                    # Just count in dry run
                    from prediction_engine.models import Prediction
                    pred_count = Prediction.objects.filter(
                        match=match,
                        is_scored=False
                    ).count()
                    total_predictions_scored += pred_count
                    self.stdout.write(
                        f'  [DRY] Would score {pred_count} predictions'
                    )
        
        if not dry_run:
            self.stdout.write(
                self.style.SUCCESS(
                    f'\n✓ Complete: {total_predictions_scored} predictions scored, '
                    f'{total_members_updated} members updated'
                )
            )
        else:
            self.stdout.write(
                self.style.WARNING(
                    f'\n[DRY RUN] Would score {total_predictions_scored} predictions'
                )
            )
