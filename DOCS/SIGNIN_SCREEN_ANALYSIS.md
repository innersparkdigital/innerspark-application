# SigninScreen.js - Pre-Migration Analysis

## 📋 Current Implementation

### **File:** `src/screens/authScreens/SigninScreen.js`
**Lines:** 751 lines
**Status:** Uses raw `APIInstance` directly, has `APIGlobaltHeaders()` call

---

## 🔍 API Calls Analysis

### **1. Login Endpoint**

**Used in two places:**
1. `userLoginWithEmailHandler()` - Line 140
2. `userLoginWithPhoneHandler()` - Line 314

#### **Email Login:**
```javascript
const response = await APIInstance.post('/auth/login', {
    email: trimmedEmail,
    password: trimmedPassword,
});
```

#### **Phone Login:**
```javascript
const response = await APIInstance.post('/auth/login', {
    phone: normalizedPhone,
    password: trimmedPassword,
});
```

### **Backend Endpoint:**
- **Method:** `POST`
- **Path:** `/auth/login`
- **Request Body (Email):** `{ email, password }`
- **Request Body (Phone):** `{ phone, password }`

---

## 📊 Response Structure

### **Success Response:**
```javascript
{
  status: "success",
  user: {
    user_id: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    role: string,
    email_verified: number (0 or 1),
    phone_verified: number (0 or 1)
  }
}
```

### **Response Handling:**
```javascript
if (response.status === 200) {
    if (response.data.status === "success") {
        // Access user data
        response.data.user.user_id
        response.data.user.firstName
        response.data.user.lastName
        response.data.user.email
        response.data.user.phoneNumber
        response.data.user.role
        response.data.user.email_verified
        response.data.user.phone_verified
    }
}
```

---

## 🎯 Current Flow

### **1. Smart Login Select:**
- Validates input (email or phone)
- Routes to appropriate handler:
  - Email → `userLoginWithEmailHandler()`
  - Phone → `userLoginWithPhoneHandler()`

### **2. Email Login Flow:**
```
1. Validate inputs
2. Trim and lowercase email
3. POST /auth/login with { email, password }
4. Check response.status === 200
5. Check response.data.status === "success"
6. Check email_verified:
   - If 0 → Navigate to SigninOTPScreen
   - If 1 → Store user data, show success modal
7. Dispatch Redux actions
8. Store in local storage
```

### **3. Phone Login Flow:**
```
1. Validate inputs
2. Normalize phone number (add country code)
3. POST /auth/login with { phone, password }
4. Check response.status === 200
5. Check response.data.status === "success"
6. Check phone_verified:
   - If 0 → Navigate to SigninOTPScreen
   - If 1 → Store user data, show success modal
7. Dispatch Redux actions
8. Store in local storage
```

---

## 🔧 Current Dependencies

### **Imports:**
```javascript
import axios from 'axios';
import { APIGlobaltHeaders, APIInstance, baseUrlRoot, baseUrlV1 } from '../../api/LHAPI';
```

### **Used:**
- ✅ `APIInstance` - For API calls
- ✅ `APIGlobaltHeaders()` - Called at module level (line 38)
- ❌ `axios` - Imported but NOT used (can be removed)
- ❌ `baseUrlRoot`, `baseUrlV1` - Used to create `baseUrl` but NOT used anywhere

---

## 📝 What Needs to Change

### **1. Remove Unused Imports:**
```diff
- import axios from 'axios';
- import { APIGlobaltHeaders, APIInstance, baseUrlRoot, baseUrlV1 } from '../../api/LHAPI';
+ import { APIInstance } from '../../api/LHAPI';
```

### **2. Remove APIGlobaltHeaders Call:**
```diff
- const baseUrl = baseUrlRoot + baseUrlV1;
- APIGlobaltHeaders();
```

### **3. Keep API Calls As-Is:**
```javascript
// ✅ KEEP THIS - Already using APIInstance correctly
const response = await APIInstance.post('/auth/login', {
    email: trimmedEmail,
    password: trimmedPassword,
});
```

---

## ✅ What to Keep (DO NOT CHANGE)

### **1. Endpoint:**
- ✅ `POST /auth/login` - Correct backend endpoint

### **2. Request Body:**
- ✅ Email login: `{ email, password }`
- ✅ Phone login: `{ phone, password }`

### **3. Response Handling:**
- ✅ `response.data.status`
- ✅ `response.data.user.user_id`
- ✅ `response.data.user.firstName`
- ✅ All other response properties

### **4. Business Logic:**
- ✅ Email/phone verification check
- ✅ Navigation to OTP screen
- ✅ Redux dispatch
- ✅ Local storage
- ✅ Success modal

---

## 🎨 Migration Strategy

### **Option 1: Minimal Changes (Recommended)**
Just remove unused imports and `APIGlobaltHeaders()` call:

```diff
- import axios from 'axios';
- import { APIGlobaltHeaders, APIInstance, baseUrlRoot, baseUrlV1 } from '../../api/LHAPI';
+ import { APIInstance } from '../../api/LHAPI';

- const baseUrl = baseUrlRoot + baseUrlV1;
- APIGlobaltHeaders();
```

**Pros:**
- ✅ Minimal risk
- ✅ No breaking changes
- ✅ Already using APIInstance correctly
- ✅ All response handling stays the same

**Cons:**
- ❌ Still has duplicate code (email and phone handlers are similar)

---

### **Option 2: Create Shared Function (Future)**
Create `shared/auth.js` → `login()` function:

```javascript
// shared/auth.js
export const login = async (credentials) => {
    const response = await APIInstance.post('/auth/login', credentials);
    return response.data;
};

// In SigninScreen.js
const data = await login({ email: trimmedEmail, password: trimmedPassword });
// OR
const data = await login({ phone: normalizedPhone, password: trimmedPassword });
```

**Pros:**
- ✅ Reusable across app
- ✅ Single source of truth
- ✅ Easier to test

**Cons:**
- ❌ More changes required
- ❌ Need to update response handling
- ❌ Higher risk

---

## 🚨 Critical Notes

### **1. Backend Uses Same Endpoint for Email and Phone:**
```javascript
// Both use POST /auth/login
// Email: { email, password }
// Phone: { phone, password }
```

### **2. Response Structure is Identical:**
Both email and phone login return the same response structure.

### **3. Verification Logic:**
- `email_verified === 0` → Redirect to OTP
- `phone_verified === 0` → Redirect to OTP
- Both verified → Show success modal

### **4. User Data Mapping:**
The screen maps backend response to frontend format:
```javascript
{
    userId: response.data.user.user_id,
    firstName: response.data.user.firstName,
    lastName: response.data.user.lastName,
    email: response.data.user.email,
    phone: response.data.user.phoneNumber,
    role: response.data.user.role,
    email_verified: response.data.user.email_verified,
    phone_verified: response.data.user.phone_verified,
}
```

---

## 📊 Code Duplication

### **Duplicated Logic:**
1. **Response handling** - Lines 146-256 (email) and 320-430 (phone) are ~90% identical
2. **User data mapping** - Repeated 6 times in the file
3. **Redux dispatch** - Same dispatch in both handlers
4. **Local storage** - Same storage logic in both handlers

### **Potential Refactoring (Future):**
- Extract `handleSuccessfulLogin(userData)` helper
- Extract `mapUserData(responseUser)` helper
- Extract `storeUserData(userData)` helper

---

## 🎯 Recommended Action

### **For Now: Minimal Changes**
1. ✅ Remove `axios` import (unused)
2. ✅ Remove `APIGlobaltHeaders` import and call
3. ✅ Remove `baseUrlRoot`, `baseUrlV1` imports (unused)
4. ✅ Keep all API calls as-is (already correct)
5. ✅ Keep all response handling as-is (matches backend)

### **Future: Consider Refactoring**
- Create `shared/auth.js` → `login()` function
- Extract helper functions for user data mapping
- Reduce code duplication

---

## ✅ Summary

**Current State:**
- Uses `APIInstance.post('/auth/login')` ✅ Correct
- Has `APIGlobaltHeaders()` call ⚠️ Remove
- Imports unused dependencies ⚠️ Remove
- Response handling matches backend ✅ Keep
- Business logic is sound ✅ Keep

**Migration Complexity:** 🟢 LOW
- Just remove unused imports and `APIGlobaltHeaders()` call
- No changes to API calls or response handling needed

**Risk Level:** 🟢 VERY LOW
- Already using APIInstance correctly
- No endpoint or response changes needed

---

**Status:** ✅ Ready for minimal migration (remove unused imports only)
