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
 * @returns {Promise} Success message
 */
export const markNotificationAsRead = async (notificationId) => {
    const response = await APIInstance.put(`/client/notifications/${notificationId}/read`);
    return response.data;
};

/**
 * Mark all notifications as read
 * @returns {Promise} Success message
 */
export const markAllNotificationsAsRead = async () => {
    const response = await APIInstance.put('/client/notifications/read-all');
    return response.data;
};
