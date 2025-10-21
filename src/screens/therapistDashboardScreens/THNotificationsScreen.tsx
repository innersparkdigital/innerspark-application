import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import { appColors, appFonts } from '../../global/Styles';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';

// Mock data for notifications
const mockNotifications = [
  {
    id: '1',
    type: 'appointment',
    title: 'New Appointment Request',
    message: 'John Doe requested an appointment for tomorrow at 10:00 AM',
    time: '5m ago',
    read: false,
    icon: 'calendar-today',
    iconColor: appColors.AppBlue,
  },
  {
    id: '2',
    type: 'message',
    title: 'New Message',
    message: 'Sarah Williams sent you a message',
    time: '15m ago',
    read: false,
    icon: 'message',
    iconColor: appColors.AppGreen,
  },
  {
    id: '3',
    type: 'group',
    title: 'Group Session Starting Soon',
    message: 'Anxiety Support Circle starts in 30 minutes',
    time: '30m ago',
    read: false,
    icon: 'people',
    iconColor: '#FF9800',
  },
  {
    id: '4',
    type: 'reminder',
    title: 'Session Reminder',
    message: 'You have a session with Michael Brown at 2:00 PM',
    time: '1h ago',
    read: true,
    icon: 'notifications',
    iconColor: appColors.grey3,
  },
  {
    id: '5',
    type: 'feedback',
    title: 'New Client Feedback',
    message: 'Emily Chen left feedback for your last session',
    time: '2h ago',
    read: true,
    icon: 'star',
    iconColor: '#FFD700',
  },
];

const THNotificationsScreen = ({ navigation }: any) => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
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
