from __future__ import annotations

from collections.abc import Mapping
from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from .models import AuditLog


def _coerce(value):
	if isinstance(value, (datetime, date, Decimal, UUID)):
		return str(value)
	return value


def build_changes(before: Mapping | None, after: Mapping | None):
	before = before or {}
	after = after or {}
	keys = set(before) | set(after)
	changes = {}
	for key in sorted(keys):
		if before.get(key) != after.get(key):
			changes[key] = {
				'before': _coerce(before.get(key)),
				'after': _coerce(after.get(key)),
			}
	return changes


def snapshot_instance(instance):
	data = {}
	for field in instance._meta.concrete_fields:
		if field.primary_key or field.auto_created:
			continue
		value = field.value_from_object(instance)
		if field.name == 'password':
			value = '[redacted]'
		data[field.name] = _coerce(value)
	return data


def log_event(*, action, instance=None, actor=None, changes=None, request=None, status_code=None, model_label=None, object_id=None, object_repr=None):
	if instance is not None:
		model_label = model_label or instance._meta.label
		object_id = object_id or str(instance.pk)
		object_repr = object_repr or str(instance)

	path = ''
	method = ''
	ip_address = None
	user_agent = ''
	if request is not None:
		path = request.path
		method = request.method
		ip_address = request.META.get('REMOTE_ADDR')
		user_agent = request.headers.get('User-Agent', '')
		if actor is None:
			actor = getattr(request, 'user', None)

	AuditLog.objects.create(
		actor=actor if getattr(actor, 'pk', None) else None,
		action=action,
		model_label=model_label or '',
		object_id=object_id,
		object_repr=object_repr or '',
		changes=changes or {},
		path=path,
		method=method,
		ip_address=ip_address,
		user_agent=user_agent,
		status_code=status_code,
	)


def log_model_change(*, request, action, instance, before=None, after=None):
	changes = build_changes(before, after)
	if not changes and action == AuditLog.Action.UPDATE:
		return
	log_event(action=action, instance=instance, request=request, changes=changes)