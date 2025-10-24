/**
 * Security Settings Screen - Manage password, biometric authentication, and security options
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

interface SecuritySettingsScreenProps {
  navigation: NavigationProp<any>;
}

interface SecuritySetting {
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
  badge?: string;
  isEnabled?: boolean;
}

const SecuritySettingsScreen: React.FC<SecuritySettingsScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [autoLockEnabled, setAutoLockEnabled] = useState(true);
  const [sessionTimeoutEnabled, setSessionTimeoutEnabled] = useState(true);
  const [loginAlertsEnabled, setLoginAlertsEnabled] = useState(true);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.show({
        description: 'Security settings refreshed',
        duration: 2000,
      });
    }, 1000);
  };

  const handleBiometricToggle = (value: boolean) => {
    setBiometricEnabled(value);
    toast.show({
      description: value ? 'Biometric authentication enabled' : 'Biometric authentication disabled',
      duration: 2000,
    });
  };

  const handleTwoFactorToggle = (value: boolean) => {
    if (value) {
      Alert.alert(
        'Enable Two-Factor Authentication',
        'You will need to verify your identity with a second factor (SMS or authenticator app) when logging in.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Enable',
            onPress: () => {
              setTwoFactorEnabled(true);
              navigation.navigate('TwoFactorSetupScreen');
            },
          },
        ]
      );
    } else {
      Alert.alert(
        'Disable Two-Factor Authentication',
        'This will make your account less secure. Are you sure?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: () => {
              setTwoFactorEnabled(false);
              toast.show({
                description: 'Two-factor authentication disabled',
                duration: 2000,
              });
            },
          },
        ]
      );
    }
  };

  const handleAutoLockToggle = (value: boolean) => {
    setAutoLockEnabled(value);
    toast.show({
      description: value ? 'Auto-lock enabled' : 'Auto-lock disabled',
      duration: 2000,
    });
  };

  const handleSessionTimeoutToggle = (value: boolean) => {
    setSessionTimeoutEnabled(value);
    toast.show({
      description: value ? 'Session timeout enabled' : 'Session timeout disabled',
      duration: 2000,
    });
  };

  const handleLoginAlertsToggle = (value: boolean) => {
    setLoginAlertsEnabled(value);
    toast.show({
      description: value ? 'Login alerts enabled' : 'Login alerts disabled',
      duration: 2000,
    });
  };

  const securitySettings: SecuritySetting[] = [
    {
      id: 'change_password',
      title: 'Change Password',
      subtitle: 'Update your account password',
      icon: 'lock',
      iconColor: appColors.AppBlue,
      hasChevron: true,
      onPress: () => navigation.navigate('ChangePasswordScreen'),
    },
    {
      id: 'biometric',
      title: 'Biometric Authentication',
      subtitle: biometricEnabled ? 'Face ID / Fingerprint enabled' : 'Disabled',
      icon: 'fingerprint',
      iconColor: '#4CAF50',
      hasSwitch: true,
      switchValue: biometricEnabled,
      onSwitchChange: handleBiometricToggle,
    },
    {
      id: 'two_factor',
      title: 'Two-Factor Authentication',
      subtitle: twoFactorEnabled ? 'Enabled' : 'Disabled',
      icon: 'security',
      iconColor: '#FF9800',
      hasSwitch: true,
      switchValue: twoFactorEnabled,
      onSwitchChange: handleTwoFactorToggle,
    },
    {
      id: 'auto_lock',
      title: 'Auto-Lock',
      subtitle: autoLockEnabled ? 'Lock after 5 minutes' : 'Disabled',
      icon: 'screen-lock-portrait',
      iconColor: '#2196F3',
      hasSwitch: true,
      switchValue: autoLockEnabled,
      onSwitchChange: handleAutoLockToggle,
      onPress: () => autoLockEnabled && navigation.navigate('AutoLockSettingsScreen'),
    },
    {
      id: 'session_timeout',
      title: 'Session Timeout',
      subtitle: sessionTimeoutEnabled ? 'Auto logout after 30 minutes' : 'Disabled',
      icon: 'timer',
      iconColor: '#9C27B0',
      hasSwitch: true,
      switchValue: sessionTimeoutEnabled,
      onSwitchChange: handleSessionTimeoutToggle,
    },
    {
      id: 'login_alerts',
      title: 'Login Alerts',
      subtitle: loginAlertsEnabled ? 'Get notified of new logins' : 'Disabled',
      icon: 'notifications-active',
      iconColor: '#E91E63',
      hasSwitch: true,
      switchValue: loginAlertsEnabled,
      onSwitchChange: handleLoginAlertsToggle,
    },
  ];

  const securityActions: SecuritySetting[] = [
    {
      id: 'active_sessions',
      title: 'Active Sessions',
      subtitle: '3 active sessions',
      icon: 'devices',
      iconColor: '#607D8B',
      hasChevron: true,
      onPress: () => navigation.navigate('ActiveSessionsScreen'),
    },
    {
      id: 'login_history',
      title: 'Login History',
      subtitle: 'View recent login activity',
      icon: 'history',
      iconColor: '#795548',
      hasChevron: true,
      onPress: () => navigation.navigate('LoginHistoryScreen'),
    },
    {
      id: 'security_checkup',
      title: 'Security Checkup',
      subtitle: 'Review your security settings',
      icon: 'verified-user',
      iconColor: '#4CAF50',
      hasChevron: true,
      onPress: () => navigation.navigate('SecurityCheckupScreen'),
    },
    {
      id: 'trusted_devices',
      title: 'Trusted Devices',
      subtitle: '2 trusted devices',
      icon: 'verified',
      iconColor: '#009688',
      hasChevron: true,
      onPress: () => navigation.navigate('TrustedDevicesScreen'),
    },
  ];

  const emergencyActions: SecuritySetting[] = [
    {
      id: 'recovery_options',
      title: 'Account Recovery',
      subtitle: 'Set up recovery methods',
      icon: 'restore',
      iconColor: '#FF5722',
      hasChevron: true,
      onPress: () => navigation.navigate('AccountRecoveryScreen'),
    },
    {
      id: 'emergency_access',
      title: 'Emergency Access',
      subtitle: 'Grant access to trusted contacts',
      icon: 'emergency',
      iconColor: '#F44336',
      hasChevron: true,
      onPress: () => navigation.navigate('EmergencyAccessScreen'),
    },
  ];

  const renderSecurityItem = (item: SecuritySetting) => (
    <TouchableOpacity
      key={item.id}
      style={styles.securityItem}
      onPress={item.onPress}
      activeOpacity={0.7}
      disabled={item.hasSwitch && !item.onPress}
    >
      <View style={styles.securityItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: item.iconColor + '15' }]}>
          <Icon
            name={item.icon}
            type="material"
            color={item.iconColor || appColors.grey3}
            size={20}
          />
        </View>
        <View style={styles.securityItemContent}>
          <Text style={styles.securityTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={styles.securitySubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      
      <View style={styles.securityItemRight}>
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

  const renderSection = (title: string, items: SecuritySetting[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {items.map((item, index) => (
          <View key={item.id}>
            {renderSecurityItem(item)}
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
        title="Security Settings"
        navigation={navigation}
      />

      {/* Security Status */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Icon name="shield" type="material" color="#4CAF50" size={24} />
          <Text style={styles.statusTitle}>Security Status</Text>
        </View>
        <Text style={styles.statusDescription}>
          Your account is well protected with strong security measures.
        </Text>
        <View style={styles.statusIndicators}>
          <View style={styles.statusIndicator}>
            <Icon name="check-circle" type="material" color="#4CAF50" size={16} />
            <Text style={styles.statusIndicatorText}>Strong Password</Text>
          </View>
          <View style={styles.statusIndicator}>
            <Icon name="check-circle" type="material" color="#4CAF50" size={16} />
            <Text style={styles.statusIndicatorText}>Biometric Enabled</Text>
          </View>
          <View style={styles.statusIndicator}>
            <Icon name="warning" type="material" color="#FF9800" size={16} />
            <Text style={styles.statusIndicatorText}>2FA Recommended</Text>
          </View>
        </View>
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
        {renderSection('Authentication', securitySettings)}
        {renderSection('Security Monitoring', securityActions)}
        {renderSection('Emergency & Recovery', emergencyActions)}

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
  statusIndicators: {
    flexDirection: 'column',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIndicatorText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: 8,
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
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  securityItemLeft: {
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
  securityItemContent: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextMedium,
    marginBottom: 2,
  },
  securitySubtitle: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  securityItemRight: {
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
  bottomSpacing: {
    height: 20,
  },
});

export default SecuritySettingsScreen;
