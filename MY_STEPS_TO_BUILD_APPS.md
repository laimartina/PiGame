# 📱 My Steps to Build Android & iOS Apps

Follow these steps in order to create your mobile apps.

## ✅ Step 1: Install Node.js (REQUIRED)

**You need to do this:**
1. Go to: https://nodejs.org/
2. Click "Download Node.js (LTS)" - the green button
3. Run the installer (node-vXX.X.X-x64.msi)
4. Click "Next" through the installation
5. **IMPORTANT:** Restart your computer after installation
6. Verify it worked: Open Command Prompt and type:
   ```
   node --version
   ```
   You should see something like: `v20.11.0`

**Status:** ☐ Not started  ☐ In progress  ☐ Completed

---

## ✅ Step 2: Run Setup Script (I can help with this)

**After Node.js is installed:**
1. Open Command Prompt in this folder (PiGame)
2. Double-click `setup-mobile-apps.bat`
   - OR right-click in the folder → "Open in Terminal" → type: `setup-mobile-apps.bat`
3. Wait for it to complete (may take 5-10 minutes)
4. It will:
   - Install dependencies
   - Build your web app
   - Create Android project
   - Sync everything

**Status:** ☐ Not started  ☐ In progress  ☐ Completed

---

## ✅ Step 3: Install Android Studio (For Android Apps)

**You need to do this:**
1. Go to: https://developer.android.com/studio
2. Click "Download Android Studio"
3. Run the installer
4. Follow the installation wizard
5. When it opens:
   - Go to "More Actions" → "SDK Manager"
   - Check "Android SDK Platform 33" (or latest)
   - Check "Android SDK Build-Tools"
   - Click "Apply" and wait for download

**Status:** ☐ Not started  ☐ In progress  ☐ Completed

---

## ✅ Step 4: Open Android Project

**After Android Studio is installed:**
1. Open Command Prompt in this folder (PiGame)
2. Run:
   ```
   npm run cap:open:android
   ```
3. Android Studio should open automatically
4. Wait for "Gradle Sync" to complete (bottom right corner)

**Status:** ☐ Not started  ☐ In progress  ☐ Completed

---

## ✅ Step 5: Build Android App

**In Android Studio:**
1. Wait for Gradle sync to finish (may take a few minutes first time)
2. Click "Build" menu → "Build Bundle(s) / APK(s)" → "Build APK(s)"
3. Wait for build to complete
4. When done, click "locate" in the notification
5. Your APK will be in: `android/app/build/outputs/apk/debug/app-debug.apk`

**For Testing:**
- Install APK on your phone:
  - Transfer `app-debug.apk` to your phone
  - Open it on your phone to install
  - Or use: `adb install app-debug.apk` (if you have ADB set up)

**For Play Store:**
- Build → Generate Signed Bundle / APK
- Select "Android App Bundle"
- Create a keystore (save it securely!)
- Follow the wizard

**Status:** ☐ Not started  ☐ In progress  ☐ Completed

---

## ✅ Step 6: iOS App (Mac Only)

**If you have a Mac:**
1. Install Xcode from Mac App Store (free, but large download)
2. Open Terminal in this folder
3. Run:
   ```
   npm run cap:open:ios
   ```
4. In Xcode:
   - Select your project in left sidebar
   - Go to "Signing & Capabilities"
   - Select your Apple Developer team
   - Connect iPhone/iPad or use Simulator
   - Product → Archive → Distribute App

**Status:** ☐ Not started  ☐ In progress  ☐ Completed

---

## 📝 Quick Reference Commands

After setup is complete, use these commands:

```bash
# Build web app (after making changes)
npm run build

# Sync changes to mobile projects
npm run cap:sync

# Open Android Studio
npm run cap:open:android

# Open Xcode (Mac only)
npm run cap:open:ios
```

---

## 🐛 Troubleshooting

### "node is not recognized"
- Node.js not installed or not in PATH
- Solution: Install Node.js, restart computer, try again

### "npm is not recognized"
- Same as above - Node.js not installed properly
- Solution: Reinstall Node.js, restart computer

### "Gradle sync failed"
- Android Studio needs Android SDK
- Solution: Open SDK Manager, install Android SDK Platform 33+

### "Build failed"
- Check error message in Android Studio
- Usually: Missing SDK, wrong Java version, or network issue
- Solution: See BUILD_GUIDE.md for detailed troubleshooting

---

## 📚 Need More Help?

- **SETUP_INSTRUCTIONS.md** - Detailed setup guide
- **BUILD_GUIDE.md** - Complete build instructions
- **README_APP_STORES.md** - How to publish to stores
- **QUICK_START.md** - Quick reference

---

## ✅ Checklist Summary

- [ ] Step 1: Installed Node.js
- [ ] Step 2: Ran setup-mobile-apps.bat
- [ ] Step 3: Installed Android Studio
- [ ] Step 4: Opened Android project
- [ ] Step 5: Built Android app
- [ ] Step 6: Built iOS app (if Mac)

---

**Last Updated:** Check off each step as you complete it!

Good luck! 🚀
