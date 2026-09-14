# CodeArena

**Code. Compete. Level Up.**

Full-stack online coding platform: solve problems in a Monaco IDE, run/submit solutions, earn XP, level up, unlock achievements, and climb the leaderboard.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Monaco Editor, Lucide |
| Backend | Django 6, Django REST Framework, SimpleJWT |
| Database | PostgreSQL (production) / SQLite (local default) |
| Production | Gunicorn, WhiteNoise, CORS, env-based config |

## Project structure

```
projrct 2/
├── backend/                 # Django API
│   ├── accounts/            # Users, profiles, auth, dashboard
│   ├── problems/            # Categories, problems, test cases, seed
│   ├── submissions/         # Run/submit + CodeExecutionService
│   ├── gamification/        # XP, streaks, achievements, leaderboard
│   ├── config/              # Settings, URLs
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── Procfile
│   └── .env.example
├── frontend/                # Next.js app
│   ├── src/app/             # Pages
│   ├── src/components/      # UI, IDE, layout
│   └── .env.example
└── README.md
```

## Local setup

### 1. Backend

```bash
cd backend
python -m venv ../.venv

# Windows
..\.venv\Scripts\activate

# macOS/Linux
source ../.venv/bin/activate

pip install -r requirements.txt
copy .env.example .env   # or: cp .env.example .env

# Leave DATABASE_URL empty/unset for SQLite, or set PostgreSQL URL
python manage.py migrate
python manage.py seed_db
python manage.py createsuperuser   # optional; seed creates admin/admin123
python manage.py runserver 8000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api

npm install
npm run dev
```

Open http://localhost:3000

### Demo accounts (from seed)

| User | Password | Notes |
|------|----------|-------|
| admin | admin123 | Admin dashboard |
| alice | pass1234 | Demo coder |

## PostgreSQL

```bash
# Create DB
createdb codearena

# backend/.env
DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/codearena
SECRET_KEY=...
DEBUG=False
ALLOWED_HOSTS=your-domain.com
CORS_ALLOWED_ORIGINS=https://your-frontend.com
JWT_SECRET_KEY=...
```

Then:

```bash
python manage.py migrate
python manage.py seed_db
python manage.py collectstatic --noinput
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

## Environment variables

**Backend**

- `SECRET_KEY`
- `DEBUG`
- `ALLOWED_HOSTS`
- `DATABASE_URL`
- `CORS_ALLOWED_ORIGINS`
- `JWT_SECRET_KEY`
- `CODE_EXECUTION_BACKEND` (`local_safe` | `docker`)
- `CODE_EXECUTION_ALLOW_MOCK` (`1` for non-Python demo without Docker)

**Frontend**

- `NEXT_PUBLIC_API_URL` — e.g. `https://api.example.com/api`

## Code execution architecture

```
Frontend → Django /api/run|/api/submit → CodeExecutionService
  → LocalSafeBackend (subprocess, Python) or DockerBackend (scaffold)
  → Result (Accepted / WA / RE / TLE / CE)
```

User code is **never** executed with `eval`/`exec` inside the Django process.

## Main API endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register/` | Register |
| POST | `/api/auth/login/` | JWT login |
| POST | `/api/auth/refresh/` | Refresh token |
| GET | `/api/auth/me/` | Current user |
| GET/PATCH | `/api/profile/me/` | Profile |
| GET | `/api/dashboard/` | Dashboard payload |
| GET | `/api/problems/` | List/filter/search problems |
| GET | `/api/problems/{slug}/` | Problem detail |
| POST | `/api/run/` | Run sample tests |
| POST | `/api/submit/` | Full judge + XP |
| GET | `/api/submissions/` | User submissions |
| GET | `/api/leaderboard/?period=global\|weekly\|monthly` | Leaderboard |
| GET | `/api/achievements/` | Achievements |
| GET | `/api/admin/stats/` | Admin stats |
| CRUD | `/api/admin/users/` | Admin users |
| CRUD | `/api/categories/`, `/api/problems/`, `/api/testcases/` | Admin content |

## Railway deployment

1. Create a Railway project with **PostgreSQL** + **backend** + **frontend** (or deploy frontend to Vercel).
2. Backend service root: `backend`
3. Set env vars from `.env.example` (`DATABASE_URL` from Railway Postgres plugin).
4. Start command: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
5. Release: `python manage.py migrate && python manage.py collectstatic --noinput && python manage.py seed_db`
6. Frontend: set `NEXT_PUBLIC_API_URL` to `https://<backend>.up.railway.app/api`
7. Add frontend origin to `CORS_ALLOWED_ORIGINS`

## Render deployment

**Backend (Web Service)**

- Root: `backend`
- Build: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
- Start: `gunicorn config.wsgi:application`
- Attach Render PostgreSQL → `DATABASE_URL`
- Set `DEBUG=False`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, secrets

**Frontend (Static/Web)**

- Root: `frontend`
- Build: `npm install && npm run build`
- Start: `npm start`
- Env: `NEXT_PUBLIC_API_URL`

## Pages

`/`, `/login`, `/register`, `/dashboard`, `/problems`, `/problems/[id]`, `/problems/[id]/solve`, `/submissions`, `/leaderboard`, `/profile`, `/achievements`, `/settings`, `/admin`

## XP rules

- Easy 10 · Medium 25 · Hard 50
- XP granted **once** on first Accepted solve
