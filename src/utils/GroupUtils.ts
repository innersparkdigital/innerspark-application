/**
 * Utility functions for Group management
 */

/**
 * Maps API icon names (Material Icons) to Emojis for a more premium look
 * @param iconName Material icon name from API
 * @returns Emoji string
 */
export const getGroupIcon = (iconName: string): string => {
    const mapping: { [key: string]: string } = {
        'psychology': '🧠',
        'self_improvement': '🧘',
        'school': '🎓',
        'group': '👥',
        'diversity_3': '🤝',
        'mood': '🎭',
        'favorite': '❤️',
        'verified': '✅',
        'event': '📅',
        'forum': '💬',
        'shield': '🛡️',
        'stars': '✨',
        'bolt': '⚡',
        'volunteer_activism': '💖',
    };

    return mapping[iconName.toLowerCase()] || '📂';
};

/**
 * Generic stat formatter for percentages or counts
 * Can be expanded for more complex logic
 */
export const formatGroupStat = (value: any, type: 'percent' | 'count' = 'count'): string => {
    if (value === undefined || value === null) return type === 'percent' ? '--%' : '--';
    return type === 'percent' ? `${value}%` : `${value}`;
};

/**
 * Checks if a group chat is ready to be entered based on cohort start date
 * @param startDate ISO date string of the cohort start
 * @returns Object with status and label
 */
export const getGroupChatStatus = (startDate: string | null | undefined): { canEnter: boolean; statusLabel: string; opensInDays?: number } => {
    if (!startDate) return { canEnter: true, statusLabel: 'Active' };

    const now = new Date();
    const start = new Date(startDate);
    const diffTime = start.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffTime <= 0) {
        return { canEnter: true, statusLabel: 'Active' };
    }

    if (diffDays === 0) {
        return { canEnter: false, statusLabel: 'Opens Today' };
    }

    return { 
        canEnter: false, 
        statusLabel: `Opens in ${diffDays} day${diffDays > 1 ? 's' : ''}`, 
        opensInDays: diffDays 
    };
};

/**
 * Validates if a user can enter a chat and shows an alert if not.
 * @param startDate ISO date string
 * @param alert ISAlert handle from useISAlert hook
 * @returns boolean indicating if access is granted
 */
export const validateChatAccess = (startDate: string | null | undefined, alert: any): boolean => {
    const status = getGroupChatStatus(startDate);
    
    if (!status.canEnter) {
        alert.show({
            type: 'info',
            title: 'Chat Access',
            message: `This group cohort is scheduled to start on ${new Date(startDate!).toLocaleDateString()}. Chat will be available then.`,
        });
        return false;
    }
    
    return true;
};
