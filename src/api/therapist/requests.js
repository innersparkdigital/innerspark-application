/**
 * Therapist Requests API Functions
 */
import { APIInstance } from '../LHAPI';

/**
 * Get client requests
 * @param {string} therapistId - Therapist ID
 * @param {Object} [filters={}] - Filter options
 * @param {string} [filters.status] - Status (pending, history)
 * @returns {Promise<{success: boolean, data: Object}>} Requests list
 */
export const getRequests = async (therapistId, filters = {}) => {
    // Note: If backend endpoint is not ready, this might need simulated delay wrapper
    // But we define the contract here.
    const response = await APIInstance.get('/th/requests', {
        params: { therapist_id: therapistId, ...filters }
    });
    return response.data;
};

/**
 * Accept client request
 * @param {string} requestId - Request ID
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, message: string}>} Success confirmation
 */
export const acceptRequest = async (requestId, therapistId) => {
    const response = await APIInstance.post(`/th/requests/${requestId}/accept`, {
        therapist_id: therapistId
    });
    return response.data;
};

/**
 * Decline client request
 * @param {string} requestId - Request ID
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, message: string}>} Success confirmation
 */
export const declineRequest = async (requestId, therapistId) => {
    const response = await APIInstance.post(`/th/requests/${requestId}/decline`, {
        therapist_id: therapistId
    });
    return response.data;
};
