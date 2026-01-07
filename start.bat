@echo off
echo Starting Pi Challenge Game...
echo.
cd /d "%~dp0"
echo Starting server on http://localhost:8080
echo.
echo Press Ctrl+C to stop the server
echo.
start "" http://localhost:8080
python -m http.server 8080



