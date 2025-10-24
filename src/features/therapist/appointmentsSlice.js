import { createSlice } from "@reduxjs/toolkit";

/**
 * Therapist Appointments Data
 * Stores appointments list and related data
 */

export const appointmentsSlice = createSlice({
    name: 'therapistAppointments',
    initialState: {
        appointments: [],
        selectedAppointment: null,
        filters: {
            status: 'all',
            date: null,
        },
        stats: {
            today: 0,
            thisWeek: 0,
            thisMonth: 0,
        },
        loading: false,
    },
    reducers: {
        updateAppointments: (state, action) => {
            state.appointments = action.payload;
        },

        addAppointment: (state, action) => {
            state.appointments.unshift(action.payload);
        },

        updateAppointment: (state, action) => {
            const index = state.appointments.findIndex(apt => apt.id === action.payload.id);
            if (index !== -1) {
                state.appointments[index] = { ...state.appointments[index], ...action.payload };
            }
        },

        removeAppointment: (state, action) => {
            state.appointments = state.appointments.filter(apt => apt.id !== action.payload);
        },

        setSelectedAppointment: (state, action) => {
            state.selectedAppointment = action.payload;
        },

        setAppointmentFilter: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },

        updateAppointmentStats: (state, action) => {
            state.stats = { ...state.stats, ...action.payload };
        },

        setAppointmentsLoading: (state, action) => {
            state.loading = action.payload;
        },
    }
});

// Action creators are generated for each case function
export const {
    updateAppointments,
    addAppointment,
    updateAppointment,
    removeAppointment,
    setSelectedAppointment,
    setAppointmentFilter,
    updateAppointmentStats,
    setAppointmentsLoading,
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;
