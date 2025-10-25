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
  InteractionManager,
} from 'react-native';
import { Avatar, Icon, Button } from '@rneui/base';
import { appColors, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import { getMembershipInfo, validateGroupJoin } from '../../services/MembershipService';
import MembershipLimitModal from '../../components/MembershipLimitModal';

interface SupportGroup {
  id: string;
  name: string;
  description: string;
  therapistName: string;
  therapistEmail: string;
  therapistAvatar?: any;
  memberCount: number;
  maxMembers: number;
  icon: string;
  category: 'anxiety' | 'depression' | 'addiction' | 'trauma' | 'general';
  isJoined: boolean;
  isPrivate: boolean;
  meetingSchedule: string;
  tags: string[];
}

interface GroupsListScreenProps {
  navigation: any;
}

const GroupsListScreen: React.FC<GroupsListScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const groupsListRef = useRef<FlatList>(null);
  const isInitialMountRef = useRef<boolean>(true);
  const [groups, setGroups] = useState<SupportGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<SupportGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  
  // Get membership info
  const membershipInfo = getMembershipInfo(groups);

  // Mock groups data
  const mockGroups: SupportGroup[] = [
    {
      id: '1',
      name: 'Anxiety Support Circle',
      description: 'A safe space for individuals dealing with anxiety disorders to share experiences and coping strategies.',
      therapistName: 'Dr. Sarah Johnson',
      therapistEmail: 'sarah.johnson@innerspark.com',
      therapistAvatar: require('../../assets/images/dummy-people/d-person1.png'),
      memberCount: 24,
      maxMembers: 30,
      icon: 'psychology',
      category: 'anxiety',
      isJoined: true,
      isPrivate: false,
      meetingSchedule: 'Tuesdays & Thursdays, 7:00 PM',
      tags: ['anxiety', 'coping', 'mindfulness'],
    },
    {
      id: '2',
      name: 'Depression Recovery Group',
      description: 'Supporting each other through the journey of depression recovery with professional guidance.',
      therapistName: 'Dr. Michael Chen',
      therapistEmail: 'michael.chen@innerspark.com',
      therapistAvatar: require('../../assets/images/dummy-people/d-person2.png'),
      memberCount: 18,
      maxMembers: 25,
      icon: 'favorite',
      category: 'depression',
      isJoined: false,
      isPrivate: false,
      meetingSchedule: 'Mondays & Wednesdays, 6:30 PM',
      tags: ['depression', 'recovery', 'support'],
    },
    {
      id: '3',
      name: 'Trauma Healing Circle',
      description: 'A specialized group for trauma survivors focusing on healing and post-traumatic growth.',
      therapistName: 'Dr. Lisa Rodriguez',
      therapistEmail: 'lisa.rodriguez@innerspark.com',
      therapistAvatar: require('../../assets/images/dummy-people/d-person3.png'),
      memberCount: 12,
      maxMembers: 15,
      icon: 'healing',
      category: 'trauma',
      isJoined: false,
      isPrivate: true,
      meetingSchedule: 'Saturdays, 10:00 AM',
      tags: ['trauma', 'healing', 'ptsd'],
    },
    {
      id: '4',
      name: 'Addiction Recovery Support',
      description: 'Peer support group for individuals in recovery from various forms of addiction.',
      therapistName: 'Dr. James Wilson',
      therapistEmail: 'james.wilson@innerspark.com',
      memberCount: 31,
      maxMembers: 35,
      icon: 'self_improvement',
      category: 'addiction',
      isJoined: true,
      isPrivate: false,
      meetingSchedule: 'Daily, 8:00 PM',
      tags: ['addiction', 'recovery', 'sobriety'],
    },
    {
      id: '5',
      name: 'General Wellness Circle',
      description: 'Open discussion group for general mental health and wellness topics.',
      therapistName: 'Dr. Clara Odding',
      therapistEmail: 'clara.odding@innerspark.com',
      therapistAvatar: require('../../assets/images/dummy-people/d-person2.png'),
      memberCount: 45,
      maxMembers: 50,
      icon: 'spa',
      category: 'general',
      isJoined: false,
      isPrivate: false,
      meetingSchedule: 'Fridays, 5:00 PM',
      tags: ['wellness', 'general', 'community'],
    },
    {
      id: '6',
      name: 'Mindfulness & Meditation',
      description: 'Practice mindfulness and meditation techniques together in a supportive environment.',
      therapistName: 'Dr. Sarah Johnson',
      therapistEmail: 'sarah.johnson@innerspark.com',
      therapistAvatar: require('../../assets/images/dummy-people/d-person1.png'),
      memberCount: 28,
      maxMembers: 30,
      icon: 'self_improvement',
      category: 'general',
      isJoined: false,
      isPrivate: false,
      meetingSchedule: 'Sundays, 9:00 AM',
      tags: ['mindfulness', 'meditation', 'peace'],
    },
  ];

  const categories = [
    { id: 'all', name: 'All Groups', color: appColors.AppBlue },
    { id: 'anxiety', name: 'Anxiety', color: '#FF9800' },
    { id: 'depression', name: 'Depression', color: '#9C27B0' },
    { id: 'trauma', name: 'Trauma', color: '#F44336' },
    { id: 'addiction', name: 'Addiction', color: '#4CAF50' },
    { id: 'general', name: 'General', color: '#607D8B' },
  ];

  useEffect(() => {
    loadGroups();
  }, []);

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

  const loadGroups = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setGroups(mockGroups);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      toast.show({
        description: 'Failed to load groups',
        duration: 3000,
      });
    }
  };

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

    setFilteredGroups(filtered);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadGroups();
    setIsRefreshing(false);
  };

  const handleJoinGroup = async (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    // Validate membership limits
    const validation = validateGroupJoin(groups, groupId);
    
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

    // Handle private groups
    if (group.isPrivate) {
      toast.show({
        description: 'Join request sent to group therapist',
        duration: 3000,
      });
      return;
    }

    // Update group membership
    setGroups(prev => 
      prev.map(g => 
        g.id === groupId 
          ? { ...g, isJoined: true, memberCount: g.memberCount + 1 }
          : g
      )
    );

    toast.show({
      description: `Successfully joined ${group.name}`,
      duration: 3000,
    });
  };

  const handleGroupPress = (group: SupportGroup) => {
    navigation.navigate('GroupDetailScreen', { group });
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || appColors.AppBlue;
  };

  const renderGroupCard = ({ item }: { item: SupportGroup }) => (
    <TouchableOpacity 
      style={styles.groupCard}
      onPress={() => handleGroupPress(item)}
    >
      <View style={styles.groupHeader}>
        <View style={styles.groupIconContainer}>
          <Icon 
            name={item.icon} 
            type="material" 
            color={getCategoryColor(item.category)} 
            size={32} 
          />
          {item.isPrivate && (
            <View style={styles.privateIndicator}>
              <Icon name="lock" type="material" color={appColors.CardBackground} size={12} />
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
          size={32}
          rounded
          containerStyle={styles.therapistAvatar}
        />
        <View style={styles.therapistInfo}>
          <Text style={styles.therapistName}>{item.therapistName}</Text>
          <Text style={styles.therapistEmail}>{item.therapistEmail}</Text>
        </View>
      </View>

      <View style={styles.groupMeta}>
        <View style={styles.memberInfo}>
          <Icon name="group" type="material" color={appColors.grey3} size={16} />
          <Text style={styles.memberCount}>
            {item.memberCount}/{item.maxMembers} members
          </Text>
        </View>
        
        <Text style={styles.schedule}>{item.meetingSchedule}</Text>
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
            onPress={() => handleJoinGroup(item.id)}
            disabled={item.memberCount >= item.maxMembers && !item.isPrivate}
          />
        )}
      </View>
    </TouchableOpacity>
  );

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

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="group-add" type="material" color={appColors.grey3} size={80} />
      <Text style={styles.emptyTitle}>No groups found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery ? 'Try adjusting your search or filters' : 'Check back later for new support groups'}
      </Text>
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
        {[...Array(4)].map((_, index) => (
          <View key={index}>{renderSkeletonItem()}</View>
        ))}
      </View>
    );
  }

  const renderListHeader = () => (
    <View>
      {/* Plan Indicator */}
      <View style={styles.planIndicator}>
        <Icon name="groups" type="material" color={appColors.AppBlue} size={20} />
        <Text style={styles.planText}>
          Groups: {membershipInfo.joinedGroupsCount}/{membershipInfo.groupLimit === -1 ? '∞' : membershipInfo.groupLimit}
        </Text>
        {!membershipInfo.canJoinMore && membershipInfo.groupLimit !== -1 && (
          <TouchableOpacity 
            style={styles.upgradeLink}
            onPress={() => setShowLimitModal(true)}
          >
            <Text style={styles.upgradeLinkText}>Upgrade Plan</Text>
            <Icon name="arrow-forward" type="material" color={appColors.AppBlue} size={16} />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" type="material" color={appColors.grey3} size={20} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search groups..."
          placeholderTextColor={appColors.grey3}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="clear" type="material" color={appColors.grey3} size={20} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filters */}
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
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Groups List (header included to own the entire scroll area) */}
      <FlatList
        ref={groupsListRef}
        data={filteredGroups}
        renderItem={renderGroupCard}
        keyExtractor={(item) => item.id}
        extraData={filteredGroups}
        ListHeaderComponent={renderListHeader}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[appColors.AppBlue]}
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={filteredGroups.length === 0 ? styles.emptyContainer : styles.listContainer}
        removeClippedSubviews={false}
      />

      {/* Membership Limit Modal */}
      <MembershipLimitModal
        visible={showLimitModal}
        currentPlan={membershipInfo.plan}
        currentGroupCount={membershipInfo.joinedGroupsCount}
        maxAllowed={membershipInfo.groupLimit}
        onUpgrade={() => {
          setShowLimitModal(false);
          // Navigate to subscription screen
          navigation.navigate('SubscriptionScreen');
        }}
        onClose={() => setShowLimitModal(false)}
      />
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
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
    marginLeft: 12,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: appColors.grey6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    height: 40,
    justifyContent: 'center',
  },
  categoryChipActive: {
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  groupCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  groupHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  groupIconContainer: {
    position: 'relative',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: appColors.grey6,
  },
  privateIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
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
    marginBottom: 4,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    flex: 1,
  },
  joinedBadge: {
    backgroundColor: appColors.AppBlue,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  joinedBadgeText: {
    fontSize: 10,
    color: appColors.CardBackground,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  groupDescription: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: 20,
  },
  therapistSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: appColors.grey6,
  },
  therapistAvatar: {
    marginRight: 8,
  },
  therapistInfo: {
    flex: 1,
  },
  therapistName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  therapistEmail: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  groupMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberCount: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginLeft: 4,
  },
  schedule: {
    fontSize: 12,
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
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 6,
  },
  tagText: {
    fontSize: 10,
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextRegular,
  },
  joinButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey2,
    marginTop: 20,
    marginBottom: 8,
    fontFamily: appFonts.headerTextBold,
  },
  emptySubtitle: {
    fontSize: 16,
    color: appColors.grey3,
    textAlign: 'center',
    fontFamily: appFonts.bodyTextRegular,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: appColors.grey6,
    marginRight: 12,
  },
  skeletonInfo: {
    flex: 1,
  },
  skeletonLine: {
    height: 16,
    backgroundColor: appColors.grey6,
    borderRadius: 8,
    marginBottom: 8,
  },
  skeletonLineShort: {
    width: '60%',
  },
  // Plan Indicator Styles
  planIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.CardBackground,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 14,
    borderRadius: 12,
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
