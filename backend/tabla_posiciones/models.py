from django.db import models
from django.conf import settings
from django.db.models import Sum, Case, When, IntegerField


class Team(models.Model):
    """Modelo para los equipos del torneo"""
    name = models.CharField(max_length=100, unique=True)
    country = models.CharField(max_length=100)
    group = models.CharField(max_length=1, blank=True, null=True)  # Para grupos en Mundial
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.country})"

    class Meta:
        verbose_name = "Equipo"
        verbose_name_plural = "Equipos"


class Match(models.Model):
    """Modelo para los partidos"""
    home_team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='home_matches')
    away_team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='away_matches')
    match_date = models.DateTimeField()
    round_number = models.IntegerField(default=1)  # Jornada o ronda
    home_score = models.IntegerField(blank=True, null=True)
    away_score = models.IntegerField(blank=True, null=True)
    is_finished = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.home_team} vs {self.away_team} - Jornada {self.round_number}"

    @property
    def result(self):
        """Devuelve el resultado del partido"""
        if not self.is_finished:
            return "Pendiente"
        return f"{self.home_score}-{self.away_score}"

    class Meta:
        verbose_name = "Partido"
        verbose_name_plural = "Partidos"
        ordering = ['match_date']


class Prediction(models.Model):
    """Modelo para las predicciones de los usuarios"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    match = models.ForeignKey(Match, on_delete=models.CASCADE)
    predicted_home_score = models.IntegerField()
    predicted_away_score = models.IntegerField()
    points_earned = models.IntegerField(default=0)  # Puntos obtenidos por esta predicción
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.match}: {self.predicted_home_score}-{self.predicted_away_score}"

    def calculate_points(self):
        """Calcula los puntos obtenidos por esta predicción"""
        if not self.match.is_finished:
            return 0

        # Puntos por acertar el resultado exacto
        if (self.predicted_home_score == self.match.home_score and
            self.predicted_away_score == self.match.away_score):
            return 3  # Puntos por resultado exacto

        # Puntos por acertar el ganador o empate
        actual_winner = None
        if self.match.home_score > self.match.away_score:
            actual_winner = 'home'
        elif self.match.away_score > self.match.home_score:
            actual_winner = 'away'
        else:
            actual_winner = 'draw'

        predicted_winner = None
        if self.predicted_home_score > self.predicted_away_score:
            predicted_winner = 'home'
        elif self.predicted_away_score > self.predicted_home_score:
            predicted_winner = 'away'
        else:
            predicted_winner = 'draw'

        if actual_winner == predicted_winner:
            return 1  # Punto por acertar el resultado (ganador/empate)

        return 0

    def save(self, *args, **kwargs):
        self.points_earned = self.calculate_points()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Predicción"
        verbose_name_plural = "Predicciones"
        unique_together = ['user', 'match']


class Standing(models.Model):
    """Modelo para la tabla de posiciones"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    round_number = models.IntegerField(default=1)
    position = models.IntegerField()
    total_points = models.IntegerField(default=0)
    previous_position = models.IntegerField(blank=True, null=True)
    position_change = models.IntegerField(default=0)  # -1 descendió, 0 igual, 1 ascendió
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - Jornada {self.round_number}: Pos {self.position} ({self.total_points} pts)"

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

    @staticmethod
    def update_standings_for_round(round_number):
        """Actualiza la tabla de posiciones para una jornada específica"""
        from django.db.models import Sum

        # Obtener todas las predicciones para partidos de esta jornada y anteriores
        predictions = Prediction.objects.filter(
            match__round_number__lte=round_number,
            match__is_finished=True
        ).values('user').annotate(
            total_points=Sum('points_earned')
        ).order_by('-total_points')

        # Limpiar posiciones anteriores para esta jornada
        Standing.objects.filter(round_number=round_number).delete()

        previous_standings = {}
        if round_number > 1:
            # Obtener posiciones de la jornada anterior
            prev_standings = Standing.objects.filter(round_number=round_number-1)
            previous_standings = {s.user_id: s.position for s in prev_standings}

        standings_to_create = []
        for idx, pred_data in enumerate(predictions, 1):
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
                position_change=position_change
            )
            standings_to_create.append(standing)

        Standing.objects.bulk_create(standings_to_create)
