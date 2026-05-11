from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.views import View
from django.db import models
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Team, Match, Prediction, Standing
import json


class LeagueTableView(View):
    """Vista para mostrar la tabla de posiciones"""

    def get(self, request):
        # Obtener la jornada más reciente con posiciones calculadas
        latest_round = Standing.objects.order_by('-round_number').first()
        if latest_round:
            round_number = latest_round.round_number
        else:
            round_number = 1

        standings = Standing.objects.filter(round_number=round_number).order_by('position')

        context = {
            'standings': standings,
            'current_round': round_number,
        }
        return render(request, 'tabla_posiciones/league_table.html', context)


class LeagueTableAPIView(APIView):
    """API para obtener datos de la tabla de posiciones"""

    def get(self, request):
        round_number = request.GET.get('round', None)

        if round_number is None:
            # Obtener la jornada más reciente
            latest_round = Standing.objects.order_by('-round_number').first()
            if latest_round:
                round_number = latest_round.round_number
            else:
                return Response({'standings': []})

        standings = Standing.objects.filter(round_number=round_number).order_by('position')
        data = []

        for standing in standings:
            data.append({
                'user': standing.user.username,
                'position': standing.position,
                'total_points': standing.total_points,
                'position_variation': standing.position_variation,
                'previous_position': standing.previous_position,
            })

        return Response({
            'round_number': round_number,
            'standings': data
        })


@method_decorator(csrf_exempt, name='dispatch')
class UpdateMatchResultView(View):
    """Vista para actualizar resultados de partidos"""

    def post(self, request):
        try:
            data = json.loads(request.body)
            match_id = data.get('match_id')
            home_score = data.get('home_score')
            away_score = data.get('away_score')

            match = get_object_or_404(Match, id=match_id)
            match.home_score = home_score
            match.away_score = away_score
            match.is_finished = True
            match.save()

            # Recalcular puntos de predicciones para este partido
            predictions = Prediction.objects.filter(match=match)
            for prediction in predictions:
                prediction.save()  # Esto recalcula los puntos

            # Actualizar tabla de posiciones para todas las jornadas afectadas
            max_round = Match.objects.filter(is_finished=True).aggregate(max_round=models.Max('round_number'))['max_round'] or 1

            for round_num in range(1, max_round + 1):
                Standing.update_standings_for_round(round_num)

            return JsonResponse({'success': True, 'message': 'Resultado actualizado correctamente'})

        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=400)


class MatchesAPIView(APIView):
    """API para obtener partidos"""

    def get(self, request):
        round_number = request.GET.get('round', None)
        finished = request.GET.get('finished', None)

        matches = Match.objects.all()

        if round_number:
            matches = matches.filter(round_number=round_number)

        if finished is not None:
            matches = matches.filter(is_finished=finished.lower() == 'true')

        matches = matches.order_by('match_date')

        data = []
        for match in matches:
            data.append({
                'id': match.id,
                'home_team': match.home_team.name,
                'away_team': match.away_team.name,
                'match_date': match.match_date.isoformat(),
                'round_number': match.round_number,
                'home_score': match.home_score,
                'away_score': match.away_score,
                'is_finished': match.is_finished,
                'result': match.result,
            })

        return Response({'matches': data})


@login_required
def create_prediction(request):
    """Vista para crear predicciones (requiere autenticación)"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            match_id = data.get('match_id')
            home_score = data.get('home_score')
            away_score = data.get('away_score')

            match = get_object_or_404(Match, id=match_id)

            # Verificar que el partido no haya terminado
            if match.is_finished:
                return JsonResponse({'success': False, 'message': 'El partido ya terminó'})

            # Crear o actualizar predicción
            prediction, created = Prediction.objects.update_or_create(
                user=request.user,
                match=match,
                defaults={
                    'predicted_home_score': home_score,
                    'predicted_away_score': away_score,
                }
            )

            return JsonResponse({
                'success': True,
                'message': 'Predicción guardada correctamente',
                'created': created
            })

        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=400)

    return JsonResponse({'success': False, 'message': 'Método no permitido'}, status=405)
