# CRUD del Módulo Catálogo del Mundial

## Descripción General

Este es un CRUD completo para gestionar el catálogo del Mundial de Fútbol, incluyendo sedes, estadios, países, fases del torneo, grupos, asignaciones de países a grupos, y partidos.

## Características Principales

### ✅ Funcionalidades Implementadas

1. **Gestión Completa CRUD**
   - Crear, Leer, Actualizar y Eliminar registros
   - Formularios validados en el cliente
   - Manejo robusto de errores del backend

2. **Interfaz Responsiva**
   - Sidebar colapsable con navegación
   - Tablas responsive en dispositivos móviles
   - Diseño moderno con Bootstrap-like styling

3. **Características UX/UI**
   - Búsqueda y filtrado de registros
   - Ordenamiento por columnas (click en headers)
   - Modal de confirmación para eliminar
   - Toast notifications para feedback
   - Estados de carga con spinners
   - Empty states cuando no hay datos

4. **Validaciones**
   - Validación de campos requeridos
   - Validaciones de lógica (ej: equipos no pueden ser iguales en partidos)
   - Mensajes de error claros
   - Gestión de errores del backend

## Estructura de Carpetas

```
src/
├── api/
│   └── catalogoApi.js          # Funciones Axios para todas las entidades
├── components/
│   └── catalogo/
│       ├── VenueForm.jsx & VenueTable.jsx
│       ├── StadiumForm.jsx & StadiumTable.jsx
│       ├── CountryForm.jsx & CountryTable.jsx
│       ├── TournamentStageForm.jsx & TournamentStageTable.jsx
│       ├── GroupForm.jsx & GroupTable.jsx
│       ├── GroupCountryForm.jsx & GroupCountryTable.jsx
│       ├── MatchForm.jsx & MatchTable.jsx
│       └── [*.css files]
├── pages/
│   └── catalogo/
│       ├── VenueList.jsx, VenueCreate.jsx, VenueEdit.jsx
│       ├── StadiumList.jsx, StadiumCreate.jsx, StadiumEdit.jsx
│       ├── CountryList.jsx, CountryCreate.jsx, CountryEdit.jsx
│       ├── TournamentStageList.jsx, TournamentStageCreate.jsx, TournamentStageEdit.jsx
│       ├── GroupList.jsx, GroupCreate.jsx, GroupEdit.jsx
│       ├── GroupCountryList.jsx, GroupCountryCreate.jsx, GroupCountryEdit.jsx
│       ├── MatchList.jsx, MatchCreate.jsx, MatchEdit.jsx
│       └── [*.css files]
└── routes/
    └── CatalogoRoutes.jsx      # Todas las rutas del módulo
```

## Rutas de la Aplicación

### Sedes
- `GET /catalogo/venues` - Listar
- `GET /catalogo/venues/create` - Crear
- `GET /catalogo/venues/edit/:id` - Editar

### Estadios
- `GET /catalogo/stadiums` - Listar
- `GET /catalogo/stadiums/create` - Crear
- `GET /catalogo/stadiums/edit/:id` - Editar

### Países
- `GET /catalogo/countries` - Listar
- `GET /catalogo/countries/create` - Crear
- `GET /catalogo/countries/edit/:id` - Editar

### Fases del Torneo
- `GET /catalogo/tournament-stages` - Listar
- `GET /catalogo/tournament-stages/create` - Crear
- `GET /catalogo/tournament-stages/edit/:id` - Editar

### Grupos
- `GET /catalogo/groups` - Listar
- `GET /catalogo/groups/create` - Crear
- `GET /catalogo/groups/edit/:id` - Editar

### Países por Grupo
- `GET /catalogo/group-countries` - Listar
- `GET /catalogo/group-countries/create` - Crear
- `GET /catalogo/group-countries/edit/:id` - Editar

### Partidos
- `GET /catalogo/matches` - Listar
- `GET /catalogo/matches/create` - Crear
- `GET /catalogo/matches/edit/:id` - Editar

## Endpoints de Backend Consumidos

Todos los endpoints están en la ruta base: `http://localhost:8000/api/catalogo/`

- `GET/POST /venues/`
- `GET/PUT/DELETE /venues/:id/`
- `GET/POST /stadiums/`
- `GET/PUT/DELETE /stadiums/:id/`
- `GET/POST /countries/`
- `GET/PUT/DELETE /countries/:id/`
- `GET/POST /tournament-stages/`
- `GET/PUT/DELETE /tournament-stages/:id/`
- `GET/POST /groups/`
- `GET/PUT/DELETE /groups/:id/`
- `GET/POST /group-countries/`
- `GET/PUT/DELETE /group-countries/:id/`
- `GET/POST /matches/`
- `GET/PUT/DELETE /matches/:id/`

## Componentes Principales

### API Client (catalogoApi.js)
Utiliza Axios con instancia personalizada que:
- Agrega token de autenticación automáticamente
- Maneja errores de red
- Proporciona métodos CRUD para cada entidad

### Formularios
- Componentes controlados con React Hooks
- Validación en cliente
- Estados de carga
- Manejo de datos iniciales para edición

### Tablas
- Búsqueda en tiempo real
- Ordenamiento por columnas
- Acciones inline (editar/eliminar)
- Diseño responsive

## Validaciones Implementadas

### Sedes (Venues)
- Nombre requerido
- Ciudad requerida
- País requerido

### Estadios (Stadiums)
- Nombre requerido
- Sede requerida (select dinámico)
- Capacidad requerida y > 0

### Países (Countries)
- Nombre requerido
- Código requerido y máximo 5 caracteres
- Flag URL opcional

### Fases (Tournament Stages)
- Nombre requerido
- Orden requerido y > 0

### Grupos (Groups)
- Nombre requerido
- Fase requerida (select dinámico)

### Asignaciones País-Grupo (GroupCountry)
- Grupo requerido
- País requerido

### Partidos (Matches)
- Equipo local requerido
- Equipo visitante requerido
- Equipo local ≠ Equipo visitante
- Estadio requerido
- Fase requerida
- Fecha requerida
- Goles ≥ 0 si se ingresan

## Hooks Utilizados

- `useState` - Manejo de estado local
- `useEffect` - Efectos secundarios (cargar datos)
- `useNavigate` - Navegación programática
- `useParams` - Parámetros de ruta

## Librerías Utilizadas

- **React Router DOM** - Enrutamiento
- **Axios** - HTTP client
- **CSS Vanilla** - Estilos (sin librerías adicionales)

## Características de Seguridad

- Token JWT enviado automáticamente en headers
- Validación de inputs en cliente
- Manejo de errores del backend
- Protección contra XSS (React escapa HTML)

## Mejoras Futuras

1. Paginación en tablas
2. Exportación a CSV/Excel
3. Importación de datos en masa
4. Gráficos y estadísticas
5. Caché local
6. Sincronización offline
7. Permisos por usuario
8. Auditoría de cambios

## Debugging

### Errores Comunes

**Error 404 en API**
- Verificar que el servidor Django esté corriendo
- Verificar URL base en `catalogoApi.js`
- Verificar que las migraciones estén aplicadas

**Error 401 (No autenticado)**
- Verificar que el token esté en localStorage
- Hacer login en el módulo de autenticación

**Validación falla pero no muestra error**
- Verificar la consola del navegador (F12)
- Revisar respuesta de backend en Network

## Instrucciones de Uso

### Instalar Dependencias
```bash
cd frontend
npm install
```

### Iniciar Aplicación
```bash
npm run dev
```

### Compilar para Producción
```bash
npm run build
```

## Notas Importantes

1. Las imágenes de banderas en Países son opcionales
2. El grupo en Partidos es opcional (para partidos eliminatorios)
3. Los goles se pueden ingresar como null inicialmente
4. El estado del partido es "programado" por defecto
5. La búsqueda es case-insensitive
6. El ordenamiento es alfabético/numérico

## Soporte

Para errores o mejoras, reportar en el sistema de tickets del proyecto.
