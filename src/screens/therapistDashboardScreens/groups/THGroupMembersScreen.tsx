/**
 * Therapist Group Members Management Screen
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Icon } from '@rneui/themed';
import { appColors, appFonts } from '../../../global/Styles';
import { appImages } from '../../../global/Data';
import ISGenericHeader from '../../../components/ISGenericHeader';
import ISStatusBar from '../../../components/ISStatusBar';
import ISAlert, { useISAlert, ISAlertAction } from '../../../components/alerts/ISAlert';
import { useSelector } from 'react-redux';
import {
  getGroupMembers,
  updateGroupMemberRole,
  muteGroupMember,
  unmuteGroupMember,
  removeGroupMember
} from '../../../api/therapist';

interface Member {
  id: string;
  name: string;
  avatar: string;
  status: 'active' | 'inactive' | 'muted';
  joinedDate: string;
  attendance: string;
  lastActive: string;
  role: 'member' | 'moderator';
}

const THGroupMembersScreen = ({ navigation, route }: any) => {
  const { group, filter } = route.params || {};
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'inactive' | 'muted'>(filter || 'all');

  const userDetails = useSelector((state: any) => state.userData.userDetails);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const alert = useISAlert();

  useFocusEffect(
    React.useCallback(() => {
      loadMembers();
    }, [])
  );

  const loadMembers = async () => {
    if (!group?.id) return;
    try {
      setLoading(true);
      const therapistId = userDetails?.userId;
      const response: any = await getGroupMembers(group.id, therapistId, { filter: selectedFilter });
      if (response?.data?.members) {
        setMembers(response.data.members);
      } else {
        setMembers([]);
      }
    } catch (error: any) {
      const errorMessage = error.backendMessage || error.message || 'Failed to load members';
      console.error('Group Members Error:', errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMembers();
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || member.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleMemberAction = (member: Member) => {
    const actions: ISAlertAction[] = [
      { text: 'View Profile', onPress: () => navigation.navigate('THGroupMemberProfileScreen', { member }) },
    ];

    const therapistId = userDetails?.userId;

    if (member.role === 'member') {
      actions.push({
        text: 'Make Moderator',
        onPress: async () => {
          try {
            await updateGroupMemberRole(group.id, member.id, therapistId, 'moderator');
            setMembers((prev) => prev.map((m) => m.id === member.id ? { ...m, role: 'moderator' as const } : m));
            setTimeout(() => {
              alert.show({ type: 'success', title: 'Success', message: `${member.name} is now a moderator` });
            }, 300);
          } catch (error: any) {
            setTimeout(() => {
              alert.show({ type: 'error', title: 'Error', message: error.backendMessage || 'Failed to update role' });
            }, 300);
          }
        },
      });
    } else {
      actions.push({
        text: 'Remove Moderator',
        onPress: async () => {
          try {
            await updateGroupMemberRole(group.id, member.id, therapistId, 'member');
            setMembers((prev) => prev.map((m) => m.id === member.id ? { ...m, role: 'member' as const } : m));
            setTimeout(() => {
              alert.show({ type: 'success', title: 'Success', message: `${member.name} is no longer a moderator` });
            }, 300);
          } catch (error: any) {
            setTimeout(() => {
              alert.show({ type: 'error', title: 'Error', message: error.backendMessage || 'Failed to update role' });
            }, 300);
          }
        },
      });
    }

    if (member.status === 'muted') {
      actions.push({
        text: 'Unmute Member',
        onPress: async () => {
          try {
            await unmuteGroupMember(group.id, member.id, therapistId);
            setMembers((prev) => prev.map((m) => m.id === member.id ? { ...m, status: 'active' as const } : m));
            setTimeout(() => {
              alert.show({ type: 'success', title: 'Success', message: `${member.name} has been unmuted` });
            }, 300);
          } catch (error: any) {
            setTimeout(() => {
              alert.show({ type: 'error', title: 'Error', message: error.backendMessage || 'Failed to unmute member' });
            }, 300);
          }
        },
      });
    } else {
      actions.push({
        text: 'Mute Member (5m)',
        onPress: async () => {
          try {
            await muteGroupMember(group.id, member.id, therapistId, 300); // Mute for 5 minutes
            setMembers((prev) => prev.map((m) => m.id === member.id ? { ...m, status: 'muted' as const } : m));
            setTimeout(() => {
              alert.show({ type: 'success', title: 'Success', message: `${member.name} has been muted` });
            }, 300);
          } catch (error: any) {
            setTimeout(() => {
              alert.show({ type: 'error', title: 'Error', message: error.backendMessage || 'Failed to mute member' });
            }, 300);
          }
        },
      });
    }

    actions.push({
      text: 'Remove from Group',
      style: 'destructive',
      onPress: () => {
        // Delay ensures the previous 'Member Options' alert is fully hidden before showing confirmation
        setTimeout(() => {
          alert.show({
            type: 'destructive',
            title: 'Remove Member',
            message: `Are you sure you want to remove ${member.name} from the group?`,
            confirmText: 'Remove',
            cancelText: 'Cancel',
            onConfirm: async () => {
              try {
                await removeGroupMember(group.id, member.id, therapistId);
                setMembers((prev) => prev.filter((m) => m.id !== member.id));
                // Delay ensures the 'Remove Member' confirmation is hidden before showing success
                setTimeout(() => {
                  alert.show({ type: 'success', title: 'Removed', message: `${member.name} has been removed` });
                }, 400);
              } catch (error: any) {
                setTimeout(() => {
                  alert.show({ type: 'error', title: 'Error', message: error.backendMessage || 'Failed to remove member' });
                }, 400);
              }
            },
          });
        }, 400);
      },
    });

    actions.push({ text: 'Cancel', style: 'cancel' });

    alert.show({
      type: 'info',
      title: 'Member Options',
      message: `What would you like to do with ${member.name}?`,
      actions: actions,
    });
  };


  const renderMember = ({ item }: { item: Member }) => (
    <TouchableOpacity
      style={styles.memberCard}
      onPress={() => handleMemberAction(item)}
      activeOpacity={0.7}
    >
      <View style={styles.memberLeft}>
        <View style={styles.memberAvatar}>
          <Image
            source={item?.avatar?.startsWith('http') ? { uri: item.avatar } : appImages.avatarPlaceholder}
            style={styles.memberAvatarImage}
          />
          {item.status === 'active' && <View style={styles.onlineDot} />}
        </View>
        <View style={styles.memberInfo}>
          <View style={styles.memberNameRow}>
            <Text style={styles.memberName}>{item.name}</Text>
            {item.role === 'moderator' && (
              <View style={styles.moderatorBadge}>
                <Icon type="material" name="shield" size={12} color={appColors.AppBlue} />
                <Text style={styles.moderatorText}>Mod</Text>
              </View>
            )}
          </View>
          <Text style={styles.memberMeta}>Joined {item.joinedDate}</Text>
          <View style={styles.memberStats}>
            <Text style={styles.statText}>Attendance: {item.attendance}</Text>
            <Text style={styles.statDivider}>•</Text>
            <Text style={styles.statText}>{item.lastActive}</Text>
          </View>
        </View>
      </View>
      <View style={styles.memberRight}>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.status === 'active'
                  ? appColors.AppGreen + '20'
                  : item.status === 'muted'
                    ? '#FF9800' + '20'
                    : appColors.grey6,
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color:
                  item.status === 'active'
                    ? appColors.AppGreen
                    : item.status === 'muted'
                      ? '#FF9800'
                      : appColors.grey3,
              },
            ]}
          >
            {item.status}
          </Text>
        </View>
        <Icon type="material" name="more-vert" size={20} color={appColors.grey3} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />
      <ISGenericHeader
        title="Group Members"
        navigation={navigation}
      />

      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon type="material" name="search" size={20} color={appColors.grey3} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search members..."
            placeholderTextColor={appColors.grey3}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterTab, selectedFilter === 'all' && styles.filterTabActive]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === 'all' && styles.filterTextActive,
              ]}
            >
              All ({members.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, selectedFilter === 'active' && styles.filterTabActive]}
            onPress={() => setSelectedFilter('active')}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === 'active' && styles.filterTextActive,
              ]}
            >
              Active ({members.filter((m) => m.status === 'active').length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, selectedFilter === 'muted' && styles.filterTabActive]}
            onPress={() => setSelectedFilter('muted')}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === 'muted' && styles.filterTextActive,
              ]}
            >
              Muted ({members.filter((m) => m.status === 'muted').length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Members List */}
        <FlatList
          data={filteredMembers}
          renderItem={renderMember}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[appColors.AppBlue]}
              tintColor={appColors.AppBlue}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Icon type="material" name="people-outline" size={60} color={appColors.grey3} />
              <Text style={styles.emptyText}>No members found</Text>
            </View>
          }
        />
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
  content: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  filterTabActive: {
    backgroundColor: appColors.AppBlue,
  },
  filterText: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextMedium,
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  memberCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  memberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: appColors.AppLightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  memberAvatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: appColors.AppGreen,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  memberInfo: {
    flex: 1,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
  },
  moderatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.AppBlue + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  moderatorText: {
    fontSize: 10,
    color: appColors.AppBlue,
    fontWeight: 'bold',
    fontFamily: appFonts.bodyTextBold,
  },
  memberMeta: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: 4,
  },
  memberStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 11,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  statDivider: {
    fontSize: 11,
    color: appColors.grey3,
  },
  memberRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: appFonts.bodyTextBold,
    textTransform: 'capitalize',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginTop: 16,
  },
});

export default THGroupMembersScreen;
