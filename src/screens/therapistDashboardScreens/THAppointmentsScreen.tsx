import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Skeleton } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { appColors, appFonts } from '../../global/Styles';
import { moderateScale } from '../../global/Scaling';
import { appImages } from '../../global/Data';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';
import { getAppointments, startAppointmentSession } from '../../api/therapist';
import { useFocusEffect } from '@react-navigation/native';
import ISAlert, { useISAlert } from '../../components/alerts/ISAlert';



const THAppointmentsScreen = ({ navigation }: any) => {
  const userDetails = useSelector((state: any) => state.userData.userDetails);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('upcoming');
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const alert = useISAlert();

  useEffect(() => {
    loadAppointments(1, true);
  }, []);

  // Reload appointments whenever this tab comes into focus
  // (e.g. after scheduling, editing, or returning from details)
  useFocusEffect(
    useCallback(() => {
      loadAppointments(1, true);
    }, [])
  );

  const loadAppointments = async (pageNum = 1, isInitial = false) => {
    if (pageNum > 1 && (pageNum > totalPages || isMoreLoading)) return;

    try {
      if (pageNum === 1) {
        if (isInitial) setLoading(true);
      } else {
        setIsMoreLoading(true);
      }

      const therapistId = userDetails?.userId;
      
      const response = await getAppointments(therapistId, { 
        filter: 'all', 
        page: pageNum,
        limit: 50 
      });
      
      const resData = response as any;
      const appointmentsData = resData?.data?.appointments || resData?.data?.sessions || resData?.appointments || resData?.sessions || [];

      if (pageNum === 1) {
        setAppointments(appointmentsData);
      } else {
        setAppointments(prev => [...prev, ...appointmentsData]);
      }

      if (resData?.data?.pagination || resData?.pagination) {
        const pagination = resData?.data?.pagination || resData?.pagination;
        setPage(pagination.currentPage);
        setTotalPages(pagination.totalPages);
      }
    } catch (error: any) {
      const errorMessage = error.backendMessage || error.message || 'Failed to load appointments';
      console.error('Appointments Error:', errorMessage);
      if (pageNum === 1) setAppointments([]);
    } finally {
      setLoading(false);
      setIsMoreLoading(false);
    }
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    // No API call here to prevent shimmer
  };

  const handleLoadMore = () => {
    if (page < totalPages && !isMoreLoading && !loading) {
      loadAppointments(page + 1);
    }
  };

  const handleStartSession = async (appointment: any) => {
    try {
      setLoading(true);
      const therapistId = userDetails?.userId;
      const response: any = await startAppointmentSession(appointment.id || appointment.sessionId, therapistId);
      
      if (response && response.success !== false) {
        navigation.navigate('THChatConversationScreen', { 
          chat: {
            id: appointment.clientId || appointment.id,
            clientName: appointment.clientName,
            avatar: appointment.clientAvatar || appointment.avatar,
          }
        });
      }
    } catch (error: any) {
      const errorMessage = error.backendMessage || error.message || 'Failed to start session';
      console.error('Start Session Error:', errorMessage);
      alert.show({
        type: 'error',
        title: 'Session Error',
        message: errorMessage,
        confirmText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await loadAppointments(1, true);
    setRefreshing(false);
  };

  const getStats = () => {
    let todayCount = 0;
    let weekCount = 0;
    let monthCount = 0;

    if (!appointments || appointments.length === 0) {
      return { today: 0, week: 0, month: 0 };
    }

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    appointments.forEach((apt: any) => {
      let aptDateObj;
      if (apt.date === todayStr || apt.date?.includes('Today')) {
        todayCount++;
        aptDateObj = now;
      } else if (apt.date) {
        aptDateObj = new Date(apt.date);
      }

      if (aptDateObj) {
        // Only count valid dates inside ranges
        if (aptDateObj >= startOfWeek && aptDateObj <= endOfWeek) {
          weekCount++;
        }
        if (aptDateObj >= startOfMonth && aptDateObj <= endOfMonth) {
          monthCount++;
        }
      }
    });

    return { today: todayCount, week: weekCount, month: monthCount };
  };

  const filteredAppointments = useMemo(() => {
    // New tab order: Upcoming, Today, Pending, Completed, Cancelled
    
    if (selectedFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return appointments.filter((apt: any) => apt.date === today || apt.date?.includes('Today'));
    }
    
    if (selectedFilter === 'upcoming') {
      return appointments.filter((apt: any) => {
        const status = apt.status?.toLowerCase().trim();
        return status === 'upcoming' || status === 'scheduled';
      });
    }
    
    if (selectedFilter === 'pending') {
      return appointments.filter((apt: any) => apt.status?.toLowerCase().trim() === 'pending');
    }
    
    if (selectedFilter === 'completed') {
      return appointments.filter((apt: any) => apt.status?.toLowerCase().trim() === 'completed');
    }

    if (selectedFilter === 'cancelled') {
      return appointments.filter((apt: any) => apt.status?.toLowerCase().trim() === 'cancelled');
    }
    
    return appointments;
  }, [appointments, selectedFilter]);

  const currentStats = getStats();

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase().trim();
    switch (s) {
      case 'upcoming':
      case 'scheduled':
        return appColors.AppBlue;
      case 'pending':
        return '#FF9800'; // Orange for pending
      case 'completed':
        return appColors.AppGreen;
      case 'cancelled':
        return '#F44336'; // Red for cancelled
      default:
        return appColors.grey3;
    }
  };

  const StatCardSkeleton = () => (
    <View style={styles.statCard}>
      <Skeleton animation="pulse" width={40} height={32} style={{ borderRadius: 6, marginBottom: 4 }} />
      <Skeleton animation="pulse" width={60} height={12} style={{ borderRadius: 4 }} />
    </View>
  );

  const AppointmentCardSkeleton = () => (
    <View style={styles.appointmentCard}>
      <View style={styles.appointmentLeft}>
        <View style={styles.avatarContainer}>
          <Skeleton animation="pulse" width={50} height={50} style={{ borderRadius: 25 }} />
        </View>
        <View style={styles.appointmentInfo}>
          <Skeleton animation="pulse" width="60%" height={18} style={{ borderRadius: 4, marginBottom: 6 }} />
          <Skeleton animation="pulse" width="40%" height={14} style={{ borderRadius: 4, marginBottom: 8 }} />
          <Skeleton animation="pulse" width="80%" height={12} style={{ borderRadius: 4 }} />
        </View>
      </View>
      <View style={styles.appointmentRight}>
        <Skeleton animation="pulse" width={60} height={20} style={{ borderRadius: 10, marginBottom: 8 }} />
        <Skeleton animation="pulse" width={40} height={24} style={{ borderRadius: 8 }} />
      </View>
    </View>
  );

  const renderAppointmentItem = ({ item: appointment }: { item: any }) => (
    <TouchableOpacity
      key={appointment.id}
      style={styles.appointmentCard}
      onPress={() => navigation.navigate('THAppointmentDetailsScreen', { appointment })}
      activeOpacity={0.7}
    >
      <View style={styles.appointmentLeft}>
        <View style={styles.avatarContainer}>
          <Image
            source={
              (appointment?.clientAvatar || appointment?.avatar)?.startsWith('http') 
                ? { uri: appointment.clientAvatar || appointment.avatar } 
                : appImages.avatarPlaceholder
            }
            style={styles.avatarImage}
          />
        </View>
        <View style={styles.appointmentInfo}>
          <Text style={styles.clientName}>{appointment.clientName}</Text>
          <Text style={styles.appointmentType}>{appointment.type}</Text>
          <View style={styles.timeRow}>
            <Icon type="material" name="access-time" size={14} color={appColors.grey3} />
            <Text style={styles.timeText}>
              {appointment.date} • {appointment.time} • {appointment.duration}min
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.appointmentRight}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(appointment.status) }]}>
            {appointment.status}
          </Text>
        </View>
        {(appointment.status?.toLowerCase() === 'pending' || appointment.status?.toLowerCase() === 'upcoming') ? (
          <TouchableOpacity
            style={styles.startSessionButton}
            onPress={() => handleStartSession(appointment)}
          >
            <Text style={styles.startSessionButtonText}>Start</Text>
          </TouchableOpacity>
        ) : (
          <Icon type="material" name="chevron-right" size={24} color={appColors.grey3} />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <>
      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        {loading && !refreshing && appointments.length === 0 ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{currentStats.today}</Text>
              <Text style={styles.statLabel}>Today</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{currentStats.week}</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{currentStats.month}</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </View>
          </>
        )}
      </View>

      {/* Filter Tabs - Horizontal Scrollable with Snapping */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
          snapToInterval={moderateScale(100)} // Approximate width of a tab
          decelerationRate="fast"
          snapToAlignment="start"
        >
          {[
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'today', label: 'Today' },
            { id: 'pending', label: 'Pending' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' }
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.filterTab, 
                selectedFilter === tab.id && styles.filterTabActive
              ]}
              onPress={() => handleFilterChange(tab.id)}
            >
              <Text style={[
                styles.filterText, 
                selectedFilter === tab.id && styles.filterTextActive
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Text style={styles.sectionTitle}>
        {selectedFilter === 'completed' ? 'Session History' : 'Scheduled Appointments'}
      </Text>
    </>
  );

  const renderEmpty = () => {
    if (loading && !refreshing) {
      return [1, 2, 3, 4].map(i => <AppointmentCardSkeleton key={i} />);
    }

    return (
      <View style={styles.emptyStateContainer}>
        <Icon type="material" name="event-busy" size={64} color={appColors.grey5} />
        <Text style={styles.emptyStateTitle}>No Appointments</Text>
        <Text style={styles.emptyStateSubtitle}>
          {selectedFilter === 'today'
            ? "You don't have any appointments scheduled for today."
            : selectedFilter === 'upcoming'
              ? "You have no upcoming appointments scheduled."
              : selectedFilter === 'pending'
                ? "You don't have any pending requests at the moment."
                : selectedFilter === 'completed'
                  ? "You haven't completed any sessions yet."
                  : selectedFilter === 'cancelled'
                    ? "You don't have any cancelled appointments."
                    : "You don't have any appointments yet."}
        </Text>
        <TouchableOpacity
          style={styles.emptyStateButton}
          onPress={() => navigation.navigate('THScheduleAppointmentScreen')}
        >
          <Text style={styles.emptyStateButtonText}>Schedule Session</Text>
        </TouchableOpacity>

        {page < totalPages && (
          <TouchableOpacity
            style={[styles.emptyStateButton, { marginTop: 12, backgroundColor: 'transparent' }]}
            onPress={handleLoadMore}
          >
            <Text style={styles.emptyStateButtonText}>Load more from server...</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderFooter = () => {
    if (!isMoreLoading) return <View style={{ height: 40 }} />;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator color={appColors.AppBlue} size="small" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />

      <ISGenericHeader
        title="Appointments"
        navigation={navigation}
        hasRightIcon={true}
        rightIconName="add"
        rightIconOnPress={() => navigation.navigate('THScheduleAppointmentScreen')}
      />

      <FlatList
        data={filteredAppointments}
        renderItem={renderAppointmentItem}
        keyExtractor={(item) => item.id?.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[appColors.AppBlue]}
            tintColor={appColors.AppBlue}
          />
        }
      />
      <ISAlert ref={alert.ref} />
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
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  statLabel: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginTop: 4,
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    height: 50,
  },
  filterScrollContent: {
    paddingRight: 16,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    minWidth: moderateScale(100),
  },
  filterTabActive: {
    backgroundColor: appColors.AppBlue,
  },
  filterText: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextMedium,
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  appointmentsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 12,
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appointmentLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: appColors.AppBlue + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  appointmentInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  appointmentType: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: 6,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginLeft: 4,
  },
  appointmentRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: appFonts.bodyTextMedium,
    textTransform: 'capitalize',
  },
  emptyStateContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: appColors.AppBlue + '15',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: appColors.AppBlue,
  },
  emptyStateButtonText: {
    color: appColors.AppBlue,
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: appFonts.bodyTextBold,
  },
  startSessionButton: {
    backgroundColor: appColors.AppBlue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 4,
  },
  startSessionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: appFonts.bodyTextMedium,
    fontWeight: 'bold',
  },
});

export default THAppointmentsScreen;
