/**
 * Groups List Screen - Directory of all available support groups
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Avatar, Icon, Button } from '@rneui/base';
import { appColors, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import { useToast } from 'native-base';
import { getGroups, subscribeGroup, getMyGroups } from '../../api/client/groups';
import { getImageSource, FALLBACK_IMAGES } from '../../utils/imageHelpers';
import { getMembershipInfo, validateGroupJoin } from '../../services/MembershipService';
import MembershipLimitModal from '../../components/MembershipLimitModal';
import ISAlert, { useISAlert } from '../../components/alerts/ISAlert';
import { useDispatch, useSelector } from 'react-redux';
import { setJoinedGroupIds, addJoinedGroupId, selectJoinedGroupIds } from '../../features/groups/groupsSlice';
import { decodeHTMLEntities } from '../../utils/textHelpers';

interface SupportGroup {
  id: string;
  name: string;
  description: string;
  therapistName: string;
  therapistEmail: string;
  therapistAvatar?: any;
  therapistSpecialization?: string;
  memberCount: number;
  maxMembers: number;
  icon: string;
  coverImage?: any;
  category: string;
  isJoined: boolean;
  isPrivate: boolean;
  meetingSchedule: string;
  tags: string[];
  subscriptionPrice?: number;
  nextCohortDate?: string;
}

interface GroupsListScreenProps {
  navigation: any;
  onTabChange?: (tab: 'directory' | 'mygroups') => void;
}

const GroupsListScreen: React.FC<GroupsListScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const alert = useISAlert();
  const dispatch = useDispatch();
  const userId = useSelector((state: any) => state.userData.userDetails.userId);
  const joinedGroupIds = useSelector(selectJoinedGroupIds);
  const groupsListRef = useRef<FlatList>(null);
  const isInitialMountRef = useRef<boolean>(true);
  const [groups, setGroups] = useState<SupportGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<SupportGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isMoreLoading, setIsMoreLoading] = useState(false);

  // Get membership info instantly from local Redux state tracking
  const membershipInfo = getMembershipInfo(joinedGroupIds.length);

  // Groups categories
  const categories = [
    { id: 'all', name: 'All Groups', color: appColors.AppBlue },
    { id: 'anxiety', name: 'Anxiety', color: '#FF9800' },
    { id: 'depression', name: 'Depression', color: '#9C27B0' },
    { id: 'trauma', name: 'Trauma', color: '#F44336' },
    { id: 'addiction', name: 'Addiction', color: '#4CAF50' },
    { id: 'general', name: 'General', color: '#607D8B' },
  ];

  useEffect(() => {
    syncJoinedGroups();
    loadGroups();
  }, []);

  useEffect(() => {
    // Whenever Redux `joinedGroupIds` changes, re-evaluate the local state.
    if (groups.length > 0) {
      setGroups(prevGroups => prevGroups.map(group => ({
        ...group,
        isJoined: joinedGroupIds.includes(group.id)
      })));
    }
  }, [joinedGroupIds, groups.length]);

  useEffect(() => {
    filterGroups();
  }, [searchQuery, selectedCategory, groups]);

  // Scroll to top reliably whenever filteredGroups changes (skip initial mount)
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }
    requestAnimationFrame(() => {
      groupsListRef.current?.scrollToOffset({ offset: 0, animated: false });
    });
  }, [filteredGroups]);

  const syncJoinedGroups = async () => {
    try {
      const response = await getMyGroups(userId);
      const apiGroups = response.data?.groups || [];
      const joinedIds = apiGroups.map((group: any) => group.id?.toString() || group._id?.toString());
      dispatch(setJoinedGroupIds(joinedIds));
    } catch (error) {
      console.log('Failed to sync joined groups:', error);
    }
  };

  const loadGroups = async (pageNumber = 1, shouldRefresh = false) => {
    if (pageNumber === 1 && !shouldRefresh) setIsLoading(true);
    if (pageNumber > 1) setIsMoreLoading(true);

    try {
      console.log(`📞 Calling getGroups API (Page: ${pageNumber})...`);
      const response = await getGroups(userId, pageNumber, 15);
      console.log('✅ Groups API Response:', JSON.stringify(response, null, 2));

      const apiGroups = response.data?.groups || [];
      const pagination = response.data?.pagination || {};
      
      if (pagination.totalPages) setTotalPages(pagination.totalPages);
      setPage(pageNumber);

      const mappedGroups: SupportGroup[] = apiGroups.map((group: any) => {
        const id = group.id?.toString() || group._id?.toString();
        const dynamicallyJoined = joinedGroupIds.includes(id);

        return {
          id,
          name: decodeHTMLEntities(group.name || group.groupName || 'Unnamed Group'),
          description: decodeHTMLEntities(group.description || ''),
          therapistName: decodeHTMLEntities(group.therapistName || 'Unknown'),
          therapistEmail: group.therapistEmail || '',
          therapistAvatar: getImageSource(group.therapistPhoto || group.therapistAvatar, FALLBACK_IMAGES.avatar),
          therapistSpecialization: decodeHTMLEntities(group.therapistSpecialization || ''),
          memberCount: group.member_count || group.memberCount || 0,
          maxMembers: group.max_capacity || group.maxMembers || 50,
          icon: group.icon || 'group',
          coverImage: group.icon_url ? { uri: group.icon_url } : null,
          category: group.category || 'general',
          isJoined: dynamicallyJoined,
          isPrivate: group.isPrivate || false,
          meetingSchedule: group.meetingSchedule || '',
          tags: group.tags || [],
          subscriptionPrice: group.subscription_price_ugx || 0,
          nextCohortDate: group.next_cohort_start_date || '',
        };
      });

      if (pageNumber === 1) {
        setGroups(mappedGroups);
      } else {
        setGroups(prev => [...prev, ...mappedGroups]);
      }
    } catch (error: any) {
      toast.show({
        description: error.response?.data?.message || 'Failed to load groups. Please try again.',
        duration: 3000,
      });
      if (pageNumber === 1) setGroups([]);
    } finally {
      setIsLoading(false);
      setIsMoreLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!isMoreLoading && page < totalPages) {
      loadGroups(page + 1);
    }
  };

  // Filter groups
  const filterGroups = () => {
    let filtered = groups;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(group => group.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.therapistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredGroups(filtered); // Set filtered groups
  };

  // Handle refresh 
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadGroups(1, true);
    setIsRefreshing(false);
  };

  // Handle join group
  const handleJoinGroup = async (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    // Validate membership limits
    const validation = validateGroupJoin(groups, groupId, joinedGroupIds.length);

    if (!validation.canJoin) {
      if (validation.reason === 'membership_limit') {
        // Show upgrade modal
        setShowLimitModal(true);
        return;
      }

      if (validation.reason === 'already_joined') {
        toast.show({
          description: 'You are already a member of this group',
          duration: 3000,
        });
        return;
      }

      if (validation.reason === 'group_full') {
        toast.show({
          description: 'Group is full. You\'ve been added to the waiting list.',
          duration: 3000,
        });
        return;
      }
    }

    alert.show({
      type: 'confirm',
      title: `Join ${group.name}`,
      message: 'Are you sure you want to join this support group? You agree to follow the community guidelines.',
      confirmText: 'Join Group',
      cancelText: 'Cancel',
      onConfirm: async () => {
        try {
          console.log('📞 Calling joinGroup API...');
          console.log('Group ID:', groupId);
          console.log('User ID:', userId);

          // Call API to join group with requested payload parameters
          const response = await subscribeGroup(
            groupId,
            userId,
            true
          );

          console.log('✅ Join group response:', response);

          // Handle private groups (request sent)
          if (group.isPrivate) {
            alert.show({
              type: 'success',
              title: 'Request Sent',
              message: response.message || 'Join request sent to group therapist',
            });
            return;
          }

          // Update group membership in local state and Redux
          dispatch(addJoinedGroupId(groupId));
          setGroups(prev =>
            prev.map(g =>
              g.id === groupId
                ? { ...g, isJoined: true, memberCount: g.memberCount + 1 }
                : g
            )
          );

          alert.show({
            type: 'success',
            title: 'Welcome!',
            message: response.message || `Successfully joined ${group.name}`,
          });

          // Reload groups to get fresh data
          await loadGroups();
        } catch (error: any) {
          console.error('❌ Error joining group:', error);

          // Handle specific error cases
          if (error.response?.data?.error) {
            const backendError = error.response.data.error;
            const errorMsg = typeof backendError === 'object' ? backendError.message : backendError;

            if (typeof errorMsg === 'string') {
              if (errorMsg.includes('membership limit')) {
                setShowLimitModal(true);
                return;
              }

              if (errorMsg.includes('already a member')) {
                alert.show({
                  type: 'error',
                  title: 'Already joined',
                  message: 'You are already a member of this group',
                });
                return;
              }

              if (errorMsg.includes('full')) {
                alert.show({
                  type: 'info',
                  title: 'Group Full',
                  message: 'Group is full. You\'ve been added to the waiting list.',
                });
                return;
              }
            }

            alert.show({
              type: 'error',
              title: 'Action Required',
              message: errorMsg || 'Failed to join group.',
            });
          } else {
            alert.show({
              type: 'error',
              title: 'Error',
              message: 'Failed to join group. Please try again.',
            });
          }
        }
      }
    });
  };

  // Handle group press
  const handleGroupPress = (group: SupportGroup) => {
    navigation.navigate('GroupDetailScreen', { group });
  };

  // Get category color
  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || appColors.AppBlue;
  };

  // Render group card
  const renderGroupCard = ({ item }: { item: SupportGroup }) => (
    <TouchableOpacity
      style={styles.groupCard}
      onPress={() => handleGroupPress(item)}
    >
      <View style={styles.groupHeader}>
        <View style={styles.groupIconContainer}>
          {item.coverImage ? (
            <Image 
              source={item.coverImage} 
              style={styles.groupCoverImage} 
              resizeMode="cover"
            />
          ) : (
            <Icon
              name={item.icon}
              type="material"
              color={getCategoryColor(item.category)}
              size={scale(32)}
            />
          )}
          {item.isPrivate && (
            <View style={styles.privateIndicator}>
              <Icon name="lock" type="material" color={appColors.CardBackground} size={scale(12)} />
            </View>
          )}
        </View>

        <View style={styles.groupInfo}>
          <View style={styles.groupTitleRow}>
            <Text style={styles.groupName} numberOfLines={1}>{item.name}</Text>
            {item.isJoined && (
              <View style={styles.joinedBadge}>
                <Text style={styles.joinedBadgeText}>Joined</Text>
              </View>
            )}
          </View>

          <Text style={styles.groupDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </View>

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
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>
            {item.subscriptionPrice ? `${item.subscriptionPrice.toLocaleString()} UGX` : 'Free'}
          </Text>
        </View>
      </View>

      <View style={styles.groupMeta}>
        <View style={styles.memberInfo}>
          <Icon name="groups" type="material" color={appColors.grey3} size={scale(16)} />
          <Text style={styles.memberCount}>
            {item.memberCount}/{item.maxMembers} members
          </Text>
        </View>

        {item.nextCohortDate && (
          <View style={styles.memberInfo}>
            <Icon name="event" type="material" color={appColors.AppBlue} size={scale(16)} />
            <Text style={styles.cohortText}>
              Starts {new Date(item.nextCohortDate).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.groupFooter}>
        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {!item.isJoined && (
          <Button
            title={item.isPrivate ? "Request" : "Join"}
            buttonStyle={[
              styles.joinButton,
              { backgroundColor: getCategoryColor(item.category) }
            ]}
            titleStyle={styles.joinButtonText}
            onPress={() => navigation.navigate('GroupDetailScreen', { group: item })}
            disabled={item.memberCount >= item.maxMembers && !item.isPrivate}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  // Render category filter
  const renderCategoryFilter = ({ item }: { item: any }) => {
    const isActive = selectedCategory === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.categoryChip,
          isActive && styles.categoryChipActive,
          isActive && { backgroundColor: item.color + '20', borderColor: item.color }
        ]}
        onPress={() => setSelectedCategory(item.id)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.categoryText,
          isActive && { color: item.color, fontWeight: 'bold' }
        ]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="group-add" type="material" color={appColors.grey3} size={scale(80)} />
      <Text style={styles.emptyTitle}>No groups found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery ? 'Try adjusting your search or filters' : 'Check back later for new support groups'}
      </Text>
    </View>
  );

  // Render skeleton item 
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
        {[...Array(4)].map((_, index) => (
          <View key={index}>{renderSkeletonItem()}</View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Groups List (header included to own the entire scroll area) */}
      <FlatList
        ref={groupsListRef}
        data={filteredGroups}
        renderItem={renderGroupCard}
        keyExtractor={(item) => item.id}
        extraData={filteredGroups}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[appColors.AppBlue]}
          />
        }
        ListHeaderComponent={
          <>
            {/* Combined Header: Plan Indicator + Search Bar */}
            <View style={styles.combinedHeader}>
              {/* Plan Indicator */}
              <View style={styles.planIndicatorCompact}>
                <Icon name="groups" type="material" color={appColors.AppBlue} size={scale(18)} />
                <Text style={styles.planTextCompact}>
                  {membershipInfo.joinedGroupsCount}/{membershipInfo.groupLimit === -1 ? '∞' : membershipInfo.groupLimit}
                </Text>
                {!membershipInfo.canJoinMore && membershipInfo.groupLimit !== -1 && (
                  <TouchableOpacity
                    style={styles.upgradeLinkCompact}
                    onPress={() => setShowLimitModal(true)}
                  >
                    <Icon name="arrow-upward" type="material" color={appColors.AppBlue} size={scale(14)} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Search Bar */}
              <View style={styles.searchContainerCompact}>
                <Icon name="search" type="material" color={appColors.grey3} size={scale(18)} />
                <TextInput
                  style={styles.searchInputCompact}
                  placeholder="Search..."
                  placeholderTextColor={appColors.grey3}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Icon name="clear" type="material" color={appColors.grey3} size={scale(18)} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Category Filters 
            <FlatList
              data={categories}
              renderItem={renderCategoryFilter}
              keyExtractor={(item) => item.id}
              extraData={selectedCategory}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
              removeClippedSubviews={false}
            />
            */}
          </>
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isMoreLoading ? (
            <ActivityIndicator 
              size="small" 
              color={appColors.AppBlue} 
              style={{ marginVertical: scale(20) }} 
            />
          ) : null
        }
        contentContainerStyle={filteredGroups.length === 0 ? styles.emptyContainer : styles.listContainer}
        contentInset={{ top: 0, bottom: 0, left: 0, right: 0 }}
        contentOffset={{ x: 0, y: 0 }}
        automaticallyAdjustContentInsets={false}
        removeClippedSubviews={false}
      />

      {/* Membership Limit Modal */}
      <MembershipLimitModal
        visible={showLimitModal}
        currentGroupCount={membershipInfo.joinedGroupsCount}
        maxAllowed={membershipInfo.groupLimit}
        onClose={() => setShowLimitModal(false)}
      />

      {/* Alert Component */}
      <ISAlert ref={alert.ref} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.CardBackground,
    marginHorizontal: scale(5),
    marginTop: 0,
    marginBottom: scale(8),
    paddingHorizontal: scale(14),
    paddingVertical: scale(10),
    borderRadius: scale(10),
    elevation: scale(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(16),
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
    marginLeft: scale(12),
  },
  categoriesContainer: {
    paddingHorizontal: scale(16),
    paddingTop: scale(4),
    paddingBottom: scale(12),
  },
  categoryChip: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(10),
    borderRadius: scale(20),
    backgroundColor: appColors.grey6,
    marginRight: scale(8),
    borderWidth: 1,
    borderColor: 'transparent',
    height: scale(40),
    justifyContent: 'center',
  },
  categoryChipActive: {
    borderWidth: 1,
  },
  categoryText: {
    fontSize: moderateScale(14),
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: scale(16),
    paddingTop: 0,
    paddingBottom: scale(16),
  },
  groupCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(16),
    padding: scale(16),
    marginBottom: scale(12),
    elevation: scale(3),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
  },
  groupHeader: {
    flexDirection: 'row',
    marginBottom: scale(12),
  },
  groupIconContainer: {
    position: 'relative',
    marginRight: scale(12),
    alignItems: 'center',
    justifyContent: 'center',
    width: scale(54),
    height: scale(54),
    borderRadius: scale(12),
    backgroundColor: appColors.grey6,
    overflow: 'hidden',
  },
  groupCoverImage: {
    width: '100%',
    height: '100%',
  },
  privateIndicator: {
    position: 'absolute',
    top: scale(-4),
    right: scale(-4),
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    backgroundColor: appColors.grey2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupInfo: {
    flex: 1,
  },
  groupTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(4),
  },
  groupName: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    flex: 1,
  },
  joinedBadge: {
    backgroundColor: appColors.AppBlue,
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    borderRadius: scale(10),
  },
  joinedBadgeText: {
    fontSize: moderateScale(10),
    color: appColors.CardBackground,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  groupDescription: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: scale(20),
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
    fontSize: moderateScale(15),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  therapistSpecialty: {
    fontSize: moderateScale(13),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
  },
  priceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  priceText: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  cohortText: {
    fontSize: moderateScale(12),
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextMedium,
    marginLeft: scale(4),
    fontWeight: '600',
  },
  groupMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12),
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
  schedule: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  groupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  tag: {
    backgroundColor: appColors.AppBlue + '20',
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    borderRadius: scale(10),
    marginRight: scale(6),
  },
  tagText: {
    fontSize: moderateScale(10),
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextRegular,
  },
  joinButton: {
    paddingHorizontal: scale(20),
    paddingVertical: scale(8),
    borderRadius: scale(20),
  },
  joinButtonText: {
    fontSize: moderateScale(12),
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  emptyContainer: {
    paddingHorizontal: scale(16),
    paddingTop: 0,
    paddingBottom: scale(16),
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(40),
    paddingVertical: scale(40),
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
    fontFamily: appFonts.bodyTextRegular,
  },
  // Skeleton loading styles
  skeletonCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(16),
    padding: scale(16),
    marginHorizontal: scale(16),
    marginBottom: scale(12),
  },
  skeletonHeader: {
    flexDirection: 'row',
  },
  skeletonIcon: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
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
  // Combined Header Styles (Plan Indicator + Search Bar in one row)
  combinedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.CardBackground,
    marginHorizontal: scale(5),
    marginTop: scale(8),
    marginBottom: scale(8),
    paddingVertical: scale(10),
    paddingHorizontal: scale(12),
    borderRadius: scale(10),
    elevation: scale(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
    gap: scale(12),
  },
  planIndicatorCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  planTextCompact: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextSemiBold,
  },
  upgradeLinkCompact: {
    marginLeft: scale(2),
  },
  searchContainerCompact: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.grey6,
    borderRadius: scale(8),
    paddingHorizontal: scale(10),
    height: scale(36),
    gap: scale(8),
  },
  searchInputCompact: {
    flex: 1,
    fontSize: moderateScale(14),
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
    padding: 0,
  },
  // Old Plan Indicator Styles (kept for reference, can be removed)
  planIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.CardBackground,
    marginHorizontal: 16,
    marginTop: 0,
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  planText: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextSemiBold,
    marginLeft: 10,
    flex: 1,
  },
  upgradeLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: appColors.AppBlue + '15',
    borderRadius: 8,
  },
  upgradeLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextSemiBold,
    marginRight: 4,
  },
});

export default GroupsListScreen;
