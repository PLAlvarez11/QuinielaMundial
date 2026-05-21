# 🚀 Quick Start - Módulos CRUD de QuinielaMundial

## 📦 Módulos Disponibles

Se han implementado 2 módulos CRUD completos:

1. **Prize Distribution (M6)** - Gestión de premios
2. **Catálogo del Mundial (M5)** - Gestión de datos del mundial

---

## ⚡ Inicio Rápido (Prize Distribution)

### 1. Instalar Dependencias (ya está hecho)
```bash
cd frontend
npm install  # ✅ Ya instalado: axios, bootstrap, react-icons
```

### 2. Iniciar Backend
```bash
cd backend
python manage.py runserver
# El backend debe estar en http://localhost:8000
```

### 3. Iniciar Frontend
```bash
cd frontend
npm run dev
# El frontend estará en http://localhost:5173
```

### 4. Acceder a Prize Distribution
```
Abre http://localhost:5173 en el navegador
Navega a: /prizes
```

### 5. Acceder a Catálogo
```
Abre http://localhost:5173 en el navegador
Navega a: /catalogo/venues
# O a través del menú M5 - Administración del Mundial
```

---

## ✅ Verificar que Todo Funciona

### ✓ Paso 1: Listar (Prize Distribution)
```
Deberías ver:
- Página con tabla (vacía si no hay datos)
- Botón "Nuevo Premio"
- Filtros de búsqueda
```

### ✓ Paso 2: Crear Premio
```
1. Click en "Nuevo Premio"
2. Selecciona una liga
3. Selecciona un miembro (carga automáticamente)
4. Completa los demás campos
5. Click en "Guardar"
6. Deberías ser redirigido al listado
```

### ✓ Paso 3: Editar Premio
```
1. En el listado, click en icono de editar
2. Los datos cargan en el formulario
3. Modifica lo que necesites
4. Click en "Guardar"
5. Vuelve al listado
```

### ✓ Paso 4: Eliminar Premio
```
1. En el listado, click en icono de eliminar
2. Aparece modal de confirmación
3. Click en "Eliminar"
4. Desaparece de la tabla
```

### ✓ Paso 5: Catálogo - Crear Datos
```
1. Navega a /catalogo/venues
2. Click en "+ Nuevo Venue"
3. Completa nombre, ciudad, país
4. Click en "Guardar"
5. Aparece en la tabla
```

---

## 🔧 Configuración Mínima

### Backend Django - Verificar

```python
# settings.py debe tener:
INSTALLED_APPS = [
    'rest_framework',
    'corsheaders',
    'prizes',
    'leagues_app',
    'catalogo',        # ← NUEVO
]

# urls.py debe tener:
urlpatterns = [
    path('api/prizes/', include('prizes.urls')),
    path('api/leagues/', ...),
    path('api/league-members/', ...),
    path('api/catalogo/', include('catalogo.urls')),  # ← NUEVO
]
```

### Frontend - Verificar

```javascript
// src/api/axiosConfig.js
const API_BASE_URL = 'http://localhost:8000/api';
// ✅ Si backend está en otro puerto, cambiar aquí
```

---

## 📚 Documentación Completa

### Prize Distribution (M6)
- 📖 [GUIDE_PRIZE_DISTRIBUTION.md](./GUIDE_PRIZE_DISTRIBUTION.md) - Guía completa
- 📋 [EXAMPLES_USAGE.md](./EXAMPLES_USAGE.md) - 10 ejemplos prácticos
- 🔧 [backend/prizes/INTEGRATION_GUIDE.md](./backend/prizes/INTEGRATION_GUIDE.md) - Integración Django

### Catálogo del Mundial (M5)
- 📖 [CATALOGO_QUICK_START.md](./CATALOGO_QUICK_START.md) - Guía rápida para usuarios
- 🔧 [CATALOGO_INTEGRATION.md](./CATALOGO_INTEGRATION.md) - Integración técnica
- 📋 [CATALOGO_CHECKLIST.md](./CATALOGO_CHECKLIST.md) - Checklist de verificación
- 📚 [src/pages/catalogo/README.md](./src/pages/catalogo/README.md) - Referencia técnica

---

## 🎯 Rutas Principales

### Prize Distribution
```
/prizes              - Listar premios
/prizes/create       - Crear premio
/prizes/edit/:id     - Editar premio
```

### Catálogo
```
/catalogo/venues                    - Listar sedes
/catalogo/stadiums                  - Listar estadios
/catalogo/countries                 - Listar países
/catalogo/tournament-stages         - Listar fases
/catalogo/groups                    - Listar grupos
/catalogo/group-countries           - Listar asignaciones
/catalogo/matches                   - Listar partidos
```

---

## 🐛 Troubleshooting

### Error: "Network Error" o "Cannot fetch"
```bash
# 1. Verificar que backend está corriendo
cd backend && python manage.py runserver

# 2. Verificar que frontend está corriendo
cd frontend && npm run dev

# 3. Verificar puertos:
# Backend: http://localhost:8000
# Frontend: http://localhost:5173
```

### Error: "Unauthorized" o "401"
```
1. Asegúrate de tener token válido
2. Inicia sesión primero en M1 (Auth)
3. Verifica que el token está en localStorage
```

### Tablas vacías
```
1. ¿Creaste registros? Click en "+ Nuevo [Entidad]"
2. ¿Backend está respondiendo? Abre F12 → Network
3. ¿Datos existen en BD? Verifica backend
```

### Selects dinámicos vacíos
```
Para Catálogo:
1. Crear Países primero
2. Luego Sedes
3. Luego Estadios (necesita Sedes)
4. Luego Fases
5. Luego Grupos (necesita Fases)
```

---

## 🚀 Próximos Pasos

1. **Completa los datos del Catálogo** (CATALOGO_QUICK_START.md)
2. **Configura premios** (GUIDE_PRIZE_DISTRIBUTION.md)
3. **Integra en App.jsx** (si aún no está)
4. **Prueba en diferentes navegadores**
5. **Verifica responsive en mobile**

---

## 📱 Testing

### Desktop
```
✅ Abre http://localhost:5173/catalogo/venues
✅ Prueba búsqueda, ordenamiento
✅ Crea, edita, elimina registros
```

### Mobile (F12 en Chrome)
```
✅ Abre DevTools (F12)
✅ Click en Toggle Device Toolbar (Ctrl+Shift+M)
✅ Selecciona dispositivo mobile
✅ Verifica que todo funciona
```

---

## 💡 Tips

1. **Estructura de datos**: Lee CATALOGO_QUICK_START.md para saber en qué orden crear datos
2. **Validaciones**: Revisa mensajes de error para saber qué falta
3. **Búsqueda**: Funciona en tiempo real mientras escribes
4. **Ordenamiento**: Haz click en headers de tabla para ordenar
5. **Sidebar**: En mobile, el menú se convierte en grid

---

## 📞 Soporte

### Documentos Rápidos
- Usuarios: CATALOGO_QUICK_START.md
- Desarrolladores: CATALOGO_INTEGRATION.md
- Técnico: src/pages/catalogo/README.md

### Logs del Navegador
```
Abre F12 → Console
Busca errores rojos
Verifica Network tab para requests fallidas
```

---

**Versión**: 2.0 (Prize Distribution + Catálogo)
**Última Actualización**: Mayo 2026


---

## 📝 Rutas Disponibles

```
/prizes                    → Listado de premios
/prizes/create             → Crear nuevo premio
/prizes/edit/:id           → Editar premio
```

---

## 🆘 Si Algo No Funciona

### Error: "Network Error"
```bash
# 1. Verificar backend
cd backend
python manage.py runserver

# 2. Verificar URL en axiosConfig.js
# Debe ser: http://localhost:8000/api
```

### Error: "Selects vacíos"
```bash
# 1. Verificar que hay datos en:
# http://localhost:8000/api/leagues/
# http://localhost:8000/api/league-members/

# 2. Si está vacío, crear datos en admin
# http://localhost:8000/admin/
```

### Error: "401 Unauthorized"
```bash
# 1. Asegurar que hay autenticación
# 2. Verificar token en localStorage
# 3. Revisar autenticación en settings.py
```

---

## 📂 Estructura de Archivos

```
frontend/src/
├── api/                          # Servicios de API
│   ├── axiosConfig.js           # Configuración axios
│   ├── prizesApi.js             # CRUD de premios
│   └── leaguesApi.js            # Ligas y miembros
│
├── components/                   # Componentes reutilizables
│   ├── PrizeForm.jsx            # Formulario
│   ├── PrizeTable.jsx           # Tabla
│   ├── ConfirmModal.jsx         # Modal
│   ├── Loader.jsx               # Cargando
│   └── Toast.jsx                # Notificaciones
│
├── hooks/                        # Hooks personalizados
│   └── useToast.js              # Toast hook
│
└── pages/M6PrizeDistribution/    # Páginas del módulo
    ├── PrizeList.jsx            # Listado
    ├── PrizeCreate.jsx          # Crear
    ├── PrizeEdit.jsx            # Editar
    └── main.jsx                 # Entrada
```

---

## 🎯 Próximas Acciones

### 1. Explorar el Código
```bash
# Ver la estructura
ls -la src/components/
ls -la src/pages/M6PrizeDistribution/
```

### 2. Leer Documentación
```
1. PROJECT_SUMMARY.md         - Resumen del proyecto
2. GUIDE_PRIZE_DISTRIBUTION.md - Guía completa
3. EXAMPLES_USAGE.md          - 10 ejemplos prácticos
```

### 3. Probar en Navegador
```
1. Abrir DevTools (F12)
2. Consola para ver logs
3. Network para ver requests
4. Elements para inspeccionar HTML
```

---

## 💡 Tips Útiles

### Ver datos en API
```javascript
// En consola del navegador:
fetch('http://localhost:8000/api/prizes/prize-distributions/')
  .then(r => r.json())
  .then(d => console.log(d))
```

### Crear dato de prueba
```bash
# En Django shell
python manage.py shell
from prizes.models import PrizeDistribution
# Crear dato...
```

### Revisar logs
```bash
# Backend
# Ver logs en terminal donde corre python manage.py runserver

# Frontend
# Ver logs en DevTools Console (F12)
```

---

## 🚀 Comandos Rápidos

```bash
# Backend
cd backend && python manage.py runserver

# Frontend
cd frontend && npm run dev

# Linter Frontend
npm run lint

# Build Frontend
npm run build
```

---

## 🎉 ¡Listo!

Tu CRUD está completamente funcional. 

**Estado**: ✅ Listo para usar
**Próximo paso**: Abrir navegador en http://localhost:5173/prizes

---

## 📞 Documentación Completa

Para más detalles, ver:
- `PROJECT_SUMMARY.md` - Resumen completo
- `GUIDE_PRIZE_DISTRIBUTION.md` - Documentación detallada
- `EXAMPLES_USAGE.md` - Ejemplos de código
- `src/pages/M6PrizeDistribution/README.md` - Docs del módulo
- `backend/prizes/INTEGRATION_GUIDE.md` - Integración Django

---

**¿Dudas?** Revisar los archivos README en cada carpeta.
**¿Problemas?** Revisar los logs y la sección de troubleshooting.
**¿Ideas?** Las mejoras futuras están en PROJECT_SUMMARY.md
