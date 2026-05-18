@echo off
setlocal
cd /d "%~dp0frontend"
node node_modules\next\dist\bin\next dev
