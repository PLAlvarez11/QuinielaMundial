# Configuración Backend Django REST Framework para M6 - Prize Distribution

## Verificar que los modelos existan

```python
# prizes/models.py
from django.db import models

class PrizeDistribution(models.Model):
    POSITION_CHOICES = [
        ('first', 'Primer lugar'),
        ('second', 'Segundo lugar'),
        ('third', 'Tercer lugar'),
        ('last', 'Último lugar'),
        ('global_individual', 'Premio global individual'),
        ('global_league', 'Premio global por liga'),
    ]

    TYPE_CHOICES = [
        ('league', 'Premio de liga'),
        ('global', 'Premio global'),
        ('tie', 'Premio por empate'),
    ]

    league = models.ForeignKey(
        'leagues_app.League',
        on_delete=models.PROTECT,
        related_name='prize_distributions'
    )

    member = models.ForeignKey(
        'leagues_app.LeagueMember',
        on_delete=models.PROTECT,
        related_name='prize_distributions'
    )

    position = models.CharField(
        max_length=30,
        choices=POSITION_CHOICES
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default='league'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.league} - {self.member} - {self.position}"

    class Meta:
        verbose_name_plural = "Prize Distributions"
```

## Serializers

```python
# prizes/serializers.py
from rest_framework import serializers
from .models import PrizeDistribution
from leagues_app.models import League, LeagueMember

class PrizeDistributionSerializer(serializers.ModelSerializer):
    league_name = serializers.CharField(source='league.name', read_only=True)
    member_name = serializers.CharField(source='member.user.username', read_only=True)
    
    class Meta:
        model = PrizeDistribution
        fields = [
            'id',
            'league',
            'league_name',
            'member',
            'member_name',
            'position',
            'amount',
            'type',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']
```

## ViewSets y Routers

```python
# prizes/views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import PrizeDistribution
from .serializers import PrizeDistributionSerializer

class PrizeDistributionViewSet(viewsets.ModelViewSet):
    queryset = PrizeDistribution.objects.all()
    serializer_class = PrizeDistributionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Permitir filtrado por liga, miembro, tipo y posición
        queryset = PrizeDistribution.objects.all()
        
        league = self.request.query_params.get('league')
        if league:
            queryset = queryset.filter(league=league)
            
        member = self.request.query_params.get('member')
        if member:
            queryset = queryset.filter(member=member)
            
        prize_type = self.request.query_params.get('type')
        if prize_type:
            queryset = queryset.filter(type=prize_type)
            
        position = self.request.query_params.get('position')
        if position:
            queryset = queryset.filter(position=position)
            
        return queryset.order_by('-created_at')
```

```python
# prizes/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PrizeDistributionViewSet

router = DefaultRouter()
router.register('prize-distributions', PrizeDistributionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
```

## CORS Configuration

Si el frontend y backend están en diferentes puertos, necesitas CORS:

```python
# config/settings.py
INSTALLED_APPS = [
    # ... otras apps
    'corsheaders',
    'rest_framework',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # ... otros middleware
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # Si usas otro puerto
]

CORS_ALLOW_CREDENTIALS = True
```

## Autenticación

Asegurar que el sistema de autenticación está configurado:

```python
# config/settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}
```

## Migrations

Ejecutar migraciones después de crear los modelos:

```bash
python manage.py makemigrations
python manage.py migrate
```

## Testing de Endpoints

```bash
# Obtener token
curl -X POST http://localhost:8000/api/token/ \
  -d "username=admin&password=admin"

# Listar premios
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/prizes/prize-distributions/

# Crear premio
curl -X POST http://localhost:8000/api/prizes/prize-distributions/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "league": 1,
    "member": 1,
    "position": "first",
    "amount": "100.00",
    "type": "league"
  }'

# Actualizar premio
curl -X PUT http://localhost:8000/api/prizes/prize-distributions/1/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "league": 1,
    "member": 1,
    "position": "second",
    "amount": "50.00",
    "type": "league"
  }'

# Eliminar premio
curl -X DELETE http://localhost:8000/api/prizes/prize-distributions/1/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Admin Interface

Registrar el modelo en el admin para gestión:

```python
# prizes/admin.py
from django.contrib import admin
from .models import PrizeDistribution

@admin.register(PrizeDistribution)
class PrizeDistributionAdmin(admin.ModelAdmin):
    list_display = ['league', 'member', 'position', 'amount', 'type', 'created_at']
    list_filter = ['league', 'type', 'position', 'created_at']
    search_fields = ['league__name', 'member__user__username']
    readonly_fields = ['created_at']
```

## Ligas y Miembros

Asegurar que estos endpoints también estén configurados:

```python
# leagues_app/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LeagueViewSet, LeagueMemberViewSet

router = DefaultRouter()
router.register('', LeagueViewSet, basename='league')
router.register('members', LeagueMemberViewSet, basename='league-member')

urlpatterns = [
    path('', include(router.urls)),
]
```

## Requisitos Django

```
Django>=4.0
djangorestframework>=3.14.0
django-cors-headers>=4.0.0
djangorestframework-simplejwt>=5.2.0
```

## Notas Importantes

1. **Campos requeridos en respuestas**: Asegurar que los serializers devuelven `league_name` y `member_name` para mejor UX
2. **Timestamps**: El campo `created_at` debe venir en la respuesta
3. **Validaciones**: Django maneja la validación de modelos automáticamente
4. **Permisos**: Asegurar que solo usuarios autenticados pueden acceder
5. **Filtros**: Los filtros deben funcionar a través de query parameters
