# PasswordResetScreen.js - Pre-Migration Analysis

## 📋 Current Implementation

### **File:** `src/screens/passwordResetScreens/PasswordResetScreen.js`
**Lines:** 275 lines
**Status:** Uses raw `axios` with `APIGlobaltHeaders()` call

---

## 🔍 API Calls Analysis

### **1. Forgot Password Endpoint**

**Used in two places:**
1. `onSubmitFormEmailHandler()` - Line 64 (Email reset)
2. `onSubmitFormPhoneHandler()` - Line 122 (Phone reset)

#### **Email Reset:**
```javascript
const response = await axios.post(`${baseUrl}/forgot-pwd`, {
    email: emailOrPhone,
    phone: '',
});
```

#### **Phone Reset:**
```javascript
const response = await axios.post(`${baseUrl}/forgot-pwd`, {
    email: '',
    phone: emailOrPhone,
});
```

### **Backend Endpoint:**
- **Method:** `POST` ✅
- **Path:** `/forgot-pwd` ✅
- **Request Body (Email):** `{ email, phone: '' }`
- **Request Body (Phone):** `{ email: '', phone }`

---

## 📊 Response Structure

### **Success Response:**
```javascript
{
  status: "success",
  message: string,
  // ... other data
}
```

### **Response Handling:**
```javascript
if (response.status === 200) {
    if (response.data.status === "success") {
        // Show success message
        notifyWithToast("Password reset accepted, OTP Sent!");
        // Navigate to OTP screen
        navigation.navigate('PasswordResetOTPScreen');
        // Clear input
        setEmailOrPhone('');
    } else {
        // Show error message
        notifyWithToast(response.data.message);
    }
}
```

---

## 🎯 Current Flow

### **Password Reset Process:**

**Email Reset Flow:**
```
1. User enters email
2. Validate email is not empty
3. POST /forgot-pwd with { email, phone: '' }
4. Check response.status === 200
5. Check response.data.status === "success"
6. Show success message
7. Navigate to PasswordResetOTPScreen
8. Clear input field
```

**Phone Reset Flow:**
```
1. User enters phone number
2. Validate phone is not empty
3. POST /forgot-pwd with { email: '', phone }
4. Check response.status === 200
5. Check response.data.status === "success"
6. Show success message
7. Navigate to PasswordResetOTPScreen
8. Clear input field
```

---

## 🔧 Current Dependencies

### **Imports:**
```javascript
import axios from 'axios';
import { APIGlobaltHeaders, baseUrlRoot, baseUrlV1 } from '../../api/LHAPI';
```

### **Used:**
- ✅ `axios` - For API calls (lines 64, 122)
- ✅ `APIGlobaltHeaders()` - Called at module level (line 28)
- ✅ `baseUrlRoot`, `baseUrlV1` - Used to create `baseUrl` (line 27)
- ✅ `baseUrl` - Used in axios calls

---

## 📝 What Needs to Change

### **Minimal Changes:**

Replace raw `axios` with `APIInstance`:

```diff
- import axios from 'axios';
- import { APIGlobaltHeaders, baseUrlRoot, baseUrlV1 } from '../../api/LHAPI';
+ import { APIInstance } from '../../api/LHAPI';

- const baseUrl = baseUrlRoot + baseUrlV1;
- APIGlobaltHeaders();

// Email reset
- const response = await axios.post(`${baseUrl}/forgot-pwd`, {
+ const response = await APIInstance.post('/forgot-pwd', {
    email: emailOrPhone,
    phone: '',
});

// Phone reset
- const response = await axios.post(`${baseUrl}/forgot-pwd`, {
+ const response = await APIInstance.post('/forgot-pwd', {
    email: '',
    phone: emailOrPhone,
});
```

---

## ✅ What to Keep (DO NOT CHANGE)

### **1. Endpoint:**
- ✅ `POST /forgot-pwd` - Correct backend endpoint

### **2. Request Body:**
- ✅ Email reset: `{ email, phone: '' }`
- ✅ Phone reset: `{ email: '', phone }`
- **Note:** Backend expects BOTH fields, one empty

### **3. Response Handling:**
- ✅ `response.data.status`
- ✅ `response.data.message`
- ✅ All response properties

### **4. Business Logic:**
- ✅ Email/phone validation
- ✅ Navigation to OTP screen
- ✅ Input clearing
- ✅ Success/error messages

---

## 🚨 Critical Notes

### **1. Backend Expects Both Email and Phone Fields:**
```javascript
// Even when resetting by email, phone must be empty string
{ email: "user@example.com", phone: '' }

// Even when resetting by phone, email must be empty string
{ email: '', phone: "+256784740145" }
```

### **2. Same Endpoint for Both Methods:**
The backend uses the same `/forgot-pwd` endpoint for both email and phone resets, differentiating by which field is populated.

### **3. Navigation:**
Both methods navigate to `PasswordResetOTPScreen` after success.

### **4. Validation:**
Current validation is basic (just checks if field is not empty). Could be enhanced but not part of this migration.

---

## 🎨 Migration Strategy

### **Recommended: Minimal Changes**

**Changes:**
1. ✅ Replace `axios` with `APIInstance`
2. ✅ Remove `APIGlobaltHeaders()` call
3. ✅ Remove `baseUrlRoot`, `baseUrlV1` imports
4. ✅ Remove `baseUrl` variable
5. ✅ Update both axios calls to use `APIInstance.post('/forgot-pwd', ...)`

**Keep:**
- ✅ All request parameters (exact structure with both email and phone)
- ✅ All response handling (exact structure)
- ✅ All business logic
- ✅ All validation
- ✅ All navigation

---

## 📊 Code Structure

### **Key Functions:**
1. `onChangeEmailOrPhoneHandler()` - Handle input changes
2. `onSubmitFormEmailHandler()` - Submit email reset (line 51)
3. `onSubmitFormPhoneHandler()` - Submit phone reset (line 109)

### **State Management:**
- `isLoading` - Loading state
- `emailOrPhone` - Input field value (used for both email and phone)

### **UI:**
- Tab-based interface (Email tab and Phone tab)
- Single input field shared between tabs
- Submit button for each tab

---

## 🎯 Recommended Action

### **Minimal Changes Only:**

```diff
// Imports
- import axios from 'axios';
- import { APIGlobaltHeaders, baseUrlRoot, baseUrlV1 } from '../../api/LHAPI';
+ import { APIInstance } from '../../api/LHAPI';

// Remove these lines
- const baseUrl = baseUrlRoot + baseUrlV1;
- APIGlobaltHeaders();

// In onSubmitFormEmailHandler() (line 64)
- const response = await axios.post(`${baseUrl}/forgot-pwd`, {
+ const response = await APIInstance.post('/forgot-pwd', {
    email: emailOrPhone,
    phone: '',
});

// In onSubmitFormPhoneHandler() (line 122)
- const response = await axios.post(`${baseUrl}/forgot-pwd`, {
+ const response = await APIInstance.post('/forgot-pwd', {
    email: '',
    phone: emailOrPhone,
});
```

**That's it!** No other changes needed.

---

## ✅ Summary

**Current State:**
- Uses `axios.post()` with manual URL construction ⚠️ Change
- Has `APIGlobaltHeaders()` call ⚠️ Remove
- Request parameters match backend ✅ Keep (both email and phone fields)
- Response handling matches backend ✅ Keep
- Business logic is sound ✅ Keep

**Migration Complexity:** 🟢 LOW
- Just replace axios with APIInstance (2 places)
- Remove APIGlobaltHeaders call
- No parameter or response changes needed

**Risk Level:** 🟢 VERY LOW
- Simple import and call replacement
- No business logic changes
- Backend contract preserved

---

**Status:** ✅ Ready for minimal migration (replace axios with APIInstance in 2 places)
