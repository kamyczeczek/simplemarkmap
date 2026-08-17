@echo off
rem ==========================================================================
rem SimpleMarkmap Windows Installer Builder
rem ICM-Harness Engineering enforced build pipeline
rem ==========================================================================

rem ---- Configuration ----
set "PROJECT_DIR=%~dp0"
set "NPM_CMD=cmd.exe /c npm"
rem Target output directory for NSIS installer
set "OUTPUT_DIR=C:\sm-build\out"
set "INSTALLER_NAME=SimpleMarkmap-Setup-1.0.0.exe"

rem ---- Always run from the project root ----
cd /d "%PROJECT_DIR%"

rem ---- Step 1: Verify Node.js is available ----
echo.
echo ==========================================================================
echo SimpleMarkmap Build Pipeline
echo ==========================================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js not found on PATH.
  echo Install from https://nodejs.org
  echo.
  pause
  exit /b 1
)

echo Node.js found: %PROGRAMFILES%\nodejs\%PATH%
echo.

rem ---- Step 2: Run constraint/hook verification (Harness Engineering) ----
echo.
echo [1/2] Running constraint enforcement check...
node "%PROJECT_DIR%\hooks\init.js"
if errorlevel 1 (
  echo.
  echo BUILD ABORTED: Constraint check failed.
  echo Run "npm run verify" to see details of constraint violations.
  echo.
  pause
  exit /b 1
)
echo.
echo [OK] Constraint check passed. Harness Engineering laws enforced.
echo.

rem ---- Step 3: Run the build ----
echo.
echo [2/2] Building Windows NSIS installer...
echo Output will be written to: %OUTPUT_DIR%
echo.

npm run build:safe

if errorlevel 1 (
  echo.
  echo ERROR: Build failed. See output above for details.
  echo.
  pause
  exit /b 1
)

echo.
echo ==========================================================================
echo BUILD SUCCESSFUL
echo ==========================================================================
echo.
echo Installer: %OUTPUT_DIR%\%INSTALLER_NAME%
echo.
rem Verify installer exists
if exist "%OUTPUT_DIR%\%INSTALLER_NAME%" (
  echo File size: %~zf OUTPUT_DIR%\%INSTALLER_NAME% bytes
) else (
  echo WARNING: Installer path not found despite build success
)
echo.
echo ==========================================================================
echo Remember:
echo - Do not edit dist/ (build artifact per Safety Constraints)
echo - Do not delete MONITORING/ (per Constraint laws)
echo - Do not hardcode user paths
echo.
pause