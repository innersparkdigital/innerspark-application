/**
 * Therapist Dashboard Manager
 * Handles dashboard API calls with graceful error handling
 * Returns empty data for 404 (no data available)
 */
import store from '../app/store';
import {
    updateDashboardStats,
    updateDashboardLoading,
} from '../features/therapist/dashboardSlice';
import {
    getDashboardStats,
    getTherapistProfile,
} from '../api/therapist/dashboard';

/**
 * Load dashboard statistics from API
 * Returns empty stats if endpoint returns 404 (no data)
 */
export const loadDashboardStats = async (therapistId: string) => {
    store.dispatch(updateDashboardLoading(true));

    try {
        console.log('📊 Loading therapist dashboard stats from API');
        const response = await getDashboardStats(therapistId);

        if (response.success && response.data) {
            console.log('✅ Dashboard stats loaded successfully');
            store.dispatch(updateDashboardStats(response.data));
            return { success: true, data: response.data };
        } else {
            console.log('⚠️ API response missing success or data');
            return { success: false, error: 'Invalid response format' };
        }
    } catch (error: any) {
        console.log('❌ Error loading dashboard stats:', {
            message: error?.message,
            status: error?.response?.status,
            data: error?.response?.data,
        });

        // Handle 404 - no data available, keep empty state
        if (error?.response?.status === 404) {
            console.log('📦 404 returned - no data available, using empty stats');
            return { success: false, error: 'Dashboard data not available' };
        }

        // Other errors
        console.log('⚠️ Non-404 error');
        return { success: false, error: error?.message || 'Failed to load dashboard stats' };
    } finally {
        store.dispatch(updateDashboardLoading(false));
    }
};

/**
 * Load therapist profile from API
 * Returns null if endpoint returns 404 (no data)
 */
export const loadTherapistProfile = async (therapistId: string) => {
    try {
        console.log('👤 Loading therapist profile from API');
        const response = await getTherapistProfile(therapistId);

        if (response.success && response.data) {
            const profile = response.data.therapist || response.data;
            console.log('✅ Therapist profile loaded:', profile.name);
            return { success: true, profile };
        } else {
            console.log('⚠️ API response missing success or data');
            return { success: false, error: 'Invalid response format' };
        }
    } catch (error: any) {
        console.log('❌ Error loading therapist profile:', error?.message);

        // Handle 404 - profile not found or endpoint not implemented
        if (error?.response?.status === 404) {
            console.log('📦 404 returned - profile not available');
            return { success: false, error: 'Profile not found' };
        }

        return { success: false, error: error?.message || 'Failed to load profile' };
    }
};
