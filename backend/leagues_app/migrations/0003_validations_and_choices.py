# Generated migration for leagues_app models

from django.db import migrations, models
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('leagues_app', '0001_initial'),
    ]

    operations = [
        # Actualizar League
        migrations.AlterField(
            model_name='league',
            name='entry_fee',
            field=models.DecimalField(
                decimal_places=2, 
                default=0.0, 
                max_digits=10, 
                validators=[django.core.validators.MinValueValidator(0.0)]
            ),
        ),
        migrations.AlterField(
            model_name='league',
            name='max_members',
            field=models.IntegerField(
                validators=[django.core.validators.MinValueValidator(1)]
            ),
        ),
        migrations.AlterField(
            model_name='league',
            name='status',
            field=models.CharField(
                choices=[
                    ('active', 'Activa'),
                    ('paused', 'Pausada'),
                    ('finished', 'Finalizada'),
                    ('cancelled', 'Cancelada')
                ],
                default='active',
                max_length=50
            ),
        ),
        migrations.AddField(
            model_name='league',
            name='created_at_index',
            field=models.DateTimeField(auto_now_add=True, null=True),
            preserve_default=False,
        ),
        
        # Actualizar LeagueMember
        migrations.AlterField(
            model_name='leaguemember',
            name='status',
            field=models.CharField(
                choices=[
                    ('active', 'Activo'),
                    ('inactive', 'Inactivo'),
                    ('removed', 'Removido')
                ],
                default='active',
                max_length=50
            ),
        ),
        migrations.AlterUniqueTogether(
            name='leaguemember',
            unique_together={('league', 'user')},
        ),
        
        # Actualizar Invitation
        migrations.AlterField(
            model_name='invitation',
            name='status',
            field=models.CharField(
                choices=[
                    ('pending', 'Pendiente'),
                    ('accepted', 'Aceptada'),
                    ('rejected', 'Rechazada'),
                    ('expired', 'Expirada')
                ],
                default='pending',
                max_length=50
            ),
        ),
    ]
