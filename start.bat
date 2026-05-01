@echo off
echo ==========================================
echo   CertAuth - Starting Full Stack App
echo   SIH 2025 - PS #SIH25029
echo ==========================================
echo.

echo [1/2] Starting Backend Server...
start cmd /k "cd backend && npm install && npm run dev"

timeout /t 3

echo [2/2] Starting Frontend...
start cmd /k "cd frontend && npm install && npm start"

echo.
echo ==========================================
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:3000
echo ==========================================
echo.
echo Make sure MongoDB is running!
echo Edit backend\.env with your credentials.
pause
