@echo off
chcp 65001 >nul
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

echo ============================================
echo   INSTALADOR DE JARVIS
echo ============================================
echo.

where node >nul 2>&1
if errorlevel 1 goto :noNode

for /f "tokens=*" %%v in ('node -v') do set "NODEVER=%%v"
echo Node detectado: !NODEVER!
echo.

if not exist "server.js" goto :faltanArchivos

set "SOBRESCRIBIR=s"
if exist ".env" set /p SOBRESCRIBIR=Ya existe un archivo .env con claves guardadas. Quieres reemplazarlo? (s/n):
if /i not "!SOBRESCRIBIR!"=="s" goto :saltarClaves

echo.
echo Vamos a pedirte tus tres claves. Se guardan SOLO en el archivo .env de esta carpeta,
echo en este ordenador. Nunca las compartas por chat, email ni captura de pantalla.
echo.

:pedirAnthropic
set "ANTKEY="
set /p ANTKEY=Pega tu clave de Anthropic (empieza por sk-ant-):
if not defined ANTKEY goto :pedirAnthropic

:pedirEleven
set "ELKEY="
set /p ELKEY=Pega tu clave de ElevenLabs (empieza por sk_):
if not defined ELKEY goto :pedirEleven

:pedirVoz
set "VOICEID="
set /p VOICEID=Pega el Voice ID de ElevenLabs:
if not defined VOICEID goto :pedirVoz

> ".env" echo ANTHROPIC_API_KEY=!ANTKEY!
>> ".env" echo ELEVENLABS_API_KEY=!ELKEY!
>> ".env" echo ELEVENLABS_VOICE_ID=!VOICEID!

echo.
echo Guardado en .env
echo.

:saltarClaves

set "PROYECTO=%~dp0"
set "STARTUPDIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "LAUNCHER=%PROYECTO%iniciar-jarvis.vbs"

> "%LAUNCHER%" echo Set WshShell = CreateObject^("WScript.Shell"^)
>> "%LAUNCHER%" echo WshShell.CurrentDirectory = "%PROYECTO%"
>> "%LAUNCHER%" echo WshShell.Run "node server.js", 0, False
>> "%LAUNCHER%" echo WScript.Sleep 2000
>> "%LAUNCHER%" echo WshShell.Run "http://localhost:3000", 1, False

copy /y "%LAUNCHER%" "%STARTUPDIR%\iniciar-jarvis.vbs" >nul

echo ============================================
echo   LISTO
echo ============================================
echo Jarvis arrancara solo la proxima vez que enciendas o inicies sesion en este PC,
echo y te abrira automaticamente http://localhost:3000 en el navegador.
echo.
echo Para probarlo AHORA MISMO sin reiniciar, haz doble clic en:
echo   iniciar-jarvis.vbs   (esta en esta misma carpeta)
echo.
echo Si algo falla y quieres ver el mensaje de error, usa en su lugar:
echo   iniciar-jarvis-visible.bat
echo.
echo Para desactivar el arranque automatico mas adelante: pulsa Win+R, escribe
echo shell:startup, dale a Enter, y borra ahi el archivo iniciar-jarvis.vbs.
echo.
goto :fin

:noNode
echo No encuentro Node.js instalado.
echo Instalalo desde https://nodejs.org (version LTS), reinicia el PC y vuelve
echo a hacer doble clic en este instalador.
echo.
pause
exit /b 1

:faltanArchivos
echo No encuentro server.js en esta carpeta.
echo Asegurate de que TODOS los archivos de Jarvis (server.js, index.html, prompt.md...)
echo estan juntos en esta misma carpeta antes de ejecutar el instalador.
pause
exit /b 1

:fin
pause
