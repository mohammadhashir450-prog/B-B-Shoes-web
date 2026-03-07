@echo off
:: MongoDB Atlas DNS Fix - Auto Run as Administrator
echo.
echo ╔════════════════════════════════════════════╗
echo ║   MongoDB Atlas DNS Configuration Fix     ║
echo ╚════════════════════════════════════════════╝
echo.

:: Check for Administrator privileges
net session >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Running with Administrator privileges
    echo.
    goto :run_script
) else (
    echo ⚠️  Requesting Administrator privileges...
    echo.
    
    :: Request admin and run PowerShell script
    powershell -Command "Start-Process powershell -Verb RunAs -ArgumentList '-NoExit', '-ExecutionPolicy', 'Bypass', '-File', '%~dp0fix-dns.ps1'"
    
    echo.
    echo 🔄 PowerShell window should open with admin rights
    echo 📝 If not, manually run PowerShell as Administrator
    echo    and execute: .\fix-dns.ps1
    echo.
    pause
    exit
)

:run_script
powershell -ExecutionPolicy Bypass -File "%~dp0fix-dns.ps1"
echo.
pause
