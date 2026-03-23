# Wellness Tips Daily Persistence Strategy

## 1. Context & Goal
Currently, the `HomeScreen.tsx` displays a "Wellness Tip of the Day" from a local array. Clicking "Mark as done" saves the completion state to a temporary React local `Set`. When the app reloads, this state is lost. 

The goal is to implement a **world-class daily persistence strategy** where:
1. Completed tips are remembered even if the app completely closes.
2. When a tip is completed, it rotates to the next uncompleted tip in the array.
3. If all tips are completed for the day, the entire Wellness Tip section gracefully disappears.
4. The system automatically resets at midnight (daily reset).

## 2. Storage Strategy Analysis

We have two options for the store:
*   **Redux (`dashboardSlice.js`)**: Good for in-memory global state, but on its own, it does not persist across app reboots unless `redux-persist` is wired into the engine.
*   **Encrypted Local Storage (`StorageActions.ts`)**: The app already utilizes `react-native-encrypted-storage`. This is the absolutely correct and most robust layer for persisting daily physical data across hard reboots.

**The World-Class Approach (Hybrid):**
We should abstract the logic into a highly reusable Custom Hook (e.g., `useDailyWellnessTips.ts`). This hook will read/write rapidly from Redux/Local State for instantaneous UI updates, and asynchronously sync to `EncryptedStorage` in the background to guarantee persistence. 

## 3. Data Structure
The payload stored in `EncryptedStorage` under the key `@innerspark_wellness_state` will look like this:
```json
{
  "date": "2026-03-22",             // The date this state was last updated
  "completedIndices": [0, 1, 4],    // The specific tips the user finished today
  "allCompleted": false             // Boolean flag to hide the section instantly
}
```

## 4. Execution Plan (Frontend)

### Step 1: Create the Logic Controller (Custom Hook)
Create `src/hooks/useDailyWellnessTips.ts`. This hook will handle the heavy lifting:
*   **Initialization:** On mount, it retrieves the JSON from `StorageActions.ts`.
*   **Date Checking:** It compares the stored `date` against `new Date().toDateString()`. If the dates don't match (it's a new day), it wipes the storage clean natively.
*   **Rotation Logic:** A function `completeCurrentTip(index, arrayLength)` that adds the index to the completed array, calculates the next available uncompleted index, updates the local UI immediately, and saves the new JSON string back to `EncryptedStorage`.

### Step 2: Wire `HomeScreen.tsx`
*   Replace the raw `useState(new Set())` with the robust `useDailyWellnessTips()` hook.
*   Calculate the active prompt index securely using the hook's helper.
*   Wrap the `<View style={styles.section}>` holding the `WellnessTipCard` in a simple conditional: 
    ```tsx
    {!allCompleted && (
       <View style={styles.section}>
          <WellnessTipCard ... />
       </View>
    )}
    ```

## 5. Summary
By pushing this into a dedicated Custom Hook backed by the existing `EncryptedStorage` adapter, we keep `HomeScreen.tsx` clean, prevent Redux bloat, and achieve 100% reliable cross-session daily persistence mimicking the exact "hide-when-done" behavior of the Mood tracking system.
