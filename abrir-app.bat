@echo off
rem abrir-app.bat: abre Frase Exacta como aplicacion a pantalla completa (sin barras del navegador),
rem directamente desde la carpeta descargada, sin instalar nada. Para Windows: haz doble clic en este archivo.
rem Usa Microsoft Edge (viene con Windows) o Google Chrome. Si no hay ninguno, abre el juego en el navegador normal.

rem Direccion del juego: la carpeta de este archivo mas index.html, con barras normales.
set "PAGINA=%~dp0index.html"
set "PAGINA=file:///%PAGINA:\=/%"

rem Buscamos Edge en sus carpetas habituales.
set "NAVEGADOR=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not exist "%NAVEGADOR%" set "NAVEGADOR=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
rem Si no esta Edge, buscamos Chrome.
if not exist "%NAVEGADOR%" set "NAVEGADOR=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not exist "%NAVEGADOR%" set "NAVEGADOR=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not exist "%NAVEGADOR%" set "NAVEGADOR=%LocalAppData%\Google\Chrome\Application\chrome.exe"

rem Si encontramos uno, abrimos el juego como aplicacion a pantalla completa.
if exist "%NAVEGADOR%" (
  start "" "%NAVEGADOR%" --app="%PAGINA%" --start-fullscreen
  exit /b
)

rem Si no, lo abrimos con el navegador por defecto (pulsa F11 para pantalla completa).
start "" "%~dp0index.html"
