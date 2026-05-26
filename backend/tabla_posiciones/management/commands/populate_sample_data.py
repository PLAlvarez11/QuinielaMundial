from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from tabla_posiciones.models import Team, Match, Prediction
from datetime import datetime, timedelta

User = get_user_model()


class Command(BaseCommand):
    help = 'Populate sample data for the league table'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')

        # Crear usuarios de prueba
        users = []
        for i in range(1, 6):
            user, created = User.objects.get_or_create(
                username=f'usuario{i}',
                defaults={'email': f'usuario{i}@example.com'}
            )
            if created:
                user.set_password('password123')
                user.save()
            users.append(user)

        # Crear equipos
        teams_data = [
            ('Argentina', 'Argentina'),
            ('Brasil', 'Brasil'),
            ('Francia', 'Francia'),
            ('Alemania', 'Alemania'),
            ('España', 'España'),
            ('Inglaterra', 'Inglaterra'),
            ('Portugal', 'Portugal'),
            ('Uruguay', 'Uruguay'),
        ]

        teams = []
        for name, country in teams_data:
            team, created = Team.objects.get_or_create(
                name=name,
                defaults={'country': country}
            )
            teams.append(team)

        # Crear partidos
        base_date = datetime.now()
        matches_data = [
            (teams[0], teams[1], base_date + timedelta(days=1), 1),  # Argentina vs Brasil
            (teams[2], teams[3], base_date + timedelta(days=2), 1),  # Francia vs Alemania
            (teams[4], teams[5], base_date + timedelta(days=3), 1),  # España vs Inglaterra
            (teams[6], teams[7], base_date + timedelta(days=4), 1),  # Portugal vs Uruguay
            (teams[0], teams[2], base_date + timedelta(days=8), 2),  # Argentina vs Francia
            (teams[1], teams[3], base_date + timedelta(days=9), 2),  # Brasil vs Alemania
        ]

        matches = []
        for home_team, away_team, match_date, round_num in matches_data:
            match, created = Match.objects.get_or_create(
                home_team=home_team,
                away_team=away_team,
                match_date=match_date,
                defaults={'round_number': round_num}
            )
            matches.append(match)

        # Actualizar algunos resultados
        matches[0].home_score = 2
        matches[0].away_score = 1
        matches[0].is_finished = True
        matches[0].save()

        matches[1].home_score = 1
        matches[1].away_score = 1
        matches[1].is_finished = True
        matches[1].save()

        # Crear predicciones de prueba
        for user in users:
            for match in matches[:2]:  # Solo para los primeros 2 partidos terminados
                prediction, created = Prediction.objects.get_or_create(
                    user=user,
                    match=match,
                    defaults={
                        'predicted_home_score': 1,
                        'predicted_away_score': 0,
                    }
                )

        # Recalcular standings
        from tabla_posiciones.models import Standing
        Standing.update_standings_for_round(1)

        self.stdout.write(self.style.SUCCESS('Sample data created successfully!'))