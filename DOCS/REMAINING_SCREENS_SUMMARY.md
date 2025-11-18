# Remaining Screens to Migrate - Quick Summary

## 📋 Remaining Files (6 files)

### **Active Files (Need Migration):**

1. **SigninOTPScreen.js** ✅ Active
   - Location: `src/screens/authScreens/SigninOTPScreen.js`
   - Uses: `APIGlobaltHeaders`, `baseUrlRoot`, `baseUrlV1`
   - Pattern: Auth screen (likely uses axios)

2. **PasswordResetOTPScreen.js** ✅ Active
   - Location: `src/screens/passwordResetScreens/PasswordResetOTPScreen.js`
   - Uses: `APIGlobaltHeaders`, `baseUrlRoot`, `baseUrlV1`
   - Pattern: Auth screen (likely uses axios)

3. **NewPasswordScreen.js** ✅ Active
   - Location: `src/screens/passwordResetScreens/NewPasswordScreen.js`
   - Uses: `APIGlobaltHeaders`, `baseUrlRoot`, `baseUrlV1`
   - Pattern: Auth screen (likely uses axios)

4. **VerifyEmailScreen.js** ✅ Active
   - Location: `src/screens/verificationScreens/VerifyEmailScreen.js`
   - Uses: `APIGlobaltHeaders`, `baseUrl`
   - Pattern: Verification screen (likely uses axios)

5. **VerifyPhoneScreen.js** ✅ Active
   - Location: `src/screens/verificationScreens/VerifyPhoneScreen.js`
   - Uses: `APIGlobaltHeaders`, `baseUrl`
   - Pattern: Verification screen (likely uses axios)

6. **LHNotifications.ts** ⚠️ Special Case
   - Location: `src/api/LHNotifications.ts`
   - Uses: `APIGlobaltHeaders`, `baseUrl`
   - Pattern: Uses `fetch` (not axios)
   - Note: Utility file, not a screen

---

### **Backup Files (Skip):**

- ❌ **SigninOTPScreen-BK.js** - Backup file, skip
- ❌ **SignupScreen-BK.js** - Backup file, skip

---

## 🎯 Migration Order

### **Batch 1: OTP Screens (3 files)**
1. SigninOTPScreen.js
2. PasswordResetOTPScreen.js
3. NewPasswordScreen.js

### **Batch 2: Verification Screens (2 files)**
4. VerifyEmailScreen.js
5. VerifyPhoneScreen.js

### **Batch 3: Utility (1 file)**
6. LHNotifications.ts (special case - uses fetch)

---

## ✅ Expected Pattern

Based on previous migrations, each screen should follow:

```diff
- import axios from 'axios';
- import { APIGlobaltHeaders, baseUrlRoot, baseUrlV1 } from '../../api/LHAPI';
+ import { APIInstance } from '../../api/LHAPI';

- const baseUrl = baseUrlRoot + baseUrlV1;
- APIGlobaltHeaders();

- const response = await axios.post(`${baseUrl}/endpoint`, { ... });
+ const response = await APIInstance.post('/endpoint', { ... });
```

---

## 📊 Progress

**Completed:** 5/11 (45%)
**Remaining:** 6/11 (55%)

**Next:** Start with SigninOTPScreen.js
