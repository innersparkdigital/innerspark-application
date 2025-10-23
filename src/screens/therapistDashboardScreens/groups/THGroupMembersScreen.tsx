/**
 * Therapist Group Members Management Screen
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import { appColors, appFonts } from '../../../global/Styles';
import ISGenericHeader from '../../../components/ISGenericHeader';
import ISStatusBar from '../../../components/ISStatusBar';

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

  const [members, setMembers] = useState<Member[]>([
    {
      id: '1',
      name: 'John Doe',
      avatar: '👨',
      status: 'active',
      joinedDate: 'Jan 2025',
      attendance: '90%',
      lastActive: '2 min ago',
      role: 'member',
    },
    {
      id: '2',
      name: 'Sarah Williams',
      avatar: '👩',
      status: 'active',
      joinedDate: 'Jan 2025',
      attendance: '85%',
      lastActive: '5 min ago',
      role: 'moderator',
    },
    {
      id: '3',
      name: 'Michael Brown',
      avatar: '👨‍💼',
      status: 'active',
      joinedDate: 'Dec 2024',
      attendance: '95%',
      lastActive: '1 hour ago',
      role: 'member',
    },
    {
      id: '4',
      name: 'Emily Chen',
      avatar: '👩‍💼',
      status: 'muted',
      joinedDate: 'Dec 2024',
      attendance: '88%',
      lastActive: '3 hours ago',
      role: 'member',
    },
    {
      id: '5',
      name: 'David Martinez',
      avatar: '👨‍🦱',
      status: 'inactive',
      joinedDate: 'Nov 2024',
      attendance: '45%',
      lastActive: '2 days ago',
      role: 'member',
    },
  ]);

  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || member.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleMemberAction = (member: Member) => {
    const actions = [
      { text: 'Cancel', style: 'cancel' },
      { text: 'View Profile', onPress: () => navigation.navigate('THGroupMemberProfileScreen', { member }) },
    ];

    if (member.role === 'member') {
      actions.push({
        text: 'Make Moderator',
        onPress: () => {
          setMembers(
            members.map((m) =>
              m.id === member.id ? { ...m, role: 'moderator' as const } : m
            )
          );
          Alert.alert('Success', `${member.name} is now a moderator`);
        },
      });
    } else {
      actions.push({
        text: 'Remove Moderator',
        onPress: () => {
          setMembers(
            members.map((m) =>
              m.id === member.id ? { ...m, role: 'member' as const } : m
            )
          );
          Alert.alert('Success', `${member.name} is no longer a moderator`);
        },
      });
    }

    if (member.status === 'muted') {
      actions.push({
        text: 'Unmute',
        onPress: () => {
          setMembers(
            members.map((m) =>
              m.id === member.id ? { ...m, status: 'active' as const } : m
            )
          );
          Alert.alert('Success', `${member.name} has been unmuted`);
        },
      });
    } else {
      actions.push({
        text: 'Mute',
        onPress: () => {
          setMembers(
            members.map((m) =>
              m.id === member.id ? { ...m, status: 'muted' as const } : m
            )
          );
          Alert.alert('Success', `${member.name} has been muted`);
        },
      });
    }

    actions.push({
      text: 'Remove from Group',
      onPress: () => {
        Alert.alert(
          'Remove Member',
          `Are you sure you want to remove ${member.name} from the group?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Remove',
              style: 'destructive',
              onPress: () => {
                setMembers(members.filter((m) => m.id !== member.id));
                Alert.alert('Success', `${member.name} has been removed`);
              },
            },
          ]
        );
      },
    });

    Alert.alert('Manage Member', `What would you like to do with ${member.name}?`, actions as any);
  };


  const renderMember = ({ item }: { item: Member }) => (
    <TouchableOpacity
      style={styles.memberCard}
      onPress={() => handleMemberAction(item)}
      activeOpacity={0.7}
    >
      <View style={styles.memberLeft}>
        <View style={styles.memberAvatar}>
          <Text style={styles.memberAvatarText}>{item.avatar}</Text>
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
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Icon type="material" name="people-outline" size={60} color={appColors.grey3} />
              <Text style={styles.emptyText}>No members found</Text>
            </View>
          }
        />
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
  memberAvatarText: {
    fontSize: 24,
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
