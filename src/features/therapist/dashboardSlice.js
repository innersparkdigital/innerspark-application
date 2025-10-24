import { createSlice } from "@reduxjs/toolkit";

/**
 * Therapist Dashboard Data
 * Stores dashboard statistics and overview data
 */

export const dashboardSlice = createSlice({
    name: 'therapistDashboard',
    initialState: {
        stats: {
            appointments: {
                today: 0,
                thisWeek: 0,
                thisMonth: 0,
                upcoming: 0,
            },
            requests: {
                pending: 0,
                new: 0,
            },
            groups: {
                active: 0,
                totalMembers: 0,
                scheduled: 0,
            },
            messages: {
                unread: 0,
                total: 0,
            },
            clients: {
                total: 0,
                active: 0,
            },
            sessionsToday: 0,
        },
        loading: false,
        lastUpdated: null,
    },
    reducers: {
        updateDashboardStats: (state, action) => {
            state.stats = action.payload;
            state.lastUpdated = new Date().toISOString();
        },

        updateDashboardLoading: (state, action) => {
            state.loading = action.payload;
        },

        updateAppointmentStats: (state, action) => {
            state.stats.appointments = { ...state.stats.appointments, ...action.payload };
        },

        updateRequestStats: (state, action) => {
            state.stats.requests = { ...state.stats.requests, ...action.payload };
        },

        updateGroupStats: (state, action) => {
            state.stats.groups = { ...state.stats.groups, ...action.payload };
        },

        updateMessageStats: (state, action) => {
            state.stats.messages = { ...state.stats.messages, ...action.payload };
        },

        updateClientStats: (state, action) => {
            state.stats.clients = { ...state.stats.clients, ...action.payload };
        },
    }
});

// Action creators are generated for each case function
export const {
    updateDashboardStats,
    updateDashboardLoading,
    updateAppointmentStats,
    updateRequestStats,
    updateGroupStats,
    updateMessageStats,
    updateClientStats,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
