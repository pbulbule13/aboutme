# Reusable GCP Deployment Template

Use this template to deploy **ANY** React/Vite/Node.js project to Google Cloud Platform.

## Quick Start - Deploy ANY Project

### Option 1: One-Line Deployment from GCP Cloud Shell

```bash
# Firebase Hosting (for static sites/SPAs)
curl -s https://raw.githubusercontent.com/pbulbule13/aboutme/develop/deploy-from-github.sh | bash -s YOUR_GITHUB_URL 1

# Cloud Run (for any Docker app)
curl -s https://raw.githubusercontent.com/pbulbule13/aboutme/develop/deploy-from-github.sh | bash -s YOUR_GITHUB_URL 2
```

**Example:**
```bash
curl -s https://raw.githubusercontent.com/pbulbule13/aboutme/develop/deploy-from-github.sh | bash -s https://github.com/pbulbule13/talk2myinbox 1
```

---

## Option 2: Copy Template Files to Your Project

### Step 1: Copy Deployment Files

Copy these files from this repository to your project:

```
your-project/
├── firebase.json              # Firebase configuration
├── .firebaserc               # Firebase project settings
├── Dockerfile                # Container configuration
├── nginx.conf                # Web server config (for Docker)
├── deploy-firebase.sh        # Firebase deployment script
├── deploy-cloudrun.sh        # Cloud Run deployment script
├── deploy-from-github.sh     # GitHub to GCP deployment
└── .github/workflows/
    ├── firebase-deploy.yml   # Auto-deploy to Firebase
    └── cloudrun-deploy.yml   # Auto-deploy to Cloud Run
```

### Step 2: Customize for Your Project

#### Update `firebase.json`

No changes needed! Works with any build that outputs to `dist/` folder.

If your build outputs to a different folder, change `"public":` value:

```json
{
  "hosting": {
    "public": "build",  // Change "dist" to "build" or your output folder
    ...
  }
}
```

#### Update `.firebaserc`

```json
{
  "projects": {
    "default": "your-project-name"  // Change this
  }
}
```

#### Update GitHub Workflows

In `.github/workflows/firebase-deploy.yml`:
```yaml
projectId: your-project-name  // Line 34
```

In `.github/workflows/cloudrun-deploy.yml`:
```yaml
env:
  PROJECT_ID: ${{ secrets.GCP_PROJECT_ID }}
  SERVICE_NAME: your-service-name  // Change this
  REGION: us-central1
```

#### Update Deployment Scripts

In `deploy-firebase.sh`:
```bash
firebase use your-project-name  // Line 38
```

In `deploy-cloudrun.sh`:
```bash
SERVICE_NAME="your-service-name"  // Line 18
```

### Step 3: Deploy!

```bash
# Firebase
chmod +x deploy-firebase.sh
./deploy-firebase.sh

# Or Cloud Run
chmod +x deploy-cloudrun.sh
./deploy-cloudrun.sh

# Or using npm scripts (after adding to package.json)
npm run deploy:firebase
npm run deploy:cloudrun
```

---

## Template for Different Project Types

### React/Vite Projects (like this one)
✅ Already configured! Just copy files and customize.

### React/Create-React-App Projects

**Change in `firebase.json`:**
```json
{
  "hosting": {
    "public": "build",  // CRA outputs to "build"
    ...
  }
}
```

**Change in `Dockerfile`:**
```dockerfile
# No changes needed - it auto-detects
RUN npm run build
# Outputs to whatever your build script generates
```

### Next.js Projects

**Firebase Hosting:**
```json
{
  "hosting": {
    "public": "out",  // Next.js static export
    ...
  }
}
```

**Build command in `package.json`:**
```json
{
  "scripts": {
    "build": "next build && next export"
  }
}
```

**Cloud Run (recommended for Next.js):**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 8080
ENV PORT=8080
CMD ["npm", "start"]
```

### Vue Projects

Works out of the box! Vue CLI outputs to `dist/` by default.

### Angular Projects

**Change in `firebase.json`:**
```json
{
  "hosting": {
    "public": "dist/your-app-name",  // Angular outputs to dist/app-name
    ...
  }
}
```

### Svelte Projects

Works out of the box! SvelteKit outputs to `build/` or `dist/`.

### Node.js API Projects

**Use Cloud Run** (not Firebase Hosting):

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
ENV PORT=8080
CMD ["node", "index.js"]  // or your entry point
```

### Python Projects

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8080
ENV PORT=8080
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

---

## Complete Setup Checklist

### For Any New Project

- [ ] Copy deployment files to project root
- [ ] Update project name in `.firebaserc`
- [ ] Update service name in deployment scripts
- [ ] Update build output folder if not `dist/`
- [ ] Test build locally: `npm run build`
- [ ] Test deployment script: `./deploy-firebase.sh`
- [ ] Set up GitHub secrets (for auto-deployment)
- [ ] Push to GitHub
- [ ] Verify deployment

---

## Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "vite",  // or your dev command
    "build": "vite build",  // or your build command
    "preview": "vite preview",
    "deploy:firebase": "npm run build && firebase deploy --only hosting",
    "deploy:cloudrun": "bash deploy-cloudrun.sh",
    "deploy:gcp": "npm run deploy:firebase"
  }
}
```

---

## Environment Variables

### Firebase Hosting

Create `.env.production`:

```env
VITE_API_URL=https://api.yourapp.com
VITE_FIREBASE_API_KEY=your-key
```

### Cloud Run

Set via deployment:

```bash
gcloud run deploy SERVICE_NAME \
  --set-env-vars="API_KEY=your-key,NODE_ENV=production"
```

Or in GitHub Actions workflow:
```yaml
--set-env-vars="API_KEY=${{ secrets.API_KEY }}"
```

---

## Cost Optimization

### Firebase Hosting
- Free tier: 10 GB storage, 360 MB/day transfer
- Perfect for: Small to medium static sites
- Over free tier: $0.026/GB storage, $0.15/GB transfer

### Cloud Run
- Free tier: 2M requests, 360k GB-seconds compute
- Perfect for: Low to medium traffic apps
- Pricing: $0.40/million requests, ~$0.00002400/GB-second

### Tips to Stay Free
1. **Use Firebase for static sites** - usually stays free
2. **Set Cloud Run min instances to 0** - no idle costs
3. **Enable Cloud CDN** - reduce origin requests
4. **Optimize images** - reduce bandwidth

---

## Common Patterns

### Multi-Environment Deployment

```bash
# Development
firebase use dev
firebase deploy

# Staging
firebase use staging
firebase deploy

# Production
firebase use prod
firebase deploy
```

### Preview Deployments

```bash
# Create preview channel
firebase hosting:channel:deploy preview-feature-x

# Get preview URL
# URL: https://prashil-portfolio--preview-feature-x-abc123.web.app
```

### Rollback

```bash
# Firebase
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL TARGET_CHANNEL

# Cloud Run
gcloud run services update-traffic SERVICE_NAME \
  --to-revisions=REVISION_NAME=100
```

---

## Troubleshooting Template

### Build Fails

```bash
# Check build locally
npm run build

# Check for errors
npm run build 2>&1 | tee build.log

# Common issues:
# - Missing dependencies: npm install
# - TypeScript errors: Check tsconfig.json
# - Environment variables: Check .env files
```

### Deployment Fails

```bash
# Firebase
firebase deploy --debug

# Cloud Run
gcloud builds submit --no-cache

# Check logs
firebase functions:log
gcloud run logs read SERVICE_NAME
```

### Port Issues (Cloud Run)

```bash
# Your app MUST listen on PORT environment variable
# Express example:
const PORT = process.env.PORT || 8080;
app.listen(PORT);

# Vite/React (in Dockerfile):
EXPOSE 8080
# nginx.conf should listen on 8080
```

---

## Quick Reference Commands

### Firebase

```bash
firebase login                  # Authenticate
firebase init                   # Initialize project
firebase use PROJECT_ID         # Select project
firebase deploy                 # Deploy everything
firebase deploy --only hosting  # Deploy hosting only
firebase hosting:channel:deploy preview  # Preview
```

### Cloud Run

```bash
gcloud run deploy SERVICE       # Deploy
gcloud run services list        # List services
gcloud run services describe SERVICE  # Get details
gcloud run services delete SERVICE    # Delete
```

### Docker

```bash
docker build -t my-app .        # Build image
docker run -p 8080:8080 my-app  # Test locally
docker logs CONTAINER_ID        # View logs
```

---

## GitHub Actions Secrets

Required secrets for auto-deployment:

### Firebase
- `FIREBASE_SERVICE_ACCOUNT` - Service account JSON

### Cloud Run
- `GCP_PROJECT_ID` - Your GCP project ID
- `WIF_PROVIDER` - Workload Identity Provider
- `WIF_SERVICE_ACCOUNT` - Service account email

---

## Support & Resources

- **This Template**: https://github.com/pbulbule13/aboutme
- **Firebase Docs**: https://firebase.google.com/docs/hosting
- **Cloud Run Docs**: https://cloud.google.com/run/docs
- **GitHub Actions**: https://docs.github.com/en/actions

---

## Example Projects Using This Template

1. **This Portfolio** (React + Vite)
   - Repo: https://github.com/pbulbule13/aboutme
   - Live: https://pbulbule13.github.io/aboutme/

2. **Talk2MyInbox** (Python + FastAPI)
   - Repo: https://github.com/pbulbule13/talk2myinbox
   - Deploy: Cloud Run

3. **MediBot** (Python + AI)
   - Repo: https://github.com/pbulbule13/medibot
   - Deploy: Cloud Run

---

**Created By**: Prashil Bulbule
**Last Updated**: November 2024
**License**: Free to use and modify
