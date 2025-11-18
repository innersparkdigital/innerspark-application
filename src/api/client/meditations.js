/**
 * Client Meditations API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get meditation articles
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise} Articles list
 */
export const getMeditationArticles = async (page = 1, limit = 20) => {
    const response = await APIInstance.get('/client/meditations/articles', {
        params: { page, limit }
    });
    return response.data;
};

/**
 * Get meditation article by ID
 * @param {string} articleId - Article ID
 * @returns {Promise} Article details
 */
export const getArticleById = async (articleId) => {
    const response = await APIInstance.get(`/client/meditations/articles/${articleId}`);
    return response.data;
};

/**
 * Get meditation sounds
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise} Sounds list
 */
export const getMeditationSounds = async (page = 1, limit = 20) => {
    const response = await APIInstance.get('/client/meditations/sounds', {
        params: { page, limit }
    });
    return response.data;
};

/**
 * Get meditation quotes
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise} Quotes list
 */
export const getMeditationQuotes = async (page = 1, limit = 20) => {
    const response = await APIInstance.get('/client/meditations/quotes', {
        params: { page, limit }
    });
    return response.data;
};

/**
 * Get daily quote
 * @param {string} userId - User ID
 * @returns {Promise} Daily quote
 */
export const getDailyQuote = async (userId) => {
    const response = await APIInstance.get('/client/meditations/quotes/daily', {
        params: { user_id: userId }
    });
    return response.data;
};
