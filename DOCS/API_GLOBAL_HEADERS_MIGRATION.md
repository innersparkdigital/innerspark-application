# APIGlobaltHeaders Migration Progress

## 🎯 Goal
Gradually remove `APIGlobaltHeaders()` calls from all screens as they no longer serve a purpose (headers are now set in axios instances).

---

## ✅ Completed Migrations

### **1. HomeScreen.tsx** ✅

**Status:** COMPLETE

**Changes Made:**
```diff
- import { baseUrlRoot, baseUrlV1, APIGlobaltHeaders } from '../api/LHAPI';
- 
- const baseUrl = baseUrlRoot + baseUrlV1;
- APIGlobaltHeaders(); // API Global headers
```

**Reason:** HomeScreen doesn't make any direct API calls. It only uses:
- Redux state (userDetails, mood data)
- Local notification utilities (LHNotifications)
- No axios/fetch calls

**Testing:** 
- [ ] Open HomeScreen
- [ ] Verify no errors
- [ ] Check console for any API-related warnings

---

### **2. ProfileInfoScreen-Template.js** ✅

**Status:** COMPLETE

**Changes Made:**
```diff
- import axios from 'axios';
- import { profileInstance, APIGlobaltHeaders, baseUrl } from '../../api/LHAPI';
- APIGlobaltHeaders(); // Call API Global Headers

+ import { FileUploadInstance } from '../../api/LHAPI';
+ import { updateProfile, updatePhone, updateEmail } from '../../api/shared';

// Image upload
- const response = await profileInstance.post(`/update-avatar`, userImageData);
+ const response = await FileUploadInstance.post(`/update-avatar`, userImageData);

// Phone update
- const response = await axios.post(`${baseUrl}/update-phone`, { user, phone });
+ const response = await updatePhone(userDetails.userId, formattedPhone);

// Email update
- const response = await axios.post(`${baseUrl}/update-email`, { user, email });
+ const response = await updateEmail(userDetails.userId, emailUpdate);

// Name update
- const response = await axios.post(`${baseUrl}/update-profile`, { user, name });
+ const response = await updateProfile(userDetails.userId, { name: nameUpdate.trim() });
```

**Reason:** Migrated to use shared profile API functions
- ✅ Removed raw axios calls
- ✅ Removed APIGlobaltHeaders
- ✅ Now uses `shared/profile.js` functions
- ✅ Uses `FileUploadInstance` for image uploads

**Testing:** 
- [ ] Update profile name
- [ ] Update phone number
- [ ] Update email address
- [ ] Upload profile image
- [ ] Verify all updates work correctly

---

## ✅ Completed Migrations (3/11)

### **3. SigninScreen.js** ✅
**Location:** `src/screens/authScreens/SigninScreen.js`

**Changes Made:**
- ❌ Removed `import axios from 'axios'` (unused)
- ❌ Removed `APIGlobaltHeaders` import and call
- ❌ Removed `baseUrlRoot`, `baseUrlV1` imports (unused)
- ✅ Kept `APIInstance` import (already using it correctly)
- ✅ Kept all API calls as-is (already correct: `POST /auth/login`)
- ✅ Kept all response handling as-is (matches backend)

**API Calls:**
- Email Login: `APIInstance.post('/auth/login', { email, password })`
- Phone Login: `APIInstance.post('/auth/login', { phone, password })`

**Note:** This screen was already using `APIInstance` correctly. Only removed unused imports and `APIGlobaltHeaders()` call.

**Testing:** 
- [ ] Test email login
- [ ] Test phone login
- [ ] Test email verification redirect (unverified email)
- [ ] Test phone verification redirect (unverified phone)
- [ ] Test successful login flow
- [ ] Test error handling

---

## ✅ Completed Migrations (4/11)

### **4. SignupScreen.js** ✅
**Location:** `src/screens/signupScreens/SignupScreen.js`

**Changes Made:**
- ❌ Removed `import axios from 'axios'`
- ❌ Removed `APIGlobaltHeaders` import and call
- ❌ Removed `baseUrlRoot`, `baseUrlV1` imports
- ❌ Removed `baseUrl` variable
- ✅ Added `APIInstance` import
- ✅ Replaced `axios.post(\`${baseUrl}/auth/register\`, ...)` with `APIInstance.post('/auth/register', ...)`
- ✅ Kept all request parameters as-is (matches backend)
- ✅ Kept all response handling as-is (matches backend)

**API Call:**
- `APIInstance.post('/auth/register', { firstName, lastName, email, phoneNumber, password, role, gender })`

**Note:** Backend expects `phoneNumber` (not `phone`) and `gender` as "Male"/"Female" (converted by `getGender()` helper).

**Testing:** 
- [ ] Test signup with email and phone
- [ ] Test multi-step validation (3 steps)
- [ ] Test gender selection (Male/Female)
- [ ] Test phone number formatting
- [ ] Test password validation
- [ ] Test success modal display
- [ ] Test form clearing after success
- [ ] Test error handling

---

## ✅ Completed Migrations (5/11)

### **5. PasswordResetScreen.js** ✅
**Location:** `src/screens/passwordResetScreens/PasswordResetScreen.js`

**Changes Made:**
- ❌ Removed `import axios from 'axios'`
- ❌ Removed `APIGlobaltHeaders` import and call
- ❌ Removed `baseUrlRoot`, `baseUrlV1` imports
- ❌ Removed `baseUrl` variable
- ✅ Added `APIInstance` import
- ✅ Replaced `axios.post(\`${baseUrl}/forgot-pwd\`, ...)` with `APIInstance.post('/forgot-pwd', ...)` (2 places)
- ✅ Kept all request parameters as-is (both email and phone fields)
- ✅ Kept all response handling as-is (matches backend)

**API Calls:**
- Email reset: `APIInstance.post('/forgot-pwd', { email, phone: '' })`
- Phone reset: `APIInstance.post('/forgot-pwd', { email: '', phone })`

**Note:** Backend uses same endpoint for both email and phone, differentiating by which field is populated. Both fields must be present (one empty).

**Testing:** 
- [ ] Test password reset with email
- [ ] Test password reset with phone
- [ ] Test navigation to PasswordResetOTPScreen
- [ ] Test success message display
- [ ] Test error handling
- [ ] Test input clearing after success

---

## ✅ Completed Migrations (11/11) - MIGRATION COMPLETE! 🎉

### **11. LHNotifications.ts** ✅
**Location:** `src/api/LHNotifications.ts`

**Changes Made:**
- ❌ Removed `APIGlobaltHeaders` import
- ❌ Removed `baseUrlRoot`, `baseUrlV1` imports
- ✅ Added `APIInstance` import
- ✅ Converted `fetch` to `APIInstance` (5 functions)
- ✅ Updated GET request with query params
- ✅ Updated POST requests (with and without body)
- ✅ Kept all request parameters as-is (matches backend)
- ✅ Kept all response handling as-is (matches backend)

**API Calls Converted:**
1. `fetchNotificationsFromBackend` - `GET /notifications` with query params
2. `markNotificationAsDelivered` - `POST /notifications/{id}/delivered`
3. `markNotificationAsRead` - `POST /notifications/{id}/read`
4. `registerDeviceForPushNotifications` - `POST /notifications/register-device` with body
5. `syncNotificationsWithBackend` - Uses fetchNotificationsFromBackend

**Note:** This was the only file using `fetch` API. Now all API calls across the entire app use `APIInstance` for consistency.

**Testing:** 
- [ ] Test fetching notifications from backend
- [ ] Test marking notifications as delivered
- [ ] Test marking notifications as read
- [ ] Test device registration for push notifications
- [ ] Test notification sync
- [ ] Verify headers are sent correctly (x-api-key)
- [ ] Verify no console errors

---

## 📋 All Completed Files (11/11)

---

### **Priority 2: Auth Screens (Continue)**

These screens make auth-related API calls and should be migrated:

#### **2. SigninScreen.js**
- **Current:** Uses raw axios with `APIGlobaltHeaders()`
- **Migrate to:** `import { login } from '../../api/shared'`
- **Status:** Pending

#### **3. SigninOTPScreen.js**
- **Current:** Uses raw axios with `APIGlobaltHeaders()`
- **Migrate to:** `import { verifyOTP } from '../../api/shared'` (need to add this function)
- **Status:** Pending

#### **4. PasswordResetScreen.js**
- **Current:** Uses raw axios with `APIGlobaltHeaders()`
- **Migrate to:** `import { resetPassword } from '../../api/shared'`
- **Status:** Pending

#### **5. NewPasswordScreen.js**
- **Current:** Uses raw axios with `APIGlobaltHeaders()`
- **Migrate to:** `import { setNewPassword } from '../../api/shared'`
- **Status:** Pending

#### **6. PasswordResetOTPScreen.js**
- **Current:** Uses raw axios with `APIGlobaltHeaders()`
- **Migrate to:** `import { verifyResetCode } from '../../api/shared'`
- **Status:** Pending

---

### **Priority 3: Verification Screens (Use shared/auth.js)**

#### **7. VerifyPhoneScreen.js**
- **Current:** Uses raw axios with `APIGlobaltHeaders()`
- **Migrate to:** Add `verifyPhone()` to `shared/auth.js`
- **Status:** Pending

#### **8. VerifyEmailScreen.js**
- **Current:** Uses raw axios with `APIGlobaltHeaders()`
- **Migrate to:** `import { verifyEmail } from '../../api/shared'`
- **Status:** Pending

---

### **Priority 4: Utilities**

#### **9. LHNotifications.ts**
- **Current:** Uses fetch with `APIGlobaltHeaders()`
- **Migrate to:** `import { registerDeviceForPush } from './shared/notifications'`
- **Status:** Pending

---

## 🔄 Migration Strategy

### **Step 1: Simple Removals (Like HomeScreen)**
For screens that don't make API calls:
1. Remove `APIGlobaltHeaders` import
2. Remove `APIGlobaltHeaders()` call
3. Remove unused `baseUrl` variables
4. Test the screen

### **Step 2: Auth Screen Migrations**
For auth screens (signup, signin, password reset):
1. Replace raw axios calls with `shared/auth.js` functions
2. Remove `APIGlobaltHeaders` import and call
3. Update error handling to match new API structure
4. Test authentication flow

### **Step 3: Utility Migrations**
For LHNotifications.ts:
1. Replace fetch calls with `shared/notifications.js` functions
2. Remove `APIGlobaltHeaders` import and call
3. Test push notification registration

---

## 📊 Progress Tracker

**Total Files:** 11
**Completed:** 11 (100%) 🎉
**Remaining:** 0 (0%)

### **By Priority:**
- **Priority 1 (Profile):** ✅ 1/1 complete
- **Priority 2 (Auth):** ✅ 6/6 complete (All auth screens done!)
- **Priority 3 (Verification):** ✅ 2/2 complete (All verification screens done!)
- **Priority 4 (Utilities):** ✅ 1/1 complete (LHNotifications.ts done!)

---

## 🧪 Testing Checklist

After each migration, test:

### **HomeScreen.tsx** ✅
- [ ] Screen loads without errors
- [ ] No console warnings about APIGlobaltHeaders
- [ ] Mood check-in works
- [ ] Navigation works
- [ ] Notifications work

### **Auth Screens** (When migrated)
- [ ] Signup flow works
- [ ] Login flow works
- [ ] Password reset works
- [ ] OTP verification works
- [ ] Error handling works
- [ ] Success redirects work

### **Verification Screens** (When migrated)
- [ ] Email verification works
- [ ] Phone verification works
- [ ] Resend code works

### **LHNotifications.ts** (When migrated)
- [ ] Push notification registration works
- [ ] Device token saved correctly
- [ ] Notifications display correctly

---

## 🎯 Next Steps

1. **Test HomeScreen migration** ✅
   - Run app
   - Navigate to HomeScreen
   - Verify no errors

2. **Investigate ProfileInfoScreen-Template.js**
   - Check if it makes API calls
   - If not, remove APIGlobaltHeaders like HomeScreen

3. **Plan Auth Screen Migration**
   - Decide on migration order
   - Start with SigninScreen (most used)
   - Then SignupScreen
   - Then password reset flows

4. **Add Missing Functions to shared/auth.js**
   - `verifyOTP()` for SigninOTPScreen
   - `verifyPhone()` for VerifyPhoneScreen
   - Any other missing auth functions

---

## 📝 Notes

- **No Rush:** This is gradual migration, not urgent
- **Test Each:** Test each screen after migration
- **Backward Compatible:** Old screens still work with no-op function
- **Clean Code:** End result will be cleaner, more maintainable code

---

**Status:** 🟢 In Progress (1/11 complete)
