/**
 * Client Settings API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get all user settings (combined)
 * @param {string} userId - User ID
 * @returns {Promise} User settings
 */
export const getUserSettings = async (userId) => {
    const response = await APIInstance.get('/client/settings', {
        params: { user_id: userId }
    });
    return response.data;
};

/**
 * Get appearance settings
 * @param {string} userId - User ID
 * @returns {Promise} Appearance settings
 */
export const getAppearanceSettings = async (userId) => {
    const response = await APIInstance.get('/client/settings/appearance', {
        params: { user_id: userId }
    });
    return response.data;
};

/**
 * Update appearance settings
 * @param {string} userId - User ID
 * @param {string} theme - Theme (light, dark)
 * @param {boolean} useSystemTheme - Use system theme
 * @returns {Promise} Updated settings
 */
export const updateAppearanceSettings = async (userId, theme, useSystemTheme) => {
    const response = await APIInstance.put('/client/settings/appearance', {
        user_id: userId,
        theme,
        useSystemTheme
    });
    return response.data;
};

/**
 * Get privacy settings
 * @param {string} userId - User ID
 * @returns {Promise} Privacy settings
 */
export const getPrivacySettings = async (userId) => {
    const response = await APIInstance.get('/client/settings/privacy', {
        params: { user_id: userId }
    });
    return response.data;
};

/**
 * Update privacy settings
 * @param {string} userId - User ID
 * @param {string} profileVisibility - Profile visibility (private, public)
 * @param {boolean} showOnlineStatus - Show online status
 * @param {boolean} allowMessages - Allow messages
 * @param {boolean} dataSharing - Data sharing preference
 * @returns {Promise} Updated settings
 */
export const updatePrivacySettings = async (userId, profileVisibility, showOnlineStatus, allowMessages, dataSharing) => {
    const response = await APIInstance.put('/client/settings/privacy', {
        user_id: userId,
        profileVisibility,
        showOnlineStatus,
        allowMessages,
        dataSharing
    });
    return response.data;
};

/**
 * Get notification settings
 * @param {string} userId - User ID
 * @returns {Promise} Notification settings
 */
export const getNotificationSettings = async (userId) => {
    const response = await APIInstance.get('/client/settings/notifications', {
        params: { user_id: userId }
    });
    return response.data;
};

/**
 * Update notification settings
 * @param {string} userId - User ID
 * @param {boolean} emailNotifications - Email notifications enabled
 * @param {boolean} pushNotifications - Push notifications enabled
 * @returns {Promise} Updated settings
 */
export const updateNotificationSettings = async (userId, emailNotifications, pushNotifications) => {
    const response = await APIInstance.put('/client/settings/notifications', {
        user_id: userId,
        emailNotifications,
        pushNotifications
    });
    return response.data;
};

/**
 * Change password
 * @param {string} userId - User ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @param {string} confirmPassword - Confirm new password
 * @returns {Promise} Success message
 */
export const changePassword = async (userId, currentPassword, newPassword, confirmPassword) => {
    const response = await APIInstance.put('/client/settings/password', {
        user_id: userId,
        currentPassword,
        newPassword,
        confirmPassword
    });
    return response.data;
};
