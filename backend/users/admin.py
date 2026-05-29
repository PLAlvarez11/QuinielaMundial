from django.contrib import admin
from django.utils.html import format_html

from .audit import log_event
from .admin_mixins import AuditAdminMixin
from .models import AuditLog, CustomUser, UserSession


admin.site.site_header = 'Quiniela Mundial | Panel M7'
admin.site.site_title = 'Administración Quiniela Mundial'
admin.site.index_title = 'Gestión global, reglas y auditoría'


class UserSessionInline(admin.TabularInline):
	model = UserSession
	extra = 0
	fields = ('status', 'ip_address', 'user_agent', 'expires_at', 'created_at')
	readonly_fields = ('status', 'ip_address', 'user_agent', 'expires_at', 'created_at')
	can_delete = False
	show_change_link = True
	verbose_name = 'Sesión'
	verbose_name_plural = 'Sesiones recientes'


@admin.register(CustomUser)
class CustomUserAdmin(AuditAdminMixin, admin.ModelAdmin):
	list_display = ('email', 'name', 'account_state', 'is_admin', 'is_staff', 'last_login', 'created_at')
	search_fields = ('email', 'name')
	list_filter = ('is_admin', 'is_staff', 'is_superuser', 'deleted_at', 'created_at')
	ordering = ('email',)
	date_hierarchy = 'created_at'
	readonly_fields = ('created_at', 'updated_at', 'last_login')
	inlines = [UserSessionInline]
	actions = ('soft_delete_selected', 'restore_selected')

	fieldsets = (
		(None, {'fields': ('email', 'password')}),
		('Perfil', {'fields': ('name', 'avatar_url')}),
		('Estado', {'fields': ('is_admin', 'is_staff', 'is_superuser', 'deleted_at')}),
		('Permisos', {'fields': ('groups', 'user_permissions')}),
		('Fechas', {'fields': ('last_login', 'created_at', 'updated_at')}),
	)

	@admin.display(description='Estado')
	def account_state(self, obj):
		if obj.deleted_at:
			return format_html('<span style="color:#b42318;font-weight:600;">Eliminado</span>')
		return format_html('<span style="color:#067647;font-weight:600;">Activo</span>')

	@admin.action(description='Marcar como eliminados')
	def soft_delete_selected(self, request, queryset):
		for user in queryset:
			if user.deleted_at is None:
				log_event(action=AuditLog.Action.SOFT_DELETE, instance=user, request=request, changes={'deleted_at': {'before': None, 'after': 'now'}})
				user.soft_delete()

	@admin.action(description='Restaurar usuarios seleccionados')
	def restore_selected(self, request, queryset):
		for user in queryset:
			if user.deleted_at is not None:
				log_event(action=AuditLog.Action.RESTORE, instance=user, request=request, changes={'deleted_at': {'before': 'set', 'after': None}})
				user.restore()


@admin.register(UserSession)
class UserSessionAdmin(AuditAdminMixin, admin.ModelAdmin):
	list_display = ('user', 'status', 'ip_address', 'expires_at', 'created_at')
	list_filter = ('status', 'created_at', 'expires_at')
	search_fields = ('user__email', 'user__name', 'token_hash', 'ip_address')
	ordering = ('-created_at',)
	date_hierarchy = 'created_at'
	readonly_fields = ('user', 'token_hash', 'ip_address', 'user_agent', 'status', 'expires_at', 'created_at')
	list_select_related = ('user',)


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
	list_display = ('created_at', 'action', 'model_label', 'object_repr', 'actor', 'ip_address', 'status_code')
	list_filter = ('action', 'model_label', 'created_at')
	search_fields = ('object_repr', 'model_label', 'actor__email', 'actor__name', 'path')
	date_hierarchy = 'created_at'
	readonly_fields = ('actor', 'action', 'model_label', 'object_id', 'object_repr', 'changes', 'path', 'method', 'ip_address', 'user_agent', 'status_code', 'created_at')
	list_select_related = ('actor',)
