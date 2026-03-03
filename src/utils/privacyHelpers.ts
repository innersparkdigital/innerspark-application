/**
 * Privacy Helpers - Utilities for enforcing data masking and security
 */

/**
 * Masks a user's full name to protect their identity on client screens.
 * E.g., "John Doe" -> "J*** D***"
 * E.g., "Sarah" -> "S***"
 * 
 * @param {string} fullName - The raw string name
 * @returns {string} - The securely masked string 
 */
export const maskName = (fullName: string | null | undefined): string => {
    if (!fullName) return 'A*** M***';

    const parts = fullName.trim().split(/\s+/);

    const maskedParts = parts.map(part => {
        if (part.length === 0) return '';
        return part.charAt(0).toUpperCase() + '***';
    });

    return maskedParts.join(' ');
};

/**
 * Generates a deterministic anonymous member name based on their unique ID and name initial.
 * E.g., ID "62275791680" + Name "Alphonse" -> "Member 1680A"
 * 
 * @param {string|number} senderId - The user's backend ID
 * @param {string} senderName - The user's real name
 * @returns {string} - The anonymous identity string 
 */
export const generateAnonymousName = (senderId: string | number | null | undefined, senderName: string | null | undefined): string => {
    const idStr = senderId ? String(senderId) : '';
    const last4 = idStr.length > 4 ? idStr.slice(-4) : idStr.padStart(4, '0');

    // Get first letter of the first name, uppercase
    const initial = senderName ? senderName.trim().charAt(0).toUpperCase() : '';

    if (!last4 || last4 === '0000') {
        return `Member ${initial || '?'}`;
    }

    return `Member ${last4}${initial}`;
};
