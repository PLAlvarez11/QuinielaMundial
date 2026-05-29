from django.contrib import admin

from users.admin_mixins import AuditAdminMixin

from .models import Standing


@admin.register(Standing)
class StandingAdmin(AuditAdminMixin, admin.ModelAdmin):
    list_display = ['user', 'round_number', 'position', 'total_points', 'position_variation', 'created_at']
    list_filter = ['round_number', 'position_change', 'created_at']
    search_fields = ['user__name', 'user__email']
    ordering = ['round_number', 'position']
    date_hierarchy = 'created_at'
    list_select_related = ('user',)
