/**
 * Badge Manager
 * Aggregates unread counts from Notifications and Chat to update the app icon badge
 */
import notifee from '@notifee/react-native';
import store from '../app/store';

/**
 * Update the global app icon badge count
 * Calculated as: General Notifications + Chat Messages
 */
export const updateAppBadgeCount = async () => {
  try {
    const state = store.getState();
    const userRole = (state.userData?.userDetails as any)?.role || 'user';
    
    let totalUnread = 0;
    const notificationUnread = state.notifications?.unreadCount || 0;
    
    if (userRole === 'therapist') {
      // For Therapist: Notifications + Messages + Pending Requests
      const dashboardStats = (state.therapistDashboard as any)?.stats || {};
      const unreadMessages = (dashboardStats as any).unreadMessages ?? (dashboardStats as any).messages?.unread ?? 0;
      const pendingRequests = (dashboardStats as any).pendingRequests ?? (dashboardStats as any).requests?.pending ?? 0;
      
      totalUnread = notificationUnread + unreadMessages + pendingRequests;
      
      console.log(`🏷️ [BadgeManager] Updating therapist badge: ${totalUnread} (Notif: ${notificationUnread}, Messages: ${unreadMessages}, Requests: ${pendingRequests})`);
    } else {
      // For Client: Notifications + Chat Messages
      const chatUnread = state.chat?.unreadCount || 0;
      totalUnread = notificationUnread + chatUnread;
      
      console.log(`🏷️ [BadgeManager] Updating client badge: ${totalUnread} (Notif: ${notificationUnread}, Chat: ${chatUnread})`);
    }
    
    await notifee.setBadgeCount(totalUnread);
  } catch (error) {
    console.error('❌ [BadgeManager] Failed to update badge count:', error);
  }
};

/**
 * Listener function that can be called whenever counts change
 */
export const syncBadges = () => {
  updateAppBadgeCount();
};
