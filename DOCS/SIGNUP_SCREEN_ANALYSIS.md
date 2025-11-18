# SignupScreen.js - Pre-Migration Analysis

## 📋 Current Implementation

### **File:** `src/screens/signupScreens/SignupScreen.js`
**Lines:** 846 lines
**Status:** Uses raw `axios` with `APIGlobaltHeaders()` call

---

## 🔍 API Calls Analysis

### **1. Signup/Register Endpoint**

**Location:** Line 287 in `handleSignupSubmit()` function

```javascript
const response = await axios.post(`${baseUrl}/auth/register`, {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    phoneNumber: formattedPhone,
    password: password.trim(),
    role: "user",
    gender: getGender(gender)
});
```

### **Backend Endpoint:**
- **Method:** `POST` ✅
- **Path:** `/auth/register` ✅
- **Request Body:**
  ```javascript
  {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    password: string,
    role: "user",
    gender: string ("Male" or "Female")
  }
  ```

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
    if (response.data.status == "success") {
        // Show success modal
        setShowSuccessModal(true);
        // Clear form fields
    } else {
        // Show error message
        notifyWithToast(response.data.message);
    }
}
```

---

## 🎯 Current Flow

### **Multi-Step Signup (3 Steps):**

**Step 1: Personal Information**
- First Name
- Last Name
- Gender (Male/Female)

**Step 2: Contact Details**
- Email
- Phone Number (with country code formatting)

**Step 3: Secure Your Account**
- Password
- Confirm Password

### **Signup Process:**
```
1. Validate all steps
2. Trim inputs
3. Format phone number
4. POST /auth/register with all data
5. Check response.status === 200
6. Check response.data.status === "success"
7. Show success modal
8. Clear form fields
9. User can navigate to signin
```

---

## 🔧 Current Dependencies

### **Imports:**
```javascript
import axios from 'axios';
import { APIGlobaltHeaders, baseUrlRoot, baseUrlV1 } from '../../api/LHAPI';
```

### **Used:**
- ✅ `axios` - For API call (line 287)
- ✅ `APIGlobaltHeaders()` - Called at module level (line 37)
- ✅ `baseUrlRoot`, `baseUrlV1` - Used to create `baseUrl` (line 36)
- ✅ `baseUrl` - Used in axios call (line 287)

---

## 📝 What Needs to Change

### **Option 1: Minimal Changes (Recommended)**

Replace raw `axios` with `APIInstance`:

```diff
- import axios from 'axios';
- import { APIGlobaltHeaders, baseUrlRoot, baseUrlV1 } from '../../api/LHAPI';
+ import { APIInstance } from '../../api/LHAPI';

- const baseUrl = baseUrlRoot + baseUrlV1;
- APIGlobaltHeaders();

- const response = await axios.post(`${baseUrl}/auth/register`, {
+ const response = await APIInstance.post('/auth/register', {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    phoneNumber: formattedPhone,
    password: password.trim(),
    role: "user",
    gender: getGender(gender)
});
```

---

## ✅ What to Keep (DO NOT CHANGE)

### **1. Endpoint:**
- ✅ `POST /auth/register` - Correct backend endpoint

### **2. Request Body:**
- ✅ `firstName`, `lastName`, `email`, `phoneNumber`, `password`, `role`, `gender`
- All parameter names match backend expectations

### **3. Response Handling:**
- ✅ `response.data.status`
- ✅ `response.data.message`
- ✅ All response properties

### **4. Business Logic:**
- ✅ Multi-step validation
- ✅ Phone number formatting
- ✅ Gender extraction
- ✅ Form clearing
- ✅ Success modal
- ✅ Navigation flow

---

## 🎨 Migration Strategy

### **Recommended: Minimal Changes**

**Changes:**
1. ✅ Replace `axios` with `APIInstance`
2. ✅ Remove `APIGlobaltHeaders()` call
3. ✅ Remove `baseUrlRoot`, `baseUrlV1` imports
4. ✅ Remove `baseUrl` variable
5. ✅ Update axios call to use `APIInstance.post('/auth/register', ...)`

**Keep:**
- ✅ All request parameters (exact names)
- ✅ All response handling (exact structure)
- ✅ All business logic
- ✅ All validation
- ✅ All UI flow

---

## 🚨 Critical Notes

### **1. Backend Expects Specific Parameter Names:**
```javascript
{
  firstName: string,      // NOT first_name
  lastName: string,       // NOT last_name
  email: string,
  phoneNumber: string,    // NOT phone
  password: string,
  role: "user",          // Always "user" for signup
  gender: string         // "Male" or "Female" (from getGender())
}
```

### **2. Phone Number Formatting:**
The screen uses `LHPhoneInput` component which formats the phone with country code:
```javascript
phoneNumber: formattedPhone  // Already formatted with country code
```

### **3. Gender Extraction:**
Uses `getGender()` helper function to convert "M"/"F" to "Male"/"Female":
```javascript
const getGender = (genderCode) => {
    if (genderCode === "M") return "Male";
    if (genderCode === "F") return "Female";
    return "Male"; // default
}
```

### **4. Multi-Step Validation:**
Each step has its own validation:
- `validateStep1()` - First name, last name, gender
- `validateStep2()` - Email, phone
- `validateStep3()` - Password, confirm password

---

## 📊 Code Structure

### **Key Functions:**
1. `validateStep1()` - Validate personal info
2. `validateStep2()` - Validate contact details
3. `validateStep3()` - Validate password
4. `goToNextStep()` - Navigate to next step with validation
5. `goToPreviousStep()` - Navigate to previous step
6. `handleSignupSubmit()` - Submit signup form (line 268)

### **State Management:**
- `currentStep` - Current step (1, 2, or 3)
- `slideAnim` - Animation for step transitions
- Form fields: `firstName`, `lastName`, `gender`, `email`, `phone`, `password`, `verifyPassword`
- Loading states: `isLoading`, `showSuccessModal`

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

// In handleSignupSubmit() function (line 287)
- const response = await axios.post(`${baseUrl}/auth/register`, {
+ const response = await APIInstance.post('/auth/register', {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    phoneNumber: formattedPhone,
    password: password.trim(),
    role: "user",
    gender: getGender(gender)
});
```

**That's it!** No other changes needed.

---

## ✅ Summary

**Current State:**
- Uses `axios.post()` with manual URL construction ⚠️ Change
- Has `APIGlobaltHeaders()` call ⚠️ Remove
- Request parameters match backend ✅ Keep
- Response handling matches backend ✅ Keep
- Business logic is sound ✅ Keep

**Migration Complexity:** 🟢 LOW
- Just replace axios with APIInstance
- Remove APIGlobaltHeaders call
- No parameter or response changes needed

**Risk Level:** 🟢 VERY LOW
- Simple import and call replacement
- No business logic changes
- Backend contract preserved

---

**Status:** ✅ Ready for minimal migration (replace axios with APIInstance)
