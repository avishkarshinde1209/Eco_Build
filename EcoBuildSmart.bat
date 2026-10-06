@echo off
title EcoBuild Smart Desktop App
echo ========================================================
echo   Starting EcoBuild Smart Desktop Application...
echo ========================================================
cd /d "%~dp0"
start "" python launch_app.py
exit
