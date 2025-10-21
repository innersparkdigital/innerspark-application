/**
 * Language & Region Settings Screen - Language, timezone, and regional preferences
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import { NavigationProp } from '@react-navigation/native';
import ISGenericHeader from '../../components/ISGenericHeader';

interface LanguageRegionSettingsScreenProps {
  navigation: NavigationProp<any>;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

interface Region {
  code: string;
  name: string;
  flag: string;
}

const LanguageRegionSettingsScreen: React.FC<LanguageRegionSettingsScreenProps> = ({ navigation }) => {
  const toast = useToast();
  
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedRegion, setSelectedRegion] = useState('UG');
  const [use24HourFormat, setUse24HourFormat] = useState(false);
  const [useMetricSystem, setUseMetricSystem] = useState(true);
  const [autoDetectTimezone, setAutoDetectTimezone] = useState(true);

  const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
    { code: 'lg', name: 'Luganda', nativeName: 'Oluganda' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  ];

  const regions: Region[] = [
    { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
    { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
    { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
    { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  ];

  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code);
    const language = languages.find(l => l.code === code);
    toast.show({
      description: `Language changed to ${language?.name}`,
      duration: 2000,
    });
  };

  const handleRegionChange = (code: string) => {
    setSelectedRegion(code);
    const region = regions.find(r => r.code === code);
    toast.show({
      description: `Region changed to ${region?.name}`,
      duration: 2000,
    });
  };

  const LanguageOption = ({ language }: { language: Language }) => (
    <TouchableOpacity
      style={[
        styles.optionCard,
        selectedLanguage === language.code && styles.optionCardSelected
      ]}
      onPress={() => handleLanguageChange(language.code)}
    >
      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>{language.name}</Text>
        <Text style={styles.optionSubtitle}>{language.nativeName}</Text>
      </View>
      {selectedLanguage === language.code && (
        <Icon
          name="check-circle"
          type="material"
          color={appColors.AppBlue}
          size={24}
        />
      )}
    </TouchableOpacity>
  );

  const RegionOption = ({ region }: { region: Region }) => (
    <TouchableOpacity
      style={[
        styles.optionCard,
        selectedRegion === region.code && styles.optionCardSelected
      ]}
      onPress={() => handleRegionChange(region.code)}
    >
      <View style={styles.regionLeft}>
        <Text style={styles.regionFlag}>{region.flag}</Text>
        <Text style={styles.optionTitle}>{region.name}</Text>
      </View>
      {selectedRegion === region.code && (
        <Icon
          name="check-circle"
          type="material"
          color={appColors.AppBlue}
          size={24}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ISGenericHeader
        title="Language & Region"
        navigation={navigation}
        hasLightBackground={true}
      />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Icon name="language" type="material" color={appColors.AppBlue} size={32} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Localization Settings</Text>
            <Text style={styles.infoText}>
              Choose your preferred language and regional settings for dates, times, and measurements.
            </Text>
          </View>
        </View>

        {/* Language Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APP LANGUAGE</Text>
          <View style={styles.optionsContainer}>
            {languages.map((language) => (
              <LanguageOption key={language.code} language={language} />
            ))}
          </View>
        </View>

        {/* Region Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>REGION</Text>
          <View style={styles.optionsContainer}>
            {regions.map((region) => (
              <RegionOption key={region.code} region={region} />
            ))}
          </View>
        </View>

        {/* Format Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FORMAT PREFERENCES</Text>
          <View style={styles.sectionContent}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#2196F3' + '15' }]}>
                  <Icon
                    name="schedule"
                    type="material"
                    color="#2196F3"
                    size={20}
                  />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>24-Hour Time Format</Text>
                  <Text style={styles.settingSubtitle}>
                    {use24HourFormat ? '13:00' : '1:00 PM'}
                  </Text>
                </View>
              </View>
              <Switch
                value={use24HourFormat}
                onValueChange={setUse24HourFormat}
                trackColor={{ false: appColors.grey5, true: appColors.AppBlue + '40' }}
                thumbColor={use24HourFormat ? appColors.AppBlue : appColors.grey4}
              />
            </View>

            <View style={styles.separator} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#4CAF50' + '15' }]}>
                  <Icon
                    name="straighten"
                    type="material"
                    color="#4CAF50"
                    size={20}
                  />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Metric System</Text>
                  <Text style={styles.settingSubtitle}>
                    {useMetricSystem ? 'Kilometers, Celsius' : 'Miles, Fahrenheit'}
                  </Text>
                </View>
              </View>
              <Switch
                value={useMetricSystem}
                onValueChange={setUseMetricSystem}
                trackColor={{ false: appColors.grey5, true: appColors.AppBlue + '40' }}
                thumbColor={useMetricSystem ? appColors.AppBlue : appColors.grey4}
              />
            </View>

            <View style={styles.separator} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#FF9800' + '15' }]}>
                  <Icon
                    name="public"
                    type="material"
                    color="#FF9800"
                    size={20}
                  />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Auto-Detect Timezone</Text>
                  <Text style={styles.settingSubtitle}>
                    {autoDetectTimezone ? 'EAT (UTC+3)' : 'Manual selection'}
                  </Text>
                </View>
              </View>
              <Switch
                value={autoDetectTimezone}
                onValueChange={setAutoDetectTimezone}
                trackColor={{ false: appColors.grey5, true: appColors.AppBlue + '40' }}
                thumbColor={autoDetectTimezone ? appColors.AppBlue : appColors.grey4}
              />
            </View>
          </View>
        </View>

        {/* Date & Time Preview */}
        <View style={styles.previewCard}>
          <Text style={styles.previewTitle}>Format Preview</Text>
          <View style={styles.previewItem}>
            <Text style={styles.previewLabel}>Date:</Text>
            <Text style={styles.previewValue}>
              {selectedRegion === 'US' ? '10/21/2024' : '21/10/2024'}
            </Text>
          </View>
          <View style={styles.previewItem}>
            <Text style={styles.previewLabel}>Time:</Text>
            <Text style={styles.previewValue}>
              {use24HourFormat ? '14:30' : '2:30 PM'}
            </Text>
          </View>
          <View style={styles.previewItem}>
            <Text style={styles.previewLabel}>Currency:</Text>
            <Text style={styles.previewValue}>
              {selectedRegion === 'UG' ? 'UGX 50,000' : 
               selectedRegion === 'US' ? '$50.00' : 
               selectedRegion === 'GB' ? '£50.00' : 
               'UGX 50,000'}
            </Text>
          </View>
          <View style={styles.previewItem}>
            <Text style={styles.previewLabel}>Temperature:</Text>
            <Text style={styles.previewValue}>
              {useMetricSystem ? '25°C' : '77°F'}
            </Text>
          </View>
        </View>

        {/* Info Note */}
        <View style={styles.noteCard}>
          <Icon name="info" type="material" color={appColors.AppBlue} size={20} />
          <Text style={styles.noteText}>
            Some features may not be available in all languages. We're working to expand language support.
          </Text>
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
  contentContainer: {
    paddingHorizontal: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: appColors.AppBlue + '10',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  infoContent: {
    flex: 1,
    marginLeft: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    lineHeight: 20,
  },
  section: {
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
  sectionContent: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  optionsContainer: {
    gap: 8,
  },
  optionCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: appColors.grey6,
  },
  optionCardSelected: {
    borderColor: appColors.AppBlue,
    backgroundColor: appColors.AppBlue + '05',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextMedium,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  regionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  regionFlag: {
    fontSize: 28,
    marginRight: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextMedium,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  separator: {
    height: 1,
    backgroundColor: appColors.grey6,
    marginVertical: 8,
  },
  previewCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 16,
  },
  previewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewLabel: {
    fontSize: 15,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
  },
  previewValue: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: appColors.AppBlue + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: 12,
    lineHeight: 18,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default LanguageRegionSettingsScreen;
