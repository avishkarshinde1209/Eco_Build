@echo off
title Install EcoBuild Smart Application
echo ========================================================
echo   Installing EcoBuild Smart on your Windows PC...
echo ========================================================
cd /d "%~dp0"
python install_app.py
echo.
pause
