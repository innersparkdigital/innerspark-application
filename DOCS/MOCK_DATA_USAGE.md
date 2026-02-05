# Mock Data Usage Guide

## 📁 **Location**

All mock/dummy data is centralized in:
```
src/global/MockData.ts
```

## 🎯 **Purpose**

Mock data is kept for:
- **Testing** - Quick testing without backend
- **Development** - UI development when API is down
- **Fallback** - Emergency fallback if needed
- **Reference** - Data structure examples

## 📦 **Available Mock Data**

### **Mock Events**

```typescript
import { mockEvents } from '../global/MockData';

// Usage
setEvents(mockEvents); // For testing
```

**Data Structure:**
```typescript
{
  id: number;
  title: string;
  shortDescription: string;
  date: string;
  time: string;
  coverImage: any;
  location: string;
  isOnline: boolean;
  totalSeats: number;
  availableSeats: number;
  price: number;
  currency: string;
  category: string;
  organizer: string;
  organizerImage: any;
  isRegistered: boolean;
}
```

**Contains:**
- 3 sample events
- Various categories (Workshop, Training, Seminar)
- Mix of online/offline events
- Different pricing (free and paid)

---

## 🚫 **When NOT to Use Mock Data**

### **Production Code**

❌ **Don't use in production:**
```typescript
// Bad - using mock data in production
const loadEvents = async () => {
  setEvents(mockEvents); // ❌ Don't do this
};
```

✅ **Use real API calls:**
```typescript
// Good - using real API
const loadEvents = async () => {
  try {
    const response = await getEvents();
    setEvents(response.data.events);
  } catch (error) {
    setEvents([]); // Clear on error
  }
};
```

---

## ✅ **When to Use Mock Data**

### **1. Development/Testing**

```typescript
// Temporary - for UI testing
const loadEvents = async () => {
  // TODO: Remove before production
  setEvents(mockEvents);
};
```

### **2. Storybook/Component Testing**

```typescript
// In component stories
export const Default = () => (
  <EventsList events={mockEvents} />
);
```

### **3. Unit Tests**

```typescript
// In test files
import { mockEvents } from '../global/MockData';

describe('EventCard', () => {
  it('renders event data', () => {
    render(<EventCard event={mockEvents[0]} />);
  });
});
```

---

## 📝 **Adding New Mock Data**

### **Step 1: Add to MockData.ts**

```typescript
// src/global/MockData.ts

export const mockGroups = [
  {
    id: 1,
    name: 'Anxiety Support Group',
    description: 'A safe space for anxiety management',
    members: 25,
    // ... more fields
  },
  // ... more items
];
```

### **Step 2: Document the Structure**

Add comments explaining the data structure:

```typescript
/**
 * Mock Groups Data
 * Used for testing group-related features
 * 
 * Structure:
 * - id: number
 * - name: string
 * - description: string
 * - members: number
 */
export const mockGroups = [ ... ];
```

### **Step 3: Import Where Needed**

```typescript
import { mockGroups } from '../global/MockData';
```

---

## 🔄 **Migration from Mock to Real API**

### **Before (Mock Data):**
```typescript
const EventsScreen = () => {
  const [events, setEvents] = useState(mockEvents);
  
  // No API call
};
```

### **After (Real API):**
```typescript
const EventsScreen = () => {
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    loadEvents();
  }, []);
  
  const loadEvents = async () => {
    try {
      const response = await getEvents();
      setEvents(response.data.events);
    } catch (error) {
      setEvents([]); // Clear on error
    }
  };
};
```

---

## 📊 **Current Status**

### **Screens Using Real API:**
- ✅ EventsScreen - Uses real API, mock data removed

### **Screens Still Using Mock Data:**
- Check individual screens and migrate as needed

---

## 🛠️ **Best Practices**

### **1. Always Comment Mock Usage**

```typescript
// TODO: Remove mock data before production
setEvents(mockEvents);
```

### **2. Use for Development Only**

```typescript
if (__DEV__) {
  // Only use mock data in development
  setEvents(mockEvents);
}
```

### **3. Keep Mock Data Updated**

When API structure changes, update mock data to match:

```typescript
// ❌ Outdated mock data
export const mockEvents = [
  { id: 1, title: 'Event' } // Missing new fields
];

// ✅ Updated mock data
export const mockEvents = [
  { 
    id: 1, 
    title: 'Event',
    newField: 'value' // Matches current API
  }
];
```

---

## 📚 **Summary**

**Key Points:**
1. **All mock data** → `src/global/MockData.ts`
2. **Use for testing** → Not production
3. **Keep updated** → Match current API structure
4. **Document clearly** → Add comments and structure info
5. **Migrate to real API** → As soon as backend is ready

**Quick Reference:**
```typescript
// Import mock data
import { mockEvents } from '../global/MockData';

// Use for testing only
if (__DEV__) {
  setEvents(mockEvents);
}

// Production: Use real API
const response = await getEvents();
setEvents(response.data.events);
```

---

## 🩺 **Therapist Mock Data**

### **Available Mock Data Sets**

```typescript
import { 
  mockTherapistDashboardStats,
  mockTherapistAppointments,
  mockTherapistClientRequests,
  mockTherapistConversations,
  mockTherapistGroups,
  mockTherapistClients,
  mockTherapistClientNotes,
  mockTherapistNotifications,
  mockTherapistProfile,
} from '../global/MockData';
```

### **1. Dashboard Stats**

```typescript
// Used by: THDashboardScreen.tsx
import { mockTherapistDashboardStats } from '../global/MockData';

// Contains:
// - todayAppointments, pendingRequests, activeGroups
// - unreadMessages, totalClients
// - weekAppointments, monthAppointments
```

### **2. Appointments**

```typescript
// Used by: THAppointmentsScreen.tsx
import { mockTherapistAppointments } from '../global/MockData';

// 8 sample appointments with:
// - Client info (name, avatar)
// - Session type, date, time, duration
// - Status: upcoming, scheduled, completed
```

### **3. Client Requests**

```typescript
// Used by: THRequestsScreen.tsx
import { mockTherapistClientRequests } from '../global/MockData';

// 5 sample requests with:
// - Request type (Chat Session, Support Group, Initial Consultation)
// - Urgency levels (high, medium, low)
// - Timestamps and descriptions
```

### **4. Conversations/Chats**

```typescript
// Used by: THChatsScreen.tsx
import { mockTherapistConversations } from '../global/MockData';

// 7 sample conversations with:
// - Last message and timestamp
// - Unread count, online status
// - Client info
```

### **5. Support Groups**

```typescript
// Used by: THGroupsScreen.tsx
import { mockTherapistGroups } from '../global/MockData';

// 6 sample groups with:
// - Member counts, status (active, scheduled)
// - Categories (anxiety, depression, trauma, etc.)
// - Next session times
```

### **6. Clients List**

```typescript
// Used by: Client management screens
import { mockTherapistClients } from '../global/MockData';

// 10 sample clients with:
// - Full profile (name, email, phone)
// - Session history, diagnosis, assigned groups
// - Status (active, inactive)
```

### **7. Client Notes**

```typescript
// Used by: THClientProfileScreen.tsx, THAddClientNoteScreen.tsx
import { mockTherapistClientNotes } from '../global/MockData';

// 5 sample session notes with:
// - Session details, mood, topics
// - Homework assignments
// - Progress tracking
```

### **8. Notifications**

```typescript
// Used by: THNotificationsScreen.tsx
import { mockTherapistNotifications } from '../global/MockData';

// 12 sample notifications with:
// - Types: appointment, request, message, group, system
// - Read status, action URLs
// - Icons and colors
```

### **9. Therapist Profile**

```typescript
// Used by: THAccountScreen.tsx
import { mockTherapistProfile } from '../global/MockData';

// Complete profile with:
// - Personal info, specializations
// - Availability schedule
// - Rating, reviews, experience
```

---

## 📚 **Summary**

**Key Points:**
1. **All mock data** → `src/global/MockData.ts`
2. **Use for testing** → Not production
3. **Keep updated** → Match current API structure
4. **Document clearly** → Add comments and structure info
5. **Migrate to real API** → As soon as backend is ready

**Quick Reference:**
```typescript
// Import mock data
import { mockEvents } from '../global/MockData';

// Use for testing only
if (__DEV__) {
  setEvents(mockEvents);
}

// Production: Use real API
const response = await getEvents();
setEvents(response.data.events);
```
