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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Icon, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import { useToast } from 'native-base';
import { useSelector } from 'react-redux';
import { getGroupById, joinGroup, leaveGroup } from '../../api/client/groups';
import { mockGroupDetailMembers } from '../../global/MockData';
import ISAlert, { useISAlert } from '../../components/alerts/ISAlert';

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
  const alert = useISAlert();
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
      alert.show({
        type: 'confirm',
        title: 'Join Group',
        message: 'You need to join this group to access the chat.',
        confirmText: 'Join',
        cancelText: 'Cancel',
        onConfirm: handleJoinGroup,
      });
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
    alert.show({
      type: 'destructive',
      title: 'Leave Group',
      message: `Are you sure you want to leave "${groupDetails.name}"?`,
      confirmText: 'Leave',
      cancelText: 'Cancel',
      onConfirm: async () => {
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
    });
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
    if (!name) return '??';
    return name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase();
  };

  const renderMemberItem = ({ item }: { item: GroupMember }) => (
    <View style={styles.memberItem}>
      <View style={styles.memberAvatar}>
        {item.avatar ? (
          <Avatar
            source={item.avatar}
            size={scale(40)}
            rounded
          />
        ) : (
          <Avatar
            title={getAvatarInitials(item.name)}
            size={scale(40)}
            rounded
            containerStyle={{ backgroundColor: getRoleColor(item.role) }}
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
              size={scale(12)}
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
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={scale(24)} />
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
            <Icon name="history" type="material" color={appColors.CardBackground} size={scale(24)} />
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
              size={scale(48)}
            />
            {group.isPrivate && (
              <View style={styles.privateBadge}>
                <Icon name="lock" type="material" color={appColors.CardBackground} size={scale(16)} />
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
              size={scale(50)}
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
              <Icon name="message" type="material" color={appColors.grey4} size={scale(20)} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Meeting Schedule */}
        {group.meetingSchedule && (
          <View style={styles.scheduleSection}>
            <Text style={styles.sectionTitle}>Meeting Schedule</Text>
            <View style={styles.scheduleCard}>
              <Icon name="schedule" type="material" color={appColors.AppBlue} size={scale(24)} />
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
              <Icon name="check-circle" type="material" color={appColors.AppBlue} size={scale(16)} />
              <Text style={styles.ruleText}>Respect all members and their experiences</Text>
            </View>
            <View style={styles.ruleItem}>
              <Icon name="check-circle" type="material" color={appColors.AppBlue} size={scale(16)} />
              <Text style={styles.ruleText}>Maintain confidentiality of shared information</Text>
            </View>
            <View style={styles.ruleItem}>
              <Icon name="check-circle" type="material" color={appColors.AppBlue} size={scale(16)} />
              <Text style={styles.ruleText}>Use supportive and non-judgmental language</Text>
            </View>
            <View style={styles.ruleItem}>
              <Icon name="check-circle" type="material" color={appColors.AppBlue} size={scale(16)} />
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
      <ISAlert ref={alert.ref} />
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
    paddingTop: scale(parameters.headerHeightS),
    paddingBottom: scale(16),
    paddingHorizontal: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    elevation: scale(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
  },
  backButton: {
    padding: scale(8),
    marginRight: scale(8),
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
    flex: 1,
  },
  headerButton: {
    padding: scale(8),
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: appColors.CardBackground,
    padding: scale(24),
    alignItems: 'center',
    marginBottom: scale(12),
  },
  groupIconLarge: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(16),
    position: 'relative',
  },
  privateBadge: {
    position: 'absolute',
    top: scale(-8),
    right: scale(-8),
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: appColors.grey2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupName: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    textAlign: 'center',
    marginBottom: scale(8),
  },
  groupDescription: {
    fontSize: moderateScale(16),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'center',
    lineHeight: scale(24),
    marginBottom: scale(24),
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
    fontSize: moderateScale(20),
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
    height: scale(30),
    backgroundColor: appColors.grey6,
    marginHorizontal: scale(20),
  },
  therapistSection: {
    backgroundColor: appColors.CardBackground,
    padding: scale(16),
    marginBottom: scale(12),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: scale(12),
  },
  therapistCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  therapistAvatar: {
    marginRight: scale(12),
  },
  therapistInfo: {
    flex: 1,
  },
  therapistName: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  therapistEmail: {
    fontSize: moderateScale(14),
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  therapistSpecialty: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginTop: scale(2),
  },
  contactButton: {
    padding: scale(8),
  },
  contactButtonDisabled: {
    padding: scale(8),
    opacity: 0.3,
  },
  scheduleSection: {
    backgroundColor: appColors.CardBackground,
    padding: scale(16),
    marginBottom: scale(12),
  },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.AppBlue + '10',
    padding: scale(12),
    borderRadius: scale(8),
  },
  scheduleText: {
    fontSize: moderateScale(14),
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextRegular,
    marginLeft: scale(8),
  },
  membersSection: {
    backgroundColor: appColors.CardBackground,
    padding: scale(16),
    marginBottom: scale(12),
  },
  membersSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  viewAllText: {
    fontSize: moderateScale(14),
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextRegular,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(8),
  },
  memberAvatar: {
    position: 'relative',
    marginRight: scale(12),
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: scale(12),
    height: scale(12),
    borderRadius: scale(6),
    backgroundColor: '#4CAF50',
    borderWidth: scale(2),
    borderColor: appColors.CardBackground,
  },
  avatarText: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: appColors.CardBackground,
  },
  memberInfo: {
    flex: 1,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(2),
  },
  memberName: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    flex: 1,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(6),
    paddingVertical: scale(2),
    borderRadius: scale(8),
  },
  roleText: {
    fontSize: moderateScale(10),
    color: appColors.CardBackground,
    fontFamily: appFonts.bodyTextRegular,
    marginLeft: scale(2),
  },
  memberStatus: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  rulesSection: {
    backgroundColor: appColors.CardBackground,
    padding: scale(16),
    marginBottom: scale(12),
  },
  rulesCard: {
    backgroundColor: appColors.grey6,
    padding: scale(12),
    borderRadius: scale(8),
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  ruleText: {
    fontSize: moderateScale(14),
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
    marginLeft: scale(8),
    flex: 1,
  },
  bottomActions: {
    backgroundColor: appColors.CardBackground,
    padding: scale(16),
    elevation: scale(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(-2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
  },
  primaryButton: {
    borderRadius: scale(25),
    paddingVertical: scale(12),
  },
  primaryButtonText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  memberActions: {
    flexDirection: 'row',
  },
  chatButton: {
    flex: 1,
    borderRadius: scale(25),
    paddingVertical: scale(12),
    marginRight: scale(8),
  },
  chatButtonText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  leaveButton: {
    backgroundColor: appColors.grey4,
    borderRadius: scale(25),
    paddingVertical: scale(12),
    paddingHorizontal: scale(20),
  },
  leaveButtonText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
});

export default GroupDetailScreen;
