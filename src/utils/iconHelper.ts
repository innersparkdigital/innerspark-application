/**
 * Utility for parsing icon strings from the API.
 * The API often returns FontAwesome class names like 'fa-leaf'
 * but our @rneui/base Icon component expects name='leaf' type='font-awesome-5'
 */

export const parseIconProps = (iconString: string | undefined | null) => {
    if (!iconString) {
        return { name: 'spa', type: 'material' }; // Safe default
    }

    // Handle FontAwesome prefix
    if (iconString.startsWith('fa-')) {
        return {
            name: iconString.replace('fa-', ''),
            type: 'font-awesome-5'
        };
    }

    // Default to material if no specific prefix is given
    return { name: iconString, type: 'material' };
};
