/**
 * Client Meditations API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get meditation articles
 * @returns {Promise} Articles list
 */
export const getMeditationArticles = async () => {
    const response = await APIInstance.get('/client/meditations/articles');
    return response.data;
};

/**
 * Get meditation sounds
 * @returns {Promise} Sounds list
 */
export const getMeditationSounds = async () => {
    const response = await APIInstance.get('/client/meditations/sounds');
    return response.data;
};

/**
 * Get meditation quotes
 * @returns {Promise} Quotes list
 */
export const getMeditationQuotes = async () => {
    const response = await APIInstance.get('/client/meditations/quotes');
    return response.data;
};
