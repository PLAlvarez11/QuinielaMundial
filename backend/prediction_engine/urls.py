from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import MatchResultView, PredictionViewSet

router = DefaultRouter()
router.register('', PredictionViewSet, basename='prediction')

urlpatterns = [
    path('', include(router.urls)),
    # Admin: record official match result and trigger scoring
    path(
        'results/<int:match_id>/score/',
        MatchResultView.as_view(),
        name='match-result-score',
    ),
]
