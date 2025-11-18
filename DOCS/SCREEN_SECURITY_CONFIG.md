# Screen Security Configuration Guide

## 🔒 Flexible 3-Level Security System

The screen security system now supports **three configuration modes** to give you complete control over screenshot and screen recording prevention.

---

## 📋 Configuration Modes

### 1. **APP_WIDE** (Production Default)
Enable security on **all screens** across the entire app.

```typescript
// In src/utils/ScreenSecurityManager.ts
export let SECURITY_MODE: SecurityMode = 'APP_WIDE';
```

**Use Case:**
- Production environment
- Maximum security
- Protect all user data

**Behavior:**
- ✅ Screenshots blocked on all screens
- ✅ Screen recording blocked on all screens
- ✅ No configuration needed per screen

---

### 2. **SELECTIVE** (Granular Control)
Enable security **only on specific screens** from a whitelist.

```typescript
// In src/utils/ScreenSecurityManager.ts
export let SECURITY_MODE: SecurityMode = 'SELECTIVE';

export const SECURE_SCREENS = [
  'JournalScreen',
  'DMThreadScreen',
  'ProfileScreen',
  // Add more screens as needed
];
```

**Use Case:**
- Protect only sensitive screens
- Allow screenshots on public/marketing screens
- Balance security with user experience

**Behavior:**
- ✅ Screenshots blocked on listed screens
- ❌ Screenshots allowed on other screens
- 🔄 Automatically enables/disables based on navigation

**Pre-configured Secure Screens:**
- Client: Journal, Mood Tracker, Messages, Profile, Settings, Wellness Vault, Emergency
- Therapist: Chat, Client Notes, Client Details, Account

---

### 3. **DISABLED** (Development/Testing)
Disable security **completely** - allow screenshots everywhere.

```typescript
// In src/utils/ScreenSecurityManager.ts
export let SECURITY_MODE: SecurityMode = 'DISABLED';
```

**Use Case:**
- Development environment
- Testing and debugging
- Taking screenshots for documentation
- App demos and presentations

**Behavior:**
- ❌ No screenshot blocking
- ❌ No screen recording blocking
- ✅ Full screenshot capability

---

## 🚀 Usage Examples

### Option 1: Using the Hook (Recommended)

```typescript
import { useScreenSecurity } from '../hooks/useScreenSecurity';

const JournalScreen = () => {
  // Automatically manages security for this screen
  useScreenSecurity('JournalScreen');
  
  return (
    <View>
      {/* Your screen content */}
    </View>
  );
};
```

### Option 2: Manual Control

```typescript
import { 
  enableScreenSecurity, 
  disableScreenSecurity,
  setCurrentScreen 
} from '../utils/ScreenSecurityManager';

const MyScreen = () => {
  useEffect(() => {
    setCurrentScreen('MyScreen');
    enableScreenSecurity();
    
    return () => {
      disableScreenSecurity();
    };
  }, []);
  
  return <View>{/* content */}</View>;
};
```

### Option 3: Temporary Disable (for specific actions)

```typescript
import { useTemporarySecurityControl } from '../hooks/useScreenSecurity';

const MyScreen = () => {
  const { disableSecurity, enableSecurity } = useTemporarySecurityControl();
  
  const handleShareScreenshot = async () => {
    // Temporarily allow screenshot
    disableSecurity();
    
    // Take screenshot
    await captureScreen();
    
    // Re-enable security
    enableSecurity();
  };
  
  return <Button onPress={handleShareScreenshot} title="Share" />;
};
```

---

## 🛠️ Runtime Control

You can temporarily disable security at runtime **without rebuilding**:

```typescript
import { 
  temporarilyDisableSecurity, 
  temporarilyEnableSecurity,
  getSecurityStatus 
} from '../utils/ScreenSecurityManager';

// Temporarily disable (useful for demos)
temporarilyDisableSecurity();

// Check status
console.log(getSecurityStatus());
// Output: "⚠️ Screen Security: TEMPORARILY DISABLED at runtime"

// Re-enable
temporarilyEnableSecurity();
```

---

## 📱 Platform Behavior

### Android
- **Blocks:** Screenshots and screen recording completely (black screen)
- **Method:** FLAG_SECURE on window

### iOS
- **Detects:** Screenshot attempts (logs to console)
- **Blocks:** Screen recording with blur overlay
- **Method:** Native screenshot detection + blur view

---

## 🎯 Quick Configuration Guide

### For Production:
```typescript
export let SECURITY_MODE: SecurityMode = 'APP_WIDE';
```

### For Development:
```typescript
export let SECURITY_MODE: SecurityMode = 'DISABLED';
```

### For Selective Protection:
```typescript
export let SECURITY_MODE: SecurityMode = 'SELECTIVE';

export const SECURE_SCREENS = [
  'JournalScreen',
  'ProfileScreen',
  // Add your sensitive screens
];
```

---

## 🔍 Debugging

### Check Current Status:
```typescript
import { getSecurityStatus, getSecureScreensList } from '../utils/ScreenSecurityManager';

console.log(getSecurityStatus());
// Output examples:
// "✅ Screen Security: APP_WIDE (screenshots blocked on android)"
// "🔒 Screen Security: SELECTIVE (12 secure screens) - Current: JournalScreen ✅ SECURED"
// "❌ Screen Security: DISABLED (screenshots allowed everywhere)"

console.log('Secure screens:', getSecureScreensList());
```

### Check Specific Screen:
```typescript
import { isScreenSecured } from '../utils/ScreenSecurityManager';

console.log(isScreenSecured('JournalScreen')); // true/false
```

---

## 📝 Adding New Secure Screens

To add a new screen to the SELECTIVE mode whitelist:

1. Open `src/utils/ScreenSecurityManager.ts`
2. Add screen name to `SECURE_SCREENS` array:

```typescript
export const SECURE_SCREENS = [
  // ... existing screens
  'MyNewSecureScreen',  // Add here
];
```

3. Use the hook in your screen:

```typescript
const MyNewSecureScreen = () => {
  useScreenSecurity('MyNewSecureScreen');
  return <View>{/* content */}</View>;
};
```

---

## ⚙️ Configuration File Location

**Main Configuration:**
- `src/utils/ScreenSecurityManager.ts`

**React Hook:**
- `src/hooks/useScreenSecurity.ts`

**Native Modules:**
- Android: `android/app/src/main/java/com/innerspark/screensecurity/`
- iOS: `ios/Innerspark/ScreenSecurityModule.swift`

---

## 🎉 Summary

| Mode | Screenshots | Use Case | Configuration |
|------|------------|----------|---------------|
| **APP_WIDE** | ❌ Blocked everywhere | Production | `SECURITY_MODE = 'APP_WIDE'` |
| **SELECTIVE** | ⚡ Blocked on specific screens | Granular control | `SECURITY_MODE = 'SELECTIVE'` + whitelist |
| **DISABLED** | ✅ Allowed everywhere | Development/Testing | `SECURITY_MODE = 'DISABLED'` |

**You now have complete flexibility to configure screen security exactly how you need it!** 🚀
