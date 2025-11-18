/**
 * Client Mood Tracking API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get today's mood check-in status
 * @returns {Promise} Today's mood data and stats
 */
export const getTodayMood = async () => {
    const response = await APIInstance.get('/client/mood/today');
    return response.data;
};

/**
 * Log mood check-in
 * @param {Object} moodData - { moodValue, moodLabel, moodEmoji, note }
 * @returns {Promise} Updated mood data with streak and milestones
 */
export const logMood = async (moodData) => {
    const response = await APIInstance.post('/client/mood', moodData);
    return response.data;
};

/**
 * Get mood history
 * @param {number} period - Number of days (7, 30, 90)
 * @returns {Promise} Mood history entries and stats
 */
export const getMoodHistory = async (period = 7) => {
    const response = await APIInstance.get('/client/mood/history', {
        params: { period }
    });
    return response.data;
};

/**
 * Get mood milestones progress
 * @returns {Promise} Milestone data (7, 14, 30 days)
 */
export const getMoodMilestones = async () => {
    const response = await APIInstance.get('/client/mood/milestones');
    return response.data;
};
