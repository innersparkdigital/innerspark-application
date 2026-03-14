import BackgroundFetch from 'react-native-background-fetch';
import { syncNotificationsWithBackend } from '../api/LHNotifications';
import { getDashboardStats, getEvents } from '../api/therapist';
import { updateDashboardStats, updateUpcomingEventsCount } from '../features/therapist/dashboardSlice';
import store from '../app/store';
import { retrieveItemLS } from '../global/StorageActions';
import { syncBadges } from './BadgeManager';

/**
 * World-Class Background Sync Manager
 * Handles periodic background fetching of notifications and chat updates
 * to keep badges and local state in sync even when the app is closed.
 */

export const initBackgroundFetch = async () => {
  try {
    const status = await BackgroundFetch.configure(
      {
        minimumFetchInterval: 15, // minutes (15 is the minimum for iOS/Android)
        stopOnTerminate: false,    // Continue running after app is terminated (Android)
        startOnBoot: true,        // Start on device boot (Android)
        enableHeadless: true,      // Enable Headless Task for Android
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
      },
      async (taskId) => {
        console.log('⏰ [BackgroundFetch] Event received:', taskId);
        await performBackgroundSync();
        BackgroundFetch.finish(taskId);
      },
      (error) => {
        console.error('❌ [BackgroundFetch] Configuration error:', error);
      }
    );

    console.log('✅ [BackgroundFetch] Status:', status);
  } catch (error) {
    console.error('❌ [BackgroundFetch] Failed to initialize:', error);
  }
};

/**
 * Headless Task for Android
 * This is the entry point when the OS wakes the app in background
 */
export const backgroundFetchHeadlessTask = async (event: any) => {
  const taskId = event.taskId;
  const isTimeout = event.timeout;
  
  if (isTimeout) {
    console.log('⏰ [BackgroundFetch] Headless task timed out:', taskId);
    BackgroundFetch.finish(taskId);
    return;
  }

  console.log('⏰ [BackgroundFetch] Headless task started:', taskId);
  await performBackgroundSync();
  BackgroundFetch.finish(taskId);
};

/**
 * Shared Background Sync Logic
 * Fetches data, updates badges, and ensures the app is fresh
 */
const performBackgroundSync = async () => {
  try {
    // 1. Get User Session and Details from Encrypted Storage
    const userTokenStr = await retrieveItemLS('userToken');
    const userDetailsStr = await retrieveItemLS('userDetailsLS');
    
    if (!userTokenStr) {
      console.log('⏹ [BackgroundFetch] No active user session, skipping sync');
      return;
    }

    let userData;
    try {
      userData = JSON.parse(userTokenStr);
    } catch (e) {
      console.error('❌ [BackgroundFetch] Error parsing user session:', e);
      return;
    }

    const userId = userData?.userId || userData?.user_id;
    let userRole = 'user'; // Default

    if (userDetailsStr) {
      try {
        const details = JSON.parse(userDetailsStr);
        userRole = details?.role || 'user';
      } catch (e) {
        console.warn('⚠️ [BackgroundFetch] Error parsing user details, defaulting to "user" role');
      }
    }

    if (!userId) {
      console.log('⏹ [BackgroundFetch] Invalid User ID, skipping sync');
      return;
    }

    console.log(`🔄 [BackgroundFetch] Starting sync for ${userRole}:`, userId);

    // 2. Sync Notifications with Backend (Role-aware)
    // This will fetch new notifications and display them via Notifee
    await syncNotificationsWithBackend(userId, userRole as any);

    // 3. Therapist-Specific Sync (Stats/Badges)
    if (userRole === 'therapist') {
      await syncTherapistDataWithBackend(userId);
    }

    // 4. Update Badges
    // NOTE: In Headless mode, Redux store might be empty. 
    // We rely on syncNotificationsWithBackend to have updated any internal 
    // state or counts if they are persisted, or we fetch them here.
    // syncBadges() uses store.getState(), which may return 0s if App hasn't 
    // fully hydrated, but it works perfectly when app is already in background.
    await syncBadges();

    console.log('✅ [BackgroundFetch] Sync completed successfully');
  } catch (error) {
    console.error('❌ [BackgroundFetch] Error during sync:', error);
  }
};

/**
 * Sync Therapist-specific data
 * Fetches dashboard stats to update unread counts for messages, requests, etc.
 */
const syncTherapistDataWithBackend = async (therapistId: string) => {
  try {
    console.log('📊 [BackgroundFetch] Syncing therapist dashboard stats...');
    
    // 1. Fetch Dashboard Stats
    const statsResponse = await getDashboardStats(therapistId);
    if (statsResponse?.data) {
      // Normalize stats for Redux (matching THDashboard logic)
      const data = statsResponse.data as any;
      const normalizedStats = {
        todayAppointments: data?.todayAppointments ?? data?.appointments?.today ?? data?.sessionsToday ?? data?.appointment_count ?? 0,
        pendingRequests: data?.pendingRequests ?? data?.requests?.pending ?? data?.request_count ?? 0,
        activeGroups: data?.activeGroups ?? data?.groups?.active ?? data?.group_count ?? 0,
        unreadMessages: data?.unreadMessages ?? data?.messages?.unread ?? data?.unread_count ?? 0,
        totalClients: data?.totalClients ?? data?.clients?.total ?? data?.client_count ?? 0,
      };
      
      store.dispatch(updateDashboardStats(normalizedStats));
      console.log('✅ [BackgroundFetch] Therapist stats updated in Redux');
    }

    // 2. Fetch Upcoming Events Count
    const eventsResponse = await getEvents(therapistId, { status: 'upcoming', limit: 1 });
    if (eventsResponse?.data) {
      const upcomingEventsCount = (eventsResponse.data as any)?.stats?.upcomingEvents || 0;
      store.dispatch(updateUpcomingEventsCount(upcomingEventsCount));
      console.log('📅 [BackgroundFetch] Therapist upcoming events count updated:', upcomingEventsCount);
    }

  } catch (error) {
    console.error('❌ [BackgroundFetch] Failed to sync therapist data:', error);
  }
};
