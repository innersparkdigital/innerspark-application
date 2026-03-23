# Frontend Implementation Plan: Groups & Chat Sessions

This document outlines the systematic frontend refactoring required to transform the Innerspark React Native application's legacy "Open Chat" architecture into the rigid, scheduled "Subscription/Appointment" architecture.

To prevent blocking frontend development while the backend team builds the new APIs, this execution plan is strictly broken into two phases.

---

## Phase 1: Before Backend Changes (UI & State Preparation)
*In this phase, all layout, UX, and security blocking mechanisms will be built into the frontend completely independent of live APIs. We will use local boolean states (e.g., `const isLocked = true`) to test the UI.*

### 1-on-1 Chat Sessions (`src/screens/chatScreens/`)

*   **`TherapistProfileViewScreen.tsx`**
    *   **Goal:** Allow users to book a Chat Session slot, similar to a Video slot.
    *   **Action:** Add a "Chat Session Slots" calendar picker section below the existing Video slots. 
    *   **Action:** Build the `WalletPaymentConfirmationModal` UI triggered upon selecting a slot, summarizing the cost (e.g., 50,000 UGX for 1 Hour Chat). Mock the "Confirm" action.
*   **`DMThreadScreen.tsx`**
    *   **Goal:** Build the rigid locking mechanism.
    *   **Action:** Introduce an `isChatLocked` structural state. 
    *   **Action:** When `isChatLocked` is true, the `TextInput` (Message Composer) is entirely hidden. Replace it with a styled `<View>` (e.g., a dark block with a Padlock icon and text: *"This session is locked. It will open at the scheduled start time."*).
    *   **Action:** Build the **Countdown Timer UI**. Given a mocked `startTime`, calculate the difference and show a live countdown (e.g., "Opens in 04:12"). When the timer hits zero, switch `isChatLocked` to false to instantly render the native keyboard input.

### Support Groups (`src/screens/groupScreens/` and `src/screens/chatScreens/`)

*   **`GroupInfoScreen.tsx` (or Group Detail)**
    *   **Goal:** Transition the entry from "Join for Free" to "Pay to Reserve Seat".
    *   **Action:** Redesign the primary CTA button. Instead of "Join Group", it must state "Subscribe - 25,000 UGX / Week".
    *   **Action:** Add a UI element showing capacity (e.g., a progress bar showing "4 / 10 Seats Reserved").
    *   **Action:** Add a "Next Cohort Starts On:" label explicitly dictating the Monday timestamp.
*   **`MyGroupChatsListScreen.tsx`**
    *   **Goal:** Identify which joined groups are currently active vs. expired.
    *   **Action:** Add status badges (`styles.badgeActive`, `styles.badgeExpired`, `styles.badgePending`) to each list item. 
    *   **Action:** Render a "Renew Subscription" fast-track button directly on the list item if the status is "EXPIRED".
*   **`GroupChatScreen.tsx`**
    *   **Goal:** Enforce Read-Only history.
    *   **Action:** Wrap the Composer in a permission check: `if (membershipStatus === 'EXPIRED')`. If expired, render a grey footer: *"Your subscription expired on [Date]. Renew for 25,000 UGX to continue chatting."* with a "Renew Now" button that triggers the mocked Wallet Payment modal.

---

## Phase 2: After Backend Changes (API & Logic Integration)
*In this phase, the mocked states from Phase 1 are replaced with the actual properties returned by the newly deployed backend endpoints.*

### 1-on-1 Chat Sessions
1.  **Connecting the Booking:**
    *   In `TherapistProfileViewScreen.tsx`, replace the mock calendar with the response from `GET /api/v1/client/therapists/:therapistId/slots?type=chat`.
    *   In the `WalletPaymentConfirmationModal`, map the "Confirm" button to strictly fire `POST /api/v1/client/chats/book` with the selected date/time.
2.  **Connecting the Live Locking:**
    *   In `DMThreadScreen.tsx`, inside `loadMessagesData()`, extract the new `chat_status`, `is_read_only`, and `scheduled_start_time` flags from the `GET /messages` response.
    *   Hook the Phase 1 Countdown Timer directly to the `scheduled_start_time`.
3.  **Connecting the Heartbeat:**
    *   Add `POST /api/v1/client/chats/:chatId/heartbeat` to the existing 5-second `setInterval` polling loop in `DMThreadScreen.tsx` to satisfy the "both users must be online" mechanism.

### Support Groups
1.  **Connecting the Subscription Flow:**
    *   In `GroupInfoScreen.tsx`, bind the "Subscribe - 25,000 UGX" button to `POST /api/v1/client/groups/:groupId/subscribe`. Handle the scenario where `success: false` triggers a dynamic alert telling the user to top up their wallet.
2.  **Connecting Real-Time Availability:**
    *   Trigger `GET /api/v1/client/groups/:groupId/cohort-availability` precisely when the User opens the Group Info screen, mapping the response to the Phase 1 "7/10 Seats" progress bar to prevent overbooking on the client side.
3.  **Connecting Renewal & Read-Only Logic:**
    *   In both `MyGroupChatsListScreen.tsx` and `GroupChatScreen.tsx`, map the "Renew Subscription" button to the silent, fast-track `POST /api/v1/client/groups/:groupId/renew` API. Upon a successful HTTP 200 response, simply change the local React State back to `ACTIVE` to instantly bring back the Message Composer without refreshing the page.
