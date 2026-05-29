from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
import uuid

from .models import League, LeagueMember, Invitation
from .serializers import LeagueSerializer, LeagueMemberSerializer, InvitationSerializer
from .permissions import IsLeagueOwner, IsInvitationCreator, CanCreateInvitation
from .utils import send_league_invitation_email


class LeagueViewSet(viewsets.ModelViewSet):
    queryset = League.objects.all()
    serializer_class = LeagueSerializer
    permission_classes = [IsAuthenticated, IsLeagueOwner]

    def perform_create(self, serializer):
        """Crea la liga y automáticamente agrega el owner como miembro"""
        league = serializer.save(owner=self.request.user)
        # Agregar el owner como miembro de la liga
        LeagueMember.objects.create(
            league=league,
            user=self.request.user,
            team_name=f"{self.request.user.name}'s Team"
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def leave_league(self, request, pk=None):
        """Permite a un usuario abandonar una liga"""
        league = self.get_object()
        
        try:
            member = LeagueMember.objects.get(league=league, user=request.user)
            
            # No permitir que el owner abandone la liga
            if league.owner == request.user:
                return Response(
                    {"error": "El propietario no puede abandonar su propia liga"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            member.delete()
            return Response(
                {"message": "Has abandonado la liga exitosamente"},
                status=status.HTTP_200_OK
            )
        except LeagueMember.DoesNotExist:
            return Response(
                {"error": "No eres miembro de esta liga"},
                status=status.HTTP_404_NOT_FOUND
            )


class LeagueMemberViewSet(viewsets.ModelViewSet):
    queryset = LeagueMember.objects.all()
    serializer_class = LeagueMemberSerializer
    permission_classes = [IsAuthenticated]


class InvitationViewSet(viewsets.ModelViewSet):
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer
    permission_classes = [IsAuthenticated, IsInvitationCreator, CanCreateInvitation]

    def perform_create(self, serializer):
        """Genera token, establece expiracion e invited_by automáticamente"""
        token = str(uuid.uuid4())
        expires_at = timezone.now() + timedelta(days=7)
        
        # Validar que la liga exista y que el usuario sea el owner
        league_id = self.request.data.get('league')
        try:
            league = League.objects.get(id=league_id)
            if league.owner != self.request.user:
                raise PermissionError("No eres el propietario de esta liga")
        except League.DoesNotExist:
            raise ValueError("La liga no existe")
        
        # Crear la invitación
        invitation = serializer.save(
            token=token,
            expires_at=expires_at,
            invited_by=self.request.user
        )
        
        # Enviar email de invitación
        recipient_email = self.request.data.get('email')
        if recipient_email:
            send_league_invitation_email(
                recipient_email=recipient_email,
                league_name=league.name,
                invitation_token=token,
                invited_by_name=self.request.user.name
            )

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def accept_invitation(self, request):
        """Acepta una invitación usando el token y agregar el usuario a la liga"""
        token = request.data.get('token')
        team_name = request.data.get('team_name', f"{request.user.username}'s Team")
        
        if not token:
            return Response(
                {"error": "Token es requerido"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            invitation = Invitation.objects.get(token=token)
            
            # Validar que no haya expirado
            if timezone.now() > invitation.expires_at:
                return Response(
                    {"error": "La invitación ha expirado"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validar que el email coincida
            if invitation.email != request.user.email:
                return Response(
                    {"error": "El email del token no coincide con tu usuario"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Validar que no esté ya procesada
            if invitation.status != 'pending':
                return Response(
                    {"error": "Esta invitación ya fue procesada"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            league = invitation.league
            
            # Validar que no sea miembro ya
            if LeagueMember.objects.filter(league=league, user=request.user).exists():
                return Response(
                    {"error": "Ya eres miembro de esta liga"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validar límite de miembros
            if league.members.count() >= league.max_members:
                return Response(
                    {"error": "La liga ha alcanzado el máximo de miembros"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Crear el miembro
            LeagueMember.objects.create(
                league=league,
                user=request.user,
                team_name=team_name
            )
            
            # Marcar invitación como aceptada
            invitation.status = 'accepted'
            invitation.save()
            
            return Response(
                {
                    "message": "Invitación aceptada exitosamente",
                    "league": LeagueSerializer(league).data
                },
                status=status.HTTP_200_OK
            )
        
        except Invitation.DoesNotExist:
            return Response(
                {"error": "Token inválido"},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def reject_invitation(self, request):
        """Rechaza una invitación usando el token"""
        token = request.data.get('token')
        
        if not token:
            return Response(
                {"error": "Token es requerido"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            invitation = Invitation.objects.get(token=token)
            
            # Validar que el email coincida
            if invitation.email != request.user.email:
                return Response(
                    {"error": "No tienes permiso para rechazar esta invitación"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Validar que no esté ya procesada
            if invitation.status != 'pending':
                return Response(
                    {"error": "Esta invitación ya fue procesada"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Marcar invitación como rechazada
            invitation.status = 'rejected'
            invitation.save()
            
            return Response(
                {"message": "Invitación rechazada"},
                status=status.HTTP_200_OK
            )
        
        except Invitation.DoesNotExist:
            return Response(
                {"error": "Token inválido"},
                status=status.HTTP_404_NOT_FOUND
            )