/**
 * Mood Slice - Redux state management for mood tracking
 * Manages check-in status, mood data, streaks, and milestone rewards
 * MVP: Points deferred until milestones (7, 14, 30 days)
 */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Today's check-in status
  hasCheckedInToday: false,
  todayMoodData: null, // { id, mood, emoji, moodValue, note, pointsEarned, timestamp, date }
  
  // User mood stats
  currentStreak: 0,
  totalPoints: 0,
  totalCheckIns: 0,
  
  // Mood history
  moodHistory: [], // Array of mood entries
  
  // Loading states
  isLoading: false,
  isSubmitting: false,
  error: null,
  
  // Last updated timestamp
  lastUpdated: null,
};

const moodSlice = createSlice({
  name: 'mood',
  initialState,
  reducers: {
    // Set today's check-in status
    setTodayCheckIn: (state, action) => {
      state.hasCheckedInToday = true;
      state.todayMoodData = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    
    // Clear today's check-in (for testing or new day)
    clearTodayCheckIn: (state) => {
      state.hasCheckedInToday = false;
      state.todayMoodData = null;
    },
    
    // Update mood stats
    setMoodStats: (state, action) => {
      const { currentStreak, totalPoints, totalCheckIns } = action.payload;
      state.currentStreak = currentStreak || state.currentStreak;
      state.totalPoints = totalPoints || state.totalPoints;
      state.totalCheckIns = totalCheckIns || state.totalCheckIns;
    },
    
    // Add points after check-in (MVP: Called only at milestones)
    addPoints: (state, action) => {
      state.totalPoints += action.payload;
    },
    
    // Increment streak
    incrementStreak: (state) => {
      state.currentStreak += 1;
    },
    
    // Set mood history
    setMoodHistory: (state, action) => {
      state.moodHistory = action.payload;
    },
    
    // Add new mood entry to history
    addMoodEntry: (state, action) => {
      state.moodHistory.unshift(action.payload);
      state.totalCheckIns += 1;
    },
    
    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    // Set submitting state
    setSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
    
    // Set error
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isSubmitting = false;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Reset mood state (for logout)
    resetMoodState: () => initialState,
  },
});

// Export actions
export const {
  setTodayCheckIn,
  clearTodayCheckIn,
  setMoodStats,
  addPoints,
  incrementStreak,
  setMoodHistory,
  addMoodEntry,
  setLoading,
  setSubmitting,
  setError,
  clearError,
  resetMoodState,
} = moodSlice.actions;

// Selectors
export const selectHasCheckedInToday = (state) => state.mood.hasCheckedInToday;
export const selectTodayMoodData = (state) => state.mood.todayMoodData;
export const selectMoodStats = (state) => ({
  currentStreak: state.mood.currentStreak,
  totalPoints: state.mood.totalPoints,
  totalCheckIns: state.mood.totalCheckIns,
});
export const selectMoodHistory = (state) => state.mood.moodHistory;
export const selectMoodLoading = (state) => state.mood.isLoading;
export const selectMoodSubmitting = (state) => state.mood.isSubmitting;
export const selectMoodError = (state) => state.mood.error;

// Export reducer
export default moodSlice.reducer;
