import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { getUnreadCount } from '../utils/notificationManager';

/**
 * Smart Polling Hook for Global Notifications Synchronization
 * Silently fetches and updates the notification unread count in the background.
 * Pauses when the app is backgrounded to save.
 * Instantly fetches upon returning to the foreground.
 * 
 * @param {string} userId - The user ID to fetch data for.
 * @param {number} syncIntervalMs - Polling interval in milliseconds (default 60000ms / 1 min).
 */
export const useNotificationsSync = (userId: string | null | undefined, syncIntervalMs: number = 60000) => {
    const appState = useRef(AppState.currentState);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Silently fetches data and swaps Redux state without loaders
    const fetchSilentData = async () => {
        if (!userId) return;

        try {
            // getUnreadCount automatically dispatches setUnreadCount inside notificationManager
            await getUnreadCount(userId);
        } catch (error) {
            console.log('[useNotificationsSync] Silent fetch failed:', error);
            // Swallow error silently so we don't disrupt the user UI
        }
    };

    const startPolling = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (!userId) return;

        timerRef.current = setInterval(() => {
            fetchSilentData();
        }, syncIntervalMs);
    };

    const stopPolling = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    useEffect(() => {
        // 1. Start polling immediately on mount
        startPolling();

        // 2. Setup AppState listener
        const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
            // Come back from background
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                fetchSilentData();
                startPolling();
            }
            // Leave to background
            else if (nextAppState.match(/inactive|background/)) {
                stopPolling();
            }

            appState.current = nextAppState;
        });

        // 3. Cleanup
        return () => {
            stopPolling();
            subscription.remove();
        };
    }, [userId, syncIntervalMs]); // Re-run if dependencies change
};
