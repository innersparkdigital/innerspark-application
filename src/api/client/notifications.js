/**
 * Client Notifications API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get user notifications
 * @param {number} page - Page number
 * @returns {Promise} Notifications list
 */
export const getNotifications = async (page = 1) => {
    const response = await APIInstance.get('/client/notifications', {
        params: { page }
    });
    return response.data;
};

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @param {string} userId - User ID
 * @returns {Promise} Success message
 */
export const markNotificationAsRead = async (notificationId, userId) => {
    const response = await APIInstance.put(`/client/notifications/${notificationId}/read`, {
        user_id: userId
    });
    return response.data;
};

/**
 * Mark all notifications as read
 * @param {string} userId - User ID
 * @returns {Promise} Success message
 */
export const markAllNotificationsAsRead = async (userId) => {
    const response = await APIInstance.put('/client/notifications/read-all', {
        user_id: userId
    });
    return response.data;
};
