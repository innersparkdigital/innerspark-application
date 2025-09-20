/**
 * App HomeScreen - Mental Health Wellness Dashboard
 */
import React, { useState, useEffect, useCallback }  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button, Avatar } from '@rneui/base';
import { appColors, parameters, appFonts } from '../global/Styles';
import { useToast } from 'native-base';
import { APIGlobaltHeaders, baseUrlRoot, baseUrlV1 } from '../api/LHAPI';
import { appImages } from '../global/Data';
import { getFirstName } from '../global/LHShortcuts';


const baseUrl = baseUrlRoot + baseUrlV1;
APIGlobaltHeaders(); // API Global headers

// get the screen Width
const SCREEN_WIDTH = Dimensions.get('window').width;

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const userDetails = useSelector(state => state.userData.userDetails);
  const [selectedMood, setSelectedMood] = useState(null);

  // Mock data for upcoming sessions
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [recentActivities] = useState([
    { id: 1, type: 'mood', title: 'Mood Check-in', time: '2 hours ago' },
    { id: 2, type: 'session', title: 'Therapy Session', time: '1 day ago' },
    { id: 3, type: 'exercise', title: 'Breathing Exercise', time: '2 days ago' },
  ]);

  const moodOptions = [
    { id: 1, name: 'Great', emoji: '😊', color: '#4CAF50' },
    { id: 2, name: 'Good', emoji: '🙂', color: '#8BC34A' },
    { id: 3, name: 'Okay', emoji: '😐', color: '#FFC107' },
    { id: 4, name: 'Bad', emoji: '😔', color: '#FF9800' },
    { id: 5, name: 'Terrible', emoji: '😢', color: '#F44336' },
  ];

  const quickActions = [
    { id: 1, title: 'My Goals', icon: 'flag', color: '#4CAF50', screen: 'GoalsScreen' },
    { id: 2, title: 'Therapy Groups', icon: 'people', color: '#2196F3', screen: 'TherapistsScreen' },
    { id: 3, title: 'Events', icon: 'event', color: '#FF9800', screen: 'EventsScreen' },
    { id: 4, title: 'Sessions', icon: 'psychology', color: '#9C27B0', screen: 'BookingsScreen' },
    { id: 5, title: 'Mood Tracker', icon: 'mood', color: '#E91E63', screen: 'MoodScreen' },
    { id: 6, title: 'Emergency', icon: 'emergency', color: '#F44336', screen: 'EmergencyScreen' },
    { id: 7, title: 'Meditation', icon: 'self-improvement', color: '#673AB7', screen: 'MeditationScreen' },
    { id: 8, title: 'Journal', icon: 'book', color: '#795548', screen: 'JournalScreen' },
  ];

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    toast.show({
      description: `Mood "${mood.name}" recorded!`,
      duration: 2000,
    });
  };

  const handleQuickAction = (action) => {
    const availableScreens = ['TherapistsScreen', 'BookingsScreen', 'MoodScreen', 'EmergencyScreen'];
    
    if (availableScreens.includes(action.screen)) {
      navigation.navigate(action.screen);
    } else {
      toast.show({
        description: `${action.title} feature coming soon!`,
        duration: 2000,
      });
    }
  };

  const notifyWithToast = (description) => {
    toast.show({
      description: description,
      duration: 2000,
    });
  };


  const QuickActionCard = ({ action }) => (
    <TouchableOpacity
      style={styles.actionCard}
      onPress={() => handleQuickAction(action)}
    >
      <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
        <Icon
          name={action.icon}
          type="material"
          color={action.color}
          size={24}
        />
      </View>
      <Text style={styles.actionTitle}>{action.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={appColors.AppBlue} barStyle="light-content" />
      
      {/* Header Section */}
      <View style={styles.header}>
        {/* Top row with icons */}
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => notifyWithToast('Messages feature coming soon!')}
          >
            <Icon name="chat" type="material" color={appColors.CardBackground} size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('NotificationScreen')}
          >
            <Icon name="notifications" type="material" color={appColors.CardBackground} size={24} />
          </TouchableOpacity>
        </View>
        
        {/* Bottom row with greeting */}
        <View style={styles.headerBottomRow}>
          <Text style={styles.greeting}>
            Hello {getFirstName(userDetails?.firstName) || 'User'},
          </Text>
          <Text style={styles.subtitle}>Track your wellness today</Text>
        </View>
      </View>

      {/* Mood Check-in Section - Fixed below header */}
      <View style={styles.moodSection}>
        <View style={styles.moodCard}>
          <Text style={styles.sectionTitle}>How are you feeling today?</Text>
          <View style={styles.moodContainer}>
            {moodOptions.map((mood) => (
              <View key={mood.id} style={styles.moodButtonContainer}>
                <TouchableOpacity
                  style={[
                    styles.moodButton,
                    selectedMood?.id === mood.id && { 
                      borderColor: mood.color, 
                      borderWidth: 3,
                      backgroundColor: mood.color + '20'
                    }
                  ]}
                  onPress={() => handleMoodSelect(mood)}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                </TouchableOpacity>
                <Text style={[
                  styles.moodText,
                  { color: mood.color },
                  selectedMood?.id === mood.id && { fontWeight: 'bold' }
                ]}>
                  {mood.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Quick Actions</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.actionsScrollContainer}
          >
            {quickActions.map((action) => (
              <QuickActionCard key={action.id} action={action} />
            ))}
          </ScrollView>
        </View>

        {/* Upcoming Sessions Section */}
        <View style={styles.section}>
          <View style={styles.sessionsCard}>
            <View style={styles.sessionsHeader}>
              <View style={styles.sessionsContent}>
                <Text style={styles.sessionsTitle}>Upcoming Sessions</Text>
                <Text style={styles.sessionsSubtitle}>
                  {upcomingSessions.length === 0 
                    ? "You don't have any scheduled therapy session"
                    : `You have ${upcomingSessions.length} upcoming sessions`
                  }
                </Text>
                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() => navigation.navigate('TherapistsScreen')}
                >
                  <Text style={styles.bookButtonText}>Book A Session</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.sessionsIllustration}>
                <Icon
                  name="people"
                  type="material"
                  color={appColors.AppBlue}
                  size={60}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Recent Activities Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Recent Activities</Text>
          <View style={styles.activitiesContainer}>
            {recentActivities.map((activity, index) => (
              <View key={activity.id} style={[
                styles.activityItem,
                index === recentActivities.length - 1 && styles.activityItemLast
              ]}>
                <View style={styles.activityIcon}>
                  <Icon
                    name={activity.type === 'mood' ? 'mood' : activity.type === 'session' ? 'psychology' : 'air'}
                    type="material"
                    color={appColors.AppBlue}
                    size={20}
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Emergency Access Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => navigation.navigate('EmergencyScreen')}
          >
            <Icon
              name="emergency"
              type="material"
              color={appColors.CardBackground}
              size={24}
            />
            <Text style={styles.emergencyText}>Emergency Support</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.CardBackground,
  },
  header: {
    backgroundColor: appColors.AppBlue,
    paddingTop: parameters.headerHeightS,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerBottomRow: {
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.appTextBold,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: appColors.CardBackground,
    fontFamily: appFonts.appTextRegular,
    opacity: 0.9,
  },
  iconButton: {
    marginLeft: 15,
    padding: 8,
  },
  moodSection: {
    paddingHorizontal: 20,
    marginTop: -15,
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
    paddingTop: 10,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    marginBottom: 15,
    fontFamily: appFonts.appTextBold,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    marginBottom: 20,
    fontFamily: appFonts.appTextBold,
  },
  moodCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodButtonContainer: {
    alignItems: 'center',
  },
  moodButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 55,
    height: 55,
    backgroundColor: appColors.CardBackground,
    borderRadius: 27.5,
    borderWidth: 2,
    borderColor: appColors.AppLightGray,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  moodEmoji: {
    fontSize: 20,
  },
  moodText: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: appFonts.appTextMedium,
    textAlign: 'center',
    marginTop: 4,
  },
  actionsScrollContainer: {
    paddingRight: 20,
    paddingVertical: 10,
  },
  actionCard: {
    minWidth: 80,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 11,
    color: appColors.AppBlue,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: appFonts.appTextMedium,
    lineHeight: 14,
    marginTop: 5,
  },
  sessionsCard: {
    backgroundColor: '#E8D5B7',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sessionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sessionsContent: {
    flex: 1,
    paddingRight: 20,
  },
  sessionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    marginBottom: 8,
    fontFamily: appFonts.appTextBold,
  },
  sessionsSubtitle: {
    fontSize: 14,
    color: appColors.AppBlue,
    marginBottom: 15,
    lineHeight: 20,
    fontFamily: appFonts.appTextRegular,
  },
  bookButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  bookButtonText: {
    color: appColors.CardBackground,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: appFonts.appTextMedium,
  },
  sessionsIllustration: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activitiesContainer: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: appColors.AppLightGray,
  },
  activityItemLast: {
    borderBottomWidth: 0,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: appColors.AppLightBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.AppBlue,
    marginBottom: 2,
    fontFamily: appFonts.appTextMedium,
  },
  activityTime: {
    fontSize: 13,
    color: appColors.grey2,
    fontFamily: appFonts.appTextRegular,
  },
  emergencyButton: {
    backgroundColor: '#F44336',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  emergencyText: {
    color: appColors.CardBackground,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    fontFamily: appFonts.appTextBold,
  },
  bottomSpacing: {
    height: 30,
  },
});

export default HomeScreen;
