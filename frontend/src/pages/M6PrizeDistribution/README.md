# Módulo de Distribución de Premios (M6 - Prize Distribution)

## Descripción
Módulo CRUD completo para la gestión de premios y distribuciones en ligas usando React.js y Django REST Framework.

## Estructura del Proyecto

```
src/
├── api/
│   ├── axiosConfig.js          # Configuración centralizada de axios
│   ├── prizesApi.js            # API para operaciones CRUD de premios
│   └── leaguesApi.js           # API para obtener ligas y miembros
│
├── components/
│   ├── PrizeForm.jsx           # Formulario reutilizable
│   ├── PrizeForm.css
│   ├── PrizeTable.jsx          # Tabla de premios
│   ├── PrizeTable.css
│   ├── ConfirmModal.jsx        # Modal de confirmación
│   ├── ConfirmModal.css
│   ├── Loader.jsx              # Spinner de carga
│   ├── Loader.css
│   ├── Toast.jsx               # Notificaciones
│   └── Toast.css
│
├── hooks/
│   └── useToast.js             # Hook para manejar toasts
│
└── pages/M6PrizeDistribution/
    ├── PrizeList.jsx           # Página de listado
    ├── PrizeList.css
    ├── PrizeCreate.jsx         # Página de creación
    ├── PrizeEdit.jsx           # Página de edición
    ├── PrizeForm.css           # Estilos compartidos
    ├── main.jsx                # Entrada del módulo
    └── index.jsx               # Exporta el main
```

## Rutas Disponibles

- `GET /prizes` - Listado de premios
- `GET /prizes/create` - Crear nuevo premio
- `GET /prizes/edit/:id` - Editar premio existente

## Funcionalidades Principales

### 1. Listado de Premios
- Tabla responsiva con información de premios
- Búsqueda por liga y miembro
- Filtrado por tipo de premio
- Filtrado por posición
- Mostrar estadísticas de premios totales
- Acciones: editar y eliminar

### 2. Crear Premio
- Formulario con validaciones
- Selección dinámica de ligas
- Carga dinámica de miembros según liga
- Validación de montos positivos
- Mensaje de éxito tras creación

### 3. Editar Premio
- Cargue automático de datos existentes
- Validaciones activas
- Actualización mediante PUT
- Manejo de errores de backend

### 4. Eliminar Premio
- Modal de confirmación antes de eliminar
- Indicación visual del peligro de la acción
- Refresco automático de lista tras eliminación

## Componentes Reutilizables

### PrizeForm
Componente de formulario reutilizable usado en crear y editar.
```jsx
<PrizeForm 
  initialData={optionalData} 
  onSubmit={handleSubmit}
  isLoading={false}
/>
```

### PrizeTable
Tabla de premios con acciones integradas.
```jsx
<PrizeTable
  prizes={prizesList}
  onEdit={(id) => handleEdit(id)}
  onDelete={(id) => handleDelete(id)}
  isLoading={false}
/>
```

### ConfirmModal
Modal de confirmación personalizable.
```jsx
<ConfirmModal
  isOpen={true}
  title="Eliminar"
  message="¿Estás seguro?"
  onConfirm={() => {}}
  onCancel={() => {}}
  isDangerous={true}
/>
```

### Toast
Notificaciones emergentes.
```jsx
<Toast
  message="Éxito"
  type="success"
  duration={3000}
  onClose={() => {}}
/>
```

## Hook useToast

Hook para manejar notificaciones de forma centralizada:
```jsx
const { toast, showSuccess, showError, showInfo, hideToast } = useToast();

showSuccess('¡Operación exitosa!');
showError('Ocurrió un error');
showInfo('Información importante');
```

## Conexión con Backend

### Configuración de Axios
El archivo `api/axiosConfig.js` configura:
- URL base: `http://localhost:8000/api`
- Timeout: 10 segundos
- Interceptor para agregar token de autenticación
- Manejo automático de errores 401

### Endpoints Esperados del Backend

```
GET  /api/prizes/prize-distributions/         - Listar premios
GET  /api/prizes/prize-distributions/:id/     - Obtener premio
POST /api/prizes/prize-distributions/         - Crear premio
PUT  /api/prizes/prize-distributions/:id/     - Actualizar premio
DELETE /api/prizes/prize-distributions/:id/   - Eliminar premio

GET  /api/leagues/                             - Listar ligas
GET  /api/league-members/                      - Listar miembros
GET  /api/league-members/?league=:id           - Miembros de liga
```

## Opciones de Datos

### Posiciones Disponibles
- `first` - Primer lugar
- `second` - Segundo lugar
- `third` - Tercer lugar
- `last` - Último lugar
- `global_individual` - Premio global individual
- `global_league` - Premio global por liga

### Tipos de Premios
- `league` - Premio de liga
- `global` - Premio global
- `tie` - Premio por empate

## Validaciones

### Validaciones en Formulario
- Liga: requerida
- Miembro: requerida
- Posición: requerida
- Monto: requerido y > 0
- Tipo: requerido

### Validaciones de Backend
Se manejan automáticamente mostrando mensajes de error específicos.

## Diseño y Estilos

- **Color primario**: #0d6efd (Azul)
- **Color de peligro**: #dc3545 (Rojo)
- **Color de éxito**: #28a745 (Verde)
- **Responsive**: Mobile, tablet y desktop
- **Bootstrap 5 compatible**: Estilos similares a Bootstrap

## Mejoras Futuras

1. Paginación en backend
2. Exportar a CSV/Excel
3. Más filtros avanzados
4. Edición en línea
5. Soporte para múltiples divisas
6. Historial de cambios
7. Bulk operations

## Dependencias Requeridas

- react: ^19.2.6
- react-dom: ^19.2.6
- react-router-dom: ^6.28.0
- axios: ^1.6.0+
- react-icons: ^5.0.0+

## Instalación

```bash
cd frontend
npm install axios bootstrap react-icons
npm run dev
```

## Variables de Entorno

Crear archivo `.env` en la carpeta `frontend`:
```env
VITE_API_URL=http://localhost:8000/api
```

## Testing

Para probar manualmente:
1. Asegurar que el backend Django esté corriendo en `http://localhost:8000`
2. Asegurar que hay datos de ligas en `/api/leagues/`
3. Navegar a `/prizes` en la aplicación
4. Crear, editar y eliminar premios

## Troubleshooting

### Error: "Cannot read property 'league_name'"
- Verificar que el backend devuelve los campos esperados
- Revisar la estructura de la respuesta en la red

### Error: "Network Error"
- Verificar que el backend está corriendo
- Revisar la URL en axiosConfig.js
- Verificar CORS si está habilitado en el backend

### Selects vacíos
- Verificar que `/api/leagues/` devuelve datos
- Verificar que `/api/league-members/` devuelve datos
- Revisar la consola para errores

## Licencia

MIT
