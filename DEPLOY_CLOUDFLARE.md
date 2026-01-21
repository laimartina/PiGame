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

#### Step 2a: Configure Project Settings

After connecting to GitHub, you'll see a form asking for project configuration. Fill in these values:

**⚠️ IMPORTANT: Make sure you're creating a "Pages" project, NOT a "Worker" project**

**Required Fields:**

- **Project name**: `pi-game` (or your preferred name)
- **Production branch**: `main` (or `master`)

**Build Settings:**

- **Build command**: `npm run build`
- **Deploy command**: `npx wrangler pages deploy ./dist --project-name=pi-game --compatibility-date=2024-01-01`

**Note:** The `dist` directory must be explicitly specified in the deploy command. The `wrangler.toml` file should also have `pages_build_output_dir = "dist"` configured (which is already set in your project).

**Advanced Settings / Path:**

- **Root directory**: `/` (or leave empty/default)
- **Path**: (if this field exists, leave empty or set to `/`)

**Note:** If you see "Worker project" mentioned, make sure you're in the **Pages** section, not Workers. Pages projects deploy static sites, Workers are for serverless functions.

### Step 3: Configure Build Settings

Fill in the following fields:

- **Project name**: `pi-game` (or your preferred name)
- **Production branch**: `main`
- **Root directory**: `/` (or leave as default/empty)
- **Build command**: `npm run build` (Optional)
- **Deploy command**: `npx wrangler pages deploy ./dist --project-name=pi-game` (Required)
- **Non-production branch deploy command**: `npx wrangler pages deploy ./dist --project-name=pi-game` (Optional - can leave empty to use same as production)

#### What is "Root directory"?

The **Root directory** field tells Cloudflare Pages where your project files are located in your Git repository.

- **Use `/` or leave empty** if your project files are at the root of your repository (most common case)
- **Use a subdirectory path** if your project is in a subfolder, for example:
  - If your project is in `frontend/` folder: set to `frontend`
  - If your project is in `web/` folder: set to `web`
  - If your project is in `src/` folder: set to `src`

**For this project:** Since all your files (`index.html`, `app.js`, `package.json`, etc.) are at the root of your repository, use `/` or leave it as the default (empty).

#### Deploy Command Details:

**For Production Branch:**
```
npx wrangler pages deploy ./dist --project-name=pi-game
```

**For Non-Production Branches:**
- You can use the same command: `npx wrangler pages deploy ./dist --project-name=pi-game`
- Or leave empty to inherit from production settings

#### Why `dist`?

- Your build command (`npm run build`) outputs files to the `dist/` directory
- The deploy command must deploy from `dist/` to upload the built files
- **DO NOT** use `.` (root) - that would deploy source files, not built files

#### Alternative: Deploy from Root (No Build Step)

If you want to deploy directly from root without building:

- **Build command**: (leave empty)
- **Deploy command**: `npx wrangler pages deploy . --project-name=pi-game`

**Note**: This is only recommended if you're not using a build step and want to deploy source files directly.

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

### Step 6: Configure Non-Production Branches (Optional)

To deploy staging, development, or other non-production branches:

1. After your initial deployment, go to your project in Cloudflare Pages
2. Click on **Settings** → **Builds & deployments**
3. Scroll down to **Build configuration**
4. Click **Add build configuration** or **Edit** next to an existing branch

#### For Staging/Development Branches:

**Example: Staging branch (`staging` or `develop`)**

- **Branch name**: `staging` (or `develop`, `dev`, etc.)
- **Build command**: `npm run build` (or leave empty if deploying root directory)
- **Build output directory**: `dist` (or `.` if deploying root directory)
- **Root directory**: `/` (leave as default)

**Example: Development branch (`development`)**

- **Branch name**: `development`
- **Build command**: (leave empty)
- **Build output directory**: `.`
- **Root directory**: `/`

#### Branch-Specific Paths:

If you want different build commands per branch:

**Production (`main` branch):**
- Build command: `npm run build`
- Build output directory: `dist`

**Staging (`staging` branch):**
- Build command: `npm run build`
- Build output directory: `dist`

**Development (`dev` branch):**
- Build command: (leave empty - no build needed)
- Build output directory: `.`

#### Automatic Branch Deployments:

- Cloudflare Pages automatically creates preview deployments for **all branches** by default
- Each branch gets its own URL: `https://BRANCH-NAME--pi-game.pages.dev`
- Example: `staging` branch → `https://staging--pi-game.pages.dev`
- Example: `dev` branch → `https://dev--pi-game.pages.dev`

#### Disable Branch Deployments (Optional):

If you only want production deployments:
1. Go to **Settings** → **Builds & deployments**
2. Under **Build configuration**, you can disable automatic deployments for specific branches
3. Or use **Deployment triggers** to control when branches deploy

### Step 7: Custom Domain (Optional)

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

**⚠️ IMPORTANT: Use `wrangler pages deploy` NOT `wrangler deploy`**

```bash
# Deploy from root directory (no build step)
npx wrangler pages deploy . --project-name=pi-game

# Or deploy from dist directory (after building)
npm run build
npx wrangler pages deploy ./dist --project-name=pi-game
```

**Common Mistake:**
- ❌ Wrong: `wrangler deploy` (this is for Cloudflare Workers, not Pages)
- ✅ Correct: `wrangler pages deploy` (this is for Cloudflare Pages)

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

### "Failed: error occurred while running deploy command"

If you see this error, there are a few possible causes:

#### Problem 1: Using wrong deploy command

**Problem:** You're using `wrangler deploy` instead of `wrangler pages deploy`

**Solution:**
```bash
# ❌ Wrong command (for Workers):
wrangler deploy

# ✅ Correct command (for Pages):
wrangler pages deploy ./dist --project-name=pi-game
```

#### Problem 2: Deploy command in Dashboard settings

**Problem:** You've set a deploy command in Cloudflare Pages Dashboard settings, but it's deploying from the wrong directory or has authentication issues.

**Solution for Method 1 (Dashboard):**
1. Go to your Cloudflare Pages project
2. Click **Settings** → **Builds & deployments**
3. Scroll to **Build configuration**
4. **Remove/clear the "Deploy command" field** (leave it empty)
5. Cloudflare will automatically deploy the "Build output directory" after the build

**Why:** When using the Dashboard method, Cloudflare Pages automatically deploys your build output. You don't need (and shouldn't use) a deploy command unless you have a specific advanced use case.

#### Problem 3: Authentication error

**Problem:** "Authentication error [code: 10000]" - API token doesn't have Pages permissions

**Solution:**
1. If using a custom API token, ensure it has **Cloudflare Pages** permissions
2. Go to https://dash.cloudflare.com/profile/api-tokens
3. Edit your token and add:
   - **Account** → **Cloudflare Pages** → **Edit** permissions
4. Or use `wrangler login` instead of an API token for CLI deployments

**Note:** The `[assets]` section in `wrangler.toml` is for the deprecated Workers Sites feature. For Cloudflare Pages, you don't need it. Just use `wrangler pages deploy` with the directory path.

## Continuous Deployment

Cloudflare Pages automatically deploys on every push to your main branch. You can also:
- Set up preview deployments for pull requests
- Configure branch deployments for staging environments
- Set up custom build commands per branch

### Branch Deployment URLs

When you push to different branches, Cloudflare Pages creates separate deployments:

- **Production (`main`)**: `https://pi-game.pages.dev`
- **Staging (`staging`)**: `https://staging--pi-game.pages.dev`
- **Development (`dev`)**: `https://dev--pi-game.pages.dev`
- **Feature branches**: `https://feature-name--pi-game.pages.dev`

### Pull Request Previews

Cloudflare Pages automatically creates preview deployments for pull requests:
- Each PR gets a unique preview URL
- Preview URL format: `https://PR-NUMBER--pi-game.pages.dev`
- Previews are automatically deleted when PR is merged or closed

## Support

For more information, see:
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
