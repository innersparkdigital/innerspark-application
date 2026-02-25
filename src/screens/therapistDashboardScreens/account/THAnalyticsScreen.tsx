/**
 * Therapist Performance Analytics Screen
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import { appColors, appFonts } from '../../../global/Styles';
import ISGenericHeader from '../../../components/ISGenericHeader';
import ISStatusBar from '../../../components/ISStatusBar';
import { getAnalyticsOverview, getSessionAnalytics, getRevenueAnalytics } from '../../../api/therapist';
import { useSelector, useDispatch } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import { updateAnalyticsOverview as updateAnalyticsAction, updateSessionAnalytics, updateRevenueAnalytics } from '../../../features/therapist/analyticsSlice';

const { width } = Dimensions.get('window');

const THAnalyticsScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const userDetails = useSelector((state: any) => state.userData.userDetails);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [stats, setStats] = useState<any>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
  }, [selectedPeriod]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const therapistId = userDetails?.userId;

      const [overviewRes, sessionRes, revenueRes] = await Promise.all([
        getAnalyticsOverview(therapistId, selectedPeriod).catch(e => ({ error: e })),
        getSessionAnalytics(therapistId, selectedPeriod).catch(e => ({ error: e })),
        getRevenueAnalytics(therapistId, selectedPeriod).catch(e => ({ error: e }))
      ]);

      if (overviewRes && !(overviewRes as any).error) {
        setStats((overviewRes as any).data);
        dispatch(updateAnalyticsAction((overviewRes as any).data));
      }
      if (sessionRes && !(sessionRes as any).error) {
        setSessionData((sessionRes as any).data);
        dispatch(updateSessionAnalytics((sessionRes as any).data));
      }
      if (revenueRes && !(revenueRes as any).error) {
        setRevenueData((revenueRes as any).data);
        dispatch(updateRevenueAnalytics((revenueRes as any).data));
      }

    } catch (error: any) {
      const errorMessage = error.backendMessage || error.message || 'Failed to load analytics';
      console.error('Analytics Error:', errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadStats();
  }, [selectedPeriod]);

  const periods = [
    { key: 'week' as const, label: 'Week' },
    { key: 'month' as const, label: 'Month' },
    { key: 'year' as const, label: 'Year' },
  ];

  const keyMetrics = [
    {
      label: 'Total Sessions',
      value: stats?.sessions?.total?.toString() || '0',
      change: stats?.sessions?.trend || '0%',
      trend: (stats?.sessions?.trend || '').startsWith('-') ? 'down' : 'up',
      icon: 'event',
      color: appColors.AppBlue
    },
    {
      label: 'Active Clients',
      value: stats?.clients?.active?.toString() || '0',
      change: stats?.clients?.trend || '0%',
      trend: (stats?.clients?.trend || '').startsWith('-') ? 'down' : 'up',
      icon: 'people',
      color: appColors.AppGreen
    },
    {
      label: 'Avg Rating',
      value: stats?.rating?.average?.toString() || '0.0',
      change: 'N/A', // Not provided by trend usually for rating
      trend: 'up',
      icon: 'star',
      color: '#FFD700'
    },
    {
      label: 'Revenue',
      value: revenueData?.totalRevenue ? `${revenueData.currency || 'UGX'} ${revenueData.totalRevenue.toLocaleString()}` : 'UGX 0',
      change: revenueData?.trend || '0%',
      trend: (revenueData?.trend || '').startsWith('-') ? 'down' : 'up',
      icon: 'attach-money',
      color: '#4CAF50'
    },
  ];

  const sessionStats = (sessionData?.sessionsByDay || [
    { day: 'Mon', count: 0 },
    { day: 'Tue', count: 0 },
    { day: 'Wed', count: 0 },
    { day: 'Thu', count: 0 },
    { day: 'Fri', count: 0 },
    { day: 'Sat', count: 0 },
    { day: 'Sun', count: 0 },
  ]).map((d: any) => {
    const maxCount = Math.max(...(sessionData?.sessionsByDay || [{ count: 0 }]).map((s: any) => s.count || 0), 5);
    return {
      day: d.day,
      sessions: d.count || 0,
      height: Math.max(((d.count || 0) / maxCount) * 120, 2), // Scale to chart height
    };
  });

  const popularTimes: any[] = []; // Hide for now as backend doesn't provide this yet

  const totalTypeSessions = sessionData?.totalSessions || 1; // Prevent div by zero
  const sessionTypes = [
    {
      type: 'Individual',
      count: sessionData?.sessionsByType?.individual || 0,
      percentage: Math.round(((sessionData?.sessionsByType?.individual || 0) / totalTypeSessions) * 100) || 0,
      color: appColors.AppBlue
    },
    {
      type: 'Couples',
      count: sessionData?.sessionsByType?.couple || 0,
      percentage: Math.round(((sessionData?.sessionsByType?.couple || 0) / totalTypeSessions) * 100) || 0,
      color: '#9C27B0'
    },
    {
      type: 'Group',
      count: sessionData?.sessionsByType?.group || 0,
      percentage: Math.round(((sessionData?.sessionsByType?.group || 0) / totalTypeSessions) * 100) || 0,
      color: appColors.AppGreen
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />
      <ISGenericHeader title="Performance Analytics" navigation={navigation} />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[appColors.AppBlue]} />
        }
      >
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod === period.key && styles.periodButtonActive,
              ]}
              onPress={() => {
                if (!loading) setSelectedPeriod(period.key);
              }}
              disabled={loading}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === period.key && styles.periodTextActive,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading && !refreshing && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={appColors.AppBlue} />
            <Text style={styles.loaderText}>Loading {selectedPeriod} stats...</Text>
          </View>
        )}

        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          {keyMetrics.map((metric, index) => (
            <View key={index} style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: metric.color + '20' }]}>
                <Icon type="material" name={metric.icon} size={24} color={metric.color} />
              </View>
              <Text style={styles.metricValue}>{metric.value}</Text>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <View style={styles.metricChange}>
                <Icon
                  type="material"
                  name={metric.trend === 'up' ? 'trending-up' : 'trending-down'}
                  size={14}
                  color={metric.trend === 'up' ? appColors.AppGreen : '#F44336'}
                />
                <Text
                  style={[
                    styles.metricChangeText,
                    { color: metric.trend === 'up' ? appColors.AppGreen : '#F44336' },
                  ]}
                >
                  {metric.change}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Sessions Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sessions This {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}</Text>
          <View style={styles.chartCard}>
            <View style={styles.chart}>
              {sessionStats.map((stat: any, index: number) => (
                <View key={index} style={styles.chartBar}>
                  <Text style={styles.chartValue}>{stat.sessions}</Text>
                  <View style={styles.barContainer}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: stat.height,
                          backgroundColor: appColors.AppBlue,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.chartLabel}>{stat.day}</Text>
                </View>
              ))}
            </View>
            <View style={styles.chartFooter}>
              <Text style={styles.chartFooterText}>Total: {stats?.sessions?.total || 0} sessions</Text>
            </View>
          </View>
        </View>

        {/* Session Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Types</Text>
          <View style={styles.typesCard}>
            {sessionTypes.map((type, index) => (
              <View key={index} style={styles.typeRow}>
                <View style={styles.typeLeft}>
                  <View style={[styles.typeDot, { backgroundColor: type.color }]} />
                  <Text style={styles.typeLabel}>{type.type}</Text>
                </View>
                <View style={styles.typeRight}>
                  <Text style={styles.typePercentage}>{type.percentage}%</Text>
                  <Text style={styles.typeCount}>({type.count})</Text>
                </View>
              </View>
            ))}
            {sessionTypes.every(t => t.count === 0) && (
              <Text style={styles.emptyText}>No sessions recorded for this period</Text>
            )}
          </View>
        </View>

        <View style={{ height: 40 }} />
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
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: appColors.AppBlue,
  },
  periodText: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextMedium,
    fontWeight: '600',
  },
  periodTextActive: {
    color: '#FFFFFF',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  metricCard: {
    width: (width - 44) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: 8,
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricChangeText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: appFonts.bodyTextMedium,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 12,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingBottom: 8,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  chartValue: {
    fontSize: 12,
    fontWeight: '600',
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextMedium,
  },
  barContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: 24,
    borderRadius: 4,
  },
  chartLabel: {
    fontSize: 11,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  chartFooter: {
    borderTopWidth: 1,
    borderTopColor: appColors.grey6,
    paddingTop: 12,
    marginTop: 8,
  },
  chartFooterText: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'center',
  },
  typesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  typeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey6,
  },
  typeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  typeLabel: {
    fontSize: 15,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
  },
  typeRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typePercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  typeCount: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  emptyText: {
    fontSize: 14,
    color: appColors.grey4,
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  },
  loaderContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
});

export default THAnalyticsScreen;
