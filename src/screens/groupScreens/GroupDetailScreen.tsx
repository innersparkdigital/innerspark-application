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
import { useSelector, useDispatch } from 'react-redux';
import { getGroupById, joinGroup, leaveGroup } from '../../api/client/groups';
import ISAlert, { useISAlert } from '../../components/alerts/ISAlert';
import { generateAnonymousName } from '../../utils/privacyHelpers';
import { addJoinedGroupId, removeJoinedGroupId, selectIsGroupJoined, selectJoinedGroupIds } from '../../features/groups/groupsSlice';
import { getImageSource, FALLBACK_IMAGES } from '../../utils/imageHelpers';
import { validateGroupJoin, getMembershipInfo } from '../../services/MembershipService';
import MembershipLimitModal from '../../components/MembershipLimitModal';

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
  const dispatch = useDispatch();
  const userId = useSelector((state: any) => state.userData.userDetails.userId);
  const { group } = route.params;
  const isGroupJoined = useSelector(selectIsGroupJoined(group.id));
  const [groupDetails, setGroupDetails] = useState(group);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [_isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<'member' | 'moderator' | 'none'>('none');
  const [showLimitModal, setShowLimitModal] = useState(false);

  const joinedGroupIds = useSelector(selectJoinedGroupIds);
  const membershipInfo = getMembershipInfo(joinedGroupIds.length);


  const loadGroupDetails = React.useCallback(async (isJoinedOverride?: boolean) => {
    setIsLoading(true);
    try {
      const effectiveJoined = isJoinedOverride !== undefined ? isJoinedOverride : isGroupJoined;

      console.log('📞 Calling getGroupById API...');
      console.log('Group ID:', group.id);
      console.log('User ID:', userId);

      const response = await getGroupById(group.id, userId);
      console.log('✅ Group details response:', response);

      // Update group details from API safely handling nested 'data' objects
      const groupData = response.group || response.data || {};

      if (Object.keys(groupData).length > 0) {
        setGroupDetails((prev: any) => ({ ...prev, ...groupData }));
      }

      // Set members from API natively without mock fallbacks
      const membersData = response.members || response.data?.members || [];
      setMembers(membersData);

      // Determine accurate resolved role based on strict global state logic
      let resolvedRole = response.userRole || response.data?.userRole;
      if (!resolvedRole || resolvedRole === 'none') {
        resolvedRole = effectiveJoined ? 'member' : 'none';
      }

      setUserRole(resolvedRole);
      setGroupDetails((prev: any) => ({ ...prev, ...groupData, isJoined: effectiveJoined }));
      setIsLoading(false);
    } catch (error: any) {
      console.error('❌ Error loading group details:', error);
      const effectiveJoined = isJoinedOverride !== undefined ? isJoinedOverride : isGroupJoined;

      setMembers([]);
      setUserRole(effectiveJoined ? 'member' : 'none');
      setIsLoading(false);
      toast.show({
        description: 'Failed to load group details',
        duration: 3000,
      });
    }
  }, [group.id, isGroupJoined, toast, userId]);

  useEffect(() => {
    loadGroupDetails();
  }, [loadGroupDetails]);

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
      groupId: groupDetails.id,
      groupName: groupDetails.name,
      groupIcon: groupDetails.icon,
      groupDescription: groupDetails.description,
      memberCount: groupDetails.memberCount,
      userRole: userRole,
      therapistName: groupDetails.therapistName,
      therapistAvatar: groupDetails.therapistAvatar,
      therapistEmail: groupDetails.therapistEmail,
      category: groupDetails.category,
      isPrivate: groupDetails.isPrivate,
      maxMembers: groupDetails.maxMembers,
      meetingSchedule: groupDetails.meetingSchedule,
    });
  };

  const handleJoinGroup = () => {
    // Validate membership limits before confirming
    const validation = validateGroupJoin([groupDetails], groupDetails.id, joinedGroupIds.length);

    if (!validation.canJoin) {
      if (validation.reason === 'membership_limit') {
        setShowLimitModal(true);
      } else {
        toast.show({
          description: 'You cannot join this group.',
          duration: 3000,
        });
      }
      return;
    }

    alert.show({
      type: 'confirm',
      title: 'Join Group',
      message: 'Are you sure you want to join this support group? You agree to follow the community guidelines.',
      confirmText: 'Join Group',
      cancelText: 'Cancel',
      onConfirm: async () => {
        try {
          console.log('📞 Calling joinGroup API from GroupDetailScreen...');
          const response = await joinGroup(
            groupDetails.id,
            userId,
            'I struggle with anxiety and need support',
            true
          );
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

          // Update local state and sync Redux globally
          dispatch(addJoinedGroupId(groupDetails.id));
          setUserRole('member');
          setGroupDetails((prev: any) => ({ ...prev, isJoined: true }));

          // Reload group details
          await loadGroupDetails(true);
        } catch (error: any) {
          console.error('❌ Error joining group:', error);
          toast.show({
            description: error.response?.data?.error || 'Failed to join group. Please try again.',
            duration: 3000,
          });
        }
      }
    });
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
          const response = await leaveGroup(
            groupDetails.id,
            userId,
            'Schedule conflict',
            'Great group, but can\'t attend anymore'
          );
          console.log('✅ Leave group response:', response);

          toast.show({
            description: response.message || `You have left ${groupDetails.name}`,
            duration: 3000,
          });

          dispatch(removeJoinedGroupId(groupDetails.id));
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

  const renderMemberItem = ({ item }: { item: GroupMember }) => {
    // Privacy Logic: only mask names & hide photos for regular 'members'
    const isStandardMember = item.role === 'member';
    const displayName = isStandardMember ? generateAnonymousName(item.id, item.name) : item.name;
    const displayAvatar = isStandardMember ? null : item.avatar;

    // Use initial from the masked proxy (e.g. 'M' from 'Member 1234A') if no avatar
    const getSafeInitials = (name: string) => {
      if (!name) return '??';
      const parsed = name.replace(/[^a-zA-Z0-9 ]/g, '').trim();
      const parts = parsed.split(' ').filter(Boolean);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return parsed[0]?.toUpperCase() || '??';
    };

    return (
      <View style={styles.memberItem}>
        <View style={styles.memberAvatar}>
          {displayAvatar ? (
            <Avatar
              source={displayAvatar}
              size={scale(40)}
              rounded
            />
          ) : (
            <Avatar
              title={getSafeInitials(displayName)}
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
            <Text style={styles.memberName}>{displayName}</Text>
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
            {item.isOnline ? 'Online' : (item.lastSeen ? `Last seen ${item.lastSeen}` : '')}
          </Text>
        </View>
      </View>
    );
  };

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
        {groupDetails?.id && userRole !== 'none' && (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('GroupMessagesHistoryScreen', {
              groupId: groupDetails.id,
              groupName: groupDetails.name,
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
            { backgroundColor: getCategoryColor(groupDetails.category) + '20' }
          ]}>
            <Icon
              name={groupDetails.icon}
              type="material"
              color={getCategoryColor(groupDetails.category)}
              size={scale(48)}
            />
            {groupDetails.isPrivate && (
              <View style={styles.privateBadge}>
                <Icon name="lock" type="material" color={appColors.CardBackground} size={scale(16)} />
              </View>
            )}
          </View>

          <Text style={styles.groupName}>{groupDetails.name}</Text>
          <Text style={styles.groupDescription}>{groupDetails.description}</Text>

          <View style={styles.groupStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{groupDetails.memberCount}</Text>
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
                {groupDetails.isPrivate ? 'Private' : 'Public'}
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
              source={getImageSource(groupDetails.therapistAvatar, FALLBACK_IMAGES.avatar)}
              size={scale(50)}
              rounded
              containerStyle={styles.therapistAvatar}
            />
            <View style={styles.therapistInfo}>
              <Text style={styles.therapistName}>{groupDetails.therapistName || ''}</Text>
              <Text style={styles.therapistEmail}>{groupDetails.therapistEmail || ''}</Text>
              <Text style={styles.therapistSpecialty}>
                Specializes in {groupDetails.category || 'General'} support
              </Text>
            </View>
            <TouchableOpacity style={styles.contactButtonDisabled} disabled>
              <Icon name="message" type="material" color={appColors.grey4} size={scale(20)} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Meeting Schedule */}
        {groupDetails.meetingSchedule && (
          <View style={styles.scheduleSection}>
            <Text style={styles.sectionTitle}>Meeting Schedule</Text>
            <View style={styles.scheduleCard}>
              <Icon name="schedule" type="material" color={appColors.AppBlue} size={scale(24)} />
              <Text style={styles.scheduleText}>{groupDetails.meetingSchedule}</Text>
            </View>
          </View>
        )}

        {/* Members List - Only Visible to existing members */}
        {userRole !== 'none' && (
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
              ListEmptyComponent={<Text style={{ fontFamily: appFonts.bodyTextRegular, color: appColors.grey3 }}>No members to display</Text>}
            />
          </View>
        )}

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

      {/* Membership Limit Modal */}
      <MembershipLimitModal
        visible={showLimitModal}
        currentGroupCount={membershipInfo.joinedGroupsCount}
        maxAllowed={membershipInfo.groupLimit}
        onClose={() => setShowLimitModal(false)}
      />

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
