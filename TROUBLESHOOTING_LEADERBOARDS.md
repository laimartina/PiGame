# Troubleshooting Leaderboard Errors

If you're getting errors when saving to leaderboards, here are the most common issues and fixes:

## Common Error Messages

### "relation does not exist" or "table does not exist"
**Problem**: Database tables haven't been created yet.

**Solution**:
1. Go to your Supabase project dashboard
2. Open **SQL Editor**
3. Run `database/schema.sql` (copy and paste, then click Run)
4. Run `database/schema_anonymous.sql` (copy and paste, then click Run)
5. Refresh your game and try again

### "permission denied" or "new row violates row-level security policy"
**Problem**: Row Level Security (RLS) policies are blocking anonymous inserts.

**Solution**:
1. Make sure you ran `database/schema_anonymous.sql` (this updates the RLS policies)
2. Go to **Table Editor** in Supabase
3. Click on `endurance_records` table
4. Go to **Policies** tab
5. Make sure there's a policy that allows INSERT for everyone
6. Repeat for `speed_records` table

### "column 'guest_name' does not exist"
**Problem**: The anonymous support migration hasn't been run.

**Solution**:
1. Go to **SQL Editor** in Supabase
2. Run `database/schema_anonymous.sql`
3. This adds the `guest_name` column needed for anonymous submissions

### "duplicate key value violates unique constraint"
**Problem**: You're trying to insert a duplicate record.

**Solution**: This is actually OK - it means a better record already exists. The code should handle this, but if you see this error, it's not critical.

### "invalid input syntax" or "invalid value"
**Problem**: Data format issue (usually time_ms or digits).

**Solution**: 
- Make sure `time_ms` is a positive integer (milliseconds)
- Make sure `digits` is a positive integer
- Check browser console for the actual values being sent

## How to Check What's Wrong

### Step 1: Check Browser Console
1. Open your game in browser
2. Press F12 (or right-click → Inspect)
3. Go to **Console** tab
4. Try to save a score
5. Look for red error messages
6. Copy the full error message

### Step 2: Check Supabase Logs
1. Go to your Supabase dashboard
2. Click on **Logs** (left sidebar)
3. Look for recent errors
4. Check what the error says

### Step 3: Verify Database Setup
1. Go to **Table Editor** in Supabase
2. Check if these tables exist:
   - `endurance_records`
   - `speed_records`
3. If they don't exist, run `database/schema.sql`

### Step 4: Check RLS Policies
1. Go to **Table Editor** → `endurance_records`
2. Click on **Policies** tab
3. You should see a policy like "Anyone can insert endurance records"
4. If not, run `database/schema_anonymous.sql`

## Quick Fix Checklist

- [ ] Ran `database/schema.sql` in Supabase SQL Editor
- [ ] Ran `database/schema_anonymous.sql` in Supabase SQL Editor
- [ ] Verified tables exist in Table Editor
- [ ] Verified RLS policies allow anonymous inserts
- [ ] Checked browser console for specific error messages
- [ ] Verified Supabase URL and key are correct in `supabase.js`

## Still Having Issues?

1. **Copy the exact error message** from browser console
2. **Check Supabase logs** for server-side errors
3. **Verify your credentials** in `supabase.js` are correct
4. **Test the API directly**: Try visiting `https://[YOUR_PROJECT].supabase.co/rest/v1/endurance_records` in your browser (you should see a JSON response, even if empty)

## Common Solutions by Error Type

| Error | Likely Cause | Solution |
|-------|--------------|----------|
| "relation does not exist" | Tables not created | Run schema.sql |
| "permission denied" | RLS blocking | Run schema_anonymous.sql |
| "column does not exist" | Migration not run | Run schema_anonymous.sql |
| "invalid input" | Bad data format | Check console for values |
| Network error | Wrong URL/key | Verify credentials in supabase.js |
