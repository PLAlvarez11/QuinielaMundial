# M4 Scoreboard - Módulo de Marcador y Clasificación

## Descripción

El módulo M4 Scoreboard es una interfaz funcional para mostrar en tiempo real:
- **Tabla de posiciones** (standings) de las ligas
- **Calendario de partidos** (matches) con sus resultados

## Estructura

```
M4Scoreboard/
├── main.jsx              # Componente principal con navegación por tabs
├── main.css              # Estilos del componente principal
├── Standings.jsx         # Componente de tabla de posiciones
├── Standings.css         # Estilos de la tabla
├── Matches.jsx           # Componente de calendario de partidos
├── Matches.css           # Estilos de partidos
├── hooks/
│   ├── useStandings.js   # Hook para obtener datos de posiciones
│   ├── useMatches.js     # Hook para obtener datos de partidos
│   └── index.js          # Exportar todos los hooks
└── index.jsx             # Exportar componentes principales
```

## Características

### Tabla de Posiciones
- ✅ Podio visual (top 3) con medallas
- ✅ Tabla completa ordenada por puntos
- ✅ Indicadores de cambio de posición (↑ ↓ =)
- ✅ Puntos acumulados por usuario
- ✅ Información de posiciones anteriores
- ✅ Estadísticas generales (total participantes, líder)

### Calendario de Partidos
- ✅ Partidos agrupados por jornada
- ✅ Visualización de resultados finales
- ✅ Estado del partido (Programado, En vivo, Finalizado)
- ✅ Fechas y horas de los partidos
- ✅ Estadísticas de partidos (total, finalizados, pendientes)

### Interactividad
- ✅ Selector de liga
- ✅ Navegación por tabs (Posiciones / Partidos)
- ✅ Botón de recargar datos
- ✅ Indicadores de carga
- ✅ Manejo de errores

## API Endpoints

El módulo consume los siguientes endpoints del backend:

### Ligas
- `GET /api/leagues/` - Obtener lista de ligas

### Tabla de Posiciones
- `GET /api/tabla-posiciones/standings/` - Obtener tabla de posiciones (última ronda)

### Partidos
- `GET /api/tabla-posiciones/matches/` - Obtener todos los partidos

## Componentes

### Main (main.jsx)
Componente raíz que maneja:
- Carga de ligas disponibles
- Selector de liga activa
- Navegación por tabs
- Gestión de estado de UI

### Standings (Standings.jsx)
Muestra:
- Podio visual (top 3)
- Tabla completa de posiciones
- Información de cambios de posición
- Estadísticas generales

### Matches (Matches.jsx)
Muestra:
- Partidos agrupados por jornada
- Resultados o fecha programada
- Estado del partido (badges)
- Estadísticas de partidos

## Hooks Personalizados

### useStandings(leagueId)
Obtiene datos de la tabla de posiciones.

**Retorna:**
```javascript
{
  standings: Array,  // Array de posiciones
  loading: boolean,  // Si está cargando
  error: string,     // Mensaje de error (si hay)
  reload: Function   // Función para recargar
}
```

### useMatches(leagueId)
Obtiene datos de los partidos.

**Retorna:**
```javascript
{
  matches: Array,    // Array de partidos
  loading: boolean,  // Si está cargando
  error: string,     // Mensaje de error (si hay)
  reload: Function   // Función para recargar
}
```

## Estilos

### Tema
- Fondo oscuro (#0F172A, #111827)
- Colores de acentos azules (#3B82F6, #60A5FA)
- Texto claro (#F9FAFB, #D1D5DB)
- Efectos de hover y transiciones suaves

### Responsivo
- Desktop: Layout completo
- Tablet (≤768px): Ajustes en grid y espaciado
- Mobile (≤480px): Layout simplificado, stack vertical

## Uso

```jsx
import M4ScoreboardMain from '@/pages/M4Scoreboard';

// En tu router o componente:
<M4ScoreboardMain />
```

## Notas de Desarrollo

1. **Dependencias de componentes:**
   - `Loader` - Para estado de carga
   - `Toast` - Para notificaciones
   - `useToast` - Hook para notificaciones

2. **Icons:**
   - Se usa `react-icons/fi` (Feather icons)

3. **API:**
   - Se usa `axiosInstance` configurada en `/api/axiosConfig.js`

## Próximas Mejoras

- [ ] Filtros avanzados (por jornada, estado)
- [ ] Gráficas de puntos en el tiempo
- [ ] Predicciones del usuario integradas
- [ ] Exportar datos (CSV, PDF)
- [ ] Comparador de usuarios
- [ ] Análisis estadístico
