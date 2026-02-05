/**
 * Therapist Earnings & Pricing API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get earnings summary
 * @param {string} therapistId - Therapist ID
 * @param {Object} [filters={}] - Filter options
 * @param {'week'|'month'|'year'} [filters.period] - Time period
 * @param {string} [filters.startDate] - Start date (YYYY-MM-DD)
 * @param {string} [filters.endDate] - End date (YYYY-MM-DD)
 * @returns {Promise<{success: boolean, data: Object}>} Earnings summary with totals and pending amounts
 * @example
 * const result = await getEarnings(therapistId, { period: 'month' });
 * // Returns:
 * // {
 * //   success: true,
 * //   data: {
 * //     period: "month",
 * //     totalEarned: 4800000,
 * //     pendingPayout: 300000,
 * //     completedPayouts: 4500000,
 * //     currency: "UGX",
 * //     sessionCount: 96,
 * //     averagePerSession: 50000
 * //   }
 * // }
 */
export const getEarnings = async (therapistId, filters = {}) => {
    const response = await APIInstance.get('/th/earnings', {
        params: { therapist_id: therapistId, ...filters }
    });
    return response.data;
};

/**
 * Get earnings breakdown
 * @param {string} therapistId - Therapist ID
 * @param {number} month - Month (1-12)
 * @param {number} year - Year (YYYY)
 * @returns {Promise<{success: boolean, data: Object}>} Detailed earnings breakdown by service type
 * @example
 * const result = await getEarningsBreakdown(therapistId, 10, 2025);
 * // Returns:
 * // {
 * //   success: true,
 * //   data: {
 * //     month: 10,
 * //     year: 2025,
 * //     total: 4800000,
 * //     currency: "UGX",
 * //     byType: {
 * //       individual: 3500000,
 * //       couple: 1125000,
 * //       group: 175000
 * //     },
 * //     byWeek: [{ week: 1, amount: 1200000 }, ...]
 * //   }
 * // }
 */
export const getEarningsBreakdown = async (therapistId, month, year) => {
    const response = await APIInstance.get('/th/earnings/breakdown', {
        params: { therapist_id: therapistId, month, year }
    });
    return response.data;
};

/**
 * Request payout
 * @param {string} therapistId - Therapist ID
 * @param {number} amount - Payout amount
 * @param {'bank_transfer'|'mobile_money'} method - Payout method
 * @returns {Promise<{success: boolean, message: string, data: Object}>} Payout request confirmation
 * @example
 * const result = await requestPayout(therapistId, 300000, 'mobile_money');
 * // Returns:
 * // {
 * //   success: true,
 * //   message: "Payout request submitted successfully",
 * //   data: {
 * //     payoutId: "payout_001",
 * //     amount: 300000,
 * //     method: "mobile_money",
 * //     status: "pending",
 * //     estimatedDate: "2025-10-25"
 * //   }
 * // }
 */
export const requestPayout = async (therapistId, amount, method) => {
    const response = await APIInstance.post('/th/earnings/payout', {
        therapist_id: therapistId,
        amount,
        method
    });
    return response.data;
};

/**
 * Get pricing rates
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, data: Object}>} Session pricing rates by type
 * @example
 * const result = await getPricingRates(therapistId);
 * // Returns:
 * // {
 * //   success: true,
 * //   data: {
 * //     sessionTypes: [
 * //       {
 * //         type: "Individual Session",
 * //         duration: 60,
 * //         price: 50000,
 * //         currency: "UGX"
 * //       },
 * //       {
 * //         type: "Couples Therapy",
 * //         duration: 90,
 * //         price: 75000,
 * //         currency: "UGX"
 * //       }
 * //     ]
 * //   }
 * // }
 */
export const getPricingRates = async (therapistId) => {
    const response = await APIInstance.get('/th/pricing', {
        params: { therapist_id: therapistId }
    });
    return response.data;
};

/**
 * Update pricing rates
 * @param {string} therapistId - Therapist ID
 * @param {Array<Object>} sessionTypes - Array of session type pricing objects
 * @param {string} sessionTypes[].type - Session type name
 * @param {number} sessionTypes[].duration - Duration in minutes
 * @param {number} sessionTypes[].price - Price amount
 * @param {string} sessionTypes[].currency - Currency code
 * @returns {Promise<{success: boolean, message: string, data: Object}>} Updated pricing rates
 * @example
 * const result = await updatePricingRates(therapistId, [
 *   {
 *     type: "Individual Session",
 *     duration: 60,
 *     price: 55000,
 *     currency: "UGX"
 *   }
 * ]);
 * // Returns:
 * // {
 * //   success: true,
 * //   message: "Pricing updated successfully",
 * //   data: { updatedAt: "2025-10-23T16:00:00Z" }
 * // }
 */
export const updatePricingRates = async (therapistId, sessionTypes) => {
    const response = await APIInstance.put('/th/pricing', {
        therapist_id: therapistId,
        sessionTypes
    });
    return response.data;
};
