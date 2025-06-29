#!/bin/bash

# Automated deploy script with sshpass
# Usage: ./deploy-auto.sh

set -e

SERVER="195.35.17.156"
USER="root"
PASSWORD="AmorJampa123#"
REMOTE_PATH="/var/www/inspecao-ai"
LOCAL_DIST="dist"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

export SSHPASS="$PASSWORD"

echo -e "${YELLOW}Starting deployment to $USER@$SERVER:$REMOTE_PATH${NC}"

# Check if dist folder exists
if [ ! -d "$LOCAL_DIST" ]; then
    echo -e "${RED}Error: dist folder not found. Run 'npm run build' first.${NC}"
    exit 1
fi

# Create remote directory if it doesn't exist
echo -e "${GREEN}Creating remote directory...${NC}"
sshpass -e ssh -o StrictHostKeyChecking=no $USER@$SERVER "mkdir -p $REMOTE_PATH"

# Compress dist folder
echo -e "${GREEN}Compressing files...${NC}"
tar -czf deploy.tar.gz -C $LOCAL_DIST .

# Upload compressed file
echo -e "${GREEN}Uploading files to server...${NC}"
sshpass -e scp -o StrictHostKeyChecking=no deploy.tar.gz $USER@$SERVER:$REMOTE_PATH/

# Extract and clean up on server
echo -e "${GREEN}Extracting files on server...${NC}"
sshpass -e ssh -o StrictHostKeyChecking=no $USER@$SERVER "cd $REMOTE_PATH && tar -xzf deploy.tar.gz && rm deploy.tar.gz"

# Clean up local compressed file
rm deploy.tar.gz

# Set proper permissions
echo -e "${GREEN}Setting permissions...${NC}"
sshpass -e ssh -o StrictHostKeyChecking=no $USER@$SERVER "find $REMOTE_PATH -type f -exec chmod 644 {} \; && find $REMOTE_PATH -type d -exec chmod 755 {} \;"

echo -e "${GREEN}✓ Deployment completed successfully!${NC}"
echo -e "${YELLOW}Files deployed to $SERVER:$REMOTE_PATH${NC}"