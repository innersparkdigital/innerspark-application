/**
 * Client Messages/Chat API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get user chats
 * @param {string} userId - User ID
 * @returns {Promise} Chats list
 */
export const getChats = async (userId) => {
    const response = await APIInstance.get('/client/chats', {
        params: { user_id: userId }
    });
    return response.data;
};

/**
 * Get messages in chat
 * @param {string} chatId - Chat ID
 * @param {string} userId - User ID
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise} Messages list
 */
export const getChatMessages = async (chatId, userId, page = 1, limit = 20) => {
    const response = await APIInstance.get(`/client/chats/${chatId}/messages`, {
        params: { user_id: userId, page, limit }
    });
    return response.data;
};

/**
 * Send message in chat
 * @param {string} chatId - Chat ID
 * @param {string} userId - User ID
 * @param {string} content - Message content
 * @param {string} type - Message type (text, image, etc.)
 * @returns {Promise} Sent message
 */
export const sendChatMessage = async (chatId, userId, content, type = 'text') => {
    const response = await APIInstance.post(`/client/chats/${chatId}/messages`, {
        user_id: userId,
        content,
        type
    });
    return response.data;
};

/**
 * Mark chat as read
 * @param {string} chatId - Chat ID
 * @param {string} userId - User ID
 * @returns {Promise} Success message
 */
export const markChatAsRead = async (chatId, userId) => {
    const response = await APIInstance.put(`/client/chats/${chatId}/read`, {
        user_id: userId
    });
    return response.data;
};
