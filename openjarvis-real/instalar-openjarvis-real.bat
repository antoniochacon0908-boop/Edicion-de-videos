@echo off
chcp 65001 >nul
setlocal EnableExtensions EnableDelayedExpansion

echo ============================================
echo   INSTALADOR DE OPENJARVIS
echo   (el proyecto real de investigacion de
echo   Stanford - NO es el Jarvis que ya tienes)
echo ============================================
echo.
echo Esto es un programa DISTINTO y bastante mas pesado que tu Jarvis actual.
echo Necesita Python y git ya instalados en tu PC, se descarga sus propios
echo modelos de IA para correr en local (varios cientos de MB o mas), y se
echo usa principalmente desde la terminal escribiendo "jarvis", no desde una
echo pagina web con boton de palmas.
echo.
echo Este script solo lanza el instalador OFICIAL que publica el propio
echo proyecto OpenJarvis. Yo no soy responsable de ese codigo, solo de que
echo este lanzador apunte bien a el.
echo.
set /p CONTINUAR=Quieres continuar? (s/n):
if /i not "!CONTINUAR!"=="s" goto :fin

where python >nul 2>&1
if errorlevel 1 goto :faltaPython

where git >nul 2>&1
if errorlevel 1 goto :faltaGit

for /f "tokens=*" %%v in ('python --version') do set "PYVER=%%v"
echo.
echo Python detectado: !PYVER!
echo git detectado.
echo.
echo Vamos a ejecutar el instalador oficial. Va a tardar varios minutos:
echo instala "uv" (gestor de paquetes de Python), clona el repositorio de
echo OpenJarvis, y descarga un modelo de IA para correr en local con Ollama.
echo.
pause

powershell -NoProfile -ExecutionPolicy Bypass -Command "irm https://open-jarvis.github.io/OpenJarvis/install.ps1 | iex"
if errorlevel 1 goto :falloInstalador

echo.
echo ============================================
echo   HECHO
echo ============================================
echo Para usarlo, abre una terminal NUEVA (para que coja el PATH actualizado)
echo y escribe:
echo   jarvis
echo.
echo Para instalar skills de verdad dentro de OpenJarvis, por ejemplo:
echo   jarvis skill install hermes:arxiv
echo   jarvis skill sync hermes --category research
echo   jarvis skill list
echo.
echo Mas detalle en LEEME.md, en esta misma carpeta.
echo.
goto :fin

:falloInstalador
echo.
echo ============================================
echo   EL INSTALADOR OFICIAL HA FALLADO
echo ============================================
echo Desplazate hacia arriba en esta misma ventana (rueda del raton o barra de
echo scroll) y busca la linea en rojo que empieza por [fail]: ese texto dice
echo el motivo exacto. Copialo tal cual y compartelo para poder ayudarte -
echo "ha fallado" o "ponia algo" no basta, hay varios motivos posibles.
echo.
echo IMPORTANTE: en cuanto pulses una tecla aqui abajo, esta ventana se
echo cierra. Copia primero el mensaje de [fail], y pulsa una tecla despues.
echo.
goto :fin

:faltaPython
echo No encuentro Python instalado (hace falta una version 3.10 a 3.13;
echo la 3.14 todavia no tiene ruedas de numpy para Windows).
echo Instalalo desde https://www.python.org/downloads/ y marca la casilla
echo "Add python.exe to PATH" durante la instalacion. Reinicia el PC y
echo vuelve a ejecutar este instalador.
echo.
pause
exit /b 1

:faltaGit
echo No encuentro git instalado.
echo Instalalo desde https://git-scm.com/download/win, reinicia el PC y
echo vuelve a ejecutar este instalador.
echo.
pause
exit /b 1

:fin
pause
