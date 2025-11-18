# LHNotifications.ts - Migration Analysis & Plan

## 📋 Current State

### **File:** `src/api/LHNotifications.ts`
**Type:** TypeScript utility file (not a screen)
**Purpose:** Push notification management using `@notifee/react-native`

---

## 🔍 Key Differences from Other Files

### **1. Uses `fetch` API (NOT axios)**
```typescript
// Current pattern
const response = await fetch(`${baseUrl}/notifications?${params}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### **2. Has 5 Backend API Calls:**
1. **fetchNotificationsFromBackend** - `GET /notifications`
2. **markNotificationAsDelivered** - `POST /notifications/{id}/delivered`
3. **markNotificationAsRead** - `POST /notifications/{id}/read`
4. **registerDeviceForPushNotifications** - `POST /notifications/register-device`
5. **syncNotificationsWithBackend** - Calls fetchNotificationsFromBackend

### **3. Each Function Calls `APIGlobaltHeaders()`**
```typescript
export const fetchNotificationsFromBackend = async (...) => {
  try {
    APIGlobaltHeaders(); // ← Called before fetch
    
    const response = await fetch(`${baseUrl}/notifications?...`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
```

---

## 🎯 Migration Strategy

### **Option 1: Replace fetch with APIInstance** ⭐ (Recommended)

**Pros:**
- ✅ Consistent with all other screens
- ✅ Headers automatically included (x-api-key)
- ✅ Timeout configured (30 seconds)
- ✅ Interceptors available for error handling
- ✅ No need to manually construct headers

**Cons:**
- ⚠️ Need to convert fetch patterns to axios patterns
- ⚠️ Response handling slightly different

**Changes Required:**
```diff
- import { APIGlobaltHeaders, baseUrlRoot, baseUrlV1 } from './LHAPI';
+ import { APIInstance } from './LHAPI';

- const baseUrl = baseUrlRoot + baseUrlV1;

// Example: fetchNotificationsFromBackend
- export const fetchNotificationsFromBackend = async (userId?: string, lastFetchTime?: string) => {
-   try {
-     APIGlobaltHeaders();
-     
-     const params = new URLSearchParams();
-     if (userId) params.append('user_id', userId);
-     if (lastFetchTime) params.append('since', lastFetchTime);
-     
-     const response = await fetch(`${baseUrl}/notifications?${params.toString()}`, {
-       method: 'GET',
-       headers: {
-         'Content-Type': 'application/json',
-       },
-     });
- 
-     if (!response.ok) {
-       throw new Error(`HTTP error! status: ${response.status}`);
-     }
- 
-     const data = await response.json();

+ export const fetchNotificationsFromBackend = async (userId?: string, lastFetchTime?: string) => {
+   try {
+     const params: any = {};
+     if (userId) params.user_id = userId;
+     if (lastFetchTime) params.since = lastFetchTime;
+     
+     const response = await APIInstance.get('/notifications', { params });
+     const data = response.data;
```

---

### **Option 2: Keep fetch, Remove APIGlobaltHeaders** (Simpler but inconsistent)

**Pros:**
- ✅ Minimal changes
- ✅ No need to convert fetch to axios
- ✅ Quick migration

**Cons:**
- ❌ Inconsistent with rest of app (only file using fetch)
- ❌ Need to manually add headers (x-api-key)
- ❌ No timeout configured
- ❌ No interceptors

**Changes Required:**
```diff
- import { APIGlobaltHeaders, baseUrlRoot, baseUrlV1 } from './LHAPI';
+ import { baseUrlRoot, baseUrlV1, authToken } from './LHAPI';

+ const baseUrl = baseUrlRoot + baseUrlV1;

- export const fetchNotificationsFromBackend = async (userId?: string, lastFetchTime?: string) => {
-   try {
-     APIGlobaltHeaders();
-     
-     const response = await fetch(`${baseUrl}/notifications?${params.toString()}`, {
-       method: 'GET',
-       headers: {
-         'Content-Type': 'application/json',
-       },
-     });

+ export const fetchNotificationsFromBackend = async (userId?: string, lastFetchTime?: string) => {
+   try {
+     const response = await fetch(`${baseUrl}/notifications?${params.toString()}`, {
+       method: 'GET',
+       headers: {
+         'Content-Type': 'application/json',
+         'x-api-key': authToken, // ← Add manually
+       },
+     });
```

---

## 📊 Detailed Conversion Examples

### **1. GET Request (fetchNotificationsFromBackend)**

**Before (fetch):**
```typescript
const params = new URLSearchParams();
if (userId) params.append('user_id', userId);
if (lastFetchTime) params.append('since', lastFetchTime);

const response = await fetch(`${baseUrl}/notifications?${params.toString()}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
});

if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}

const data = await response.json();
```

**After (APIInstance):**
```typescript
const params: any = {};
if (userId) params.user_id = userId;
if (lastFetchTime) params.since = lastFetchTime;

const response = await APIInstance.get('/notifications', { params });
const data = response.data;
```

---

### **2. POST Request (markNotificationAsDelivered)**

**Before (fetch):**
```typescript
await fetch(`${baseUrl}/notifications/${notificationId}/delivered`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**After (APIInstance):**
```typescript
await APIInstance.post(`/notifications/${notificationId}/delivered`);
```

---

### **3. POST with Body (registerDeviceForPushNotifications)**

**Before (fetch):**
```typescript
await fetch(`${baseUrl}/notifications/register-device`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    user_id: userId,
    fcm_token: fcmToken,
    platform: 'android',
    app_version: '1.0.0',
  }),
});
```

**After (APIInstance):**
```typescript
await APIInstance.post('/notifications/register-device', {
  user_id: userId,
  fcm_token: fcmToken,
  platform: 'android',
  app_version: '1.0.0',
});
```

---

## 🎯 Recommended Approach

**Use Option 1: Replace fetch with APIInstance**

### **Why?**
1. ✅ **Consistency** - All API calls use APIInstance
2. ✅ **Headers** - x-api-key automatically included
3. ✅ **Timeout** - 30-second timeout configured
4. ✅ **Error Handling** - Interceptors available
5. ✅ **Maintainability** - Single pattern across entire app

### **Migration Steps:**

1. **Update imports:**
   - Remove: `APIGlobaltHeaders`, `baseUrlRoot`, `baseUrlV1`
   - Add: `APIInstance`

2. **Remove baseUrl construction:**
   - Delete: `const baseUrl = baseUrlRoot + baseUrlV1;`

3. **Convert 5 functions:**
   - `fetchNotificationsFromBackend` - GET with query params
   - `markNotificationAsDelivered` - POST without body
   - `markNotificationAsRead` - POST without body
   - `registerDeviceForPushNotifications` - POST with body
   - Remove `APIGlobaltHeaders()` calls from all

4. **Update response handling:**
   - fetch: `const data = await response.json()`
   - axios: `const data = response.data`

---

## ⚠️ Important Notes

### **1. Backend Endpoints (DO NOT CHANGE):**
- `GET /notifications`
- `POST /notifications/{id}/delivered`
- `POST /notifications/{id}/read`
- `POST /notifications/register-device`

### **2. Request Parameters (DO NOT CHANGE):**
- Query params: `user_id`, `since`
- Body params: `user_id`, `fcm_token`, `platform`, `app_version`

### **3. Response Structure (DO NOT CHANGE):**
- Keep all `response.data` access patterns
- Keep all error handling
- Keep all console.log statements

---

## 🧪 Testing Required

After migration:
1. ✅ Test fetching notifications from backend
2. ✅ Test marking notifications as delivered
3. ✅ Test marking notifications as read
4. ✅ Test device registration for push notifications
5. ✅ Test notification sync
6. ✅ Verify headers are sent correctly (x-api-key)
7. ✅ Verify no console errors

---

## 📝 Summary

**Current:** Uses `fetch` with manual `APIGlobaltHeaders()` calls
**Target:** Use `APIInstance` for consistency
**Complexity:** 🟡 Moderate (need to convert fetch to axios patterns)
**Risk:** 🟢 Low (straightforward conversion, well-documented patterns)
**Files to Change:** 1 file, 5 functions

---

**Ready to proceed with Option 1 (APIInstance)?** This will complete the migration to 100%! 🎯
