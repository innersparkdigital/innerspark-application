/**
 * Dashboard Redux Slice
 * Manages home dashboard data including sessions, events, wellness tips, and stats
 */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    firstName: '',
    lastName: '',
    profileImage: null,
  },
  upcomingSessions: [],
  todayEvents: [],
  wellnessTip: null,
  moodStreak: 0,
  quickStats: {
    sessionsCompleted: 0,
    goalsAchieved: 0,
  },
  isLoading: false,
  isRefreshing: false,
  error: null,
  lastUpdated: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Set dashboard data
    setDashboardData: (state, action) => {
      const { user, upcomingSessions, todayEvents, wellnessTip, moodStreak, quickStats } = action.payload;
      
      if (user) state.user = user;
      state.upcomingSessions = upcomingSessions || [];
      state.todayEvents = todayEvents || [];
      state.wellnessTip = wellnessTip;
      state.moodStreak = moodStreak || 0;
      if (quickStats) state.quickStats = quickStats;
      state.lastUpdated = new Date().toISOString();
      state.error = null;
    },

    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Set refreshing state
    setRefreshing: (state, action) => {
      state.isRefreshing = action.payload;
    },

    // Set error
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isRefreshing = false;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear dashboard data
    clearDashboard: (state) => {
      return initialState;
    },
  },
});

export const {
  setDashboardData,
  setLoading,
  setRefreshing,
  setError,
  clearError,
  clearDashboard,
} = dashboardSlice.actions;

// Selectors
export const selectDashboardUser = (state) => state.dashboard.user;
export const selectUpcomingSessions = (state) => state.dashboard.upcomingSessions;
export const selectTodayEvents = (state) => state.dashboard.todayEvents;
export const selectWellnessTip = (state) => state.dashboard.wellnessTip;
export const selectMoodStreak = (state) => state.dashboard.moodStreak;
export const selectQuickStats = (state) => state.dashboard.quickStats;
export const selectDashboardLoading = (state) => state.dashboard.isLoading;
export const selectDashboardRefreshing = (state) => state.dashboard.isRefreshing;
export const selectDashboardError = (state) => state.dashboard.error;
export const selectDashboardLastUpdated = (state) => state.dashboard.lastUpdated;

export default dashboardSlice.reducer;
