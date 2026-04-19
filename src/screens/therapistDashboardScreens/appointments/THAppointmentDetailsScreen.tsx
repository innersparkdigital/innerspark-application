import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Skeleton } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { appColors, appFonts } from '../../../global/Styles';
import { moderateScale } from '../../../global/Scaling';
import { appImages } from '../../../global/Data';
import ISGenericHeader from '../../../components/ISGenericHeader';
import ISStatusBar from '../../../components/ISStatusBar';
import ISConfirmationModal from '../../../components/ISConfirmationModal';
import ISAlert, { useISAlert } from '../../../components/alerts/ISAlert';
import { startAppointmentSession, cancelAppointment, getAppointmentById } from '../../../api/therapist/appointments';
import { getClientBioData } from '../../../api/therapist/clients';

const THAppointmentDetailsScreen = ({ navigation, route }: any) => {
  const { appointment } = route.params || {};
  const userDetails = useSelector((state: any) => state.userData.userDetails);
  const [showActions, setShowActions] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [fullDetails, setFullDetails] = useState<any>(null);
  const alert = useISAlert();

  useEffect(() => {
    loadDetails();
  }, []);

  const loadDetails = async () => {
    try {
      setLoading(true);
      const therapistId = userDetails?.userId;
      const appointmentId = appointment.id || appointment.sessionId;

      if (appointmentId) {
        const response = await getAppointmentById(appointmentId, therapistId);
        if (response?.success && response.data) {
          const mainData = response.data;
          setFullDetails(mainData);
          
          // Supplement with bio data if clientId exists
          const clientId = mainData.client?.id || mainData.appointment?.clientId || appointment.clientId;
          if (clientId) {
            try {
              const bioResponse = await getClientBioData(clientId);
              if (bioResponse?.success && bioResponse.data) {
                setFullDetails((prev: any) => ({
                  ...prev,
                  bio: bioResponse.data
                }));
              }
            } catch (bioError) {
              console.error('Bio Data Fetch Error:', bioError);
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Fetch Details Error:', error);
      // Fallback is still using the passed appointment from route.params
    } finally {
      setLoading(false);
    }
  };

  const displayAppointment = fullDetails?.appointment || appointment;
  const displayClient = {
    ...fullDetails?.client,
    name: fullDetails?.bio ? `${fullDetails.bio.firstName} ${fullDetails.bio.lastName}` : (fullDetails?.client?.name || appointment.clientName),
    avatar: fullDetails?.bio?.profileImage || fullDetails?.client?.avatar || appointment.clientAvatar || appointment.avatar,
    email: fullDetails?.bio?.email || fullDetails?.client?.email || appointment.email,
    phone: fullDetails?.bio?.phoneNumber || fullDetails?.client?.phone || appointment.phone,
    id: fullDetails?.client?.id || appointment.clientId
  };

  const getBannerProps = () => {
    const status = displayAppointment?.status?.toLowerCase() || '';
    switch (status) {
      case 'completed':
        return { color: appColors.AppLightGreen || '#4CAF50', icon: 'check-circle', text: 'Completed Session' };
      case 'cancelled':
        return { color: '#F44336', icon: 'cancel', text: 'Cancelled Appointment' };
      case 'pending':
        return { color: '#FF9800', icon: 'schedule', text: 'Pending Request' };
      case 'in-progress':
      case 'ongoing':
      case 'started':
        return { color: appColors.AppGreen, icon: 'play-circle-outline', text: 'Session In-Progress' };
      case 'upcoming':
      case 'scheduled':
      default:
        return { color: appColors.AppBlue, icon: 'event', text: 'Scheduled Appointment' };
    }
  };

  const bannerProps = getBannerProps();

  const handleStartSession = () => {
    setShowStartModal(true);
  };

  const handleReschedule = () => {
    // Navigate to schedule screen with appointment data for rescheduling
    const clientData = {
      id: displayClient.id,
      name: displayClient.name,
      avatar: displayClient.avatar,
    };
    navigation.navigate('THScheduleAppointmentScreen', {
      client: clientData,
      isReschedule: true,
      existingAppointment: displayAppointment
    });
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleViewClientProfile = () => {
    // Navigate to client profile with client data
    const clientData = {
      id: displayClient.id,
      name: displayClient.name,
      avatar: displayClient.avatar,
    };
    navigation.navigate('THClientProfileScreen', { client: clientData });
  };

  const handleSendMessage = () => {
    // Navigate to chat with client
    navigation.navigate('THChats');
  };

  const handleAddNote = () => {
    const clientData = {
      id: appointment.clientId,
      name: appointment.clientName,
      avatar: appointment.avatar,
    };
    navigation.navigate('THAddClientNoteScreen', { client: clientData });
  };

  const handleViewNotes = () => {
    const clientData = {
      id: displayClient.id || displayAppointment.clientId,
      name: displayClient.name,
      avatar: displayClient.avatar,
    };
    navigation.navigate('THClientProfileScreen', { client: clientData, initialTab: 'notes' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />
      <ISGenericHeader title="Appointment Details" navigation={navigation} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: bannerProps.color }]}>
          <Icon type="material" name={bannerProps.icon} color="#FFFFFF" size={24} />
          <Text style={styles.statusBannerText}>{bannerProps.text}</Text>
        </View>

        {/* Client Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Client Information</Text>
            <TouchableOpacity onPress={handleViewClientProfile}>
              <Text style={styles.viewProfileLink}>View Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.clientInfo}>
            <View style={styles.avatarLarge}>
              {loading && !fullDetails ? (
                <Skeleton animation="pulse" width={80} height={80} style={{ borderRadius: 40 }} />
              ) : (
                <Image
                  source={
                    (displayClient?.avatar)?.startsWith('http') 
                      ? { uri: displayClient.avatar } 
                      : appImages.avatarPlaceholder
                  }
                  style={styles.avatarLargeImage}
                />
              )}
            </View>
            <View style={styles.clientDetails}>
              {loading && !fullDetails ? (
                <>
                  <Skeleton animation="pulse" width={150} height={24} style={{ borderRadius: 4, marginBottom: 8 }} />
                  <Skeleton animation="pulse" width={100} height={14} style={{ borderRadius: 4, marginBottom: 8 }} />
                  <View style={styles.clientStats}>
                    <Skeleton animation="pulse" width={60} height={14} style={{ borderRadius: 4 }} />
                    <Skeleton animation="pulse" width={60} height={14} style={{ borderRadius: 4 }} />
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.clientName}>{displayClient?.name}</Text>
                  <Text style={styles.clientMeta}>{displayClient?.email || 'First-time client'}</Text>
                  <View style={styles.clientStats}>
                    <View style={styles.statItem}>
                      <Icon type="material" name="event" size={16} color={appColors.grey3} />
                      <Text style={styles.statText}>{displayClient?.totalSessions || 0} sessions</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Icon type="material" name="star" size={16} color="#FFD700" />
                      <Text style={styles.statText}>{displayClient?.rating || '0.0'} rating</Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Appointment Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Appointment Details</Text>

          <View style={styles.detailRow}>
            <Icon type="material" name="calendar-today" size={20} color={appColors.AppBlue} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date & Time</Text>
              {loading && !fullDetails ? (
                <Skeleton animation="pulse" width={180} height={18} style={{ borderRadius: 4 }} />
              ) : (
                <Text style={styles.detailValue}>{displayAppointment?.date} at {displayAppointment?.time}</Text>
              )}
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon type="material" name="access-time" size={20} color={appColors.AppBlue} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Duration</Text>
              {loading && !fullDetails ? (
                <Skeleton animation="pulse" width={100} height={18} style={{ borderRadius: 4 }} />
              ) : (
                <Text style={styles.detailValue}>{displayAppointment?.duration} mins</Text>
              )}
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon type="material" name="category" size={20} color={appColors.AppBlue} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Session Type</Text>
              {loading && !fullDetails ? (
                <Skeleton animation="pulse" width={120} height={18} style={{ borderRadius: 4 }} />
              ) : (
                <Text style={styles.detailValue}>{displayAppointment?.type}</Text>
              )}
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon type="material" name="videocam" size={20} color={appColors.AppBlue} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Meeting Link</Text>
              <TouchableOpacity onPress={() => displayAppointment?.meetingLink ? Linking.openURL(displayAppointment.meetingLink) : null}>
                <Text style={styles.linkText}>Join Video Session</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>

          <TouchableOpacity style={styles.actionButton} onPress={handleSendMessage}>
            <Icon type="material" name="message" size={20} color={appColors.AppBlue} />
            <Text style={styles.actionButtonText}>Send Message to Client</Text>
            <Icon type="material" name="chevron-right" size={20} color={appColors.grey3} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleViewClientProfile}>
            <Icon type="material" name="person" size={20} color={appColors.AppBlue} />
            <Text style={styles.actionButtonText}>View Client History</Text>
            <Icon type="material" name="chevron-right" size={20} color={appColors.grey3} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleAddNote}>
            <Icon type="material" name="note-add" size={20} color={appColors.AppGreen} />
            <Text style={styles.actionButtonText}>Add Session Note</Text>
            <Icon type="material" name="chevron-right" size={20} color={appColors.grey3} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleViewNotes}>
            <Icon type="material" name="description" size={20} color={appColors.AppBlue} />
            <Text style={styles.actionButtonText}>View Previous Notes</Text>
            <Icon type="material" name="chevron-right" size={20} color={appColors.grey3} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action Buttons */}
      {displayAppointment?.status?.toLowerCase() === 'upcoming' && (
        <View style={styles.bottomActions}>
          <TouchableOpacity 
            style={[styles.startButton, isStarting && { opacity: 0.7 }]} 
            onPress={handleStartSession}
            disabled={isStarting}
          >
            {isStarting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Icon type="material" name="play-circle-filled" size={24} color="#FFFFFF" />
                <Text style={styles.startButtonText}>Start Session</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleReschedule}>
              <Icon type="material" name="schedule" size={20} color={appColors.AppBlue} />
              <Text style={styles.secondaryButtonText}>Reschedule</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.secondaryButton, styles.cancelButton]} onPress={handleCancel}>
              <Icon type="material" name="cancel" size={20} color="#F44336" />
              <Text style={[styles.secondaryButtonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* Start Session Confirmation Modal */}
      <ISConfirmationModal
        visible={showStartModal}
        title="Start Session"
        message={`Ready to start the session with ${displayClient?.name}?`}
        confirmText="Start Session"
        cancelText="Not Yet"
        type="success"
        icon="play-circle-filled"
        onConfirm={async () => {
          try {
            setShowStartModal(false);
            setIsStarting(true);
            const therapistId = userDetails?.userId;
            const appointmentId = displayAppointment.id || displayAppointment.sessionId || appointment.id || appointment.sessionId;

            if (appointmentId) {
              const res = await startAppointmentSession(appointmentId, therapistId);
              
              if (res?.success) {
                // Refresh details to show In-Progress status
                await loadDetails();
                
                // Only open link after server confirms start
                if (displayAppointment?.meetingLink) {
                  Linking.openURL(displayAppointment.meetingLink);
                } else {
                  alert.show({ type: 'info', title: 'Session Started', message: 'Session is now in progress.' });
                }
              }
            } else {
              alert.show({ type: 'error', title: 'Error', message: 'Appointment ID is missing.' });
            }
          } catch (error: any) {
            alert.show({ 
              type: 'error', 
              title: 'Start Failed', 
              message: error.backendMessage || error.message || 'Could not start the session at this time.' 
            });
          } finally {
            setIsStarting(false);
          }
        }}
        onCancel={() => setShowStartModal(false)}
      />

      <ISAlert ref={alert.ref} />

      {/* Cancel Appointment Confirmation Modal */}
      <ISConfirmationModal
        visible={showCancelModal}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this appointment? The client will be notified."
        confirmText={isCancelling ? "Cancelling..." : "Yes, Cancel"}
        cancelText="No"
        type="destructive"
        icon="cancel"
        onConfirm={async () => {
          try {
            setIsCancelling(true);
            const therapistId = userDetails?.userId;
            const appointmentId = displayAppointment.id || displayAppointment.sessionId || appointment.id || appointment.sessionId;
            
            const response = await cancelAppointment(appointmentId, therapistId);
            
            setShowCancelModal(false);
            if (response?.success !== false) {
              alert.show({
                type: 'success',
                title: 'Cancelled',
                message: 'Appointment has been successfully cancelled.',
                onConfirm: () => navigation.goBack()
              });
            }
          } catch (error: any) {
            alert.show({
              type: 'error',
              title: 'Error',
              message: error.backendMessage || error.message || 'Failed to cancel appointment'
            });
          } finally {
            setIsCancelling(false);
          }
        }}
        onCancel={() => setShowCancelModal(false)}
      />
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
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 10,
  },
  statusBannerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: appFonts.headerTextBold,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 16,
  },
  viewProfileLink: {
    fontSize: 14,
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextMedium,
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: appColors.AppLightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarLargeImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  clientDetails: {
    flex: 1,
  },
  clientName: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  clientMeta: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: 8,
  },
  clientStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
  },
  linkText: {
    fontSize: 16,
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextMedium,
    textDecorationLine: 'underline',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey6,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 15,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
    marginLeft: 12,
  },
  bottomActions: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  startButton: {
    backgroundColor: appColors.AppGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: appFonts.headerTextBold,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: appColors.AppBlue + '15',
    gap: 6,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextMedium,
  },
  cancelButton: {
    backgroundColor: '#F4433615',
  },
  cancelButtonText: {
    color: '#F44336',
  },
});

export default THAppointmentDetailsScreen;
