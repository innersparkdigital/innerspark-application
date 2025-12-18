/**
 * Client Account & Data Management API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Request data export
 * @param {string} userId - User ID
 * @param {string} format - Export format (json, csv, pdf)
 * @param {Array<string>} categories - Data categories to export (profile, mood, journal, goals, messages, etc.)
 * @returns {Promise} Export request confirmation
 */
export const requestDataExport = async (userId, format, categories) => {
    const response = await APIInstance.post('/client/data/export', {
        user_id: userId,
        format,
        categories
    });
    return response.data;
};

/**
 * Deactivate account
 * @param {string} userId - User ID
 * @returns {Promise} Deactivation confirmation
 */
export const deactivateAccount = async (userId) => {
    const response = await APIInstance.post('/client/account/deactivate', {
        user_id: userId
    });
    return response.data;
};

/**
 * Delete account permanently
 * @param {string} userId - User ID
 * @param {string} reason - Deletion reason
 * @returns {Promise} Deletion confirmation
 */
export const deleteAccount = async (userId, reason) => {
    const response = await APIInstance.post('/client/account/delete', {
        user_id: userId,
        reason
    });
    return response.data;
};

/**
 * Delete specific user data categories
 * @param {string} userId - User ID
 * @param {Array<string>} categories - Data categories to delete (mood_history, journal_entries, therapy_notes, messages, goals, activity_logs)
 * @returns {Promise} Deletion confirmation
 */
export const deleteUserData = async (userId, categories) => {
    const response = await APIInstance.post('/client/data/delete', {
        user_id: userId,
        categories
    });
    return response.data;
};
