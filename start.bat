@echo off
echo Starting Pi Challenge Game...
echo.
echo Open your browser to: http://localhost:8080
echo.
echo Press Ctrl+C to stop the server
echo.
start http://localhost:8080
cd /d "%~dp0"
python -m http.server 8080



