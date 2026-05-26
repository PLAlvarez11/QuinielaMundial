"""
M4 — Management Command: Generate Test Data
Create sample matches, predictions, and scores for testing
"""
from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
import random

from catalogo.models import Match, Country, TournamentStage, Stadium, Venue
from leagues_app.models import League, LeagueMember
from prediction_engine.models import Prediction
from tabla_posiciones.services import StandingsService

User = get_user_model()


class Command(BaseCommand):
    help = 'Generate sample data for testing standings functionality'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--league-id',
            type=int,
            help='Use existing league ID (default: create new league)'
        )
        
        parser.add_argument(
            '--matches',
            type=int,
            default=5,
            help='Number of matches to create (default: 5)'
        )
        
        parser.add_argument(
            '--users',
            type=int,
            default=10,
            help='Number of users to create (default: 10)'
        )
        
        parser.add_argument(
            '--score',
            action='store_true',
            help='Score the matches after creation'
        )
    
    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('=== League Standings Test Data Generator ===\n'))
        
        league_id = options['league_id']
        num_matches = options['matches']
        num_users = options['users']
        do_score = options['score']
        
        # Get or create league
        if league_id:
            try:
                league = League.objects.get(id=league_id)
                self.stdout.write(f'Using existing league: {league.name} (ID: {league.id})')
            except League.DoesNotExist:
                raise CommandError(f'League {league_id} not found')
        else:
            # Create new league
            owner = User.objects.first()
            if not owner:
                raise CommandError('No users in database. Create a superuser first.')
            
            league = League.objects.create(
                name='Test League M4',
                description='Test league for standings functionality',
                type='public',
                entry_fee=0.00,
                owner=owner,
                status='active',
                max_members=100
            )
            self.stdout.write(
                self.style.SUCCESS(f'✓ Created league: {league.name} (ID: {league.id})')
            )
        
        # Create or get users
        users = []
        for i in range(num_users):
            username = f'test_user_{i+1}'
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': f'{username}@test.local',
                    'first_name': f'Test{i+1}',
                    'last_name': 'User'
                }
            )
            users.append(user)
            if created:
                self.stdout.write(f'  Created user: {username}')
        
        self.stdout.write(f'✓ {len(users)} users available\n')
        
        # Create league members
        members = []
        for user in users:
            member, created = LeagueMember.objects.get_or_create(
                league=league,
                user=user,
                defaults={
                    'team_name': f'{user.first_name}\'s Team',
                    'status': 'active',
                    'total_points': 0
                }
            )
            members.append(member)
            if created:
                self.stdout.write(f'  {user.username} joined as {member.team_name}')
        
        self.stdout.write(f'✓ {len(members)} members in league\n')
        
        # Get or create countries and tournament stage
        try:
            stage = TournamentStage.objects.first()
            if not stage:
                stage = TournamentStage.objects.create(name='Group Stage', order=1)
        except:
            stage = TournamentStage.objects.first()
        
        countries = list(Country.objects.all()[:20])
        if not countries:
            self.stdout.write(self.style.WARNING('Warning: No countries in database'))
            return
        
        # Get or create venue/stadium
        try:
            venue = Venue.objects.first()
            if not venue:
                venue = Venue.objects.create(
                    name='Test Stadium',
                    city='Test City',
                    country='Test Country'
                )
            
            stadium = Stadium.objects.filter(venue=venue).first()
            if not stadium:
                stadium = Stadium.objects.create(
                    name='Main Stadium',
                    venue=venue,
                    capacity=50000
                )
        except:
            stadium = Stadium.objects.first()
        
        # Create matches
        matches = []
        for i in range(num_matches):
            home_team = random.choice(countries)
            away_team = random.choice([c for c in countries if c != home_team])
            
            match_date = timezone.now() + timedelta(days=i)
            
            match = Match.objects.create(
                home_team=home_team,
                away_team=away_team,
                stadium=stadium,
                stage=stage,
                match_date=match_date,
                status='scheduled'
            )
            matches.append(match)
            self.stdout.write(f'  Created match: {home_team.name} vs {away_team.name}')
        
        self.stdout.write(f'✓ {len(matches)} matches created\n')
        
        # Create predictions for each member on each match
        self.stdout.write('Creating predictions...')
        pred_count = 0
        for match in matches:
            for member in members:
                # Random prediction
                pred_home = random.randint(0, 5)
                pred_away = random.randint(0, 5)
                
                pred, created = Prediction.objects.get_or_create(
                    user=member.user,
                    match=match,
                    league=league,
                    defaults={
                        'predicted_home_score': pred_home,
                        'predicted_away_score': pred_away,
                        'points': None,
                        'is_scored': False
                    }
                )
                if created:
                    pred_count += 1
        
        self.stdout.write(f'✓ {pred_count} predictions created\n')
        
        # Optionally score matches
        if do_score:
            self.stdout.write('Scoring matches...\n')
            
            for match in matches:
                # Set random results
                match.home_score = random.randint(0, 5)
                match.away_score = random.randint(0, 5)
                match.status = 'finished'
                match.save()
                
                self.stdout.write(
                    f'  {match.home_team.name} {match.home_score}-{match.away_score} {match.away_team.name}'
                )
                
                # Score predictions and update standings
                result = StandingsService.process_finished_match(match)
                self.stdout.write(
                    self.style.SUCCESS(
                        f'    → {result["predictions_scored"]} predictions scored, '
                        f'{result["members_updated"]} members updated'
                    )
                )
        
        self.stdout.write(self.style.SUCCESS('\n✓ Test data generation complete!'))
        self.stdout.write(f'\nLeague ID: {league.id}')
        self.stdout.write(f'API endpoint: /api/standings/by_league/?league_id={league.id}')
