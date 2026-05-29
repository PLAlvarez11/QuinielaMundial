from django.contrib import admin
from django.db.models import Count

from users.admin_mixins import AuditAdminMixin

from .models import Invitation, League, LeagueMember


class LeagueMemberInline(admin.TabularInline):
	model = LeagueMember
	extra = 0
	autocomplete_fields = ('user',)
	fields = ('user', 'team_name', 'total_points', 'status', 'joined_at')
	readonly_fields = ('joined_at',)
	show_change_link = True


class InvitationInline(admin.TabularInline):
	model = Invitation
	extra = 0
	autocomplete_fields = ('invited_by',)
	fields = ('email', 'invited_by', 'status', 'expires_at', 'created_at')
	readonly_fields = ('created_at',)
	show_change_link = True


@admin.register(League)
class LeagueAdmin(AuditAdminMixin, admin.ModelAdmin):
	list_display = ('name', 'owner', 'status', 'type', 'entry_fee', 'members_count', 'invitations_count', 'created_at')
	search_fields = ('name', 'description', 'owner__email', 'owner__name')
	list_filter = ('status', 'type', 'created_at')
	autocomplete_fields = ('owner',)
	date_hierarchy = 'created_at'
	readonly_fields = ('created_at', 'updated_at', 'deleted_at')
	inlines = [LeagueMemberInline, InvitationInline]
	list_select_related = ('owner',)

	fieldsets = (
		(None, {'fields': ('name', 'description', 'type', 'status')}),
		('Economía y capacidad', {'fields': ('entry_fee', 'max_members')}),
		('Propiedad', {'fields': ('owner',)}),
		('Fechas', {'fields': ('created_at', 'updated_at', 'deleted_at')}),
	)

	def get_queryset(self, request):
		return super().get_queryset(request).select_related('owner').annotate(
			members_total=Count('members', distinct=True),
			invitations_total=Count('invitations', distinct=True),
		)

	@admin.display(description='Miembros', ordering='members_total')
	def members_count(self, obj):
		return obj.members_total

	@admin.display(description='Invitaciones', ordering='invitations_total')
	def invitations_count(self, obj):
		return obj.invitations_total


@admin.register(LeagueMember)
class LeagueMemberAdmin(AuditAdminMixin, admin.ModelAdmin):
	list_display = ('league', 'user', 'team_name', 'total_points', 'status', 'joined_at')
	search_fields = ('league__name', 'user__email', 'user__name', 'team_name')
	list_filter = ('status', 'league', 'joined_at')
	autocomplete_fields = ('league', 'user')
	date_hierarchy = 'joined_at'
	list_select_related = ('league', 'user')


@admin.register(Invitation)
class InvitationAdmin(AuditAdminMixin, admin.ModelAdmin):
	list_display = ('league', 'email', 'invited_by', 'status', 'expires_at', 'created_at')
	search_fields = ('league__name', 'email', 'invited_by__email', 'invited_by__name', 'token')
	list_filter = ('status', 'league', 'created_at', 'expires_at')
	autocomplete_fields = ('league', 'invited_by')
	date_hierarchy = 'created_at'
	list_select_related = ('league', 'invited_by')
