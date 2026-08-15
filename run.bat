@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js not found on PATH. Install from https://nodejs.org
  pause
  exit /b 1
)

set FILE_ARG=
set DIR_ARG=

:: Windows "Open with" passes a naked file path, not --file "...".
:: Treat the first non-option argument as the file to open.
if not "%~1"=="" if /i not "%~1:~0,2%"=="--" (
  set "FILE_ARG=%~1"
)

:parse_args
if "%~1"=="" goto :done_args
if /i "%~1"=="--file" (
  set FILE_ARG=%~2
  shift & shift
  goto :parse_args
)
if /i "%~1"=="--dir" (
  set DIR_ARG=%~2
  shift & shift
  goto :parse_args
)
shift
goto :parse_args

:done_args
echo simplemarkmap server starting...
echo   URL: http://localhost:8765

set "TARGET_URL=http://localhost:8765/"
if defined FILE_ARG (
  for %%F in ("%FILE_ARG%") do (
    set "FILE_DIR=%%~dpF"
    set "FILE_NAME=%%~nxF"
  )
  set "TARGET_URL=http://localhost:8765/?file=!FILE_NAME!"
  set "SERVER_DIR=!FILE_DIR!"
) else if defined DIR_ARG (
  set "SERVER_DIR=%DIR_ARG%"
) else (
  rem Use the drive root so the picker can browse all the way to C:\.
  rem Open initially in this project folder.
  set SERVER_DIR=C:\
  set "START_DIR=%~dp0"
  set "START_DIR=!START_DIR:~3!"
  set "START_DIR=!START_DIR:\=/!"
  if "!START_DIR:~-1!"=="/" set "START_DIR=!START_DIR:~0,-1!"
  set "TARGET_URL=http://localhost:8765/?dir=!START_DIR!"
)

echo simplemarkmap server starting...
echo   ROOT: %SERVER_DIR%
echo   URL:  %TARGET_URL%

:: Kill any process already listening on port 8765 (leftover from a previous run)
for /f "tokens=5" %%P in ('netstat -ano ^| findstr :8765 ^| findstr LISTENING') do (
  taskkill /f /pid %%P >nul 2>&1
)

set "BROWSER_EXE="

if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
  set "BROWSER_EXE=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
) else if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
  set "BROWSER_EXE=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
) else if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" (
  set "BROWSER_EXE=%LocalAppData%\Google\Chrome\Application\chrome.exe"
) else if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
  set "BROWSER_EXE=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
) else if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
  set "BROWSER_EXE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
)

if defined BROWSER_EXE (
  start "" "%BROWSER_EXE%" --app="%TARGET_URL%"
) else (
  start "" "%TARGET_URL%"
)

node server.js "%SERVER_DIR%"
pause