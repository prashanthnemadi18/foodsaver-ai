@echo off
echo ========================================
echo FoodSaver AI - Complete Startup
echo With ML Service (Transformers + spaCy)
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed!
    echo Please install Python 3.9+ from https://www.python.org/
    pause
    exit /b 1
)

echo [1/4] Starting Python ML Service...
cd backend-python
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)

call venv\Scripts\activate
echo Installing Python dependencies...
pip install -q -r requirements.txt

echo Downloading spaCy model...
python -m spacy download en_core_web_sm

start "Python ML Service" cmd /k "venv\Scripts\activate && python main.py"
cd ..

timeout /t 5 /nobreak >nul

echo.
echo [2/4] Starting Express Backend...
cd backend-express
start "Express Backend" cmd /k "npm start"
cd ..

timeout /t 3 /nobreak >nul

echo.
echo [3/4] Starting React Frontend...
cd frontend
start "React Frontend" cmd /k "npm run dev"
cd ..

echo.
echo [4/4] All services started!
echo.
echo ========================================
echo Services Running:
echo ========================================
echo Python ML:  http://localhost:8001
echo Backend:    http://localhost:8000
echo Frontend:   http://localhost:5173
echo ========================================
echo.
echo Press any key to open the application...
pause >nul

start http://localhost:5173

echo.
echo Application opened in browser!
echo Keep this window open to keep services running.
echo Press Ctrl+C to stop all services.
pause
