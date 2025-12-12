/**
 * Client Events API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get events list
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise} Events list
 */
export const getEvents = async (page = 1, limit = 20) => {
    const response = await APIInstance.get('/client/events', {
        params: { page, limit }
    });
    return response.data;
};

/**
 * Get event details
 * @param {string} eventId - Event ID
 * @returns {Promise} Event details
 */
export const getEventById = async (eventId) => {
    const response = await APIInstance.get(`/client/events/${eventId}`);
    return response.data;
};

/**
 * Register for event
 * @param {string} eventId - Event ID
 * @param {string} userId - User ID
 * @param {string} paymentMethod - Payment method (wallet, card, etc.)
 * @param {string} phoneNumber - Phone number for mobile money
 * @returns {Promise} Registration confirmation
 */
export const registerForEvent = async (eventId, userId, paymentMethod, phoneNumber) => {
    const response = await APIInstance.post(`/client/events/${eventId}/register`, {
        user_id: userId,
        paymentMethod,
        phoneNumber
    });
    return response.data;
};

/**
 * Unregister from event
 * @param {string} eventId - Event ID
 * @param {string} userId - User ID
 * @returns {Promise} Unregister confirmation
 */
export const unregisterFromEvent = async (eventId, userId) => {
    const response = await APIInstance.delete(`/client/events/${eventId}/unregister`, {
        params: { user_id: userId }
    });
    return response.data;
};

/**
 * Get user's registered events
 * @param {string} userId - User ID
 * @returns {Promise} User's events list
 */
export const getMyEvents = async (userId) => {
    const response = await APIInstance.get('/client/events/my-events', {
        params: { user_id: userId }
    });
    return response.data;
};
