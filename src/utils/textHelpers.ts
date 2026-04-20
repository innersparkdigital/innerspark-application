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

/**
 * Normalizes a phone number for native dialing.
 * - Ensures '+' prefix for international numbers
 * - Removes redundant '0' after country codes (e.g. +25607... -> +2567...)
 * - Converts local format (07...) to default international (+256...)
 * @param {string} phone - The raw phone number
 * @returns {string} Normalized numeric string with '+' prefix
 */
export const normalizePhoneNumber = (phone: string): string => {
    if (!phone) return '';

    // 1. Remove all non-dialable characters except '+'
    let cleaned = phone.replace(/[^0-9+]/g, '');

    // 2. Handle local format (0705...) to international (+256705...)
    // Assuming +256 (Uganda) as default for local numbers in this app
    if (cleaned.startsWith('0') && cleaned.length >= 10) {
        cleaned = '+256' + cleaned.substring(1);
    }

    // 3. Handle missing '+' for likely country codes (e.g. 2567...)
    // If it starts with 256/254/255 and has long length, prepend +
    if (/^(256|254|255|250|257|211)\d{9}$/.test(cleaned)) {
        cleaned = '+' + cleaned;
    }

    // 4. Handle redundant '0' after country code (e.g. +25607...)
    // Standard international dialing removes the leading zero of the local part
    const redundantZeroRegex = /^(\+\d{1,3})0(\d{9})$/;
    if (redundantZeroRegex.test(cleaned)) {
        cleaned = cleaned.replace(redundantZeroRegex, '$1$2');
    }

    return cleaned;
};

/**
 * Truncates text to a specified limit and appends an ellipsis if exceeded.
 * @param {string} text - The input text string.
 * @param {number} limit - The maximum character limit.
 * @returns {string} Truncated string with ellipsis.
 */
export const truncateText = (text: string, limit: number = 150): string => {
    if (!text || typeof text !== 'string') return '';
    if (text.length <= limit) return text;
    return text.substring(0, limit).trim() + '...';
};
/**
 * Generates initials for a name (e.g. "John Doe" -> "JD").
 * @param {string} name - The full name.
 * @returns {string} Uppercase initials.
 */
export const getAvatarInitials = (name: string): string => {
    if (!name) return '??';
    return name
        .split(' ')
        .filter(Boolean)
        .map(n => n[0])
        .join('')
        .toUpperCase();
};
