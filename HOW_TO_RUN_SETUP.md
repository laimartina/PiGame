# How to Run setup-mobile-apps.bat

If double-clicking doesn't work, here are several ways to run the setup script:

## Method 1: Right-Click and Run (Easiest)

1. **Right-click** on `setup-mobile-apps.bat`
2. Select **"Run as administrator"** (if prompted)
   - OR select **"Open with"** → **"Command Prompt"**

## Method 2: From File Explorer

1. Open File Explorer and navigate to the `PiGame` folder
2. Click in the address bar at the top
3. Type: `cmd` and press Enter
4. This opens Command Prompt in that folder
5. Type: `setup-mobile-apps.bat` and press Enter

## Method 3: From Command Prompt

1. Press **Windows Key + R**
2. Type: `cmd` and press Enter
3. Navigate to your folder:
   ```
   cd C:\Users\raych\Documents\PiGame
   ```
4. Run the script:
   ```
   setup-mobile-apps.bat
   ```

## Method 4: From PowerShell

1. Right-click in the `PiGame` folder
2. Select **"Open in Terminal"** or **"Open PowerShell window here"**
3. Type:
   ```
   .\setup-mobile-apps.bat
   ```
   (Note the `.\` at the beginning)

## Method 5: If Windows Blocks It

If Windows shows a security warning:

1. Right-click `setup-mobile-apps.bat`
2. Select **"Properties"**
3. If you see "Unblock" button, click it
4. Click "OK"
5. Try running it again

## What Should Happen

When you run it successfully, you should see:

```
========================================
Pi Challenge - Mobile App Setup
========================================

[OK] Node.js is installed
v20.11.0
10.2.3

========================================
Step 1: Installing dependencies...
========================================
```

## If It Closes Immediately

**This means Node.js is NOT installed yet!**

The script checks for Node.js first. If it's not found, it shows an error and closes.

**Solution:**
1. Install Node.js from https://nodejs.org/
2. **Restart your computer** (important!)
3. Try running the script again

## If You See "Access Denied"

1. Right-click `setup-mobile-apps.bat`
2. Select **"Run as administrator"**
3. Click "Yes" when Windows asks for permission

## Quick Test

To test if Node.js is installed:

1. Open Command Prompt
2. Type: `node --version`
3. If you see a version number (like `v20.11.0`), Node.js is installed ✅
4. If you see "not recognized", Node.js is NOT installed ❌

## Still Having Issues?

Try this manual approach:

1. Open Command Prompt in the PiGame folder
2. Run these commands one by one:

```bash
npm install
npm run build
npm run cap:add:android
npm run cap:sync
```

This does the same thing as the batch file, but manually.

---

**Remember:** The script requires Node.js to be installed first! If double-clicking doesn't work, it's likely because Node.js isn't installed yet.
