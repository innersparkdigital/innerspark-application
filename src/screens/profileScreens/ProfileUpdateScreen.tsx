/**
 * Profile Update Screen - Edit and update user profile information
 */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  ScrollView,
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Avatar, Button, BottomSheet } from '@rneui/base';
import { useToast } from 'native-base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { appImages } from '../../global/Data';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';
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

interface ProfileUpdateScreenProps {
  navigation: any;
  route?: any;
}

interface EditModalProps {
  isVisible: boolean;
  field: string;
  value: string;
  onClose: () => void;
  onSave: (value: string) => void;
  requiresVerification?: boolean;
}

// Edit Modal Component
const EditModal = ({ 
  isVisible, 
  field, 
  value, 
  onClose, 
  onSave, 
  requiresVerification = false 
}: EditModalProps) => {
  const [editValue, setEditValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);

  const getFieldConfig = (fieldName: string) => {
    switch (fieldName) {
      case 'firstName':
        return { 
          title: 'Edit First Name', 
          placeholder: 'Enter your first name',
          keyboardType: 'default' as const,
          maxLength: 50,
          multiline: false
        };
      case 'lastName':
        return { 
          title: 'Edit Last Name', 
          placeholder: 'Enter your last name',
          keyboardType: 'default' as const,
          maxLength: 50,
          multiline: false
        };
      case 'email':
        return { 
          title: 'Edit Email Address', 
          placeholder: 'Enter your email address',
          keyboardType: 'email-address' as const,
          maxLength: 100,
          multiline: false
        };
      case 'phone':
        return { 
          title: 'Edit Phone Number', 
          placeholder: 'Enter your phone number',
          keyboardType: 'phone-pad' as const,
          maxLength: 20,
          multiline: false
        };
      case 'bio':
        return { 
          title: 'Edit Bio', 
          placeholder: 'Tell us about yourself...',
          keyboardType: 'default' as const,
          maxLength: 500,
          multiline: true
        };
      default:
        return { 
          title: 'Edit Field', 
          placeholder: 'Enter value',
          keyboardType: 'default' as const,
          maxLength: 100,
          multiline: false
        };
    }
  };

  const config = getFieldConfig(field);

  const validateInput = (input: string): string | null => {
    if (!input.trim()) {
      return 'This field cannot be empty';
    }

    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input)) {
        return 'Please enter a valid email address';
      }
    }

    if (field === 'phone') {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(input)) {
        return 'Please enter a valid phone number';
      }
    }

    return null;
  };

  const handleSave = async () => {
    const error = validateInput(editValue);
    if (error) {
      Alert.alert('Validation Error', error);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    onSave(editValue);
  };

  useEffect(() => {
    setEditValue(value);
  }, [value, isVisible]);

  return (
    <BottomSheet
      isVisible={isVisible}
      onBackdropPress={onClose}
      containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{config.title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon type="material" name="close" color={appColors.AppGray} size={24} />
          </TouchableOpacity>
        </View>

        {requiresVerification && (
          <View style={styles.warningContainer}>
            <Icon type="material" name="warning" color="#FF9800" size={20} />
            <Text style={styles.warningText}>
              Changing this will require verification via OTP
            </Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.textInput, config.multiline && styles.textInputMultiline]}
            value={editValue}
            onChangeText={setEditValue}
            placeholder={config.placeholder}
            placeholderTextColor={appColors.AppGray}
            keyboardType={config.keyboardType}
            maxLength={config.maxLength}
            multiline={config.multiline}
            numberOfLines={config.multiline ? 4 : 1}
            autoFocus={true}
          />
          {config.multiline && (
            <Text style={styles.characterCount}>
              {editValue.length}/{config.maxLength}
            </Text>
          )}
        </View>

        <View style={styles.modalActions}>
          <Button
            title="Cancel"
            buttonStyle={styles.cancelButton}
            titleStyle={styles.cancelButtonText}
            onPress={onClose}
          />
          <Button
            title={requiresVerification ? "Update & Verify" : "Save Changes"}
            buttonStyle={styles.saveButton}
            titleStyle={styles.saveButtonText}
            onPress={handleSave}
            loading={isLoading}
            disabled={isLoading || !editValue.trim()}
          />
        </View>
      </View>
    </BottomSheet>
  );
};

export default function ProfileUpdateScreen({ navigation, route }: ProfileUpdateScreenProps) {
  const toast = useToast();
  const userDetails = useSelector((state: any) => state.userData.userDetails);
  
  const [profileData, setProfileData] = useState<UserProfile>({});
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentEditField, setCurrentEditField] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Get initial data from route params or use mock data
  const initialData = route?.params?.currentData || {
    firstName: userDetails?.firstName || 'Jane',
    lastName: userDetails?.lastName || 'Doe',
    email: userDetails?.email || 'jane.doe@example.com',
    phone: userDetails?.phone || '+256 700 123 456',
    role: userDetails?.role || 'Premium Member',
    bio: userDetails?.bio || 'Mental health advocate and wellness enthusiast. Passionate about mindfulness and personal growth.',
  };

  // Toast notifications
  const notifyWithToast = (description: string) => {
    toast.show({
      description: description,
      duration: 2000,
    });
  };

  // Handle field edit
  const handleEditField = (field: string) => {
    setCurrentEditField(field);
    setIsEditModalVisible(true);
  };

  // Handle save field
  const handleSaveField = async (value: string) => {
    const requiresVerification = currentEditField === 'email' || currentEditField === 'phone';
    
    if (requiresVerification) {
      // Close modal first
      setIsEditModalVisible(false);
      
      // Navigate to appropriate verification screen
      if (currentEditField === 'email') {
        navigation.navigate('VerifyEmailScreen', { 
          verificationEmail: value,
          returnScreen: 'ProfileUpdateScreen'
        });
      } else if (currentEditField === 'phone') {
        navigation.navigate('VerifyPhoneScreen', { 
          verificationPhone: value,
          returnScreen: 'ProfileUpdateScreen'
        });
      }
    } else {
      // Update profile data immediately for non-verification fields
      setProfileData(prev => ({
        ...prev,
        [currentEditField]: value
      }));
      
      setIsEditModalVisible(false);
      notifyWithToast(`${currentEditField} updated successfully`);
    }
  };

  // Save all changes
  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      notifyWithToast('Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      notifyWithToast('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Profile field component for update screen
  const UpdateProfileField = ({ 
    label, 
    value, 
    icon, 
    iconType = "material", 
    onEdit, 
    requiresVerification = false,
    isLast = false 
  }: {
    label: string;
    value: string;
    icon: string;
    iconType?: string;
    onEdit: () => void;
    requiresVerification?: boolean;
    isLast?: boolean;
  }) => (
    <TouchableOpacity onPress={onEdit}>
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
            {requiresVerification && (
              <View style={styles.verificationBadge}>
                <Icon type="material" name="verified-user" color="#FF9800" size={14} />
              </View>
            )}
          </View>
          <Icon 
            type="material" 
            name="edit" 
            color={appColors.AppBlue} 
            size={18} 
          />
        </View>
        <Text style={styles.fieldValue}>{value || 'Not provided'}</Text>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    setProfileData(initialData);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar backgroundColor={appColors.AppBlue} barStyle="light-content" />
      
      <ISGenericHeader
        title="Edit Profile"
        navigation={navigation}
      />

      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <Avatar 
              rounded 
              size={100} 
              source={userDetails?.image || appImages.avatarDefault}
              containerStyle={styles.avatarStyle}
            />
            <Text style={styles.userName}>
              {getFullname(profileData.firstName || '', profileData.lastName || '')}
            </Text>
            <Text style={styles.userRole}>{profileData.role}</Text>
          </View>

          {/* Editable Fields */}
          <View style={styles.profileSection}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <UpdateProfileField
              label="First Name"
              value={profileData.firstName || ''}
              icon="person"
              onEdit={() => handleEditField('firstName')}
            />
            
            <UpdateProfileField
              label="Last Name"
              value={profileData.lastName || ''}
              icon="person-outline"
              onEdit={() => handleEditField('lastName')}
            />
            
            <UpdateProfileField
              label="Email Address"
              value={profileData.email || ''}
              icon="email"
              onEdit={() => handleEditField('email')}
              requiresVerification={true}
            />
            
            <UpdateProfileField
              label="Phone Number"
              value={profileData.phone || ''}
              icon="phone"
              onEdit={() => handleEditField('phone')}
              requiresVerification={true}
            />
            
            <UpdateProfileField
              label="Bio"
              value={profileData.bio || ''}
              icon="info"
              onEdit={() => handleEditField('bio')}
              isLast={true}
            />
          </View>

          {/* Save Button */}
          <View style={styles.actionSection}>
            <Button
              title="Save Changes"
              buttonStyle={styles.saveProfileButton}
              titleStyle={styles.saveProfileButtonText}
              onPress={handleSaveProfile}
              loading={isSaving}
              disabled={isSaving}
              icon={
                <Icon
                  type="material"
                  name="save"
                  color={appColors.CardBackground}
                  size={20}
                  style={{ marginRight: 8 }}
                />
              }
            />
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Edit Modal */}
      <EditModal
        isVisible={isEditModalVisible}
        field={currentEditField}
        value={profileData[currentEditField as keyof UserProfile] || ''}
        onClose={() => setIsEditModalVisible(false)}
        onSave={handleSaveField}
        requiresVerification={currentEditField === 'email' || currentEditField === 'phone'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  keyboardAvoidingView: {
    flex: 1,
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
  avatarStyle: {
    borderWidth: 3,
    borderColor: appColors.AppBlue,
    marginBottom: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    marginBottom: 8,
    fontFamily: appFonts.headerTextBold,
    textAlign: 'center',
  },
  userRole: {
    fontSize: 16,
    color: appColors.AppGray,
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
  verificationBadge: {
    marginLeft: 8,
  },
  actionSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  saveProfileButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 12,
    paddingVertical: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  saveProfileButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: appFonts.bodyTextMedium,
  },
  bottomSpacing: {
    height: 40,
  },
  // Modal styles
  modalContainer: {
    backgroundColor: appColors.CardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: appColors.AppLightGray,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  closeButton: {
    padding: 5,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    marginHorizontal: 20,
    marginTop: 15,
    padding: 12,
    borderRadius: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#F57C00',
    fontFamily: appFonts.bodyTextMedium,
    marginLeft: 8,
    flex: 1,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: appColors.AppLightGray,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: appFonts.bodyTextRegular,
    color: '#333',
    backgroundColor: appColors.CardBackground,
  },
  textInputMultiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: appColors.AppGray,
    textAlign: 'right',
    marginTop: 5,
    fontFamily: appFonts.bodyTextRegular,
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: appColors.AppGray,
    borderRadius: 8,
    paddingVertical: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.AppGray,
    fontFamily: appFonts.bodyTextMedium,
  },
  saveButton: {
    flex: 1,
    backgroundColor: appColors.AppBlue,
    borderRadius: 8,
    paddingVertical: 12,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: appFonts.bodyTextMedium,
  },
});
