/**
 * Client Goals API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get user goals
 * @param {string} status - Filter by status: 'all', 'active', 'completed', 'paused'
 * @param {string|number} userId - Active user's ID
 * @returns {Promise} Goals list and stats
 */
export const getGoals = async (status = 'all', userId) => {
    const response = await APIInstance.get('/client/goals', {
        params: { user_id: Number(userId) }
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
 * Mark goal as completed
 * @param {string} goalId - Goal ID
 * @param {string|number} userId - The active user's ID
 * @returns {Promise} Completed goal data
 */
export const completeGoal = async (goalId, userId) => {
    const response = await APIInstance.post(`/client/goals/${goalId}/complete`, { user_id: Number(userId) });
    return response.data;
};

/**
 * Delete goal
 * @param {string} goalId - Goal ID
 * @param {string|number} userId - The active user's ID 
 * @returns {Promise} Success message
 */
export const deleteGoal = async (goalId, userId) => {
    const response = await APIInstance.delete(`/client/goals/${goalId}?user_id=${Number(userId)}`);
    return response.data;
};
