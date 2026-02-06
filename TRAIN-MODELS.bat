@echo off
echo ========================================
echo  TRAIN CUSTOM ML MODELS
echo ========================================
echo.

cd backend-python

echo Installing dependencies...
pip install -r requirements.txt

echo.
echo ========================================
echo  Starting Model Training
echo ========================================
echo.

python train_models.py

echo.
echo ========================================
echo  Training Complete!
echo ========================================
echo.
echo Next: Run START-WITH-CUSTOM-MODELS.bat
echo.
pause
