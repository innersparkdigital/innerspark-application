/**
 * Client Therapists API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get therapists list
 * @param {Object} filters - { specialty, location, availability }
 * @returns {Promise} Therapists list
 */
export const getTherapists = async (filters = {}) => {
    const response = await APIInstance.get('/client/therapists', {
        params: filters
    });
    return response.data;
};

/**
 * Get therapist details by ID
 * @param {string} therapistId - Therapist ID
 * @returns {Promise} Therapist details
 */
export const getTherapistById = async (therapistId) => {
    const response = await APIInstance.get(`/client/therapists/${therapistId}`);
    return response.data;
};

/**
 * Get therapist available time slots
 * NOTE: Backend may not have implemented this endpoint yet
 * @param {string} therapistId - Therapist ID
 * @param {Object} params - Query parameters { date, sessionType }
 * @returns {Promise} Available time slots
 */
export const getTherapistAvailability = async (therapistId, params = {}) => {
    const response = await APIInstance.get(`/client/therapists/${therapistId}/availability`, {
        params
    });
    return response.data;
};

/**
 * Get therapist reviews
 * NOTE: Backend may not have implemented this endpoint yet
 * @param {string} therapistId - Therapist ID
 * @param {Object} params - Query parameters { page, limit, rating }
 * @returns {Promise} Therapist reviews
 */
export const getTherapistReviews = async (therapistId, params = {}) => {
    const response = await APIInstance.get(`/client/therapists/${therapistId}/reviews`, {
        params
    });
    return response.data;
};
