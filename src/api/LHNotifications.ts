/**
 * InnerSpark Push Notification API Functions
 * This file contains all the push notification API functions for the InnerSpark App
 * @author: InnerSpark Dev Team
 * @date: 2025-09-17
 * @description: Push Notification API Functions for the InnerSpark App
*/

import notifee, { 
  AndroidImportance, 
  AndroidStyle, 
  TriggerType,
  AndroidCategory,
  AndroidVisibility,
  AndroidBadgeIconType,
  AndroidColor,
  EventType
} from '@notifee/react-native';
import { Linking } from 'react-native';
import { APIInstance } from './LHAPI';

// ### NOTIFICATION CHANNELS ###
const CHANNELS = {
  APPOINTMENTS: 'appointments',
  GOALS: 'goals',
  REMINDERS: 'reminders',
  SYSTEM: 'system',
  EVENTS: 'events',
  MESSAGES: 'messages',
  EMERGENCY: 'emergency',
};

// ### NOTIFICATION TYPES ###
export const NOTIFICATION_TYPES = {
  APPOINTMENT_REMINDER: 'appointment_reminder',
  APPOINTMENT_CONFIRMED: 'appointment_confirmed',
  GOAL_ACHIEVEMENT: 'goal_achievement',
  GOAL_REMINDER: 'goal_reminder',
  MOOD_CHECK_IN: 'mood_check_in',
  SYSTEM_UPDATE: 'system_update',
  EVENT_AVAILABLE: 'event_available',
  EVENT_REMINDER: 'event_reminder',
  MESSAGE_RECEIVED: 'message_received',
  EMERGENCY_CONTACT: 'emergency_contact',
  WELLNESS_TIP: 'wellness_tip',
  PROGRESS_UPDATE: 'progress_update',
  // Backend/Admin Dashboard Types
  ADMIN_ANNOUNCEMENT: 'admin_announcement',
  ADMIN_UPDATE: 'admin_update',
  ADMIN_MAINTENANCE: 'admin_maintenance',
  ADMIN_PROMOTION: 'admin_promotion',
  ADMIN_ALERT: 'admin_alert',
  THERAPIST_MESSAGE: 'therapist_message',
  COMMUNITY_UPDATE: 'community_update',
};

// ### DEEP LINK ACTIONS ###
export const DEEP_LINK_ACTIONS = {
  OPEN_THERAPISTS: 'innerspark://therapists',
  OPEN_GOALS: 'innerspark://goals',
  OPEN_MOOD: 'innerspark://mood',
  OPEN_EVENTS: 'innerspark://events',
  OPEN_EMERGENCY: 'innerspark://emergency',
  OPEN_NOTIFICATIONS: 'innerspark://notifications',
  OPEN_APPOINTMENT: 'innerspark://appointment/',
  OPEN_GOAL: 'innerspark://goal/',
  OPEN_EVENT: 'innerspark://event/',
};

// ### INITIALIZE NOTIFICATION CHANNELS ###
export const initializeNotificationChannels = async () => {
  try {
    // Appointments Channel
    await notifee.createChannel({
      id: CHANNELS.APPOINTMENTS,
      name: 'Appointments',
      description: 'Therapy appointments and reminders',
      importance: AndroidImportance.HIGH,
      badge: true,
      sound: 'default',
    });

    // Goals Channel
    await notifee.createChannel({
      id: CHANNELS.GOALS,
      name: 'Goals & Progress',
      description: 'Goal achievements and reminders',
      importance: AndroidImportance.DEFAULT,
      badge: true,
      sound: 'default',
    });

    // Reminders Channel
    await notifee.createChannel({
      id: CHANNELS.REMINDERS,
      name: 'Wellness Reminders',
      description: 'Mood check-ins and wellness tips',
      importance: AndroidImportance.DEFAULT,
      badge: true,
    });

    // System Channel
    await notifee.createChannel({
      id: CHANNELS.SYSTEM,
      name: 'System Updates',
      description: 'App updates and system notifications',
      importance: AndroidImportance.LOW,
      badge: false,
    });

    // Events Channel
    await notifee.createChannel({
      id: CHANNELS.EVENTS,
      name: 'Mental Health Events',
      description: 'Workshops, seminars, and community events',
      importance: AndroidImportance.DEFAULT,
      badge: true,
    });

    // Messages Channel
    await notifee.createChannel({
      id: CHANNELS.MESSAGES,
      name: 'Messages',
      description: 'Messages from therapists and support team',
      importance: AndroidImportance.HIGH,
      badge: true,
      sound: 'default',
    });

    // Emergency Channel
    await notifee.createChannel({
      id: CHANNELS.EMERGENCY,
      name: 'Emergency Support',
      description: 'Crisis support and emergency notifications',
      importance: AndroidImportance.HIGH,
      badge: true,
      sound: 'default',
      vibration: true,
    });

    console.log('✅ Notification channels initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize notification channels:', error);
  }
};

// ### NOTIFICATION COLOR HELPER ###
const getNotificationColor = (type: string): string => {
  const colorMap = {
    [NOTIFICATION_TYPES.APPOINTMENT_REMINDER]: '#4CAF50', // Green for appointments
    [NOTIFICATION_TYPES.APPOINTMENT_CONFIRMED]: '#4CAF50', // Green for appointments
    [NOTIFICATION_TYPES.GOAL_ACHIEVEMENT]: '#FF9800', // Orange for achievements
    [NOTIFICATION_TYPES.GOAL_REMINDER]: '#2196F3', // Blue for reminders
    [NOTIFICATION_TYPES.MOOD_CHECK_IN]: '#E91E63', // Pink for mood
    [NOTIFICATION_TYPES.EVENT_AVAILABLE]: '#9C27B0', // Purple for events
    [NOTIFICATION_TYPES.EVENT_REMINDER]: '#9C27B0', // Purple for events
    [NOTIFICATION_TYPES.WELLNESS_TIP]: '#00BCD4', // Cyan for wellness
    [NOTIFICATION_TYPES.PROGRESS_UPDATE]: '#FF5722', // Deep orange for progress
    [NOTIFICATION_TYPES.EMERGENCY_CONTACT]: '#F44336', // Red for emergency
    [NOTIFICATION_TYPES.SYSTEM_UPDATE]: '#607D8B', // Blue grey for system
    [NOTIFICATION_TYPES.MESSAGE_RECEIVED]: '#87CEEB', // Sky blue for messages
    // Backend/Admin Dashboard Colors
    [NOTIFICATION_TYPES.ADMIN_ANNOUNCEMENT]: '#3F51B5', // Indigo for announcements
    [NOTIFICATION_TYPES.ADMIN_UPDATE]: '#009688', // Teal for updates
    [NOTIFICATION_TYPES.ADMIN_MAINTENANCE]: '#FF9800', // Orange for maintenance
    [NOTIFICATION_TYPES.ADMIN_PROMOTION]: '#E91E63', // Pink for promotions
    [NOTIFICATION_TYPES.ADMIN_ALERT]: '#F44336', // Red for alerts
    [NOTIFICATION_TYPES.THERAPIST_MESSAGE]: '#4CAF50', // Green for therapist messages
    [NOTIFICATION_TYPES.COMMUNITY_UPDATE]: '#9C27B0', // Purple for community
  };
  
  return colorMap[type] || '#87CEEB'; // Default to sky blue
};

// ### BASIC NOTIFICATION FUNCTION ###
export const displayNotification = async (notificationData) => {
  try {
    const {
      id,
      title,
      body,
      type,
      channelId = CHANNELS.SYSTEM,
      data = {},
      actions = [],
      largeIcon,
      bigPicture,
      deepLink,
      sound = 'default',
      vibration = true,
    } = notificationData;

    const notification = {
      id: id || Date.now().toString(),
      title,
      body,
      data: {
        type,
        deepLink: deepLink || '', // Ensure deepLink is always a string
        ...data,
      },
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
        sound,
        vibrationPattern: vibration ? [300, 500] : undefined,
        largeIcon: largeIcon || 'ic_launcher',
        badgeIconType: AndroidBadgeIconType.SMALL,
        category: AndroidCategory.MESSAGE,
        visibility: AndroidVisibility.PUBLIC,
        color: getNotificationColor(type), // Dynamic color based on notification type
        colorized: true, // Enable colorized notifications for better theming
        actions: actions.map(action => ({
          title: action.title,
          pressAction: {
            id: action.id,
            launchActivity: 'default',
          },
        })),
        style: bigPicture ? {
          type: AndroidStyle.BIGPICTURE,
          picture: bigPicture,
        } : undefined,
      },
    };

    await notifee.displayNotification(notification);
    console.log(`✅ Notification displayed: ${title}`);
    return notification.id;
  } catch (error) {
    console.error('❌ Failed to display notification:', error);
    throw error;
  }
};

// ### SCHEDULED NOTIFICATION FUNCTION ###
export const scheduleNotification = async (notificationData, triggerTime) => {
  try {
    const notificationId = await displayNotification(notificationData);
    
    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: triggerTime,
    };

    await notifee.createTriggerNotification(
      { ...notificationData, id: notificationId },
      trigger
    );

    console.log(`✅ Notification scheduled for: ${new Date(triggerTime)}`);
    return notificationId;
  } catch (error) {
    console.error('❌ Failed to schedule notification:', error);
    throw error;
  }
};

// ### SPECIFIC NOTIFICATION TYPES ###

// Appointment Notifications
export const sendAppointmentReminder = async (appointmentData) => {
  const { therapistName, appointmentTime, appointmentId } = appointmentData;
  
  return await displayNotification({
    title: 'Appointment Reminder',
    body: `Your session with ${therapistName} is scheduled for ${appointmentTime}`,
    type: NOTIFICATION_TYPES.APPOINTMENT_REMINDER,
    channelId: CHANNELS.APPOINTMENTS,
    deepLink: `${DEEP_LINK_ACTIONS.OPEN_APPOINTMENT}${appointmentId}`,
    data: { appointmentId, therapistName },
    actions: [
      { id: 'view', title: 'View Details' },
      { id: 'reschedule', title: 'Reschedule' },
    ],
  });
};

export const sendAppointmentConfirmation = async (appointmentData) => {
  const { therapistName, appointmentTime, appointmentId } = appointmentData;
  
  return await displayNotification({
    title: 'Appointment Confirmed',
    body: `Your appointment with ${therapistName} has been confirmed for ${appointmentTime}`,
    type: NOTIFICATION_TYPES.APPOINTMENT_CONFIRMED,
    channelId: CHANNELS.APPOINTMENTS,
    deepLink: `${DEEP_LINK_ACTIONS.OPEN_APPOINTMENT}${appointmentId}`,
    data: { appointmentId, therapistName },
  });
};

// Goal Notifications
export const sendGoalAchievement = async (goalData) => {
  const { goalTitle, goalId } = goalData;
  
  return await displayNotification({
    title: '🎉 Goal Achieved!',
    body: `Congratulations! You completed "${goalTitle}". Keep up the great work!`,
    type: NOTIFICATION_TYPES.GOAL_ACHIEVEMENT,
    channelId: CHANNELS.GOALS,
    deepLink: `${DEEP_LINK_ACTIONS.OPEN_GOAL}${goalId}`,
    data: { goalId, goalTitle },
    actions: [
      { id: 'view', title: 'View Goal' },
      { id: 'share', title: 'Share Progress' },
    ],
  });
};

export const sendGoalReminder = async (goalData) => {
  const { goalTitle, goalId } = goalData;
  
  return await displayNotification({
    title: 'Goal Reminder',
    body: `Don't forget to work on "${goalTitle}" today. Small steps lead to big changes!`,
    type: NOTIFICATION_TYPES.GOAL_REMINDER,
    channelId: CHANNELS.GOALS,
    deepLink: `${DEEP_LINK_ACTIONS.OPEN_GOAL}${goalId}`,
    data: { goalId, goalTitle },
  });
};

// Mood Check-in Notifications
export const sendMoodCheckInReminder = async () => {
  return await displayNotification({
    title: 'How are you feeling?',
    body: 'Take a moment to check in with yourself and log your mood.',
    type: NOTIFICATION_TYPES.MOOD_CHECK_IN,
    channelId: CHANNELS.REMINDERS,
    deepLink: DEEP_LINK_ACTIONS.OPEN_MOOD,
    actions: [
      { id: 'log_mood', title: 'Log Mood' },
      { id: 'later', title: 'Remind Later' },
    ],
  });
};

// Event Notifications
export const sendEventAvailable = async (eventData) => {
  const { eventTitle, eventDate, eventId } = eventData;
  
  return await displayNotification({
    title: 'New Event Available',
    body: `"${eventTitle}" is now open for registration. Event date: ${eventDate}`,
    type: NOTIFICATION_TYPES.EVENT_AVAILABLE,
    channelId: CHANNELS.EVENTS,
    deepLink: `${DEEP_LINK_ACTIONS.OPEN_EVENT}${eventId}`,
    data: { eventId, eventTitle },
    actions: [
      { id: 'register', title: 'Register Now' },
      { id: 'view', title: 'View Details' },
    ],
  });
};

// System Notifications
export const sendSystemUpdate = async (updateData) => {
  const { version, features } = updateData;
  
  return await displayNotification({
    title: 'App Updated',
    body: `InnerSpark v${version} is now available with new features: ${features}`,
    type: NOTIFICATION_TYPES.SYSTEM_UPDATE,
    channelId: CHANNELS.SYSTEM,
    deepLink: DEEP_LINK_ACTIONS.OPEN_NOTIFICATIONS,
  });
};

// Wellness Tips
export const sendWellnessTip = async (tipData) => {
  const { tip, category } = tipData;
  
  return await displayNotification({
    title: '💡 Wellness Tip',
    body: tip,
    type: NOTIFICATION_TYPES.WELLNESS_TIP,
    channelId: CHANNELS.REMINDERS,
    deepLink: DEEP_LINK_ACTIONS.OPEN_MOOD, // Add deepLink for wellness tips
    data: { category },
  });
};

// Progress Updates
export const sendProgressUpdate = async (progressData) => {
  const { message, achievements } = progressData;
  
  return await displayNotification({
    title: '📊 Your Progress This Week',
    body: message,
    type: NOTIFICATION_TYPES.PROGRESS_UPDATE,
    channelId: CHANNELS.SYSTEM,
    deepLink: DEEP_LINK_ACTIONS.OPEN_GOALS,
    data: { achievements: Array.isArray(achievements) ? achievements.join(',') : achievements || '' },
  });
};

// Emergency Notifications
export const sendEmergencySupport = async () => {
  return await displayNotification({
    title: '🆘 Crisis Support Available',
    body: 'If you\'re in crisis, immediate help is available. Tap to access emergency resources.',
    type: NOTIFICATION_TYPES.EMERGENCY_CONTACT,
    channelId: CHANNELS.EMERGENCY,
    deepLink: DEEP_LINK_ACTIONS.OPEN_EMERGENCY,
    actions: [
      { id: 'emergency', title: 'Get Help Now' },
      { id: 'resources', title: 'View Resources' },
    ],
  });
};

// ### MOCK NOTIFICATION TESTING ###
export const triggerTestNotifications = async () => {
  console.log('🧪 Triggering test notifications...');
  
  try {
    // Test appointment reminder (immediate)
    await sendAppointmentReminder({
      therapistName: 'Dr. Martin Pilier',
      appointmentTime: 'Tomorrow at 2:00 PM',
      appointmentId: '123',
    });

    // Test goal achievement (3 seconds delay)
    setTimeout(async () => {
      await sendGoalAchievement({
        goalTitle: 'Daily Meditation Practice',
        goalId: '456',
      });
    }, 3000);

    // Test mood check-in (6 seconds delay)
    setTimeout(async () => {
      await sendMoodCheckInReminder();
    }, 6000);

    // Test event notification (9 seconds delay)
    setTimeout(async () => {
      await sendEventAvailable({
        eventTitle: 'Mental Health First Aid Training',
        eventDate: 'January 25, 2024',
        eventId: '789',
      });
    }, 9000);

    // Test wellness tip (12 seconds delay)
    setTimeout(async () => {
      await sendWellnessTip({
        tip: 'Take 5 deep breaths when feeling overwhelmed. Breathe in for 4, hold for 4, breathe out for 6.',
        category: 'breathing',
      });
    }, 12000);

    // Test progress update (15 seconds delay)
    setTimeout(async () => {
      await sendProgressUpdate({
        message: '5 goals completed, 2 sessions attended, 7 mood logs this week!',
        achievements: ['consistent_logging', 'goal_completion'],
      });
    }, 15000);

    console.log('✅ Test notifications scheduled successfully');
  } catch (error) {
    console.error('❌ Failed to trigger test notifications:', error);
  }
};

// ### NOTIFICATION EVENT LISTENERS SETUP ###
export const setupNotificationEventListeners = () => {
  try {
    console.log('🔔 Setting up notification event listeners...');

    // Listen for notification press events (when user taps notification)
    const unsubscribePress = notifee.onForegroundEvent(({ type, detail }) => {
      console.log('🔔 Foreground notification event:', type, detail);
      
      if (type === EventType.PRESS) {
        handleNotificationPress(detail.notification);
      }
      
      if (type === EventType.ACTION_PRESS) {
        handleNotificationAction(detail.pressAction?.id, detail.notification);
      }
    });

    // Listen for background notification events
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      console.log('🔔 Background notification event:', type, detail);
      
      if (type === EventType.PRESS) {
        await handleNotificationPress(detail.notification);
      }
      
      if (type === EventType.ACTION_PRESS) {
        await handleNotificationAction(detail.pressAction?.id, detail.notification);
      }
    });

    console.log('✅ Notification event listeners setup complete');
    return unsubscribePress;
  } catch (error) {
    console.error('❌ Failed to setup notification event listeners:', error);
  }
};

// ### NOTIFICATION EVENT HANDLERS ###
export const handleNotificationPress = async (notificationData) => {
  try {
    console.log('📱 Notification pressed:', notificationData);
    const { data } = notificationData || {};
    
    if (data?.deepLink) {
      console.log('🔗 Opening deep link:', data.deepLink);
      await Linking.openURL(data.deepLink);
    } else {
      console.log('⚠️ No deep link found in notification data');
    }
    
  } catch (error) {
    console.error('❌ Failed to handle notification press:', error);
  }
};

export const handleNotificationAction = async (actionId, notificationData) => {
  try {
    const { data } = notificationData;
    
    switch (actionId) {
      case 'view':
        if (data?.deepLink) {
          await Linking.openURL(data.deepLink);
        }
        break;
      case 'log_mood':
        await Linking.openURL(DEEP_LINK_ACTIONS.OPEN_MOOD);
        break;
      case 'register':
        if (data?.eventId) {
          await Linking.openURL(`${DEEP_LINK_ACTIONS.OPEN_EVENT}${data.eventId}`);
        }
        break;
      case 'emergency':
        await Linking.openURL(DEEP_LINK_ACTIONS.OPEN_EMERGENCY);
        break;
      default:
        console.log('🔄 Unknown action:', actionId);
    }
    
    console.log('⚡ Notification action handled:', actionId);
  } catch (error) {
    console.error('❌ Failed to handle notification action:', error);
  }
};

// ### NOTIFICATION PERMISSIONS ###
export const requestNotificationPermissions = async () => {
  try {
    const settings = await notifee.requestPermission();
    
    if (settings.authorizationStatus >= 1) {
      console.log('✅ Notification permissions granted');
      return true;
    } else {
      console.log('❌ Notification permissions denied');
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to request notification permissions:', error);
    return false;
  }
};

// ### CANCEL NOTIFICATIONS ###
export const cancelNotification = async (notificationId) => {
  try {
    await notifee.cancelNotification(notificationId);
    console.log(`✅ Notification cancelled: ${notificationId}`);
  } catch (error) {
    console.error('❌ Failed to cancel notification:', error);
  }
};

export const cancelAllNotifications = async () => {
  try {
    await notifee.cancelAllNotifications();
    console.log('✅ All notifications cancelled');
  } catch (error) {
    console.error('❌ Failed to cancel all notifications:', error);
  }
};

// ### BADGE MANAGEMENT ###
export const setBadgeCount = async (count) => {
  try {
    await notifee.setBadgeCount(count);
    console.log(`✅ Badge count set to: ${count}`);
  } catch (error) {
    console.error('❌ Failed to set badge count:', error);
  }
};

export const clearBadge = async () => {
  try {
    await notifee.setBadgeCount(0);
    console.log('✅ Badge cleared');
  } catch (error) {
    console.error('❌ Failed to clear badge:', error);
  }
};

// ### BACKEND API INTEGRATION ###

// Interface for backend notification
interface BackendNotification {
  id: string;
  title: string;
  body: string;
  type: string;
  data?: any;
  scheduled_at?: string;
  image_url?: string;
  deep_link?: string;
  actions?: Array<{id: string, title: string}>;
  priority: 'low' | 'normal' | 'high';
  created_at: string;
  expires_at?: string;
}

// Fetch notifications from backend
export const fetchNotificationsFromBackend = async (userId?: string, lastFetchTime?: string) => {
  try {
    const params: any = {};
    if (userId) params.user_id = userId;
    if (lastFetchTime) params.since = lastFetchTime;
    
    const response = await APIInstance.get('/notifications', { params });
    const data = response.data;
    console.log(`✅ Fetched ${data.notifications?.length || 0} notifications from backend`);
    
    return {
      notifications: data.notifications || [],
      hasMore: data.has_more || false,
      nextCursor: data.next_cursor || null,
    };
  } catch (error) {
    console.error('❌ Failed to fetch notifications from backend:', error);
    throw error;
  }
};

// Process and display backend notifications
export const processBackendNotifications = async (notifications: BackendNotification[]) => {
  try {
    for (const notification of notifications) {
      // Check if notification is still valid (not expired)
      if (notification.expires_at && new Date(notification.expires_at) < new Date()) {
        console.log(`⏰ Notification ${notification.id} has expired, skipping`);
        continue;
      }

      // Map backend notification to our notification format
      const notificationData = {
        id: notification.id,
        title: notification.title,
        body: notification.body,
        type: notification.type,
        data: notification.data || {},
        deepLink: notification.deep_link,
        bigPicture: notification.image_url,
        actions: notification.actions || [],
        channelId: getChannelForType(notification.type),
        sound: notification.priority === 'high' ? 'default' : undefined,
        vibration: notification.priority === 'high',
      };

      // Display the notification
      await displayNotification(notificationData);
      
      // Mark as delivered on backend
      await markNotificationAsDelivered(notification.id);
    }
    
    console.log(`✅ Processed ${notifications.length} backend notifications`);
  } catch (error) {
    console.error('❌ Failed to process backend notifications:', error);
    throw error;
  }
};

// Get appropriate channel for notification type
const getChannelForType = (type: string): string => {
  const channelMap = {
    [NOTIFICATION_TYPES.ADMIN_ANNOUNCEMENT]: CHANNELS.SYSTEM,
    [NOTIFICATION_TYPES.ADMIN_UPDATE]: CHANNELS.SYSTEM,
    [NOTIFICATION_TYPES.ADMIN_MAINTENANCE]: CHANNELS.SYSTEM,
    [NOTIFICATION_TYPES.ADMIN_PROMOTION]: CHANNELS.EVENTS,
    [NOTIFICATION_TYPES.ADMIN_ALERT]: CHANNELS.EMERGENCY,
    [NOTIFICATION_TYPES.THERAPIST_MESSAGE]: CHANNELS.MESSAGES,
    [NOTIFICATION_TYPES.COMMUNITY_UPDATE]: CHANNELS.EVENTS,
  };
  
  return channelMap[type] || CHANNELS.SYSTEM;
};

// Mark notification as delivered
export const markNotificationAsDelivered = async (notificationId: string) => {
  try {
    await APIInstance.post(`/notifications/${notificationId}/delivered`);
    
    console.log(`✅ Marked notification ${notificationId} as delivered`);
  } catch (error) {
    console.error(`❌ Failed to mark notification ${notificationId} as delivered:`, error);
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    await APIInstance.post(`/notifications/${notificationId}/read`);
    
    console.log(`✅ Marked notification ${notificationId} as read`);
  } catch (error) {
    console.error(`❌ Failed to mark notification ${notificationId} as read:`, error);
  }
};

// Sync notifications with backend (call this periodically)
export const syncNotificationsWithBackend = async (userId?: string) => {
  try {
    console.log('🔄 Syncing notifications with backend...');
    
    // Get last sync time from storage (you might want to use AsyncStorage)
    const lastSyncTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // Last 24 hours
    
    // Fetch new notifications
    const result = await fetchNotificationsFromBackend(userId, lastSyncTime);
    
    if (result.notifications.length > 0) {
      // Process and display notifications
      await processBackendNotifications(result.notifications);
      
      // Update badge count
      const unreadCount = result.notifications.filter(n => !n.data?.read).length;
      if (unreadCount > 0) {
        await setBadgeCount(unreadCount);
      }
    }
    
    console.log('✅ Notification sync completed');
    return result;
  } catch (error) {
    console.error('❌ Failed to sync notifications with backend:', error);
    throw error;
  }
};

// Register device for push notifications (FCM token)
export const registerDeviceForPushNotifications = async (userId: string, fcmToken: string) => {
  try {
    await APIInstance.post('/notifications/register-device', {
      user_id: userId,
      fcm_token: fcmToken,
      platform: 'android',
      app_version: '1.0.0', // You can get this from your app config
    });
    
    console.log('✅ Device registered for push notifications');
  } catch (error) {
    console.error('❌ Failed to register device for push notifications:', error);
    throw error;
  }
};

// Admin Dashboard Notification Functions
export const sendAdminAnnouncement = async (announcementData: any) => {
  const { title, message, imageUrl, priority = 'normal' } = announcementData;
  
  return await displayNotification({
    title: `📢 ${title}`,
    body: message,
    type: NOTIFICATION_TYPES.ADMIN_ANNOUNCEMENT,
    channelId: CHANNELS.SYSTEM,
    bigPicture: imageUrl,
    deepLink: DEEP_LINK_ACTIONS.OPEN_NOTIFICATIONS,
    sound: priority === 'high' ? 'default' : undefined,
    vibration: priority === 'high',
  });
};

export const sendAdminUpdate = async (updateData: any) => {
  const { title, message, version, features } = updateData;
  
  return await displayNotification({
    title: title || 'App Update Available',
    body: message || `New features: ${features}`,
    type: NOTIFICATION_TYPES.ADMIN_UPDATE,
    channelId: CHANNELS.SYSTEM,
    deepLink: DEEP_LINK_ACTIONS.OPEN_NOTIFICATIONS,
    data: { version, features },
  });
};

export const sendMaintenanceNotification = async (maintenanceData: any) => {
  const { title, message, startTime, endTime } = maintenanceData;
  
  return await displayNotification({
    title: title || '🔧 Scheduled Maintenance',
    body: message || `Maintenance scheduled from ${startTime} to ${endTime}`,
    type: NOTIFICATION_TYPES.ADMIN_MAINTENANCE,
    channelId: CHANNELS.SYSTEM,
    deepLink: DEEP_LINK_ACTIONS.OPEN_NOTIFICATIONS,
    data: { startTime, endTime },
  });
};

// ### EXPORT DEFAULT OBJECT ###
export default {
  // Core Functions
  initializeNotificationChannels,
  setupNotificationEventListeners,
  displayNotification,
  scheduleNotification,
  requestNotificationPermissions,
  
  // Local Notification Functions
  sendAppointmentReminder,
  sendAppointmentConfirmation,
  sendGoalAchievement,
  sendGoalReminder,
  sendMoodCheckInReminder,
  sendEventAvailable,
  sendSystemUpdate,
  sendWellnessTip,
  sendProgressUpdate,
  sendEmergencySupport,
  triggerTestNotifications,
  
  // Backend Integration Functions
  fetchNotificationsFromBackend,
  processBackendNotifications,
  syncNotificationsWithBackend,
  markNotificationAsDelivered,
  markNotificationAsRead,
  registerDeviceForPushNotifications,
  
  // Admin Dashboard Functions
  sendAdminAnnouncement,
  sendAdminUpdate,
  sendMaintenanceNotification,
  
  // Notification Management
  handleNotificationPress,
  handleNotificationAction,
  cancelNotification,
  cancelAllNotifications,
  setBadgeCount,
  clearBadge,
  
  // Constants
  NOTIFICATION_TYPES,
  DEEP_LINK_ACTIONS,
  CHANNELS,
};
