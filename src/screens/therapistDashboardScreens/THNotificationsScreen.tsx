import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { appColors, appFonts } from '../../global/Styles';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../api/therapist';



const THNotificationsScreen = ({ navigation }: any) => {
  const userDetails = useSelector((state: any) => state.userData.userDetails);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const therapistId = userDetails?.id || '52863268761';

      const response: any = await getNotifications(therapistId);

      if (response?.data?.notifications) {
        setNotifications(response.data.notifications);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const markAsRead = async (id: string) => {
    try {
      const therapistId = userDetails?.id || '52863268761';
      // Optimistic update
      setNotifications(notifications.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      ));
      await markNotificationAsRead(id, therapistId);
    } catch (error) {
      console.error('Failed to mark notification read:', error);
      // Revert or show error if needed, but for read status silent fail is often acceptable
    }
  };

  const markAllAsRead = async () => {
    try {
      const therapistId = userDetails?.id || '52863268761';
      // Optimistic update
      setNotifications(notifications.map(notif => ({ ...notif, read: true })));
      await markAllNotificationsAsRead(therapistId);
    } catch (error) {
      console.error('Failed to mark all read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />

      <ISGenericHeader
        title="Notifications"
        navigation={navigation}
      />

      <View style={styles.content}>
        {/* Header with Mark All Read */}
        {unreadCount > 0 && (
          <View style={styles.header}>
            <Text style={styles.headerText}>
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </Text>
            <TouchableOpacity onPress={markAllAsRead}>
              <Text style={styles.markAllText}>Mark all as read</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Notifications List */}
        <ScrollView style={styles.notificationsList} showsVerticalScrollIndicator={false}>
          {notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.read && styles.notificationCardUnread
              ]}
              onPress={() => markAsRead(notification.id)}
            >
              <View style={[styles.iconContainer, { backgroundColor: notification.iconColor + '20' }]}>
                <Icon
                  type="material"
                  name={notification.icon}
                  size={24}
                  color={notification.iconColor}
                />
              </View>

              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  {!notification.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notificationMessage} numberOfLines={2}>
                  {notification.message}
                </Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* Empty State */}
          {notifications.length === 0 && (
            <View style={styles.emptyState}>
              <Icon type="material" name="notifications-none" size={64} color={appColors.grey4} />
              <Text style={styles.emptyStateText}>No notifications yet</Text>
              <Text style={styles.emptyStateSubtext}>
                You'll see updates about appointments, messages, and more here
              </Text>
            </View>
          )}
        </ScrollView>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey6,
  },
  headerText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextMedium,
    fontWeight: '600',
  },
  markAllText: {
    fontSize: 14,
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextMedium,
    fontWeight: '600',
  },
  notificationsList: {
    flex: 1,
    padding: 16,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notificationCardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: appColors.AppBlue,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: appColors.AppBlue,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: 12,
    color: appColors.grey4,
    fontFamily: appFonts.bodyTextRegular,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default THNotificationsScreen;
