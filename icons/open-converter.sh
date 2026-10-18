#!/bin/bash
# Open the PNG icon converter in your default browser

cd "$(dirname "$0")"
HTML_FILE="create-png-icon.html"
ABS_PATH="$(pwd)/$HTML_FILE"

echo "Opening icon converter in browser..."
echo "File: $ABS_PATH"

# Try different methods to open the HTML file
if command -v open >/dev/null 2>&1; then
    # macOS
    open "$ABS_PATH" 2>/dev/null || open -a "Google Chrome" "$ABS_PATH" 2>/dev/null || open -a "Safari" "$ABS_PATH"
elif command -v xdg-open >/dev/null 2>&1; then
    # Linux
    xdg-open "$ABS_PATH"
elif command -v start >/dev/null 2>&1; then
    # Windows
    start "$ABS_PATH"
else
    echo "Please manually open: $ABS_PATH"
    echo "In your browser, then click 'Download PNG Icon'"
fi

echo ""
echo "Once the page opens:"
echo "1. Click 'Download PNG Icon' button"
echo "2. Save the file as 'app-icon-1024.png' in this folder"
echo ""
