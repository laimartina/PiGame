# How to Set Up AdSense Ads

## ⚠️ Important: Your Site Must Be Added First

If you only see **Earnings**, **Report**, **Payment**, and **Account** in your AdSense dashboard, it means:
- Your site hasn't been added to AdSense yet, OR
- Your site is pending approval

## Step 1: Add Your Site to AdSense

1. In AdSense dashboard, look for **Sites** in the left menu (it might be under **Account** or at the bottom)
2. If you don't see "Sites", try:
   - Click **Account** → look for **Sites** or **Website**
   - Or go directly to: https://www.google.com/adsense/app#sites
3. Click **+ Add site** or **Add website**
4. Enter your website URL (e.g., `localhost:8080` for testing, or your actual domain)
5. Click **Add**

## Step 2: Wait for Approval

- AdSense will review your site (usually 1-7 days)
- You'll get an email when approved
- **Until approved, you won't see the "Ads" section**

## Step 3: After Approval - Enable Auto Ads

Once your site is approved:
1. You'll see **Ads** appear in the left menu
2. Click **Ads** → **By site**
3. Select your site
4. Enable **Auto ads**
5. Choose **Display ads**

## Current Setup

Your game is already configured with your publisher ID. Once your site is approved and Auto Ads are enabled, ads should appear automatically. You don't need to create an ad unit for basic ads.

---

## Option 2: Create an Ad Unit (More Control)

To show ads in your game, you need to create an **ad unit** in AdSense and get the **slot ID**.

## Step 1: Go to AdSense Dashboard

1. Visit https://www.google.com/adsense/
2. Sign in to your account
3. Make sure your site is approved (this can take a few days)

## Step 2: Create an Ad Unit

The AdSense interface may vary, but here are the common ways to find it:

### Finding Ad Unit Creation

The AdSense interface varies. Try these steps:

1. **Click "Ads" in the left sidebar**
2. **Look for any of these:**
   - A tab that says **"By ad unit"** or **"Ad units"**
   - A section called **"Display ads"**
   - A button with a **+** icon
   - A link that says **"Create"** or **"New"**

3. **If you see a list of ad types:**
   - Click on **"Display ads"** (this is the most common)
   - Then look for a **+** button or **"New ad unit"** button

4. **Alternative locations:**
   - Try clicking **"By site"** → select your site → look for ad unit options
   - Check if there's a **"Get code"** or **"Code"** section that lets you create units

5. **If you still can't find it:**
   - Your account might need full approval first
   - Check the **"Sites"** section to see if your site is approved
   - Some accounts show ad unit creation only after the site is fully approved

## Step 3: Configure the Ad Unit

1. **Name**: Give it a name like "Pi Game Banner Ad"
2. **Ad size**: Select **Responsive** (recommended) or **Fixed size** (e.g., 320x50 for mobile)
3. **Ad type**: Select **Display ads**
4. Click **Create**

## Step 4: Get Your Slot ID

After creating the ad unit, you'll see:
- **Ad unit code** - This contains your slot ID
- It will look like: `data-ad-slot="1234567890"`

The number `1234567890` is your **slot ID**.

## Step 5: Add Slot ID to ads.js

1. Open `ads.js`
2. Find the `banner.web` configuration
3. Add your slot ID:

```javascript
banner: {
    web: {
        publisherId: 'pub-7515048306007823', // Your publisher ID
        slotId: '1234567890' // Your ad unit slot ID from Step 4
    },
    ...
}
```

## Troubleshooting

### "No ads showing"
- **Site not approved**: AdSense needs to approve your site first (can take 1-7 days)
- **No slot ID**: Make sure you've created an ad unit and added the slot ID
- **Ad serving**: It can take a few hours for ads to start serving after approval

### "Ad unit not found"
- Double-check your slot ID is correct
- Make sure the ad unit is **active** in your AdSense dashboard

### Testing
- AdSense may show blank ads or test ads during the approval process
- Once approved, real ads should appear within 24-48 hours
