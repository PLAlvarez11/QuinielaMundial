# Guía Rápida - CRUD Catálogo del Mundial

## Inicio Rápido

### 1. Acceder al Módulo
1. Navega a la sección "M5 - Administración del Mundial"
2. Verás un sidebar con el menú del Catálogo

### 2. Orden Recomendado de Uso

El módulo funciona mejor si completas los datos en este orden:

```
1. PAÍSES
   ├─ Crear todos los países
   └─ (Opcional) Agregar URL de banderas

2. SEDES
   ├─ Crear todas las sedes del mundial
   └─ Ejemplo: "Estadio Azteca", "Ciudad de México", "México"

3. ESTADIOS
   ├─ Asignar cada estadio a una sede
   └─ Ingresar capacidad

4. FASES DEL TORNEO
   ├─ Crear orden de fases
   └─ Ejemplo: 1="Fase de Grupos", 2="Octavos", etc.

5. GRUPOS
   ├─ Crear grupos para cada fase
   └─ Ejemplo: Grupo A, Grupo B, etc. en Fase de Grupos

6. PAÍSES POR GRUPO
   ├─ Asignar países a grupos
   └─ Hacerlo después de crear grupos y países

7. PARTIDOS
   ├─ Crear partidos especificando:
   │  ├─ Equipos local y visitante
   │  ├─ Estadio
   │  ├─ Fase
   │  ├─ Grupo (si aplica)
   │  └─ Fecha
   └─ Actualizar resultados conforme se jueguen
```

## Operaciones Comunes

### Crear un Registro
1. Haz clic en "+ Nuevo [Entidad]" (botón verde)
2. Completa los campos requeridos (marcados con asterisco)
3. Valida que los datos sean correctos
4. Haz clic en "Guardar"
5. Verás un toast confirmando la creación

### Editar un Registro
1. En la tabla, localiza el registro
2. Haz clic en el botón ✏️ (lápiz)
3. Modifica los campos necesarios
4. Haz clic en "Guardar"
5. Serás redirigido a la lista

### Buscar
1. En cada listado hay un campo de búsqueda
2. Escribe parte del nombre, código o cualquier campo visible
3. La tabla se filtra automáticamente
4. La búsqueda es case-insensitive

### Ordenar
1. Haz clic en los headers de las columnas
2. Primera vez = Ascendente (▲)
3. Segunda vez = Descendente (▼)
4. El símbolo indica la columna y dirección actual

### Eliminar
1. Localiza el registro en la tabla
2. Haz clic en el botón 🗑️ (basura)
3. Confirma en el modal de confirmación
4. El registro se eliminará permanentemente
5. Verás un toast de confirmación

## Campos Especiales

### Select Dinámicos (Desplegables)
Algunos campos cargan opciones desde otros recursos:

- **Estadio en Sedes**: Se carga desde la lista de sedes creadas
- **Fase en Grupos**: Se carga desde la lista de fases
- **País/Grupo en Partidos**: Se cargan desde listas existentes

💡 **Consejo**: Si un desplegable está vacío, crea primero los registros padre.

### URLs de Banderas
En Países puedes agregar una URL de imagen:
```
https://flagcdn.com/w320/ar.png  (Argentina)
https://flagcdn.com/w320/br.png  (Brasil)
https://flagcdn.com/w320/de.png  (Alemania)
```

La imagen se previsualizará en el formulario.

### Fecha/Hora de Partidos
- Formato: DD/MM/YYYY HH:MM
- Usa el selector de fecha/hora
- La fecha es requerida
- Se almacena en UTC

### Goles
- Deja en blanco si el partido no ha comenzado
- Usa solo números ≥ 0
- Puedes actualizar conforme avanza el partido
- Cambia el estado a "En curso" o "Finalizado"

## Validaciones Comunes

### Error: "Este campo es requerido"
❌ Falta completar un campo obligatorio
✅ Asegúrate de llenar todos los campos con *

### Error: "Los equipos no pueden ser iguales"
❌ Seleccionaste el mismo país para local y visitante
✅ Elige dos países diferentes

### Error: "La capacidad debe ser mayor a 0"
❌ Ingresaste 0 o número negativo
✅ Ingresa un número positivo

### Error: "El código no puede exceder 5 caracteres"
❌ Código demasiado largo (ej: "ARGENTINA")
✅ Usa código corto (ej: "AR")

## Consejos de Uso

### 📌 Mejores Prácticas
1. **Antes de partidos**: Asigna todos los países a grupos
2. **Verificación**: Revisa que todos los datos sean correctos antes de confirmar
3. **Copias de seguridad**: El sistema no tiene undo, ten cuidado al eliminar
4. **Actualizaciones**: Actualiza resultados conforme se jueguen los partidos

### ⚡ Atajos
- `Esc` en la mayoría de formularios cancela
- Click en "← Volver" regresa sin guardar
- La búsqueda filtra mientras escribes

### 🔄 Sincronización
- Los cambios se guardan inmediatamente en el backend
- No hay guardado automático de borradores
- Si refrescas, los cambios no guardados se pierden

## Solución de Problemas

### La tabla está vacía
1. ¿Creaste registros? Haz clic en "+ Nuevo [Entidad]"
2. Revisa los filtros de búsqueda
3. Recarga la página (F5)

### Los desplegables no cargan opciones
1. Primero crea registros en la entidad padre
2. Recarga la página
3. Ejemplo: Crea sedes antes de crear estadios

### Un registro no se actualiza
1. Verifica que completaste todos los campos requeridos
2. Revisa los mensajes de error
3. Si persiste, recarga la página

### Veo un error 500 del servidor
1. Verifica que el backend Django esté corriendo
2. Revisa la consola del backend para más detalles
3. Intenta nuevamente

## Datos de Ejemplo para Pruebas

### Sedes
| Nombre | Ciudad | País |
|--------|--------|------|
| Estadio Azteca | México | México |
| Maracaná | Río de Janeiro | Brasil |
| Lusail Stadium | Lusail | Qatar |

### Estadios
| Nombre | Sede | Capacidad |
|--------|------|-----------|
| Azteca | Estadio Azteca | 87506 |
| Maracaná | Maracaná | 78838 |
| Lusail | Lusail Stadium | 80000 |

### Países
| Nombre | Código | Flag URL |
|--------|--------|----------|
| Argentina | AR | https://flagcdn.com/w320/ar.png |
| Brasil | BR | https://flagcdn.com/w320/br.png |
| México | MX | https://flagcdn.com/w320/mx.png |

### Fases
| Nombre | Orden |
|--------|-------|
| Fase de Grupos | 1 |
| Octavos de Final | 2 |
| Cuartos de Final | 3 |
| Semifinales | 4 |
| Final | 5 |

## Contacto & Soporte

Para preguntas o problemas:
1. Revisa el README.md completo
2. Consulta a tu equipo de desarrollo
3. Revisa los logs del navegador (F12 → Console)

---
**Última actualización**: Mayo 2026
**Versión**: 1.0
