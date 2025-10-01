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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

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
    toast.show({
      description: value ? 'Notifications enabled' : 'Notifications disabled',
      duration: 2000,
    });
  };

  const handleBiometricToggle = (value: boolean) => {
    setBiometricEnabled(value);
    toast.show({
      description: value ? 'Biometric authentication enabled' : 'Biometric authentication disabled',
      duration: 2000,
    });
  };

  const handleLocationToggle = (value: boolean) => {
    setLocationEnabled(value);
    toast.show({
      description: value ? 'Location services enabled' : 'Location services disabled',
      duration: 2000,
    });
  };

  const handleAnalyticsToggle = (value: boolean) => {
    setAnalyticsEnabled(value);
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
          id: 'profile',
          title: 'Profile Information',
          subtitle: 'Manage your personal details',
          icon: 'person',
          iconColor: appColors.AppBlue,
          hasChevron: true,
          onPress: () => navigation.navigate('ProfileSettingsScreen'),
        },
        {
          id: 'security',
          title: 'Security & Password',
          subtitle: 'Password, biometric authentication',
          icon: 'security',
          iconColor: '#4CAF50',
          hasChevron: true,
          onPress: () => navigation.navigate('SecuritySettingsScreen'),
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
          iconColor: '#9C27B0',
          hasChevron: true,
          onPress: () => {
            toast.show({
              description: 'Language settings coming soon!',
              duration: 2000,
            });
          },
        },
        {
          id: 'theme',
          title: 'Appearance',
          subtitle: 'Light mode',
          icon: 'palette',
          iconColor: '#E91E63',
          hasChevron: true,
          onPress: () => {
            toast.show({
              description: 'Appearance settings coming soon!',
              duration: 2000,
            });
          },
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
          onPress: () => {
            toast.show({
              description: 'Mood reminder settings coming soon!',
              duration: 2000,
            });
          },
        },
        {
          id: 'crisis_contacts',
          title: 'Emergency Contacts',
          subtitle: '3 contacts configured',
          icon: 'emergency',
          iconColor: '#F44336',
          hasChevron: true,
          onPress: () => {
            toast.show({
              description: 'Emergency contacts settings coming soon!',
              duration: 2000,
            });
          },
        },
        {
          id: 'wellness_goals',
          title: 'Wellness Goals',
          subtitle: 'Set and track your goals',
          icon: 'flag',
          iconColor: '#4CAF50',
          hasChevron: true,
          onPress: () => {
            toast.show({
              description: 'Wellness goals settings coming soon!',
              duration: 2000,
            });
          },
        },
      ],
    },
    {
      id: 'data',
      title: 'Data & Storage',
      items: [
        {
          id: 'data_usage',
          title: 'Data Usage',
          subtitle: 'Manage app data consumption',
          icon: 'data-usage',
          iconColor: '#607D8B',
          hasChevron: true,
          onPress: () => {
            toast.show({
              description: 'Data usage settings coming soon!',
              duration: 2000,
            });
          },
        },
        {
          id: 'backup',
          title: 'Backup & Sync',
          subtitle: 'Last backup: Today',
          icon: 'backup',
          iconColor: '#795548',
          hasChevron: true,
          onPress: () => {
            toast.show({
              description: 'Backup settings coming soon!',
              duration: 2000,
            });
          },
        },
        {
          id: 'export_data',
          title: 'Export My Data',
          subtitle: 'Download your data',
          icon: 'download',
          iconColor: '#009688',
          hasChevron: true,
          onPress: () => {
            toast.show({
              description: 'Data export feature coming soon!',
              duration: 2000,
            });
          },
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
          onPress: () => {
            toast.show({
              description: 'Help center coming soon!',
              duration: 2000,
            });
          },
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          subtitle: 'Help us improve the app',
          icon: 'feedback',
          iconColor: '#FF9800',
          hasChevron: true,
          onPress: () => {
            toast.show({
              description: 'Feedback feature coming soon!',
              duration: 2000,
            });
          },
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
    {
      id: 'advanced',
      title: 'Advanced',
      items: [
        {
          id: 'developer',
          title: 'Developer Options',
          subtitle: 'Advanced settings',
          icon: 'code',
          iconColor: '#607D8B',
          hasChevron: true,
          onPress: () => {
            toast.show({
              description: 'Developer options coming soon!',
              duration: 2000,
            });
          },
        },
        {
          id: 'reset',
          title: 'Reset Settings',
          subtitle: 'Reset all settings to default',
          icon: 'restore',
          iconColor: '#FF5722',
          hasChevron: true,
          onPress: () => {
            Alert.alert(
              'Reset Settings',
              'Are you sure you want to reset all settings to default? This action cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Reset',
                  style: 'destructive',
                  onPress: () => {
                    toast.show({
                      description: 'Settings reset to default',
                      duration: 3000,
                    });
                  },
                },
              ]
            );
          },
        },
      ],
    },
    {
      id: 'account_actions',
      title: 'Account Actions',
      items: [
        {
          id: 'deactivate',
          title: 'Deactivate Account',
          subtitle: 'Temporarily disable your account',
          icon: 'pause-circle',
          iconColor: '#FF9800',
          hasChevron: true,
          onPress: () => {
            toast.show({
              description: 'Account deactivation coming soon!',
              duration: 2000,
            });
          },
        },
        {
          id: 'delete',
          title: 'Delete Account',
          subtitle: 'Permanently delete your account',
          icon: 'delete-forever',
          iconColor: '#F44336',
          hasChevron: true,
          isDestructive: true,
          onPress: () => navigation.navigate('DeleteAccountScreen'),
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" type="material" color={appColors.grey1} size={24} />
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
        
        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Innerspark v1.0.0</Text>
          <Text style={styles.buildText}>Build 2024.03.001</Text>
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
  header: {
    backgroundColor: appColors.CardBackground,
    paddingTop: parameters.headerHeightS,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
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
