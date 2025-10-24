import { createSlice } from "@reduxjs/toolkit";

/**
 * Therapist Analytics Data
 * Stores analytics, revenue, and performance metrics
 */

export const analyticsSlice = createSlice({
    name: 'therapistAnalytics',
    initialState: {
        overview: {
            sessions: {
                total: 0,
                completed: 0,
                cancelled: 0,
                trend: '0%',
            },
            clients: {
                total: 0,
                new: 0,
                active: 0,
                trend: '0%',
            },
            revenue: {
                total: 0,
                currency: 'UGX',
                trend: '0%',
            },
            rating: {
                average: 0,
                totalReviews: 0,
            },
        },
        sessionAnalytics: {
            sessionsByType: [],
            sessionsByDay: [],
            completionRate: 0,
        },
        revenueAnalytics: {
            totalRevenue: 0,
            revenueByMonth: [],
            revenueByType: [],
            pendingPayments: 0,
        },
        period: 'month',
        loading: false,
    },
    reducers: {
        updateAnalyticsOverview: (state, action) => {
            state.overview = { ...state.overview, ...action.payload };
        },

        updateSessionAnalytics: (state, action) => {
            state.sessionAnalytics = { ...state.sessionAnalytics, ...action.payload };
        },

        updateRevenueAnalytics: (state, action) => {
            state.revenueAnalytics = { ...state.revenueAnalytics, ...action.payload };
        },

        setAnalyticsPeriod: (state, action) => {
            state.period = action.payload;
        },

        updateSessionStats: (state, action) => {
            state.overview.sessions = { ...state.overview.sessions, ...action.payload };
        },

        updateClientStats: (state, action) => {
            state.overview.clients = { ...state.overview.clients, ...action.payload };
        },

        updateRevenueStats: (state, action) => {
            state.overview.revenue = { ...state.overview.revenue, ...action.payload };
        },

        updateRatingStats: (state, action) => {
            state.overview.rating = { ...state.overview.rating, ...action.payload };
        },

        setAnalyticsLoading: (state, action) => {
            state.loading = action.payload;
        },
    }
});

// Action creators are generated for each case function
export const {
    updateAnalyticsOverview,
    updateSessionAnalytics,
    updateRevenueAnalytics,
    setAnalyticsPeriod,
    updateSessionStats,
    updateClientStats,
    updateRevenueStats,
    updateRatingStats,
    setAnalyticsLoading,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
