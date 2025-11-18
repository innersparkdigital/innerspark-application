/**
 * Shared Profile API Functions
 * Used by both client and therapist to manage their profiles
 */
import { APIInstance, FileUploadInstance } from '../LHAPI';


/**
 * Get user profile
 * @param {string} userId - User ID
 * @returns {Promise} User profile data
 */
export const getProfile = async (userId) => {
    const response = await APIInstance.get('/profile', {
        params: { userId }
    });
    return response.data;
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} profileData - Profile fields to update (e.g., { name: 'John Doe' })
 * @returns {Promise} Updated profile data
 */
export const updateProfile = async (userId, profileData) => {
    const response = await APIInstance.post('/update-profile', {
        user: userId,
        ...profileData
    });
    return response.data;
};

/**
 * Upload profile image
 * @param {Object} imageFile - Image file object
 * @returns {Promise} Uploaded image URL
 */
export const uploadProfileImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await FileUploadInstance.post('/profile/image', formData);
    return response.data;
};

/**
 * Update profile bio
 * @param {string} userId - User ID
 * @param {string} bio - Bio text
 * @returns {Promise} Success message
 */
export const updateBio = async (userId, bio) => {
    const response = await APIInstance.put('/profile/bio', {
        userId,
        bio
    });
    return response.data;
};

/**
 * Change password
 * @param {string} userId - User ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise} Success message
 */
export const changePassword = async (userId, currentPassword, newPassword) => {
    const response = await APIInstance.post('/profile/change-password', {
        userId,
        currentPassword,
        newPassword
    });
    return response.data;
};

/**
 * Update email
 * @param {string} userId - User ID
 * @param {string} newEmail - New email address
 * @returns {Promise} Verification required message
 */
export const updateEmail = async (userId, newEmail) => {
    const response = await APIInstance.post('/update-email', {
        user: userId,
        email: newEmail
    });
    return response.data;
};

/**
 * Update phone number
 * @param {string} userId - User ID
 * @param {string} newPhone - New phone number
 * @returns {Promise} Verification required message
 */
export const updatePhone = async (userId, newPhone) => {
    const response = await APIInstance.post('/update-phone', {
        user: userId,
        phone: newPhone
    });
    return response.data;
};

/**
 * Delete account
 * @param {string} userId - User ID
 * @param {string} password - Password confirmation
 * @param {string} reason - Deletion reason
 * @returns {Promise} Success message
 */
export const deleteAccount = async (userId, password, reason) => {
    const response = await APIInstance.delete('/profile/delete', {
        data: {
            userId,
            password,
            reason
        }
    });
    return response.data;
};

/**
 * Deactivate account (temporary)
 * @param {string} userId - User ID
 * @param {string} reason - Deactivation reason
 * @returns {Promise} Success message
 */
export const deactivateAccount = async (userId, reason) => {
    const response = await APIInstance.post('/profile/deactivate', {
        userId,
        reason
    });
    return response.data;
};

/**
 * Reactivate account
 * @param {string} userId - User ID
 * @returns {Promise} Success message
 */
export const reactivateAccount = async (userId) => {
    const response = await APIInstance.post('/profile/reactivate', {
        userId
    });
    return response.data;
};
