# Client API Testing Guide

**Date:** November 18, 2025  
**Purpose:** How to test the refactored client API

---

## 🎯 **Quick Testing Methods**

### **Method 1: Use Postman Collection** ⭐ **EASIEST**

1. **Open Postman**
2. **Import Collection:**
   - File → Import
   - Select `DEV_ARTIFACTS/Client & Auth API Collection.postman_collection.json`

3. **Set Variables:**
   ```
   baseUrl: http://127.0.0.1:5000 (or your backend URL)
   x_api_key: <your-api-key>
   user_id: <test-user-id>
   ```

4. **Test Each Endpoint:**
   - Click through each client endpoint
   - Verify responses
   - Check for errors

**Benefits:**
- ✅ No code needed
- ✅ Visual interface
- ✅ Can save responses
- ✅ Easy debugging

---

### **Method 2: React Native Test Screen** 🧪

Create a temporary screen for testing:

**File:** `src/screens/DevTestScreen.js`

```javascript
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { testAllGetEndpoints } from '../api/client/__tests__/clientApiTest';

const DevTestScreen = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const userId = useSelector(state => state.user.userDetails.userId);

  const runTests = async () => {
    setLoading(true);
    const testResults = await testAllGetEndpoints(userId);
    setResults(testResults);
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Client API Test Screen</Text>
      <Text style={styles.subtitle}>User ID: {userId}</Text>

      <TouchableOpacity 
        style={styles.button} 
        onPress={runTests}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Testing...' : 'Run All GET Tests'}
        </Text>
      </TouchableOpacity>

      {results && (
        <View style={styles.results}>
          <Text style={styles.resultTitle}>Results:</Text>
          <Text style={styles.passed}>
            ✅ Passed: {results.passed.length}
          </Text>
          <Text style={styles.failed}>
            ❌ Failed: {results.failed.length}
          </Text>
          
          {results.failed.length > 0 && (
            <View style={styles.failedList}>
              <Text style={styles.failedTitle}>Failed Tests:</Text>
              {results.failed.map((item, index) => (
                <Text key={index} style={styles.failedItem}>
                  • {item.name}: {item.error}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  button: { 
    backgroundColor: '#007AFF', 
    padding: 15, 
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  results: { marginTop: 20, padding: 15, backgroundColor: '#f5f5f5', borderRadius: 8 },
  resultTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  passed: { fontSize: 16, color: 'green', marginBottom: 5 },
  failed: { fontSize: 16, color: 'red', marginBottom: 10 },
  failedList: { marginTop: 10 },
  failedTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 5 },
  failedItem: { fontSize: 12, color: '#333', marginBottom: 3 },
});

export default DevTestScreen;
```

**Register in Navigator:**
```javascript
// In your stack navigator
<Stack.Screen name="DevTestScreen" component={DevTestScreen} />
```

**Navigate to it:**
```javascript
navigation.navigate('DevTestScreen');
```

---

### **Method 3: Console Testing** 🖥️

Test directly in a screen's `useEffect`:

```javascript
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getTodayMood, getProfile, getGroups } from '../api/client';

const TestInExistingScreen = () => {
  const userId = useSelector(state => state.user.userDetails.userId);

  useEffect(() => {
    const testAPI = async () => {
      console.log('🧪 Testing Client API...');

      try {
        // Test 1: Get Profile
        console.log('Testing getProfile...');
        const profile = await getProfile(userId);
        console.log('✅ Profile:', profile);

        // Test 2: Get Today's Mood
        console.log('Testing getTodayMood...');
        const mood = await getTodayMood(userId);
        console.log('✅ Mood:', mood);

        // Test 3: Get Groups
        console.log('Testing getGroups...');
        const groups = await getGroups(userId, 1, 5);
        console.log('✅ Groups:', groups);

      } catch (error) {
        console.error('❌ Test failed:', error.message);
      }
    };

    testAPI();
  }, [userId]);

  return (
    // Your existing screen JSX
  );
};
```

---

### **Method 4: Test Individual Endpoints** 🎯

Test one function at a time:

```javascript
import { getProfile } from '../api/client';

// In your component
const handleTestProfile = async () => {
  try {
    const userId = '12345'; // Your test user ID
    const data = await getProfile(userId);
    console.log('Profile data:', data);
    Alert.alert('Success', 'Profile loaded!');
  } catch (error) {
    console.error('Error:', error);
    Alert.alert('Error', error.message);
  }
};

// In JSX
<Button title="Test Get Profile" onPress={handleTestProfile} />
```

---

## 📋 **Testing Checklist**

### **1. Safe GET Endpoints** ✅ (Test freely)
```javascript
// Dashboard
- getDashboardData(userId)

// Profile
- getProfile(userId)

// Mood
- getTodayMood(userId)
- getMoodHistory(userId, period, page, limit)
- getMoodInsights(userId)
- getMoodMilestones(userId)

// Groups
- getGroups(userId, page, limit)
- getMyGroups(userId)
- getGroupById(groupId, userId)
- getGroupMessages(groupId, userId, page, limit)

// Messages
- getChats(userId)
- getChatMessages(chatId, userId, page, limit)

// Events
- getEvents(page, limit)
- getEventById(eventId)
- getMyEvents(userId)

// Meditations
- getMeditationArticles(page, limit)
- getArticleById(articleId)
- getMeditationSounds(page, limit)
- getMeditationQuotes(page, limit)
- getDailyQuote(userId)

// Wallet
- getWalletTransactions(userId, page, limit)
- getWalletTransaction(transactionId, userId)

// Journal
- getJournalEntries(userId, page, limit)

// Emergency
- getEmergencyContacts(userId)
- getSafetyPlan(userId)
- getCrisisLines(userId)

// Subscriptions
- getPlans(userId)
- getCurrentSubscription(userId)
- getBillingHistory(userId, page, limit)

// Settings
- getUserSettings(userId)
- getPrivacySettings(userId)
- getNotificationSettings(userId)
- getAppearanceSettings(userId)
```

### **2. Write Endpoints** ⚠️ (Test carefully)
```javascript
// Mood
- logMood(userId, moodValue, note)

// Journal
- createJournalEntry(userId, title, content, mood, date)
- updateJournalEntry(entryId, userId, title, content)

// Groups
- joinGroup(groupId, userId, reason, agreeToGuidelines)
- sendGroupMessage(groupId, userId, content, replyTo)

// Messages
- sendChatMessage(chatId, userId, content, type)
- markChatAsRead(chatId, userId)

// Emergency
- addEmergencyContact(userId, name, relationship, phoneNumber, email, isPrimary)
- updateSafetyPlan(userId, planData)
```

### **3. Destructive Endpoints** 🚨 (DON'T test in production!)
```javascript
// Journal
- deleteJournalEntry(entryId, userId)

// Groups
- leaveGroup(groupId, userId, reason, feedback)

// Emergency
- deleteEmergencyContact(contactId, userId)

// Events
- unregisterFromEvent(eventId, userId)

// Account (VERY DANGEROUS!)
- deactivateAccount(userId)
- deleteAccount(userId, reason)
```

---

## 🔍 **What to Check**

### **1. Function Signature**
```javascript
// ✅ Correct
const data = await getProfile(userId);

// ❌ Wrong (old way)
const data = await getProfile(); // Missing userId
```

### **2. Response Structure**
```javascript
const data = await getProfile(userId);
console.log(data); // Should be response.data (already handled)

// Check structure
if (data.firstName && data.lastName) {
  console.log('✅ Profile structure correct');
} else {
  console.log('❌ Unexpected response structure');
}
```

### **3. Error Handling**
```javascript
try {
  const data = await getProfile(userId);
  // Success
} catch (error) {
  // Check error types
  if (error.response) {
    console.log('Backend error:', error.response.status);
  } else if (error.request) {
    console.log('Network error');
  } else {
    console.log('Other error:', error.message);
  }
}
```

### **4. Pagination**
```javascript
// Test pagination works
const page1 = await getGroups(userId, 1, 5);
const page2 = await getGroups(userId, 2, 5);

console.log('Page 1:', page1);
console.log('Page 2:', page2);
// Should have different data
```

---

## 🐛 **Common Issues & Fixes**

### **Issue 1: "user_id is required"**
```javascript
// ❌ Wrong
const data = await getProfile();

// ✅ Correct
const userId = useSelector(state => state.user.userDetails.userId);
const data = await getProfile(userId);
```

### **Issue 2: "Network request failed"**
- Check backend is running
- Check API URL in `LHAPI.js`
- Check `x-api-key` header

### **Issue 3: "401 Unauthorized"**
- Check `x-api-key` is valid
- Check user is logged in
- Check token hasn't expired

### **Issue 4: "404 Not Found"**
- Endpoint path might be wrong
- Backend might not have implemented this endpoint yet
- Check Postman collection for correct path

---

## 📊 **Expected Test Results**

### **If Backend is Running:**
```
✅ Most GET endpoints should work
⚠️ Some might return empty arrays (no data yet)
✅ Should see response.data structure
```

### **If Backend is NOT Running:**
```
❌ All endpoints will fail with "Network Error"
```

### **If Backend is Missing Endpoints:**
```
❌ Will get 404 Not Found
✅ Other endpoints should still work
```

---

## 🚀 **Quick Test Command**

Run this in your app to test all GET endpoints:

```javascript
// In any screen component
import { testAllGetEndpoints } from '../api/client/__tests__/clientApiTest';
import { useSelector } from 'react-redux';

const YourScreen = () => {
  const userId = useSelector(state => state.user.userDetails.userId);

  const handleQuickTest = async () => {
    const results = await testAllGetEndpoints(userId);
    console.log('Test Results:', results);
  };

  return (
    <Button title="Quick API Test" onPress={handleQuickTest} />
  );
};
```

---

## ✅ **Testing Complete When:**

- [ ] All GET endpoints return data (or expected empty arrays)
- [ ] No 404 errors (backend has all endpoints)
- [ ] No 401 errors (authentication works)
- [ ] Parameters are correct (user_id, page, limit, etc.)
- [ ] Response structure is as expected
- [ ] Error handling works properly
- [ ] Pagination works
- [ ] Write endpoints create data successfully
- [ ] No function signature errors

---

**Happy Testing!** 🎉
