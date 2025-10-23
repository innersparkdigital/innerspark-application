/**
 * Schedule Appointment Screen - Schedule individual therapy sessions
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button } from '@rneui/themed';
import DatePicker from 'react-native-date-picker';
import { appColors, appFonts } from '../../../global/Styles';
import ISGenericHeader from '../../../components/ISGenericHeader';
import ISStatusBar from '../../../components/ISStatusBar';

// Mock clients data
const mockClients = [
  { id: '1', name: 'John Doe', avatar: '👨', lastSession: '2 days ago' },
  { id: '2', name: 'Sarah Williams', avatar: '👩', lastSession: '1 week ago' },
  { id: '3', name: 'Michael Brown', avatar: '👨‍💼', lastSession: '3 days ago' },
  { id: '4', name: 'Emily Chen', avatar: '👩‍💼', lastSession: '5 days ago' },
  { id: '5', name: 'David Martinez', avatar: '👨‍🦱', lastSession: 'New client' },
];

const THScheduleAppointmentScreen = ({ navigation, route }: any) => {
  const preSelectedClient = route.params?.client;
  const isReschedule = route.params?.isReschedule || false;
  const existingAppointment = route.params?.existingAppointment;

  const [selectedClient, setSelectedClient] = useState(preSelectedClient || null);
  const [sessionType, setSessionType] = useState<'individual' | 'couples' | 'consultation'>(
    existingAppointment?.type?.toLowerCase() || 'individual'
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [duration, setDuration] = useState(existingAppointment?.duration?.replace(' min', '') || '60');
  const [notes, setNotes] = useState('');
  const [meetingType, setMeetingType] = useState<'in-person' | 'virtual'>('virtual');
  const [meetingLink, setMeetingLink] = useState(existingAppointment?.meetingLink || '');
  
  const [showClientPicker, setShowClientPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);

  const sessionTypes = [
    { id: 'individual' as const, label: 'Individual', icon: 'person', color: appColors.AppBlue, rate: 'UGX 280,000' },
    { id: 'couples' as const, label: 'Couples', icon: 'people', color: '#E91E63', rate: 'UGX 420,000' },
    { id: 'consultation' as const, label: 'Consultation', icon: 'chat', color: appColors.AppGreen, rate: 'UGX 175,000' },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleSchedule = () => {
    if (!selectedClient) {
      Alert.alert('Missing Information', 'Please select a client');
      return;
    }

    if (meetingType === 'virtual' && !meetingLink.trim()) {
      Alert.alert('Missing Information', 'Please enter a meeting link for virtual sessions');
      return;
    }

    Alert.alert(
      'Appointment Scheduled',
      `Session with ${selectedClient.name} has been scheduled for ${formatDate(selectedDate)} at ${formatTime(selectedDate)}`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const selectedSessionType = sessionTypes.find(t => t.id === sessionType);

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />
      <ISGenericHeader 
        title={isReschedule ? "Reschedule Appointment" : "Schedule Appointment"} 
        navigation={navigation} 
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Client Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Client</Text>
          <TouchableOpacity
            style={styles.clientButton}
            onPress={() => setShowClientPicker(true)}
          >
            {selectedClient ? (
              <>
                <Text style={styles.clientAvatar}>{selectedClient.avatar}</Text>
                <View style={styles.clientInfo}>
                  <Text style={styles.clientName}>{selectedClient.name}</Text>
                  <Text style={styles.clientLastSession}>Last session: {selectedClient.lastSession}</Text>
                </View>
                <Icon type="material" name="chevron-right" size={24} color={appColors.grey3} />
              </>
            ) : (
              <>
                <Icon type="material" name="person-add" size={24} color={appColors.AppBlue} />
                <Text style={styles.selectClientText}>Tap to select client</Text>
                <Icon type="material" name="chevron-right" size={24} color={appColors.grey3} />
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Session Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Type</Text>
          <View style={styles.typeContainer}>
            {sessionTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeCard,
                  sessionType === type.id && { 
                    backgroundColor: type.color + '20',
                    borderColor: type.color 
                  }
                ]}
                onPress={() => setSessionType(type.id)}
              >
                <Icon
                  type="material"
                  name={type.icon}
                  size={28}
                  color={sessionType === type.id ? type.color : appColors.grey3}
                />
                <Text
                  style={[
                    styles.typeLabel,
                    sessionType === type.id && { color: type.color, fontWeight: 'bold' }
                  ]}
                >
                  {type.label}
                </Text>
                <Text style={styles.typeRate}>{type.rate}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date & Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date & Time</Text>
          <View style={styles.dateTimeRow}>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Icon type="material" name="calendar-today" size={20} color={appColors.AppBlue} />
              <View style={styles.dateTimeInfo}>
                <Text style={styles.dateTimeLabel}>Date</Text>
                <Text style={styles.dateTimeValue}>{formatDate(selectedDate)}</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <View style={styles.dateTimeRow}>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Icon type="material" name="access-time" size={20} color={appColors.AppBlue} />
              <View style={styles.dateTimeInfo}>
                <Text style={styles.dateTimeLabel}>Time</Text>
                <Text style={styles.dateTimeValue}>{formatTime(selectedDate)}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Duration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Duration</Text>
          <TouchableOpacity
            style={styles.durationButton}
            onPress={() => setShowDurationPicker(true)}
          >
            <Icon type="material" name="timer" size={24} color={appColors.AppBlue} />
            <Text style={styles.durationText}>{duration} minutes</Text>
            <Icon type="material" name="chevron-right" size={24} color={appColors.grey3} />
          </TouchableOpacity>
        </View>

        {/* Meeting Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meeting Type</Text>
          <View style={styles.meetingTypeRow}>
            <TouchableOpacity
              style={[
                styles.meetingTypeButton,
                meetingType === 'virtual' && styles.meetingTypeButtonActive
              ]}
              onPress={() => setMeetingType('virtual')}
            >
              <Icon
                type="material"
                name="videocam"
                size={24}
                color={meetingType === 'virtual' ? appColors.AppBlue : appColors.grey3}
              />
              <Text
                style={[
                  styles.meetingTypeLabel,
                  meetingType === 'virtual' && styles.meetingTypeLabelActive
                ]}
              >
                Virtual
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.meetingTypeButton,
                meetingType === 'in-person' && styles.meetingTypeButtonActive
              ]}
              onPress={() => setMeetingType('in-person')}
            >
              <Icon
                type="material"
                name="place"
                size={24}
                color={meetingType === 'in-person' ? appColors.AppGreen : appColors.grey3}
              />
              <Text
                style={[
                  styles.meetingTypeLabel,
                  meetingType === 'in-person' && styles.meetingTypeLabelActive
                ]}
              >
                In-Person
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Meeting Link (for virtual) */}
        {meetingType === 'virtual' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meeting Link</Text>
            <TextInput
              style={styles.input}
              placeholder="https://zoom.us/j/..."
              placeholderTextColor={appColors.grey3}
              value={meetingLink}
              onChangeText={setMeetingLink}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>
        )}

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add any notes or special instructions..."
            placeholderTextColor={appColors.grey3}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
          />
        </View>

        {/* Summary Card */}
        {selectedClient && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Icon type="material" name="event" size={20} color={appColors.AppBlue} />
              <Text style={styles.summaryTitle}>Appointment Summary</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Client:</Text>
              <Text style={styles.summaryValue}>{selectedClient.name}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Type:</Text>
              <Text style={styles.summaryValue}>{selectedSessionType?.label} Session</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Rate:</Text>
              <Text style={styles.summaryValue}>{selectedSessionType?.rate}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Duration:</Text>
              <Text style={styles.summaryValue}>{duration} minutes</Text>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Schedule Button */}
      <View style={styles.footer}>
        <Button
          title={isReschedule ? "Reschedule Appointment" : "Schedule Appointment"}
          buttonStyle={styles.scheduleButton}
          titleStyle={styles.scheduleButtonText}
          onPress={handleSchedule}
        />
      </View>

      {/* Client Picker Modal */}
      <Modal
        visible={showClientPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowClientPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Client</Text>
              <TouchableOpacity onPress={() => setShowClientPicker(false)}>
                <Icon type="material" name="close" size={24} color={appColors.grey2} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.clientList}>
              {mockClients.map((client) => (
                <TouchableOpacity
                  key={client.id}
                  style={styles.clientOption}
                  onPress={() => {
                    setSelectedClient(client);
                    setShowClientPicker(false);
                  }}
                >
                  <Text style={styles.clientOptionAvatar}>{client.avatar}</Text>
                  <View style={styles.clientOptionInfo}>
                    <Text style={styles.clientOptionName}>{client.name}</Text>
                    <Text style={styles.clientOptionLastSession}>Last session: {client.lastSession}</Text>
                  </View>
                  {selectedClient?.id === client.id && (
                    <Icon type="material" name="check-circle" size={24} color={appColors.AppBlue} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Date</Text>
            </View>
            
            <DatePicker
              date={selectedDate}
              onDateChange={setSelectedDate}
              mode="date"
              minimumDate={new Date()}
              theme="light"
            />
            
            <View style={styles.pickerButtons}>
              <TouchableOpacity
                style={[styles.pickerButton, styles.cancelButton]}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pickerButton, styles.confirmButton]}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      <Modal
        visible={showTimePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Time</Text>
            </View>
            
            <DatePicker
              date={selectedDate}
              onDateChange={setSelectedDate}
              mode="time"
              minuteInterval={15}
              theme="light"
            />
            
            <View style={styles.pickerButtons}>
              <TouchableOpacity
                style={[styles.pickerButton, styles.cancelButton]}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pickerButton, styles.confirmButton]}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Duration Picker Modal */}
      <Modal
        visible={showDurationPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDurationPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Session Duration</Text>
            </View>
            
            <ScrollView style={styles.durationList}>
              {['30', '45', '60', '90', '120'].map((mins) => (
                <TouchableOpacity
                  key={mins}
                  style={[
                    styles.durationOption,
                    duration === mins && styles.durationOptionActive
                  ]}
                  onPress={() => {
                    setDuration(mins);
                    setShowDurationPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.durationOptionText,
                      duration === mins && styles.durationOptionTextActive
                    ]}
                  >
                    {mins} minutes
                  </Text>
                  {duration === mins && (
                    <Icon type="material" name="check" size={24} color={appColors.AppBlue} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
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
  content: {
    flex: 1,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  clientAvatar: {
    fontSize: 32,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  clientLastSession: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  selectClientText: {
    flex: 1,
    fontSize: 16,
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextMedium,
    fontWeight: '600',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: appColors.grey6,
    padding: 16,
    gap: 8,
  },
  typeLabel: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextMedium,
    fontWeight: '600',
  },
  typeRate: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  dateTimeRow: {
    marginBottom: 12,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dateTimeInfo: {
    flex: 1,
  },
  dateTimeLabel: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: 4,
  },
  dateTimeValue: {
    fontSize: 15,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
    fontWeight: '600',
  },
  durationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  durationText: {
    flex: 1,
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
  },
  meetingTypeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  meetingTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: appColors.grey6,
    padding: 16,
    gap: 8,
  },
  meetingTypeButtonActive: {
    borderColor: appColors.AppBlue,
    backgroundColor: appColors.AppBlue + '10',
  },
  meetingTypeLabel: {
    fontSize: 15,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextMedium,
    fontWeight: '600',
  },
  meetingTypeLabelActive: {
    color: appColors.AppBlue,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  summaryCard: {
    backgroundColor: appColors.AppBlue + '10',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scheduleButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 12,
    paddingVertical: 16,
  },
  scheduleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: appFonts.headerTextBold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey6,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  clientList: {
    maxHeight: 400,
  },
  clientOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey6,
    gap: 12,
  },
  clientOptionAvatar: {
    fontSize: 32,
  },
  clientOptionInfo: {
    flex: 1,
  },
  clientOptionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  clientOptionLastSession: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  pickerButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  pickerButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: appColors.grey6,
  },
  confirmButton: {
    backgroundColor: appColors.AppBlue,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: appFonts.bodyTextMedium,
  },
  durationList: {
    maxHeight: 300,
  },
  durationOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey6,
  },
  durationOptionActive: {
    backgroundColor: appColors.AppBlue + '10',
  },
  durationOptionText: {
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
  },
  durationOptionTextActive: {
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
});

export default THScheduleAppointmentScreen;
