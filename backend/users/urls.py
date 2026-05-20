from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import LoginView, LogoutView, MeView, RegisterView, UsersAdminViewSet

router = DefaultRouter()
router.register(r'users', UsersAdminViewSet, basename='users')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('login/', LoginView.as_view(), name='auth-login'),
    path('logout/', LogoutView.as_view(), name='auth-logout'),
    path('about-me/', MeView.as_view(), name='auth-me'),
    path('', include(router.urls)),
]
