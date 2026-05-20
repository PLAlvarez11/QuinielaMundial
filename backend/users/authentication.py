import hashlib
from typing import Optional, Tuple

from django.utils import timezone
from rest_framework import authentication
from rest_framework import exceptions

from .models import UserSession


def _sha256_hex(value: str) -> str:
    return hashlib.sha256(value.encode('utf-8')).hexdigest()


class SessionTokenAuthentication(authentication.BaseAuthentication):
    """Autenticación por token basada en `UserSession`.

    Header soportado:
      - Authorization: Bearer <token>
      - X-Auth-Token: <token>
    """

    keyword = 'Bearer'

    def authenticate(self, request) -> Optional[Tuple[object, object]]:
        token = self._get_token_from_request(request)
        if not token:
            return None

        token_hash = _sha256_hex(token)
        now = timezone.now()

        session = (
            UserSession.objects.select_related('user')
            .filter(token_hash=token_hash)
            .order_by('-created_at')
            .first()
        )
        if session is None:
            raise exceptions.AuthenticationFailed('Token inválido.')

        if session.status != UserSession.Status.ACTIVE:
            raise exceptions.AuthenticationFailed('Sesión no activa.')

        if session.expires_at <= now:
            session.expire()
            raise exceptions.AuthenticationFailed('Token expirado.')

        user = session.user
        if getattr(user, 'deleted_at', None) is not None:
            raise exceptions.AuthenticationFailed('Usuario deshabilitado.')

        return (user, session)

    def _get_token_from_request(self, request) -> Optional[str]:
        header = request.headers.get('Authorization')
        if header:
            parts = header.split()
            if len(parts) == 2 and parts[0].lower() == self.keyword.lower():
                return parts[1].strip()

        token = request.headers.get('X-Auth-Token')
        if token:
            return token.strip()

        return None
