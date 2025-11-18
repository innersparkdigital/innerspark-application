# UI to Endpoint Mapping - Complete Audit

## 🎯 Purpose
Map every UI element in mood screens to the exact API endpoint fields needed.

---

## 📱 MoodScreen.tsx

### **UI Elements Displayed:**

1. **Streak Card**
   - Icon: Fire 🔥
   - Value: `{currentStreak}` (e.g., "7")
   - Label: "Day Streak"
   - **Source:** `selectMoodStats().currentStreak`

2. **Check-ins Card**
   - Icon: Calendar 📅
   - Value: `{totalCheckIns}` (e.g., "15")
   - Label: "Check-ins"
   - **Source:** `selectMoodStats().totalCheckIns`

3. **Points Card** (HIDDEN in MVP)
   - Commented out (lines 236-244)
   - Would show: `{totalPoints}`
   - **Source:** `selectMoodStats().totalPoints`

4. **Today's Mood Summary** (if checked in)
   - Mood emoji
   - Mood label
   - Note text
   - Timestamp
   - Points earned (hidden via `showPoints={false}`)
   - **Source:** `selectTodayMoodData()`

### **Required Endpoint Fields:**

#### **GET `/api/v1/client/mood/today`**
```json
{
  "success": true,
  "data": {
    "hasCheckedIn": true,
    "todayMood": {
      "id": "...",
      "mood": "Good",           // ← For summary card
      "emoji": "😊",            // ← For summary card
      "moodValue": 2,
      "note": "...",            // ← For summary card
      "pointsEarned": 0,        // ← Hidden but still needed
      "timestamp": "...",       // ← For "Logged at X" time
      "date": "2025-10-23"
    },
    "stats": {
      "currentStreak": 7,       // ← For streak card
      "totalPoints": 0,         // ← For points card (hidden)
      "totalCheckIns": 45,      // ← For check-ins card ✅ CRITICAL
      "milestonesReached": 1,
      "nextMilestone": 14
    }
  }
}
```

---

## 📱 TodayMoodScreen.tsx

### **UI Elements Displayed:**

1. **Stats Header (3 cards):**
   
   a. **Streak Card**
   - Icon: Fire 🔥
   - Value: `{currentStreak}` (e.g., "7")
   - Label: "Day Streak"
   
   b. **Milestones Card**
   - Icon: Trophy 🏆
   - Value: `{milestonesReached}/3` (e.g., "1/3", "2/3", "3/3")
   - Label: "Milestones"
   - **Calculation:** 
     ```typescript
     currentStreak >= 30 ? '3/3' : 
     currentStreak >= 14 ? '2/3' : 
     currentStreak >= 7 ? '1/3' : '0/3'
     ```
   
   c. **History Button**
   - Icon: History 🕐
   - Value: "View"
   - Label: "History"

2. **Streak Progress Bar**
   - Shows progress to next milestone
   - Text: "Next reward: X days"
   - **Calculation:**
     ```typescript
     const MILESTONES = [7, 14, 30];
     const nextMilestone = MILESTONES.find(m => m > currentStreak) || 30;
     const streakProgressPercent = (currentStreak / nextMilestone) * 100;
     ```

3. **Today's Mood Card** (after check-in)
   - Title: "Today's Mood"
   - Time: "Logged at 3:45 PM"
   - Emoji: Large mood emoji
   - Label: Mood name
   - Note: User's reflection text
   - **NO POINTS DISPLAYED** (removed in MVP)

### **Required Endpoint Fields:**

#### **GET `/api/v1/client/mood/today`**
```json
{
  "success": true,
  "data": {
    "hasCheckedIn": true,
    "todayMood": {
      "id": "...",
      "mood": "Good",           // ← For mood label
      "emoji": "😊",            // ← For large emoji display
      "moodValue": 2,
      "note": "...",            // ← For reflection text
      "pointsEarned": 0,        // ← Not displayed but in data
      "timestamp": "...",       // ← For "Logged at X:XX PM"
      "date": "2025-10-23"
    },
    "stats": {
      "currentStreak": 7,       // ← For streak card & progress bar ✅
      "totalPoints": 0,         // ← Not displayed
      "totalCheckIns": 45,      // ← Not displayed on this screen
      "milestonesReached": 1,   // ← For milestones card ✅ CRITICAL
      "nextMilestone": 14       // ← For progress bar text ✅ CRITICAL
    }
  }
}
```

#### **POST `/api/v1/client/mood`** (After logging mood)
```json
{
  "success": true,
  "message": "Mood logged successfully",
  "data": {
    "moodId": "...",
    "moodLabel": "Good",
    "moodEmoji": "😊",
    "pointsEarned": 0,          // ← Always 0 unless milestone
    "currentStreak": 8,         // ← Updated streak ✅
    "totalPoints": 0,           // ← Or 500/1000/2000 if milestone
    "totalCheckIns": 46,        // ← MUST INCLUDE (incremented) ✅
    "timestamp": "...",
    "isMilestone": false,       // ← True if hit 7/14/30 days ✅
    "nextMilestone": 14,        // ← Days to next reward ✅
    "milestonesReached": 1      // ← 0-3 count ✅
  }
}
```

---

## 📱 MoodHistoryScreen.tsx

### **UI Elements Displayed:**

1. **Period Selector**
   - Tabs: "7 Days", "30 Days", "90 Days"
   - User selects time range

2. **Mood Trend Chart**
   - Line chart with data points
   - X-axis: Dates
   - Y-axis: Mood values (1-5)
   - Shows mood trends over time

3. **Stats Cards**
   - Average Mood: e.g., "3.8"
   - Current Streak: e.g., "7 days"
   - Total Entries: e.g., "25 check-ins"
   - Most Common Mood: e.g., "Good"

4. **Recent Entries List**
   - Date
   - Mood emoji
   - Mood label
   - Note text
   - **NO POINTS** (pointsEarned: 0 in mock data)

### **Required Endpoint Fields:**

#### **GET `/api/v1/client/mood/history?period=7`**
```json
{
  "success": true,
  "data": {
    "entries": [
      {
        "id": "...",
        "date": "2025-10-23",
        "moodValue": 2,         // ← For chart Y-axis ✅
        "moodEmoji": "😊",      // ← For list display ✅
        "moodLabel": "Good",    // ← For list display ✅
        "note": "...",          // ← For list display ✅
        "timestamp": "...",     // ← For chart X-axis ✅
        "pointsEarned": 0       // ← Not displayed
      }
    ],
    "stats": {
      "currentStreak": 7,       // ← For stats card ✅
      "totalPoints": 0,         // ← Not displayed
      "totalCheckIns": 45,      // ← For "Total Entries" card ✅
      "averageMood": 3.8,       // ← For stats card ✅
      "mostCommonMood": "Good", // ← For stats card ✅
      "milestonesReached": 1,
      "nextMilestone": 14
    },
    "insights": [              // ← Optional, for insights section
      {
        "id": 1,
        "title": "Weekly Progress",
        "description": "Your mood has improved 20% this week",
        "icon": "trending-up",
        "color": "#4CAF50",
        "type": "positive"
      }
    ]
  }
}
```

---

## ✅ CRITICAL FIELDS SUMMARY

### **Fields MUST be in ALL mood endpoints:**

1. **currentStreak** - Used everywhere
2. **totalCheckIns** - Displayed on MoodScreen ✅
3. **milestonesReached** - Displayed on TodayMoodScreen ✅
4. **nextMilestone** - Used for progress bar ✅

### **Fields for specific screens:**

#### **MoodScreen:**
- `currentStreak` ✅
- `totalCheckIns` ✅ (CRITICAL - shows "Check-ins 15")
- `totalPoints` (hidden but in state)
- `todayMood.emoji`, `mood`, `note`, `timestamp`

#### **TodayMoodScreen:**
- `currentStreak` ✅
- `milestonesReached` ✅ (CRITICAL - shows "1/3")
- `nextMilestone` ✅ (CRITICAL - shows "Next reward: 7 days")
- `todayMood.emoji`, `mood`, `note`, `timestamp`

#### **MoodHistoryScreen:**
- `currentStreak` ✅
- `totalCheckIns` ✅ (shows as "Total Entries")
- `averageMood` ✅
- `mostCommonMood` ✅
- `entries[]` with `moodValue`, `moodEmoji`, `moodLabel`, `note`, `timestamp`

---

## 🔧 ENDPOINT CORRECTIONS NEEDED

### **1. POST `/api/v1/client/mood` - ADD totalCheckIns**

**Current (INCOMPLETE):**
```json
{
  "data": {
    "currentStreak": 8,
    "totalPoints": 0,
    "isMilestone": false,
    "nextMilestone": 14,
    "milestonesReached": 1
    // MISSING: totalCheckIns
  }
}
```

**Corrected (COMPLETE):**
```json
{
  "data": {
    "currentStreak": 8,
    "totalPoints": 0,
    "totalCheckIns": 46,    // ✅ MUST ADD
    "isMilestone": false,
    "nextMilestone": 14,
    "milestonesReached": 1
  }
}
```

### **2. All endpoints MUST include these in stats:**
```json
"stats": {
  "currentStreak": 7,
  "totalPoints": 0,
  "totalCheckIns": 45,      // ✅ ALWAYS INCLUDE
  "milestonesReached": 1,   // ✅ ALWAYS INCLUDE
  "nextMilestone": 14       // ✅ ALWAYS INCLUDE
}
```

---

## 📊 COMPLETE ENDPOINT REQUIREMENTS

### **GET `/api/v1/client/mood/today`**
✅ Returns: hasCheckedIn, todayMood{}, stats{}
✅ Stats must include: currentStreak, totalCheckIns, milestonesReached, nextMilestone

### **POST `/api/v1/client/mood`**
✅ Returns: moodId, currentStreak, totalPoints, **totalCheckIns**, isMilestone, nextMilestone, milestonesReached

### **GET `/api/v1/client/mood/history`**
✅ Returns: entries[], stats{}, insights[]
✅ Stats must include: currentStreak, totalCheckIns, averageMood, mostCommonMood, milestonesReached, nextMilestone

### **GET `/api/v1/client/mood/milestones`**
✅ Returns: currentStreak, milestonesReached, totalPoints, milestones[], nextMilestone{}

---

## ✅ VERIFICATION CHECKLIST

- [ ] MoodScreen shows correct check-ins count from `totalCheckIns`
- [ ] TodayMoodScreen shows correct milestones (0/3, 1/3, 2/3, 3/3)
- [ ] TodayMoodScreen shows correct "Next reward: X days"
- [ ] MoodHistoryScreen shows correct total entries
- [ ] POST /mood returns updated `totalCheckIns` after logging
- [ ] All endpoints include `milestonesReached` and `nextMilestone`
- [ ] Points are 0 for daily check-ins, only awarded at milestones
- [ ] Streak increments correctly on consecutive days
- [ ] Streak resets to 0 if day is missed

---

**This document maps EVERY UI element to its exact endpoint field. No guessing!** 🎯
