import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { appColors, appFonts } from '../../global/Styles';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';
import { getAppointments } from '../../api/therapist';



const THAppointmentsScreen = ({ navigation }: any) => {
  const userDetails = useSelector((state: any) => state.userData.userDetails);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const therapistId = userDetails?.userId || '52863268761';

      const response = await getAppointments(therapistId);
      const resData = response?.data as any;

      if (resData?.appointments) {
        setAppointments(resData.appointments);
      } else {
        setAppointments([]);
      }
    } catch (error: any) {
      const errorMessage = error.backendMessage || error.message || 'Failed to load appointments';
      console.error('Appointments Error:', errorMessage);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAppointments();
    setRefreshing(false);
  };

  const getFilteredAppointments = () => {
    if (selectedFilter === 'all') return appointments;
    if (selectedFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return appointments.filter((apt: any) => apt.date === today || apt.date?.includes('Today'));
    }
    if (selectedFilter === 'upcoming') {
      return appointments.filter((apt: any) =>
        apt.status?.toLowerCase() === 'upcoming' ||
        apt.status?.toLowerCase() === 'scheduled'
      );
    }
    return appointments;
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

  const filteredAppointments = getFilteredAppointments();
  const currentStats = getStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return appColors.AppGreen;
      case 'scheduled':
        return appColors.AppBlue;
      default:
        return appColors.grey3;
    }
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

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[appColors.AppBlue]}
            tintColor={appColors.AppBlue}
          />
        }
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
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
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterTab, selectedFilter === 'all' && styles.filterTabActive]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text style={[styles.filterText, selectedFilter === 'all' && styles.filterTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, selectedFilter === 'today' && styles.filterTabActive]}
            onPress={() => setSelectedFilter('today')}
          >
            <Text style={[styles.filterText, selectedFilter === 'today' && styles.filterTextActive]}>
              Today
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, selectedFilter === 'upcoming' && styles.filterTabActive]}
            onPress={() => setSelectedFilter('upcoming')}
          >
            <Text style={[styles.filterText, selectedFilter === 'upcoming' && styles.filterTextActive]}>
              Upcoming
            </Text>
          </TouchableOpacity>
        </View>

        {/* Appointments List */}
        <View style={styles.appointmentsSection}>
          <Text style={styles.sectionTitle}>Scheduled Appointments</Text>

          {filteredAppointments.length === 0 && !loading ? (
            <View style={styles.emptyStateContainer}>
              <Icon type="material" name="event-busy" size={64} color={appColors.grey5} />
              <Text style={styles.emptyStateTitle}>No Appointments</Text>
              <Text style={styles.emptyStateSubtitle}>
                {selectedFilter === 'today'
                  ? "You don't have any appointments scheduled for today."
                  : selectedFilter === 'upcoming'
                    ? "You have no upcoming appointments scheduled."
                    : "You don't have any appointments yet."}
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => navigation.navigate('THScheduleAppointmentScreen')}
              >
                <Text style={styles.emptyStateButtonText}>Schedule Session</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredAppointments.map((appointment: any) => (
              <TouchableOpacity
                key={appointment.id}
                style={styles.appointmentCard}
                onPress={() => navigation.navigate('THAppointmentDetailsScreen', { appointment })}
                activeOpacity={0.7}
              >
                <View style={styles.appointmentLeft}>
                  <View style={styles.avatarContainer}>
                    <Text style={styles.avatarEmoji}>{appointment.avatar}</Text>
                  </View>
                  <View style={styles.appointmentInfo}>
                    <Text style={styles.clientName}>{appointment.clientName}</Text>
                    <Text style={styles.appointmentType}>{appointment.type}</Text>
                    <View style={styles.timeRow}>
                      <Icon type="material" name="access-time" size={14} color={appColors.grey3} />
                      <Text style={styles.timeText}>
                        {appointment.date} • {appointment.time} • {appointment.duration}
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
                  <Icon type="material" name="chevron-right" size={24} color={appColors.grey3} />
                </View>
              </TouchableOpacity>
            ))
          )}
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
    fontSize: 28,
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
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
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
  avatarEmoji: {
    fontSize: 24,
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
});

export default THAppointmentsScreen;
