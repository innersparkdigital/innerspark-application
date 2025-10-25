# Group Filter Issues - Final Fix

## Issues Identified from Screenshots:

### 1. Filter Chips Not Visible on Load
**Problem:** Only one blue pill visible with no text

**Root Cause:** 
- `paddingVertical: 12` in `categoriesContainer` was clipping the chips
- Chips didn't have explicit height

**Fix Applied:**
```typescript
categoriesContainer: {
  paddingHorizontal: 16,
  paddingTop: 8,
  paddingBottom: 16, // Changed from paddingVertical: 12
}

categoryChip: {
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 20,
  backgroundColor: appColors.grey6,
  marginRight: 8,
  borderWidth: 1,
  borderColor: 'transparent',
  height: 40, // ✅ Explicit height
  justifyContent: 'center', // ✅ Center text vertically
}

categoryText: {
  fontSize: 14,
  color: appColors.grey1, // ✅ Dark gray (was grey2)
  fontFamily: appFonts.bodyTextRegular,
  fontWeight: '500', // ✅ Medium weight for visibility
}
```

### 2. Filtered Items Stay in Original Position (Gap Above)
**Problem:** When filtering to "Depression", item stays at position 2 with huge empty space above

**Root Cause:**
- FlatList `contentContainerStyle` lacked `flexGrow: 1`
- Content wasn't forced to start from top

**Fix Applied:**
```typescript
listContainer: {
  paddingHorizontal: 16,
  flexGrow: 1, // ✅ Forces content to fill from top
}

// Also added to FlatList:
<FlatList
  key={selectedCategory} // ✅ Forces re-mount on filter change
  ref={groupsListRef}
  data={filteredGroups}
  removeClippedSubviews={false} // ✅ Prevents rendering issues
  ...
/>
```

## Changes Summary:

1. ✅ Filter chips now have explicit 40px height
2. ✅ Text color changed to grey1 (darker, more visible)
3. ✅ Font weight 500 for better readability
4. ✅ Padding adjusted to prevent clipping
5. ✅ FlatList key prop forces re-mount on filter change
6. ✅ flexGrow: 1 ensures content starts from top
7. ✅ removeClippedSubviews={false} prevents React Native optimizations that hide items

## Expected Result:

**Filters:** All chips visible with clear text
**Filtering:** Items jump to top with no gaps when filter changes
