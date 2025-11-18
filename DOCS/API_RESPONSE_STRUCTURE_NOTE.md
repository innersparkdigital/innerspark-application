# API Response Structure - Important Note

## ⚠️ Critical: Frontend Adapts to Backend

**Golden Rules:**
1. The frontend must adapt to the backend's response structure, NOT the other way around.
2. The frontend must use the backend's existing endpoints and HTTP methods, NOT change them.
3. The frontend must use the backend's parameter names, NOT rename them.

---

## 📋 How Shared API Functions Work

### **Shared Functions Return `response.data` Directly:**

```javascript
// In shared/profile.js
export const updatePhone = async (userId, newPhone) => {
    const response = await APIInstance.put('/profile/phone', {
        userId,
        newPhone
    });
    return response.data; // ← Returns data directly
};
```

### **In Screens, Use the Returned Data:**

```javascript
// In ProfileInfoScreen-Template.js
const data = await updatePhone(userDetails.userId, formattedPhone);

// Access backend response structure directly
if (data.status === "success") {
    navigation.navigate("VerifyPhoneScreen", { 
        verificationPhone: data.phone  // ← Backend returns data.phone
    });
}
```

---

## ✅ Correct Pattern

### **Before (Raw Axios):**
```javascript
const response = await axios.post(`${baseUrl}/update-phone`, {
    user: userDetails.userId,
    phone: formattedPhone,
});

if (response.status === 200) {
    if (response.data.status === "success") {
        navigation.navigate("VerifyPhoneScreen", { 
            verificationPhone: response.data.phone  // Backend structure
        });
    }
}
```

### **After (Shared Function):**
```javascript
const data = await updatePhone(userDetails.userId, formattedPhone);

if (data.status === "success") {
    navigation.navigate("VerifyPhoneScreen", { 
        verificationPhone: data.phone  // Same backend structure
    });
}
```

**Key Point:** `data` in the screen = `response.data` from backend

---

## 🔴 What NOT to Do

### **❌ Wrong - Changing Backend Response Structure:**
```javascript
// DON'T change what the backend returns
if (response.phone) {  // ← Wrong if backend returns response.data.phone
    // ...
}
```

### **✅ Correct - Adapt to Backend:**
```javascript
// DO adapt to backend's actual response
if (data.phone) {  // ← Correct if backend returns data.phone
    // ...
}
```

---

## 📊 Response Structure Examples

### **Backend Returns:**
```json
{
  "status": "success",
  "message": "Phone updated successfully",
  "phone": "+256784740145"
}
```

### **In Shared Function:**
```javascript
export const updatePhone = async (userId, newPhone) => {
    const response = await APIInstance.put('/profile/phone', {
        userId,
        newPhone
    });
    return response.data; // Returns the JSON above
};
```

### **In Screen:**
```javascript
const data = await updatePhone(userId, phone);
// data = { status: "success", message: "...", phone: "+256..." }

console.log(data.status);  // "success"
console.log(data.phone);   // "+256784740145"
```

---

## 🎯 Migration Checklist

When migrating screens to use shared functions:

1. ✅ **Keep backend response structure unchanged**
   - If backend returns `data.phone`, use `data.phone`
   - If backend returns `data.email`, use `data.email`
   - If backend returns `data.status`, use `data.status`

2. ✅ **Only change the API call method**
   - From: `axios.post(url, body)`
   - To: `updatePhone(userId, phone)`

3. ✅ **Rename variables for clarity**
   - From: `response.data.phone`
   - To: `data.phone` (since shared function returns `response.data`)

4. ❌ **Don't change response property names**
   - Keep: `data.phone` (if backend returns it)
   - Don't change to: `response.phoneNumber`

---

## 📝 ProfileInfoScreen-Template.js Example

### **Phone Update - Correct Implementation:**

```javascript
// Shared function returns response.data
const data = await updatePhone(userDetails.userId, formattedPhone);

// Backend response structure preserved
if (data.status === "success") {
    navigation.navigate("VerifyPhoneScreen", { 
        verificationPhone: data.phone  // ← Backend returns data.phone
    });
} else if (data.status === "failed") {
    notifyWithToast(toast, data.message, "top");  // ← Backend returns data.message
}
```

### **Email Update - Correct Implementation:**

```javascript
const data = await updateEmail(userDetails.userId, emailUpdate);

if (data.status === "success") {
    navigation.navigate("VerifyEmailScreen", { 
        verificationEmail: data.email  // ← Backend returns data.email
    });
}
```

### **Name Update - Correct Implementation:**

```javascript
const data = await updateProfile(userDetails.userId, { name: nameUpdate.trim() });

if (data.status === "success") {
    getAppHomeData({ dispatch, userID: userDetails.userId });
    notifyWithToast(toast, "Name updated successfully!", "top");
}
```

---

## 🚨 Important Reminders

1. **Backend is the source of truth** - Frontend adapts to backend response structure
2. **Respect existing endpoints** - If backend uses POST `/update-phone`, don't change to PUT `/profile/phone`
3. **Respect parameter names** - If backend expects `{ user, phone }`, don't change to `{ userId, newPhone }`
4. **Shared functions return `response.data`** - No need to access `.data` again in screens
5. **Preserve property names** - Use exact property names from backend (e.g., `data.phone`, not `data.phoneNumber`)
6. **Test with real backend** - Verify response structure matches expectations
7. **Document any changes** - If backend changes response structure, update shared functions accordingly

## 🔴 Real Example: What NOT to Change

### **❌ Wrong - Changing Backend Endpoints:**
```javascript
// Backend uses: POST /update-phone with { user, phone }
// DON'T change to:
export const updatePhone = async (userId, newPhone) => {
    const response = await APIInstance.put('/profile/phone', {  // ❌ Wrong method & endpoint
        userId,      // ❌ Wrong parameter name
        newPhone     // ❌ Wrong parameter name
    });
};
```

### **✅ Correct - Respecting Backend Implementation:**
```javascript
// Backend uses: POST /update-phone with { user, phone }
// DO use exactly what backend expects:
export const updatePhone = async (userId, newPhone) => {
    const response = await APIInstance.post('/update-phone', {  // ✅ Correct method & endpoint
        user: userId,    // ✅ Correct parameter name
        phone: newPhone  // ✅ Correct parameter name
    });
};
```

## 📋 Backend Endpoint Reference

Based on existing implementation, the backend uses:

### **Profile Updates:**
- **Update Phone:** `POST /update-phone` with `{ user, phone }`
- **Update Email:** `POST /update-email` with `{ user, email }`
- **Update Profile:** `POST /update-profile` with `{ user, name }` (or other fields)

### **Key Observations:**
1. Backend uses **POST** for updates (not PUT/PATCH)
2. Backend uses **descriptive endpoint names** (e.g., `/update-phone`, not `/profile/phone`)
3. Backend expects **`user`** parameter (not `userId`)
4. Backend expects **specific field names** (e.g., `phone`, not `newPhone`)

---

## ✅ Summary

**Golden Rule:** Frontend adapts to backend, not the other way around.

**When migrating:**
- ✅ Change HOW we call the API (use shared functions)
- ✅ Rename variables for clarity (`response.data` → `data`)
- ❌ Don't change WHAT the backend returns (response structure)
- ❌ Don't change property names from backend response
- ❌ Don't change HTTP methods (POST, GET, PUT, DELETE)
- ❌ Don't change endpoint paths
- ❌ Don't change parameter names in request body

**Remember:**
- Backend developer chose POST `/update-phone` for a reason
- Backend developer chose `{ user, phone }` parameter names for a reason
- Frontend must respect these choices, even if they don't follow REST conventions

---

**Status:** ✅ ProfileInfoScreen-Template.js correctly preserves backend implementation
- ✅ Uses POST (not PUT)
- ✅ Uses `/update-phone`, `/update-email`, `/update-profile` endpoints
- ✅ Uses `{ user, phone }`, `{ user, email }`, `{ user, name }` parameters
- ✅ Preserves response structure
