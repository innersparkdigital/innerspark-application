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
 * Supports both:
 * 1) Legacy positional args: (userId, theme, useSystemTheme)
 * 2) Partial object payload: (userId, { theme?, useSystemTheme?, accentColor?, fontStyle?, highContrast?, reducedMotion?, largeText? })
 * @param {string} userId - User ID
 * @returns {Promise} Updated settings
 */
export const updateAppearanceSettings = async (userId, themeOrPayload, useSystemTheme) => {
    const isPayloadObject =
        themeOrPayload !== null &&
        typeof themeOrPayload === 'object' &&
        !Array.isArray(themeOrPayload);

    const payload = isPayloadObject
        ? themeOrPayload
        : {
            theme: themeOrPayload,
            useSystemTheme,
        };

    const response = await APIInstance.put('/client/settings/appearance', {
        user_id: userId,
        ...payload,
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
 * Supports both:
 * 1) Legacy positional args: (userId, profileVisibility, showOnlineStatus, allowMessages, dataSharing)
 * 2) Partial object payload: (userId, { profileVisibility?, showOnlineStatus?, allowMessages?, dataSharing?, walletBalanceVisibility? })
 * @param {string} userId - User ID
 * @returns {Promise} Updated settings
 */
export const updatePrivacySettings = async (userId, profileVisibilityOrPayload, showOnlineStatus, allowMessages, dataSharing) => {
    const isPayloadObject =
        profileVisibilityOrPayload !== null &&
        typeof profileVisibilityOrPayload === 'object' &&
        !Array.isArray(profileVisibilityOrPayload);

    const payload = isPayloadObject
        ? profileVisibilityOrPayload
        : {
            profileVisibility: profileVisibilityOrPayload,
            showOnlineStatus,
            allowMessages,
            dataSharing,
        };

    const response = await APIInstance.put('/client/settings/privacy', {
        user_id: userId,
        ...payload,
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
 * Supports both:
 * 1) Legacy positional args: (userId, emailNotifications, pushNotifications)
 * 2) Partial object payload: (userId, { emailNotifications?, pushNotifications?, smsNotifications?, appointmentReminders?, eventUpdates?, goalReminders? })
 * @param {string} userId - User ID
 * @returns {Promise} Updated settings
 */
export const updateNotificationSettings = async (userId, emailNotificationsOrPayload, pushNotifications) => {
    const isPayloadObject =
        emailNotificationsOrPayload !== null &&
        typeof emailNotificationsOrPayload === 'object' &&
        !Array.isArray(emailNotificationsOrPayload);

    const payload = isPayloadObject
        ? emailNotificationsOrPayload
        : {
            emailNotifications: emailNotificationsOrPayload,
            pushNotifications,
        };

    const response = await APIInstance.put('/client/settings/notifications', {
        user_id: userId,
        ...payload,
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
