/**
 * App HomeScreen - Mental Health Wellness Dashboard
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  RefreshControl,
  Linking,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Icon, Badge } from '@rneui/base';
import { appColors as staticAppColors, parameters, appFonts } from '../global/Styles';
import { scale, moderateScale } from '../global/Scaling';
import { useThemedColors } from '../hooks/useThemedColors';
import { useToast } from 'native-base';
import LHGenericHeader from '../components/LHGenericHeader';
import ISStatusBar from '../components/ISStatusBar';
import PanicButtonComponent from '../components/PanicButtonComponent';
import MoodCheckInCard, { MoodOption } from '../components/MoodCheckInCard';
import TodayMoodSummaryCard from '../components/TodayMoodSummaryCard';
import { appImages, moodOptions, appPromotionalLinks } from '../global/Data';
import { getFirstName, getGreeting, getLastName, getFullname } from '../global/LHShortcuts';
import { loadAllMoodData, formatRelativeTime } from '../utils/moodCheckInManager';
import { selectHasCheckedInToday, selectTodayMoodData } from '../features/mood/moodSlice';
import { selectUnreadCount } from '../features/notifications/notificationSlice';
import { getUnreadCount } from '../utils/notificationManager';
import {
  selectUpcomingSessions,
  selectTodayEvents,
  selectWellnessTip,
  selectMoodStreak,
  selectQuickStats,
  selectDashboardLoading,
} from '../features/dashboard/dashboardSlice';
import { loadDashboardData, refreshDashboardData } from '../utils/dashboardManager';
import { useDashboardSync } from '../hooks/useDashboardSync';
import { useNotificationsSync } from '../hooks/useNotificationsSync';
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

// get the screen Width
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function HomeScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const toast = useToast();
  const appColors = useThemedColors(); // ✅ Themed colors

  const userDetails = useSelector((state: any) => state.userData.userDetails);
  const [selectedMood, setSelectedMood] = useState(null);

  // Initialize Smart Background Sync
  useDashboardSync(userDetails?.userId, 60000);
  useNotificationsSync(userDetails?.userId, 60000);

  // Get mood check-in status from Redux
  const hasCheckedInToday = useSelector(selectHasCheckedInToday);
  const todayMoodData = useSelector(selectTodayMoodData);

  // Get dashboard data from Redux
  const upcomingSessions = useSelector(selectUpcomingSessions);
  const todayEvents = useSelector(selectTodayEvents);
  const wellnessTip = useSelector(selectWellnessTip);
  const moodStreak = useSelector(selectMoodStreak);
  const quickStats = useSelector(selectQuickStats);
  const isDashboardLoading = useSelector(selectDashboardLoading);

  // Get unread notification and chat counts from Redux
  const unreadNotifications = useSelector(selectUnreadCount);
  const unreadMessages = useSelector((state: any) => state.chat?.unreadCount || 0);
  // Commented out for future use
  // const [recentActivities] = useState([
  //   { id: 1, type: 'mood', title: 'Mood Check-in', time: '2 hours ago' },
  //   { id: 2, type: 'session', title: 'Therapy Session', time: '1 day ago' },
  //   { id: 3, type: 'exercise', title: 'Breathing Exercise', time: '2 days ago' },
  // ]);

  // State for refreshing
  const [isRefreshing, setIsRefreshing] = useState(false);

  // State for Collapsible Mood Section
  const [isMoodSectionVisible, setIsMoodSectionVisible] = useState(true);
  const breathingAnim = useRef(new Animated.Value(1)).current;

  // Breathing animation for the header emoji icon
  useEffect(() => {
    if (hasCheckedInToday) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(breathingAnim, {
            toValue: 1.15,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(breathingAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      breathingAnim.setValue(1);
    }
  }, [hasCheckedInToday, breathingAnim]);

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
    switch (status) {
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
    if (todayEvents.length === 0) return;

    const rotationInterval = setInterval(() => {
      setCurrentEventIndex(prevIndex => (prevIndex + 1) % todayEvents.length);
      setCurrentPromptIndex(prevIndex => (prevIndex + 1) % wellnessPrompts.length);
    }, 4 * 60 * 1000); // 4 minutes

    return () => clearInterval(rotationInterval);
  }, [todayEvents.length, wellnessPrompts.length]);

  // Get current items to display
  const currentEvent = todayEvents.length > 0 ? todayEvents[currentEventIndex] : null;
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
    { id: 3, title: 'Meditation', icon: 'self-improvement', color: '#673AB7', screen: 'MeditationScreen' },
    { id: 4, title: 'Mind Check', icon: 'psychology', color: '#4CAF50', url: appPromotionalLinks.appPromotionalLink1 },
    // { id: 5, title: 'Services', icon: 'shopping-cart', color: '#00BCD4', screen: 'ServicesScreen' },
  ];

  // Initialize notification system on component mount
  useEffect(() => {
    let unsubscribe: any;

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

        // Setup notification event listeners
        unsubscribe = setupNotificationEventListeners();
        console.log('✅ Notification system initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize notification system:', error);
      }
    };

    initializeNotifications();

    // Return cleanup function directly from useEffect
    return () => {
      if (unsubscribe) {
        console.log('🔕 Unsubscribing from notification events');
        unsubscribe();
      }
    };
  }, [userDetails?.userId]);

  // Refresh all data every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (userDetails?.userId) {
        console.log('🔄 [HomeScreen] Refreshing dashboard data on focus...');
        loadAllMoodData(userDetails.userId);
        refreshDashboardData(userDetails.userId);
        getUnreadCount(userDetails.userId);
      }
    }, [userDetails?.userId])
  );

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    if (!userDetails?.userId) return;

    setIsRefreshing(true);
    try {
      await Promise.all([
        refreshDashboardData(userDetails.userId),
        getUnreadCount(userDetails.userId),
        loadAllMoodData(userDetails.userId),
      ]);
    } catch (error) {
      console.log('Error refreshing home data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle quick mood selection
  const handleMoodSelect = (mood: any) => {
    // Navigate to TodayMoodScreen with pre-selected mood
    navigation.navigate('TodayMoodScreen', { preSelectedMood: mood });
  };

  // Handle quick action button presses
  const handleQuickAction = async (action: any) => {
    // 1. Check for external URL first
    if (action.url) {
      try {
        const supported = await Linking.canOpenURL(action.url);
        if (supported) {
          await Linking.openURL(action.url);
        } else {
          notifyWithToast(`Cannot open URL: ${action.title}`);
        }
      } catch (error) {
        console.error('Error opening URL:', error);
        notifyWithToast('Failed to open link.');
      }
      return;
    }

    // 2. Handle internal screens
    const bottomTabScreens = ['TherapistsScreen', 'MoodScreen', 'EmergencyScreen']; // Tabs screens available
    const stackScreens = ['AppointmentsScreen', 'GoalsScreen', 'EventsScreen', 'GroupsScreen', 'ServicesScreen', 'MeditationScreen']; // Available screens that can be navigated to directly

    if (action.screen && bottomTabScreens.includes(action.screen)) {
      // Navigate to the bottom tab screen
      navigation.navigate('LHBottomTabs', { screen: action.screen });
    } else if (action.screen && stackScreens.includes(action.screen)) {
      // Navigate to stack screen directly
      navigation.navigate(action.screen);
    } else {
      toast.show({
        description: `${action.title} feature coming soon!`,
        duration: 2000,
      });
    }
  };

  // Helper function to show toast notifications
  const notifyWithToast = (description: string) => {
    toast.show({
      description: description,
      duration: 2000,
    });
  };


  // Render a quick action card
  const QuickActionCard = ({ action, isFullWidth }: { action: any, isFullWidth?: boolean }) => (
    <TouchableOpacity
      style={[styles.actionCard, isFullWidth && styles.fullWidthCard]}
      onPress={() => handleQuickAction(action)}
    >
      <View style={[styles.actionIcon, isFullWidth && styles.fullWidthActionIcon, { backgroundColor: action.color + '20' }]}>
        <Icon
          name={action.icon}
          type="material"
          color={action.color}
          size={moderateScale(24)}
        />
      </View>
      <Text style={[styles.actionTitle, isFullWidth && styles.fullWidthActionTitle]}>{action.title}</Text>
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
      style={{ backgroundColor: staticAppColors.AppBlue, padding: scale(10), borderRadius: moderateScale(5) }}
      onPress={handleTestNotification}
    >
      <Text style={{ color: staticAppColors.CardBackground, fontSize: moderateScale(16) }}>Test Notification</Text>
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
          {/* Brand Logo on the left */}
          <Image source={appImages.logoRecWhite} style={styles.headerLogo} resizeMode="contain" />

          {/* Action Icons on the right */}
          <View style={styles.headerRightIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('ChatScreen')}
            >
              <View style={styles.notificationIconContainer}>
                <Icon name="chat" type="material" color={appColors.CardBackground} size={moderateScale(24)} />
                {unreadMessages > 0 && (
                  <Badge
                    value={unreadMessages > 99 ? '99+' : unreadMessages}
                    status="error"
                    containerStyle={styles.badgeContainer}
                    textStyle={styles.badgeText}
                  />
                )}
              </View>
            </TouchableOpacity>
            {hasCheckedInToday && todayMoodData?.emoji && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setIsMoodSectionVisible(!isMoodSectionVisible)}
              >
                <Animated.View style={{ transform: [{ scale: breathingAnim }] }}>
                  <Text style={{ fontSize: moderateScale(22) }}>{todayMoodData.emoji}</Text>
                </Animated.View>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('NotificationScreen')}
            >
              <View style={styles.notificationIconContainer}>
                <Icon name="notifications" type="material" color={appColors.CardBackground} size={moderateScale(24)} />
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
        </View>

        {/* Header Greeting Section */}
        <View style={styles.headerBottomRow}>
          <Text style={styles.greeting}>
            {getGreeting()} {getFirstName(userDetails?.name) || 'User'},
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
        ) : (todayMoodData && isMoodSectionVisible) ? (
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
            showToggleIcon={true}
            onToggleVisibility={() => setIsMoodSectionVisible(false)}
          />
        ) : null}
      </View>

      {/* THEMED: ScrollView background adapts to light (#F6F6F6) / dark (#121212) */}
      <ScrollView
        style={[styles.scrollView, { backgroundColor: appColors.background }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={appColors.AppBlue}
            colors={[appColors.AppBlue]}
          />
        }
      >

        {/* Quick Actions Section */}
        <View style={styles.section}>
          {/* THEMED: Section header text adapts - light (#5170FF) / dark (#6B8AFF) */}
          <Text style={[styles.sectionHeader, { color: appColors.AppBlue }]}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => {
              // Check if array has odd length and this is the last item
              const isLastOddItem = quickActions.length % 2 !== 0 && index === quickActions.length - 1;
              return (
                <QuickActionCard
                  key={action.id}
                  action={action}
                  isFullWidth={isLastOddItem}
                />
              );
            })}
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

        {/* Upcoming Sessions - Only show if there are sessions */}
        {upcomingSessions.length > 0 && (
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

            {upcomingSessions.length === 1 ? (
              <SessionCard
                session={{
                  ...upcomingSessions[0],
                  status: 'confirmed',
                  urgent: getSessionUrgency(upcomingSessions[0]) === 'soon'
                }}
                onPress={() => navigation.navigate('AppointmentsScreen')}
              />
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.sessionsScroll}
              >
                {upcomingSessions.map((session: any) => (
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
        )}

        {/* Today's Schedule Section - Only show if there are events */}
        {todayEvents.length > 0 && (
          <View style={styles.section}>
            {/* THEMED: Section header text adapts - light (#5170FF) / dark (#6B8AFF) */}
            <Text style={[styles.sectionHeader, { color: appColors.AppBlue }]}>Today's Schedule</Text>

            <View style={styles.timelineContainer}>
              {todayEvents.map((event: any, index: number) => (
                <TimelineEvent
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  time={event.time}
                  icon={event.icon}
                  color={event.color}
                  isLast={index === todayEvents.length - 1}
                  onPress={() => {
                    toast.show({
                      description: `Event: ${event.title}`,
                      duration: 2000,
                    });
                  }}
                />
              ))}
            </View>
          </View>
        )}

        {/* Wellness Tip of the Day - Uses API data with fallback */}
        <View style={styles.section}>
          <WellnessTipCard
            tip={wellnessTip?.tip || wellnessPrompts[currentPromptIndex]}
            category={wellnessTip?.category || "Mindfulness"}
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
    paddingBottom: scale(60),
    paddingHorizontal: scale(20),
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(15),
  },
  headerLogo: {
    width: scale(135),
    height: scale(32),
    // Removed tintColor so the original blue dot in the logo is visible
  },
  headerRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBottomRow: {
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: moderateScale(22),
    fontWeight: '800',
    color: staticAppColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
    marginBottom: scale(6),
  },
  subtitle: {
    fontSize: moderateScale(16),
    color: staticAppColors.CardBackground,
    fontFamily: appFonts.bodyTextRegular,
    opacity: 0.9,
  },
  iconButton: {
    marginLeft: scale(8), // Reduced from 15 to pull icons much closer
    padding: scale(4), // Reduced from 8 to tighten tap targets visually
  },
  notificationIconContainer: {
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: scale(-8),
    right: scale(-8),
  },
  badgeText: {
    fontSize: moderateScale(10),
    fontWeight: 'bold',
  },
  moodSection: {
    paddingHorizontal: scale(20),
    marginTop: scale(-40),
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: staticAppColors.AppLightGray,
    paddingTop: scale(10),
  },
  section: {
    paddingHorizontal: scale(20),
    marginBottom: scale(20),
  },
  sectionHeader: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: staticAppColors.AppBlue,
    marginBottom: scale(15),
    fontFamily: appFonts.headerTextBold,
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: staticAppColors.AppBlue,
    marginBottom: scale(20),
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
    borderRadius: scale(15),
    paddingHorizontal: scale(12),
    paddingVertical: scale(20),
    marginBottom: scale(15),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  fullWidthCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: scale(16),
  },
  actionIcon: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(12),
  },
  fullWidthActionIcon: {
    marginBottom: 0,
    marginRight: scale(16),
  },
  actionTitle: {
    fontSize: moderateScale(13),
    color: staticAppColors.AppBlue,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: appFonts.bodyTextMedium,
    lineHeight: moderateScale(16),
    marginTop: scale(5),
  },
  fullWidthActionTitle: {
    marginTop: 0,
    textAlign: 'left',
    fontSize: moderateScale(16),
  },
  sessionsCard: {
    backgroundColor: '#E8D5B7',
    borderRadius: scale(15),
    padding: scale(20),
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
    paddingRight: scale(20),
  },
  sessionsTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: staticAppColors.AppBlue,
    marginBottom: scale(8),
    fontFamily: appFonts.headerTextBold,
  },
  sessionsSubtitle: {
    fontSize: moderateScale(14),
    color: staticAppColors.AppBlue,
    marginBottom: scale(15),
    lineHeight: moderateScale(20),
    fontFamily: appFonts.bodyTextRegular,
  },
  bookButton: {
    backgroundColor: staticAppColors.AppBlue,
    borderRadius: scale(25),
    paddingVertical: scale(12),
    paddingHorizontal: scale(20),
    alignSelf: 'flex-start',
  },
  bookButtonText: {
    color: staticAppColors.CardBackground,
    fontSize: moderateScale(14),
    fontWeight: '600',
    fontFamily: appFonts.buttonTextMedium,
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
    marginBottom: scale(15),
  },
  viewAllButton: {
    paddingVertical: scale(4),
    paddingHorizontal: scale(8),
  },
  viewAllText: {
    fontSize: moderateScale(14),
    color: staticAppColors.AppBlue,
    fontWeight: '600',
    fontFamily: appFonts.bodyTextMedium,
  },
  sessionCard: {
    backgroundColor: staticAppColors.CardBackground,
    borderRadius: scale(12),
    padding: scale(15),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderLeftWidth: scale(4),
    borderLeftColor: '#4CAF50',
  },
  sessionHeaderStyle: { // Renamed from sessionHeader to avoid conflict or just usage check
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  therapistAvatar: {
    width: scale(45),
    height: scale(45),
    borderRadius: scale(22.5),
    backgroundColor: staticAppColors.AppBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  avatarText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: staticAppColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  avatarImage: {
    width: scale(45),
    height: scale(45),
    borderRadius: scale(22.5),
  },
  sessionInfo: {
    flex: 1,
  },
  therapistName: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: staticAppColors.AppBlue,
    marginBottom: scale(2),
    fontFamily: appFonts.headerTextMedium,
  },
  sessionSpecialty: {
    fontSize: moderateScale(13),
    color: staticAppColors.AppGray,
    fontFamily: appFonts.bodyTextRegular,
  },
  sessionType: {
    padding: scale(5),
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
    marginBottom: scale(4),
  },
  sessionDateTime: {
    fontSize: moderateScale(14),
    color: staticAppColors.AppBlue,
    fontWeight: '500',
    marginLeft: scale(6),
    fontFamily: appFonts.bodyTextMedium,
  },
  sessionDuration: {
    fontSize: moderateScale(13),
    color: staticAppColors.AppGray,
    marginLeft: scale(6),
    fontFamily: appFonts.bodyTextRegular,
  },
  sessionActions: {
    marginLeft: scale(10),
  },
  joinButton: {
    backgroundColor: staticAppColors.AppBlue,
    borderRadius: scale(20),
    paddingVertical: scale(8),
    paddingHorizontal: scale(16),
  },
  joinButtonText: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: staticAppColors.CardBackground,
    fontFamily: appFonts.bodyTextMedium,
  },
  // Events and Prompts Styles - Compact Design
  eventsContainer: {
    backgroundColor: staticAppColors.CardBackground,
    borderRadius: scale(12),
    padding: scale(8),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(8),
    paddingHorizontal: scale(10),
    marginBottom: scale(6),
    backgroundColor: staticAppColors.CardBackground,
    borderRadius: scale(10),
    borderLeftWidth: scale(3),
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  eventIcon: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(10),
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: staticAppColors.AppBlue,
    marginBottom: scale(1),
    fontFamily: appFonts.headerTextMedium,
  },
  eventTime: {
    fontSize: moderateScale(13),
    color: staticAppColors.AppGray,
    fontFamily: appFonts.bodyTextRegular,
  },
  eventAction: {
    padding: scale(3),
  },
  promptItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: scale(10),
    paddingHorizontal: scale(10),
    backgroundColor: '#FFF8E1',
    borderRadius: scale(10),
    borderLeftWidth: scale(3),
    marginTop: scale(3),
  },
  promptIcon: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(10),
    marginTop: scale(1),
  },
  promptContent: {
    flex: 1,
  },
  promptLabel: {
    fontSize: moderateScale(11),
    fontWeight: '600',
    color: '#F57C00',
    marginBottom: scale(3),
    fontFamily: appFonts.bodyTextMedium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  promptTitle: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: staticAppColors.AppBlue,
    lineHeight: moderateScale(20),
    fontFamily: appFonts.bodyTextRegular,
  },

  // Commented out - Original Activities Styles (kept for future use)
  activitiesContainer: {
    backgroundColor: staticAppColors.CardBackground,
    borderRadius: scale(15),
    padding: scale(15),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(10),
    borderBottomWidth: 1,
    borderBottomColor: staticAppColors.AppLightGray,
  },
  activityItemLast: {
    borderBottomWidth: 0,
  },
  activityIcon: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: staticAppColors.AppBlueFade,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: staticAppColors.AppBlue,
    marginBottom: scale(2),
    fontFamily: appFonts.bodyTextMedium,
  },
  activityTime: {
    fontSize: moderateScale(13),
    color: staticAppColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
  },

  emergencyText: {
    color: staticAppColors.CardBackground,
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    marginLeft: scale(10),
    fontFamily: appFonts.headerTextBold,
  },
  bottomSpacing: {
    height: scale(30),
  },
  // New Component Styles
  sessionsScroll: {
    paddingRight: scale(20),
  },
  emptyEventsCard: {
    backgroundColor: staticAppColors.CardBackground,
    borderRadius: scale(12),
    padding: scale(32),
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  emptyEventsText: {
    fontSize: moderateScale(14),
    color: staticAppColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    marginTop: scale(12),
    textAlign: 'center',
  },
  timelineContainer: {
    paddingVertical: scale(8),
  },
});

