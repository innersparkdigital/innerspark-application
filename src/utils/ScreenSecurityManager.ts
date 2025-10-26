/**
 * Screen Security Manager - Flexible Configuration
 * Prevents screenshots and screen recording with three control levels:
 * 
 * 1. APP_WIDE: Enable security across entire app
 * 2. SELECTIVE: Enable only on specific screens (whitelist)
 * 3. DISABLED: Allow screenshots everywhere (development/testing)
 */

import { Platform } from 'react-native';

// ==========================================
// 🔒 SECURITY CONFIGURATION
// ==========================================

/**
 * Security Mode Options:
 * - 'APP_WIDE': Enable security on all screens (default for production)
 * - 'SELECTIVE': Enable only on specified screens (see SECURE_SCREENS list)
 * - 'DISABLED': Disable security completely (for development/testing)
 */
export type SecurityMode = 'APP_WIDE' | 'SELECTIVE' | 'DISABLED';

/**
 * Current security mode
 * Change this to control security behavior
 */
export let SECURITY_MODE: SecurityMode = 'DISABLED';

/**
 * List of screens that should have security enabled in SELECTIVE mode
 * Add screen names that contain sensitive information
 */
export const SECURE_SCREENS = [
  // Client sensitive screens
  'JournalScreen',
  'JournalEntryScreen',
  'MoodTrackerScreen',
  'DMThreadScreen',
  'ChatScreen',
  'ProfileScreen',
  'AccountSettingsScreen',
  'PrivacySettingsScreen',
  'WellnessVaultScreen',
  'TransactionHistoryScreen',
  'EmergencyScreen',
  'SafetyPlanScreen',
  
  // Therapist sensitive screens
  'THChatConversationScreen',
  'THClientNotesScreen',
  'THClientDetailsScreen',
  'THAccountScreen',
  
  // Add more screens as needed
];

/**
 * Runtime toggle - can be changed without rebuilding
 * Useful for temporary disable during development/testing/demos
 */
let isRuntimeEnabled = true;

/**
 * Current screen name (set by useScreenSecurity hook)
 */
let currentScreen: string | null = null;

/**
 * Set current screen name (called by navigation)
 */
export const setCurrentScreen = (screenName: string | null) => {
  currentScreen = screenName;
  console.log(`[ScreenSecurity] Current screen: ${screenName}`);
};

/**
 * Temporarily disable security at runtime (no rebuild needed)
 * Useful for: debugging, taking screenshots, demos
 */
export const temporarilyDisableSecurity = () => {
  isRuntimeEnabled = false;
  console.log('[ScreenSecurity] ⚠️ Temporarily DISABLED at runtime');
};

/**
 * Re-enable security at runtime
 */
export const temporarilyEnableSecurity = () => {
  isRuntimeEnabled = true;
  console.log('[ScreenSecurity] ✅ Re-ENABLED at runtime');
};

/**
 * Check if security should be active based on mode and current screen
 */
const isSecurityActive = (): boolean => {
  // Runtime toggle overrides everything
  if (!isRuntimeEnabled) {
    return false;
  }

  // Check security mode
  switch (SECURITY_MODE) {
    case 'DISABLED':
      return false;
    
    case 'APP_WIDE':
      return true;
    
    case 'SELECTIVE':
      // Only enable if current screen is in the secure list
      if (!currentScreen) {
        return false;
      }
      return SECURE_SCREENS.includes(currentScreen);
    
    default:
      return false;
  }
};

// ==========================================
// Platform-specific implementations
// ==========================================

/**
 * Enable screen security (prevent screenshots and recording)
 * Call this when app starts or when entering secure screens
 */
export const enableScreenSecurity = async (): Promise<void> => {
  if (!isSecurityActive()) {
    console.log('[ScreenSecurity] Security disabled in config or runtime');
    return;
  }

  try {
    if (Platform.OS === 'android') {
      // Android: Use native module to set FLAG_SECURE
      const { NativeModules } = require('react-native');
      
      if (NativeModules.ScreenSecurityModule) {
        await NativeModules.ScreenSecurityModule.enableSecureScreen();
        console.log('[ScreenSecurity] Android secure screen enabled');
      } else {
        console.warn('[ScreenSecurity] Android native module not found. See setup instructions.');
      }
    } else if (Platform.OS === 'ios') {
      // iOS: Use native module to detect and blur on screenshot/recording
      const { NativeModules } = require('react-native');
      
      if (NativeModules.ScreenSecurityModule) {
        await NativeModules.ScreenSecurityModule.enableSecureScreen();
        console.log('[ScreenSecurity] iOS secure screen enabled');
      } else {
        console.warn('[ScreenSecurity] iOS native module not found. See setup instructions.');
      }
    }
  } catch (error) {
    console.error('[ScreenSecurity] Failed to enable screen security:', error);
  }
};

/**
 * Disable screen security (allow screenshots and recording)
 * Call this when leaving secure screens or for testing
 */
export const disableScreenSecurity = async (): Promise<void> => {
  if (!isSecurityActive()) {
    return;
  }

  try {
    if (Platform.OS === 'android') {
      const { NativeModules } = require('react-native');
      
      if (NativeModules.ScreenSecurityModule) {
        await NativeModules.ScreenSecurityModule.disableSecureScreen();
        console.log('[ScreenSecurity] Android secure screen disabled');
      }
    } else if (Platform.OS === 'ios') {
      const { NativeModules } = require('react-native');
      
      if (NativeModules.ScreenSecurityModule) {
        await NativeModules.ScreenSecurityModule.disableSecureScreen();
        console.log('[ScreenSecurity] iOS secure screen disabled');
      }
    }
  } catch (error) {
    console.error('[ScreenSecurity] Failed to disable screen security:', error);
  }
};

/**
 * Check if screen security is currently enabled
 * (considers both config and runtime toggle)
 */
export const isScreenSecurityEnabled = (): boolean => {
  return isSecurityActive();
};

/**
 * Get security status message for debugging
 */
export const getSecurityStatus = (): string => {
  if (!isRuntimeEnabled) {
    return '⚠️ Screen Security: TEMPORARILY DISABLED at runtime (screenshots allowed)';
  }

  switch (SECURITY_MODE) {
    case 'DISABLED':
      return '❌ Screen Security: DISABLED (screenshots allowed everywhere)';
    
    case 'APP_WIDE':
      return `✅ Screen Security: APP_WIDE (screenshots blocked on ${Platform.OS})`;
    
    case 'SELECTIVE':
      const isCurrentSecure = currentScreen && SECURE_SCREENS.includes(currentScreen);
      return `🔒 Screen Security: SELECTIVE (${SECURE_SCREENS.length} secure screens) - Current: ${currentScreen || 'unknown'} ${isCurrentSecure ? '✅ SECURED' : '⚠️ NOT SECURED'}`;
    
    default:
      return '❓ Screen Security: UNKNOWN MODE';
  }
};

/**
 * Get list of secure screens (for debugging)
 */
export const getSecureScreensList = (): string[] => {
  return [...SECURE_SCREENS];
};

/**
 * Check if a specific screen is secured
 */
export const isScreenSecured = (screenName: string): boolean => {
  if (SECURITY_MODE === 'DISABLED' || !isRuntimeEnabled) {
    return false;
  }
  if (SECURITY_MODE === 'APP_WIDE') {
    return true;
  }
  return SECURE_SCREENS.includes(screenName);
};
