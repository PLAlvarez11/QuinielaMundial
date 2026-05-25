from django.contrib import admin

from .models import Prediction


@admin.register(Prediction)
class PredictionAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'user',
        'match',
        'league',
        'predicted_home_score',
        'predicted_away_score',
        'points',
        'is_scored',
        'created_at',
    ]
    list_filter = ['is_scored', 'league', 'match__status']
    search_fields = ['user__email', 'user__name']
    readonly_fields = ['points', 'is_scored', 'created_at', 'updated_at']
    raw_id_fields = ['user', 'match', 'league']
