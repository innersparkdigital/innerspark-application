/**
 * Appointments Screen - List of all upcoming/past appointments
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  RefreshControl,
  Modal,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Avatar, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import { useToast } from 'native-base';
import { useSelector } from 'react-redux';
import { NavigationProp } from '@react-navigation/native';
import PanicButtonComponent from '../../components/PanicButtonComponent';
import {
  selectAppointments,
  selectAppointmentsLoading,
  selectAppointmentsRefreshing,
} from '../../features/appointments/appointmentsSlice';
import { loadAppointments, refreshAppointments, cancelAppointmentById } from '../../utils/appointmentsManager';

interface Appointment {
  id: string;
  date: string;
  time: string;
  therapistName: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  isPaid: boolean;
  price: number;
  currency: string;
  therapistAvatar?: string;
  sessionType?: string;
  meetingLink?: string;
  duration?: number;
  location?: string;
  timezone?: string;
}

interface AppointmentsScreenProps {
  navigation: NavigationProp<any>;
}

const AppointmentsScreen: React.FC<AppointmentsScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past' | 'pending'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);

  // Get appointments and user details from Redux
  const appointments = useSelector(selectAppointments);
  const isLoading = useSelector(selectAppointmentsLoading);
  const isRefreshing = useSelector(selectAppointmentsRefreshing);
  const userDetails = useSelector((state: any) => state.userData.userDetails);
  const userId = userDetails?.userId || userDetails?.id;

  // Load appointments when tab changes or on mount or when coming into focus
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        refreshAppointments({ status: selectedTab === 'past' ? 'past' : selectedTab === 'pending' ? 'pending' : 'upcoming' });
      }
    }, [selectedTab, userId])
  );

  const filteredAppointments = appointments.filter((appointment: Appointment) => {
    let matchesTab = false;

    if (selectedTab === 'upcoming') {
      matchesTab = appointment.status === 'upcoming';
    } else if (selectedTab === 'past') {
      matchesTab = appointment.status === 'completed' || appointment.status === 'cancelled';
    } else if (selectedTab === 'pending') {
      matchesTab = !appointment.isPaid;
    }

    const matchesSearch = appointment.therapistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (appointment.sessionType && appointment.sessionType.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  console.log('🎯 AppointmentsScreen: Filtered count for tab', selectedTab, ':', filteredAppointments.length, 'out of', appointments.length);

  const handleRefresh = async () => {
    await refreshAppointments({ status: selectedTab });
    toast.show({
      description: 'Appointments refreshed',
      duration: 2000,
    });
  };

  const handleModifyAppointment = (appointment: Appointment) => {
    toast.show({
      description: `Modify appointment with ${appointment.therapistName}`,
      duration: 2000,
    });
  };

  const handleBookNewAppointment = () => {
    navigation.navigate('LHBottomTabs', { screen: 'TherapistsScreen' });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBD';

    // Check if format is YYYY-MM-DD
    if (dateString.includes('-')) {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      }
    }

    // Check if format is DD/MM/YYYY
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      }
    }

    // Fallback to raw string
    return dateString;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return '#4CAF50';
      case 'completed':
        return '#2196F3';
      case 'cancelled':
        return '#F44336';
      default:
        return appColors.grey2;
    }
  };

  const getPaymentStatusColor = (isPaid: boolean) => {
    return isPaid ? '#4CAF50' : '#FF9800';
  };

  const handleRequestCancellation = (appointment: Appointment) => {
    setAppointmentToCancel(appointment);
    setShowCancelModal(true);
  };

  const confirmRequestCancellation = async () => {
    if (appointmentToCancel) {
      const result = await cancelAppointmentById(appointmentToCancel.id, {
        reason: 'User requested cancellation',
        requestRefund: true,
      });

      if (result.success) {
        toast.show({
          description: `Appointment cancelled successfully. ${result.data?.refundStatus ? 'Refund processing.' : ''}`,
          duration: 4000,
        });
        // Reload appointments
        await loadAppointments({ status: selectedTab });
      } else {
        toast.show({
          description: result.error || 'Failed to cancel appointment',
          duration: 3000,
        });
      }
    }
    setShowCancelModal(false);
    setAppointmentToCancel(null);
  };

  const handleViewDetails = (appointment: Appointment) => {
    navigation.navigate('AppointmentDetailsScreen', { appointment });
  };

  const handlePayNow = (appointment: Appointment) => {
    // Transform appointment data to checkout format
    const checkoutData = {
      therapist: {
        id: appointment.id,
        name: appointment.therapistName,
        price: `${appointment.currency} ${Number(appointment.price).toLocaleString()}`,
        image: appointment.therapistAvatar ? { uri: appointment.therapistAvatar } : require('../../assets/images/avatar-placeholder.png'),
        specialty: appointment.sessionType || 'Individual Therapy',
        rating: 4.8,
        reviews: 120,
      },
      selectedSlot: {
        date: appointment.date,
        time: appointment.time,
      },
      // Flags for existing appointment payment
      isExistingAppointment: true,
      appointmentId: appointment.id,
      sessionType: appointment.sessionType || 'Individual Therapy',
      location: appointment.location || 'Virtual Session',
    };

    navigation.navigate('BookingCheckoutScreen', checkoutData);
  };

  const handleJoinMeeting = async (meetingLink: string) => {
    try {
      const supported = await Linking.canOpenURL(meetingLink);
      if (supported) {
        await Linking.openURL(meetingLink);
      } else {
        toast.show({
          description: 'Cannot open meeting link',
          duration: 3000,
        });
      }
    } catch (error) {
      toast.show({
        description: 'Error opening meeting link',
        duration: 3000,
      });
    }
  };

  const AppointmentCard: React.FC<{ appointment: Appointment }> = ({ appointment }) => (
    <View style={styles.appointmentCard}>
      <View style={styles.appointmentHeader}>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.appointmentDate}>{formatDate(appointment.date)}</Text>
          <View style={styles.timeRow}>
            <Text style={styles.appointmentTime}>{appointment.time}</Text>
            {appointment.timezone && (
              <Text style={styles.timezoneText}> • {appointment.timezone}</Text>
            )}
          </View>
        </View>

        <View style={styles.statusContainer}>
          {!appointment.isPaid && appointment.status === 'upcoming' && (
            <View style={[styles.paymentWarningBadge]}>
              <Icon name="warning" type="material" color="#FF9800" size={moderateScale(12)} />
              <Text style={styles.paymentWarningText}>PAYMENT PENDING</Text>
            </View>
          )}
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(appointment.status) + '20' }
          ]}>
            <Icon
              name={appointment.status === 'upcoming' ? 'event' : appointment.status === 'completed' ? 'check-circle' : 'cancel'}
              type="material"
              color={getStatusColor(appointment.status)}
              size={moderateScale(14)}
            />
            <Text style={[
              styles.statusText,
              { color: getStatusColor(appointment.status) }
            ]}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.appointmentBody}>
        <Avatar
          source={appointment.therapistAvatar ? { uri: appointment.therapistAvatar } : require('../../assets/images/avatar-placeholder.png')}
          size={scale(60)}
          rounded
          containerStyle={styles.therapistAvatar}
          avatarStyle={{ width: '100%', height: '100%', resizeMode: 'cover' }}
        />

        <View style={styles.appointmentInfo}>
          <Text style={styles.therapistName}>{appointment.therapistName}</Text>
          {appointment.sessionType && (
            <Text style={styles.therapistType}>
              {appointment.sessionType.charAt(0).toUpperCase() + appointment.sessionType.slice(1)}
            </Text>
          )}

          {appointment.location && (
            <View style={styles.locationContainer}>
              <Icon name="location-on" type="material" color={appColors.grey2} size={moderateScale(14)} />
              <Text style={styles.locationText}>{appointment.location}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Payment Status and Amount */}
      <View style={styles.paymentSection}>
        <View style={styles.paymentInfo}>
          <Text style={styles.amountText}>{appointment.currency} {Number(appointment.price).toLocaleString()}</Text>
          <View style={[
            styles.paymentStatusChip,
            { backgroundColor: getPaymentStatusColor(appointment.isPaid) + '20' }
          ]}>
            <Text style={[
              styles.paymentStatusText,
              { color: getPaymentStatusColor(appointment.isPaid) }
            ]}>
              {appointment.isPaid ? 'Paid' : 'Pending'}
            </Text>
          </View>
        </View>
      </View>

      {/* Meeting Link */}
      {appointment.meetingLink && appointment.status === 'upcoming' && (
        <View style={styles.meetingSection}>
          <TouchableOpacity
            style={styles.meetingButton}
            onPress={() => handleJoinMeeting(appointment.meetingLink!)}
          >
            <Icon name="videocam" type="material" color={appColors.CardBackground} size={moderateScale(18)} />
            <Text style={styles.meetingButtonText}>Join Meeting</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => handleViewDetails(appointment)}
        >
          <Icon name="info" type="material" color={appColors.AppBlue} size={moderateScale(18)} />
          <Text style={styles.detailsButtonText}>Details</Text>
        </TouchableOpacity>

        {appointment.status === 'upcoming' && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleRequestCancellation(appointment)}
          >
            <Icon name="event-busy" type="material" color="#F44336" size={moderateScale(18)} />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}

        {appointment.status === 'completed' && (
          <TouchableOpacity
            style={styles.feedbackButton}
            onPress={() => navigation.navigate('PostSessionFeedbackScreen', { appointment })}
          >
            <Icon name="rate-review" type="material" color="#FF9800" size={moderateScale(18)} />
            <Text style={styles.feedbackButtonText}>Give Feedback</Text>
          </TouchableOpacity>
        )}

        {!appointment.isPaid && appointment.status === 'upcoming' && (
          <TouchableOpacity
            style={styles.payButton}
            onPress={() => handlePayNow(appointment)}
          >
            <Icon name="payment" type="material" color="#4CAF50" size={moderateScale(18)} />
            <Text style={styles.payButtonText}>Pay Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={appColors.AppBlue} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={moderateScale(24)} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">My Appointments</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon
            name="search"
            type="material"
            color={appColors.grey3}
            size={moderateScale(20)}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search appointments..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={appColors.grey3}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'upcoming' && styles.activeTab
            ]}
            onPress={() => setSelectedTab('upcoming')}
          >
            <Text style={[
              styles.tabText,
              selectedTab === 'upcoming' && styles.activeTabText
            ]}>
              Upcoming
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'past' && styles.activeTab
            ]}
            onPress={() => setSelectedTab('past')}
          >
            <Text style={[
              styles.tabText,
              selectedTab === 'past' && styles.activeTabText
            ]}>
              Past
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'pending' && styles.activeTab
            ]}
            onPress={() => setSelectedTab('pending')}
          >
            <Text style={[
              styles.tabText,
              selectedTab === 'pending' && styles.activeTabText
            ]}>
              Pending
            </Text>
          </TouchableOpacity>
        </View>

        {/* Appointments List */}
        {isLoading && appointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon
              name="schedule"
              type="material"
              color={appColors.grey3}
              size={scale(60)}
            />
            <Text style={styles.emptyText}>Loading appointments...</Text>
            <Text style={styles.emptySubtext}>Please wait while we fetch your appointments</Text>
          </View>
        ) : (
          <FlatList
            data={filteredAppointments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <AppointmentCard appointment={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={[appColors.AppBlue]}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Icon
                  name="event-busy"
                  type="material"
                  color={appColors.grey3}
                  size={scale(60)}
                />
                <Text style={styles.emptyText}>
                  {selectedTab === 'upcoming'
                    ? 'No upcoming appointments'
                    : selectedTab === 'past'
                      ? 'No past appointments'
                      : 'No pending payments'}
                </Text>
                <Text style={styles.emptySubtext}>
                  {selectedTab === 'upcoming'
                    ? 'Book your first appointment to get started'
                    : selectedTab === 'past'
                      ? 'Your completed appointments will appear here'
                      : 'All your appointments are paid for'}
                </Text>
              </View>
            }
          />
        )}
      </View>

      {/* Book New Appointment Button */}
      <View style={styles.bookingFooter}>
        <Button
          title="Book a new appointment"
          buttonStyle={styles.bookButton}
          titleStyle={styles.bookButtonText}
          onPress={handleBookNewAppointment}
        />
      </View>

      {/* Cancel Appointment Modal */}
      <Modal
        visible={showCancelModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Request Cancellation</Text>
            <Text style={styles.modalMessage}>
              Send a cancellation request for your appointment with {appointmentToCancel?.therapistName}?
            </Text>
            <Text style={styles.modalSubMessage}>
              Your therapist will review and respond to your request. You'll be notified of their decision.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowCancelModal(false)}
              >
                <Text style={styles.modalCancelText}>Keep Appointment</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={confirmRequestCancellation}
              >
                <Text style={styles.modalConfirmText}>Send Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Panic Button */}
      <PanicButtonComponent
        position="bottom-right"
        size="medium"
        quickAction="modal"
      />
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
    paddingBottom: scale(20),
    paddingHorizontal: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
  },
  backButton: {
    padding: scale(8),
    borderRadius: scale(20),
    marginRight: scale(15),
  },
  headerTitle: {
    flex: 1,
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
    marginHorizontal: scale(12),
  },
  headerSpacer: {
    width: scale(40),
  },
  content: {
    flex: 1,
    padding: scale(20),
  },
  sectionTitle: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: scale(20),
    fontFamily: appFonts.bodyTextBold,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(25),
    paddingHorizontal: scale(15),
    marginBottom: scale(20),
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.05,
    shadowRadius: scale(1),
  },
  searchIcon: {
    marginRight: scale(10),
  },
  searchInput: {
    flex: 1,
    paddingVertical: scale(15),
    fontSize: moderateScale(16),
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(15),
    padding: scale(5),
    marginBottom: scale(20),
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.05,
    shadowRadius: scale(1),
  },
  tab: {
    flex: 1,
    paddingVertical: scale(12),
    alignItems: 'center',
    borderRadius: scale(10),
  },
  activeTab: {
    backgroundColor: appColors.AppBlue,
  },
  tabText: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextMedium,
  },
  activeTabText: {
    color: appColors.CardBackground,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: scale(20),
  },
  appointmentCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(12),
    padding: scale(16),
    marginBottom: scale(12),
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: appColors.grey6 + '40',
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: scale(12),
  },
  dateContainer: {
    flex: 1,
  },
  appointmentDate: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextBold,
    marginBottom: scale(2),
  },
  appointmentTime: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
  },
  modifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(15),
    backgroundColor: appColors.AppLightGray,
  },
  modifyText: {
    fontSize: moderateScale(14),
    color: appColors.AppBlue,
    marginLeft: scale(5),
    fontFamily: appFonts.bodyTextMedium,
  },
  appointmentBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  therapistAvatar: {
    marginRight: scale(12),
  },
  appointmentInfo: {
    flex: 1,
  },
  therapistName: {
    fontSize: moderateScale(15),
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: scale(4),
    fontFamily: appFonts.headerTextBold,
  },
  therapistType: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    marginBottom: scale(5),
    fontFamily: appFonts.bodyTextRegular,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(3),
  },
  locationText: {
    fontSize: moderateScale(13),
    color: appColors.grey2,
    marginLeft: scale(5),
    fontFamily: appFonts.bodyTextRegular,
  },
  sessionType: {
    fontSize: moderateScale(13),
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextMedium,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
    borderRadius: scale(12),
    gap: scale(4),
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(60),
  },
  emptyText: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.grey2,
    marginTop: scale(20),
    marginBottom: scale(10),
    fontFamily: appFonts.bodyTextBold,
  },
  emptySubtext: {
    fontSize: moderateScale(14),
    color: appColors.grey3,
    textAlign: 'center',
    fontFamily: appFonts.bodyTextRegular,
  },
  bookingFooter: {
    backgroundColor: appColors.CardBackground,
    padding: scale(20),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: scale(15),
    paddingVertical: scale(15),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  bookButtonText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  // New styles for enhanced appointment cards
  dateTimeContainer: {
    flex: 1,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timezoneText: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  statusText: {
    fontSize: moderateScale(11),
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  paymentSection: {
    paddingTop: scale(12),
    marginTop: scale(12),
    borderTopWidth: 1,
    borderTopColor: appColors.grey6 + '60',
  },
  paymentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  paymentStatusChip: {
    paddingHorizontal: scale(12),
    paddingVertical: scale(4),
    borderRadius: scale(12),
  },
  paymentStatusText: {
    fontSize: moderateScale(12),
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  meetingSection: {
    paddingTop: scale(12),
    marginTop: scale(12),
    borderTopWidth: 1,
    borderTopColor: appColors.grey6 + '60',
  },
  meetingButton: {
    backgroundColor: appColors.AppBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(10),
    paddingHorizontal: scale(15),
    borderRadius: scale(8),
  },
  meetingButtonText: {
    color: appColors.CardBackground,
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    marginLeft: scale(8),
    fontFamily: appFonts.headerTextBold,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(8),
    paddingTop: scale(12),
    marginTop: scale(12),
    borderTopWidth: 1,
    borderTopColor: appColors.grey6 + '60',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
    borderRadius: scale(6),
    backgroundColor: appColors.AppBlue + '10',
  },
  detailsButtonText: {
    color: appColors.AppBlue,
    fontSize: moderateScale(13),
    fontWeight: 'bold',
    marginLeft: scale(6),
    fontFamily: appFonts.headerTextBold,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
    borderRadius: scale(6),
    backgroundColor: '#F4433610',
  },
  cancelButtonText: {
    color: '#F44336',
    fontSize: moderateScale(13),
    fontWeight: 'bold',
    marginLeft: scale(6),
    fontFamily: appFonts.headerTextBold,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(8),
    paddingHorizontal: scale(16),
    borderRadius: scale(8),
    backgroundColor: '#4CAF50',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  payButtonText: {
    color: appColors.CardBackground,
    fontSize: moderateScale(13),
    fontWeight: 'bold',
    marginLeft: scale(6),
    fontFamily: appFonts.headerTextBold,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
    borderRadius: scale(6),
    backgroundColor: '#FF980010',
  },
  feedbackButtonText: {
    color: '#FF9800',
    fontSize: moderateScale(13),
    fontWeight: 'bold',
    marginLeft: scale(6),
    fontFamily: appFonts.headerTextBold,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: appColors.CardBackground,
    margin: scale(20),
    borderRadius: scale(15),
    padding: scale(25),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: scale(15),
    fontFamily: appFonts.headerTextBold,
  },
  modalMessage: {
    fontSize: moderateScale(16),
    color: appColors.grey2,
    textAlign: 'center',
    marginBottom: scale(10),
    fontFamily: appFonts.bodyTextRegular,
  },
  modalSubMessage: {
    fontSize: moderateScale(14),
    color: appColors.grey3,
    textAlign: 'center',
    marginBottom: scale(25),
    fontFamily: appFonts.bodyTextRegular,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: scale(12),
    paddingHorizontal: scale(20),
    borderRadius: scale(8),
    backgroundColor: appColors.grey6,
    marginRight: scale(10),
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: scale(12),
    paddingHorizontal: scale(20),
    borderRadius: scale(8),
    backgroundColor: '#F44336',
    marginLeft: scale(10),
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  paymentWarningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF980015',
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(8),
    marginBottom: scale(6),
    borderWidth: 1,
    borderColor: '#FF980030',
  },
  paymentWarningText: {
    fontSize: moderateScale(10),
    fontWeight: 'bold',
    color: '#FF9800',
    marginLeft: scale(4),
    fontFamily: appFonts.headerTextBold,
  },
});

export default AppointmentsScreen;
