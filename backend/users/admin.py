from django.contrib import admin

from .models import CustomUser, UserSession


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
	ordering = ('email',)
	list_display = ('email', 'name', 'is_admin', 'is_staff', 'deleted_at', 'created_at')
	search_fields = ('email', 'name')
	list_filter = ('is_admin', 'is_staff', 'deleted_at')

	fieldsets = (
		(None, {'fields': ('email', 'password')}),
		('Perfil', {'fields': ('name', 'avatar_url')}),
		('Permisos', {'fields': ('is_admin', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
		('Fechas', {'fields': ('last_login', 'created_at', 'updated_at', 'deleted_at')}),
	)
	readonly_fields = ('created_at', 'updated_at', 'last_login')


@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
	list_display = ('user', 'status', 'ip_address', 'expires_at', 'created_at')
	list_filter = ('status',)
	search_fields = ('user__email', 'token_hash')
