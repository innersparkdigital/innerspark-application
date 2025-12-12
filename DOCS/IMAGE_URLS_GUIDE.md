# Image URLs Guide - Uploads Domain Configuration

## 🎯 **The Problem**

Backend serves uploaded files from a **different domain** than the API:

- **API Server:** `https://server.innersparkafrica.us` (for API calls)
- **Uploads Server:** `https://app.innersparkafrica.us` (for images/files)

When the backend returns image paths like `"uploads/img_123.jpg"`, we need to prepend the **uploads domain**, not the API domain.

---

## ✅ **The Solution**

### **1. Uploads Base URL Constant**

**File:** `src/config/env.ts`

```typescript
// Uploads base URL (different domain from API server)
export const UPLOADS_BASE_URL = 'https://app.innersparkafrica.us';
```

**Benefits:**
- ✅ Centralized configuration
- ✅ Easy to update if domain changes
- ✅ Used across the entire app

---

### **2. Image Helper Utilities**

**File:** `src/utils/imageHelpers.ts`

Two main functions:

#### **`getImageSource()`** - For React Native `<Image>` components

```typescript
import { getImageSource, FALLBACK_IMAGES } from '../utils/imageHelpers';

// Usage
const imageSource = getImageSource(
  event.coverImage,           // Backend path
  FALLBACK_IMAGES.default     // Fallback if null
);

<Image source={imageSource} />
```

#### **`getUploadUrl()`** - For URL strings

```typescript
import { getUploadUrl } from '../utils/imageHelpers';

// Usage
const imageUrl = getUploadUrl(event.coverImage);
// Returns: 'https://app.innersparkafrica.us/uploads/img_123.jpg'
```

---

## 📖 **Usage Examples**

### **Example 1: Events Screen**

```typescript
import { getImageSource, FALLBACK_IMAGES } from '../utils/imageHelpers';

const mappedEvents = apiEvents.map((event: any) => ({
  id: event.id,
  title: event.title,
  coverImage: getImageSource(event.coverImage, FALLBACK_IMAGES.event),
  organizerImage: getImageSource(event.organizerImage, FALLBACK_IMAGES.avatar),
}));
```

### **Example 2: Profile Screen**

```typescript
import { getImageSource, FALLBACK_IMAGES } from '../utils/imageHelpers';

const userAvatar = getImageSource(
  user.profileImage,
  FALLBACK_IMAGES.profile
);

<Avatar source={userAvatar} />
```

### **Example 3: Groups Screen**

```typescript
import { getImageSource, FALLBACK_IMAGES } from '../utils/imageHelpers';

const groupImage = getImageSource(
  group.coverImage,
  FALLBACK_IMAGES.group
);

<Image source={groupImage} style={styles.groupImage} />
```

---

## 🔄 **How It Works**

### **Backend Returns:**
```json
{
  "coverImage": "uploads/img_68bd38d2448101.69890268.jpg"
}
```

### **App Converts:**
```typescript
getImageSource('uploads/img_68bd38d2448101.69890268.jpg', fallback)
// Returns:
{ uri: 'https://app.innersparkafrica.us/uploads/img_68bd38d2448101.69890268.jpg' }
```

### **Final URL:**
```
https://app.innersparkafrica.us/uploads/img_68bd38d2448101.69890268.jpg ✅
```

---

## 📊 **URL Conversion Table**

| Backend Returns | App Converts To | Notes |
|----------------|-----------------|-------|
| `"uploads/img_123.jpg"` | `https://app.innersparkafrica.us/uploads/img_123.jpg` | ✅ Relative path |
| `"https://cdn.example.com/img.jpg"` | `https://cdn.example.com/img.jpg` | ✅ Full URL (unchanged) |
| `"http://example.com/img.jpg"` | `http://example.com/img.jpg` | ✅ Full URL (unchanged) |
| `null` | Fallback image | ✅ Uses local asset |
| `undefined` | Fallback image | ✅ Uses local asset |
| `""` | Fallback image | ✅ Uses local asset |

---

## 🎨 **Available Fallback Images**

```typescript
import { FALLBACK_IMAGES } from '../utils/imageHelpers';

FALLBACK_IMAGES.default     // General content placeholder
FALLBACK_IMAGES.avatar       // User/organizer avatars
FALLBACK_IMAGES.event        // Event cover images
FALLBACK_IMAGES.profile      // Profile pictures
FALLBACK_IMAGES.group        // Group images
FALLBACK_IMAGES.meditation   // Meditation/article images
```

**Actual Files:**
- `default`, `event`, `group`, `meditation` → `src/assets/images/is-default.png`
- `avatar`, `profile` → `src/assets/images/avatar-placeholder.png`

---

## 🚀 **Migration Guide**

### **Before (Hardcoded):**
```typescript
// ❌ Old way - hardcoded server URL
coverImage: event.coverImage && !event.coverImage.startsWith('http')
  ? { uri: `https://server.innersparkafrica.us/${event.coverImage}` }  // Wrong domain!
  : event.coverImage
    ? { uri: event.coverImage }
    : require('../assets/images/is-default.png')
```

### **After (Using Helper):**
```typescript
// ✅ New way - using helper
import { getImageSource, FALLBACK_IMAGES } from '../utils/imageHelpers';

coverImage: getImageSource(event.coverImage, FALLBACK_IMAGES.event)
```

**Benefits:**
- 🎯 Correct domain (`app.innersparkafrica.us`)
- 📝 Cleaner code (1 line vs 5 lines)
- 🔧 Centralized logic
- 🛡️ Type-safe

---

## 🔍 **When to Use Each Function**

### **Use `getImageSource()`:**
- When passing to `<Image source={...} />`
- When passing to `<Avatar source={...} />`
- When you need a React Native image source object

### **Use `getUploadUrl()`:**
- When you need a URL string
- When passing to web views
- When constructing links
- When logging/debugging

---

## 📝 **Best Practices**

### **1. Always Import from Utils**
```typescript
// ✅ Good
import { getImageSource, FALLBACK_IMAGES } from '../utils/imageHelpers';

// ❌ Bad - don't hardcode
const imageUrl = `https://app.innersparkafrica.us/${path}`;
```

### **2. Use Appropriate Fallbacks**
```typescript
// ✅ Good - semantic fallbacks
getImageSource(user.avatar, FALLBACK_IMAGES.avatar)
getImageSource(event.cover, FALLBACK_IMAGES.event)
getImageSource(group.image, FALLBACK_IMAGES.group)

// ❌ Bad - generic fallback everywhere
getImageSource(user.avatar, FALLBACK_IMAGES.default)
```

### **3. Handle Null/Undefined**
```typescript
// ✅ Good - helper handles null
getImageSource(event.coverImage, FALLBACK_IMAGES.event)

// ❌ Bad - manual null checks
event.coverImage ? { uri: `${UPLOADS_BASE_URL}/${event.coverImage}` } : fallback
```

---

## 🧪 **Testing**

### **Test Different Image Types:**

```typescript
// Test relative path
getImageSource('uploads/img_123.jpg', FALLBACK_IMAGES.default)
// Expected: { uri: 'https://app.innersparkafrica.us/uploads/img_123.jpg' }

// Test full URL
getImageSource('https://cdn.example.com/img.jpg', FALLBACK_IMAGES.default)
// Expected: { uri: 'https://cdn.example.com/img.jpg' }

// Test null
getImageSource(null, FALLBACK_IMAGES.default)
// Expected: require('../assets/images/is-default.png')

// Test empty string
getImageSource('', FALLBACK_IMAGES.default)
// Expected: require('../assets/images/is-default.png')
```

---

## 📦 **Screens Using Image Helpers**

### **Already Updated:**
- ✅ `EventsScreen.tsx` - Event cover images and organizer avatars

### **To Update:**
- [ ] `ProfileScreen` - User profile images
- [ ] `GroupsListScreen` - Group cover images
- [ ] `GroupDetailScreen` - Group images and member avatars
- [ ] `MeditationsScreen` - Article images
- [ ] `TherapistProfileScreen` - Therapist avatars
- [ ] `HomeScreen` - Various images
- [ ] Any other screens displaying backend images

---

## 🔧 **Configuration**

### **If Uploads Domain Changes:**

Just update one file:

```typescript
// src/config/env.ts
export const UPLOADS_BASE_URL = 'https://new-uploads-domain.com';
```

All screens will automatically use the new domain! ✅

---

## 📚 **Summary**

**Key Points:**
1. **API calls** → `https://server.innersparkafrica.us`
2. **Image uploads** → `https://app.innersparkafrica.us`
3. **Use helper functions** → `getImageSource()` and `getUploadUrl()`
4. **Centralized config** → `UPLOADS_BASE_URL` in `env.ts`
5. **Fallback images** → `FALLBACK_IMAGES` constants

**Quick Reference:**
```typescript
import { getImageSource, FALLBACK_IMAGES } from '../utils/imageHelpers';

// For images
<Image source={getImageSource(backendPath, FALLBACK_IMAGES.default)} />

// For URLs
const url = getUploadUrl(backendPath);
```

---

## 🎯 **Result**

✅ Images load correctly from `app.innersparkafrica.us`  
✅ Centralized configuration  
✅ Reusable across entire app  
✅ Type-safe with TypeScript  
✅ Easy to maintain and update
