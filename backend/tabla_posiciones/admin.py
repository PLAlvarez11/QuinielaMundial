from django.contrib import admin
from .models import Standing


@admin.register(Standing)
class StandingAdmin(admin.ModelAdmin):
    list_display = ['user', 'round_number', 'position', 'total_points', 'position_variation']
    list_filter = ['round_number', 'position_change']
    search_fields = ['user__name', 'user__email']
    ordering = ['round_number', 'position']
