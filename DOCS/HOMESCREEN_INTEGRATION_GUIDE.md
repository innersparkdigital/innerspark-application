# HomeScreen Integration Guide

## ✅ Components Created

1. **EmptySessionsCard.tsx** - Empty state for no sessions
2. **SessionCard.tsx** - Enhanced session card with status badges
3. **TimelineEvent.tsx** - Timeline event item
4. **WellnessTipCard.tsx** - Wellness tip with completion tracking

---

## 📝 Integration Steps

### Step 1: Import Components in HomeScreen.tsx

```typescript
import EmptySessionsCard from '../components/EmptySessionsCard';
import SessionCard from '../components/SessionCard';
import TimelineEvent from '../components/TimelineEvent';
import WellnessTipCard from '../components/WellnessTipCard';
```

### Step 2: Replace Upcoming Sessions Section

**Find this section (around line 438):**
```tsx
{/* New Upcoming Sessions Section - With Sessions Present */}
<View style={styles.section}>
  <View style={styles.sectionHeaderRow}>
    <Text style={styles.sectionHeader}>Upcoming Sessions</Text>
    ...
```

**Replace with:**
```tsx
{/* Upcoming Sessions - Dynamic */}
<View style={styles.section}>
  <View style={styles.sectionHeaderRow}>
    <Text style={styles.sectionHeader}>Upcoming Sessions</Text>
    {upcomingSessions.length > 1 && (
      <TouchableOpacity 
        onPress={() => navigation.navigate('AppointmentsScreen')}
        style={styles.viewAllButton}
      >
        <Text style={styles.viewAllText}>View All ({upcomingSessions.length})</Text>
      </TouchableOpacity>
    )}
  </View>
  
  {upcomingSessions.length === 0 ? (
    <EmptySessionsCard 
      onBookSession={() => navigation.navigate('TherapistsScreen')}
    />
  ) : upcomingSessions.length === 1 ? (
    <SessionCard 
      session={{
        ...upcomingSessions[0],
        status: 'confirmed',
        urgent: getSessionUrgency(upcomingSessions[0]) === 'soon'
      }}
      onPress={() => navigation.navigate('AppointmentsScreen')}
      onJoin={() => {
        toast.show({
          description: 'Joining session...',
          duration: 2000,
        });
      }}
    />
  ) : (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.sessionsScroll}
    >
      {upcomingSessions.map((session) => (
        <SessionCard 
          key={session.id}
          session={{
            ...session,
            status: 'confirmed',
            urgent: getSessionUrgency(session) === 'soon'
          }}
          onPress={() => navigation.navigate('AppointmentsScreen')}
          compact={true}
        />
      ))}
    </ScrollView>
  )}
</View>
```

### Step 3: Replace Today's Events Section

**Find this section (around line 478):**
```tsx
{/* Today's Events or Prompts Section - Rotating Display */}
```

**Replace with TWO separate sections:**

```tsx
{/* Today's Schedule - Timeline View */}
<View style={styles.section}>
  <Text style={styles.sectionHeader}>Today's Schedule</Text>
  
  {todaysEvents.length === 0 ? (
    <View style={styles.emptyEventsCard}>
      <Icon name="event-note" type="material" color={appColors.grey3} size={40} />
      <Text style={styles.emptyEventsText}>No events scheduled for today</Text>
    </View>
  ) : (
    <View style={styles.timelineContainer}>
      {todaysEvents.map((event, index) => (
        <TimelineEvent
          key={event.id}
          id={event.id}
          title={event.title}
          time={event.time}
          icon={event.icon}
          color={event.color}
          isLast={index === todaysEvents.length - 1}
          onPress={() => {
            toast.show({
              description: `Event: ${event.title}`,
              duration: 2000,
            });
          }}
        />
      ))}
    </View>
  )}
</View>

{/* Wellness Tip of the Day */}
<View style={styles.section}>
  <WellnessTipCard
    tip={wellnessPrompts[currentPromptIndex]}
    category="Mindfulness"
    isCompleted={completedTips.has(currentPromptIndex)}
    onComplete={() => markTipAsCompleted(currentPromptIndex)}
    onRefresh={handleNextTip}
  />
</View>
```

### Step 4: Add New Styles

Add these styles to HomeScreen.tsx styles object:

```typescript
sessionsScroll: {
  paddingRight: 20,
},
emptyEventsCard: {
  backgroundColor: appColors.CardBackground,
  borderRadius: 12,
  padding: 32,
  alignItems: 'center',
  elevation: 1,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
},
emptyEventsText: {
  fontSize: 14,
  color: appColors.grey2,
  fontFamily: appFonts.headerTextRegular,
  marginTop: 12,
  textAlign: 'center',
},
timelineContainer: {
  paddingVertical: 8,
},
```

---

## 🎯 Key Features Now Available

### Upcoming Sessions:
- ✅ Empty state with "Book Session" CTA
- ✅ Single session view (current)
- ✅ Horizontal scroll for multiple sessions
- ✅ Urgency indicators (orange border)
- ✅ Status badges (Confirmed/Pending/Cancelled)
- ✅ "View All" shows count

### Today's Schedule:
- ✅ Timeline view with dots and lines
- ✅ Empty state handling
- ✅ Color-coded events
- ✅ Tappable events

### Wellness Tip:
- ✅ Single tip (no auto-rotation)
- ✅ Manual refresh button
- ✅ Completion checkbox
- ✅ Category badge
- ✅ Tracks completed tips

---

## 🚀 Testing

1. **Empty Sessions:** Set `upcomingSessions = []` to see empty state
2. **Single Session:** Keep current mock data (1 session)
3. **Multiple Sessions:** Add more sessions to mock data
4. **Urgent Session:** Set session date to "Today"
5. **Empty Events:** Set `todaysEvents = []`
6. **Complete Tip:** Tap checkbox to mark as done

---

## 📊 Next Steps

1. Connect to real API data
2. Add session status from backend
3. Implement actual urgency calculation with datetime
4. Add personalized wellness tips based on mood
5. Track tip completion in backend

---

**All components are ready to use!** 🎉
