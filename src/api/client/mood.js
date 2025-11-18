/**
 * Client Mood Tracking API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get today's mood check-in status
 * @param {string} userId - User ID
 * @returns {Promise} Today's mood data and stats
 */
export const getTodayMood = async (userId) => {
    const response = await APIInstance.get('/client/mood/today', {
        params: { user_id: userId }
    });
    return response.data;
};

/**
 * Log mood check-in
 * @param {string} userId - User ID
 * @param {number} moodValue - Mood value (1-5 or 1-10)
 * @param {string} note - Optional note
 * @returns {Promise} Updated mood data with streak and milestones
 */
export const logMood = async (userId, moodValue, note = '') => {
    const response = await APIInstance.post('/client/mood', {
        user_id: userId,
        moodValue,
        note
    });
    return response.data;
};

/**
 * Get mood history
 * @param {string} userId - User ID
 * @param {string} period - Time period (week, month, year)
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise} Mood history entries and stats
 */
export const getMoodHistory = async (userId, period = 'week', page = 1, limit = 20) => {
    const response = await APIInstance.get('/client/mood/history', {
        params: { user_id: userId, period, page, limit }
    });
    return response.data;
};

/**
 * Get mood insights and analytics
 * @param {string} userId - User ID
 * @returns {Promise} Mood insights data
 */
export const getMoodInsights = async (userId) => {
    const response = await APIInstance.get('/client/mood/insights', {
        params: { user_id: userId }
    });
    return response.data;
};

/**
 * Get mood milestones progress
 * @param {string} userId - User ID
 * @returns {Promise} Milestone data (7, 14, 30 days)
 */
export const getMoodMilestones = async (userId) => {
    const response = await APIInstance.get('/client/mood/milestones', {
        params: { user_id: userId }
    });
    return response.data;
};
