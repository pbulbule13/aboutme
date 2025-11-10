# Admin Panel Documentation

## Accessing the Admin Panel

The admin panel is accessible at the hidden URL:
```
https://your-domain.com/secret-admin-panel-xyz
```

## Default Credentials

- **Password**: `admin123`

## Features

### 1. Personal Information Management
- Update name, title, email
- Modify social media links (LinkedIn, GitHub)
- Change profile photo URL

### 2. About Section Management
- Edit about title and description
- Manage skills list
- Update highlights

### 3. Project Management
- **Add new projects** to any category
- **Edit existing projects**:
  - Project name and description
  - Technologies used
  - GitHub repository URL
  - Live demo URL
  - Documentation URL
  - Project highlights
- **Delete projects**

### 4. Real-time Updates
- All changes are saved immediately to `config.json`
- Changes take effect after page refresh

## Changing the Admin Password

To change the default password, set the `ADMIN_PASSWORD` environment variable when deploying:

```bash
# In Cloud Run
gcloud run deploy prashil-portfolio \
  --set-env-vars ADMIN_PASSWORD=your-new-password
```

Or update it in the Dockerfile/deployment configuration.

## Security Notes

1. The admin URL is hidden and not linked anywhere in the site
2. Password protection is enforced on all admin operations
3. Only authorized users with the password can make changes
4. Consider using a strong password in production

## Technical Details

- **Backend**: Express.js server
- **Frontend**: React with React Router
- **API Endpoints**:
  - `GET /api/config` - Fetch current configuration
  - `POST /api/config` - Update configuration (requires password)
  - `POST /api/verify-password` - Verify admin password
- **Port**: 8080 (Cloud Run default)

## Troubleshooting

### Changes not showing
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
3. Check if config.json was updated via API

### Cannot login
1. Verify you're using the correct password
2. Check server logs for errors
3. Ensure backend is running properly

### Save fails
1. Check network connectivity
2. Verify server is running
3. Check browser console for errors
