/**
 * Mood History Screen - View mood trends and history with charts
 */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Skeleton } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import { useToast } from 'native-base';
import { NavigationProp } from '@react-navigation/native';
import {
  selectMoodHistory,
  selectMoodStats,
  selectHistoryLoading,
} from '../../features/mood/moodSlice';
import { loadMoodHistory } from '../../utils/moodCheckInManager';

interface MoodEntry {
  id: string;
  date: string;
  moodValue: number;
  emoji: string;
  mood: string;
  note: string;
  timestamp: string;
  color?: string;
}

interface MoodHistoryScreenProps {
  navigation: NavigationProp<any>;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 40;

const MoodHistoryScreen: React.FC<MoodHistoryScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const userDetails = useSelector((state: any) => state.userData.userDetails);
  const [selectedPeriod, setSelectedPeriod] = useState<'7' | '30' | '90'>('7');

  // Get data from Redux
  const moodHistoryData = useSelector(selectMoodHistory);
  const reduxStats = useSelector(selectMoodStats);
  const isLoading = useSelector(selectHistoryLoading);

  // Use Redux data directly
  const moodHistory = moodHistoryData || [];
  const [localStats, setLocalStats] = useState({
    averageMood: 0,
    currentStreak: 0,
    totalEntries: 0,
    bestDay: null as MoodEntry | null,
    mostCommonMood: '',
  });

  const periodOptions = [
    { key: '7', label: '7 Days', days: 7 },
    { key: '30', label: '30 Days', days: 30 },
    { key: '90', label: '90 Days', days: 90 },
  ];

  const moodColors = {
    1: '#4CAF50', // Great
    2: '#8BC34A', // Good
    3: '#FFC107', // Okay
    4: '#FF9800', // Bad
    5: '#F44336', // Terrible
  };

  const moodLabels = {
    1: 'Great',
    2: 'Good',
    3: 'Okay',
    4: 'Bad',
    5: 'Terrible',
  };

  const moodEmojis = {
    1: '😊',
    2: '🙂',
    3: '😐',
    4: '😔',
    5: '😢',
  };

  useEffect(() => {
    if (userDetails?.userId) {
      const periodMap = { '7': 'week', '30': 'month', '90': 'quarter' };
      loadMoodHistory(userDetails.userId, periodMap[selectedPeriod] || 'week');
    }
  }, [selectedPeriod, userDetails?.userId]);

  // Recalculate local stats when mood history changes
  useEffect(() => {
    calculateStats(moodHistory);
  }, [moodHistory]);

  const calculateStats = (data: MoodEntry[]) => {
    if (data.length === 0) {
      setLocalStats({
        averageMood: 0,
        currentStreak: 0,
        totalEntries: 0,
        bestDay: null,
        mostCommonMood: '',
      });
      return;
    }

    const averageMood = data.reduce((sum, entry) => sum + entry.moodValue, 0) / data.length;
    const bestDay = data.reduce((best, entry) =>
      entry.moodValue < (best?.moodValue || Infinity) ? entry : best
    );

    // Calculate current streak
    let streak = 0;
    const sortedData = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const today = new Date().toDateString();

    for (let i = 0; i < sortedData.length; i++) {
      const entryDate = new Date(sortedData[i].date);
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);

      if (entryDate.toDateString() === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }

    // Most common mood
    const moodCounts = data.reduce((counts, entry) => {
      counts[entry.mood] = (counts[entry.mood] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const mostCommonMood = Object.entries(moodCounts).reduce((a, b) =>
      moodCounts[a[0]] > moodCounts[b[0]] ? a : b
    )[0];

    setLocalStats({
      averageMood: Math.round(averageMood * 10) / 10,
      currentStreak: reduxStats.currentStreak || streak,
      totalEntries: data.length,
      bestDay,
      mostCommonMood,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const SimpleChart: React.FC = () => {
    if (moodHistory.length === 0) {
      return (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Mood Trend</Text>
          <View style={styles.emptyChart}>
            <Icon name="show-chart" type="material" color={appColors.grey3} size={moderateScale(48)} />
            <Text style={styles.emptyChartText}>No mood data yet</Text>
            <Text style={styles.emptyChartSubtext}>Start tracking your mood to see trends</Text>
          </View>
        </View>
      );
    }

    const chartHeight = scale(160);
    const chartPadding = scale(20);
    const pointSize = scale(12);
    const minWidth = CHART_WIDTH - scale(60);
    const chartWidth = Math.max(minWidth, moodHistory.length * scale(60));

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Mood Trend - Last {selectedPeriod} Days</Text>

        <View style={styles.chartWrapper}>
          {/* Y-axis emojis */}
          <View style={styles.yAxis}>
            {[1, 2, 3, 4, 5].map(value => (
              <Text key={value} style={styles.yAxisEmoji}>
                {moodEmojis[value as keyof typeof moodEmojis]}
              </Text>
            ))}
          </View>

          {/* Scrollable chart */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chartScrollView}
          >
            <View style={[styles.chartCanvas, { width: chartWidth, height: chartHeight }]}>
              {/* Grid lines */}
              {[1, 2, 3, 4, 5].map(value => {
                const y = ((value - 1) / 4) * (chartHeight - chartPadding * 2) + chartPadding;
                return (
                  <View
                    key={`grid-${value}`}
                    style={[styles.gridLine, { top: y }]}
                  />
                );
              })}

              {/* Data points and lines */}
              {moodHistory.map((entry: any, index: number) => {
                const x = moodHistory.length > 1
                  ? (index / (moodHistory.length - 1)) * (chartWidth - 40) + 20
                  : chartWidth / 2;
                const y = ((entry.moodValue - 1) / 4) * (chartHeight - chartPadding * 2) + chartPadding;

                const nextEntry = moodHistory[index + 1];
                let lineWidth = 0;
                let lineAngle = 0;

                if (nextEntry) {
                  const nextX = (index + 1) / (moodHistory.length - 1) * (chartWidth - 40) + 20;
                  const nextY = ((nextEntry.moodValue - 1) / 4) * (chartHeight - chartPadding * 2) + chartPadding;
                  lineWidth = Math.sqrt(Math.pow(nextX - x, 2) + Math.pow(nextY - y, 2));
                  lineAngle = Math.atan2(nextY - y, nextX - x) * (180 / Math.PI);
                }

                return (
                  <View key={entry.id}>
                    {/* Connecting line */}
                    {nextEntry && (
                      <View
                        style={[
                          styles.connectingLine,
                          {
                            left: x,
                            top: y,
                            width: lineWidth,
                            backgroundColor: moodColors[entry.moodValue as keyof typeof moodColors],
                            transform: [{ rotate: `${lineAngle}deg` }],
                          }
                        ]}
                      />
                    )}

                    {/* Data point */}
                    <TouchableOpacity
                      style={[
                        styles.dataPoint,
                        {
                          left: x - pointSize / 2,
                          top: y - pointSize / 2,
                          width: pointSize,
                          height: pointSize,
                          borderRadius: pointSize / 2,
                          backgroundColor: moodColors[entry.moodValue as keyof typeof moodColors],
                        }
                      ]}
                      onPress={() => {
                        toast.show({
                          description: `${formatFullDate(entry.date)}: ${entry.moodLabel} - "${entry.note}"`,
                          duration: 4000,
                        });
                      }}
                    />
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

  const StatsCards: React.FC = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{localStats.averageMood || '--'}</Text>
          <Text style={styles.statLabel}>Average Mood</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{localStats.currentStreak || 0}</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{localStats.totalEntries || 0}</Text>
          <Text style={styles.statLabel}>Total Entries</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{localStats.mostCommonMood || '--'}</Text>
          <Text style={styles.statLabel}>Most Common</Text>
        </View>
      </View>
    </View>
  );

  const MoodHistoryItem: React.FC<{ item: MoodEntry }> = ({ item }) => (
    <TouchableOpacity style={styles.historyItem}>
      <View style={styles.historyDate}>
        <Text style={styles.historyDateText}>{formatDate(item.date)}</Text>
        <Text style={styles.historyTimeText}>
          {new Date(item.timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })}
        </Text>
      </View>

      <View style={styles.historyMood}>
        <Text style={styles.historyEmoji}>{item.emoji}</Text>
        <View style={styles.historyMoodInfo}>
          <Text style={[styles.historyMoodLabel, { color: item.color || moodColors[item.moodValue as keyof typeof moodColors] }]}>
            {item.mood}
          </Text>
          <Text style={styles.historyNote} numberOfLines={2}>
            {item.note}
          </Text>
        </View>
      </View>

      {/* MVP: Points hidden */}
    </TouchableOpacity>
  );

  const EmptyState: React.FC = () => (
    <View style={styles.emptyContainer}>
      <Icon name="mood" type="material" color={appColors.grey3} size={moderateScale(80)} />
      <Text style={styles.emptyTitle}>No Mood Entries Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start tracking your daily mood to see insights and trends over time.
      </Text>
      <TouchableOpacity
        style={styles.startTrackingButton}
        onPress={() => navigation.navigate('TodayMoodScreen')}
      >
        <Text style={styles.startTrackingText}>Start Daily Check-in</Text>
      </TouchableOpacity>
    </View>
  );

  const HistorySkeleton: React.FC = () => (
    <View style={styles.historyItem}>
      <View style={styles.historyDate}>
        <Skeleton animation="pulse" width={60} height={16} />
        <Skeleton animation="pulse" width={40} height={12} style={{ marginTop: 4 }} />
      </View>
      <View style={styles.historyMood}>
        <Skeleton animation="pulse" width={32} height={32} />
        <View style={styles.historyMoodInfo}>
          <Skeleton animation="pulse" width={80} height={16} />
          <Skeleton animation="pulse" width="100%" height={14} style={{ marginTop: 4 }} />
        </View>
      </View>
      <Skeleton animation="pulse" width={40} height={20} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={moderateScale(24)} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mood History</Text>
        <TouchableOpacity
          style={styles.todayButton}
          onPress={() => navigation.navigate('TodayMoodScreen')}
        >
          <Icon name="today" type="material" color={appColors.CardBackground} size={moderateScale(24)} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Period Filter */}
        <View style={styles.periodFilter}>
          {periodOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.periodButton,
                selectedPeriod === option.key && styles.selectedPeriodButton
              ]}
              onPress={() => setSelectedPeriod(option.key as '7' | '30' | '90')}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === option.key && styles.selectedPeriodButtonText
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Skeleton animation="pulse" width="100%" height={200} style={{ marginBottom: 20 }} />
            <View style={styles.statsContainer}>
              <View style={styles.statsRow}>
                <Skeleton animation="pulse" width="48%" height={80} />
                <Skeleton animation="pulse" width="48%" height={80} />
              </View>
              <View style={styles.statsRow}>
                <Skeleton animation="pulse" width="48%" height={80} />
                <Skeleton animation="pulse" width="48%" height={80} />
              </View>
            </View>
            {Array(5).fill(0).map((_, index) => (
              <HistorySkeleton key={index} />
            ))}
          </View>
        ) : moodHistory.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Chart */}
            <SimpleChart />

            {/* Stats */}
            <StatsCards />

            {/* History List */}
            <View style={styles.historySection}>
              <Text style={styles.historySectionTitle}>Recent Entries</Text>
              <FlatList
                data={moodHistory}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <MoodHistoryItem item={item} />}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </View>
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
    paddingTop: scale(parameters.headerHeightS),
    paddingBottom: scale(15),
    paddingHorizontal: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: scale(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.2,
    shadowRadius: scale(4),
  },
  backButton: {
    padding: scale(8),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  todayButton: {
    padding: scale(8),
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    padding: scale(20),
  },
  periodFilter: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: scale(20),
  },
  periodButton: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(20),
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
    marginHorizontal: scale(8),
    elevation: scale(1),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(1),
  },
  selectedPeriodButton: {
    backgroundColor: appColors.AppBlue,
  },
  periodButtonText: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.headerTextMedium,
  },
  selectedPeriodButtonText: {
    color: appColors.CardBackground,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  chartContainer: {
    backgroundColor: appColors.CardBackground,
    margin: scale(20),
    marginTop: 0,
    padding: scale(20),
    borderRadius: scale(16),
    elevation: scale(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
  },
  chartTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: scale(20),
  },
  emptyChart: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(40),
  },
  emptyChartText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextSemiBold,
    marginTop: scale(12),
  },
  emptyChartSubtext: {
    fontSize: moderateScale(14),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginTop: scale(4),
    textAlign: 'center',
  },
  chartWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yAxis: {
    width: scale(40),
    height: scale(160),
    justifyContent: 'space-between',
    paddingVertical: scale(10),
  },
  yAxisEmoji: {
    fontSize: moderateScale(20),
    textAlign: 'center',
  },
  chartScrollView: {
    flex: 1,
  },
  chartCanvas: {
    position: 'relative',
    backgroundColor: '#FAFAFA',
    borderRadius: scale(8),
    marginLeft: scale(10),
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: scale(1),
    backgroundColor: '#E0E0E0',
  },
  dataPoint: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: appColors.CardBackground,
    elevation: scale(3),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.25,
    shadowRadius: scale(3),
  },
  connectingLine: {
    position: 'absolute',
    height: scale(3),
    opacity: 0.7,
  },
  statsContainer: {
    paddingHorizontal: scale(20),
    marginBottom: scale(20),
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(12),
  },
  statCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(12),
    padding: scale(16),
    alignItems: 'center',
    width: '48%',
    elevation: scale(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
  },
  statValue: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  statLabel: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginTop: scale(4),
    textAlign: 'center',
  },
  historySection: {
    backgroundColor: appColors.CardBackground,
    margin: scale(20),
    marginTop: 0,
    borderRadius: scale(16),
    elevation: scale(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
  },
  historySectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    padding: scale(20),
    paddingBottom: 0,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(20),
    borderBottomWidth: scale(1),
    borderBottomColor: appColors.grey6,
  },
  historyDate: {
    width: scale(80),
    alignItems: 'center',
  },
  historyDateText: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  historyTimeText: {
    fontSize: moderateScale(10),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginTop: scale(2),
  },
  historyMood: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: scale(16),
  },
  historyEmoji: {
    fontSize: moderateScale(24),
    marginRight: scale(12),
  },
  historyMoodInfo: {
    flex: 1,
  },
  historyMoodLabel: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  historyNote: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginTop: scale(2),
  },
  historyPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: scale(12),
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
  },
  historyPointsText: {
    fontSize: moderateScale(10),
    fontWeight: 'bold',
    color: '#E65100',
    fontFamily: appFonts.headerTextBold,
    marginLeft: scale(4),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(32),
    paddingVertical: scale(64),
  },
  emptyTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    marginTop: scale(16),
    marginBottom: scale(8),
  },
  emptySubtitle: {
    fontSize: moderateScale(14),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
    lineHeight: moderateScale(20),
    marginBottom: scale(24),
  },
  startTrackingButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: scale(25),
    paddingHorizontal: scale(24),
    paddingVertical: scale(12),
  },
  startTrackingText: {
    fontSize: moderateScale(16),
    color: appColors.CardBackground,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
});

export default MoodHistoryScreen;
