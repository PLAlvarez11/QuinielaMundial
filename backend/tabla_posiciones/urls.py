from django.urls import path
from . import views

app_name = 'tabla_posiciones'

urlpatterns = [
    path('', views.LeagueTableView.as_view(), name='league_table'),
    path('api/standings/', views.LeagueTableAPIView.as_view(), name='api_standings'),
    path('api/matches/', views.MatchesAPIView.as_view(), name='api_matches'),
    path('api/update-match/', views.UpdateMatchResultView.as_view(), name='update_match'),
    path('api/predict/', views.create_prediction, name='create_prediction'),
]