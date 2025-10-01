# Netlify Deployment Guide

## Quick Deploy

### Option 1: Netlify CLI (Recommended)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy to production
netlify deploy --prod --dir=dist
```

### Option 2: Git Integration
1. Push code to GitHub/GitLab
2. Connect repository to Netlify
3. Netlify will auto-deploy on push

## Build Configuration

The project is configured with:
- **Build Command**: `npm run build:prod`
- **Publish Directory**: `dist`
- **Production API**: `https://umuganda-tech-backend.onrender.com`

## Environment Variables

Production environment variables are set in:
- `netlify.toml` (build-time)
- `.env.production` (local production testing)

## SPA Routing

Configured via:
- `netlify.toml` redirects
- `_redirects` file (backup)

Both ensure React Router works correctly on Netlify.

## Performance Optimizations

- Code splitting by vendor/feature
- Minified builds with Terser
- Optimized chunk sizes
- Source maps disabled for production

## Deployment Checklist

- [x] Production environment variables set
- [x] Build command configured
- [x] SPA redirects configured
- [x] Code splitting optimized
- [x] Backend API URL updated
- [x] Build artifacts in `dist/`

## Local Production Testing

```bash
# Build for production
npm run build:prod

# Preview production build
npm run preview
```

Visit `http://localhost:4173` to test production build locally.