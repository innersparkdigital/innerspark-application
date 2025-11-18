/**
 * Client Journal API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get journal entries
 * @param {string} userId - User ID
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise} Journal entries list
 */
export const getJournalEntries = async (userId, page = 1, limit = 20) => {
    const response = await APIInstance.get('/client/journal/entries', {
        params: { user_id: userId, page, limit }
    });
    return response.data;
};

/**
 * Create journal entry
 * @param {string} userId - User ID
 * @param {string} title - Entry title
 * @param {string} content - Entry content
 * @param {string} mood - Associated mood
 * @param {string} date - Entry date
 * @returns {Promise} Created entry
 */
export const createJournalEntry = async (userId, title, content, mood, date) => {
    const response = await APIInstance.post('/client/journal/entries', {
        user_id: userId,
        title,
        content,
        mood,
        date
    });
    return response.data;
};

/**
 * Update journal entry
 * @param {string} entryId - Entry ID
 * @param {string} userId - User ID
 * @param {string} title - Entry title
 * @param {string} content - Entry content
 * @returns {Promise} Updated entry
 */
export const updateJournalEntry = async (entryId, userId, title, content) => {
    const response = await APIInstance.put(`/client/journal/entries/${entryId}`, {
        user_id: userId,
        title,
        content
    });
    return response.data;
};

/**
 * Delete journal entry
 * @param {string} entryId - Entry ID
 * @param {string} userId - User ID
 * @returns {Promise} Success message
 */
export const deleteJournalEntry = async (entryId, userId) => {
    const response = await APIInstance.delete(`/client/journal/entries/${entryId}`, {
        params: { user_id: userId }
    });
    return response.data;
};
