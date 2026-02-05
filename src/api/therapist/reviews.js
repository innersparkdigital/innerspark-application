/**
 * Therapist Reviews API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get therapist reviews
 * @param {string} therapistId - Therapist ID
 * @param {Object} [filters={}] - Filter options
 * @param {1|2|3|4|5} [filters.rating] - Filter by rating (1-5)
 * @param {number} [filters.page=1] - Page number
 * @param {number} [filters.limit=20] - Items per page
 * @returns {Promise<{success: boolean, data: Object}>} Reviews list with summary statistics
 * @example
 * const result = await getReviews(therapistId, { rating: 5, page: 1 });
 * // Returns:
 * // {
 * //   success: true,
 * //   data: {
 * //     reviews: [{
 * //       id: "review_001",
 * //       clientName: "John Doe",
 * //       clientAvatar: "👨",
 * //       rating: 5,
 * //       comment: "Excellent therapist, very helpful",
 * //       date: "2025-10-20",
 * //       appointmentId: "apt_001"
 * //     }],
 * //     summary: {
 * //       averageRating: 4.8,
 * //       totalReviews: 124,
 * //       distribution: { "5": 95, "4": 20, "3": 5, "2": 2, "1": 2 }
 * //     }
 * //   }
 * // }
 */
export const getReviews = async (therapistId, filters = {}) => {
    const response = await APIInstance.get('/th/reviews', {
        params: { therapist_id: therapistId, ...filters }
    });
    return response.data;
};

/**
 * Get transaction history
 * @param {string} therapistId - Therapist ID
 * @param {Object} [filters={}] - Filter options
 * @param {'completed'|'pending'|'failed'} [filters.status] - Transaction status
 * @param {string} [filters.startDate] - Start date filter (YYYY-MM-DD)
 * @param {string} [filters.endDate] - End date filter (YYYY-MM-DD)
 * @param {number} [filters.page=1] - Page number
 * @param {number} [filters.limit=20] - Items per page
 * @returns {Promise<{success: boolean, data: Object}>} Transaction history with summary
 * @example
 * const result = await getTransactions(therapistId, { status: 'completed', page: 1 });
 * // Returns:
 * // {
 * //   success: true,
 * //   data: {
 * //     transactions: [{
 * //       id: "txn_001",
 * //       type: "session_payment",
 * //       clientName: "John Doe",
 * //       amount: 50000,
 * //       currency: "UGX",
 * //       status: "completed",
 * //       date: "2025-10-23",
 * //       appointmentId: "apt_001"
 * //     }],
 * //     summary: {
 * //       totalEarnings: 480000,
 * //       pendingPayments: 50000,
 * //       completedTransactions: 96
 * //     }
 * //   }
 * // }
 */
export const getTransactions = async (therapistId, filters = {}) => {
    const response = await APIInstance.get('/th/transactions', {
        params: { therapist_id: therapistId, ...filters }
    });
    return response.data;
};
