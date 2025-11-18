/**
 * Client Goals API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get user goals
 * @param {string} status - Filter by status: 'all', 'active', 'completed', 'paused'
 * @returns {Promise} Goals list and stats
 */
export const getGoals = async (status = 'all') => {
    const response = await APIInstance.get('/client/goals', {
        params: { status }
    });
    return response.data;
};

/**
 * Create new goal
 * @param {Object} goalData - Goal details
 * @returns {Promise} Created goal
 */
export const createGoal = async (goalData) => {
    const response = await APIInstance.post('/client/goals', goalData);
    return response.data;
};

/**
 * Update existing goal
 * @param {string} goalId - Goal ID
 * @param {Object} goalData - Updated goal data
 * @returns {Promise} Updated goal
 */
export const updateGoal = async (goalId, goalData) => {
    const response = await APIInstance.put(`/client/goals/${goalId}`, goalData);
    return response.data;
};

/**
 * Delete goal
 * @param {string} goalId - Goal ID
 * @returns {Promise} Success message
 */
export const deleteGoal = async (goalId) => {
    const response = await APIInstance.delete(`/client/goals/${goalId}`);
    return response.data;
};
