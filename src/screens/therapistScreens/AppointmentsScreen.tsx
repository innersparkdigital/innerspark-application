/**
 * Appointments Screen - List of all upcoming/past appointments
 */
import React, { useState, useEffect } from 'react';
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
import { useToast } from 'native-base';
import PanicButtonComponent from '../../components/PanicButtonComponent';

interface Appointment {
  id: string;
  date: string;
  time: string;
  therapistName: string;
  therapistType: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  image: any;
  location?: string;
  sessionType?: string;
  meetingLink?: string;
  paymentStatus?: 'paid' | 'pending' | 'failed';
  amount?: string;
  timezone?: string;
}

interface AppointmentsScreenProps {
  navigation: any;
}

const AppointmentsScreen: React.FC<AppointmentsScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past' | 'pending'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);

  // Mock appointments data
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      date: '09/04/2025',
      time: '2:00 PM',
      therapistName: 'Clara Odding',
      therapistType: 'Therapist',
      status: 'upcoming',
      image: require('../../assets/images/dummy-people/d-person2.png'),
      location: 'Nakawa - Kampala Uganda',
      sessionType: 'Individual Therapy',
      meetingLink: 'https://meet.innerspark.com/room/clara-123',
      paymentStatus: 'paid',
      amount: 'UGX 45,000',
      timezone: 'EAT (UTC+3)',
    },
    {
      id: '2',
      date: '21/04/2025',
      time: '10:00 AM',
      therapistName: 'Steven Pauliner',
      therapistType: 'Cardiologist',
      status: 'upcoming',
      image: require('../../assets/images/dummy-people/d-person1.png'),
      location: 'Kampala Medical Center',
      sessionType: 'Consultation',
      paymentStatus: 'pending',
      amount: 'UGX 60,000',
      timezone: 'EAT (UTC+3)',
    },
    {
      id: '3',
      date: '18/06/2025',
      time: '3:30 PM',
      therapistName: 'Noemi Shinte',
      therapistType: 'Dermatologist',
      status: 'upcoming',
      image: require('../../assets/images/dummy-people/d-person3.png'),
      location: 'Skin Care Clinic',
      sessionType: 'Follow-up',
      meetingLink: 'https://meet.innerspark.com/room/noemi-456',
      paymentStatus: 'paid',
      amount: 'UGX 35,000',
      timezone: 'EAT (UTC+3)',
    },
    {
      id: '4',
      date: '15/03/2025',
      time: '11:00 AM',
      therapistName: 'Sarah Johnson',
      therapistType: 'Therapist',
      status: 'completed',
      image: require('../../assets/images/dummy-people/d-person1.png'),
      location: 'Mental Health Center',
      sessionType: 'Individual Therapy',
      meetingLink: 'https://meet.innerspark.com/room/sarah-789',
      paymentStatus: 'paid',
      amount: 'UGX 50,000',
      timezone: 'EAT (UTC+3)',
    },
    {
      id: '5',
      date: '08/03/2025',
      time: '4:00 PM',
      therapistName: 'Michael Chen',
      therapistType: 'Therapist',
      status: 'completed',
      image: require('../../assets/images/dummy-people/d-person2.png'),
      location: 'Wellness Center',
      sessionType: 'Couples Therapy',
      paymentStatus: 'paid',
      amount: 'UGX 75,000',
      timezone: 'EAT (UTC+3)',
    },
    {
      id: '6',
      date: '28/02/2025',
      time: '1:00 PM',
      therapistName: 'Dr. Martin Pilier',
      therapistType: 'Therapist',
      status: 'cancelled',
      image: require('../../assets/images/dummy-people/d-person1.png'),
      location: 'Downtown Clinic',
      sessionType: 'Group Therapy',
      paymentStatus: 'failed',
      amount: 'UGX 30,000',
      timezone: 'EAT (UTC+3)',
    },
  ]);

  const filteredAppointments = appointments.filter(appointment => {
    let matchesTab = false;
    
    if (selectedTab === 'upcoming') {
      matchesTab = appointment.status === 'upcoming' && appointment.paymentStatus === 'paid';
    } else if (selectedTab === 'past') {
      matchesTab = appointment.status === 'completed' || appointment.status === 'cancelled';
    } else if (selectedTab === 'pending') {
      matchesTab = appointment.paymentStatus === 'pending';
    }
    
    const matchesSearch = appointment.therapistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.therapistType.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      toast.show({
        description: 'Appointments refreshed',
        duration: 2000,
      });
    }, 1500);
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
    const [day, month, year] = dateString.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-US', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'failed':
        return '#F44336';
      default:
        return appColors.grey2;
    }
  };

  const handleRequestCancellation = (appointment: Appointment) => {
    setAppointmentToCancel(appointment);
    setShowCancelModal(true);
  };

  const confirmRequestCancellation = () => {
    if (appointmentToCancel) {
      // In production, this would send a cancellation request to the therapist
      toast.show({
        description: `Cancellation request sent to ${appointmentToCancel.therapistName}. You'll be notified once they respond.`,
        duration: 4000,
      });
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
        price: appointment.amount || 'UGX 45,000',
        image: appointment.image,
        specialty: appointment.therapistType,
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
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(appointment.status) + '20' }
          ]}>
            <Icon 
              name={appointment.status === 'upcoming' ? 'event' : appointment.status === 'completed' ? 'check-circle' : 'cancel'}
              type="material" 
              color={getStatusColor(appointment.status)} 
              size={14} 
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
          source={appointment.image}
          size={60}
          rounded
          containerStyle={styles.therapistAvatar}
        />
        
        <View style={styles.appointmentInfo}>
          <Text style={styles.therapistName}>{appointment.therapistName}</Text>
          <Text style={styles.therapistType}>{appointment.therapistType}</Text>
          
          {appointment.sessionType && (
            <Text style={styles.sessionType}>{appointment.sessionType}</Text>
          )}

          {appointment.location && (
            <View style={styles.locationContainer}>
              <Icon name="location-on" type="material" color={appColors.grey2} size={14} />
              <Text style={styles.locationText}>{appointment.location}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Payment Status and Amount */}
      {appointment.paymentStatus && appointment.amount && (
        <View style={styles.paymentSection}>
          <View style={styles.paymentInfo}>
            <Text style={styles.amountText}>{appointment.amount}</Text>
            <View style={[
              styles.paymentStatusChip,
              { backgroundColor: getPaymentStatusColor(appointment.paymentStatus) + '20' }
            ]}>
              <Text style={[
                styles.paymentStatusText,
                { color: getPaymentStatusColor(appointment.paymentStatus) }
              ]}>
                {appointment.paymentStatus.charAt(0).toUpperCase() + appointment.paymentStatus.slice(1)}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Meeting Link */}
      {appointment.meetingLink && appointment.status === 'upcoming' && (
        <View style={styles.meetingSection}>
          <TouchableOpacity 
            style={styles.meetingButton}
            onPress={() => handleJoinMeeting(appointment.meetingLink!)}
          >
            <Icon name="videocam" type="material" color={appColors.CardBackground} size={18} />
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
          <Icon name="info" type="material" color={appColors.AppBlue} size={18} />
          <Text style={styles.detailsButtonText}>Details</Text>
        </TouchableOpacity>

        {appointment.status === 'upcoming' && (
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => handleRequestCancellation(appointment)}
          >
            <Icon name="event-busy" type="material" color="#F44336" size={18} />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
        
        {appointment.status === 'completed' && (
          <TouchableOpacity 
            style={styles.feedbackButton}
            onPress={() => navigation.navigate('PostSessionFeedbackScreen', { appointment })}
          >
            <Icon name="rate-review" type="material" color="#FF9800" size={18} />
            <Text style={styles.feedbackButtonText}>Give Feedback</Text>
          </TouchableOpacity>
        )}
        
        {appointment.paymentStatus === 'pending' && (
          <TouchableOpacity 
            style={styles.payButton}
            onPress={() => handlePayNow(appointment)}
          >
            <Icon name="payment" type="material" color="#4CAF50" size={18} />
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
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={24} />
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
            size={20}
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
                size={60}
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
    paddingTop: parameters.headerHeightS,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    marginRight: 15,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
    marginHorizontal: 12,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: 20,
    fontFamily: appFonts.appTextBold,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.CardBackground,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.appTextRegular,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 5,
    marginBottom: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: appColors.AppBlue,
  },
  tabText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.appTextMedium,
  },
  activeTabText: {
    color: appColors.CardBackground,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  appointmentCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    marginBottom: 12,
  },
  dateContainer: {
    flex: 1,
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.appTextBold,
    marginBottom: 2,
  },
  appointmentTime: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.appTextRegular,
  },
  modifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: appColors.AppLightGray,
  },
  modifyText: {
    fontSize: 14,
    color: appColors.AppBlue,
    marginLeft: 5,
    fontFamily: appFonts.appTextMedium,
  },
  appointmentBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  therapistAvatar: {
    marginRight: 12,
  },
  appointmentInfo: {
    flex: 1,
  },
  therapistName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: 4,
    fontFamily: appFonts.headerTextBold,
  },
  therapistType: {
    fontSize: 14,
    color: appColors.grey2,
    marginBottom: 5,
    fontFamily: appFonts.appTextRegular,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  locationText: {
    fontSize: 13,
    color: appColors.grey2,
    marginLeft: 5,
    fontFamily: appFonts.appTextRegular,
  },
  sessionType: {
    fontSize: 13,
    color: appColors.AppBlue,
    fontFamily: appFonts.appTextMedium,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey2,
    marginTop: 20,
    marginBottom: 10,
    fontFamily: appFonts.appTextBold,
  },
  emptySubtext: {
    fontSize: 14,
    color: appColors.grey3,
    textAlign: 'center',
    fontFamily: appFonts.appTextRegular,
  },
  bookingFooter: {
    backgroundColor: appColors.CardBackground,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 15,
    paddingVertical: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  bookButtonText: {
    fontSize: 16,
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
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  paymentSection: {
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: appColors.grey6 + '60',
  },
  paymentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  paymentStatusChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paymentStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  meetingSection: {
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: appColors.grey6 + '60',
  },
  meetingButton: {
    backgroundColor: appColors.AppBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  meetingButtonText: {
    color: appColors.CardBackground,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
    fontFamily: appFonts.headerTextBold,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: appColors.grey6 + '60',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: appColors.AppBlue + '10',
  },
  detailsButtonText: {
    color: appColors.AppBlue,
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 6,
    fontFamily: appFonts.headerTextBold,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#F4433610',
  },
  cancelButtonText: {
    color: '#F44336',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 6,
    fontFamily: appFonts.headerTextBold,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF5010',
  },
  payButtonText: {
    color: '#4CAF50',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 6,
    fontFamily: appFonts.headerTextBold,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#FF980010',
  },
  feedbackButtonText: {
    color: '#FF9800',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 6,
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
    margin: 20,
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: 15,
    fontFamily: appFonts.headerTextBold,
  },
  modalMessage: {
    fontSize: 16,
    color: appColors.grey2,
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: appFonts.regularText,
  },
  modalSubMessage: {
    fontSize: 14,
    color: appColors.grey3,
    textAlign: 'center',
    marginBottom: 25,
    fontFamily: appFonts.regularText,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: appColors.grey6,
    marginRight: 10,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#F44336',
    marginLeft: 10,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
});

export default AppointmentsScreen;
