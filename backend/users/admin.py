from django.contrib import admin
from django.utils.html import format_html
from django.urls import path
from django.utils import timezone
from django.http import HttpResponse
from django.db.models import Count
from django.utils.safestring import mark_safe

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
		color = '#b42318' if obj.deleted_at else '#067647'
		text = 'Eliminado' if obj.deleted_at else 'Activo'

		return format_html(
			'<span style="color:{};font-weight:600;">{}</span>',
			color,
			text
		)
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


class ActorFilter(admin.SimpleListFilter):
	title = 'Actor'
	parameter_name = 'actor'

	def lookups(self, request, model_admin):
		qs = AuditLog.objects.values('actor__id', 'actor__email').annotate(c=Count('id')).order_by('-c')[:10]
		return [(a['actor__id'], a['actor__email'] or str(a['actor__id'])) for a in qs if a['actor__id']]

	def queryset(self, request, queryset):
		if self.value():
			return queryset.filter(actor__id=self.value())
		return queryset


class IPFilter(admin.SimpleListFilter):
	title = 'IP'
	parameter_name = 'ip'

	def lookups(self, request, model_admin):
		qs = AuditLog.objects.values('ip_address').annotate(c=Count('id')).order_by('-c')[:10]
		return [(a['ip_address'], a['ip_address']) for a in qs if a['ip_address']]

	def queryset(self, request, queryset):
		if self.value():
			return queryset.filter(ip_address=self.value())
		return queryset


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
	list_display = ('created_at', 'action', 'model_label', 'object_repr', 'actor', 'ip_address', 'status_code')
	list_filter = (ActorFilter, 'action', 'model_label', IPFilter, 'method', 'created_at')
	search_fields = ('object_repr', 'model_label', 'actor__email', 'actor__name', 'path', 'ip_address')
	date_hierarchy = 'created_at'
	readonly_fields = ('actor', 'action', 'model_label', 'object_id', 'object_repr', 'changes', 'path', 'method', 'ip_address', 'user_agent', 'status_code', 'created_at')
	list_select_related = ('actor',)


# --- M7 quick dashboard (admin view) ---------------------------------
def m7_dashboard(request):
	from leagues_app.models import League
	from prediction_engine.models import Prediction

	today = timezone.now().date()
	total_users = CustomUser.objects.filter(deleted_at__isnull=True).count()
	deleted_users = CustomUser.objects.filter(deleted_at__isnull=False).count()
	active_sessions = UserSession.objects.filter(status=UserSession.Status.ACTIVE).count()
	total_leagues = League.objects.count()
	predictions_today = Prediction.objects.filter(created_at__date=today).count()
	audit_events = AuditLog.objects.count()

	# build 7-day series for audit events
	days = []
	counts = []
	for i in range(6, -1, -1):
		d = today - timezone.timedelta(days=i)
		c = AuditLog.objects.filter(created_at__date=d).count()
		days.append(d.strftime('%Y-%m-%d'))
		counts.append(c)

	maxc = max(counts) if counts else 1
	# simple inline SVG bar chart
	bars = []
	width = 500
	height = 120
	bar_w = width / 7 - 6
	for idx, val in enumerate(counts):
		h = int((val / maxc) * (height - 30)) if maxc else 0
		x = idx * (bar_w + 6) + 10
		y = height - h - 10
		bars.append(f'<rect x="{x}" y="{y}" width="{bar_w}" height="{h}" fill="#2563eb"/>')
		bars.append(f'<text x="{x + bar_w/2}" y="{height - 2}" font-size="10" text-anchor="middle">{days[idx][5:]}</text>')

	svg = f'<svg width="{width}" height="{height}" role="img">' + ''.join(bars) + '</svg>'

	html = (
		'<html><head><title>Panel M7</title></head><body style="font-family:system-ui,Segoe UI,Roboto,Arial">'
		f'<h1>Panel M7 — Resumen rápido</h1>'
		f'<div style="display:flex;gap:40px">'
		f'<div>'
		f'<ul>'
		f'<li><strong>Usuarios activos:</strong> {total_users}</li>'
		f'<li><strong>Usuarios eliminados:</strong> {deleted_users}</li>'
		f'<li><strong>Sesiones activas:</strong> {active_sessions}</li>'
		f'<li><strong>Ligas totales:</strong> {total_leagues}</li>'
		f'<li><strong>Predicciones hoy:</strong> {predictions_today}</li>'
		f'<li><strong>Eventos en bitácora:</strong> {audit_events}</li>'
		f'</ul>'
		f'</div>'
		f'<div>'
		f'<h3>Eventos (últimos 7 días)</h3>'
		f'{svg}'
		f'</div>'
		f'</div>'
		f'<p><a href="/m7-admin/users/auditlog/">Ver bitácora completa</a></p>'
		'</body></html>'
	)
	return HttpResponse(html)


# inject dashboard url into admin
_orig_get_urls = admin.site.get_urls

def _get_urls():
	urls = _orig_get_urls()
	my_urls = [path('m7-dashboard/', admin.site.admin_view(m7_dashboard), name='m7-dashboard')]
	return my_urls + urls

admin.site.get_urls = _get_urls
