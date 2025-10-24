/**
 * Privacy Settings Screen - Manage data sharing and privacy controls
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
import ISStatusBar from '../../components/ISStatusBar';
import ISGenericHeader from '../../components/ISGenericHeader';

interface PrivacySettingsScreenProps {
  navigation: NavigationProp<any>;
}

interface PrivacySetting {
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
  isImportant?: boolean;
}

const PrivacySettingsScreen: React.FC<PrivacySettingsScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Data Collection Settings
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [crashReportsEnabled, setCrashReportsEnabled] = useState(true);
  const [usageDataEnabled, setUsageDataEnabled] = useState(true);
  const [locationDataEnabled, setLocationDataEnabled] = useState(false);
  
  // Profile Visibility
  const [profilePublic, setProfilePublic] = useState(false);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [shareProgress, setShareProgress] = useState(false);
  
  // Communication Privacy
  const [allowMessages, setAllowMessages] = useState(true);
  const [allowGroupInvites, setAllowGroupInvites] = useState(true);
  const [shareContactInfo, setShareContactInfo] = useState(false);
  
  // Data Sharing
  const [shareWithTherapists, setShareWithTherapists] = useState(true);
  const [shareForResearch, setShareForResearch] = useState(false);
  const [shareWithPartners, setShareWithPartners] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.show({
        description: 'Privacy settings refreshed',
        duration: 2000,
      });
    }, 1000);
  };

  const handleAnalyticsToggle = (value: boolean) => {
    setAnalyticsEnabled(value);
    toast.show({
      description: value ? 'Analytics enabled' : 'Analytics disabled',
      duration: 2000,
    });
  };

  const handleLocationToggle = (value: boolean) => {
    if (value) {
      Alert.alert(
        'Enable Location Data',
        'This will help us provide location-based services like finding nearby therapists and support groups.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Enable',
            onPress: () => {
              setLocationDataEnabled(true);
              toast.show({
                description: 'Location data enabled',
                duration: 2000,
              });
            },
          },
        ]
      );
    } else {
      setLocationDataEnabled(false);
      toast.show({
        description: 'Location data disabled',
        duration: 2000,
      });
    }
  };

  const handleResearchSharingToggle = (value: boolean) => {
    if (value) {
      Alert.alert(
        'Share Data for Research',
        'Your anonymized data may be used for mental health research to improve services. No personal information will be shared.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Allow',
            onPress: () => {
              setShareForResearch(true);
              toast.show({
                description: 'Research data sharing enabled',
                duration: 2000,
              });
            },
          },
        ]
      );
    } else {
      setShareForResearch(false);
      toast.show({
        description: 'Research data sharing disabled',
        duration: 2000,
      });
    }
  };



  const profileVisibilitySettings: PrivacySetting[] = [
    {
      id: 'profile_public',
      title: 'Public Profile',
      subtitle: profilePublic ? 'Profile visible to other users' : 'Private profile',
      icon: 'public',
      iconColor: '#9C27B0',
      hasSwitch: true,
      switchValue: profilePublic,
      onSwitchChange: setProfilePublic,
    },
    {
      id: 'online_status',
      title: 'Show Online Status',
      subtitle: showOnlineStatus ? 'Others can see when you\'re online' : 'Hidden',
      icon: 'circle',
      iconColor: '#4CAF50',
      hasSwitch: true,
      switchValue: showOnlineStatus,
      onSwitchChange: setShowOnlineStatus,
    },
    {
      id: 'share_progress',
      title: 'Share Wellness Progress',
      subtitle: shareProgress ? 'Progress visible to support network' : 'Private',
      icon: 'trending-up',
      iconColor: '#00BCD4',
      hasSwitch: true,
      switchValue: shareProgress,
      onSwitchChange: setShareProgress,
    },
  ];

  const communicationSettings: PrivacySetting[] = [
    {
      id: 'allow_messages',
      title: 'Allow Messages',
      subtitle: allowMessages ? 'Anyone can message you' : 'Messages restricted',
      icon: 'message',
      iconColor: '#E91E63',
      hasSwitch: true,
      switchValue: allowMessages,
      onSwitchChange: setAllowMessages,
    },
    {
      id: 'group_invites',
      title: 'Group Invitations',
      subtitle: allowGroupInvites ? 'Can receive group invites' : 'No group invites',
      icon: 'group-add',
      iconColor: '#795548',
      hasSwitch: true,
      switchValue: allowGroupInvites,
      onSwitchChange: setAllowGroupInvites,
    },
    {
      id: 'contact_info',
      title: 'Share Contact Information',
      subtitle: shareContactInfo ? 'Contact info visible to connections' : 'Private',
      icon: 'contact-phone',
      iconColor: '#607D8B',
      hasSwitch: true,
      switchValue: shareContactInfo,
      onSwitchChange: setShareContactInfo,
    },
  ];


  const privacyActions: PrivacySetting[] = [
    {
      id: 'data_download',
      title: 'Download My Data',
      subtitle: 'Get a copy of your data',
      icon: 'download',
      iconColor: '#009688',
      hasChevron: true,
      onPress: () => navigation.navigate('DataExportScreen'),
    },
    {
      id: 'data_deletion',
      title: 'Delete My Data',
      subtitle: 'Request data deletion',
      icon: 'delete-forever',
      iconColor: '#F44336',
      hasChevron: true,
      onPress: () => navigation.navigate('DataDeletionScreen'),
    },
    {
      id: 'privacy_policy',
      title: 'Privacy Policy',
      subtitle: 'Read our privacy policy',
      icon: 'policy',
      iconColor: appColors.grey3,
      hasChevron: true,
      onPress: () => navigation.navigate('PrivacyPolicyScreen'),
    }

  ];

  const renderPrivacyItem = (item: PrivacySetting) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.privacyItem, item.isImportant && styles.importantItem]}
      onPress={item.onPress}
      activeOpacity={0.7}
      disabled={item.hasSwitch && !item.onPress}
    >
      <View style={styles.privacyItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: item.iconColor + '15' }]}>
          <Icon
            name={item.icon}
            type="material"
            color={item.iconColor || appColors.grey3}
            size={20}
          />
        </View>
        <View style={styles.privacyItemContent}>
          <Text style={styles.privacyTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={styles.privacySubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      
      <View style={styles.privacyItemRight}>
        {item.isImportant && (
          <Icon
            name="priority-high"
            type="material"
            color="#FF9800"
            size={16}
            style={styles.importantIcon}
          />
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

  const renderSection = (title: string, items: PrivacySetting[], description?: string) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {description && (
        <Text style={styles.sectionDescription}>{description}</Text>
      )}
      <View style={styles.sectionContent}>
        {items.map((item, index) => (
          <View key={item.id}>
            {renderPrivacyItem(item)}
            {index < items.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar backgroundColor={appColors.AppBlue} />
      <ISGenericHeader
        title="Privacy Settings"
        navigation={navigation}
      />

      {/* Privacy Status */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Icon name="privacy-tip" type="material" color="#4CAF50" size={24} />
          <Text style={styles.statusTitle}>Privacy Status</Text>
        </View>
        <Text style={styles.statusDescription}>
          Your privacy settings are configured to protect your personal information while enabling essential app features.
        </Text>
        <TouchableOpacity
          style={styles.privacyCheckButton}
          onPress={() => navigation.navigate('PrivacyCheckupScreen')}
        >
          <Text style={styles.privacyCheckText}>Run Privacy Checkup</Text>
          <Icon name="chevron-right" type="material" color={appColors.AppBlue} size={16} />
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
          'Profile Visibility',
          profileVisibilitySettings,
          'Manage who can see your profile and activity'
        )}
        
        {renderSection(
          'Communication',
          communicationSettings,
          'Control how others can contact and interact with you'
        )}
        
        {renderSection(
          'Privacy Tools',
          privacyActions,
          'Access your data and privacy controls'
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
  },
  placeholder: {
    width: 40,
  },
  statusCard: {
    backgroundColor: appColors.CardBackground,
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginLeft: 12,
  },
  statusDescription: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginBottom: 16,
    lineHeight: 20,
  },
  privacyCheckButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: appColors.AppBlue + '10',
    borderRadius: 8,
    padding: 12,
  },
  privacyCheckText: {
    fontSize: 14,
    color: appColors.AppBlue,
    fontWeight: '500',
    fontFamily: appFonts.headerTextMedium,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
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
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  importantItem: {
    backgroundColor: '#FFF3E0',
  },
  privacyItemLeft: {
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
  privacyItemContent: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextMedium,
    marginBottom: 2,
  },
  privacySubtitle: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  privacyItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  importantIcon: {
    marginRight: 8,
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

export default PrivacySettingsScreen;
