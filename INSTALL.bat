@echo off
echo ====================================
echo SmartCrop Platform - Quick Start
echo ====================================
echo.

echo [1/4] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
echo     Node.js is installed

echo.
echo [2/4] Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo [3/4] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 ( 
    echo ERROR: Python is not installed!
    echo Please install Python from https://www.python.org
    pause
    exit /b 1
)
echo     Python is installed

echo.
echo [4/4] Installing backend dependencies...
cd backend
pip install -r requirements.txt
if errorlevel 1 (
    echo WARNING: Some Python packages may have failed to install
    echo You may need to install TensorFlow separately
)
cd ..

echo.
echo ====================================
echo Installation Complete!
echo ====================================
echo.
echo To start the application:
echo.
echo 1. Start Backend (in one terminal):
echo    cd backend
echo    python app.py
echo.
echo 2. Start Frontend (in another terminal):
echo    npm run dev
echo.
echo 3. Open browser to: http://localhost:5173
echo.
pause
