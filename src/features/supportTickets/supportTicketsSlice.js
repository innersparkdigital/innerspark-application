/**
 * Support Tickets Redux Slice
 * Manages support tickets state, loading, and error handling
 */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tickets: [],
  currentTicket: null,
  isLoading: false,
  isRefreshing: false,
  isSubmitting: false,
  error: null,
  lastUpdated: null,
  filters: {
    status: 'all', // 'all', 'open', 'pending', 'resolved'
    category: 'all',
  },
};

const supportTicketsSlice = createSlice({
  name: 'supportTickets',
  initialState,
  reducers: {
    // Set all tickets
    setTickets: (state, action) => {
      state.tickets = action.payload || [];
      state.lastUpdated = new Date().toISOString();
      state.error = null;
    },
    
    // Set current ticket (for detail view)
    setCurrentTicket: (state, action) => {
      state.currentTicket = action.payload;
      state.error = null;
    },
    
    // Add a new ticket
    addTicket: (state, action) => {
      state.tickets.unshift(action.payload);
      state.lastUpdated = new Date().toISOString();
    },
    
    // Update an existing ticket
    updateTicket: (state, action) => {
      const index = state.tickets.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tickets[index] = { ...state.tickets[index], ...action.payload };
      }
      // Also update current ticket if it's the same
      if (state.currentTicket?.id === action.payload.id) {
        state.currentTicket = { ...state.currentTicket, ...action.payload };
      }
      state.lastUpdated = new Date().toISOString();
    },
    
    // Add message to ticket
    addMessageToTicket: (state, action) => {
      const { ticketId, message } = action.payload;
      const ticket = state.tickets.find(t => t.id === ticketId);
      if (ticket) {
        ticket.messages = ticket.messages || [];
        ticket.messages.push(message);
        ticket.responseCount = (ticket.responseCount || 0) + 1;
        ticket.updatedAt = new Date().toISOString();
        ticket.lastResponse = message.message;
      }
      // Also update current ticket if it's the same
      if (state.currentTicket?.id === ticketId) {
        state.currentTicket.messages = state.currentTicket.messages || [];
        state.currentTicket.messages.push(message);
        state.currentTicket.responseCount = (state.currentTicket.responseCount || 0) + 1;
        state.currentTicket.updatedAt = new Date().toISOString();
      }
    },
    
    // Mark ticket as read
    markTicketAsRead: (state, action) => {
      const ticket = state.tickets.find(t => t.id === action.payload);
      if (ticket) {
        ticket.isUnread = false;
      }
      if (state.currentTicket?.id === action.payload) {
        state.currentTicket.isUnread = false;
      }
    },
    
    // Set filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    // Loading states
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    setRefreshing: (state, action) => {
      state.isRefreshing = action.payload;
    },
    
    setSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
    
    // Error handling
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isRefreshing = false;
      state.isSubmitting = false;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear all tickets
    clearTickets: (state) => {
      return initialState;
    },
  },
});

export const {
  setTickets,
  setCurrentTicket,
  addTicket,
  updateTicket,
  addMessageToTicket,
  markTicketAsRead,
  setFilters,
  setLoading,
  setRefreshing,
  setSubmitting,
  setError,
  clearError,
  clearTickets,
} = supportTicketsSlice.actions;

// Selectors
export const selectTickets = (state) => state.supportTickets.tickets;
export const selectCurrentTicket = (state) => state.supportTickets.currentTicket;
export const selectTicketsLoading = (state) => state.supportTickets.isLoading;
export const selectTicketsRefreshing = (state) => state.supportTickets.isRefreshing;
export const selectTicketsSubmitting = (state) => state.supportTickets.isSubmitting;
export const selectTicketsError = (state) => state.supportTickets.error;
export const selectTicketsFilters = (state) => state.supportTickets.filters;
export const selectTicketsLastUpdated = (state) => state.supportTickets.lastUpdated;

// Filtered tickets selector
export const selectFilteredTickets = (state) => {
  const { tickets, filters } = state.supportTickets;
  let filtered = [...tickets];
  
  // Filter by status
  if (filters.status !== 'all') {
    filtered = filtered.filter(t => t.status.toLowerCase() === filters.status.toLowerCase());
  }
  
  // Filter by category
  if (filters.category !== 'all') {
    filtered = filtered.filter(t => t.category === filters.category);
  }
  
  return filtered;
};

export default supportTicketsSlice.reducer;
