from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LeagueViewSet, LeagueMemberViewSet, InvitationViewSet

router = DefaultRouter()
router.register(r'leagues', LeagueViewSet)
router.register(r'members', LeagueMemberViewSet)
router.register(r'invitations', InvitationViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('leagues_app.urls')), 
]