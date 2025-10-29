# Mood Check-ins Count - Endpoint Clarification

## 🔍 What You're Seeing

**MoodScreen Display:**
```
Check-ins: 15
```

**Source:**
- **Redux State:** `state.mood.totalCheckIns`
- **Selector:** `selectMoodStats()` returns `totalCheckIns`
- **Component:** MoodScreen.tsx line 251

---

## 📡 Which Endpoint Provides This?

### **Answer: Multiple Endpoints Return It**

The `totalCheckIns` count comes from the **stats** object in these endpoints:

### **1. GET `/api/v1/client/mood/history`** ✅ PRIMARY
```json
{
  "success": true,
  "data": {
    "entries": [...],
    "stats": {
      "currentStreak": 7,
      "totalPoints": 0,
      "totalCheckIns": 45,  // ← THIS IS IT
      "averageMood": 3.8,
      "mostCommonMood": "Good",
      "milestonesReached": 1,
      "nextMilestone": 14
    }
  }
}
```

### **2. GET `/api/v1/client/mood/today`** ✅ ALSO RETURNS IT
```json
{
  "success": true,
  "data": {
    "hasCheckedIn": true,
    "todayMood": {...},
    "stats": {
      "currentStreak": 7,
      "totalPoints": 0,
      "totalCheckIns": 45,  // ← ALSO HERE
      "milestonesReached": 1,
      "nextMilestone": 14
    }
  }
}
```

### **3. POST `/api/v1/client/mood`** ✅ RETURNS UPDATED COUNT
```json
{
  "success": true,
  "message": "Mood logged successfully",
  "data": {
    "moodId": "1730123456789",
    "moodLabel": "Good",
    "moodEmoji": "😊",
    "pointsEarned": 0,
    "currentStreak": 8,
    "totalPoints": 0,
    // NOTE: Should also return totalCheckIns here!
    "timestamp": "2025-10-23T14:30:00Z",
    "isMilestone": false,
    "nextMilestone": 14,
    "milestonesReached": 1
  }
}
```

---

## 🔧 What `totalCheckIns` Represents

**Definition:** Total number of mood check-ins the user has completed (all-time count)

**NOT the same as:**
- ❌ `currentStreak` - Consecutive days
- ❌ `milestonesReached` - Number of milestones (0-3)
- ❌ Number of entries in history array

**Examples:**
- User checks in 30 days straight → `totalCheckIns: 30`, `currentStreak: 30`
- User misses 2 days, then checks in 10 more → `totalCheckIns: 40`, `currentStreak: 10`
- User has checked in 100 times over 6 months → `totalCheckIns: 100`

---

## 📊 How It's Used in the App

### **MoodScreen.tsx:**
```typescript
const { currentStreak, totalPoints, totalCheckIns } = useSelector(selectMoodStats);

// Display in stats card
<Text style={styles.statValue}>{totalCheckIns}</Text>
<Text style={styles.statLabel}>Check-ins</Text>
```

### **Redux Updates:**
```javascript
// When new mood entry is added
addMoodEntry: (state, action) => {
  state.moodHistory.unshift(action.payload);
  state.totalCheckIns += 1;  // Increment count
}

// When stats are fetched from backend
setMoodStats: (state, action) => {
  const { currentStreak, totalPoints, totalCheckIns } = action.payload;
  state.totalCheckIns = totalCheckIns || state.totalCheckIns;
}
```

---

## ✅ Recommendation: Update POST Endpoint

The POST `/api/v1/client/mood` endpoint should ALSO return `totalCheckIns`:

### **Current Response:**
```json
{
  "success": true,
  "data": {
    "moodId": "1730123456789",
    "currentStreak": 8,
    "totalPoints": 0,
    "isMilestone": false,
    "nextMilestone": 14,
    "milestonesReached": 1
    // MISSING: totalCheckIns
  }
}
```

### **Updated Response:**
```json
{
  "success": true,
  "data": {
    "moodId": "1730123456789",
    "currentStreak": 8,
    "totalPoints": 0,
    "totalCheckIns": 46,  // ADDED: Incremented count
    "isMilestone": false,
    "nextMilestone": 14,
    "milestonesReached": 1
  }
}
```

**Why?**
- Frontend needs to update the count immediately after check-in
- Avoids extra API call to fetch updated stats
- Consistent with other stat fields returned

---

## 🎯 Summary

### **Question:** Where does "Check-ins 15" come from?

**Answer:**
- **Field:** `totalCheckIns`
- **Primary Endpoint:** GET `/api/v1/client/mood/history` (stats object)
- **Also In:** GET `/api/v1/client/mood/today` (stats object)
- **Should Add To:** POST `/api/v1/client/mood` (response data)

### **What It Means:**
- Total number of mood check-ins completed (all-time)
- NOT the same as streak or milestones
- Increments by 1 with each check-in
- Never decreases (even if streak breaks)

### **Backend Logic:**
```sql
-- Simple count query
SELECT COUNT(*) as totalCheckIns 
FROM mood_entries 
WHERE user_id = ?
```

---

**The count comes from the stats object in mood endpoints, and it's the total all-time check-ins!** 📊
