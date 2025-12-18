/**
 * Client Reports/Analytics API Functions
 * Wellness reports aggregate mood, journal, goals, and activity data
 */
import { APIInstance } from '../LHAPI';

/**
 * Get weekly wellness report
 * @param {string} userId - User ID
 * @param {string} weekStartDate - Week start date (YYYY-MM-DD)
 * @returns {Promise} Weekly report data
 */
export const getWeeklyReport = async (userId, weekStartDate = null) => {
    const params = { user_id: userId };
    if (weekStartDate) {
        params.week_start_date = weekStartDate;
    }
    
    const response = await APIInstance.get('/client/reports/weekly', { params });
    return response.data;
};

/**
 * Get monthly wellness report
 * @param {string} userId - User ID
 * @param {string} month - Month (YYYY-MM)
 * @returns {Promise} Monthly report data
 */
export const getMonthlyReport = async (userId, month = null) => {
    const params = { user_id: userId };
    if (month) {
        params.month = month;
    }
    
    const response = await APIInstance.get('/client/reports/monthly', { params });
    return response.data;
};

/**
 * Get report history (list of available reports)
 * @param {string} userId - User ID
 * @param {string} type - Report type: 'weekly' | 'monthly'
 * @returns {Promise} List of reports
 */
export const getReportHistory = async (userId, type = 'weekly') => {
    const response = await APIInstance.get('/client/reports/history', {
        params: { user_id: userId, type }
    });
    return response.data;
};

/**
 * Generate new report (trigger report generation)
 * @param {string} userId - User ID
 * @param {string} type - Report type: 'weekly' | 'monthly'
 * @returns {Promise} Generated report
 */
export const generateReport = async (userId, type = 'weekly') => {
    const response = await APIInstance.post('/client/reports/generate', {
        user_id: userId,
        type
    });
    return response.data;
};

/**
 * Email report to user
 * @param {string} userId - User ID
 * @param {string} reportId - Report ID
 * @returns {Promise} Success message
 */
export const emailReport = async (userId, reportId) => {
    const response = await APIInstance.post('/client/reports/email', {
        user_id: userId,
        report_id: reportId
    });
    return response.data;
};
