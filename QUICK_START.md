# Quick Start Guide

Your AI/ML portfolio is ready! Follow these steps to customize and deploy it.

## Repository

**GitHub Repository**: https://github.com/pbulbule13/aboutme
**Branch**: `develop`

## Next Steps

### 1. Enable GitHub Pages

1. Go to https://github.com/pbulbule13/aboutme/settings/pages
2. Under **Source**, select **GitHub Actions**
3. The site will automatically deploy when you push changes
4. Your portfolio will be live at: **https://pbulbule13.github.io/aboutme/**

### 2. Customize Your Content

Edit the file `public/config.json` to add your information:

```json
{
  "personal": {
    "name": "Your Name Here",
    "title": "Your Title",
    "photo": "/your-photo.jpg",
    "email": "your.email@example.com",
    "linkedin": "https://linkedin.com/in/yourprofile",
    "github": "https://github.com/pbulbule13"
  }
}
```

### 3. Add Your Photo

1. Place your photo in the `public` folder (e.g., `public/profile.jpg`)
2. Update the path in `config.json`:
   ```json
   "photo": "/profile.jpg"
   ```

### 4. Add Your Projects

Edit `public/config.json` and add your projects:

```json
"projects": {
  "categories": [
    {
      "id": "machine-learning",
      "name": "Machine Learning",
      "projects": [
        {
          "name": "Your Project Name",
          "description": "Project description",
          "technologies": ["Python", "TensorFlow"],
          "githubUrl": "https://github.com/pbulbule13/project",
          "liveUrl": "https://your-demo.com",
          "highlights": ["Feature 1", "Feature 2"]
        }
      ]
    }
  ]
}
```

### 5. Test Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:5173 in your browser
```

### 6. Deploy Your Changes

```bash
# After making changes to config.json
git add public/config.json
git commit -m "Update portfolio content"
git push origin develop
```

The site will automatically rebuild and deploy!

## Quick Update from Anywhere

**Method 1: GitHub Web Interface**
1. Go to https://github.com/pbulbule13/aboutme/blob/develop/public/config.json
2. Click the pencil icon to edit
3. Make your changes
4. Commit directly to the repository

**Method 2: Command Line**
```bash
git clone https://github.com/pbulbule13/aboutme.git
cd aboutme
# Edit public/config.json
git add public/config.json
git commit -m "Update projects"
git push
```

## Features

- ✅ Single-page responsive design
- ✅ Collapsible sections
- ✅ Project categorization (ML/AI)
- ✅ Live URL & GitHub links
- ✅ Professional light color scheme
- ✅ Mobile-friendly
- ✅ Automatic deployment
- ✅ Easy configuration (just edit JSON)

## Support

For detailed instructions, see:
- **README.md** - Complete documentation
- **SETUP_SEPARATE_REPO.md** - Repository setup details

## Live Preview

Once GitHub Pages is enabled, visit:
**https://pbulbule13.github.io/aboutme/**

Enjoy your new portfolio! 🚀
