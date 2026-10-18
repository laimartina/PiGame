# π∞ - The Infinite Pi Challenge

A memory game where you challenge yourself to memorize digits of Pi!

## Features

- 🎮 Multiple game modes (Classic, Reveal, Training)
- 🏆 Personal records (Speed & Endurance), stored on your device
- ❤️ Lives system with regeneration
- 📊 Statistics tracking
- 🌌 Beautiful cosmic-themed UI
- 📱 Progressive Web App (PWA)
- 📱 Native Android & iOS apps

## Quick Start

### As Web App
1. Open `index.html` in a browser
2. Or run `start.bat` to start a local server

### As Mobile App

**First Time Setup:**
1. Install Node.js from https://nodejs.org/
2. Run `setup-mobile-apps.bat` (Windows) or follow SETUP_INSTRUCTIONS.md
3. Open in Android Studio or Xcode

**After Setup:**
- Android: `npm run cap:open:android`
- iOS: `npm run cap:open:ios` (Mac only)

## Project Structure

```
PiGame/
├── index.html          # Main HTML file
├── styles.css          # All styles
├── app.js              # Game logic
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
├── pi-digits.js       # Pi digits data (100k)
├── pi-digits-manager.js # Pi digits manager
├── package.json       # Node.js dependencies
├── capacitor.config.json # Capacitor config
├── android/           # Android project (after setup)
├── ios/              # iOS project (after setup)
└── dist/             # Built files for mobile
```

## Documentation

- **SETUP_INSTRUCTIONS.md** - How to set up mobile apps
- **QUICK_START.md** - Quick reference guide
- **BUILD_GUIDE.md** - Complete build instructions
- **README_APP_STORES.md** - Publishing to app stores

## Development

### Web Development
- Edit `index.html`, `styles.css`, `app.js`
- Test in browser
- No build step needed for web

### Mobile Development
After making changes:
```bash
npm run build
npm run cap:sync
```
Then rebuild in Android Studio or Xcode.

## Technologies

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Mobile**: Capacitor
- **PWA**: Service Worker, Web App Manifest
- **Storage**: LocalStorage

## License

MIT
