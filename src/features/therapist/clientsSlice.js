import { createSlice } from "@reduxjs/toolkit";

/**
 * Therapist Clients Data
 * Stores client list, notes, and related data
 */

export const clientsSlice = createSlice({
    name: 'therapistClients',
    initialState: {
        clients: [],
        selectedClient: null,
        clientNotes: {}, // { clientId: [notes] }
        searchQuery: '',
        filters: {
            status: 'active',
        },
        loading: false,
    },
    reducers: {
        updateClients: (state, action) => {
            state.clients = action.payload;
        },

        addClient: (state, action) => {
            state.clients.unshift(action.payload);
        },

        updateClient: (state, action) => {
            const index = state.clients.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.clients[index] = { ...state.clients[index], ...action.payload };
            }
        },

        setSelectedClient: (state, action) => {
            state.selectedClient = action.payload;
        },

        setClientSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },

        setClientFilter: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },

        updateClientNotes: (state, action) => {
            const { clientId, notes } = action.payload;
            state.clientNotes[clientId] = notes;
        },

        addClientNote: (state, action) => {
            const { clientId, note } = action.payload;
            if (!state.clientNotes[clientId]) {
                state.clientNotes[clientId] = [];
            }
            state.clientNotes[clientId].unshift(note);
        },

        updateClientNote: (state, action) => {
            const { clientId, noteId, data } = action.payload;
            if (state.clientNotes[clientId]) {
                const index = state.clientNotes[clientId].findIndex(n => n.id === noteId);
                if (index !== -1) {
                    state.clientNotes[clientId][index] = { ...state.clientNotes[clientId][index], ...data };
                }
            }
        },

        removeClientNote: (state, action) => {
            const { clientId, noteId } = action.payload;
            if (state.clientNotes[clientId]) {
                state.clientNotes[clientId] = state.clientNotes[clientId].filter(n => n.id !== noteId);
            }
        },

        setClientsLoading: (state, action) => {
            state.loading = action.payload;
        },
    }
});

// Action creators are generated for each case function
export const {
    updateClients,
    addClient,
    updateClient,
    setSelectedClient,
    setClientSearchQuery,
    setClientFilter,
    updateClientNotes,
    addClientNote,
    updateClientNote,
    removeClientNote,
    setClientsLoading,
} = clientsSlice.actions;

export default clientsSlice.reducer;
