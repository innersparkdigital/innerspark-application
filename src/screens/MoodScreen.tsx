/**
 * Mood Screen - Track and manage your mood
 */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../global/Styles';
import { useToast } from 'native-base';
import { appImages, moodOptions } from '../global/Data';
import LHGenericHeader from '../components/LHGenericHeader';
import PanicButtonComponent from '../components/PanicButtonComponent';
import MoodCheckInCard from '../components/MoodCheckInCard';
import TodayMoodSummaryCard from '../components/TodayMoodSummaryCard';
import { loadTodayCheckInStatus, loadMoodStats, formatRelativeTime } from '../utils/moodCheckInManager';
import { selectHasCheckedInToday, selectTodayMoodData, selectMoodStats } from '../features/mood/moodSlice';

const SCREEN_WIDTH = Dimensions.get('window').width;

const MoodScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  
  const userDetails = useSelector(state => state.userData.userDetails);
  const [selectedMood, setSelectedMood] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get mood check-in status from Redux
  const hasCheckedInToday = useSelector(selectHasCheckedInToday);
  const todayMoodData = useSelector(selectTodayMoodData);
  const { currentStreak, totalPoints, totalCheckIns } = useSelector(selectMoodStats);

  // Dynamic subtitle messages
  const subtitlesBeforeCheckIn = [
    "Take a moment to check in with yourself",
    "Your mental wellness matters",
    "Let's track your emotional journey",
    "Start your daily mood check-in",
    "Monitor your emotional well-being",
    "Build your wellness streak",
  ];

  const subtitlesAfterCheckIn = [
    "Great job checking in today!",
    "Your mood has been logged",
    "Keep up your wellness streak!",
    "Review your mood insights below",
    "See how you're doing this week",
    "Track your emotional journey",
  ];

  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'insights' | 'history'

  useEffect(() => {
    // Set subtitle based on check-in status
    const subtitles = hasCheckedInToday ? subtitlesAfterCheckIn : subtitlesBeforeCheckIn;
    const randomSubtitle = subtitles[Math.floor(Math.random() * subtitles.length)];
    setCurrentSubtitle(randomSubtitle);
  }, [hasCheckedInToday]);

  const moodHistory = [
    { date: 'Today', mood: 'Happy', emoji: '😊', color: '#8BC34A' },
    { date: 'Yesterday', mood: 'Neutral', emoji: '😐', color: '#FFC107' },
    { date: '2 days ago', mood: 'Amazing', emoji: '🤩', color: '#4CAF50' },
    { date: '3 days ago', mood: 'Happy', emoji: '😊', color: '#8BC34A' },
  ];

  const insights = [
    {
      id: 1,
      title: 'Weekly Progress',
      description: 'Your mood has improved 20% this week',
      icon: 'trending-up',
      color: '#4CAF50',
      type: 'positive'
    },
    {
      id: 2,
      title: 'Best Time',
      description: 'You feel best in the mornings',
      icon: 'wb-sunny',
      color: '#FF9800',
      type: 'info'
    },
    {
      id: 3,
      title: 'Streak',
      description: '5 days of mood tracking!',
      icon: 'local-fire-department',
      color: '#F44336',
      type: 'achievement'
    }
  ];

  useEffect(() => {
    loadTodayCheckInStatus(); // Load from API and update Redux
    loadMoodStats(); // Load user stats
  }, []);

  const handleMoodSelect = (mood) => {
    // Navigate to TodayMoodScreen with pre-selected mood
    navigation.navigate('TodayMoodScreen', { preSelectedMood: mood });
  };

  const saveMood = () => {
    if (!selectedMood) {
      toast.show({
        description: "Please select a mood first",
        duration: 2000,
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.show({
        description: `Mood "${selectedMood.name}" saved successfully!`,
        duration: 2000,
      });
    }, 1000);
  };

  const notifyWithToast = (description) => {
    toast.show({
      description: description,
      duration: 2000,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={appColors.AppBlue} barStyle="light-content" />
      
      {/* Always-visible Panic Button */}
      <PanicButtonComponent 
        position="bottom-left" 
        size="medium" 
        quickAction="modal" 
      />
      
      {/* Custom Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Mood Tracker</Text>
            <Text style={styles.headerSubtitle}>{currentSubtitle}</Text>
          </View>
          <TouchableOpacity 
            style={styles.headerIconButton}
            onPress={() => navigation.navigate('NotificationScreen')}
          >
            <Icon name="notifications" type="material" color={appColors.CardBackground} size={28} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'insights' && styles.activeTab]}
          onPress={() => setActiveTab('insights')}
        >
          <Text style={[styles.tabText, activeTab === 'insights' && styles.activeTabText]}>Insights</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
            {/* Current Mood Selection - Using Reusable Component */}
            <View style={styles.moodSection}>
          {!hasCheckedInToday ? (
            <MoodCheckInCard
              title="How are you feeling right now?"
              moodOptions={moodOptions}
              selectedMood={selectedMood}
              onMoodSelect={handleMoodSelect}
              showNavigationHint={true}
              navigationHintText="Select your current mood to start tracking"
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
              showDetailsButton={true}
            />
          ) : null}
            </View>

            {/* Quick Stats Row */}
        <View style={styles.quickStatsRow}>
          <TouchableOpacity 
            style={styles.statCard}
            onPress={() => toast.show({ description: `${currentStreak} day streak! Keep it up!`, duration: 2000 })}
          >
            <Icon name="local-fire-department" type="material" color="#FF6B6B" size={28} />
            <Text style={styles.statValue}>{currentStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </TouchableOpacity>
          
          {/* MVP: Points card hidden - will show milestone rewards later */}
          {/* <TouchableOpacity 
            style={styles.statCard}
            onPress={() => navigation.navigate('MoodPointsScreen')}
          >
            <Icon name="stars" type="material" color="#FFD700" size={28} />
            <Text style={styles.statValue}>{totalPoints}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </TouchableOpacity> */}
          
          <TouchableOpacity 
            style={styles.statCard}
            onPress={() => navigation.navigate('MoodHistoryScreen')}
          >
            <Icon name="calendar-today" type="material" color={appColors.AppBlue} size={28} />
            <Text style={styles.statValue}>{totalCheckIns}</Text>
            <Text style={styles.statLabel}>Check-ins</Text>
          </TouchableOpacity>
            </View>

            {/* Wellness Resources */}
            <View style={styles.actionsSection}>
              <Text style={styles.sectionTitle}>Wellness Resources</Text>
              
              {/* MVP: Points action hidden - will show milestone rewards later */}
              {/* <TouchableOpacity 
                style={styles.actionCard}
                onPress={() => navigation.navigate('MoodPointsScreen')}
              >
                <View style={styles.actionIconContainer}>
                  <Icon name="stars" type="material" color="#FFD700" size={24} />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Loyalty Points</Text>
                  <Text style={styles.actionSubtitle}>Redeem points for therapy discounts</Text>
                </View>
                <Icon name="chevron-right" type="material" color={appColors.grey3} size={20} />
              </TouchableOpacity> */}
              
              <TouchableOpacity 
                style={styles.actionCard}
                onPress={() => navigation.navigate('TherapistsScreen')}
              >
                <View style={styles.actionIconContainer}>
                  <Icon name="psychology" type="material" color={appColors.AppBlue} size={24} />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Talk to a Therapist</Text>
                  <Text style={styles.actionSubtitle}>Professional support when you need it</Text>
                </View>
                <Icon name="chevron-right" type="material" color={appColors.grey3} size={20} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionCard}
                onPress={() => navigation.navigate('MeditationScreen')}
              >
                <View style={styles.actionIconContainer}>
                  <Icon name="self-improvement" type="material" color={appColors.AppBlue} size={24} />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Guided Meditation</Text>
                  <Text style={styles.actionSubtitle}>Calm your mind with mindfulness</Text>
                </View>
                <Icon name="chevron-right" type="material" color={appColors.grey3} size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.bottomSpacing} />
          </>
        )}

        {/* INSIGHTS TAB */}
        {activeTab === 'insights' && (
          <>
            {/* Stats Overview */}
            <View style={styles.insightsHeader}>
              <Text style={styles.insightsTitle}>Your Mood Analytics</Text>
              <Text style={styles.insightsSubtitle}>Data-driven insights about your emotional well-being</Text>
            </View>

            {/* Key Metrics Grid */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Icon name="trending-up" type="material" color="#4CAF50" size={32} />
                <Text style={styles.metricValue}>+20%</Text>
                <Text style={styles.metricLabel}>Weekly Improvement</Text>
              </View>
              <View style={styles.metricCard}>
                <Icon name="wb-sunny" type="material" color="#FF9800" size={32} />
                <Text style={styles.metricValue}>Morning</Text>
                <Text style={styles.metricLabel}>Best Time</Text>
              </View>
            </View>

            {/* Insights Cards - Vertical Layout */}
            <View style={styles.insightsListSection}>
              <Text style={styles.sectionTitle}>Detailed Insights</Text>
              {insights.map((insight) => (
                <View key={insight.id} style={styles.insightCardFull}>
                  <View style={styles.insightCardHeader}>
                    <View style={[styles.insightIconContainer, { backgroundColor: insight.color + '15' }]}>
                      <Icon
                        name={insight.icon}
                        type="material"
                        color={insight.color}
                        size={28}
                      />
                    </View>
                    <View style={styles.insightCardContent}>
                      <Text style={styles.insightTitle}>{insight.title}</Text>
                      <Text style={styles.insightDescription}>{insight.description}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Mood Patterns Section */}
            <View style={styles.patternsSection}>
              <Text style={styles.sectionTitle}>Mood Patterns</Text>
              <View style={styles.patternCard}>
                <Icon name="info-outline" type="material" color={appColors.AppBlue} size={24} />
                <Text style={styles.patternText}>Connect your mood data to see personalized patterns and trends</Text>
              </View>
            </View>

            <View style={styles.bottomSpacing} />
          </>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <>
            {/* History Header */}
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Mood History</Text>
              <Text style={styles.historySubtitle}>Track your emotional journey over time</Text>
            </View>

            {/* This Week Summary */}
            <View style={styles.weekSummary}>
              <Text style={styles.weekTitle}>This Week</Text>
              <View style={styles.weekMoods}>
                <View style={styles.weekMoodItem}>
                  <Text style={styles.weekEmoji}>😊</Text>
                  <Text style={styles.weekCount}>3 days</Text>
                </View>
                <View style={styles.weekMoodItem}>
                  <Text style={styles.weekEmoji}>🙂</Text>
                  <Text style={styles.weekCount}>2 days</Text>
                </View>
                <View style={styles.weekMoodItem}>
                  <Text style={styles.weekEmoji}>😐</Text>
                  <Text style={styles.weekCount}>2 days</Text>
                </View>
              </View>
            </View>

            {/* Full History List */}
            <View style={styles.historyFullSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>All Entries</Text>
                <TouchableOpacity onPress={() => navigation.navigate('MoodHistoryScreen')}>
                  <Text style={styles.viewAllText}>View Calendar</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.historyContainer}>
                {moodHistory.map((entry, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.historyItemEnhanced}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.historyMoodContainer, { backgroundColor: entry.color + '15' }]}>
                      <Text style={styles.historyEmoji}>{entry.emoji}</Text>
                    </View>
                    <View style={styles.historyContent}>
                      <Text style={styles.historyMood}>{entry.mood}</Text>
                      <Text style={styles.historyDateSmall}>{entry.date}</Text>
                    </View>
                    <Icon name="chevron-right" type="material" color={appColors.grey3} size={20} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.bottomSpacing} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  header: {
    backgroundColor: appColors.AppBlue,
    paddingTop: parameters.headerHeightS,
    paddingBottom: 25,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.appTextBold,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: appColors.CardBackground,
    opacity: 0.9,
    fontFamily: appFonts.appTextRegular,
  },
  headerIconButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  moodSection: {
    margin: 20,
  },
  quickStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: appColors.CardBackground,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginTop: 8,
    fontFamily: appFonts.headerTextBold,
  },
  statLabel: {
    fontSize: 12,
    color: appColors.grey3,
    marginTop: 4,
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: 20,
    fontFamily: appFonts.appTextBold,
  },
  insightsSection: {
    marginBottom: 25,
  },
  insightsScrollContainer: {
    paddingHorizontal: 20,
  },
  insightCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: 160,
    minHeight: 100,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginRight: 15,
  },
  insightIconContainer: {
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.appTextBold,
    textAlign: 'center',
    marginBottom: 5,
  },
  insightDescription: {
    fontSize: 12,
    color: appColors.grey2,
    fontFamily: appFonts.appTextRegular,
    textAlign: 'center',
    lineHeight: 16,
  },
  historySection: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  viewAllText: {
    color: appColors.AppBlue,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: appFonts.appTextMedium,
  },
  historyContainer: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: appColors.grey4,
  },
  historyMoodContainer: {
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  historyEmoji: {
    fontSize: 20,
  },
  historyContent: {
    flex: 1,
    marginRight: 12,
  },
  historyMood: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.appTextBold,
  },
  historyDate: {
    fontSize: 13,
    marginRight: 12,
    color: appColors.grey2,
    fontFamily: appFonts.appTextRegular,
  },
  historyIndicator: {
    width: 4,
    height: 30,
    borderRadius: 2,
  },
  actionsSection: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  actionCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionIconContainer: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: 25,
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.appTextBold,
    marginBottom: 3,
  },
  actionSubtitle: {
    fontSize: 13,
    color: appColors.grey2,
    fontFamily: appFonts.appTextRegular,
    lineHeight: 18,
  },
  bottomSpacing: {
    height: 30,
  },
  // Tab styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey5,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: appColors.AppBlue,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.grey3,
    fontFamily: appFonts.headerTextSemiBold,
  },
  activeTabText: {
    color: appColors.AppBlue,
  },
  // Insights Tab Styles
  insightsHeader: {
    padding: 20,
    paddingBottom: 10,
  },
  insightsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 8,
  },
  insightsSubtitle: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
  },
  metricsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: appColors.CardBackground,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginTop: 12,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
  },
  insightsListSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  insightCardFull: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  insightCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightCardContent: {
    flex: 1,
    marginLeft: 12,
  },
  patternsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  patternCard: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  patternText: {
    flex: 1,
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: 12,
    lineHeight: 20,
  },
  // History Tab Styles
  historyHeader: {
    padding: 20,
    paddingBottom: 10,
  },
  historyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 8,
  },
  historySubtitle: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
  },
  weekSummary: {
    backgroundColor: appColors.CardBackground,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 16,
  },
  weekMoods: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weekMoodItem: {
    alignItems: 'center',
  },
  weekEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  weekCount: {
    fontSize: 13,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
  },
  historyFullSection: {
    paddingHorizontal: 20,
  },
  historyItemEnhanced: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: appColors.grey4,
  },
  historyDateSmall: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginTop: 2,
  },
});

export default MoodScreen;
