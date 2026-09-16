#!/bin/sh
set -e

echo "==> Running database migrations..."
python manage.py migrate --noinput

echo "==> Ensuring 30 problems, categories, and achievements are seeded..."
python manage.py seed_db || true

echo "==> Starting Gunicorn server on 0.0.0.0:${PORT:-8000}..."
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:${PORT:-8000} \
    --workers 3 \
    --timeout 120
