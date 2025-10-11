/**
 * App HomeScreen - Mental Health Wellness Dashboard
 */
import React, { useState, useEffect, useCallback } from 'react';
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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Badge } from '@rneui/base';
import { appColors, parameters, appFonts } from '../global/Styles';
import { useToast } from 'native-base';
import LHGenericHeader from '../components/LHGenericHeader';
import PanicButtonComponent from '../components/PanicButtonComponent';
import { appImages } from '../global/Data';
import { getFirstName } from '../global/LHShortcuts';
import { baseUrlRoot, baseUrlV1, APIGlobaltHeaders } from '../api/LHAPI';

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

  const userDetails = useSelector(state => state.userData.userDetails);
  const [selectedMood, setSelectedMood] = useState(null);

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

  const moodOptions = [
    { id: 1, name: 'Great', emoji: '😊', color: '#4CAF50' },
    { id: 2, name: 'Good', emoji: '🙂', color: '#8BC34A' },
    { id: 3, name: 'Okay', emoji: '😐', color: '#FFC107' },
    { id: 4, name: 'Bad', emoji: '😔', color: '#FF9800' },
    { id: 5, name: 'Terrible', emoji: '😢', color: '#F44336' },
  ];

  const quickActions = [
    { id: 1, title: 'My Goals', icon: 'flag', color: '#4CAF50', screen: 'GoalsScreen' },
    { id: 2, title: 'Therapy Groups', icon: 'people', color: '#2196F3', screen: 'GroupsScreen' },
    { id: 3, title: 'Events', icon: 'event', color: '#FF9800', screen: 'EventsScreen' },
    { id: 4, title: 'Sessions', icon: 'psychology', color: '#9C27B0', screen: 'AppointmentsScreen' },
    { id: 5, title: 'Services', icon: 'shopping-cart', color: '#00BCD4', screen: 'ServicesCatalogScreen' },
    { id: 6, title: 'Mood Tracker', icon: 'mood', color: '#E91E63', screen: 'MoodScreen' },
    { id: 7, title: 'Emergency', icon: 'emergency', color: '#F44336', screen: 'EmergencyScreen' },
    { id: 8, title: 'Meditation', icon: 'self-improvement', color: '#673AB7', screen: 'MeditationScreen' },
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
  }, []);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    toast.show({
      description: `Mood "${mood.name}" recorded!`,
      duration: 2000,
    });
  };

  const handleQuickAction = (action) => {
    const bottomTabScreens = ['TherapistsScreen', 'MoodScreen', 'EmergencyScreen']; // Tabs screens available
    const stackScreens = ['AppointmentsScreen', 'GoalsScreen', 'EventsScreen', 'GroupsScreen', 'ServicesCatalogScreen']; // Available screens that can be navigated to directly
    
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
      style={{ backgroundColor: appColors.AppBlue, padding: 10, borderRadius: 5 }}
      onPress={handleTestNotification}
    >
      <Text style={{ color: appColors.CardBackground, fontSize: 16 }}>Test Notification</Text>
    </TouchableOpacity>
  );




  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={appColors.AppBlue} barStyle="light-content" />
      
      {/* Always-visible Panic Button */}
      <PanicButtonComponent 
        position="bottom-right" 
        size="medium" 
        quickAction="screen" 
      />
      
      {/* Header Section */}
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

        {/* New Upcoming Sessions Section - With Sessions Present */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeader}>Upcoming Sessions</Text>
            {upcomingSessions.length > 1 && (
              <TouchableOpacity 
                onPress={() => navigation.navigate('AppointmentsScreen')}
                style={styles.viewAllButton}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {upcomingSessions.length > 0 && (
            <View style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <View style={styles.therapistAvatar}>
                  {upcomingSessions[0].avatar ? (
                    <Image 
                      source={upcomingSessions[0].avatar} 
                      style={styles.avatarImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={styles.avatarText}>
                      {upcomingSessions[0].therapistName.split(' ').map(n => n[0]).join('')}
                    </Text>
                  )}
                </View>
                <View style={styles.sessionInfo}>
                  <Text style={styles.therapistName}>{upcomingSessions[0].therapistName}</Text>
                  <Text style={styles.sessionSpecialty}>{upcomingSessions[0].specialty}</Text>
                </View>
                <View style={styles.sessionType}>
                  <Icon
                    name={upcomingSessions[0].type === 'Video Call' ? 'videocam' : 'location-on'}
                    type="material"
                    color={upcomingSessions[0].type === 'Video Call' ? '#4CAF50' : '#FF9800'}
                    size={20}
                  />
                </View>
              </View>
              
              <View style={styles.sessionDetails}>
                <View style={styles.sessionTimeInfo}>
                  <View style={styles.timeRow}>
                    <Icon name="schedule" type="material" color={appColors.AppGray} size={16} />
                    <Text style={styles.sessionDateTime}>
                      {upcomingSessions[0].date} at {upcomingSessions[0].time}
                    </Text>
                  </View>
                  <View style={styles.timeRow}>
                    <Icon name="timer" type="material" color={appColors.AppGray} size={16} />
                    <Text style={styles.sessionDuration}>{upcomingSessions[0].duration}</Text>
                  </View>
                </View>
                
                <View style={styles.sessionActions}>
                  <TouchableOpacity 
                    style={styles.joinButton}
                    onPress={() => {
                      toast.show({
                        description: 'Joining session...',
                        duration: 2000,
                      });
                    }}
                  >
                    <Text style={styles.joinButtonText}>
                      {upcomingSessions[0].date === 'Today' ? 'Join Now' : 'View Details'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Today's Events or Prompts Section - Rotating Display */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Today's Events & Wellness Tips</Text>
          <View style={styles.eventsContainer}>
            {/* Current Event */}
            <TouchableOpacity 
              style={[
                styles.eventItem,
                { borderLeftColor: currentEvent.color }
              ]}
              onPress={() => {
                toast.show({
                  description: `Event: ${currentEvent.title} at ${currentEvent.time}`,
                  duration: 2000,
                });
              }}
            >
              <View style={[styles.eventIcon, { backgroundColor: currentEvent.color + '20' }]}>
                <Icon
                  name={currentEvent.icon}
                  type="material"
                  color={currentEvent.color}
                  size={18}
                />
              </View>
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>{currentEvent.title}</Text>
                <Text style={styles.eventTime}>{currentEvent.time}</Text>
              </View>
              <View style={styles.eventAction}>
                <Icon
                  name="chevron-right"
                  type="material"
                  color={appColors.AppGray}
                  size={18}
                />
              </View>
            </TouchableOpacity>
            
            {/* Current Wellness Prompt */}
            <TouchableOpacity 
              style={[
                styles.promptItem,
                { borderLeftColor: currentPrompt.color }
              ]}
              onPress={() => {
                toast.show({
                  description: "Great! Take a moment to try this wellness activity.",
                  duration: 2000,
                });
              }}
            >
              <View style={[styles.promptIcon, { backgroundColor: currentPrompt.color + '20' }]}>
                <Icon
                  name={currentPrompt.icon}
                  type="material"
                  color={currentPrompt.color}
                  size={18}
                />
              </View>
              <View style={styles.promptContent}>
                <Text style={styles.promptLabel}>Wellness Prompt</Text>
                <Text style={styles.promptTitle}>{currentPrompt.title}</Text>
              </View>
            </TouchableOpacity>
          </View>
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
    fontFamily: appFonts.headerTextBold,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: appColors.CardBackground,
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
    fontFamily: appFonts.headerTextBold,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    marginBottom: 20,
    fontFamily: appFonts.headerTextBold,
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
    fontFamily: appFonts.bodyTextMedium,
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
    fontFamily: appFonts.headerTextBold,
  },
  sessionsSubtitle: {
    fontSize: 14,
    color: appColors.AppBlue,
    marginBottom: 15,
    lineHeight: 20,
    fontFamily: appFonts.bodyTextRegular,
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
    color: appColors.AppBlue,
    fontWeight: '600',
    fontFamily: appFonts.bodyTextMedium,
  },
  sessionCard: {
    backgroundColor: appColors.CardBackground,
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
    backgroundColor: appColors.AppBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.CardBackground,
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
    color: appColors.AppBlue,
    marginBottom: 2,
    fontFamily: appFonts.headerTextMedium,
  },
  sessionSpecialty: {
    fontSize: 13,
    color: appColors.AppGray,
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
    color: appColors.AppBlue,
    fontWeight: '500',
    marginLeft: 6,
    fontFamily: appFonts.bodyTextMedium,
  },
  sessionDuration: {
    fontSize: 13,
    color: appColors.AppGray,
    marginLeft: 6,
    fontFamily: appFonts.bodyTextRegular,
  },
  sessionActions: {
    marginLeft: 10,
  },
  joinButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  joinButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: appColors.CardBackground,
    fontFamily: appFonts.bodyTextMedium,
  },
  // Events and Prompts Styles - Compact Design
  eventsContainer: {
    backgroundColor: appColors.CardBackground,
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
    backgroundColor: appColors.CardBackground,
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
    color: appColors.AppBlue,
    marginBottom: 1,
    fontFamily: appFonts.headerTextMedium,
  },
  eventTime: {
    fontSize: 13,
    color: appColors.AppGray,
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
    color: appColors.AppBlue,
    lineHeight: 20,
    fontFamily: appFonts.bodyTextRegular,
  },
  
  // Commented out - Original Activities Styles (kept for future use)
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
    fontFamily: appFonts.bodyTextMedium,
  },
  activityTime: {
    fontSize: 13,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
  },

  emergencyText: {
    color: appColors.CardBackground,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    fontFamily: appFonts.headerTextBold,
  },
  bottomSpacing: {
    height: 30,
  },
});

export default HomeScreen;
