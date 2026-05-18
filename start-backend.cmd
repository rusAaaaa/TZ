@echo off
setlocal
cd /d "%~dp0backend"
node node_modules\ts-node-dev\lib\bin.js --respawn --transpile-only src/index.ts
