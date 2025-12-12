/**
 * Group Detail Screen - Detailed view of a support group with member info
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Icon, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import { useSelector } from 'react-redux';
import { getGroupById, joinGroup, leaveGroup } from '../../api/client/groups';
import { mockGroupDetailMembers } from '../../global/MockData';

interface GroupMember {
  id: string;
  name: string;
  avatar?: any;
  role: 'therapist' | 'moderator' | 'member';
  joinedDate: string;
  isOnline: boolean;
  lastSeen?: string;
}

interface GroupDetailScreenProps {
  navigation: any;
  route: any;
}

const GroupDetailScreen: React.FC<GroupDetailScreenProps> = ({ navigation, route }) => {
  const toast = useToast();
  const userId = useSelector((state: any) => state.userData.userDetails.userId);
  const { group } = route.params;
  const [groupDetails, setGroupDetails] = useState(group);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<'member' | 'moderator' | 'none'>('none');


  useEffect(() => {
    loadGroupDetails();
  }, []);

  const loadGroupDetails = async () => {
    setIsLoading(true);
    try {
      console.log('📞 Calling getGroupById API...');
      console.log('Group ID:', group.id);
      console.log('User ID:', userId);

      const response = await getGroupById(group.id, userId);
      console.log('✅ Group details response:', response);

      // Update group details from API
      if (response.group) {
        setGroupDetails(response.group);
      }

      // Set members from API or fallback to mock
      if (response.members && response.members.length > 0) {
        setMembers(response.members);
      } else {
        // Fallback to mock data
        const membersWithTherapist = [
          {
            id: 'therapist_1',
            name: groupDetails.therapistName || 'Dr. Sarah Johnson',
            avatar: groupDetails.therapistAvatar,
            role: 'therapist' as const,
            joinedDate: '2024-01-15',
            isOnline: true,
          },
          ...mockGroupDetailMembers.slice(1),
        ];
        setMembers(membersWithTherapist);
      }

      // Set user role from API
      setUserRole(response.userRole || (groupDetails.isJoined ? 'member' : 'none'));
      setIsLoading(false);
    } catch (error: any) {
      console.error('❌ Error loading group details:', error);
      
      // Fallback to mock data on error
      const membersWithTherapist = [
        {
          id: 'therapist_1',
          name: groupDetails.therapistName || 'Dr. Sarah Johnson',
          avatar: groupDetails.therapistAvatar,
          role: 'therapist' as const,
          joinedDate: '2024-01-15',
          isOnline: true,
        },
        ...mockGroupDetailMembers.slice(1),
      ];
      setMembers(membersWithTherapist);
      setUserRole(groupDetails.isJoined ? 'member' : 'none');
      setIsLoading(false);
      toast.show({
        description: 'Failed to load group details',
        duration: 3000,
      });
    }
  };

  const handleEnterChat = () => {
    if (userRole === 'none') {
      Alert.alert(
        'Join Group',
        'You need to join this group to access the chat.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Join', onPress: handleJoinGroup },
        ]
      );
      return;
    }

    navigation.navigate('GroupChatScreen', {
      groupId: group.id,
      groupName: group.name,
      groupIcon: group.icon,
      memberCount: group.memberCount,
      userRole: userRole,
    });
  };

  const handleJoinGroup = async () => {
    try {
      console.log('📞 Calling joinGroup API from GroupDetailScreen...');
      const response = await joinGroup(groupDetails.id, userId, '', true);
      console.log('✅ Join group response:', response);

      if (groupDetails.isPrivate) {
        toast.show({
          description: response.message || 'Join request sent to group therapist',
          duration: 3000,
        });
        return;
      }

      toast.show({
        description: response.message || `Successfully joined ${groupDetails.name}`,
        duration: 3000,
      });

      // Update local state
      setUserRole('member');
      setGroupDetails({ ...groupDetails, isJoined: true });
      
      // Reload group details
      await loadGroupDetails();
    } catch (error: any) {
      console.error('❌ Error joining group:', error);
      toast.show({
        description: error.response?.data?.error || 'Failed to join group. Please try again.',
        duration: 3000,
      });
    }
  };

  const handleLeaveGroup = () => {
    Alert.alert(
      'Leave Group',
      `Are you sure you want to leave "${groupDetails.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('📞 Calling leaveGroup API from GroupDetailScreen...');
              const response = await leaveGroup(groupDetails.id, userId, '', '');
              console.log('✅ Leave group response:', response);

              toast.show({
                description: response.message || `You have left ${groupDetails.name}`,
                duration: 3000,
              });
              setUserRole('none');
              setGroupDetails({ ...groupDetails, isJoined: false });
              navigation.goBack();
            } catch (error: any) {
              console.error('❌ Error leaving group:', error);
              toast.show({
                description: error.response?.data?.error || 'Failed to leave group. Please try again.',
                duration: 3000,
              });
            }
          },
        },
      ]
    );
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'therapist':
        return appColors.AppBlue;
      case 'moderator':
        return '#4CAF50';
      case 'member':
        return appColors.grey3;
      default:
        return appColors.grey3;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'therapist':
        return 'psychology';
      case 'moderator':
        return 'admin-panel-settings';
      case 'member':
        return 'person';
      default:
        return 'person';
    }
  };

  const getAvatarInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const renderMemberItem = ({ item }: { item: GroupMember }) => (
    <View style={styles.memberItem}>
      <View style={styles.memberAvatar}>
        {item.avatar ? (
          <Avatar
            source={item.avatar}
            size={40}
            rounded
          />
        ) : (
          <Avatar
            title={getAvatarInitials(item.name)}
            size={40}
            rounded
            backgroundColor={getRoleColor(item.role)}
            titleStyle={styles.avatarText}
          />
        )}
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.memberInfo}>
        <View style={styles.memberNameRow}>
          <Text style={styles.memberName}>{item.name}</Text>
          <View style={[styles.roleBadge, { backgroundColor: getRoleColor(item.role) }]}>
            <Icon 
              name={getRoleIcon(item.role)} 
              type="material" 
              color={appColors.CardBackground} 
              size={12} 
            />
            <Text style={styles.roleText}>{item.role}</Text>
          </View>
        </View>
        
        <Text style={styles.memberStatus}>
          {item.isOnline ? 'Online' : `Last seen ${item.lastSeen}`}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Group Details</Text>
        {group?.id && (
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('GroupMessagesHistoryScreen', { 
              groupId: group.id,
              groupName: group.name,
              userRole: userRole
            })}
          >
            <Icon name="history" type="material" color={appColors.CardBackground} size={24} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Group Profile */}
        <View style={styles.profileSection}>
          <View style={[
            styles.groupIconLarge,
            { backgroundColor: getCategoryColor(group.category) + '20' }
          ]}>
            <Icon 
              name={group.icon} 
              type="material" 
              color={getCategoryColor(group.category)} 
              size={48} 
            />
            {group.isPrivate && (
              <View style={styles.privateBadge}>
                <Icon name="lock" type="material" color={appColors.CardBackground} size={16} />
              </View>
            )}
          </View>

          <Text style={styles.groupName}>{group.name}</Text>
          <Text style={styles.groupDescription}>{group.description}</Text>

          <View style={styles.groupStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{group.memberCount}</Text>
              <Text style={styles.statLabel}>Members</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {members.filter(m => m.isOnline).length}
              </Text>
              <Text style={styles.statLabel}>Online</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {group.isPrivate ? 'Private' : 'Public'}
              </Text>
              <Text style={styles.statLabel}>Type</Text>
            </View>
          </View>
        </View>

        {/* Therapist Info */}
        <View style={styles.therapistSection}>
          <Text style={styles.sectionTitle}>Group Therapist</Text>
          <View style={styles.therapistCard}>
            <Avatar
              source={group.therapistAvatar}
              size={50}
              rounded
              containerStyle={styles.therapistAvatar}
            />
            <View style={styles.therapistInfo}>
              <Text style={styles.therapistName}>{group.therapistName}</Text>
              <Text style={styles.therapistEmail}>{group.therapistEmail}</Text>
              <Text style={styles.therapistSpecialty}>
                Specializes in {group.category} support
              </Text>
            </View>
            <TouchableOpacity style={styles.contactButtonDisabled} disabled>
              <Icon name="message" type="material" color={appColors.grey4} size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Meeting Schedule */}
        {group.meetingSchedule && (
          <View style={styles.scheduleSection}>
            <Text style={styles.sectionTitle}>Meeting Schedule</Text>
            <View style={styles.scheduleCard}>
              <Icon name="schedule" type="material" color={appColors.AppBlue} size={24} />
              <Text style={styles.scheduleText}>{group.meetingSchedule}</Text>
            </View>
          </View>
        )}

        {/* Members List */}
        <View style={styles.membersSection}>
          <View style={styles.membersSectionHeader}>
            <Text style={styles.sectionTitle}>Members ({members.length})</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={members.slice(0, 5)}
            renderItem={renderMemberItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Group Rules/Guidelines */}
        <View style={styles.rulesSection}>
          <Text style={styles.sectionTitle}>Group Guidelines</Text>
          <View style={styles.rulesCard}>
            <View style={styles.ruleItem}>
              <Icon name="check-circle" type="material" color={appColors.AppBlue} size={16} />
              <Text style={styles.ruleText}>Respect all members and their experiences</Text>
            </View>
            <View style={styles.ruleItem}>
              <Icon name="check-circle" type="material" color={appColors.AppBlue} size={16} />
              <Text style={styles.ruleText}>Maintain confidentiality of shared information</Text>
            </View>
            <View style={styles.ruleItem}>
              <Icon name="check-circle" type="material" color={appColors.AppBlue} size={16} />
              <Text style={styles.ruleText}>Use supportive and non-judgmental language</Text>
            </View>
            <View style={styles.ruleItem}>
              <Icon name="check-circle" type="material" color={appColors.AppBlue} size={16} />
              <Text style={styles.ruleText}>Follow therapist guidance and recommendations</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        {userRole === 'none' ? (
          <Button
            title={group.isPrivate ? "Request to Join" : "Join Group"}
            buttonStyle={[
              styles.primaryButton,
              { backgroundColor: getCategoryColor(group.category) }
            ]}
            titleStyle={styles.primaryButtonText}
            onPress={handleJoinGroup}
            disabled={group.memberCount >= group.maxMembers && !group.isPrivate}
          />
        ) : (
          <View style={styles.memberActions}>
            <Button
              title="Enter Chat"
              buttonStyle={[
                styles.chatButton,
                { backgroundColor: getCategoryColor(group.category) }
              ]}
              titleStyle={styles.chatButtonText}
              onPress={handleEnterChat}
            />
            <Button
              title="Leave Group"
              buttonStyle={styles.leaveButton}
              titleStyle={styles.leaveButtonText}
              onPress={handleLeaveGroup}
            />
          </View>
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
  header: {
    backgroundColor: appColors.AppBlue,
    paddingTop: parameters.headerHeightS,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
    flex: 1,
  },
  headerButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: appColors.CardBackground,
    padding: 24,
    alignItems: 'center',
    marginBottom: 12,
  },
  groupIconLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  privateBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: appColors.grey2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    textAlign: 'center',
    marginBottom: 8,
  },
  groupDescription: {
    fontSize: 16,
    color: appColors.grey2,
    fontFamily: appFonts.regularText,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  groupStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
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
    height: 30,
    backgroundColor: appColors.grey6,
    marginHorizontal: 20,
  },
  therapistSection: {
    backgroundColor: appColors.CardBackground,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 12,
  },
  therapistCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  therapistAvatar: {
    marginRight: 12,
  },
  therapistInfo: {
    flex: 1,
  },
  therapistName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  therapistEmail: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.regularText,
  },
  therapistSpecialty: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.regularText,
    marginTop: 2,
  },
  contactButton: {
    padding: 8,
  },
  contactButtonDisabled: {
    padding: 8,
    opacity: 0.3,
  },
  scheduleSection: {
    backgroundColor: appColors.CardBackground,
    padding: 16,
    marginBottom: 12,
  },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.AppBlue + '10',
    padding: 12,
    borderRadius: 8,
  },
  scheduleText: {
    fontSize: 14,
    color: appColors.AppBlue,
    fontFamily: appFonts.regularText,
    marginLeft: 8,
  },
  membersSection: {
    backgroundColor: appColors.CardBackground,
    padding: 16,
    marginBottom: 12,
  },
  membersSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: appColors.AppBlue,
    fontFamily: appFonts.regularText,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  memberAvatar: {
    position: 'relative',
    marginRight: 12,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: appColors.CardBackground,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appColors.CardBackground,
  },
  memberInfo: {
    flex: 1,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  memberName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    flex: 1,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  roleText: {
    fontSize: 10,
    color: appColors.CardBackground,
    fontFamily: appFonts.regularText,
    marginLeft: 2,
  },
  memberStatus: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.regularText,
  },
  rulesSection: {
    backgroundColor: appColors.CardBackground,
    padding: 16,
    marginBottom: 12,
  },
  rulesCard: {
    backgroundColor: appColors.grey6,
    padding: 12,
    borderRadius: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ruleText: {
    fontSize: 14,
    color: appColors.grey1,
    fontFamily: appFonts.regularText,
    marginLeft: 8,
    flex: 1,
  },
  bottomActions: {
    backgroundColor: appColors.CardBackground,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButton: {
    borderRadius: 25,
    paddingVertical: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  memberActions: {
    flexDirection: 'row',
  },
  chatButton: {
    flex: 1,
    borderRadius: 25,
    paddingVertical: 12,
    marginRight: 8,
  },
  chatButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  leaveButton: {
    backgroundColor: appColors.grey4,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  leaveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
});

export default GroupDetailScreen;
