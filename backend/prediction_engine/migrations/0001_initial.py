import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('catalogo', '0001_initial'),
        ('leagues_app', '0002_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Prediction',
            fields=[
                ('id', models.BigAutoField(
                    auto_created=True,
                    primary_key=True,
                    serialize=False,
                    verbose_name='ID',
                )),
                ('predicted_home_score', models.PositiveIntegerField()),
                ('predicted_away_score', models.PositiveIntegerField()),
                ('points', models.PositiveIntegerField(blank=True, null=True)),
                ('is_scored', models.BooleanField(db_index=True, default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='predictions',
                    to=settings.AUTH_USER_MODEL,
                )),
                ('match', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='predictions',
                    to='catalogo.match',
                )),
                ('league', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='predictions',
                    to='leagues_app.league',
                )),
            ],
            options={
                'db_table': 'predictions',
                'ordering': ['-created_at'],
            },
        ),
        migrations.AddConstraint(
            model_name='prediction',
            constraint=models.UniqueConstraint(
                fields=['user', 'match', 'league'],
                name='unique_prediction_per_user_match_league',
            ),
        ),
        migrations.AddIndex(
            model_name='prediction',
            index=models.Index(fields=['user', 'league'], name='pred_user_league_idx'),
        ),
        migrations.AddIndex(
            model_name='prediction',
            index=models.Index(fields=['match', 'is_scored'], name='pred_match_scored_idx'),
        ),
    ]
