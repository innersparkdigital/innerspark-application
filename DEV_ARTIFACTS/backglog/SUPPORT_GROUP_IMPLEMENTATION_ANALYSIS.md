# Support Group Implementation & Feasibility Analysis

Based on the review of the current codebase (`groups.js` APIs, `MyGroupChatsListScreen.tsx`, and `GroupChatScreen.tsx`) versus the new "Weekly Cohort" business requirements, here is the dedicated deep dive for Support Groups.

## 1. Technical Feasibility & Architecture
The concept of weekly structured cohorts with strict time boundaries is **highly feasible** but requires transitioning the current "open community" architecture into a "subscription-gated cohort" architecture.

*   **Current Setup:** Groups behave like open persistent chat rooms. Users click "join" (`POST /groups/:groupId/join`), are instantly added, and gain immediate read/write access forever until they click "leave".
*   **Target Setup:** Groups are time-boxed state machines. Users pay (25,000 UGX) to reserve a seat in a *future* 7-day window. Access controls must dynamically shift based on the current date, independent of the client app.

## 2. What Needs to be Added at the Backend

To accommodate this locally on the backend without relying on the React Native client for time-keeping:

*   **Cohort & Membership Database Tables:**
    *   **Cohorts:** Needs `start_date`, `end_date`, `status` (OPEN_FOR_BOOKING, ACTIVE, CANCELLED).
    *   **Memberships & History:** A simple `user_id <-> group_id` pivot with a single `expiry_date` is **not enough** because users can have *discontinuous* subscriptions (e.g., active Week 1, inactive Week 2, active Week 3). The database must store a `SubscriptionHistory` table logging `[start_date, end_date]` for every paid week.
    *   **Concurrency Control:** Because groups have a strict 10-member capacity, the backend payment/booking flow must use **Database Row Locking** (e.g., `SELECT ... FOR UPDATE`) or atomic increments to prevent double-booking if 12 people try to pay at the exact same millisecond.
*   **Job Scheduler (CRON / Task Queue):**
    *   *3 Days Before Start:* A job opens the next week's cohort for subscriptions.
    *   *Start Date (Monday 00:00):* A job runs to count `PENDING` users in the cohort. If >= 2, transition them to `ACTIVE`. If < 2, trigger auto-refund or move them to the next week.
    *   *Expiry Job:* A continuous job checking if a user's 7-day access has elapsed, automatically downgrading them to `EXPIRED` (read-only mode).
*   **Wallet Integration (Payment Gateway):** Based on the Postman collection (v2.3.1), the system has an existing `Wallet` API. The 25,000 UGX subscription fee should be integrated directly with this. When a user subscribes, the backend deducts the amount from their `/api/v1/client/wallet/balance` instead of requiring external checkout forms inside the group flow.

---

## 3. How Current API Responses Will Be Affected

### `GET /client/groups` (Group Directory)
*   **Current:** Returns group names, descriptions, and member counts.
*   **Affected:** Must now return:
    *   `next_cohort_start_date`
    *   `subscription_price_ugx`
    *   `is_open_for_booking`

**Sample Response Body:**
```json
{
  "success": true,
  "data": {
    "groups": [
      {
        "id": 1,
        "name": "Anxiety Support",
        "max_capacity": 10,
        "member_count": 4,
        "subscription_price_ugx": 25000,
        "next_cohort_start_date": "2026-03-23T00:00:00Z",
        "is_open_for_booking": true
      }
    ]
  }
}
```

### `GET /client/groups/my-groups` (Joined Groups List)
*   **Current:** Returns groups the user is part of.
*   **Affected:** Must now include the user's exact `membership_status` and `expiry_date`.

**Sample Response Body:**
```json
{
  "success": true,
  "data": {
    "groups": [
      {
        "id": 1,
        "name": "Anxiety Support",
        "membership_status": "EXPIRED",
        "expiry_date": "2026-03-16T00:00:00Z",
        "last_message": "Thanks guys!"
      }
    ]
  }
}
```

### `POST /api/v1/client/groups/:groupId/subscribe` (Replaces old /join)
*   **Current:** Instantly adds user to group.
*   **Affected:** Must be completely refactored. Deducts from wallet, reserves a specific slot, and returns `PENDING`.

**Sample Request Body:**
```json
{
  "user_id": 123,
  "agreeToGuidelines": true
}
```
**Sample Response Body (Success):**
```json
{
  "success": true,
  "message": "Successfully paid 25000 UGX from wallet. Seat reserved.",
  "data": {
    "membership_status": "PENDING",
    "cohort_start_date": "2026-03-23T00:00:00Z"
  }
}
```
**Sample Response Body (Failed - Insufficient Funds):**
```json
{
  "success": false,
  "error": "Insufficient wallet balance. Please top up 25000 UGX."
}
```

### `GET /client/groups/:groupId/messages`
*   **Current:** Returns the entire chat history (paginated).
*   **Affected:** Critical security/privacy update needed. 
    *   If the user has a discontinuous subscription history, a simple `WHERE created_at <= expiry_date` fails. 
    *   The backend MUST dynamically build the query to only return messages whose `created_at` timestamp falls within ANY of the user's historical `[start_date, end_date]` active periods. This guarantees they only see messages from exactly when they were an active, paid member.

### `POST /client/groups/:groupId/messages`
*   **Current:** Inserts a message if the user is in the group.
*   **Affected:** The backend must throw a 403 Forbidden error if the user's membership status is not `ACTIVE` (e.g., they are either `PENDING` for next week, or `EXPIRED` from last week).

---

## 4. Additional Endpoints to be Provided

1.  `POST /api/v1/client/groups/:groupId/renew`
    *   **Purpose:** Fast-track endpoint that explicitly tells the backend which group is being paid for. The backend reads the `groupId` from the URL, the `user_id` from the payload, checks the price, and internally deducts 25,000 UGX from the wallet to extend the `expiry_date` by 7 days.
    *   **Sample Request Body:** 
```json
{
  "user_id": 123,
  "action": "renew_subscription"
}
```
    *   **Sample Response:** `{ "success": true, "message": "Membership renewed. 25,000 UGX deducted from wallet.", "data": { "new_expiry_date": "2026-03-30T00:00:00Z" }}`

2.  `GET /api/v1/client/groups/:groupId/cohort-availability`
    *   **Purpose:** Allows the frontend to check in real-time if a cohort has hit the 10-person maximum capacity before initiating the payment flow.
    *   **Sample Response:** `{ "success": true, "data": { "available_seats": 2, "is_open": true } }`
