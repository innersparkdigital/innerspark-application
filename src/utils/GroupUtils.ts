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
