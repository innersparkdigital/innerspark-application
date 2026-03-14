/**
 * Profile Screen - Detailed user profile display and management
 */
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {
  StatusBar,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Avatar, Button } from '@rneui/base';
import { useToast } from 'native-base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import { appImages } from '../../global/Data';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';
import { getFullname } from '../../global/LHShortcuts';
import { getProfile as getClientProfile } from '../../api/client/profile';
import { setUserProfile } from '../../features/user/userDataSlice';
import ISAlert, { useISAlert } from '../../components/alerts/ISAlert';

// TypeScript interfaces
interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  image?: any;
  role?: string;
  bio?: string;
  gender?: string;
  dateJoined?: string;
  lastActive?: string;
}

interface ProfileScreenProps {
  navigation: any;
  route?: any;
}

// Skeleton loading component
const ProfileSkeleton = () => (
  <View style={styles.container}>
    <View style={styles.skeletonHeader}>
      <View style={styles.skeletonAvatar} />
      <View style={styles.skeletonTextContainer}>
        <View style={[styles.skeletonText, { width: '60%', height: scale(20) }]} />
        <View style={[styles.skeletonText, { width: '80%', height: scale(16), marginTop: scale(8) }]} />
      </View>
    </View>
    {[1, 2, 3, 4].map((item) => (
      <View key={item} style={styles.skeletonField}>
        <View style={[styles.skeletonText, { width: '30%', height: scale(14) }]} />
        <View style={[styles.skeletonText, { width: '70%', height: scale(16), marginTop: scale(8) }]} />
      </View>
    ))}
  </View>
);

// Profile field component
const ProfileField = ({
  label,
  value,
  icon,
  iconType = "material",
  isLast = false,
  onAdd
}: {
  label: string;
  value: string;
  icon: string;
  iconType?: string;
  isLast?: boolean;
  onAdd?: () => void;
}) => (
  <View style={[styles.profileField, isLast && styles.profileFieldLast]}>
    <View style={styles.fieldHeader}>
      <View style={styles.fieldLabelContainer}>
        <Icon
          type={iconType}
          name={icon}
          color={appColors.AppBlue}
          size={moderateScale(20)}
        />
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
    </View>
    {value ? (
      <Text style={styles.fieldValue}>{value}</Text>
    ) : onAdd ? (
      <TouchableOpacity 
        style={{ flexDirection: 'row', alignItems: 'center', marginTop: scale(4) }} 
        onPress={onAdd}
      >
        <Icon name="add-circle-outline" type="material" color={appColors.AppBlue} size={moderateScale(18)} />
        <Text style={{ marginLeft: scale(4), color: appColors.AppBlue, fontFamily: appFonts.bodyTextMedium, fontSize: moderateScale(14) }}>
          Add {label}
        </Text>
      </TouchableOpacity>
    ) : (
      <Text style={[styles.fieldValue, { color: appColors.AppGray }]}>Not set</Text>
    )}
  </View>
);

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const toast = useToast();
  const dispatch = useDispatch();
  const alert = useISAlert();
  const userDetails = useSelector((state: any) => state.userData.userDetails);
  const userProfile = useSelector((state: any) => state.userData.userProfile);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile>({});

  // Toast notifications
  const notifyWithToast = (description: string) => {
    toast.show({
      description: description,
      duration: 2000,
    });
  };

  // Load profile data
  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      const userId = userDetails?.userId;
      if (!userId) {
        setProfileData({
          firstName: userDetails?.firstName,
          lastName: userDetails?.lastName,
          email: userDetails?.email,
          phone: userDetails?.phone,
          role: userDetails?.role,
          bio: userDetails?.bio,
        });
        return;
      }

      const response = await getClientProfile(userId);
      const data = response?.data;

      if (data) {
        dispatch(setUserProfile(data));
        setProfileData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phoneNumber,
          bio: data.bio,
          gender: data.gender,
          dateJoined: data.joinedDate,
          role: userDetails?.role,
        });
      } else {
        setProfileData({
          firstName: userDetails?.firstName,
          lastName: userDetails?.lastName,
          email: userDetails?.email,
          phone: userDetails?.phone,
          role: userDetails?.role,
          bio: userDetails?.bio,
        });
      }
    } catch (error) {
      notifyWithToast('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh profile data
  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadProfileData();
    setIsRefreshing(false);
  };

  // Handle field edit
  const handleEditField = (field: string) => {
    navigation.navigate('ProfileUpdateScreen', {
      editField: field,
      currentData: profileData
    });
  };

  // Handle avatar update
  const handleAvatarUpdate = () => {
    alert.show({
      type: 'info',
      title: 'Update Profile Photo',
      message: 'Avatar upload feature coming soon!',
      confirmText: 'OK',
    });
  };

  // Sync local state from Redux userProfile whenever screen gains focus
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
          dateJoined: userProfile.joinedDate,
          role: userDetails?.role,
        });
        setIsLoading(false);
      } else {
        loadProfileData();
      }
    }, [userProfile])
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ISStatusBar backgroundColor={appColors.AppBlue} />
        <ISGenericHeader
          title="Profile"
          navigation={navigation}
        />
        <ProfileSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar backgroundColor={appColors.AppBlue} />

      <ISGenericHeader
        title="Profile"
        navigation={navigation}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[appColors.AppBlue]}
            tintColor={appColors.AppBlue}
          />
        }
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={handleAvatarUpdate} style={styles.avatarContainer}>
            <Avatar
              rounded
              size={scale(120)}
              source={(userProfile?.profileImage || userDetails?.image) ? { uri: userProfile?.profileImage || userDetails?.image } : undefined}
              icon={!(userProfile?.profileImage || userDetails?.image) ? { name: 'person', type: 'material', size: scale(80), color: appColors.CardBackground } : undefined}
              containerStyle={[styles.avatarStyle, { backgroundColor: appColors.grey5 }]}
              avatarStyle={{ resizeMode: 'cover' }}
            />
            <View style={styles.avatarEditOverlay}>
              <Icon
                type="material"
                name="camera-alt"
                color={appColors.CardBackground}
                size={moderateScale(20)}
              />
            </View>
          </TouchableOpacity>

          <Text style={styles.userName}>
            {getFullname(profileData.firstName || '', profileData.lastName || '')}
          </Text>

          {/* header meta data */}
          {/* Header meta data is hidden for now */}
          {/* <View style={styles.metaDataContainer}>
            <Text style={styles.userRole}>{profileData.role}</Text>
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Active now</Text>
            </View>
          </View> */}

        </View>

        {/* Profile Information */}
        <View style={styles.profileSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => navigation.navigate('ProfileUpdateScreen')}
            >
              <Icon name="edit" type="material" color={appColors.AppBlue} size={moderateScale(18)} />
              <Text style={styles.editProfileText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <ProfileField
            label="First Name"
            value={profileData.firstName || ''}
            icon="person"
          />

          <ProfileField
            label="Last Name"
            value={profileData.lastName || ''}
            icon="person-outline"
          />

          <ProfileField
            label="Email Address"
            value={profileData.email || ''}
            icon="email"
            onAdd={() => handleEditField('email')}
          />

          <ProfileField
            label="Phone Number"
            value={profileData.phone || ''}
            icon="phone"
            onAdd={() => handleEditField('phone')}
          />

          <ProfileField
            label="Gender"
            value={profileData.gender || ''}
            icon="person-outline"
          />

          <ProfileField
            label="Bio"
            value={profileData.bio || ''}
            icon="info"
            isLast={true}
          />
        </View>

        {/* Account Information */}
        <View style={styles.profileSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Account Information</Text>
          </View>

          <ProfileField
            label="Member Since"
            value={profileData.dateJoined || ''}
            icon="calendar-today"
          />

          {/* Last active field is hidden for now */}
          {/* 
          <ProfileField
            label="Last Active"
            value={profileData.lastActive || ''}
            icon="access-time"
            isLast={true}
          /> 
          */}
        </View>


        {/* Action Buttons */}
        {/* Action Buttons are hidden for now */}
        {/* <View style={styles.actionSection}>
          <Button
            title="Account Settings"
            buttonStyle={styles.settingsButton}
            titleStyle={styles.settingsButtonText}
            onPress={() => navigation.navigate('SettingsScreen')}
            icon={
              <Icon
                type="material"
                name="settings"
                color={appColors.AppBlue}
                size={20}
                style={{ marginRight: 8 }}
              />
            }
          />
        </View> 
        */}


        <View style={styles.bottomSpacing} />
      </ScrollView>
      <ISAlert ref={alert.ref} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: appColors.CardBackground,
    alignItems: 'center',
    paddingVertical: scale(30),
    paddingHorizontal: scale(20),
    marginBottom: scale(20),
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: scale(20),
  },
  avatarStyle: {
    borderWidth: scale(3),
    borderColor: appColors.AppBlue,
  },
  avatarEditOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: appColors.AppBlue,
    borderRadius: scale(20),
    width: scale(40),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: scale(3),
    borderColor: appColors.CardBackground,
  },
  userName: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: appColors.AppBlue,
    marginBottom: scale(8),
    fontFamily: appFonts.headerTextBold,
    textAlign: 'center',
  },
  metaDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(12),
  },
  userRole: {
    fontSize: moderateScale(16),
    color: appColors.AppGray,
    fontFamily: appFonts.bodyTextMedium,
    marginRight: scale(12),
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: '#4CAF50',
    marginRight: scale(6),
  },
  statusText: {
    fontSize: moderateScale(14),
    color: '#4CAF50',
    fontFamily: appFonts.bodyTextMedium,
  },
  profileSection: {
    backgroundColor: appColors.CardBackground,
    marginHorizontal: scale(20),
    borderRadius: scale(16),
    paddingVertical: scale(20),
    marginBottom: scale(20),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(15),
    paddingHorizontal: scale(20),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
    // paddingHorizontal: 0,
  },
  profileField: {
    paddingHorizontal: scale(20),
    paddingVertical: scale(15),
    borderBottomWidth: scale(0.5),
    borderBottomColor: appColors.AppLightGray,
  },
  profileFieldLast: {
    borderBottomWidth: 0,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  fieldLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: moderateScale(14),
    color: appColors.AppGray,
    fontFamily: appFonts.bodyTextMedium,
    marginLeft: scale(8),
  },
  fieldValue: {
    fontSize: moderateScale(16),
    color: '#333',
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: scale(22),
  },
  editButton: {
    padding: scale(8),
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(6),
    paddingHorizontal: scale(12),
    backgroundColor: appColors.AppBlue + '10',
    borderRadius: scale(8),
  },
  editProfileText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
    marginLeft: scale(4),
  },
  actionSection: {
    paddingHorizontal: scale(20),
    marginBottom: scale(20),
  },
  settingsButton: {
    backgroundColor: 'transparent',
    borderWidth: scale(1),
    borderColor: appColors.AppBlue,
    borderRadius: scale(12),
    paddingVertical: scale(15),
  },
  settingsButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextMedium,
  },
  bottomSpacing: {
    height: scale(40),
  },
  // Skeleton styles
  skeletonHeader: {
    backgroundColor: appColors.CardBackground,
    alignItems: 'center',
    paddingVertical: scale(30),
    paddingHorizontal: scale(20),
    marginBottom: scale(20),
  },
  skeletonAvatar: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    backgroundColor: appColors.AppLightGray,
    marginBottom: scale(20),
  },
  skeletonTextContainer: {
    alignItems: 'center',
    width: '100%',
  },
  skeletonText: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: scale(4),
  },
  skeletonField: {
    backgroundColor: appColors.CardBackground,
    marginHorizontal: scale(20),
    borderRadius: scale(16),
    padding: scale(20),
    marginBottom: scale(12),
  },
});
