#!/bin/bash

# Cloud Run Deployment Script for Google Cloud
# This script can be run from GCP Cloud Shell or any VM with gcloud installed

set -e  # Exit on error

echo "========================================"
echo "Cloud Run Deployment Script"
echo "Project: Prashil Bulbule Portfolio"
echo "========================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SERVICE_NAME="prashil-portfolio"
REGION="us-central1"
REPOSITORY_NAME="prashil-portfolio"

# Check if running in GCP Cloud Shell
if [ -n "$DEVSHELL_PROJECT_ID" ]; then
    echo -e "${GREEN}✓ Running in GCP Cloud Shell${NC}"
    PROJECT_ID=$DEVSHELL_PROJECT_ID
else
    echo -e "${BLUE}ℹ Running outside Cloud Shell${NC}"
    PROJECT_ID=${GCP_PROJECT_ID:-""}

    if [ -z "$PROJECT_ID" ]; then
        echo -e "${YELLOW}Please enter your GCP Project ID:${NC}"
        read PROJECT_ID
    fi
fi

echo ""
echo -e "${BLUE}Configuration:${NC}"
echo "  Project ID: $PROJECT_ID"
echo "  Service Name: $SERVICE_NAME"
echo "  Region: $REGION"
echo ""

# Set the project
echo -e "${BLUE}Step 1: Setting GCP project...${NC}"
gcloud config set project $PROJECT_ID
echo -e "${GREEN}✓ Project set${NC}"

# Enable required APIs
echo ""
echo -e "${BLUE}Step 2: Enabling required APIs...${NC}"
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    artifactregistry.googleapis.com
echo -e "${GREEN}✓ APIs enabled${NC}"

# Create Artifact Registry repository if it doesn't exist
echo ""
echo -e "${BLUE}Step 3: Setting up Artifact Registry...${NC}"
if ! gcloud artifacts repositories describe $REPOSITORY_NAME --location=$REGION &>/dev/null; then
    gcloud artifacts repositories create $REPOSITORY_NAME \
        --repository-format=docker \
        --location=$REGION \
        --description="Docker repository for Prashil Bulbule Portfolio"
    echo -e "${GREEN}✓ Artifact Registry created${NC}"
else
    echo -e "${GREEN}✓ Artifact Registry already exists${NC}"
fi

# Build and push Docker image using Cloud Build
echo ""
echo -e "${BLUE}Step 4: Building and pushing Docker image...${NC}"
IMAGE_URL="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY_NAME}/${SERVICE_NAME}:latest"

gcloud builds submit \
    --tag $IMAGE_URL \
    .

echo -e "${GREEN}✓ Image built and pushed${NC}"

# Deploy to Cloud Run
echo ""
echo -e "${BLUE}Step 5: Deploying to Cloud Run...${NC}"
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_URL \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10 \
    --port 8080

echo -e "${GREEN}✓ Deployment successful${NC}"

# Get the service URL
echo ""
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${GREEN}Your app is live at:${NC}"
echo -e "${BLUE}$SERVICE_URL${NC}"
echo ""
echo "Cloud Run Console:"
echo "https://console.cloud.google.com/run?project=$PROJECT_ID"
echo ""
