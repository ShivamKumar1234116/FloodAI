@echo off
title FloodShield AI - React Frontend (Port 5173)
cd /d "%~dp0FRONTEND"
echo ===================================================================
echo     FloodShield AI - React + Vite + Tailwind Frontend (Port 5173)
echo ===================================================================
npm run dev -- --host 127.0.0.1
pause
