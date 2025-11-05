# Setting Up as Separate Repository

This guide will help you set up the aboutme portfolio as a separate GitHub repository.

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `aboutme`
3. Description: "AI/ML Engineer Portfolio"
4. Make it **Public** (required for GitHub Pages)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

## Step 2: Set Up Local Repository

Run these commands from the `aboutme` directory:

```bash
# Navigate to the aboutme directory
cd C:\Users\pbkap\Documents\euron\Projects\aboutme

# Initialize as a new git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Production-grade AI/ML portfolio"

# Add the remote repository
git remote add origin https://github.com/pbulbule13/aboutme.git

# Create and push to main branch
git branch -M main
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to https://github.com/pbulbule13/aboutme/settings/pages
2. Under **Source**, select **GitHub Actions**
3. The workflow will automatically deploy when you push to main

## Step 4: Update Configuration

1. Edit `vite.config.js` and update the base path:
   ```js
   base: '/aboutme/',
   ```

2. Your portfolio will be live at:
   https://pbulbule13.github.io/aboutme/

## Alternative: Quick Setup Script

Create a file called `setup-repo.bat` with:

```batch
@echo off
echo Setting up separate repository...

cd /d "%~dp0"

git init
git add .
git commit -m "Initial commit: Production-grade AI/ML portfolio"
git remote add origin https://github.com/pbulbule13/aboutme.git
git branch -M main
git push -u origin main

echo.
echo Repository setup complete!
echo.
echo Next steps:
echo 1. Go to https://github.com/pbulbule13/aboutme/settings/pages
echo 2. Under Source, select "GitHub Actions"
echo 3. Your site will be live at https://pbulbule13.github.io/aboutme/
pause
```

Then run it in the aboutme directory.

## Updating in the Future

Once set up, you can update your portfolio from anywhere:

```bash
# Clone the repository
git clone https://github.com/pbulbule13/aboutme.git
cd aboutme

# Make changes to public/config.json
# ... edit the file ...

# Commit and push
git add public/config.json
git commit -m "Update portfolio content"
git push

# Or edit directly on GitHub
# Navigate to public/config.json and click the edit button
```
