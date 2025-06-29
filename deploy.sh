#!/bin/bash

# Deploy script for Projeto Inspeção AI
# Usage: ./deploy.sh [user@server] [remote_path]

# Exit on error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check arguments
if [ "$#" -ne 2 ]; then
    echo -e "${RED}Usage: $0 user@server /path/to/remote/directory${NC}"
    echo "Example: $0 user@example.com /var/www/inspecao-ai"
    exit 1
fi

SERVER=$1
REMOTE_PATH=$2
LOCAL_DIST="dist"

echo -e "${YELLOW}Starting deployment to $SERVER:$REMOTE_PATH${NC}"

# Check if dist folder exists
if [ ! -d "$LOCAL_DIST" ]; then
    echo -e "${RED}Error: dist folder not found. Run 'npm run build' first.${NC}"
    exit 1
fi

# Create remote directory if it doesn't exist
echo -e "${GREEN}Creating remote directory...${NC}"
ssh $SERVER "mkdir -p $REMOTE_PATH"

# Compress dist folder
echo -e "${GREEN}Compressing files...${NC}"
tar -czf deploy.tar.gz -C $LOCAL_DIST .

# Upload compressed file
echo -e "${GREEN}Uploading files to server...${NC}"
scp deploy.tar.gz $SERVER:$REMOTE_PATH/

# Extract and clean up on server
echo -e "${GREEN}Extracting files on server...${NC}"
ssh $SERVER "cd $REMOTE_PATH && tar -xzf deploy.tar.gz && rm deploy.tar.gz"

# Clean up local compressed file
rm deploy.tar.gz

# Set proper permissions
echo -e "${GREEN}Setting permissions...${NC}"
ssh $SERVER "find $REMOTE_PATH -type f -exec chmod 644 {} \; && find $REMOTE_PATH -type d -exec chmod 755 {} \;"

echo -e "${GREEN}✓ Deployment completed successfully!${NC}"
echo -e "${YELLOW}Don't forget to:${NC}"
echo "1. Configure your web server (nginx/apache) to serve from $REMOTE_PATH"
echo "2. Set up SSL certificate (Let's Encrypt recommended)"
echo "3. Configure environment variables on the server"
echo "4. Set up proper security headers"