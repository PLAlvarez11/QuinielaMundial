#!/bin/sh

echo "Esperando PostgreSQL..."

while ! nc -z db 5432; do
  sleep 1
done

echo "PostgreSQL listo"

python manage.py migrate
python manage.py loaddata worldcup_2026_initial
export DJANGO_SUPERUSER_USERNAME=admin
export DJANGO_SUPERUSER_EMAIL=admin@gmail.com
export DJANGO_SUPERUSER_PASSWORD=123

python manage.py collectstatic --noinput

exec "$@"