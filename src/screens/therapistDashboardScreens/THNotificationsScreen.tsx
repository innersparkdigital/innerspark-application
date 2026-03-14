import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Animated, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Swipeable } from 'react-native-gesture-handler';
import { Icon } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { appColors, appFonts } from '../../global/Styles';
import { scale } from '../../global/Scaling';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../api/therapist';
import { moderateScale } from '../../global/Scaling';



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
      const therapistId = userDetails?.userId;

      const response: any = await getNotifications(therapistId);

      if (response?.data?.notifications) {
        setNotifications(response.data.notifications);
      } else {
        setNotifications([]);
      }
    } catch (error: any) {
      const errorMessage = error.backendMessage || error.message || 'Failed to load notifications';
      console.error('Failed to load notifications:', errorMessage);
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
      const therapistId = userDetails?.userId;
      // Optimistic update
      setNotifications(notifications.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      ));
      await markNotificationAsRead(id, therapistId);
    } catch (error: any) {
      const errorMessage = error.backendMessage || error.message || 'Failed to mark notification read';
      console.error('Failed to mark notification read:', errorMessage);
      // Revert or show error if needed, but for read status silent fail is often acceptable
    }
  };

  const markAllAsRead = async () => {
    try {
      const therapistId = userDetails?.userId;
      // Optimistic update
      setNotifications(notifications.map(notif => ({ ...notif, read: true })));
      await markAllNotificationsAsRead(therapistId);
    } catch (error: any) {
      const errorMessage = error.backendMessage || error.message || 'Failed to mark all read';
      console.error('Failed to mark all read:', errorMessage);
    }
  };

  const deleteNotification = (id: string) => {
    // Optimistic remove (assuming backend handles decay or we'd add a DELETE endpoint later)
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type: string, title?: string) => {
    const lowerType = type?.toLowerCase() || '';
    const lowerTitle = title?.toLowerCase() || '';
    
    if (lowerType.includes('appointment') || lowerTitle.includes('session')) 
      return { name: 'event', color: appColors.AppBlue };
    if (lowerType.includes('message') || lowerTitle.includes('chat')) 
      return { name: 'chat', color: '#FF9800' };
    if (lowerType.includes('group')) 
      return { name: 'groups', color: appColors.AppGreen };
    if (lowerType.includes('alert') || lowerType.includes('system')) 
      return { name: 'info', color: appColors.grey2 };
    if (lowerType.includes('event')) 
      return { name: 'campaign', color: '#9C27B0' };
      
    // Default Fallback
    return { name: 'notifications', color: appColors.AppBlue };
  };

  const renderNotificationItem = ({ item }: { item: any }) => {
    const iconConfig = getNotificationIcon(item.type, item.title);
    
    return (
      <Swipeable
        key={item.id}
        renderRightActions={() => renderRightActions(item.id)}
        overshootRight={false}
        containerStyle={styles.swipeableContainer}
      >
        <TouchableOpacity
          style={[
            styles.notificationCard,
            !item.read && styles.notificationCardUnread
          ]}
          onPress={() => markAsRead(item.id)}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, { backgroundColor: (item.iconColor || iconConfig.color) + '15' }]}>
            <Icon
              type="material"
              name={item.icon || iconConfig.name}
              size={moderateScale(24)}
              color={item.iconColor || iconConfig.color}
            />
          </View>

          <View style={styles.notificationContent}>
            <View style={styles.notificationHeader}>
              <Text style={[styles.notificationTitle, !item.read && styles.notificationTitleUnread]}>{item.title}</Text>
              {!item.read && <View style={styles.unreadDot} />}
            </View>
            <Text
              style={[
                styles.notificationMessage,
                !item.read && styles.notificationMessageUnread
              ]}
              numberOfLines={2}
            >
              {item.message}
            </Text>
            <Text style={styles.notificationTime}>{item.time || 'Today'}</Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  const renderRightActions = (id: string) => {
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => deleteNotification(id)}
      >
        <Icon type="material" name="delete-outline" size={28} color="#FFFFFF" />
        <Text style={styles.deleteActionText}>Dismiss</Text>
      </TouchableOpacity>
    );
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
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={appColors.AppBlue} />
          </View>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item: any) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[appColors.AppBlue]} />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <View style={styles.emptyIconCircle}>
                  <Icon type="material" name="notifications-none" size={moderateScale(50)} color={appColors.AppBlue} />
                </View>
                <Text style={styles.emptyStateText}>In the Loop</Text>
                <Text style={styles.emptyStateSubtext}>
                  You're all caught up! Updates about appointments and messages will appear here.
                </Text>
                <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
                  <Text style={styles.refreshButtonText}>Check for Updates</Text>
                </TouchableOpacity>
              </View>
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
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  notificationCardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: appColors.AppBlue,
    backgroundColor: appColors.AppBlue + '05',
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
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextMedium,
    flex: 1,
  },
  notificationTitleUnread: {
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
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
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: appColors.AppBlue + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 12,
  },
  emptyStateSubtext: {
    fontSize: 15,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  refreshButton: {
    backgroundColor: appColors.AppBlue,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 4,
    shadowColor: appColors.AppBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  swipeableContainer: {
    marginBottom: 12,
  },
  deleteAction: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderRadius: 12,
  },
  deleteActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: appFonts.bodyTextMedium,
    marginTop: 4,
  },
  notificationMessageUnread: {
    color: appColors.grey1,
    fontWeight: '600',
    fontFamily: appFonts.bodyTextMedium,
  },
});

export default THNotificationsScreen;
