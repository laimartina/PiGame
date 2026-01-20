# Fix: Speed Records Not Showing

## The Problem
Speed records aren't appearing in the leaderboard even though scores are being saved.

## The Solution

### Step 1: Update Database Policies (Required)
The database needs to allow anonymous users to update speed records.

1. Go to your Supabase project → **SQL Editor**
2. Run this SQL:

```sql
-- Allow anonymous users to update speed records
DROP POLICY IF EXISTS "Users can update own speed records" ON public.speed_records;
CREATE POLICY "Anyone can update speed records" 
    ON public.speed_records FOR UPDATE 
    USING (true);
```

3. Click **Run**

### Step 2: Test Again
1. Refresh your game
2. Play a game and submit a score
3. Check the browser console - you should see:
   - `✓ Speed record saved for X digits`
   - `✓ Saved/updated X speed record(s)`
4. Go to the Speed leaderboard tab
5. Select a digit range (e.g., "10-19")
6. Your speed records should appear!

## How Speed Records Work

Speed records track the **fastest time** to reach specific digit milestones:
- 10 digits
- 20 digits
- 50 digits
- 100 digits
- 200 digits
- 500 digits
- 1000 digits

When you submit a score:
- If you reach a milestone (e.g., 25 digits = you reached 20 digits milestone)
- The system saves/updates your time for that milestone
- Only your **best time** is kept (if you play again and get a slower time, it won't update)

## Troubleshooting

### Still no speed records?
1. **Check browser console** for error messages
2. **Check Supabase logs** (Dashboard → Logs)
3. **Verify you reached a milestone**: You need at least 10 digits to have speed records
4. **Check the digit filter**: Make sure you're viewing the correct range (e.g., if you got 25 digits, check "20-49" range)

### Speed records saved but not showing?
1. Make sure you're on the **Speed** tab (not Endurance)
2. Select the correct digit range filter
3. Try refreshing the leaderboard page
