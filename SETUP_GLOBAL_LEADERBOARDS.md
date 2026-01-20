# Setting Up Global Leaderboards

This guide will help you set up Supabase to enable global leaderboards so players can compete with each other worldwide.

## Prerequisites

1. A Supabase account (free tier is sufficient)
   - Sign up at https://supabase.com

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in:
   - **Name**: PiGame (or any name you prefer)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait 2-3 minutes for the project to be created

## Step 2: Set Up the Database

1. In your Supabase project dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open `database/schema.sql` from this project
4. Copy the entire contents and paste into the SQL Editor
5. Click **Run** (or press Ctrl+Enter)
6. Wait for "Success. No rows returned"

7. Now run the anonymous support migration:
   - Open `database/schema_anonymous.sql`
   - Copy and paste into SQL Editor
   - Click **Run**

## Step 3: Get Your API Credentials

> **📖 Need more help?** See `FINDING_SUPABASE_CREDENTIALS.md` for a detailed visual guide.

1. In Supabase dashboard, look at the **left sidebar** and click on **Settings** (⚙️ gear icon at the bottom)
2. In the Settings menu, click on **API**
3. You'll see tabs at the top: **"API Keys"** and **"Data API"** (or similar)
   - Click on **"API Keys"** tab (this is the one you want!)
   - The "Data API" tab is for REST API documentation, not what you need
4. On the API Keys page, look for:
   
   **Project URL**:
   - **Where to find it**: 
     - It might be at the top of the API Keys page
     - Or in a "Config" section
     - Or in Settings → General → "Project URL" or "Reference ID"
     - **Alternative**: Check your browser URL when viewing the project - it's `https://[PROJECT_ID].supabase.co` where PROJECT_ID is from your dashboard URL
   - **Looks like**: `https://xxxxx.supabase.co`
   - **Copy**: The entire URL including `https://`
   - **Can't find it?** See `FIND_PROJECT_URL.md` for detailed help
   
   **API Keys** section:
   - You'll see **"Publishable key"** - this is what you need! ✅
   - This is a long string that starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - This is safe to use in client-side code (it's public)
   - Copy this entire key (it's very long - make sure you get it all!)
   
   **Secret keys** section:
   - You'll also see a "Secret keys" section - **DO NOT use anything from here!** ❌
   - The "service_role" key is secret and should NEVER be used in frontend code
   
   **What is "Publishable key"?**
   - This is the same as "anon public" key (Supabase just calls it "publishable key" in the UI)
   - "anon" = anonymous (public access)
   - This key allows your app to read/write data according to your Row Level Security (RLS) policies
   - It's safe to include in your frontend code
   - **Use the "Publishable key", NOT anything from "Secret keys"!**

## Step 4: Configure the Game

1. Open `supabase.js` in your project
2. Find these lines near the top:
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```
3. Replace them with your actual values:
   ```javascript
   const SUPABASE_URL = 'https://xxxxx.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
   ```
4. Save the file

## Step 5: Test It

1. Start your game (run `./start.sh` on Mac or `start.bat` on Windows)
2. Play a game and enter your name when prompted
3. Your score should be saved to the global leaderboard!
4. Check the leaderboard screen - you should see scores from all players

## How It Works

- **Anonymous Players**: Can submit scores using their name (no account needed)
- **Authenticated Players**: Can sign up for accounts to track their progress across devices
- **Global Leaderboards**: All scores are stored in Supabase and visible to everyone
- **Local Backup**: Scores are also saved locally as a backup

## Troubleshooting

### "Supabase not configured" message in console
- Make sure you've updated `supabase.js` with your credentials
- Check that the URL and key are correct (no extra spaces)

### Scores not appearing in leaderboard
- Check browser console for errors
- Verify the database schema was created correctly
- Make sure you ran both `schema.sql` AND `schema_anonymous.sql`

### Database errors
- Check that all tables were created (go to **Table Editor** in Supabase)
- Verify Row Level Security (RLS) policies are enabled
- Check the SQL Editor for any error messages

## Security Notes

- The `anon` key is safe to use in client-side code (it's public)
- Row Level Security (RLS) policies protect your data
- Anonymous submissions are allowed but limited to prevent abuse
- Consider setting up rate limiting in production

## Next Steps (Optional)

1. **Enable Authentication**: Modify the code to require sign-up for better tracking
2. **Add User Profiles**: Let players customize their profiles
3. **Add Social Features**: Friend lists, challenges, etc.
4. **Analytics**: Use Supabase Analytics to track usage

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Check Supabase logs (Dashboard → Logs)
3. Verify your database schema matches the SQL files

Happy coding! 🎮
