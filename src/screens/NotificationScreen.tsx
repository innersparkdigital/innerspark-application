/**
 * Notification Screen - Displays user notifications with professional UI
 */
import React, { useState, useEffect } from 'react';
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
            <Icon name="done" type="material" color={appColors.CardBackground} size={20} />
            <Text style={styles.actionText}>Read</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionButton, styles.archiveAction]}
          onPress={() => handleArchiveNotification(notification.id)}
        >
          <Icon name="archive" type="material" color={appColors.CardBackground} size={20} />
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
          <Icon name="delete" type="material" color={appColors.CardBackground} size={20} />
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
                    size={20}
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
      <Icon name="notifications-none" type="material" color={appColors.AppGray} size={80} />
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptySubtitle}>You're all caught up! Check back later for updates.</Text>
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
          ListEmptyComponent={!isLoading ? <EmptyState /> : null}
        />
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
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingVertical: 10,
  },
  notificationCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: appColors.AppBlue,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  iconContainer: {
    marginRight: 12,
    position: 'relative',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.headerTextMedium,
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  timestamp: {
    fontSize: 12,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
  },
  message: {
    fontSize: 14,
    color: appColors.grey2,
    lineHeight: 20,
    fontFamily: appFonts.headerTextRegular,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginTop: 16,
    fontFamily: appFonts.headerTextBold,
  },
  emptySubtitle: {
    fontSize: 14,
    color: appColors.grey2,
    textAlign: 'center',
    marginTop: 8,
    marginHorizontal: 40,
    fontFamily: appFonts.headerTextRegular,
  },
  // Swipe Actions Styles
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingLeft: 20,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 20,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: '100%',
    paddingVertical: 16,
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
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
    fontFamily: appFonts.headerTextBold,
  },
});

export default NotificationScreen;