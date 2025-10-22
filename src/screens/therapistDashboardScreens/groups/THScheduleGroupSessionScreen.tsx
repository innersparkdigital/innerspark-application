/**
 * Schedule Group Session Screen - Schedule new group therapy sessions
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

const THScheduleGroupSessionScreen = ({ navigation, route }: any) => {
  const { group } = route.params;

  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionDescription, setSessionDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [duration, setDuration] = useState('60');
  const [maxParticipants, setMaxParticipants] = useState(group.members?.toString() || '20');
  const [sessionType, setSessionType] = useState<'in-person' | 'virtual' | 'hybrid'>('virtual');
  const [meetingLink, setMeetingLink] = useState('');
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);

  const sessionTypes = [
    { id: 'virtual' as const, label: 'Virtual', icon: 'videocam', color: appColors.AppBlue },
    { id: 'in-person' as const, label: 'In-Person', icon: 'place', color: appColors.AppGreen },
    { id: 'hybrid' as const, label: 'Hybrid', icon: 'group', color: '#9C27B0' },
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
    if (!sessionTitle.trim()) {
      Alert.alert('Missing Information', 'Please enter a session title');
      return;
    }

    if (sessionType === 'virtual' && !meetingLink.trim()) {
      Alert.alert('Missing Information', 'Please enter a meeting link for virtual sessions');
      return;
    }

    Alert.alert(
      'Session Scheduled',
      `${sessionTitle} has been scheduled for ${formatDate(selectedDate)} at ${formatTime(selectedDate)}`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />
      <ISGenericHeader title="Schedule Session" navigation={navigation} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Group Info Card */}
        <View style={styles.groupCard}>
          <Text style={styles.groupIcon}>{group.icon}</Text>
          <View style={styles.groupInfo}>
            <Text style={styles.groupName}>{group.name}</Text>
            <Text style={styles.groupMembers}>{group.members} members</Text>
          </View>
        </View>

        {/* Session Title */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Coping with Stress"
            placeholderTextColor={appColors.grey3}
            value={sessionTitle}
            onChangeText={setSessionTitle}
            maxLength={100}
          />
        </View>

        {/* Session Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="What will be covered in this session?"
            placeholderTextColor={appColors.grey3}
            value={sessionDescription}
            onChangeText={setSessionDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
          />
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
              <Text style={styles.dateTimeText}>{formatDate(selectedDate)}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Icon type="material" name="access-time" size={20} color={appColors.AppBlue} />
              <Text style={styles.dateTimeText}>{formatTime(selectedDate)}</Text>
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

        {/* Session Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Type</Text>
          <View style={styles.typeContainer}>
            {sessionTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeButton,
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
                  size={24}
                  color={sessionType === type.id ? type.color : appColors.grey3}
                />
                <Text
                  style={[
                    styles.typeLabel,
                    sessionType === type.id && { color: type.color }
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Meeting Link (for virtual/hybrid) */}
        {(sessionType === 'virtual' || sessionType === 'hybrid') && (
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

        {/* Max Participants */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Maximum Participants</Text>
          <TextInput
            style={styles.input}
            placeholder="20"
            placeholderTextColor={appColors.grey3}
            value={maxParticipants}
            onChangeText={setMaxParticipants}
            keyboardType="number-pad"
            maxLength={3}
          />
          <Text style={styles.helperText}>
            Recommended: 10-20 participants for effective group therapy
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Schedule Button */}
      <View style={styles.footer}>
        <Button
          title="Schedule Session"
          buttonStyle={styles.scheduleButton}
          titleStyle={styles.scheduleButtonText}
          onPress={handleSchedule}
        />
      </View>

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
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  groupIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  groupMembers: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
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
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeButton: {
    flex: 1,
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
  dateTimeText: {
    flex: 1,
    fontSize: 14,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
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
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
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
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextMedium,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginTop: 8,
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
  },
  pickerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey6,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    textAlign: 'center',
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

export default THScheduleGroupSessionScreen;
