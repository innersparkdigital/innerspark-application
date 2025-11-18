/**
 * Client Support Groups API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get support groups directory
 * @param {string} userId - User ID
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise} Groups list and user membership info
 */
export const getGroups = async (userId, page = 1, limit = 20) => {
    const response = await APIInstance.get('/client/groups', {
        params: { user_id: userId, page, limit }
    });
    return response.data;
};

/**
 * Get user's joined groups
 * @param {string} userId - User ID
 * @returns {Promise} User's groups list
 */
export const getMyGroups = async (userId) => {
    const response = await APIInstance.get('/client/groups/my-groups', {
        params: { user_id: userId }
    });
    return response.data;
};

/**
 * Get group details
 * @param {string} groupId - Group ID
 * @param {string} userId - User ID
 * @returns {Promise} Group details
 */
export const getGroupById = async (groupId, userId) => {
    const response = await APIInstance.get(`/client/groups/${groupId}`, {
        params: { user_id: userId }
    });
    return response.data;
};

/**
 * Join support group
 * @param {string} groupId - Group ID
 * @param {string} userId - User ID
 * @param {string} reason - Reason for joining (optional)
 * @param {boolean} agreeToGuidelines - Agreement to group guidelines
 * @returns {Promise} Join confirmation or membership limit error
 */
export const joinGroup = async (groupId, userId, reason = '', agreeToGuidelines = true) => {
    const response = await APIInstance.post(`/client/groups/${groupId}/join`, {
        user_id: userId,
        reason,
        agreeToGuidelines
    });
    return response.data;
};

/**
 * Leave support group
 * @param {string} groupId - Group ID
 * @param {string} userId - User ID
 * @param {string} reason - Reason for leaving (optional)
 * @param {string} feedback - Feedback about group experience (optional)
 * @returns {Promise} Leave confirmation
 */
export const leaveGroup = async (groupId, userId, reason = '', feedback = '') => {
    const response = await APIInstance.post(`/client/groups/${groupId}/leave`, {
        user_id: userId,
        reason,
        feedback
    });
    return response.data;
};

/**
 * Get group messages
 * @param {string} groupId - Group ID
 * @param {string} userId - User ID
 * @param {number} page - Page number for pagination
 * @param {number} limit - Items per page
 * @returns {Promise} Group messages
 */
export const getGroupMessages = async (groupId, userId, page = 1, limit = 20) => {
    const response = await APIInstance.get(`/client/groups/${groupId}/messages`, {
        params: { user_id: userId, page, limit }
    });
    return response.data;
};

/**
 * Send group message
 * @param {string} groupId - Group ID
 * @param {string} userId - User ID
 * @param {string} content - Message content
 * @param {string} replyTo - ID of message being replied to (optional)
 * @returns {Promise} Sent message
 */
export const sendGroupMessage = async (groupId, userId, content, replyTo = null) => {
    const response = await APIInstance.post(`/client/groups/${groupId}/messages`, {
        user_id: userId,
        content,
        replyTo
    });
    return response.data;
};
