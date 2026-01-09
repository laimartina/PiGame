# 🚀 Setup Instructions - Convert to Android & iOS Apps

## Prerequisites Required

Before running the setup, you need to install:

### 1. Node.js (Required)
- Download from: https://nodejs.org/
- Choose the **LTS version** (recommended)
- Install it (this will also install npm)
- **Restart your computer** after installation
- Verify installation: Open command prompt and type `node --version`

### 2. Android Studio (For Android Apps)
- Download from: https://developer.android.com/studio
- Install it
- Open Android Studio → SDK Manager
- Install Android SDK Platform 33 or later
- Install Android SDK Build-Tools

### 3. Xcode (For iOS Apps - Mac Only)
- Download from Mac App Store
- Install Command Line Tools: Open Terminal and run:
  ```bash
  xcode-select --install
  ```

## Quick Setup (Windows)

1. **Install Node.js** (if not already installed)
   - Go to https://nodejs.org/
   - Download and install LTS version
   - Restart your computer

2. **Run the setup script**
   - Double-click `setup-mobile-apps.bat`
   - Or open Command Prompt in this folder and run:
     ```
     setup-mobile-apps.bat
     ```

3. **Wait for setup to complete**
   - The script will:
     - Install dependencies
     - Build your web app
     - Create Android project
     - Sync everything

4. **Open in Android Studio**
   - Install Android Studio if you haven't
   - Run: `npm run cap:open:android`
   - Or manually open the `android` folder in Android Studio

## Manual Setup (If Script Doesn't Work)

Open Command Prompt or PowerShell in this folder and run:

```bash
# 1. Install dependencies
npm install

# 2. Build web app
npm run build

# 3. Add Android platform
npm run cap:add:android

# 4. Add iOS platform (Mac only)
npm run cap:add:ios

# 5. Sync to native projects
npm run cap:sync
```

## After Setup

### For Android:
```bash
npm run cap:open:android
```
Then in Android Studio:
- Wait for Gradle sync
- Build → Build APK(s) (for testing)
- Build → Generate Signed Bundle (for Play Store)

### For iOS (Mac only):
```bash
npm run cap:open:ios
```
Then in Xcode:
- Select your team in Signing & Capabilities
- Connect device or use Simulator
- Product → Archive → Distribute App

## Making Changes

After you edit your web app files (index.html, app.js, styles.css, etc.):

```bash
npm run build
npm run cap:sync
```

Then rebuild in Android Studio or Xcode.

## Troubleshooting

### "node is not recognized"
- Node.js is not installed or not in PATH
- Install Node.js from nodejs.org
- Restart your computer
- Restart your terminal/command prompt

### "npm is not recognized"
- Same as above - install Node.js

### "Android Studio not found"
- Install Android Studio
- Make sure it's in your PATH or use full path

### Build errors
- Make sure all prerequisites are installed
- Check BUILD_GUIDE.md for detailed troubleshooting

## Next Steps

1. ✅ Install Node.js
2. ✅ Run setup-mobile-apps.bat
3. ✅ Install Android Studio (for Android)
4. ✅ Install Xcode (for iOS, Mac only)
5. ✅ Open projects and build!

For detailed instructions, see:
- **QUICK_START.md** - Fast reference
- **BUILD_GUIDE.md** - Complete guide
- **README_APP_STORES.md** - Publishing guide
