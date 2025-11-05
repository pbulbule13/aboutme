@echo off
echo ========================================
echo Setting up separate repository...
echo ========================================
echo.

cd /d "%~dp0"

echo Initializing git repository...
git init

echo.
echo Adding all files...
git add .

echo.
echo Creating initial commit...
git commit -m "Initial commit: Production-grade AI/ML portfolio"

echo.
echo Adding remote origin...
git remote add origin https://github.com/pbulbule13/aboutme.git

echo.
echo Setting main branch...
git branch -M main

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo Repository setup complete!
echo ========================================
echo.
echo Next steps:
echo 1. Go to https://github.com/pbulbule13/aboutme/settings/pages
echo 2. Under Source, select "GitHub Actions"
echo 3. Your site will be live at https://pbulbule13.github.io/aboutme/
echo.
pause
