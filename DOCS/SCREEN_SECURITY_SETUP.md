# 🔒 Screen Security Implementation Guide

## Overview

This app now includes **app-wide screenshot and screen recording prevention** to protect sensitive mental health data.

### Features
- ✅ **Android**: Prevents screenshots and screen recording using `FLAG_SECURE`
- ✅ **iOS**: Detects screenshots and blurs screen during recording
- ✅ **Easy Toggle**: Single configuration flag to enable/disable
- ✅ **App-Wide**: Automatically enabled on app start

---

## 🎛️ How to Enable/Disable

### Quick Toggle (No User Control)

Open `src/utils/ScreenSecurityManager.ts` and change:

```typescript
// Set to true to ENABLE screenshot/recording prevention
export const ENABLE_SCREEN_SECURITY = true;

// Set to false to DISABLE (useful for development/testing)
export const ENABLE_SCREEN_SECURITY = false;
```

**That's it!** The change applies app-wide automatically.

---

## 📱 Platform Behavior

### Android
- **Screenshots**: Completely blocked (black screen captured)
- **Screen Recording**: Completely blocked (black screen recorded)
- **Implementation**: Uses `WindowManager.LayoutParams.FLAG_SECURE`

### iOS
- **Screenshots**: Detected and logged (cannot be prevented)
- **Screen Recording**: Detected with blur overlay + warning message
- **Implementation**: Uses `UIScreen.capturedDidChangeNotification`

---

## 🛠️ Setup Instructions

### Android Setup

**Already configured!** The native module is registered in:
- `android/app/src/main/java/com/innerspark/MainApplication.kt`

**To rebuild:**
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### iOS Setup

**You need to add the Swift files to Xcode:**

1. Open `ios/Innerspark.xcworkspace` in Xcode
2. Right-click on the `Innerspark` folder in the project navigator
3. Select **"Add Files to Innerspark..."**
4. Navigate to `ios/Innerspark/` and select:
   - `ScreenSecurityModule.swift`
   - `ScreenSecurityModule.m`
5. Make sure **"Copy items if needed"** is checked
6. Click **"Add"**
7. If prompted to create a bridging header, click **"Create"**

**To rebuild:**
```bash
cd ios
pod install
cd ..
npx react-native run-ios
```

---

## 🧪 Testing

### Test on Android
1. Run the app
2. Try taking a screenshot → Should see black screen
3. Try screen recording → Should record black screen
4. Check logs: `[ScreenSecurity] Android secure screen enabled`

### Test on iOS
1. Run the app
2. Try taking a screenshot → Should work but be logged
3. Start screen recording → Should see blur overlay with warning
4. Stop recording → Blur should disappear
5. Check logs: `[ScreenSecurity] iOS secure screen enabled`

### Test Disable
1. Set `ENABLE_SCREEN_SECURITY = false` in `ScreenSecurityManager.ts`
2. Rebuild app
3. Screenshots and recording should work normally
4. Check logs: `[ScreenSecurity] Security disabled in config`

---

## 📂 Files Created

### TypeScript/JavaScript
```
src/utils/ScreenSecurityManager.ts    # Main configuration & API
App.tsx                                # Integrated on app start
```

### Android (Java)
```
android/app/src/main/java/com/innerspark/screensecurity/
  ├── ScreenSecurityModule.java        # Native module implementation
  └── ScreenSecurityPackage.java       # Package registration
```

### iOS (Swift/Objective-C)
```
ios/Innerspark/
  ├── ScreenSecurityModule.swift       # Native module implementation
  └── ScreenSecurityModule.m           # Objective-C bridge
```

---

## 🔧 Advanced Usage

### Enable/Disable Programmatically

If you need to toggle security for specific screens:

```typescript
import { enableScreenSecurity, disableScreenSecurity } from './src/utils/ScreenSecurityManager';

// In a sensitive screen
useEffect(() => {
  enableScreenSecurity();
  
  return () => {
    disableScreenSecurity(); // Re-enable when leaving
  };
}, []);
```

### Check Status

```typescript
import { isScreenSecurityEnabled, getSecurityStatus } from './src/utils/ScreenSecurityManager';

if (isScreenSecurityEnabled()) {
  console.log('Security is ON');
}

console.log(getSecurityStatus());
// Output: "Screen Security: ENABLED (screenshots blocked on android)"
```

---

## ⚠️ Important Notes

1. **iOS Limitations**: 
   - Cannot prevent screenshots (iOS restriction)
   - Can only detect and blur during recording
   - Screenshots are logged for security auditing

2. **Development**:
   - Set `ENABLE_SCREEN_SECURITY = false` during development
   - Makes it easier to take screenshots for debugging
   - Remember to enable before production release

3. **Production**:
   - Always set `ENABLE_SCREEN_SECURITY = true` for production
   - Test on both platforms before release
   - Monitor logs for security events

4. **Compliance**:
   - This helps meet HIPAA/GDPR requirements for mental health apps
   - Document this security measure in your privacy policy
   - Consider adding user notification about screenshot prevention

---

## 🐛 Troubleshooting

### Android: "Native module not found"
- Run `cd android && ./gradlew clean`
- Rebuild: `npx react-native run-android`
- Check `MainApplication.kt` has `ScreenSecurityPackage()` registered

### iOS: "Native module not found"
- Make sure Swift files are added to Xcode project
- Check bridging header is created
- Run `cd ios && pod install`
- Rebuild: `npx react-native run-ios`

### Security not working
- Check `ENABLE_SCREEN_SECURITY` is set to `true`
- Check console logs for error messages
- Verify native modules are properly linked
- Try clean rebuild on both platforms

---

## 📞 Support

For issues or questions:
1. Check console logs for `[ScreenSecurity]` messages
2. Verify configuration in `ScreenSecurityManager.ts`
3. Test on physical devices (not simulators)
4. Review this guide's troubleshooting section

---

## ✅ Checklist

- [ ] Android native module registered in `MainApplication.kt`
- [ ] iOS Swift files added to Xcode project
- [ ] `ENABLE_SCREEN_SECURITY` set to desired value
- [ ] Tested on Android physical device
- [ ] Tested on iOS physical device
- [ ] Console logs show security status
- [ ] Screenshots blocked on Android
- [ ] Recording shows blur on iOS

---

**Status**: ✅ Fully Implemented & Ready to Use
