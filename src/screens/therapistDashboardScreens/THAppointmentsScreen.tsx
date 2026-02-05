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
      const therapistId = userDetails?.id || '52863268761';

      const response = await getAppointments(therapistId);

      if (response?.data?.appointments) {
        setAppointments(response.data.appointments);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error('Failed to load appointments:', error);
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

  const filteredAppointments = getFilteredAppointments();

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
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>96</Text>
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

          {filteredAppointments.map((appointment: any) => (
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
          ))}
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
});

export default THAppointmentsScreen;
