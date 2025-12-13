/**
 * Language & Region Settings Screen - Language, timezone, and regional preferences
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import { NavigationProp } from '@react-navigation/native';
import ISGenericHeader from '../../components/ISGenericHeader';
import { useDispatch, useSelector } from 'react-redux';
import { updateGeneralSetting, selectGeneralSettings } from '../../features/settings/userSettingsSlice';

interface LanguageRegionSettingsScreenProps {
  navigation: NavigationProp<any>;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
}


const LanguageRegionSettingsScreen: React.FC<LanguageRegionSettingsScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const generalSettings = useSelector(selectGeneralSettings);
  
  const [selectedLanguage, setSelectedLanguage] = useState(generalSettings.appLanguage || 'en');
  
  // Sync with Redux when settings change
  useEffect(() => {
    if (generalSettings.appLanguage) {
      setSelectedLanguage(generalSettings.appLanguage);
    }
  }, [generalSettings]);

  const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'lg', name: 'Luganda', nativeName: 'Oluganda' },
    { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  ];


  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code);
    dispatch(updateGeneralSetting({ key: 'appLanguage', value: code }));
    const language = languages.find(l => l.code === code);
    toast.show({
      description: `Language changed to ${language?.name}`,
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


  return (
    <SafeAreaView style={styles.container}>
      <ISGenericHeader
        title="Language & Region"
        navigation={navigation}
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
            <Text style={styles.infoTitle}>Language Settings</Text>
            <Text style={styles.infoText}>
              Choose your preferred language for the app interface.
            </Text>
          </View>
        </View>

        {/* Language Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SELECT LANGUAGE</Text>
          <View style={styles.optionsContainer}>
            {languages.map((language) => (
              <LanguageOption key={language.code} language={language} />
            ))}
          </View>
        </View>

        {/* Info Note */}
        <View style={styles.noteCard}>
          <Icon name="info" type="material" color={appColors.AppBlue} size={20} />
          <Text style={styles.noteText}>
            Language changes will take effect immediately. Some content may still appear in English.
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
