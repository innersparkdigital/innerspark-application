/**
 * Therapist Availability & Hours Management Screen
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button } from '@rneui/themed';
import DatePicker from 'react-native-date-picker';
import { appColors, appFonts } from '../../../global/Styles';
import ISGenericHeader from '../../../components/ISGenericHeader';
import ISStatusBar from '../../../components/ISStatusBar';

interface DaySchedule {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

const THAvailabilityScreen = ({ navigation }: any) => {
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    { day: 'Monday', enabled: true, startTime: '09:00 AM', endTime: '05:00 PM' },
    { day: 'Tuesday', enabled: true, startTime: '09:00 AM', endTime: '05:00 PM' },
    { day: 'Wednesday', enabled: true, startTime: '09:00 AM', endTime: '05:00 PM' },
    { day: 'Thursday', enabled: true, startTime: '09:00 AM', endTime: '05:00 PM' },
    { day: 'Friday', enabled: true, startTime: '09:00 AM', endTime: '05:00 PM' },
    { day: 'Saturday', enabled: false, startTime: '10:00 AM', endTime: '02:00 PM' },
    { day: 'Sunday', enabled: false, startTime: '10:00 AM', endTime: '02:00 PM' },
  ]);

  const [sessionDuration, setSessionDuration] = useState('60');
  const [breakDuration, setBreakDuration] = useState('15');
  const [acceptNewClients, setAcceptNewClients] = useState(true);
  
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [timeType, setTimeType] = useState<'start' | 'end'>('start');
  const [tempDate, setTempDate] = useState(new Date());
  
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [durationType, setDurationType] = useState<'session' | 'break'>('session');
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'start' | 'end'>('start');
  const [tempStartDate, setTempStartDate] = useState(new Date());
  const [tempEndDate, setTempEndDate] = useState(new Date());
  const [timeOffPeriods, setTimeOffPeriods] = useState<Array<{id: string; startDate: string; endDate: string; reason: string}>>([]);

  const toggleDay = (index: number) => {
    const newSchedule = [...schedule];
    newSchedule[index].enabled = !newSchedule[index].enabled;
    setSchedule(newSchedule);
  };

  const handleEditTime = (index: number, type: 'start' | 'end') => {
    setSelectedDayIndex(index);
    setTimeType(type);
    
    // Parse existing time to set initial picker value
    const timeString = type === 'start' ? schedule[index].startTime : schedule[index].endTime;
    const date = parseTimeString(timeString);
    setTempDate(date);
    setShowTimePicker(true);
  };
  
  const parseTimeString = (timeStr: string): Date => {
    const date = new Date();
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    date.setHours(hours, minutes, 0, 0);
    return date;
  };
  
  const formatTime = (date: Date): string => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12 || 12;
    const minutesStr = minutes.toString().padStart(2, '0');
    
    return `${hours}:${minutesStr} ${period}`;
  };
  
  const confirmTimeSelection = () => {
    if (selectedDayIndex !== null) {
      const newSchedule = [...schedule];
      const formattedTime = formatTime(tempDate);
      
      if (timeType === 'start') {
        newSchedule[selectedDayIndex].startTime = formattedTime;
      } else {
        newSchedule[selectedDayIndex].endTime = formattedTime;
      }
      
      setSchedule(newSchedule);
    }
    setShowTimePicker(false);
  };
  
  const handleDurationChange = (type: 'session' | 'break') => {
    setDurationType(type);
    const currentValue = type === 'session' ? sessionDuration : breakDuration;
    const date = new Date();
    date.setHours(0, parseInt(currentValue), 0, 0);
    setTempDate(date);
    setShowDurationPicker(true);
  };
  
  const confirmDurationSelection = () => {
    const minutes = tempDate.getMinutes();
    if (durationType === 'session') {
      setSessionDuration(minutes.toString());
    } else {
      setBreakDuration(minutes.toString());
    }
    setShowDurationPicker(false);
  };

  const handleSave = () => {
    Alert.alert('Success', 'Your availability has been updated!');
  };

  const renderDayCard = (item: DaySchedule, index: number) => (
    <View key={index} style={styles.dayCard}>
      <View style={styles.dayHeader}>
        <View style={styles.dayLeft}>
          <Text style={[styles.dayName, !item.enabled && styles.dayNameDisabled]}>
            {item.day}
          </Text>
          {item.enabled && (
            <Text style={styles.dayTime}>
              {item.startTime} - {item.endTime}
            </Text>
          )}
          {!item.enabled && <Text style={styles.unavailableText}>Unavailable</Text>}
        </View>
        <Switch
          value={item.enabled}
          onValueChange={() => toggleDay(index)}
          trackColor={{ false: appColors.grey6, true: appColors.AppBlue + '50' }}
          thumbColor={item.enabled ? appColors.AppBlue : appColors.grey4}
        />
      </View>
      {item.enabled && (
        <View style={styles.editTimeButtons}>
          <TouchableOpacity
            style={styles.editTimeButton}
            onPress={() => handleEditTime(index, 'start')}
          >
            <Icon type="material" name="schedule" size={16} color={appColors.AppBlue} />
            <Text style={styles.editTimeText}>Edit Start Time</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editTimeButton}
            onPress={() => handleEditTime(index, 'end')}
          >
            <Icon type="material" name="schedule" size={16} color={appColors.AppGreen} />
            <Text style={[styles.editTimeText, { color: appColors.AppGreen }]}>Edit End Time</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />
      <ISGenericHeader title="Availability & Hours" navigation={navigation} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Icon type="material" name="info-outline" size={20} color={appColors.AppBlue} />
          <Text style={styles.infoText}>
            Set your working hours to help clients book sessions at convenient times
          </Text>
        </View>

        {/* Weekly Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Schedule</Text>
          {schedule.map((item, index) => renderDayCard(item, index))}
        </View>

        {/* Session Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Settings</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Icon type="material" name="timer" size={24} color={appColors.AppBlue} />
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Default Session Duration</Text>
                  <Text style={styles.settingValue}>{sessionDuration} minutes</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.changeButton}
                onPress={() => handleDurationChange('session')}
              >
                <Text style={styles.changeButtonText}>Change</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.settingRow, styles.settingRowBorder]}>
              <View style={styles.settingLeft}>
                <Icon type="material" name="coffee" size={24} color={appColors.AppGreen} />
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Break Between Sessions</Text>
                  <Text style={styles.settingValue}>{breakDuration} minutes</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.changeButton}
                onPress={() => handleDurationChange('break')}
              >
                <Text style={styles.changeButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Availability Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Status</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Icon
                  type="material"
                  name="person-add"
                  size={24}
                  color={acceptNewClients ? appColors.AppGreen : appColors.grey3}
                />
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Accept New Clients</Text>
                  <Text style={styles.settingSubtext}>
                    {acceptNewClients
                      ? 'You are accepting new client bookings'
                      : 'Not accepting new clients at this time'}
                  </Text>
                </View>
              </View>
              <Switch
                value={acceptNewClients}
                onValueChange={setAcceptNewClients}
                trackColor={{ false: appColors.grey6, true: appColors.AppGreen + '50' }}
                thumbColor={acceptNewClients ? appColors.AppGreen : appColors.grey4}
              />
            </View>
          </View>
        </View>

        {/* Time Off */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Time Off</Text>
            <TouchableOpacity
              onPress={() => {
                setTempStartDate(new Date());
                setTempEndDate(new Date());
                setDatePickerMode('start');
                setShowDatePicker(true);
              }}
            >
              <Text style={styles.addButton}>+ Add</Text>
            </TouchableOpacity>
          </View>
          
          {timeOffPeriods.length === 0 ? (
            <View style={styles.timeOffCard}>
              <Icon type="material" name="event-busy" size={40} color={appColors.grey3} />
              <Text style={styles.emptyText}>No scheduled time off</Text>
              <Text style={styles.emptySubtext}>Block dates when you're unavailable</Text>
            </View>
          ) : (
            timeOffPeriods.map((period) => (
              <View key={period.id} style={styles.timeOffPeriodCard}>
                <View style={styles.timeOffPeriodLeft}>
                  <Icon type="material" name="event-busy" size={24} color="#F44336" />
                  <View style={styles.timeOffPeriodInfo}>
                    <Text style={styles.timeOffPeriodDates}>
                      {period.startDate} - {period.endDate}
                    </Text>
                    <Text style={styles.timeOffPeriodReason}>{period.reason}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      'Delete Time Off',
                      'Are you sure you want to remove this time off period?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Delete',
                          style: 'destructive',
                          onPress: () => {
                            setTimeOffPeriods(timeOffPeriods.filter(p => p.id !== period.id));
                          },
                        },
                      ]
                    );
                  }}
                >
                  <Icon type="material" name="delete" size={24} color="#F44336" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <Button
          title="Save Changes"
          buttonStyle={styles.saveButton}
          titleStyle={styles.saveButtonText}
          onPress={handleSave}
        />
      </View>
      
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
              <Text style={styles.pickerTitle}>
                Select {timeType === 'start' ? 'Start' : 'End'} Time
              </Text>
              <Text style={styles.pickerSubtitle}>
                {selectedDayIndex !== null && schedule[selectedDayIndex].day}
              </Text>
            </View>
            
            <DatePicker
              date={tempDate}
              onDateChange={setTempDate}
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
                onPress={confirmTimeSelection}
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
              <Text style={styles.pickerTitle}>
                {durationType === 'session' ? 'Session Duration' : 'Break Duration'}
              </Text>
              <Text style={styles.pickerSubtitle}>Select duration in minutes</Text>
            </View>
            
            <DatePicker
              date={tempDate}
              onDateChange={setTempDate}
              mode="time"
              minuteInterval={5}
            />
            
            <View style={styles.pickerButtons}>
              <TouchableOpacity
                style={[styles.pickerButton, styles.cancelButton]}
                onPress={() => setShowDurationPicker(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pickerButton, styles.confirmButton]}
                onPress={confirmDurationSelection}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Date Range Picker Modal for Time Off */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>
                {datePickerMode === 'start' ? 'Select Start Date' : 'Select End Date'}
              </Text>
              <Text style={styles.pickerSubtitle}>
                {datePickerMode === 'start' 
                  ? 'When does your time off begin?' 
                  : 'When does your time off end?'}
              </Text>
            </View>
            
            <DatePicker
              date={datePickerMode === 'start' ? tempStartDate : tempEndDate}
              onDateChange={(date) => {
                if (datePickerMode === 'start') {
                  setTempStartDate(date);
                } else {
                  setTempEndDate(date);
                }
              }}
              mode="date"
              minimumDate={datePickerMode === 'start' ? new Date() : tempStartDate}
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
                onPress={() => {
                  if (datePickerMode === 'start') {
                    setDatePickerMode('end');
                  } else {
                    // Both dates selected, now ask for reason
                    setShowDatePicker(false);
                    Alert.prompt(
                      'Time Off Reason',
                      'Enter a reason for this time off (optional)',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Save',
                          onPress: (reason?: string) => {
                            const newPeriod = {
                              id: Date.now().toString(),
                              startDate: tempStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                              endDate: tempEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                              reason: reason || 'Personal time off',
                            };
                            setTimeOffPeriods([...timeOffPeriods, newPeriod]);
                            setDatePickerMode('start');
                          },
                        },
                      ],
                      'plain-text'
                    );
                  }
                }}
              >
                <Text style={styles.confirmButtonText}>
                  {datePickerMode === 'start' ? 'Next' : 'Confirm'}
                </Text>
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
  content: {
    flex: 1,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.AppBlue + '10',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: 18,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 12,
  },
  addButton: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextMedium,
  },
  dayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayLeft: {
    flex: 1,
  },
  dayName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  dayNameDisabled: {
    color: appColors.grey3,
  },
  dayTime: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
  },
  unavailableText: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    fontStyle: 'italic',
  },
  editTimeButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: appColors.grey6,
  },
  editTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    backgroundColor: appColors.AppLightGray,
    borderRadius: 8,
  },
  editTimeText: {
    fontSize: 13,
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextMedium,
    fontWeight: '600',
  },
  settingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingRowBorder: {
    borderTopWidth: 1,
    borderTopColor: appColors.grey6,
    marginTop: 12,
    paddingTop: 20,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
    marginBottom: 4,
  },
  settingValue: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  settingSubtext: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginTop: 2,
  },
  changeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: appColors.AppBlue + '10',
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextMedium,
  },
  timeOffCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  timeOffPeriodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  timeOffPeriodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  timeOffPeriodInfo: {
    flex: 1,
  },
  timeOffPeriodDates: {
    fontSize: 15,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  timeOffPeriodReason: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextMedium,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginTop: 4,
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
  saveButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 12,
    paddingVertical: 16,
  },
  saveButtonText: {
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
  pickerSubtitle: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'center',
    marginTop: 4,
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
});

export default THAvailabilityScreen;
