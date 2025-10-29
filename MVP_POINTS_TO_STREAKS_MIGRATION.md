# MVP: Points System → Streak Milestones Migration

## Overview
In MVP, we're deferring the instant points reward system and focusing on **streak-based milestones** (7, 14, 30 days). Points will be awarded at milestones and can be redeemed for rewards (therapy discounts, free sessions, subscriptions, etc.).

---

## ✅ Changes Completed

### 1. **TodayMoodScreen.tsx** - Daily Check-in
**Changes:**
- ❌ Removed "+500 points" indicator from reflection card
- ❌ Removed "points earned" chip from "Today's Mood" summary
- ❌ Commented out `dispatch(addPoints(pointsEarned))`
- ✅ Set `pointsEarned: 0` in new entries
- ✅ Added streak milestones: `[7, 14, 30]` days
- ✅ Added progress bar showing progress to next milestone
- ✅ Rephrased button: "Log My Mood & Earn Points" → **"Log My Mood"**
- ✅ Updated helper text: "Keep your streak going! Rewards unlock at 7, 14, and 30 days."
- ✅ Success alert shows streak count + milestone celebration (🎁) at 7/14/30 days

**UI Changes:**
- Reflection card footer: Character count + Progress bar + "Next reward: X days"
- Progress bar: Blue fill based on `(currentStreak / nextMilestone) * 100%`
- Clean, motivational UI without points clutter

---

### 2. **MoodScreen.tsx** - Mood Tracker Hub
**Changes:**
- ✅ Updated subtitle: "Track your feelings and earn points" → **"Build your wellness streak"**
- ✅ Hidden "Points" stat card (commented out)
- ✅ Hidden "Loyalty Points" action card (commented out)
- ✅ Set `showPoints={false}` on TodayMoodSummaryCard
- ✅ Kept "Day Streak" and "Check-ins" stat cards visible

**UI Changes:**
- Quick Stats Row now shows: **Streak** | ~~Points~~ | **Check-ins**
- Wellness Resources section: ~~Loyalty Points~~ removed

---

### 3. **HomeScreen.tsx** - Dashboard
**Status:**
- ✅ Already had `showPoints={false}` on TodayMoodSummaryCard
- ✅ No points references found - no changes needed

---

## 🔄 Screens Still Referencing Points (Commented/Hidden)

### 4. **MoodPointsScreen.tsx** (46 matches)
**Current State:** Full points/redemption system
**Recommendation:** 
- Keep screen but show "Coming Soon" placeholder
- Or rename to "Streak Rewards" and show milestone progress
- Hide navigation to this screen for now

### 5. **MoodHistoryScreen.tsx** (7 matches)
**Current State:** Shows points earned per mood entry
**Recommendation:**
- Hide points column in history
- Show only: Date, Mood, Note, Streak contribution

### 6. **WeeklyReportScreen.tsx** (15 matches)
**Current State:** Shows weekly points summary
**Recommendation:**
- Replace points metrics with streak metrics
- Show: "Longest streak this week", "Check-ins completed"

### 7. **WellnessVaultScreen.tsx** (10 matches)
**Current State:** Shows reward points in cash
**Recommendation:**
- Already handled in previous session (Vault Funding Channels commented out)
- May reference points in transactions - audit needed

### 8. **TransactionHistoryScreen.tsx** (2 matches)
**Current State:** May show points transactions
**Recommendation:**
- Filter out points transactions or show as "Pending milestone rewards"

---

## 📋 Implementation Strategy

### Phase 1: Hide Points UI (✅ DONE)
- [x] TodayMoodScreen - Remove points, add streak progress
- [x] MoodScreen - Hide points cards
- [x] HomeScreen - Verify no points shown

### Phase 2: Update Related Screens (PENDING)
- [ ] MoodPointsScreen - Show "Milestone Rewards Coming Soon" placeholder
- [ ] MoodHistoryScreen - Hide points column
- [ ] WeeklyReportScreen - Replace points with streak metrics
- [ ] TodayMoodScreen StatsHeader - Hide/rename "Redeem" button

### Phase 3: Backend Preparation (FUTURE)
- [ ] API: Store milestones reached (7, 14, 30 days)
- [ ] API: Award points at milestones
- [ ] API: Redemption system for milestone rewards
- [ ] Define reward catalog (discounts, free sessions, etc.)

---

## 🎯 Milestone Reward System (Future)

### Milestones
- **7 days:** Small reward (e.g., 500 points, 10% therapy discount)
- **14 days:** Medium reward (e.g., 1000 points, 20% discount, or 1 free group session)
- **30 days:** Large reward (e.g., 2500 points, 1 free therapy session, or 1 month free subscription)

### Redemption Options
- Therapy session discounts (10%, 20%, 50%)
- Free therapy sessions
- Free group session access
- Premium subscription (1 month, 3 months)
- Wellness vault credits

---

## 🔧 Technical Notes

### Streak Calculation
```typescript
const MILESTONES = [7, 14, 30];
const nextMilestone = MILESTONES.find(m => m > currentStreak) || 30;
const streakProgressPercent = Math.floor((currentStreak / nextMilestone) * 100);
```

### Milestone Detection
```typescript
// In handleMoodSubmit success alert
${currentStreak + 1 === 7 || currentStreak + 1 === 14 || currentStreak + 1 === 30 
  ? '\n\n🎁 Milestone reached! Check your rewards.' 
  : ''}
```

### Redux State
- `pointsEarned: 0` in new mood entries (deferred until milestones)
- `dispatch(addPoints())` commented out
- `dispatch(incrementStreak())` still active

---

## 📱 User Experience

### Before (Points System)
- User checks in → Instant +500 points
- Points accumulate daily
- Redeem anytime for rewards
- Focus on points balance

### After (Streak Milestones)
- User checks in → Streak increments
- Progress bar shows next milestone
- Rewards unlock at 7, 14, 30 days
- Focus on consistency and streaks
- Milestone celebration when reached

---

## 🚀 Next Steps

1. **Test current changes:**
   - Verify TodayMoodScreen shows streak progress
   - Verify MoodScreen hides points
   - Test milestone celebration at 7/14/30 days

2. **Update remaining screens:**
   - MoodPointsScreen → "Streak Rewards (Coming Soon)"
   - MoodHistoryScreen → Hide points column
   - WeeklyReportScreen → Streak metrics

3. **Backend integration:**
   - API endpoints for milestone tracking
   - Reward catalog definition
   - Redemption flow

---

## 📝 Summary

**Completed:**
- ✅ TodayMoodScreen: Points removed, streak progress added
- ✅ MoodScreen: Points cards hidden
- ✅ HomeScreen: Already clean (no changes needed)

**Pending:**
- 🔄 MoodPointsScreen, MoodHistoryScreen, WeeklyReportScreen
- 🔄 StatsHeader "Redeem" button handling

**Philosophy:**
- MVP focuses on building healthy habits (streaks)
- Rewards come at meaningful milestones (7, 14, 30 days)
- Points system deferred but not removed (easy to re-enable)
- User motivation shifts from instant gratification to long-term consistency
