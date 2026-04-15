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
 * Subscribe to a support group cohort
 * @param {string} groupId - Group ID
 * @param {string} userId - User ID
 * @param {boolean} agreeToGuidelines - Agreement to group guidelines
 * @returns {Promise} Join confirmation or wallet error
 */
export const subscribeGroup = async (groupId, userId, agreeToGuidelines = true) => {
    const parsedUserId = !isNaN(Number(userId)) ? Number(userId) : userId;

    const response = await APIInstance.post(`/client/groups/${groupId}/subscribe`, {
        user_id: parsedUserId,
        agreeToGuidelines
    });
    return response.data;
};

/**
 * Renew group subscription
 * @param {string} groupId - Group ID
 * @param {string} userId - User ID
 * @returns {Promise} Renewal confirmation
 */
export const renewGroupSubscription = async (groupId, userId) => {
    const parsedUserId = !isNaN(Number(userId)) ? Number(userId) : userId;

    const response = await APIInstance.post(`/client/groups/${groupId}/renew`, {
        user_id: parsedUserId,
        action: 'renew_subscription'
    });
    return response.data;
};

/**
 * Check group cohort availability
 * @param {string} groupId - Group ID
 * @returns {Promise} Cohort availability status
 */
export const getGroupCohortAvailability = async (groupId) => {
    const response = await APIInstance.get(`/client/groups/${groupId}/cohort-availability`);
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
    // Dynamically cast numeric strings to Number to satisfy backend validation
    const parsedUserId = !isNaN(Number(userId)) ? Number(userId) : userId;

    const response = await APIInstance.post(`/client/groups/${groupId}/leave`, {
        user_id: parsedUserId,
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
    // Dynamically cast numeric strings to Number to satisfy backend validation
    const parsedUserId = !isNaN(Number(userId)) ? Number(userId) : userId;

    const response = await APIInstance.post(`/client/groups/${groupId}/messages`, {
        user_id: parsedUserId,
        content,
        replyTo
    });
    return response.data;
};
