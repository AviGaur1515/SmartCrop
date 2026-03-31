@echo off
echo ==========================================
echo 🌱 SmartCrop Platform Verification Script
echo ==========================================

echo.
echo [1/3] Installing Frontend Dependencies...
call npm install

echo.
echo [2/3] Setting up Backend Environment...
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
echo Installing Python packages...
call venv\Scripts\pip install -r requirements.txt

echo.
echo [3/3] Initializing Database...
call venv\Scripts\python database.py

echo.
echo ==========================================
echo ✅ Setup Complete!
echo ==========================================
echo To start the platform:
echo 1. In this terminal, run: venv\Scripts\python.exe app.py
echo 2. Open a NEW terminal in the root folder and run: npm run dev
echo.
pause
