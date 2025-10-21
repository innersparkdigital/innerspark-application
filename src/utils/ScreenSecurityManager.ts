/**
 * Screen Security Manager
 * Prevents screenshots and screen recording across the app
 * 
 * CONFIGURATION:
 * Set ENABLE_SCREEN_SECURITY to true/false to control the feature
 */

import { Platform } from 'react-native';

// ==========================================
// 🔒 SECURITY CONFIGURATION
// ==========================================
// Set to true to enable screenshot/recording prevention
// Set to false to allow screenshots (useful for development/testing)
export const ENABLE_SCREEN_SECURITY = true;

// Runtime toggle - can be changed without rebuilding
// Useful for temporary disable during development/testing
let isRuntimeEnabled = true;

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
 * Check if security is currently active (considers both config and runtime toggle)
 */
const isSecurityActive = (): boolean => {
  return ENABLE_SCREEN_SECURITY && isRuntimeEnabled;
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
  if (!ENABLE_SCREEN_SECURITY) {
    return 'Screen Security: DISABLED in config (screenshots allowed)';
  }
  if (!isRuntimeEnabled) {
    return 'Screen Security: TEMPORARILY DISABLED at runtime (screenshots allowed)';
  }
  return `Screen Security: ENABLED (screenshots blocked on ${Platform.OS})`;
};
