/**
 * Therapist Earnings Manager
 * Handles earnings/revenue API calls with graceful error handling
 * Returns empty data for 404 (no data available)
 */
import {
    getEarnings,
    getEarningsBreakdown,
    requestPayout as requestPayoutAPI,
    getPricingRates,
    updatePricingRates as updatePricingAPI,
} from '../api/therapist/earnings';

/**
 * Load earnings summary from API
 * Returns empty data if endpoint returns 404 (no data)
 */
export const loadEarnings = async (therapistId: string, filters: any = {}) => {
    try {
        console.log('💰 Loading earnings with filters:', filters);
        const response = await getEarnings(therapistId, filters);

        if (response.success && response.data) {
            console.log('✅ Earnings loaded successfully');
            return { success: true, data: response.data };
        } else {
            console.log('⚠️ API response missing success or data');
            return { success: false, error: 'Invalid response format' };
        }
    } catch (error: any) {
        console.log('❌ Error loading earnings:', error?.message);

        if (error?.response?.status === 404) {
            console.log('📦 GET /th/earnings endpoint returns 404');
            return { success: false, error: 'No earnings data available', isEmpty: true };
        }

        return { success: false, error: error?.message || 'Failed to load earnings' };
    }
};

/**
 * Load earnings breakdown
 */
export const loadEarningsBreakdown = async (therapistId: string, month: number, year: number) => {
    try {
        console.log('💰 Loading earnings breakdown for:', month, '/', year);
        const response = await getEarningsBreakdown(therapistId, month, year);

        if (response.success && response.data) {
            return { success: true, data: response.data };
        } else {
            return { success: false, error: 'Invalid response format' };
        }
    } catch (error: any) {
        console.log('❌ Error loading earnings breakdown:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Breakdown not available', isEmpty: true };
        }

        return { success: false, error: error?.message || 'Failed to load breakdown' };
    }
};

/**
 * Request payout
 */
export const requestPayout = async (therapistId: string, amount: number, method: 'bank_transfer' | 'mobile_money') => {
    try {
        console.log('💸 Requesting payout:', amount, 'via', method);
        const response = await requestPayoutAPI(therapistId, amount, method);

        if (response.success) {
            console.log('✅ Payout requested successfully');
            return { success: true, data: response.data };
        } else {
            return { success: false, error: response.message || 'Failed to request payout' };
        }
    } catch (error: any) {
        console.log('❌ Error requesting payout:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Payout endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to request payout' };
    }
};

/**
 * Load pricing rates
 */
export const loadPricingRates = async (therapistId: string) => {
    try {
        console.log('💲 Loading pricing rates');
        const response = await getPricingRates(therapistId);

        if (response.success && response.data) {
            const sessionTypes = response.data.sessionTypes || [];
            return { success: true, sessionTypes };
        } else {
            return { success: false, error: 'Invalid response format', sessionTypes: [] };
        }
    } catch (error: any) {
        console.log('❌ Error loading pricing rates:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Pricing not available', isEmpty: true, sessionTypes: [] };
        }

        return { success: false, error: error?.message || 'Failed to load pricing', sessionTypes: [] };
    }
};

/**
 * Update pricing rates
 */
export const updatePricingRates = async (therapistId: string, sessionTypes: any[]) => {
    try {
        console.log('💲 Updating pricing rates');
        const response = await updatePricingAPI(therapistId, sessionTypes);

        if (response.success) {
            console.log('✅ Pricing updated successfully');
            return { success: true, data: response.data };
        } else {
            return { success: false, error: response.message || 'Failed to update pricing' };
        }
    } catch (error: any) {
        console.log('❌ Error updating pricing:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Update pricing endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to update pricing' };
    }
};
