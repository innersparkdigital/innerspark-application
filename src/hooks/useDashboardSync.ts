import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardData } from '../api/client/dashboard';
import { setDashboardData } from '../features/dashboard/dashboardSlice';

/**
 * Smart Polling Hook for Dashboard Synchronization
 * Silently fetches and updates dashboard data in the background.
 * Pauses when the app is backgrounded to save battery.
 * Instantly fetches upon returning to the foreground.
 * 
 * @param {string} userId - The user ID to fetch data for.
 * @param {number} syncIntervalMs - Polling interval in milliseconds (default 60000ms / 1 min).
 */
export const useDashboardSync = (userId: string | null | undefined, syncIntervalMs: number = 60000) => {
    const dispatch = useDispatch();
    const appState = useRef(AppState.currentState);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Silently fetches data and swaps Redux state without showing loaders
    const fetchSilentData = async () => {
        if (!userId) return;

        try {
            // In a production app, you might want to log this at a verbose/debug level 
            // console.log(`[SyncManager] Silent dashboard fetch running for ${userId}...`);
            const data = await getDashboardData(userId);
            if (data && data.success) {
                dispatch(setDashboardData(data.data));
            }
        } catch (error) {
            console.log('[SyncManager] Silent fetch failed:', error);
            // We explicitly DO NOT dispatch an error to Redux here, 
            // so we don't accidentally throw a huge error modal in the user's face 
            // just because they drove through a tunnel and lost cellular connection for 10 seconds.
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
            // If we are coming back into the app from the background
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                // console.log('[SyncManager] App has come to the foreground! Instant fetch triggered.');
                fetchSilentData();
                startPolling(); // Restart timer
            }
            // If we are leaving the app
            else if (nextAppState.match(/inactive|background/)) {
                // console.log('[SyncManager] App is backgrounded. Polling paused.');
                stopPolling();
            }

            appState.current = nextAppState;
        });

        // 3. Cleanup on unmount
        return () => {
            stopPolling();
            subscription.remove();
        };
    }, [userId, syncIntervalMs]); // Re-run if userId changes
};
