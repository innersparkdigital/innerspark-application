import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { appColors, appFonts } from '../../global/Styles';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';
import { getGroups } from '../../api/therapist';



const THGroupsScreen = ({ navigation }: any) => {
  const userDetails = useSelector((state: any) => state.userData.userDetails);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('active');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const therapistId = userDetails?.id || '52863268761';

      const response: any = await getGroups(therapistId);

      if (response?.data?.groups) {
        setGroups(response.data.groups);
      } else {
        setGroups([]);
      }
    } catch (error) {
      console.error('Failed to load groups:', error);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGroups();
    setRefreshing(false);
  };

  const getFilteredGroups = () => {
    return groups.filter((group: any) =>
      selectedTab === 'active' ? group.status === 'active' :
        selectedTab === 'scheduled' ? group.status === 'scheduled' :
          group.status === 'archived'
    );
  };

  const filteredGroups = getFilteredGroups();
  const totalMembers = groups.reduce((sum: number, g: any) => sum + (g.members || 0), 0);

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />

      <ISGenericHeader
        title="Support Groups"
        navigation={navigation}
        hasRightIcon={true}
        rightIconName="add"
        rightIconOnPress={() => navigation.navigate('THCreateGroupScreen')}
      />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[appColors.AppBlue]}
            tintColor={appColors.AppBlue}
          />
        }
      >
        {/* Stats Overview */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{groups.filter((g: any) => g.status === 'active').length}</Text>
            <Text style={styles.statLabel}>Active Groups</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{totalMembers}</Text>
            <Text style={styles.statLabel}>Total Members</Text>
          </View>
        </View>

        {/* Tab Filters */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'active' && styles.tabActive]}
            onPress={() => setSelectedTab('active')}
          >
            <Text style={[styles.tabText, selectedTab === 'active' && styles.tabTextActive]}>
              Active
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'scheduled' && styles.tabActive]}
            onPress={() => setSelectedTab('scheduled')}
          >
            <Text style={[styles.tabText, selectedTab === 'scheduled' && styles.tabTextActive]}>
              Scheduled
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'archived' && styles.tabActive]}
            onPress={() => setSelectedTab('archived')}
          >
            <Text style={[styles.tabText, selectedTab === 'archived' && styles.tabTextActive]}>
              Archived
            </Text>
          </TouchableOpacity>
        </View>

        {/* Groups List */}
        <View style={styles.groupsList}>
          {loading ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <ActivityIndicator size="large" color={appColors.AppBlue} />
              <Text style={{ marginTop: 10, color: appColors.grey3 }}>Loading groups...</Text>
            </View>
          ) : filteredGroups.length === 0 ? (
            <View style={{ padding: 60, alignItems: 'center' }}>
              <Icon type="material" name="people-outline" size={80} color={appColors.grey4} />
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: appColors.grey2, marginTop: 20 }}>No Groups</Text>
              <Text style={{ fontSize: 14, color: appColors.grey3, marginTop: 8, textAlign: 'center' }}>
                {selectedTab === 'active' ? 'No active support groups yet.' :
                  selectedTab === 'scheduled' ? 'No scheduled groups.' :
                    'No archived groups.'}
              </Text>
            </View>
          ) : (
            filteredGroups.map((group: any) => (
              <TouchableOpacity
                key={group.id}
                style={styles.groupCard}
                onPress={() => navigation.navigate('THGroupDetailsScreen', { group })}
                activeOpacity={0.7}
              >
                <View style={styles.groupHeader}>
                  <View style={styles.groupIconContainer}>
                    <Text style={styles.groupIcon}>{group.icon}</Text>
                  </View>
                  <View style={styles.groupInfo}>
                    <Text style={styles.groupName}>{group.name}</Text>
                    <Text style={styles.groupDescription}>{group.description}</Text>
                  </View>
                </View>

                <View style={styles.groupMeta}>
                  <View style={styles.metaItem}>
                    <Icon type="material" name="people" size={16} color={appColors.grey3} />
                    <Text style={styles.metaText}>{group.members} members</Text>
                  </View>
                  <Text style={styles.metaSeparator}>•</Text>
                  <View style={styles.metaItem}>
                    <Icon type="material" name="schedule" size={16} color={appColors.grey3} />
                    <Text style={styles.metaText}>{group.nextSession}</Text>
                  </View>
                </View>

                <View style={styles.groupActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('THGroupChatScreen', { group })}
                    activeOpacity={0.7}
                  >
                    <Icon type="material" name="message" size={18} color={appColors.AppBlue} />
                    <Text style={styles.actionButtonText}>Message</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.actionButtonPrimary]}
                    onPress={() => navigation.navigate('THGroupDetailsScreen', { group })}
                    activeOpacity={0.7}
                  >
                    <Icon type="material" name="play-circle-filled" size={18} color="#FFFFFF" />
                    <Text style={[styles.actionButtonText, styles.actionButtonTextPrimary]}>
                      Start Session
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )))}
        </View>
      </ScrollView>
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
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  statLabel: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: appColors.AppBlue,
  },
  tabText: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextMedium,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  groupsList: {
    marginBottom: 20,
  },
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
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
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: appColors.AppBlue + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  groupIcon: {
    fontSize: 24,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  groupDescription: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  groupMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  metaSeparator: {
    fontSize: 13,
    color: appColors.grey4,
    marginHorizontal: 8,
  },
  groupActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: appColors.AppBlue,
    gap: 6,
  },
  actionButtonPrimary: {
    backgroundColor: appColors.AppBlue,
    borderColor: appColors.AppBlue,
  },
  actionButtonText: {
    fontSize: 13,
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextMedium,
    fontWeight: '600',
  },
  actionButtonTextPrimary: {
    color: '#FFFFFF',
  },
});

export default THGroupsScreen;
