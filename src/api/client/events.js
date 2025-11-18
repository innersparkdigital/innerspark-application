/**
 * Client Events API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get events list
 * @param {Object} filters - { category, date, isOnline }
 * @returns {Promise} Events list
 */
export const getEvents = async (filters = {}) => {
    const response = await APIInstance.get('/client/events', {
        params: filters
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
 * @returns {Promise} Registration confirmation
 */
export const registerForEvent = async (eventId) => {
    const response = await APIInstance.post(`/client/events/${eventId}/register`);
    return response.data;
};
