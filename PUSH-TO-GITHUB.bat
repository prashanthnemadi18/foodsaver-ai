@echo off
echo ========================================
echo Push FoodSaver AI to GitHub
echo ========================================
echo.

echo Step 1: Initializing Git...
git init

echo.
echo Step 2: Adding all files...
git add .

echo.
echo Step 3: Creating commit...
git commit -m "Initial commit: FoodSaver AI - Complete Agriculture Platform with AI/ML"

echo.
echo Step 4: Adding remote repository...
echo Please enter your repository name (e.g., foodsaver-ai):
set /p REPO_NAME=

git remote add origin https://github.com/prashanthnemadi18/%REPO_NAME%.git

echo.
echo Step 5: Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ========================================
echo Done! Check your repository at:
echo https://github.com/prashanthnemadi18/%REPO_NAME%
echo ========================================
pause
