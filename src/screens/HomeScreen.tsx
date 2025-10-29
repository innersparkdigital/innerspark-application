/**
 * App HomeScreen - Mental Health Wellness Dashboard
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Badge } from '@rneui/base';
import { appColors as staticAppColors, parameters, appFonts } from '../global/Styles';
import { useThemedColors } from '../hooks/useThemedColors';
import { useToast } from 'native-base';
import LHGenericHeader from '../components/LHGenericHeader';
import ISStatusBar from '../components/ISStatusBar';
import PanicButtonComponent from '../components/PanicButtonComponent';
import MoodCheckInCard, { MoodOption } from '../components/MoodCheckInCard';
import TodayMoodSummaryCard from '../components/TodayMoodSummaryCard';
import { appImages, moodOptions } from '../global/Data';
import { getFirstName, getGreeting, getLastName, getFullname } from '../global/LHShortcuts';
import { baseUrlRoot, baseUrlV1, APIGlobaltHeaders } from '../api/LHAPI';
import { loadTodayCheckInStatus, loadMoodStats, formatRelativeTime } from '../utils/moodCheckInManager';
import { selectHasCheckedInToday, selectTodayMoodData } from '../features/mood/moodSlice';
import EmptySessionsCard from '../components/EmptySessionsCard';
import SessionCard from '../components/SessionCard';
import TimelineEvent from '../components/TimelineEvent';
import WellnessTipCard from '../components/WellnessTipCard';

// test notification trigger
import { 
  triggerTestNotifications, 
  initializeNotificationChannels, 
  requestNotificationPermissions,
  setupNotificationEventListeners
} from '../api/LHNotifications';


const baseUrl = baseUrlRoot + baseUrlV1;
APIGlobaltHeaders(); // API Global headers

// get the screen Width
const SCREEN_WIDTH = Dimensions.get('window').width;

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const appColors = useThemedColors(); // ✅ Themed colors

  const userDetails = useSelector(state => state.userData.userDetails);
  const [selectedMood, setSelectedMood] = useState(null);
  
  // Get mood check-in status from Redux
  const hasCheckedInToday = useSelector(selectHasCheckedInToday);
  const todayMoodData = useSelector(selectTodayMoodData);

  // Mock data for upcoming sessions
  const [upcomingSessions, setUpcomingSessions] = useState([
    {
      id: 1,
      therapistName: 'Dr. Sarah Johnson',
      specialty: 'Cognitive Behavioral Therapy',
      date: 'Today',
      time: '3:00 PM',
      duration: '50 min',
      type: 'Video Call',
      avatar: appImages.dPerson1
    },
    {
      id: 2,
      therapistName: 'Dr. Michael Chen',
      specialty: 'Anxiety & Depression',
      date: 'Tomorrow',
      time: '10:00 AM',
      duration: '45 min',
      type: 'In-Person',
      avatar: appImages.dPerson2
    },
    {
      id: 3,
      therapistName: 'Dr. Emily Rodriguez',
      specialty: 'Trauma Therapy',
      date: 'Dec 3',
      time: '2:30 PM',
      duration: '60 min',
      type: 'Video Call',
      avatar: appImages.dPerson3
    }
  ]);
  const [unreadNotifications, setUnreadNotifications] = useState(3); // Mock unread count
  // Commented out for future use
  // const [recentActivities] = useState([
  //   { id: 1, type: 'mood', title: 'Mood Check-in', time: '2 hours ago' },
  //   { id: 2, type: 'session', title: 'Therapy Session', time: '1 day ago' },
  //   { id: 3, type: 'exercise', title: 'Breathing Exercise', time: '2 days ago' },
  // ]);

  // Today's Events and Prompts - Rotating Display
  const [todaysEvents] = useState([
    { id: 1, type: 'event', title: 'Join Support Group', time: '8:00 PM', icon: 'people', color: '#4CAF50' },
    { id: 2, type: 'event', title: 'Mindfulness Session', time: '3:00 PM', icon: 'self-improvement', color: '#9C27B0' },
    { id: 3, type: 'event', title: 'Therapy Workshop', time: '6:00 PM', icon: 'psychology', color: '#2196F3' },
    { id: 4, type: 'event', title: 'Breathing Exercise', time: '12:00 PM', icon: 'air', color: '#00BCD4' },
  ]);

  const wellnessPrompts = [
    "Take 5 deep breaths and notice how you feel right now",
    "Write down 3 things you're grateful for today",
    "Take a 10-minute walk outside and observe nature",
    "Call a friend or family member you haven't spoken to in a while",
    "Practice a 2-minute meditation or mindfulness exercise",
    "Do something creative - draw, write, or listen to music",
    "Drink a glass of water and check in with your body",
    "Stretch for 5 minutes to release tension",
    "Read one page of an inspiring book or article",
    "Practice self-compassion by speaking to yourself kindly",
    "Organize one small area of your living space",
    "Take a moment to appreciate something beautiful around you"
  ];

  // State for rotating content
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(() => 
    Math.floor(Math.random() * wellnessPrompts.length)
  );
  const [completedTips, setCompletedTips] = useState(new Set());

  // Helper: Get session urgency level
  const getSessionUrgency = (session: any) => {
    if (!session || !session.date || !session.time) return 'upcoming';
    
    // For demo, check if it's "Today"
    if (session.date === 'Today') {
      // Parse time and check if within 30 minutes
      // In production, use actual datetime comparison
      return 'soon';
    }
    return 'upcoming';
  };

  // Helper: Get session status color
  const getSessionStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'cancelled': return '#F44336';
      default: return staticAppColors.grey3;
    }
  };

  // Helper: Mark wellness tip as completed
  const markTipAsCompleted = (tipIndex: number) => {
    setCompletedTips(prev => new Set([...prev, tipIndex]));
    toast.show({
      description: '✓ Great job! Tip marked as completed',
      duration: 2000,
    });
  };

  // Helper: Get next wellness tip
  const handleNextTip = () => {
    setCurrentPromptIndex(prevIndex => (prevIndex + 1) % wellnessPrompts.length);
  };

  // Rotate through events and prompts every 4 minutes
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setCurrentEventIndex(prevIndex => (prevIndex + 1) % todaysEvents.length);
      setCurrentPromptIndex(prevIndex => (prevIndex + 1) % wellnessPrompts.length);
    }, 4 * 60 * 1000); // 4 minutes

    return () => clearInterval(rotationInterval);
  }, [todaysEvents.length, wellnessPrompts.length]);

  // Get current items to display
  const currentEvent = todaysEvents[currentEventIndex];
  const currentPrompt = {
    id: 'prompt',
    type: 'prompt',
    title: wellnessPrompts[currentPromptIndex],
    icon: 'lightbulb',
    color: '#FF9800'
  };

  const wellnessSubtitles = [
    "Let's make today amazing!",
    "Your wellness journey starts here",
    "Take a moment for yourself today",
    "You're doing great, keep going!",
    "Small steps lead to big changes",
    "Your mental health matters",
    "Embrace today with positivity",
    "Progress, not perfection",
    "You've got this!",
    "Every day is a fresh start",
  ];

  const [currentSubtitle] = useState(
    wellnessSubtitles[Math.floor(Math.random() * wellnessSubtitles.length)]
  );

  const quickActions = [
    { id: 1, title: 'Groups', icon: 'people', color: '#2196F3', screen: 'GroupsScreen' },
    { id: 2, title: 'Events', icon: 'event', color: '#FF9800', screen: 'EventsScreen' },
    { id: 3, title: 'Services', icon: 'shopping-cart', color: '#00BCD4', screen: 'ServicesScreen' },
    { id: 4, title: 'Meditation', icon: 'self-improvement', color: '#673AB7', screen: 'MeditationScreen' },
  ];

  // Initialize notification system on component mount
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        console.log('🔔 Initializing notification system...');
        
        // Request notification permissions first
        const permissionGranted = await requestNotificationPermissions();
        if (!permissionGranted) {
          console.log('❌ Notification permissions denied');
          return;
        }
        
        // Initialize notification channels
        await initializeNotificationChannels();
        
        // Setup notification event listeners (THIS WAS MISSING!)
        const unsubscribe = setupNotificationEventListeners();
        
        console.log('✅ Notification system initialized successfully');
        
        // Return cleanup function
        return () => {
          if (unsubscribe) {
            unsubscribe();
          }
        };
        
      } catch (error) {
        console.error('❌ Failed to initialize notification system:', error);
      }
    };

    initializeNotifications();
    loadTodayCheckInStatus(); // Load from API and update Redux
    loadMoodStats(); // Load user stats
  }, []);

  const handleMoodSelect = (mood: any) => {
    // Navigate to TodayMoodScreen with pre-selected mood
    navigation.navigate('TodayMoodScreen', { preSelectedMood: mood });
  };

  const handleQuickAction = (action) => {
    const bottomTabScreens = ['TherapistsScreen', 'MoodScreen', 'EmergencyScreen']; // Tabs screens available
    const stackScreens = ['AppointmentsScreen', 'GoalsScreen', 'EventsScreen', 'GroupsScreen', 'ServicesScreen', 'MeditationScreen']; // Available screens that can be navigated to directly
    
    if (bottomTabScreens.includes(action.screen)) {
      // Navigate to the bottom tab screen
      navigation.navigate('LHBottomTabs', { screen: action.screen });
    } else if (stackScreens.includes(action.screen)) {
      // Navigate to stack screen directly
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


  // Test Notification Trigger
  const handleTestNotification = async () => {
    console.log('🧪 User pressed test notification button');
    toast.show({
      description: 'Triggering test notifications... Check your notification drawer!',
      duration: 3000,
    });
    await triggerTestNotifications();
  };

  // Test Notification Button
  
  const TestNotificationButton = () => (
    <TouchableOpacity
      style={{ backgroundColor: staticAppColors.AppBlue, padding: 10, borderRadius: 5 }}
      onPress={handleTestNotification}
    >
      <Text style={{ color: staticAppColors.CardBackground, fontSize: 16 }}>Test Notification</Text>
    </TouchableOpacity>
  );




  return (
    // THEMED: Background adapts to light (#F6F6F6) / dark (#121212)
    <SafeAreaView style={[styles.container, { backgroundColor: appColors.background }]}>
      <ISStatusBar />
      
      {/* Always-visible Panic Button */}
      <PanicButtonComponent 
        position="bottom-right" 
        size="medium" 
        quickAction="screen" 
      />
      
      {/* Header Section */}
      {/* THEMED: Header stays blue in both themes for brand consistency */}
      <View style={styles.header}>
        {/* Top row with icons */}
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('ChatScreen')}
          >
            <Icon name="chat" type="material" color={appColors.CardBackground} size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('NotificationScreen')}
          >
            <View style={styles.notificationIconContainer}>
              <Icon name="notifications" type="material" color={appColors.CardBackground} size={24} />
              {unreadNotifications > 0 && (
                <Badge
                  value={unreadNotifications > 99 ? '99+' : unreadNotifications}
                  status="error"
                  containerStyle={styles.badgeContainer}
                  textStyle={styles.badgeText}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Header Greeting Section */}
        <View style={styles.headerBottomRow}>
          <Text style={styles.greeting}>
            {getGreeting()} {getLastName(getFullname(userDetails?.firstName, userDetails?.lastName)) || 'User'},
          </Text>
          <Text style={styles.subtitle}>{currentSubtitle}</Text>
        </View>
      </View>

      {/* Mood Check-in Section - Fixed below header */}
      <View style={styles.moodSection}>
        {!hasCheckedInToday ? (
          <MoodCheckInCard
            moodOptions={moodOptions}
            selectedMood={selectedMood}
            onMoodSelect={handleMoodSelect}
            showNavigationHint={true}
          />
        ) : todayMoodData ? (
          <TodayMoodSummaryCard
            mood={todayMoodData.mood}
            emoji={todayMoodData.emoji}
            note={todayMoodData.note}
            pointsEarned={todayMoodData.pointsEarned}
            timestamp={formatRelativeTime(todayMoodData.timestamp)}
            onPress={() => navigation.navigate('TodayMoodScreen')}
            showReflection={false}
            showPoints={false}
            showDetailsButton={false}
            compact={true}
          />
        ) : null}
      </View>

      {/* THEMED: ScrollView background adapts to light (#F6F6F6) / dark (#121212) */}
      <ScrollView style={[styles.scrollView, { backgroundColor: appColors.background }]} showsVerticalScrollIndicator={false}>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          {/* THEMED: Section header text adapts - light (#5170FF) / dark (#6B8AFF) */}
          <Text style={[styles.sectionHeader, { color: appColors.AppBlue }]}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <QuickActionCard key={action.id} action={action} />
            ))}
          </View>
        </View>

        {/* Commented out - Original Upcoming Sessions Section (No Sessions State) */}
        {/* 
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
        */}

        {/* Upcoming Sessions - Dynamic with Components */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeader}>Upcoming Sessions</Text>
            {upcomingSessions.length > 1 && (
              <TouchableOpacity 
                onPress={() => navigation.navigate('AppointmentsScreen')}
                style={styles.viewAllButton}
              >
                <Text style={styles.viewAllText}>View All ({upcomingSessions.length})</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {upcomingSessions.length === 0 ? (
            <EmptySessionsCard 
              onBookSession={() => navigation.navigate('TherapistsScreen')}
            />
          ) : upcomingSessions.length === 1 ? (
            <SessionCard 
              session={{
                ...upcomingSessions[0],
                status: 'confirmed',
                urgent: getSessionUrgency(upcomingSessions[0]) === 'soon'
              }}
              onPress={() => navigation.navigate('AppointmentsScreen')}
              onJoin={() => {
                toast.show({
                  description: 'Joining session...',
                  duration: 2000,
                });
              }}
            />
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sessionsScroll}
            >
              {upcomingSessions.map((session) => (
                <SessionCard 
                  key={session.id}
                  session={{
                    ...session,
                    status: 'confirmed',
                    urgent: getSessionUrgency(session) === 'soon'
                  }}
                  onPress={() => navigation.navigate('AppointmentsScreen')}
                  compact={true}
                />
              ))}
            </ScrollView>
          )}
        </View>

        {/* Today's Schedule Section */}
        <View style={styles.section}>
          {/* THEMED: Section header text adapts - light (#5170FF) / dark (#6B8AFF) */}
          <Text style={[styles.sectionHeader, { color: appColors.AppBlue }]}>Today's Schedule</Text>
          
          {todaysEvents.length === 0 ? (
            <View style={styles.emptyEventsCard}>
              <Icon name="event-note" type="material" color={appColors.grey3} size={40} />
              <Text style={styles.emptyEventsText}>No events scheduled for today</Text>
            </View>
          ) : (
            <View style={styles.timelineContainer}>
              {todaysEvents.map((event, index) => (
                <TimelineEvent
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  time={event.time}
                  icon={event.icon}
                  color={event.color}
                  isLast={index === todaysEvents.length - 1}
                  onPress={() => {
                    toast.show({
                      description: `Event: ${event.title}`,
                      duration: 2000,
                    });
                  }}
                />
              ))}
            </View>
          )}
        </View>

        {/* Wellness Tip of the Day */}
        <View style={styles.section}>
          <WellnessTipCard
            tip={wellnessPrompts[currentPromptIndex]}
            category="Mindfulness"
            isCompleted={completedTips.has(currentPromptIndex)}
            onComplete={() => markTipAsCompleted(currentPromptIndex)}
            onRefresh={handleNextTip}
          />
        </View>

        {/* Commented out Recent Activities Section for future use */}
        {/* 
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
        */}

        

        {/* Test Notification Button */}
        {/* <TestNotificationButton /> */}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Note: Styles use staticAppColors. Dynamic theming applied via useThemedColors() hook in component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticAppColors.CardBackground,
  },
  header: {
    backgroundColor: staticAppColors.AppBlue,
    paddingTop: parameters.headerHeightS,
    paddingBottom: 60,
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
    color: staticAppColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: staticAppColors.CardBackground,
    fontFamily: appFonts.bodyTextRegular,
    opacity: 0.9,
  },
  iconButton: {
    marginLeft: 15,
    padding: 8,
  },
  notificationIconContainer: {
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  moodSection: {
    paddingHorizontal: 20,
    marginTop: -40,
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: staticAppColors.AppLightGray,
    paddingTop: 10,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: staticAppColors.AppBlue,
    marginBottom: 15,
    fontFamily: appFonts.headerTextBold,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: staticAppColors.AppBlue,
    marginBottom: 20,
    fontFamily: appFonts.headerTextBold,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: staticAppColors.CardBackground,
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 13,
    color: staticAppColors.AppBlue,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: appFonts.appTextMedium,
    lineHeight: 16,
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
    color: staticAppColors.AppBlue,
    marginBottom: 8,
    fontFamily: appFonts.headerTextBold,
  },
  sessionsSubtitle: {
    fontSize: 14,
    color: staticAppColors.AppBlue,
    marginBottom: 15,
    lineHeight: 20,
    fontFamily: appFonts.bodyTextRegular,
  },
  bookButton: {
    backgroundColor: staticAppColors.AppBlue,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  bookButtonText: {
    color: staticAppColors.CardBackground,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: appFonts.appTextMedium,
  },
  sessionsIllustration: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // New Session Card Styles
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: staticAppColors.AppBlue,
    fontWeight: '600',
    fontFamily: appFonts.bodyTextMedium,
  },
  sessionCard: {
    backgroundColor: staticAppColors.CardBackground,
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  therapistAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: staticAppColors.AppBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: staticAppColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  avatarImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  sessionInfo: {
    flex: 1,
  },
  therapistName: {
    fontSize: 16,
    fontWeight: '600',
    color: staticAppColors.AppBlue,
    marginBottom: 2,
    fontFamily: appFonts.headerTextMedium,
  },
  sessionSpecialty: {
    fontSize: 13,
    color: staticAppColors.AppGray,
    fontFamily: appFonts.bodyTextRegular,
  },
  sessionType: {
    padding: 5,
  },
  sessionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionTimeInfo: {
    flex: 1,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sessionDateTime: {
    fontSize: 14,
    color: staticAppColors.AppBlue,
    fontWeight: '500',
    marginLeft: 6,
    fontFamily: appFonts.bodyTextMedium,
  },
  sessionDuration: {
    fontSize: 13,
    color: staticAppColors.AppGray,
    marginLeft: 6,
    fontFamily: appFonts.bodyTextRegular,
  },
  sessionActions: {
    marginLeft: 10,
  },
  joinButton: {
    backgroundColor: staticAppColors.AppBlue,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  joinButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: staticAppColors.CardBackground,
    fontFamily: appFonts.bodyTextMedium,
  },
  // Events and Prompts Styles - Compact Design
  eventsContainer: {
    backgroundColor: staticAppColors.CardBackground,
    borderRadius: 12,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 6,
    backgroundColor: staticAppColors.CardBackground,
    borderRadius: 10,
    borderLeftWidth: 3,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  eventIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: staticAppColors.AppBlue,
    marginBottom: 1,
    fontFamily: appFonts.headerTextMedium,
  },
  eventTime: {
    fontSize: 13,
    color: staticAppColors.AppGray,
    fontFamily: appFonts.bodyTextRegular,
  },
  eventAction: {
    padding: 3,
  },
  promptItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    borderLeftWidth: 3,
    marginTop: 3,
  },
  promptIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  promptContent: {
    flex: 1,
  },
  promptLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F57C00',
    marginBottom: 3,
    fontFamily: appFonts.bodyTextMedium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  promptTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: staticAppColors.AppBlue,
    lineHeight: 20,
    fontFamily: appFonts.bodyTextRegular,
  },
  
  // Commented out - Original Activities Styles (kept for future use)
  activitiesContainer: {
    backgroundColor: staticAppColors.CardBackground,
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
    borderBottomColor: staticAppColors.AppLightGray,
  },
  activityItemLast: {
    borderBottomWidth: 0,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: staticAppColors.AppLightBlue,
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
    color: staticAppColors.AppBlue,
    marginBottom: 2,
    fontFamily: appFonts.bodyTextMedium,
  },
  activityTime: {
    fontSize: 13,
    color: staticAppColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
  },

  emergencyText: {
    color: staticAppColors.CardBackground,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    fontFamily: appFonts.headerTextBold,
  },
  bottomSpacing: {
    height: 30,
  },
  // New Component Styles
  sessionsScroll: {
    paddingRight: 20,
  },
  emptyEventsCard: {
    backgroundColor: staticAppColors.CardBackground,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  emptyEventsText: {
    fontSize: 14,
    color: staticAppColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    marginTop: 12,
    textAlign: 'center',
  },
  timelineContainer: {
    paddingVertical: 8,
  },
});

export default HomeScreen;
