@echo off
cd /d "%~dp0"
echo Arrancando Jarvis... deja esta ventana abierta mientras lo uses.
echo Cierra esta ventana (o pulsa Ctrl+C) para apagarlo.
echo.
node server.js
echo.
echo Jarvis se ha detenido o ha fallado. Revisa los mensajes de arriba.
pause
