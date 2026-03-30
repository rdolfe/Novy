@echo off
title Novy — Dev Environment
color 0A
echo.
echo  ███╗   ██╗ ██████╗ ██╗   ██╗██╗   ██╗
echo  ████╗  ██║██╔═══██╗██║   ██║╚██╗ ██╔╝
echo  ██╔██╗ ██║██║   ██║██║   ██║ ╚████╔╝
echo  ██║╚██╗██║██║   ██║╚██╗ ██╔╝  ╚██╔╝
echo  ██║ ╚████║╚██████╔╝ ╚████╔╝    ██║
echo  ╚═╝  ╚═══╝ ╚═════╝   ╚═══╝     ╚═╝
echo.
echo  Campus Social Network — Challenge 48H
echo  ========================================
echo.

:: Start MySQL Service (adjust service name if needed)
echo [1/3] Starting MySQL service...
net start MySQL80 2>nul || net start MySQL 2>nul || echo  MySQL already running or not installed.

:: Start Backend
echo.
echo [2/3] Starting Novy API on http://localhost:3001 ...
start "Novy — Backend API" cmd /k "cd /d %~dp0 && node backend/server.js"

:: Wait for backend to be ready
timeout /t 2 /nobreak >nul

:: Start Frontend (Vite)
echo.
echo [3/3] Starting Novy Frontend on http://localhost:5174 ...
start "Novy — Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo  ✓ All services started!
echo  ✓ Frontend: http://localhost:5174
echo  ✓ Backend:  http://localhost:3001
echo  ✓ Health:   http://localhost:3001/health
echo.
echo  Press any key to close this window...
pause >nul
