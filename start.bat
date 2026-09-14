@echo off
echo ============================================
echo   CodeArena Learning - Serverlarni ishga tushirish
echo ============================================

REM --- Node.js muhitini sozlash (agar global o'rnatilmagan bo'lsa) ---
if exist "%~dp0.tools\node-v22.14.0-win-x64" (
    set "PATH=%~dp0.tools\node-v22.14.0-win-x64;%PATH%"
)

REM --- Backend (Django) alohida oynada ---
start "BACKEND - Django (8000)" cmd /k "cd /d %~dp0backend && call ..\.venv\Scripts\activate.bat && python manage.py runserver"

REM --- Frontend (Next.js) alohida oynada ---
start "FRONTEND - Next.js (3000)" cmd /k "if exist ""%~dp0.tools\node-v22.14.0-win-x64"" set ""PATH=%~dp0.tools\node-v22.14.0-win-x64;%PATH%"" && cd /d %~dp0frontend && npm run dev"

echo.
echo Ikkala server alohida oynalarda ishga tushmoqda...
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://localhost:3000
echo.
pause
