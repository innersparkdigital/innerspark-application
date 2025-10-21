# 🩺 Therapist Navigation System - Implementation Guide

## 📋 Overview

This document provides a complete implementation guide for the Therapist Dashboard navigation system in the Innerspark app.

---

## ✅ **What's Been Created**

### **1. Folder Structure**
```
src/screens/therapistDashboardScreens/
├── THDashboardScreen.tsx          ✅ CREATED
├── THRequestsScreen.tsx            ✅ CREATED
├── THAppointmentsScreen.tsx        📝 TO CREATE
├── THGroupsScreen.tsx              📝 TO CREATE
├── THChatsScreen.tsx               📝 TO CREATE
├── THNotificationsScreen.tsx       📝 TO CREATE
└── THAccountScreen.tsx             📝 TO CREATE
```

### **2. Completed Screens**

#### **THDashboardScreen** ✅
- Dashboard home screen matching your screenshot design
- 4 main cards: Appointments, Records, Forum, Account Settings
- Search bar functionality
- Quick Actions section with:
  - Client Requests
  - Messages
  - Notifications
- Clean, modern UI with emoji illustrations

#### **THRequestsScreen** ✅
- Uber-style request acceptance system
- Shows pending client requests for:
  - Chat Sessions
  - Support Group access
- Urgency levels (High/Medium/Low) with color coding
- Accept/Decline buttons
- Empty state when no requests
- Info card explaining the feature

---

## 📝 **Remaining Screens to Create**

### **THAppointmentsScreen.tsx**
```typescript
// Similar to existing AppointmentsScreen but for therapist view
// Shows:
// - Today's appointments
// - Upcoming appointments
// - Past appointments
// - Client details for each appointment
// - Quick actions: Start Session, Reschedule, Cancel
```

### **THGroupsScreen.tsx**
```typescript
// Similar to existing GroupsScreen
// Shows:
// - Support groups therapist moderates
// - Group activity/messages
// - Member management
// - Create new group option
```

### **THChatsScreen.tsx**
```typescript
// Similar to existing ChatsScreen
// Shows:
// - List of active client conversations
// - Unread message indicators
// - Client status (online/offline)
// - Search clients
```

### **THNotificationsScreen.tsx**
```typescript
// Similar to existing NotificationsScreen
// Shows:
// - New client requests
// - Appointment reminders
// - Group activity
// - System notifications
```

### **THAccountScreen.tsx**
```typescript
// Similar to existing AccountScreen
// Shows:
// - Therapist profile
// - Earnings/Statistics
// - Settings
// - Logout
```

---

## 🗂️ **Navigation Structure**

### **LHTherapistBottomTabs.tsx** (TO CREATE)

```typescript
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@rneui/themed';
import { appColors } from '../global/Styles';

// Import screens
import THDashboardScreen from '../screens/therapistDashboardScreens/THDashboardScreen';
import THAppointmentsScreen from '../screens/therapistDashboardScreens/THAppointmentsScreen';
import THGroupsScreen from '../screens/therapistDashboardScreens/THGroupsScreen';
import THChatsScreen from '../screens/therapistDashboardScreens/THChatsScreen';
import THAccountScreen from '../screens/therapistDashboardScreens/THAccountScreen';

const Tab = createBottomTabNavigator();

const LHTherapistBottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: appColors.AppBlue,
        tabBarInactiveTintColor: appColors.grey3,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="THDashboard"
        component={THDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Icon type="material" name="dashboard" color={color} size={size} />
          ),
        }}
      />
      
      <Tab.Screen
        name="THAppointments"
        component={THAppointmentsScreen}
        options={{
          tabBarLabel: 'Appointments',
          tabBarIcon: ({ color, size }) => (
            <Icon type="material" name="calendar-today" color={color} size={size} />
          ),
        }}
      />
      
      <Tab.Screen
        name="THGroups"
        component={THGroupsScreen}
        options={{
          tabBarLabel: 'Groups',
          tabBarIcon: ({ color, size }) => (
            <Icon type="material" name="forum" color={color} size={size} />
          ),
        }}
      />
      
      <Tab.Screen
        name="THChats"
        component={THChatsScreen}
        options={{
          tabBarLabel: 'Chats',
          tabBarIcon: ({ color, size }) => (
            <Icon type="material" name="chat" color={color} size={size} />
          ),
          tabBarBadge: 3, // TODO: Connect to actual unread count
        }}
      />
      
      <Tab.Screen
        name="THAccount"
        component={THAccountScreen}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color, size }) => (
            <Icon type="material" name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default LHTherapistBottomTabs;
```

### **LHTherapistNavigator.tsx** (TO CREATE)

```typescript
import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import LHTherapistBottomTabs from './LHTherapistBottomTabs';

// Import additional screens
import THRequestsScreen from '../screens/therapistDashboardScreens/THRequestsScreen';
import THNotificationsScreen from '../screens/therapistDashboardScreens/THNotificationsScreen';

// You can reuse existing screens from the main app
import ProfileSettingsScreen from '../screens/settingScreens/ProfileSettingsScreen';
import SecuritySettingsScreen from '../screens/settingScreens/SecuritySettingsScreen';
import PrivacySettingsScreen from '../screens/settingScreens/PrivacySettingsScreen';
// ... import other shared screens as needed

const THStack = createStackNavigator();

const LHTherapistNavigator = () => {
  return (
    <THStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Main Bottom Tabs */}
      <THStack.Screen
        name="THMainTabs"
        component={LHTherapistBottomTabs}
      />
      
      {/* Therapist-specific screens */}
      <THStack.Screen
        name="THRequestsScreen"
        component={THRequestsScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      
      <THStack.Screen
        name="THNotificationsScreen"
        component={THNotificationsScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      
      {/* Shared screens from main app */}
      <THStack.Screen
        name="ProfileSettingsScreen"
        component={ProfileSettingsScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      
      <THStack.Screen
        name="SecuritySettingsScreen"
        component={SecuritySettingsScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      
      <THStack.Screen
        name="PrivacySettingsScreen"
        component={PrivacySettingsScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      
      {/* Add more screens as needed */}
    </THStack.Navigator>
  );
};

export default LHTherapistNavigator;
```

---

## 🔌 **Integration with Root Navigation**

### **Update App.tsx or Root Navigator**

```typescript
import { useSelector } from 'react-redux';
import LHStackNavigator from './src/navigation/LHStackNavigator';
import LHTherapistNavigator from './src/navigation/LHTherapistNavigator';

// Inside your root component:
const App = () => {
  const isLoggedIn = useSelector((state: any) => state.userData.isLoggedIn);
  const userRole = useSelector((state: any) => state.userData.userDetails?.role);
  
  return (
    <NavigationContainer>
      {!isLoggedIn ? (
        // Auth screens (Login, Register, etc.)
        <Stack.Navigator>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          {/* ... other auth screens */}
        </Stack.Navigator>
      ) : (
        // Check user role and load appropriate navigator
        userRole === 'therapist' ? (
          <LHTherapistNavigator />
        ) : (
          <LHStackNavigator /> // Regular user navigator
        )
      )}
    </NavigationContainer>
  );
};
```

### **Alternative: Conditional Navigator in LHStackNavigator.js**

If you want to keep everything in LHStackNavigator, add this at the top:

```javascript
import { useSelector } from 'react-redux';
import LHTherapistNavigator from './LHTherapistNavigator';

const LHStackNavigator = () => {
  const userRole = useSelector((state) => state.userData.userDetails?.role);
  
  // If therapist, return therapist navigator instead
  if (userRole === 'therapist') {
    return <LHTherapistNavigator />;
  }
  
  // Otherwise, continue with regular user navigator
  return (
    <LHStack.Navigator>
      {/* ... existing screens */}
    </LHStack.Navigator>
  );
};
```

---

## 🎨 **Design Consistency**

### **Colors Used**
- **Primary**: `appColors.AppBlue` (#5170FF)
- **Success**: `appColors.AppGreen` (#64D64E)
- **Warning**: `#FF9800`
- **Error**: `#F44336`
- **Background**: `appColors.grey7` (#F6F6F6)
- **Cards**: `appColors.CardBackground` (#FFFFFF)

### **Fonts**
- **Headers**: `appFonts.headerTextBold`
- **Subheaders**: `appFonts.headerTextSemiBold`
- **Body**: `appFonts.bodyTextRegular`

### **Components**
- **ISGenericHeader**: Used for screen headers
- **Icon**: From `@rneui/themed`
- **SafeAreaView**: From `react-native-safe-area-context`

---

## 📱 **Screen Features**

### **THDashboardScreen**
- ✅ Menu button (opens drawer if implemented)
- ✅ Account icon (navigates to THAccountScreen)
- ✅ Search bar
- ✅ 4 main dashboard cards
- ✅ Quick Actions section
- ✅ Responsive grid layout

### **THRequestsScreen**
- ✅ Uber-style request cards
- ✅ Urgency indicators (High/Medium/Low)
- ✅ Accept/Decline actions
- ✅ Empty state
- ✅ Info card
- ✅ Confirmation dialogs

---

## 🔄 **Data Flow**

### **User Type Detection**
```typescript
// In Redux store (userSlice) - ACTUAL DATA STRUCTURE
userDetails: {
  email: string,
  email_verified: number,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  role: 'user' | 'therapist' | 'admin', // KEY FIELD
  // ... other fields
}
```

### **Navigation Logic**
```typescript
// After login, check role:
if (userDetails.role === 'therapist') {
  // Navigate to LHTherapistNavigator
  navigation.replace('TherapistApp');
} else {
  // Navigate to LHStackNavigator (regular user)
  navigation.replace('ClientApp');
}
```

### **Role Values**
- **`'user'`** - Regular client/patient
- **`'therapist'`** - Therapist/counselor
- **`'admin'`** - Administrator (optional)

---

## ✅ **Implementation Checklist**

### **Phase 1: Core Screens** (Current)
- [x] Create folder structure
- [x] THDashboardScreen
- [x] THRequestsScreen
- [ ] THAppointmentsScreen
- [ ] THGroupsScreen
- [ ] THChatsScreen
- [ ] THNotificationsScreen
- [ ] THAccountScreen

### **Phase 2: Navigation**
- [ ] Create LHTherapistBottomTabs
- [ ] Create LHTherapistNavigator
- [ ] Update LHRootNavigator
- [ ] Register all screens

### **Phase 3: Integration**
- [ ] Connect to Redux (userType)
- [ ] API integration for requests
- [ ] Real-time notifications
- [ ] Chat functionality

### **Phase 4: Testing**
- [ ] Test navigation flow
- [ ] Test on both iOS and Android
- [ ] Test user type switching
- [ ] Test all screen transitions

---

## 🚀 **Next Steps**

1. **Create remaining screens** using the templates above
2. **Create navigation files** (LHTherapistBottomTabs, LHTherapistNavigator)
3. **Update root navigator** to check userType
4. **Register screens** in LHStackNavigator or create separate therapist navigator
5. **Test navigation** flow
6. **Connect to APIs** for real data

---

## 💡 **Tips**

- **Reuse existing screens** where possible (Settings, Profile, etc.)
- **Keep UI consistent** with the main app
- **Use same components** (ISGenericHeader, etc.)
- **Follow same patterns** as existing screens
- **Test on real devices** for best results

---

## 📞 **Support**

For questions or issues:
1. Check existing screens for patterns
2. Review LHStackNavigator for navigation examples
3. Test incrementally (one screen at a time)

---

**Status**: 🟡 In Progress
**Created**: 2 of 7 screens
**Next**: Create remaining screens and navigation
