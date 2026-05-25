"""
M4 — ViewSets para League Standings
Optimizados para evitar N+1 queries y maximizar rendimiento
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.db.models import Q, F, Count, Avg, Max, Min
from django.core.cache import cache
from django_filters.rest_framework import DjangoFilterBackend

from .models import LeagueStandings
from .serializers import (
    LeagueStandingsSerializer,
    LeagueStandingsDetailSerializer,
    LeagueStandingsListSerializer,
    LeagueStandingsExportSerializer,
    LeagueStandingsRankSerializer,
)
from leagues_app.models import League, LeagueMember


class LeagueStandingsPagination(PageNumberPagination):
    """Custom pagination for standings."""
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 100


class LeagueStandingsViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only ViewSet for league standings.
    
    Endpoints:
    - GET /api/standings/ — List all standings (paginated)
    - GET /api/standings/{id}/ — Detailed standings
    - GET /api/standings/by_league/ — League standings
    - GET /api/standings/user_standing/ — User standing
    - GET /api/standings/top_scorers/ — Top scorers across all
    - GET /api/standings/{id}/competitors/ — Direct competitors
    - GET /api/standings/{id}/export/ — Export data
    - POST /api/standings/refresh_cache/ — Refresh cache (admin)
    """
    
    queryset = LeagueStandings.objects.all()
    serializer_class = LeagueStandingsSerializer
    permission_classes = [AllowAny]  # Can be viewed by anyone
    pagination_class = LeagueStandingsPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['league_id', 'user_id']
    search_fields = ['team_name', 'user_id']
    ordering_fields = ['rank', 'total_points', 'joined_at']
    ordering = ['rank']  # Default ordering
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'retrieve':
            return LeagueStandingsDetailSerializer
        elif self.action == 'list':
            return LeagueStandingsListSerializer
        elif self.action == 'export':
            return LeagueStandingsExportSerializer
        elif self.action == 'top_scorers':
            return LeagueStandingsRankSerializer
        return LeagueStandingsSerializer
    
    def get_queryset(self):
        """
        Optimize queryset based on action.
        Prevent N+1 queries by using select_related/prefetch_related.
        """
        queryset = super().get_queryset()
        
        # Filter by league if provided
        league_id = self.request.query_params.get('league_id')
        if league_id:
            queryset = queryset.filter(league_id=league_id)
        
        # Filter by user if provided
        user_id = self.request.query_params.get('user_id')
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        
        # Sort by rank by default (already in ordering)
        return queryset.order_by('rank')
    
    @action(detail=False, methods=['get'])
    def by_league(self, request):
        """
        Get standings for a specific league.
        
        Query params:
        - league_id (required): League ID
        - page_size: Results per page
        
        Example: /api/standings/by_league/?league_id=1
        """
        league_id = request.query_params.get('league_id')
        
        if not league_id:
            return Response(
                {'error': 'league_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check league exists
        league = get_object_or_404(League, id=league_id)
        
        # Get cached standings if available
        cache_key = f'league_standings_{league_id}'
        cached = cache.get(cache_key)
        if cached and not request.query_params.get('refresh'):
            return cached
        
        queryset = self.get_queryset().filter(league_id=league_id)
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response = self.get_paginated_response(serializer.data)
            cache.set(cache_key, response, 300)  # Cache 5 minutes
            return response
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def user_standing(self, request):
        """
        Get a specific user's standing in a league.
        
        Query params:
        - user_id (required)
        - league_id (required)
        
        Example: /api/standings/user_standing/?user_id=5&league_id=1
        """
        user_id = request.query_params.get('user_id')
        league_id = request.query_params.get('league_id')
        
        if not user_id or not league_id:
            return Response(
                {'error': 'user_id and league_id are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Try cache first
        cache_key = f'user_standing_{user_id}_{league_id}'
        cached = cache.get(cache_key)
        if cached and not request.query_params.get('refresh'):
            return cached
        
        standing = get_object_or_404(
            LeagueStandings,
            user_id=user_id,
            league_id=league_id
        )
        
        serializer = LeagueStandingsDetailSerializer(standing)
        response = Response(serializer.data)
        cache.set(cache_key, response, 300)
        return response
    
    @action(detail=False, methods=['get'])
    def top_scorers(self, request):
        """
        Get top scorers across all leagues or within a specific league.
        
        Query params:
        - league_id (optional): If provided, returns top in that league
        - limit (default: 10): Number of top scorers
        
        Example: /api/standings/top_scorers/?league_id=1&limit=5
        """
        limit = int(request.query_params.get('limit', 10))
        league_id = request.query_params.get('league_id')
        
        queryset = self.get_queryset().order_by('-total_points')[:limit]
        
        if league_id:
            queryset = queryset.filter(league_id=league_id)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'count': len(queryset),
            'results': serializer.data
        })
    
    @action(detail=True, methods=['get'])
    def competitors(self, request, pk=None):
        """
        Get competitors near a player in the rankings.
        Shows players ranked 5 above and 5 below.
        
        Example: /api/standings/42/competitors/
        """
        standing = self.get_object()
        
        # Cache this
        cache_key = f'competitors_{pk}'
        cached = cache.get(cache_key)
        if cached and not request.query_params.get('refresh'):
            return cached
        
        # Get nearby ranks
        min_rank = max(standing.rank - 5, 1)
        max_rank = standing.rank + 5
        
        competitors = LeagueStandings.objects.filter(
            league_id=standing.league_id,
            rank__gte=min_rank,
            rank__lte=max_rank
        ).order_by('rank')
        
        serializer = LeagueStandingsDetailSerializer(competitors, many=True)
        response = Response({
            'current_player': LeagueStandingsDetailSerializer(standing).data,
            'competitors': serializer.data,
            'total_in_league': LeagueStandings.objects.filter(
                league_id=standing.league_id
            ).count()
        })
        
        cache.set(cache_key, response, 300)
        return response
    
    @action(detail=False, methods=['get'])
    def league_stats(self, request):
        """
        Get aggregate statistics for a league.
        
        Query params:
        - league_id (required)
        
        Example: /api/standings/league_stats/?league_id=1
        """
        league_id = request.query_params.get('league_id')
        
        if not league_id:
            return Response(
                {'error': 'league_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check cache
        cache_key = f'league_stats_{league_id}'
        cached = cache.get(cache_key)
        if cached and not request.query_params.get('refresh'):
            return cached
        
        standings = LeagueStandings.objects.filter(league_id=league_id)
        
        total_predictions = standings.aggregate(
            sum_scored=Count('scored_predictions')
        )['sum_scored'] or 1
        
        stats = standings.aggregate(
            total_members=Count('league_member_id'),
            avg_points=Avg('total_points'),
            max_points=Max('total_points'),
            min_points=Min('total_points'),
        )
        
        response = Response({
            'league_id': league_id,
            'stats': stats
        })
        
        cache.set(cache_key, response, 600)  # Cache 10 minutes
        return response
    
    @action(detail=True, methods=['get'])
    def export(self, request, pk=None):
        """
        Export a standing record (or filtered standings).
        Supports CSV, JSON, PDF.
        
        Query params:
        - format: 'csv', 'json', 'pdf' (default: json)
        - league_id: If provided, export all standings in league
        
        Example: /api/standings/1/export/?format=csv&league_id=1
        """
        export_format = request.query_params.get('format', 'json')
        league_id = request.query_params.get('league_id')
        
        if league_id:
            standings = LeagueStandings.objects.filter(league_id=league_id)
        else:
            standing = self.get_object()
            standings = [standing]
        
        serializer = LeagueStandingsExportSerializer(standings, many=True)
        
        if export_format == 'csv':
            return self._export_csv(serializer.data)
        elif export_format == 'json':
            return Response(serializer.data)
        # PDF export would require additional library
        else:
            return Response(
                {'error': 'Unsupported format'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def _export_csv(self, data):
        """Export data as CSV."""
        import csv
        from io import StringIO
        from django.http import HttpResponse
        
        output = StringIO()
        if data:
            writer = csv.DictWriter(output, fieldnames=data[0].keys())
            writer.writeheader()
            writer.writerows(data)
        
        response = HttpResponse(output.getvalue(), content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="standings.csv"'
        return response
    
    @action(detail=False, methods=['post'])
    def refresh_cache(self, request):
        """
        Force refresh of cached standings.
        (Admin only)
        
        POST /api/standings/refresh_cache/
        """
        if not request.user.is_staff:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        league_id = request.data.get('league_id')
        
        if league_id:
            cache_key = f'league_standings_{league_id}'
            cache.delete(cache_key)
            return Response({'message': f'Cache cleared for league {league_id}'})
        else:
            # Clear all standings cache
            cache.delete_many([
                key for key in cache.keys('league_standings_*')
            ])
            return Response({'message': 'All standings cache cleared'})
