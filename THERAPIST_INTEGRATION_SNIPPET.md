# 🔌 Quick Integration Guide - Therapist Navigation

## ✅ **Actual Data Structure from API**

```javascript
{
  "user": {
    "email": "alphonse@juakaly.com",
    "email_verified": 1,
    "firstName": "Alphonse",
    "lastName": "Juakaly",
    "phoneNumber": "+256784740145",
    "role": "user"  // ← KEY FIELD: 'user' | 'therapist' | 'admin'
  }
}
```

---

## 🚀 **Quick Integration (Choose One Method)**

### **Method 1: Update LHStackNavigator.js** (Recommended)

Add this at the **top** of your `LHStackNavigator.js` file:

```javascript
import { useSelector } from 'react-redux';
// Import therapist navigator (create this file first)
// import LHTherapistNavigator from './LHTherapistNavigator';

const LHStackNavigator = () => {
  const userRole = useSelector((state) => state.userData.userDetails?.role);
  
  // If therapist, return therapist navigator
  if (userRole === 'therapist') {
    // return <LHTherapistNavigator />;
    // For now, show alert until you create the navigator
    console.log('🩺 Therapist logged in! Redirect to therapist dashboard');
  }
  
  // Continue with regular user navigator
  return (
    <LHStack.Navigator>
      {/* ... your existing screens */}
    </LHStack.Navigator>
  );
};
```

---

### **Method 2: Update App.tsx** (Alternative)

If you have a root App.tsx or similar:

```typescript
import { useSelector } from 'react-redux';
import LHStackNavigator from './src/navigation/LHStackNavigator';
// import LHTherapistNavigator from './src/navigation/LHTherapistNavigator';

const App = () => {
  const isLoggedIn = useSelector((state: any) => state.userData.isLoggedIn);
  const userRole = useSelector((state: any) => state.userData.userDetails?.role);
  
  return (
    <NavigationContainer>
      {!isLoggedIn ? (
        <AuthNavigator />
      ) : (
        // Route based on role
        userRole === 'therapist' ? (
          <LHTherapistNavigator />
        ) : (
          <LHStackNavigator />
        )
      )}
    </NavigationContainer>
  );
};
```

---

## 🧪 **Testing the Role Detection**

### **1. Add Console Log to Check Role**

In your login success handler:

```javascript
// After successful login
console.log('👤 User Role:', userDetails.role);

if (userDetails.role === 'therapist') {
  console.log('🩺 Therapist detected! Should show therapist dashboard');
} else {
  console.log('👥 Regular user detected! Should show client app');
}
```

### **2. Test with Different Roles**

Create test accounts:
- **Regular User**: `role: 'user'`
- **Therapist**: `role: 'therapist'`
- **Admin** (optional): `role: 'admin'`

---

## 📋 **Implementation Steps**

### **Step 1: Create Navigation Files**

```bash
# Create these files in src/navigation/
touch src/navigation/LHTherapistBottomTabs.tsx
touch src/navigation/LHTherapistNavigator.tsx
```

Copy code from `THERAPIST_NAVIGATION_IMPLEMENTATION.md`

### **Step 2: Update LHStackNavigator.js**

Add the role check at the top (Method 1 above)

### **Step 3: Test**

1. Login with a user account (`role: 'user'`) → Should see regular app
2. Login with a therapist account (`role: 'therapist'`) → Should see therapist dashboard

---

## 🎯 **Role Values**

| Role | Description | Navigator |
|------|-------------|-----------|
| `'user'` | Regular client/patient | LHStackNavigator |
| `'therapist'` | Therapist/counselor | LHTherapistNavigator |
| `'admin'` | Administrator | (Optional) Admin Navigator |

---

## 🔍 **Debugging**

### **Check Redux State**

```javascript
// In any component
import { useSelector } from 'react-redux';

const userDetails = useSelector((state) => state.userData.userDetails);
console.log('User Details:', userDetails);
console.log('Role:', userDetails?.role);
```

### **Check After Login**

```javascript
// In your login success handler
dispatch(setUserData(response.data.user));
console.log('Logged in as:', response.data.user.role);
```

---

## ✅ **Quick Checklist**

- [ ] Verify `role` field exists in Redux store after login
- [ ] Add role check in LHStackNavigator or App.tsx
- [ ] Create LHTherapistBottomTabs.tsx
- [ ] Create LHTherapistNavigator.tsx
- [ ] Test with therapist account
- [ ] Test with regular user account

---

## 💡 **Pro Tip**

Start simple! First, just add a console.log to detect the role:

```javascript
const userRole = useSelector((state) => state.userData.userDetails?.role);
console.log('🔍 Current user role:', userRole);
```

Once you confirm the role is being detected correctly, then implement the navigation switch.

---

**Next**: Follow `THERAPIST_NAVIGATION_IMPLEMENTATION.md` for complete code templates!
