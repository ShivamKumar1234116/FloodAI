@echo off
title FloodShield AI Launcher
cd /d "%~dp0"
echo ===================================================================
echo             Launching FloodShield AI Full-Stack Platform
echo ===================================================================
echo [1/2] Spawning Backend Terminal Window...
start "FloodShield Backend (Port 8000)" cmd /k "%~dp0run_backend.bat"

echo Waiting 3 seconds for backend initialization...
ping 127.0.0.1 -n 4 >nul

echo [2/2] Spawning Frontend Terminal Window...
start "FloodShield Frontend (Port 5173)" cmd /k "%~dp0run_frontend.bat"

echo.
echo ===================================================================
echo  Both terminal processes have been spawned in separate windows!
echo  - Frontend Web UI:      http://127.0.0.1:5173
echo  - Backend API Docs:     http://127.0.0.1:8000/api/docs
echo ===================================================================
echo.
