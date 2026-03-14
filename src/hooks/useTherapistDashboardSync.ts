import { useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useDispatch } from 'react-redux';
import { getDashboardStats, getEvents } from '../api/therapist';
import { updateDashboardStats, updateUpcomingEventsCount } from '../features/therapist/dashboardSlice';

/**
 * Custom hook for Therapist Dashboard real-time synchronization.
 * Refreshes stats (appointments, requests, messages) and events count.
 * 
 * @param {string} therapistId - The ID of the logged-in therapist.
 * @param {number} intervalMs - Polling interval (default: 60000ms).
 */
export const useTherapistDashboardSync = (therapistId: string | null | undefined, intervalMs: number = 60000) => {
    const dispatch = useDispatch();
    const appState = useRef(AppState.currentState);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const normalizeStats = useCallback((data: any) => ({
        todayAppointments: data?.todayAppointments ?? data?.appointments?.today ?? data?.sessionsToday ?? data?.appointment_count ?? 0,
        pendingRequests: data?.pendingRequests ?? data?.requests?.pending ?? data?.request_count ?? 0,
        activeGroups: data?.activeGroups ?? data?.groups?.active ?? data?.group_count ?? 0,
        unreadMessages: data?.unreadMessages ?? data?.messages?.unread ?? data?.unread_count ?? 0,
        totalClients: data?.totalClients ?? data?.clients?.total ?? data?.client_count ?? 0,
    }), []);

    const fetchDashboardData = useCallback(async () => {
        if (!therapistId) return;

        try {
            console.log('🔄 [useTherapistDashboardSync] Refreshing stats...');
            
            // 1. Fetch Stats
            const statsRes = await getDashboardStats(therapistId);
            if (statsRes?.data) {
                dispatch(updateDashboardStats(normalizeStats(statsRes.data)));
            }

            // 2. Fetch Events Count
            const eventsRes = await getEvents(therapistId, { status: 'upcoming', limit: 1 });
            if (eventsRes?.data) {
                const count = (eventsRes.data as any)?.stats?.upcomingEvents || 0;
                dispatch(updateUpcomingEventsCount(count));
            }
        } catch (error) {
            console.log('❌ [useTherapistDashboardSync] Sync failed:', error);
        }
    }, [therapistId, dispatch, normalizeStats]);

    const startPolling = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (!therapistId) return;

        timerRef.current = setInterval(() => {
            fetchDashboardData();
        }, intervalMs);
    }, [therapistId, intervalMs, fetchDashboardData]);

    const stopPolling = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (!therapistId) return;

        // Perform initial fetch
        fetchDashboardData();
        startPolling();

        const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                fetchDashboardData();
                startPolling();
            } else if (nextAppState.match(/inactive|background/)) {
                stopPolling();
            }
            appState.current = nextAppState;
        });

        return () => {
            stopPolling();
            subscription.remove();
        };
    }, [therapistId, startPolling, stopPolling, fetchDashboardData]);
};
