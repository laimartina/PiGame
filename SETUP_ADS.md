# Setting Up Ads for Pi Challenge

This guide will help you integrate real ads into your game using Google AdMob (for mobile) and Google AdSense (for web).

## Overview

The game supports:
- **Banner Ads**: Displayed at the bottom of the screen
- **Rewarded Video Ads**: Players watch to earn 5 lives

## For Web (AdSense)

### Step 1: Create AdSense Account

1. Go to https://www.google.com/adsense/
2. Sign up for an AdSense account
3. Add your website URL
4. Wait for approval (can take a few days)

### Step 2: Get Your Publisher ID

1. Once approved, go to AdSense dashboard
2. Click **Ads** → **By ad unit**
3. Create a new ad unit
4. Copy your **Publisher ID** (starts with `ca-pub-`)

### Step 3: Configure ads.js

1. Open `ads.js`
2. Find the `adUnitIds` object
3. Replace `'ca-pub-XXXXXXXXXXXXXXXX'` with your actual Publisher ID:
   ```javascript
   banner: {
       web: 'ca-pub-YOUR_ACTUAL_PUBLISHER_ID',
       ...
   }
   ```

### Step 4: Get Ad Slot ID

1. In AdSense, create an ad unit
2. Copy the **Ad Slot ID** (the number after your publisher ID)
3. In `ads.js`, find `data-ad-slot` and replace `'YOUR_AD_SLOT_ID'`

## For Mobile Apps (AdMob)

### Step 1: Create AdMob Account

1. Go to https://admob.google.com/
2. Sign in with your Google account
3. Create a new app (or link existing app)

### Step 2: Create Ad Units

1. In AdMob dashboard, go to **Apps** → Your App
2. Click **Ad units** → **Add ad unit**
3. Create:
   - **Banner ad unit** (for Android and iOS separately)
   - **Rewarded video ad unit** (for Android and iOS separately)
4. Copy the Ad Unit IDs (format: `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`)

### Step 3: Install AdMob Plugin

For Capacitor apps, install the AdMob plugin:

```bash
npm install @capacitor-community/admob
npx cap sync
```

### Step 4: Configure ads.js

1. Open `ads.js`
2. Replace the placeholder Ad Unit IDs:
   ```javascript
   adUnitIds: {
       banner: {
           android: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
           ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX'
       },
       rewarded: {
           android: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
           ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX'
       }
   }
   ```

### Step 5: Platform-Specific Setup

#### Android

1. Open `android/app/build.gradle`
2. Add AdMob dependency (if not already there):
   ```gradle
   dependencies {
       implementation 'com.google.android.gms:play-services-ads:22.0.0'
   }
   ```

#### iOS

1. Open `ios/App/App.xcodeproj` in Xcode
2. Add AdMob SDK via CocoaPods or SPM
3. Update `Info.plist` with AdMob App ID

## Testing

### Test Mode

The ad system automatically uses placeholder mode when:
- Ad Unit IDs are not configured (still have `XXXXXXXXXXXXXXXX`)
- Running in development
- Ad network is unavailable

### Test Devices

For AdMob, add your test device ID in `ads.js`:
```javascript
testingDevices: ['YOUR_TEST_DEVICE_ID'],
```

To get your test device ID:
- **Android**: Check Logcat for "To get test ads on this device..."
- **iOS**: Check Xcode console for device ID

## How It Works

### Banner Ads
- Automatically shown at the bottom of the screen
- Appears 2 seconds after game loads
- Stays visible during gameplay

### Rewarded Video Ads
- Triggered when player clicks "Watch Ad" button
- Player must watch the full ad to earn reward
- Rewards: +5 lives

## Current Status

Right now, the game is in **placeholder mode**:
- Banner ad shows "Advertisement" placeholder
- Rewarded ads show a 5-second simulation
- No real ads are displayed

## Next Steps

1. **For Web**: Set up AdSense and add your Publisher ID
2. **For Mobile**: Set up AdMob and add your Ad Unit IDs
3. **Test**: Use test mode to verify ads work
4. **Deploy**: Once working, deploy to production

## Revenue Tips

- **Banner Ads**: Show continuously for steady revenue
- **Rewarded Ads**: Higher revenue per view, better user experience
- **Frequency**: Don't show too many ads (users will leave)
- **Placement**: Banner at bottom is non-intrusive

## Privacy & Compliance

- **GDPR**: May need consent banner for EU users
- **COPPA**: If targeting kids, ensure compliance
- **Privacy Policy**: Must disclose ad usage
- **App Store**: Both stores require ad disclosure

## Troubleshooting

### Ads not showing?
- Check browser console for errors
- Verify Ad Unit IDs are correct
- Check if ad network is available
- Ensure you're not in test mode (if you want real ads)

### AdMob errors?
- Verify plugin is installed: `npm list @capacitor-community/admob`
- Check platform-specific setup
- Verify Ad Unit IDs match your AdMob account

### AdSense not loading?
- Check if your site is approved
- Verify Publisher ID is correct
- Check browser console for AdSense errors
- Ensure site is accessible (not localhost only)

## Support

- [AdMob Documentation](https://developers.google.com/admob)
- [AdSense Help](https://support.google.com/adsense)
- [Capacitor AdMob Plugin](https://github.com/capacitor-community/admob)
