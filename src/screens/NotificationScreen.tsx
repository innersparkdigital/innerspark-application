/**
 * Notification Screen - Displays user notifications with professional UI
 */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Avatar, Badge } from '@rneui/base';
import { Swipeable } from 'react-native-gesture-handler';
import { appColors, parameters, appFonts } from '../global/Styles';
import { useToast } from 'native-base';
import { NavigationProp } from '@react-navigation/native';
import ISGenericHeader from '../components/ISGenericHeader';

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock notification data
  const mockNotifications: Notification[] = [
    {
      id: 1,
      title: 'Appointment Reminder',
      message: 'Your session with Dr. Martin Pilier is scheduled for tomorrow at 2:00 PM',
      type: 'appointment',
      timestamp: '2024-01-14T10:30:00Z',
      isRead: false,
      avatar: require('../assets/images/dummy-people/d-person1.png'),
      actionData: { therapistId: 1 }
    },
    {
      id: 2,
      title: 'Goal Achievement',
      message: 'Congratulations! You completed your daily mindfulness goal',
      type: 'goal',
      timestamp: '2024-01-14T08:15:00Z',
      isRead: false,
      actionData: { goalId: 3 }
    },
    {
      id: 3,
      title: 'New Event Available',
      message: 'Mental Health First Aid Training is now open for registration',
      type: 'event',
      timestamp: '2024-01-13T16:45:00Z',
      isRead: true,
      actionData: { eventId: 2 }
    },
    {
      id: 4,
      title: 'Mood Check-in',
      message: 'How are you feeling today? Take a moment to log your mood',
      type: 'reminder',
      timestamp: '2024-01-13T09:00:00Z',
      isRead: true,
    },
    {
      id: 5,
      title: 'System Update',
      message: 'New features added: Enhanced goal tracking and event calendar',
      type: 'system',
      timestamp: '2024-01-12T14:20:00Z',
      isRead: true,
    },
    {
      id: 6,
      title: 'Weekly Progress',
      message: 'Your wellness journey this week: 5 goals completed, 2 sessions attended',
      type: 'system',
      timestamp: '2024-01-12T10:00:00Z',
      isRead: true,
    }
  ];

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setNotifications(mockNotifications);
    } catch (error) {
      toast.show({
        description: 'Failed to load notifications',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadNotifications();
    setIsRefreshing(false);
  };

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    );

    // Navigate to detail screen
    navigation.navigate('NotificationDetailScreen', { notification });
  };

  const handleMarkAsRead = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
    toast.show({
      description: 'Notification marked as read',
      duration: 2000,
    });
  };

  const handleDismissNotification = (notificationId: number) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    toast.show({
      description: 'Notification dismissed',
      duration: 2000,
    });
  };

  const handleArchiveNotification = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true, archived: true } : n)
    );
    toast.show({
      description: 'Notification archived',
      duration: 2000,
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.show({
      description: 'All notifications marked as read',
      duration: 2000,
    });
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

  const unreadCount = notifications.filter(n => !n.isRead).length;

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