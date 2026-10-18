# 📱 Building Android & iOS Apps - Complete Guide

This guide will help you convert your Pi Challenge web app into native Android and iOS apps using Capacitor.

## Prerequisites

### For Android:
1. **Java Development Kit (JDK)** - Download JDK 17 or later from [Oracle](https://www.oracle.com/java/technologies/downloads/) or [Adoptium](https://adoptium.net/)
2. **Android Studio** - Download from [developer.android.com](https://developer.android.com/studio)
3. **Android SDK** - Installed via Android Studio
   - Open Android Studio → SDK Manager
   - Install Android SDK Platform 33 or later
   - Install Android SDK Build-Tools

### For iOS (Mac only):
1. **Xcode** - Download from Mac App Store (requires macOS)
2. **Xcode Command Line Tools**:
   ```bash
   xcode-select --install
   ```
3. **CocoaPods** (for iOS dependencies):
   ```bash
   sudo gem install cocoapods
   ```

## Step 1: Install Node.js and npm

If you don't have Node.js:
1. Download from [nodejs.org](https://nodejs.org/) (LTS version recommended)
2. Install it
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

## Step 2: Install Dependencies

Open terminal/command prompt in your project folder and run:

```bash
npm install
```

This will install Capacitor and all required dependencies.

## Step 3: Build Your Web App

```bash
npm run build
```

This copies all your files to the `dist/` folder (which Capacitor will use).

## Step 4: Initialize Capacitor

### First time setup:

```bash
# Add Android platform
npm run cap:add:android

# Add iOS platform (Mac only)
npm run cap:add:ios
```

### Sync your web app to native projects:

```bash
npm run cap:sync
```

This command should be run **every time** you make changes to your web app files.

## Step 5: Configure App Icons and Splash Screens

### Android Icons:
1. Open Android Studio: `npm run cap:open:android`
2. Go to `android/app/src/main/res/`
3. Replace icon files in:
   - `mipmap-mdpi/ic_launcher.png` (48x48)
   - `mipmap-hdpi/ic_launcher.png` (72x72)
   - `mipmap-xhdpi/ic_launcher.png` (96x96)
   - `mipmap-xxhdpi/ic_launcher.png` (144x144)
   - `mipmap-xxxhdpi/ic_launcher.png` (192x192)

### iOS Icons:

**Step 1: Open Xcode Project**
```bash
npm run cap:open:ios
```
This will open your iOS project in Xcode.

**Step 2: Navigate to App Icon Settings**
1. In Xcode, look at the **left sidebar** (Project Navigator)
2. Click on the **top-level project** (usually named "App" or "pi-challenge")
   - It's the blue icon at the very top of the file list
   - This opens the project settings in the main editor area

**Step 3: Select Your App Target**
1. In the main editor area, you'll see **TARGETS** listed
2. Click on your app target (usually "App" or matches your app name)
   - It's under the "TARGETS" section, not "PROJECT"

**Step 4: Find App Icons Section**
1. Click on the **"General"** tab at the top of the target settings
2. Scroll down to find **"App Icons and Launch Screen"** section
   - You'll see "App Icon" with a small icon/image or "AppIcon" text next to it

**Step 5: Open AppIcon Asset Catalog (IMPORTANT)**
The "App Icons and Launch Screen" section doesn't have a drag area - you need to open the asset catalog:

**Method 1 - Click the AppIcon Image:**
1. In the **"App Icons and Launch Screen"** section, look for the small icon/image next to "App Icon"
2. **Click directly on that small icon/image** (not the text "App Icon")
   - This will open the AppIcon asset catalog editor in the main editor area
   - You'll see a grid of icon slots

**Method 2 - Use Left Sidebar (Easier):**
1. In the **left sidebar** (Project Navigator), look for **"Assets"** or **"Assets.xcassets"**
2. Click the arrow to expand it
3. Click on **"AppIcon"** 
   - The main editor area will now show the AppIcon grid with all icon size slots

**Step 6: Add Your 1024x1024 Icon**
1. In the AppIcon editor (main area), you'll see a grid showing different icon sizes
2. Find the **"App Store"** or **"1024pt"** slot - it's usually at the top or bottom
3. **Drag and drop** your `app-icon-1024.png` file from Finder into the **1024pt** slot
   - You can also click the slot and select your file from the file picker
4. Xcode will automatically generate all other required sizes from your 1024x1024 icon

**Visual Guide:**
- The AppIcon editor shows slots like: 20pt, 29pt, 40pt, 60pt, 76pt, 83.5pt, 1024pt (App Store)
- You only need to fill the **1024pt (App Store)** slot
- All other sizes will be auto-generated

**Important Notes:**
- The icon must be **1024x1024 pixels**
- **No transparency** (solid background)
- **No rounded corners** (iOS adds them automatically)
- **PNG format** (not SVG)
- Xcode will automatically generate all required sizes from your 1024x1024 icon

### Generate Icons:
You can use online tools like:
- [AppIcon.co](https://www.appicon.co/)
- [IconKitchen](https://icon.kitchen/)
- Upload a 1024x1024 PNG and it will generate all sizes

## Step 6: Update App Configuration

### Change App ID (Important!):

**Why is the App ID Important?**

The App ID is a **unique identifier** for your app that:

1. **Identifies your app uniquely** - No two apps can have the same ID in app stores
2. **Required for app stores** - Both Google Play and Apple App Store require a unique app ID
3. **Cannot be changed after publishing** - Once your app is published, you cannot change the app ID without creating a completely new app listing
4. **Used for code signing** - Required for app certificates, provisioning profiles, and security
5. **Prevents conflicts** - Ensures your app doesn't conflict with other apps on users' devices
6. **Used in app updates** - The same ID allows users to update your app instead of installing a new one

**What happens if you don't change it?**
- If you use the default `com.pichallenge.app`, someone else might already have it
- Your app might be rejected from app stores
- You'll have conflicts if you publish multiple apps

**How to Set It:**
Edit `capacitor.config.json` and change:
```json
"appId": "com.yourcompany.pichallenge"
```

**Use reverse domain notation:**
- ✅ Good: `com.yourname.pichallenge`
- ✅ Good: `com.yourcompany.pichallenge`  
- ✅ Good: `io.yourdomain.pichallenge`
- ❌ Bad: `pichallenge` (too generic)
- ❌ Bad: `pi-game` (not reverse domain format)

**Examples:**
- If your name is John Smith: `com.johnsmith.pichallenge`
- If you have a company "Acme Games": `com.acmegames.pichallenge`
- If you own "example.com": `com.example.pichallenge`

### Update App Name:
Change `"appName"` in `capacitor.config.json` to your desired app name.

## Step 7: Build for Android

### Option A: Using Android Studio (Recommended)

1. Open Android project:
   ```bash
   npm run cap:open:android
   ```

2. In Android Studio:
   - Wait for Gradle sync to complete
   - Click "Build" → "Build Bundle(s) / APK(s)" → "Build APK(s)" (for testing)
   - Or "Build" → "Generate Signed Bundle / APK" (for Play Store)

3. For Play Store release:
   - Select "Android App Bundle"
   - Create a keystore (if you don't have one):
     - Build → Generate Signed Bundle / APK
     - Create new keystore
     - Fill in details and save securely
   - Select your keystore and sign the bundle

### Option B: Using Command Line

```bash
cd android
./gradlew assembleRelease
```

APK will be in `android/app/build/outputs/apk/release/`

## Step 8: Build for iOS

### Prerequisites:
- Must be on macOS
- Xcode installed
- Apple Developer account ($99/year)

### Steps:

1. Open iOS project:
   ```bash
   npm run cap:open:ios
   ```

2. In Xcode:
   - Select your project in the left sidebar
   - Go to "Signing & Capabilities"
   - Select your Team (Apple Developer account)
   - Xcode will automatically manage provisioning

3. Build for device:
   - Connect iPhone/iPad
   - Select your device from the device dropdown
   - Click the Play button (▶️) or press Cmd+R

4. Build for App Store:
   - Product → Archive
   - Once archived, click "Distribute App"
   - Choose "App Store Connect"
   - Follow the wizard

## Step 9: Update App Store Listings

### Google Play Store:
1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app
3. Fill in:
   - App name: "Pi Challenge" (or your name)
   - Short description
   - Full description
   - Screenshots (at least 2)
   - Feature graphic (1024x500)
   - App icon (512x512)
   - Privacy policy URL (required)
   - Content rating questionnaire

### Apple App Store:
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create new app
3. Fill in:
   - App name
   - Subtitle
   - Description
   - Keywords
   - Screenshots (various device sizes)
   - App icon (1024x1024)
   - Privacy policy URL
   - Support URL

## Step 10: Testing

### Android:
- Install APK on device: `adb install app-release.apk`
- Or use Android Studio's device emulator

### iOS:
- Test on physical device (free)
- Or use Xcode Simulator
- For TestFlight (beta testing):
  - Upload build to App Store Connect
  - Add testers in TestFlight section

## Important Notes

### After Making Web Changes:
Always run these commands after updating your web app:
```bash
npm run build
npm run cap:sync
```

### Version Updates:
When updating your app version:
1. Update version in `package.json`
2. Update version in:
   - Android: `android/app/build.gradle` (versionCode, versionName)
   - iOS: `ios/App/App.xcodeproj/project.pbxproj` (CFBundleShortVersionString, CFBundleVersion)

### App Icons:
- Android: Need multiple sizes (see Step 5)
- iOS: Need 1024x1024 for App Store, Xcode can generate others

### Splash Screen:
- Configured in `capacitor.config.json`
- Customize in native projects if needed

## Troubleshooting

### Android:

#### Gradle Error: "Unable to find method 'module(java.lang.Object)'"

This error usually means:
- Corrupt Gradle cache
- Corrupt Gradle daemon
- Plugin incompatibility

**Solution 1: Clean Gradle Cache (Try this first)**
1. Close Android Studio completely
2. Open Terminal/Command Prompt in your project folder
3. Run these commands:
   ```bash
   cd android
   ./gradlew clean
   ./gradlew --stop
   ```
   (On Windows, use `gradlew.bat` instead of `./gradlew`)

4. Delete Gradle cache:
   ```bash
   # macOS/Linux:
   rm -rf ~/.gradle/caches/
   
   # Windows:
   # Delete folder: C:\Users\YourName\.gradle\caches\
   ```

5. Reopen Android Studio and try syncing again

**Solution 2: Stop All Gradle Daemons**
1. In Android Studio: **File → Invalidate Caches / Restart**
2. Select **"Invalidate and Restart"**
3. Wait for Android Studio to restart
4. Try syncing again

**Solution 3: Update Gradle (If above doesn't work)**
1. In Android Studio, go to: **File → Settings → Build, Execution, Deployment → Build Tools → Gradle**
2. Check "Use Gradle from: 'gradle-wrapper.properties' file"
3. Or try updating to the latest Gradle version
4. Click "Apply" and sync again

**Solution 4: Clean and Rebuild**
1. In Android Studio: **Build → Clean Project**
2. Wait for it to complete
3. Then: **Build → Rebuild Project**

**Solution 5: Check Java Version**
Make sure you have JDK 17 or later:
```bash
java -version
```
If not, install JDK 17+ from [Adoptium](https://adoptium.net/)

- **Gradle sync failed**: Update Android Studio and SDK
- **Build errors**: Check Java version (need JDK 17+)
- **APK too large**: Enable ProGuard in `android/app/build.gradle`

### iOS:
- **Code signing errors**: Check Apple Developer account
- **Build fails**: Clean build folder (Cmd+Shift+K)
- **Pod install errors**: Run `cd ios && pod install`

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Build web app
npm run build

# Sync to native projects
npm run cap:sync

# Open Android Studio
npm run cap:open:android

# Open Xcode (Mac only)
npm run cap:open:ios
```

## Next Steps

1. ✅ Set up your app icons
2. ✅ Test on physical devices
3. ✅ Prepare store listings (screenshots, descriptions)
4. ✅ Set up privacy policy (required for both stores)
5. ✅ Submit to stores!

Good luck with your app! 🚀
