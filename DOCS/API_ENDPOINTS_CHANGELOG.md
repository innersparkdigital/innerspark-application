# API Endpoints Changelog

## Summary of Changes - October 29, 2025

This document tracks changes made to API endpoint documentation based on recent feature implementations.

---

## 📝 Changes Made

### **CLIENT_API_ENDPOINTS.md**

#### **Version Update:**
- **From:** Version 1.0 (October 25, 2025)
- **To:** Version 1.1 (October 29, 2025)

#### **1. Mood System - MAJOR CHANGES** 🔄

**Context:** MVP changed from daily points to streak milestones

**Endpoints Modified:**
- GET `/api/v1/client/mood/history` - Added milestone tracking
- GET `/api/v1/client/mood/today` - Added milestone fields
- POST `/api/v1/client/mood` - Changed to milestone-based rewards
- GET `/api/v1/client/mood/points` → **RENAMED** to `/mood/milestones`

**New Fields Added:**
- `milestonesReached` - Progress (0-3 milestones)
- `nextMilestone` - Days until next reward (7, 14, or 30)
- `isMilestone` - Boolean, true when hitting 7/14/30 days

**Changed Fields:**
- `pointsEarned` - Now 0 for daily check-ins (only at milestones)
- `totalPoints` - Only accumulates at 7, 14, 30-day streaks

**Milestone Rewards:**
- 7 days = 500 points
- 14 days = 1000 points  
- 30 days = 2000 points

#### **2. New Section Added: User Settings** 🆕

**Location:** Section 14 (added to Table of Contents)

**New Endpoints:**

1. **GET `/api/v1/client/settings`**
   - Get all user settings and preferences
   - Returns: appearance, privacy, and notification settings
   - **Reason:** Centralized settings retrieval

2. **GET `/api/v1/client/settings/appearance`**
   - Get appearance settings only
   - Returns: theme, accessibility, and display preferences
   - **Reason:** Support for new theme system implementation

3. **PUT `/api/v1/client/settings/appearance`**
   - Update appearance settings
   - Fields: theme, useSystemTheme, highContrast, reducedMotion, largeText, accentColor, fontStyle
   - **Reason:** Persist user theme and accessibility preferences

4. **PUT `/api/v1/client/settings/privacy`**
   - Update privacy settings
   - Fields: walletBalanceVisibility
   - **Reason:** Manage wallet visibility (wastecoin removed - was dummy content)

---

## 🎨 Feature Context

### **Theme System Implementation**

**Frontend Changes:**
- Created `ThemeContext.tsx` with light/dark color schemes
- Created `useThemedColors.ts` hook for themed colors
- Enhanced `userSettingsSlice.js` with appearance state
- Connected `AppearanceSettingsScreen.tsx` to Redux
- Applied theme to `HomeScreen.tsx` (backgrounds, headers)

**Redux State Structure:**
```javascript
{
  userSettings: {
    // Appearance settings (NEW)
    theme: 'light' | 'dark' | 'auto',
    useSystemTheme: boolean,
    highContrast: boolean,
    reducedMotion: boolean,
    largeText: boolean,
    accentColor: string,
    fontStyle: 'system' | 'custom',
    
    // Privacy settings (EXISTING)
    walletBalanceVisibility: boolean,
    // REMOVED: wastecoinBalanceVisibility (was dummy content)
  }
}
```

**Backend Requirements:**
- Store user appearance preferences in database
- Return settings on user login/profile fetch
- Sync settings across devices
- Validate theme values (light/dark/auto)

---

## 📊 Endpoint Details

### **Appearance Settings Endpoint**

**PUT `/api/v1/client/settings/appearance`**

**Request Body:**
```json
{
  "theme": "dark",              // Required: 'light' | 'dark' | 'auto'
  "useSystemTheme": false,      // Boolean
  "highContrast": false,        // Boolean
  "reducedMotion": false,       // Boolean
  "largeText": false,           // Boolean
  "accentColor": "#5D7BF5",     // Optional: Hex color
  "fontStyle": "system"         // Optional: 'system' | 'custom'
}
```

**Validation Rules:**
- `theme`: Required, must be one of: `light`, `dark`, `auto`
- `useSystemTheme`: Boolean, when true, theme should be set to `auto`
- `highContrast`: Boolean
- `reducedMotion`: Boolean
- `largeText`: Boolean
- `accentColor`: Optional, must be valid hex color (e.g., #RRGGBB)
- `fontStyle`: Optional, must be one of: `system`, `custom`

**Response:**
```json
{
  "success": true,
  "message": "Appearance settings updated successfully",
  "data": {
    "theme": "dark",
    "useSystemTheme": false,
    "updatedAt": "2025-10-29T03:00:00Z"
  }
}
```

**Error Responses:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_THEME",
    "message": "Theme must be one of: light, dark, auto"
  }
}
```

---

## 🔄 No Changes Required

### **THERAPIST_DASHBOARD_ENDPOINTS.md**

**Status:** No changes needed

**Reason:** 
- Theme/appearance settings are user-specific, not therapist-specific
- Therapists use the same client-side settings system
- No new therapist-specific endpoints required for this feature

**Note:** If therapists need separate appearance preferences for their dashboard, consider adding:
- `GET /api/v1/th/settings/appearance`
- `PUT /api/v1/th/settings/appearance`

---

## 📋 Implementation Checklist

### **Backend Tasks:**

- [ ] Create `user_settings` table (if not exists)
  - Columns: userId, theme, useSystemTheme, highContrast, reducedMotion, largeText, accentColor, fontStyle
  - Columns: walletBalanceVisibility, wastecoinBalanceVisibility
  - Timestamps: createdAt, updatedAt

- [ ] Implement `GET /api/v1/client/settings`
  - Return all user settings
  - Include appearance and privacy settings
  - Default values for new users

- [ ] Implement `GET /api/v1/client/settings/appearance`
  - Return appearance settings only
  - Default to light theme if not set

- [ ] Implement `PUT /api/v1/client/settings/appearance`
  - Validate theme values
  - Validate color format
  - Update database
  - Return updated settings

- [ ] Implement `PUT /api/v1/client/settings/privacy`
  - Update privacy settings
  - Validate boolean values

- [ ] Add settings to user profile response
  - Include settings in login response
  - Include settings in profile fetch

- [ ] Add database migration
  - Create/update user_settings table
  - Set default values for existing users

### **Frontend Tasks:**

- [x] Create ThemeContext
- [x] Create useThemedColors hook
- [x] Update userSettingsSlice
- [x] Connect AppearanceSettingsScreen to Redux
- [x] Apply theme to HomeScreen
- [ ] Integrate with backend API
- [ ] Fetch settings on app start
- [ ] Sync settings on change
- [ ] Handle offline mode

---

## 🎯 Default Values

**New Users:**
```json
{
  "theme": "light",
  "useSystemTheme": false,
  "highContrast": false,
  "reducedMotion": false,
  "largeText": false,
  "accentColor": "#5D7BF5",
  "fontStyle": "system",
  "walletBalanceVisibility": true,
  "wastecoinBalanceVisibility": true
}
```

---

## 📊 Database Schema Suggestion

```sql
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Appearance settings
  theme VARCHAR(10) DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
  use_system_theme BOOLEAN DEFAULT false,
  high_contrast BOOLEAN DEFAULT false,
  reduced_motion BOOLEAN DEFAULT false,
  large_text BOOLEAN DEFAULT false,
  accent_color VARCHAR(7) DEFAULT '#5D7BF5',
  font_style VARCHAR(10) DEFAULT 'system' CHECK (font_style IN ('system', 'custom')),
  
  -- Privacy settings
  wallet_balance_visibility BOOLEAN DEFAULT true,
  wastecoin_balance_visibility BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id)
);

-- Index for faster lookups
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);
```

---

## 🔍 Testing Checklist

### **API Testing:**

- [ ] GET /api/v1/client/settings returns all settings
- [ ] GET /api/v1/client/settings/appearance returns appearance settings
- [ ] PUT /api/v1/client/settings/appearance updates theme
- [ ] PUT /api/v1/client/settings/appearance validates theme values
- [ ] PUT /api/v1/client/settings/appearance validates color format
- [ ] PUT /api/v1/client/settings/privacy updates privacy settings
- [ ] Settings persist across sessions
- [ ] Settings sync across devices
- [ ] Default values applied for new users
- [ ] Error handling for invalid values

### **Integration Testing:**

- [ ] Frontend fetches settings on app start
- [ ] Frontend syncs settings on change
- [ ] Theme changes reflect immediately
- [ ] Settings persist after app restart
- [ ] Offline mode handles settings gracefully

---

## 📝 Summary

**Changes Made:**
- ✅ Added User Settings section to CLIENT_API_ENDPOINTS.md
- ✅ Documented 4 new endpoints for settings management
- ✅ Updated version from 1.0 to 1.1
- ✅ Updated last modified date to October 29, 2025
- ✅ No changes to THERAPIST_DASHBOARD_ENDPOINTS.md (not needed)

**New Endpoints:**
1. GET /api/v1/client/settings
2. GET /api/v1/client/settings/appearance
3. PUT /api/v1/client/settings/appearance
4. PUT /api/v1/client/settings/privacy

**Impact:**
- Supports new theme system (light/dark/auto)
- Enables accessibility features (high contrast, reduced motion, large text)
- Persists user preferences across devices
- Provides centralized settings management

**Next Steps:**
- Backend team implements new endpoints
- Database migration for user_settings table
- API integration in frontend
- End-to-end testing

---

**Document Created:** October 29, 2025  
**Author:** Development Team  
**Status:** Ready for Backend Implementation
