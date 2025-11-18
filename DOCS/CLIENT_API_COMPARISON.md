# Client API Comparison - Existing vs Postman Collection

**Analysis Date:** November 18, 2025  
**Purpose:** Compare current implementation with backend Postman collection

---

## ✅ **Summary**

| Category | Postman Endpoints | Current Implemented | Missing | Status |
|----------|-------------------|---------------------|---------|--------|
| **Groups** | 7 | 6 | 1 | ⚠️ Needs Update |
| **Messages** | 4 | 3 | 1 | ⚠️ Needs Update |
| **Dashboard** | 1 | 1 | 0 | ✅ Match |
| **Wallet** | 4 | 0 | 4 | ❌ **NEW MODULE** |
| **Mood** | 5 | 4 | 1 | ⚠️ Needs Update |
| **Journal** | 4 | 0 | 4 | ❌ **NEW MODULE** |
| **Profile** | 2 | 0 | 2 | ❌ **NEW MODULE** |
| **Settings** | 8 | 1 | 7 | ⚠️ Needs Expansion |
| **Notifications** | 2 | 1 | 1 | ⚠️ Needs Update |
| **Emergency** | 6 | 0 | 6 | ❌ **NEW MODULE** |
| **Subscriptions** | 4 | 0 | 4 | ❌ **NEW MODULE** |
| **Meditations** | 5 | 3 | 2 | ⚠️ Needs Update |
| **Events** | 5 | 2 | 3 | ⚠️ Needs Update |
| **Account** | 3 | 0 | 3 | ❌ **NEW MODULE** |
| **Goals** | 0 | 4 | - | ⚠️ Legacy? |
| **Appointments** | 0 | 3 | - | ⚠️ Legacy? |
| **Therapists** | 0 | 2 | - | ⚠️ Legacy? |
| **Uploads** | 0 | 3 | - | ⚠️ Utility |

---

## 📋 **Detailed Comparison**

### **1. Groups** ⚠️ Needs Minor Update

| Backend (Postman) | Current Code | Status | Notes |
|-------------------|--------------|--------|-------|
| GET `/groups` | ✅ `getGroups()` | Match | Needs `user_id`, `page`, `limit` params |
| GET `/groups/{id}` | ✅ `getGroupById()` | Match | Needs `user_id` param |
| POST `/groups/{id}/join` | ✅ `joinGroup()` | **Mismatch** | Missing `reason`, `agreeToGuidelines` |
| POST `/groups/{id}/leave` | ✅ `leaveGroup()` | **Mismatch** | Missing `feedback` param |
| GET `/groups/my-groups` | ✅ `getMyGroups()` | Match | Needs `user_id` param |
| GET `/groups/{id}/messages` | ✅ `getGroupMessages()` | Match | Needs `user_id`, `limit` params |
| POST `/groups/{id}/messages` | ✅ `sendGroupMessage()` | **Mismatch** | Params: `content`, `replyTo` vs `message` |

**Action:** Update parameter names to match backend

---

### **2. Messages** ⚠️ Needs Minor Update

| Backend (Postman) | Current Code | Status | Notes |
|-------------------|--------------|--------|-------|
| GET `/chats` | ✅ `getChats()` | Match | Needs `user_id` param |
| GET `/chats/{id}/messages` | ✅ `getChatMessages()` | Match | Needs `user_id`, `page`, `limit` params |
| POST `/chats/{id}/messages` | ✅ `sendChatMessage()` | Match | Needs `user_id`, `content`, `type` params |
| PUT `/chats/{id}/read` | ❌ **MISSING** | Add | Mark chat as read |

**Action:** Add `markChatAsRead()` function

---

### **3. Dashboard** ✅ Match

| Backend (Postman) | Current Code | Status |
|-------------------|--------------|--------|
| GET `/dashboard` | ✅ `getDashboard()` | Match |

**Action:** Verify `user_id` parameter

---

###  **4. Wallet** ❌ NEW MODULE

| Backend (Postman) | Current Code | Status |
|-------------------|--------------|--------|
| POST `/wallet/topup` | ❌ MISSING | Create |
| POST `/wallet/payout` | ❌ MISSING | Create |
| GET `/wallet/transactions` | ❌ MISSING | Create |
| GET `/wallet/transactions/{id}` | ❌ MISSING | Create |

**Action:** Create `wallet.js` with all 4 functions

---

### **5. Mood** ⚠️ Needs Minor Update

| Backend (Postman) | Current Code | Status | Notes |
|-------------------|--------------|--------|-------|
| GET `/mood/history` | ✅ `getMoodHistory()` | Match | Add `period` param |
| GET `/mood/today` | ✅ `getTodayMood()` | Match | - |
| POST `/mood` | ✅ `logMood()` | Match | Params: `moodValue`, `note` |
| GET `/mood/insights` | ❌ **MISSING** | Add | New |
| GET `/mood/milestones` | ❌ **MISSING** | Add | New |

**Action:** Add `getMoodInsights()` and `getMoodMilestones()`

---

### **6. Journal** ❌ NEW MODULE

| Backend (Postman) | Current Code | Status |
|-------------------|--------------|--------|
| GET `/journal/entries` | ❌ MISSING | Create |
| POST `/journal/entries` | ❌ MISSING | Create |
| PUT `/journal/entries/{id}` | ❌ MISSING | Create |
| DELETE `/journal/entries/{id}` | ❌ MISSING | Create |

**Action:** Create `journal.js` with all 4 functions

---

### **7. Profile** ❌ NEW MODULE

| Backend (Postman) | Current Code | Status |
|-------------------|--------------|--------|
| GET `/profile` | ❌ MISSING | Create |
| PUT `/profile` | ❌ MISSING | Create |

**Action:** Create `profile.js` with 2 functions

---

### **8. Settings** ⚠️ Needs Major Expansion

| Backend (Postman) | Current Code | Status |
|-------------------|--------------|--------|
| GET `/settings` (combined) | ✅ `getSettings()` | Match |
| PUT `/settings/password` | ❌ MISSING | Add |
| GET `/settings/privacy` | ❌ MISSING | Add |
| PUT `/settings/privacy` | ❌ MISSING | Add |
| GET `/settings/notifications` | ❌ MISSING | Add |
| PUT `/settings/notifications` | ❌ MISSING | Add |
| GET `/settings/appearance` | ❌ MISSING | Add |
| PUT `/settings/appearance` | ❌ MISSING | Add |

**Action:** Add 7 new functions to `settings.js`

---

### **9. Notifications** ⚠️ Needs Minor Update

| Backend (Postman) | Current Code | Status |
|-------------------|--------------|--------|
| PUT `/notifications/{id}/read` | ✅ `markAsRead()` | Match |
| PUT `/notifications/read-all` | ❌ MISSING | Add |

**Action:** Add `markAllAsRead()` function

---

### **10. Emergency** ❌ NEW MODULE

| Backend (Postman) | Current Code | Status |
|-------------------|--------------|--------|
| GET `/emergency/contacts` | ❌ MISSING | Create |
| POST `/emergency/contacts` | ❌ MISSING | Create |
| DELETE `/emergency/contacts/{id}` | ❌ MISSING | Create |
| GET `/emergency/safety-plan` | ❌ MISSING | Create |
| PUT `/emergency/safety-plan` | ❌ MISSING | Create |
| GET `/emergency/crisis-lines` | ❌ MISSING | Create |

**Action:** Create `emergency.js` with all 6 functions

---

### **11. Subscriptions** ❌ NEW MODULE

| Backend (Postman) | Current Code | Status |
|-------------------|--------------|--------|
| GET `/subscriptions/plans` | ❌ MISSING | Create |
| POST `/subscriptions/subscribe` | ❌ MISSING | Create |
| GET `/subscriptions/current` | ❌ MISSING | Create |
| GET `/billing/history` | ❌ MISSING | Create |

**Action:** Create `subscriptions.js` with all 4 functions

---

### **12. Meditations** ⚠️ Needs Update

| Backend (Postman) | Current Code | Status |
|-------------------|--------------|--------|
| GET `/meditations/articles` | ✅ `getArticles()` | Match |
| GET `/meditations/articles/{id}` | ✅ `getArticleById()` | Match |
| GET `/meditations/sounds` | ✅ `getSounds()` | Match |
| GET `/meditations/quotes` | ❌ MISSING | Add |
| GET `/meditations/quotes/daily` | ❌ MISSING | Add |

**Action:** Add 2 new functions

---

### **13. Events** ⚠️ Needs Update

| Backend (Postman) | Current Code | Status |
|-------------------|--------------|--------|
| GET `/events` | ✅ `getEvents()` | Match |
| GET `/events/{id}` | ✅ `getEventById()` | Match |
| POST `/events/{id}/register` | ❌ MISSING | Add |
| DELETE `/events/{id}/unregister` | ❌ MISSING | Add |
| GET `/events/my-events` | ❌ MISSING | Add |

**Action:** Add 3 new functions

---

### **14. Account** ❌ NEW MODULE

| Backend (Postman) | Current Code | Status |
|-------------------|--------------|--------|
| POST `/data/export` | ❌ MISSING | Create |
| POST `/account/deactivate` | ❌ MISSING | Create |
| POST `/account/delete` | ❌ MISSING | Create |

**Action:** Create `account.js` with 3 functions

---

### **15. Goals** ⚠️ Legacy (Not in Postman)

**Current Code:**
- `getGoals()`
- `createGoal()`
- `updateGoal()`
- `deleteGoal()`

**Status:** Not in Postman collection - might be:
- Legacy feature being removed?
- Separate API collection?
- Future feature?

**Action:** **ASK USER** - Keep or remove?

---

### **16. Appointments** ⚠️ Legacy (Not in Postman)

**Current Code:**
- `getAppointments()`
- `bookAppointment()`
- `cancelAppointment()`

**Status:** Not in Postman collection

**Action:** **ASK USER** - Keep or remove?

---

### **17. Therapists** ⚠️ Legacy (Not in Postman)

**Current Code:**
- `getTherapists()`
- `getTherapistById()`

**Status:** Not in Postman collection

**Action:** **ASK USER** - Keep or remove?

---

### **18. Uploads** ⚠️ Utility (Not in Postman)

**Current Code:**
- `uploadProfileImage()`
- `uploadChatImage()`
- `uploadFile()`

**Status:** Not in Postman - utility functions

**Action:** Keep (uses `FileUploadInstance`)

---

## 🎯 **Implementation Plan**

### **Phase 1: Create New Modules (Priority: High)**
1. ✅ Create `wallet.js` (4 functions)
2. ✅ Create `journal.js` (4 functions)
3. ✅ Create `emergency.js` (6 functions)
4. ✅ Create `subscriptions.js` (4 functions)
5. ✅ Create `account.js` (3 functions)
6. ✅ Create `profile.js` (2 functions)

**Total:** 6 new files, 23 new functions

---

### **Phase 2: Update Existing Modules (Priority: Medium)**
1. ⚠️ Update `groups.js` (fix parameters)
2. ⚠️ Update `messages.js` (add 1 function)
3. ⚠️ Update `mood.js` (add 2 functions)
4. ⚠️ Update `settings.js` (add 7 functions)
5. ⚠️ Update `notifications.js` (add 1 function)
6. ⚠️ Update `meditations.js` (add 2 functions)
7. ⚠️ Update `events.js` (add 3 functions)

**Total:** 7 files updated, 16 new functions

---

### **Phase 3: Handle Legacy Files (Priority: Low)**
1. ❓ Decide on `goals.js` (keep or remove?)
2. ❓ Decide on `appointments.js` (keep or remove?)
3. ❓ Decide on `therapists.js` (keep or remove?)
4. ✅ Keep `uploads.js` (utility)

---

### **Phase 4: Update Barrel Export**
1. Update `index.js` to export new modules
2. Add JSDoc comments
3. Organize exports by category

---

## 📊 **Statistics**

**Current Implementation:**
- Files: 13
- Functions: ~35

**After Full Implementation:**
- Files: 19 (+6 new)
- Functions: ~74 (+39 new)

**Work Required:**
- New modules: 6 files, 23 functions
- Updated modules: 7 files, 16 new functions
- Parameter fixes: ~15 functions

---

## 🚨 **Critical Parameter Mismatches**

### **Groups Module:**
```javascript
// CURRENT (Wrong)
export const joinGroup = async (groupId) => {
    return await APIInstance.post(`/client/groups/${groupId}/join`);
};

// BACKEND EXPECTS (Correct)
export const joinGroup = async (groupId, userId, reason, agreeToGuidelines) => {
    return await APIInstance.post(`/client/groups/${groupId}/join`, {
        user_id: userId,
        reason: reason,
        agreeToGuidelines: agreeToGuidelines
    });
};
```

### **Common Pattern:**
Most functions missing `user_id` parameter that backend expects!

---

## ✅ **Next Steps**

1. **Clarify Legacy Files:**
   - Goals - keep or remove?
   - Appointments - keep or remove?
   - Therapists - keep or remove?

2. **Start Implementation:**
   - Phase 1: Create new modules
   - Phase 2: Update existing modules
   - Phase 3: Fix parameter mismatches
   - Phase 4: Update barrel export

3. **Testing:**
   - Test each new endpoint
   - Verify parameter names match backend
   - Ensure response handling works

---

**Ready for your input on legacy files, then we proceed!** 🚀
