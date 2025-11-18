# Client API Endpoints Analysis - From Postman Collection

**Source:** `DEV_ARTIFACTS/Client & Auth API Collection.postman_collection.json`  
**Date:** November 18, 2025  
**Scope:** Client endpoints only (Auth excluded as requested)

---

## 📊 **Endpoint Categories**

### **1. Support Groups** (7 endpoints)
### **2. Messages/Chats** (4 endpoints)
### **3. Dashboard & Wallet** (5 endpoints)
### **4. Mood Tracking** (5 endpoints)
### **5. Journal** (4 endpoints)
### **6. Profile & Settings** (10 endpoints)
### **7. Notifications** (2 endpoints)
### **8. Emergency** (6 endpoints)
### **9. Subscriptions & Billing** (4 endpoints)
### **10. Meditations** (5 endpoints)
### **11. Events** (5 endpoints)
### **12. Data & Account** (4 endpoints)

**Total Client Endpoints:** 61 endpoints

---

## 🔍 **Detailed Endpoint Breakdown**

### **1. Client - Support Groups (7 endpoints)**

| # | Method | Endpoint | Parameters |
|---|--------|----------|------------|
| 1 | GET | `/api/v1/client/groups` | `user_id`, `page`, `limit` |
| 2 | GET | `/api/v1/client/groups/{groupId}` | `user_id` |
| 3 | POST | `/api/v1/client/groups/{groupId}/join` | `user_id`, `reason`, `agreeToGuidelines` |
| 4 | POST | `/api/v1/client/groups/{groupId}/leave` | `user_id`, `reason`, `feedback` |
| 5 | GET | `/api/v1/client/groups/my-groups` | `user_id` |
| 6 | GET | `/api/v1/client/groups/{groupId}/messages` | `user_id`, `page`, `limit` |
| 7 | POST | `/api/v1/client/groups/{groupId}/messages` | `user_id`, `content`, `replyTo` |

---

### **2. Client - Messages/Chats (4 endpoints)**

| # | Method | Endpoint | Parameters |
|---|--------|----------|------------|
| 1 | GET | `/api/v1/client/chats` | `user_id` |
| 2 | GET | `/api/v1/client/chats/{chatId}/messages` | `user_id`, `page`, `limit` |
| 3 | POST | `/api/v1/client/chats/{chatId}/messages` | `user_id`, `content`, `type` |
| 4 | PUT | `/api/v1/client/chats/{chatId}/read` | `user_id` |

---

### **3. Client - Dashboard & Wallet (5 endpoints)**

| # | Method | Endpoint | Parameters |
|---|--------|----------|------------|
| 1 | GET | `/api/v1/client/dashboard` | `user_id` |
| 2 | POST | `/api/v1/client/wallet/topup` | `user_id`, `amount`, `phoneNumber`, `network` |
| 3 | POST | `/api/v1/client/wallet/payout` | `user_id`, `amount`, `phoneNumber`, `network` |
| 4 | GET | `/api/v1/client/wallet/transactions` | `user_id`, `page`, `limit` |
| 5 | GET | `/api/v1/client/wallet/transactions/{transactionId}` | `user_id` |

---

### **4. Client - Mood Tracking (5 endpoints)**

| # | Method | Endpoint | Parameters |
|---|--------|----------|------------|
| 1 | GET | `/api/v1/client/mood/history` | `user_id`, `period`, `page`, `limit` |
| 2 | GET | `/api/v1/client/mood/today` | `user_id` |
| 3 | POST | `/api/v1/client/mood` | `user_id`, `moodValue`, `note` |
| 4 | GET | `/api/v1/client/mood/insights` | `user_id` |
| 5 | GET | `/api/v1/client/mood/milestones` | `user_id` |

---

### **5. Client - Journal (4 endpoints)**

| # | Method | Endpoint | Parameters |
|---|--------|----------|------------|
| 1 | GET | `/api/v1/client/journal/entries` | `user_id`, `page`, `limit` |
| 2 | POST | `/api/v1/client/journal/entries` | `user_id`, `title`, `content`, `mood`, `date` |
| 3 | PUT | `/api/v1/client/journal/entries/{entryId}` | `user_id`, `title`, `content` |
| 4 | DELETE | `/api/v1/client/journal/entries/{entryId}` | `user_id` |

---

### **6. Client - Profile & Settings (10 endpoints)**

| # | Method | Endpoint | Parameters |
|---|--------|----------|------------|
| 1 | GET | `/api/v1/client/profile` | `user_id` |
| 2 | PUT | `/api/v1/client/profile` | `user_id`, `firstName`, `lastName`, `phoneNumber`, `bio` |
| 3 | PUT | `/api/v1/client/settings/password` | `user_id`, `currentPassword`, `newPassword`, `confirmPassword` |
| 4 | GET | `/api/v1/client/settings/privacy` | `user_id` |
| 5 | PUT | `/api/v1/client/settings/privacy` | `user_id`, `profileVisibility`, `showOnlineStatus`, `allowMessages`, `dataSharing` |
| 6 | GET | `/api/v1/client/settings/notifications` | `user_id` |
| 7 | PUT | `/api/v1/client/settings/notifications` | `user_id`, `emailNotifications`, `pushNotifications` |
| 8 | GET | `/api/v1/client/settings/appearance` | `user_id` |
| 9 | PUT | `/api/v1/client/settings/appearance` | `user_id`, `theme`, `useSystemTheme` |
| 10 | GET | `/api/v1/client/settings` | `user_id` (combined settings) |

---

### **7. Client - Notifications (2 endpoints)**

| # | Method | Endpoint | Parameters |
|---|--------|----------|------------|
| 1 | PUT | `/api/v1/client/notifications/{notificationId}/read` | `user_id` |
| 2 | PUT | `/api/v1/client/notifications/read-all` | `user_id` |

---

### **8. Client - Emergency (6 endpoints)**

| # | Method | Endpoint | Parameters |
|---|--------|----------|------------|
| 1 | GET | `/api/v1/client/emergency/contacts` | `user_id` |
| 2 | POST | `/api/v1/client/emergency/contacts` | `user_id`, `name`, `relationship`, `phoneNumber`, `email`, `isPrimary` |
| 3 | DELETE | `/api/v1/client/emergency/contacts/{contactId}` | `user_id` |
| 4 | GET | `/api/v1/client/emergency/safety-plan` | `user_id` |
| 5 | PUT | `/api/v1/client/emergency/safety-plan` | `user_id` |
| 6 | GET | `/api/v1/client/emergency/crisis-lines` | `user_id` |

---

### **9. Client - Subscriptions & Billing (4 endpoints)**

| # | Method | Endpoint | Parameters |
|---|--------|----------|------------|
| 1 | GET | `/api/v1/client/subscriptions/plans` | `user_id` |
| 2 | POST | `/api/v1/client/subscriptions/subscribe` | `user_id`, `planId`, `billingCycle`, `paymentMethod`, `phoneNumber` |
| 3 | GET | `/api/v1/client/subscriptions/current` | `user_id` |
| 4 | GET | `/api/v1/client/billing/history` | `user_id`, `page`, `limit` |

---

### **10. Client - Meditations (5 endpoints)**

| # | Method | Endpoint | Parameters |
|---|--------|----------|------------|
| 1 | GET | `/api/v1/client/meditations/articles` | `page`, `limit` |
| 2 | GET | `/api/v1/client/meditations/articles/{articleId}` | - |
| 3 | GET | `/api/v1/client/meditations/sounds` | `page`, `limit` |
| 4 | GET | `/api/v1/client/meditations/quotes` | `page`, `limit` |
| 5 | GET | `/api/v1/client/meditations/quotes/daily` | `user_id` |

---

### **11. Client - Events (5 endpoints)**

| # | Method | Endpoint | Parameters |
|---|--------|----------|------------|
| 1 | GET | `/api/v1/client/events` | `page`, `limit` |
| 2 | GET | `/api/v1/client/events/{eventId}` | - |
| 3 | POST | `/api/v1/client/events/{eventId}/register` | `user_id`, `paymentMethod`, `phoneNumber` |
| 4 | DELETE | `/api/v1/client/events/{eventId}/unregister` | `user_id` |
| 5 | GET | `/api/v1/client/events/my-events` | `user_id` |

---

### **12. Client - Data & Account (4 endpoints)**

| # | Method | Endpoint | Parameters |
|---|--------|----------|------------|
| 1 | GET | `/api/v1/client/settings` | `user_id` |
| 2 | POST | `/api/v1/client/data/export` | `user_id`, `format`, `categories` |
| 3 | POST | `/api/v1/client/account/deactivate` | `user_id` |
| 4 | POST | `/api/v1/client/account/delete` | `user_id`, `reason` |

---

## 📝 **Key Observations**

### **1. Base Path Pattern:**
All client endpoints use: `/api/v1/client/`

### **2. Authentication:**
All requests include `x-api-key` header

### **3. Common Parameters:**
- `user_id` - Required in most endpoints (query param or body)
- `page` & `limit` - Pagination (default: page=1, limit=20)

### **4. HTTP Methods Used:**
- **GET** - Fetching data (30 endpoints)
- **POST** - Creating/Actions (16 endpoints)
- **PUT** - Updates (11 endpoints)
- **DELETE** - Deletions (4 endpoints)

### **5. Path Parameters:**
- `{groupId}` - Group identifier
- `{chatId}` - Chat identifier
- `{eventId}` - Event identifier
- `{entryId}` - Journal entry identifier
- `{notificationId}` - Notification identifier
- `{contactId}` - Emergency contact identifier
- `{transactionId}` - Transaction identifier
- `{articleId}` - Article identifier

---

## 🎯 **New Categories Not in Current `/api/client`:**

Comparing with existing files, these are **NEW** or **MISSING**:

### **New/Missing Modules:**
1. ✅ **Journal** - Complete new module (4 endpoints)
2. ✅ **Emergency** - Complete new module (6 endpoints)
3. ✅ **Subscriptions & Billing** - New separate module (4 endpoints)
4. ✅ **Data & Account** - New module (4 endpoints)
5. ✅ **Wallet** - Expanded (topup, payout, transactions)

### **Expanded Existing Modules:**
- **Groups** - Added group messages
- **Messages** - Added mark as read
- **Settings** - Added appearance, privacy, notifications
- **Notifications** - Added read-all
- **Mood** - Added insights, milestones
- **Events** - Added my-events, unregister
- **Meditations** - Added daily quote

---

## 🔧 **Existing `/api/client` Files:**

Current files:
1. `appointments.js` - **NOT in Postman** (legacy?)
2. `dashboard.js` - ✅ Exists
3. `events.js` - ✅ Exists (needs expansion)
4. `goals.js` - **NOT in Postman** (legacy?)
5. `groups.js` - ✅ Exists (needs expansion)
6. `index.js` - Barrel export
7. `meditations.js` - ✅ Exists (needs expansion)
8. `messages.js` - ✅ Exists (needs expansion)
9. `mood.js` - ✅ Exists (needs expansion)
10. `notifications.js` - ✅ Exists (needs expansion)
11. `settings.js` - ✅ Exists (needs expansion)
12. `therapists.js` - **NOT in Postman** (might be separate collection?)
13. `uploads.js` - **NOT in Postman** (utility?)

---

## ✅ **Files to Create:**

1. `journal.js` - NEW
2. `emergency.js` - NEW
3. `subscriptions.js` - NEW
4. `billing.js` - NEW (or combine with subscriptions)
5. `wallet.js` - NEW (or add to dashboard)
6. `account.js` - NEW (deactivate, delete, data export)
7. `profile.js` - NEW (or expand settings)

---

## 🎯 **Migration Strategy:**

### **Phase 1: Create New Modules**
1. Create `journal.js` (4 endpoints)
2. Create `emergency.js` (6 endpoints)
3. Create `subscriptions.js` (4 endpoints)
4. Create `wallet.js` (5 endpoints)
5. Create `account.js` (4 endpoints)
6. Create `profile.js` (2 endpoints)

### **Phase 2: Expand Existing Modules**
1. Update `groups.js` (add messages)
2. Update `messages.js` (add mark read)
3. Update `settings.js` (add privacy, notifications, appearance)
4. Update `mood.js` (add insights, milestones)
5. Update `events.js` (add my-events, unregister)
6. Update `meditations.js` (add daily quote)
7. Update `notifications.js` (add read-all)

### **Phase 3: Handle Legacy Files**
1. Check if `appointments.js`, `goals.js`, `therapists.js`, `uploads.js` are still needed
2. Update or remove as necessary

---

## 📋 **Next Steps:**

1. ✅ Review this analysis with you
2. Create new module files
3. Expand existing module files
4. Update barrel export (`index.js`)
5. Document each module with JSDoc comments
6. Test endpoints

---

**Ready to proceed with implementation?** 🚀
