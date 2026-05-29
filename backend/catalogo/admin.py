from django.contrib import admin

from users.admin_mixins import AuditAdminMixin

from .models import (
    Venue,
    Stadium,
    Country,
    TournamentStage,
    Group,
    GroupCountry,
    Match
)


class GroupCountryInline(admin.TabularInline):
    model = GroupCountry
    extra = 0
    autocomplete_fields = ('country',)
    verbose_name = 'País del grupo'
    verbose_name_plural = 'Países del grupo'


class MatchInline(admin.TabularInline):
    model = Match
    extra = 0
    fk_name = 'stage'
    fields = ('home_team', 'away_team', 'stadium', 'group', 'match_date', 'status', 'home_score', 'away_score')
    autocomplete_fields = ('home_team', 'away_team', 'stadium', 'group')
    show_change_link = True


@admin.register(Venue)
class VenueAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'country', 'stadiums_total', 'created_at')
    search_fields = ('name', 'city', 'country')
    list_filter = ('country',)
    ordering = ('name',)
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at',)

    @admin.display(description='Estadios')
    def stadiums_total(self, obj):
        return obj.stadiums.count()


@admin.register(Stadium)
class StadiumAdmin(AuditAdminMixin, admin.ModelAdmin):
    list_display = ('name', 'venue', 'capacity', 'created_at')
    search_fields = ('name', 'venue__name', 'venue__city')
    list_filter = ('venue',)
    autocomplete_fields = ('venue',)
    ordering = ('name',)
    date_hierarchy = 'created_at'
    list_select_related = ('venue',)


@admin.register(Country)
class CountryAdmin(AuditAdminMixin, admin.ModelAdmin):
    list_display = ('name', 'code', 'flag_preview', 'created_at')
    search_fields = ('name', 'code')
    ordering = ('name',)
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at',)

    @admin.display(description='Bandera')
    def flag_preview(self, obj):
        if not obj.flag_url:
            return 'Sin bandera'
        return obj.flag_url


@admin.register(TournamentStage)
class TournamentStageAdmin(AuditAdminMixin, admin.ModelAdmin):
    list_display = ('name', 'order', 'created_at', 'matches_total')
    search_fields = ('name',)
    ordering = ('order',)
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at',)
    inlines = [MatchInline]

    @admin.display(description='Partidos')
    def matches_total(self, obj):
        return obj.matches.count()


@admin.register(Group)
class GroupAdmin(AuditAdminMixin, admin.ModelAdmin):
    list_display = ('name', 'stage', 'created_at', 'countries_total')
    search_fields = ('name', 'stage__name')
    list_filter = ('stage',)
    autocomplete_fields = ('stage',)
    ordering = ('stage__order', 'name')
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at',)
    inlines = [GroupCountryInline]
    list_select_related = ('stage',)

    @admin.display(description='Países')
    def countries_total(self, obj):
        return obj.countries.count()


@admin.register(GroupCountry)
class GroupCountryAdmin(AuditAdminMixin, admin.ModelAdmin):
    list_display = ('group', 'country')
    list_filter = ('group', 'country')
    autocomplete_fields = ('group', 'country')
    search_fields = ('group__name', 'country__name', 'country__code')
    list_select_related = ('group', 'country')


@admin.register(Match)
class MatchAdmin(AuditAdminMixin, admin.ModelAdmin):
    list_display = (
        'match_date',
        'home_team',
        'away_team',
        'stadium',
        'stage',
        'group',
        'status',
        'scoreline',
    )
    search_fields = ('home_team__name', 'away_team__name', 'stadium__name', 'stage__name', 'group__name')
    list_filter = ('status', 'stage', 'group', 'stadium')
    autocomplete_fields = ('home_team', 'away_team', 'stadium', 'stage', 'group')
    ordering = ('match_date',)
    date_hierarchy = 'match_date'
    list_select_related = ('home_team', 'away_team', 'stadium', 'stage', 'group')

    @admin.display(description='Marcador')
    def scoreline(self, obj):
        if obj.home_score is None or obj.away_score is None:
            return 'Pendiente'
        return f'{obj.home_score}-{obj.away_score}'