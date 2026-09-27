#!/bin/sh
set -e

echo "==> Running database migrations..."
python manage.py migrate --noinput

echo "==> Ensuring 30 problems, categories, and achievements are seeded..."
python manage.py seed_db || true

echo "==> Creating/updating admin accounts from ADMIN_USERS..."
python manage.py ensure_admins || echo "!! WARNING: ensure_admins failed - check the ADMIN_USERS env var"

echo "==> Starting Gunicorn server on 0.0.0.0:${PORT:-8000}..."
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:${PORT:-8000} \
    --workers ${WEB_CONCURRENCY:-2} \
    --timeout 120
