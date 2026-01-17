@echo off
echo ========================================
echo   FoodSaver AI - Starting Servers
echo ========================================
echo.

echo Starting Backend (Express.js)...
start "FoodSaver Backend" cmd /k "cd backend-express && npm start"
timeout /t 3 /nobreak > nul

echo Starting Frontend (React + Vite)...
start "FoodSaver Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Servers Starting!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5174
echo.
echo Press any key to open browser...
pause > nul

start http://localhost:5174

echo.
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
echo.
pause
