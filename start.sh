#!/bin/bash

echo "Starting Pi Challenge Game..."
echo ""
cd "$(dirname "$0")"

# Try to find an available port
PORT=8080
while lsof -ti:$PORT > /dev/null 2>&1; do
    echo "Port $PORT is in use, trying next port..."
    PORT=$((PORT + 1))
    if [ $PORT -gt 8100 ]; then
        echo "Error: Could not find an available port (tried 8080-8100)"
        exit 1
    fi
done

echo "Starting server on http://localhost:$PORT"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
sleep 1
open http://localhost:$PORT
python3 -m http.server $PORT
