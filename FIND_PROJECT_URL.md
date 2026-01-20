# Finding Your Supabase Project URL

If you can't find the Project URL in the API Keys page, here are several ways to find it:

## Method 1: From Your Project Dashboard

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project
3. Look at the **top of the page** - the Project URL might be displayed there
4. Or check the **top right corner** - sometimes it shows there

## Method 2: From Settings → General

1. Go to **Settings** (gear icon in left sidebar)
2. Click on **General** (not API)
3. Look for:
   - **"Reference ID"** - this is your project ID
   - **"Project URL"** - this is what you need
   - If you only see Reference ID, your Project URL is: `https://[REFERENCE_ID].supabase.co`

## Method 3: From Your Browser URL

1. When you're viewing your Supabase project, look at your browser's address bar
2. The URL will look like: `https://app.supabase.com/project/abcdefghijklmnop`
3. The part after `/project/` is your project reference ID
4. Your Project URL is: `https://abcdefghijklmnop.supabase.co`
   - Replace `abcdefghijklmnop` with your actual project ID from the URL

## Method 4: From API Page Config Section

1. Go to **Settings → API → API Keys** tab
2. Look for a section labeled **"Config"** or **"Configuration"**
3. The Project URL might be listed there

## Method 5: Check the Data API Tab

1. Go to **Settings → API**
2. Click on the **"Data API"** tab (not API Keys)
3. At the top, you might see example API calls that include your Project URL
4. It will be in the format: `https://xxxxx.supabase.co/rest/v1/...`

## What It Looks Like

Your Project URL will be in this format:
```
https://abcdefghijklmnop.supabase.co
```

Where `abcdefghijklmnop` is your unique project reference ID (usually 20 characters).

## Quick Test

Once you have it, you can test if it's correct:
- Try visiting: `https://[YOUR_PROJECT_ID].supabase.co/rest/v1/`
- If you see a JSON response (even an error), the URL is correct!

## Still Stuck?

If you still can't find it:
1. Make sure your project is fully created (not still initializing)
2. Try logging out and back in
3. Check that you're in the correct project (you might have multiple projects)
