# API Instances Guide - Flexible URL Configuration

## 📋 **Overview**

The app now supports **two axios instances** to handle endpoints with different base URLs:

1. **`APIInstance`** - For versioned endpoints (`/api/v1/*`)
2. **`AuthInstance`** - For non-versioned auth endpoints (`/api/*`)

This allows flexibility without breaking existing implementations.

---

## 🎯 **The Problem**

Some backend endpoints are **versioned** while others are **not**:

```
✅ Versioned:    https://server.innersparkafrica.us/api/v1/client/dashboard
❌ Non-Versioned: https://server.innersparkafrica.us/api/auth/register
❌ Non-Versioned: https://server.innersparkafrica.us/api/auth/login
```

Using a single axios instance with `/api/v1` base URL caused 404 errors for non-versioned endpoints.

---

## ✅ **The Solution**

### **Two Axios Instances in `LHAPI.js`:**

```javascript
// Main API instance for versioned endpoints (/api/v1/*)
export const APIInstance = axios.create({ 
    baseURL: API_BASE_URL + API_VERSION,  // https://server.../api/v1
    timeout: 30000,
    headers: {
        'x-api-key': authToken,
        'Content-Type': 'application/json',
    }
});

// Auth instance for non-versioned auth endpoints (/api/*)
export const AuthInstance = axios.create({
    baseURL: API_BASE_URL,  // https://server.../api (no /v1)
    timeout: 30000,
    headers: {
        'x-api-key': authToken,
        'Content-Type': 'application/json',
    }
});
```

---

## 📖 **Usage Guide**

### **When to Use `APIInstance`** (Versioned Endpoints)

Use for **all client API endpoints** that include `/v1`:

```javascript
import { APIInstance } from '../api/LHAPI';

// ✅ Client endpoints (versioned)
const events = await APIInstance.get('/client/events');
const dashboard = await APIInstance.get('/client/dashboard', { params: { user_id } });
const profile = await APIInstance.get('/client/profile', { params: { user_id } });
const groups = await APIInstance.get('/client/groups', { params: { user_id } });

// Full URLs:
// https://server.../api/v1/client/events
// https://server.../api/v1/client/dashboard
// https://server.../api/v1/client/profile
// https://server.../api/v1/client/groups
```

---

### **When to Use `AuthInstance`** (Non-Versioned Endpoints)

Use for **authentication endpoints** that don't include `/v1`:

```javascript
import { AuthInstance } from '../api/LHAPI';

// ✅ Auth endpoints (non-versioned)
const signup = await AuthInstance.post('/auth/register', { ... });
const login = await AuthInstance.post('/auth/login', { ... });
const logout = await AuthInstance.post('/auth/logout', { ... });
const resetPassword = await AuthInstance.post('/auth/reset-password', { ... });

// Full URLs:
// https://server.../api/auth/register
// https://server.../api/auth/login
// https://server.../api/auth/logout
// https://server.../api/auth/reset-password
```

---

## 🔄 **Updated Files**

### **1. LHAPI.js**
- ✅ Added `AuthInstance` for non-versioned endpoints
- ✅ Kept `APIInstance` for versioned endpoints (no changes to existing code)
- ✅ Added interceptors to both instances

### **2. SignupScreen.js**
- ✅ Changed: `APIInstance` → `AuthInstance`
- ✅ Removed debug logs

### **3. SigninScreen.js**
- ✅ Changed: `APIInstance` → `AuthInstance`
- ✅ Both email and phone login updated

---

## 📊 **Endpoint Mapping**

| Endpoint | Instance | Base URL | Full URL |
|----------|----------|----------|----------|
| `/auth/register` | `AuthInstance` | `/api` | `https://server.../api/auth/register` |
| `/auth/login` | `AuthInstance` | `/api` | `https://server.../api/auth/login` |
| `/auth/logout` | `AuthInstance` | `/api` | `https://server.../api/auth/logout` |
| `/client/dashboard` | `APIInstance` | `/api/v1` | `https://server.../api/v1/client/dashboard` |
| `/client/events` | `APIInstance` | `/api/v1` | `https://server.../api/v1/client/events` |
| `/client/profile` | `APIInstance` | `/api/v1` | `https://server.../api/v1/client/profile` |
| `/client/groups` | `APIInstance` | `/api/v1` | `https://server.../api/v1/client/groups` |

---

## 🚀 **Adding New Endpoints**

### **For Versioned Endpoints:**
```javascript
// In your API file (e.g., src/api/client/newFeature.js)
import { APIInstance } from '../LHAPI';

export const getNewFeature = async (userId) => {
    const response = await APIInstance.get('/client/new-feature', {
        params: { user_id: userId }
    });
    return response.data;
};
```

### **For Non-Versioned Endpoints:**
```javascript
// In your screen or API file
import { AuthInstance } from '../api/LHAPI';

export const verifyEmail = async (token) => {
    const response = await AuthInstance.post('/auth/verify-email', {
        token
    });
    return response.data;
};
```

---

## 🔧 **Environment Variables**

Both instances use the same environment variables:

```bash
# .env file
API_DEVELOPMENT_URL=https://server.innersparkafrica.us/api
API_PRODUCTION_URL=https://server.innersparkafrica.us/api
API_VERSION=/v1
AUTH_TOKEN=your_api_key_here
```

**Result:**
- `APIInstance` baseURL: `https://server.../api/v1`
- `AuthInstance` baseURL: `https://server.../api`

---

## ✅ **Benefits**

1. **No Breaking Changes** - All existing `APIInstance` calls still work
2. **Flexible** - Supports both versioned and non-versioned endpoints
3. **Clean** - Clear separation between auth and client APIs
4. **Maintainable** - Easy to add new endpoints
5. **Consistent** - Both instances have same interceptors and error handling

---

## 🧪 **Testing**

### **Test Auth Endpoints:**
```javascript
// Should work now (no 404)
const response = await AuthInstance.post('/auth/register', { ... });
const response = await AuthInstance.post('/auth/login', { ... });
```

### **Test Client Endpoints:**
```javascript
// Should still work (unchanged)
const events = await APIInstance.get('/client/events');
const dashboard = await APIInstance.get('/client/dashboard', { params: { user_id } });
```

---

## 📝 **Migration Checklist**

If you find other auth endpoints using `APIInstance`, update them:

- [ ] Check all `/auth/*` endpoints
- [ ] Replace `APIInstance` with `AuthInstance`
- [ ] Test login/signup/logout flows
- [ ] Verify no 404 errors

---

## 🎯 **Summary**

**Before:**
```javascript
// ❌ All endpoints used APIInstance with /v1
const response = await APIInstance.post('/auth/register', { ... });
// Result: https://server.../api/v1/auth/register (404 error)
```

**After:**
```javascript
// ✅ Auth endpoints use AuthInstance without /v1
const response = await AuthInstance.post('/auth/register', { ... });
// Result: https://server.../api/auth/register (200 success)

// ✅ Client endpoints still use APIInstance with /v1
const events = await APIInstance.get('/client/events');
// Result: https://server.../api/v1/client/events (200 success)
```

---

## 🔍 **Quick Reference**

```javascript
// Import both instances
import { APIInstance, AuthInstance } from '../api/LHAPI';

// Auth endpoints (no /v1)
AuthInstance.post('/auth/register', { ... });
AuthInstance.post('/auth/login', { ... });
AuthInstance.post('/auth/logout', { ... });

// Client endpoints (with /v1)
APIInstance.get('/client/dashboard', { ... });
APIInstance.get('/client/events', { ... });
APIInstance.get('/client/profile', { ... });
```

**Rule of Thumb:**
- `/auth/*` → Use `AuthInstance`
- `/client/*` → Use `APIInstance`
