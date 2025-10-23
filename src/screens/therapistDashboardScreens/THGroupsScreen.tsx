import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import { appColors, appFonts } from '../../global/Styles';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';

// Mock data for support groups
const mockGroups = [
  {
    id: '1',
    name: 'Anxiety Support Circle',
    description: 'A safe space for managing anxiety',
    members: 12,
    nextSession: 'Today, 3:00 PM',
    status: 'active',
    icon: '🧘',
  },
  {
    id: '2',
    name: 'Depression Recovery Group',
    description: 'Journey together towards healing',
    members: 8,
    nextSession: 'Tomorrow, 10:00 AM',
    status: 'active',
    icon: '🌱',
  },
  {
    id: '3',
    name: 'Stress Management Workshop',
    description: 'Learn coping strategies',
    members: 15,
    nextSession: 'Friday, 2:00 PM',
    status: 'scheduled',
    icon: '🧠',
  },
  {
    id: '4',
    name: 'Mindfulness & Meditation',
    description: 'Practice presence and calm',
    members: 20,
    nextSession: 'Saturday, 9:00 AM',
    status: 'scheduled',
    icon: '🕉️',
  },
];

const THGroupsScreen = ({ navigation }: any) => {
  const [selectedTab, setSelectedTab] = useState('active');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Add API calls here to fetch:
    // - Groups list (active, scheduled, archived)
    // - Group stats (active groups, total members)
    // - Group details (members count, next session, status)
    // - Member details for each group
    // Example:
    // await fetchGroups(selectedTab);
    
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

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
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Active Groups</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>55</Text>
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
          {mockGroups.map((group) => (
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
          ))}
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
