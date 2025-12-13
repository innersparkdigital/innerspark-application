/**
 * Notification Manager
 * Handles notification API calls with graceful error handling
 * Falls back to mock data when endpoints are not yet implemented (404)
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
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../api/client/notifications';
import { mockNotifications } from '../global/MockData';

/**
 * Load notifications from API
 * Falls back to mock data if endpoint returns 404
 */
export const loadNotifications = async (userId: string, page: number = 1) => {
  store.dispatch(setLoading(true));
  
  try {
    console.log('🔔 Loading notifications from API for userId:', userId, 'page:', page);
    const response = await getNotifications(page);
    console.log('✅ API Response:', JSON.stringify(response, null, 2));
    
    if (response.success && response.data) {
      const { notifications, unreadCount, pagination } = response.data;
      console.log('📋 Notifications count:', notifications?.length, 'Unread:', unreadCount);
      
      store.dispatch(setNotifications({
        notifications: notifications || [],
        pagination: pagination || { currentPage: page, totalPages: 1, totalItems: 0 },
      }));
      
      store.dispatch(setUnreadCount(unreadCount || 0));
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
    
    // Handle 404 - endpoint not implemented yet
    if (error?.response?.status === 404) {
      console.log('📦 GET /client/notifications endpoint returns 404, using mock data');
      
      // Use mock data from MockData.ts
      const notifications = mockNotifications || [];
      const unreadCount = notifications.filter((n: any) => !n.isRead).length;
      
      store.dispatch(setNotifications({
        notifications,
        pagination: { currentPage: 1, totalPages: 1, totalItems: notifications.length },
      }));
      
      store.dispatch(setUnreadCount(unreadCount));
    } else {
      // Other errors - set error state but don't break UI
      console.log('⚠️ Non-404 error, using mock data as fallback');
      const notifications = mockNotifications || [];
      const unreadCount = notifications.filter((n: any) => !n.isRead).length;
      
      store.dispatch(setNotifications({
        notifications,
        pagination: { currentPage: 1, totalPages: 1, totalItems: notifications.length },
      }));
      
      store.dispatch(setUnreadCount(unreadCount));
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
  
  try {
    const response = await getNotifications(1);
    
    if (response.success && response.data) {
      const { notifications, unreadCount, pagination } = response.data;
      
      store.dispatch(setNotifications({
        notifications: notifications || [],
        pagination: pagination || { currentPage: 1, totalPages: 1, totalItems: 0 },
      }));
      
      store.dispatch(setUnreadCount(unreadCount || 0));
    }
  } catch (error: any) {
    console.log('Error refreshing notifications:', error);
    
    // Handle 404 gracefully
    if (error?.response?.status === 404) {
      const notifications = mockNotifications || [];
      const unreadCount = notifications.filter((n: any) => !n.isRead).length;
      
      store.dispatch(setNotifications({
        notifications,
        pagination: { currentPage: 1, totalPages: 1, totalItems: notifications.length },
      }));
      
      store.dispatch(setUnreadCount(unreadCount));
    }
  } finally {
    store.dispatch(setRefreshing(false));
  }
};

/**
 * Mark notification as read
 */
export const markNotificationRead = async (notificationId: string, userId: string) => {
  try {
    await markNotificationAsRead(notificationId, userId);
    store.dispatch(markAsRead(notificationId));
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
  try {
    await markAllNotificationsAsRead(userId);
    store.dispatch(markAllAsReadAction());
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
    // Note: Delete endpoint not yet in client API, but handle gracefully
    store.dispatch(deleteNotificationAction(notificationId));
    return { success: true };
  } catch (error: any) {
    console.log('Error deleting notification:', error);
    
    // Still delete locally
    store.dispatch(deleteNotificationAction(notificationId));
    return { success: true };
  }
};

/**
 * Get unread count only
 * Useful for badge updates without loading full list
 */
export const getUnreadCount = async (userId: string) => {
  try {
    const response = await getNotifications(1);
    
    if (response.success && response.data?.unreadCount !== undefined) {
      store.dispatch(setUnreadCount(response.data.unreadCount));
      return response.data.unreadCount;
    }
  } catch (error: any) {
    console.log('Error getting unread count:', error);
    
    // Handle 404 - calculate from mock data
    if (error?.response?.status === 404) {
      const notifications = mockNotifications || [];
      const unreadCount = notifications.filter((n: any) => !n.isRead).length;
      store.dispatch(setUnreadCount(unreadCount));
      return unreadCount;
    }
  }
  
  return 0;
};
