/**
 * My Group Chats List Screen - Shows list of joined groups for quick chat access
 * Simplified version for Chat tab
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
import { Avatar, Icon } from '@rneui/base';
import { appColors, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import { useSelector } from 'react-redux';
import { getMyGroups } from '../../api/client/groups';

interface GroupChat {
  id: string;
  name: string;
  description: string;
  icon: string;
  memberCount: number;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  userRole: 'therapist' | 'moderator' | 'member';
}

interface MyGroupChatsListScreenProps {
  navigation: any;
}

const MyGroupChatsListScreen: React.FC<MyGroupChatsListScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const userId = useSelector((state: any) => state.userData.userDetails.userId);
  const [groups, setGroups] = useState<GroupChat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock group data moved to MockData.ts
  const mockGroups: GroupChat[] = [
    {
      id: '1',
      name: 'Anxiety Support Circle',
      description: 'A safe space for individuals dealing with anxiety',
      icon: 'favorite',
      memberCount: 24,
      lastMessage: 'Thanks everyone for the support today!',
      lastMessageTime: '5 min ago',
      unreadCount: 3,
      userRole: 'member',
    },
    {
      id: '2',
      name: 'Mindfulness & Meditation',
      description: 'Daily meditation practices',
      icon: 'self-improvement',
      memberCount: 18,
      lastMessage: 'Today\'s meditation session was amazing',
      lastMessageTime: '1 hour ago',
      unreadCount: 0,
      userRole: 'member',
    },
    {
      id: '3',
      name: 'Depression Recovery',
      description: 'Supporting each other through recovery',
      icon: 'psychology',
      memberCount: 31,
      lastMessage: 'Remember, small steps count too',
      lastMessageTime: '3 hours ago',
      unreadCount: 7,
      userRole: 'moderator',
    },
  ];

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    setIsLoading(true);
    try {
      console.log('📞 Calling getMyGroups API...');
      const response = await getMyGroups(userId);
      console.log('✅ My Groups API Response:', JSON.stringify(response, null, 2));
      
      const apiGroups = response.data?.groups || [];
      const mappedGroups: GroupChat[] = apiGroups.map((group: any) => ({
        id: group.id?.toString() || group._id?.toString(),
        name: group.name || group.groupName || group.group_name || 'Unnamed Group',
        description: group.description || '',
        icon: group.icon || 'group',
        memberCount: group.memberCount || group.member_count || group.membersCount || group.members_count || 0,
        lastMessage: group.lastMessage || group.last_message || 'No messages yet',
        lastMessageTime: group.lastMessageTime || group.last_message_time || '',
        unreadCount: group.unreadCount || group.unread_count || 0,
        userRole: group.userRole || group.user_role || group.role || 'member',
      }));
      
      setGroups(mappedGroups);
      console.log('✅ Mapped Groups:', mappedGroups.length);
    } catch (error: any) {
      console.error('❌ Error loading groups:', error);
      toast.show({
        description: error.response?.data?.message || 'Failed to load groups. Please try again.',
        duration: 3000,
      });
      setGroups([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadGroups();
    setIsRefreshing(false);
  };

  const handleGroupPress = (group: GroupChat) => {
    navigation.navigate('GroupChatScreen', {
      groupId: group.id,
      groupName: group.name,
      groupIcon: group.icon,
      groupDescription: group.description,
      memberCount: group.memberCount,
      userRole: group.userRole,
      privacyMode: true, // Always enable privacy for client groups
      showModeration: false,
    });
  };

  const renderGroupCard = ({ item }: { item: GroupChat }) => (
    <TouchableOpacity 
      style={styles.groupCard}
      onPress={() => handleGroupPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.groupIconContainer}>
        <Icon name={item.icon} type="material" color={appColors.AppBlue} size={32} />
      </View>

      <View style={styles.groupContent}>
        <View style={styles.groupHeader}>
          <Text style={styles.groupName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.lastMessageTime}>{item.lastMessageTime}</Text>
        </View>

        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>

        <View style={styles.groupFooter}>
          <View style={styles.memberCount}>
            <Icon name="group" type="material" color={appColors.grey3} size={14} />
            <Text style={styles.memberCountText}>{item.memberCount} members</Text>
          </View>

          {item.userRole === 'moderator' && (
            <View style={styles.moderatorBadge}>
              <Text style={styles.moderatorBadgeText}>Moderator</Text>
            </View>
          )}
        </View>
      </View>

      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="forum" type="material" color={appColors.grey3} size={80} />
      <Text style={styles.emptyTitle}>No Group Chats</Text>
      <Text style={styles.emptySubtitle}>
        Join support groups to connect with others
      </Text>
      <TouchableOpacity 
        style={styles.browseButton}
        onPress={() => navigation.navigate('GroupsScreen')}
      >
        <Text style={styles.browseButtonText}>Browse Groups</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading groups...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={groups}
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
        contentContainerStyle={groups.length === 0 ? styles.emptyContainer : styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupCard: {
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  groupIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: appColors.AppBlue + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  groupContent: {
    flex: 1,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  groupName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginRight: 8,
  },
  lastMessageTime: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  lastMessage: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: 8,
  },
  groupFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberCountText: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginLeft: 4,
  },
  moderatorBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  moderatorBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  unreadBadge: {
    backgroundColor: appColors.AppBlue,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: appColors.AppBlue,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  loadingText: {
    fontSize: 16,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'center',
    marginTop: 32,
  },
});

export default MyGroupChatsListScreen;
