/**
 * Therapist Analytics API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get analytics overview
 * @param {string} therapistId - Therapist ID
 * @param {'week'|'month'|'year'} [period='month'] - Time period for analytics
 * @returns {Promise<{success: boolean, data: Object}>} Analytics overview with key metrics and trends
 * @example
 * const result = await getAnalyticsOverview(therapistId, 'month');
 * // Returns:
 * // {
 * //   success: true,
 * //   data: {
 * //     period: "month",
 * //     sessions: {
 * //       total: 96,
 * //       completed: 88,
 * //       cancelled: 8,
 * //       trend: "+12%"
 * //     },
 * //     clients: {
 * //       total: 45,
 * //       new: 5,
 * //       active: 38,
 * //       trend: "+8%"
 * //     },
 * //     revenue: {
 * //       total: 48000,
 * //       currency: "UGX",
 * //       trend: "+15%"
 * //     },
 * //     rating: {
 * //       average: 4.8,
 * //       totalReviews: 124
 * //     }
 * //   }
 * // }
 */
export const getAnalyticsOverview = async (therapistId, period = 'month') => {
    const response = await APIInstance.get('/th/analytics/overview', {
        params: { therapist_id: therapistId, period }
    });
    return response.data;
};

/**
 * Get session analytics
 * @param {string} therapistId - Therapist ID
 * @param {'week'|'month'|'year'} [period='month'] - Time period for analytics
 * @returns {Promise<{success: boolean, data: Object}>} Session analytics including counts, types, and trends
 * @example
 * const result = await getSessionAnalytics(therapistId, 'month');
 * // Returns:
 * // {
 * //   success: true,
 * //   data: {
 * //     period: "month",
 * //     totalSessions: 96,
 * //     completedSessions: 88,
 * //     cancelledSessions: 8,
 * //     averageDuration: 58,
 * //     sessionsByType: {
 * //       individual: 70,
 * //       couple: 15,
 * //       group: 11
 * //     },
 * //     trend: "+12%"
 * //   }
 * // }
 */
export const getSessionAnalytics = async (therapistId, period = 'month') => {
    const response = await APIInstance.get('/th/analytics/sessions', {
        params: { therapist_id: therapistId, period }
    });
    return response.data;
};

/**
 * Get revenue analytics
 * @param {string} therapistId - Therapist ID
 * @param {'week'|'month'|'year'} [period='month'] - Time period for analytics
 * @returns {Promise<{success: boolean, data: Object}>} Revenue analytics with trends and breakdowns
 * @example
 * const result = await getRevenueAnalytics(therapistId, 'month');
 * // Returns:
 * // {
 * //   success: true,
 * //   data: {
 * //     period: "month",
 * //     totalRevenue: 4800000,
 * //     currency: "UGX",
 * //     completedPayments: 4500000,
 * //     pendingPayments: 300000,
 * //     revenueByType: {
 * //       individual: 3500000,
 * //       couple: 1125000,
 * //       group: 175000
 * //     },
 * //     trend: "+15%"
 * //   }
 * // }
 */
export const getRevenueAnalytics = async (therapistId, period = 'month') => {
    const response = await APIInstance.get('/th/analytics/revenue', {
        params: { therapist_id: therapistId, period }
    });
    return response.data;
};
