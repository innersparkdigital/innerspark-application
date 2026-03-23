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

/**
 * Decodes common HTML entities safely for React Native text rendering.
 * @param {string} text - The input text containing encoded entities like &amp;
 * @returns {string} Decoded plain string.
 */
export const decodeHTMLEntities = (text: string): string => {
    if (!text || typeof text !== 'string') return text;
    return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&nbsp;/g, ' ');
};
