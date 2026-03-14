/**
 * Mood Reminder Settings Screen - Configure mood check-in reminder preferences
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import { useToast } from 'native-base';
import { NavigationProp } from '@react-navigation/native';
import ISGenericHeader from '../../components/ISGenericHeader';
import { useDispatch, useSelector } from 'react-redux';
import { selectMoodReminderSettings, setMoodReminderSettings, updateMoodReminderSetting } from '../../features/settings/userSettingsSlice';
import { storeItemLS, retrieveItemLS } from '../../global/StorageActions';
import notifee, { TriggerType, RepeatFrequency, TimestampTrigger, AndroidImportance } from '@notifee/react-native';
import { NOTIFICATION_TYPES, CHANNELS, DEEP_LINK_ACTIONS } from '../../api/LHNotifications';

interface MoodReminderSettingsScreenProps {
  navigation: NavigationProp<any>;
}

const MoodReminderSettingsScreen: React.FC<MoodReminderSettingsScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const moodSettings = useSelector(selectMoodReminderSettings);

  // Reminder Settings
  const [reminderEnabled, setReminderEnabled] = useState(moodSettings.moodReminderEnabled);
  const [reminderTime, setReminderTime] = useState(moodSettings.moodReminderTime);

  // Days of Week
  const [selectedDays, setSelectedDays] = useState<string[]>(moodSettings.moodReminderDays);

  // Reminder Frequency
  const [reminderFrequency, setReminderFrequency] = useState<'once' | 'twice' | 'thrice'>(moodSettings.moodReminderFrequency);

  // Sound & Vibration
  const [soundEnabled, setSoundEnabled] = useState(moodSettings.moodReminderSound);
  const [vibrationEnabled, setVibrationEnabled] = useState(moodSettings.moodReminderVibration);

  // Load settings from local storage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const localSettingsString = await retrieveItemLS('moodReminderSettingsLS');
        if (localSettingsString) {
          const localSettings = JSON.parse(localSettingsString);
          dispatch(setMoodReminderSettings({
            enabled: localSettings.moodReminderEnabled,
            time: localSettings.moodReminderTime,
            days: localSettings.moodReminderDays,
            frequency: localSettings.moodReminderFrequency,
            sound: localSettings.moodReminderSound,
            vibration: localSettings.moodReminderVibration,
          }));
        }
      } catch (error) {
        console.error('Failed to load local mood settings:', error);
      }
    };
    loadSettings();
  }, [dispatch]);

  // Sync with Redux when settings change
  useEffect(() => {
    setReminderEnabled(moodSettings.moodReminderEnabled);
    setReminderTime(moodSettings.moodReminderTime);
    setSelectedDays(moodSettings.moodReminderDays);
    setReminderFrequency(moodSettings.moodReminderFrequency);
    setSoundEnabled(moodSettings.moodReminderSound);
    setVibrationEnabled(moodSettings.moodReminderVibration);
  }, [moodSettings]);

  // Time Picker
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState(20); // 8 PM
  const [selectedMinute, setSelectedMinute] = useState(0);

  const daysOfWeek = [
    { short: 'Sun', full: 'Sunday' },
    { short: 'Mon', full: 'Monday' },
    { short: 'Tue', full: 'Tuesday' },
    { short: 'Wed', full: 'Wednesday' },
    { short: 'Thu', full: 'Thursday' },
    { short: 'Fri', full: 'Friday' },
    { short: 'Sat', full: 'Saturday' },
  ];

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        const newDays = selectedDays.filter(d => d !== day);
        setSelectedDays(newDays);
        dispatch(updateMoodReminderSetting({ key: 'moodReminderDays', value: newDays }));
      } else {
        toast.show({
          description: 'At least one day must be selected',
          duration: 2000,
        });
      }
    } else {
      const newDays = [...selectedDays, day];
      setSelectedDays(newDays);
      dispatch(updateMoodReminderSetting({ key: 'moodReminderDays', value: newDays }));
    }
  };

  const handleTimePress = () => {
    setShowTimePicker(true);
  };

  const handleTimeConfirm = () => {
    const period = selectedHour >= 12 ? 'PM' : 'AM';
    const displayHour = selectedHour > 12 ? selectedHour - 12 : selectedHour === 0 ? 12 : selectedHour;
    const formattedTime = `${displayHour}:${selectedMinute.toString().padStart(2, '0')} ${period}`;
    setReminderTime(formattedTime);
    dispatch(updateMoodReminderSetting({ key: 'moodReminderTime', value: formattedTime }));
    setShowTimePicker(false);
  };

  const scheduleMoodNotifications = async (settings: any) => {
    try {
      // 1. Cancel only mood_reminder_* notifications to preserve other app alerts
      const allTriggerIds = await notifee.getTriggerNotificationIds();
      const moodIds = allTriggerIds.filter((id: string) => id.startsWith('mood_reminder_'));
      await Promise.all(moodIds.map((id: string) => notifee.cancelTriggerNotification(id)));

      if (!settings.moodReminderEnabled) return;

      const hasPermission = await notifee.requestPermission();
      if (hasPermission.authorizationStatus < 1) return;

      // 2. Map frequency to array of { hours, minutes }
      const frequencyTimesMap: Record<string, Array<{ hours: number; minutes: number; label: string }>> = {
        once:   [{ hours: 20, minutes: 0, label: '20_00' }],
        twice:  [{ hours: 14, minutes: 0, label: '14_00' }, { hours: 20, minutes: 0, label: '20_00' }],
        thrice: [{ hours: 10, minutes: 0, label: '10_00' }, { hours: 14, minutes: 0, label: '14_00' }, { hours: 20, minutes: 0, label: '20_00' }],
      };

      // For 'once', use the user-selected time from settings
      if (settings.moodReminderFrequency === 'once' && settings.moodReminderTime) {
        let [timeStr, period] = settings.moodReminderTime.split(' ');
        let [h, m] = timeStr.split(':').map(Number);
        if (period === 'PM' && h < 12) h += 12;
        if (period === 'AM' && h === 12) h = 0;
        frequencyTimesMap['once'] = [{ hours: h, minutes: m, label: `${h}_${m}` }];
      }

      const frequencyTimes = frequencyTimesMap[settings.moodReminderFrequency] || frequencyTimesMap['once'];

      // 3. Map short day names to JS weekday index (0=Sun, 6=Sat)
      const dayIndexMap: Record<string, number> = {
        Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
      };

      const selectedDays: string[] = settings.moodReminderDays || [];

      // 4. Schedule WEEKLY trigger for each selected day + time combination
      for (const day of selectedDays) {
        const dayIndex = dayIndexMap[day];
        if (dayIndex === undefined) continue;

        for (const timeSlot of frequencyTimes) {
          const notifId = `mood_reminder_${day}_${timeSlot.label}`;

          // Find the next occurrence of this day + time
          const now = new Date();
          const triggerDate = new Date();
          triggerDate.setHours(timeSlot.hours, timeSlot.minutes, 0, 0);

          // Advance to correct day of week
          let daysAhead = dayIndex - now.getDay();
          if (daysAhead < 0 || (daysAhead === 0 && triggerDate <= now)) {
            daysAhead += 7;
          }
          triggerDate.setDate(triggerDate.getDate() + daysAhead);

          const trigger: TimestampTrigger = {
            type: TriggerType.TIMESTAMP,
            timestamp: triggerDate.getTime(),
            repeatFrequency: RepeatFrequency.WEEKLY,
            alarmManager: {
              allowWhileIdle: true,
            },
          };

          await notifee.createTriggerNotification({
            id: notifId,
            title: '💬 How are you feeling?',
            body: 'Take a moment to check in with yourself and log your mood.',
            android: {
              channelId: CHANNELS.REMINDERS,
              importance: AndroidImportance.HIGH,
              smallIcon: 'ic_launcher', // Ensure icon is present
              pressAction: { id: 'default', launchActivity: 'default' },
              actions: [
                { title: 'Log Mood', pressAction: { id: 'log_mood', launchActivity: 'default' } },
                { title: 'Dismiss', pressAction: { id: 'dismiss' } },
              ],
            },
            data: {
              type: NOTIFICATION_TYPES.MOOD_CHECK_IN,
              deepLink: DEEP_LINK_ACTIONS.OPEN_MOOD,
            },
          }, trigger);
        }
      }

      console.log(`✅ Mood reminders scheduled: ${selectedDays.length} day(s) × ${frequencyTimes.length} time(s) = ${selectedDays.length * frequencyTimes.length} triggers`);

    } catch (error) {
      console.error('Failed to schedule mood notifications', error);
    }
  };

  const handleSaveSettings = async () => {
    // Save to local storage for persistence across app restarts
    const currentSettings = {
      moodReminderEnabled: reminderEnabled,
      moodReminderTime: reminderTime,
      moodReminderDays: selectedDays,
      moodReminderFrequency: reminderFrequency,
      moodReminderSound: soundEnabled,
      moodReminderVibration: vibrationEnabled,
    };
    
    try {
      await storeItemLS('moodReminderSettingsLS', currentSettings);
      await scheduleMoodNotifications(currentSettings);
    } catch (error) {
      console.error('Failed to save mood settings locally:', error);
    }

    toast.show({
      description: 'Reminder settings saved successfully!',
      duration: 2000,
    });
    navigation.goBack();
  };

  const handleReminderToggle = (value: boolean) => {
    setReminderEnabled(value);
    dispatch(updateMoodReminderSetting({ key: 'moodReminderEnabled', value }));
  };

  const handleFrequencyChange = (freq: 'once' | 'twice' | 'thrice') => {
    setReminderFrequency(freq);
    dispatch(updateMoodReminderSetting({ key: 'moodReminderFrequency', value: freq }));
  };

  const handleSoundToggle = (value: boolean) => {
    setSoundEnabled(value);
    dispatch(updateMoodReminderSetting({ key: 'moodReminderSound', value }));
  };

  const handleVibrationToggle = (value: boolean) => {
    setVibrationEnabled(value);
    dispatch(updateMoodReminderSetting({ key: 'moodReminderVibration', value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ISGenericHeader
        title="Mood Reminders"
        navigation={navigation}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Master Toggle */}
        <View style={styles.section}>
          <View style={styles.masterToggle}>
            <View style={styles.masterToggleLeft}>
              <Icon name="notifications-active" type="material" color={appColors.AppBlue} size={24} />
              <View style={styles.masterToggleText}>
                <Text style={styles.masterToggleTitle}>Enable Reminders</Text>
                <Text style={styles.masterToggleSubtitle}>
                  {reminderEnabled ? 'You will receive mood check-in reminders' : 'Reminders are disabled'}
                </Text>
              </View>
            </View>
            <Switch
              value={reminderEnabled}
              onValueChange={handleReminderToggle}
              trackColor={{ false: appColors.grey5, true: appColors.AppBlue + '40' }}
              thumbColor={reminderEnabled ? appColors.AppBlue : appColors.grey4}
            />
          </View>
        </View>

        {/* Reminder Time */}
        {reminderEnabled && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>REMINDER TIME</Text>
              <View style={styles.sectionContent}>
                <TouchableOpacity
                  style={styles.timeSelector}
                  onPress={handleTimePress}
                  activeOpacity={0.7}
                >
                  <View style={styles.timeSelectorLeft}>
                    <Icon name="access-time" type="material" color={appColors.AppBlue} size={20} />
                    <Text style={styles.timeSelectorText}>Daily Reminder</Text>
                  </View>
                  <View style={styles.timeSelectorRight}>
                    <Text style={styles.timeText}>{reminderTime}</Text>
                    <Icon name="chevron-right" type="material" color={appColors.grey4} size={20} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Days of Week */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>REMINDER DAYS</Text>
              <View style={styles.sectionContent}>
                <View style={styles.daysContainer}>
                  {daysOfWeek.map((day) => (
                    <TouchableOpacity
                      key={day.short}
                      style={[
                        styles.dayButton,
                        selectedDays.includes(day.short) && styles.dayButtonActive
                      ]}
                      onPress={() => toggleDay(day.short)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.dayButtonText,
                        selectedDays.includes(day.short) && styles.dayButtonTextActive
                      ]}>
                        {day.short}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.daysSubtext}>
                  {selectedDays.length === 7 ? 'Every day' : `${selectedDays.length} days selected`}
                </Text>
              </View>
            </View>

            {/* Reminder Frequency */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>FREQUENCY</Text>
              <View style={styles.sectionContent}>
                <TouchableOpacity
                  style={styles.frequencyOption}
                  onPress={() => handleFrequencyChange('once')}
                  activeOpacity={0.7}
                >
                  <View style={styles.frequencyLeft}>
                    <View style={[styles.radio, reminderFrequency === 'once' && styles.radioActive]}>
                      {reminderFrequency === 'once' && <View style={styles.radioDot} />}
                    </View>
                    <Text style={styles.frequencyText}>Once a day</Text>
                  </View>
                  <Text style={styles.frequencyTime}>{reminderTime}</Text>
                </TouchableOpacity>

                <View style={styles.separator} />

                <TouchableOpacity
                  style={styles.frequencyOption}
                  onPress={() => handleFrequencyChange('twice')}
                  activeOpacity={0.7}
                >
                  <View style={styles.frequencyLeft}>
                    <View style={[styles.radio, reminderFrequency === 'twice' && styles.radioActive]}>
                      {reminderFrequency === 'twice' && <View style={styles.radioDot} />}
                    </View>
                    <Text style={styles.frequencyText}>Twice a day</Text>
                  </View>
                  <Text style={styles.frequencyTime}>2:00 PM, 8:00 PM</Text>
                </TouchableOpacity>

                <View style={styles.separator} />

                <TouchableOpacity
                  style={styles.frequencyOption}
                  onPress={() => handleFrequencyChange('thrice')}
                  activeOpacity={0.7}
                >
                  <View style={styles.frequencyLeft}>
                    <View style={[styles.radio, reminderFrequency === 'thrice' && styles.radioActive]}>
                      {reminderFrequency === 'thrice' && <View style={styles.radioDot} />}
                    </View>
                    <Text style={styles.frequencyText}>Three times a day</Text>
                  </View>
                  <Text style={styles.frequencyTime}>10:00 AM, 2:00 PM, 8:00 PM</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sound & Vibration */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>ALERT PREFERENCES</Text>
              <View style={styles.sectionContent}>
                <View style={styles.preferenceItem}>
                  <View style={styles.preferenceLeft}>
                    <Icon name="volume-up" type="material" color={appColors.grey3} size={20} />
                    <Text style={styles.preferenceText}>Sound</Text>
                  </View>
                  <Switch
                    value={soundEnabled}
                    onValueChange={handleSoundToggle}
                    trackColor={{ false: appColors.grey5, true: appColors.AppBlue + '40' }}
                    thumbColor={soundEnabled ? appColors.AppBlue : appColors.grey4}
                  />
                </View>

                <View style={styles.separator} />

                <View style={styles.preferenceItem}>
                  <View style={styles.preferenceLeft}>
                    <Icon name="vibration" type="material" color={appColors.grey3} size={20} />
                    <Text style={styles.preferenceText}>Vibration</Text>
                  </View>
                  <Switch
                    value={vibrationEnabled}
                    onValueChange={handleVibrationToggle}
                    trackColor={{ false: appColors.grey5, true: appColors.AppBlue + '40' }}
                    thumbColor={vibrationEnabled ? appColors.AppBlue : appColors.grey4}
                  />
                </View>
              </View>
            </View>

            {/* Info Card */}
            <View style={styles.infoCard}>
              <Icon name="info-outline" type="material" color={appColors.AppBlue} size={20} />
              <Text style={styles.infoText}>
                Regular mood check-ins help you track your emotional patterns and improve your mental wellness journey.
              </Text>
            </View>
          </>
        )}

        {/* Save Button */}
        <View style={styles.saveButtonContainer}>
          <Button
            title="Save Settings"
            buttonStyle={parameters.appButtonXLBlue}
            titleStyle={parameters.appButtonXLTitleBlue}
            onPress={handleSaveSettings}
            disabled={!reminderEnabled}
          />
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Time Picker Modal */}
      <Modal
        visible={showTimePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.timePickerContainer}>
            <View style={styles.timePickerHeader}>
              <Text style={styles.timePickerTitle}>Select Time</Text>
              <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                <Icon name="close" type="material" color={appColors.grey2} size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.pickerRow}>
              <ScrollView style={styles.pickerColumn} showsVerticalScrollIndicator={false}>
                {Array.from({ length: 24 }, (_, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.pickerItem, selectedHour === i && styles.pickerItemSelected]}
                    onPress={() => setSelectedHour(i)}
                  >
                    <Text style={[styles.pickerText, selectedHour === i && styles.pickerTextSelected]}>
                      {i.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.pickerSeparator}>:</Text>

              <ScrollView style={styles.pickerColumn} showsVerticalScrollIndicator={false}>
                {[0, 15, 30, 45].map((minute) => (
                  <TouchableOpacity
                    key={minute}
                    style={[styles.pickerItem, selectedMinute === minute && styles.pickerItemSelected]}
                    onPress={() => setSelectedMinute(minute)}
                  >
                    <Text style={[styles.pickerText, selectedMinute === minute && styles.pickerTextSelected]}>
                      {minute.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.timePickerActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleTimeConfirm}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
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
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: scale(20),
  },
  sectionTitle: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    marginHorizontal: scale(20),
    marginBottom: scale(8),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: appColors.CardBackground,
    marginHorizontal: scale(20),
    borderRadius: scale(12),
    padding: scale(16),
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  masterToggle: {
    backgroundColor: appColors.CardBackground,
    marginHorizontal: scale(20),
    borderRadius: scale(12),
    padding: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  masterToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  masterToggleText: {
    marginLeft: scale(12),
    flex: 1,
  },
  masterToggleTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: scale(2),
  },
  masterToggleSubtitle: {
    fontSize: moderateScale(14),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeSelectorText: {
    fontSize: moderateScale(16),
    color: appColors.grey1,
    fontFamily: appFonts.headerTextMedium,
    marginLeft: scale(12),
  },
  timeSelectorRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
    marginRight: scale(8),
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(12),
  },
  dayButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: appColors.grey6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: appColors.grey6,
  },
  dayButtonActive: {
    backgroundColor: appColors.AppBlue,
    borderColor: appColors.AppBlue,
  },
  dayButtonText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: appColors.grey3,
    fontFamily: appFonts.headerTextBold,
  },
  dayButtonTextActive: {
    color: appColors.CardBackground,
  },
  daysSubtext: {
    fontSize: moderateScale(14),
    color: appColors.grey4,
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
  },
  frequencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(12),
  },
  frequencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    borderWidth: 2,
    borderColor: appColors.grey4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  radioActive: {
    borderColor: appColors.AppBlue,
  },
  radioDot: {
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
    backgroundColor: appColors.AppBlue,
  },
  frequencyText: {
    fontSize: moderateScale(16),
    color: appColors.grey1,
    fontFamily: appFonts.headerTextMedium,
  },
  frequencyTime: {
    fontSize: moderateScale(14),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: scale(8),
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(8),
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceText: {
    fontSize: moderateScale(16),
    color: appColors.grey1,
    fontFamily: appFonts.headerTextMedium,
    marginLeft: scale(12),
  },
  separator: {
    height: 1,
    backgroundColor: appColors.grey6,
    marginVertical: scale(4),
  },
  infoCard: {
    backgroundColor: appColors.AppBlue + '10',
    marginHorizontal: scale(20),
    marginTop: scale(20),
    padding: scale(16),
    borderRadius: scale(12),
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: scale(12),
    lineHeight: scale(20),
  },
  saveButtonContainer: {
    marginHorizontal: scale(20),
    marginTop: scale(30),
  },
  bottomSpacing: {
    height: scale(20),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  timePickerContainer: {
    backgroundColor: appColors.CardBackground,
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    paddingBottom: scale(30),
  },
  timePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scale(20),
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey6,
  },
  timePickerTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(20),
    height: scale(200),
  },
  pickerColumn: {
    width: scale(80),
    height: scale(200),
  },
  pickerItem: {
    paddingVertical: scale(12),
    alignItems: 'center',
  },
  pickerItemSelected: {
    backgroundColor: appColors.AppBlue + '15',
  },
  pickerText: {
    fontSize: moderateScale(20),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextMedium,
  },
  pickerTextSelected: {
    color: appColors.AppBlue,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  pickerSeparator: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: appColors.grey2,
    marginHorizontal: scale(10),
  },
  timePickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    paddingTop: scale(20),
    gap: scale(12),
  },
  cancelButton: {
    flex: 1,
    paddingVertical: scale(14),
    borderRadius: scale(12),
    backgroundColor: appColors.grey6,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: scale(14),
    borderRadius: scale(12),
    backgroundColor: appColors.AppBlue,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
});

export default MoodReminderSettingsScreen;
