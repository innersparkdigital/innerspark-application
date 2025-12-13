/**
 * Account Settings Screen - Manage account actions and preferences
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import { NavigationProp } from '@react-navigation/native';
import ISGenericHeader from '../../components/ISGenericHeader';
import { useSelector } from 'react-redux';
import { getFullname } from '../../global/LHShortcuts';
import { useFocusEffect } from '@react-navigation/native';

interface AccountSettingsScreenProps {
  navigation: NavigationProp<any>;
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  bio?: string;
  gender?: string;
  joinedDate?: string;
  profileImage?: string;
}

interface AccountSetting {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  iconColor: string;
  hasChevron?: boolean;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onPress?: () => void;
  onSwitchChange?: (value: boolean) => void;
  isDestructive?: boolean;
}

const AccountSettingsScreen: React.FC<AccountSettingsScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const userDetails = useSelector((state: any) => state.userData.userDetails);
  const userProfile = useSelector((state: any) => state.userData.userProfile);
  
  const [loginAlertsEnabled, setLoginAlertsEnabled] = useState(true);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);

  // Sync profile data from Redux when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (userProfile) {
        setProfileData({
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          email: userProfile.email,
          phone: userProfile.phoneNumber,
          bio: userProfile.bio,
          gender: userProfile.gender,
          joinedDate: userProfile.joinedDate,
          profileImage: userProfile.profileImage,
        });
      }
    }, [userProfile])
  );

  // Format date for "Member since"
  const formatMemberSince = (dateString: string | null | undefined) => {
    if (!dateString) {
      const currentYear = new Date().getFullYear();
      return currentYear.toString();
    }
    
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch {
      const currentYear = new Date().getFullYear();
      return currentYear.toString();
    }
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePasswordScreen');
  };

  const handleDeactivateAccount = () => {
    navigation.navigate('DeactivateAccountScreen');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => navigation.navigate('DeleteAccountScreen'),
        },
      ]
    );
  };

  

// Security Settings
  const securitySettings: AccountSetting[] = [
    {
      id: 'change_password',
      title: 'Change Password',
      subtitle: 'Update your account password',
      icon: 'lock',
      iconColor: appColors.AppBlue,
      hasChevron: true,
      onPress: handleChangePassword,
    },
    
    
  ];

  const accountActions: AccountSetting[] = [
    {
      id: 'download_data',
      title: 'Download My Data',
      subtitle: 'Get a copy of your data',
      icon: 'download',
      iconColor: '#2196F3',
      hasChevron: true,
      onPress: () => navigation.navigate('DataExportScreen'),
    },
    {
      id: 'deactivate',
      title: 'Deactivate Account',
      subtitle: 'Temporarily disable your account',
      icon: 'pause-circle',
      iconColor: '#FF9800',
      hasChevron: true,
      onPress: handleDeactivateAccount,
    },
    {
      id: 'delete',
      title: 'Delete Account',
      subtitle: 'Permanently delete your account',
      icon: 'delete-forever',
      iconColor: '#F44336',
      hasChevron: true,
      onPress: handleDeleteAccount,
      isDestructive: true,
    },
  ];

  const renderSettingItem = (item: AccountSetting) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.settingItem, item.isDestructive && styles.destructiveItem]}
      onPress={item.onPress}
      activeOpacity={item.hasSwitch ? 1 : 0.7}
      disabled={item.hasSwitch}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: item.iconColor + '15' }]}>
          <Icon
            name={item.icon}
            type="material"
            color={item.iconColor}
            size={20}
          />
        </View>
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, item.isDestructive && styles.destructiveText]}>
            {item.title}
          </Text>
          {item.subtitle && (
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      
      <View style={styles.settingRight}>
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
            color={item.isDestructive ? '#F44336' : appColors.grey4}
            size={20}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ISGenericHeader
        title="Account Settings"
        navigation={navigation}
      />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Icon name="account-circle" type="material" color={appColors.AppBlue} size={48} />
          <View style={styles.infoContent}>
            <Text style={styles.infoName}>
              {getFullname(userProfile?.firstName || userDetails?.firstName, userProfile?.lastName || userDetails?.lastName) || 'User'}
            </Text>
            <Text style={styles.infoEmail}>
              {userProfile?.email || userDetails?.email || 'user@innersparkafrica.com'}
            </Text>
            <Text style={styles.infoMember}>
              Member since {formatMemberSince(profileData?.joinedDate)}
            </Text>
          </View>
        </View>

        {/* Security & Authentication */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SECURITY & AUTHENTICATION</Text>
          <View style={styles.sectionContent}>
            {securitySettings.map((item, index) => (
              <View key={item.id}>
                {renderSettingItem(item)}
                {index < securitySettings.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </View>
        </View>

        {/* Account Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT MANAGEMENT</Text>
          <View style={styles.sectionContent}>
            {accountActions.map((item, index) => (
              <View key={item.id}>
                {renderSettingItem(item)}
                {index < accountActions.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </View>
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
    backgroundColor: appColors.CardBackground,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoContent: {
    flex: 1,
    marginLeft: 16,
  },
  infoName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  infoEmail: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginBottom: 2,
  },
  infoMember: {
    fontSize: 13,
    color: appColors.grey4,
    fontFamily: appFonts.headerTextRegular,
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  destructiveItem: {
    backgroundColor: '#FFEBEE',
    marginHorizontal: -16,
    paddingHorizontal: 16,
    borderRadius: 8,
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
  destructiveText: {
    color: '#D32F2F',
  },
  settingSubtitle: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: appColors.grey6,
    marginVertical: 8,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  warningContent: {
    flex: 1,
    marginLeft: 12,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default AccountSettingsScreen;
