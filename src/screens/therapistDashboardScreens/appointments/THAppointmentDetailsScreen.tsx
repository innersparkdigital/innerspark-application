import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import { appColors, appFonts } from '../../../global/Styles';
import ISGenericHeader from '../../../components/ISGenericHeader';
import ISStatusBar from '../../../components/ISStatusBar';

const THAppointmentDetailsScreen = ({ navigation, route }: any) => {
  const { appointment } = route.params || {};
  const [showActions, setShowActions] = useState(false);

  const handleStartSession = () => {
    Alert.alert(
      'Start Session',
      'Ready to start the session with ' + appointment.clientName + '?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start',
          onPress: () => {
            // Navigate to session screen or open meeting link
            if (appointment.meetingLink) {
              Linking.openURL(appointment.meetingLink);
            }
          },
        },
      ]
    );
  };

  const handleReschedule = () => {
    // Navigate to schedule screen with appointment data for rescheduling
    const clientData = {
      id: appointment.id,
      name: appointment.clientName,
      avatar: appointment.avatar,
    };
    navigation.navigate('THScheduleAppointmentScreen', { 
      client: clientData,
      isReschedule: true,
      existingAppointment: appointment 
    });
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment? The client will be notified.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            // Handle cancellation
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleViewClientProfile = () => {
    // Navigate to client profile with client data
    const clientData = {
      id: appointment.id,
      name: appointment.clientName,
      avatar: appointment.avatar,
    };
    navigation.navigate('THClientProfileScreen', { client: clientData });
  };

  const handleSendMessage = () => {
    // Navigate to chat with client
    navigation.navigate('THChats');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />
      <ISGenericHeader title="Appointment Details" navigation={navigation} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: appointment.status === 'upcoming' ? appColors.AppGreen : appColors.AppBlue }]}>
          <Icon type="material" name="event" color="#FFFFFF" size={24} />
          <Text style={styles.statusBannerText}>
            {appointment.status === 'upcoming' ? 'Upcoming Appointment' : 'Scheduled Appointment'}
          </Text>
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
              <Text style={styles.avatarLargeText}>{appointment.avatar}</Text>
            </View>
            <View style={styles.clientDetails}>
              <Text style={styles.clientName}>{appointment.clientName}</Text>
              <Text style={styles.clientMeta}>First-time client</Text>
              <View style={styles.clientStats}>
                <View style={styles.statItem}>
                  <Icon type="material" name="event" size={16} color={appColors.grey3} />
                  <Text style={styles.statText}>3 sessions</Text>
                </View>
                <View style={styles.statItem}>
                  <Icon type="material" name="star" size={16} color="#FFD700" />
                  <Text style={styles.statText}>4.8 rating</Text>
                </View>
              </View>
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
              <Text style={styles.detailValue}>{appointment.date} at {appointment.time}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon type="material" name="access-time" size={20} color={appColors.AppBlue} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>{appointment.duration}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon type="material" name="category" size={20} color={appColors.AppBlue} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Session Type</Text>
              <Text style={styles.detailValue}>{appointment.type}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon type="material" name="videocam" size={20} color={appColors.AppBlue} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Meeting Link</Text>
              <TouchableOpacity onPress={() => Linking.openURL('https://meet.innerspark.com/room/123')}>
                <Text style={styles.linkText}>Join Video Session</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Session Notes Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pre-Session Notes</Text>
          <Text style={styles.notesText}>
            Client requested to discuss anxiety management techniques and coping strategies for work-related stress.
          </Text>
          <TouchableOpacity style={styles.editNotesButton}>
            <Icon type="material" name="edit" size={16} color={appColors.AppBlue} />
            <Text style={styles.editNotesText}>Edit Notes</Text>
          </TouchableOpacity>
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

          <TouchableOpacity style={styles.actionButton}>
            <Icon type="material" name="description" size={20} color={appColors.AppBlue} />
            <Text style={styles.actionButtonText}>View Previous Notes</Text>
            <Icon type="material" name="chevron-right" size={20} color={appColors.grey3} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action Buttons */}
      {appointment.status === 'upcoming' && (
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.startButton} onPress={handleStartSession}>
            <Icon type="material" name="play-circle-filled" size={24} color="#FFFFFF" />
            <Text style={styles.startButtonText}>Start Session</Text>
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
  avatarLargeText: {
    fontSize: 40,
  },
  clientDetails: {
    flex: 1,
  },
  clientName: {
    fontSize: 20,
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
  notesText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: 22,
    marginBottom: 12,
  },
  editNotesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  editNotesText: {
    fontSize: 14,
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextMedium,
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
