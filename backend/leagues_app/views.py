from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import League, LeagueMember, Invitation
from .serializers import LeagueSerializer, LeagueMemberSerializer, InvitationSerializer

class LeagueViewSet(viewsets.ModelViewSet):
    queryset = League.objects.all()
    serializer_class = LeagueSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        """Establece automáticamente el owner como el usuario autenticado"""
        serializer.save(owner=self.request.user)

class LeagueMemberViewSet(viewsets.ModelViewSet):
    queryset = LeagueMember.objects.all()
    serializer_class = LeagueMemberSerializer

class InvitationViewSet(viewsets.ModelViewSet):
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        """Genera token, establece expiracion e invited_by automáticamente"""
        import uuid
        from django.utils import timezone
        from datetime import timedelta
        
        # Generar token único
        token = str(uuid.uuid4())
        
        # Establecer expiracion a 7 días en el futuro
        expires_at = timezone.now() + timedelta(days=7)
        
        # Guardar con invited_by como usuario autenticado
        serializer.save(
            token=token,
            expires_at=expires_at,
            invited_by=self.request.user
        )
    serializer_class = InvitationSerializer