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
