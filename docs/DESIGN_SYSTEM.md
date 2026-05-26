# 🎨 DESIGN SYSTEM - Guía de Estilos Global

## 📌 Introducción

Este documento define el sistema de diseño visual para toda la aplicación **QuinielaMundial**.  
Inspirado en plataformas modernas de deportes (FIFA, ESPN, SofaScore).

Todos los módulos deben seguir estos estándares para mantener consistencia visual y profesionalismo.

---

## 🎯 Principios de Diseño

1. **Dark Mode First** - Fondo oscuro profesional
2. **Modern & Clean** - Interfaces simples, no clutter
3. **Glassmorphism** - Efectos translúcidos sutiles
4. **Smooth Transitions** - Animaciones profesionales
5. **Responsive** - Mobile-first approach
6. **Accesible** - WCAG AA compliant
7. **Performant** - Hardware-accelerated CSS

---

## 🎨 PALETA DE COLORES

### Fondos
```css
--bg-primary: #0B1220;       /* Fondo principal, muy oscuro */
--bg-secondary: #111827;     /* Fondo alternativo */
--surface-card: #1F2937;     /* Cards, panels, containers */
--surface-hover: #374151;    /* Superficie en hover state */
--surface-active: #4B5563;   /* Superficie activa/selected */
```

### Colores Funcionales
```css
--blue-primary: #2563EB;     /* Botones, links, acciones primarias */
--blue-hover: #1D4ED8;       /* Hover del azul */
--blue-light: #60A5FA;       /* Azul claro para secondary */
--blue-ghost: rgba(37, 99, 235, 0.1);  /* Fondo sutil azul */

--green-success: #10B981;    /* Estados exitosos, validación */
--green-light: #6EE7B7;      /* Texto verde claro */

--red-error: #EF4444;        /* Estados de error, alerta */
--red-light: #FCA5A5;        /* Texto rojo claro */

--yellow-accent: #F59E0B;    /* Acentos, highlights */
--yellow-light: #FCD34D;     /* Amarillo claro */

--neutral-dark: #1F2937;     /* Neutral oscuro (cards) */
--neutral-light: #D1D5DB;    /* Neutral claro (text secondary) */
```

### Texto
```css
--text-primary: #F9FAFB;     /* Texto principal, muy claro */
--text-secondary: #9CA3AF;   /* Texto secundario, gris */
--text-muted: #6B7280;       /* Texto apagado */
--text-inverse: #0B1220;     /* Texto sobre fondos claros */
```

### Bordes y Dividers
```css
--border-subtle: rgba(255, 255, 255, 0.08);    /* Borde sutil */
--border-medium: rgba(255, 255, 255, 0.12);    /* Borde medio */
--border-strong: rgba(255, 255, 255, 0.16);    /* Borde prominente */
```

---

## 🔤 TIPOGRAFÍA

### Font Stack
```javascript
fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
```

**Importante**: Inter debe estar importado en HTML o CSS.

### Tamaños Estándar
```css
--text-xs:    12px;  /* Labels pequeños, hints */
--text-sm:    13px;  /* Texto secundario, labels */
--text-base:  14px;  /* Texto por defecto */
--text-lg:    15px;  /* Botones, inputs */
--text-xl:    16px;  /* Títulos pequeños */
--text-2xl:   18px;  /* Subtítulos */
--text-3xl:   22px;  /* Títulos medianos */
--text-4xl:   26px;  /* Títulos grandes */
--text-5xl:   32px;  /* Títulos principal */
```

### Pesos
```css
--font-normal:   400;  /* Normal */
--font-medium:   500;  /* Medium (inputs, botones) */
--font-semibold: 600;  /* Semi-bold (labels, subtítulos) */
--font-bold:     700;  /* Bold (títulos) */
```

### Line Heights
```css
--lh-tight:   1.4;    /* Titulos */
--lh-normal:  1.6;    /* Párrafos */
--lh-loose:   1.8;    /* Espaciado generoso */
```

---

## 📦 SPACING

Sistema de espaciado basado en 4px:

```css
--space-1:   4px;
--space-2:   8px;
--space-3:   12px;
--space-4:   16px;
--space-5:   20px;
--space-6:   24px;
--space-7:   28px;
--space-8:   32px;
--space-10:  40px;
--space-12:  48px;
--space-16:  64px;
```

### Aplicación Común
```css
/* Cards/Containers */
padding: 24px;      /* --space-6 */
border-radius: 12px;

/* Botones */
padding: 12px 20px; /* --space-3 vertical, --space-5 horizontal */

/* Inputs */
padding: 14px 16px; /* Ligeramente más */

/* Espaciado entre elementos */
gap: 12px;          /* Entre items en row */
margin-bottom: 24px; /* Entre secciones */
```

---

## 🎛️ BORDER RADIUS

```css
--radius-sm:  6px;    /* Inputs secundarios, pequeños elementos */
--radius-md:  10px;   /* Inputs, botones primarios */
--radius-lg:  12px;   /* Cards, containers medianos */
--radius-xl:  16px;   /* Cards grandes, major containers */
--radius-2xl: 20px;   /* Muy grandes, especiales */
```

---

## 💫 SOMBRAS

```css
/* Elevation 1 - Subtle */
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

/* Elevation 2 - Light */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

/* Elevation 3 - Medium (Cards) */
box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);

/* Elevation 4 - High (Floating elements) */
box-shadow: 0 20px 25px rgba(0, 0, 0, 0.3);

/* Elevation 5 - Very High (Modals, Dropdowns) */
box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);

/* Inset (Glassmorphism) */
box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);

/* Color-specific (Blue action) */
box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
```

---

## ⏱️ TRANSICIONES

```css
/* Rápido */
--transition-fast: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);

/* Normal (default) */
--transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Lento */
--transition-slow: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

/* Solo propiedades específicas */
--transition-colors: color 0.3s ease, background-color 0.3s ease;
--transition-transform: transform 0.3s ease;
```

**Timing Function Explainado**:
- `cubic-bezier(0.4, 0, 0.2, 1)` = Material Design easing
- Siente natural y no es demasiado fast
- Trabaja bien en web y mobile

---

## 🎬 ANIMACIONES

### Entrada Suave (Slide In)
```css
@keyframes slideInUpSmooth {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Uso */
animation: slideInUpSmooth 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
```

### Fade In con Scale
```css
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

## 🔘 COMPONENTES

### Botón Primario
```javascript
const buttonPrimary = {
  padding: '14px 20px',
  fontSize: '15px',
  fontWeight: '600',
  color: '#FFF',
  backgroundColor: '#2563EB',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
};

const buttonPrimaryHover = {
  backgroundColor: '#1D4ED8',
  transform: 'translateY(-2px)',
  boxShadow: '0 8px 20px rgba(37, 99, 235, 0.4)',
};
```

### Botón Secundario
```javascript
const buttonSecondary = {
  padding: '12px 18px',
  fontSize: '14px',
  fontWeight: '600',
  color: '#60A5FA',
  backgroundColor: 'rgba(37, 99, 235, 0.08)',
  border: '1px solid rgba(37, 99, 235, 0.2)',
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};
```

### Input
```javascript
const input = {
  padding: '14px 16px',
  fontSize: '14px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '10px',
  boxSizing: 'border-box',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  color: '#F9FAFB',
};

const inputFocus = {
  borderColor: '#2563EB',
  backgroundColor: 'rgba(37, 99, 235, 0.08)',
  boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
  outline: 'none',
};
```

### Card
```javascript
const card = {
  backgroundColor: '#1F2937',
  borderRadius: '12px',
  boxShadow: '0 10px 15px rgba(0, 0, 0, 0.2)',
  padding: '24px',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(10px)',
};
```

### Badge/Chip
```javascript
const badge = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px 12px',
  fontSize: '12px',
  fontWeight: '600',
  backgroundColor: 'rgba(37, 99, 235, 0.1)',
  color: '#60A5FA',
  borderRadius: '6px',
  border: '1px solid rgba(37, 99, 235, 0.2)',
};
```

---

## 🛡️ ESTADOS

### Hover
```css
opacity: 1;
transform: translateY(-2px);
box-shadow: [elevated];
```

### Active/Pressed
```css
transform: translateY(0);
```

### Disabled/Disabled
```css
opacity: 0.6;
cursor: not-allowed;
box-shadow: none;
```

### Focus (Keyboard)
```css
outline: 2px solid #2563EB;
outline-offset: 2px;
```

### Error
```css
borderColor: #EF4444;
backgroundColor: rgba(239, 68, 68, 0.1);
color: #FCA5A5;
```

### Success
```css
borderColor: #10B981;
backgroundColor: rgba(16, 185, 129, 0.1);
color: #6EE7B7;
```

---

## 📱 RESPONSIVE

### Breakpoints
```css
/* Mobile */
@media (max-width: 480px) { }

/* Tablet */
@media (max-width: 768px) { }

/* Desktop */
@media (min-width: 1024px) { }

/* Large */
@media (min-width: 1280px) { }
```

### Mobile-First Approach
- Empezar con estilos móviles
- Usar `min-width` para crecer
- Inputs: mínimo 16px en móvil (prevenir zoom)
- Botones: mínimo 44x44px (accesibilidad)

---

## ♿ ACCESIBILIDAD

### Color Contrast
- Texto vs Fondo: mínimo 4.5:1 (AA)
- Usado en paleta: cumple con WCAG AA

### Focus Visible
```css
button:focus-visible,
input:focus-visible {
  outline: 2px solid #2563EB;
  outline-offset: 2px;
}
```

### Keyboard Navigation
- Todos los botones son tabulables
- Orden lógico de tab
- Enter/Space triggean clicks

### Dark Mode Support
```css
@media (prefers-color-scheme: dark) {
  /* Verificar preferencia del usuario */
}
```

---

## 🚀 CÓMO USAR EN OTROS MÓDULOS

### Opción 1: Copiar styles.css
```javascript
// En cada módulo
import './styles.css';

// Luego usar variables
const myComponent = {
  backgroundColor: 'var(--surface-card)',
  color: 'var(--text-primary)',
};
```

### Opción 2: Global styles.css
Crear un archivo global en `/src/styles/theme.css`:
```css
/* Exportar variables globales */
:root {
  /* Importar todas las variables del design system */
}
```

Luego en cada módulo:
```javascript
// Ya disponible globalmente sin importar
const myComponent = {
  backgroundColor: 'var(--surface-card)',
};
```

### Opción 3: Archivo de Utilidades (Recomendado)
Crear `/src/styles/designSystem.js`:
```javascript
export const colors = {
  bgPrimary: '#0B1220',
  surfaceCard: '#1F2937',
  bluePrimary: '#2563EB',
  textPrimary: '#F9FAFB',
};

export const typography = {
  fontFamily: "'Inter', sans-serif",
  sizes: { xs: '12px', sm: '13px', /* ... */ },
  weights: { normal: 400, bold: 700 },
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
};

export const shadows = {
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  md: '0 4px 6px rgba(0,0,0,0.1)',
  lg: '0 10px 15px rgba(0,0,0,0.2)',
  xl: '0 20px 25px rgba(0,0,0,0.3)',
};
```

Luego en componentes:
```javascript
import { colors, spacing } from '@/styles/designSystem';

const myStyles = {
  container: {
    backgroundColor: colors.surfaceCard,
    padding: spacing.lg,
  },
};
```

---

## ✅ CHECKLIST PARA NUEVOS MÓDULOS

- [ ] Usar la paleta de colores definida
- [ ] Tipografía: Inter font family
- [ ] Spacing: múltiplos de 4px
- [ ] Border radius: 10px-16px mínimo
- [ ] Sombras: elevation system
- [ ] Transiciones: cubic-bezier smoothing
- [ ] Hover states: -2px translateY
- [ ] Focus states: outline azul
- [ ] Responsive: mobile-first
- [ ] Accesibilidad: WCAG AA
- [ ] Dark mode completo

---

## 📚 REFERENCIAS

- Material Design 3: https://m3.material.io/
- SofaScore: Modern sports UI
- ESPN Design: Dashboard patterns
- Tailwind CSS: Color system inspiration

---

**Design System Version**: 1.0  
**Last Updated**: Mayo 25, 2026  
**Status**: ✅ Active & Maintained
