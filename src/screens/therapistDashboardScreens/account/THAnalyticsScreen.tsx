/**
 * Therapist Performance Analytics Screen
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import { appColors, appFonts } from '../../../global/Styles';
import ISGenericHeader from '../../../components/ISGenericHeader';
import ISStatusBar from '../../../components/ISStatusBar';

const { width } = Dimensions.get('window');

const THAnalyticsScreen = ({ navigation }: any) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const periods = [
    { key: 'week' as const, label: 'Week' },
    { key: 'month' as const, label: 'Month' },
    { key: 'year' as const, label: 'Year' },
  ];

  const keyMetrics = [
    { label: 'Total Sessions', value: '156', change: '+12%', trend: 'up', icon: 'event', color: appColors.AppBlue },
    { label: 'Active Clients', value: '45', change: '+8%', trend: 'up', icon: 'people', color: appColors.AppGreen },
    { label: 'Avg Rating', value: '4.9', change: '+0.2', trend: 'up', icon: 'star', color: '#FFD700' },
    { label: 'Revenue', value: '$12.4K', change: '+15%', trend: 'up', icon: 'attach-money', color: '#4CAF50' },
  ];

  const sessionStats = [
    { day: 'Mon', sessions: 8, height: 80 },
    { day: 'Tue', sessions: 6, height: 60 },
    { day: 'Wed', sessions: 10, height: 100 },
    { day: 'Thu', sessions: 7, height: 70 },
    { day: 'Fri', sessions: 9, height: 90 },
    { day: 'Sat', sessions: 4, height: 40 },
    { day: 'Sun', sessions: 2, height: 20 },
  ];

  const clientRetention = [
    { label: 'New Clients', value: 12, percentage: 27, color: appColors.AppBlue },
    { label: 'Returning', value: 28, percentage: 62, color: appColors.AppGreen },
    { label: 'Inactive', value: 5, percentage: 11, color: appColors.grey4 },
  ];

  const popularTimes = [
    { time: '9:00 AM', bookings: 15, percentage: 85 },
    { time: '11:00 AM', bookings: 18, percentage: 100 },
    { time: '2:00 PM', bookings: 12, percentage: 67 },
    { time: '4:00 PM', bookings: 14, percentage: 78 },
    { time: '6:00 PM', bookings: 8, percentage: 44 },
  ];

  const sessionTypes = [
    { type: 'Individual', count: 98, percentage: 63, color: appColors.AppBlue },
    { type: 'Couples', count: 32, percentage: 21, color: '#9C27B0' },
    { type: 'Group', count: 26, percentage: 16, color: appColors.AppGreen },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />
      <ISGenericHeader title="Performance Analytics" navigation={navigation} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod === period.key && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period.key)}
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
          <Text style={styles.sectionTitle}>Sessions This Week</Text>
          <View style={styles.chartCard}>
            <View style={styles.chart}>
              {sessionStats.map((stat, index) => (
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
              <Text style={styles.chartFooterText}>Total: 46 sessions</Text>
            </View>
          </View>
        </View>

        {/* Client Retention */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client Retention</Text>
          <View style={styles.retentionCard}>
            {clientRetention.map((item, index) => (
              <View key={index} style={styles.retentionRow}>
                <View style={styles.retentionLeft}>
                  <View style={[styles.retentionDot, { backgroundColor: item.color }]} />
                  <Text style={styles.retentionLabel}>{item.label}</Text>
                </View>
                <View style={styles.retentionRight}>
                  <View style={styles.retentionBarContainer}>
                    <View
                      style={[
                        styles.retentionBar,
                        {
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.retentionValue}>{item.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Popular Times */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Most Popular Times</Text>
          <View style={styles.timesCard}>
            {popularTimes.map((time, index) => (
              <View key={index} style={styles.timeRow}>
                <Text style={styles.timeLabel}>{time.time}</Text>
                <View style={styles.timeBarContainer}>
                  <View
                    style={[
                      styles.timeBar,
                      {
                        width: `${time.percentage}%`,
                        backgroundColor: appColors.AppBlue,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.timeValue}>{time.bookings}</Text>
              </View>
            ))}
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
          </View>
        </View>

        {/* Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insights</Text>
          <View style={styles.insightCard}>
            <View style={styles.insightIcon}>
              <Icon type="material" name="lightbulb" size={24} color="#FFD700" />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Peak Performance</Text>
              <Text style={styles.insightText}>
                Your busiest day is Wednesday with an average of 10 sessions. Consider adjusting
                your availability on slower days.
              </Text>
            </View>
          </View>
          
          <View style={styles.insightCard}>
            <View style={styles.insightIcon}>
              <Icon type="material" name="trending-up" size={24} color={appColors.AppGreen} />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Growing Practice</Text>
              <Text style={styles.insightText}>
                Your client base has grown by 15% this month. Great work maintaining high
                satisfaction ratings!
              </Text>
            </View>
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
  retentionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  retentionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  retentionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: 100,
  },
  retentionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  retentionLabel: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
  },
  retentionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  retentionBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: appColors.grey6,
    borderRadius: 4,
    overflow: 'hidden',
  },
  retentionBar: {
    height: '100%',
    borderRadius: 4,
  },
  retentionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
    width: 30,
    textAlign: 'right',
  },
  timesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  timeLabel: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    width: 80,
  },
  timeBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: appColors.grey6,
    borderRadius: 4,
    overflow: 'hidden',
  },
  timeBar: {
    height: '100%',
    borderRadius: 4,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
    width: 30,
    textAlign: 'right',
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
  insightCard: {
    flexDirection: 'row',
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
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFD700' + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 6,
  },
  insightText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: 20,
  },
});

export default THAnalyticsScreen;
