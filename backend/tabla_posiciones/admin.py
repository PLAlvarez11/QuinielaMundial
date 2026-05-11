from django.contrib import admin
from .models import Team, Match, Prediction, Standing


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['name', 'country', 'group']
    list_filter = ['group', 'country']
    search_fields = ['name', 'country']


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ['home_team', 'away_team', 'match_date', 'round_number', 'result', 'is_finished']
    list_filter = ['round_number', 'is_finished', 'match_date']
    search_fields = ['home_team__name', 'away_team__name']
    ordering = ['match_date']


@admin.register(Prediction)
class PredictionAdmin(admin.ModelAdmin):
    list_display = ['user', 'match', 'predicted_home_score', 'predicted_away_score', 'points_earned']
    list_filter = ['match__round_number', 'points_earned']
    search_fields = ['user__username', 'match__home_team__name', 'match__away_team__name']


@admin.register(Standing)
class StandingAdmin(admin.ModelAdmin):
    list_display = ['user', 'round_number', 'position', 'total_points', 'position_variation']
    list_filter = ['round_number', 'position_change']
    search_fields = ['user__username']
    ordering = ['round_number', 'position']
