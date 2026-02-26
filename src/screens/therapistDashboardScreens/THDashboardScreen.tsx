import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity, Image, RefreshControl, ActivityIndicator, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Badge } from '@rneui/themed';
import { useSelector, useDispatch } from 'react-redux';
import { appColors, appFonts } from '../../global/Styles';
import ISStatusBar from '../../components/ISStatusBar';
import { getFirstName } from '../../global/LHShortcuts';
import { appImages } from '../../global/Data';
import { getDashboardStats, getAvailability, getAnalyticsOverview, getRevenueAnalytics, getTherapistProfile, getEvents } from '../../api/therapist';
import { updateDashboardStats, updateAvailability, updateTherapistProfile, updateUpcomingEventsCount } from '../../features/therapist/dashboardSlice';
import { updateRevenueAnalytics } from '../../features/therapist/analyticsSlice';
import { useFocusEffect } from '@react-navigation/native';

const THDashboardScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const userDetails = useSelector((state: any) => state.userData.userDetails);
  const dashboardStats = useSelector((state: any) => state.therapistDashboard.stats);
  const upcomingEventsCount = useSelector((state: any) => state.therapistDashboard.upcomingEventsCount);
  const [loading, setLoading] = useState(!dashboardStats);
  const [refreshing, setRefreshing] = useState(false);

  // Responsive scaling factor (based on standard 375 width)
  const scale = width / 375;
  const normalizeSize = (size: number) => Math.round(size * scale);

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Normalize backend response to flat shape the UI expects
  const normalizeStats = useCallback((data: any) => ({
    todayAppointments: data?.todayAppointments ?? data?.appointments?.today ?? data?.sessionsToday ?? data?.appointment_count ?? 0,
    pendingRequests: data?.pendingRequests ?? data?.requests?.pending ?? data?.request_count ?? 0,
    activeGroups: data?.activeGroups ?? data?.groups?.active ?? data?.group_count ?? 0,
    unreadMessages: data?.unreadMessages ?? data?.messages?.unread ?? data?.unread_count ?? 0,
    totalClients: data?.totalClients ?? data?.clients?.total ?? data?.client_count ?? 0,
  }), []);

  const loadDashboardData = useCallback(async () => {
    const therapistId = userDetails?.userId;
    if (!therapistId) return;

    try {
      if (!dashboardStats) setLoading(true);
      const response = await getDashboardStats(therapistId);

      if (response?.data) {
        dispatch(updateDashboardStats(normalizeStats(response.data)));
      } else {
        dispatch(updateDashboardStats(normalizeStats({})));
      }

      // Kick off background loading for other screen states
      backgroundLoadData(therapistId);

    } catch (error: any) {
      console.error('Dashboard Stats Error:', error.message);
      if (!dashboardStats) dispatch(updateDashboardStats(normalizeStats({})));
    } finally {
      setLoading(false);
    }
  }, [userDetails?.userId, dashboardStats, normalizeStats, dispatch]);

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [loadDashboardData])
  );

  const backgroundLoadData = useCallback(async (therapistId: string) => {
    try {
      // 1. Load Availability Schedule
      getAvailability(therapistId).then(res => {
        if (res?.success) dispatch(updateAvailability(res.data));
      }).catch(err => console.error('BG Load Availability Error:', err));

      // 2. Load Revenue/Analytics for Pricing Screen
      Promise.all([
        getAnalyticsOverview(therapistId, 'month'),
        getRevenueAnalytics(therapistId, 'month')
      ]).then(([overviewRes, revenueRes]: [any, any]) => {
        const mergedSummary: any = {};
        if (overviewRes?.success) {
          mergedSummary.sessionCount = (overviewRes.data as any)?.sessions?.total || 0;
        }
        if (revenueRes?.success) {
          mergedSummary.total = (revenueRes.data as any)?.totalRevenue || 0;
          mergedSummary.currency = (revenueRes.data as any)?.currency || 'UGX';
          mergedSummary.pendingPayout = (revenueRes.data as any)?.pendingPayments || 0;
        }
        dispatch(updateRevenueAnalytics(mergedSummary));
      }).catch(err => console.error('BG Load Revenue Error:', err));

      // 3. Load Professional Profile
      getTherapistProfile(therapistId).then(res => {
        if (res?.success) dispatch(updateTherapistProfile(res.data));
      }).catch(err => console.error('BG Load Profile Error:', err));

      // 4. Load Upcoming Events Count
      getEvents(therapistId, { status: 'upcoming', limit: 1 }).then(res => {
        if (res?.success) {
          dispatch(updateUpcomingEventsCount((res.data as any)?.stats?.upcomingEvents || 0));
        }
      }).catch(err => console.error('BG Load Events Error:', err));

    } catch (error) {
      console.error('Background Load Error:', error);
    }
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  // Dashboard cards configuration with stats from API
  const dashboardCards = useMemo(() => [
    {
      id: 1,
      title: 'Appointments',
      subtitle: 'Today',
      icon: 'calendar-today',
      color: appColors.AppBlue,
      screen: 'THAppointments',
      count: String(dashboardStats?.todayAppointments || 0),
      badge: (dashboardStats?.todayAppointments || 0) > 0 ? 'today' : null,
    },
    {
      id: 2,
      title: 'Client Requests',
      subtitle: 'Pending',
      icon: 'person-add',
      color: '#FF9800',
      screen: 'THRequestsScreen',
      count: String(dashboardStats?.pendingRequests || 0),
      badge: (dashboardStats?.pendingRequests || 0) > 0 ? 'new' : null,
    },
    {
      id: 3,
      title: 'Support Groups',
      subtitle: 'Active',
      icon: 'people',
      color: '#9C27B0',
      screen: 'THGroups',
      count: String(dashboardStats?.activeGroups || 0),
      badge: null,
    },
    {
      id: 4,
      title: 'Messages',
      subtitle: 'Unread',
      icon: 'message',
      color: appColors.AppGreen,
      screen: 'THChats',
      count: String(dashboardStats?.unreadMessages || 0),
      badge: (dashboardStats?.unreadMessages || 0) > 0 ? 'new' : null,
    },
    {
      id: 5,
      title: 'Events',
      subtitle: 'Upcoming',
      icon: 'event-available',
      color: '#E91E63',
      screen: 'THEventsScreen',
      count: String(upcomingEventsCount || 0),
      badge: upcomingEventsCount > 0 ? 'live' : null,
    },
  ], [dashboardStats, upcomingEventsCount]);

  const DashboardCard = ({ item, isFullWidth }: { item: any, isFullWidth: boolean }) => (
    <TouchableOpacity
      style={[
        styles.card,
        isFullWidth && styles.fullWidthCard
      ]}
      onPress={() => navigation.navigate(item.screen)}
      activeOpacity={0.7}
    >
      <View style={[styles.cardLayout, isFullWidth && styles.fullWidthLayout]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
            <Icon
              type="material"
              name={item.icon}
              color={item.color}
              size={normalizeSize(22)}
            />
          </View>
          {item.badge && !isFullWidth && (
            <View style={[styles.badge, { backgroundColor: item.badge === 'new' ? '#F44336' : '#FF9800' }]}>
              <Text style={styles.badgeTextSmall}>{item.badge}</Text>
            </View>
          )}
        </View>

        <View style={[styles.cardContent, isFullWidth && styles.fullWidthContent]}>
          <View style={isFullWidth && styles.fullWidthCountContainer}>
            <Text style={[styles.cardCount, isFullWidth && styles.fullWidthCardCount]}>{item.count}</Text>
            {item.badge && isFullWidth && (
              <View style={[styles.badge, { backgroundColor: item.badge === 'new' ? '#F44336' : '#FF9800', marginLeft: 8 }]}>
                <Text style={styles.badgeTextSmall}>{item.badge}</Text>
              </View>
            )}
          </View>
          <View>
            <Text style={[styles.cardTitle, isFullWidth && styles.fullWidthCardTitle]}>{item.title}</Text>
            <Text style={[styles.cardSubtitle, isFullWidth && styles.fullWidthCardSubtitle]}>{item.subtitle}</Text>
          </View>
        </View>

        <View style={[styles.cardFooter, isFullWidth && styles.fullWidthCardFooter]}>
          <Icon
            type="material"
            name="arrow-forward"
            color={item.color}
            size={normalizeSize(16)}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />

      {/* Blue Header Section */}
      <View style={[styles.header, { paddingTop: normalizeSize(20), paddingBottom: normalizeSize(30) }]}>
        {/* Top row with logo and notification icon */}
        <View style={styles.headerTopRow}>
          <Image
            source={appImages.logoRecWhite}
            style={styles.logo}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('THNotificationsScreen')}
            activeOpacity={0.7}
          >
            <View style={styles.notificationIconContainer}>
              <Icon name="notifications" type="material" color={appColors.CardBackground} size={normalizeSize(26)} />
              {(dashboardStats?.unreadMessages || 0) > 0 && (
                <Badge
                  value={(dashboardStats?.unreadMessages || 0) > 99 ? '99+' : (dashboardStats?.unreadMessages || 0)}
                  status="error"
                  containerStyle={styles.badgeContainer}
                  textStyle={styles.badgeText}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={[styles.greeting, { fontSize: normalizeSize(24) }]}>
            Hello {getFirstName(userDetails?.firstName) || 'Therapist'} 👋
          </Text>
          <Text style={[styles.subtitle, { fontSize: normalizeSize(14) }]}>Here's what's happening with your practice</Text>
        </View>

        {/* Quick Stats Row */}
        <View style={styles.quickStatsRow}>
          <View style={styles.quickStatItem}>
            <Text style={[styles.quickStatNumber, { fontSize: normalizeSize(22) }]}>{dashboardStats?.todayAppointments || 0}</Text>
            <Text style={[styles.quickStatLabel, { fontSize: normalizeSize(10) }]}>Today</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <Text style={[styles.quickStatNumber, { fontSize: normalizeSize(22) }]}>{dashboardStats?.pendingRequests || 0}</Text>
            <Text style={[styles.quickStatLabel, { fontSize: normalizeSize(10) }]}>Pending</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <Text style={[styles.quickStatNumber, { fontSize: normalizeSize(22) }]}>{dashboardStats?.totalClients || 0}</Text>
            <Text style={[styles.quickStatLabel, { fontSize: normalizeSize(10) }]}>Clients</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[appColors.AppBlue]}
            tintColor={appColors.AppBlue}
          />
        }
      >
        {/* Dashboard Cards Grid */}
        <View style={styles.cardsGrid}>
          {dashboardCards.map((item, index) => {
            const isLast = index === dashboardCards.length - 1;
            const isFullWidth = isLast && (index + 1) % 2 !== 0;
            return <DashboardCard key={item.id} item={item} isFullWidth={isFullWidth} />;
          })}
        </View>
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
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: appColors.AppBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 140,
    height: 36,
  },
  iconButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  notificationIconContainer: {
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: -6,
    right: -6,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  greetingSection: {
    marginBottom: 20,
  },
  greeting: {
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  subtitle: {
    color: appColors.CardBackground,
    fontFamily: appFonts.bodyTextRegular,
    opacity: 0.9,
    lineHeight: 18,
  },
  quickStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  quickStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatNumber: {
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 1,
  },
  quickStatLabel: {
    color: appColors.CardBackground,
    fontFamily: appFonts.bodyTextRegular,
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  quickStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  card: {
    width: '48%',
    backgroundColor: appColors.CardBackground,
    borderRadius: 16,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    minHeight: 130,
  },
  fullWidthCard: {
    width: '100%',
    minHeight: 90,
  },
  cardLayout: {
    flex: 1,
  },
  fullWidthLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  badgeTextSmall: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: appFonts.bodyTextBold,
    textTransform: 'uppercase',
  },
  cardContent: {
    flex: 1,
    marginBottom: 4,
  },
  fullWidthContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 0,
  },
  fullWidthCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 50,
  },
  cardCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 2,
    lineHeight: 28,
  },
  fullWidthCardCount: {
    marginBottom: 0,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextSemiBold,
    marginBottom: 1,
  },
  fullWidthCardTitle: {
    fontSize: 15,
  },
  cardSubtitle: {
    fontSize: 10,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  fullWidthCardSubtitle: {
    fontSize: 11,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 4,
  },
  fullWidthCardFooter: {
    paddingTop: 0,
  },
});

export default THDashboardScreen;
