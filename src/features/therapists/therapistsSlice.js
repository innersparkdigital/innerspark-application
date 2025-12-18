/**
 * Therapists Redux Slice
 * Manages therapist data, filters, and loading states
 */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  therapists: [],
  selectedTherapist: null,
  filters: {
    specialty: null,
    location: null,
    availability: null,
  },
  searchQuery: '',
  isLoading: false,
  isRefreshing: false,
  error: null,
  lastUpdated: null,
};

const therapistsSlice = createSlice({
  name: 'therapists',
  initialState,
  reducers: {
    setTherapists: (state, action) => {
      state.therapists = action.payload;
      state.lastUpdated = new Date().toISOString();
      state.error = null;
    },
    setSelectedTherapist: (state, action) => {
      state.selectedTherapist = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
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
    clearFilters: (state) => {
      state.filters = {
        specialty: null,
        location: null,
        availability: null,
      };
    },
    clearTherapists: (state) => {
      return initialState;
    },
  },
});

export const {
  setTherapists,
  setSelectedTherapist,
  setFilters,
  setSearchQuery,
  setLoading,
  setRefreshing,
  setError,
  clearError,
  clearFilters,
  clearTherapists,
} = therapistsSlice.actions;

// Selectors
export const selectTherapists = (state) => state.therapists.therapists;
export const selectSelectedTherapist = (state) => state.therapists.selectedTherapist;
export const selectFilters = (state) => state.therapists.filters;
export const selectSearchQuery = (state) => state.therapists.searchQuery;
export const selectTherapistsLoading = (state) => state.therapists.isLoading;
export const selectTherapistsRefreshing = (state) => state.therapists.isRefreshing;
export const selectTherapistsError = (state) => state.therapists.error;
export const selectTherapistsLastUpdated = (state) => state.therapists.lastUpdated;

export default therapistsSlice.reducer;
