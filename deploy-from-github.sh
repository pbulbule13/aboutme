#!/bin/bash

# Deploy ANY GitHub Repository to Google Cloud
# This script clones from GitHub and deploys to Firebase or Cloud Run
# Perfect for running in GCP Cloud Shell!

set -e  # Exit on error

echo "========================================"
echo "GitHub to Google Cloud Deployment"
echo "========================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Get GitHub repository URL
if [ -z "$1" ]; then
    echo -e "${YELLOW}Please provide GitHub repository URL:${NC}"
    echo "Example: https://github.com/pbulbule13/aboutme"
    read REPO_URL
else
    REPO_URL=$1
fi

# Get deployment type
if [ -z "$2" ]; then
    echo ""
    echo -e "${YELLOW}Select deployment type:${NC}"
    echo "1) Firebase Hosting (for static sites/SPAs)"
    echo "2) Cloud Run (for containerized apps)"
    read -p "Enter choice (1 or 2): " DEPLOY_TYPE
else
    DEPLOY_TYPE=$2
fi

# Extract repo name
REPO_NAME=$(basename $REPO_URL .git)

echo ""
echo -e "${BLUE}Configuration:${NC}"
echo "  Repository: $REPO_URL"
echo "  Repo Name: $REPO_NAME"
echo "  Deployment: $([ "$DEPLOY_TYPE" == "1" ] && echo "Firebase" || echo "Cloud Run")"
echo ""

# Clone repository
echo -e "${BLUE}Step 1: Cloning repository...${NC}"
if [ -d "$REPO_NAME" ]; then
    echo -e "${YELLOW}Directory exists. Removing...${NC}"
    rm -rf $REPO_NAME
fi

git clone $REPO_URL
cd $REPO_NAME

echo -e "${GREEN}✓ Repository cloned${NC}"

# Check if deployment script exists
if [ "$DEPLOY_TYPE" == "1" ]; then
    if [ -f "deploy-firebase.sh" ]; then
        echo ""
        echo -e "${GREEN}✓ Found Firebase deployment script${NC}"
        echo -e "${BLUE}Running Firebase deployment...${NC}"
        chmod +x deploy-firebase.sh
        ./deploy-firebase.sh
    else
        echo -e "${YELLOW}⚠ No deploy-firebase.sh found${NC}"
        echo "Attempting standard Firebase deployment..."
        npm install
        npm run build
        npm install -g firebase-tools
        firebase login --no-localhost
        firebase deploy --only hosting
    fi
elif [ "$DEPLOY_TYPE" == "2" ]; then
    if [ -f "deploy-cloudrun.sh" ]; then
        echo ""
        echo -e "${GREEN}✓ Found Cloud Run deployment script${NC}"
        echo -e "${BLUE}Running Cloud Run deployment...${NC}"
        chmod +x deploy-cloudrun.sh
        ./deploy-cloudrun.sh
    else
        echo -e "${YELLOW}⚠ No deploy-cloudrun.sh found${NC}"
        echo "Attempting standard Docker deployment..."

        if [ ! -f "Dockerfile" ]; then
            echo -e "${YELLOW}⚠ No Dockerfile found. Creating one...${NC}"
            # Create a generic Dockerfile for Node apps
            cat > Dockerfile <<'EOF'
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
EOF
        fi

        # Deploy to Cloud Run
        PROJECT_ID=${DEVSHELL_PROJECT_ID:-$GCP_PROJECT_ID}
        SERVICE_NAME=$(echo $REPO_NAME | tr '[:upper:]' '[:lower:]')

        gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME
        gcloud run deploy $SERVICE_NAME \
            --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
            --platform managed \
            --region us-central1 \
            --allow-unauthenticated
    fi
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
