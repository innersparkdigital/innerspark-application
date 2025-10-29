# Global Theme System Implementation

## ✅ COMPLETED - Dark Mode Support

### **Files Created:**

1. **`src/context/ThemeContext.tsx`** - Theme Provider
2. **`src/hooks/useThemedColors.ts`** - Themed Colors Hook
3. **App.tsx** - Updated with ThemeProvider

---

## 🎨 HOW IT WORKS

### **1. Theme Context (`ThemeContext.tsx`)**

Provides theme colors throughout the app based on user settings.

**Features:**
- Light and dark color schemes
- Automatic system theme detection
- Real-time theme switching
- Syncs with Redux settings

**Color Schemes:**

#### **Light Theme:**
```typescript
{
  background: '#F6F6F6',
  surface: '#FFFFFF',
  text: '#43484d',
  primary: '#5170FF',
  // ... full color palette
}
```

#### **Dark Theme:**
```typescript
{
  background: '#121212',
  surface: '#1E1E1E',
  text: '#E1E1E1',
  primary: '#6B8AFF',
  // ... full color palette
}
```

**Usage:**
```typescript
import { useTheme } from '../context/ThemeContext';

const MyComponent = () => {
  const { colors, isDark, theme } = useTheme();
  
  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Hello</Text>
    </View>
  );
};
```

---

### **2. Themed Colors Hook (`useThemedColors.ts`)**

Returns colors in the same structure as `appColors` for backward compatibility.

**Purpose:**
- Gradual migration from static colors to dynamic theme
- No need to refactor all screens at once
- Drop-in replacement for `appColors`

**Usage:**
```typescript
import { useThemedColors } from '../hooks/useThemedColors';

const MyScreen = () => {
  const appColors = useThemedColors(); // Same structure as static appColors
  
  return (
    <View style={{ backgroundColor: appColors.AppLightGray }}>
      <Text style={{ color: appColors.grey1 }}>Text</Text>
    </View>
  );
};
```

**Benefits:**
- ✅ Works with existing code
- ✅ No breaking changes
- ✅ Gradual adoption
- ✅ Type-safe

---

### **3. App Integration (`App.tsx`)**

ThemeProvider wraps the entire app inside Redux Provider.

**Provider Hierarchy:**
```
GestureHandlerRootView
  └─ SafeAreaView
      └─ Redux Provider
          └─ ThemeProvider ✅ NEW
              └─ NativeBaseProvider
                  └─ KeyboardAvoidingView
                      └─ LHRootNavigator
```

**Why this order?**
- Redux Provider first (ThemeProvider needs Redux)
- ThemeProvider second (provides theme to all screens)
- NativeBaseProvider third (can use theme if needed)

---

## 📱 THEME SWITCHING FLOW

### **User Changes Theme:**
1. User opens Appearance Settings
2. Selects Light/Dark/Auto
3. Redux action dispatched
4. ThemeContext reads Redux state
5. Theme updates automatically
6. All screens using `useTheme()` or `useThemedColors()` re-render

### **System Theme Changes:**
1. User changes device theme (iOS/Android settings)
2. `Appearance.addChangeListener()` detects change
3. ThemeContext updates if "Use System Theme" is enabled
4. All screens re-render with new theme

---

## 🔄 MIGRATION GUIDE

### **Option 1: Use `useThemedColors()` (Easiest)**

Replace static `appColors` import with hook:

**Before:**
```typescript
import { appColors } from '../global/Styles';

const MyScreen = () => {
  return (
    <View style={{ backgroundColor: appColors.AppLightGray }}>
      <Text style={{ color: appColors.grey1 }}>Text</Text>
    </View>
  );
};
```

**After:**
```typescript
import { useThemedColors } from '../hooks/useThemedColors';

const MyScreen = () => {
  const appColors = useThemedColors(); // ✅ Now themed!
  
  return (
    <View style={{ backgroundColor: appColors.AppLightGray }}>
      <Text style={{ color: appColors.grey1 }}>Text</Text>
    </View>
  );
};
```

### **Option 2: Use `useTheme()` (More Control)**

For new screens or major refactors:

```typescript
import { useTheme } from '../context/ThemeContext';

const MyScreen = () => {
  const { colors, isDark } = useTheme();
  
  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Text</Text>
      {isDark && <Icon name="moon" />}
    </View>
  );
};
```

---

## 🎯 SCREENS TO UPDATE

### **Priority 1: High-Traffic Screens**
- [ ] HomeScreen
- [ ] MoodScreen
- [ ] TodayMoodScreen
- [ ] MoodHistoryScreen
- [ ] SettingsScreen
- [ ] AppearanceSettingsScreen (preview card)

### **Priority 2: User-Facing Screens**
- [ ] TherapistsScreen
- [ ] GroupsListScreen
- [ ] ServicesScreen
- [ ] WellnessVaultScreen
- [ ] ProfileScreen

### **Priority 3: Secondary Screens**
- [ ] All other screens gradually

---

## 📋 IMPLEMENTATION CHECKLIST

### **Core System:**
- [x] Create ThemeContext with light/dark colors
- [x] Create useThemedColors hook
- [x] Wrap App with ThemeProvider
- [x] Connect to Redux settings
- [x] System theme detection

### **Next Steps:**
- [ ] Update HomeScreen to use themed colors
- [ ] Update MoodScreen to use themed colors
- [ ] Update navigation bar colors
- [ ] Update status bar based on theme
- [ ] Test theme switching on all screens
- [ ] Add theme transition animations (optional)

---

## 🧪 TESTING

### **Manual Testing:**
1. Open Appearance Settings
2. Switch between Light/Dark/Auto
3. Verify colors change immediately
4. Enable "Use System Theme"
5. Change device theme in system settings
6. Verify app follows system theme
7. Navigate through different screens
8. Verify all screens respect theme

### **Edge Cases:**
- [ ] Theme persists after app restart
- [ ] Theme changes while app is in background
- [ ] Theme works on both iOS and Android
- [ ] No flash of wrong theme on app start
- [ ] Status bar color matches theme

---

## 💡 EXAMPLE: Update a Screen

Let's update HomeScreen as an example:

**Before:**
```typescript
import { appColors } from '../global/Styles';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  title: {
    color: appColors.grey1,
    fontSize: 24,
  },
});
```

**After (Option 1 - Minimal Change):**
```typescript
import { useThemedColors } from '../hooks/useThemedColors';

const HomeScreen = () => {
  const appColors = useThemedColors(); // ✅ Add this line
  
  return (
    <View style={styles.container(appColors)}>
      <Text style={styles.title(appColors)}>Home</Text>
    </View>
  );
};

// Convert styles to functions
const styles = {
  container: (colors: any) => ({
    flex: 1,
    backgroundColor: colors.AppLightGray,
  }),
  title: (colors: any) => ({
    color: colors.grey1,
    fontSize: 24,
  }),
};
```

**After (Option 2 - Better):**
```typescript
import { useTheme } from '../context/ThemeContext';

const HomeScreen = () => {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Home</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
  },
});
```

---

## 🚀 BENEFITS

### **For Users:**
- ✅ Dark mode for night use
- ✅ Reduced eye strain
- ✅ Better battery life (OLED screens)
- ✅ Follows system preferences
- ✅ Accessibility improvement

### **For Development:**
- ✅ Centralized theme management
- ✅ Easy to add new themes
- ✅ Type-safe color usage
- ✅ Backward compatible
- ✅ Gradual migration path

---

## 📝 SUMMARY

**Status: FOUNDATION COMPLETE ✅**

### **What's Working:**
1. ✅ Theme system infrastructure
2. ✅ Light and dark color schemes
3. ✅ Redux integration
4. ✅ System theme detection
5. ✅ Backward-compatible hook
6. ✅ App wrapped with provider

### **What's Next:**
1. ⏳ Update screens to use themed colors
2. ⏳ Update status bar based on theme
3. ⏳ Test on real devices
4. ⏳ Add theme transition animations
5. ⏳ Update preview card in Appearance Settings

### **How to Use:**
```typescript
// In any screen:
import { useThemedColors } from '../hooks/useThemedColors';

const MyScreen = () => {
  const appColors = useThemedColors();
  // Use appColors as before, now it's themed!
};
```

**The theme system is ready! Now we can gradually update screens to support dark mode.** 🌙
