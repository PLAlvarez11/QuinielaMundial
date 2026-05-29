"""
M1 — Autenticación y Usuarios
App: users

Tablas:
  - users         → CustomUser (extiende AbstractBaseUser)
  - user_sessions → UserSession
"""

import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone


class CustomUserManager(BaseUserManager):
    """Manager personalizado: usa email como campo de autenticación."""

    def create_user(self, email, name, password=None, **extra_fields):
        if not email:
            raise ValueError("El email es obligatorio.")
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        # Django llama a make_password internamente → bcrypt via PASSWORD_HASHERS
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault("is_admin", True)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, name, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    """
    Usuario principal de la plataforma.

    Seguridad:
      - La contraseña NUNCA se almacena en texto plano.
        Django usa PASSWORD_HASHERS; configurar bcrypt (factor ≥ 10) o Argon2id
        en settings.py:
            PASSWORD_HASHERS = [
                'django.contrib.auth.hashers.Argon2PasswordHasher',
                'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
            ]
      - deleted_at implementa soft delete (ningún usuario se elimina físicamente).
    """

    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email      = models.EmailField(max_length=255, unique=True, db_index=True)
    name       = models.CharField(max_length=100)
    avatar_url = models.URLField(blank=True, null=True)
    is_admin   = models.BooleanField(default=False)
    is_staff   = models.BooleanField(default=False)   # requerido por PermissionsMixin

    # Soft delete — nunca se hace DELETE físico sobre usuarios
    deleted_at = models.DateTimeField(null=True, blank=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD  = "email"
    REQUIRED_FIELDS = ["name"]

    objects = CustomUserManager()

    class Meta:
        db_table    = "users"
        verbose_name        = "Usuario"
        verbose_name_plural = "Usuarios"
        indexes = [
            models.Index(fields=["email"]),
            models.Index(fields=["deleted_at"]),
        ]

    def __str__(self):
        return f"{self.name} <{self.email}>"

    # ── helpers ──────────────────────────────────────────────────────────────

    @property
    def is_active(self):
        """Un usuario está activo mientras no tenga deleted_at."""
        return self.deleted_at is None

    def soft_delete(self):
        self.deleted_at = timezone.now()
        self.save(update_fields=["deleted_at", "updated_at"])

    def restore(self):
        self.deleted_at = None
        self.save(update_fields=["deleted_at", "updated_at"])
        
    groups = models.ManyToManyField(
        "auth.Group",
        verbose_name="groups",
        blank=True,
        related_name="custom_user_set",  
        related_query_name="custom_user",
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        verbose_name="user permissions",
        blank=True,
        related_name="custom_user_set",  
        related_query_name="custom_user",
    )


class AuditLog(models.Model):
    class Action(models.TextChoices):
        CREATE = 'create', 'Creación'
        UPDATE = 'update', 'Actualización'
        DELETE = 'delete', 'Eliminación'
        LOGIN = 'login', 'Inicio de sesión'
        LOGOUT = 'logout', 'Cierre de sesión'
        RESTORE = 'restore', 'Restauración'
        SOFT_DELETE = 'soft_delete', 'Eliminación lógica'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    actor = models.ForeignKey(
        CustomUser,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='audit_logs',
    )
    action = models.CharField(max_length=30, choices=Action.choices)
    model_label = models.CharField(max_length=120, db_index=True)
    object_id = models.CharField(max_length=64, blank=True, null=True, db_index=True)
    object_repr = models.CharField(max_length=255)
    changes = models.JSONField(default=dict, blank=True)
    path = models.CharField(max_length=255, blank=True)
    method = models.CharField(max_length=10, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    status_code = models.PositiveSmallIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'audit_logs'
        verbose_name = 'Bitácora de auditoría'
        verbose_name_plural = 'Bitácora de auditoría'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['action', 'created_at']),
            models.Index(fields=['model_label', 'created_at']),
            models.Index(fields=['actor', 'created_at']),
        ]

    def __str__(self):
        return f'{self.get_action_display()} · {self.model_label} · {self.object_repr}'


class UserSession(models.Model):
    """
    Registro de cada inicio/cierre de sesión.
    Permite detectar accesos concurrentes o anómalos (requisito de auditoría).
    """

    class Status(models.TextChoices):
        ACTIVE  = "active",  "Activa"
        CLOSED  = "closed",  "Cerrada"
        EXPIRED = "expired", "Expirada"

    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user       = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="sessions"
    )
    token_hash = models.CharField(max_length=255, db_index=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    status     = models.CharField(
        max_length=20, choices=Status.choices, default=Status.ACTIVE
    )
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "user_sessions"
        verbose_name        = "Sesión de usuario"
        verbose_name_plural = "Sesiones de usuario"
        indexes = [
            models.Index(fields=["user", "status"]),
            models.Index(fields=["token_hash"]),
        ]

    def __str__(self):
        return f"Sesión {self.status} — {self.user.email}"

    def close(self):
        self.status = self.Status.CLOSED
        self.save(update_fields=["status"])

    def expire(self):
        self.status = self.Status.EXPIRED
        self.save(update_fields=["status"])