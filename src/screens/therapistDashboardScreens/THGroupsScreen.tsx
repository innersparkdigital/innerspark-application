import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Skeleton } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { appColors, appFonts } from '../../global/Styles';
import { moderateScale } from '../../global/Scaling';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';
import { getGroups } from '../../api/therapist';
import { useFocusEffect } from '@react-navigation/native';
import ISAlert, { useISAlert } from '../../components/alerts/ISAlert';
import { getGroupIcon } from '../../utils/GroupUtils';
import { truncateText, decodeHTMLEntities } from '../../utils/textHelpers';
import { startGroupSession } from '../../api/therapist';



const THGroupsScreen = ({ navigation }: any) => {
  const userDetails = useSelector((state: any) => state.userData.userDetails);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('active');
  const [refreshing, setRefreshing] = useState(false);
  const alert = useISAlert();

  useEffect(() => {
    loadGroups();
  }, []);

  // Reload groups whenever this tab comes into focus
  // (e.g. after creating a group, managing members, or returning from chat)
  useFocusEffect(
    useCallback(() => {
      loadGroups();
    }, [])
  );

  const loadGroups = async () => {
    try {
      setLoading(true);
      const therapistId = userDetails?.userId;

      const response: any = await getGroups(therapistId);

      if (response?.data?.groups) {
        const mappedGroups = response.data.groups.map((g: any) => {
          let nextSessionStr = 'No upcoming sessions';
          if (g.nextSession && typeof g.nextSession === 'object' && g.nextSession.date) {
            nextSessionStr = `${g.nextSession.date} at ${g.nextSession.time || ''}`;
          } else if (typeof g.nextSession === 'string') {
            nextSessionStr = g.nextSession;
          }
          return {
            ...g,
            nextSession: nextSessionStr
          };
        });
        setGroups(mappedGroups);
      } else {
        setGroups([]);
      }
    } catch (error: any) {
      const errorMessage = error.backendMessage || error.message || 'Failed to load groups';
      console.error('Groups Error:', errorMessage);
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

  const handleStartSession = async (group: any) => {
    try {
      setLoading(true);
      const therapistId = userDetails?.userId;
      const response: any = await startGroupSession(group.id, therapistId);
      
      if (response && response.success !== false) {
        navigation.navigate('THGroupChatScreen', { group });
      }
    } catch (error: any) {
      const errorMessage = error.backendMessage || error.message || 'Failed to start session';
      console.error('Start Session Error:', errorMessage);
      alert.show({
        type: 'error',
        title: 'Session Error',
        message: errorMessage,
        confirmText: 'OK'
      });
    } finally {
      setLoading(false);
    }
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

  const GroupStatSkeleton = () => (
    <View style={styles.statBox}>
      <Skeleton animation="pulse" width={50} height={40} style={{ borderRadius: 8, marginBottom: 4 }} />
      <Skeleton animation="pulse" width={80} height={12} style={{ borderRadius: 4 }} />
    </View>
  );

  const GroupCardSkeleton = () => (
    <View style={styles.groupCard}>
      <View style={styles.groupHeader}>
        <View style={styles.groupIconContainer}>
          <Skeleton animation="pulse" width={50} height={50} style={{ borderRadius: 25 }} />
        </View>
        <View style={styles.groupInfo}>
          <Skeleton animation="pulse" width="60%" height={20} style={{ borderRadius: 4, marginBottom: 8 }} />
          <Skeleton animation="pulse" width="90%" height={14} style={{ borderRadius: 4 }} />
        </View>
      </View>
      <View style={styles.groupMeta}>
        <Skeleton animation="pulse" width="30%" height={14} style={{ borderRadius: 4, marginRight: 16 }} />
        <Skeleton animation="pulse" width="40%" height={14} style={{ borderRadius: 4 }} />
      </View>
      <View style={styles.groupActions}>
        <Skeleton animation="pulse" width="48%" height={40} style={{ borderRadius: 8 }} />
        <Skeleton animation="pulse" width="48%" height={40} style={{ borderRadius: 8 }} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />

      <ISGenericHeader
        title="Support Groups"
        navigation={navigation}
        hasRightIcon={true}
        rightIconName="add"
        rightIconOnPress={() => {
          alert.show({
            type: 'info',
            title: '✨ Premium Feature',
            message: 'Support groups are configured via the Innerspark Web Dashboard to ensure clinical safety and data integrity. \n\nLog in to your dashboard at innersparkafrica.com to create or archive groups.',
            confirmText: 'GOT IT'
          });
        }}
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
          {loading && !refreshing ? (
            <>
              <GroupStatSkeleton />
              <GroupStatSkeleton />
            </>
          ) : (
            <>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{groups.filter((g: any) => g.status === 'active').length}</Text>
                <Text style={styles.statLabel}>Active Groups</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{totalMembers}</Text>
                <Text style={styles.statLabel}>Total Members</Text>
              </View>
            </>
          )}
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
          {loading && !refreshing ? (
            [1, 2, 3].map(i => <GroupCardSkeleton key={i} />)
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
                    {group.icon_url ? (
                      <Image 
                        source={{ uri: group.icon_url }} 
                        style={styles.groupIconImage} 
                      />
                    ) : (
                      <Text style={styles.groupIcon}>{getGroupIcon(group.icon)}</Text>
                    )}
                  </View>
                  <View style={styles.groupInfo}>
                    <Text style={styles.groupName}>{decodeHTMLEntities(group.name)}</Text>
                    <Text style={styles.groupDescription}>{truncateText(decodeHTMLEntities(group.description), 150)}</Text>
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
                    onPress={() => handleStartSession(group)}
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
    fontSize: moderateScale(32),
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
    fontSize: moderateScale(24),
  },
  groupIconImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
