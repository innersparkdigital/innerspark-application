/**
 * Date Utility Helpers
 * Provides functions for date and time calculations across the application.
 */

/**
 * Checks if an event is in the past based on its date and end time.
 * 
 * @param eventDate - The date of the event (string format: YYYY-MM-DD or similar)
 * @param endTime - The end time of the event (string format: "HH:MM AM/PM")
 * @returns boolean - True if the event has already ended, false otherwise.
 */
export const isPastEvent = (eventDate: string, endTime: string): boolean => {
    try {
        if (!eventDate || !endTime) return false;

        // Create a Date object for the event day
        const eventFullDate = new Date(eventDate);

        // Parse the end time (e.g., "11:00 AM" or "2:30 PM")
        const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
        const match = endTime.match(timeRegex);

        if (match) {
            let [_, hours, minutes, period] = match;
            let hour = parseInt(hours, 10);
            const minute = parseInt(minutes, 10);

            // Adjust hours for 12-hour format
            if (period.toUpperCase() === 'PM' && hour < 12) hour += 12;
            if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;

            eventFullDate.setHours(hour, minute, 0, 0);
        } else {
            // Fallback for different time formats or if regex fails
            // Usually, we assume end of the day if time parsing is tricky
            eventFullDate.setHours(23, 59, 59, 999);
        }

        const now = new Date();
        return eventFullDate < now;
    } catch (error) {
        console.error('Error checking if event is past:', error);
        return false;
    }
};

/**
 * Checks if a client-side event has already passed.
 * Assumes the event has ended if 3 hours have passed since its start time.
 */
export const isClientEventPassed = (eventDate: string, eventTime: string): boolean => {
    try {
        if (!eventDate || !eventTime) return false;

        const eventStart = new Date(`${eventDate} ${eventTime}`);
        if (isNaN(eventStart.getTime())) return false;

        // Assume event is "passed" 3 hours after its start time
        const eventEndTime = new Date(eventStart.getTime() + 3 * 60 * 60000);
        return eventEndTime < new Date();
    } catch {
        return false;
    }
};

/**
 * Returns a smart teaser badge (hint and color) based on the event's start time.
 * Calculates urgency (e.g., "Starting soon", "This week") or marks it "Passed"
 */
export const getEventStatusTeaser = (eventDate: string, eventTime: string): { hint: string, hintColor: string } => {
    try {
        if (!eventDate || !eventTime) return { hint: '', hintColor: '' };

        const start = new Date(`${eventDate} ${eventTime}`);
        if (isNaN(start.getTime())) return { hint: '', hintColor: '' };

        const now = new Date();
        const diffMs = start.getTime() - now.getTime();
        const diffMin = Math.floor(diffMs / 60000);
        const diffHrs = Math.floor(diffMin / 60);
        const diffDays = Math.floor(diffHrs / 24);

        if (diffMin <= 0 && diffMin >= -180) {
            return { hint: 'Join now', hintColor: '#4CAF50' }; // Green
        }
        if (diffMin < -180) {
            return { hint: 'Passed', hintColor: '#9E9E9E' }; // Grey
        }
        if (diffMin > 0 && diffHrs < 24) {
            return { hint: 'Starting soon', hintColor: '#FF9800' }; // Orange
        }
        if (diffHrs >= 24 && diffDays <= 3) {
            return { hint: 'This week', hintColor: '#2196F3' }; // Blue
        }
        return { hint: '', hintColor: '' };
    } catch {
        return { hint: '', hintColor: '' };
    }
};

/**
 * Humanizes an ISO timestamp into conversational chat strings.
 * @param dateString The raw ISO date/time string from the backend.
 * @returns string Formatted "last seen" text (e.g., "active recently", "2h ago", "Yesterday", "MMM DD")
 */
export const humanizeLastSeen = (dateString?: string | null): string | null => {
    if (!dateString || String(dateString).toLowerCase() === 'null') return null;

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return null;

        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);

        // Under 10 minutes
        if (diffMins < 10) return 'active recently';

        // Under 1 hour
        if (diffMins < 60) return `${diffMins}m ago`;

        // Under 24 hours & same day
        if (diffHours < 24 && date.getDate() === now.getDate()) {
            return `${diffHours}h ago`;
        }

        // Yesterday check
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        if (date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear()) {
            return 'Yesterday';
        }

        // Same year fallback
        if (date.getFullYear() === now.getFullYear()) {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }

        // Full date
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
        return null; // Silent fallback
    }
};
