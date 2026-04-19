import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, RefreshControl, ActivityIndicator, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Swipeable } from 'react-native-gesture-handler';
import { Icon, Avatar, Badge, Skeleton } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { appColors, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';
import { 
  loadNotifications, 
  refreshNotifications, 
  markNotificationRead, 
  markAllNotificationsRead, 
  deleteNotification 
} from '../../utils/notificationManager';
import { 
  selectNotifications, 
  selectNotificationsLoading, 
  selectNotificationsRefreshing, 
  selectUnreadCount 
} from '../../features/notifications/notificationSlice';

const THNotificationsScreen = ({ navigation }: any) => {
  const userDetails = useSelector((state: any) => state.userData.userDetails);
  const notifications = useSelector(selectNotifications);
  const loading = useSelector(selectNotificationsLoading);
  const refreshing = useSelector(selectNotificationsRefreshing);
  const unreadCount = useSelector(selectUnreadCount);

  useEffect(() => {
    if (userDetails?.userId) {
      loadNotifications(userDetails.userId);
    }
  }, [userDetails?.userId]);

  const onRefresh = async () => {
    if (userDetails?.userId) {
      await refreshNotifications(userDetails.userId);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    if (userDetails?.userId) {
      await markNotificationRead(id, userDetails.userId);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (userDetails?.userId) {
      await markAllNotificationsRead(userDetails.userId);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    await deleteNotification(id);
  };

  const handleNotificationPress = (item: any) => {
    navigation.navigate('THNotificationDetailScreen', { notification: item });
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
          style={[styles.notificationCard, !item.isRead && styles.notificationCardUnread]}
          onPress={() => handleNotificationPress(item)}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            {item.avatar || item.senderAvatar ? (
              <Avatar source={{ uri: item.avatar || item.senderAvatar }} size={moderateScale(48)} rounded />
            ) : (
              <View style={[styles.iconWrapper, { backgroundColor: (item.iconColor || iconConfig.color) + '15' }]}>
                <Icon type="material" name={item.icon || iconConfig.name} size={moderateScale(24)} color={item.iconColor || iconConfig.color} />
              </View>
            )}
            {!item.isRead && <Badge status="error" containerStyle={styles.unreadBadge} />}
          </View>
          <View style={styles.notificationContent}>
            <Text style={[styles.notificationTitle, !item.isRead && styles.notificationTitleUnread]}>{item.title}</Text>
            <Text style={[styles.notificationMessage, !item.isRead && styles.notificationMessageUnread]} numberOfLines={2}>{item.message}</Text>
            <Text style={styles.notificationTime}>{formatTimestamp(item.timestamp)}</Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  const renderRightActions = (id: string) => (
    <TouchableOpacity style={styles.deleteAction} onPress={() => handleDeleteNotification(id)}>
      <Icon type="material" name="delete-outline" size={28} color="#FFFFFF" />
      <Text style={styles.deleteActionText}>Dismiss</Text>
    </TouchableOpacity>
  );

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return 'Today';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return timestamp;
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const NotificationSkeleton = () => (
    <View style={styles.notificationCard}>
      <View style={styles.iconContainer}><Skeleton animation="pulse" width={48} height={48} style={{ borderRadius: 24 }} /></View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}><Skeleton animation="pulse" width="60%" height={20} style={{ marginBottom: 4, borderRadius: 4 }} /></View>
        <Skeleton animation="pulse" width="90%" height={14} style={{ marginBottom: 6, borderRadius: 4 }} />
        <Skeleton animation="pulse" width="40%" height={12} style={{ borderRadius: 4 }} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />
      <ISGenericHeader
        title="Notifications"
        navigation={navigation}
        hasRightIcon={notifications.some((n: any) => !n.isRead)}
        rightIconName="done-all"
        rightIconOnPress={handleMarkAllAsRead}
        rightIconSize={24}
      />
      <View style={styles.content}>
        {unreadCount > 0 && (
          <View style={styles.header}>
            <Text style={styles.headerText}>{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</Text>
            <TouchableOpacity onPress={handleMarkAllAsRead}><Text style={styles.markAllText}>Mark all as read</Text></TouchableOpacity>
          </View>
        )}
        {loading && !refreshing ? (
          <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
            {[1, 2, 3, 4, 5, 6].map((i) => <NotificationSkeleton key={i} />)}
          </ScrollView>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item: any) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[appColors.AppBlue]} />}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <View style={styles.emptyIconCircle}><Icon type="material" name="notifications-none" size={moderateScale(50)} color={appColors.AppBlue} /></View>
                <Text style={styles.emptyStateText}>In the Loop</Text>
                <Text style={styles.emptyStateSubtext}>You're all caught up! Updates about appointments and messages will appear here.</Text>
                <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}><Text style={styles.refreshButtonText}>Check for Updates</Text></TouchableOpacity>
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
    padding: scale(16),
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
    padding: scale(16),
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
    marginRight: 12,
    position: 'relative',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
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
