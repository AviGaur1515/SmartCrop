@echo off
echo ================================================
echo 🔍 SmartCrop Prediction Debugging Script
echo ================================================
echo.

echo [1/4] Checking if backend is running...
curl -s http://localhost:5000/health >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Backend is NOT running on port 5000
    echo.
    echo Please start the backend first:
    echo   cd backend
    echo   venv\Scripts\python app.py
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Backend is running
)

echo.
echo [2/4] Testing health endpoint...
curl -s http://localhost:5000/health
echo.

echo.
echo [3/4] Checking if frontend is running...
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Frontend is NOT running on port 5173
    echo.
    echo Please start the frontend:
    echo   npm run dev
    echo.
) else (
    echo ✅ Frontend is running
)

echo.
echo [4/4] Common Issues & Solutions:
echo ================================================
echo.
echo Issue: "No file provided" error
echo Solution: Make sure you're selecting an image file
echo.
echo Issue: "Invalid token" or 401 error  
echo Solution: 
echo   1. Log out and log back in
echo   2. Check browser console (F12) for token errors
echo   3. Clear browser localStorage and re-login
echo.
echo Issue: "Model not loaded" error
echo Solution: Check backend terminal for model loading messages
echo.
echo Issue: Network error / Failed to fetch
echo Solution: 
echo   1. Ensure backend is running (check above)
echo   2. Check if CORS is enabled in backend
echo   3. Try http://localhost:5173 (not 127.0.0.1)
echo.
echo ================================================
echo.
echo 📋 Next Steps:
echo 1. Open browser to http://localhost:5173
echo 2. Open DevTools (F12) and go to "Console" tab
echo 3. Try to upload an image and analyze
echo 4. Look for RED error messages in console
echo 5. Send me the exact error message you see
echo.
pause
