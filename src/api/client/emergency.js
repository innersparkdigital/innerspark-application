/**
 * Client Emergency API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get emergency contacts
 * @param {string} userId - User ID
 * @returns {Promise} Emergency contacts list
 */
export const getEmergencyContacts = async (userId) => {
    const response = await APIInstance.get('/client/emergency/contacts', {
        params: { user_id: userId }
    });
    return response.data;
};

/**
 * Add emergency contact
 * @param {string} userId - User ID
 * @param {string} name - Contact name
 * @param {string} relationship - Relationship to user
 * @param {string} phoneNumber - Contact phone number
 * @param {string} email - Contact email
 * @param {boolean} isPrimary - Is primary contact
 * @returns {Promise} Created contact
 */
export const addEmergencyContact = async (userId, name, relationship, phoneNumber, email, isPrimary) => {
    const response = await APIInstance.post('/client/emergency/contacts', {
        user_id: userId,
        name,
        relationship,
        phoneNumber,
        email,
        isPrimary
    });
    return response.data;
};

/**
 * Delete emergency contact
 * @param {string} contactId - Contact ID
 * @param {string} userId - User ID
 * @returns {Promise} Success message
 */
export const deleteEmergencyContact = async (contactId, userId) => {
    const response = await APIInstance.delete(`/client/emergency/contacts/${contactId}`, {
        params: { user_id: userId }
    });
    return response.data;
};

/**
 * Get safety plan
 * @param {string} userId - User ID
 * @returns {Promise} Safety plan
 */
export const getSafetyPlan = async (userId) => {
    const response = await APIInstance.get('/client/emergency/safety-plan', {
        params: { user_id: userId }
    });
    return response.data;
};

/**
 * Update safety plan
 * @param {string} userId - User ID
 * @param {Object} planData - Safety plan data
 * @returns {Promise} Updated safety plan
 */
export const updateSafetyPlan = async (userId, planData) => {
    const response = await APIInstance.put('/client/emergency/safety-plan', {
        user_id: userId,
        ...planData
    });
    return response.data;
};

/**
 * Get crisis lines
 * @param {string} userId - User ID
 * @returns {Promise} Crisis lines list
 */
export const getCrisisLines = async (userId) => {
    const response = await APIInstance.get('/client/emergency/crisis-lines', {
        params: { user_id: userId }
    });
    return response.data;
};
