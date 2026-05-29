"""
Utilitarios para el app de ligas.
"""

from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


def send_league_invitation_email(recipient_email, league_name, invitation_token, invited_by_name):
    """
    Envía un email de invitación a una liga.
    
    Args:
        recipient_email: Email del destinatario
        league_name: Nombre de la liga
        invitation_token: Token de la invitación
        invited_by_name: Nombre de quién invita
    """
    try:
        # Construir la URL de aceptación (ajustar según tu frontend)
        frontend_url = settings.FRONTEND_URL if hasattr(settings, 'FRONTEND_URL') else 'http://localhost:5173'
        invitation_link = f"{frontend_url}/m2-league/accept-invitation/{invitation_token}"
        
        subject = f"¡Invitación a la liga {league_name}!"
        
        message = f"""
Hola,

{invited_by_name} te ha invitado a unirte a la liga "{league_name}".

Para aceptar la invitación, haz clic en el siguiente enlace:
{invitation_link}

O copia y pega este token en tu aplicación:
{invitation_token}

Este enlace expirará en 7 días.

¡Que disfrutes del torneo!

---
Quiniela Mundial
        """
        
        html_message = f"""
<html>
  <body>
    <h2>¡Invitación a la liga {league_name}!</h2>
    <p>Hola,</p>
    <p>{invited_by_name} te ha invitado a unirte a la liga "<strong>{league_name}</strong>".</p>
    <p>
      <a href="{invitation_link}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Aceptar invitación
      </a>
    </p>
    <p>O copia y pega este código en tu aplicación:</p>
    <p><code>{invitation_token}</code></p>
    <p><small>Este enlace expirará en 7 días.</small></p>
    <p>¡Que disfrutes del torneo!</p>
    <hr>
    <p>Quiniela Mundial</p>
  </body>
</html>
        """
        message = message.strip()  # Eliminar espacios innecesarios
        html_message = html_message.strip()  # Eliminar espacios innecesarios
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [recipient_email],
            html_message=html_message,
            fail_silently=False,
        )
        
        logger.info(f"Invitación enviada a {recipient_email} para la liga {league_name}")
        return True
        
    except Exception as e:
        logger.error(f"Error enviando invitación a {recipient_email}: {str(e)}")
        print(e)
        return False
