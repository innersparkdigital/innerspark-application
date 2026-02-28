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
import { scale, moderateScale } from '../global/Scaling';
import { useToast } from 'native-base';
import { appImages, moodOptions } from '../global/Data';
import LHGenericHeader from '../components/LHGenericHeader';
import PanicButtonComponent from '../components/PanicButtonComponent';
import MoodCheckInCard from '../components/MoodCheckInCard';
import TodayMoodSummaryCard from '../components/TodayMoodSummaryCard';
import { loadAllMoodData, formatRelativeTime } from '../utils/moodCheckInManager';
import {
  selectHasCheckedInToday,
  selectTodayMoodData,
  selectMoodStats,
  selectMoodHistory,
  selectMoodInsights,
  selectBestTimeOfDay,
  selectWeeklyImprovement,
  selectMoodLoading,
  selectInsightsLoading,
  selectHistoryLoading,
} from '../features/mood/moodSlice';

const SCREEN_WIDTH = Dimensions.get('window').width;

const MoodScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const userDetails = useSelector(state => state.userData.userDetails);
  const [selectedMood, setSelectedMood] = useState(null);

  // Get mood data from Redux
  const hasCheckedInToday = useSelector(selectHasCheckedInToday);
  const todayMoodData = useSelector(selectTodayMoodData);
  const { currentStreak, totalPoints, totalCheckIns } = useSelector(selectMoodStats);
  const moodHistoryData = useSelector(selectMoodHistory);
  const insightsData = useSelector(selectMoodInsights);
  const bestTimeOfDay = useSelector(selectBestTimeOfDay);
  const weeklyImprovement = useSelector(selectWeeklyImprovement);

  // Loading states
  const isLoadingMain = useSelector(selectMoodLoading);
  const isLoadingInsights = useSelector(selectInsightsLoading);
  const isLoadingHistory = useSelector(selectHistoryLoading);

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

  // Use only real API data - no mock fallback
  const moodHistory = moodHistoryData;
  const insights = insightsData;

  useEffect(() => {
    if (userDetails?.userId) {
      loadAllMoodData(userDetails.userId); // Load all mood data from API
    }
  }, [userDetails?.userId]);

  const handleMoodSelect = (mood) => {
    // Navigate to TodayMoodScreen with pre-selected mood
    navigation.navigate('TodayMoodScreen', { preSelectedMood: mood });
  };

  // Calculate week summary from history data
  const calculateWeekSummary = () => {
    if (!moodHistory || moodHistory.length === 0) {
      return { week: 'This Week', moods: [] };
    }

    const moodCounts = {};
    moodHistory.slice(0, 7).forEach(entry => {
      const emoji = entry.emoji || '😐';
      moodCounts[emoji] = (moodCounts[emoji] || 0) + 1;
    });

    const moods = Object.entries(moodCounts)
      .map(([emoji, count]) => ({ emoji, count, label: `${count} days` }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    return { week: 'This Week', moods };
  };

  const weekSummary = calculateWeekSummary();

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
            <Icon name="notifications" type="material" color={appColors.CardBackground} size={moderateScale(28)} />
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
                <Icon name="local-fire-department" type="material" color="#FF6B6B" size={moderateScale(28)} />
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
                <Icon name="calendar-today" type="material" color={appColors.AppBlue} size={moderateScale(28)} />
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
                  <Icon name="psychology" type="material" color={appColors.AppBlue} size={moderateScale(24)} />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Talk to a Therapist</Text>
                  <Text style={styles.actionSubtitle}>Professional support when you need it</Text>
                </View>
                <Icon name="chevron-right" type="material" color={appColors.grey3} size={moderateScale(20)} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => navigation.navigate('MeditationScreen')}
              >
                <View style={styles.actionIconContainer}>
                  <Icon name="self-improvement" type="material" color={appColors.AppBlue} size={moderateScale(24)} />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Guided Meditation</Text>
                  <Text style={styles.actionSubtitle}>Calm your mind with mindfulness</Text>
                </View>
                <Icon name="chevron-right" type="material" color={appColors.grey3} size={moderateScale(20)} />
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
            {isLoadingInsights ? (
              <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                  <ActivityIndicator size="small" color={appColors.AppBlue} />
                </View>
                <View style={styles.metricCard}>
                  <ActivityIndicator size="small" color={appColors.AppBlue} />
                </View>
              </View>
            ) : (
              <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                  <Icon name="trending-up" type="material" color="#4CAF50" size={moderateScale(32)} />
                  <Text style={styles.metricValue}>{weeklyImprovement ? `${weeklyImprovement > 0 ? '+' : ''}${weeklyImprovement}%` : '--'}</Text>
                  <Text style={styles.metricLabel}>Weekly Improvement</Text>
                </View>
                <View style={styles.metricCard}>
                  <Icon name="wb-sunny" type="material" color="#FF9800" size={moderateScale(32)} />
                  <Text style={styles.metricValue}>{bestTimeOfDay || '--'}</Text>
                  <Text style={styles.metricLabel}>Best Time</Text>
                </View>
              </View>
            )}

            {/* Insights Cards - Vertical Layout */}
            <View style={styles.insightsListSection}>
              <Text style={styles.sectionTitle}>Detailed Insights</Text>
              {isLoadingInsights ? (
                <View style={styles.insightCardFull}>
                  <ActivityIndicator size="small" color={appColors.AppBlue} />
                  <Text style={[styles.insightDescription, { textAlign: 'center', marginTop: 10 }]}>Loading insights...</Text>
                </View>
              ) : insights.length > 0 ? (
                insights.map((insight) => (
                  <View key={insight.id} style={styles.insightCardFull}>
                    <View style={styles.insightCardHeader}>
                      <View style={[styles.insightIconContainer, { backgroundColor: insight.color + '15' }]}>
                        <Icon
                          name={insight.icon}
                          type="material"
                          color={insight.color}
                          size={moderateScale(28)}
                        />
                      </View>
                      <View style={styles.insightCardContent}>
                        <Text style={styles.insightTitle}>{insight.title}</Text>
                        <Text style={styles.insightDescription}>{insight.description}</Text>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.insightCardFull}>
                  <Icon name="lightbulb-outline" type="material" color={appColors.grey3} size={moderateScale(32)} />
                  <Text style={[styles.insightDescription, { textAlign: 'center', marginTop: scale(10) }]}>Start tracking your mood to see personalized insights</Text>
                </View>
              )}
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
            {isLoadingHistory ? (
              <View style={styles.weekSummary}>
                <ActivityIndicator size="small" color={appColors.AppBlue} />
                <Text style={styles.weekCount}>Loading week summary...</Text>
              </View>
            ) : weekSummary.moods.length > 0 ? (
              <View style={styles.weekSummary}>
                <Text style={styles.weekTitle}>{weekSummary.week}</Text>
                <View style={styles.weekMoods}>
                  {weekSummary.moods.map((mood, index) => (
                    <View key={index} style={styles.weekMoodItem}>
                      <Text style={styles.weekEmoji}>{mood.emoji}</Text>
                      <Text style={styles.weekCount}>{mood.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <View style={styles.weekSummary}>
                <Text style={styles.weekTitle}>This Week</Text>
                <Text style={styles.weekCount}>No mood entries yet this week</Text>
              </View>
            )}

            {/* Full History List */}
            <View style={styles.historyFullSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>All Entries</Text>
                <TouchableOpacity onPress={() => navigation.navigate('MoodHistoryScreen')}>
                  <Text style={styles.viewAllText}>View Calendar</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.historyContainer}>
                {isLoadingHistory ? (
                  <View style={{ padding: scale(20), alignItems: 'center' }}>
                    <ActivityIndicator size="small" color={appColors.AppBlue} />
                    <Text style={styles.historyDateSmall}>Loading history...</Text>
                  </View>
                ) : moodHistory.length > 0 ? (
                  moodHistory.slice(0, 4).map((entry, index) => (
                    <TouchableOpacity
                      key={entry.id || index}
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
                      <Icon name="chevron-right" type="material" color={appColors.grey3} size={moderateScale(20)} />
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={{ padding: scale(20), alignItems: 'center' }}>
                    <Icon name="history" type="material" color={appColors.grey3} size={moderateScale(32)} />
                    <Text style={[styles.historyDateSmall, { marginTop: scale(10) }]}>No mood history yet. Start by checking in today!</Text>
                  </View>
                )}
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
    paddingBottom: scale(25),
    paddingHorizontal: scale(20),
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
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
    marginBottom: scale(5),
  },
  headerSubtitle: {
    fontSize: moderateScale(16),
    color: appColors.CardBackground,
    opacity: 0.9,
    fontFamily: appFonts.bodyTextRegular,
  },
  headerIconButton: {
    padding: scale(5),
  },
  scrollView: {
    flex: 1,
  },
  moodSection: {
    margin: scale(20),
  },
  quickStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    marginBottom: scale(20),
    gap: scale(12),
  },
  statCard: {
    flex: 1,
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(16),
    padding: scale(16),
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: appColors.grey1,
    marginTop: scale(8),
    fontFamily: appFonts.headerTextBold,
  },
  statLabel: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    marginTop: scale(4),
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: scale(20),
    fontFamily: appFonts.bodyTextBold,
  },
  insightsSection: {
    marginBottom: scale(25),
  },
  insightsScrollContainer: {
    paddingHorizontal: scale(20),
  },
  insightCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(15),
    padding: scale(20),
    alignItems: 'center',
    width: scale(160),
    minHeight: scale(100),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginRight: scale(15),
  },
  insightIconContainer: {
    borderRadius: scale(25),
    width: scale(50),
    height: scale(50),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(12),
  },
  insightTitle: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextBold,
    textAlign: 'center',
    marginBottom: scale(5),
  },
  insightDescription: {
    fontSize: moderateScale(12),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'center',
    lineHeight: moderateScale(16),
  },
  historySection: {
    marginHorizontal: scale(20),
    marginBottom: scale(25),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(15),
  },
  viewAllText: {
    color: appColors.AppBlue,
    fontSize: moderateScale(14),
    fontWeight: '600',
    fontFamily: appFonts.bodyTextMedium,
  },
  historyContainer: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(15),
    padding: scale(20),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(12),
    borderBottomWidth: 0.5,
    borderBottomColor: appColors.grey4,
  },
  historyMoodContainer: {
    borderRadius: scale(20),
    width: scale(40),
    height: scale(40),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(15),
  },
  historyEmoji: {
    fontSize: moderateScale(20),
  },
  historyContent: {
    flex: 1,
    marginRight: scale(12),
  },
  historyMood: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextBold,
  },
  historyDate: {
    fontSize: moderateScale(13),
    marginRight: scale(12),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
  },
  historyIndicator: {
    width: scale(4),
    height: scale(30),
    borderRadius: scale(2),
  },
  actionsSection: {
    marginHorizontal: scale(20),
    marginBottom: scale(25),
  },
  actionCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(15),
    padding: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(12),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionIconContainer: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: scale(25),
    width: scale(45),
    height: scale(45),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(15),
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextBold,
    marginBottom: scale(3),
  },
  actionSubtitle: {
    fontSize: moderateScale(13),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: moderateScale(18),
  },
  bottomSpacing: {
    height: scale(30),
  },
  // Tab styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    borderBottomWidth: scale(1),
    borderBottomColor: appColors.grey5,
  },
  tab: {
    flex: 1,
    paddingVertical: scale(16),
    alignItems: 'center',
    borderBottomWidth: scale(2),
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: appColors.AppBlue,
  },
  tabText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: appColors.grey3,
    fontFamily: appFonts.headerTextSemiBold,
  },
  activeTabText: {
    color: appColors.AppBlue,
  },
  // Insights Tab Styles
  insightsHeader: {
    padding: scale(20),
    paddingBottom: scale(10),
  },
  insightsTitle: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: scale(8),
  },
  insightsSubtitle: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
  },
  metricsGrid: {
    flexDirection: 'row',
    paddingHorizontal: scale(20),
    gap: scale(12),
    marginBottom: scale(20),
  },
  metricCard: {
    flex: 1,
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(16),
    padding: scale(20),
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  metricValue: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginTop: scale(12),
    marginBottom: scale(4),
  },
  metricLabel: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
  },
  insightsListSection: {
    paddingHorizontal: scale(20),
    marginBottom: scale(20),
  },
  insightCardFull: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(12),
    padding: scale(16),
    marginBottom: scale(12),
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
    marginLeft: scale(12),
  },
  patternsSection: {
    paddingHorizontal: scale(20),
    marginBottom: scale(20),
  },
  patternCard: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: scale(12),
    padding: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
  patternText: {
    flex: 1,
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: scale(12),
    lineHeight: moderateScale(20),
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
