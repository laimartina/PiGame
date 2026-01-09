# 🚀 Quick Start - Convert to Mobile Apps

## Fastest Path to App Stores

### 1. Install Prerequisites

**Windows (Android only):**
- Install [Node.js](https://nodejs.org/) (LTS version)
- Install [Android Studio](https://developer.android.com/studio)

**Mac (Android + iOS):**
- Install [Node.js](https://nodejs.org/)
- Install [Android Studio](https://developer.android.com/studio)
- Install [Xcode](https://apps.apple.com/app/xcode/id497799835) from App Store

### 2. Install Project Dependencies

```bash
npm install
```

### 3. Build and Initialize

```bash
# Build your web app
npm run build

# Add Android platform
npm run cap:add:android

# Add iOS platform (Mac only)
npm run cap:add:ios
```

### 4. Open in Native IDEs

**Android:**
```bash
npm run cap:open:android
```

**iOS (Mac only):**
```bash
npm run cap:open:ios
```

### 5. Build and Test

**Android:**
- In Android Studio: Build → Build APK(s)
- Install on device or emulator

**iOS:**
- In Xcode: Connect device → Click Play button
- Or use Simulator

### 6. After Making Changes

Every time you update your web app files:

```bash
npm run build
npm run cap:sync
```

Then rebuild in Android Studio or Xcode.

---

**📖 For detailed instructions, see [BUILD_GUIDE.md](BUILD_GUIDE.md)**
