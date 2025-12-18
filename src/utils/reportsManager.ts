/**
 * Reports Manager
 * Handles wellness reports API calls with graceful error handling
 * Returns empty data for 404 (endpoint not implemented yet)
 */
import store from '../app/store';
import {
  setCurrentReport,
  setReportHistory,
  setLoading,
  setRefreshing,
  setError,
} from '../features/reports/reportsSlice';
import {
  getWeeklyReport,
  getMonthlyReport,
  getReportHistory,
  generateReport,
  emailReport,
} from '../api/client/reports';

/**
 * Load weekly report from API
 * Returns empty report if endpoint not implemented (404)
 */
export const loadWeeklyReport = async (userId: string, weekStartDate?: string) => {
  store.dispatch(setLoading(true));
  
  try {
    console.log('📊 Loading weekly report from API');
    const response = await getWeeklyReport(userId, weekStartDate);
    console.log('✅ API Response:', JSON.stringify(response, null, 2));
    
    if (response.success && response.data) {
      console.log('📈 Report loaded successfully');
      store.dispatch(setCurrentReport(response.data));
    } else {
      console.log('⚠️ API response missing success or data:', response);
      store.dispatch(setCurrentReport(null));
    }
  } catch (error: any) {
    console.log('❌ Error loading weekly report:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });
    
    // Handle 404 - endpoint not implemented yet, return empty state
    if (error?.response?.status === 404) {
      console.log('📦 GET /client/reports/weekly endpoint returns 404, showing empty state');
      store.dispatch(setCurrentReport(null));
    } else {
      // Other errors - set error state with empty data
      console.log('⚠️ Non-404 error, showing empty state');
      store.dispatch(setCurrentReport(null));
      store.dispatch(setError(error?.message || 'Failed to load report'));
    }
  } finally {
    store.dispatch(setLoading(false));
  }
};

/**
 * Refresh weekly report
 */
export const refreshWeeklyReport = async (userId: string, weekStartDate?: string) => {
  store.dispatch(setRefreshing(true));
  
  try {
    console.log('🔄 Refreshing weekly report');
    const response = await getWeeklyReport(userId, weekStartDate);
    
    if (response.success && response.data) {
      store.dispatch(setCurrentReport(response.data));
    } else {
      store.dispatch(setCurrentReport(null));
    }
  } catch (error: any) {
    console.log('Error refreshing report:', error);
    
    // Handle 404 gracefully - show empty state
    if (error?.response?.status === 404) {
      store.dispatch(setCurrentReport(null));
    } else {
      store.dispatch(setCurrentReport(null));
      store.dispatch(setError(error?.message || 'Failed to refresh report'));
    }
  } finally {
    store.dispatch(setRefreshing(false));
  }
};

/**
 * Load monthly report from API
 */
export const loadMonthlyReport = async (userId: string, month?: string) => {
  store.dispatch(setLoading(true));
  
  try {
    console.log('📊 Loading monthly report from API');
    const response = await getMonthlyReport(userId, month);
    
    if (response.success && response.data) {
      store.dispatch(setCurrentReport(response.data));
    } else {
      store.dispatch(setCurrentReport(null));
    }
  } catch (error: any) {
    console.log('❌ Error loading monthly report:', error?.message);
    
    if (error?.response?.status === 404) {
      console.log('📦 GET /client/reports/monthly endpoint returns 404');
      store.dispatch(setCurrentReport(null));
    } else {
      store.dispatch(setCurrentReport(null));
      store.dispatch(setError(error?.message || 'Failed to load report'));
    }
  } finally {
    store.dispatch(setLoading(false));
  }
};

/**
 * Load report history (list of available reports)
 */
export const loadReportHistory = async (userId: string, type: string = 'weekly') => {
  try {
    console.log('📊 Loading report history');
    const response = await getReportHistory(userId, type);
    
    if (response.success && response.data) {
      const reports = response.data.reports || [];
      store.dispatch(setReportHistory(reports));
      return { success: true, data: reports };
    } else {
      store.dispatch(setReportHistory([]));
      return { success: false, data: [] };
    }
  } catch (error: any) {
    console.log('❌ Error loading report history:', error?.message);
    
    if (error?.response?.status === 404) {
      store.dispatch(setReportHistory([]));
    }
    
    return { success: false, error: error?.message || 'Failed to load report history' };
  }
};

/**
 * Generate new report
 */
export const generateNewReport = async (userId: string, type: string = 'weekly') => {
  try {
    console.log('📊 Generating new report');
    const response = await generateReport(userId, type);
    
    if (response.success && response.data) {
      console.log('✅ Report generated successfully');
      store.dispatch(setCurrentReport(response.data));
      return { success: true, data: response.data };
    } else {
      return { success: false, error: response.message || 'Failed to generate report' };
    }
  } catch (error: any) {
    console.log('❌ Error generating report:', error?.message);
    
    if (error?.response?.status === 404) {
      return { success: false, error: 'Report generation endpoint not implemented yet' };
    }
    
    return { success: false, error: error?.message || 'Failed to generate report' };
  }
};

/**
 * Email report to user
 */
export const sendReportEmail = async (userId: string, reportId: string) => {
  try {
    console.log('📧 Sending report email');
    const response = await emailReport(userId, reportId);
    
    if (response.success) {
      console.log('✅ Report email sent successfully');
      return { success: true };
    } else {
      return { success: false, error: response.message || 'Failed to send email' };
    }
  } catch (error: any) {
    console.log('❌ Error sending report email:', error?.message);
    
    if (error?.response?.status === 404) {
      return { success: false, error: 'Email report endpoint not implemented yet' };
    }
    
    return { success: false, error: error?.message || 'Failed to send email' };
  }
};
