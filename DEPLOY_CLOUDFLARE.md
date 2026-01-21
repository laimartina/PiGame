# Deploy to Cloudflare Pages

This guide will help you deploy your Pi Game to Cloudflare Pages.

## Prerequisites

1. A Cloudflare account (free tier works)
2. Your code in a Git repository (GitHub, GitLab, or Bitbucket)

## Method 1: Deploy via Cloudflare Dashboard (Recommended)

### Step 1: Push to Git Repository

Make sure your code is pushed to GitHub, GitLab, or Bitbucket:

```bash
git add .
git commit -m "Prepare for Cloudflare Pages deployment"
git push origin main
```

### Step 2: Connect to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** in the sidebar
3. Click **Create a project**
4. Click **Connect to Git**
5. Authorize Cloudflare to access your repository
6. Select your repository and branch (usually `main`)

### Step 3: Configure Build Settings

- **Project name**: `pi-game` (or your preferred name)
- **Production branch**: `main`
- **Build command**: `npm run build` (or leave empty if deploying root directory)
- **Build output directory**: `dist` (or `.` if deploying root directory)
- **Root directory**: `/` (leave as default)

**Note**: If you want to deploy directly from the root directory (without build step), set:
- **Build command**: (leave empty)
- **Build output directory**: `.`

### Step 4: Environment Variables (if needed)

If your app uses environment variables (e.g., Supabase keys), add them in the **Environment variables** section:
- Variable name: `VITE_SUPABASE_URL` (or your variable name)
- Value: Your actual value

### Step 5: Deploy

Click **Save and Deploy**. Cloudflare will:
1. Clone your repository
2. Install dependencies (if `package.json` exists)
3. Run the build command
4. Deploy your site

### Step 6: Custom Domain (Optional)

1. After deployment, click on your project
2. Go to **Custom domains**
3. Click **Set up a custom domain**
4. Enter your domain name
5. Follow the DNS configuration instructions

## Method 2: Deploy via Wrangler CLI

### Step 1: Install Wrangler

```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare

```bash
wrangler login
```

### Step 3: Deploy

```bash
# Deploy from root directory
wrangler pages deploy . --project-name=pi-game

# Or deploy from dist directory (after building)
npm run build
wrangler pages deploy dist --project-name=pi-game
```

## Configuration Files

The following files have been created to help with deployment:

- **`_redirects`**: Handles SPA routing (redirects all routes to `index.html`)
- **`_headers`**: Sets HTTP headers for caching and service worker configuration
- **`wrangler.toml`**: Wrangler CLI configuration (for CLI deployments)

## Post-Deployment Checklist

- [ ] Verify the site loads correctly
- [ ] Test all game modes (Classic, Reveal, Training)
- [ ] Verify service worker works (PWA functionality)
- [ ] Test on mobile devices
- [ ] Check that Supabase integration works (if using global leaderboards)
- [ ] Verify custom domain (if configured)

## Troubleshooting

### Service Worker Not Working

If the service worker doesn't register:
- Ensure `sw.js` is accessible at the root
- Check browser console for errors
- Verify `_redirects` file is deployed

### Build Fails

If the build command fails:
- Check that all dependencies are in `package.json`
- Ensure Node.js version is compatible (check `package.json` for `engines` field)
- Review build logs in Cloudflare dashboard

### Assets Not Loading

If assets (CSS, JS) don't load:
- Check file paths (should be relative, not absolute)
- Verify `_redirects` file includes proper routing
- Check browser console for 404 errors

## Continuous Deployment

Cloudflare Pages automatically deploys on every push to your main branch. You can also:
- Set up preview deployments for pull requests
- Configure branch deployments for staging environments
- Set up custom build commands per branch

## Support

For more information, see:
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
