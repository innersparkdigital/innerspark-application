/**
 * Profile Screen - Detailed user profile display and management
 */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  StatusBar,
  ScrollView,
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Avatar, Button } from '@rneui/base';
import { useToast } from 'native-base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { appImages } from '../../global/Data';
import LHGenericHeader from '../../components/LHGenericHeader';
import { getFullname } from '../../global/LHShortcuts';

// TypeScript interfaces
interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  image?: any;
  role?: string;
  bio?: string;
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
        <View style={[styles.skeletonText, { width: '60%', height: 20 }]} />
        <View style={[styles.skeletonText, { width: '80%', height: 16, marginTop: 8 }]} />
      </View>
    </View>
    {[1, 2, 3, 4].map((item) => (
      <View key={item} style={styles.skeletonField}>
        <View style={[styles.skeletonText, { width: '30%', height: 14 }]} />
        <View style={[styles.skeletonText, { width: '70%', height: 16, marginTop: 8 }]} />
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
  onEdit, 
  isEditable = true,
  isLast = false 
}: {
  label: string;
  value: string;
  icon: string;
  iconType?: string;
  onEdit?: () => void;
  isEditable?: boolean;
  isLast?: boolean;
}) => (
  <View style={[styles.profileField, isLast && styles.profileFieldLast]}>
    <View style={styles.fieldHeader}>
      <View style={styles.fieldLabelContainer}>
        <Icon 
          type={iconType} 
          name={icon} 
          color={appColors.AppBlue} 
          size={20} 
        />
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      {isEditable && (
        <TouchableOpacity onPress={onEdit} style={styles.editButton}>
          <Icon 
            type="material" 
            name="edit" 
            color={appColors.AppBlue} 
            size={18} 
          />
        </TouchableOpacity>
      )}
    </View>
    <Text style={styles.fieldValue}>{value || 'Not provided'}</Text>
  </View>
);

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const toast = useToast();
  const userDetails = useSelector((state: any) => state.userData.userDetails);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile>({});

  // Mock user data for demonstration
  const mockUserData: UserProfile = {
    firstName: userDetails?.firstName || 'Jane',
    lastName: userDetails?.lastName || 'Doe',
    email: userDetails?.email || 'jane.doe@example.com',
    phone: userDetails?.phone || '+256 700 123 456',
    role: userDetails?.role || 'Premium Member',
    bio: userDetails?.bio || 'Mental health advocate and wellness enthusiast. Passionate about mindfulness and personal growth.',
    dateJoined: 'March 2024',
    lastActive: 'Today at 2:30 PM',
  };

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProfileData(mockUserData);
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
    Alert.alert(
      'Update Profile Photo',
      'Avatar upload feature coming soon!',
      [{ text: 'OK' }]
    );
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={appColors.AppBlue} barStyle="light-content" />
        <LHGenericHeader
          title="Profile"
          subtitle="Loading..."
          showLeftIcon={true}
          leftIconPressed={() => navigation.goBack()}
          leftIconName="chevron-left"
          leftIconType="material"
          rightIcon="settings"
          rightIconPressed={() => navigation.navigate('SettingsScreen')}
        />
        <ProfileSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={appColors.AppBlue} barStyle="light-content" />
      
      <LHGenericHeader
        title="Profile"
        subtitle="Manage your profile information"
        showLeftIcon={true}
        leftIconPressed={() => navigation.goBack()}
        leftIconName="chevron-left"
        leftIconType="material"
        rightIcon="settings"
        rightIconPressed={() => navigation.navigate('SettingsScreen')}
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
              size={120} 
              source={userDetails?.image || appImages.avatarDefault}
              containerStyle={styles.avatarStyle}
            />
            <View style={styles.avatarEditOverlay}>
              <Icon 
                type="material" 
                name="camera-alt" 
                color={appColors.CardBackground} 
                size={20} 
              />
            </View>
          </TouchableOpacity>
          
          <Text style={styles.userName}>
            {getFullname(profileData.firstName, profileData.lastName)}
          </Text>
          
          <Text style={styles.userRole}>{profileData.role}</Text>
          
          <View style={styles.statusContainer}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Active now</Text>
          </View>
        </View>

        {/* Profile Information */}
        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <ProfileField
            label="First Name"
            value={profileData.firstName || ''}
            icon="person"
            onEdit={() => handleEditField('firstName')}
          />
          
          <ProfileField
            label="Last Name"
            value={profileData.lastName || ''}
            icon="person-outline"
            onEdit={() => handleEditField('lastName')}
          />
          
          <ProfileField
            label="Email Address"
            value={profileData.email || ''}
            icon="email"
            onEdit={() => handleEditField('email')}
          />
          
          <ProfileField
            label="Phone Number"
            value={profileData.phone || ''}
            icon="phone"
            onEdit={() => handleEditField('phone')}
          />
          
          <ProfileField
            label="Bio"
            value={profileData.bio || ''}
            icon="info"
            onEdit={() => handleEditField('bio')}
            isLast={true}
          />
        </View>

        {/* Account Information */}
        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <ProfileField
            label="Member Since"
            value={profileData.dateJoined || ''}
            icon="calendar-today"
            isEditable={false}
          />
          
          <ProfileField
            label="Last Active"
            value={profileData.lastActive || ''}
            icon="access-time"
            isEditable={false}
            isLast={true}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <Button
            title="Edit Profile"
            buttonStyle={styles.editProfileButton}
            titleStyle={styles.editProfileButtonText}
            onPress={() => navigation.navigate('ProfileUpdateScreen', { currentData: profileData })}
            icon={
              <Icon
                type="material"
                name="edit"
                color={appColors.CardBackground}
                size={20}
                style={{ marginRight: 8 }}
              />
            }
          />
          
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

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatarStyle: {
    borderWidth: 3,
    borderColor: appColors.AppBlue,
  },
  avatarEditOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: appColors.AppBlue,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: appColors.CardBackground,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    marginBottom: 8,
    fontFamily: appFonts.headerTextBold,
    textAlign: 'center',
  },
  userRole: {
    fontSize: 16,
    color: appColors.AppGray,
    marginBottom: 12,
    fontFamily: appFonts.bodyTextMedium,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#4CAF50',
    fontFamily: appFonts.bodyTextMedium,
  },
  profileSection: {
    backgroundColor: appColors.CardBackground,
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontFamily: appFonts.headerTextBold,
  },
  profileField: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: appColors.AppLightGray,
  },
  profileFieldLast: {
    borderBottomWidth: 0,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 14,
    color: appColors.AppGray,
    fontFamily: appFonts.bodyTextMedium,
    marginLeft: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: 22,
  },
  editButton: {
    padding: 8,
  },
  actionSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  editProfileButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 12,
    paddingVertical: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  editProfileButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: appFonts.bodyTextMedium,
  },
  settingsButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: appColors.AppBlue,
    borderRadius: 12,
    paddingVertical: 15,
  },
  settingsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextMedium,
  },
  bottomSpacing: {
    height: 40,
  },
  // Skeleton styles
  skeletonHeader: {
    backgroundColor: appColors.CardBackground,
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  skeletonAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: appColors.AppLightGray,
    marginBottom: 20,
  },
  skeletonTextContainer: {
    alignItems: 'center',
    width: '100%',
  },
  skeletonText: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: 4,
  },
  skeletonField: {
    backgroundColor: appColors.CardBackground,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
});
