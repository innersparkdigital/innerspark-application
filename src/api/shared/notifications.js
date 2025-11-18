/**
 * Shared Notifications API Functions (Backend API calls)
 * Used by both client and therapist for push notification management
 * 
 * NOTE: This is different from LHNotifications.ts which handles local notifications (notifee)
 * This file handles backend API calls for notification sync and device registration
 */
import { APIInstance } from '../LHAPI';


/**
 * Sync notifications with backend
 * @param {string} userId - User ID
 * @returns {Promise} Synced notifications
 */
export const syncNotificationsWithBackend = async (userId) => {
    const response = await APIInstance.get('/notifications/sync', {
        params: { userId }
    });
    return response.data;
};

/**
 * Register device for push notifications (FCM)
 * @param {string} userId - User ID
 * @param {string} fcmToken - Firebase Cloud Messaging token
 * @param {string} platform - 'android' or 'ios'
 * @returns {Promise} Registration confirmation
 */
export const registerDeviceForPush = async (userId, fcmToken, platform = 'android') => {
    const response = await APIInstance.post('/notifications/register-device', {
        user_id: userId,
        fcm_token: fcmToken,
        platform,
        app_version: '1.0.0'
    });
    return response.data;
};

/**
 * Unregister device from push notifications
 * @param {string} userId - User ID
 * @param {string} fcmToken - Firebase Cloud Messaging token
 * @returns {Promise} Unregistration confirmation
 */
export const unregisterDeviceFromPush = async (userId, fcmToken) => {
    const response = await APIInstance.post('/notifications/unregister-device', {
        user_id: userId,
        fcm_token: fcmToken
    });
    return response.data;
};

/**
 * Update notification preferences
 * @param {string} userId - User ID
 * @param {Object} preferences - Notification preferences
 * @returns {Promise} Updated preferences
 */
export const updateNotificationPreferences = async (userId, preferences) => {
    const response = await APIInstance.put('/notifications/preferences', {
        userId,
        ...preferences
    });
    return response.data;
};

/**
 * Get notification preferences
 * @param {string} userId - User ID
 * @returns {Promise} User notification preferences
 */
export const getNotificationPreferences = async (userId) => {
    const response = await APIInstance.get('/notifications/preferences', {
        params: { userId }
    });
    return response.data;
};

/**
 * Mark notification as read (backend)
 * @param {string} notificationId - Notification ID
 * @returns {Promise} Success message
 */
export const markNotificationAsRead = async (notificationId) => {
    const response = await APIInstance.put(`/notifications/${notificationId}/read`);
    return response.data;
};

/**
 * Mark all notifications as read (backend)
 * @param {string} userId - User ID
 * @returns {Promise} Success message
 */
export const markAllNotificationsAsRead = async (userId) => {
    const response = await APIInstance.put('/notifications/read-all', {
        userId
    });
    return response.data;
};

/**
 * Delete notification
 * @param {string} notificationId - Notification ID
 * @returns {Promise} Success message
 */
export const deleteNotification = async (notificationId) => {
    const response = await APIInstance.delete(`/notifications/${notificationId}`);
    return response.data;
};

/**
 * Get notification history
 * @param {string} userId - User ID
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise} Notification history
 */
export const getNotificationHistory = async (userId, page = 1, limit = 20) => {
    const response = await APIInstance.get('/notifications/history', {
        params: { userId, page, limit }
    });
    return response.data;
};

/**
 * Test push notification
 * @param {string} userId - User ID
 * @returns {Promise} Test notification sent confirmation
 */
export const sendTestNotification = async (userId) => {
    const response = await APIInstance.post('/notifications/test', {
        userId
    });
    return response.data;
};
