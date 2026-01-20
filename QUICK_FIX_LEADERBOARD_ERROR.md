# Quick Fix: "guest_name column not found" Error

## The Problem
You're getting this error:
```
Could not find the 'guest_name' column of 'endurance_records' in the schema cache
```

This means the database tables exist, but they don't have the `guest_name` column needed for anonymous submissions.

## The Solution (2 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project: https://app.supabase.com
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run the Migration
1. Open the file `database/schema_anonymous.sql` from this project
2. **Copy the ENTIRE contents** of that file
3. **Paste** into the SQL Editor in Supabase
4. Click **Run** (or press Ctrl+Enter / Cmd+Enter)
5. Wait for "Success. No rows returned" message

### Step 3: Verify It Worked
1. Go to **Table Editor** in Supabase
2. Click on `endurance_records` table
3. Look at the columns - you should see `guest_name` listed
4. Do the same for `speed_records` table

### Step 4: Test Again
1. Refresh your game in the browser
2. Play a game and submit a score
3. The error should be gone!

## What This Migration Does

The `schema_anonymous.sql` file:
- Makes `user_id` nullable (so anonymous users can submit)
- Adds `guest_name` column to both tables
- Updates RLS policies to allow anonymous inserts
- Updates the views to include guest names

## Still Getting Errors?

If you still get errors after running the migration:
1. Make sure you ran BOTH files:
   - First: `database/schema.sql` (creates the tables)
   - Second: `database/schema_anonymous.sql` (adds anonymous support)
2. Check the SQL Editor for any error messages
3. Try refreshing your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
