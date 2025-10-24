# Therapist Dashboard API Endpoints

This document outlines all API endpoints required for the Therapist Dashboard functionality in the Innerspark application.

**Base URL:** `/api/v1/th/`

---

## 📊 Dashboard Overview

### GET `/api/v1/th/dashboard/stats`
Get overview statistics for the therapist dashboard.

**Response:**
```json
{
  "success": true,
  "data": {
    "appointments": {
      "today": 5,
      "thisWeek": 24,
      "thisMonth": 96,
      "upcoming": 12
    },
    "requests": {
      "pending": 3,
      "new": 2
    },
    "groups": {
      "active": 4,
      "totalMembers": 55,
      "scheduled": 2
    },
    "messages": {
      "unread": 7,
      "total": 145
    },
    "clients": {
      "total": 45,
      "active": 38
    },
    "sessionsToday": 8
  }
}
```

---

## 👤 Therapist Profile

### GET `/api/v1/th/profile`
Get therapist profile information.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "therapist_123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@innerspark.com",
    "phoneNumber": "+256784740145",
    "specialization": "Clinical Psychology",
    "licenseNumber": "PSY-12345",
    "yearsOfExperience": 8,
    "rating": 4.8,
    "totalSessions": 1250,
    "profileImage": "https://...",
    "bio": "Experienced therapist specializing in...",
    "availability": {
      "monday": ["09:00-17:00"],
      "tuesday": ["09:00-17:00"],
      "wednesday": ["09:00-17:00"],
      "thursday": ["09:00-17:00"],
      "friday": ["09:00-15:00"]
    }
  }
}
```

---

## 📅 Appointments

### GET `/api/v1/th/appointments`
Get list of appointments with optional filters.

**Query Parameters:**
- `filter`: `all` | `today` | `upcoming` | `completed`
- `page`: number (default: 1)
- `limit`: number (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "appointments": [
      {
        "id": "apt_001",
        "clientId": "client_123",
        "clientName": "John Doe",
        "clientAvatar": "👨",
        "type": "Individual Session",
        "date": "2025-10-24",
        "time": "10:00",
        "duration": 60,
        "status": "upcoming",
        "meetingLink": "https://meet.innerspark.com/room/123",
        "notes": "Client requested to discuss anxiety management"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 96
    }
  }
}
```

### GET `/api/v1/th/appointments/:appointmentId`
Get detailed information about a specific appointment.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "apt_001",
    "client": {
      "id": "client_123",
      "name": "John Doe",
      "avatar": "👨",
      "email": "john@example.com",
      "phoneNumber": "+256784740145",
      "totalSessions": 3,
      "rating": 4.8
    },
    "appointment": {
      "type": "Individual Session",
      "date": "2025-10-24",
      "time": "10:00",
      "duration": 60,
      "status": "upcoming",
      "meetingLink": "https://meet.innerspark.com/room/123"
    },
    "notes": "Client requested to discuss anxiety management techniques"
  }
}
```

### POST `/api/v1/th/appointments`
Create a new appointment.

**Request Body:**
```json
{
  "clientId": "client_123",
  "type": "Individual Session",
  "date": "2025-10-24",
  "time": "10:00",
  "duration": 60,
  "notes": "Initial consultation"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment scheduled successfully",
  "data": {
    "appointmentId": "apt_001",
    "meetingLink": "https://meet.innerspark.com/room/123"
  }
}
```

### PUT `/api/v1/th/appointments/:appointmentId`
Update/reschedule an appointment.

**Request Body:**
```json
{
  "date": "2025-10-25",
  "time": "14:00",
  "notes": "Rescheduled at client's request"
}
```

### DELETE `/api/v1/th/appointments/:appointmentId`
Cancel an appointment.

**Response:**
```json
{
  "success": true,
  "message": "Appointment cancelled successfully"
}
```

### POST `/api/v1/th/appointments/:appointmentId/start`
Mark appointment as started.

**Response:**
```json
{
  "success": true,
  "message": "Session started",
  "data": {
    "sessionId": "session_001",
    "startTime": "2025-10-24T10:00:00Z"
  }
}
```

---

## 📝 Client Notes

### GET `/api/v1/th/clients/:clientId/notes`
Get all notes for a specific client.

**Response:**
```json
{
  "success": true,
  "data": {
    "notes": [
      {
        "id": "note_001",
        "title": "Session Summary - Week 3",
        "content": "Client showed significant progress...",
        "type": "session",
        "date": "2025-10-20",
        "createdAt": "2025-10-20T15:30:00Z"
      }
    ]
  }
}
```

### POST `/api/v1/th/clients/:clientId/notes`
Create a new note for a client.

**Request Body:**
```json
{
  "title": "Session Summary",
  "content": "Client showed progress in managing anxiety...",
  "type": "session"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Note saved successfully",
  "data": {
    "noteId": "note_001"
  }
}
```

### PUT `/api/v1/th/notes/:noteId`
Update an existing note.

### DELETE `/api/v1/th/notes/:noteId`
Delete a note.

---

## 👥 Client Management

### GET `/api/v1/th/clients`
Get list of all clients.

**Query Parameters:**
- `search`: string
- `status`: `active` | `inactive`
- `page`: number
- `limit`: number

**Response:**
```json
{
  "success": true,
  "data": {
    "clients": [
      {
        "id": "client_123",
        "name": "John Doe",
        "avatar": "👨",
        "email": "john@example.com",
        "status": "active",
        "totalSessions": 12,
        "lastSession": "2025-10-20",
        "nextAppointment": "2025-10-24T10:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 45
    }
  }
}
```

### GET `/api/v1/th/clients/:clientId/profile`
Get detailed client profile (for individual chat clients).

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "client_123",
    "name": "John Doe",
    "avatar": "👨",
    "email": "john@example.com",
    "phoneNumber": "+256784740145",
    "dateOfBirth": "1990-05-15",
    "gender": "Male",
    "joinedDate": "2024-12-01",
    "status": "active",
    "stats": {
      "totalSessions": 12,
      "completedSessions": 10,
      "cancelledSessions": 2,
      "lastSession": "2025-10-20",
      "nextAppointment": "2025-10-24T10:00:00Z"
    },
    "notes": [
      {
        "id": "note_001",
        "title": "Session Summary",
        "date": "2025-10-20",
        "type": "session"
      }
    ]
  }
}
```

---

## 🔔 Requests (Client Requests)

### GET `/api/v1/th/requests`
Get pending client requests (Uber-style).

**Query Parameters:**
- `status`: `pending` | `accepted` | `declined`

**Response:**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "req_001",
        "type": "chat_session",
        "clientId": "client_123",
        "clientName": "John Doe",
        "clientAvatar": "👨",
        "requestedDate": "2025-10-24",
        "requestedTime": "10:00",
        "urgency": "high",
        "reason": "Experiencing severe anxiety",
        "status": "pending",
        "createdAt": "2025-10-23T14:30:00Z"
      }
    ]
  }
}
```

### POST `/api/v1/th/requests/:requestId/accept`
Accept a client request.

**Response:**
```json
{
  "success": true,
  "message": "Request accepted successfully",
  "data": {
    "appointmentId": "apt_001",
    "clientId": "client_123"
  }
}
```

### POST `/api/v1/th/requests/:requestId/decline`
Decline a client request.

**Request Body:**
```json
{
  "reason": "Schedule conflict"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Request declined"
}
```

---

## 💬 Messages (Individual Chat)

### GET `/api/v1/th/chats`
Get list of all chat conversations.

**Query Parameters:**
- `search`: string
- `unreadOnly`: boolean

**Response:**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "chat_001",
        "clientId": "client_123",
        "clientName": "John Doe",
        "clientAvatar": "👨",
        "lastMessage": "Thank you for the session",
        "lastMessageTime": "2025-10-23T16:45:00Z",
        "unreadCount": 2,
        "isOnline": true
      }
    ]
  }
}
```

### GET `/api/v1/th/chats/:chatId/messages`
Get messages for a specific conversation.

**Query Parameters:**
- `page`: number
- `limit`: number (default: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg_001",
        "senderId": "client_123",
        "senderType": "client",
        "content": "Hello, I need help with anxiety",
        "timestamp": "2025-10-23T16:30:00Z",
        "read": true
      },
      {
        "id": "msg_002",
        "senderId": "therapist_123",
        "senderType": "therapist",
        "content": "I'm here to help. Let's schedule a session",
        "timestamp": "2025-10-23T16:32:00Z",
        "read": true
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "hasMore": true
    }
  }
}
```

### POST `/api/v1/th/chats/:chatId/messages`
Send a message to a client.

**Request Body:**
```json
{
  "content": "Hello, how are you feeling today?",
  "attachments": []
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "messageId": "msg_003",
    "timestamp": "2025-10-23T16:45:00Z"
  }
}
```

### PUT `/api/v1/th/chats/:chatId/read`
Mark conversation as read.

---

## 👥 Support Groups

### GET `/api/v1/th/groups`
Get list of support groups.

**Query Parameters:**
- `status`: `active` | `scheduled` | `archived`
- `page`: number
- `limit`: number

**Response:**
```json
{
  "success": true,
  "data": {
    "groups": [
      {
        "id": "group_001",
        "name": "Anxiety Support Circle",
        "description": "A safe space for managing anxiety",
        "icon": "🧘",
        "members": 12,
        "maxMembers": 20,
        "status": "active",
        "nextSession": {
          "date": "2025-10-24",
          "time": "15:00",
          "topic": "Breathing Techniques"
        },
        "createdAt": "2024-12-01T00:00:00Z"
      }
    ],
    "stats": {
      "activeGroups": 4,
      "totalMembers": 55
    }
  }
}
```

### GET `/api/v1/th/groups/:groupId`
Get detailed information about a specific group.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "group_001",
    "name": "Anxiety Support Circle",
    "description": "A safe space for managing anxiety",
    "icon": "🧘",
    "members": 12,
    "maxMembers": 20,
    "status": "active",
    "privacy": "private",
    "requireApproval": true,
    "guidelines": [
      "Maintain confidentiality",
      "Respect others",
      "Active participation"
    ],
    "stats": {
      "totalSessions": 12,
      "attendanceRate": "85%",
      "activeMembers": 10
    },
    "nextSession": {
      "date": "2025-10-24",
      "time": "15:00",
      "topic": "Breathing Techniques",
      "duration": 60
    },
    "sessions": [
      {
        "id": "session_001",
        "date": "2025-10-24",
        "time": "15:00",
        "topic": "Breathing Techniques",
        "duration": 60,
        "status": "upcoming"
      }
    ],
    "members": [
      {
        "id": "member_001",
        "name": "John Doe",
        "avatar": "👨",
        "role": "member",
        "status": "active",
        "joinedDate": "2025-01-15",
        "attendance": "90%",
        "lastActive": "2 min ago"
      }
    ]
  }
}
```

### POST `/api/v1/th/groups`
Create a new support group.

**Request Body:**
```json
{
  "name": "Anxiety Support Circle",
  "description": "A safe space for managing anxiety",
  "icon": "🧘",
  "maxMembers": 20,
  "privacy": "private",
  "requireApproval": true,
  "guidelines": [
    "Maintain confidentiality",
    "Respect others"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Group created successfully",
  "data": {
    "groupId": "group_001"
  }
}
```

### PUT `/api/v1/th/groups/:groupId`
Update group details.

### DELETE `/api/v1/th/groups/:groupId`
Archive/delete a group.

---

## 💬 Group Chat

### GET `/api/v1/th/groups/:groupId/messages`
Get messages from a group chat.

**Query Parameters:**
- `page`: number
- `limit`: number (default: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "gmsg_001",
        "senderId": "therapist_123",
        "senderName": "Dr. John",
        "senderRole": "therapist",
        "content": "Welcome everyone to today's session",
        "type": "announcement",
        "timestamp": "2025-10-23T15:00:00Z"
      },
      {
        "id": "gmsg_002",
        "senderId": "member_001",
        "senderName": "Jane Doe",
        "senderRole": "member",
        "content": "Thank you for the session",
        "type": "text",
        "timestamp": "2025-10-23T15:45:00Z"
      }
    ]
  }
}
```

### POST `/api/v1/th/groups/:groupId/messages`
Send a message to the group.

**Request Body:**
```json
{
  "content": "Welcome to the session",
  "type": "text"
}
```

### POST `/api/v1/th/groups/:groupId/announcements`
Send an announcement to the group.

**Request Body:**
```json
{
  "content": "Session starts in 10 minutes!"
}
```

### DELETE `/api/v1/th/groups/:groupId/messages/:messageId`
Delete a message (moderation).

---

## 👥 Group Members

### GET `/api/v1/th/groups/:groupId/members`
Get list of group members.

**Query Parameters:**
- `filter`: `all` | `active` | `inactive` | `muted`
- `search`: string

**Response:**
```json
{
  "success": true,
  "data": {
    "members": [
      {
        "id": "member_001",
        "userId": "user_123",
        "name": "John Doe",
        "avatar": "👨",
        "role": "member",
        "status": "active",
        "joinedDate": "2025-01-15",
        "attendance": "90%",
        "lastActive": "2 min ago"
      }
    ]
  }
}
```

### GET `/api/v1/th/groups/:groupId/members/:memberId`
Get detailed member profile (group context only).

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "member_001",
    "name": "John Doe",
    "avatar": "👨",
    "role": "member",
    "status": "active",
    "joinedDate": "Jan 2025",
    "attendance": "90%",
    "lastActive": "2 min ago",
    "stats": {
      "sessionsAttended": 10,
      "totalSessions": 12,
      "messagesCount": 45
    }
  }
}
```

### PUT `/api/v1/th/groups/:groupId/members/:memberId/role`
Update member role (make/remove moderator).

**Request Body:**
```json
{
  "role": "moderator"
}
```

### POST `/api/v1/th/groups/:groupId/members/:memberId/mute`
Mute a member temporarily.

**Request Body:**
```json
{
  "duration": 300
}
```

**Response:**
```json
{
  "success": true,
  "message": "Member muted for 5 minutes"
}
```

### POST `/api/v1/th/groups/:groupId/members/:memberId/unmute`
Unmute a member.

### DELETE `/api/v1/th/groups/:groupId/members/:memberId`
Remove a member from the group.

---

## 📅 Group Sessions

### POST `/api/v1/th/groups/:groupId/sessions`
Schedule a new group session.

**Request Body:**
```json
{
  "date": "2025-10-24",
  "time": "15:00",
  "topic": "Breathing Techniques",
  "duration": 60,
  "meetingLink": "https://meet.innerspark.com/group/123"
}
```

### POST `/api/v1/th/groups/:groupId/sessions/:sessionId/start`
Start a group session.

### PUT `/api/v1/th/groups/:groupId/sessions/:sessionId`
Update session details.

### DELETE `/api/v1/th/groups/:groupId/sessions/:sessionId`
Cancel a session.

---

## 🔔 Notifications

### GET `/api/v1/th/notifications`
Get therapist notifications.

**Query Parameters:**
- `unreadOnly`: boolean
- `page`: number
- `limit`: number

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif_001",
        "type": "appointment_reminder",
        "title": "Upcoming Session",
        "message": "Session with John Doe in 30 minutes",
        "read": false,
        "createdAt": "2025-10-23T09:30:00Z",
        "data": {
          "appointmentId": "apt_001"
        }
      }
    ],
    "unreadCount": 3
  }
}
```

### PUT `/api/v1/th/notifications/:notificationId/read`
Mark notification as read.

### PUT `/api/v1/th/notifications/read-all`
Mark all notifications as read.

---

## 📊 Analytics & Reports

### GET `/api/v1/th/analytics/overview`
Get analytics overview.

**Query Parameters:**
- `period`: `week` | `month` | `year`

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "month",
    "sessions": {
      "total": 96,
      "completed": 88,
      "cancelled": 8,
      "trend": "+12%"
    },
    "clients": {
      "total": 45,
      "new": 5,
      "active": 38,
      "trend": "+8%"
    },
    "revenue": {
      "total": 48000,
      "currency": "UGX",
      "trend": "+15%"
    },
    "rating": {
      "average": 4.8,
      "totalReviews": 124
    }
  }
}
```

### GET `/api/v1/th/analytics/sessions`
Get session analytics.

### GET `/api/v1/th/analytics/revenue`
Get revenue analytics.

---

## ⚙️ Settings & Availability

### GET `/api/v1/th/availability`
Get therapist availability schedule.

**Response:**
```json
{
  "success": true,
  "data": {
    "schedule": {
      "monday": ["09:00-17:00"],
      "tuesday": ["09:00-17:00"],
      "wednesday": ["09:00-17:00"],
      "thursday": ["09:00-17:00"],
      "friday": ["09:00-15:00"],
      "saturday": [],
      "sunday": []
    },
    "timezone": "Africa/Kampala",
    "breakDuration": 30
  }
}
```

### PUT `/api/v1/th/availability`
Update availability schedule.

**Request Body:**
```json
{
  "schedule": {
    "monday": ["09:00-17:00"],
    "tuesday": ["09:00-17:00"]
  },
  "timezone": "Africa/Kampala"
}
```

### GET `/api/v1/th/pricing`
Get therapist pricing information.

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionTypes": [
      {
        "type": "Individual Session",
        "duration": 60,
        "price": 50000,
        "currency": "UGX"
      },
      {
        "type": "Couples Therapy",
        "duration": 90,
        "price": 75000,
        "currency": "UGX"
      }
    ]
  }
}
```

### PUT `/api/v1/th/pricing`
Update pricing.

---

## 💰 Transactions

### GET `/api/v1/th/transactions`
Get transaction history.

**Query Parameters:**
- `status`: `completed` | `pending` | `failed`
- `startDate`: date
- `endDate`: date
- `page`: number
- `limit`: number

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "txn_001",
        "type": "session_payment",
        "clientName": "John Doe",
        "amount": 50000,
        "currency": "UGX",
        "status": "completed",
        "date": "2025-10-23",
        "appointmentId": "apt_001"
      }
    ],
    "summary": {
      "totalEarnings": 480000,
      "pendingPayments": 50000,
      "completedTransactions": 96
    }
  }
}
```

---

## ⭐ Reviews

### GET `/api/v1/th/reviews`
Get therapist reviews from clients.

**Query Parameters:**
- `rating`: number (1-5)
- `page`: number
- `limit`: number

**Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "review_001",
        "clientName": "John Doe",
        "clientAvatar": "👨",
        "rating": 5,
        "comment": "Excellent therapist, very helpful",
        "date": "2025-10-20",
        "appointmentId": "apt_001"
      }
    ],
    "summary": {
      "averageRating": 4.8,
      "totalReviews": 124,
      "distribution": {
        "5": 95,
        "4": 20,
        "3": 5,
        "2": 2,
        "1": 2
      }
    }
  }
}
```

---

## 🔍 Search

### GET `/api/v1/th/search`
Global search across clients, appointments, groups.

**Query Parameters:**
- `query`: string
- `type`: `clients` | `appointments` | `groups` | `all`

**Response:**
```json
{
  "success": true,
  "data": {
    "clients": [],
    "appointments": [],
    "groups": []
  }
}
```

---

## 📤 File Upload

### POST `/api/v1/th/upload`
Upload files (attachments, documents).

**Request:** multipart/form-data

**Response:**
```json
{
  "success": true,
  "data": {
    "fileId": "file_001",
    "url": "https://storage.innerspark.com/files/...",
    "filename": "document.pdf",
    "size": 1024000,
    "mimeType": "application/pdf"
  }
}
```

---

## 🔐 Authentication

### POST `/api/v1/th/auth/login`
Therapist login (separate from client login).

**Request Body:**
```json
{
  "email": "therapist@innerspark.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here",
    "therapist": {
      "id": "therapist_123",
      "firstName": "John",
      "lastName": "Doe",
      "email": "therapist@innerspark.com",
      "role": "therapist"
    }
  }
}
```

### POST `/api/v1/th/auth/refresh`
Refresh authentication token.

### POST `/api/v1/th/auth/logout`
Logout therapist.

---

## 📝 Notes

### Common Response Format
All endpoints follow this structure:
```json
{
  "success": true/false,
  "message": "Optional message",
  "data": {},
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

### Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

### Authentication
All endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

### Rate Limiting
- Standard endpoints: 100 requests/minute
- File upload: 10 requests/minute
- Search: 30 requests/minute

---

## 🔄 Real-time Features (WebSocket)

### Connection
```
wss://api.innerspark.com/ws/th?token=<jwt_token>
```

### Events

**Incoming:**
- `new_message` - New chat message received
- `new_request` - New client request
- `appointment_reminder` - Upcoming appointment
- `group_message` - New group message
- `member_joined` - Member joined group
- `notification` - New notification

**Outgoing:**
- `send_message` - Send chat message
- `typing` - User is typing
- `read_message` - Mark message as read

---

## 📦 Pagination

All list endpoints support pagination:
- `page`: Current page (default: 1)
- `limit`: Items per page (default: 20, max: 100)

Response includes:
```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 96,
    "hasMore": true
  }
}
```

---

**Last Updated:** October 23, 2025  
**Version:** 1.0  
**Contact:** Backend Team
