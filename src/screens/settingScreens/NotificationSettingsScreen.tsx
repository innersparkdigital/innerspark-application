/**
 * Notification Settings Screen - Manage all notification preferences
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

interface NotificationSettingsScreenProps {
  navigation: NavigationProp<any>;
}

interface NotificationSetting {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  iconColor?: string;
  hasSwitch?: boolean;
  switchValue?: boolean;
  hasChevron?: boolean;
  onPress?: () => void;
  onSwitchChange?: (value: boolean) => void;
  isEnabled?: boolean;
  category?: string;
}

const NotificationSettingsScreen: React.FC<NotificationSettingsScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // General Notifications
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  
  // Wellness Notifications
  const [moodReminders, setMoodReminders] = useState(true);
  const [therapyReminders, setTherapyReminders] = useState(true);
  const [wellnessGoals, setWellnessGoals] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  
  // Social Notifications
  const [messages, setMessages] = useState(true);
  const [groupUpdates, setGroupUpdates] = useState(true);
  const [eventInvites, setEventInvites] = useState(true);
  
  // System Notifications
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [systemUpdates, setSystemUpdates] = useState(false);
  const [promotions, setPromotions] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.show({
        description: 'Notification settings refreshed',
        duration: 2000,
      });
    }, 1000);
  };

  const handleMasterToggle = (type: 'push' | 'email' | 'sms', value: boolean) => {
    switch (type) {
      case 'push':
        setPushNotifications(value);
        if (!value) {
          // Disable all push-related notifications
          setMoodReminders(false);
          setTherapyReminders(false);
          setMessages(false);
          setSecurityAlerts(false);
        }
        break;
      case 'email':
        setEmailNotifications(value);
        break;
      case 'sms':
        setSmsNotifications(value);
        break;
    }
    
    toast.show({
      description: `${type.toUpperCase()} notifications ${value ? 'enabled' : 'disabled'}`,
      duration: 2000,
    });
  };

  const generalSettings: NotificationSetting[] = [
    {
      id: 'push_notifications',
      title: 'Push Notifications',
      subtitle: pushNotifications ? 'Enabled' : 'Disabled',
      icon: 'notifications',
      iconColor: appColors.AppBlue,
      hasSwitch: true,
      switchValue: pushNotifications,
      onSwitchChange: (value) => handleMasterToggle('push', value),
    },
    {
      id: 'email_notifications',
      title: 'Email Notifications',
      subtitle: emailNotifications ? 'Enabled' : 'Disabled',
      icon: 'email',
      iconColor: '#4CAF50',
      hasSwitch: true,
      switchValue: emailNotifications,
      onSwitchChange: (value) => handleMasterToggle('email', value),
    },
    {
      id: 'sms_notifications',
      title: 'SMS Notifications',
      subtitle: smsNotifications ? 'Enabled' : 'Disabled',
      icon: 'sms',
      iconColor: '#FF9800',
      hasSwitch: true,
      switchValue: smsNotifications,
      onSwitchChange: (value) => handleMasterToggle('sms', value),
    },
  ];

  const wellnessSettings: NotificationSetting[] = [
    {
      id: 'mood_reminders',
      title: 'Mood Check-in Reminders',
      subtitle: moodReminders ? 'Daily at 8:00 PM' : 'Disabled',
      icon: 'mood',
      iconColor: '#E91E63',
      hasSwitch: true,
      switchValue: moodReminders && pushNotifications,
      onSwitchChange: setMoodReminders,
      isEnabled: pushNotifications,
      onPress: () => moodReminders && navigation.navigate('MoodReminderSettingsScreen'),
    },
    {
      id: 'therapy_reminders',
      title: 'Therapy Appointment Reminders',
      subtitle: therapyReminders ? '1 hour before appointments' : 'Disabled',
      icon: 'event',
      iconColor: '#2196F3',
      hasSwitch: true,
      switchValue: therapyReminders && pushNotifications,
      onSwitchChange: setTherapyReminders,
      isEnabled: pushNotifications,
    },
    {
      id: 'wellness_goals',
      title: 'Wellness Goal Updates',
      subtitle: wellnessGoals ? 'Progress notifications enabled' : 'Disabled',
      icon: 'flag',
      iconColor: '#4CAF50',
      hasSwitch: true,
      switchValue: wellnessGoals && pushNotifications,
      onSwitchChange: setWellnessGoals,
      isEnabled: pushNotifications,
    },
    {
      id: 'weekly_reports',
      title: 'Weekly Wellness Reports',
      subtitle: weeklyReports ? 'Every Sunday at 6:00 PM' : 'Disabled',
      icon: 'assessment',
      iconColor: '#9C27B0',
      hasSwitch: true,
      switchValue: weeklyReports,
      onSwitchChange: setWeeklyReports,
    },
  ];

  const socialSettings: NotificationSetting[] = [
    {
      id: 'messages',
      title: 'Messages & Chats',
      subtitle: messages ? 'New message notifications' : 'Disabled',
      icon: 'chat',
      iconColor: '#00BCD4',
      hasSwitch: true,
      switchValue: messages && pushNotifications,
      onSwitchChange: setMessages,
      isEnabled: pushNotifications,
    },
    {
      id: 'group_updates',
      title: 'Group Updates',
      subtitle: groupUpdates ? 'Group activity notifications' : 'Disabled',
      icon: 'group',
      iconColor: '#795548',
      hasSwitch: true,
      switchValue: groupUpdates && pushNotifications,
      onSwitchChange: setGroupUpdates,
      isEnabled: pushNotifications,
    },
    {
      id: 'event_invites',
      title: 'Event Invitations',
      subtitle: eventInvites ? 'New event notifications' : 'Disabled',
      icon: 'event-available',
      iconColor: '#FF5722',
      hasSwitch: true,
      switchValue: eventInvites && pushNotifications,
      onSwitchChange: setEventInvites,
      isEnabled: pushNotifications,
    },
  ];

  const systemSettings: NotificationSetting[] = [
    {
      id: 'security_alerts',
      title: 'Security Alerts',
      subtitle: securityAlerts ? 'Login and security notifications' : 'Disabled',
      icon: 'security',
      iconColor: '#F44336',
      hasSwitch: true,
      switchValue: securityAlerts,
      onSwitchChange: setSecurityAlerts,
    },
    {
      id: 'system_updates',
      title: 'App Updates',
      subtitle: systemUpdates ? 'New feature announcements' : 'Disabled',
      icon: 'system-update',
      iconColor: '#607D8B',
      hasSwitch: true,
      switchValue: systemUpdates,
      onSwitchChange: setSystemUpdates,
    },
    {
      id: 'promotions',
      title: 'Promotions & Offers',
      subtitle: promotions ? 'Special offers and discounts' : 'Disabled',
      icon: 'local-offer',
      iconColor: '#FFC107',
      hasSwitch: true,
      switchValue: promotions,
      onSwitchChange: setPromotions,
    },
  ];

  const quickActions: NotificationSetting[] = [
    {
      id: 'notification_history',
      title: 'Notification History',
      subtitle: 'View recent notifications',
      icon: 'history',
      iconColor: appColors.grey3,
      hasChevron: true,
      onPress: () => navigation.navigate('NotificationHistoryScreen'),
    },
    {
      id: 'quiet_hours',
      title: 'Quiet Hours',
      subtitle: 'Set do not disturb schedule',
      icon: 'do-not-disturb',
      iconColor: '#9C27B0',
      hasChevron: true,
      onPress: () => navigation.navigate('QuietHoursScreen'),
    },
    {
      id: 'notification_sounds',
      title: 'Sounds & Vibration',
      subtitle: 'Customize notification sounds',
      icon: 'volume-up',
      iconColor: '#FF9800',
      hasChevron: true,
      onPress: () => navigation.navigate('NotificationSoundsScreen'),
    },
  ];

  const renderNotificationItem = (item: NotificationSetting) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.notificationItem,
        item.isEnabled === false && styles.disabledItem
      ]}
      onPress={item.onPress}
      activeOpacity={0.7}
      disabled={item.hasSwitch && !item.onPress}
    >
      <View style={styles.notificationItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: item.iconColor + '15' }]}>
          <Icon
            name={item.icon}
            type="material"
            color={item.isEnabled === false ? appColors.grey4 : item.iconColor || appColors.grey3}
            size={20}
          />
        </View>
        <View style={styles.notificationItemContent}>
          <Text style={[
            styles.notificationTitle,
            item.isEnabled === false && styles.disabledText
          ]}>
            {item.title}
          </Text>
          {item.subtitle && (
            <Text style={[
              styles.notificationSubtitle,
              item.isEnabled === false && styles.disabledSubtitle
            ]}>
              {item.subtitle}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.notificationItemRight}>
        {item.hasSwitch && (
          <Switch
            value={item.switchValue}
            onValueChange={item.onSwitchChange}
            trackColor={{ false: appColors.grey5, true: appColors.AppBlue + '40' }}
            thumbColor={item.switchValue ? appColors.AppBlue : appColors.grey4}
            disabled={item.isEnabled === false}
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

  const renderSection = (title: string, items: NotificationSetting[], description?: string) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {description && (
        <Text style={styles.sectionDescription}>{description}</Text>
      )}
      <View style={styles.sectionContent}>
        {items.map((item, index) => (
          <View key={item.id}>
            {renderNotificationItem(item)}
            {index < items.length - 1 && <View style={styles.separator} />}
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
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity
          style={styles.testButton}
          onPress={() => {
            toast.show({
              description: 'Test notification sent!',
              duration: 2000,
            });
          }}
        >
          <Icon name="send" type="material" color={appColors.AppBlue} size={20} />
        </TouchableOpacity>
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
        {renderSection(
          'General',
          generalSettings,
          'Control how you receive notifications from the app'
        )}
        
        {renderSection(
          'Wellness & Health',
          wellnessSettings,
          'Stay on track with your mental health journey'
        )}
        
        {renderSection(
          'Social & Community',
          socialSettings,
          'Connect with your support network and community'
        )}
        
        {renderSection(
          'System & Security',
          systemSettings,
          'Important updates and security notifications'
        )}
        
        {renderSection(
          'Advanced',
          quickActions,
          'Customize your notification experience'
        )}

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
    flex: 1,
    textAlign: 'center',
  },
  testButton: {
    padding: 8,
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
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionDescription: {
    fontSize: 12,
    color: appColors.grey4,
    fontFamily: appFonts.headerTextRegular,
    marginHorizontal: 20,
    marginBottom: 8,
    lineHeight: 16,
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
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  disabledItem: {
    opacity: 0.5,
  },
  notificationItemLeft: {
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
  notificationItemContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextMedium,
    marginBottom: 2,
  },
  disabledText: {
    color: appColors.grey4,
  },
  notificationSubtitle: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  disabledSubtitle: {
    color: appColors.grey5,
  },
  notificationItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: appColors.grey6,
    marginLeft: 64,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default NotificationSettingsScreen;
