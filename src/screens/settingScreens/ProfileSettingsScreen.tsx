/**
 * Profile Settings Screen - Manage personal information and profile details
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import { useToast } from 'native-base';
import { useSelector } from 'react-redux';
import { NavigationProp } from '@react-navigation/native';
import { updateProfile } from '../../api/client/profile';
import ISAlert, { useISAlert } from '../../components/alerts/ISAlert';

interface ProfileSettingsScreenProps {
  navigation: NavigationProp<any>;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  location: string;
  bio: string;
  emergencyContact: string;
  emergencyPhone: string;
  avatar: string;
}

const ProfileSettingsScreen: React.FC<ProfileSettingsScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const alert = useISAlert();
  const userId = useSelector((state: any) => state.userData.userDetails.userId);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+256-700-123-456',
    dateOfBirth: '1990-05-15',
    gender: 'Male',
    location: 'Kampala, Uganda',
    bio: 'Mental health advocate and wellness enthusiast. Passionate about helping others on their journey to better mental health.',
    emergencyContact: 'Jane Doe',
    emergencyPhone: '+256-700-789-012',
    avatar: '',
  });

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await updateProfile(userId, {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phoneNumber: profileData.phone,
        bio: profileData.bio,
      }, undefined, undefined, undefined);

      if (response.success) {
        setHasChanges(false);
        toast.show({
          description: response.message || 'Profile updated successfully',
          duration: 3000,
        });
      } else {
        toast.show({
          description: response.message || 'Failed to update profile',
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.show({
        description: error.response?.data?.message || 'Failed to update profile',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeAvatar = () => {
    alert.show({
      type: 'info',
      title: 'Change Profile Picture',
      message: 'Choose an option',
      actions: [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Camera', onPress: () => toast.show({ description: 'Opening camera...' }) },
        { text: 'Photo Library', onPress: () => toast.show({ description: 'Opening photo library...' }) },
      ],
    });
  };

  const handleDeleteAccount = () => {
    alert.show({
      type: 'destructive',
      title: 'Delete Account',
      message: 'This action cannot be undone. All your data will be permanently deleted.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => navigation.navigate('DeleteAccountScreen'),
    });
  };

  const renderInputField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder?: string,
    multiline?: boolean,
    keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric',
    editable: boolean = true
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[
          styles.textInput,
          multiline && styles.multilineInput,
          !editable && styles.disabledInput
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={appColors.grey4}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        keyboardType={keyboardType}
        editable={editable}
      />
    </View>
  );

  const renderSelectField = (
    label: string,
    value: string,
    onPress: () => void,
    placeholder?: string
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity style={styles.selectInput} onPress={onPress}>
        <Text style={[styles.selectText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <Icon name="chevron-right" type="material" color={appColors.grey4} size={moderateScale(20)} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (hasChanges) {
              alert.show({
                type: 'warning',
                title: 'Unsaved Changes',
                message: 'You have unsaved changes. Do you want to save before leaving?',
                actions: [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
                  { text: 'Save', onPress: handleSave },
                ],
              });
            } else {
              navigation.goBack();
            }
          }}
        >
          <Icon name="arrow-back" type="material" color={appColors.grey1} size={moderateScale(24)} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Settings</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={!hasChanges || isLoading}
        >
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

          <View style={{ paddingVertical: 10 }}></View>

          {/* Account Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Actions</Text>
            <View style={styles.sectionContent}>
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => navigation.navigate('ChangePasswordScreen')}
              >
                <View style={styles.actionLeft}>
                  <Icon name="lock" type="material" color={appColors.AppBlue} size={20} />
                  <Text style={styles.actionText}>Change Password</Text>
                </View>
                <Icon name="chevron-right" type="material" color={appColors.grey4} size={20} />
              </TouchableOpacity>

              <View style={styles.separator} />

              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => navigation.navigate('DeactivateAccountScreen')}
              >
                <View style={styles.actionLeft}>
                  <Icon name="pause-circle" type="material" color="#FF9800" size={20} />
                  <Text style={styles.actionText}>Deactivate Account</Text>
                </View>
                <Icon name="chevron-right" type="material" color={appColors.grey4} size={20} />
              </TouchableOpacity>

              <View style={styles.separator} />

              <TouchableOpacity
                style={[styles.actionItem, styles.destructiveAction]}
                onPress={handleDeleteAccount}
              >
                <View style={styles.actionLeft}>
                  <Icon name="delete-forever" type="material" color="#F44336" size={moderateScale(20)} />
                  <Text style={[styles.actionText, styles.destructiveText]}>Delete Account</Text>
                </View>
                <Icon name="chevron-right" type="material" color="#F44336" size={moderateScale(20)} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Save Button */}
        {hasChanges && (
          <View style={styles.saveButtonContainer}>
            <Button
              title={isLoading ? 'Saving...' : 'Save Changes'}
              buttonStyle={[styles.saveButtonFull, isLoading && styles.disabledButton]}
              titleStyle={styles.saveButtonFullText}
              onPress={handleSave}
              loading={isLoading}
              disabled={isLoading}
            />
          </View>
        )}
      </KeyboardAvoidingView>
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
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    padding: scale(8),
  },
  saveButtonText: {
    fontSize: moderateScale(16),
    color: appColors.AppBlue,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  disabledSaveText: {
    color: appColors.grey4,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: scale(30),
    backgroundColor: appColors.CardBackground,
    marginBottom: scale(20),
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: scale(12),
  },
  avatar: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
  },
  avatarPlaceholder: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    backgroundColor: appColors.AppBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: moderateScale(36),
    color: '#FFF',
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: appColors.AppBlue,
    borderRadius: scale(16),
    width: scale(32),
    height: scale(32),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: scale(3),
    borderColor: appColors.CardBackground,
  },
  changePhotoText: {
    fontSize: moderateScale(14),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
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
    padding: scale(16),
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  inputContainer: {
    marginBottom: scale(16),
  },
  inputLabel: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextMedium,
    marginBottom: scale(6),
  },
  textInput: {
    borderWidth: 1,
    borderColor: appColors.grey5,
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
    fontSize: moderateScale(16),
    color: appColors.grey1,
    fontFamily: appFonts.headerTextRegular,
    backgroundColor: appColors.CardBackground,
  },
  multilineInput: {
    height: scale(80),
    textAlignVertical: 'top',
  },
  disabledInput: {
    backgroundColor: appColors.grey6,
    color: appColors.grey3,
  },
  selectInput: {
    borderWidth: 1,
    borderColor: appColors.grey5,
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
    paddingVertical: scale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: appColors.CardBackground,
  },
  selectText: {
    fontSize: moderateScale(16),
    color: appColors.grey1,
    fontFamily: appFonts.headerTextRegular,
  },
  placeholderText: {
    color: appColors.grey4,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(12),
  },
  destructiveAction: {
    backgroundColor: '#FFEBEE',
    marginHorizontal: scale(-16),
    paddingHorizontal: scale(16),
    borderRadius: scale(8),
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: moderateScale(16),
    color: appColors.grey1,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: scale(12),
  },
  destructiveText: {
    color: '#D32F2F',
  },
  separator: {
    height: 1,
    backgroundColor: appColors.grey6,
    marginVertical: scale(8),
  },
  saveButtonContainer: {
    padding: scale(20),
    backgroundColor: appColors.CardBackground,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(-2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
  },
  saveButtonFull: {
    backgroundColor: appColors.AppBlue,
    borderRadius: scale(12),
    paddingVertical: scale(16),
  },
  saveButtonFullText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  disabledButton: {
    backgroundColor: appColors.grey4,
  },
  bottomSpacing: {
    height: scale(20),
  },
});

export default ProfileSettingsScreen;
