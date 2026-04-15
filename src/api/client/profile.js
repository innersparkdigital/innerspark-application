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
 * Supports both:
 * 1) Legacy positional args: (userId, firstName, lastName, phoneNumber, bio)
 * 2) Partial object payload: (userId, { firstName?, lastName?, phoneNumber?, bio? })
 * 
 * @param {string} userId - User ID
 * @returns {Promise} Updated profile
 */
export const updateProfile = async (userId, firstNameOrPayload, lastName, phoneNumber, bio) => {
    const isPayloadObject =
        firstNameOrPayload !== null &&
        typeof firstNameOrPayload === 'object' &&
        !Array.isArray(firstNameOrPayload);

    const payload = isPayloadObject
        ? firstNameOrPayload
        : {
            firstName: firstNameOrPayload,
            lastName,
            phoneNumber,
            bio,
        };

    const response = await APIInstance.put('/client/profile', {
        user_id: userId,
        ...payload,
    });
    return response.data;
};

/**
 * Upload profile avatar
 * @param {string} userId - User ID
 * @param {string} imageUri - Local file URI
 * @param {string} imageType - MIME type of the image
 * @param {string} imageName - Filename
 * @returns {Promise} Upload response
 */
export const uploadAvatar = async (userId, imageUri, imageType, imageName) => {
    const formData = new FormData();
    formData.append('avatar', {
        uri: imageUri,
        type: imageType || 'image/jpeg',
        name: imageName || 'avatar.jpg',
    });

    const response = await APIInstance.post('/client/profile/avatar', formData, {
        params: { user_id: userId },
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
