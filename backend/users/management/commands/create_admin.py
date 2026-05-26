"""
Management command para crear un usuario admin por defecto
Uso: python manage.py create_admin
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Crea un usuario admin por defecto con contraseña pass123456'

    def add_arguments(self, parser):
        parser.add_argument(
            '--username',
            type=str,
            default='admin',
            help='Nombre de usuario del admin (default: admin)',
        )
        parser.add_argument(
            '--email',
            type=str,
            default='admin@example.com',
            help='Email del admin (default: admin@example.com)',
        )
        parser.add_argument(
            '--password',
            type=str,
            default='pass123456',
            help='Contraseña del admin (default: pass123456)',
        )
        parser.add_argument(
            '--force',
            action='store_true',
            help='Elimina el usuario si ya existe y lo recrea',
        )

    def handle(self, *args, **options):
        username = options['username']
        email = options['email']
        password = options['password']
        force = options['force']

        # Verificar si el usuario ya existe
        if User.objects.filter(name=username).exists():
            if force:
                self.stdout.write(
                    self.style.WARNING(f'⚠️  Usuario "{username}" ya existe. Eliminando...')
                )
                User.objects.filter(name=username).delete()
            else:
                self.stdout.write(
                    self.style.ERROR(
                        f'❌ El usuario "{username}" ya existe. '
                        'Usa --force para eliminarlo y recrearlo.'
                    )
                )
                return

        # Crear el usuario admin
        try:
            User.objects.create_superuser(username, email, password)
            self.stdout.write(
                self.style.SUCCESS(
                    f'✅ Usuario admin "{username}" creado exitosamente\n'
                    f'   Email: {email}\n'
                    f'   Contraseña: {password}'
                )
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Error al crear el usuario: {str(e)}')
            )
