/**
 * Therapist Events Manager
 * Handles events API calls with graceful error handling
 * Returns empty arrays for 404 (no data available)
 */
import {
    getEvents,
    getEventById,
    createEvent as createEventAPI,
    updateEvent as updateEventAPI,
    deleteEvent,
    startEvent as startEventAPI,
    completeEvent as completeEventAPI,
    getEventAttendees,
    checkInAttendee as checkInAttendeeAPI,
} from '../api/therapist/events';

/**
 * Load events list from API
 * Returns empty array if endpoint returns 404 (no data)
 */
export const loadEvents = async (therapistId: string, filters: any = {}) => {
    try {
        console.log('🎪 Loading events from API with filters:', filters);
        const response = await getEvents(therapistId, filters);

        if (response.success && response.data) {
            const events = response.data.events || [];
            console.log('📊 Events count:', events.length);
            return { success: true, events, stats: response.data.stats };
        } else {
            console.log('⚠️ API response missing success or data');
            return { success: false, error: 'Invalid response format', events: [] };
        }
    } catch (error: any) {
        console.log('❌ Error loading events:', error?.message);

        if (error?.response?.status === 404) {
            console.log('📦 GET /th/events endpoint returns 404');
            return { success: false, error: 'No events available', isEmpty: true, events: [] };
        }

        return { success: false, error: error?.message || 'Failed to load events', events: [] };
    }
};

/**
 * Load event details by ID
 */
export const loadEventDetails = async (eventId: string, therapistId: string) => {
    try {
        console.log('🎪 Loading event details for ID:', eventId);
        const response = await getEventById(eventId, therapistId);

        if (response.success && response.data) {
            return { success: true, event: response.data };
        } else {
            return { success: false, error: 'Invalid response format' };
        }
    } catch (error: any) {
        console.log('❌ Error loading event details:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Event not found' };
        }

        return { success: false, error: error?.message || 'Failed to load event details' };
    }
};

/**
 * Create a new event
 */
export const createEvent = async (eventData: FormData) => {
    try {
        console.log('🎪 Creating new event');
        const response = await createEventAPI(eventData);

        if (response.success) {
            console.log('✅ Event created successfully');
            return { success: true, data: response.data };
        } else {
            return { success: false, error: response.message || 'Failed to create event' };
        }
    } catch (error: any) {
        console.log('❌ Error creating event:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Create event endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to create event' };
    }
};

/**
 * Update an event
 */
export const updateEvent = async (eventId: string, updateData: any) => {
    try {
        console.log('🎪 Updating event:', eventId);
        const response = await updateEventAPI(eventId, updateData);

        if (response.success) {
            console.log('✅ Event updated successfully');
            return { success: true, data: response.data };
        } else {
            return { success: false, error: response.message || 'Failed to update event' };
        }
    } catch (error: any) {
        console.log('❌ Error updating event:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Update event endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to update event' };
    }
};

/**
 * Delete/cancel an event
 */
export const deleteEventById = async (eventId: string, therapistId: string) => {
    try {
        console.log('🎪 Deleting event:', eventId);
        const response = await deleteEvent(eventId, therapistId);

        if (response.success) {
            console.log('✅ Event deleted successfully');
            return { success: true };
        } else {
            return { success: false, error: response.message || 'Failed to delete event' };
        }
    } catch (error: any) {
        console.log('❌ Error deleting event:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Delete event endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to delete event' };
    }
};

/**
 * Start an event
 */
export const startEvent = async (eventId: string, therapistId: string) => {
    try {
        console.log('🎪 Starting event:', eventId);
        const response = await startEventAPI(eventId, therapistId);

        if (response.success) {
            console.log('✅ Event started');
            return { success: true, data: response.data };
        } else {
            return { success: false, error: response.message || 'Failed to start event' };
        }
    } catch (error: any) {
        console.log('❌ Error starting event:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Start event endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to start event' };
    }
};

/**
 * Complete an event
 */
export const completeEvent = async (eventId: string, therapistId: string) => {
    try {
        console.log('🎪 Completing event:', eventId);
        const response = await completeEventAPI(eventId, therapistId);

        if (response.success) {
            console.log('✅ Event completed');
            return { success: true, data: response.data };
        } else {
            return { success: false, error: response.message || 'Failed to complete event' };
        }
    } catch (error: any) {
        console.log('❌ Error completing event:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Complete event endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to complete event' };
    }
};

/**
 * Load event attendees
 */
export const loadEventAttendees = async (eventId: string, therapistId: string) => {
    try {
        console.log('👥 Loading event attendees for:', eventId);
        const response = await getEventAttendees(eventId, therapistId);

        if (response.success && response.data) {
            const attendees = response.data.attendees || [];
            return { success: true, attendees, stats: response.data.stats };
        } else {
            return { success: false, error: 'Invalid response format', attendees: [] };
        }
    } catch (error: any) {
        console.log('❌ Error loading attendees:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Attendees not available', isEmpty: true, attendees: [] };
        }

        return { success: false, error: error?.message || 'Failed to load attendees', attendees: [] };
    }
};

/**
 * Check in an attendee
 */
export const checkInAttendee = async (eventId: string, clientId: string, therapistId: string) => {
    try {
        console.log('✅ Checking in attendee:', clientId);
        const response = await checkInAttendeeAPI(eventId, clientId, therapistId);

        if (response.success) {
            console.log('✅ Attendee checked in');
            return { success: true, data: response.data };
        } else {
            return { success: false, error: response.message || 'Failed to check in attendee' };
        }
    } catch (error: any) {
        console.log('❌ Error checking in attendee:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Check-in endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to check in attendee' };
    }
};
