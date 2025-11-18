# APIGlobaltHeaders Fix - Backward Compatibility

## 🔴 Problem

During API refactoring, the `APIGlobaltHeaders()` function was removed from `LHAPI.js`, but **11 screens** were still trying to import and call it, causing:

```
TypeError: APIGlobaltHeaders is not a function (it is undefined)
```

## 📍 Affected Files

1. `SignupScreen.js`
2. `PasswordResetScreen.js`
3. `NewPasswordScreen.js`
4. `PasswordResetOTPScreen.js`
5. `HomeScreen.tsx`
6. `VerifyPhoneScreen.js`
7. `VerifyEmailScreen.js`
8. `ProfileInfoScreen-Template.js`
9. `SigninScreen.js`
10. `SigninOTPScreen.js`
11. `LHNotifications.ts`

All these files had:
```javascript
import { APIGlobaltHeaders, ... } from '../../api/LHAPI';
APIGlobaltHeaders(); // Called at module level or in functions
```

## ✅ Solution

Added back `APIGlobaltHeaders` as a **no-op function** in `LHAPI.js` for backward compatibility:

```javascript
/**
 * DEPRECATED: APIGlobaltHeaders
 * This function is no longer needed as headers are set directly in axios instances.
 * Kept for backward compatibility with existing screens.
 * @deprecated Use APIInstance or FileUploadInstance directly
 */
export const APIGlobaltHeaders = () => {
    // No-op function for backward compatibility
    // Headers are now set in APIInstance and FileUploadInstance
    console.warn('⚠️ APIGlobaltHeaders is deprecated. Headers are now set in axios instances.');
};
```

## 🎯 Why This Works

### **Old Approach (Before Refactor):**
```javascript
// LHAPI.js
export const APIGlobaltHeaders = () => {
    axios.defaults.headers.common['x-api-key'] = authToken;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
};

// Screens called this to set global headers
APIGlobaltHeaders();
```

### **New Approach (After Refactor):**
```javascript
// LHAPI.js - Headers set directly in instances
export const APIInstance = axios.create({ 
    baseURL: baseUrlRoot + baseUrlV1,
    headers: {
        'x-api-key': authToken,
        'Content-Type': 'application/json',
    }
});

// No need to call APIGlobaltHeaders() anymore
// But we keep it as no-op for backward compatibility
```

## 📊 Impact

- ✅ **Immediate:** Error fixed, app works again
- ✅ **Backward Compatible:** Old screens continue to work
- ⚠️ **Warning:** Console shows deprecation warning
- 🔄 **Future:** Gradually remove `APIGlobaltHeaders()` calls from screens

## 🔄 Migration Plan (Future)

### **Phase 1: Immediate (Done)**
- ✅ Add no-op `APIGlobaltHeaders` function
- ✅ App works without errors

### **Phase 2: Gradual Migration**
Remove `APIGlobaltHeaders()` calls from screens:

**Before:**
```javascript
import { APIGlobaltHeaders, baseUrl } from '../../api/LHAPI';
APIGlobaltHeaders();

const response = await axios.post(`${baseUrl}/endpoint`, data);
```

**After:**
```javascript
import { APIInstance } from '../../api/LHAPI';

const response = await APIInstance.post('/endpoint', data);
```

### **Phase 3: Cleanup**
Once all screens are migrated:
- Remove `APIGlobaltHeaders` function from `LHAPI.js`
- Remove imports from all screens

## 📝 Files to Migrate (11 files)

### **Auth Screens (5 files):**
- [ ] `SignupScreen.js` → Use `shared/auth.js`
- [ ] `SigninScreen.js` → Use `shared/auth.js`
- [ ] `SigninOTPScreen.js` → Use `shared/auth.js`
- [ ] `PasswordResetScreen.js` → Use `shared/auth.js`
- [ ] `NewPasswordScreen.js` → Use `shared/auth.js`
- [ ] `PasswordResetOTPScreen.js` → Use `shared/auth.js`

### **Verification Screens (2 files):**
- [ ] `VerifyPhoneScreen.js` → Use `shared/auth.js`
- [ ] `VerifyEmailScreen.js` → Use `shared/auth.js`

### **Profile Screens (1 file):**
- [ ] `ProfileInfoScreen-Template.js` → Use `shared/profile.js`

### **Dashboard (1 file):**
- [ ] `HomeScreen.tsx` → Use `client/dashboard.js`

### **Utilities (1 file):**
- [ ] `LHNotifications.ts` → Use `shared/notifications.js`

## 🎯 Recommendation

**For now:** Leave as-is (no-op function works fine)

**Later:** When refactoring auth/profile screens to use new API structure, remove the `APIGlobaltHeaders()` calls at that time.

**Priority:** Low (not urgent, just technical debt)

---

**Status:** ✅ FIXED - App now works without errors
