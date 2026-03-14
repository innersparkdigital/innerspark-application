/**
 * Notification Screen - Displays user notifications with professional UI
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Avatar, Badge } from '@rneui/base';
import { Swipeable } from 'react-native-gesture-handler';
import { appColors, parameters, appFonts } from '../global/Styles';
import { scale, moderateScale } from '../global/Scaling';
import { useToast } from 'native-base';
import { NavigationProp } from '@react-navigation/native';
import ISGenericHeader from '../components/ISGenericHeader';
import {
  selectNotifications,
  selectUnreadCount,
  selectNotificationsLoading,
  selectNotificationsRefreshing,
} from '../features/notifications/notificationSlice';
import {
  loadNotifications,
  refreshNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from '../utils/notificationManager';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'appointment' | 'reminder' | 'system' | 'event' | 'goal';
  timestamp: string;
  isRead: boolean;
  avatar?: any;
  actionData?: any;
}

interface NotificationScreenProps {
  navigation: NavigationProp<any>;
}

const NotificationScreen: React.FC<NotificationScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const userDetails = useSelector((state: any) => state.userData.userDetails);

  // Get data from Redux
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const isLoading = useSelector(selectNotificationsLoading);
  const isRefreshing = useSelector(selectNotificationsRefreshing);

  // Load notifications when coming into focus
  useFocusEffect(
    useCallback(() => {
      if (userDetails?.userId) {
        refreshNotifications(userDetails.userId);
      }
    }, [userDetails?.userId])
  );

  useEffect(() => {
    if (userDetails?.userId) {
      loadNotifications(userDetails.userId);
    }
  }, [userDetails?.userId]);

  const handleRefresh = async () => {
    if (userDetails?.userId) {
      await refreshNotifications(userDetails.userId);
    }
  };

  const handleNotificationPress = async (notification: Notification) => {
    // Mark as read
    if (!notification.isRead && userDetails?.userId) {
      await markNotificationRead(notification.id.toString(), userDetails.userId);
    }

    // Navigate to detail screen
    navigation.navigate('NotificationDetailScreen', { notification });
  };

  const handleMarkAsRead = async (notificationId: number) => {
    if (userDetails?.userId) {
      const result = await markNotificationRead(notificationId.toString(), userDetails.userId);
      if (result.success) {
        toast.show({
          description: 'Notification marked as read',
          duration: 2000,
        });
      }
    }
  };

  const handleDismissNotification = async (notificationId: number) => {
    const result = await deleteNotification(notificationId.toString());
    if (result.success) {
      toast.show({
        description: 'Notification dismissed',
        duration: 2000,
      });
    }
  };

  const handleArchiveNotification = async (notificationId: number) => {
    // Archive is same as marking as read for now
    if (userDetails?.userId) {
      const result = await markNotificationRead(notificationId.toString(), userDetails.userId);
      if (result.success) {
        toast.show({
          description: 'Notification archived',
          duration: 2000,
        });
      }
    }
  };

  const markAllAsRead = async () => {
    if (userDetails?.userId) {
      const result = await markAllNotificationsRead(userDetails.userId);
      if (result.success) {
        toast.show({
          description: 'All notifications marked as read',
          duration: 2000,
        });
      }
    }
  };

  const getNotificationIcon = (type: string) => {
    const iconMap = {
      appointment: { name: 'event', color: appColors.AppBlue },
      reminder: { name: 'notifications', color: '#FF9800' },
      system: { name: 'info', color: appColors.grey2 },
      event: { name: 'event-available', color: '#4CAF50' },
      goal: { name: 'flag', color: '#9C27B0' },
    };
    return iconMap[type as keyof typeof iconMap] || iconMap.system;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  // unreadCount already from Redux

  const NotificationCard: React.FC<{ notification: Notification }> = ({ notification }) => {
    const iconConfig = getNotificationIcon(notification.type);

    const renderRightActions = () => (
      <View style={styles.rightActions}>
        {!notification.isRead && (
          <TouchableOpacity
            style={[styles.actionButton, styles.readAction]}
            onPress={() => handleMarkAsRead(notification.id)}
          >
            <Icon name="done" type="material" color={appColors.CardBackground} size={moderateScale(20)} />
            <Text style={styles.actionText}>Read</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionButton, styles.archiveAction]}
          onPress={() => handleArchiveNotification(notification.id)}
        >
          <Icon name="archive" type="material" color={appColors.CardBackground} size={moderateScale(20)} />
          <Text style={styles.actionText}>Archive</Text>
        </TouchableOpacity>
      </View>
    );

    const renderLeftActions = () => (
      <View style={styles.leftActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.dismissAction]}
          onPress={() => handleDismissNotification(notification.id)}
        >
          <Icon name="delete" type="material" color={appColors.CardBackground} size={moderateScale(20)} />
          <Text style={styles.actionText}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    );

    return (
      <Swipeable
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
        rightThreshold={40}
        leftThreshold={40}
      >
        <TouchableOpacity
          style={[styles.notificationCard, !notification.isRead && styles.unreadCard]}
          onPress={() => handleNotificationPress(notification)}
          activeOpacity={0.7}
        >
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              {notification.avatar ? (
                <Avatar source={notification.avatar} size={40} rounded />
              ) : (
                <View style={[styles.iconWrapper, { backgroundColor: iconConfig.color + '20' }]}>
                  <Icon
                    name={iconConfig.name}
                    type="material"
                    color={iconConfig.color}
                    size={moderateScale(20)}
                  />
                </View>
              )}
              {!notification.isRead && <Badge status="error" containerStyle={styles.unreadBadge} />}
            </View>

            <View style={styles.contentContainer}>
              <View style={styles.headerRow}>
                <Text style={[styles.title, !notification.isRead && styles.unreadTitle]}>
                  {notification.title}
                </Text>
                <Text style={styles.timestamp}>
                  {formatTimestamp(notification.timestamp)}
                </Text>
              </View>

              <Text style={styles.message} numberOfLines={2}>
                {notification.message}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Icon name="notifications-paused" type="material" color={appColors.AppBlue} size={moderateScale(50)} />
      </View>
      <Text style={styles.emptyTitle}>In the Loop</Text>
      <Text style={styles.emptySubtitle}>You're all caught up! We'll notify you when something important happens.</Text>
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={handleRefresh}
        activeOpacity={0.8}
      >
        <Icon name="refresh" type="material" color={appColors.CardBackground} size={moderateScale(20)} style={{ marginRight: scale(8) }} />
        <Text style={styles.refreshButtonText}>Check for Updates</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ISGenericHeader
        title="Notifications"
        hasRightIcon={false}
        //hasLightBackground={true}
        navigation={navigation}
      />

      <View style={styles.content}>
        {notifications.length === 0 && !isLoading ? (
          <EmptyState />
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <NotificationCard notification={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={[appColors.AppBlue]}
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(20),
  },
  listContainer: {
    paddingVertical: scale(10),
    flexGrow: 1,
  },
  notificationCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(16),
    marginBottom: scale(12),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  unreadCard: {
    borderLeftWidth: scale(4),
    borderLeftColor: appColors.AppBlue,
    backgroundColor: appColors.AppBlue + '05',
  },
  cardContent: {
    flexDirection: 'row',
    padding: scale(16),
  },
  iconContainer: {
    marginRight: scale(12),
    position: 'relative',
  },
  iconWrapper: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadge: {
    position: 'absolute',
    top: scale(-2),
    right: scale(-2),
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: scale(4),
  },
  title: {
    fontSize: moderateScale(16),
    color: appColors.grey1,
    fontFamily: appFonts.headerTextMedium,
    flex: 1,
    marginRight: scale(8),
  },
  unreadTitle: {
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  timestamp: {
    fontSize: moderateScale(12),
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
  },
  message: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    lineHeight: moderateScale(20),
    fontFamily: appFonts.headerTextRegular,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(40),
  },
  emptyIconCircle: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    backgroundColor: appColors.AppBlue + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(24),
  },
  emptyTitle: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: scale(12),
  },
  emptySubtitle: {
    fontSize: moderateScale(15),
    color: appColors.grey2,
    textAlign: 'center',
    lineHeight: moderateScale(22),
    fontFamily: appFonts.headerTextRegular,
    marginBottom: scale(32),
  },
  refreshButton: {
    flexDirection: 'row',
    backgroundColor: appColors.AppBlue,
    paddingVertical: scale(12),
    paddingHorizontal: scale(24),
    borderRadius: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: appColors.AppBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  refreshButtonText: {
    color: appColors.CardBackground,
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  // Swipe Actions Styles
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingLeft: scale(20),
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: scale(20),
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: scale(80),
    height: '100%',
    paddingVertical: scale(16),
  },
  readAction: {
    backgroundColor: '#4CAF50',
  },
  archiveAction: {
    backgroundColor: '#FF9800',
  },
  dismissAction: {
    backgroundColor: '#F44336',
  },
  actionText: {
    color: appColors.CardBackground,
    fontSize: moderateScale(12),
    fontWeight: 'bold',
    marginTop: scale(4),
    fontFamily: appFonts.headerTextBold,
  },
});

export default NotificationScreen;