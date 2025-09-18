# Namecheap Deployment Guide

## Quick Deployment Steps

### 1. Build Your React App
```bash
cd frontend
npm run build
```

### 2. Files to Upload
Upload ALL contents from `frontend/build/` folder to your Namecheap `public_html` directory.

### 3. Required Files Structure in public_html
```
public_html/
├── index.html
├── static/
│   ├── css/
│   └── js/
├── images/
├── favicon.ico
└── manifest.json
```

### 4. Environment Configuration
Create a `.env` file in public_html with your production Supabase credentials:
```
REACT_APP_SUPABASE_URL=your_production_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

### 5. Test Your Deployment
1. Visit your domain
2. Check browser console for errors
3. Test all functionality

## Troubleshooting

### Common Issues:
1. **404 Errors**: Ensure all files are in public_html root
2. **API Errors**: Check Supabase configuration
3. **Styling Issues**: Verify CSS files uploaded correctly
4. **Routing Issues**: May need .htaccess file for React Router

### .htaccess File for React Router
Create `.htaccess` in public_html:
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

## Alternative: Use Vercel (Easier)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on every push

## Alternative: Use Netlify
1. Drag and drop your build folder
2. Configure environment variables
3. Set up custom domain if needed
