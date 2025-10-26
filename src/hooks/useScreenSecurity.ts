/**
 * useScreenSecurity Hook
 * Automatically enables/disables screen security based on current screen
 * 
 * Usage in any screen:
 * ```typescript
 * import { useScreenSecurity } from '../hooks/useScreenSecurity';
 * 
 * const MyScreen = () => {
 *   useScreenSecurity('MyScreen'); // Pass screen name
 *   
 *   return (
 *     // Your screen content
 *   );
 * };
 * ```
 */

import { useEffect } from 'react';
import {
  setCurrentScreen,
  enableScreenSecurity,
  disableScreenSecurity,
  isScreenSecured,
  SECURITY_MODE,
} from '../utils/ScreenSecurityManager';

/**
 * Hook to manage screen security for a specific screen
 * @param screenName - Name of the current screen
 */
export const useScreenSecurity = (screenName: string) => {
  useEffect(() => {
    // Set current screen
    setCurrentScreen(screenName);

    // Check if this screen should be secured
    const shouldSecure = isScreenSecured(screenName);

    if (shouldSecure) {
      console.log(`[ScreenSecurity] Enabling security for: ${screenName}`);
      enableScreenSecurity();
    } else {
      console.log(`[ScreenSecurity] Security not required for: ${screenName}`);
      // Only disable if in SELECTIVE mode and screen is not secured
      if (SECURITY_MODE === 'SELECTIVE') {
        disableScreenSecurity();
      }
    }

    // Cleanup: clear current screen when component unmounts
    return () => {
      setCurrentScreen(null);
      // Only disable if in SELECTIVE mode
      if (SECURITY_MODE === 'SELECTIVE' && shouldSecure) {
        disableScreenSecurity();
      }
    };
  }, [screenName]);
};

/**
 * Hook to temporarily disable security (useful for specific actions)
 * Returns functions to disable/enable security temporarily
 */
export const useTemporarySecurityControl = () => {
  const { temporarilyDisableSecurity, temporarilyEnableSecurity } = require('../utils/ScreenSecurityManager');

  return {
    disableSecurity: temporarilyDisableSecurity,
    enableSecurity: temporarilyEnableSecurity,
  };
};
