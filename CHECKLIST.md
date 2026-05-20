# ✅ Checklist de Verificación - Prize Distribution CRUD

## 📋 Antes de Ejecutar

### Frontend Setup
- [ ] Node.js instalado (`node --version`)
- [ ] npm actualizado (`npm --version`)
- [ ] Directorio `frontend/` existe
- [ ] Archivo `package.json` existe

### Dependencias Instaladas
- [ ] ✅ axios instalado
- [ ] ✅ bootstrap instalado
- [ ] ✅ react-icons instalado
- [ ] ✅ react-router-dom instalado

Verificar con:
```bash
npm list axios bootstrap react-icons react-router-dom
```

### Backend Setup
- [ ] Python instalado (`python --version`)
- [ ] Django instalado (`python manage.py --version`)
- [ ] Backend ejecutándose en `http://localhost:8000`
- [ ] Admin accesible en `http://localhost:8000/admin`

---

## 📁 Archivos Creados - Verificar

### API Services
- [ ] ✅ `src/api/axiosConfig.js`
- [ ] ✅ `src/api/prizesApi.js`
- [ ] ✅ `src/api/leaguesApi.js`
- [ ] ✅ `src/api/index.js`

### Components
- [ ] ✅ `src/components/PrizeForm.jsx`
- [ ] ✅ `src/components/PrizeForm.css`
- [ ] ✅ `src/components/PrizeTable.jsx`
- [ ] ✅ `src/components/PrizeTable.css`
- [ ] ✅ `src/components/ConfirmModal.jsx`
- [ ] ✅ `src/components/ConfirmModal.css`
- [ ] ✅ `src/components/Loader.jsx`
- [ ] ✅ `src/components/Loader.css`
- [ ] ✅ `src/components/Toast.jsx`
- [ ] ✅ `src/components/Toast.css`
- [ ] ✅ `src/components/index.js`

### Hooks
- [ ] ✅ `src/hooks/useToast.js`
- [ ] ✅ `src/hooks/index.js`

### Pages
- [ ] ✅ `src/pages/M6PrizeDistribution/PrizeList.jsx`
- [ ] ✅ `src/pages/M6PrizeDistribution/PrizeList.css`
- [ ] ✅ `src/pages/M6PrizeDistribution/PrizeCreate.jsx`
- [ ] ✅ `src/pages/M6PrizeDistribution/PrizeEdit.jsx`
- [ ] ✅ `src/pages/M6PrizeDistribution/PrizeForm.css`
- [ ] ✅ `src/pages/M6PrizeDistribution/main.jsx` (actualizado)
- [ ] ✅ `src/pages/M6PrizeDistribution/index.jsx`
- [ ] ✅ `src/pages/M6PrizeDistribution/README.md`

### Global Styles
- [ ] ✅ `src/global.css`
- [ ] ✅ `src/main.jsx` (actualizado con global.css)

### Documentation
- [ ] ✅ `PROJECT_SUMMARY.md`
- [ ] ✅ `GUIDE_PRIZE_DISTRIBUTION.md`
- [ ] ✅ `EXAMPLES_USAGE.md`
- [ ] ✅ `QUICK_START.md`
- [ ] ✅ `backend/prizes/INTEGRATION_GUIDE.md`

---

## 🔧 Configuración - Verificar

### axiosConfig.js
```javascript
// Debe estar configurado:
const API_BASE_URL = 'http://localhost:8000/api';
// Si es diferente, actualizar la URL
```

### main.jsx (Frontend)
```javascript
// Debe tener:
import './global.css'
import './index.css'
// En ese orden
```

### App.jsx (Frontend)
```javascript
// Debe tener:
<Route path="/prizes/*" element={<M6PrizeDistribution />} />
// NO: <Route path="/m6-prize" ...
```

### Backend URLs
```python
# config/urls.py debe tener:
path('api/prizes/', include('prizes.urls')),
path('api/leagues/', ...),
path('api/league-members/', ...),
```

---

## 🚀 Ejecución - Checklist

### Paso 1: Backend Corriendo
```bash
cd backend
python manage.py runserver
# Debe mostrar: "Starting development server at http://127.0.0.1:8000/"
```

- [ ] Backend en http://localhost:8000
- [ ] Admin accesible
- [ ] No hay errores en terminal

### Paso 2: Frontend Corriendo
```bash
cd frontend
npm run dev
# Debe mostrar: "Local: http://localhost:5173/"
```

- [ ] Frontend en http://localhost:5173
- [ ] Página carga sin errores
- [ ] No hay errores en consola (F12)

### Paso 3: Rutas Accesibles
- [ ] http://localhost:5173/prizes - ✅ Listado
- [ ] Tabla muestra (vacía o con datos)
- [ ] Botón "Nuevo Premio" visible

---

## 📊 Datos - Verificar

### Ligas Existen
```bash
# En navegador o terminal:
curl http://localhost:8000/api/leagues/
# Debe devolver: [] o [{ id: 1, name: "Liga 1", ... }]
```

- [ ] Ligas existen en base de datos
- [ ] Si está vacío, crear en admin

### Miembros Existen
```bash
curl http://localhost:8000/api/league-members/
# Debe devolver: [] o array de miembros
```

- [ ] Miembros existen en base de datos
- [ ] Si está vacío, crear en admin

### Premios Existen (Opcional)
```bash
curl http://localhost:8000/api/prizes/prize-distributions/
# Puede estar vacío al inicio
```

- [ ] Endpoint responde
- [ ] Puede estar vacío

---

## 🧪 Funcionalidades - Test

### Crear Premio
```
[ ] Navegar a /prizes
[ ] Click en "Nuevo Premio"
[ ] Página abre correctamente
[ ] Form muestra campos:
    [ ] Liga (select)
    [ ] Miembro (select)
    [ ] Posición (select)
    [ ] Monto (input)
    [ ] Tipo (select)
[ ] Seleccionar liga
[ ] Miembros cargan automáticamente
[ ] Completar formulario
[ ] Click en "Guardar"
[ ] Toast verde de éxito
[ ] Redirige a /prizes
[ ] Premio aparece en tabla
```

### Editar Premio
```
[ ] En listado, click en icono editar
[ ] Página de edición abre
[ ] Datos cargan en formulario
[ ] Modificar un campo
[ ] Click en "Guardar"
[ ] Toast verde de éxito
[ ] Redirige a /prizes
[ ] Cambios reflejados en tabla
```

### Eliminar Premio
```
[ ] En listado, click en icono eliminar
[ ] Modal de confirmación aparece
[ ] Título: "Eliminar Premio"
[ ] Botón "Eliminar" en rojo
[ ] Click en "Eliminar"
[ ] Toast verde de éxito
[ ] Modal desaparece
[ ] Premio desaparece de tabla
```

### Buscar/Filtrar
```
[ ] Escribir en buscador
[ ] Tabla filtra en tiempo real
[ ] Filtro por tipo funciona
[ ] Filtro por posición funciona
[ ] Limpiar campos vuelve a mostrar todos
```

---

## 🎨 UI/UX - Verificar

### Diseño
- [ ] Tabla se ve moderna
- [ ] Botones tienen colores correctos
- [ ] Badges en tabla se ven bien
- [ ] Modal tiene estilo limpio
- [ ] Toasts aparecen en esquina inferior derecha

### Responsive
- [ ] Desktop (1920px): se ve completo
- [ ] Tablet (768px): se ve bien
- [ ] Mobile (375px): se ve bien

### Animaciones
- [ ] Loader gira suavemente
- [ ] Toast slide-in suave
- [ ] Modal fade-in suave
- [ ] Transiciones hover suaves

---

## 🔍 Consola - Verificar

### Abrir DevTools (F12)
- [ ] Pestaña Console abierta
- [ ] No hay errores en rojo
- [ ] No hay warnings críticos

### Network
- [ ] Requests a `/api/prizes/...` correctos
- [ ] Status 200 en GET/POST/PUT/DELETE
- [ ] Status 404/500 si hay problemas

### Logs Esperados
```javascript
// Deberías ver:
"Cargando premios..."
// Después:
// Array de premios en respuesta
```

---

## ✅ Validaciones - Verificar

### Validación de Campos
```
[ ] Enviar formulario vacío → Error
[ ] Monto negativo → Error
[ ] Monto 0 → Error
[ ] Monto válido (100.50) → OK
```

### Validación Backend
```
[ ] Crear con datos inválidos → Error 400
[ ] Eliminar premio inexistente → Error 404
[ ] Campos requeridos vacíos → Error 400
```

### Mensajes de Error
```
[ ] Error muestra en console
[ ] Toast rojo aparece
[ ] Mensaje es claro
```

---

## 🚨 Troubleshooting

### Si no ve nada
```
[ ] Verificar que está en http://localhost:5173/prizes
[ ] Verificar DevTools (F12) Console
[ ] Revisar si hay errores
```

### Si tabla está vacía
```
[ ] Verificar que hay datos en backend
[ ] Crear datos en admin Django
[ ] Refrescar página (F5)
```

### Si selects están vacíos
```
[ ] Verificar http://localhost:8000/api/leagues/
[ ] Verificar http://localhost:8000/api/league-members/
[ ] Crear datos si no existen
```

### Si hay errores de red
```
[ ] Backend corriendo? (http://localhost:8000)
[ ] Frontend corriendo? (http://localhost:5173)
[ ] URL de Axios correcta en axiosConfig.js
```

---

## 📈 Performance - Opcional

### Si es lento
```
[ ] Abrir DevTools Network
[ ] Ver tiempos de request
[ ] Verificar si backend está lento
[ ] Revisar base de datos
```

### Optimizaciones
```
[ ] Usar lazy loading para imágenes
[ ] Memoizar componentes si es necesario
[ ] Implementar paginación si hay muchos datos
```

---

## 🎓 Próximos Pasos

Una vez todo esté ✅:

1. [ ] Leer `GUIDE_PRIZE_DISTRIBUTION.md` para conocer todo
2. [ ] Revisar ejemplos en `EXAMPLES_USAGE.md`
3. [ ] Explorar código de componentes
4. [ ] Implementar mejoras futuras
5. [ ] Agregar tests

---

## 📋 Resumen Final

- [ ] Todos los archivos creados
- [ ] Dependencias instaladas
- [ ] Backend corriendo
- [ ] Frontend corriendo
- [ ] Rutas accesibles
- [ ] CRUD funcional
- [ ] Sin errores en consola
- [ ] Listo para producción

---

## ✨ ¡Completado!

Si todo está ✅, tu CRUD está:
- ✅ Completamente instalado
- ✅ Correctamente configurado
- ✅ Funcionando correctamente
- ✅ Listo para usar

**Felicidades! 🎉**

---

**Última Verificación**: 2026-05-19
**Estado**: ✅ Todos los checklist listos
**Siguiente**: Iniciar npm run dev y probar
