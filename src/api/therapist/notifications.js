/**
 * Therapist Notifications API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get notifications
 * @param {string} therapistId - Therapist ID
 * @param {boolean} [unreadOnly=false] - Filter to unread only
 * @returns {Promise<{success: boolean, data: Object}>} Notifications list with unread count
 * @example
 * const result = await getNotifications(therapistId, true); // Unread only
 * // Returns:
 * // {
 * //   success: true,
 * //   data: {
 * //     notifications: [{
 * //       id: "notif_001",
 * //       type: "appointment_reminder",
 * //       title: "Upcoming Session",
 * //       message: "Session with John Doe in 30 minutes",
 * //       read: false,
 * //       createdAt: "2025-10-23T09:30:00Z",
 * //       data: { appointmentId: "apt_001" }
 * //     }],
 * //     unreadCount: 3
 * //   }
 * // }
 */
export const getNotifications = async (therapistId, unreadOnly = false) => {
    const response = await APIInstance.get('/th/notifications', {
        params: { therapist_id: therapistId, unreadOnly }
    });
    return response.data;
};

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, message: string}>} Success confirmation
 * @example
 * const result = await markNotificationAsRead(notificationId, therapistId);
 * // Returns: { success: true, message: "Notification marked as read" }
 */
export const markNotificationAsRead = async (notificationId, therapistId) => {
    const response = await APIInstance.put(`/th/notifications/${notificationId}/read`, null, {
        params: { therapist_id: therapistId }
    });
    return response.data;
};

/**
 * Mark all notifications as read
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, message: string, data: Object}>} Success confirmation with count
 * @example
 * const result = await markAllNotificationsAsRead(therapistId);
 * // Returns:
 * // {
 * //   success: true,
 * //   message: "All notifications marked as read",
 * //   data: { markedCount: 3 }
 * // }
 */
export const markAllNotificationsAsRead = async (therapistId) => {
    const response = await APIInstance.put('/th/notifications/read-all', null, {
        params: { therapist_id: therapistId }
    });
    return response.data;
};
