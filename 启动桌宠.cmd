@echo off
cd /d "%~dp0"
if not exist "node_modules\electron\dist\electron.exe" (
  echo Electron is not installed. Please run: pnpm install
  pause
  exit /b 1
)
start "" "node_modules\electron\dist\electron.exe" .
