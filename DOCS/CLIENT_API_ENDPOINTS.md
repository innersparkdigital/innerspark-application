# Client/User API Endpoints

This document outlines all API endpoints required for the Client/User functionality in the Innerspark application.

**Base URL:** `/api/v1/client/`

**Document Status:** Complete  
**Last Updated:** October 29, 2025 <!-- UPDATED: Added user settings endpoints -->  
**Version:** 1.1 <!-- UPDATED: Version bump for new endpoints -->

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Home Dashboard](#home-dashboard)
3. [Mood Tracking](#mood-tracking)
4. [Journal](#journal)
5. [Goals](#goals)
6. [Therapists](#therapists)
7. [Appointments](#appointments)
8. [Events](#events)
9. [Support Groups](#support-groups)
10. [Messages](#messages)
11. [Meditations](#meditations)
12. [Wellness Vault](#wellness-vault)
13. [Notifications](#notifications)
14. [User Settings](#user-settings) <!-- ADDED: Theme & appearance settings -->

---

## 🏠 Home Dashboard

### GET `/api/v1/client/dashboard`
Get home dashboard data.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "firstName": "John",
      "lastName": "Doe",
      "profileImage": "https://..."
    },
    "upcomingSessions": [
      {
        "id": "apt_001",
        "therapistName": "Dr. Nakato Aisha",
        "therapistImage": "https://...",
        "type": "Individual Session",
        "date": "2025-10-25",
        "time": "14:00",
        "duration": 60,
        "status": "confirmed",
        "meetingLink": "https://meet.innerspark.com/room/123"
      }
    ],
    "todayEvents": [],
    "wellnessTip": {
      "id": "tip_001",
      "tip": "Take 5 deep breaths when you feel anxious",
      "category": "Mindfulness"
    },
    "moodStreak": 7,
    "quickStats": {
      "sessionsCompleted": 12,
      "goalsAchieved": 5
    }
  }
}
```

---

## 😊 Mood Tracking

### GET `/api/v1/client/mood/history`
Get mood tracking history.

**Query Parameters:**
- `period`: `week` | `month` | `year`
- `startDate`: date (YYYY-MM-DD)
- `endDate`: date (YYYY-MM-DD)
- `page`: number
- `limit`: number

**Response:**
```json
{
  "success": true,
  "data": {
    "entries": [
      {
        "id": "1730123456789",
        "date": "2025-10-23",
        "moodValue": 2,
        "moodEmoji": "😊",
        "moodLabel": "Good",
        "note": "Had a great therapy session today. Feeling much better about managing my anxiety.",
        "timestamp": "2025-10-23T14:30:00Z",
        "pointsEarned": 0  // CHANGED: MVP uses streak milestones, not daily points
      }
    ],
    "stats": {
      "currentStreak": 7,
      "totalPoints": 0,  // CHANGED: Points awarded only at milestones (7, 14, 30 days)
      "totalCheckIns": 45,
      "averageMood": 3.8,
      "mostCommonMood": "Good",
      "milestonesReached": 1,  // ADDED: Track milestone progress (0-3)
      "nextMilestone": 14  // ADDED: Next milestone at 14 days
    },
    "insights": [
      {
        "id": 1,
        "title": "Weekly Progress",
        "description": "Your mood has improved 20% this week",
        "icon": "trending-up",
        "color": "#4CAF50",
        "type": "positive"
      },
      {
        "id": 2,
        "title": "Best Time",
        "description": "You feel best in the mornings",
        "icon": "wb-sunny",
        "color": "#FF9800",
        "type": "info"
      }
    ]
  }
}
```

### GET `/api/v1/client/mood/today`
Get today's mood check-in status.

**Response:**
```json
{
  "success": true,
  "data": {
    "hasCheckedIn": true,
    "todayMood": {
      "id": "1730123456789",
      "mood": "Good",
      "emoji": "😊",
      "moodValue": 2,
      "note": "Feeling great today!",
      "pointsEarned": 0,  // CHANGED: No daily points in MVP
      "timestamp": "2025-10-23T08:30:00Z",
      "date": "2025-10-23"
    },
    "stats": {
      "currentStreak": 7,
      "totalPoints": 0,  // CHANGED: Points only at milestones
      "totalCheckIns": 45,
      "milestonesReached": 1,  // ADDED: 1 of 3 milestones reached
      "nextMilestone": 14  // ADDED: Next reward at 14 days
    }
  }
}
```

### POST `/api/v1/client/mood`
Log a new mood entry.

**Request Body:**
```json
{
  "moodValue": 2,
  "note": "Had a great therapy session today. Feeling much better about managing my anxiety."
}
```

**Mood Values:**
- `1`: Great (🤩)
- `2`: Good (😊)
- `3`: Okay (😐)
- `4`: Bad (😟)
- `5`: Terrible (😭)

**Validation Rules:**
- `moodValue`: Required, integer 1-5
- `note`: Required, min 5 characters, max 500 characters

**Response:**
```json
{
  "success": true,
  "message": "Mood logged successfully",
  "data": {
    "moodId": "1730123456789",
    "moodLabel": "Good",
    "moodEmoji": "😊",
    "pointsEarned": 0,  // CHANGED: No daily points
    "currentStreak": 8,
    "totalPoints": 0,  // CHANGED: Points awarded at milestones only
    "timestamp": "2025-10-23T14:30:00Z",
    "isMilestone": false,  // ADDED: True if streak hits 7, 14, or 30
    "nextMilestone": 14,  // ADDED: Days until next reward
    "milestonesReached": 1  // ADDED: Progress (0-3)
  }
}
```

### GET `/api/v1/client/mood/insights`
Get AI-powered mood insights and patterns.

**Response:**
```json
{
  "success": true,
  "data": {
    "weeklyImprovement": 20,
    "bestTimeOfDay": "Morning",
    "patterns": [
      {
        "type": "activity_correlation",
        "insight": "You feel 30% happier after exercise",
        "confidence": 0.85
      },
      {
        "type": "time_pattern",
        "insight": "Your mood is typically better in mornings",
        "confidence": 0.78
      }
    ],
    "recommendations": [
      "Try exercising in the morning for optimal mood",
      "Consider therapy sessions on Mondays when mood is lower"
    ]
  }
}
```

### GET `/api/v1/client/mood/milestones`
<!-- CHANGED: Renamed from /points to /milestones for MVP -->
Get mood streak milestones and rewards information.

**Response:**
```json
{
  "success": true,
  "data": {
    "currentStreak": 7,
    "longestStreak": 15,
    "milestonesReached": 1,  // ADDED: 0-3 milestones completed
    "totalPoints": 500,  // CHANGED: Only from milestones (7 days = 500 pts)
    "availablePoints": 500,
    "usedPoints": 0,
    "milestones": [  // ADDED: Milestone tracking
      {
        "days": 7,
        "reward": 500,
        "reached": true,
        "reachedDate": "2025-10-23"
      },
      {
        "days": 14,
        "reward": 1000,
        "reached": false,
        "daysRemaining": 7
      },
      {
        "days": 30,
        "reward": 2000,
        "reached": false,
        "daysRemaining": 23
      }
    ],
    "nextMilestone": {  // ADDED: Next reward info
      "days": 14,
      "reward": 1000,
      "daysRemaining": 7
    },
    "redeemOptions": [
      {
        "id": 1,
        "title": "10% Off Therapy Session",
        "pointsCost": 1000,
        "available": false  // CHANGED: Not enough points yet
      },
      {
        "id": 2,
        "title": "Free Event Ticket",
        "pointsCost": 2000,
        "available": false
      }
    ]
  }
}
```

---

## 📝 Journal

### GET `/api/v1/client/journal/entries`
Get journal entries with pagination.

**Query Parameters:**
- `page`: number
- `limit`: number
- `startDate`: date (YYYY-MM-DD)
- `endDate`: date (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": {
    "entries": [
      {
        "id": "entry_001",
        "title": "Feeling Better Today",
        "content": "Had a great therapy session. Learned new coping techniques...",
        "mood": "good",
        "date": "2025-10-23",
        "createdAt": "2025-10-23T14:30:00Z",
        "updatedAt": "2025-10-23T14:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 48
    }
  }
}
```

### POST `/api/v1/client/journal/entries`
Create a new journal entry.

**Request Body:**
```json
{
  "title": "Feeling Better Today",
  "content": "Had a great therapy session. Learned new coping techniques for managing my anxiety.",
  "mood": "good",
  "date": "2025-10-23"
}
```

**Validation:**
- title: max 100 chars
- content: max 5000 chars
- mood: good | okay | bad
- date: required

**Response:**
```json
{
  "success": true,
  "message": "Journal entry created successfully",
  "data": {
    "entryId": "entry_001",
    "createdAt": "2025-10-23T14:30:00Z"
  }
}
```

### PUT `/api/v1/client/journal/entries/:entryId`
Update a journal entry.

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "mood": "good"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Journal entry updated successfully"
}
```

### DELETE `/api/v1/client/journal/entries/:entryId`
Delete a journal entry.

**Response:**
```json
{
  "success": true,
  "message": "Journal entry deleted successfully"
}
```

---

## 🎯 Goals

### GET `/api/v1/client/goals`
Get user goals.

**Query Parameters:**
- `status`: `active` | `completed` | `paused`
- `category`: string
- `page`: number
- `limit`: number

**Response:**
```json
{
  "success": true,
  "data": {
    "goals": [
      {
        "id": 1,
        "title": "Daily Meditation Practice",
        "description": "Meditate for 10 minutes every morning to improve mindfulness and reduce stress",
        "status": "active",
        "dueDate": "2024-01-20",
        "createdAt": "2024-01-10",
        "progress": 75,
        "category": "Mindfulness",
        "priority": "high"
      }
    ],
    "stats": {
      "total": 6,
      "active": 4,
      "completed": 1,
      "paused": 1
    }
  }
}
```

### POST `/api/v1/client/goals`
Create a new goal.

**Request Body:**
```json
{
  "title": "Daily Meditation Practice",
  "description": "Meditate for 10 minutes every morning to improve mindfulness and reduce stress",
  "dueDate": "2024-01-20",
  "category": "Mindfulness",
  "priority": "high"
}
```

**Validation Rules:**
- `title`: Required, min 3 characters, max 100 characters
- `description`: Required, min 10 characters, max 500 characters
- `dueDate`: Required, YYYY-MM-DD format, cannot be in the past
- `category`: Required, one of: Mindfulness, Physical Health, Professional Help, Self-Awareness, Relationships, Lifestyle, Learning
- `priority`: Required, one of: high, medium, low

**Response:**
```json
{
  "success": true,
  "message": "Goal created successfully",
  "data": {
    "goalId": 1,
    "progress": 0,
    "createdAt": "2024-01-10T10:00:00Z"
  }
}
```

### PUT `/api/v1/client/goals/:goalId`
Update a goal.

**Request Body:**
```json
{
  "title": "Daily Meditation Practice - Updated",
  "description": "Updated description",
  "dueDate": "2024-01-25",
  "category": "Mindfulness",
  "priority": "medium",
  "progress": 80,
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Goal updated successfully",
  "data": {
    "goalId": 1,
    "updatedAt": "2024-01-20T15:30:00Z"
  }
}
```

### POST `/api/v1/client/goals/:goalId/complete`
Mark goal as completed.

**Response:**
```json
{
  "success": true,
  "message": "Goal marked as completed!",
  "data": {
    "goalId": 1,
    "completedAt": "2024-01-20T15:30:00Z",
    "progress": 100,
    "status": "completed"
  }
}
```

### DELETE `/api/v1/client/goals/:goalId`
Delete a goal.

**Response:**
```json
{
  "success": true,
  "message": "Goal deleted successfully"
}
```

---

## 👨‍⚕️ Therapists

### GET `/api/v1/client/therapists`
Get list of available therapists.

**Query Parameters:**
- `search`: string
- `specialty`: string
- `availability`: boolean
- `rating`: number (min rating)
- `page`: number
- `limit`: number

**Response:**
```json
{
  "success": true,
  "data": {
    "therapists": [
      {
        "id": 1,
        "name": "Dr. Nakato Aisha",
        "specialty": "Therapist - Specialist",
        "rating": 5,
        "reviews": 342,
        "experience": "12 years",
        "price": "UGX 60,000",
        "priceUnit": "/session",
        "location": "Kampala Down Town - 2 km",
        "image": "https://...",
        "available": true,
        "nextAvailable": "Today 2:00 PM",
        "bio": "Specialized in cognitive behavioral therapy and mindfulness techniques."
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 15
    }
  }
}
```

### GET `/api/v1/client/therapists/:therapistId`
Get detailed therapist profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Dr. Nakato Aisha",
    "specialty": "Therapist - Specialist",
    "rating": 5,
    "reviews": 342,
    "experience": "12 years",
    "price": "UGX 60,000",
    "priceUnit": "/session",
    "image": "https://...",
    "bio": "Specialized in cognitive behavioral therapy and mindfulness techniques. Passionate about helping individuals overcome anxiety and depression.",
    "education": [
      {
        "degree": "PhD in Clinical Psychology",
        "institution": "Makerere University",
        "year": 2013
      }
    ],
    "credentials": [
      "Licensed Clinical Psychologist",
      "Certified CBT Practitioner"
    ],
    "specializations": [
      "Cognitive Behavioral Therapy",
      "Mindfulness",
      "Anxiety Disorders",
      "Depression"
    ],
    "languages": ["English", "Luganda"],
    "sessionTypes": [
      {
        "id": "individual",
        "name": "Individual Session",
        "price": "UGX 50,000",
        "duration": "60 min"
      },
      {
        "id": "couple",
        "name": "Couple Session",
        "price": "UGX 75,000",
        "duration": "90 min"
      },
      {
        "id": "group",
        "name": "Group Session",
        "price": "UGX 30,000",
        "duration": "60 min"
      },
      {
        "id": "consultation",
        "name": "Consultation",
        "price": "UGX 25,000",
        "duration": "30 min"
      }
    ],
    "availability": {
      "slots": [
        {
          "id": 1,
          "date": "Today",
          "time": "2:00 PM",
          "available": true
        },
        {
          "id": 2,
          "date": "Today",
          "time": "4:30 PM",
          "available": true
        },
        {
          "id": 3,
          "date": "Tomorrow",
          "time": "10:00 AM",
          "available": true
        }
      ]
    },
    "reviews": [
      {
        "id": 1,
        "clientName": "Sarah M.",
        "rating": 5,
        "comment": "Dr. Nakato helped me tremendously with my anxiety. Highly recommend!",
        "date": "2 weeks ago",
        "tags": ["helpful", "professional", "caring"]
      }
    ],
    "available": true,
    "nextAvailable": "Today 2:00 PM",
    "location": "Kampala Down Town - 2 km"
  }
}
```

### GET `/api/v1/client/therapists/:therapistId/availability`
Get therapist available time slots.

**Query Parameters:**
- `date`: date (YYYY-MM-DD)
- `sessionType`: string

**Response:**
```json
{
  "success": true,
  "data": {
    "slots": [
      {
        "id": 1,
        "date": "2025-10-25",
        "time": "14:00",
        "duration": 60,
        "available": true,
        "sessionType": "individual",
        "price": "UGX 50,000"
      },
      {
        "id": 2,
        "date": "2025-10-25",
        "time": "16:30",
        "duration": 60,
        "available": true,
        "sessionType": "individual",
        "price": "UGX 50,000"
      }
    ],
    "therapist": {
      "id": 1,
      "name": "Dr. Nakato Aisha",
      "image": "https://..."
    }
  }
}
```

### GET `/api/v1/client/therapists/:therapistId/reviews`
Get therapist reviews.

**Query Parameters:**
- `page`: number
- `limit`: number
- `rating`: number (filter by rating)

**Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": 1,
        "clientName": "Sarah M.",
        "rating": 5,
        "comment": "Dr. Nakato helped me tremendously with my anxiety.",
        "date": "2025-10-15",
        "tags": ["helpful", "professional", "caring"]
      }
    ],
    "stats": {
      "averageRating": 4.9,
      "totalReviews": 342,
      "ratingBreakdown": {
        "5": 320,
        "4": 18,
        "3": 3,
        "2": 1,
        "1": 0
      }
    },
    "pagination": {
      "currentPage": 1,
      "totalPages": 35,
      "totalItems": 342
    }
  }
}
```

---

## 📅 Appointments

### GET `/api/v1/client/appointments`
Get user's appointments.

**Query Parameters:**
- `status`: `upcoming` | `completed` | `cancelled`
- `page`: number
- `limit`: number

**Response:**
```json
{
  "success": true,
  "data": {
    "appointments": [
      {
        "id": "apt_001",
        "therapistId": "therapist_123",
        "therapistName": "Dr. Sarah Johnson",
        "therapistAvatar": "https://...",
        "sessionType": "Individual Session",
        "date": "2025-10-25",
        "time": "14:00",
        "duration": 60,
        "status": "upcoming",
        "meetingLink": "https://meet.innerspark.com/room/123",
        "price": 50000,
        "currency": "UGX",
        "isPaid": true
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 28
    }
  }
}
```

### POST `/api/v1/client/appointments`
Book a new appointment.

**Request Body:**
```json
{
  "therapistId": "therapist_001",
  "slotId": "slot_001",
  "sessionType": "individual",
  "date": "2025-10-25",
  "time": "14:00",
  "duration": 60,
  "reason": "Need help with anxiety management",
  "paymentMethod": "wellness_vault"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "data": {
    "appointmentId": "apt_001",
    "therapistName": "Dr. Sarah Johnson",
    "date": "2025-10-25",
    "time": "14:00",
    "meetingLink": "https://meet.innerspark.com/room/123",
    "confirmationCode": "APT-001-2025",
    "payment": {
      "amount": 50000,
      "currency": "UGX",
      "status": "completed",
      "transactionId": "txn_001"
    }
  }
}
```

### PUT `/api/v1/client/appointments/:appointmentId/reschedule`
Reschedule an appointment.

**Request Body:**
```json
{
  "newSlotId": "slot_002",
  "newDate": "2025-10-26",
  "newTime": "10:00",
  "reason": "Schedule conflict"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment rescheduled successfully",
  "data": {
    "appointmentId": "apt_001",
    "oldDate": "2025-10-25",
    "oldTime": "14:00",
    "newDate": "2025-10-26",
    "newTime": "10:00",
    "rescheduledAt": "2025-10-23T16:00:00Z"
  }
}
```

### DELETE `/api/v1/client/appointments/:appointmentId`
Cancel an appointment.

**Request Body:**
```json
{
  "reason": "Personal emergency",
  "requestRefund": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment cancelled successfully",
  "data": {
    "appointmentId": "apt_001",
    "cancelledAt": "2025-10-23T16:00:00Z",
    "refundAmount": 50000,
    "refundStatus": "processing",
    "refundETA": "3-5 business days"
  }
}
```

### POST `/api/v1/client/appointments/:appointmentId/review`
Submit appointment review.

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent session, very helpful. Dr. Johnson helped me tremendously with my anxiety.",
  "tags": ["helpful", "professional", "caring"]
}
```

**Validation Rules:**
- `rating`: Required, integer 1-5
- `comment`: Optional, max 500 characters
- `tags`: Optional, array of strings

**Response:**
```json
{
  "success": true,
  "message": "Review submitted successfully",
  "data": {
    "reviewId": "rev_001",
    "appointmentId": "apt_001",
    "rating": 5,
    "submittedAt": "2025-10-23T16:00:00Z"
  }
}
```

---

## 📅 Events

### GET `/api/v1/client/events`
Get available events (workshops, webinars, seminars, summits).

**Query Parameters:**
- `search`: string
- `category`: `Workshop` | `Training` | `Seminar` | `Summit` | `All`
- `isOnline`: boolean
- `status`: `upcoming` | `ongoing` | `completed`
- `page`: number
- `limit`: number

**Response:**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": 1,
        "title": "Mindfulness & Meditation Workshop",
        "shortDescription": "Learn mindfulness techniques to reduce stress and improve mental clarity.",
        "date": "2024-01-15",
        "time": "10:00 AM",
        "coverImage": "https://...",
        "location": "Wellness Center, Kampala",
        "isOnline": false,
        "totalSeats": 50,
        "availableSeats": 12,
        "price": 25000,
        "currency": "UGX",
        "category": "Workshop",
        "organizer": "Dr. Sarah Nakato",
        "organizerImage": "https://...",
        "isRegistered": false
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 28
    }
  }
}
```

### GET `/api/v1/client/events/:eventId`
Get detailed event information.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Mindfulness & Meditation Workshop",
    "shortDescription": "Learn mindfulness techniques to reduce stress and improve mental clarity.",
    "description": "Full detailed description of the event...",
    "date": "2024-01-15",
    "time": "10:00 AM",
    "coverImage": "https://...",
    "location": "Wellness Center, Kampala",
    "locationLink": "https://maps.google.com/?q=...",
    "isOnline": false,
    "totalSeats": 50,
    "availableSeats": 12,
    "price": 25000,
    "currency": "UGX",
    "category": "Workshop",
    "organizer": "Dr. Sarah Nakato",
    "organizerImage": "https://...",
    "isRegistered": false,
    "registrationDeadline": "2024-01-14",
    "schedule": {
      "startTime": "10:00 AM",
      "endTime": "4:00 PM",
      "agenda": [
        {
          "time": "10:00 AM",
          "activity": "Registration & Welcome",
          "speaker": "Dr. Sarah Nakato"
        },
        {
          "time": "10:30 AM",
          "activity": "Introduction to Mindfulness",
          "speaker": "Dr. Sarah Nakato"
        }
      ]
    }
  }
}
```

### POST `/api/v1/client/events/:eventId/register`
Register for an event.

**Request Body:**
```json
{
  "paymentMethod": "wellness_vault",
  "phoneNumber": "+256784740145",
  "specialRequirements": "Need wheelchair access"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully registered for event",
  "data": {
    "registrationId": "reg_001",
    "eventId": 1,
    "confirmationCode": "EVT-001-2025",
    "meetingLink": "https://meet.innerspark.com/event/123",
    "payment": {
      "amount": 25000,
      "currency": "UGX",
      "status": "completed",
      "transactionId": "txn_001",
      "method": "wellness_vault"
    }
  }
}
```

### DELETE `/api/v1/client/events/:eventId/unregister`
Cancel event registration.

**Response:**
```json
{
  "success": true,
  "message": "Successfully unregistered from event",
  "data": {
    "refundAmount": 25000,
    "refundStatus": "processing",
    "refundETA": "3-5 business days"
  }
}
```

### GET `/api/v1/client/events/my-events`
Get user's registered events.

**Query Parameters:**
- `status`: `upcoming` | `completed` | `cancelled`
- `page`: number
- `limit`: number

**Response:**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": 2,
        "title": "Mental Health First Aid Training",
        "date": "2024-01-20",
        "time": "9:00 AM",
        "location": "Online Event",
        "isOnline": true,
        "registrationId": "reg_002",
        "confirmationCode": "EVT-002-2025",
        "meetingLink": "https://meet.innerspark.com/event/456",
        "status": "confirmed",
        "paidAmount": 0,
        "registeredAt": "2024-01-10T14:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 15
    }
  }
}
```

---

## 👥 Support Groups

### GET `/api/v1/client/groups`
Get available support groups directory.

**Query Parameters:**
- `search`: string
- `category`: `anxiety` | `depression` | `addiction` | `trauma` | `general` | `all`
- `isPrivate`: boolean
- `page`: number
- `limit`: number

**Response:**
```json
{
  "success": true,
  "data": {
    "groups": [
      {
        "id": "1",
        "name": "Anxiety Support Circle",
        "description": "A safe space for individuals dealing with anxiety disorders to share experiences and coping strategies.",
        "therapistName": "Dr. Sarah Johnson",
        "therapistEmail": "sarah.johnson@innerspark.com",
        "therapistAvatar": "https://...",
        "memberCount": 24,
        "maxMembers": 30,
        "icon": "psychology",
        "category": "anxiety",
        "isJoined": false,
        "isPrivate": false,
        "meetingSchedule": "Tuesdays & Thursdays, 7:00 PM",
        "tags": ["anxiety", "coping", "mindfulness"]
      }
    ],
    "myGroups": {
      "count": 3,
      "limit": 4,
      "plan": "premium"
    },
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 28
    }
  }
}
```

### GET `/api/v1/client/groups/:groupId`
Get detailed group information including members.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Anxiety Support Circle",
    "description": "A safe space for individuals dealing with anxiety disorders",
    "therapistName": "Dr. Sarah Johnson",
    "therapistEmail": "sarah.johnson@innerspark.com",
    "therapistAvatar": "https://...",
    "memberCount": 24,
    "maxMembers": 30,
    "icon": "psychology",
    "category": "anxiety",
    "isJoined": true,
    "isPrivate": false,
    "meetingSchedule": "Tuesdays & Thursdays, 7:00 PM",
    "tags": ["anxiety", "coping", "mindfulness"],
    "guidelines": [
      "Maintain confidentiality",
      "Respect all members",
      "Active participation encouraged",
      "No judgment zone"
    ],
    "members": [
      {
        "id": "therapist_1",
        "name": "Dr. Sarah Johnson",
        "avatar": "https://...",
        "role": "therapist",
        "joinedDate": "2024-01-15",
        "isOnline": true
      },
      {
        "id": "mod_1",
        "name": "Michael Chen",
        "avatar": "https://...",
        "role": "moderator",
        "joinedDate": "2024-02-01",
        "isOnline": true
      },
      {
        "id": "member_1",
        "name": "Lisa Rodriguez",
        "avatar": "https://...",
        "role": "member",
        "joinedDate": "2024-02-15",
        "isOnline": false,
        "lastSeen": "2 hours ago"
      }
    ],
    "userRole": "member"
  }
}
```

### POST `/api/v1/client/groups/:groupId/join`
Request to join a support group.

**Request Body:**
```json
{
  "reason": "I struggle with anxiety and need support",
  "agreeToGuidelines": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Join request submitted successfully",
  "data": {
    "requestId": "req_001",
    "status": "pending",
    "requiresApproval": true,
    "estimatedResponse": "24-48 hours"
  }
}
```

**Error Response (Membership Limit Reached):**
```json
{
  "success": false,
  "error": {
    "code": "MEMBERSHIP_LIMIT_REACHED",
    "message": "You've reached your group limit (3/3)",
    "data": {
      "currentPlan": "basic",
      "groupsJoined": 3,
      "groupsLimit": 3,
      "upgradeRequired": true
    }
  }
}
```

### POST `/api/v1/client/groups/:groupId/leave`
Leave a support group.

**Request Body:**
```json
{
  "reason": "Schedule conflict",
  "feedback": "Great group, but can't attend anymore"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully left the group",
  "data": {
    "groupsJoined": 2,
    "groupsLimit": 3
  }
}
```

### GET `/api/v1/client/groups/my-groups`
Get user's joined groups.

**Response:**
```json
{
  "success": true,
  "data": {
    "groups": [
      {
        "id": "1",
        "name": "Anxiety Support Circle",
        "icon": "psychology",
        "therapistName": "Dr. Sarah Johnson",
        "memberCount": 24,
        "nextSession": {
          "date": "2025-10-24",
          "time": "19:00",
          "topic": "Breathing Techniques"
        },
        "role": "member",
        "joinedDate": "2024-09-15",
        "attendance": "85%",
        "unreadMessages": 3
      }
    ],
    "stats": {
      "totalGroups": 3,
      "groupsLimit": 4,
      "plan": "premium"
    }
  }
}
```

### GET `/api/v1/client/groups/:groupId/messages`
Get group chat messages.

**Query Parameters:**
- `page`: number
- `limit`: number (default: 50)
- `before`: timestamp (for pagination)

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "gmsg_001",
        "senderId": "therapist_001",
        "senderName": "Dr. Nakato",
        "senderRole": "therapist",
        "content": "Welcome everyone to today's session",
        "type": "announcement",
        "timestamp": "2025-10-23T15:00:00Z",
        "isAnnouncement": true
      },
      {
        "id": "gmsg_002",
        "senderId": "user_123",
        "senderName": "Member 1",
        "senderRole": "member",
        "content": "Thank you for the session",
        "type": "text",
        "timestamp": "2025-10-23T15:45:00Z",
        "replyTo": "gmsg_001"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "hasMore": true,
      "nextCursor": "1730123456789"
    },
    "privacyMode": true
  }
}
```

### POST `/api/v1/client/groups/:groupId/messages`
Send a message to group chat.

**Request Body:**
```json
{
  "content": "This technique really helped me today",
  "replyTo": "gmsg_001"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "messageId": "gmsg_003",
    "timestamp": "2025-10-23T16:00:00Z",
    "status": "sent"
  }
}
```

---

## 💬 Messages

### GET `/api/v1/client/chats`
Get list of chat conversations with therapists.

**Response:**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "chat_001",
        "therapistId": "therapist_123",
        "therapistName": "Dr. Sarah Johnson",
        "therapistAvatar": "https://...",
        "lastMessage": "That's wonderful to hear! Keep practicing.",
        "lastMessageTime": "2025-10-23T16:45:00Z",
        "unreadCount": 2,
        "isOnline": true,
        "lastSeen": "2 min ago"
      }
    ]
  }
}
```

### GET `/api/v1/client/chats/:chatId/messages`
Get messages from a conversation.

**Query Parameters:**
- `page`: number
- `limit`: number (default: 50)
- `before`: timestamp

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg_001",
        "senderId": "user_123",
        "senderName": "You",
        "content": "Hi Dr. Johnson, I wanted to follow up on our session yesterday.",
        "createdAt": "2025-10-23T10:30:00Z",
        "isRead": true,
        "isSent": true,
        "isOwn": true,
        "type": "text"
      },
      {
        "id": "msg_002",
        "senderId": "therapist_123",
        "senderName": "Dr. Sarah Johnson",
        "content": "Hello! I'm glad you reached out. How are you feeling today?",
        "createdAt": "2025-10-23T10:32:00Z",
        "isRead": true,
        "isSent": true,
        "isOwn": false,
        "type": "text"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "hasMore": true,
      "nextCursor": "1730123456789"
    }
  }
}
```

### POST `/api/v1/client/chats/:chatId/messages`
Send a message to therapist.

**Request Body:**
```json
{
  "content": "I've been practicing the breathing exercises you taught me.",
  "type": "text"
}
```

**Validation:**
- content: max 2000 chars
- type: text

**Response:**
```json
{
  "success": true,
  "data": {
    "messageId": "msg_003",
    "timestamp": "2025-10-23T16:45:00Z",
    "status": "sent"
  }
}
```

### PUT `/api/v1/client/chats/:chatId/read`
Mark conversation as read.

**Response:**
```json
{
  "success": true,
  "message": "Messages marked as read"
}
```

---

## 💳 Subscriptions & Services

### GET `/api/v1/client/subscriptions/plans`
Get available subscription plans.

**Query Parameters:**
- `billingCycle`: `weekly` | `monthly`

**Response:**
```json
{
  "success": true,
  "data": {
    "plans": [
      {
        "id": "free",
        "name": "Free",
        "description": "Get started with basic features",
        "weeklyPrice": 0,
        "monthlyPrice": 0,
        "currency": "UGX",
        "isPopular": false,
        "isCurrent": true,
        "supportGroupsLimit": 0,
        "directChatAccess": false,
        "features": [
          "Browse support groups",
          "Book appointments (pay-per-use)",
          "Attend events (pay-per-use)",
          "Access wellness resources",
          "Community forum access"
        ],
        "badge": "FREE"
      },
      {
        "id": "basic",
        "name": "Basic",
        "description": "Join support groups and connect with peers",
        "weeklyPrice": 10000,
        "monthlyPrice": 35000,
        "currency": "UGX",
        "isPopular": false,
        "isCurrent": false,
        "supportGroupsLimit": 3,
        "directChatAccess": false,
        "features": [
          "Join up to 3 support groups",
          "Group chat participation",
          "Priority booking for appointments",
          "All Free plan features",
          "Weekly wellness tips"
        ]
      },
      {
        "id": "premium",
        "name": "Premium",
        "description": "Full access to groups plus direct therapist chat",
        "weeklyPrice": 25000,
        "monthlyPrice": 90000,
        "currency": "UGX",
        "isPopular": true,
        "isCurrent": false,
        "supportGroupsLimit": 4,
        "directChatAccess": true,
        "features": [
          "Join up to 4 support groups",
          "Direct chat with therapist",
          "Priority support 24/7",
          "Crisis intervention access",
          "All Basic plan features"
        ],
        "badge": "MOST POPULAR"
      },
      {
        "id": "unlimited",
        "name": "Unlimited",
        "description": "Unlimited groups and premium support",
        "weeklyPrice": 40000,
        "monthlyPrice": 150000,
        "currency": "UGX",
        "isPopular": false,
        "isCurrent": false,
        "supportGroupsLimit": "unlimited",
        "directChatAccess": true,
        "features": [
          "Unlimited support groups",
          "Direct chat with therapist",
          "Dedicated wellness coordinator",
          "Priority crisis support",
          "All Premium plan features"
        ]
      }
    ],
    "currentPlan": {
      "id": "free",
      "name": "Free",
      "expiresAt": null,
      "status": "active"
    }
  }
}
```

### POST `/api/v1/client/subscriptions/subscribe`
Subscribe to a plan.

**Request Body:**
```json
{
  "planId": "premium",
  "billingCycle": "monthly",
  "paymentMethod": "mobile_money",
  "phoneNumber": "+256784740145"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription activated successfully",
  "data": {
    "subscriptionId": "sub_001",
    "planId": "premium",
    "planName": "Premium",
    "billingCycle": "monthly",
    "amount": 90000,
    "currency": "UGX",
    "startDate": "2025-10-23",
    "nextBillingDate": "2025-11-23",
    "status": "active",
    "features": {
      "supportGroupsLimit": 4,
      "directChatAccess": true
    }
  }
}
```

### GET `/api/v1/client/subscriptions/current`
Get current subscription details.

**Response:**
```json
{
  "success": true,
  "data": {
    "subscriptionId": "sub_001",
    "planId": "premium",
    "planName": "Premium",
    "billingCycle": "monthly",
    "amount": 90000,
    "currency": "UGX",
    "status": "active",
    "startDate": "2025-09-23",
    "nextBillingDate": "2025-11-23",
    "autoRenew": true,
    "features": {
      "supportGroupsLimit": 4,
      "groupsJoined": 3,
      "directChatAccess": true
    },
    "paymentMethod": "mobile_money"
  }
}
```

### PUT `/api/v1/client/subscriptions/upgrade`
Upgrade subscription plan.

**Request Body:**
```json
{
  "newPlanId": "unlimited",
  "billingCycle": "monthly"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription upgraded successfully",
  "data": {
    "subscriptionId": "sub_001",
    "newPlan": "unlimited",
    "effectiveDate": "2025-10-23",
    "nextBillingDate": "2025-11-23"
  }
}
```

### PUT `/api/v1/client/subscriptions/cancel`
Cancel subscription.

**Request Body:**
```json
{
  "reason": "Too expensive",
  "feedback": "Great service but can't afford right now"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription cancelled successfully",
  "data": {
    "cancelledAt": "2025-10-23T16:00:00Z",
    "accessUntil": "2025-11-23",
    "refundAmount": 0,
    "refundStatus": "not_applicable"
  }
}
```

### GET `/api/v1/client/subscriptions/billing-history`
Get subscription billing history.

**Response:**
```json
{
  "success": true,
  "data": {
    "billings": [
      {
        "id": "bill_001",
        "subscriptionId": "sub_001",
        "planName": "Premium",
        "amount": 90000,
        "currency": "UGX",
        "billingDate": "2025-10-23",
        "status": "paid",
        "paymentMethod": "mobile_money",
        "receiptUrl": "https://..."
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25
    }
  }
}
```

---

## 🧘 Meditations

### GET `/api/v1/client/meditations/articles`
Get meditation articles.

**Query Parameters:**
- `category`: string
- `page`: number
- `limit`: number

**Response:**
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": "1",
        "title": "The Power of Mindful Breathing",
        "excerpt": "Discover how simple breathing exercises can transform your mental state and reduce anxiety in just minutes.",
        "readTime": "5 min read",
        "category": "Mindfulness",
        "image": "https://...",
        "content": "Full article content here..."
      }
    ],
    "categories": ["Mindfulness", "Getting Started", "Tips & Tricks", "Techniques"],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 15
    }
  }
}
```

### GET `/api/v1/client/meditations/articles/:articleId`
Get detailed article content.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "The Power of Mindful Breathing",
    "content": "Full article content with HTML formatting...",
    "excerpt": "Discover how simple breathing exercises...",
    "readTime": "5 min read",
    "category": "Mindfulness",
    "image": "https://...",
    "author": "Dr. Sarah Johnson",
    "publishedAt": "2025-10-15",
    "tags": ["breathing", "mindfulness", "anxiety"]
  }
}
```

### GET `/api/v1/client/meditations/sounds`
Get meditation sounds/audio tracks.

**Query Parameters:**
- `category`: `Nature` | `Instrumental` | `Ambient` | `Spiritual` | `Focus`
- `page`: number
- `limit`: number

**Response:**
```json
{
  "success": true,
  "data": {
    "sounds": [
      {
        "id": "1",
        "title": "Ocean Waves",
        "duration": "30 min",
        "category": "Nature",
        "icon": "waves",
        "color": "#2196F3",
        "description": "Gentle ocean waves for deep relaxation",
        "audioUrl": "https://..."
      },
      {
        "id": "2",
        "title": "Rain & Thunder",
        "duration": "45 min",
        "category": "Nature",
        "icon": "thunderstorm",
        "color": "#607D8B",
        "description": "Soothing rain sounds with distant thunder",
        "audioUrl": "https://..."
      }
    ],
    "categories": ["Nature", "Instrumental", "Ambient", "Spiritual", "Focus"],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 8
    }
  }
}
```

### GET `/api/v1/client/meditations/quotes`
Get inspirational quotes.

**Query Parameters:**
- `random`: boolean (get random quote)
- `page`: number
- `limit`: number

**Response:**
```json
{
  "success": true,
  "data": {
    "quotes": [
      {
        "id": "1",
        "text": "The present moment is the only time over which we have dominion.",
        "author": "Thích Nhất Hạnh"
      },
      {
        "id": "2",
        "text": "Meditation is not evasion; it is a serene encounter with reality.",
        "author": "Thích Nhất Hạnh"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25
    }
  }
}
```

### GET `/api/v1/client/meditations/quotes/daily`
Get daily inspirational quote.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "text": "The present moment is the only time over which we have dominion.",
    "author": "Thích Nhất Hạnh",
    "date": "2025-10-23"
  }
}
```

---

## 💰 Wellness Vault

### GET `/api/v1/client/wallet/balance`
Get wallet balance.

**Response:**
```json
{
  "success": true,
  "data": {
    "balance": 88000,
    "currency": "UGX",
    "breakdown": {
      "momoTopup": 50000,
      "rewardPoints": 18000,
      "wellnessCredits": 20000
    }
  }
}
```

### POST `/api/v1/client/wallet/topup`
Top up wallet via Mobile Money.

**Request Body:**
```json
{
  "amount": 50000,
  "phoneNumber": "+256784740145",
  "provider": "mtn"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Topup initiated. Please complete payment on your phone.",
  "data": {
    "transactionId": "txn_001",
    "amount": 50000,
    "status": "pending"
  }
}
```

### GET `/api/v1/client/wallet/transactions`
Get transaction history.

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "txn_001",
        "type": "debit",
        "description": "Individual Therapy Session",
        "amount": -30000,
        "currency": "UGX",
        "category": "Therapy",
        "date": "2025-10-24",
        "time": "14:30",
        "status": "completed",
        "paymentMethod": "Wellness Vault"
      }
    ]
  }
}
```

### GET `/api/v1/client/wallet/transactions/:transactionId`
Get transaction details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "txn_001",
    "type": "debit",
    "description": "Individual Therapy Session",
    "amount": -30000,
    "currency": "UGX",
    "category": "Therapy",
    "date": "2025-10-24",
    "time": "14:30",
    "status": "completed",
    "paymentMethod": "Wellness Vault",
    "balanceAfter": 58000
  }
}
```

---

## 🔔 Notifications

### GET `/api/v1/client/notifications`
Get user notifications.

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif_001",
        "type": "appointment",
        "title": "Upcoming Session",
        "message": "Session with Dr. Nakato in 30 minutes",
        "isRead": false,
        "avatar": "https://...",
        "actionData": {
          "therapistId": 1,
          "appointmentId": "apt_001"
        }
      },
      {
        "id": 2,
        "title": "Goal Achievement",
        "message": "Congratulations! You completed your daily mindfulness goal",
        "type": "goal",
        "timestamp": "2024-01-14T08:15:00Z",
        "isRead": false,
        "actionData": {
          "goalId": 3
        }
      }
    ],
    "unreadCount": 5,
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 28
    }
  }
}
```

### PUT `/api/v1/client/notifications/:notificationId/read`
Mark notification as read.

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

### PUT `/api/v1/client/notifications/read-all`
Mark all notifications as read.

**Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "data": {
    "markedCount": 5
  }
}
```

---

## 👤 Profile & Settings

### GET `/api/v1/client/profile`
Get user profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+256784740145",
    "dateOfBirth": "1990-05-15",
    "gender": "Male",
    "profileImage": "https://...",
    "bio": "Mental health advocate",
    "joinedDate": "2024-12-01",
    "emailVerified": true,
    "phoneVerified": true
  }
}
```

### PUT `/api/v1/client/profile`
Update user profile.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+256784740145",
  "dateOfBirth": "1990-05-15",
  "gender": "Male",
  "bio": "Mental health advocate"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

### POST `/api/v1/client/profile/avatar`
Upload profile avatar.

**Request:** multipart/form-data

**Response:**
```json
{
  "success": true,
  "data": {
    "avatarUrl": "https://storage.innerspark.com/avatars/user_123.jpg"
  }
}
```

### PUT `/api/v1/client/settings/password`
Change password.

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!",
  "confirmPassword": "NewPass123!"
}
```

**Validation:**
- currentPassword: required
- newPassword: min 8 chars, uppercase, lowercase, number, special char
- confirmPassword: must match newPassword

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### GET `/api/v1/client/settings/privacy`
Get privacy settings.

**Response:**
```json
{
  "success": true,
  "data": {
    "profileVisibility": "private",
    "showOnlineStatus": true,
    "allowMessages": true,
    "dataSharing": false
  }
}
```

### PUT `/api/v1/client/settings/privacy`
Update privacy settings.

**Request Body:**
```json
{
  "profileVisibility": "private",
  "showOnlineStatus": true,
  "allowMessages": true,
  "dataSharing": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Privacy settings updated successfully"
}
```

### GET `/api/v1/client/settings/notifications`
Get notification preferences.

**Response:**
```json
{
  "success": true,
  "data": {
    "pushNotifications": true,
    "emailNotifications": true,
    "smsNotifications": false,
    "appointmentReminders": true,
    "goalReminders": true,
    "eventUpdates": true
  }
}
```

### PUT `/api/v1/client/settings/notifications`
Update notification preferences.

**Request Body:**
```json
{
  "pushNotifications": true,
  "emailNotifications": true,
  "appointmentReminders": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification preferences updated successfully"
}
```

### POST `/api/v1/client/data/export`
Request data export.

**Request Body:**
```json
{
  "format": "json",
  "categories": ["profile", "mood", "journal", "goals", "messages"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data export request submitted. You'll receive an email with download link.",
  "data": {
    "requestId": "export_001",
    "estimatedTime": "5-10 minutes"
  }
}
```

### POST `/api/v1/client/account/deactivate`
Deactivate account temporarily.

**Request Body:**
```json
{
  "reason": "Taking a break",
  "feedback": "Need some time off"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account deactivated. You can reactivate by logging in again."
}
```

### POST `/api/v1/client/account/delete`
Delete account permanently.

**Request Body:**
```json
{
  "password": "UserPass123!",
  "reason": "No longer need the service",
  "confirmDeletion": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account deletion scheduled. All data will be permanently deleted in 30 days."
}
```

---

## 🚨 Emergency

### GET `/api/v1/client/emergency/contacts`
Get emergency contacts.

**Response:**
```json
{
  "success": true,
  "data": {
    "contacts": [
      {
        "id": "contact_001",
        "name": "Jane Doe",
        "relationship": "Sister",
        "phoneNumber": "+256784740145",
        "email": "jane@example.com",
        "isPrimary": true
      }
    ]
  }
}
```

### POST `/api/v1/client/emergency/contacts`
Add emergency contact.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "relationship": "Sister",
  "phoneNumber": "+256784740145",
  "email": "jane@example.com",
  "isPrimary": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Emergency contact added successfully",
  "data": {
    "contactId": "contact_001"
  }
}
```

### DELETE `/api/v1/client/emergency/contacts/:contactId`
Remove emergency contact.

**Response:**
```json
{
  "success": true,
  "message": "Emergency contact removed successfully"
}
```

### GET `/api/v1/client/emergency/safety-plan`
Get safety plan.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "plan_001",
    "warningSigns": [
      "Feeling overwhelmed",
      "Difficulty sleeping"
    ],
    "copingStrategies": [
      "Deep breathing exercises",
      "Call a friend"
    ],
    "distractions": [
      "Listen to music",
      "Go for a walk"
    ],
    "supportContacts": [
      {
        "name": "Jane Doe",
        "phoneNumber": "+256784740145"
      }
    ],
    "professionalContacts": [
      {
        "name": "Dr. Sarah Johnson",
        "phoneNumber": "+256700123456",
        "type": "therapist"
      }
    ],
    "safeEnvironment": "Remove harmful objects, stay in well-lit areas",
    "updatedAt": "2025-10-23T14:30:00Z"
  }
}
```

### PUT `/api/v1/client/emergency/safety-plan`
Update safety plan.

**Request Body:**
```json
{
  "warningSigns": ["Feeling overwhelmed"],
  "copingStrategies": ["Deep breathing"],
  "distractions": ["Listen to music"],
  "safeEnvironment": "Stay with family"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Safety plan updated successfully",
  "data": {
    "planId": "plan_001",
    "updatedAt": "2025-10-23T16:00:00Z"
  }
}
```

### GET `/api/v1/client/emergency/crisis-lines`
Get crisis hotline numbers.

**Response:**
```json
{
  "success": true,
  "data": {
    "hotlines": [
      {
        "id": 1,
        "name": "National Crisis Hotline",
        "phoneNumber": "+256-800-567-890",
        "description": "24/7 crisis support",
        "available": "24/7"
      },
      {
        "id": 2,
        "name": "Mental Health Emergency",
        "phoneNumber": "+256-700-123-456",
        "description": "Immediate mental health support",
        "available": "24/7"
      }
    ]
  }
}
```

---

## 🔄 Real-time Features (WebSocket)

### Connection
```
wss://api.innerspark.com/ws/client?token=<jwt_token>
```

### Events

**Incoming:**
- `new_message` - New chat message
- `appointment_reminder` - Upcoming appointment
- `group_message` - New group message
- `notification` - New notification

**Outgoing:**
- `send_message` - Send message
- `typing` - User is typing
- `read_message` - Mark as read

---

## 📝 Common Response Format

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
- `429` - Too Many Requests
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

### Pagination
Most list endpoints support pagination with these parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

Response includes:
```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 200,
    "hasMore": true
  }
}
```

---

## 📊 Endpoint Summary

### Total Endpoints: 80+

**By Category:**
- Authentication: 7 endpoints
- Home Dashboard: 1 endpoint
- Mood Tracking: 5 endpoints
- Journal: 5 endpoints
- Goals: 6 endpoints
- Therapists: 4 endpoints
- Appointments: 6 endpoints
- Events: 5 endpoints
- Support Groups: 7 endpoints
- Messages: 3 endpoints
- Subscriptions: 6 endpoints
- Meditations: 6 endpoints
- Wellness Vault: 4 endpoints
- Notifications: 3 endpoints
- Profile & Settings: 10 endpoints
- Emergency: 4 endpoints

**HTTP Methods:**
- GET: 50+ endpoints (read operations)
- POST: 20+ endpoints (create operations)
- PUT: 8+ endpoints (update operations)
- DELETE: 5+ endpoints (delete operations)

**Key Features:**
- ✅ Complete request/response examples
- ✅ Validation rules documented
- ✅ Error responses included
- ✅ Query parameters specified
- ✅ Pagination support
- ✅ Real-time WebSocket events
- ✅ Authentication requirements
- ✅ Rate limiting guidelines

---

## 🔧 Implementation Notes

### Priority Levels

**P0 (Critical - Must Have):**
- Authentication endpoints
- Mood tracking (core feature)
- Appointments booking
- Support Groups (subscription-based)
- Subscriptions management
- Wellness Vault (payment system)

**P1 (High Priority):**
- Goals management
- Events registration
- Messages (direct chat)
- Notifications
- Profile management

**P2 (Medium Priority):**
- Journal entries
- Meditations content
- Therapist reviews
- Emergency contacts

**P3 (Nice to Have):**
- Advanced search
- Analytics
- Recommendations

### Database Considerations

**Required Tables:**
- users, therapists
- appointments, events
- support_groups, group_members, group_messages
- subscriptions, transactions
- mood_entries, goals
- notifications, messages
- meditations (articles, sounds, quotes)

### Third-Party Integrations

**Required:**
- Mobile Money API (MTN, Airtel) for payments
- SMS/Email service for notifications
- Cloud storage for media files
- WebSocket server for real-time features

**Optional:**
- Analytics service
- Push notification service
- Video call integration

---

## 🎨 User Settings

<!-- ADDED: New section for user preferences and appearance settings -->

### GET `/api/v1/client/settings`
Get all user settings and preferences.

**Response:**
```json
{
  "success": true,
  "data": {
    "appearance": {
      "theme": "light",
      "useSystemTheme": false,
      "highContrast": false,
      "reducedMotion": false,
      "largeText": false,
      "accentColor": "#5D7BF5",
      "fontStyle": "system"
    },
    "privacy": {
      "walletBalanceVisibility": true
      // REMOVED: wastecoinBalanceVisibility (not used in app)
    },
    "notifications": {
      "pushEnabled": true,
      "emailEnabled": true,
      "moodReminders": true
    }
  }
}
```

### GET `/api/v1/client/settings/appearance`
Get appearance settings only.

**Response:**
```json
{
  "success": true,
  "data": {
    "theme": "light",
    "useSystemTheme": false,
    "highContrast": false,
    "reducedMotion": false,
    "largeText": false,
    "accentColor": "#5D7BF5",
    "fontStyle": "system"
  }
}
```

### PUT `/api/v1/client/settings/appearance`
Update appearance settings.

**Request Body:**
```json
{
  "theme": "dark",
  "useSystemTheme": false,
  "highContrast": false,
  "reducedMotion": false,
  "largeText": false
}
```

**Validation:**
- `theme`: Required, one of: `light` | `dark` | `auto`
- `useSystemTheme`: Boolean
- `highContrast`: Boolean
- `reducedMotion`: Boolean
- `largeText`: Boolean
- `accentColor`: Optional, valid hex color
- `fontStyle`: Optional, one of: `system` | `custom`

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

### PUT `/api/v1/client/settings/privacy`
Update privacy settings.

**Request Body:**
```json
{
  "walletBalanceVisibility": true
  // REMOVED: wastecoinBalanceVisibility (not used in app)
}
```

**Response:**
```json
{
  "success": true,
  "message": "Privacy settings updated successfully",
  "data": {
    "walletBalanceVisibility": true,
    "updatedAt": "2025-10-29T03:00:00Z"
  }
}
```

---

**Document Status:** ✅ Complete  
**Last Updated:** October 29, 2025 <!-- UPDATED -->  
**Version:** 1.1 <!-- UPDATED: Added user settings endpoints -->  
**Total Lines:** 2,100+ <!-- UPDATED: Increased line count -->  
**Coverage:** All client-side features + User Settings <!-- UPDATED -->  
**Contact:** Backend Team

---

## 📞 Support

For questions or clarifications about these endpoints:
- Backend Team Lead
- API Documentation: [Link to detailed docs]
- Postman Collection: [Link to collection]
