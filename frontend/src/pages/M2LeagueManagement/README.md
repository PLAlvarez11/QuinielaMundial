# M2 - Módulo de Gestión de Ligas (Frontend)

Este módulo proporciona una interfaz completa para gestionar ligas de predicciones. Está basado en la estructura del backend `leagues_app` y utiliza React con componentes reutilizables.

## 📁 Estructura del Módulo

```
M2LeagueManagement/
├── main.jsx                    # Componente principal (enrutamiento de vistas)
├── main.css                    # Estilos del componente principal
├── index.jsx                   # Exportación del módulo
│
├── LeagueList.jsx             # Lista de ligas con opciones
├── LeagueList.css
│
├── LeagueForm.jsx             # Formulario para crear/editar ligas
├── LeagueForm.css
│
├── LeagueDetails.jsx          # Vista de detalles de una liga
├── LeagueDetails.css
│
├── LeagueMembersManager.jsx   # Gestión de miembros de una liga
├── LeagueMembersManager.css
│
├── InvitationManager.jsx      # Gestión de invitaciones
├── InvitationManager.css
│
└── README.md                   # Este archivo
```

## 🎯 Componentes Principales

### 1. **main.jsx** - Componente Principal
Actúa como contenedor principal y gestor de vistas. Maneja la transición entre diferentes pantallas:
- `list`: Listado de ligas
- `create`: Crear/editar una liga
- `details`: Ver detalles de una liga

```jsx
<M2LeagueManagementMain />
```

### 2. **LeagueList.jsx** - Listado de Ligas
Muestra todas las ligas del usuario con opciones para:
- Ver detalles de una liga
- Crear nueva liga
- Eliminar liga
- Filtrar por estado (Activa, Inactiva, Finalizada)

**Props:**
- `onSelectLeague(league)` - Callback al seleccionar una liga
- `onCreateNew()` - Callback para crear nueva liga

### 3. **LeagueForm.jsx** - Formulario de Liga
Formulario para crear o editar una liga.

**Campos:**
- Nombre de la liga *
- Descripción
- Tipo (Pública, Privada, Solo invitación) *
- Estado (Activa, Inactiva, Finalizada)
- Cuota de entrada ($)
- Máximo de miembros *

**Props:**
- `league` - Liga a editar (opcional)
- `onSuccess(league)` - Callback cuando se guarda exitosamente
- `onCancel()` - Callback para cancelar

### 4. **LeagueDetails.jsx** - Detalles de Liga
Vista completa de una liga con tabs para:
- **Descripción General**: Información y estadísticas de la liga
- **Miembros**: Gestión de miembros
- **Invitaciones**: Gestión de invitaciones

**Props:**
- `league` - Objeto de liga
- `onEdit()` - Callback para editar
- `onBack()` - Callback para volver

### 5. **LeagueMembersManager.jsx** - Gestor de Miembros
Gestiona los miembros de una liga:
- Listar miembros
- Editar información del miembro (nombre de equipo, estado)
- Eliminar miembros
- Ver puntos de cada miembro

**Props:**
- `league` - Objeto de liga

**Acciones:**
- Editar: Cambiar nombre de equipo y estado
- Eliminar: Remover miembro de la liga

### 6. **InvitationManager.jsx** - Gestor de Invitaciones
Gestiona las invitaciones a una liga:
- Listar invitaciones
- Enviar nuevas invitaciones por email
- Cancelar invitaciones pendientes
- Ver estado de invitaciones (Pendiente, Aceptada, Rechazada, Expirada)

**Props:**
- `league` - Objeto de liga

**Acciones:**
- Enviar: Crear nueva invitación
- Cancelar: Cancelar invitación pendiente

## 🔗 API Integration

El módulo utiliza los siguientes endpoints de la API (definidos en `src/api/leaguesApi.js`):

### Ligas
- `GET /api/leagues/` - Obtener todas las ligas
- `GET /api/leagues/{id}/` - Obtener detalle de una liga
- `POST /api/leagues/` - Crear liga
- `PATCH /api/leagues/{id}/` - Actualizar liga
- `DELETE /api/leagues/{id}/` - Eliminar liga

### Miembros
- `GET /api/members/` - Obtener todos los miembros
- `GET /api/members/?league={id}` - Obtener miembros de una liga
- `POST /api/members/` - Agregar miembro
- `PATCH /api/members/{id}/` - Actualizar miembro
- `DELETE /api/members/{id}/` - Eliminar miembro

### Invitaciones
- `GET /api/invitations/` - Obtener invitaciones
- `GET /api/invitations/?league={id}` - Obtener invitaciones de una liga
- `POST /api/invitations/` - Enviar invitación
- `POST /api/invitations/{token}/accept/` - Aceptar invitación
- `POST /api/invitations/{token}/reject/` - Rechazar invitación
- `DELETE /api/invitations/{id}/` - Cancelar invitación

## 🎨 Estilos

Cada componente tiene su propio archivo CSS con estilos específicos:
- Diseño responsive (mobile-first)
- Colores consistentes
- Transiciones suaves
- Grid layouts modernos

### Clases CSS Principales

- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger` - Botones
- `.badge`, `.badge-active`, `.badge-inactive` - Insignias de estado
- `.form-group`, `.form-row` - Campos de formulario
- `.alert`, `.alert-error` - Mensajes de alerta
- `.empty-state` - Estado vacío

## 💡 Uso en la Aplicación

En `src/App.jsx` o en tu enrutador:

```jsx
import M2LeagueManagement from './pages/M2LeagueManagement';

// En tu router:
<Route path="/leagues" element={<M2LeagueManagement />} />
```

## 🔄 Flujo de Uso

1. **Usuario llega al módulo** → Ve `LeagueList`
2. **Usuario crea liga** → Va a `LeagueForm` → Creada → Va a `LeagueDetails`
3. **Usuario selecciona liga** → Va a `LeagueDetails`
4. **En LeagueDetails**:
   - Tab "Miembros" → `LeagueMembersManager` (gestión de miembros)
   - Tab "Invitaciones" → `InvitationManager` (enviar/gestionar invitaciones)
   - Botón "Editar" → Va a `LeagueForm` para editar
5. **Usuario vuelve** → Regresa a `LeagueList`

## 🚀 Características Principales

✅ **Gestión CRUD de Ligas**
- Crear, leer, actualizar y eliminar ligas
- Validación de datos
- Feedback visual del usuario

✅ **Gestión de Miembros**
- Agregar/remover miembros
- Editar información de miembros
- Ver puntos acumulados
- Cambiar estado (activo/inactivo/suspendido)

✅ **Sistema de Invitaciones**
- Enviar invitaciones por email
- Cancelar invitaciones
- Seguimiento de estado
- Detección de invitaciones expiradas

✅ **Interfaz Responsiva**
- Optimizada para mobile, tablet y desktop
- Grid responsive
- Menú adaptable

✅ **Manejo de Errores**
- Mensajes de error claros
- Validación de formularios
- Confirmación de acciones destructivas

## 📝 Variables de Estado en main.jsx

```jsx
// Vista actual
const [currentView, setCurrentView] = useState('list');

// Liga seleccionada
const [selectedLeague, setSelectedLeague] = useState(null);
```

### Transiciones de Vista
- `list` ↔ `create` ↔ `details`

## 🔐 Seguridad

- Las peticiones incluyen token de autenticación (via interceptor de axios)
- Confirmaciones modales antes de acciones destructivas
- Validación en cliente (y en servidor)
- Manejo seguro de información sensible

## 📱 Responsividad

- Desktop: Grid de 3+ columnas
- Tablet: Grid de 2 columnas
- Mobile: Grid de 1 columna
- Menús adaptables
- Texto legible en todos los tamaños

## 🐛 Troubleshooting

### "Errores 404 en API"
Verifica que los endpoints en `leaguesApi.js` coincidan con la configuración del backend.

### "Componentes no se renderizan"
Asegúrate de que los componentes están importados correctamente en `main.jsx`.

### "Estilos no se aplican"
Verifica que los archivos CSS están importados en los componentes.

## 🔄 Sincronización con Backend

Este módulo espera que el backend `leagues_app` tenga implementados los ViewSets:
- `LeagueViewSet`
- `LeagueMemberViewSet`
- `InvitationViewSet`

Basados en los modelos:
- `League`
- `LeagueMember`
- `Invitation`

Asegúrate de que las migraciones se han ejecutado correctamente.

## 📚 Dependencias

- **React 18+** - Framework principal
- **axios** - Cliente HTTP (via `leaguesApi.js`)
- **ConfirmModal** - Componente de confirmación
- **Loader** - Componente de carga

## 🎯 Próximas Mejoras

- [ ] Búsqueda de ligas
- [ ] Exportar datos de ligas (CSV/PDF)
- [ ] Sistema de notificaciones
- [ ] Historial de cambios
- [ ] Estadísticas avanzadas por liga
- [ ] Integración con tabla de posiciones
- [ ] Sistema de premiación integrado
