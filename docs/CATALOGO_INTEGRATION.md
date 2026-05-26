# INTEGRACIÓN DEL MÓDULO CATÁLOGO EN APP.JSX

## Estado Actual

El módulo CRUD del Catálogo ya está completamente implementado en:
```
src/pages/catalogo/          # Todas las páginas CRUD
src/components/catalogo/     # Componentes reutilizables
src/api/catalogoApi.js       # Cliente HTTP
src/routes/CatalogoRoutes.jsx # Enrutador del módulo
```

## Pasos para Integración

### Opción 1: Integración Directa (Recomendada)

En tu `App.jsx`, simplemente importa y usa `CatalogoRoutes`:

```javascript
import CatalogoRoutes from './routes/CatalogoRoutes';

// En tu componente App
<Route path="/catalogo/*" element={<CatalogoRoutes />} />
```

Esto automáticamente crea todas estas rutas:
- `/catalogo/venues`
- `/catalogo/venues/create`
- `/catalogo/venues/edit/:id`
- `/catalogo/stadiums`
- `/catalogo/stadiums/create`
- `/catalogo/stadiums/edit/:id`
- Y 15 más para las otras entidades...

### Opción 2: Integración a través de M5WorldCupAdmin

Si ya tienes una página `M5WorldCupAdmin`, actualiza su contenido a:

```javascript
// En src/pages/M5WorldCupAdmin/main.jsx
import CatalogoRoutes from '../../routes/CatalogoRoutes';
import './Catalogo.css';

export default function M5WorldCupAdminMain() {
  return (
    <div className="catalogo-container">
      <div className="catalogo-sidebar">
        {/* Sidebar con menú */}
      </div>
      <div className="catalogo-content">
        <CatalogoRoutes />
      </div>
    </div>
  );
}
```

**Ya está implementado** - Solo necesitas verificar que tu `App.jsx` tiene la ruta hacia este componente.

### Opción 3: Implementación Granular (Si lo necesitas)

Si prefieres importar solo ciertas páginas:

```javascript
import VenueList from './pages/catalogo/VenueList';
import VenueCreate from './pages/catalogo/VenueCreate';
import VenueEdit from './pages/catalogo/VenueEdit';

// En Routes:
<Route path="/catalogo/venues" element={<VenueList />} />
<Route path="/catalogo/venues/create" element={<VenueCreate />} />
<Route path="/catalogo/venues/edit/:id" element={<VenueEdit />} />
```

## Verificación de Integración

### 1. Revisa tu App.jsx
Asegúrate que tiene una ruta hacia el módulo:

```javascript
import CatalogoRoutes from './routes/CatalogoRoutes';

// En el JSX:
<BrowserRouter>
  <Routes>
    <Route path="/catalogo/*" element={<CatalogoRoutes />} />
    {/* otras rutas */}
  </Routes>
</BrowserRouter>
```

### 2. Verifica la Navegación
Asegúrate que tu Navbar/Menu tenga un link:

```javascript
<Link to="/catalogo/venues">Catálogo</Link>
```

### 3. Prueba las Rutas
Una vez que integres, prueba navegando a:
- http://localhost:5173/catalogo/venues
- http://localhost:5173/catalogo/stadiums
- http://localhost:5173/catalogo/countries

## Configuración de Backend Requerida

### URLs en settings.py

Asegúrate que tu Django tiene estas rutas:

```python
# En config/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/catalogo/', include('catalogo.urls')),  # ← IMPORTANTE
]
```

### En catalogo/urls.py

```python
from rest_framework.routers import DefaultRouter
from .views import (
    VenueViewSet, StadiumViewSet, CountryViewSet,
    TournamentStageViewSet, GroupViewSet, 
    GroupCountryViewSet, MatchViewSet
)

router = DefaultRouter()
router.register(r'venues', VenueViewSet)
router.register(r'stadiums', StadiumViewSet)
router.register(r'countries', CountryViewSet)
router.register(r'tournament-stages', TournamentStageViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'group-countries', GroupCountryViewSet)
router.register(r'matches', MatchViewSet)

urlpatterns = router.urls
```

### Serializadores Requeridos

El frontend espera que tus serializadores devuelvan estos campos anidados:

```python
# Para Stadium
class StadiumSerializer(serializers.ModelSerializer):
    venue_name = serializers.CharField(source='venue.name', read_only=True)
    
    class Meta:
        model = Stadium
        fields = ['id', 'name', 'capacity', 'venue', 'venue_name']

# Para Group
class GroupSerializer(serializers.ModelSerializer):
    stage_name = serializers.CharField(source='stage.name', read_only=True)
    
    class Meta:
        model = Group
        fields = ['id', 'name', 'stage', 'stage_name']

# Para Match
class MatchSerializer(serializers.ModelSerializer):
    home_team_name = serializers.CharField(source='home_team.name', read_only=True)
    away_team_name = serializers.CharField(source='away_team.name', read_only=True)
    stadium_name = serializers.CharField(source='stadium.name', read_only=True)
    stage_name = serializers.CharField(source='stage.name', read_only=True)
    
    class Meta:
        model = Match
        fields = [
            'id', 'home_team', 'home_team_name', 'away_team', 'away_team_name',
            'stadium', 'stadium_name', 'stage', 'stage_name', 'group',
            'match_date', 'home_goals', 'away_goals', 'status'
        ]
```

## Variables de Entorno

En tu `.env` frontend, asegúrate que tienes:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Y en `src/api/catalogoApi.js` está configurado:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/catalogo`,
});
```

## Estructuras de Datos Esperadas

### Entidades y Sus Campos

#### Venue (Sede)
```json
{
  "id": 1,
  "name": "Estadio Azteca",
  "city": "México",
  "country": "México"
}
```

#### Stadium (Estadio)
```json
{
  "id": 1,
  "name": "Azteca",
  "capacity": 87506,
  "venue": 1,
  "venue_name": "Estadio Azteca"
}
```

#### Country (País)
```json
{
  "id": 1,
  "name": "Argentina",
  "code": "AR",
  "flag_url": "https://flagcdn.com/w320/ar.png"
}
```

#### TournamentStage (Fase)
```json
{
  "id": 1,
  "name": "Fase de Grupos",
  "order": 1
}
```

#### Group (Grupo)
```json
{
  "id": 1,
  "name": "A",
  "stage": 1,
  "stage_name": "Fase de Grupos"
}
```

#### GroupCountry
```json
{
  "id": 1,
  "group": 1,
  "country": 1,
  "group_name": "A",
  "country_name": "Argentina"
}
```

#### Match (Partido)
```json
{
  "id": 1,
  "home_team": 1,
  "home_team_name": "Argentina",
  "away_team": 2,
  "away_team_name": "Brasil",
  "stadium": 1,
  "stadium_name": "Azteca",
  "stage": 1,
  "stage_name": "Fase de Grupos",
  "group": 1,
  "match_date": "2026-06-21T14:00:00Z",
  "home_goals": 2,
  "away_goals": 1,
  "status": "finished"
}
```

## Testing

### 1. Verificar API Local
```bash
curl http://localhost:8000/api/catalogo/venues/
```

### 2. Verificar Frontend
```bash
npm run dev
# Navega a http://localhost:5173/catalogo/venues
```

### 3. Verificar Token
El frontend espera un JWT token en localStorage:
```javascript
localStorage.getItem('authToken')
```

Si no hay token, primero inicia sesión en M1AuthUsers.

## Checklist de Integración

- [ ] `CatalogoRoutes` importado en `App.jsx`
- [ ] Ruta `/catalogo/*` agregada a Routes
- [ ] Django tiene ViewSets configurados
- [ ] Backend está corriendo en puerto 8000
- [ ] Frontend está corriendo en puerto 5173
- [ ] CORS está habilitado en Django
- [ ] API base URL es correcta
- [ ] Token de autenticación en localStorage
- [ ] Puedes navegar a http://localhost:5173/catalogo/venues
- [ ] Las tablas cargan datos sin errores

## Troubleshooting

### Error 404 en /catalogo/venues
- Verifica que `CatalogoRoutes` está en tu `App.jsx`
- Revisa que la ruta es `/catalogo/*` no `/catalogo`

### Error CORS
- Agrega `http://localhost:5173` a `ALLOWED_ORIGINS` en Django
- O usa `CORS_ALLOW_ALL_ORIGINS = True` en desarrollo

### Datos no cargan en tablas
- Abre F12 → Network y revisa la llamada a `/api/catalogo/venues/`
- Debe devolver un array de objetos
- Verifica que el backend tiene datos

### Token no funciona
- Inicia sesión primero en M1AuthUsers
- Verifica que el token se guarda en localStorage
- Revisa en Network el header `Authorization: Bearer <token>`

## Archivos Checklist

Verifica que estos archivos existen:

```
✓ src/routes/CatalogoRoutes.jsx
✓ src/api/catalogoApi.js
✓ src/components/catalogo/
  ✓ VenueForm.jsx, VenueForm.css
  ✓ VenueTable.jsx, VenueTable.css
  ✓ StadiumForm.jsx, StadiumForm.css
  ✓ StadiumTable.jsx, StadiumTable.css
  ✓ ... (todos los componentes)
✓ src/pages/catalogo/
  ✓ VenueList.jsx, VenueList.css
  ✓ VenueCreate.jsx, VenueCreate.css
  ✓ VenueEdit.jsx, VenueEdit.css
  ✓ ... (todas las páginas)
✓ src/pages/M5WorldCupAdmin/main.jsx (actualizado con CatalogoRoutes)
✓ src/pages/M5WorldCupAdmin/Catalogo.css
```

## Siguiente Pasos

1. **Verificar backend**: Asegúrate que todos los ViewSets están implementados
2. **Probar API**: Usa Postman para verificar que los endpoints funcionan
3. **Integrar rutas**: Agrega la ruta `/catalogo/*` a tu `App.jsx`
4. **Probar frontend**: Navega a `/catalogo/venues` y verifica que carga
5. **Completar datos**: Comienza a poblar datos siguiendo CATALOGO_QUICK_START.md

---

**Nota**: Este módulo es completamente independiente y puede integrarse de forma aislada del resto de la aplicación. Solo necesita acceso a los endpoints de la API y un token de autenticación válido.
