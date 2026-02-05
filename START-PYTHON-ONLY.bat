@echo off
echo ========================================
echo FoodSaver AI - Python Backend Only
echo ========================================
echo.

echo Starting Python Backend on port 8000...
cd backend-python
start cmd /k "python main-complete.py"
cd ..

timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend on port 5173...
cd frontend
start cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo All Services Started!
echo ========================================
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo ========================================
echo.
pause
