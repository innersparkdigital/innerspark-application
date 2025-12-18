/**
 * Reports Redux Slice
 * Manages wellness reports data and loading states
 */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentReport: null,
  reportHistory: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
  lastUpdated: null,
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setCurrentReport: (state, action) => {
      state.currentReport = action.payload;
      state.lastUpdated = new Date().toISOString();
      state.error = null;
    },
    setReportHistory: (state, action) => {
      state.reportHistory = action.payload || [];
      state.error = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setRefreshing: (state, action) => {
      state.isRefreshing = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isRefreshing = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentReport: (state) => {
      state.currentReport = null;
    },
    clearReports: (state) => {
      return initialState;
    },
  },
});

export const {
  setCurrentReport,
  setReportHistory,
  setLoading,
  setRefreshing,
  setError,
  clearError,
  clearCurrentReport,
  clearReports,
} = reportsSlice.actions;

// Selectors
export const selectCurrentReport = (state) => state.reports.currentReport;
export const selectReportHistory = (state) => state.reports.reportHistory;
export const selectReportsLoading = (state) => state.reports.isLoading;
export const selectReportsRefreshing = (state) => state.reports.isRefreshing;
export const selectReportsError = (state) => state.reports.error;
export const selectReportsLastUpdated = (state) => state.reports.lastUpdated;

export default reportsSlice.reducer;
