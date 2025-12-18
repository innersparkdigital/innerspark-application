/**
 * Appointments Redux Slice
 * Manages appointment data, filters, and loading states
 */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appointments: [],
  selectedAppointment: null,
  filters: {
    status: 'upcoming', // 'upcoming' | 'completed' | 'cancelled'
  },
  isLoading: false,
  isRefreshing: false,
  error: null,
  lastUpdated: null,
};

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setAppointments: (state, action) => {
      state.appointments = action.payload;
      state.lastUpdated = new Date().toISOString();
      state.error = null;
    },
    setSelectedAppointment: (state, action) => {
      state.selectedAppointment = action.payload;
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
    updateAppointmentStatus: (state, action) => {
      const { appointmentId, status } = action.payload;
      const appointment = state.appointments.find(apt => apt.id === appointmentId);
      if (appointment) {
        appointment.status = status;
      }
    },
    removeAppointment: (state, action) => {
      state.appointments = state.appointments.filter(apt => apt.id !== action.payload);
    },
    clearAppointments: (state) => {
      return initialState;
    },
  },
});

export const {
  setAppointments,
  setSelectedAppointment,
  setFilters,
  setLoading,
  setRefreshing,
  setError,
  clearError,
  updateAppointmentStatus,
  removeAppointment,
  clearAppointments,
} = appointmentsSlice.actions;

// Selectors
export const selectAppointments = (state) => state.appointments.appointments;
export const selectSelectedAppointment = (state) => state.appointments.selectedAppointment;
export const selectFilters = (state) => state.appointments.filters;
export const selectAppointmentsLoading = (state) => state.appointments.isLoading;
export const selectAppointmentsRefreshing = (state) => state.appointments.isRefreshing;
export const selectAppointmentsError = (state) => state.appointments.error;
export const selectAppointmentsLastUpdated = (state) => state.appointments.lastUpdated;

// Filtered selectors
export const selectUpcomingAppointments = (state) => 
  state.appointments.appointments.filter(apt => apt.status === 'upcoming');

export const selectPastAppointments = (state) => 
  state.appointments.appointments.filter(apt => apt.status === 'completed' || apt.status === 'cancelled');

export const selectPendingAppointments = (state) => 
  state.appointments.appointments.filter(apt => apt.paymentStatus === 'pending');

export default appointmentsSlice.reducer;
