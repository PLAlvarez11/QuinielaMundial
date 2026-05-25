"""
M4 — Tabla de Posiciones URLs
Complete endpoint configuration for league standings
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'tabla_posiciones'

# Create router for ViewSet
router = DefaultRouter()
router.register(r'standings', views.LeagueStandingsViewSet, basename='standings')

urlpatterns = [
    # Include all ViewSet routes
    path('', include(router.urls)),
    
    # Explicit action routes (optional, for clarity)
    path('api/standings/by-league/', views.LeagueStandingsViewSet.as_view({'get': 'by_league'}), name='standings-by-league'),
    path('api/standings/user-standing/', views.LeagueStandingsViewSet.as_view({'get': 'user_standing'}), name='standings-user-standing'),
    path('api/standings/top-scorers/', views.LeagueStandingsViewSet.as_view({'get': 'top_scorers'}), name='standings-top-scorers'),
    path('api/standings/<int:pk>/competitors/', views.LeagueStandingsViewSet.as_view({'get': 'competitors'}), name='standings-competitors'),
    path('api/standings/league-stats/', views.LeagueStandingsViewSet.as_view({'get': 'league_stats'}), name='standings-league-stats'),
    path('api/standings/<int:pk>/export/', views.LeagueStandingsViewSet.as_view({'get': 'export'}), name='standings-export'),
    path('api/standings/refresh-cache/', views.LeagueStandingsViewSet.as_view({'post': 'refresh_cache'}), name='standings-refresh-cache'),
]

"""
AVAILABLE ENDPOINTS:

1. LIST & DETAIL:
   GET  /standings/                      — List all standings (paginated)
   GET  /standings/{id}/                 — Get specific standing detail
   GET  /standings/?league_id=1          — Filter by league
   GET  /standings/?user_id=5            — Filter by user
   GET  /standings/?search=TeamName      — Search by team name

2. CUSTOM ACTIONS:
   GET  /standings/by_league/
        ?league_id=1                     — Get standings for league (paginated)
   
   GET  /standings/user_standing/
        ?user_id=5&league_id=1           — Get user's standing in league
   
   GET  /standings/top_scorers/
        ?league_id=1&limit=10            — Top scorers in league
   
   GET  /standings/{id}/competitors/     — Players ranked nearby
   
   GET  /standings/league_stats/
        ?league_id=1                     — League aggregate stats
   
   GET  /standings/{id}/export/
        ?format=csv&league_id=1          — Export standings as CSV
   
   POST /standings/refresh_cache/        — Clear cache (admin only)
        Body: {"league_id": 1}

3. PAGINATION:
   GET  /standings/?page=1&page_size=25  — Custom page size (max: 100)

4. SORTING:
   GET  /standings/?ordering=-total_points    — Sort by points (desc)
   GET  /standings/?ordering=joined_at        — Sort by join date

5. FILTERING & SEARCH:
   GET  /standings/?league_id=1&user_id=5    — Multiple filters
   GET  /standings/?search=john               — Search username/team

RESPONSE EXAMPLES:

Single Standing (Detail):
{
  "league_member_id": 42,
  "league_id": 1,
  "user_id": 5,
  "username": "john_doe",
  "email": "john@example.com",
  "team_name": "Dream Team",
  "total_points": 45,
  "rank": 3,
  "position_delta": 2,  // Improved by 2 positions
  "position_trend": "⬆ +2",
  "is_rising": true,
  "is_falling": false,
  "scored_predictions": 12,
  "total_predictions": 15,
  "correct_predictions": 11,
  "exact_score_percentage": 25.5,
  "hit_rate": 91.67,
  "accuracy_label": "EXCELLENT",
  "joined_at": "2024-05-15T10:30:00Z",
  "last_updated": "2026-05-24T14:20:00Z"
}

List Response (Paginated):
{
  "count": 150,
  "next": "http://api/standings/?page=2",
  "previous": null,
  "results": [
    {...},  // Standing objects
  ]
}

Top Scorers Response:
{
  "count": 10,
  "results": [
    {
      "league_member_id": 1,
      "rank": 1,
      "team_name": "Champions",
      "total_points": 150,
      "position_delta": 0
    },
    ...
  ]
}

League Stats Response:
{
  "league_id": 1,
  "stats": {
    "total_members": 25,
    "avg_points": 45.6,
    "max_points": 150,
    "min_points": 5
  }
}

Competitors Response:
{
  "current_player": {...},  // Current user's standing
  "competitors": [...],     // 5 above, 5 below
  "total_in_league": 25
}
"""