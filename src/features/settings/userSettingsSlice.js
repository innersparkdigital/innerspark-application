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
      accentColor: '#5D7BF5', // Default app blue
      fontStyle: 'system', // 'system' | 'custom'
      
      // Accessibility settings
      highContrast: false,
      reducedMotion: false,
      largeText: false,
      
      // Privacy settings
      allowMessages: true,
      dataSharing: false,
      profileVisibility: 'private', // 'private' | 'public'
      showOnlineStatus: true,
      shareProgress: false,
      allowGroupInvites: true,
      shareContactInfo: false,
      
      // Notification settings
      appointmentReminders: true,
      emailNotifications: true,
      eventUpdates: true,
      goalReminders: true,
      pushNotifications: true,
      smsNotifications: false,
      weeklyReports: true,
      messages: true,
      securityAlerts: true,
      systemUpdates: false,
      
      // General app settings (from SettingsScreen)
      notificationsEnabled: true,
      biometricEnabled: false,
      locationEnabled: true,
      analyticsEnabled: true,
      appLanguage: 'en', // 'en' | 'lg' | 'sw'
      
      // Mood reminder settings
      moodReminderEnabled: true,
      moodReminderTime: '8:00 PM',
      moodReminderDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      moodReminderFrequency: 'once', // 'once' | 'twice' | 'thrice'
      moodReminderSound: true,
      moodReminderVibration: true,
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
        
        // Privacy settings
        setPrivacySettings: (state, action) => {
            const { allowMessages, dataSharing, profileVisibility, showOnlineStatus } = action.payload;
            if (allowMessages !== undefined) state.allowMessages = allowMessages;
            if (dataSharing !== undefined) state.dataSharing = dataSharing;
            if (profileVisibility !== undefined) state.profileVisibility = profileVisibility;
            if (showOnlineStatus !== undefined) state.showOnlineStatus = showOnlineStatus;
        },
        
        updatePrivacySetting: (state, action) => {
            const { key, value } = action.payload;
            state[key] = value;
        },
        
        // Notification settings
        setNotificationSettings: (state, action) => {
            const { appointmentReminders, emailNotifications, eventUpdates, goalReminders, pushNotifications, smsNotifications } = action.payload;
            if (appointmentReminders !== undefined) state.appointmentReminders = appointmentReminders;
            if (emailNotifications !== undefined) state.emailNotifications = emailNotifications;
            if (eventUpdates !== undefined) state.eventUpdates = eventUpdates;
            if (goalReminders !== undefined) state.goalReminders = goalReminders;
            if (pushNotifications !== undefined) state.pushNotifications = pushNotifications;
            if (smsNotifications !== undefined) state.smsNotifications = smsNotifications;
        },
        
        updateNotificationSetting: (state, action) => {
            const { key, value } = action.payload;
            state[key] = value;
        },
        
        // Appearance settings (full update)
        setAppearanceSettings: (state, action) => {
            const { theme, useSystemTheme, accentColor, fontStyle, highContrast, reducedMotion, largeText } = action.payload;
            if (theme !== undefined) state.theme = theme;
            if (useSystemTheme !== undefined) state.useSystemTheme = useSystemTheme;
            if (accentColor !== undefined) state.accentColor = accentColor;
            if (fontStyle !== undefined) state.fontStyle = fontStyle;
            if (highContrast !== undefined) state.highContrast = highContrast;
            if (reducedMotion !== undefined) state.reducedMotion = reducedMotion;
            if (largeText !== undefined) state.largeText = largeText;
        },
        
        // General app settings actions
        updateGeneralSetting: (state, action) => {
            const { key, value } = action.payload;
            state[key] = value;
        },
        
        // Mood reminder settings actions
        setMoodReminderSettings: (state, action) => {
            const { enabled, time, days, frequency, sound, vibration } = action.payload;
            if (enabled !== undefined) state.moodReminderEnabled = enabled;
            if (time !== undefined) state.moodReminderTime = time;
            if (days !== undefined) state.moodReminderDays = days;
            if (frequency !== undefined) state.moodReminderFrequency = frequency;
            if (sound !== undefined) state.moodReminderSound = sound;
            if (vibration !== undefined) state.moodReminderVibration = vibration;
        },
        
        updateMoodReminderSetting: (state, action) => {
            const { key, value } = action.payload;
            state[key] = value;
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
            state.allowMessages = true;
            state.dataSharing = false;
            state.profileVisibility = 'private';
            state.showOnlineStatus = true;
            state.appointmentReminders = true;
            state.emailNotifications = true;
            state.eventUpdates = true;
            state.goalReminders = true;
            state.pushNotifications = true;
            state.smsNotifications = false;
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
    setPrivacySettings,
    updatePrivacySetting,
    setNotificationSettings,
    updateNotificationSetting,
    setAppearanceSettings,
    updateGeneralSetting,
    setMoodReminderSettings,
    updateMoodReminderSetting,
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
});

export const selectPrivacySettings = (state) => ({
    allowMessages: state.userSettings.allowMessages,
    dataSharing: state.userSettings.dataSharing,
    profileVisibility: state.userSettings.profileVisibility,
    showOnlineStatus: state.userSettings.showOnlineStatus,
    shareProgress: state.userSettings.shareProgress,
    allowGroupInvites: state.userSettings.allowGroupInvites,
    shareContactInfo: state.userSettings.shareContactInfo,
});

export const selectNotificationSettings = (state) => ({
    appointmentReminders: state.userSettings.appointmentReminders,
    emailNotifications: state.userSettings.emailNotifications,
    eventUpdates: state.userSettings.eventUpdates,
    goalReminders: state.userSettings.goalReminders,
    pushNotifications: state.userSettings.pushNotifications,
    smsNotifications: state.userSettings.smsNotifications,
    weeklyReports: state.userSettings.weeklyReports,
    messages: state.userSettings.messages,
    securityAlerts: state.userSettings.securityAlerts,
    systemUpdates: state.userSettings.systemUpdates,
});

export const selectGeneralSettings = (state) => ({
    notificationsEnabled: state.userSettings.notificationsEnabled,
    biometricEnabled: state.userSettings.biometricEnabled,
    locationEnabled: state.userSettings.locationEnabled,
    analyticsEnabled: state.userSettings.analyticsEnabled,
    appLanguage: state.userSettings.appLanguage,
});

export const selectMoodReminderSettings = (state) => ({
    moodReminderEnabled: state.userSettings.moodReminderEnabled,
    moodReminderTime: state.userSettings.moodReminderTime,
    moodReminderDays: state.userSettings.moodReminderDays,
    moodReminderFrequency: state.userSettings.moodReminderFrequency,
    moodReminderSound: state.userSettings.moodReminderSound,
    moodReminderVibration: state.userSettings.moodReminderVibration,
});

export default userSettingsSlice.reducer