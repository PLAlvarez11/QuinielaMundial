"""
M4 — Management Command: Recalculate Points
Force recalculation of member points (useful for data fixes)
"""
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from leagues_app.models import League, LeagueMember
from tabla_posiciones.services import ScoringService


class Command(BaseCommand):
    help = 'Recalculate total_points for league members'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--league-id',
            type=int,
            required=True,
            help='League ID to recalculate points for'
        )
        
        parser.add_argument(
            '--user-id',
            type=int,
            help='Only recalculate for specific user (optional)'
        )
        
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be done without making changes'
        )
    
    def handle(self, *args, **options):
        league_id = options['league_id']
        user_id = options.get('user_id')
        dry_run = options.get('dry_run')
        
        # Get league
        try:
            league = League.objects.get(id=league_id)
        except League.DoesNotExist:
            raise CommandError(f'League {league_id} not found')
        
        self.stdout.write(f'League: {league.name}\n')
        
        # Get members
        members = LeagueMember.objects.filter(
            league=league,
            status='active'
        )
        
        if user_id:
            members = members.filter(user_id=user_id)
        
        if not members.exists():
            raise CommandError('No members found')
        
        self.stdout.write(f'Found {members.count()} members\n')
        
        if dry_run:
            self.stdout.write(self.style.WARNING('DRY RUN — No changes will be made\n'))
        
        # Recalculate points for each member
        with transaction.atomic():
            for member in members:
                old_points = member.total_points
                
                if not dry_run:
                    new_points = ScoringService.recalculate_member_points(member)
                else:
                    # Calculate without saving
                    from django.db.models import Sum
                    from prediction_engine.models import Prediction
                    
                    new_points = Prediction.objects.filter(
                        user=member.user,
                        league=member.league,
                        is_scored=True
                    ).aggregate(
                        total=Sum('points', default=0)
                    )['total']
                
                change = new_points - old_points
                
                if change == 0:
                    status = '→'
                elif change > 0:
                    status = self.style.SUCCESS(f'↑ (+{change})')
                else:
                    status = self.style.WARNING(f'↓ ({change})')
                
                self.stdout.write(
                    f'{member.team_name:30} {old_points:4} → {new_points:4} {status}'
                )
        
        if not dry_run:
            self.stdout.write(self.style.SUCCESS('\n✓ Recalculation complete'))
        else:
            self.stdout.write(self.style.WARNING('\n[DRY RUN] No changes made'))
