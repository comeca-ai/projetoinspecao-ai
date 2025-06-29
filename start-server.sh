#!/bin/bash

# Script to start the web server on port 8080

echo "Starting server on port 8080..."
sshpass -p 'AmorJampa123#' ssh root@195.35.17.156 << 'EOF'
# Kill any existing process on port 8080
lsof -ti:8080 | xargs -r kill -9 2>/dev/null || true

# Start Python HTTP server in background
cd /var/www/inspecao-ai
nohup python3 -m http.server 8080 > /var/log/inspecao-server.log 2>&1 &
echo $! > /var/run/inspecao-server.pid

echo "Server started with PID: $(cat /var/run/inspecao-server.pid)"
echo "Access the application at: http://195.35.17.156:8080"
EOF