#!/bin/bash

# Firebase Deployment Script for Google Cloud
# This script can be run from GCP Cloud Shell or any VM

set -e  # Exit on error

echo "========================================"
echo "Firebase Deployment Script"
echo "Project: Prashil Bulbule Portfolio"
echo "========================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running in GCP Cloud Shell
if [ -n "$DEVSHELL_PROJECT_ID" ]; then
    echo -e "${GREEN}✓ Running in GCP Cloud Shell${NC}"
    GCP_PROJECT=$DEVSHELL_PROJECT_ID
else
    echo -e "${BLUE}ℹ Running outside Cloud Shell${NC}"
    GCP_PROJECT=${GCP_PROJECT_ID:-"prashil-portfolio"}
fi

echo ""
echo -e "${BLUE}Step 1: Installing Firebase CLI...${NC}"
if ! command -v firebase &> /dev/null; then
    npm install -g firebase-tools
    echo -e "${GREEN}✓ Firebase CLI installed${NC}"
else
    echo -e "${GREEN}✓ Firebase CLI already installed${NC}"
fi

echo ""
echo -e "${BLUE}Step 2: Installing project dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

echo ""
echo -e "${BLUE}Step 3: Building production bundle...${NC}"
npm run build
echo -e "${GREEN}✓ Build completed${NC}"

echo ""
echo -e "${BLUE}Step 4: Firebase authentication...${NC}"
echo "Please authenticate with Firebase if prompted"
firebase login --no-localhost || firebase login:ci

echo ""
echo -e "${BLUE}Step 5: Setting Firebase project...${NC}"
firebase use prashil-portfolio || firebase use --add

echo ""
echo -e "${BLUE}Step 6: Deploying to Firebase Hosting...${NC}"
firebase deploy --only hosting

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Deployment successful!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Your app is now live!"
echo "Visit your Firebase console to see the URL:"
echo "https://console.firebase.google.com/project/prashil-portfolio/hosting"
echo ""
