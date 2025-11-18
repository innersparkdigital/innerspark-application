# Client API Refactoring Plan - Align with Postman Collection

**Date:** November 18, 2025  
**Source of Truth:** Postman Collection (`DEV_ARTIFACTS/Client & Auth API Collection.postman_collection.json`)  
**Strategy:** Update existing code to match Postman exactly + Create missing modules + Keep placeholders

---

## 🎯 **Strategy**

1. ✅ **Postman Collection = Correct** (source of truth)
2. ✅ **Update existing files** to match Postman endpoints exactly
3. ✅ **Create missing modules** from Postman collection
4. ✅ **Keep placeholder files** (goals, appointments, therapists) - Backend will add later

---

## 📋 **Work Breakdown**

### **Phase 1: Fix Existing Modules to Match Postman** ⚠️ PRIORITY

#### **1.1 Fix messages.js** 🚨 CRITICAL
**Issue:** Wrong base path

| Current | Postman (Correct) | Action |
|---------|-------------------|--------|
| `/client/messages` | `/client/chats` | ✅ Change all paths |
| `getConversations()` | `getChats()` | ✅ Rename function |
| `getMessages()` | `getChatMessages()` | ✅ Rename function |
| `sendMessage()` | `sendChatMessage()` | ✅ Rename function |
| ❌ Missing | `markChatAsRead()` | ✅ Add new function |

**Parameters to Add:**
- `user_id` to all functions
- `page`, `limit` to `getChatMessages()`
- `content`, `type` to `sendChatMessage()`

---

#### **1.2 Fix groups.js** ⚠️ PARAMETERS
**Issue:** Missing required parameters

| Function | Current Params | Postman Params | Action |
|----------|----------------|----------------|--------|
| `getGroups()` | `filters` | `user_id`, `page`, `limit` | ✅ Add params |
| `getGroupById()` | `groupId` | `groupId`, `user_id` | ✅ Add `user_id` |
| `joinGroup()` | `groupId` | `user_id`, `reason`, `agreeToGuidelines` | ✅ Add params |
| `leaveGroup()` | `groupId`, `reason` | `user_id`, `reason`, `feedback` | ✅ Add params |
| `getMyGroups()` | none | `user_id` | ✅ Add `user_id` |
| `getGroupMessages()` | `groupId`, `page` | `user_id`, `page`, `limit` | ✅ Add params |
| `sendGroupMessage()` | `groupId`, `message` | `user_id`, `content`, `replyTo` | ✅ Fix params |

**Parameter Name Changes:**
- `message` → `content`
- Add `replyTo` (optional)
- Add `agreeToGuidelines` to `joinGroup()`
- Add `feedback` to `leaveGroup()`

---

#### **1.3 Fix mood.js** ⚠️ MISSING FUNCTION
**Issue:** Missing 1 endpoint

| Function | Status | Action |
|----------|--------|--------|
| `getTodayMood()` | ✅ Match | Add `user_id` param |
| `logMood()` | ✅ Match | Verify params: `user_id`, `moodValue`, `note` |
| `getMoodHistory()` | ✅ Match | Add `user_id`, `page`, `limit` params |
| `getMoodMilestones()` | ✅ Match | Add `user_id` param |
| `getMoodInsights()` | ❌ MISSING | **CREATE NEW** |

**New Function:**
```javascript
/**
 * Get mood insights and analytics
 * @param {string} userId - User ID
 * @returns {Promise} Mood insights data
 */
export const getMoodInsights = async (userId) => {
    const response = await APIInstance.get('/client/mood/insights', {
        params: { user_id: userId }
    });
    return response.data;
};
```

---

#### **1.4 Fix events.js** ⚠️ MISSING FUNCTIONS
**Issue:** Missing 2 endpoints

| Function | Status | Action |
|----------|--------|--------|
| `getEvents()` | ✅ Match | Add `page`, `limit` params |
| `getEventById()` | ✅ Match | Keep as-is |
| `registerForEvent()` | ✅ Match | Add `user_id`, `paymentMethod`, `phoneNumber` |
| `unregisterFromEvent()` | ❌ MISSING | **CREATE NEW** |
| `getMyEvents()` | ❌ MISSING | **CREATE NEW** |

**New Functions:**
```javascript
/**
 * Unregister from event
 * @param {string} eventId - Event ID
 * @param {string} userId - User ID
 * @returns {Promise} Unregister confirmation
 */
export const unregisterFromEvent = async (eventId, userId) => {
    const response = await APIInstance.delete(`/client/events/${eventId}/unregister`, {
        params: { user_id: userId }
    });
    return response.data;
};

/**
 * Get user's registered events
 * @param {string} userId - User ID
 * @returns {Promise} User's events list
 */
export const getMyEvents = async (userId) => {
    const response = await APIInstance.get('/client/events/my-events', {
        params: { user_id: userId }
    });
    return response.data;
};
```

---

#### **1.5 Fix meditations.js** ⚠️ MISSING FUNCTIONS
**Issue:** Missing 2 endpoints

| Function | Status | Action |
|----------|--------|--------|
| `getMeditationArticles()` | ✅ Match | Add `page`, `limit` params |
| `getMeditationSounds()` | ✅ Match | Add `page`, `limit` params |
| `getMeditationQuotes()` | ✅ Match | Add `page`, `limit` params |
| `getArticleById()` | ❌ MISSING | **CREATE NEW** |
| `getDailyQuote()` | ❌ MISSING | **CREATE NEW** |

**New Functions:**
```javascript
/**
 * Get meditation article by ID
 * @param {string} articleId - Article ID
 * @returns {Promise} Article details
 */
export const getArticleById = async (articleId) => {
    const response = await APIInstance.get(`/client/meditations/articles/${articleId}`);
    return response.data;
};

/**
 * Get daily quote
 * @param {string} userId - User ID
 * @returns {Promise} Daily quote
 */
export const getDailyQuote = async (userId) => {
    const response = await APIInstance.get('/client/meditations/quotes/daily', {
        params: { user_id: userId }
    });
    return response.data;
};
```

---

#### **1.6 Fix settings.js** ⚠️ MISSING FUNCTIONS
**Issue:** Missing 6 endpoints

| Function | Status | Action |
|----------|--------|--------|
| `getUserSettings()` | ✅ Match | Add `user_id` param |
| `getAppearanceSettings()` | ✅ Match | Add `user_id` param |
| `updateAppearanceSettings()` | ✅ Match | Add `user_id` to body |
| `updatePrivacySettings()` | ✅ Match | Add `user_id` to body |
| `getPrivacySettings()` | ❌ MISSING | **CREATE NEW** |
| `getNotificationSettings()` | ❌ MISSING | **CREATE NEW** |
| `updateNotificationSettings()` | ❌ MISSING | **CREATE NEW** |
| `changePassword()` | ❌ MISSING | **CREATE NEW** |

**New Functions:**
```javascript
/**
 * Get privacy settings
 * @param {string} userId - User ID
 * @returns {Promise} Privacy settings
 */
export const getPrivacySettings = async (userId) => {
    const response = await APIInstance.get('/client/settings/privacy', {
        params: { user_id: userId }
    });
    return response.data;
};

/**
 * Get notification settings
 * @param {string} userId - User ID
 * @returns {Promise} Notification settings
 */
export const getNotificationSettings = async (userId) => {
    const response = await APIInstance.get('/client/settings/notifications', {
        params: { user_id: userId }
    });
    return response.data;
};

/**
 * Update notification settings
 * @param {string} userId - User ID
 * @param {Object} settings - { emailNotifications, pushNotifications }
 * @returns {Promise} Updated settings
 */
export const updateNotificationSettings = async (userId, settings) => {
    const response = await APIInstance.put('/client/settings/notifications', {
        user_id: userId,
        ...settings
    });
    return response.data;
};

/**
 * Change password
 * @param {string} userId - User ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @param {string} confirmPassword - Confirm new password
 * @returns {Promise} Success message
 */
export const changePassword = async (userId, currentPassword, newPassword, confirmPassword) => {
    const response = await APIInstance.put('/client/settings/password', {
        user_id: userId,
        currentPassword,
        newPassword,
        confirmPassword
    });
    return response.data;
};
```

---

#### **1.7 Fix dashboard.js** ⚠️ PARAMETERS
**Issue:** Wrong parameter name

| Function | Current | Postman | Action |
|----------|---------|---------|--------|
| `getDashboardData()` | `userId` param | `user_id` param | ✅ Change param name |

---

#### **1.8 Fix notifications.js** ✅ ALREADY GOOD
**Status:** Already has all 3 functions, just verify parameters

| Function | Status | Action |
|----------|--------|--------|
| `getNotifications()` | ✅ Good | Verify params |
| `markNotificationAsRead()` | ✅ Good | Add `user_id` to body |
| `markAllNotificationsAsRead()` | ✅ Good | Add `user_id` to body |

---

### **Phase 2: Create Missing Modules from Postman** ❌ NEW

#### **2.1 Create wallet.js** (4 functions)
```javascript
/**
 * Topup wallet
 * @param {string} userId - User ID
 * @param {number} amount - Amount to topup
 * @param {string} phoneNumber - Phone number
 * @param {string} network - Mobile money network
 * @returns {Promise} Topup transaction
 */
export const topupWallet = async (userId, amount, phoneNumber, network) => {
    const response = await APIInstance.post('/client/wallet/topup', {
        user_id: userId,
        amount,
        phoneNumber,
        network
    });
    return response.data;
};

/**
 * Payout from wallet
 * @param {string} userId - User ID
 * @param {number} amount - Amount to payout
 * @param {string} phoneNumber - Phone number
 * @param {string} network - Mobile money network
 * @returns {Promise} Payout transaction
 */
export const payoutWallet = async (userId, amount, phoneNumber, network) => {
    const response = await APIInstance.post('/client/wallet/payout', {
        user_id: userId,
        amount,
        phoneNumber,
        network
    });
    return response.data;
};

/**
 * Get wallet transactions
 * @param {string} userId - User ID
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise} Transactions list
 */
export const getWalletTransactions = async (userId, page = 1, limit = 20) => {
    const response = await APIInstance.get('/client/wallet/transactions', {
        params: { user_id: userId, page, limit }
    });
    return response.data;
};

/**
 * Get wallet transaction by ID
 * @param {string} transactionId - Transaction ID
 * @param {string} userId - User ID
 * @returns {Promise} Transaction details
 */
export const getWalletTransaction = async (transactionId, userId) => {
    const response = await APIInstance.get(`/client/wallet/transactions/${transactionId}`, {
        params: { user_id: userId }
    });
    return response.data;
};
```

---

#### **2.2 Create journal.js** (4 functions)
```javascript
/**
 * Get journal entries
 * @param {string} userId - User ID
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise} Journal entries list
 */
export const getJournalEntries = async (userId, page = 1, limit = 20) => {
    const response = await APIInstance.get('/client/journal/entries', {
        params: { user_id: userId, page, limit }
    });
    return response.data;
};

/**
 * Create journal entry
 * @param {string} userId - User ID
 * @param {string} title - Entry title
 * @param {string} content - Entry content
 * @param {string} mood - Associated mood
 * @param {string} date - Entry date
 * @returns {Promise} Created entry
 */
export const createJournalEntry = async (userId, title, content, mood, date) => {
    const response = await APIInstance.post('/client/journal/entries', {
        user_id: userId,
        title,
        content,
        mood,
        date
    });
    return response.data;
};

/**
 * Update journal entry
 * @param {string} entryId - Entry ID
 * @param {string} userId - User ID
 * @param {string} title - Entry title
 * @param {string} content - Entry content
 * @returns {Promise} Updated entry
 */
export const updateJournalEntry = async (entryId, userId, title, content) => {
    const response = await APIInstance.put(`/client/journal/entries/${entryId}`, {
        user_id: userId,
        title,
        content
    });
    return response.data;
};

/**
 * Delete journal entry
 * @param {string} entryId - Entry ID
 * @param {string} userId - User ID
 * @returns {Promise} Success message
 */
export const deleteJournalEntry = async (entryId, userId) => {
    const response = await APIInstance.delete(`/client/journal/entries/${entryId}`, {
        params: { user_id: userId }
    });
    return response.data;
};
```

---

#### **2.3 Create emergency.js** (6 functions)
```javascript
/**
 * Get emergency contacts
 * @param {string} userId - User ID
 * @returns {Promise} Emergency contacts list
 */
export const getEmergencyContacts = async (userId) => {
    const response = await APIInstance.get('/client/emergency/contacts', {
        params: { user_id: userId }
    });
    return response.data;
};

/**
 * Add emergency contact
 * @param {string} userId - User ID
 * @param {string} name - Contact name
 * @param {string} relationship - Relationship to user
 * @param {string} phoneNumber - Contact phone number
 * @param {string} email - Contact email
 * @param {boolean} isPrimary - Is primary contact
 * @returns {Promise} Created contact
 */
export const addEmergencyContact = async (userId, name, relationship, phoneNumber, email, isPrimary) => {
    const response = await APIInstance.post('/client/emergency/contacts', {
        user_id: userId,
        name,
        relationship,
        phoneNumber,
        email,
        isPrimary
    });
    return response.data;
};

/**
 * Delete emergency contact
 * @param {string} contactId - Contact ID
 * @param {string} userId - User ID
 * @returns {Promise} Success message
 */
export const deleteEmergencyContact = async (contactId, userId) => {
    const response = await APIInstance.delete(`/client/emergency/contacts/${contactId}`, {
        params: { user_id: userId }
    });
    return response.data;
};

/**
 * Get safety plan
 * @param {string} userId - User ID
 * @returns {Promise} Safety plan
 */
export const getSafetyPlan = async (userId) => {
    const response = await APIInstance.get('/client/emergency/safety-plan', {
        params: { user_id: userId }
    });
    return response.data;
};

/**
 * Update safety plan
 * @param {string} userId - User ID
 * @param {Object} planData - Safety plan data
 * @returns {Promise} Updated safety plan
 */
export const updateSafetyPlan = async (userId, planData) => {
    const response = await APIInstance.put('/client/emergency/safety-plan', {
        user_id: userId,
        ...planData
    });
    return response.data;
};

/**
 * Get crisis lines
 * @param {string} userId - User ID
 * @returns {Promise} Crisis lines list
 */
export const getCrisisLines = async (userId) => {
    const response = await APIInstance.get('/client/emergency/crisis-lines', {
        params: { user_id: userId }
    });
    return response.data;
};
```

---

#### **2.4 Create subscriptions.js** (4 functions)
```javascript
/**
 * Get subscription plans
 * @param {string} userId - User ID
 * @returns {Promise} Available plans
 */
export const getPlans = async (userId) => {
    const response = await APIInstance.get('/client/subscriptions/plans', {
        params: { user_id: userId }
    });
    return response.data;
};

/**
 * Subscribe to plan
 * @param {string} userId - User ID
 * @param {string} planId - Plan ID
 * @param {string} billingCycle - Billing cycle (monthly, yearly, etc.)
 * @param {string} paymentMethod - Payment method (wallet, card, etc.)
 * @param {string} phoneNumber - Phone number for mobile money
 * @returns {Promise} Subscription confirmation
 */
export const subscribe = async (userId, planId, billingCycle, paymentMethod, phoneNumber) => {
    const response = await APIInstance.post('/client/subscriptions/subscribe', {
        user_id: userId,
        planId,
        billingCycle,
        paymentMethod,
        phoneNumber
    });
    return response.data;
};

/**
 * Get current subscription
 * @param {string} userId - User ID
 * @returns {Promise} Current subscription details
 */
export const getCurrentSubscription = async (userId) => {
    const response = await APIInstance.get('/client/subscriptions/current', {
        params: { user_id: userId }
    });
    return response.data;
};

/**
 * Get billing history
 * @param {string} userId - User ID
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise} Billing history
 */
export const getBillingHistory = async (userId, page = 1, limit = 20) => {
    const response = await APIInstance.get('/client/billing/history', {
        params: { user_id: userId, page, limit }
    });
    return response.data;
};
```

---

#### **2.5 Create account.js** (3 functions)
```javascript
/**
 * Request data export
 * @param {string} userId - User ID
 * @param {string} format - Export format (json, csv, etc.)
 * @param {Array} categories - Data categories to export
 * @returns {Promise} Export request confirmation
 */
export const requestDataExport = async (userId, format, categories) => {
    const response = await APIInstance.post('/client/data/export', {
        user_id: userId,
        format,
        categories
    });
    return response.data;
};

/**
 * Deactivate account
 * @param {string} userId - User ID
 * @returns {Promise} Deactivation confirmation
 */
export const deactivateAccount = async (userId) => {
    const response = await APIInstance.post('/client/account/deactivate', {
        user_id: userId
    });
    return response.data;
};

/**
 * Delete account permanently
 * @param {string} userId - User ID
 * @param {string} reason - Deletion reason
 * @returns {Promise} Deletion confirmation
 */
export const deleteAccount = async (userId, reason) => {
    const response = await APIInstance.post('/client/account/delete', {
        user_id: userId,
        reason
    });
    return response.data;
};
```

---

#### **2.6 Create profile.js** (2 functions)
```javascript
/**
 * Get user profile
 * @param {string} userId - User ID
 * @returns {Promise} User profile
 */
export const getProfile = async (userId) => {
    const response = await APIInstance.get('/client/profile', {
        params: { user_id: userId }
    });
    return response.data;
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @param {string} phoneNumber - Phone number
 * @param {string} bio - Biography
 * @returns {Promise} Updated profile
 */
export const updateProfile = async (userId, firstName, lastName, phoneNumber, bio) => {
    const response = await APIInstance.put('/client/profile', {
        user_id: userId,
        firstName,
        lastName,
        phoneNumber,
        bio
    });
    return response.data;
};
```

---

### **Phase 3: Keep Placeholder Files** ✅ NO CHANGES

**Files to Keep As-Is:**
1. ✅ `goals.js` - Backend will add later
2. ✅ `appointments.js` - Backend will add later
3. ✅ `therapists.js` - Backend will add later
4. ✅ `uploads.js` - Utility, keep as-is

**Reason:** More endpoints coming from backend team

---

### **Phase 4: Update Barrel Export** (index.js)

Add new modules to exports:
```javascript
// ... existing exports ...

// Wallet
export * from './wallet';

// Journal
export * from './journal';

// Emergency
export * from './emergency';

// Subscriptions
export * from './subscriptions';

// Account
export * from './account';

// Profile
export * from './profile';
```

---

## 📊 **Summary of Changes**

| Phase | Files | Functions | Status |
|-------|-------|-----------|--------|
| **Phase 1: Fix Existing** | 8 files | ~30 fixes + 16 new | ⚠️ Update |
| **Phase 2: Create New** | 6 files | 23 new | ❌ Create |
| **Phase 3: Keep Placeholders** | 4 files | 9 existing | ✅ No change |
| **Phase 4: Update Export** | 1 file | - | ⚠️ Update |

**Total Work:**
- Files to update: 8
- Files to create: 6
- New functions to add: 39
- Functions to fix: ~30
- Placeholder files to keep: 4

---

## ✅ **Implementation Order**

1. **Fix messages.js** (critical - wrong path)
2. **Fix groups.js** (most parameter fixes)
3. **Create new modules** (wallet, journal, emergency, subscriptions, account, profile)
4. **Fix remaining modules** (mood, events, meditations, settings, dashboard, notifications)
5. **Update index.js** barrel export
6. **Test all endpoints**

---

**Ready to start? Which phase should I begin with?** 🚀
