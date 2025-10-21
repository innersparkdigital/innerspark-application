/**
 * Mood Reminder Settings Screen - Configure mood check-in reminder preferences
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import { NavigationProp } from '@react-navigation/native';
import ISGenericHeader from '../../components/ISGenericHeader';

interface MoodReminderSettingsScreenProps {
  navigation: NavigationProp<any>;
}

const MoodReminderSettingsScreen: React.FC<MoodReminderSettingsScreenProps> = ({ navigation }) => {
  const toast = useToast();
  
  // Reminder Settings
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('8:00 PM');
  
  // Days of Week
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  
  // Reminder Frequency
  const [reminderFrequency, setReminderFrequency] = useState<'once' | 'twice' | 'thrice'>('once');
  
  // Sound & Vibration
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

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
        setSelectedDays(selectedDays.filter(d => d !== day));
      } else {
        toast.show({
          description: 'At least one day must be selected',
          duration: 2000,
        });
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleTimePress = () => {
    toast.show({
      description: 'Time picker coming soon! Default is 8:00 PM',
      duration: 2000,
    });
  };

  const handleSaveSettings = () => {
    // Here you would save to backend/local storage
    toast.show({
      description: 'Reminder settings saved successfully!',
      duration: 2000,
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ISGenericHeader
        title="Mood Reminders"
        navigation={navigation}
        hasLightBackground={true}
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
              onValueChange={setReminderEnabled}
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
                  onPress={() => setReminderFrequency('once')}
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
                  onPress={() => setReminderFrequency('twice')}
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
                  onPress={() => setReminderFrequency('thrice')}
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
                    onValueChange={setSoundEnabled}
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
                    onValueChange={setVibrationEnabled}
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
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    marginHorizontal: 20,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: appColors.CardBackground,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  masterToggle: {
    backgroundColor: appColors.CardBackground,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
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
    marginLeft: 12,
    flex: 1,
  },
  masterToggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 2,
  },
  masterToggleSubtitle: {
    fontSize: 14,
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
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.headerTextMedium,
    marginLeft: 12,
  },
  timeSelectorRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
    marginRight: 8,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    fontSize: 14,
    fontWeight: '600',
    color: appColors.grey3,
    fontFamily: appFonts.headerTextBold,
  },
  dayButtonTextActive: {
    color: appColors.CardBackground,
  },
  daysSubtext: {
    fontSize: 14,
    color: appColors.grey4,
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
  },
  frequencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  frequencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: appColors.grey4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioActive: {
    borderColor: appColors.AppBlue,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: appColors.AppBlue,
  },
  frequencyText: {
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.headerTextMedium,
  },
  frequencyTime: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceText: {
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.headerTextMedium,
    marginLeft: 12,
  },
  separator: {
    height: 1,
    backgroundColor: appColors.grey6,
    marginVertical: 4,
  },
  infoCard: {
    backgroundColor: appColors.AppBlue + '10',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: 12,
    lineHeight: 20,
  },
  saveButtonContainer: {
    marginHorizontal: 20,
    marginTop: 30,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default MoodReminderSettingsScreen;
