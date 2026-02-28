/**
 * Security Settings Screen 
 * - Manage password, biometric authentication, and security options
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import { useToast } from 'native-base';
import { useSelector } from 'react-redux';
import { NavigationProp } from '@react-navigation/native';
import ISStatusBar from '../../components/ISStatusBar';
import ISGenericHeader from '../../components/ISGenericHeader';
import { getUserSettings } from '../../api/client/settings';
import ISAlert, { useISAlert } from '../../components/alerts/ISAlert';

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
  const alert = useISAlert();
  const userId = useSelector((state: any) => state.userData.userDetails.userId);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);


  useEffect(() => {
    fetchSecuritySettings();
  }, [userId]);

  const fetchSecuritySettings = async () => {
    try {
      const response = await getUserSettings(userId);

      if (response.success && response.data) {
        const settings = response.data;

        setBiometricEnabled(settings.security?.biometricEnabled ?? true);
        setTwoFactorEnabled(settings.security?.twoFactorEnabled ?? false);

      }
    } catch (error) {
      console.error('Error fetching security settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchSecuritySettings();
      toast.show({
        description: 'Security settings refreshed',
        duration: 2000,
      });
    } catch (error) {
      toast.show({
        description: 'Failed to refresh settings',
        duration: 2000,
      });
    } finally {
      setIsRefreshing(false);
    }
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
      alert.show({
        type: 'confirm',
        title: 'Enable Two-Factor Authentication',
        message: 'You will need to verify your identity with a second factor (SMS or authenticator app) when logging in.',
        confirmText: 'Enable',
        cancelText: 'Cancel',
        onConfirm: () => {
          setTwoFactorEnabled(true);
          navigation.navigate('TwoFactorSetupScreen');
        },
      });
    } else {
      alert.show({
        type: 'warning',
        title: 'Disable Two-Factor Authentication',
        message: 'This will make your account less secure. Are you sure?',
        confirmText: 'Disable',
        cancelText: 'Cancel',
        onConfirm: () => {
          setTwoFactorEnabled(false);
          toast.show({
            description: 'Two-factor authentication disabled',
            duration: 2000,
          });
        },
      });
    }
  };



  // Security Settings 
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

        <View style={styles.bottomSpacing} />
      </ScrollView>
      <ISAlert ref={alert.ref} />
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
    paddingBottom: scale(15),
    paddingHorizontal: scale(20),
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
    padding: scale(8),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  placeholder: {
    width: scale(40),
  },
  statusCard: {
    backgroundColor: appColors.CardBackground,
    margin: scale(20),
    padding: scale(20),
    borderRadius: scale(16),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  statusTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginLeft: scale(12),
  },
  statusDescription: {
    fontSize: moderateScale(14),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginBottom: scale(16),
    lineHeight: scale(20),
  },
  statusIndicators: {
    flexDirection: 'column',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  statusIndicatorText: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: scale(8),
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: scale(20),
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
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
  },
  securityItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  securityItemContent: {
    flex: 1,
  },
  securityTitle: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextMedium,
    marginBottom: scale(2),
  },
  securitySubtitle: {
    fontSize: moderateScale(14),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  securityItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: appColors.AppBlue,
    borderRadius: scale(10),
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    marginRight: scale(8),
  },
  badgeText: {
    fontSize: moderateScale(12),
    color: '#FFF',
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  separator: {
    height: 1,
    backgroundColor: appColors.grey6,
    marginLeft: scale(64),
  },
  bottomSpacing: {
    height: scale(20),
  },
});

export default SecuritySettingsScreen;
