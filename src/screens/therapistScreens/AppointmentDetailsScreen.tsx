/**
 * Appointment Details Screen - Client view of appointment details
 * Minimal information view following client vs therapist philosophy
 */
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Avatar, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import ISStatusBar from '../../components/ISStatusBar';

interface AppointmentDetailsScreenProps {
  navigation: any;
  route: any;
}

const AppointmentDetailsScreen: React.FC<AppointmentDetailsScreenProps> = ({ navigation, route }) => {
  const toast = useToast();
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  // Get appointment data from route params
  const appointment = route?.params?.appointment || {
    id: '1',
    date: '09/04/2025',
    time: '2:00 PM',
    therapistName: 'Clara Odding',
    therapistType: 'Therapist',
    specialty: 'Anxiety & Depression',
    status: 'upcoming',
    image: require('../../assets/images/dummy-people/d-person2.png'),
    location: 'Nakawa - Kampala Uganda',
    sessionType: 'Individual Therapy',
    duration: '60 minutes',
    meetingLink: 'https://meet.innerspark.com/room/clara-123',
    paymentStatus: 'paid',
    amount: 'UGX 45,000',
    timezone: 'EAT (UTC+3)',
    cancellationPolicy: 'Free cancellation up to 24 hours before the appointment',
  };

  const formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      day: 'numeric',
      month: 'long',
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

  const handleJoinMeeting = async () => {
    if (appointment.meetingLink) {
      try {
        const supported = await Linking.canOpenURL(appointment.meetingLink);
        if (supported) {
          await Linking.openURL(appointment.meetingLink);
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
    }
  };

  const handleRequestCancellation = () => {
    setShowCancelModal(true);
  };

  const confirmCancellation = () => {
    setShowCancelModal(false);
    toast.show({
      description: `Cancellation request sent to ${appointment.therapistName}. You'll be notified once they respond.`,
      duration: 4000,
    });
    // Navigate back after a short delay
    setTimeout(() => {
      navigation.goBack();
    }, 1000);
  };

  const handleContactTherapist = () => {
    toast.show({
      description: 'Messaging feature coming soon',
      duration: 2000,
    });
  };

  const handlePayNow = () => {
    toast.show({
      description: 'Payment feature coming soon',
      duration: 2000,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appointment Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Badge */}
        <View style={styles.statusSection}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(appointment.status) + '20' }
          ]}>
            <Icon 
              name={appointment.status === 'upcoming' ? 'event' : appointment.status === 'completed' ? 'check-circle' : 'cancel'}
              type="material" 
              color={getStatusColor(appointment.status)} 
              size={16} 
            />
            <Text style={[
              styles.statusText,
              { color: getStatusColor(appointment.status) }
            ]}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Therapist Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Therapist</Text>
          <View style={styles.therapistInfo}>
            <Avatar
              source={appointment.image}
              size={70}
              rounded
              containerStyle={styles.therapistAvatar}
            />
            <View style={styles.therapistDetails}>
              <Text style={styles.therapistName}>{appointment.therapistName}</Text>
              <Text style={styles.therapistType}>{appointment.therapistType}</Text>
              {appointment.specialty && (
                <View style={styles.specialtyBadge}>
                  <Text style={styles.specialtyText}>{appointment.specialty}</Text>
                </View>
              )}
            </View>
          </View>
          
          {appointment.status === 'completed' && (
            <TouchableOpacity 
              style={styles.feedbackButton}
              onPress={() => navigation.navigate('PostSessionFeedbackScreen', { appointment })}
            >
              <Icon name="rate-review" type="material" color="#FF9800" size={18} />
              <Text style={styles.feedbackButtonText}>Give Feedback</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Appointment Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Appointment Information</Text>
          
          <View style={styles.detailRow}>
            <Icon name="event" type="material" color={appColors.grey2} size={20} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{formatDate(appointment.date)}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon name="schedule" type="material" color={appColors.grey2} size={20} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{appointment.time} ({appointment.timezone})</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon name="timer" type="material" color={appColors.grey2} size={20} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>{appointment.duration}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon name="psychology" type="material" color={appColors.grey2} size={20} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Session Type</Text>
              <Text style={styles.detailValue}>{appointment.sessionType}</Text>
            </View>
          </View>

          {appointment.location && (
            <View style={styles.detailRow}>
              <Icon name="location-on" type="material" color={appColors.grey2} size={20} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{appointment.location}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Payment Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment</Text>
          
          <View style={styles.paymentRow}>
            <Text style={styles.amountLabel}>Amount</Text>
            <Text style={styles.amountValue}>{appointment.amount}</Text>
          </View>

          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Status</Text>
            <View style={[
              styles.paymentStatusBadge,
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

          {appointment.paymentStatus === 'pending' && (
            <Button
              title="Pay Now"
              buttonStyle={styles.payNowButton}
              titleStyle={styles.payNowButtonText}
              onPress={handlePayNow}
              icon={
                <Icon name="payment" type="material" color={appColors.CardBackground} size={18} style={{ marginRight: 8 }} />
              }
            />
          )}
        </View>

        {/* Cancellation Policy Card */}
        {appointment.status === 'upcoming' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Cancellation Policy</Text>
            <View style={styles.policyContainer}>
              <Icon name="info" type="material" color={appColors.AppBlue} size={20} />
              <Text style={styles.policyText}>{appointment.cancellationPolicy}</Text>
            </View>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Action Buttons Footer */}
      {appointment.status === 'upcoming' && (
        <View style={styles.footer}>
          {appointment.meetingLink && (
            <Button
              title="Join Meeting"
              buttonStyle={styles.joinButton}
              titleStyle={styles.joinButtonText}
              onPress={handleJoinMeeting}
              icon={
                <Icon name="videocam" type="material" color={appColors.CardBackground} size={20} style={{ marginRight: 8 }} />
              }
            />
          )}
          
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleRequestCancellation}
          >
            <Icon name="event-busy" type="material" color="#F44336" size={18} />
            <Text style={styles.cancelButtonText}>Request Cancellation</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Cancellation Request Modal */}
      <Modal
        visible={showCancelModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Icon name="event-busy" type="material" color="#F44336" size={48} />
            <Text style={styles.modalTitle}>Request Cancellation</Text>
            <Text style={styles.modalMessage}>
              Send a cancellation request for your appointment with {appointment.therapistName}?
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
                onPress={confirmCancellation}
              >
                <Text style={styles.modalConfirmText}>Send Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statusSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  card: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: 15,
    fontFamily: appFonts.headerTextBold,
  },
  therapistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  therapistAvatar: {
    marginRight: 15,
  },
  therapistDetails: {
    flex: 1,
  },
  therapistName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: 5,
    fontFamily: appFonts.headerTextBold,
  },
  therapistType: {
    fontSize: 14,
    color: appColors.grey2,
    marginBottom: 8,
    fontFamily: appFonts.headerTextRegular,
  },
  specialtyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: appColors.AppBlue + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  specialtyText: {
    fontSize: 12,
    color: appColors.AppBlue,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.AppBlue + '10',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF980010',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  feedbackButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF9800',
    fontFamily: appFonts.headerTextBold,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  detailContent: {
    flex: 1,
    marginLeft: 15,
  },
  detailLabel: {
    fontSize: 13,
    color: appColors.grey3,
    marginBottom: 4,
    fontFamily: appFonts.headerTextRegular,
  },
  detailValue: {
    fontSize: 15,
    color: appColors.grey1,
    fontWeight: '500',
    fontFamily: appFonts.headerTextMedium,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
  },
  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  paymentLabel: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
  },
  paymentStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  paymentStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  payNowButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 10,
  },
  payNowButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  policyContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: appColors.AppBlue + '08',
    padding: 12,
    borderRadius: 10,
    gap: 10,
  },
  policyText: {
    flex: 1,
    fontSize: 13,
    color: appColors.grey1,
    lineHeight: 20,
    fontFamily: appFonts.headerTextRegular,
  },
  footer: {
    backgroundColor: appColors.CardBackground,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  joinButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 12,
    paddingVertical: 15,
    marginBottom: 12,
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4433610',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F44336',
    fontFamily: appFonts.headerTextBold,
  },
  bottomSpacing: {
    height: 20,
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
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginTop: 15,
    marginBottom: 10,
    fontFamily: appFonts.headerTextBold,
  },
  modalMessage: {
    fontSize: 16,
    color: appColors.grey2,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: appFonts.headerTextRegular,
  },
  modalSubMessage: {
    fontSize: 14,
    color: appColors.grey3,
    textAlign: 'center',
    marginBottom: 25,
    fontFamily: appFonts.headerTextRegular,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: appColors.grey6,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#F44336',
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
});

export default AppointmentDetailsScreen;
