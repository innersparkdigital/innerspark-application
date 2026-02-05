/**
 * Therapist Events API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get events list
 * @param {string} therapistId - Therapist ID
 * @param {Object} [filters={}] - Filter options
 * @param {'all'|'upcoming'|'past'} [filters.status] - Event status filter
 * @param {'Workshop'|'Training'|'Seminar'|'Summit'} [filters.category] - Event category  
 * @param {number} [filters.page=1] - Page number
 * @param {number} [filters.limit=20] - Items per page
 * @returns {Promise<{success: boolean, data: Object}>} Events list with pagination and stats
 * @example
 * const result = await getEvents(therapistId, { status: 'upcoming', page: 1, limit: 20 });
 * // Returns:
 * // {
 * //   success: true,
 * //   data: {
 * //     events: [{
 * //       id: "event_001",
 * //       title: "Mental Health First Aid Training",
 * //       description: "Learn essential skills...",
 * //       category: "Training",
 * //       date: "2025-11-15",
 * //       startTime: "09:00",
 * //       endTime: "17:00",
 * //       location: "Virtual",
 * //       maxAttendees: 50,
 * //       registeredCount: 32,
 * //       price: 25000,
 * //       currency: "UGX",
 * //       status: "upcoming",
 * //       image: "https://..."
 * //     }],
 * //     stats: { totalEvents: 12, upcomingEvents: 5, totalRegistrations: 245 },
 * //     pagination: { currentPage: 1, totalPages: 3, totalItems: 12 }
 * //   }
 * // }
 */
export const getEvents = async (therapistId, filters = {}) => {
    const response = await APIInstance.get('/th/events', {
        params: { therapist_id: therapistId, ...filters }
    });
    return response.data;
};

/**
 * Get event details by ID
 * @param {string} eventId - Event ID
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, data: Object}>} Event details with attendees, agenda, and speakers
 * @example
 * const result = await getEventById(eventId, therapistId);
 * // Returns full event details including:
 * // - Event info (title, description, date, location, pricing)
 * // - Attendees list with payment status
 * // - Agenda items with time and duration
 * // - Speakers information
 * // - Available seats calculation
 */
export const getEventById = async (eventId, therapistId) => {
    const response = await APIInstance.get(`/th/events/${eventId}`, {
        params: { therapist_id: therapistId }
    });
    return response.data;
};

/**
 * Create new event
 * **NOTE**: This endpoint accepts multipart/form-data for image upload
 * @param {FormData} eventData - FormData object with event details
 * @param {string} eventData.therapist_id - Therapist ID
 * @param {string} eventData.title - Event title (max 100 chars)
 * @param {string} eventData.description - Event description (max 1000 chars)
 * @param {'Workshop'|'Training'|'Seminar'|'Summit'} eventData.category - Event category
 * @param {string} eventData.date - Event date (YYYY-MM-DD, must be future date)
 * @param {string} eventData.startTime - Start time (HH:MM)
 * @param {string} eventData.endTime - End time (HH:MM)
 * @param {string} eventData.location - Event location (or "Virtual")
 * @param {number} eventData.maxAttendees - Max attendees (min 1, max 500)
 * @param {number} eventData.price - Event price (min 0)
 * @param {string} eventData.currency - Currency code (e.g., "UGX")
 * @param {File} [eventData.image] - Event image file
 * @returns {Promise<{success: boolean, message: string, data: Object}>} Created event with meeting link
 * @example
 * const formData = new FormData();
 * formData.append('therapist_id', therapistId);
 * formData.append('title', 'Mental Health First Aid Training');
 * formData.append('description', 'Learn essential skills...');
 * formData.append('category', 'Training');
 * formData.append('date', '2025-11-15');
 * formData.append('startTime', '09:00');
 * formData.append('endTime', '17:00');
 * formData.append('location', 'Virtual');
 * formData.append('maxAttendees', '50');
 * formData.append('price', '25000');
 * formData.append('currency', 'UGX');
 * formData.append('image', imageFile);
 * 
 * const result = await createEvent(formData);
 * // Returns:
 * // {
 * //   success: true,
 * //   message: "Event created successfully",
 * //   data: {
 * //     eventId: "event_001",
 * //     meetingLink: "https://meet.innerspark.com/event/001",
 * //     createdAt: "2025-10-20T10:00:00Z"
 * //   }
 * // }
 */
export const createEvent = async (eventData) => {
    const response = await APIInstance.post('/th/events', eventData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

/**
 * Update event
 * @param {string} eventId - Event ID
 * @param {Object} updateData - Update details
 * @param {string} updateData.therapist_id - Therapist ID
 * @param {string} [updateData.title] - Updated title
 * @param {string} [updateData.description] - Updated description
 * @param {string} [updateData.date] - Updated date
 * @param {number} [updateData.maxAttendees] - Updated max attendees
 * @returns {Promise<{success: boolean, message: string, data: Object}>} Updated event
 * @example
 * const result = await updateEvent(eventId, {
 *   therapist_id: therapistId,
 *   title: "Updated Title",
 *   maxAttendees: 60
 * });
 * // Returns:
 * // {
 * //   success: true,
 * //   message: "Event updated successfully",
 * //   data: { eventId: "event_001", updatedAt: "2025-10-23T16:00:00Z" }
 * // }
 */
export const updateEvent = async (eventId, updateData) => {
    const response = await APIInstance.put(`/th/events/${eventId}`, updateData);
    return response.data;
};

/**
 * Delete event
 * @param {string} eventId - Event ID
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, message: string}>} Deletion confirmation
 * @example
 * const result = await deleteEvent(eventId, therapistId);
 * // Returns: {
 * //   success: true,
 * //   message: "Event cancelled successfully. All attendees will be notified and refunded."
 * // }
 */
export const deleteEvent = async (eventId, therapistId) => {
    const response = await APIInstance.delete(`/th/events/${eventId}`, {
        params: { therapist_id: therapistId }
    });
    return response.data;
};

/**
 * Start event
 * @param {string} eventId - Event ID
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, message: string, data: Object}>} Event start confirmation
 * @example
 * const result = await startEvent(eventId, therapistId);
 * // Returns:
 * // {
 * //   success: true,
 * //   message: "Event started",
 * //   data: {
 * //     eventId: "event_001",
 * //     startTime: "2025-11-15T09:00:00Z",
 * //     attendeesPresent: 28
 * //   }
 * // }
 */
export const startEvent = async (eventId, therapistId) => {
    const response = await APIInstance.post(`/th/events/${eventId}/start`, {
        therapist_id: therapistId
    });
    return response.data;
};

/**
 * Complete event
 * @param {string} eventId - Event ID
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, message: string, data: Object}>} Event completion confirmation
 * @example
 * const result = await completeEvent(eventId, therapistId);
 * // Returns:
 * // {
 * //   success: true,
 * //   message: "Event marked as completed",
 * //   data: {
 * //     eventId: "event_001",
 * //     completedAt: "2025-11-15T17:00:00Z",
 * //     totalAttendees: 32,
 * //     attendeesPresent: 28,
 * //     completionRate: "87.5%"
 * //   }
 * // }
 */
export const completeEvent = async (eventId, therapistId) => {
    const response = await APIInstance.post(`/th/events/${eventId}/complete`, {
        therapist_id: therapistId
    });
    return response.data;
};

/**
 * Get event attendees
 * @param {string} eventId - Event ID
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, data: Object}>} List of event attendees with payment and check-in status
 * @example
 * const result = await getEventAttendees(eventId, therapistId);
 * // Returns:
 * // {
 * //   success: true,
 * //   data: {
 * //     attendees: [{
 * //       id: "user_001",
 * //       name: "John Doe",
 * //       email: "john@example.com",
 * //       phoneNumber: "+256784740145",
 * //       registeredAt: "2025-10-22T14:00:00Z",
 * //       paymentStatus: "completed",
 * //       paymentAmount: 25000,
 * //       attended: false
 * //     }],
 * //     stats: {
 * //       totalRegistered: 32,
 * //       paidCount: 30,
 * //       pendingPayment: 2,
 * //       totalRevenue: 750000
 * //     }
 * //   }
 * // }
 */
export const getEventAttendees = async (eventId, therapistId) => {
    const response = await APIInstance.get(`/th/events/${eventId}/attendees`, {
        params: { therapist_id: therapistId }
    });
    return response.data;
};

/**
 * Check-in attendee to event
 * @param {string} eventId - Event ID
 * @param {string} clientId - Client ID to check in
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, message: string, data: Object}>} Check-in confirmation
 * @example
 * const result = await checkInAttendee(eventId, clientId, therapistId);
 * // Returns:
 * // {
 * //   success: true,
 * //   message: "Attendee checked in successfully",
 * //   data: {
 * //     userId: "user_001",
 * //     checkedInAt: "2025-11-15T09:05:00Z"
 * //   }
 * // }
 */
export const checkInAttendee = async (eventId, clientId, therapistId) => {
    const response = await APIInstance.post(`/th/events/${eventId}/attendees/${clientId}/check-in`, {
        therapist_id: therapistId
    });
    return response.data;
};
