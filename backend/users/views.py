import hashlib
import secrets
from datetime import timedelta

from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import CustomUser, UserSession
from .serializers import (
	AdminCreateUserSerializer,
	LoginSerializer,
	RegisterSerializer,
	UserSerializer,
	UserUpdateSerializer,
)


def _sha256_hex(value: str) -> str:
	return hashlib.sha256(value.encode('utf-8')).hexdigest()


def _client_ip(request) -> str | None:
	xff = request.headers.get('X-Forwarded-For')
	if xff:
		return xff.split(',')[0].strip() or None
	return request.META.get('REMOTE_ADDR')


class RegisterView(APIView):
	permission_classes = [permissions.AllowAny]

	def post(self, request):
		serializer = RegisterSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		user = serializer.save()
		return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class LoginView(APIView):
	permission_classes = [permissions.AllowAny]

	def post(self, request):
		serializer = LoginSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		user: CustomUser = serializer.validated_data['user']

		raw_token = secrets.token_urlsafe(32)
		token_hash = _sha256_hex(raw_token)

		now = timezone.now()
		session = UserSession.objects.create(
			user=user,
			token_hash=token_hash,
			ip_address=_client_ip(request),
			user_agent=request.headers.get('User-Agent', ''),
			status=UserSession.Status.ACTIVE,
			expires_at=now + timedelta(days=7),
		)

		return Response(
			{
				'token': raw_token,
				'expires_at': session.expires_at,
				'user': UserSerializer(user).data,
			},
			status=status.HTTP_200_OK,
		)


class LogoutView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request):
		session: UserSession | None = getattr(request, 'auth', None)
		if isinstance(session, UserSession):
			session.close()
		return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request):
		return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)


class UsersAdminViewSet(viewsets.ModelViewSet):
	"""CRUD de usuarios para administradores.

	- DELETE hace soft-delete (setea deleted_at)
	- Los usuarios borrados no aparecen en list/retrieve
	"""

	permission_classes = [permissions.IsAdminUser]
	queryset = CustomUser.objects.all().order_by('-created_at')
	lookup_field = 'id'

	def get_queryset(self):
		return super().get_queryset().filter(deleted_at__isnull=True)

	def get_serializer_class(self):
		if self.action == 'create':
			return AdminCreateUserSerializer
		if self.action in {'update', 'partial_update'}:
			return UserUpdateSerializer
		return UserSerializer

	def create(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		user = serializer.save()
		return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

	def destroy(self, request, *args, **kwargs):
		user = self.get_object()
		user.soft_delete()
		return Response(status=status.HTTP_204_NO_CONTENT)
