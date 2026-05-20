# CRUD Completo - Módulo Prize Distribution

## 📋 Descripción General

Sistema CRUD completo para la gestión de premios en ligas de fútbol. Desarrollado con React.js + Django REST Framework, proporciona una interfaz moderna y responsiva para administrar distribuciones de premios con búsqueda, filtrado y validaciones completas.

## ✨ Características Principales

### 1. **Listado de Premios** 📊
- Tabla responsiva con información detallada
- Búsqueda en tiempo real por liga y miembro
- Filtrado por tipo de premio
- Filtrado por posición
- Estadísticas en tiempo real (total de premios)
- Estados de carga visuales
- Diseño adaptable (mobile, tablet, desktop)

### 2. **Crear Premio** ➕
- Formulario intuitivo con validaciones
- Selección dinámica de ligas
- Carga automática de miembros según liga
- Validación de montos positivos
- Manejo de errores con mensajes claros
- Confirmación visual de éxito

### 3. **Editar Premio** ✏️
- Cargue automático de datos existentes
- Validaciones activas en tiempo real
- Actualización mediante PUT
- Manejo inteligente de errores del backend
- Navegación fluida

### 4. **Eliminar Premio** 🗑️
- Modal de confirmación con advertencia visual
- Validación antes de eliminar
- Refresco automático de lista
- Notificación de éxito/error

## 🏗️ Arquitectura

### Estructura de Carpetas

```
frontend/src/
├── api/
│   ├── index.js                 # Exportación centralizada
│   ├── axiosConfig.js           # Configuración de axios
│   ├── prizesApi.js             # Servicios de premios
│   └── leaguesApi.js            # Servicios de ligas
│
├── components/
│   ├── index.js                 # Exportación centralizada
│   ├── PrizeForm.jsx            # Formulario CRUD
│   ├── PrizeForm.css
│   ├── PrizeTable.jsx           # Tabla de premios
│   ├── PrizeTable.css
│   ├── ConfirmModal.jsx         # Modal de confirmación
│   ├── ConfirmModal.css
│   ├── Loader.jsx               # Spinner de carga
│   ├── Loader.css
│   ├── Toast.jsx                # Notificaciones
│   └── Toast.css
│
├── hooks/
│   ├── index.js                 # Exportación centralizada
│   └── useToast.js              # Hook para notificaciones
│
└── pages/M6PrizeDistribution/
    ├── PrizeList.jsx            # Página de listado
    ├── PrizeList.css
    ├── PrizeCreate.jsx          # Página de creación
    ├── PrizeEdit.jsx            # Página de edición
    ├── PrizeForm.css            # Estilos compartidos
    ├── main.jsx                 # Entrada del módulo
    ├── index.jsx                # Exportación
    └── README.md                # Documentación
```

## 🚀 Instalación y Configuración

### 1. Instalación de Dependencias

```bash
cd frontend
npm install axios bootstrap react-icons
```

### 2. Configuración de Axios

El archivo `src/api/axiosConfig.js` está pre-configurado con:
- **URL Base**: `http://localhost:8000/api`
- **Timeout**: 10 segundos
- **Interceptores**: Manejo de token y errores 401

### 3. Estructura de Rutas

En `App.jsx` está configurado:
```jsx
<Route path="/prizes/*" element={<M6PrizeDistribution />} />
```

Las rutas internas del módulo son:
- `/prizes` - Listado
- `/prizes/create` - Crear
- `/prizes/edit/:id` - Editar

### 4. Backend Django

Asegurar que el backend tenga:

```python
# URLs configuradas
urlpatterns = [
    path('api/prizes/', include('prizes.urls')),
    path('api/leagues/', ...),
    path('api/league-members/', ...),
]
```

## 📱 Componentes Reutilizables

### PrizeForm
Formulario inteligente que se adapta a create/edit:

```jsx
import { PrizeForm } from '@/components';

<PrizeForm 
  initialData={optionalExistingData}
  onSubmit={handleFormSubmit}
  isLoading={false}
/>
```

**Props:**
- `initialData` (object): Datos para edición (opcional)
- `onSubmit` (function): Callback al enviar
- `isLoading` (boolean): Estado de carga

**Features:**
- Validación en tiempo real
- Selección dinámica de miembros
- Manejo de errores
- Estados disabled en carga

### PrizeTable
Tabla responsiva con acciones integradas:

```jsx
import { PrizeTable } from '@/components';

<PrizeTable
  prizes={prizesList}
  onEdit={(id) => navigate(`/prizes/edit/${id}`)}
  onDelete={(id) => openDeleteModal(id)}
  isLoading={isDeleting}
/>
```

**Props:**
- `prizes` (array): Lista de premios
- `onEdit` (function): Callback para editar
- `onDelete` (function): Callback para eliminar
- `isLoading` (boolean): Estado de carga

**Features:**
- Formateo de moneda
- Badges de estado
- Empty state personalizado
- Iconos de acción

### ConfirmModal
Modal para confirmaciones críticas:

```jsx
import { ConfirmModal } from '@/components';

<ConfirmModal
  isOpen={showModal}
  title="Eliminar Premio"
  message="¿Estás seguro de eliminarlo?"
  onConfirm={handleDelete}
  onCancel={handleCancel}
  isDangerous={true}
/>
```

**Props:**
- `isOpen` (boolean): Mostrar/ocultar
- `title` (string): Título del modal
- `message` (string): Mensaje de confirmación
- `onConfirm` (function): Callback de confirmación
- `onCancel` (function): Callback de cancelación
- `isDangerous` (boolean): Resaltar como acción peligrosa

### Toast
Notificaciones emergentes:

```jsx
import { Toast } from '@/components';

<Toast
  message="¡Operación exitosa!"
  type="success"
  duration={3000}
  onClose={handleClose}
/>
```

**Tipos:**
- `success` - Verde
- `error` - Rojo
- `info` - Azul
- `warning` - Naranja

## 🎯 Hook useToast

Hook centralizado para manejar notificaciones:

```jsx
import { useToast } from '@/hooks';

const { 
  toast, 
  showSuccess, 
  showError, 
  showInfo, 
  showWarning,
  hideToast 
} = useToast();

showSuccess('¡Guardado correctamente!');
showError('Ocurrió un error inesperado');
showInfo('Información importante');
```

## 🔌 Servicios de API

### prizesApi.js

```javascript
import { 
  getPrizes,
  getPrizeById,
  createPrize,
  updatePrize,
  deletePrize 
} from '@/api';

// Obtener todos
const prizes = await getPrizes({ type: 'league' });

// Obtener uno
const prize = await getPrizeById(1);

// Crear
const newPrize = await createPrize({
  league: 1,
  member: 1,
  position: 'first',
  amount: 100,
  type: 'league'
});

// Actualizar
await updatePrize(1, { amount: 150 });

// Eliminar
await deletePrize(1);
```

### leaguesApi.js

```javascript
import { 
  getLeagues,
  getLeagueMembers,
  getLeagueMembersByLeague 
} from '@/api';

// Obtener ligas
const leagues = await getLeagues();

// Obtener todos los miembros
const members = await getLeagueMembers();

// Obtener miembros de una liga
const leagueMembers = await getLeagueMembersByLeague(1);
```

## 📊 Opciones de Datos

### Posiciones
```javascript
const positions = [
  { value: 'first', label: 'Primer lugar' },
  { value: 'second', label: 'Segundo lugar' },
  { value: 'third', label: 'Tercer lugar' },
  { value: 'last', label: 'Último lugar' },
  { value: 'global_individual', label: 'Premio global individual' },
  { value: 'global_league', label: 'Premio global por liga' },
];
```

### Tipos de Premios
```javascript
const types = [
  { value: 'league', label: 'Premio de liga' },
  { value: 'global', label: 'Premio global' },
  { value: 'tie', label: 'Premio por empate' },
];
```

## ✅ Validaciones

### Frontend
- Liga: requerida
- Miembro: requerida
- Posición: requerida
- Monto: requerido, debe ser > 0
- Tipo: requerido

### Backend
Validaciones automáticas en Django:
- Relaciones de clave foránea
- Restricciones de modelo
- Restricciones de base de datos

## 🎨 Diseño y Estilos

### Paleta de Colores
- **Primario**: #0d6efd (Azul)
- **Éxito**: #28a745 (Verde)
- **Peligro**: #dc3545 (Rojo)
- **Advertencia**: #ffc107 (Naranja)
- **Info**: #17a2b8 (Cian)
- **Secundario**: #6c757d (Gris)

### Tipografía
- **Headings**: Fonts regulares, pesos 600-700
- **Body**: 14px, peso 400-500
- **Labels**: 13px, peso 600

### Efectos
- Transiciones suaves (0.2s)
- Hover effects en botones
- Animaciones de entrada/salida
- Sombras sutiles

## 🔄 Flujos de Uso

### Crear Premio
1. Click en "Nuevo Premio" en listado
2. Seleccionar liga
3. Seleccionar miembro (se carga dinámicamente)
4. Completar posición, monto y tipo
5. Click en "Guardar"
6. Toast de confirmación
7. Redirect a listado

### Editar Premio
1. Click en icono de editar en tabla
2. Datos cargan automáticamente
3. Modificar campos necesarios
4. Click en "Guardar"
5. Toast de confirmación
6. Redirect a listado

### Eliminar Premio
1. Click en icono de eliminar en tabla
2. Modal de confirmación aparece
3. Leer advertencia
4. Click en "Eliminar"
5. Toast de confirmación
6. Tabla se actualiza automáticamente

### Buscar y Filtrar
1. Escribir en buscador
2. Filtrar por tipo (select)
3. Filtrar por posición (select)
4. Tabla se actualiza en tiempo real
5. Estadísticas se actualizan

## 🐛 Manejo de Errores

### Tipos de Errores Comunes

**Network Error**
- Solución: Verificar que backend esté corriendo

**CORS Error**
- Solución: Configurar CORS en Django

**401 Unauthorized**
- Solución: Token expirado, ir a login

**400 Bad Request**
- Solución: Validar datos del formulario

**404 Not Found**
- Solución: Premios no existen

**500 Server Error**
- Solución: Error en backend, revisar logs

## 📈 Mejoras Futuras

1. **Paginación**: Implementar en backend y frontend
2. **Exportar**: CSV, Excel, PDF
3. **Filtros Avanzados**: Rango de fechas, montos
4. **Edición Inline**: Editar directamente en tabla
5. **Bulk Operations**: Operaciones en lote
6. **Historial**: Registro de cambios
7. **Permisos**: Roles y permisos por usuario
8. **Gráficos**: Distribución de premios
9. **Reportes**: Reportes automáticos
10. **Drag & Drop**: Reordenar en tabla

## 🧪 Testing Manual

### Pre-requisitos
- Backend Django corriendo en `http://localhost:8000`
- Frontend corriendo en `http://localhost:5173`
- Datos de prueba en base de datos

### Casos de Prueba

```
□ Acceder a /prizes
□ Ver listado de premios
□ Búsqueda funciona
□ Filtros funcionan
□ Click en "Nuevo" lleva a crear
□ Crear premio exitosamente
□ Editar premio exitosamente
□ Eliminar premio con confirmación
□ Mostrar errores validación
□ Mostrar errores backend
□ Toasts aparecen correctamente
□ Responsive en mobile
□ Responsive en tablet
□ Responsive en desktop
```

## 📚 Recursos Adicionales

- [React Router Docs](https://reactrouter.com/)
- [Axios Docs](https://axios-http.com/)
- [React Hooks](https://react.dev/reference/react)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Bootstrap 5](https://getbootstrap.com/)

## 📝 Notas Importantes

1. **Token de Autenticación**: Se obtiene del localStorage automáticamente
2. **Timeout**: Si la operación tarda >10s, se cancela
3. **Respuestas del Backend**: Deben incluir `league_name` y `member_name`
4. **Formato de Fechas**: ISO 8601 (YYYY-MM-DDTHH:mm:ss)
5. **Decimales en Montos**: Máximo 2 decimales

## 🤝 Contribuir

Para agregar nuevas funcionalidades:

1. Crear componente en `components/`
2. Crear estilos correspondientes
3. Importar en las páginas necesarias
4. Documentar en README
5. Probar en todos los dispositivos

## 📞 Soporte

Para issues o preguntas:
1. Revisar el README.md del módulo
2. Revisar los logs del navegador
3. Revisar los logs del backend
4. Contactar al equipo de desarrollo

---

**Última actualización**: 2026-05-19
**Versión**: 1.0.0
**Estado**: Producción Ready ✅
