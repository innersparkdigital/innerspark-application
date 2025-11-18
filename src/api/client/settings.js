/**
 * Client Settings API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get all user settings
 * @returns {Promise} User settings
 */
export const getUserSettings = async () => {
    const response = await APIInstance.get('/client/settings');
    return response.data;
};

/**
 * Get appearance settings
 * @returns {Promise} Appearance settings
 */
export const getAppearanceSettings = async () => {
    const response = await APIInstance.get('/client/settings/appearance');
    return response.data;
};

/**
 * Update appearance settings
 * @param {Object} settings - { theme, useSystemTheme, highContrast, etc }
 * @returns {Promise} Updated settings
 */
export const updateAppearanceSettings = async (settings) => {
    const response = await APIInstance.put('/client/settings/appearance', settings);
    return response.data;
};

/**
 * Update privacy settings
 * @param {Object} settings - Privacy preferences
 * @returns {Promise} Updated settings
 */
export const updatePrivacySettings = async (settings) => {
    const response = await APIInstance.put('/client/settings/privacy', settings);
    return response.data;
};
