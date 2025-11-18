/**
 * Client Messages/Chat API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get user conversations
 * @returns {Promise} Conversations list
 */
export const getConversations = async () => {
    const response = await APIInstance.get('/client/messages/conversations');
    return response.data;
};

/**
 * Get messages in conversation
 * @param {string} conversationId - Conversation ID
 * @param {number} page - Page number
 * @returns {Promise} Messages list
 */
export const getMessages = async (conversationId, page = 1) => {
    const response = await APIInstance.get(`/client/messages/${conversationId}`, {
        params: { page }
    });
    return response.data;
};

/**
 * Send message
 * @param {string} conversationId - Conversation ID
 * @param {string} message - Message text
 * @returns {Promise} Sent message
 */
export const sendMessage = async (conversationId, message) => {
    const response = await APIInstance.post(`/client/messages/${conversationId}`, {
        message
    });
    return response.data;
};
