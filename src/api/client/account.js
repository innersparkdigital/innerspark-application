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
export const deactivateAccount = async (userId, reason, feedback) => {
    try {
        const payload = {
            user_id: userId,
            reason: reason,
            feedback: feedback
        };
        const response = await APIInstance.post('/client/account/deactivate', payload);
        return response.data;
    } catch (error) {
        throw error; // Re-throw the error after logging or handling as needed
    }
};

/**
 * Delete account permanently
 * @param {string} userId - User ID
 * @param {string} reason - Deletion reason
 * @returns {Promise} Deletion confirmation
 */
export const deleteAccount = async (userId, password, reason) => {
    try {
        const payload = {
            user_id: userId,
            password: password,
            reason: reason,
        };
        const response = await APIInstance.post('/client/account/delete', payload);
        return response.data;
    } catch (error) {
        throw error; // Re-throw the error after logging or handling as needed
    }
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
