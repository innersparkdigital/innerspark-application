# Chat Implementation & Feasibility Analysis

Based on the review of the current codebase (`GroupChatScreen.tsx`, `ChatScreen.tsx`, and `messages.js` APIs) and the new business requirements for Support Groups and 1-on-1 Chat Sessions, here is the technical feasibility and impact analysis.

## 1. Technical Feasibility & The "Simpler Effective" Real-time Alternative
The new requirements are **100% technically feasible**, but they represent a shift from "open-ended persistent chats" to "state-based, time-locked chats."

**Simpler Real-time Alternative to WebSockets:**
Currently, `GroupChatScreen.tsx` implements **HTTP Short-Polling** (`setInterval` every 5 seconds to `loadMessages(true)`). 
*   **The Simpler Alternative:** We can stick to HTTP Short-Polling for both Group and 1-on-1 chats instead of overhauling to WebSockets right now.
*   **How to handle "Both must be online" rule:** We can implement a lightweight `/heartbeat` endpoint. While the user is on the chat screen, the app hits `/client/chats/:chatId/heartbeat` every 10 seconds. The server updates a `last_seen_at` timestamp. If both users have a `last_seen_at` within the last 15 seconds, the chat shows "Both Online."
*   **Pros:** Very fast to implement, requires no new infrastructure (like a Socket server or Redis pub/sub).
*   **Cons:** Higher scale puts a load on the database (fetching queries every 5 seconds per active user).

---

## 2. What Needs to be Added at the Backend

**For Support Groups (Weekly Cycle):**
*   **Subscription Engine:** A background job (Cron or Task Queue) must be set up to evaluate cohorts. 
    *   *Trigger A:* 3 days before start -> Open subscriptions.
    *   *Trigger B:* Monday 00:00 -> Count paid members. If >= 2, update group state to `ACTIVE`. If < 2, move to next week or refund.
    *   *Trigger C:* 7 days after start -> Expire member statuses.

**For 1-on-1 Chat Sessions:**
*   **Therapist Schedule Sync:** The booking availability logic ("follows same availability as video") means the backend database must distinguish between a `VideoBooking` and a `ChatBooking` to prevent double-booking the same time slot for two different session types.
*   **Session State Machine:** Database columns for Chat Rooms must be updated to include `status` (PENDING, ACTIVE, CLOSED), `scheduled_start_time`, and `scheduled_end_time`.
*   **Auto-Locking Job:** A Cron job running every minute to check if any chat's `scheduled_end_time` has passed, automatically updating its status to `CLOSED`.

---

## 3. How Current API Responses Will Be Affected

### Existing API: `GET /api/v1/client/chats/:chatId/messages`
*   **Impact:** Currently returns all messages. 
*   **New Behavior:** MUST return the strict status so the UI knows to lock.
**Sample Response Body:**
```json
{
  "success": true,
  "data": {
    "chat_status": "CLOSED",
    "is_read_only": true,
    "scheduled_start_time": "2026-03-25T14:00:00Z",
    "messages": [ ... ]
  }
}
```
*   *Real-time UI Transition:* When a user enters a `LOCKED` chat 5 minutes early, the React Native app uses `scheduled_start_time` to set a `setTimeout` to automatically change the UI to `ACTIVE`.

### Existing API: `POST /client/chats/:chatId/messages` and `POST /client/groups/:groupId/messages`
*   **Impact:** Currently inserts the message blindly if the user is in the group.
*   **New Behavior:** MUST include strict backend validation before insertion:
    1. Is the chat status `ACTIVE`? (Reject if `LOCKED` or `CLOSED`).
    2. Is the current server time between `scheduled_start_time` and `scheduled_end_time`? (Reject if not).
    3. Is the user's group subscription active right now? (Reject if expired).

---

## 4. Additional Endpoints to be Provided

**Support Groups:**
1.  `POST /client/groups/:groupId/subscribe`
    *   **Payload:** Payment details/token.
    *   **Purpose:** Enrolls the user into the *upcoming* weekly cohort. 
2.  `GET /client/groups/:groupId/cohort-status`
    *   **Purpose:** Returns the schedule (when it starts, if it's open for booking, current member count/capacity, and the user's own expiry timestamp).

**1-on-1 Chat Sessions:**

1.  `GET /api/v1/client/therapists/:therapistId/slots?date=YYYY-MM-DD`
    *   **Purpose:** Returns the exact slots allowed for Chat Sessions.
    *   **Sample Response:** 
```json
{
  "success": true,
  "data": {
    "available_slots": [
      { "time": "14:00", "type": "chat", "price_ugx": 50000 }
    ]
  }
}
```

2.  `POST /api/v1/client/chats/book`
    *   **Purpose:** Deducts session price from `Wallet`, creates Chat Room.
    *   **Sample Request Body:**
```json
{
  "user_id": 123,
  "therapist_id": 456,
  "date": "2026-03-25",
  "time": "14:00"
}
```
    *   **Sample Response:**
```json
{
  "success": true,
  "message": "Chat booked. 50000 UGX deducted.",
  "data": {
    "chat_id": 789,
    "status": "LOCKED",
    "scheduled_start_time": "2026-03-25T14:00:00Z",
    "scheduled_end_time": "2026-03-25T15:00:00Z"
  }
}
```

3.  `POST /api/v1/client/chats/:chatId/heartbeat` *(Polling Alternative)*
    *   **Purpose:** Updates the user's "online" timestamp to ensure both are online.
    *   **Sample Request:** `{ "user_id": 123 }`
    *   **Sample Response:** `{ "success": true, "data": { "is_peer_online": true, "chat_status": "ACTIVE" } }`
