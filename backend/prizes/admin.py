from django.contrib import admin

from users.admin_mixins import AuditAdminMixin

from .models import PrizeDistribution


@admin.register(PrizeDistribution)
class PrizeDistributionAdmin(AuditAdminMixin, admin.ModelAdmin):
    list_display = (
        'league',
        'member',
        'position',
        'amount',
        'type',
        'created_at'
    )

    search_fields = (
        'league__name',
        'league__owner__name',
        'member__team_name',
        'member__user__email',
        'position',
        'type'
    )

    list_filter = (
        'position',
        'type',
        'league',
        'created_at'
    )
    autocomplete_fields = ('league', 'member')
    date_hierarchy = 'created_at'
    list_select_related = ('league', 'member')
