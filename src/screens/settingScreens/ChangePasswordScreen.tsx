/**
 * Change Password Screen - Update account password with validation
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import { useSelector } from 'react-redux';
import { NavigationProp } from '@react-navigation/native';
import ISGenericHeader from '../../components/ISGenericHeader';
import { changePassword } from '../../api/client/settings';

interface ChangePasswordScreenProps {
  navigation: NavigationProp<any>;
}

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const userId = useSelector((state: any) => state.userData.userDetails.userId);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password strength validation
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: 'Weak', color: '#F44336' };
    if (strength <= 3) return { strength, label: 'Fair', color: '#FF9800' };
    if (strength <= 4) return { strength, label: 'Good', color: '#FFC107' };
    return { strength, label: 'Strong', color: '#4CAF50' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const validatePassword = () => {
    if (!currentPassword) {
      toast.show({ description: 'Please enter your current password', duration: 2000 });
      return false;
    }
    if (!newPassword) {
      toast.show({ description: 'Please enter a new password', duration: 2000 });
      return false;
    }
    if (newPassword.length < 8) {
      toast.show({ description: 'Password must be at least 8 characters', duration: 2000 });
      return false;
    }
    if (newPassword === currentPassword) {
      toast.show({ description: 'New password must be different from current password', duration: 2000 });
      return false;
    }
    if (newPassword !== confirmPassword) {
      toast.show({ description: 'Passwords do not match', duration: 2000 });
      return false;
    }
    return true;
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    setIsLoading(true);
    try {
      const response = await changePassword(userId, currentPassword, newPassword, confirmPassword);
      
      if (response.success) {
        toast.show({
          description: response.message || 'Password changed successfully!',
          duration: 3000,
        });
        
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        setTimeout(() => {
          navigation.goBack();
        }, 1000);
      } else {
        toast.show({
          description: response.message || 'Failed to change password',
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.show({
        description: error.response?.data?.message || 'Failed to change password. Please try again.',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderPasswordInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    showPassword: boolean,
    toggleShow: () => void,
    placeholder: string
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.passwordInputWrapper}>
        <TextInput
          style={styles.passwordInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={appColors.grey4}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={toggleShow}
        >
          <Icon
            name={showPassword ? 'visibility' : 'visibility-off'}
            type="material"
            color={appColors.grey3}
            size={20}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ISGenericHeader
        title="Change Password"
        navigation={navigation}
              />

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Info Card */}
          <View style={styles.infoCard}>
            <Icon name="lock" type="material" color={appColors.AppBlue} size={32} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Secure Your Account</Text>
              <Text style={styles.infoText}>
                Choose a strong password to keep your account safe. We recommend using a unique password you don't use elsewhere.
              </Text>
            </View>
          </View>

          {/* Current Password */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CURRENT PASSWORD</Text>
            <View style={styles.sectionContent}>
              {renderPasswordInput(
                'Current Password',
                currentPassword,
                setCurrentPassword,
                showCurrentPassword,
                () => setShowCurrentPassword(!showCurrentPassword),
                'Enter your current password'
              )}
            </View>
          </View>

          {/* New Password */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>NEW PASSWORD</Text>
            <View style={styles.sectionContent}>
              {renderPasswordInput(
                'New Password',
                newPassword,
                setNewPassword,
                showNewPassword,
                () => setShowNewPassword(!showNewPassword),
                'Enter your new password'
              )}

              {/* Password Strength Indicator */}
              {newPassword.length > 0 && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBar}>
                    <View
                      style={[
                        styles.strengthFill,
                        { width: `${(passwordStrength.strength / 5) * 100}%`, backgroundColor: passwordStrength.color }
                      ]}
                    />
                  </View>
                  <Text style={[styles.strengthLabel, { color: passwordStrength.color }]}>
                    {passwordStrength.label}
                  </Text>
                </View>
              )}

              {/* Password Requirements */}
              <View style={styles.requirementsContainer}>
                <Text style={styles.requirementsTitle}>Password must contain:</Text>
                <View style={styles.requirement}>
                  <Icon
                    name={newPassword.length >= 8 ? 'check-circle' : 'radio-button-unchecked'}
                    type="material"
                    color={newPassword.length >= 8 ? '#4CAF50' : appColors.grey4}
                    size={16}
                  />
                  <Text style={[
                    styles.requirementText,
                    newPassword.length >= 8 && styles.requirementMet
                  ]}>
                    At least 8 characters
                  </Text>
                </View>
                <View style={styles.requirement}>
                  <Icon
                    name={/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? 'check-circle' : 'radio-button-unchecked'}
                    type="material"
                    color={/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? '#4CAF50' : appColors.grey4}
                    size={16}
                  />
                  <Text style={[
                    styles.requirementText,
                    /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) && styles.requirementMet
                  ]}>
                    Upper and lowercase letters
                  </Text>
                </View>
                <View style={styles.requirement}>
                  <Icon
                    name={/\d/.test(newPassword) ? 'check-circle' : 'radio-button-unchecked'}
                    type="material"
                    color={/\d/.test(newPassword) ? '#4CAF50' : appColors.grey4}
                    size={16}
                  />
                  <Text style={[
                    styles.requirementText,
                    /\d/.test(newPassword) && styles.requirementMet
                  ]}>
                    At least one number
                  </Text>
                </View>
                <View style={styles.requirement}>
                  <Icon
                    name={/[^a-zA-Z0-9]/.test(newPassword) ? 'check-circle' : 'radio-button-unchecked'}
                    type="material"
                    color={/[^a-zA-Z0-9]/.test(newPassword) ? '#4CAF50' : appColors.grey4}
                    size={16}
                  />
                  <Text style={[
                    styles.requirementText,
                    /[^a-zA-Z0-9]/.test(newPassword) && styles.requirementMet
                  ]}>
                    Special character (!@#$%^&*)
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CONFIRM NEW PASSWORD</Text>
            <View style={styles.sectionContent}>
              {renderPasswordInput(
                'Confirm Password',
                confirmPassword,
                setConfirmPassword,
                showConfirmPassword,
                () => setShowConfirmPassword(!showConfirmPassword),
                'Re-enter your new password'
              )}

              {/* Match Indicator */}
              {confirmPassword.length > 0 && (
                <View style={styles.matchContainer}>
                  {newPassword === confirmPassword ? (
                    <View style={styles.matchSuccess}>
                      <Icon name="check-circle" type="material" color="#4CAF50" size={16} />
                      <Text style={styles.matchSuccessText}>Passwords match</Text>
                    </View>
                  ) : (
                    <View style={styles.matchError}>
                      <Icon name="error" type="material" color="#F44336" size={16} />
                      <Text style={styles.matchErrorText}>Passwords do not match</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>

          {/* Security Tips */}
          <View style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <Icon name="tips-and-updates" type="material" color={appColors.AppBlue} size={20} />
              <Text style={styles.tipsTitle}>Password Security Tips</Text>
            </View>
            <Text style={styles.tipItem}>• Use a unique password for this account</Text>
            <Text style={styles.tipItem}>• Avoid common words or personal information</Text>
            <Text style={styles.tipItem}>• Consider using a password manager</Text>
            <Text style={styles.tipItem}>• Change your password regularly</Text>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Change Password Button */}
        <View style={styles.buttonContainer}>
          <Button
            title={isLoading ? 'Changing Password...' : 'Change Password'}
            buttonStyle={styles.changeButton}
            titleStyle={styles.changeButtonText}
            onPress={handleChangePassword}
            loading={isLoading}
            disabled={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: appColors.AppBlue + '10',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  infoContent: {
    flex: 1,
    marginLeft: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    lineHeight: 20,
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
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextMedium,
    marginBottom: 8,
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: appColors.grey5,
    borderRadius: 8,
    backgroundColor: appColors.CardBackground,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.headerTextRegular,
  },
  eyeIcon: {
    padding: 12,
  },
  strengthContainer: {
    marginTop: 12,
    marginBottom: 16,
  },
  strengthBar: {
    height: 4,
    backgroundColor: appColors.grey6,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: appFonts.headerTextBold,
  },
  requirementsContainer: {
    marginTop: 8,
  },
  requirementsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 8,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  requirementText: {
    fontSize: 13,
    color: appColors.grey4,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: 8,
  },
  requirementMet: {
    color: '#4CAF50',
  },
  matchContainer: {
    marginTop: 12,
  },
  matchSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchSuccessText: {
    fontSize: 14,
    color: '#4CAF50',
    fontFamily: appFonts.headerTextMedium,
    marginLeft: 6,
  },
  matchError: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchErrorText: {
    fontSize: 14,
    color: '#F44336',
    fontFamily: appFonts.headerTextMedium,
    marginLeft: 6,
  },
  tipsCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginLeft: 8,
  },
  tipItem: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    marginBottom: 6,
    lineHeight: 20,
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: appColors.CardBackground,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  changeButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 12,
    paddingVertical: 16,
  },
  changeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default ChangePasswordScreen;
