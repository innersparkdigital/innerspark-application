# Signup 404 Error - Debugging Guide

## 🔍 **Problem**
SignupScreen returns **404 Not Found** but Postman works fine.

---

## 🎯 **Most Common Causes**

### **1. Different Base URLs**

**App (React Native):**
```javascript
// LHAPI.js
baseURL: API_BASE_URL + API_VERSION
// Example: https://server.innersparkafrica.us/api/v1

// SignupScreen calls:
POST /auth/register
// Full URL: https://server.innersparkafrica.us/api/v1/auth/register
```

**Postman Collection:**
```
Base URL might be different:
- https://server.innersparkafrica.us/api (no /v1)
- https://server.innersparkafrica.us (no /api)

Full URL: https://server.innersparkafrica.us/???/auth/register
```

---

### **2. Auth Endpoints Not Versioned**

Many backends keep authentication endpoints **outside** versioned APIs:

```
✅ Postman uses:  https://server.innersparkafrica.us/auth/register
❌ App tries:     https://server.innersparkafrica.us/api/v1/auth/register
```

**Why?** Auth is often considered "core" functionality, not part of versioned API.

---

### **3. Different Endpoint Paths**

**Backend might expect:**
```
POST /register (no /auth prefix)
POST /api/register
POST /user/register
```

**But app calls:**
```
POST /auth/register
```

---

## 🔧 **How to Fix**

### **Step 1: Check Postman's Full URL**

In Postman:
1. Open the Register request
2. Look at the **full URL** (not just endpoint)
3. Note the **exact path** including base URL

Example:
```
https://server.innersparkafrica.us/auth/register
                                  ^^^^
                            No /api/v1 here!
```

---

### **Step 2: Run Signup in App and Check Console**

With the new logging, you'll see:

```
🔗 Full Signup URL: https://server.innersparkafrica.us/api/v1/auth/register
📦 Signup Payload: { firstName, lastName, email, ... }

❌ Status Code: 404
❌ Response Data: { message: "Not Found" }
⚠️  404 ERROR: Endpoint not found on backend!
```

---

### **Step 3: Compare URLs**

**Postman URL:**
```
https://server.innersparkafrica.us/auth/register
```

**App URL:**
```
https://server.innersparkafrica.us/api/v1/auth/register
                                    ^^^^^^^^
                                    Extra parts!
```

---

## 💡 **Solutions**

### **Solution 1: Use Separate Auth Instance** ⭐ **RECOMMENDED**

Create a separate axios instance for auth endpoints:

```javascript
// LHAPI.js

// Regular API instance (versioned)
export const APIInstance = axios.create({ 
    baseURL: API_BASE_URL + API_VERSION,  // /api/v1
    // ...
});

// Auth instance (not versioned)
export const AuthInstance = axios.create({
    baseURL: API_BASE_URL,  // Just /api or root
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    }
});
```

Then in SignupScreen:
```javascript
import { AuthInstance } from '../api/LHAPI';

// Use AuthInstance instead of APIInstance
const response = await AuthInstance.post('/auth/register', { ... });
```

---

### **Solution 2: Override Base URL for Auth**

```javascript
// SignupScreen.js
const response = await APIInstance.post('/auth/register', 
    { /* payload */ },
    { 
        baseURL: 'https://server.innersparkafrica.us/api'  // Override
    }
);
```

---

### **Solution 3: Backend Adds /v1 to Auth Routes**

Ask backend team to add auth endpoints to versioned API:

```javascript
// Backend adds:
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
// etc.
```

---

## 📊 **Comparison Table**

| Aspect | Postman | React Native App | Match? |
|--------|---------|------------------|--------|
| Base URL | `https://server.../api` | `https://server.../api/v1` | ❌ |
| Endpoint | `/auth/register` | `/auth/register` | ✅ |
| Full URL | `https://server.../api/auth/register` | `https://server.../api/v1/auth/register` | ❌ |
| Method | `POST` | `POST` | ✅ |
| Headers | `Content-Type: application/json` | `Content-Type: application/json` | ✅ |
| Payload | `{ firstName, lastName, ... }` | `{ firstName, lastName, ... }` | ✅ |

**Conclusion:** Base URL mismatch causes 404!

---

## 🧪 **Testing Steps**

### **1. Test with Postman URL**

Temporarily change app to use Postman's exact URL:

```javascript
// SignupScreen.js - TEMPORARY TEST
const response = await axios.post(
    'https://server.innersparkafrica.us/api/auth/register',  // Exact Postman URL
    { /* payload */ },
    {
        headers: {
            'Content-Type': 'application/json',
        }
    }
);
```

If this works → Confirms base URL issue!

---

### **2. Check Backend Routes**

Ask backend developer:
```
"What is the EXACT URL for the register endpoint?"
"Is it versioned (/api/v1) or not (/api)?"
"Are auth endpoints separate from the main API?"
```

---

### **3. Check Environment Variables**

```javascript
// Check what's loaded
console.log('API_BASE_URL:', API_BASE_URL);
console.log('API_VERSION:', API_VERSION);
console.log('Combined:', API_BASE_URL + API_VERSION);
```

Expected:
```
API_BASE_URL: https://server.innersparkafrica.us/api
API_VERSION: /v1
Combined: https://server.innersparkafrica.us/api/v1
```

---

## 🎯 **Quick Fix (Temporary)**

If you need signup working NOW:

```javascript
// SignupScreen.js
// Change this:
const response = await APIInstance.post('/auth/register', { ... });

// To this (use full URL):
const response = await axios.post(
    'https://server.innersparkafrica.us/api/auth/register',  // Postman's URL
    { /* payload */ },
    { headers: { 'Content-Type': 'application/json' } }
);
```

---

## 📝 **Summary**

**Root Cause:** Base URL mismatch between Postman and app

**Postman:** `https://server.../api/auth/register`  
**App:** `https://server.../api/v1/auth/register`

**Fix:** Either:
1. Create separate `AuthInstance` without `/v1`
2. Backend adds auth endpoints to `/api/v1`
3. Override base URL for auth calls

**Next Steps:**
1. Run signup and check console logs
2. Compare with Postman's URL
3. Implement appropriate solution
