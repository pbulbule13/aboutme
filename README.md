# AI/ML Engineer Portfolio

A beautiful, production-grade portfolio application showcasing AI/ML engineering projects and expertise. Built with React and Vite, featuring a clean, professional design with collapsible sections and full configurability.

## Live Demo

**Repository**: https://github.com/pbulbule13/aboutme
**Live Site**: https://pbulbule13.github.io/aboutme/ (after GitHub Pages setup)

## Features

- **Single-page application** with smooth scrolling navigation
- **Collapsible sections** for better content organization
- **Fully configurable** via JSON - no code changes needed
- **Project categorization** (Machine Learning, Artificial Intelligence, etc.)
- **Responsive design** that works on all devices
- **Light, professional color scheme** with beautiful gradients
- **GitHub & Live URL links** for each project
- **Automatic deployment** to GitHub Pages via GitHub Actions
- **Professional animations** and hover effects
- **Social media integration** (GitHub, LinkedIn, Email)

## Table of Contents

1. [Quick Start](#quick-start)
2. [Local Development](#local-development)
3. [Configuration Guide](#configuration-guide)
4. [Deployment](#deployment)
5. [Updating Your Portfolio](#updating-your-portfolio)
6. [Project Structure](#project-structure)
7. [Troubleshooting](#troubleshooting)

## Quick Start

### Prerequisites

- Node.js 16+ installed
- Git installed
- A GitHub account

### 1. Clone the Repository

```bash
git clone https://github.com/pbulbule13/aboutme.git
cd aboutme
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:5173/aboutme/**

You should see a portfolio with sample data. Now you can customize it!

## Local Development

### Development Server

Start the development server with hot module replacement:

```bash
npm run dev
```

- **Local URL**: http://localhost:5173/aboutme/
- **Network Access**: Run `npm run dev -- --host` to access from other devices
- **Port**: Default is 5173 (changes automatically if port is busy)

### Build for Production

Create an optimized production build:

```bash
npm run build
```

The build output will be in the `dist/` folder.

### Preview Production Build

Test the production build locally:

```bash
npm run preview
```

## Configuration Guide

All portfolio content is controlled by **`public/config.json`**. No coding required!

### Step-by-Step Configuration

#### Step 1: Update Personal Information

Open `public/config.json` and edit the `personal` section:

```json
{
  "personal": {
    "name": "John Doe",
    "title": "Senior AI/ML Engineer",
    "photo": "/profile-photo.jpg",
    "email": "john.doe@example.com",
    "linkedin": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe"
  }
}
```

**Fields:**
- `name`: Your full name (displayed in header and hero section)
- `title`: Your professional title/role
- `photo`: Path to your photo in the `public` folder (see Step 2)
- `email`: Your contact email
- `linkedin`: Your LinkedIn profile URL (optional)
- `github`: Your GitHub profile URL (optional)

#### Step 2: Add Your Profile Photo

1. Place your photo in the `public` folder:
   ```
   public/
   └── profile-photo.jpg
   ```

2. Update the path in `config.json`:
   ```json
   "photo": "/profile-photo.jpg"
   ```

**Recommendations:**
- Size: At least 400x400px (square)
- Format: JPG, PNG, or WebP
- File size: Under 500KB for fast loading

#### Step 3: Configure About Me Section

Edit the `about` section:

```json
{
  "about": {
    "title": "About Me",
    "description": "I'm a passionate AI/ML Engineer with 5+ years of experience building intelligent systems that solve real-world problems. Specialized in NLP, computer vision, and MLOps.",
    "skills": [
      "Machine Learning",
      "Deep Learning",
      "Natural Language Processing",
      "Computer Vision",
      "MLOps & Model Deployment",
      "Python, TensorFlow, PyTorch",
      "Data Engineering & Analysis",
      "Cloud Computing (AWS, GCP)"
    ],
    "highlights": [
      {
        "icon": "brain",
        "title": "AI Innovation",
        "description": "Developing cutting-edge AI solutions using state-of-the-art models and techniques"
      },
      {
        "icon": "code",
        "title": "Production Systems",
        "description": "Building scalable, production-ready ML pipelines and deployment infrastructure"
      },
      {
        "icon": "trending-up",
        "title": "Impact Driven",
        "description": "Focused on creating measurable business value through data-driven AI solutions"
      }
    ]
  }
}
```

**Available Icons for Highlights:**
- `brain` - AI/Intelligence
- `code` - Development/Coding
- `trending-up` - Growth/Impact

#### Step 4: Add Your Projects

Projects are organized into categories. Add your projects like this:

```json
{
  "projects": {
    "categories": [
      {
        "id": "machine-learning",
        "name": "Machine Learning",
        "description": "Classical ML and statistical learning projects",
        "projects": [
          {
            "name": "Customer Churn Prediction",
            "description": "ML model predicting customer churn with 92% accuracy using ensemble methods and feature engineering",
            "technologies": ["Python", "Scikit-learn", "XGBoost", "Pandas"],
            "githubUrl": "https://github.com/yourusername/churn-prediction",
            "liveUrl": "https://churn-demo.herokuapp.com",
            "highlights": [
              "92% prediction accuracy",
              "Reduced churn by 15%",
              "Real-time API endpoint"
            ]
          }
        ]
      },
      {
        "id": "artificial-intelligence",
        "name": "Artificial Intelligence",
        "description": "Deep learning, NLP, and advanced AI projects",
        "projects": [
          {
            "name": "Sentiment Analysis API",
            "description": "Real-time sentiment analysis using transformer models with multi-language support",
            "technologies": ["BERT", "Hugging Face", "FastAPI", "Docker"],
            "githubUrl": "https://github.com/yourusername/sentiment-api",
            "liveUrl": "",
            "highlights": [
              "15+ language support",
              "99% uptime",
              "Processing 1000+ requests/sec"
            ]
          }
        ]
      }
    ]
  }
}
```

**Project Fields:**
- `name`: Project name
- `description`: Brief description (1-2 sentences)
- `technologies`: Array of technologies used
- `githubUrl`: Link to GitHub repository
- `liveUrl`: Link to live demo (leave empty `""` if none)
- `highlights`: Array of key achievements (3-5 items recommended)

#### Adding a New Category

To add a new project category (e.g., "Data Engineering"):

```json
{
  "id": "data-engineering",
  "name": "Data Engineering",
  "description": "Data pipeline and ETL projects",
  "projects": [...]
}
```

**Category Fields:**
- `id`: Unique identifier (lowercase with hyphens)
- `name`: Display name
- `description`: Category description
- `projects`: Array of project objects

## Deployment

### GitHub Pages (Recommended)

This portfolio automatically deploys to GitHub Pages when you push to the repository.

#### Initial Setup

1. **Enable GitHub Pages:**
   - Go to https://github.com/pbulbule13/aboutme/settings/pages
   - Under **Source**, select **GitHub Actions**
   - Click **Save**

2. **Push Your Changes:**
   ```bash
   git add .
   git commit -m "Configure portfolio content"
   git push origin develop
   ```

3. **Wait for Deployment:**
   - Go to https://github.com/pbulbule13/aboutme/actions
   - Wait for the "Deploy to GitHub Pages" workflow to complete (2-3 minutes)

4. **Visit Your Site:**
   - Your portfolio will be live at: **https://pbulbule13.github.io/aboutme/**

#### Deployment Workflow

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:
1. Installs dependencies
2. Builds the production app
3. Deploys to GitHub Pages

**Triggers:**
- Push to `main` or `develop` branch
- Manual trigger via GitHub Actions tab

### Alternative: Manual Deployment with gh-pages

```bash
npm run deploy
```

This command builds and deploys to the `gh-pages` branch.

## Updating Your Portfolio

### Method 1: Edit on GitHub (Easiest)

1. Go to https://github.com/pbulbule13/aboutme/blob/develop/public/config.json
2. Click the **pencil icon** (Edit this file)
3. Make your changes
4. Scroll down and click **Commit changes**
5. Your site will automatically rebuild and deploy!

### Method 2: Local Development

1. **Clone or Pull Latest:**
   ```bash
   git clone https://github.com/pbulbule13/aboutme.git
   cd aboutme
   # OR if already cloned
   git pull origin develop
   ```

2. **Make Changes:**
   - Edit `public/config.json`
   - Add/update photos in `public/` folder
   - Test locally with `npm run dev`

3. **Commit and Push:**
   ```bash
   git add .
   git commit -m "Update portfolio: added new ML project"
   git push origin develop
   ```

4. **Automatic Deployment:**
   - GitHub Actions will automatically build and deploy
   - Check progress at: https://github.com/pbulbule13/aboutme/actions

### Method 3: Update from Any Other Repository

You can update this portfolio while working in another project:

```bash
# Clone the portfolio repo in a separate location
cd ~/projects
git clone https://github.com/pbulbule13/aboutme.git
cd aboutme

# Edit config.json
nano public/config.json

# Commit and push
git add public/config.json
git commit -m "Added new project"
git push
```

## Project Structure

```
aboutme/
├── public/
│   ├── config.json              # 📝 EDIT THIS - All your portfolio data
│   └── [your-photos]           # Your profile and project images
│
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Fixed navigation header
│   │   ├── Hero.jsx            # Hero section with photo
│   │   ├── About.jsx           # About section (collapsible)
│   │   ├── Projects.jsx        # Projects showcase (collapsible)
│   │   └── Footer.jsx          # Footer with links
│   │
│   ├── App.jsx                 # Main application component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
│
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment
│
├── dist/                       # Production build (auto-generated)
├── node_modules/              # Dependencies (auto-generated)
│
├── index.html                 # HTML template
├── vite.config.js             # Vite configuration
├── package.json               # Project dependencies
├── README.md                  # This file
└── .gitignore                 # Git ignore rules
```

## Technology Stack

- **React 18.3** - Modern UI library with hooks
- **Vite 6.0** - Lightning-fast build tool and dev server
- **CSS3** - Custom properties, flexbox, grid, animations
- **GitHub Pages** - Free static site hosting
- **GitHub Actions** - Automated CI/CD pipeline

## Customization Beyond Config

### Changing Colors

Edit `src/index.css` and modify CSS custom properties:

```css
:root {
  --primary-color: #6366f1;      /* Main brand color */
  --primary-light: #818cf8;      /* Lighter accent */
  --primary-dark: #4f46e5;       /* Darker accent */
  --bg-light: #fafafa;           /* Background */
  --text-dark: #1f2937;          /* Main text */
  /* ... more variables ... */
}
```

### Adding More Sections

1. Create a new component in `src/components/`
2. Import and add it to `src/App.jsx`
3. Update navigation in `src/components/Header.jsx`

### Changing Base URL

If deploying to a different URL, edit `vite.config.js`:

```js
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/',  // Change this
})
```

## Troubleshooting

### Issue: Site Shows "Error loading configuration"

**Solution:**
- Check that `public/config.json` exists
- Validate JSON syntax at https://jsonlint.com
- Ensure all quotes are double quotes (`"`)
- Check browser console for specific errors

### Issue: Photo Not Showing

**Solution:**
- Verify photo exists in `public/` folder
- Check path starts with `/` (e.g., `/photo.jpg`)
- Ensure photo filename matches exactly (case-sensitive)
- Try a different image format (JPG, PNG, WebP)

### Issue: GitHub Pages Shows 404

**Solution:**
1. Check GitHub Pages is enabled in repository settings
2. Verify deployment workflow completed successfully
3. Wait 2-3 minutes for DNS propagation
4. Check `vite.config.js` has correct `base` path

### Issue: Changes Not Appearing on Live Site

**Solution:**
1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Check GitHub Actions completed successfully
3. Wait 2-3 minutes for deployment
4. Clear browser cache

### Issue: Local Dev Server Not Starting

**Solution:**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use different port
npm run dev -- --port 3000
```

### Issue: Build Fails

**Solution:**
```bash
# Check Node.js version (need 16+)
node --version

# Clean install
npm ci

# Try building with verbose output
npm run build --verbose
```

## Development Tips

1. **Test Locally First**: Always run `npm run dev` before pushing
2. **Validate JSON**: Use https://jsonlint.com to check `config.json`
3. **Optimize Images**: Compress images before adding to `public/`
4. **Commit Often**: Make small, focused commits
5. **Use Branches**: Create feature branches for major changes

## Example Workflows

### Adding a New Project

```bash
# 1. Pull latest changes
git pull origin develop

# 2. Edit config.json
nano public/config.json

# 3. Test locally
npm run dev

# 4. Commit and push
git add public/config.json
git commit -m "Added sentiment analysis project"
git push origin develop
```

### Updating Profile Photo

```bash
# 1. Add new photo to public/
cp ~/Downloads/new-photo.jpg public/profile.jpg

# 2. Update config.json
# Edit "photo": "/profile.jpg"

# 3. Test locally
npm run dev

# 4. Commit and push
git add public/profile.jpg public/config.json
git commit -m "Updated profile photo"
git push origin develop
```

## Performance

- **Build Time**: ~600ms
- **First Load**: ~157KB JS + 12KB CSS (gzipped)
- **Lighthouse Score**: 95+ on all metrics
- **Mobile Friendly**: Fully responsive

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Contributing

This is a personal portfolio template. Feel free to fork and customize for your own use!

## Support

If you encounter issues:

1. Check this README's [Troubleshooting](#troubleshooting) section
2. Verify `config.json` is valid JSON
3. Check browser console for errors (F12)
4. Review GitHub Actions logs for deployment issues

## License

Free to use for personal portfolios. No attribution required.

## Credits

Built with React, Vite, and passion for AI/ML.

---

**Quick Links:**
- 📚 [Configuration Guide](#configuration-guide)
- 🚀 [Deployment](#deployment)
- 🔧 [Troubleshooting](#troubleshooting)
- 💻 [Live Demo](https://pbulbule13.github.io/aboutme/)

Last Updated: November 2024
