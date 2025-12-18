/**
 * Dashboard Manager
 * Handles dashboard API calls and data management
 */
import store from '../app/store';
import {
  setDashboardData,
  setLoading,
  setRefreshing,
  setError,
} from '../features/dashboard/dashboardSlice';
import { getDashboardData } from '../api/client/dashboard';
import { getRandomWellnessTip } from '../global/MockData';

/**
 * Load dashboard data from API
 * Handles wellness tip fallback when null
 */
export const loadDashboardData = async (userId: string) => {
  store.dispatch(setLoading(true));
  
  try {
    console.log('🏠 Loading dashboard data for userId:', userId);
    const response = await getDashboardData(userId);
    console.log('✅ Dashboard API Response:', JSON.stringify(response, null, 2));
    
    if (response.success && response.data) {
      const dashboardData = response.data;
      
      // If wellness tip is null, use random mock tip
      if (!dashboardData.wellnessTip) {
        console.log('💡 No wellness tip from API, using random mock tip');
        dashboardData.wellnessTip = getRandomWellnessTip();
      }
      
      console.log('📊 Dashboard data loaded:', {
        upcomingSessions: dashboardData.upcomingSessions?.length || 0,
        todayEvents: dashboardData.todayEvents?.length || 0,
        wellnessTip: dashboardData.wellnessTip ? 'Available' : 'None',
        moodStreak: dashboardData.moodStreak,
      });
      
      store.dispatch(setDashboardData(dashboardData));
    } else {
      console.log('⚠️ Dashboard API response missing success or data:', response);
      store.dispatch(setError('Failed to load dashboard data'));
    }
  } catch (error: any) {
    console.log('❌ Error loading dashboard data:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });
    
    // Handle 404 - endpoint not implemented yet, return empty structure with wellness tip
    if (error?.response?.status === 404) {
      console.log('📦 GET /client/dashboard endpoint returns 404, showing empty state with wellness tip');
      
      store.dispatch(setDashboardData({
        user: { firstName: '', lastName: '', profileImage: null },
        upcomingSessions: [],
        todayEvents: [],
        wellnessTip: getRandomWellnessTip(), // Always provide wellness tip for better UX
        moodStreak: 0,
        quickStats: { sessionsCompleted: 0, goalsAchieved: 0 },
      }));
    } else {
      store.dispatch(setError(error?.message || 'Failed to load dashboard data'));
    }
  } finally {
    store.dispatch(setLoading(false));
  }
};

/**
 * Refresh dashboard data
 */
export const refreshDashboardData = async (userId: string) => {
  store.dispatch(setRefreshing(true));
  
  try {
    console.log('🔄 Refreshing dashboard data for userId:', userId);
    const response = await getDashboardData(userId);
    
    if (response.success && response.data) {
      const dashboardData = response.data;
      
      // If wellness tip is null, use random mock tip
      if (!dashboardData.wellnessTip) {
        dashboardData.wellnessTip = getRandomWellnessTip();
      }
      
      store.dispatch(setDashboardData(dashboardData));
    }
  } catch (error: any) {
    console.log('❌ Error refreshing dashboard data:', error?.message);
    
    // Handle 404 - endpoint not implemented yet
    if (error?.response?.status === 404) {
      console.log('📦 Dashboard refresh returns 404, showing empty state with wellness tip');
      
      store.dispatch(setDashboardData({
        user: { firstName: '', lastName: '', profileImage: null },
        upcomingSessions: [],
        todayEvents: [],
        wellnessTip: getRandomWellnessTip(),
        moodStreak: 0,
        quickStats: { sessionsCompleted: 0, goalsAchieved: 0 },
      }));
    } else {
      store.dispatch(setError(error?.message || 'Failed to refresh dashboard data'));
    }
  } finally {
    store.dispatch(setRefreshing(false));
  }
};
