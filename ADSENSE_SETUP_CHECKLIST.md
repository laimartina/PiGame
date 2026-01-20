# AdSense Setup Checklist

## Current Status
You only see: Earnings, Report, Payment, Account

This means your site hasn't been added to AdSense yet.

## What to Do

### ✅ Step 1: Add Your Site

1. In AdSense, look for **Sites** (might be under Account or at the bottom of the menu)
2. Or try this direct link: https://www.google.com/adsense/app#sites
3. Click **+ Add site** or **Add website**
4. Enter your URL:
   - For testing: `localhost:8080` (won't work for real ads, but you can test)
   - For production: Your actual domain (e.g., `yourgame.com`)

### ✅ Step 2: Wait for Approval

- AdSense reviews sites (usually 1-7 days)
- You'll get an email when approved
- Check the **Sites** section to see status

### ✅ Step 3: After Approval

Once approved, you'll see:
- **Ads** section appears in the left menu
- **Sites** section shows your site as "Ready"

Then you can:
1. Click **Ads** → **By site**
2. Select your site
3. Enable **Auto ads**
4. Ads will automatically appear on your site

## Testing Locally

**Important**: AdSense won't show real ads on `localhost`. You need to:
- Deploy your game to a real domain, OR
- Use a service like ngrok to create a public URL for testing

## Your Current Configuration

Your game is already set up with:
- Publisher ID: `pub-7515048306007823`
- Auto Ads format (no slot ID needed)

Once your site is approved and Auto Ads are enabled, ads should appear automatically!
