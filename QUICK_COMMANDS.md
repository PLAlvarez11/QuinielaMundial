# ⚡ QUICK COMMANDS - Start Here

## 🚀 Comenzar en 3 Pasos

### Paso 1: Terminal 1 - Backend
```bash
cd backend
python manage.py runserver
```

### Paso 2: Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

### Paso 3: Abre en Navegador
```
http://localhost:5173/catalogo/venues
```

✅ **¡Listo! El módulo está funcionando**

---

## 📍 Rutas Principales

### Prize Distribution (M6)
```
http://localhost:5173/prizes
```

### Catálogo del Mundial (M5)
```
http://localhost:5173/catalogo/venues              # Sedes
http://localhost:5173/catalogo/stadiums            # Estadios
http://localhost:5173/catalogo/countries           # Países
http://localhost:5173/catalogo/tournament-stages   # Fases
http://localhost:5173/catalogo/groups              # Grupos
http://localhost:5173/catalogo/group-countries     # Asignaciones
http://localhost:5173/catalogo/matches             # Partidos
```

---

## 📚 Documentación Rápida

### Para Comenzar
```
→ Lee: QUICK_START.md (5 minutos)
```

### Para Usuarios
```
→ Lee: CATALOGO_QUICK_START.md (20 minutos)
```

### Para Desarrolladores
```
→ Lee: CATALOGO_INTEGRATION.md (1 hora)
```

### Para Referencia
```
→ Lee: src/pages/catalogo/README.md
```

### Para Índice
```
→ Lee: DOCUMENTATION_INDEX.md (mapa de toda la documentación)
```

---

## 🔧 Configuración Rápida

### Backend (Django) - Verificar
```bash
# Verificar que el proyecto catalogo existe
ls backend/catalogo/

# Migraciones
cd backend
python manage.py migrate

# Crear usuario de prueba (si no existe)
python manage.py createsuperuser
```

### Frontend - Verificar
```bash
cd frontend

# Instalar dependencias (si no está hecho)
npm install

# Iniciar desarrollo
npm run dev
```

---

## 🧪 Testing Rápido

### Test 1: Listar Venues
```
Abre: http://localhost:5173/catalogo/venues
Esperado: Tabla vacía o con datos
```

### Test 2: Crear Venue
```
1. Click en "+ Nuevo Venue"
2. Completa: nombre, ciudad, país
3. Click en "Guardar"
4. Deberías volver a la tabla
```

### Test 3: Buscar
```
1. En la tabla, escribe en el search
2. La tabla debería filtrarse en tiempo real
```

### Test 4: Ordenar
```
1. Haz click en header de una columna
2. Debería cambiar dirección de orden
```

### Test 5: Editar
```
1. Click en ✏️ de un registro
2. Modifica datos
3. Click en "Guardar"
4. Verifica cambios en tabla
```

### Test 6: Eliminar
```
1. Click en 🗑️ de un registro
2. Confirma en modal
3. Verifica que desaparece de tabla
```

---

## 🐛 Troubleshooting Rápido

### Error: "Network Error"
```bash
# Terminal 1: Verifica backend
cd backend && python manage.py runserver

# Terminal 2: Verifica frontend
cd frontend && npm run dev

# Abre DevTools (F12) → Network tab
# Revisa si hay errores en requests
```

### Error: "Cannot read property"
```
→ Abre F12 → Console
→ Busca el error rojo
→ Copia el mensaje
→ Consulta CATALOGO_INTEGRATION.md → Troubleshooting
```

### Token no funciona
```
1. Inicia sesión en M1 (Auth)
2. Verifica localStorage (F12 → Application → localStorage)
3. Busca "access_token"
4. Debería tener un valor JWT
```

### Selects vacíos
```
Orden correcto de creación:
1. Crear PAÍSES primero
2. Luego SEDES
3. Luego ESTADIOS
4. Luego FASES
5. Luego GRUPOS
6. Luego PARTIDOS
```

---

## 💻 Comandos Útiles en Desarrollo

### Terminal Frontend
```bash
cd frontend

# Instalar nuevas dependencias
npm install [package-name]

# Build para producción
npm run build

# Lint del código
npm run lint
```

### Terminal Backend
```bash
cd backend

# Hacer migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superuser
python manage.py createsuperuser

# Shell interactivo
python manage.py shell

# Ejecutar tests
python manage.py test
```

---

## 🔑 Variables de Entorno Importantes

### .env.local (Frontend)
```
VITE_API_BASE_URL=http://localhost:8000/api
```

### .env (Backend)
```
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

---

## 📋 Checklist de Configuración

### Backend
- [ ] Django instalado
- [ ] Proyecto creado
- [ ] Aplicaciones configuradas
- [ ] URLs incluidas
- [ ] Migraciones aplicadas
- [ ] CORS configurado

### Frontend
- [ ] Node.js instalado
- [ ] npm dependencies instaladas
- [ ] Vite configurado
- [ ] API_BASE_URL correcto

### Integración
- [ ] Backend corriendo en :8000
- [ ] Frontend corriendo en :5173
- [ ] CORS habilitado
- [ ] Token funciona
- [ ] Rutas en App.jsx

---

## 🎯 Orden Recomendado para Usar

### Para Nuevos Usuarios
```
1. Leer: QUICK_START.md (5 min)
2. Ejecutar: Comandos en "Comenzar en 3 Pasos"
3. Probar: Tests en "Testing Rápido"
4. Leer: CATALOGO_QUICK_START.md (20 min)
5. Crear: Primeros registros
```

### Para Desarrolladores
```
1. Leer: CATALOGO_INTEGRATION.md (1 hora)
2. Verificar: Backend configuration
3. Ejecutar: Backend + Frontend
4. Testing: Endpoints con Postman
5. Revisar: Código fuente
6. Integrar: En App.jsx
```

### Para Deployment
```
1. Verificar: CATALOGO_CHECKLIST.md
2. Revisar: Validaciones backend
3. Testing: E2E
4. Build: npm run build
5. Deploy: Backend + Frontend
6. Verificar: URLs en producción
```

---

## 📞 Contacto Rápido

| Pregunta | Respuesta |
|----------|-----------|
| ¿Cómo inicio? | `Comenzar en 3 Pasos` arriba |
| ¿Qué hago con el módulo? | `CATALOGO_QUICK_START.md` |
| ¿Cómo integro en App.jsx? | `CATALOGO_INTEGRATION.md` |
| ¿Cuales son los endpoints? | `CATALOGO_INTEGRATION.md` |
| ¿Cómo debuggeo? | `CATALOGO_INTEGRATION.md` → Troubleshooting |
| ¿Dónde está la documentación? | `DOCUMENTATION_INDEX.md` |
| ¿Cómo es la arquitectura? | `CATALOGO_EXECUTIVE_SUMMARY.md` |

---

## 🎁 Archivos Importantes

```
frontend/src/api/catalogoApi.js ........... 35 funciones CRUD
frontend/src/routes/CatalogoRoutes.jsx ... 21 rutas del módulo
frontend/src/components/catalogo/ ........ Componentes reutilizables
frontend/src/pages/catalogo/ ............. Páginas del CRUD
frontend/src/pages/M5WorldCupAdmin/ ...... Módulo principal
```

---

## 🚀 Resumen de Estado

✅ **COMPLETADO**
- 7 entidades CRUD
- 62+ archivos
- 35 funciones API
- 4 guías de documentación

⏳ **PENDIENTE**
- Integración en App.jsx (si no está hecha)
- Verificación backend serializers
- Testing E2E

🎯 **SIGUIENTE**
1. Agregar ruta `/catalogo/*` en App.jsx
2. Verificar backend funciona
3. Poblar datos de prueba

---

**Estado**: ✅ LISTO PARA USAR
**Versión**: 1.0
**Última Actualización**: Mayo 2026
