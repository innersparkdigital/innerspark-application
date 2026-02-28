/**
 * Text formatting and calculation utilities
 */

/**
 * Calculates the estimated reading time for a given text string.
 * @param {string} text - The input text content.
 * @param {number} wordsPerMinute - Reading speed (default 200).
 * @returns {string} Formatted read time string (e.g. "5 min read").
 */
export const calculateReadTime = (text: string, wordsPerMinute: number = 200): string => {
    if (!text || typeof text !== 'string') {
        return '1 min read';
    }

    // Remove markdown formatting and split by whitespace
    const cleanText = text.replace(/[*#_\[\]()]/g, ' ').trim();
    const wordCount = cleanText.split(/\s+/).filter(word => word.length > 0).length;

    if (wordCount === 0) {
        return '1 min read';
    }

    const minutes = Math.ceil(wordCount / wordsPerMinute);

    if (minutes <= 1) {
        return '< 1 min read';
    }

    return `${minutes} min read`;
};
