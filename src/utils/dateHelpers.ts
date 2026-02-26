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
