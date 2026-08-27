@echo off
setlocal EnableExtensions
cd /d "%~dp0"

set "MUSEUM_URL=http://localhost:5173/China-Space-Museum/"
set "VITE_PORT=5173"

echo [China Space Museum] Checking local project...
if not exist "node_modules\." goto no_deps
where npm.cmd >nul 2>&1
if errorlevel 1 goto no_npm

echo [China Space Museum] Starting Vite on port %VITE_PORT%...
start "China Space Museum - Vite" /D "%~dp0" cmd.exe /D /K "call npm.cmd run dev -- --host 127.0.0.1 --port %VITE_PORT% --strictPort"

echo [China Space Museum] Waiting for the local server...
timeout /t 5 /nobreak >nul

set "EDGE_EXE="
where msedge.exe >nul 2>&1
if not errorlevel 1 set "EDGE_EXE=msedge.exe"
if not defined EDGE_EXE if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" set "EDGE_EXE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not defined EDGE_EXE if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" set "EDGE_EXE=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"

if not defined EDGE_EXE goto no_edge

echo [China Space Museum] Opening Microsoft Edge...
start "" "%EDGE_EXE%" "%MUSEUM_URL%"
echo [China Space Museum] URL: %MUSEUM_URL%
endlocal
exit /b 0

:no_deps
echo [China Space Museum] node_modules was not found. No installation was attempted.
pause
exit /b 1

:no_npm
echo [China Space Museum] npm.cmd was not found. Please install Node.js first.
pause
exit /b 1

:no_edge
echo [China Space Museum] Microsoft Edge was not found. The server window remains open at %MUSEUM_URL%.
pause
exit /b 1
