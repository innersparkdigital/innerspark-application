/**
 * BackHandler Patch for React Native 0.65+
 * 
 * This patch fixes the deprecated BackHandler.removeEventListener issue
 * that occurs with older libraries like react-native-app-intro-slider
 */

import { BackHandler } from 'react-native';

// Store original addEventListener if it exists
const originalAddEventListener = BackHandler.addEventListener;

// Patch BackHandler to provide backward compatibility
if (!BackHandler.removeEventListener) {
  // Create a map to store event listeners for removal
  const eventListeners = new Map();

  // Override addEventListener to track listeners
  BackHandler.addEventListener = (eventType, handler) => {
    const subscription = originalAddEventListener(eventType, handler);
    
    // Store the subscription for later removal
    eventListeners.set(handler, subscription);
    
    return subscription;
  };

  // Add the missing removeEventListener method
  BackHandler.removeEventListener = (eventType, handler) => {
    const subscription = eventListeners.get(handler);
    if (subscription) {
      subscription.remove();
      eventListeners.delete(handler);
      return true;
    }
    return false;
  };
}

export default BackHandler;
