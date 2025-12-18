/**
 * Client Feedback API Functions
 */
import { APIInstance } from '../LHAPI';

/**
 * Submit user feedback
 * @param {string} userId - User ID
 * @param {object} feedbackData - Feedback data {type, subject, message, email}
 * @returns {Promise} Submission confirmation
 */
export const submitFeedback = async (userId, feedbackData) => {
    const response = await APIInstance.post('/client/feedback', {
        user_id: userId,
        ...feedbackData
    });
    return response.data;
};

/**
 * Get user's feedback history
 * @param {string} userId - User ID
 * @returns {Promise} List of submitted feedback
 */
export const getFeedbackHistory = async (userId) => {
    const response = await APIInstance.get('/client/feedback', {
        params: { user_id: userId }
    });
    return response.data;
};
