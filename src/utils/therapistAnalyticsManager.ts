/**
 * Therapist Analytics Manager
 * Handles analytics API calls with graceful error handling
 * Returns empty data for 404 (no data available)
 */
import {
    getAnalyticsOverview,
    getSessionAnalytics,
    getRevenueAnalytics,
} from '../api/therapist/analytics';
import {
    getReviews,
    getTransactions,
} from '../api/therapist/reviews';

/**
 * Load analytics overview from API
 * Returns empty data if endpoint returns 404 (no data)
 */
export const loadAnalyticsOverview = async (therapistId: string, period: 'week' | 'month' | 'year' = 'month') => {
    try {
        console.log('📊 Loading analytics overview for period:', period);
        const response = await getAnalyticsOverview(therapistId, period);

        if (response.success && response.data) {
            console.log('✅ Analytics loaded successfully');
            return { success: true, data: response.data };
        } else {
            console.log('⚠️ API response missing success or data');
            return { success: false, error: 'Invalid response format' };
        }
    } catch (error: any) {
        console.log('❌ Error loading analytics:', error?.message);

        if (error?.response?.status === 404) {
            console.log('📦 GET /th/analytics/overview endpoint returns 404');
            return { success: false, error: 'No analytics data available', isEmpty: true };
        }

        return { success: false, error: error?.message || 'Failed to load analytics' };
    }
};

/**
 * Load session analytics
 */
export const loadSessionAnalytics = async (therapistId: string, period: 'week' | 'month' | 'year' = 'month') => {
    try {
        console.log('📊 Loading session analytics for period:', period);
        const response = await getSessionAnalytics(therapistId, period);

        if (response.success && response.data) {
            return { success: true, data: response.data };
        } else {
            return { success: false, error: 'Invalid response format' };
        }
    } catch (error: any) {
        console.log('❌ Error loading session analytics:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Session analytics not available', isEmpty: true };
        }

        return { success: false, error: error?.message || 'Failed to load session analytics' };
    }
};

/**
 * Load revenue analytics
 */
export const loadRevenueAnalytics = async (therapistId: string, period: 'week' | 'month' | 'year' = 'month') => {
    try {
        console.log('📊 Loading revenue analytics for period:', period);
        const response = await getRevenueAnalytics(therapistId, period);

        if (response.success && response.data) {
            return { success: true, data: response.data };
        } else {
            return { success: false, error: 'Invalid response format' };
        }
    } catch (error: any) {
        console.log('❌ Error loading revenue analytics:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Revenue analytics not available', isEmpty: true };
        }

        return { success: false, error: error?.message || 'Failed to load revenue analytics' };
    }
};

/**
 * Load reviews list
 */
export const loadReviews = async (therapistId: string, filters: any = {}) => {
    try {
        console.log('⭐ Loading reviews with filters:', filters);
        const response = await getReviews(therapistId, filters);

        if (response.success && response.data) {
            const reviews = response.data.reviews || [];
            const summary = response.data.summary || {};
            return { success: true, reviews, summary };
        } else {
            return { success: false, error: 'Invalid response format', reviews: [] };
        }
    } catch (error: any) {
        console.log('❌ Error loading reviews:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'No reviews available', isEmpty: true, reviews: [] };
        }

        return { success: false, error: error?.message || 'Failed to load reviews', reviews: [] };
    }
};

/**
 * Load transaction history
 */
export const loadTransactions = async (therapistId: string, filters: any = {}) => {
    try {
        console.log('💳 Loading transactions with filters:', filters);
        const response = await getTransactions(therapistId, filters);

        if (response.success && response.data) {
            const transactions = response.data.transactions || [];
            const summary = response.data.summary || {};
            return { success: true, transactions, summary };
        } else {
            return { success: false, error: 'Invalid response format', transactions: [] };
        }
    } catch (error: any) {
        console.log('❌ Error loading transactions:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'No transactions available', isEmpty: true, transactions: [] };
        }

        return { success: false, error: error?.message || 'Failed to load transactions', transactions: [] };
    }
};
