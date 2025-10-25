/**
 * Mood History Screen - View mood trends and history with charts
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Skeleton } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import { NavigationProp } from '@react-navigation/native';

interface MoodEntry {
  id: string;
  date: string;
  moodValue: number;
  moodEmoji: string;
  moodLabel: string;
  note: string;
  timestamp: string;
  pointsEarned: number;
}

interface MoodHistoryScreenProps {
  navigation: NavigationProp<any>;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 40;

const MoodHistoryScreen: React.FC<MoodHistoryScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState<'7' | '30' | '90'>('7');
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
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
    1: '#F44336', // Terrible
    2: '#FF9800', // Bad
    3: '#FFC107', // Okay
    4: '#8BC34A', // Good
    5: '#4CAF50', // Great
  };

  const moodLabels = {
    1: 'Terrible',
    2: 'Bad',
    3: 'Okay',
    4: 'Good',
    5: 'Great',
  };

  const moodEmojis = {
    1: '😢',
    2: '😔',
    3: '😐',
    4: '🙂',
    5: '😊',
  };

  useEffect(() => {
    loadMoodHistory();
  }, [selectedPeriod]);

  const loadMoodHistory = async () => {
    setIsLoading(true);
    try {
      // Generate mock mood history data
      const mockData: MoodEntry[] = [];
      const days = parseInt(selectedPeriod);
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Skip some days to simulate missing entries
        if (Math.random() > 0.2) {
          const moodValue = Math.floor(Math.random() * 5) + 1;
          const notes = [
            "Had a productive day at work",
            "Spent time with family",
            "Feeling a bit overwhelmed",
            "Great therapy session today",
            "Practiced mindfulness",
            "Challenging day but managed well",
            "Feeling grateful for small things",
            "Had some anxiety but used coping strategies",
          ];
          
          mockData.push({
            id: `mood-${i}`,
            date: date.toDateString(),
            moodValue,
            moodEmoji: moodEmojis[moodValue as keyof typeof moodEmojis],
            moodLabel: moodLabels[moodValue as keyof typeof moodLabels],
            note: notes[Math.floor(Math.random() * notes.length)],
            timestamp: date.toISOString(),
            pointsEarned: 500,
          });
        }
      }

      setMoodHistory(mockData);
      calculateStats(mockData);
      
    } catch (error) {
      toast.show({
        description: 'Failed to load mood history',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (data: MoodEntry[]) => {
    if (data.length === 0) {
      setStats({
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
      entry.moodValue > (best?.moodValue || 0) ? entry : best
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
      counts[entry.moodLabel] = (counts[entry.moodLabel] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
    
    const mostCommonMood = Object.entries(moodCounts).reduce((a, b) => 
      moodCounts[a[0]] > moodCounts[b[0]] ? a : b
    )[0];

    setStats({
      averageMood: Math.round(averageMood * 10) / 10,
      currentStreak: streak,
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
    if (moodHistory.length === 0) return null;

    const maxValue = 5;
    const chartHeight = 200;
    const pointRadius = 4;
    const lineWidth = 2;

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Mood Trend</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={[styles.chart, { width: Math.max(CHART_WIDTH, moodHistory.length * 40) }]}>
            {/* Y-axis labels */}
            <View style={styles.yAxisLabels}>
              {[5, 4, 3, 2, 1].map(value => (
                <View key={value} style={styles.yAxisLabel}>
                  <Text style={styles.yAxisText}>{moodEmojis[value as keyof typeof moodEmojis]}</Text>
                </View>
              ))}
            </View>

            {/* Chart area */}
            <View style={styles.chartArea}>
              {/* Grid lines */}
              {[1, 2, 3, 4, 5].map(value => (
                <View
                  key={value}
                  style={[
                    styles.gridLine,
                    { bottom: ((value - 1) / (maxValue - 1)) * (chartHeight - 40) }
                  ]}
                />
              ))}

              {/* Data points and lines */}
              {moodHistory.map((entry, index) => {
                const x = (index / (moodHistory.length - 1)) * (CHART_WIDTH - 80);
                const y = ((entry.moodValue - 1) / (maxValue - 1)) * (chartHeight - 40);

                return (
                  <View key={entry.id}>
                    {/* Line to next point */}
                    {index < moodHistory.length - 1 && (
                      <View
                        style={[
                          styles.chartLine,
                          {
                            left: x + pointRadius,
                            bottom: y + pointRadius,
                            width: (CHART_WIDTH - 80) / (moodHistory.length - 1) - pointRadius,
                            backgroundColor: moodColors[entry.moodValue as keyof typeof moodColors],
                          }
                        ]}
                      />
                    )}

                    {/* Data point */}
                    <TouchableOpacity
                      style={[
                        styles.chartPoint,
                        {
                          left: x,
                          bottom: y,
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

              {/* X-axis labels */}
              <View style={styles.xAxisLabels}>
                {moodHistory.map((entry, index) => (
                  <Text key={entry.id} style={styles.xAxisText}>
                    {formatDate(entry.date)}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  const StatsCards: React.FC = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.averageMood}</Text>
          <Text style={styles.statLabel}>Average Mood</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.currentStreak}</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalEntries}</Text>
          <Text style={styles.statLabel}>Total Entries</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.mostCommonMood}</Text>
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
        <Text style={styles.historyEmoji}>{item.moodEmoji}</Text>
        <View style={styles.historyMoodInfo}>
          <Text style={[styles.historyMoodLabel, { color: moodColors[item.moodValue as keyof typeof moodColors] }]}>
            {item.moodLabel}
          </Text>
          <Text style={styles.historyNote} numberOfLines={2}>
            {item.note}
          </Text>
        </View>
      </View>

      <View style={styles.historyPoints}>
        <Icon name="stars" type="material" color="#FFD700" size={12} />
        <Text style={styles.historyPointsText}>+{item.pointsEarned} pts</Text>
      </View>
    </TouchableOpacity>
  );

  const EmptyState: React.FC = () => (
    <View style={styles.emptyContainer}>
      <Icon name="mood" type="material" color={appColors.grey3} size={80} />
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
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mood History</Text>
        <TouchableOpacity 
          style={styles.todayButton}
          onPress={() => navigation.navigate('TodayMoodScreen')}
        >
          <Icon name="today" type="material" color={appColors.CardBackground} size={24} />
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
    paddingTop: parameters.headerHeightS,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  todayButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    padding: 20,
  },
  periodFilter: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  periodButton: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  selectedPeriodButton: {
    backgroundColor: appColors.AppBlue,
  },
  periodButtonText: {
    fontSize: 14,
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
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 20,
  },
  chart: {
    height: 200,
    flexDirection: 'row',
  },
  yAxisLabels: {
    width: 40,
    height: 160,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  yAxisLabel: {
    alignItems: 'center',
  },
  yAxisText: {
    fontSize: 16,
  },
  chartArea: {
    flex: 1,
    position: 'relative',
    marginLeft: 10,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: appColors.grey6,
  },
  chartPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: appColors.CardBackground,
  },
  chartLine: {
    position: 'absolute',
    height: 2,
  },
  xAxisLabels: {
    position: 'absolute',
    bottom: -30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  xAxisText: {
    fontSize: 10,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  statLabel: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginTop: 4,
    textAlign: 'center',
  },
  historySection: {
    backgroundColor: appColors.CardBackground,
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  historySectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    padding: 20,
    paddingBottom: 0,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey6,
  },
  historyDate: {
    width: 80,
    alignItems: 'center',
  },
  historyDateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  historyTimeText: {
    fontSize: 10,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginTop: 2,
  },
  historyMood: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  historyEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  historyMoodInfo: {
    flex: 1,
  },
  historyMoodLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  historyNote: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginTop: 2,
  },
  historyPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  historyPointsText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#E65100',
    fontFamily: appFonts.headerTextBold,
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  startTrackingButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  startTrackingText: {
    fontSize: 16,
    color: appColors.CardBackground,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
});

export default MoodHistoryScreen;
