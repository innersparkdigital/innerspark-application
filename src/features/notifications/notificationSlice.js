/**
 * Notification Redux Slice
 * Manages notification state including list, unread count, and loading states
 */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  isRefreshing: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Set notifications list
    setNotifications: (state, action) => {
      const { notifications, pagination } = action.payload;
      state.notifications = notifications || [];
      if (pagination) {
        state.pagination = pagination;
      }
    },

    // Append notifications (for pagination)
    appendNotifications: (state, action) => {
      const { notifications, pagination } = action.payload;
      state.notifications = [...state.notifications, ...(notifications || [])];
      if (pagination) {
        state.pagination = pagination;
      }
    },

    // Set unread count
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },

    // Mark notification as read
    markAsRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(n => n.id === notificationId);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    // Mark all as read
    markAllAsRead: (state) => {
      state.notifications = state.notifications.map(n => ({ ...n, isRead: true }));
      state.unreadCount = 0;
    },

    // Delete notification
    deleteNotification: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(n => n.id === notificationId);
      if (notification && !notification.isRead) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter(n => n.id !== notificationId);
    },

    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Set refreshing state
    setRefreshing: (state, action) => {
      state.isRefreshing = action.payload;
    },

    // Set error
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isRefreshing = false;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear all notifications
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.pagination = initialState.pagination;
    },
  },
});

export const {
  setNotifications,
  appendNotifications,
  setUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  setLoading,
  setRefreshing,
  setError,
  clearError,
  clearNotifications,
} = notificationSlice.actions;

// Selectors
export const selectNotifications = (state) => state.notifications.notifications;
export const selectUnreadCount = (state) => state.notifications.unreadCount;
export const selectNotificationsLoading = (state) => state.notifications.isLoading;
export const selectNotificationsRefreshing = (state) => state.notifications.isRefreshing;
export const selectNotificationsError = (state) => state.notifications.error;
export const selectNotificationsPagination = (state) => state.notifications.pagination;

export default notificationSlice.reducer;
