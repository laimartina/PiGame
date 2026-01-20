# How to Deploy Your Pi Game for Free

You need to host your game online so AdSense can approve it and show ads. Here are the best free options:

## Option 1: GitHub Pages (Recommended - Completely Free!)

**Yes, GitHub Pages is 100% free!** ✅

### What You Get for Free:
- ✅ Unlimited hosting
- ✅ Free HTTPS (secure connection)
- ✅ Free custom domain support (optional)
- ✅ No bandwidth limits
- ✅ No time limits
- ✅ Works forever (as long as your repo is public)

### Step 1: Create a GitHub Account
1. Go to https://github.com/
2. Sign up for a free account (completely free, no credit card needed)

### Step 2: Create a Repository
1. Click the **+** icon in the top right → **New repository**
2. Name it (e.g., `pi-game`)
3. Make it **Public** (required for free GitHub Pages - private repos require paid plan)
4. **Don't** check "Initialize with README" (we'll upload files manually)
5. Click **Create repository**

### Step 3: Upload Your Game
1. In your new repository, click **uploading an existing file** (or drag & drop area)
2. Drag and drop all your game files:
   - `index.html`
   - `app.js`
   - `styles.css`
   - `ads.js`
   - `supabase.js`
   - `manifest.json`
   - All other game files
   - **Don't upload**: `node_modules`, `.git` folder, or `start.sh`/`start.bat`
3. Scroll down and click **Commit changes**

### Step 4: Enable GitHub Pages
1. Go to your repository **Settings** (top menu)
2. Scroll down to **Pages** in the left sidebar
3. Under **Source**, select **Deploy from a branch**
4. Choose **main** (or **master**) branch
5. Select **/ (root)** folder
6. Click **Save**

### Step 5: Access Your Game
- Your game will be at: `https://YOUR_USERNAME.github.io/pi-game/`
- Replace `YOUR_USERNAME` with your GitHub username
- Replace `pi-game` with your repository name
- It may take 1-5 minutes to go live (GitHub needs to build it)

### Example:
If your username is `martina` and repo is `pi-game`:
- URL: `https://martina.github.io/pi-game/`

### Updating Your Game:
1. Go to your repository
2. Click on the file you want to edit
3. Click the pencil icon (✏️)
4. Make changes
5. Click **Commit changes**
6. Your site updates automatically (may take a minute)

---

## Option 2: Netlify (Very Easy - Drag & Drop or Auto-Deploy)

### Step 1: Create Account
1. Go to https://www.netlify.com/
2. Sign up with GitHub, Google, or email

### Step 2: Deploy (Choose One Method)

#### Method A: Drag & Drop (Quick Start)
1. Log in to Netlify
2. Drag and drop your entire game folder onto the Netlify dashboard
3. Wait for deployment (usually 30 seconds)
4. Your game gets a URL like: `https://random-name-123.netlify.app`

**Note**: With drag & drop, you'll need to manually redeploy when you make changes.

#### Method B: Connect to GitHub (Recommended - Auto-Deploy!)
1. Log in to Netlify
2. Click **Add new site** → **Import an existing project**
3. Choose **GitHub** and authorize Netlify
4. Select your repository
5. Configure build settings:
   - **Build command**: Leave empty (no build needed for static site)
   - **Publish directory**: `/` (root folder)
6. Click **Deploy site**
7. Your game gets a URL like: `https://random-name-123.netlify.app`

**✅ Automatic Deployments**: Once connected to GitHub, Netlify will automatically:
- Detect when you push changes to your repository
- Redeploy your site automatically (usually takes 30-60 seconds)
- Show you a preview of the deployment before it goes live

### Step 3: Custom Domain (Optional)
- You can change the name in **Site settings** → **Change site name**

---

## Option 3: Vercel (Also Very Easy)

### Step 1: Create Account
1. Go to https://vercel.com/
2. Sign up with GitHub

### Step 2: Deploy
1. Click **Add New Project**
2. Import your GitHub repository (or drag & drop)
3. Click **Deploy**
4. Your game gets a URL like: `https://pi-game.vercel.app`

---

## Option 4: Cloudflare Pages (Fast & Free)

### Step 1: Create Account
1. Go to https://pages.cloudflare.com/
2. Sign up for free

### Step 2: Deploy
1. Connect your GitHub repository, OR
2. Upload files directly
3. Your game gets a URL like: `https://pi-game.pages.dev`

---

## Which One Should You Choose?

- **GitHub Pages**: Best if you want to use Git for version control
- **Netlify**: Easiest drag-and-drop deployment
- **Vercel**: Great if you already use GitHub
- **Cloudflare Pages**: Fastest loading times

**Recommendation**: Start with **Netlify** (easiest) or **GitHub Pages** (most popular).

---

## After Deployment

1. **Add your site to AdSense**:
   - Use your new URL (e.g., `https://yourgame.netlify.app`)
   - Go to AdSense → Sites → Add site

2. **Update your game** (if needed):
   - **GitHub Pages**: Push new files to your repository → updates automatically
   - **Netlify (connected to GitHub)**: Push to GitHub → Netlify auto-deploys (30-60 seconds)
   - **Netlify (drag & drop)**: Drag & drop again, or connect to GitHub for auto-deploy
   - **Vercel**: Push to GitHub → Vercel auto-deploys

3. **Wait for AdSense approval** (1-7 days)

---

## Important Notes

- **Make sure your site is public** (not password-protected)
- **Use HTTPS** (all these services provide it automatically)
- **Test your game** on the live URL to make sure everything works
- **Update any localhost URLs** in your code if you have any hardcoded
