from django.contrib import admin
from .models import PrizeDistribution


@admin.register(PrizeDistribution)
class PrizeDistributionAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'league',
        'member',
        'position',
        'amount',
        'type',
        'created_at'
    )

    search_fields = (
        'league__name',
        'member__team_name',
        'position',
        'type'
    )

    list_filter = (
        'position',
        'type',
        'league'
    )