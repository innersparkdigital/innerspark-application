/**
 * Client File Uploads API Functions
 */
import { FileUploadInstance } from '../LHAPI';


/**
 * Upload profile image
 * @param {Object} imageFile - Image file object
 * @returns {Promise} Uploaded image URL
 */
export const uploadProfileImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await FileUploadInstance.post('/client/profile/image', formData);
    return response.data;
};

/**
 * Upload attachment (for messages, groups, etc)
 * @param {Object} file - File object
 * @param {string} type - File type context
 * @returns {Promise} Uploaded file URL
 */
export const uploadAttachment = async (file, type = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const response = await FileUploadInstance.post('/client/uploads/attachment', formData);
    return response.data;
};
