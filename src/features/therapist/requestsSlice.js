import { createSlice } from "@reduxjs/toolkit";

/**
 * Therapist Requests Data
 * Stores client requests (Uber-style request system)
 */

export const requestsSlice = createSlice({
    name: 'therapistRequests',
    initialState: {
        requests: [],
        pendingCount: 0,
        filters: {
            status: 'pending',
            urgency: 'all',
        },
        loading: false,
    },
    reducers: {
        updateRequests: (state, action) => {
            state.requests = action.payload;
            state.pendingCount = action.payload.filter(r => r.status === 'pending').length;
        },

        addRequest: (state, action) => {
            state.requests.unshift(action.payload);
            if (action.payload.status === 'pending') {
                state.pendingCount += 1;
            }
        },

        removeRequest: (state, action) => {
            const request = state.requests.find(r => r.id === action.payload);
            if (request && request.status === 'pending') {
                state.pendingCount = Math.max(0, state.pendingCount - 1);
            }
            state.requests = state.requests.filter(r => r.id !== action.payload);
        },

        updateRequestStatus: (state, action) => {
            const { requestId, status } = action.payload;
            const index = state.requests.findIndex(r => r.id === requestId);
            if (index !== -1) {
                const oldStatus = state.requests[index].status;
                state.requests[index].status = status;
                
                // Update pending count
                if (oldStatus === 'pending' && status !== 'pending') {
                    state.pendingCount = Math.max(0, state.pendingCount - 1);
                } else if (oldStatus !== 'pending' && status === 'pending') {
                    state.pendingCount += 1;
                }
            }
        },

        setRequestFilter: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },

        updatePendingCount: (state, action) => {
            state.pendingCount = action.payload;
        },

        setRequestsLoading: (state, action) => {
            state.loading = action.payload;
        },
    }
});

// Action creators are generated for each case function
export const {
    updateRequests,
    addRequest,
    removeRequest,
    updateRequestStatus,
    setRequestFilter,
    updatePendingCount,
    setRequestsLoading,
} = requestsSlice.actions;

export default requestsSlice.reducer;
