/**
 * Client Support Tickets API Functions
 */
import { APIInstance } from '../LHAPI';

/**
 * Get user's support tickets
 * @param {string} userId - User ID
 * @param {string} status - Filter by status: 'all', 'open', 'pending', 'resolved'
 * @returns {Promise} List of support tickets
 */
export const getSupportTickets = async (userId, status = 'all') => {
    const response = await APIInstance.get('/client/support/tickets', {
        params: { user_id: userId, status: status !== 'all' ? status : undefined }
    });
    return response.data;
};

/**
 * Get support ticket by ID
 * @param {string} ticketId - Ticket ID
 * @param {string} userId - User ID
 * @returns {Promise} Ticket details with messages
 */
export const getSupportTicket = async (ticketId, userId) => {
    const response = await APIInstance.get(`/client/support/tickets/${ticketId}`, {
        params: { user_id: userId }
    });
    return response.data;
};

/**
 * Create new support ticket
 * @param {string} userId - User ID
 * @param {object} ticketData - Ticket data {subject, category, priority, description}
 * @returns {Promise} Created ticket details
 */
export const createSupportTicket = async (userId, ticketData) => {
    const response = await APIInstance.post('/client/support/tickets', {
        user_id: userId,
        ...ticketData
    });
    return response.data;
};

/**
 * Add message/reply to support ticket
 * @param {string} ticketId - Ticket ID
 * @param {string} userId - User ID
 * @param {string} message - Message content
 * @returns {Promise} Updated ticket with new message
 */
export const addTicketMessage = async (ticketId, userId, message) => {
    const response = await APIInstance.post(`/client/support/tickets/${ticketId}/messages`, {
        user_id: userId,
        message
    });
    return response.data;
};

/**
 * Close/resolve support ticket
 * @param {string} ticketId - Ticket ID
 * @param {string} userId - User ID
 * @returns {Promise} Updated ticket status
 */
export const closeSupportTicket = async (ticketId, userId) => {
    const response = await APIInstance.post(`/client/support/tickets/${ticketId}/close`, {
        user_id: userId
    });
    return response.data;
};

/**
 * Reopen support ticket
 * @param {string} ticketId - Ticket ID
 * @param {string} userId - User ID
 * @returns {Promise} Updated ticket status
 */
export const reopenSupportTicket = async (ticketId, userId) => {
    const response = await APIInstance.post(`/client/support/tickets/${ticketId}/reopen`, {
        user_id: userId
    });
    return response.data;
};
