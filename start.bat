@echo off
REM RunThru Application Startup Script for Windows
REM This script starts both the frontend and backend servers

echo 🚀 Starting RunThru Application...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo 📥 Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found

REM Check for environment files
if not exist ".env" (
    echo ⚠️  No .env file found in root directory
    echo 📝 Please create .env file with required variables
    echo 📖 See CONFIGURATION_GUIDE.md for setup instructions
    echo.
    echo 🔧 Starting with default configuration (may cause errors)
)

REM Start backend server
echo 🔧 Starting backend server...
cd server
if not exist "node_modules" (
    echo 📦 Installing backend dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install backend dependencies
        pause
        exit /b 1
    )
)
start "RunThru Backend" cmd /k "npm start"
cd ..

REM Wait a moment for backend to start
echo ⏳ Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

REM Start frontend server
echo 🎨 Starting frontend server...
cd Runthru
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install frontend dependencies
        pause
        exit /b 1
    )
)
start "RunThru Frontend" cmd /k "npm run dev"
cd ..

echo.
echo 🎉 RunThru Application is starting up!
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:5000
echo.
echo Both servers are running in separate windows.
echo Close the windows to stop the servers.
echo.
echo 📖 If you encounter errors, check CONFIGURATION_GUIDE.md
pause