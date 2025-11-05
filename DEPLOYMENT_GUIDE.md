# Google Cloud Deployment Guide

Complete guide for deploying this portfolio (and other projects) to Google Cloud Platform.

## Table of Contents

1. [Deployment Options](#deployment-options)
2. [Method 1: Automated GitHub Actions](#method-1-automated-github-actions-recommended)
3. [Method 2: Deploy from GCP Cloud Shell](#method-2-deploy-from-gcp-cloud-shell)
4. [Method 3: Deploy from Local Machine](#method-3-deploy-from-local-machine)
5. [Deploy ANY Project from GitHub](#deploy-any-project-from-github)
6. [Comparison & Costs](#comparison--costs)

---

## Deployment Options

### Option A: Firebase Hosting (Recommended for this project)
- **Best for**: Static sites, SPAs (React, Vue, Angular)
- **Cost**: FREE (generous free tier)
- **Speed**: Ultra-fast global CDN
- **SSL**: Automatic HTTPS
- **Setup**: Easiest

### Option B: Cloud Run (Alternative)
- **Best for**: Containerized apps, APIs, any Docker app
- **Cost**: Pay per use (very cheap for low traffic)
- **Speed**: Fast, serverless
- **SSL**: Automatic HTTPS
- **Setup**: Moderate

---

## Method 1: Automated GitHub Actions (Recommended)

### For Firebase Hosting

#### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Project name: `prashil-portfolio`
4. Disable Google Analytics (optional)
5. Click "Create project"

#### Step 2: Get Firebase Service Account

```bash
# In GCP Cloud Shell or terminal with gcloud installed
gcloud iam service-accounts create firebase-deployer \
    --display-name="Firebase GitHub Actions Deployer"

# Get service account email
SA_EMAIL="firebase-deployer@prashil-portfolio.iam.gserviceaccount.com"

# Grant necessary permissions
gcloud projects add-iam-policy-binding prashil-portfolio \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/firebase.admin"

# Create and download key
gcloud iam service-accounts keys create firebase-key.json \
    --iam-account=$SA_EMAIL

# Display the key content (copy this)
cat firebase-key.json
```

#### Step 3: Add GitHub Secrets

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add these secrets:

   **Name**: `FIREBASE_SERVICE_ACCOUNT`
   **Value**: (paste the entire content of firebase-key.json)

#### Step 4: Push to GitHub

```bash
git add .
git commit -m "Add Firebase deployment"
git push origin develop
```

The app will automatically deploy on every push!

**Your live URL**: `https://prashil-portfolio.web.app`

---

### For Cloud Run (Automated)

#### Step 1: Set up Workload Identity Federation

```bash
# Set variables
PROJECT_ID="your-gcp-project-id"
REPO="pbulbule13/aboutme"

# Create Workload Identity Pool
gcloud iam workload-identity-pools create "github-pool" \
  --project="$PROJECT_ID" \
  --location="global" \
  --display-name="GitHub Actions Pool"

# Create Workload Identity Provider
gcloud iam workload-identity-pools providers create-oidc "github-provider" \
  --project="$PROJECT_ID" \
  --location="global" \
  --workload-identity-pool="github-pool" \
  --display-name="GitHub Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com"

# Create service account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions"

# Grant permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Allow GitHub to impersonate service account
gcloud iam service-accounts add-iam-policy-binding \
  "github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/attribute.repository/$REPO"
```

#### Step 2: Add GitHub Secrets

Add these secrets to your GitHub repository:

- **GCP_PROJECT_ID**: Your GCP project ID
- **WIF_PROVIDER**: `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/providers/github-provider`
- **WIF_SERVICE_ACCOUNT**: `github-actions@PROJECT_ID.iam.gserviceaccount.com`

---

## Method 2: Deploy from GCP Cloud Shell

**Perfect for: Quick deployments without local setup**

### Firebase Deployment

1. Open [Google Cloud Shell](https://shell.cloud.google.com/)

2. Run the one-liner:

```bash
curl -s https://raw.githubusercontent.com/pbulbule13/aboutme/develop/deploy-from-github.sh | bash -s https://github.com/pbulbule13/aboutme 1
```

Or clone and deploy:

```bash
# Clone the repository
git clone https://github.com/pbulbule13/aboutme.git
cd aboutme

# Run deployment script
chmod +x deploy-firebase.sh
./deploy-firebase.sh
```

### Cloud Run Deployment

```bash
# One-liner
curl -s https://raw.githubusercontent.com/pbulbule13/aboutme/develop/deploy-from-github.sh | bash -s https://github.com/pbulbule13/aboutme 2

# Or manual
git clone https://github.com/pbulbule13/aboutme.git
cd aboutme
chmod +x deploy-cloudrun.sh
./deploy-cloudrun.sh
```

---

## Method 3: Deploy from Local Machine

### Prerequisites

```bash
# Install Google Cloud SDK
# Visit: https://cloud.google.com/sdk/docs/install

# Install Firebase CLI
npm install -g firebase-tools

# Authenticate
gcloud auth login
firebase login
```

### Firebase Deployment

```bash
# Clone repository
git clone https://github.com/pbulbule13/aboutme.git
cd aboutme

# Install dependencies
npm install

# Build
npm run build

# Deploy
firebase deploy --only hosting
```

### Cloud Run Deployment

```bash
# Set project
gcloud config set project your-project-id

# Deploy
./deploy-cloudrun.sh
```

---

## Deploy ANY Project from GitHub

### Quick Deployment Script

Save this as `quick-deploy.sh` and use it for ANY project:

```bash
#!/bin/bash
# Usage: ./quick-deploy.sh https://github.com/user/repo firebase
# Or:    ./quick-deploy.sh https://github.com/user/repo cloudrun

REPO_URL=$1
DEPLOY_TYPE=$2

git clone $REPO_URL
cd $(basename $REPO_URL .git)

if [ "$DEPLOY_TYPE" == "firebase" ]; then
    npm install
    npm run build
    firebase deploy --only hosting
elif [ "$DEPLOY_TYPE" == "cloudrun" ]; then
    gcloud builds submit --tag gcr.io/$(gcloud config get-value project)/$(basename $REPO_URL .git)
    gcloud run deploy $(basename $REPO_URL .git) \
        --image gcr.io/$(gcloud config get-value project)/$(basename $REPO_URL .git) \
        --platform managed \
        --region us-central1 \
        --allow-unauthenticated
fi
```

### Using Cloud Shell (Easiest!)

**Deploy ANY GitHub repo in 3 steps:**

1. Open [Google Cloud Shell](https://shell.cloud.google.com/)

2. Run one command:
```bash
# For Firebase
curl -s https://raw.githubusercontent.com/pbulbule13/aboutme/develop/deploy-from-github.sh | bash -s https://github.com/YOUR_USER/YOUR_REPO 1

# For Cloud Run
curl -s https://raw.githubusercontent.com/pbulbule13/aboutme/develop/deploy-from-github.sh | bash -s https://github.com/YOUR_USER/YOUR_REPO 2
```

3. Done! Your app is live!

---

## Comparison & Costs

| Feature | Firebase Hosting | Cloud Run |
|---------|-----------------|-----------|
| **Best For** | Static sites, SPAs | Any containerized app |
| **Pricing** | FREE (10 GB storage, 360 MB/day transfer) | FREE tier: 2M requests/month |
| **Custom Domain** | Yes (free) | Yes (free) |
| **SSL** | Automatic | Automatic |
| **Global CDN** | Yes | Yes |
| **Build Time** | 1-2 min | 2-5 min |
| **Cold Start** | None | ~1-2 sec |
| **Scaling** | Automatic | Automatic |
| **Setup Complexity** | Easy | Moderate |

### Cost Estimates

**Firebase Hosting (This Portfolio):**
- Storage: ~100 MB
- Monthly traffic: ~1 GB
- **Cost: $0/month** (well within free tier)

**Cloud Run (This Portfolio):**
- Requests: ~1000/month
- CPU time: ~10 hours/month
- **Cost: $0/month** (within free tier)

---

## Automated Deployment Matrix

### Available Workflows

This repository includes three GitHub Actions workflows:

1. **`deploy.yml`** - GitHub Pages deployment
2. **`firebase-deploy.yml`** - Firebase Hosting deployment
3. **`cloudrun-deploy.yml`** - Cloud Run deployment

### Enable/Disable Workflows

```bash
# Disable GitHub Pages, enable Firebase
rm .github/workflows/deploy.yml
# Workflow will now use firebase-deploy.yml

# Or keep all and deploy to multiple platforms!
```

---

## Troubleshooting

### Firebase Issues

**Error: "No project found"**
```bash
# Initialize Firebase
firebase init hosting

# Select your project
firebase use prashil-portfolio
```

**Error: "Authentication required"**
```bash
# Login to Firebase
firebase login --reauth
```

### Cloud Run Issues

**Error: "API not enabled"**
```bash
# Enable required APIs
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    artifactregistry.googleapis.com
```

**Error: "Permission denied"**
```bash
# Check permissions
gcloud projects get-iam-policy $(gcloud config get-value project)
```

---

## Updating Your Deployment

### For Firebase

```bash
# Make changes to your code
git add .
git commit -m "Update content"
git push

# Automatic deployment via GitHub Actions
# Or manual: firebase deploy
```

### For Cloud Run

```bash
# Changes deploy automatically via GitHub Actions
# Or manual:
./deploy-cloudrun.sh
```

---

## Domain Setup

### Custom Domain (Firebase)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Hosting → Add custom domain
3. Enter your domain: `prashilbulbule.com`
4. Follow DNS configuration steps
5. SSL automatically provisioned!

### Custom Domain (Cloud Run)

```bash
# Map domain
gcloud run domain-mappings create \
    --service prashil-portfolio \
    --domain prashilbulbule.com \
    --region us-central1

# Get DNS records
gcloud run domain-mappings describe \
    --domain prashilbulbule.com \
    --region us-central1
```

---

## Monitoring & Analytics

### Firebase

- **Analytics**: Firebase Console → Analytics
- **Performance**: Firebase Console → Performance
- **Hosting Metrics**: Firebase Console → Hosting → Usage

### Cloud Run

```bash
# View logs
gcloud run services logs read prashil-portfolio --region us-central1

# Metrics
# Visit: https://console.cloud.google.com/run
```

---

## Quick Reference

### Firebase Commands

```bash
firebase login              # Login
firebase init              # Initialize
firebase deploy            # Deploy
firebase hosting:channel:deploy preview  # Preview
firebase serve             # Local test
```

### Cloud Run Commands

```bash
gcloud run deploy SERVICE_NAME --source .  # Deploy from source
gcloud run services list                   # List services
gcloud run services delete SERVICE_NAME    # Delete
gcloud run services describe SERVICE_NAME  # Get details
```

---

## Reusable Template

### For Other Projects

Copy these files to any React/Vite project:

```
├── firebase.json
├── .firebaserc
├── Dockerfile
├── nginx.conf
├── deploy-firebase.sh
├── deploy-cloudrun.sh
├── deploy-from-github.sh
└── .github/workflows/
    ├── firebase-deploy.yml
    └── cloudrun-deploy.yml
```

Update `firebase.json` and workflow files with your project name!

---

## Support

- [Firebase Documentation](https://firebase.google.com/docs/hosting)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

**Last Updated**: November 2024
**Maintained By**: Prashil Bulbule
