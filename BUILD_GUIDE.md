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
1. Open Xcode: `npm run cap:open:ios`
2. Click on the project in the left sidebar
3. Select your app target
4. Go to "App Icons and Launch Images"
5. Drag your icon images (1024x1024 for App Store)

### Generate Icons:
You can use online tools like:
- [AppIcon.co](https://www.appicon.co/)
- [IconKitchen](https://icon.kitchen/)
- Upload a 1024x1024 PNG and it will generate all sizes

## Step 6: Update App Configuration

### Change App ID (Important!):
Edit `capacitor.config.json` and change:
```json
"appId": "com.yourcompany.pichallenge"
```

Use reverse domain notation (e.g., `com.yourname.pichallenge`)

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
