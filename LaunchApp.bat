@echo off
title EcoBuild Smart - App Launcher
color 0A
echo.
echo  ============================================================
echo    EcoBuild Smart - Environmental Assessment App
echo  ============================================================
echo.
echo  [1/2] Starting backend server...
start /B pythonw -m http.server 8000 2>nul
timeout /t 1 /nobreak >nul

:: Kill any existing server on 8000 and start fresh
for /f "tokens=5" %%a in ('netstat -aon ^| find "8000" ^| find "LISTENING"') do (
    taskkill /f /pid %%a >nul 2>&1
)
timeout /t 1 /nobreak >nul

start /B python "%~dp0server.py"
timeout /t 2 /nobreak >nul

echo  [2/2] Opening app in browser...
start http://localhost:8000

echo.
echo  App is running at http://localhost:8000
echo  Close this window to stop the server.
echo.
pause
