/**
 * Settings Screen - Main settings hub with organized categories
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import { NavigationProp } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import ISStatusBar from '../../components/ISStatusBar';
import { selectGeneralSettings, updateGeneralSetting } from '../../features/settings/userSettingsSlice';

interface SettingsScreenProps {
  navigation: NavigationProp<any>;
}

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  iconType?: string;
  iconColor?: string;
  hasSwitch?: boolean;
  switchValue?: boolean;
  hasChevron?: boolean;
  onPress?: () => void;
  onSwitchChange?: (value: boolean) => void;
  badge?: string;
  isDestructive?: boolean;
}

interface SettingSection {
  id: string;
  title: string;
  items: SettingItem[];
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const emergencyContacts = useSelector((state: any) => state.emergency?.emergencyContacts || []);
  const generalSettings = useSelector(selectGeneralSettings);
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(generalSettings.notificationsEnabled);
  const [biometricEnabled, setBiometricEnabled] = useState(generalSettings.biometricEnabled);
  const [locationEnabled, setLocationEnabled] = useState(generalSettings.locationEnabled);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(generalSettings.analyticsEnabled);
  
  // Sync with Redux when settings change
  useEffect(() => {
    setNotificationsEnabled(generalSettings.notificationsEnabled);
    setBiometricEnabled(generalSettings.biometricEnabled);
    setLocationEnabled(generalSettings.locationEnabled);
    setAnalyticsEnabled(generalSettings.analyticsEnabled);
  }, [generalSettings]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call to refresh settings
    setTimeout(() => {
      setIsRefreshing(false);
      toast.show({
        description: 'Settings refreshed',
        duration: 2000,
      });
    }, 1000);
  };

  const handleNotificationToggle = (value: boolean) => {
    setNotificationsEnabled(value);
    dispatch(updateGeneralSetting({ key: 'notificationsEnabled', value }));
    toast.show({
      description: value ? 'Notifications enabled' : 'Notifications disabled',
      duration: 2000,
    });
  };

  const handleBiometricToggle = (value: boolean) => {
    setBiometricEnabled(value);
    dispatch(updateGeneralSetting({ key: 'biometricEnabled', value }));
    toast.show({
      description: value ? 'Biometric authentication enabled' : 'Biometric authentication disabled',
      duration: 2000,
    });
  };

  const handleLocationToggle = (value: boolean) => {
    setLocationEnabled(value);
    dispatch(updateGeneralSetting({ key: 'locationEnabled', value }));
    toast.show({
      description: value ? 'Location services enabled' : 'Location services disabled',
      duration: 2000,
    });
  };

  const handleAnalyticsToggle = (value: boolean) => {
    setAnalyticsEnabled(value);
    dispatch(updateGeneralSetting({ key: 'analyticsEnabled', value }));
    toast.show({
      description: value ? 'Analytics enabled' : 'Analytics disabled',
      duration: 2000,
    });
  };

  const settingSections: SettingSection[] = [
    {
      id: 'account',
      title: 'Account',
      items: [
        {
          id: 'account',
          title: 'Account Settings',
          subtitle: 'Security, password & account management',
          icon: 'person',
          iconColor: appColors.AppBlue,
          hasChevron: true,
          onPress: () => navigation.navigate('AccountSettingsScreen'),
        },
        {
          id: 'privacy',
          title: 'Privacy Settings',
          subtitle: 'Data sharing and privacy controls',
          icon: 'privacy-tip',
          iconColor: '#FF9800',
          hasChevron: true,
          onPress: () => navigation.navigate('PrivacySettingsScreen'),
        },
      ],
    },
    {
      id: 'preferences',
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          title: 'Notifications',
          subtitle: notificationsEnabled ? 'Enabled' : 'Disabled',
          icon: 'notifications',
          iconColor: '#2196F3',
          hasSwitch: true,
          switchValue: notificationsEnabled,
          onSwitchChange: handleNotificationToggle,
          onPress: () => navigation.navigate('NotificationSettingsScreen'),
        },
        {
          id: 'language',
          title: 'Language & Region',
          subtitle: 'English (US)',
          icon: 'language',
          iconColor: '#00BCD4',
          hasChevron: true,
          onPress: () => navigation.navigate('LanguageRegionSettingsScreen'),
        },
        {
          id: 'theme',
          title: 'Appearance',
          subtitle: 'Light mode',
          icon: 'palette',
          iconColor: '#E91E63',
          hasChevron: true,
          onPress: () => navigation.navigate('AppearanceSettingsScreen'),
        },
      ],
    },
    
    {
      id: 'wellness',
      title: 'Wellness & Health',
      items: [
        {
          id: 'mood_reminders',
          title: 'Mood Check-in Reminders',
          subtitle: 'Daily at 8:00 PM',
          icon: 'mood',
          iconColor: '#FF5722',
          hasChevron: true,
          onPress: () => navigation.navigate('MoodReminderSettingsScreen'),
        },
        {
          id: 'crisis_contacts',
          title: 'Emergency Contacts',
          subtitle: emergencyContacts.length === 0 
            ? 'No contacts configured' 
            : emergencyContacts.length === 1 
            ? '1 contact configured' 
            : `${emergencyContacts.length} contacts configured`,
          icon: 'emergency',
          iconColor: '#F44336',
          hasChevron: true,
          onPress: () => navigation.navigate('EmergencyContactsScreen'),
        },
        {
          id: 'wellness_goals',
          title: 'Wellness Goals',
          subtitle: 'Set and track your goals',
          icon: 'flag',
          iconColor: '#4CAF50',
          hasChevron: true,
          onPress: () => navigation.navigate('GoalsScreen'),
        },
      ],
    },


    {
      id: 'support',
      title: 'Support & Feedback',
      items: [
        {
          id: 'help_center',
          title: 'Help Center',
          subtitle: 'FAQs and support articles',
          icon: 'help',
          iconColor: appColors.AppBlue,
          hasChevron: true,
          onPress: () => navigation.navigate('HelpCenterScreen'),
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          subtitle: 'Help us improve the app',
          icon: 'feedback',
          iconColor: '#FF9800',
          hasChevron: true,
          onPress: () => navigation.navigate('SendFeedbackScreen'),
        },
        {
          id: 'rate_app',
          title: 'Rate the App',
          subtitle: 'Share your experience',
          icon: 'star',
          iconColor: '#FFC107',
          hasChevron: true,
          onPress: () => {
            toast.show({
              description: 'Opening app store...',
              duration: 2000,
            });
          },
        },
      ],
    },
    



  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.settingItem, item.isDestructive && styles.destructiveItem]}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: item.iconColor + '15' }]}>
          <Icon
            name={item.icon}
            type={item.iconType || 'material'}
            color={item.iconColor || appColors.grey3}
            size={20}
          />
        </View>
        <View style={styles.settingItemContent}>
          <Text style={[styles.settingTitle, item.isDestructive && styles.destructiveText]}>
            {item.title}
          </Text>
          {item.subtitle && (
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      
      <View style={styles.settingItemRight}>
        {item.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
        {item.hasSwitch && (
          <Switch
            value={item.switchValue}
            onValueChange={item.onSwitchChange}
            trackColor={{ false: appColors.grey5, true: appColors.AppBlue + '40' }}
            thumbColor={item.switchValue ? appColors.AppBlue : appColors.grey4}
          />
        )}
        {item.hasChevron && !item.hasSwitch && (
          <Icon
            name="chevron-right"
            type="material"
            color={appColors.grey4}
            size={20}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSection = (section: SettingSection) => (
    <View key={section.id} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionContent}>
        {section.items.map((item, index) => (
          <View key={item.id}>
            {renderSettingItem(item)}
            {index < section.items.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar backgroundColor={appColors.AppBlue} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[appColors.AppBlue]}
          />
        }
      >
        {settingSections.map(renderSection)}

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
  header: {
    backgroundColor: appColors.AppBlue,
    paddingTop: parameters.headerHeightS,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  placeholder: {
    width: 40,
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
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  destructiveItem: {
    backgroundColor: '#FFEBEE',
  },
  settingItemLeft: {
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
  settingItemContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextMedium,
    marginBottom: 2,
  },
  destructiveText: {
    color: '#D32F2F',
  },
  settingSubtitle: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  separator: {
    height: 1,
    backgroundColor: appColors.grey6,
    marginLeft: 64,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextMedium,
    marginBottom: 4,
  },
  buildText: {
    fontSize: 12,
    color: appColors.grey4,
    fontFamily: appFonts.headerTextRegular,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default SettingsScreen;
