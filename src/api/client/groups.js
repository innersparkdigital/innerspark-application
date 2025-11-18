/**
 * Client Support Groups API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get support groups directory
 * @param {Object} filters - { category, privacy }
 * @returns {Promise} Groups list and user membership info
 */
export const getGroups = async (filters = {}) => {
    const response = await APIInstance.get('/client/groups', {
        params: filters
    });
    return response.data;
};

/**
 * Get user's joined groups
 * @returns {Promise} User's groups list
 */
export const getMyGroups = async () => {
    const response = await APIInstance.get('/client/groups/my-groups');
    return response.data;
};

/**
 * Get group details
 * @param {string} groupId - Group ID
 * @returns {Promise} Group details
 */
export const getGroupById = async (groupId) => {
    const response = await APIInstance.get(`/client/groups/${groupId}`);
    return response.data;
};

/**
 * Join support group
 * @param {string} groupId - Group ID
 * @returns {Promise} Join confirmation or membership limit error
 */
export const joinGroup = async (groupId) => {
    const response = await APIInstance.post(`/client/groups/${groupId}/join`);
    return response.data;
};

/**
 * Leave support group
 * @param {string} groupId - Group ID
 * @param {string} reason - Optional reason for leaving
 * @returns {Promise} Leave confirmation
 */
export const leaveGroup = async (groupId, reason = '') => {
    const response = await APIInstance.post(`/client/groups/${groupId}/leave`, {
        reason
    });
    return response.data;
};

/**
 * Get group messages
 * @param {string} groupId - Group ID
 * @param {number} page - Page number for pagination
 * @returns {Promise} Group messages
 */
export const getGroupMessages = async (groupId, page = 1) => {
    const response = await APIInstance.get(`/client/groups/${groupId}/messages`, {
        params: { page }
    });
    return response.data;
};

/**
 * Send group message
 * @param {string} groupId - Group ID
 * @param {string} message - Message text
 * @returns {Promise} Sent message
 */
export const sendGroupMessage = async (groupId, message) => {
    const response = await APIInstance.post(`/client/groups/${groupId}/messages`, {
        message
    });
    return response.data;
};
