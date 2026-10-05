@echo off
title FloodShield AI - FastAPI Backend (Port 8000)
cd /d "%~dp0BACKEND"
echo ===================================================================
echo       FloodShield AI - FastAPI Backend Service (Port 8000)
echo ===================================================================
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
pause
