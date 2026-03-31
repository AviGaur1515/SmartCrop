@echo off
echo ===========================================
echo 🌱 Starting SmartCrop Platform...
echo ===========================================

echo.
echo [1/2] Launching Backend Server...
if exist backend\venv (
    start "SmartCrop Backend" cmd /k "cd backend && venv\Scripts\python.exe app.py"
) else (
    echo ❌ Virtual environment not found in backend/venv!
    echo Please run VERIFY_AND_RUN.bat first to set up the project.
    pause
    exit
)

echo [2/2] Launching Frontend Server...
start "SmartCrop Frontend" cmd /k "npm run dev"

echo.
echo ✅ Servers launched! 
echo Please wait a moment for them to initialize.
echo The app will be available at: http://localhost:5173
echo.
pause
