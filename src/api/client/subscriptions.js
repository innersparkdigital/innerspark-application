/**
 * Client Subscriptions & Billing API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get subscription plans
 * @param {string} userId - User ID
 * @returns {Promise} Available plans
 */
export const getPlans = async (userId) => {
    const response = await APIInstance.get('/client/subscriptions/plans', {
        params: { user_id: userId }
    });
    return response.data;
};

/**
 * Subscribe to plan
 * @param {string} userId - User ID
 * @param {string} planId - Plan ID
 * @param {string} billingCycle - Billing cycle (weekly, monthly, yearly)
 * @param {string} paymentMethod - Payment method (wallet, card, mobile_money)
 * @param {string} phoneNumber - Phone number for mobile money
 * @returns {Promise} Subscription confirmation
 */
export const subscribe = async (userId, planId, billingCycle, paymentMethod, phoneNumber) => {
    const response = await APIInstance.post('/client/subscriptions/subscribe', {
        user_id: userId,
        planId,
        billingCycle,
        paymentMethod,
        phoneNumber
    });
    return response.data;
};

/**
 * Get current subscription
 * @param {string} userId - User ID
 * @returns {Promise} Current subscription details
 */
export const getCurrentSubscription = async (userId) => {
    const response = await APIInstance.get('/client/subscriptions/current', {
        params: { user_id: userId }
    });
    return response.data;
};

/**
 * Get billing history
 * @param {string} userId - User ID
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise} Billing history
 */
export const getBillingHistory = async (userId, page = 1, limit = 20) => {
    const response = await APIInstance.get('/client/billing/history', {
        params: { user_id: userId, page, limit }
    });
    return response.data;
};
