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
import Clipboard from '@react-native-clipboard/clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Avatar, Button } from '@rneui/base';
import { resolveSessionType, SESSION_TYPE_MAP } from '../../utils/appointmentUtils';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
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
    date: '09/04/2026',
    time: '2:00 PM',
    therapistName: 'Unknown',
    status: 'upcoming',
    isPaid: false,
    price: 0,
    currency: 'UGX',
    therapistAvatar: null,
    location: 'Virtual Session',
    sessionType: 'Individual Therapy',
    duration: '60 minutes',
    meetingLink: '',
    timezone: 'EAT (UTC+3)',
    cancellationPolicy: 'Free cancellation up to 24 hours before the appointment',
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBD';

    // Check if format is YYYY-MM-DD
    if (dateString.includes('-')) {
      const [year, month, day] = dateString.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
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
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }
    }

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
    // Determine the numeric ID if sessionType is a string name
    // (This is for the payload to BookingCheckoutScreen)
    let sessionId = 1;
    if (appointment.sessionType) {
      if (/^\d+$/.test(appointment.sessionType.toString())) {
        sessionId = parseInt(appointment.sessionType.toString());
      } else {
        // Find ID by name if possible (fallback to 1)
        const entries = Object.entries(SESSION_TYPE_MAP);
        const match = entries.find(([id, name]) => name.toLowerCase() === appointment.sessionType.toLowerCase());
        if (match) sessionId = parseInt(match[0]);
      }
    }

    // Transform appointment data to checkout format
    const checkoutData = {
      therapist: {
        id: appointment.therapistId || appointment.id,
        name: appointment.therapistName,
        price: `${appointment.currency} ${Number(appointment.price).toLocaleString()}`,
        image: appointment.therapistAvatar ? { uri: appointment.therapistAvatar } : require('../../assets/images/avatar-placeholder.png'),
        specialty: resolveSessionType(appointment.sessionType),
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
      sessionId: sessionId,
      sessionType: resolveSessionType(appointment.sessionType),
      location: appointment.location || 'Virtual Session',
    };

    navigation.navigate('BookingCheckoutScreen', checkoutData);
  };

  const handleCopyMeetingLink = (link: string) => {
    Clipboard.setString(link);
    toast.show({
      description: 'Meeting link copied to clipboard',
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
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={moderateScale(24)} />
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
              size={moderateScale(16)}
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
              source={appointment.therapistAvatar ? { uri: appointment.therapistAvatar } : require('../../assets/images/avatar-placeholder.png')}
              size={scale(70)}
              rounded
              containerStyle={styles.therapistAvatar}
            />
            <View style={styles.therapistDetails}>
              <Text style={styles.therapistName}>{appointment.therapistName}</Text>
              {appointment.sessionType && (
                <Text style={styles.therapistType}>
                  {resolveSessionType(appointment.sessionType)}
                </Text>
              )}
            </View>
          </View>

          {appointment.status === 'completed' && (
            <TouchableOpacity
              style={styles.feedbackButton}
              onPress={() => navigation.navigate('PostSessionFeedbackScreen', { appointment })}
            >
              <Icon name="rate-review" type="material" color="#FF9800" size={moderateScale(18)} />
              <Text style={styles.feedbackButtonText}>Give Feedback</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Appointment Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Appointment Information</Text>

          <View style={styles.detailRow}>
            <Icon name="event" type="material" color={appColors.grey2} size={moderateScale(20)} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{formatDate(appointment.date)}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon name="schedule" type="material" color={appColors.grey2} size={moderateScale(20)} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>
                {appointment.time}
                {appointment.timezone ? ` (${appointment.timezone})` : ''}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon name="timer" type="material" color={appColors.grey2} size={moderateScale(20)} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>{appointment.duration}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon name="psychology" type="material" color={appColors.grey2} size={moderateScale(20)} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Session Type</Text>
              <Text style={styles.detailValue}>{resolveSessionType(appointment.sessionType)}</Text>
            </View>
          </View>

          {appointment.location && (
            <View style={styles.detailRow}>
              <Icon name="location-on" type="material" color={appColors.grey2} size={moderateScale(20)} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{appointment.location}</Text>
              </View>
            </View>
          )}

          {appointment.meetingLink && appointment.status === 'upcoming' && (
            <View style={styles.detailRow}>
              <Icon name="videocam" type="material" color={appColors.AppBlue} size={moderateScale(20)} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Meeting Link</Text>
                <View style={styles.meetingLinkContainer}>
                  <Text style={[styles.detailValue, { color: appColors.AppBlue, flex: 1 }]} numberOfLines={1} ellipsizeMode="middle">
                    {appointment.meetingLink}
                  </Text>
                  <TouchableOpacity onPress={() => handleCopyMeetingLink(appointment.meetingLink)}>
                    <Icon name="content-copy" type="material" color={appColors.AppBlue} size={moderateScale(18)} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Payment Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment</Text>

          <View style={styles.paymentRow}>
            <Text style={styles.amountLabel}>Amount</Text>
            <Text style={styles.amountValue}>{appointment.currency} {Number(appointment.price).toLocaleString()}</Text>
          </View>

          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Status</Text>
            <View style={[
              styles.paymentStatusBadge,
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

          {!appointment.isPaid && (
            <Button
              title="Pay Now"
              buttonStyle={styles.payNowButton}
              titleStyle={styles.payNowButtonText}
              onPress={handlePayNow}
              icon={
                <Icon name="payment" type="material" color={appColors.CardBackground} size={moderateScale(18)} style={{ marginRight: scale(8) }} />
              }
            />
          )}
        </View>

        {/* Cancellation Policy Card */}
        {appointment.status === 'upcoming' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Cancellation Policy</Text>
            <View style={styles.policyContainer}>
              <Icon name="info" type="material" color={appColors.AppBlue} size={moderateScale(20)} />
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
                <Icon name="videocam" type="material" color={appColors.CardBackground} size={moderateScale(20)} style={{ marginRight: scale(8) }} />
              }
            />
          )}

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleRequestCancellation}
          >
            <Icon name="event-busy" type="material" color="#F44336" size={moderateScale(18)} />
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
            <Icon name="event-busy" type="material" color="#F44336" size={moderateScale(48)} />
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
  meetingLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    marginTop: scale(2),
  },
  header: {
    backgroundColor: appColors.AppBlue,
    paddingTop: parameters.headerHeightS,
    paddingBottom: scale(20),
    paddingHorizontal: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  headerSpacer: {
    width: scale(40),
  },
  content: {
    flex: 1,
    padding: scale(20),
  },
  statusSection: {
    alignItems: 'center',
    marginBottom: scale(20),
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    borderRadius: scale(20),
    gap: scale(6),
  },
  statusText: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  card: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(15),
    padding: scale(20),
    marginBottom: scale(15),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: scale(15),
    fontFamily: appFonts.headerTextBold,
  },
  therapistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(15),
  },
  therapistAvatar: {
    marginRight: scale(15),
  },
  therapistDetails: {
    flex: 1,
  },
  therapistName: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: scale(5),
    fontFamily: appFonts.headerTextBold,
  },
  therapistType: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    marginBottom: scale(8),
    fontFamily: appFonts.headerTextRegular,
  },
  specialtyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: appColors.AppBlue + '15',
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: scale(12),
  },
  specialtyText: {
    fontSize: moderateScale(12),
    color: appColors.AppBlue,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.AppBlue + '10',
    paddingVertical: scale(12),
    borderRadius: scale(10),
    gap: scale(8),
  },
  contactButtonText: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF980010',
    paddingVertical: scale(12),
    borderRadius: scale(10),
    gap: scale(8),
  },
  feedbackButtonText: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: '#FF9800',
    fontFamily: appFonts.headerTextBold,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: scale(15),
  },
  detailContent: {
    flex: 1,
    marginLeft: scale(15),
  },
  detailLabel: {
    fontSize: moderateScale(13),
    color: appColors.grey3,
    marginBottom: scale(4),
    fontFamily: appFonts.headerTextRegular,
  },
  detailValue: {
    fontSize: moderateScale(15),
    color: appColors.grey1,
    fontWeight: '500',
    fontFamily: appFonts.headerTextMedium,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  amountLabel: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
  },
  amountValue: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  paymentLabel: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
  },
  paymentStatusBadge: {
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(12),
  },
  paymentStatusText: {
    fontSize: moderateScale(12),
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  payNowButton: {
    backgroundColor: '#4CAF50',
    borderRadius: scale(10),
    paddingVertical: scale(12),
    marginTop: scale(10),
  },
  payNowButtonText: {
    fontSize: moderateScale(15),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  policyContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: appColors.AppBlue + '08',
    padding: scale(12),
    borderRadius: scale(10),
    gap: scale(10),
  },
  policyText: {
    flex: 1,
    fontSize: moderateScale(13),
    color: appColors.grey1,
    lineHeight: scale(20),
    fontFamily: appFonts.headerTextRegular,
  },
  footer: {
    backgroundColor: appColors.CardBackground,
    padding: scale(20),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  joinButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: scale(12),
    paddingVertical: scale(15),
    marginBottom: scale(12),
  },
  joinButtonText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4433610',
    paddingVertical: scale(12),
    borderRadius: scale(10),
    gap: scale(8),
  },
  cancelButtonText: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: '#F44336',
    fontFamily: appFonts.headerTextBold,
  },
  bottomSpacing: {
    height: scale(20),
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
    maxWidth: scale(400),
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: appColors.grey1,
    marginTop: scale(15),
    marginBottom: scale(10),
    fontFamily: appFonts.headerTextBold,
  },
  modalMessage: {
    fontSize: moderateScale(16),
    color: appColors.grey2,
    textAlign: 'center',
    marginBottom: scale(8),
    fontFamily: appFonts.headerTextRegular,
  },
  modalSubMessage: {
    fontSize: moderateScale(14),
    color: appColors.grey3,
    textAlign: 'center',
    marginBottom: scale(25),
    fontFamily: appFonts.headerTextRegular,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: scale(10),
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: scale(12),
    paddingHorizontal: scale(20),
    borderRadius: scale(10),
    backgroundColor: appColors.grey6,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: moderateScale(15),
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: scale(12),
    paddingHorizontal: scale(20),
    borderRadius: scale(10),
    backgroundColor: '#F44336',
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: moderateScale(15),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
});

export default AppointmentDetailsScreen;
