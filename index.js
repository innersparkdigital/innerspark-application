/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import notifee, { EventType } from '@notifee/react-native';
import { handleNotificationPress, handleNotificationAction } from './src/api/LHNotifications';

import BackgroundFetch from 'react-native-background-fetch';
import { backgroundFetchHeadlessTask } from './src/utils/backgroundSyncManager';

/**
 * Notifee Background Event Handler
 * IMPORTANT: This must be registered at the top-level, before AppRegistry.registerComponent.
 * It allows the OS to wake the app in a headless mode to handle notification interactions
 * (taps, action presses) when the app is in background or killed state.
 */
notifee.onBackgroundEvent(async ({ type, detail }) => {
  console.log('🔔 [Background] Notification event:', type, detail);

  if (type === EventType.PRESS) {
    await handleNotificationPress(detail.notification);
  }

  if (type === EventType.ACTION_PRESS) {
    await handleNotificationAction(detail.pressAction?.id, detail.notification);
  }

  // Mark notification as displayed / read on backend if needed
  if (type === EventType.DELIVERED) {
    console.log('✅ [Background] Notification delivered:', detail.notification?.id);
  }
});

/**
 * Background Fetch Headless Task
 * This registers a separate headless task for periodic background fetching.
 */
BackgroundFetch.registerHeadlessTask(backgroundFetchHeadlessTask);

AppRegistry.registerComponent(appName, () => App);
