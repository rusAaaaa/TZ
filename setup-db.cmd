@echo off
setlocal
cd /d "%~dp0backend"
node node_modules\prisma\build\index.js generate
if errorlevel 1 exit /b 1
node node_modules\ts-node\dist\bin.js prisma\setup.ts
if errorlevel 1 exit /b 1
node node_modules\ts-node\dist\bin.js prisma\seed.ts
if errorlevel 1 exit /b 1
