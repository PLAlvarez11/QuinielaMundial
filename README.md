# Quiniela Mundial - Plataforma de Predicciones de Fútbol

Una aplicación moderna para crear ligas de predicción de fútbol, permitiendo a usuarios hacer pronósticos de partidos, ganar puntos y competir en rankings en tiempo real.

---

## Tabla de Contenidos

1. [Características](#características)
2. [Requisitos Previos](#requisitos-previos)
3. [Instalación Rápida](#instalación-rápida)
4. [Instalación Detallada](#instalación-detallada)
5. [Comandos Útiles](#comandos-útiles)
6. [Solución de Problemas](#solución-de-problemas)

---

## Características

- Predicciones de partidos - Predice marcadores exactos o resultados
- Ligas personalizables - Crea ligas privadas o públicas
- Rankings en vivo - Tabla de posiciones actualizada automáticamente
- Competencia multijugador - Compite contra amigos y otros usuarios
- Estadísticas detalladas - Análisis de precisión y desempeño
- Sistema de puntos - Gana puntos por predicciones exactas
- Autenticación segura - Sistema de usuarios con JWT
- Responsive design - Funciona en desktop y móvil
- Dark mode - Interfaz moderna y oscura

---

## Requisitos Previos

Para Cualquier Instalación:
- Sistema operativo: Linux, macOS o Windows
- RAM disponible: Mínimo 2GB
- Almacenamiento: Mínimo 5GB
- Conexión a Internet estable
- Git instalado

Para Desarrollo con Docker:
- Docker Desktop instalado
- Docker Compose instalado
- Tiempo: 15 minutos

Para Desarrollo Local (Sin Docker):
- Python 3.12 o superior
- Node.js 18 o superior
- PostgreSQL 12+ (o usar SQLite)
- Tiempo: 30 minutos

Para Producción:
- Servidor Ubuntu 20.04+ o similar
- 2GB RAM mínimo
- 5GB almacenamiento
- Acceso root o sudo
- Dominio apuntando al servidor
- Tiempo: 2 horas

---

## Instalación Rápida

Con Docker (Recomendado):

```bash
# Clonar repositorio
git clone <tu-repo-url> QuinielaMundial
cd QuinielaMundial

# Navegar a desarrollo
cd docker/development

# Levantar servicios
docker compose up --build

# En otra terminal, crear usuario admin
docker compose exec backend python manage.py create_admin
```

Acceder a:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8003
- Admin: http://localhost:8003/admin

Credenciales:
- Usuario: admin
- Contraseña: pass123456

ADVERTENCIA: Cambiar en producción

Sin Docker (Desarrollo Local):

```bash
# Clonar repositorio
git clone <tu-repo-url> QuinielaMundial
cd QuinielaMundial

# Backend
cd backend
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py create_admin
python manage.py runserver 0.0.0.0:8000

# En otra terminal - Frontend
cd frontend
npm install
npm run dev
```

Acceder a:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Admin: http://localhost:8000/admin

---

## Instalación Detallada

OPCION A: Docker - Desarrollo

1. Instalar Docker

Ubuntu/Debian:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io
sudo apt install -y docker-compose
sudo usermod -aG docker $USER
newgrp docker
```

macOS:
```bash
brew install docker docker-compose
# O descargar Docker Desktop
```

Windows:
- Descargar e instalar Docker Desktop para Windows

Verificar:
```bash
docker --version
docker compose --version
```

2. Clonar y Configurar

```bash
cd docker/development
```

3. Levantar Contenedores

```bash
# Construir e iniciar
docker compose up --build

# O en background
docker compose up --build -d
```

Esto levanta:
- PostgreSQL (puerto 5432)
- Backend Django (puerto 8003)
- Frontend React (puerto 5173)

4. Crear Usuario Admin

```bash
docker compose exec backend python manage.py create_admin

# O con datos personalizados
docker compose exec backend python manage.py create_admin \
  --username admin \
  --email admin@example.com \
  --password tu_password
```

5. Cargar Datos Iniciales

```bash
docker compose exec backend python manage.py loaddata \
  catalogo/fixtures/worldcup_2026_initial.json
```

6. Acceder

- Frontend: http://localhost:5173
- Backend API: http://localhost:8003/api
- Admin Django: http://localhost:8003/admin

7. Detener

```bash
docker compose down
```

---

OPCION B: Desarrollo Local (Sin Docker)

1. Backend Setup

```bash
cd backend

# Crear entorno virtual
python3 -m venv venv

# Activar (Linux/Mac)
source venv/bin/activate
# O Windows
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt
```

2. Configurar Base de Datos

Opcion A: PostgreSQL

```bash
# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib  # Linux
# o
brew install postgresql  # Mac

# Crear base de datos
sudo -u postgres createdb quiniela
sudo -u postgres createuser postgres

# En backend/config/settings.py actualizar:
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'quiniela',
        'USER': 'postgres',
        'PASSWORD': 'tu_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

Opcion B: SQLite (más simple para desarrollo)

```bash
# No requiere configuración, usa db.sqlite3 por defecto
```

3. Migraciones

```bash
python manage.py migrate
```

4. Crear Usuario Admin

```bash
python manage.py create_admin
```

5. Cargar Datos Iniciales

```bash
python manage.py loaddata catalogo/fixtures/worldcup_2026_initial.json
```

6. Iniciar Backend

```bash
python manage.py runserver 0.0.0.0:8000
```

Backend disponible en: http://localhost:8000

7. Frontend Setup (Nueva terminal)

```bash
cd frontend

# Instalar dependencias
npm install

# Crear .env.local
echo "VITE_API_URL=http://localhost:8000/api/" > .env.local

# Iniciar desarrollo
npm run dev
```

Frontend disponible en: http://localhost:5173

---

OPCION C: Producción en Servidor Real

1. Preparar Servidor

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependencias
sudo apt install -y \
  python3.12 \
  python3.12-venv \
  python3.12-dev \
  postgresql \
  postgresql-contrib \
  nodejs \
  npm \
  nginx \
  supervisor \
  git \
  curl \
  wget \
  build-essential \
  libpq-dev

# Crear usuario para la aplicación
sudo useradd -m -s /bin/bash quiniela
sudo su - quiniela
```

2. Clonar Repositorio

```bash
cd /home/quiniela
git clone <tu-repo-url> QuinielaMundial
cd QuinielaMundial
```

3. Configurar Backend

```bash
cd backend

# Entorno virtual
python3.12 -m venv venv
source venv/bin/activate

# Dependencias
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn
```

4. Variables de Entorno

Crear backend/.env:

```env
DEBUG=False
SECRET_KEY=tu_secret_key_super_seguro_cambio!
ALLOWED_HOSTS=tudominio.com,www.tudominio.com

DB_ENGINE=postgresql
DB_NAME=quiniela_prod
DB_USER=quiniela_user
DB_PASSWORD=password_muy_seguro_cambio!
DB_HOST=localhost
DB_PORT=5432

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=tu_email@gmail.com
EMAIL_HOST_PASSWORD=tu_app_password
EMAIL_USE_TLS=True

SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

Para generar SECRET_KEY:
```bash
python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

5. Base de Datos PostgreSQL

```bash
sudo -u postgres psql

# Dentro de psql
CREATE DATABASE quiniela_prod;
CREATE USER quiniela_user WITH PASSWORD 'password_muy_seguro_cambio!';
ALTER ROLE quiniela_user SET client_encoding TO 'utf8';
ALTER ROLE quiniela_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE quiniela_user SET default_transaction_deferrable TO on;
GRANT ALL PRIVILEGES ON DATABASE quiniela_prod TO quiniela_user;
\q
```

6. Migraciones y Setup

```bash
cd /home/quiniela/QuinielaMundial/backend
source venv/bin/activate

python manage.py migrate
python manage.py create_admin --username admin --password tu_password_seguro
python manage.py loaddata catalogo/fixtures/worldcup_2026_initial.json
python manage.py collectstatic --noinput
```

7. Configurar Gunicorn como Servicio

```bash
sudo nano /etc/systemd/system/quiniela_backend.service
```

Contenido:

```ini
[Unit]
Description=Gunicorn daemon for Quiniela Mundial Backend
After=network.target

[Service]
User=quiniela
Group=www-data
WorkingDirectory=/home/quiniela/QuinielaMundial/backend
ExecStart=/home/quiniela/QuinielaMundial/backend/venv/bin/gunicorn \
          --workers 3 \
          --bind 127.0.0.1:8000 \
          --timeout 60 \
          config.wsgi:application

Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Habilitar:
```bash
sudo systemctl daemon-reload
sudo systemctl enable quiniela_backend
sudo systemctl start quiniela_backend
sudo systemctl status quiniela_backend
```

8. Frontend Build

```bash
cd /home/quiniela/QuinielaMundial/frontend
npm install
npm run build
```

9. Configurar Nginx

```bash
sudo nano /etc/nginx/sites-available/quiniela
```

Contenido:

```nginx
upstream quiniela_backend {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name tudominio.com www.tudominio.com;

    client_max_body_size 20M;

    location / {
        root /home/quiniela/QuinielaMundial/frontend/dist;
        try_files $uri $uri/ /index.html;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /api/ {
        proxy_pass http://quiniela_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }

    location /admin/ {
        proxy_pass http://quiniela_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /home/quiniela/QuinielaMundial/backend/staticfiles/;
        expires 30d;
    }

    location /media/ {
        alias /home/quiniela/QuinielaMundial/backend/media/;
        expires 7d;
    }
}
```

Habilitar:
```bash
sudo ln -s /etc/nginx/sites-available/quiniela /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

10. SSL con Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d tudominio.com -d www.tudominio.com
```

Actualizar nginx con SSL:
```bash
sudo nano /etc/nginx/sites-available/quiniela
```

Agregar:
```nginx
server {
    listen 443 ssl http2;
    server_name tudominio.com www.tudominio.com;

    ssl_certificate /etc/letsencrypt/live/tudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tudominio.com/privkey.pem;

    # Resto de configuración igual...
}

server {
    listen 80;
    server_name tudominio.com www.tudominio.com;
    return 301 https://$server_name$request_uri;
}
```

Renovar automáticamente:
```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

11. Backups Automáticos

```bash
sudo nano /usr/local/bin/quiniela_backup.sh
```

Contenido:
```bash
#!/bin/bash

BACKUP_DIR="/backups/quiniela"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="quiniela_prod"
DB_USER="quiniela_user"

mkdir -p $BACKUP_DIR

# Backup de base de datos
sudo -u postgres pg_dump -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/db_$TIMESTAMP.sql.gz

# Backup de archivos media
tar -czf $BACKUP_DIR/media_$TIMESTAMP.tar.gz /home/quiniela/QuinielaMundial/backend/media/

# Mantener solo últimos 30 backups
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completado: $TIMESTAMP"
```

Ejecutable:
```bash
sudo chmod +x /usr/local/bin/quiniela_backup.sh

# Agregar a crontab (diariamente a las 2 AM)
sudo crontab -e
# Agregar: 0 2 * * * /usr/local/bin/quiniela_backup.sh
```

---

## Comandos Útiles

Docker Compose:

```bash
# Iniciación
docker compose up                    # Construir e iniciar
docker compose up --build            # Rebuild después de cambios
docker compose up -d                 # Background
docker compose down                  # Detener
docker compose stop                  # Detener sin borrar
docker compose start                 # Reanudar

# Logs
docker compose logs -f               # Logs en tiempo real
docker compose logs -f backend       # Logs de servicio específico
docker compose logs --tail=50        # Últimas 50 líneas

# Ejecutar comandos
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py create_admin
docker compose exec backend bash
docker compose exec db psql -U postgres -d quiniela

# Estado
docker compose ps                    # Ver servicios activos
docker compose stats                 # Ver recursos
```

Django Backend:

```bash
# Migraciones
python manage.py makemigrations      # Crear después de cambios en models
python manage.py migrate             # Aplicar migraciones
python manage.py showmigrations      # Ver estado
python manage.py migrate tabla_posiciones  # App específica

# Usuario Admin
python manage.py create_admin                             # Defecto
python manage.py create_admin --username admin --force    # Forzar

# Datos
python manage.py loaddata archivo.json    # Cargar datos
python manage.py dumpdata > datos.json    # Exportar
python manage.py flush                    # Limpiar todo

# Server
python manage.py runserver 0.0.0.0:8000

# Shell
python manage.py shell

# Tests
python manage.py test
python manage.py test tabla_posiciones

# Estáticos
python manage.py collectstatic --noinput
```

Frontend:

```bash
# Desarrollo
npm install
npm run dev                    # Desarrollo (puerto 5173)
npm run dev -- --host         # Host abierto

# Build
npm run build                  # Build producción
npm run preview               # Previsualizar build

# Linting
npm run lint
npm run lint -- --fix

# Dependencias
npm update
npm audit
npm audit fix
npm install nombre-paquete
npm uninstall nombre-paquete
```

PostgreSQL:

```bash
# Acceso
sudo -u postgres psql
sudo -u postgres psql -d quiniela
psql -U quiniela_user -d quiniela -h localhost

# Dentro de psql
\l                           # Listar databases
\c quiniela                  # Conectar a DB
\dt                          # Listar tablas
\d tabla_name                # Estructura de tabla
\du                          # Listar usuarios
\q                           # Salir

# Backups
pg_dump -U postgres quiniela > backup.sql
pg_dump -U postgres quiniela | gzip > backup.sql.gz
psql -U postgres quiniela < backup.sql
gunzip -c backup.sql.gz | psql -U postgres quiniela
```

Nginx (Producción):

```bash
sudo nginx -t                 # Verificar sintaxis
sudo nginx -s reload          # Recargar sin downtime
sudo systemctl restart nginx
sudo systemctl status nginx
sudo systemctl enable nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

Systemd Services (Producción):

```bash
sudo systemctl status quiniela_backend
sudo systemctl start quiniela_backend
sudo systemctl stop quiniela_backend
sudo systemctl restart quiniela_backend
sudo journalctl -u quiniela_backend -f
sudo journalctl -u quiniela_backend -n 50
sudo journalctl -u quiniela_backend --since "1 hour ago"
sudo systemctl enable quiniela_backend
```

Procesos y Red:

```bash
# Ver procesos escuchando puertos
sudo lsof -i :8000
sudo lsof -i :5173
sudo lsof -i :5432
kill -9 PID

# Espacio en disco
df -h
du -sh *

# Red
netstat -tulpn
ping tudominio.com
nslookup tudominio.com
curl -v http://localhost:8000
curl -I http://localhost:8000
```

---

## Solución de Problemas

Docker no inicia

```bash
# Iniciar servicio Docker
sudo systemctl start docker
sudo systemctl enable docker

# O en macOS
open /Applications/Docker.app
```

Port already in use

```bash
# Encontrar proceso
lsof -i :8003
lsof -i :5173

# O cambiar puerto en docker-compose.yml
# ports:
#   - "8004:8000"
```

Cannot connect to database

```bash
# Ver logs del contenedor
docker compose logs db

# Verificar credenciales en .env
# Reiniciar
docker compose down
docker compose up --build -d
```

Migraciones fallando

```bash
# Ver errores detallados
docker compose logs -f backend

# Crear migraciones
docker compose exec backend python manage.py makemigrations

# Ejecutar migraciones
docker compose exec backend python manage.py migrate --verbosity 2
```

Permisos denegados en Linux

```bash
# Agregar usuario a grupo docker
sudo usermod -aG docker $USER
newgrp docker
```

Base de datos corrupta

```bash
# CUIDADO: Esto borra todos los datos
docker compose down -v
docker compose up --build -d

# Recrear usuario admin
docker compose exec backend python manage.py create_admin
```

Contenedor unhealthy

```bash
# Ver logs detallados
docker compose logs db
docker compose logs backend

# Reiniciar
docker compose down
docker compose up --build -d
```

Backend en 502 Bad Gateway

```bash
# Verificar si Gunicorn corre
curl 127.0.0.1:8000

# Ver logs
sudo journalctl -u quiniela_backend -f
```

Certificado SSL expirado

```bash
sudo certbot renew --dry-run    # Simular renovación
sudo certbot renew              # Renovar
```

---

## Checklist de Instalación

Desarrollo con Docker:
- [ ] Docker y Docker Compose instalados
- [ ] Ejecutado docker compose up --build
- [ ] Accedido a http://localhost:5173
- [ ] Accedido a http://localhost:8003/admin
- [ ] Creado usuario admin
- [ ] Cargados datos iniciales

Desarrollo Local:
- [ ] Python 3.12+ instalado
- [ ] Node.js instalado
- [ ] Entorno virtual creado
- [ ] Dependencias instaladas
- [ ] Base de datos configurada
- [ ] Migraciones ejecutadas
- [ ] Usuario admin creado
- [ ] Backend corriendo en http://localhost:8000
- [ ] Frontend corriendo en http://localhost:5173

Producción:
- [ ] Servidor preparado y actualizado
- [ ] Usuario quiniela creado
- [ ] Backend clonado y configurado
- [ ] Variables de entorno configuradas
- [ ] PostgreSQL creada y configurada
- [ ] Migraciones ejecutadas
- [ ] Usuario admin creado
- [ ] Archivos estáticos recolectados
- [ ] Gunicorn funcionando como servicio
- [ ] Frontend compilado (npm run build)
- [ ] Nginx configurado
- [ ] Certificado SSL instalado
- [ ] Backups configurados
- [ ] Accesible por dominio
- [ ] Admin accesible en /admin
- [ ] API respondiendo en /api/

---

## Información

Versión: 1.0
Última actualización: 26 de mayo de 2026
Estado: En producción

Recursos:
- Documentación Django: https://docs.djangoproject.com/
- Documentación Docker: https://docs.docker.com/compose/
- Documentación Nginx: https://nginx.org/en/docs/
- Documentación PostgreSQL: https://www.postgresql.org/docs/
- Documentación React: https://react.dev/
- Documentación Vite: https://vitejs.dev/

```
QuinielaMundial/
├── backend/                    # Django REST API
│   ├── catalogo/              # Catálogo de torneos y equipos
│   ├── leagues_app/           # Gestión de ligas
│   ├── prediction_engine/     # Motor de predicciones
│   ├── tabla_posiciones/      # Cálculo de rankings
│   ├── prizes/                # Gestión de premios
│   ├── users/                 # Gestión de usuarios
│   ├── config/                # Configuración Django
│   └── manage.py
│
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── pages/             # Páginas principales
│   │   ├── api/               # Llamadas a API
│   │   ├── hooks/             # Custom hooks
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── docker/                     # Configuración Docker
    ├── development/
    │   ├── docker-compose.yml
    │   ├── backend/
    │   │   ├── backend.Dockerfile
    │   │   ├── entrypoint.sh
    │   │   └── requirements.txt
    │   └── frontend/
    │       └── frontend.Dockerfile
    │
    └── production/
        ├── docker-compose.yml
        ├── .env
        ├── backend/
        │   ├── backend.Dockerfile
        │   └── requirements.txt
        └── frontend/
            ├── frontend.Dockerfile
            └── nginx.conf
```

Stack Tecnológico

Backend:
- Python 3.12
- Django 5.x
- Django REST Framework
- PostgreSQL 17
- Gunicorn (servidor WSGI)
- JWT (autenticación)

Frontend:
- React 18
- Vite (build tool)
- Axios (cliente HTTP)
- React Router (routing)

DevOps:
- Docker y Docker Compose
- Nginx (reverse proxy)
- Let's Encrypt (SSL/HTTPS)
