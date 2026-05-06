from django.contrib import admin
from .models import (
    Venue,
    Stadium,
    Country,
    TournamentStage,
    Group,
    GroupCountry,
    Match
)


@admin.register(Venue)
class VenueAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'city', 'country', 'created_at')
    search_fields = ('name', 'city', 'country')


@admin.register(Stadium)
class StadiumAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'venue', 'capacity', 'created_at')
    search_fields = ('name', 'venue__name')
    list_filter = ('venue',)


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'code', 'created_at')
    search_fields = ('name', 'code')


@admin.register(TournamentStage)
class TournamentStageAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'order', 'created_at')
    search_fields = ('name',)


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'stage', 'created_at')
    search_fields = ('name',)
    list_filter = ('stage',)


@admin.register(GroupCountry)
class GroupCountryAdmin(admin.ModelAdmin):
    list_display = ('id', 'group', 'country')
    list_filter = ('group',)


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'home_team',
        'away_team',
        'stadium',
        'stage',
        'group',
        'match_date',
        'status',
        'home_score',
        'away_score'
    )
    search_fields = ('home_team__name', 'away_team__name', 'stadium__name')
    list_filter = ('status', 'stage', 'group')