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
} from 'react-native';
import { Avatar, Icon, Button } from '@rneui/base';
import { appColors, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';

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
}

interface MyGroupsScreenProps {
  navigation: any;
}

const MyGroupsScreen: React.FC<MyGroupsScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const [myGroups, setMyGroups] = useState<MyGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock user's joined groups data
  const mockMyGroups: MyGroup[] = [
    {
      id: '1',
      name: 'Anxiety Support Circle',
      description: 'A safe space for individuals dealing with anxiety disorders to share experiences and coping strategies.',
      therapistName: 'Dr. Sarah Johnson',
      therapistAvatar: require('../../assets/images/dummy-people/d-person1.png'),
      memberCount: 24,
      icon: 'psychology',
      category: 'anxiety',
      lastActivity: '2 hours ago',
      unreadMessages: 5,
      nextMeeting: 'Today, 7:00 PM',
      isActive: true,
      role: 'member',
    },
    {
      id: '4',
      name: 'Addiction Recovery Support',
      description: 'Peer support group for individuals in recovery from various forms of addiction.',
      therapistName: 'Dr. James Wilson',
      therapistAvatar: require('../../assets/images/dummy-people/d-person3.png'),
      memberCount: 31,
      icon: 'self_improvement',
      category: 'addiction',
      lastActivity: '1 day ago',
      unreadMessages: 0,
      nextMeeting: 'Tomorrow, 8:00 PM',
      isActive: true,
      role: 'moderator',
    },
    {
      id: '7',
      name: 'PTSD Support Network',
      description: 'Specialized support for post-traumatic stress disorder recovery.',
      therapistName: 'Dr. Lisa Rodriguez',
      therapistAvatar: require('../../assets/images/dummy-people/d-person2.png'),
      memberCount: 15,
      icon: 'healing',
      category: 'trauma',
      lastActivity: '3 days ago',
      unreadMessages: 2,
      nextMeeting: 'Saturday, 10:00 AM',
      isActive: false,
      role: 'member',
    },
  ];

  useEffect(() => {
    loadMyGroups();
  }, []);

  const loadMyGroups = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setMyGroups(mockMyGroups);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      toast.show({
        description: 'Failed to load your groups',
        duration: 3000,
      });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadMyGroups();
    setIsRefreshing(false);
  };

  const handleOpenChat = (group: MyGroup) => {
    navigation.navigate('GroupChatScreen', { 
      groupId: group.id,
      groupName: group.name,
      groupIcon: group.icon,
      memberCount: group.memberCount,
      userRole: group.role,
    });
  };

  const handleGroupDetails = (group: MyGroup) => {
    navigation.navigate('GroupDetailScreen', { group });
  };

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

  const renderGroupCard = ({ item }: { item: MyGroup }) => (
    <TouchableOpacity 
      style={[
        styles.groupCard,
        !item.isActive && styles.inactiveGroupCard
      ]}
      onPress={() => handleOpenChat(item)}
    >
      <View style={styles.groupHeader}>
        <View style={[
          styles.groupIconContainer,
          { backgroundColor: getCategoryColor(item.category) + '20' }
        ]}>
          <Icon 
            name={item.icon} 
            type="material" 
            color={getCategoryColor(item.category)} 
            size={28} 
          />
          {item.role === 'moderator' && (
            <View style={styles.moderatorBadge}>
              <Icon name="admin-panel-settings" type="material" color={appColors.CardBackground} size={12} />
            </View>
          )}
        </View>
        
        <View style={styles.groupInfo}>
          <View style={styles.groupTitleRow}>
            <Text style={styles.groupName} numberOfLines={1}>{item.name}</Text>
            {item.unreadMessages > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>
                  {item.unreadMessages > 99 ? '99+' : item.unreadMessages}
                </Text>
              </View>
            )}
          </View>
          
          <Text style={styles.lastActivity}>
            {formatLastActivity(item.lastActivity)}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.moreButton}
          onPress={() => handleGroupDetails(item)}
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
          size={24}
          rounded
          containerStyle={styles.therapistAvatar}
        />
        <Text style={styles.therapistName}>{item.therapistName}</Text>
        <View style={styles.memberInfo}>
          <Icon name="group" type="material" color={appColors.grey3} size={14} />
          <Text style={styles.memberCount}>{item.memberCount}</Text>
        </View>
      </View>

      <View style={styles.groupFooter}>
        <View style={styles.nextMeetingContainer}>
          <Icon name="schedule" type="material" color={appColors.AppBlue} size={16} />
          <Text style={styles.nextMeeting}>{item.nextMeeting}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.detailsButton}
            onPress={() => handleGroupDetails(item)}
          >
            <Icon name="info" type="material" color={appColors.AppBlue} size={16} />
            <Text style={styles.detailsButtonText}>Details</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.chatButton,
              { backgroundColor: getCategoryColor(item.category) }
            ]}
            onPress={() => handleOpenChat(item)}
          >
            <Icon name="chat" type="material" color={appColors.CardBackground} size={16} />
            <Text style={styles.chatButtonText}>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>

      {!item.isActive && (
        <View style={styles.inactiveOverlay}>
          <Text style={styles.inactiveText}>Group Inactive</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="group-off" type="material" color={appColors.grey3} size={80} />
      <Text style={styles.emptyTitle}>No groups joined yet</Text>
      <Text style={styles.emptySubtitle}>
        Join support groups to connect with others and get the help you need
      </Text>
      <Button
        title="Browse Groups"
        buttonStyle={styles.browseButton}
        titleStyle={styles.browseButtonText}
        onPress={() => navigation.navigate('GroupsScreen')}
      />
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
    marginVertical: 12,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  statLabel: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.regularText,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: appColors.grey6,
    marginHorizontal: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
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
    position: 'relative',
  },
  inactiveGroupCard: {
    opacity: 0.7,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
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
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    color: appColors.CardBackground,
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  lastActivity: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.regularText,
  },
  moreButton: {
    padding: 4,
  },
  groupDescription: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.regularText,
    lineHeight: 20,
    marginBottom: 12,
  },
  therapistSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: appColors.grey6,
  },
  therapistAvatar: {
    marginRight: 8,
  },
  therapistName: {
    fontSize: 12,
    color: appColors.AppBlue,
    fontFamily: appFonts.regularText,
    flex: 1,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberCount: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.regularText,
    marginLeft: 4,
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
    fontSize: 12,
    color: appColors.AppBlue,
    fontFamily: appFonts.regularText,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: appColors.AppBlue + '20',
    marginRight: 8,
  },
  detailsButtonText: {
    fontSize: 12,
    color: appColors.AppBlue,
    fontFamily: appFonts.regularText,
    marginLeft: 4,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  chatButtonText: {
    fontSize: 12,
    color: appColors.CardBackground,
    fontFamily: appFonts.regularText,
    marginLeft: 4,
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
    fontSize: 14,
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
    marginBottom: 30,
    fontFamily: appFonts.regularText,
  },
  browseButton: {
    backgroundColor: appColors.AppBlue,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  browseButtonText: {
    fontSize: 16,
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
    width: 44,
    height: 44,
    borderRadius: 22,
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
});

export default MyGroupsScreen;
