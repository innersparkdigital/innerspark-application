/**
 * My Groups Screen - Display user's joined support groups
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActionSheetIOS,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Avatar, Icon, Button } from '@rneui/base';
import { appColors, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import { useToast } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import { getMyGroups, leaveGroup, renewGroupSubscription, getGroupCohortAvailability } from '../../api/client/groups';
import { getImageSource, FALLBACK_IMAGES } from '../../utils/imageHelpers';
import ISAlert, { useISAlert } from '../../components/alerts/ISAlert';
import { removeJoinedGroupId, setJoinedGroupIds } from '../../features/groups/groupsSlice';
import { decodeHTMLEntities } from '../../utils/textHelpers';
import { getGroupChatStatus, validateChatAccess } from '../../utils/GroupUtils';

interface MyGroup {
  id: string;
  name: string;
  description: string;
  therapistName: string;
  therapistAvatar?: any;
  memberCount: number;
  icon: string;
  category: 'anxiety' | 'depression' | 'addiction' | 'trauma' | 'general';
  lastActivity: string;
  unreadMessages: number;
  nextMeeting: string;
  isActive: boolean;
  role: 'member' | 'moderator';
  membership_status?: 'ACTIVE' | 'PENDING' | 'EXPIRED';
  expiry_date?: string;
  therapistSpecialization?: string;
  attendance?: string;
  icon_url?: string;
  startDate?: string;
  joinedDate?: string;
  availability?: any;
}

interface MyGroupsScreenProps {
  navigation: any;
  onTabChange?: (tab: 'directory' | 'mygroups') => void;
}

const MyGroupsScreen: React.FC<MyGroupsScreenProps> = ({ navigation, onTabChange }) => {
  const toast = useToast();
  const alert = useISAlert();
  const dispatch = useDispatch();
  const userId = useSelector((state: any) => state.userData.userDetails.userId);
  const [myGroups, setMyGroups] = useState<MyGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadMyGroups();
  }, []);

  // Load my groups
  const loadMyGroups = async () => {
    setIsLoading(true);
    try {
      console.log('📞 Calling getMyGroups API (MyGroupsScreen)...');
      const response = await getMyGroups(userId);
      console.log('✅ My Groups API Response (MyGroupsScreen):', JSON.stringify(response, null, 2));

      const apiGroups = response.data?.groups || [];
      const mappedGroups: MyGroup[] = apiGroups.map((group: any) => ({
        id: group.id?.toString() || group._id?.toString(),
        name: decodeHTMLEntities(group.name || group.groupName || group.group_name || 'Unnamed Group'),
        description: decodeHTMLEntities(group.description || ''),
        therapistName: decodeHTMLEntities(group.therapistName || group.therapist_name || group.facilitatorName || group.facilitator_name || 'Unknown'),
        therapistAvatar: getImageSource(group.therapistAvatar || group.therapist_avatar || group.facilitatorAvatar || group.facilitator_avatar, FALLBACK_IMAGES.avatar),
        memberCount: group.memberCount || group.member_count || group.membersCount || group.members_count || 0,
        icon: group.icon || 'group',
        category: group.category || 'general',
        lastActivity: group.lastActivity || group.last_activity || 'Unknown',
        unreadMessages: group.unreadMessages || group.unread_messages || group.unreadCount || group.unread_count || 0,
        nextMeeting: group.nextMeeting || group.next_meeting || group.upcomingMeeting || group.upcoming_meeting || 'No upcoming meeting',
        isActive: group.isActive || group.is_active !== false,
        role: group.role || group.userRole || group.user_role || 'member',
        membership_status: group.membership_status || 'ACTIVE',
        expiry_date: group.expiry_date || null,
        therapistSpecialization: decodeHTMLEntities(group.therapistSpecialization || group.therapist_specialization || ''),
        attendance: group.attendance || '0%',
        icon_url: group.icon_url || group.image,
        startDate: group.next_cohort_start_date || group.startDate,
        joinedDate: group.joinedDate || group.joined_date,
      }));

      setMyGroups(mappedGroups);
      // Sync Redux
      const joinedIds = mappedGroups.map(g => g.id);
      dispatch(setJoinedGroupIds(joinedIds));

      // Background fetch availability for each group to ensure security sync
      fetchAvailabilityForGroups(mappedGroups);

      console.log('✅ Mapped My Groups:', mappedGroups.length);
    } catch (error: any) {
      console.error('❌ Error loading my groups:', error);
      toast.show({
        description: error.response?.data?.message || 'Failed to load your groups. Please try again.',
        duration: 3000,
      });
      setMyGroups([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Background availability fetcher
  const fetchAvailabilityForGroups = async (groups: MyGroup[]) => {
    groups.forEach(async (group) => {
      try {
        const availResponse = await getGroupCohortAvailability(group.id);
        if (availResponse?.data) {
          setMyGroups(prev => prev.map(g => 
            g.id === group.id ? { 
              ...g, 
              availability: availResponse.data,
              startDate: availResponse.data.next_cohort_start_date || g.startDate 
            } : g
          ));
        }
      } catch (err) {
        console.warn(`Failed to fetch availability for group ${group.id}`, err);
      }
    });
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadMyGroups();
    setIsRefreshing(false);
  };

  const handleOpenChat = (group: MyGroup) => {
    const cohortDate = group.availability?.next_cohort_start_date || group.startDate;

    // Validate access based on cohort start date using reusable utility
    if (!validateChatAccess(cohortDate, alert)) {
      return;
    }

    navigation.navigate('GroupChatScreen', {
      groupId: group.id,
      groupName: group.name,
      groupIcon: group.icon,
      memberCount: group.memberCount,
      userRole: group.role,
    });
  };



  // Handle group details
  const handleGroupDetails = (group: MyGroup) => {
    navigation.navigate('GroupDetailScreen', { group });
  };

  // Handle leave group
  const handleLeaveGroup = (group: MyGroup) => {
    alert.show({
      type: 'destructive',
      title: 'Leave Group',
      message: `Are you sure you want to leave "${group.name}"? You can rejoin later if there's space.`,
      confirmText: 'Leave',
      cancelText: 'Cancel',
      onConfirm: async () => {
        try {
          console.log('📞 Calling leaveGroup API...');
          console.log('Group ID:', group.id);
          console.log('User ID:', userId);

          // Call API to leave group with required body string configurations
          const response = await leaveGroup(
            group.id,
            userId,
            'Schedule conflict',
            'Great group, but can\'t attend anymore'
          );
          console.log('✅ Leave group response:', response);

          // Sync Global Redux removal
          dispatch(removeJoinedGroupId(group.id));

          // Remove group from list
          setMyGroups(prev => prev.filter(g => g.id !== group.id));

          toast.show({
            description: response.message || `You have left ${group.name}`,
            duration: 3000,
          });

          // Reload groups to get fresh data
          await loadMyGroups();
        } catch (error: any) {
          console.error('❌ Error leaving group:', error);

          // Handle specific error cases
          if (error.response?.data?.error) {
            toast.show({
              description: error.response.data.error,
              duration: 3000,
            });
          } else {
            toast.show({
              description: 'Failed to leave group. Please try again.',
              duration: 3000,
            });
          }
        }
      },
    });
  };

  // Handle group menu
  const handleGroupMenu = (group: MyGroup) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'View Details', 'Leave Group'],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handleGroupDetails(group);
          } else if (buttonIndex === 2) {
            handleLeaveGroup(group);
          }
        }
      );
    } else {
      // Android - use ISAlert with actions
      alert.show({
        type: 'confirm',
        title: group.name,
        message: 'Choose an action',
        actions: [
          { text: 'View Details', onPress: () => handleGroupDetails(group) },
          { text: 'Leave Group', onPress: () => handleLeaveGroup(group), style: 'destructive' },
        ],
        cancelText: 'Cancel',
      });
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'anxiety':
        return '#FF9800';
      case 'depression':
        return '#9C27B0';
      case 'trauma':
        return '#F44336';
      case 'addiction':
        return '#4CAF50';
      case 'general':
        return '#607D8B';
      default:
        return appColors.AppBlue;
    }
  };

  const formatLastActivity = (activity: string) => {
    return `Last activity: ${activity}`;
  };

  // Render group card
  const renderGroupCard = ({ item }: { item: MyGroup }) => {
    const isExpired = item.membership_status === 'EXPIRED';
    const chatStatus = item.availability 
      ? getGroupChatStatus(item.availability.next_cohort_start_date || item.startDate)
      : null;

    return (
      <TouchableOpacity
        style={[
          styles.groupCard,
          !item.isActive && styles.inactiveGroupCard,
          isExpired && { opacity: 0.8 }
        ]}
        onPress={() => isExpired ? handleGroupDetails(item) : handleOpenChat(item)}
      >
        <View style={styles.groupHeader}>
          <View style={styles.groupIconContainer}>
            {item.icon_url ? (
              <Image source={{ uri: item.icon_url }} style={styles.groupCoverImage} />
            ) : (
              <View style={[
                styles.iconPlaceholder,
                { backgroundColor: getCategoryColor(item.category) + '20' }
              ]}>
                <Icon
                  name={item.icon}
                  type="material"
                  color={getCategoryColor(item.category)}
                  size={28}
                />
              </View>
            )}
            {item.role === 'moderator' && (
              <View style={styles.moderatorBadge}>
                <Icon name="admin-panel-settings" type="material" color={appColors.CardBackground} size={12} />
              </View>
            )}
          </View>

          <View style={styles.groupInfo}>
            <View style={styles.groupTitleRow}>
              <Text style={styles.groupName} numberOfLines={1}>{item.name}</Text>

              <View style={[styles.statusBadge,
              {
                backgroundColor: item.membership_status === 'ACTIVE' ? appColors.AppBlue :
                  item.membership_status === 'PENDING' ? '#FF9800' :
                    '#F44336'
              }
              ]}>
                <Text style={styles.statusBadgeText}>{item.membership_status || 'ACTIVE'}</Text>
              </View>

              {item.unreadMessages > 0 && !isExpired && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadCount}>
                    {item.unreadMessages > 99 ? '99+' : item.unreadMessages}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.metadataRow}>
              <Text style={styles.joinedDateText}>Joined: {item.joinedDate || 'Recent'}</Text>
              <View style={styles.dot} />
              <Text style={styles.attendanceText}>Attendance: {item.attendance}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => handleGroupMenu(item)}
          >
            <Icon name="more-vert" type="material" color={appColors.grey3} size={20} />
          </TouchableOpacity>
        </View>

        <Text style={styles.groupDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.therapistSection}>
          <Avatar
            source={item.therapistAvatar}
            size={scale(36)}
            rounded
            containerStyle={styles.therapistAvatar}
          />
          <View style={styles.therapistInfo}>
            <Text style={styles.therapistName}>{item.therapistName}</Text>
            <Text style={styles.therapistSpecialty} numberOfLines={1}>
              {item.therapistSpecialization || 'Therapist'}
            </Text>
          </View>
          <View style={styles.memberInfoRow}>
            <Icon name="group" type="material" color={appColors.grey3} size={14} />
            <Text style={styles.memberCount}>{item.memberCount}</Text>
          </View>
        </View>

        <View style={styles.groupFooter}>
          <View style={styles.nextMeetingContainer}>
            <Icon name="schedule" type="material" color={isExpired ? '#F44336' : appColors.AppBlue} size={16} />
            <Text style={[styles.nextMeeting, isExpired && { color: '#F44336' }]}>
              {isExpired && item.expiry_date ? `Expired: ${new Date(item.expiry_date).toLocaleDateString()}` : item.nextMeeting}
            </Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => handleGroupDetails(item)}
            >
              <Icon name="info" type="material" color={appColors.AppBlue} size={16} />
              <Text style={styles.detailsButtonText}>Details</Text>
            </TouchableOpacity>

            {isExpired ? (
              <TouchableOpacity
                style={[styles.chatButton, { backgroundColor: appColors.grey4 }]}
                disabled={true}
              >
                <Icon name="history" type="material" color={appColors.CardBackground} size={16} />
                <Text style={styles.chatButtonText}>Past Cohort</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.chatButton,
                  { 
                    backgroundColor: !chatStatus 
                      ? appColors.grey5 
                      : chatStatus.canEnter 
                        ? getCategoryColor(item.category) 
                        : appColors.grey4 
                  }
                ]}
                onPress={() => handleOpenChat(item)}
                disabled={chatStatus ? !chatStatus.canEnter : false}
              >
                {!chatStatus ? (
                  <ActivityIndicator size="small" color={appColors.CardBackground} />
                ) : (
                  <>
                    <Icon name={chatStatus.canEnter ? "chat" : "lock"} type="material" color={appColors.CardBackground} size={16} />
                    <Text style={styles.chatButtonText}>{chatStatus.canEnter ? "Chat" : chatStatus.statusLabel}</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {!item.isActive && (
          <View style={styles.inactiveOverlay}>
            <Text style={styles.inactiveText}>Group Inactive</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="groups" type="material" color={appColors.grey4} size={scale(80)} />
      <Text style={styles.emptyTitle}>No groups joined yet</Text>
      <Text style={styles.emptySubtitle}>
        Join support groups to connect with others and get guidance from our therapists.
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => {
          if (onTabChange) {
            onTabChange('directory');
          } else {
            navigation.navigate('GroupsListScreen');
          }
        }}
      >
        <Text style={styles.browseButtonText}>Browse Groups</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSkeletonItem = () => (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonHeader}>
        <View style={styles.skeletonIcon} />
        <View style={styles.skeletonInfo}>
          <View style={styles.skeletonLine} />
          <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        {[...Array(3)].map((_, index) => (
          <View key={index}>{renderSkeletonItem()}</View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Stats Header */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{myGroups.length}</Text>
          <Text style={styles.statLabel}>Joined Groups</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {myGroups.reduce((sum, group) => sum + group.unreadMessages, 0)}
          </Text>
          <Text style={styles.statLabel}>Unread Messages</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {myGroups.filter(group => group.isActive).length}
          </Text>
          <Text style={styles.statLabel}>Active Groups</Text>
        </View>
      </View>

      {/* Groups List */}
      <FlatList
        data={myGroups}
        renderItem={renderGroupCard}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[appColors.AppBlue]}
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={myGroups.length === 0 ? styles.emptyContainer : styles.listContainer}
      />
      <ISAlert ref={alert.ref} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statsHeader: {
    backgroundColor: appColors.CardBackground,
    padding: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(12),
    elevation: scale(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  statLabel: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginTop: scale(4),
  },
  statDivider: {
    width: 1,
    backgroundColor: appColors.grey6,
    marginHorizontal: scale(10),
    height: scale(30),
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    marginBottom: scale(12),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  groupCount: {
    fontSize: moderateScale(14),
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  listContent: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(20),
  },
  groupCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(16),
    padding: scale(16),
    marginBottom: scale(12),
    elevation: scale(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
    position: 'relative',
  },
  inactiveGroupCard: {
    opacity: 0.7,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  groupIconContainer: {
    width: scale(54),
    height: scale(54),
    borderRadius: scale(12),
    backgroundColor: appColors.grey6,
    marginRight: scale(12),
    position: 'relative',
    overflow: 'hidden',
  },
  groupCoverImage: {
    width: '100%',
    height: '100%',
  },
  iconPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moderatorBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: appColors.AppBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupInfo: {
    flex: 1,
  },
  groupTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  groupName: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    flex: 1,
    marginBottom: scale(4),
  },
  statusBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    borderRadius: scale(10),
    marginLeft: scale(8),
  },
  statusBadgeText: {
    color: appColors.CardBackground,
    fontSize: moderateScale(10),
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  unreadBadge: {
    backgroundColor: appColors.AppBlue,
    borderRadius: scale(10),
    minWidth: scale(20),
    height: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: scale(8),
    paddingHorizontal: scale(6),
  },
  unreadCount: {
    color: appColors.CardBackground,
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  unreadText: {
    fontSize: moderateScale(10),
    color: appColors.CardBackground,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinedDateText: {
    fontSize: moderateScale(11),
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: appColors.grey4,
    marginHorizontal: scale(6),
  },
  attendanceText: {
    fontSize: moderateScale(11),
    color: appColors.AppBlue,
    fontWeight: '600',
    fontFamily: appFonts.bodyTextMedium,
  },
  lastActivity: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  lastMessage: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: scale(20),
  },
  moreButton: {
    padding: 4,
  },
  groupDescription: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: scale(20),
    marginBottom: scale(12),
  },
  therapistSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(12),
    paddingTop: scale(12),
    borderTopWidth: 1,
    borderTopColor: appColors.grey6,
  },
  therapistAvatar: {
    marginRight: scale(8),
  },
  therapistInfo: {
    flex: 1,
  },
  therapistName: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  therapistSpecialty: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  memberInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberCount: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginLeft: scale(4),
  },
  groupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextMeetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  nextMeeting: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(15),
    backgroundColor: appColors.AppBlue + '20',
    marginRight: scale(8),
  },
  detailsButtonText: {
    fontSize: moderateScale(12),
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextRegular,
    marginLeft: scale(4),
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(15),
  },
  chatButtonText: {
    fontSize: moderateScale(12),
    color: appColors.CardBackground,
    fontFamily: appFonts.bodyTextRegular,
    marginLeft: scale(4),
  },
  inactiveOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveText: {
    color: appColors.CardBackground,
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(40),
  },
  emptyTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: appColors.grey2,
    marginTop: scale(20),
    marginBottom: scale(8),
    fontFamily: appFonts.headerTextBold,
  },
  emptySubtitle: {
    fontSize: moderateScale(16),
    color: appColors.grey3,
    textAlign: 'center',
    marginBottom: scale(30),
    fontFamily: appFonts.bodyTextRegular,
  },
  browseButton: {
    backgroundColor: appColors.AppBlue,
    paddingHorizontal: scale(30),
    paddingVertical: scale(12),
    borderRadius: scale(25),
  },
  browseButtonText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  // Skeleton loading styles
  skeletonCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  skeletonHeader: {
    flexDirection: 'row',
  },
  skeletonIcon: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    backgroundColor: appColors.grey6,
    marginRight: scale(12),
  },
  skeletonInfo: {
    flex: 1,
  },
  skeletonLine: {
    height: scale(16),
    backgroundColor: appColors.grey6,
    borderRadius: scale(8),
    marginBottom: scale(8),
  },
  skeletonLineShort: {
    width: '60%',
  },
});

export default MyGroupsScreen;
