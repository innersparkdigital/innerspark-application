import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  registeredEventIds: [], // Array of event IDs user is registered for
  lastUpdated: null,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    // Set the full list of registered event IDs
    setRegisteredEventIds: (state, action) => {
      state.registeredEventIds = action.payload;
      state.lastUpdated = Date.now();
    },
    
    // Add a single event ID to registered list
    addRegisteredEventId: (state, action) => {
      const eventId = action.payload;
      if (!state.registeredEventIds.includes(eventId)) {
        state.registeredEventIds.push(eventId);
        state.lastUpdated = Date.now();
      }
    },
    
    // Remove a single event ID from registered list
    removeRegisteredEventId: (state, action) => {
      const eventId = action.payload;
      state.registeredEventIds = state.registeredEventIds.filter(id => id !== eventId);
      state.lastUpdated = Date.now();
    },
    
    // Clear all registered event IDs (e.g., on logout)
    clearRegisteredEventIds: (state) => {
      state.registeredEventIds = [];
      state.lastUpdated = null;
    },
  },
});

export const {
  setRegisteredEventIds,
  addRegisteredEventId,
  removeRegisteredEventId,
  clearRegisteredEventIds,
} = eventsSlice.actions;

// Selectors
export const selectRegisteredEventIds = (state) => state.events.registeredEventIds;
export const selectIsEventRegistered = (eventId) => (state) => 
  state.events.registeredEventIds.includes(eventId);

export default eventsSlice.reducer;
