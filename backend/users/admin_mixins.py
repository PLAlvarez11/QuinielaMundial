from __future__ import annotations

from .audit import log_model_change, snapshot_instance
from .models import AuditLog


class AuditAdminMixin:
	def _snapshot(self, obj):
		return snapshot_instance(obj)

	def save_model(self, request, obj, form, change):
		before = self._snapshot(type(obj).objects.get(pk=obj.pk)) if change and obj.pk else {}
		super().save_model(request, obj, form, change)
		after = self._snapshot(obj)
		action = AuditLog.Action.UPDATE if change else AuditLog.Action.CREATE
		log_model_change(request=request, action=action, instance=obj, before=before, after=after)

	def delete_model(self, request, obj):
		before = self._snapshot(obj)
		log_model_change(request=request, action=AuditLog.Action.DELETE, instance=obj, before=before, after={})
		super().delete_model(request, obj)