#!/bin/bash

echo "Starting Pi Challenge Game..."
echo ""
cd "$(dirname "$0")"
echo "Starting server on http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
open http://localhost:8080
python3 -m http.server 8080
