@echo off
title BP-Server
cd /d "%~dp0"

echo.
echo Iniciando servidor em http://127.0.0.1:4173
echo.

py -3 -m http.server 4173 || python -m http.server 4173 || python3 -m http.server 4173 || npx --yes http-server -p 4173 -c-1

echo.
echo Servidor parou. Pressione qualquer tecla para fechar.
pause >nul
