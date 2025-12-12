/**
 * Emergency Slice - Redux state management for emergency contacts and safety plans
 * Manages emergency contacts, crisis lines, and safety plan data
 */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Emergency contacts (max 3)
  emergencyContacts: [],
  
  // Crisis hotlines
  crisisLines: [],
  
  // Safety plan
  safetyPlan: {
    warningSignsPersonal: [],
    warningSignsCrisis: [],
    copingStrategies: [],
    socialContacts: [],
    professionalContacts: [],
    environmentSafety: [],
    reasonsToLive: [],
    emergencyContacts: [],
    lastUpdated: null,
  },
  
  // Last updated
  lastUpdated: null,
};

const emergencySlice = createSlice({
  name: 'emergency',
  initialState,
  reducers: {
    setEmergencyContacts: (state, action) => {
      state.emergencyContacts = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    
    addEmergencyContact: (state, action) => {
      if (state.emergencyContacts.length < 3) {
        state.emergencyContacts.push(action.payload);
        state.lastUpdated = new Date().toISOString();
      }
    },
    
    updateEmergencyContact: (state, action) => {
      const index = state.emergencyContacts.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.emergencyContacts[index] = action.payload;
        state.lastUpdated = new Date().toISOString();
      }
    },
    
    deleteEmergencyContact: (state, action) => {
      state.emergencyContacts = state.emergencyContacts.filter(c => c.id !== action.payload);
      state.lastUpdated = new Date().toISOString();
    },
    
    setPrimaryContact: (state, action) => {
      state.emergencyContacts = state.emergencyContacts.map(contact => ({
        ...contact,
        isPrimary: contact.id === action.payload,
      }));
      state.lastUpdated = new Date().toISOString();
    },
    
    setCrisisLines: (state, action) => {
      state.crisisLines = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    
    setSafetyPlan: (state, action) => {
      state.safetyPlan = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    
    updateSafetyPlanSection: (state, action) => {
      const { section, data } = action.payload;
      if (state.safetyPlan[section] !== undefined) {
        state.safetyPlan[section] = data;
        state.safetyPlan.lastUpdated = new Date().toISOString();
        state.lastUpdated = new Date().toISOString();
      }
    },
    
    resetEmergencyState: () => initialState,
  },
});

export const {
  setEmergencyContacts,
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
  setPrimaryContact,
  setCrisisLines,
  setSafetyPlan,
  updateSafetyPlanSection,
  resetEmergencyState,
} = emergencySlice.actions;

export default emergencySlice.reducer;
