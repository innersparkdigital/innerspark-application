/**
 * Notification Manager
 * Handles notification API calls with graceful error handling
 * Returns empty arrays/objects for 404 (endpoint not implemented yet)
 * UI handles empty states seamlessly
 */
import store from '../app/store';
import {
  setNotifications,
  setUnreadCount,
  markAsRead,
  markAllAsRead as markAllAsReadAction,
  deleteNotification as deleteNotificationAction,
  setLoading,
  setRefreshing,
  setError,
} from '../features/notifications/notificationSlice';
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification as deleteNotificationAPI
} from '../api/client/notifications';
import { 
  getNotifications as getTherapistNotifications, 
  markNotificationAsRead as markTherapistNotificationRead, 
  markAllNotificationsAsRead as markAllTherapistNotificationsRead
} from '../api/therapist/notifications';
import { syncBadges } from './BadgeManager';
import { cancelNotification, cancelAllNotifications } from '../api/LHNotifications';

/**
 * Load notifications from API
 * Returns empty array if endpoint not implemented (404)
 */
export const loadNotifications = async (userId: string, page: number = 1) => {
  store.dispatch(setLoading(true));
  
  const role = (store.getState().userData?.userDetails as any)?.role || 'user';
  
  try {
    console.log(`🔔 Loading ${role} notifications from API for userId:`, userId, 'page:', page);
    
    let response;
    if (role === 'therapist') {
      response = await getTherapistNotifications(userId, false);
    } else {
      response = await getNotifications(userId, page);
    }

    console.log('✅ API Response:', JSON.stringify(response, null, 2));
    
    if (response.success && response.data) {
      const { notifications, unreadCount, pagination } = response.data;
      const mappedNotifications = (notifications || []).map((n: any) => ({
        id: n.id,
        title: n.title,
        message: n.message || n.body,
        body: n.body,
        timestamp: n.createdAt,
        type: n.type || 'system',
        isRead: n.read ?? n.is_read ?? n.isRead ?? false,
      }));

      // Calculate unread count locally if not explicitly provided
      const finalUnreadCount = unreadCount !== undefined 
        ? unreadCount 
        : mappedNotifications.filter((n: any) => !n.isRead).length;

      store.dispatch(setNotifications({
        notifications: mappedNotifications,
        pagination: pagination || { currentPage: page, totalPages: 1, totalItems: 0 },
      }));
      
      store.dispatch(setUnreadCount(finalUnreadCount));
      syncBadges();
    } else {
      console.log('⚠️ API response missing success or data:', response);
    }
  } catch (error: any) {
    console.log('❌ Error loading notifications:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      fullError: error
    });
    
    // Handle 404 - endpoint not implemented yet, return empty state
    if (error?.response?.status === 404) {
      console.log('📦 GET /client/notifications endpoint returns 404, showing empty state');
      
      store.dispatch(setNotifications({
        notifications: [],
        pagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
      }));
      
      store.dispatch(setUnreadCount(0));
    } else {
      // Other errors - set error state with empty data
      console.log('⚠️ Non-404 error, showing empty state');
      
      store.dispatch(setNotifications({
        notifications: [],
        pagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
      }));
      
      store.dispatch(setUnreadCount(0));
      store.dispatch(setError(error?.message || 'Failed to load notifications'));
    }
  } finally {
    store.dispatch(setLoading(false));
  }
};

/**
 * Refresh notifications
 */
export const refreshNotifications = async (userId: string) => {
  store.dispatch(setRefreshing(true));
  
  const role = (store.getState().userData?.userDetails as any)?.role || 'user';
  
  try {
    let response;
    if (role === 'therapist') {
      response = await getTherapistNotifications(userId, false);
    } else {
      response = await getNotifications(userId, 1);
    }
    
    if (response.success && response.data) {
      const { notifications, unreadCount, pagination } = response.data;
      
      const mappedNotifications = (notifications || []).map((n: any) => ({
        id: n.id,
        title: n.title,
        message: n.message || n.body,
        body: n.body,
        timestamp: n.createdAt,
        type: n.type || 'system',
        isRead: n.read ?? n.is_read ?? n.isRead ?? false,
      }));

      const finalUnreadCount = unreadCount !== undefined 
        ? unreadCount 
        : mappedNotifications.filter((n: any) => !n.isRead).length;

      store.dispatch(setNotifications({
        notifications: mappedNotifications,
        pagination: pagination || { currentPage: 1, totalPages: 1, totalItems: 0 },
      }));
      
      store.dispatch(setUnreadCount(finalUnreadCount));
      syncBadges();
    }
  } catch (error: any) {
    console.log('Error refreshing notifications:', error);
    
    // Handle 404 gracefully - show empty state
    if (error?.response?.status === 404) {
      store.dispatch(setNotifications({
        notifications: [],
        pagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
      }));
      
      store.dispatch(setUnreadCount(0));
    }
  } finally {
    store.dispatch(setRefreshing(false));
  }
};

/**
 * Mark notification as read
 */
export const markNotificationRead = async (notificationId: string, userId: string) => {
  const role = (store.getState().userData?.userDetails as any)?.role || 'user';

  try {
    store.dispatch(markAsRead(notificationId));
    
    if (role === 'therapist') {
      await markTherapistNotificationRead(notificationId, userId);
    } else {
      await markNotificationAsRead(notificationId, userId);
    }
    
    // Clear from system tray
    cancelNotification(notificationId);
    
    syncBadges();
    return { success: true };
  } catch (error: any) {
    console.log('Error marking notification as read:', error);
    
    // Handle 404 - update locally even if API not implemented
    if (error?.response?.status === 404) {
      store.dispatch(markAsRead(notificationId));
      return { success: true };
    }
    
    return { success: false, error: error?.message };
  }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsRead = async (userId: string) => {
  const role = (store.getState().userData?.userDetails as any)?.role || 'user';

  try {
    store.dispatch(markAllAsReadAction());
    
    if (role === 'therapist') {
      await markAllTherapistNotificationsRead(userId);
    } else {
      await markAllNotificationsAsRead(userId);
    }
    
    // Clear all from tray
    cancelAllNotifications();
    
    syncBadges();
    return { success: true };
  } catch (error: any) {
    console.log('Error marking all notifications as read:', error);
    
    // Handle 404 - update locally even if API not implemented
    if (error?.response?.status === 404) {
      store.dispatch(markAllAsReadAction());
      return { success: true };
    }
    
    return { success: false, error: error?.message };
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (notificationId: string) => {
  try {
    store.dispatch(deleteNotificationAction(notificationId));
    
    // Call API for appropriate role
    const state = store.getState();
    const role = (state.userData?.userDetails as any)?.role || 'user';
    const userId = (state.userData?.userDetails as any)?.userId;

    if (role === 'therapist') {
      if (userId) {
        await markTherapistNotificationRead(notificationId, userId);
      }
    } else {
      await deleteNotificationAPI(notificationId);
    }
    
    // Clear from tray
    cancelNotification(notificationId);
    
    syncBadges();
    return { success: true };
  } catch (error: any) {
    console.log('Error deleting notification:', error);
    
    // Still delete locally even if API fails (common requirement for dismissal)
    store.dispatch(deleteNotificationAction(notificationId));
    return { success: true };
  }
};

/**
 * Get unread count only
 * Useful for badge updates without loading full list
 */
export const getUnreadCount = async (userId: string) => {
  const role = (store.getState().userData?.userDetails as any)?.role || 'user';

  try {
    let response;
    if (role === 'therapist') {
      response = await getTherapistNotifications(userId, true);
    } else {
      response = await getNotifications(userId, 1);
    }
    
    if (response.success && response.data) {
      const { notifications, unreadCount } = response.data;
      
      const finalUnreadCount = unreadCount !== undefined 
        ? unreadCount 
        : (notifications || []).filter((n: any) => !(n.isRead || n.is_read)).length;

      store.dispatch(setUnreadCount(finalUnreadCount));
      syncBadges();
      return finalUnreadCount;
    }
  } catch (error: any) {
    console.log('Error getting unread count:', error);
    
    // Handle 404 - return 0 for unread count
    if (error?.response?.status === 404) {
      store.dispatch(setUnreadCount(0));
      return 0;
    }
  }
  
  return 0;
};
