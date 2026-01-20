# How to Clear Leaderboard Data (Developer Guide)

This guide shows you how to clear leaderboard data from both Supabase (global database) and localStorage (browser storage).

## Method 1: Clear from Supabase Database

If you're using Supabase for global leaderboards, you can clear the data using SQL commands.

**⚠️ Important**: By default, Row Level Security (RLS) policies block DELETE operations via the REST API. 

**Option 1 (Recommended for Dev Mode)**: Run the `database/allow_delete_policies.sql` migration to enable DELETE operations. This allows the dev mode "Clear Leaderboard" button to work.

**Option 2**: Use SQL Editor to manually delete records (see below).

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New query**

### Step 2: Run SQL Commands

**Clear all endurance records:**
```sql
DELETE FROM public.endurance_records WHERE id IS NOT NULL;
```

**Clear all speed records:**
```sql
DELETE FROM public.speed_records WHERE id IS NOT NULL;
```

**Clear both at once:**
```sql
DELETE FROM public.endurance_records WHERE id IS NOT NULL;
DELETE FROM public.speed_records WHERE id IS NOT NULL;
```

**Note**: Supabase requires a WHERE clause on DELETE operations for safety. The `WHERE id IS NOT NULL` clause matches all records (since all records have an id).

**Clear only anonymous/guest records:**
```sql
-- Clear anonymous endurance records
DELETE FROM public.endurance_records WHERE user_id IS NULL;

-- Clear anonymous speed records
DELETE FROM public.speed_records WHERE user_id IS NULL;
```

**Clear records older than a certain date:**
```sql
-- Clear records older than 30 days
DELETE FROM public.endurance_records 
WHERE created_at < NOW() - INTERVAL '30 days';

DELETE FROM public.speed_records 
WHERE created_at < NOW() - INTERVAL '30 days';
```

### Step 3: Verify
After running the DELETE commands, you can verify the data is cleared:
```sql
SELECT COUNT(*) FROM public.endurance_records;
SELECT COUNT(*) FROM public.speed_records;
```

Both should return `0` if cleared successfully.

---

## Method 2: Clear from Browser localStorage

If you're testing locally or want to clear the browser's cached leaderboard data:

### Option A: Browser Console (Recommended)

1. Open your game in the browser
2. Press `F12` (or `Cmd+Option+I` on Mac) to open Developer Tools
3. Go to the **Console** tab
4. Run these commands:

```javascript
// Clear endurance leaderboard
localStorage.removeItem('piGame_enduranceLeaderboard');

// Clear speed leaderboard
localStorage.removeItem('piGame_speedLeaderboard');

// Clear training mode leaderboards
localStorage.removeItem('piGame_trainingSpeedLeaderboard');
localStorage.removeItem('piGame_trainingEnduranceLeaderboard');

// Clear ALL game data (including scores, lives, etc.)
localStorage.clear();

// Reload the page to see changes
location.reload();
```

### Option B: Browser DevTools Storage Tab

1. Open Developer Tools (`F12`)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Expand **Local Storage** in the left sidebar
4. Click on your site's URL
5. Find and delete these keys:
   - `piGame_enduranceLeaderboard`
   - `piGame_speedLeaderboard`
   - `piGame_trainingSpeedLeaderboard`
   - `piGame_trainingEnduranceLeaderboard`
6. Refresh the page

---

## Method 3: Using Dev Mode (Password Protected)

If you have dev mode enabled in the game:

1. Open the game
2. Access dev mode:
   - Add `?dev=true` to the URL (e.g., `http://localhost:8080?dev=true`)
   - Or press `Ctrl+Shift+D` during gameplay
3. The dev panel will appear on the right side of the screen
4. Click the **"🗑 Clear Leaderboard (Password)"** button
5. Enter the password when prompted (default: `dev123pi`)
6. Confirm the deletion

**Note**: The password is set in `dev-mode.js` in the `promptClearLeaderboards()` function. Change the `correctPassword` variable to your preferred password.

**⚠️ Important**: For the dev mode button to clear Supabase data, you must first run the `database/allow_delete_policies.sql` migration in Supabase SQL Editor. Without this, DELETE operations will fail with a permissions error. The button will still clear localStorage successfully.

---

## Quick Clear Script

You can also create a bookmarklet or run this in the console to clear everything at once:

```javascript
(function() {
    // Clear localStorage
    localStorage.removeItem('piGame_enduranceLeaderboard');
    localStorage.removeItem('piGame_speedLeaderboard');
    localStorage.removeItem('piGame_trainingSpeedLeaderboard');
    localStorage.removeItem('piGame_trainingEnduranceLeaderboard');
    
    // Clear Supabase session (if any)
    localStorage.removeItem('supabase_session');
    
    console.log('✓ Cleared all leaderboard data from localStorage');
    console.log('Note: Supabase data must be cleared separately via SQL Editor');
    
    // Reload page
    if (confirm('Leaderboard data cleared. Reload page?')) {
        location.reload();
    }
})();
```

---

## Important Notes

1. **Supabase Data**: Clearing Supabase data affects ALL users globally. Use with caution in production!

2. **localStorage Data**: Only affects the current browser/device. Each user's browser has its own localStorage.

3. **Backup First**: If you want to keep a backup before clearing:
   ```sql
   -- Create backup tables
   CREATE TABLE endurance_records_backup AS SELECT * FROM endurance_records;
   CREATE TABLE speed_records_backup AS SELECT * FROM speed_records;
   ```

4. **Reset Sequences** (Optional): After clearing, you might want to reset auto-increment IDs:
   ```sql
   -- Reset sequences (if using auto-increment IDs)
   ALTER SEQUENCE endurance_records_id_seq RESTART WITH 1;
   ALTER SEQUENCE speed_records_id_seq RESTART WITH 1;
   ```

---

## Testing After Clearing

After clearing the data:
1. Play a game and submit a score
2. Check the leaderboard to verify it shows only your new score
3. If using Supabase, verify in the SQL Editor:
   ```sql
   SELECT * FROM endurance_records ORDER BY created_at DESC LIMIT 10;
   SELECT * FROM speed_records ORDER BY created_at DESC LIMIT 10;
   ```
