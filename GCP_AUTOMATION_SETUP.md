# GCP Automation Setup with Claude Code

Complete guide to set up automated deployments using Claude Code on Google Cloud Platform.

## Overview

This guide shows you how to:
1. Set up Claude Code on a GCP VM or Cloud Shell
2. Connect to your GitHub repositories
3. Automate deployments with AI assistance
4. Create deployment automation for all your projects

---

## Table of Contents

1. [Quick Start - Cloud Shell](#quick-start---cloud-shell)
2. [Method 1: GCP Cloud Shell (Recommended)](#method-1-gcp-cloud-shell-recommended)
3. [Method 2: GCP Compute Engine VM](#method-2-gcp-compute-engine-vm)
4. [Automated Deployment with Claude Code](#automated-deployment-with-claude-code)
5. [Automation Scripts](#automation-scripts)
6. [Best Practices](#best-practices)

---

## Quick Start - Cloud Shell

The fastest way to get started:

1. **Open Cloud Shell**: https://shell.cloud.google.com/

2. **Install Claude Code CLI**:
```bash
# Download and install (when available)
curl -fsSL https://claude.ai/install-cli.sh | bash

# Or use VS Code in Cloud Shell
cloudshell edit .
```

3. **Clone and Deploy**:
```bash
# Clone any repo
git clone https://github.com/pbulbule13/aboutme.git
cd aboutme

# Run deployment
./deploy-firebase.sh
```

---

## Method 1: GCP Cloud Shell (Recommended)

### Why Cloud Shell?

✅ **Pre-installed tools**: gcloud, git, npm, python, docker
✅ **Always available**: Access from any browser
✅ **Persistent storage**: 5GB home directory
✅ **Authenticated**: Already connected to your GCP project
✅ **Free**: No compute costs

### Setup Steps

#### Step 1: Open Cloud Shell

Visit: https://shell.cloud.google.com/

Or click the Cloud Shell icon in GCP Console (top right).

#### Step 2: Set Up Git Authentication

```bash
# Configure git
git config --global user.name "Prashil Bulbule"
git config --global user.email "prashilbulbule13@gmail.com"

# Set up GitHub authentication
# Option A: Personal Access Token (Recommended)
gh auth login

# Option B: SSH Key
ssh-keygen -t ed25519 -C "prashilbulbule13@gmail.com"
cat ~/.ssh/id_ed25519.pub
# Add this to GitHub: Settings → SSH Keys
```

#### Step 3: Create Automation Workspace

```bash
# Create workspace directory
mkdir -p ~/deployments
cd ~/deployments

# Create automation script
cat > auto-deploy.sh <<'EOF'
#!/bin/bash
# Automated Deployment Script

REPO_URL=$1
DEPLOY_TYPE=${2:-firebase}

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== Automated Deployment ===${NC}"
echo "Repository: $REPO_URL"
echo "Type: $DEPLOY_TYPE"

# Extract repo name
REPO_NAME=$(basename $REPO_URL .git)

# Clean previous deployment
rm -rf $REPO_NAME

# Clone repository
git clone $REPO_URL
cd $REPO_NAME

# Run deployment based on type
if [ "$DEPLOY_TYPE" == "firebase" ]; then
    if [ -f "deploy-firebase.sh" ]; then
        chmod +x deploy-firebase.sh
        ./deploy-firebase.sh
    else
        npm install
        npm run build
        firebase deploy --only hosting
    fi
elif [ "$DEPLOY_TYPE" == "cloudrun" ]; then
    if [ -f "deploy-cloudrun.sh" ]; then
        chmod +x deploy-cloudrun.sh
        ./deploy-cloudrun.sh
    else
        gcloud builds submit --tag gcr.io/$(gcloud config get-value project)/$REPO_NAME
        gcloud run deploy $REPO_NAME \
            --image gcr.io/$(gcloud config get-value project)/$REPO_NAME \
            --platform managed \
            --region us-central1 \
            --allow-unauthenticated
    fi
fi

echo -e "${GREEN}✓ Deployment complete!${NC}"
EOF

chmod +x auto-deploy.sh
```

#### Step 4: Deploy Any Repository

```bash
cd ~/deployments

# Deploy aboutme portfolio
./auto-deploy.sh https://github.com/pbulbule13/aboutme firebase

# Deploy talk2myinbox
./auto-deploy.sh https://github.com/pbulbule13/talk2myinbox cloudrun

# Deploy any other project
./auto-deploy.sh https://github.com/pbulbule13/YOUR_REPO firebase
```

#### Step 5: Schedule Automated Deployments (Optional)

```bash
# Create cron job for daily deployments
crontab -e

# Add this line for daily deployment at 2 AM
0 2 * * * cd ~/deployments && ./auto-deploy.sh https://github.com/pbulbule13/aboutme firebase
```

---

## Method 2: GCP Compute Engine VM

### When to Use a VM?

- Long-running automation tasks
- Custom development environment
- More control over the environment

### Setup Steps

#### Step 1: Create VM

```bash
# Create a small VM for automation
gcloud compute instances create deployment-vm \
    --zone=us-central1-a \
    --machine-type=e2-micro \
    --image-family=ubuntu-2204-lts \
    --image-project=ubuntu-os-cloud \
    --boot-disk-size=20GB \
    --boot-disk-type=pd-standard \
    --scopes=cloud-platform

# SSH into VM
gcloud compute ssh deployment-vm --zone=us-central1-a
```

#### Step 2: Install Required Tools

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

# Install Firebase CLI
sudo npm install -g firebase-tools

# Install GitHub CLI
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh -y

# Logout and login again for Docker group
exit
gcloud compute ssh deployment-vm --zone=us-central1-a
```

#### Step 3: Set Up Automation

```bash
# Create automation directory
mkdir -p ~/automation
cd ~/automation

# Clone deployment scripts
git clone https://github.com/pbulbule13/aboutme.git
cd aboutme

# Copy deployment templates
cp deploy-*.sh ~/automation/
cp .github/workflows/* ~/automation/workflows/
```

#### Step 4: Create Deployment Service

```bash
# Create systemd service for automated deployments
sudo cat > /etc/systemd/system/auto-deploy.service <<'EOF'
[Unit]
Description=Automated Deployment Service
After=network.target

[Service]
Type=simple
User=YOUR_USERNAME
WorkingDirectory=/home/YOUR_USERNAME/automation
ExecStart=/home/YOUR_USERNAME/automation/deploy-service.sh
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

# Create deployment service script
cat > ~/automation/deploy-service.sh <<'EOF'
#!/bin/bash
# Continuous deployment service

while true; do
    # Check for updates every hour
    sleep 3600

    # Pull latest changes and deploy
    for repo in ~/automation/repos/*; do
        cd $repo
        git pull
        if [ -f "deploy-firebase.sh" ]; then
            ./deploy-firebase.sh
        fi
    done
done
EOF

chmod +x ~/automation/deploy-service.sh

# Enable and start service
sudo systemctl enable auto-deploy.service
sudo systemctl start auto-deploy.service
```

---

## Automated Deployment with Claude Code

### Using Claude Code for Deployment Automation

#### Approach 1: Interactive Deployment

```bash
# In Cloud Shell or VM terminal
# Open a repository
cd ~/deployments/aboutme

# Ask Claude Code to deploy
# Example prompt:
# "Deploy this project to Firebase Hosting"
# "Deploy to Cloud Run with custom domain"
# "Set up CI/CD for this repository"
```

#### Approach 2: Script-Based Automation

Create a file: `claude-deploy.md`

```markdown
# Deployment Instructions for Claude Code

## About Me Portfolio

Repository: https://github.com/pbulbule13/aboutme
Deployment: Firebase Hosting
Project ID: prashil-portfolio

Steps:
1. Clone repository if not exists
2. Install dependencies: npm install
3. Build: npm run build
4. Deploy: firebase deploy --only hosting

## Talk2MyInbox

Repository: https://github.com/pbulbule13/talk2myinbox
Deployment: Cloud Run
Service Name: talk2myinbox

Steps:
1. Clone repository
2. Build Docker image
3. Push to GCR
4. Deploy to Cloud Run with environment variables

## Automation

- Deploy daily at 2 AM
- Send deployment status to email
- Rollback on failure
```

#### Approach 3: Claude Code Automation Script

```bash
# Create automation wrapper
cat > ~/deployments/claude-automate.sh <<'EOF'
#!/bin/bash
# Claude Code Automation Wrapper

PROJECT=$1
ACTION=$2

# Load project configuration
source ~/deployments/projects/${PROJECT}.conf

# Generate prompt for Claude Code
cat > /tmp/claude-prompt.md <<EOL
Project: $PROJECT_NAME
Repository: $REPO_URL
Action: $ACTION

Please:
1. Clone or update the repository from $REPO_URL
2. Run deployment script: $DEPLOY_SCRIPT
3. Verify deployment was successful
4. Report any errors

Configuration:
- GCP Project: $GCP_PROJECT
- Service Name: $SERVICE_NAME
- Region: $REGION
EOL

# Execute with Claude Code
# (This would integrate with Claude Code CLI when available)
cat /tmp/claude-prompt.md
EOF

chmod +x ~/deployments/claude-automate.sh
```

---

## Automation Scripts

### Multi-Project Deployment

```bash
# Create: ~/deployments/deploy-all.sh
#!/bin/bash

PROJECTS=(
    "https://github.com/pbulbule13/aboutme:firebase"
    "https://github.com/pbulbule13/talk2myinbox:cloudrun"
    "https://github.com/pbulbule13/dailyjournal:firebase"
    "https://github.com/pbulbule13/medibot:cloudrun"
)

for project in "${PROJECTS[@]}"; do
    REPO="${project%%:*}"
    TYPE="${project##*:}"

    echo "Deploying $REPO..."
    ./auto-deploy.sh $REPO $TYPE

    if [ $? -eq 0 ]; then
        echo "✓ $REPO deployed successfully"
    else
        echo "✗ $REPO deployment failed"
    fi
done
```

### Deployment with Notifications

```bash
# Create: ~/deployments/deploy-with-notify.sh
#!/bin/bash

REPO=$1
TYPE=$2
EMAIL="prashilbulbule13@gmail.com"

# Deploy
./auto-deploy.sh $REPO $TYPE > /tmp/deploy.log 2>&1

# Check result
if [ $? -eq 0 ]; then
    STATUS="SUCCESS"
    MESSAGE="Deployment completed successfully"
else
    STATUS="FAILED"
    MESSAGE="Deployment failed. Check logs."
fi

# Send notification (using gcloud)
gcloud logging write deployment-log \
    "Deployment: $(basename $REPO .git), Status: $STATUS, Message: $MESSAGE" \
    --severity=$STATUS

# Or send email (if configured)
echo "$MESSAGE" | mail -s "Deployment $STATUS: $(basename $REPO .git)" $EMAIL
```

### Git Webhook Listener

```bash
# Create: ~/deployments/webhook-server.sh
#!/bin/bash
# Simple webhook listener for GitHub

PORT=8080

while true; do
    # Listen for webhook
    request=$(echo -e "HTTP/1.1 200 OK\r\n\r\n" | nc -l -p $PORT)

    # Extract repository info from webhook
    repo=$(echo "$request" | grep -Po '(?<="clone_url": ")[^"]*')

    if [ ! -z "$repo" ]; then
        echo "Webhook received for: $repo"
        ./auto-deploy.sh $repo firebase &
    fi
done
```

---

## Best Practices

### 1. Environment Variables

```bash
# Create .env file in ~/deployments
cat > ~/deployments/.env <<EOF
GCP_PROJECT=prashil-portfolio
DEFAULT_REGION=us-central1
NOTIFICATION_EMAIL=prashilbulbule13@gmail.com
DEPLOY_BRANCH=main
EOF

# Source in scripts
source ~/deployments/.env
```

### 2. Logging

```bash
# Create logging function
log_deployment() {
    local project=$1
    local status=$2
    local message=$3

    echo "[$(date)] $project - $status: $message" >> ~/deployments/deploy.log

    # Also log to GCP
    gcloud logging write deployment \
        "$message" \
        --severity=$status \
        --resource=global \
        --labels="project=$project"
}

# Use in scripts
log_deployment "aboutme" "INFO" "Starting deployment"
```

### 3. Health Checks

```bash
# Add to deployment scripts
verify_deployment() {
    local url=$1

    # Wait for deployment
    sleep 10

    # Check if site is accessible
    if curl -f -s -o /dev/null "$url"; then
        echo "✓ Deployment verified: $url is accessible"
        return 0
    else
        echo "✗ Deployment verification failed: $url not accessible"
        return 1
    fi
}

# Usage
if verify_deployment "https://prashil-portfolio.web.app"; then
    log_deployment "aboutme" "SUCCESS" "Deployment verified"
else
    log_deployment "aboutme" "ERROR" "Deployment verification failed"
fi
```

### 4. Rollback Capability

```bash
# Create: ~/deployments/rollback.sh
#!/bin/bash

SERVICE=$1
REVISION=${2:-previous}

if [ "$DEPLOY_TYPE" == "firebase" ]; then
    # Firebase rollback
    firebase hosting:clone \
        prashil-portfolio:live \
        prashil-portfolio:backup
elif [ "$DEPLOY_TYPE" == "cloudrun" ]; then
    # Cloud Run rollback
    gcloud run services update-traffic $SERVICE \
        --to-revisions=$REVISION=100 \
        --region=us-central1
fi
```

---

## Monitoring & Maintenance

### Dashboard Setup

```bash
# Create monitoring dashboard
cat > ~/deployments/status.sh <<'EOF'
#!/bin/bash
# Deployment Status Dashboard

echo "=== Deployment Status ==="
echo ""

# Check Firebase deployments
echo "Firebase Hosting:"
firebase hosting:sites:list

echo ""

# Check Cloud Run deployments
echo "Cloud Run Services:"
gcloud run services list

echo ""

# Check recent logs
echo "Recent Deployments:"
tail -20 ~/deployments/deploy.log
EOF

chmod +x ~/deployments/status.sh
```

### Cleanup Script

```bash
# Create: ~/deployments/cleanup.sh
#!/bin/bash
# Clean up old deployments and logs

# Remove old repos
find ~/deployments -maxdepth 1 -type d -mtime +7 -exec rm -rf {} \;

# Rotate logs
if [ -f ~/deployments/deploy.log ]; then
    mv ~/deployments/deploy.log ~/deployments/deploy.log.$(date +%Y%m%d)
    gzip ~/deployments/deploy.log.$(date +%Y%m%d)
    find ~/deployments -name "deploy.log.*.gz" -mtime +30 -delete
fi

# Clean Docker images
docker image prune -af
```

---

## Quick Commands Reference

```bash
# Deploy specific project
cd ~/deployments
./auto-deploy.sh https://github.com/pbulbule13/aboutme firebase

# Deploy all projects
./deploy-all.sh

# Check deployment status
./status.sh

# View logs
tail -f ~/deployments/deploy.log

# Rollback
./rollback.sh SERVICE_NAME

# Cleanup
./cleanup.sh
```

---

## Cost Optimization for VM

```bash
# Stop VM when not in use
gcloud compute instances stop deployment-vm --zone=us-central1-a

# Start when needed
gcloud compute instances start deployment-vm --zone=us-central1-a

# Or use preemptible VM (cheaper but can be terminated)
gcloud compute instances create deployment-vm \
    --preemptible \
    --machine-type=e2-micro \
    ...
```

### Estimated Costs

**Cloud Shell**: $0/month (free)
**e2-micro VM**: ~$6/month (if running 24/7)
**Preemptible VM**: ~$1.50/month

**Recommendation**: Use Cloud Shell for most automation tasks (free!)

---

## Troubleshooting

### Common Issues

**Issue**: Permission denied when deploying
```bash
# Solution: Authenticate gcloud
gcloud auth login
gcloud config set project your-project-id
```

**Issue**: Firebase command not found
```bash
# Solution: Install Firebase CLI
npm install -g firebase-tools
firebase login
```

**Issue**: Git authentication fails
```bash
# Solution: Use GitHub CLI
gh auth login
# Or set up SSH keys
ssh-keygen -t ed25519
cat ~/.ssh/id_ed25519.pub  # Add to GitHub
```

---

## Complete Setup Example

```bash
# 1. Open Cloud Shell
# Visit: https://shell.cloud.google.com/

# 2. Clone deployment tools
git clone https://github.com/pbulbule13/aboutme.git ~/deployment-tools
cd ~/deployment-tools

# 3. Set up automation
mkdir ~/deployments
cp deploy-*.sh ~/deployments/
cp -r .github/workflows ~/deployments/

# 4. Configure projects
cat > ~/deployments/projects.list <<EOF
https://github.com/pbulbule13/aboutme:firebase
https://github.com/pbulbule13/talk2myinbox:cloudrun
https://github.com/pbulbule13/dailyjournal:firebase
EOF

# 5. Deploy all
cd ~/deployments
while IFS=: read repo type; do
    ./auto-deploy.sh $repo $type
done < projects.list

# 6. Set up cron for automated deployments
crontab -e
# Add: 0 2 * * * ~/deployments/deploy-all.sh
```

---

## Next Steps

1. ✅ Set up Cloud Shell workspace
2. ✅ Clone your repositories
3. ✅ Create automation scripts
4. ✅ Test deployments
5. ✅ Set up monitoring
6. ✅ Schedule automated deployments

**Your automation is ready!** 🚀

---

**Created By**: Prashil Bulbule
**Last Updated**: November 2024
