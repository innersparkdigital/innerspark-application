/**
 * Client Wallet API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Topup wallet
 * @param {string} userId - User ID
 * @param {number} amount - Amount to topup
 * @param {string} phoneNumber - Phone number for mobile money
 * @param {string} network - Mobile money network (MTN, Airtel, etc.)
 * @returns {Promise} Topup transaction details
 */
export const topupWallet = async (userId, amount, phoneNumber, network) => {
    const response = await APIInstance.post('/client/wallet/topup', {
        user_id: userId,
        amount,
        phoneNumber,
        network
    });
    return response.data;
};

/**
 * Payout from wallet
 * @param {string} userId - User ID
 * @param {number} amount - Amount to payout
 * @param {string} phoneNumber - Phone number for mobile money
 * @param {string} network - Mobile money network (MTN, Airtel, etc.)
 * @returns {Promise} Payout transaction details
 */
export const payoutWallet = async (userId, amount, phoneNumber, network) => {
    const response = await APIInstance.post('/client/wallet/payout', {
        user_id: userId,
        amount,
        phoneNumber,
        network
    });
    return response.data;
};

/**
 * Get wallet transactions
 * @param {string} userId - User ID
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise} Transactions list
 */
export const getWalletTransactions = async (userId, page = 1, limit = 20) => {
    const response = await APIInstance.get('/client/wallet/transactions', {
        params: { user_id: userId, page, limit }
    });
    return response.data;
};

/**
 * Get wallet transaction by ID
 * @param {string} transactionId - Transaction ID
 * @param {string} userId - User ID
 * @returns {Promise} Transaction details
 */
export const getWalletTransaction = async (transactionId, userId) => {
    const response = await APIInstance.get(`/client/wallet/transactions/${transactionId}`, {
        params: { user_id: userId }
    });
    return response.data;
};
