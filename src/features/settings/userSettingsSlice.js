import { createSlice } from "@reduxjs/toolkit";
import { Appearance } from 'react-native';

/** User Settings Data Store */
export const userSettingsSlice = createSlice({
    name: 'userSettings',
    initialState: {
      // Wallet/Balance visibility
      walletBalanceVisibility: true,
      wastecoinBalanceVisibility: true,
      
      // Appearance settings
      theme: 'light', // 'light' | 'dark' | 'auto'
      useSystemTheme: false,
      
      // Accessibility settings
      highContrast: false,
      reducedMotion: false,
      largeText: false,
      
      // Display preferences
      accentColor: '#5D7BF5', // Default app blue
      fontStyle: 'system', // 'system' | 'custom'
    },
    reducers: {
        updateWalletBalanceVisibility: (state, action) => {
            state.walletBalanceVisibility = action.payload
        },

        updateWastecoinBalanceVisibility: (state, action) => {
            state.wastecoinBalanceVisibility = action.payload            
        },
        
        // Theme settings
        setTheme: (state, action) => {
            state.theme = action.payload;
            if (action.payload !== 'auto') {
                state.useSystemTheme = false;
            }
        },
        
        setUseSystemTheme: (state, action) => {
            state.useSystemTheme = action.payload;
            if (action.payload) {
                state.theme = 'auto';
            }
        },
        
        // Accessibility settings
        setHighContrast: (state, action) => {
            state.highContrast = action.payload;
        },
        
        setReducedMotion: (state, action) => {
            state.reducedMotion = action.payload;
        },
        
        setLargeText: (state, action) => {
            state.largeText = action.payload;
        },
        
        // Display preferences
        setAccentColor: (state, action) => {
            state.accentColor = action.payload;
        },
        
        setFontStyle: (state, action) => {
            state.fontStyle = action.payload;
        },
        
        // Reset all settings
        resetSettings: (state) => {
            state.theme = 'light';
            state.useSystemTheme = false;
            state.highContrast = false;
            state.reducedMotion = false;
            state.largeText = false;
            state.accentColor = '#5D7BF5';
            state.fontStyle = 'system';
        },
    }
})

// Action creators are generated for each case function
export const { 
    updateWalletBalanceVisibility,
    updateWastecoinBalanceVisibility,
    setTheme,
    setUseSystemTheme,
    setHighContrast,
    setReducedMotion,
    setLargeText,
    setAccentColor,
    setFontStyle,
    resetSettings,
} = userSettingsSlice.actions

// Selectors
export const selectTheme = (state) => state.userSettings.theme;
export const selectUseSystemTheme = (state) => state.userSettings.useSystemTheme;
export const selectHighContrast = (state) => state.userSettings.highContrast;
export const selectReducedMotion = (state) => state.userSettings.reducedMotion;
export const selectLargeText = (state) => state.userSettings.largeText;
export const selectAccentColor = (state) => state.userSettings.accentColor;
export const selectFontStyle = (state) => state.userSettings.fontStyle;
export const selectAppearanceSettings = (state) => ({
    theme: state.userSettings.theme,
    useSystemTheme: state.userSettings.useSystemTheme,
    highContrast: state.userSettings.highContrast,
    reducedMotion: state.userSettings.reducedMotion,
    largeText: state.userSettings.largeText,
    accentColor: state.userSettings.accentColor,
    fontStyle: state.userSettings.fontStyle,
})

export default userSettingsSlice.reducer