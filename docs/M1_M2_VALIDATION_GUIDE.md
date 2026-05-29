# Guía de Validación M1 (Autenticación) y M2 (Ligas)

## URL de Prueba
- **Backend**: http://localhost:8080/api
- **Frontend**: http://localhost:5173

---

## MÓDULO M1 - AUTENTICACIÓN

### 1. Registro (POST /api/users/register/)
**Validar:**
- ✓ Contraseña cifrada con bcrypt
- ✓ Email único (no permite duplicados)
- ✓ Contraseña mínimo 6 caracteres
- ✓ Retorna datos del usuario creado

**Pasos:**
1. En Frontend: Ir a `http://localhost:5173/m1-auth/login`
2. Hacer clic en "Crear una cuenta"
3. Ingresa:
   - Email: `user1@test.com`
   - Nombre: `User One`
   - Contraseña: `password123`
   - Confirmar: `password123`
4. Verifica que se redirija al login automáticamente

**Validación de error:**
- Intenta registrar con mismo email → "El email ya está registrado"
- Intenta con contraseña < 6 caracteres → "debe tener al menos 6 caracteres"

---

### 2. Inicio de Sesión (POST /api/users/login/)
**Validar:**
- ✓ Token SHA256 con expiración (7 días)
- ✓ IP address y User-Agent registrados
- ✓ Sesión creada en DB

**Pasos:**
1. Login con credenciales: `user1@test.com` / `password123`
2. Verifica que aparezca el token en localStorage:
   ```javascript
   console.log(localStorage.getItem('authToken'))
   ```
3. Verifica redirección a home

**Validación de error:**
- Email incorrecto → "Email o contraseña inválidos"
- Contraseña incorrecta → "Email o contraseña inválidos"

---

### 3. Obtener Usuario (GET /api/users/about-me/)
**Validar:**
- ✓ Requiere autenticación (Bearer token)
- ✓ Retorna datos del usuario autenticado

**Pasos:**
1. Después del login, abre DevTools
2. En Network tab, busca una petición GET a `/about-me/`
3. Verifica que contenga header: `Authorization: Bearer <token>`

---

### 4. Cierre de Sesión (POST /api/users/logout/)
**Validar:**
- ✓ Marca sesión como cerrada
- ✓ Limpia token del localStorage
- ✓ Requiere autenticación

**Pasos:**
1. Click en botón "Logout"
2. Verifica que localStorage esté limpio
3. Intenta navegar a `/m2-league/list` → Redirecciona a login

---

## MÓDULO M2 - LIGAS

### 1. Crear Liga (POST /api/leagues/leagues/)
**Validar:**
- ✓ Solo usuarios autenticados
- ✓ Owner se agrega automáticamente como miembro
- ✓ Validaciones de max_members > 0 y entry_fee >= 0

**Pasos:**
1. Después de login, ir a `http://localhost:5173/m2-league/create`
2. Completa el formulario:
   - Nombre: `Liga Test`
   - Tipo: `invited`
   - Max miembros: `4`
   - Cuota: `100.00`
3. Click en "Crear Liga"
4. Verifica que se muestre en el detalle

**Validación de error:**
- max_members = 0 → Error
- entry_fee = -10 → Error
- Intenta sin autenticación → 401 Unauthorized

---

### 2. Crear Invitación (POST /api/leagues/invitations/)
**Validar:**
- ✓ Solo el propietario puede crear invitaciones
- ✓ Genera UUID único de token
- ✓ Expira en 7 días
- ✓ Envía email (simulado en console backend)

**Pasos:**
1. En el detalle de la liga, busca sección "Invitaciones"
2. Click en "Invitar a participante"
3. Ingresa email: `user2@test.com`
4. Click "Enviar invitación"
5. Verifica en consola del backend el email enviado

**Validación de error:**
- Usuario no propietario intenta crear invitación → 403 Forbidden
- Liga no existe → 404
- Email inválido → Validación de email

---

### 3. Aceptar Invitación (POST /api/leagues/invitations/accept_invitation/)
**Validar:**
- ✓ Valida que token exista
- ✓ Valida que no haya expirado
- ✓ Valida que email coincida con usuario
- ✓ No permite duplicados (ya es miembro)
- ✓ Respeta límite de max_members

**Pasos Flujo Completo:**
1. **Crear usuario 2:**
   - Click en "Crear una cuenta"
   - Email: `user2@test.com`
   - Nombre: `User Two`
   - Contraseña: `password123`

2. **Usar token de invitación:**
   - Copia el token de la invitación creada (desde la consola o logs del backend)
   - Navega a: `http://localhost:5173/m2-league/accept-invitation/{TOKEN}`
   - Ejemplo: `http://localhost:8080/m2-league/accept-invitation/63ea1654-d1a9-42fd-85f7-353234f83511`

3. **Verificar aceptación:**
   - Aparece formulario para "Nombre del Equipo"
   - Ingresa: `Equipo User Two`
   - Click "Aceptar Invitación"
   - Verifica redirección a detalle de liga
   - Verifica que `user2@test.com` aparezca en miembros

**Validación de error:**
- Token inválido → "Token inválido"
- Token expirado (> 7 días) → "La invitación ha expirado"
- Email no coincide → "El email del token no coincide"
- Ya es miembro → "Ya eres miembro de esta liga"
- Liga llena → "La liga ha alcanzado el máximo de miembros"

---

### 4. Rechazo de Invitación (POST /api/leagues/invitations/reject_invitation/)
**Validar:**
- ✓ Solo el invitado puede rechazar
- ✓ Marca invitación como rechazada

**Pasos:**
1. (Crear invitación similar a la anterior)
2. Navega a: `http://localhost:5173/m2-league/accept-invitation/{TOKEN}`
3. En formulario, busca botón "Rechazar Invitación"
4. Verifica que cambio a "rechazada" en DB

---

### 5. Listar Ligas (GET /api/leagues/leagues/)
**Validar:**
- ✓ Retorna lista de ligas
- ✓ Requiere autenticación
- ✓ Includes: nombre, owner, miembros

**Pasos:**
1. Ir a `http://localhost:5173/m2-league/list`
2. Verifica que aparezcan todas las ligas creadas
3. Verifica que muestre:
   - Nombre de la liga
   - Nombre del owner
   - Cantidad de miembros

---

## PERMISOS (Authorization)

### Validar que solo el owner edita/borra liga
1. Login como User One (creador de liga)
2. Ir a detalle de liga
3. Verifica que botón "Editar" esté habilitado
4. Logout y login como User Two
5. Intenta editar: Verifica que esté deshabilitado o retorne 403

### Validar que solo owner crea invitaciones
1. Login como User One
2. En detalle de liga, verifica que pueda crear invitaciones
3. Logout y login como User Two (que es miembro)
4. Intenta crear invitación: Debe retornar 403 Forbidden

---

## EMAIL (Configuración)

### Para testing local (Console Backend):
- Las invitaciones se envían a stdout (consola)
- Busca logs de: "Invitación enviada a..."

### Para testing en producción:
- Configura variables de entorno:
  ```bash
  EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
  EMAIL_HOST=smtp.gmail.com
  EMAIL_PORT=587
  EMAIL_USE_TLS=True
  EMAIL_HOST_USER=tu_email@gmail.com
  EMAIL_HOST_PASSWORD=tu_app_password
  DEFAULT_FROM_EMAIL=noreply@quiniela-mundial.com
  FRONTEND_URL=https://tu_dominio.com
  ```

---

## CHECKLIST FINAL

### M1 - Autenticación
- [ ] Registro con contraseña cifrada (bcrypt)
- [ ] Login con token SHA256
- [ ] Token expira en 7 días
- [ ] Logout marca sesión como cerrada
- [ ] Requiere autenticación para rutas protegidas

### M2 - Ligas
- [ ] Crear liga (solo autenticados)
- [ ] Owner es miembro automático
- [ ] Crear invitación (solo owner)
- [ ] Validar token de invitación
- [ ] Aceptar invitación con email válido
- [ ] Rechazar invitación
- [ ] No exceder max_members
- [ ] Permisos: solo owner edita/borra
- [ ] Email de invitación se envía

### Flujos Completos
- [ ] Registro → Login → Crear Liga → Invitar → Aceptar invitación
- [ ] Validar errores: emails duplicados, permisos, expiración
- [ ] Validar en vivo en URL desplegada (http://localhost:8080)

---

## COMANDOS ÚTILES

### Ejecutar script de validación:
```bash
cd /home/estiven/QuinielaMundial/backend
python test_m1_m2_validation.py
```

### Crear migraciones:
```bash
python manage.py makemigrations
python manage.py migrate
```

### Ver logs del backend:
```bash
# En terminal Docker o local
# Busca: "Invitación enviada a..."
# Busca: "Error enviando..."
```

### Testing con curl:
```bash
# Registro
curl -X POST http://localhost:8080/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","name":"Test","password":"test123"}'

# Login
curl -X POST http://localhost:8080/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Crear Liga (requiere token)
curl -X POST http://localhost:8080/api/leagues/leagues/ \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test League","type":"invited","max_members":5,"entry_fee":"100.00"}'
```
