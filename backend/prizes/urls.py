from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PrizeDistributionViewSet

router = DefaultRouter()

router.register(
    r'prize-distributions',
    PrizeDistributionViewSet,
    basename='prize-distributions'
)

urlpatterns = [
    path('', include(router.urls)),
]