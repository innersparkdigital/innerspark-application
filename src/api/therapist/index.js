/**
 * Therapist API Functions
 * 
 * TODO: Add therapist-specific API functions here
 * Examples:
 * - getTherapistDashboard()
 * - getClientRequests()
 * - acceptRequest() / declineRequest()
 * - getTherapistAppointments()
 * - getTherapistGroups()
 * - getTherapistChats()
 * - getClientProfile()
 * - updateSessionNotes()
 * etc.
 */
import { APIInstance } from '../LHAPI';


/**
 * Get therapist dashboard data
 * @returns {Promise} Dashboard stats and overview
 */
export const getTherapistDashboard = async () => {
    const response = await APIInstance.get('/th/dashboard');
    return response.data;
};

/**
 * Get pending client requests
 * @param {Object} filters - { status, urgency }
 * @returns {Promise} Client requests list
 */
export const getClientRequests = async (filters = {}) => {
    const response = await APIInstance.get('/th/requests', {
        params: filters
    });
    return response.data;
};

/**
 * Accept client request
 * @param {string} requestId - Request ID
 * @returns {Promise} Acceptance confirmation
 */
export const acceptRequest = async (requestId) => {
    const response = await APIInstance.post(`/th/requests/${requestId}/accept`);
    return response.data;
};

/**
 * Decline client request
 * @param {string} requestId - Request ID
 * @param {string} reason - Decline reason
 * @returns {Promise} Decline confirmation
 */
export const declineRequest = async (requestId, reason) => {
    const response = await APIInstance.post(`/th/requests/${requestId}/decline`, {
        reason
    });
    return response.data;
};

// TODO: Add more therapist functions as needed
