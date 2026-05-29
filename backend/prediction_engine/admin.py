from django.contrib import admin

from users.admin_mixins import AuditAdminMixin

from .models import Prediction


@admin.register(Prediction)
class PredictionAdmin(AuditAdminMixin, admin.ModelAdmin):
    list_display = [
        'user',
        'match',
        'league',
        'predicted_home_score',
        'predicted_away_score',
        'points',
        'scoring_status',
        'created_at',
    ]
    list_filter = ['is_scored', 'league', 'match__status', 'created_at']
    search_fields = ['user__email', 'user__name', 'league__name', 'match__home_team__name', 'match__away_team__name']
    readonly_fields = ['points', 'is_scored', 'created_at', 'updated_at']
    autocomplete_fields = ['user', 'match', 'league']
    list_select_related = ('user', 'match', 'league')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'

    @admin.display(description='Estado de puntuación')
    def scoring_status(self, obj):
        return 'Puntuada' if obj.is_scored else 'Pendiente'
