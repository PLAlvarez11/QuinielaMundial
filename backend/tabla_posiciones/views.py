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
from .models import Standing
from catalogo.models import Match
from prediction_engine.models import Prediction
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

        standings = Standing.objects.filter(round_number=round_number).select_related('user').order_by('position')
        data = []

        for standing in standings:
            user_display = getattr(standing.user, 'name', None) or getattr(standing.user, 'email', None) or str(standing.user)
            data.append({
                'user': user_display,
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

            # Actualizar resultado en el modelo Match (defensivo según campos disponibles)
            setattr(match, 'home_score', home_score)
            setattr(match, 'away_score', away_score)
            if hasattr(match, 'status'):
                match.status = 'finished'

            # Guardar campos explícitos si es posible
            save_fields = []
            if hasattr(match, 'home_score'):
                save_fields.append('home_score')
            if hasattr(match, 'away_score'):
                save_fields.append('away_score')
            if hasattr(match, 'status'):
                save_fields.append('status')

            if save_fields:
                match.save(update_fields=save_fields + ['updated_at'] if hasattr(match, 'updated_at') else save_fields)
            else:
                match.save()

            # Recalcular puntos de predicciones para este partido usando el servicio central
            try:
                from prediction_engine.services import score_predictions_for_match
                scored = score_predictions_for_match(match)
            except Exception:
                # Fallback: marcar predicciones como guardadas por compatibilidad
                scored = 0

            # Actualizar tabla de posiciones para todas las jornadas afectadas
            # Intentamos usar campo `round_number` si existe, si no fallback a 1
            try:
                if hasattr(Match, '_meta') and any(f.name == 'round_number' for f in Match._meta.get_fields()):
                    max_round = Match.objects.filter(status='finished').aggregate(max_round=models.Max('round_number'))['max_round'] or 1
                else:
                    max_round = 1
            except Exception:
                max_round = 1

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
            # Filtrado si el campo existe
            try:
                matches = matches.filter(round_number=round_number)
            except Exception:
                pass

        if finished is not None:
            try:
                matches = matches.filter(is_finished=finished.lower() == 'true')
            except Exception:
                # algunos modelos usan `status` en lugar de `is_finished`
                if finished.lower() == 'true':
                    matches = matches.filter(status='finished')

        matches = matches.order_by('match_date')

        data = []
        for match in matches:
            # Serializar de forma defensiva según campos disponibles
            home_name = getattr(match.home_team, 'name', str(match.home_team))
            away_name = getattr(match.away_team, 'name', str(match.away_team))
            match_date = getattr(match, 'match_date', None)
            home_score = getattr(match, 'home_score', None)
            away_score = getattr(match, 'away_score', None)
            is_finished = getattr(match, 'is_finished', None)
            if is_finished is None and hasattr(match, 'status'):
                is_finished = (getattr(match, 'status') == 'finished')

            if home_score is not None and away_score is not None:
                result = f"{home_score}-{away_score}"
            else:
                result = 'Pendiente'

            data.append({
                'id': match.id,
                'home_team': home_name,
                'away_team': away_name,
                'match_date': match_date.isoformat() if match_date else None,
                'round_number': getattr(match, 'round_number', None),
                'home_score': home_score,
                'away_score': away_score,
                'is_finished': is_finished,
                'result': result,
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
            is_finished = getattr(match, 'is_finished', None)
            if is_finished is None and hasattr(match, 'status'):
                is_finished = (getattr(match, 'status') == 'finished')

            if is_finished:
                return JsonResponse({'success': False, 'message': 'El partido ya terminó'})

            # Para usar el modelo central de `Prediction` (prediction_engine)
            # necesitamos la liga; esperar que el cliente envíe `league_id`.
            league_id = data.get('league_id')
            if not league_id:
                return JsonResponse({'success': False, 'message': 'Se requiere league_id para crear una predicción'}, status=400)

            from leagues_app.models import League
            league = get_object_or_404(League, id=league_id)

            # Crear o actualizar predicción en prediction_engine
            prediction, created = Prediction.objects.update_or_create(
                user=request.user,
                match=match,
                league=league,
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
