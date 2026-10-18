# Fix Gradle Error: "Unable to find method 'module(java.lang.Object)'"

This error indicates a corrupt Gradle cache or daemon issue. Follow these steps in order:

## Quick Fix (Try This First)

### Step 1: Stop Gradle Daemons
1. Close Android Studio completely
2. Open Terminal/Command Prompt
3. Navigate to your project:
   ```bash
   cd /Users/martina/Documents/PiGame/android
   ```
4. Stop all Gradle processes:
   ```bash
   # macOS/Linux:
   ./gradlew --stop
   
   # Windows:
   gradlew.bat --stop
   ```

### Step 2: Clean Gradle Cache
```bash
# macOS/Linux:
rm -rf ~/.gradle/caches/

# Windows:
# Delete this folder manually:
# C:\Users\YourName\.gradle\caches\
```

### Step 3: Clean Project
```bash
# Still in the android folder:
./gradlew clean
```

### Step 4: Restart Android Studio
1. Reopen Android Studio
2. Open your project
3. Wait for Gradle sync to complete

## If That Doesn't Work

### Option A: Invalidate Caches in Android Studio
1. In Android Studio: **File → Invalidate Caches / Restart**
2. Select **"Invalidate and Restart"**
3. Wait for restart and sync

### Option B: Update Gradle Version
1. In Android Studio: **File → Settings → Build, Execution, Deployment → Build Tools → Gradle**
2. Check "Use Gradle from: 'gradle-wrapper.properties' file"
3. Or manually update Gradle version in `android/gradle/wrapper/gradle-wrapper.properties`
4. Click "Apply" and sync

### Option C: Check Java Version
Make sure you have JDK 17 or later:
```bash
java -version
```

If you see Java 8 or 11, you need to update:
- Download JDK 17+ from [Adoptium](https://adoptium.net/)
- Install it
- Restart Android Studio

## Still Not Working?

### Nuclear Option: Fresh Start
1. Close Android Studio
2. Delete these folders:
   ```bash
   # In your project:
   rm -rf android/.gradle
   rm -rf android/app/build
   rm -rf ~/.gradle/caches/
   ```
3. Reopen Android Studio
4. Let it re-download everything (will take a few minutes)

## Common Causes

1. **Network timeout during download** - Gradle cache got corrupted
2. **Gradle daemon crash** - Left processes in bad state
3. **Plugin incompatibility** - Capacitor plugins need specific Gradle versions
4. **Java version mismatch** - Old Java version incompatible with new Gradle

## Prevention

- Always let Gradle sync complete fully before closing Android Studio
- Don't interrupt Gradle downloads
- Keep Java and Android Studio updated

## Need More Help?

If none of these work, check:
- Android Studio version (should be latest stable)
- Capacitor version compatibility
- Java version (must be JDK 17+)
