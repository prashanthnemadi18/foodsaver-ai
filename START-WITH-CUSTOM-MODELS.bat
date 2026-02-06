@echo off
echo ========================================
echo  FOODSAVER AI - CUSTOM TRAINED MODELS
echo ========================================
echo.
echo Starting backend with YOUR custom models...
echo.

cd backend-python
start cmd /k "uvicorn main-trained:app --reload --host 127.0.0.1 --port 8000"

timeout /t 3 /nobreak > nul

echo.
echo Starting frontend...
echo.

cd ../frontend
start cmd /k "npm run dev"

echo.
echo ========================================
echo  SERVERS STARTED!
echo ========================================
echo.
echo Backend (Custom Models): http://127.0.0.1:8000
echo Frontend: http://localhost:5173
echo API Docs: http://127.0.0.1:8000/docs
echo Model Status: http://127.0.0.1:8000/model-status
echo.
echo Press any key to exit...
pause > nul
