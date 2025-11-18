/**
 * Client Profile API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get user profile
 * @param {string} userId - User ID
 * @returns {Promise} User profile
 */
export const getProfile = async (userId) => {
    const response = await APIInstance.get('/client/profile', {
        params: { user_id: userId }
    });
    return response.data;
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @param {string} phoneNumber - Phone number
 * @param {string} bio - Biography
 * @returns {Promise} Updated profile
 */
export const updateProfile = async (userId, firstName, lastName, phoneNumber, bio) => {
    const response = await APIInstance.put('/client/profile', {
        user_id: userId,
        firstName,
        lastName,
        phoneNumber,
        bio
    });
    return response.data;
};
