from django.db import models
from django.conf import settings
from django.db.models import Sum

# Usar modelos compartidos del resto de la aplicación
from catalogo.models import Match
from prediction_engine.models import Prediction


class Standing(models.Model):
    """Modelo para la tabla de posiciones"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    round_number = models.IntegerField(default=1)
    position = models.IntegerField()
    total_points = models.IntegerField(default=0)
    previous_position = models.IntegerField(blank=True, null=True)
    position_change = models.IntegerField(default=0)  # -1 descendió, 0 igual, 1 ascendió
    created_at = models.DateTimeField(auto_now_add=True)

    @staticmethod
    def _user_display_name(user):
        return getattr(user, 'name', None) or getattr(user, 'email', None) or str(user)

    def __str__(self):
        return f"{self._user_display_name(self.user)} - Jornada {self.round_number}: Pos {self.position} ({self.total_points} pts)"

    @property
    def position_variation(self):
        """Devuelve la variación de posición como string"""
        if self.previous_position is None:
            return "Nuevo"
        elif self.position < self.previous_position:
            return f"↑{self.previous_position - self.position}"
        elif self.position > self.previous_position:
            return f"↓{self.position - self.previous_position}"
        else:
            return "="

    class Meta:
        verbose_name = "Posición"
        verbose_name_plural = "Tabla de Posiciones"
        unique_together = ['user', 'round_number']
        ordering = ['round_number', 'position']
        indexes = [
            models.Index(fields=['round_number', 'position']),
        ]

    @staticmethod
    def update_standings_for_round(round_number):
        """Actualiza la tabla de posiciones para una jornada específica"""
        match_field_names = {field.name for field in Match._meta.get_fields() if hasattr(field, 'name')}

        prediction_filters = {
            'points__isnull': False,
        }

        if 'round_number' in match_field_names:
            prediction_filters['match__round_number__lte'] = round_number

        if 'is_finished' in match_field_names:
            prediction_filters['match__is_finished'] = True
        elif 'status' in match_field_names:
            prediction_filters['match__status'] = 'finished'

        # Agregamos puntos usando el modelo `Prediction` central (prediction_engine)
        # Consideramos solo predicciones ya puntuadas (points no nulo)
        predictions_qs = Prediction.objects.filter(**prediction_filters).values('user').annotate(
            total_points=Sum('points')
        ).order_by('-total_points')

        # Limpiar posiciones anteriores para esta jornada
        Standing.objects.filter(round_number=round_number).delete()

        previous_standings = {}
        if round_number > 1:
            prev_standings = Standing.objects.filter(round_number=round_number - 1)
            previous_standings = {s.user_id: s.position for s in prev_standings}

        standings_to_create = []
        for idx, pred_data in enumerate(predictions_qs, 1):
            user_id = pred_data['user']
            total_points = pred_data['total_points'] or 0
            previous_position = previous_standings.get(user_id)

            position_change = 0
            if previous_position is not None:
                if idx < previous_position:
                    position_change = 1  # Ascendió
                elif idx > previous_position:
                    position_change = -1  # Descendió

            standing = Standing(
                user_id=user_id,
                round_number=round_number,
                position=idx,
                total_points=total_points,
                previous_position=previous_position,
                position_change=position_change,
            )
            standings_to_create.append(standing)

        Standing.objects.bulk_create(standings_to_create)
