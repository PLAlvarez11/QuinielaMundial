from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from django.utils import timezone


class League(models.Model):
    STATUS_CHOICES = [
        ('active', 'Activa'),
        ('paused', 'Pausada'),
        ('finished', 'Finalizada'),
        ('cancelled', 'Cancelada'),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    type = models.CharField(max_length=50)
    entry_fee = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0.00,
        validators=[MinValueValidator(0.00)]
    )
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='owned_leagues'
    )
    status = models.CharField(
        max_length=50, 
        default='active',
        choices=STATUS_CHOICES
    )
    max_members = models.IntegerField(validators=[MinValueValidator(1)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.owner.name})"


class LeagueMember(models.Model):
    STATUS_CHOICES = [
        ('active', 'Activo'),
        ('inactive', 'Inactivo'),
        ('removed', 'Removido'),
    ]

    league = models.ForeignKey(
        League, 
        on_delete=models.CASCADE, 
        related_name='members'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE
    )
    team_name = models.CharField(max_length=255)
    total_points = models.IntegerField(default=0)
    status = models.CharField(
        max_length=50, 
        default='active',
        choices=STATUS_CHOICES
    )
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('league', 'user')
        ordering = ['-total_points']

    def __str__(self):
        return f"{self.user.name} - {self.league.name}"


class Invitation(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('accepted', 'Aceptada'),
        ('rejected', 'Rechazada'),
        ('expired', 'Expirada'),
    ]

    league = models.ForeignKey(
        League, 
        on_delete=models.CASCADE, 
        related_name='invitations'
    )
    email = models.EmailField()
    token = models.CharField(max_length=255, unique=True)
    invited_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='sent_invitations'
    )
    status = models.CharField(
        max_length=50, 
        default='pending',
        choices=STATUS_CHOICES
    )
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)