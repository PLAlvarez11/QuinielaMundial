"""
Permisos personalizados para el app de ligas.
"""

from rest_framework import permissions


class IsLeagueOwner(permissions.BasePermission):
    """Solo el propietario de la liga puede editarla o eliminarla."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user


class IsInvitationCreator(permissions.BasePermission):
    """Solo el que creó la invitación puede verla o eliminarla."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.invited_by == request.user


class CanCreateInvitation(permissions.BasePermission):
    """Solo el propietario de la liga puede crear invitaciones."""

    def has_permission(self, request, view):
        if request.method != 'POST':
            return True
        # Validar que el usuario sea el propietario de la liga
        league_id = request.data.get('league')
        if not league_id:
            return False
        from .models import League
        try:
            league = League.objects.get(id=league_id)
            return league.owner == request.user
        except League.DoesNotExist:
            return False
