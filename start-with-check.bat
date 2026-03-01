@echo off
echo ====================================
echo B&B Shoes - Setup Checker
echo ====================================
echo.
node scripts/check-setup.js
echo.
echo ====================================
echo.
if %ERRORLEVEL% EQU 0 (
    echo Setup is complete! Starting server...
    echo.
    npm run dev
) else (
    echo.
    echo Please complete setup first:
    echo 1. Read QUICKSTART.md or COMPLETE_SETUP_GUIDE.md
    echo 2. Get Google OAuth credentials
    echo 3. Get Gmail App Password
    echo 4. Update .env.local file
    echo 5. Run this script again
    echo.
    pause
)
