from django.db import models

from django.db import models
from django.contrib.auth.models import User

class League(models.Model):
    # Atributos de SmartSelect_20260504_220141_Samsung Notes.jpg
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    type = models.CharField(max_length=50)
    entry_fee = models.DecimalField(max_digits=10, decimal_places=2)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='leagues') # Relación N:1 con users
    status = models.CharField(max_length=50)
    max_members = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

class LeagueMember(models.Model):
    # Atributos de SmartSelect_20260504_220149_Samsung Notes.jpg
    league = models.ForeignKey(League, on_delete=models.CASCADE, related_name='members') # N:1 con leagues
    user = models.ForeignKey(User, on_delete=models.CASCADE) # N:1 con users
    team_name = models.CharField(max_length=255)
    total_points = models.IntegerField(default=0)
    status = models.CharField(max_length=50)
    joined_at = models.DateTimeField(auto_now_add=True)

class Invitation(models.Model):
    # Atributos de SmartSelect_20260504_220155_Samsung Notes.jpg
    league = models.ForeignKey(League, on_delete=models.CASCADE) # N:1 con leagues
    email = models.EmailField()
    token = models.CharField(max_length=255)
    invited_by = models.ForeignKey(User, on_delete=models.CASCADE) # N:1 con users (owner/invited_by)
    status = models.CharField(max_length=50)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
