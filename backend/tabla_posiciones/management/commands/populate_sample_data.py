from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from tabla_posiciones.models import Standing

User = get_user_model()


class Command(BaseCommand):
    help = 'Populate minimal sample data for the league table (users only).'

    def handle(self, *args, **options):
        self.stdout.write('Creating minimal sample data...')

        # Crear usuarios de prueba
        users = []
        for i in range(1, 6):
            user, created = User.objects.get_or_create(
                email=f'usuario{i}@example.com',
                defaults={'name': f'usuario{i}'}
            )
            if created:
                user.set_password('password123')
                user.save()
            users.append(user)

        # Nota: la creación de equipos/partidos/predicciones debe hacerse
        # utilizando los modelos centrales (`catalogo`, `prediction_engine`).
        # Este comando fue simplificado para evitar dependencias duplicadas.

        # Intentar recalcular standings para la jornada 1 (si hay datos)
        try:
            Standing.update_standings_for_round(1)
            self.stdout.write(self.style.SUCCESS('Standings recalculated.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'No se pudo recalcular standings: {e}'))

        self.stdout.write(self.style.SUCCESS('Minimal sample data command finished.'))