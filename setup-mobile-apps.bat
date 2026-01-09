@echo off
echo ========================================
echo Pi Challenge - Mobile App Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Download the LTS version and install it.
    echo.
    echo After installing Node.js:
    echo 1. Close and reopen this terminal
    echo 2. Run this script again
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
npm --version
echo.

echo ========================================
echo Step 1: Installing dependencies...
echo ========================================
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [OK] Dependencies installed
echo.

echo ========================================
echo Step 2: Building web app...
echo ========================================
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to build web app
    pause
    exit /b 1
)
echo [OK] Web app built
echo.

echo ========================================
echo Step 3: Adding Android platform...
echo ========================================
call npm run cap:add:android
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Failed to add Android platform
    echo This might be normal if Android platform already exists
)
echo.

echo ========================================
echo Step 4: Syncing to native projects...
echo ========================================
call npm run cap:sync
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to sync
    pause
    exit /b 1
)
echo [OK] Synced to native projects
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo.
echo For Android:
echo   1. Install Android Studio from: https://developer.android.com/studio
echo   2. Open Android Studio
echo   3. Run: npm run cap:open:android
echo   4. Wait for Gradle sync
echo   5. Build -^> Build APK(s) or Generate Signed Bundle
echo.
echo For iOS (Mac only):
echo   1. Install Xcode from Mac App Store
echo   2. Run: npm run cap:open:ios
echo   3. Select your team in Signing ^& Capabilities
echo   4. Product -^> Archive -^> Distribute App
echo.
echo To make changes to your web app:
echo   1. Edit your files (index.html, app.js, styles.css, etc.)
echo   2. Run: npm run build
echo   3. Run: npm run cap:sync
echo   4. Rebuild in Android Studio or Xcode
echo.
pause
