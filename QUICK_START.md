# 🚀 Quick Start - Prize Distribution CRUD

## ⚡ En 5 Minutos

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

### 4. Acceder
```
Abre http://localhost:5173 en el navegador
Navega a: /prizes
```

---

## ✅ Verificar que Todo Funciona

### ✓ Paso 1: Listar Premios
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

---

## 🔧 Configuración Mínima

### Backend Django - Verificar

```python
# settings.py debe tener:
INSTALLED_APPS = [
    'rest_framework',
    'corsheaders',  # si está en distinto puerto
    'prizes',
    'leagues_app',
]

# urls.py debe tener:
urlpatterns = [
    path('api/prizes/', include('prizes.urls')),
    path('api/leagues/', ...),
    path('api/league-members/', ...),
]
```

### Frontend - Verificar

```javascript
// src/api/axiosConfig.js
const API_BASE_URL = 'http://localhost:8000/api';
// ✅ Si backend está en otro puerto, cambiar aquí
```

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
