# Finding Your Supabase API Credentials

## Quick Visual Guide

### Step 1: Open Settings
1. Log into your Supabase project at https://supabase.com
2. Select your project from the dashboard
3. Look at the **left sidebar** - scroll down to find **Settings** (⚙️ gear icon)

### Step 2: Go to API Settings
1. Click on **Settings**
2. In the submenu, click on **API**
3. You'll see tabs at the top - make sure you're on the **"API Keys"** tab
   - **API Keys** tab = ✅ This is what you need!
   - **Data API** tab = ❌ This is just documentation, not what you need

### Step 3: Find Your Credentials

**Important**: Make sure you're on the **"API Keys"** tab, NOT the "Data API" tab!

You'll see a page that looks like this:

```
┌─────────────────────────────────────┐
│  Project URL                         │
│  https://xxxxx.supabase.co           │
│  [Copy]                               │
├─────────────────────────────────────┤
│  API Keys                            │
│                                      │
│  Publishable key                     │
│  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9│
│  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9│
│  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9│
│  ... (very long string)              │
│  [Copy]  ← USE THIS ONE!              │
│                                      │
│  Secret keys                         │
│  service_role                        │
│  [Don't use this one!]               │
└─────────────────────────────────────┘
```

## What You Need

### 1. Project URL
- **Location**: Can be in several places:
  - **Option 1**: At the top of the API Keys page, labeled "Project URL" or "URL"
  - **Option 2**: In the "Config" section on the API Keys page
  - **Option 3**: On your project dashboard homepage (top right, or in project settings)
  - **Option 4**: In Settings → General → "Reference ID" or "Project URL"
- **Looks like**: `https://abcdefghijklmnop.supabase.co`
- **Copy**: The entire URL including `https://`
- **Alternative**: If you can't find it, you can also find it in your project's dashboard URL - it's the part after `https://app.supabase.com/project/`

### 2. Publishable key (this is your "anon public" key)
- **Location**: In the "API Keys" section, labeled **"Publishable key"**
- **Note**: This is the same as "anon public" - Supabase just calls it "publishable key" in the UI
- **Looks like**: A very long string starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Copy**: The entire key (it's very long, make sure you get it all)
- **Important**: This is the one you want! It's safe for client-side use.
- **DO NOT use** anything from the "Secret keys" section!

## What NOT to Use

- **Secret keys section**: Do NOT use anything from here!
  - **service_role key**: This is secret and should NEVER be used in frontend code
  - Any other keys in the "Secret keys" section are also secret
- **Only use the "Publishable key"** from the API Keys section

## Common Issues

### "I don't see 'anon public'"
- Look for **"Publishable key"** - this is the same thing! (Supabase calls it "publishable key" in the UI)
- Make sure you're in **Settings → API → API Keys tab**, not the "Data API" tab
- The key might be collapsed - click to expand it
- Make sure you're looking at "Publishable key" NOT "Secret keys"

### "The key is very long"
- Yes! That's correct. The anon key is typically 200+ characters
- Make sure you copy the entire key
- It should start with `eyJ` and end with a long string

### "I see multiple keys"
- Use the one labeled **"Publishable key"** (this is your anon public key)
- **DO NOT use** anything from the **"Secret keys"** section
- The "Secret keys" section is for backend/server use only

## Where to Put Them

Once you have both values, open `supabase.js` and replace:

```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

With your actual values:

```javascript
const SUPABASE_URL = 'https://abcdefghijklmnop.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI5MCwiZXhwIjoxOTU0NTQzMjkwfQ.abcdefghijklmnopqrstuvwxyz1234567890';
```

## Still Can't Find It?

### Can't find Project URL?
1. **Check your project dashboard**: The URL might be shown at the top of your project page
2. **Check Settings → General**: Look for "Reference ID" or "Project URL"
3. **Alternative method**: 
   - Look at your browser's address bar when you're in your Supabase project
   - The URL will be something like: `https://app.supabase.com/project/abcdefghijklmnop`
   - Your Project URL is: `https://abcdefghijklmnop.supabase.co` (replace the part after `/project/` with `.supabase.co`)
4. **Check the API page again**: Sometimes it's in a "Config" section or at the very top

### Can't find Publishable key?
1. Make sure you're on the **"API Keys"** tab (not "Data API")
2. Scroll down - it might be below the Project URL
3. Look for a section labeled "API Keys" with "Publishable key" inside it
4. The key might be collapsed - click to expand it

### General troubleshooting:
1. Make sure you're logged into the correct Supabase account
2. Make sure you've selected the correct project
3. Try refreshing the page
4. Check that your project is fully created (not still initializing)

## Security Note

The "anon public" key is safe to use in your frontend code because:
- It only works with the permissions you set in Row Level Security (RLS)
- It's designed to be public
- Your database schema already has security policies in place
