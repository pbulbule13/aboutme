# Cloud Run Deployment Fix

## Issue

The app deployed to Cloud Run (https://aboutme-694708874867.us-central1.run.app/) was showing a blank page.

## Root Cause

The `vite.config.js` was configured with `base: '/aboutme/'` which is correct for GitHub Pages but **incorrect** for Cloud Run.

- **GitHub Pages**: App is served from subdirectory `/aboutme/`
- **Cloud Run**: App is served from root `/`

## Fixes Applied

### 1. Dynamic Base Path Configuration

**File: `vite.config.js`**

Changed from:
```js
export default defineConfig({
  plugins: [react()],
  base: '/aboutme/',  // ❌ Wrong for Cloud Run
})
```

To:
```js
export default defineConfig(({ mode }) => {
  // Use root path for Cloud Run, subdirectory for GitHub Pages
  const base = process.env.DEPLOY_TARGET === 'cloudrun' ? '/' : '/aboutme/'

  return {
    plugins: [react()],
    base: base,
  }
})
```

### 2. Fixed Config Path Loading

**File: `src/App.jsx`**

Changed from:
```js
fetch('/aboutme/config.json')  // ❌ Hardcoded path
```

To:
```js
const configPath = `${import.meta.env.BASE_URL}config.json`
fetch(configPath)  // ✅ Uses correct base URL
```

### 3. Updated Dockerfile

**File: `Dockerfile`**

Added:
```dockerfile
# Build the application for Cloud Run (root path)
ENV DEPLOY_TARGET=cloudrun
RUN npm run build
```

### 4. Added Build Scripts

**File: `package.json`**

Added:
```json
"build:cloudrun": "DEPLOY_TARGET=cloudrun vite build",
"build:github": "vite build"
```

## How to Redeploy

### Option 1: Rebuild and Redeploy from Local Machine

```bash
# Build with correct configuration
npm run build:cloudrun

# Deploy to Cloud Run
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/aboutme
gcloud run deploy aboutme \
  --image gcr.io/YOUR_PROJECT_ID/aboutme \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Option 2: Use Deployment Script

```bash
# The Dockerfile now has the correct environment variable
./deploy-cloudrun.sh
```

### Option 3: Deploy from GCP Cloud Shell (Easiest)

```bash
# 1. Open Cloud Shell: https://shell.cloud.google.com/

# 2. Clone and deploy
git clone https://github.com/pbulbule13/aboutme.git
cd aboutme
./deploy-cloudrun.sh

# Or use the one-liner
curl -s https://raw.githubusercontent.com/pbulbule13/aboutme/develop/deploy-from-github.sh | bash -s https://github.com/pbulbule13/aboutme 2
```

## Verification

After redeployment, visit:
- https://aboutme-694708874867.us-central1.run.app/

You should now see:
✅ Portfolio homepage
✅ Your name and title
✅ All projects displayed
✅ Navigation working
✅ No console errors

## Testing Different Deployments

### Test Cloud Run Build Locally

```bash
# Build for Cloud Run
DEPLOY_TARGET=cloudrun npm run build

# Preview
npm run preview
# Visit http://localhost:4173/ (should work from root)
```

### Test GitHub Pages Build

```bash
# Build for GitHub Pages
npm run build:github

# Preview
npm run preview
# Visit http://localhost:4173/aboutme/ (should work from subdirectory)
```

## Why This Happened

1. Initial setup was for GitHub Pages deployment
2. `vite.config.js` had hardcoded `base: '/aboutme/'`
3. When deployed to Cloud Run, the app looked for assets at `/aboutme/assets/*`
4. But Cloud Run serves from root, so assets are at `/assets/*`
5. Result: 404 errors for all assets, blank page

## Solution Summary

✅ Dynamic base path based on deployment target
✅ Environment variable controls build configuration
✅ Dockerfile sets correct environment
✅ Config path uses Vite's BASE_URL
✅ Different build scripts for different targets

## Future Deployments

### For Cloud Run
```bash
./deploy-cloudrun.sh
```
Environment is automatically set in Dockerfile.

### For GitHub Pages
```bash
npm run deploy
# or
git push origin main
```
GitHub Actions workflow uses default build (no DEPLOY_TARGET set).

### For Firebase Hosting
```bash
npm run deploy:firebase
```
Works with default base path (or you can customize).

## Troubleshooting

### Still seeing blank page?

1. **Clear browser cache**: Ctrl+Shift+R or Cmd+Shift+R

2. **Check browser console**: F12 → Console tab
   - Should NOT see 404 errors
   - Should NOT see "Failed to load config.json"

3. **Verify build**:
```bash
# Check dist folder
ls -la dist/
# Should see index.html, assets/, config.json

# Check asset paths in index.html
cat dist/index.html | grep "assets"
# Should show /assets/ not /aboutme/assets/
```

4. **Check Cloud Run logs**:
```bash
gcloud run services logs read aboutme --region us-central1
```

### Assets still showing /aboutme/ path?

```bash
# Clean build
rm -rf dist node_modules
npm install
DEPLOY_TARGET=cloudrun npm run build
```

## Next Steps

1. ✅ Commit these fixes
2. ✅ Redeploy to Cloud Run
3. ✅ Verify deployment working
4. ✅ Update documentation

Your Cloud Run deployment should now work perfectly! 🚀
