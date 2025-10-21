import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import { appColors, appFonts } from '../../../global/Styles';
import ISGenericHeader from '../../../components/ISGenericHeader';
import ISStatusBar from '../../../components/ISStatusBar';

const THGroupDetailsScreen = ({ navigation, route }: any) => {
  const { group } = route.params || {};
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock members data
  const members = [
    { id: '1', name: 'John Doe', avatar: '👨', status: 'active', joinedDate: 'Jan 2025', attendance: '90%' },
    { id: '2', name: 'Sarah Williams', avatar: '👩', status: 'active', joinedDate: 'Jan 2025', attendance: '85%' },
    { id: '3', name: 'Michael Brown', avatar: '👨‍💼', status: 'active', joinedDate: 'Dec 2024', attendance: '95%' },
    { id: '4', name: 'Emily Chen', avatar: '👩‍💼', status: 'active', joinedDate: 'Dec 2024', attendance: '88%' },
    { id: '5', name: 'David Martinez', avatar: '👨‍🦱', status: 'inactive', joinedDate: 'Nov 2024', attendance: '45%' },
  ];

  // Mock sessions data
  const sessions = [
    { id: '1', date: 'Today, 3:00 PM', topic: 'Managing Anxiety Triggers', duration: '60 min', status: 'upcoming' },
    { id: '2', date: 'Jan 18, 2:00 PM', topic: 'Breathing Techniques', duration: '60 min', status: 'completed' },
    { id: '3', date: 'Jan 11, 3:00 PM', topic: 'Introduction & Goals', duration: '90 min', status: 'completed' },
  ];

  const handleStartSession = () => {
    Alert.alert(
      'Start Group Session',
      'Ready to start the session with all group members?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start',
          onPress: () => {
            // Navigate to session or open meeting
            Alert.alert('Success', 'Session started! Meeting link sent to all members.');
          },
        },
      ]
    );
  };

  const handleEditGroup = () => {
    navigation.navigate('THEditGroupScreen', { group });
  };

  const handleMessageGroup = () => {
    Alert.alert('Message Group', 'Send a message to all group members');
  };

  const handleAddMember = () => {
    Alert.alert('Add Member', 'Invite new members to this group');
  };

  const handleScheduleSession = () => {
    navigation.navigate('THScheduleGroupSessionScreen', { group });
  };

  const renderMember = ({ item }: any) => (
    <TouchableOpacity style={styles.memberCard}>
      <View style={styles.memberLeft}>
        <View style={styles.memberAvatar}>
          <Text style={styles.memberAvatarText}>{item.avatar}</Text>
        </View>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{item.name}</Text>
          <Text style={styles.memberMeta}>Joined {item.joinedDate}</Text>
        </View>
      </View>
      <View style={styles.memberRight}>
        <Text style={styles.attendanceText}>{item.attendance}</Text>
        <View style={[styles.statusDot, { backgroundColor: item.status === 'active' ? appColors.AppGreen : appColors.grey3 }]} />
      </View>
    </TouchableOpacity>
  );

  const renderSession = ({ item }: any) => (
    <View style={styles.sessionCard}>
      <View style={styles.sessionHeader}>
        <View style={[styles.sessionStatus, { backgroundColor: item.status === 'upcoming' ? appColors.AppGreen + '20' : appColors.grey6 }]}>
          <Text style={[styles.sessionStatusText, { color: item.status === 'upcoming' ? appColors.AppGreen : appColors.grey3 }]}>
            {item.status}
          </Text>
        </View>
        <Text style={styles.sessionDate}>{item.date}</Text>
      </View>
      <Text style={styles.sessionTopic}>{item.topic}</Text>
      <View style={styles.sessionFooter}>
        <Icon type="material" name="access-time" size={14} color={appColors.grey3} />
        <Text style={styles.sessionDuration}>{item.duration}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />
      <ISGenericHeader 
        title={group?.name || 'Group Details'} 
        navigation={navigation}
        hasRightIcon={true}
        rightIconName="edit"
        rightIconOnPress={handleEditGroup}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Group Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.groupIconLarge}>
            <Text style={styles.groupIconLargeText}>{group?.icon}</Text>
          </View>
          <Text style={styles.groupName}>{group?.name}</Text>
          <Text style={styles.groupDescription}>{group?.description}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Icon type="material" name="people" size={20} color={appColors.AppBlue} />
              <Text style={styles.statValue}>{group?.members}</Text>
              <Text style={styles.statLabel}>Members</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Icon type="material" name="event" size={20} color={appColors.AppBlue} />
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Icon type="material" name="trending-up" size={20} color={appColors.AppBlue} />
              <Text style={styles.statValue}>85%</Text>
              <Text style={styles.statLabel}>Attendance</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton} onPress={handleMessageGroup}>
            <Icon type="material" name="message" size={20} color={appColors.AppBlue} />
            <Text style={styles.quickActionText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton} onPress={handleAddMember}>
            <Icon type="material" name="person-add" size={20} color={appColors.AppBlue} />
            <Text style={styles.quickActionText}>Add Member</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton} onPress={handleScheduleSession}>
            <Icon type="material" name="schedule" size={20} color={appColors.AppBlue} />
            <Text style={styles.quickActionText}>Schedule</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'overview' && styles.tabActive]}
            onPress={() => setSelectedTab('overview')}
          >
            <Text style={[styles.tabText, selectedTab === 'overview' && styles.tabTextActive]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'members' && styles.tabActive]}
            onPress={() => setSelectedTab('members')}
          >
            <Text style={[styles.tabText, selectedTab === 'members' && styles.tabTextActive]}>
              Members ({members.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'sessions' && styles.tabActive]}
            onPress={() => setSelectedTab('sessions')}
          >
            <Text style={[styles.tabText, selectedTab === 'sessions' && styles.tabTextActive]}>
              Sessions
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <View style={styles.tabContent}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Next Session</Text>
              <View style={styles.nextSessionInfo}>
                <Icon type="material" name="event" size={24} color={appColors.AppBlue} />
                <View style={styles.nextSessionDetails}>
                  <Text style={styles.nextSessionDate}>{group?.nextSession}</Text>
                  <Text style={styles.nextSessionTopic}>Managing Anxiety Triggers</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.startButton} onPress={handleStartSession}>
                <Icon type="material" name="play-circle-filled" size={20} color="#FFFFFF" />
                <Text style={styles.startButtonText}>Start Session</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Group Guidelines</Text>
              <Text style={styles.guidelineText}>• Respect confidentiality of all members</Text>
              <Text style={styles.guidelineText}>• Attend sessions regularly</Text>
              <Text style={styles.guidelineText}>• Participate actively and supportively</Text>
              <Text style={styles.guidelineText}>• No judgment or criticism</Text>
            </View>
          </View>
        )}

        {selectedTab === 'members' && (
          <View style={styles.tabContent}>
            <FlatList
              data={members}
              renderItem={renderMember}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {selectedTab === 'sessions' && (
          <View style={styles.tabContent}>
            <FlatList
              data={sessions}
              renderItem={renderSession}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        <View style={{ height: 100 }} />
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
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  groupIconLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: appColors.AppBlue + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupIconLargeText: {
    fontSize: 40,
  },
  groupName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 8,
    textAlign: 'center',
  },
  groupDescription: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'center',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: appColors.grey6,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: appColors.grey6,
  },
  quickActions: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  quickActionButton: {
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
  quickActionText: {
    fontSize: 12,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextMedium,
    marginTop: 6,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
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
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextMedium,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tabContent: {
    marginHorizontal: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 16,
  },
  nextSessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  nextSessionDetails: {
    marginLeft: 12,
    flex: 1,
  },
  nextSessionDate: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
    marginBottom: 4,
  },
  nextSessionTopic: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  startButton: {
    backgroundColor: appColors.AppGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: appFonts.headerTextBold,
  },
  guidelineText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: 10,
    lineHeight: 22,
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
  },
  memberAvatarText: {
    fontSize: 24,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
    marginBottom: 4,
  },
  memberMeta: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  memberRight: {
    alignItems: 'flex-end',
  },
  attendanceText: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextMedium,
    marginBottom: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sessionStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sessionStatusText: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: appFonts.bodyTextBold,
    textTransform: 'uppercase',
  },
  sessionDate: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  sessionTopic: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
    marginBottom: 8,
  },
  sessionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionDuration: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginLeft: 6,
  },
});

export default THGroupDetailsScreen;
