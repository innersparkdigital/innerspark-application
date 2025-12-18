/**
 * Goals Redux Slice
 * Manages goals data, filters, and loading states
 */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  goals: [],
  stats: {
    total: 0,
    active: 0,
    completed: 0,
    paused: 0,
  },
  filters: {
    status: 'all', // 'all' | 'active' | 'completed' | 'paused'
    category: '',
  },
  isLoading: false,
  isRefreshing: false,
  error: null,
  lastUpdated: null,
};

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    setGoals: (state, action) => {
      state.goals = action.payload.goals || [];
      state.stats = action.payload.stats || state.stats;
      state.lastUpdated = new Date().toISOString();
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
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
    updateGoalInList: (state, action) => {
      const { goalId, updates } = action.payload;
      const goalIndex = state.goals.findIndex(goal => goal.id === goalId);
      if (goalIndex !== -1) {
        state.goals[goalIndex] = { ...state.goals[goalIndex], ...updates };
      }
    },
    removeGoalFromList: (state, action) => {
      state.goals = state.goals.filter(goal => goal.id !== action.payload);
      // Update stats
      state.stats.total = Math.max(0, state.stats.total - 1);
    },
    addGoalToList: (state, action) => {
      state.goals.unshift(action.payload);
      // Update stats
      state.stats.total += 1;
      if (action.payload.status === 'active') state.stats.active += 1;
    },
    clearGoals: (state) => {
      return initialState;
    },
  },
});

export const {
  setGoals,
  setFilters,
  setLoading,
  setRefreshing,
  setError,
  clearError,
  updateGoalInList,
  removeGoalFromList,
  addGoalToList,
  clearGoals,
} = goalsSlice.actions;

// Selectors
export const selectGoals = (state) => state.goals.goals;
export const selectGoalsStats = (state) => state.goals.stats;
export const selectGoalsFilters = (state) => state.goals.filters;
export const selectGoalsLoading = (state) => state.goals.isLoading;
export const selectGoalsRefreshing = (state) => state.goals.isRefreshing;
export const selectGoalsError = (state) => state.goals.error;
export const selectGoalsLastUpdated = (state) => state.goals.lastUpdated;

// Filtered selectors
export const selectActiveGoals = (state) => 
  state.goals.goals.filter(goal => goal.status === 'active');

export const selectCompletedGoals = (state) => 
  state.goals.goals.filter(goal => goal.status === 'completed');

export const selectPausedGoals = (state) => 
  state.goals.goals.filter(goal => goal.status === 'paused');

export default goalsSlice.reducer;
