/**
 * Delete Account Screen - Permanent account deletion with confirmation
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button, CheckBox } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import { useSelector } from 'react-redux';
import { NavigationProp } from '@react-navigation/native';
import ISStatusBar from '../../components/ISStatusBar';
import ISGenericHeader from '../../components/ISGenericHeader';
import { deleteAccount } from '../../api/client/account';

interface DeleteAccountScreenProps {
  navigation: NavigationProp<any>;
}

interface DeletionReason {
  id: string;
  title: string;
  description?: string;
}

const DeleteAccountScreen: React.FC<DeleteAccountScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const userId = useSelector((state: any) => state.userData.userDetails.userId);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [additionalFeedback, setAdditionalFeedback] = useState('');
  const [hasReadWarning, setHasReadWarning] = useState(false);
  const [hasBackedUpData, setHasBackedUpData] = useState(false);

  const CONFIRMATION_TEXT = 'DELETE MY ACCOUNT';
  const isConfirmationValid = confirmationText === CONFIRMATION_TEXT;
  const canProceed = isConfirmationValid && hasReadWarning && hasBackedUpData && selectedReasons.length > 0;

  const deletionReasons: DeletionReason[] = [
    {
      id: 'not_helpful',
      title: 'App not helpful for my needs',
      description: 'The features don\'t match what I was looking for',
    },
    {
      id: 'privacy_concerns',
      title: 'Privacy concerns',
      description: 'Worried about data privacy and security',
    },
    {
      id: 'too_expensive',
      title: 'Too expensive',
      description: 'Subscription or service costs are too high',
    },
    {
      id: 'technical_issues',
      title: 'Technical problems',
      description: 'App crashes, bugs, or performance issues',
    },
    {
      id: 'found_alternative',
      title: 'Found a better alternative',
      description: 'Using a different app or service',
    },
    {
      id: 'no_longer_needed',
      title: 'No longer need mental health support',
      description: 'My situation has improved',
    },
    {
      id: 'therapist_recommendation',
      title: 'Therapist recommended different approach',
      description: 'My healthcare provider suggested alternatives',
    },
    {
      id: 'other',
      title: 'Other reason',
      description: 'Please specify in the feedback section',
    },
  ];

  const handleReasonToggle = (reasonId: string) => {
    setSelectedReasons(prev => {
      if (prev.includes(reasonId)) {
        return prev.filter(id => id !== reasonId);
      } else {
        return [...prev, reasonId];
      }
    });
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Final Confirmation',
      'This action cannot be undone. Your account and all associated data will be permanently deleted within 30 days. Are you absolutely sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Forever',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              const reasonText = selectedReasons.map(id => {
                const reason = deletionReasons.find(r => r.id === id);
                return reason?.title || id;
              }).join(', ');
              
              const finalReason = additionalFeedback ? `${reasonText}. ${additionalFeedback}` : reasonText;
              
              const response = await deleteAccount(userId, finalReason);
              
              if (response.success) {
                toast.show({
                  description: response.message || 'Account deletion initiated. You will receive a confirmation email.',
                  duration: 5000,
                });
                
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'SigninScreen' }],
                });
              } else {
                toast.show({
                  description: response.message || 'Failed to delete account',
                  duration: 3000,
                });
              }
            } catch (error: any) {
              console.error('Error deleting account:', error);
              toast.show({
                description: error.response?.data?.message || 'Failed to delete account. Please try again.',
                duration: 3000,
              });
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleDownloadData = () => {
    Alert.alert(
      'Download Your Data',
      'We recommend downloading your data before deletion. This includes your mood history, journal entries, and progress reports.',
      [
        { text: 'Later', style: 'cancel' },
        {
          text: 'Download Now',
          onPress: () => {
            navigation.navigate('DataExportScreen');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar backgroundColor={appColors.AppBlue} />
      <ISGenericHeader
        title="Delete Account"
        navigation={navigation}
      />

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Warning Section */}
          <View style={styles.warningCard}>
            <View style={styles.warningHeader}>
              <Icon name="warning" type="material" color="#F44336" size={28} />
              <Text style={styles.warningTitle}>Permanent Account Deletion</Text>
            </View>
            <Text style={styles.warningDescription}>
              This action will permanently delete your account and all associated data, including:
            </Text>
            <View style={styles.warningList}>
              <Text style={styles.warningItem}>• All mood tracking history and insights</Text>
              <Text style={styles.warningItem}>• Journal entries and personal notes</Text>
              <Text style={styles.warningItem}>• Therapy session records and progress</Text>
              <Text style={styles.warningItem}>• Wellness goals and achievements</Text>
              <Text style={styles.warningItem}>• Messages and conversation history</Text>
              <Text style={styles.warningItem}>• Account settings and preferences</Text>
            </View>
            <Text style={styles.warningFooter}>
              This action cannot be undone. Your data will be permanently deleted within 30 days.
            </Text>
          </View>

          {/* Data Backup Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Before You Continue</Text>
            <View style={styles.sectionContent}>
              <TouchableOpacity style={styles.backupItem} onPress={handleDownloadData}>
                <View style={styles.backupLeft}>
                  <Icon name="download" type="material" color={appColors.AppBlue} size={24} />
                  <View style={styles.backupContent}>
                    <Text style={styles.backupTitle}>Download Your Data</Text>
                    <Text style={styles.backupSubtitle}>Get a copy of your information</Text>
                  </View>
                </View>
                <Icon name="chevron-right" type="material" color={appColors.grey4} size={20} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Reason Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Why are you deleting your account?</Text>
            <Text style={styles.sectionDescription}>
              Your feedback helps us improve our services (select all that apply)
            </Text>
            <View style={styles.sectionContent}>
              {deletionReasons.map((reason, index) => (
                <View key={reason.id}>
                  <CheckBox
                    title={
                      <View style={styles.reasonContent}>
                        <Text style={styles.reasonTitle}>{reason.title}</Text>
                        {reason.description && (
                          <Text style={styles.reasonDescription}>{reason.description}</Text>
                        )}
                      </View>
                    }
                    checked={selectedReasons.includes(reason.id)}
                    onPress={() => handleReasonToggle(reason.id)}
                    containerStyle={styles.checkboxContainer}
                    textStyle={styles.checkboxText}
                    checkedColor={appColors.AppBlue}
                    uncheckedColor={appColors.grey4}
                  />
                  {index < deletionReasons.length - 1 && <View style={styles.separator} />}
                </View>
              ))}
            </View>
          </View>

          {/* Additional Feedback */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Feedback (Optional)</Text>
            <View style={styles.sectionContent}>
              <TextInput
                style={styles.feedbackInput}
                value={additionalFeedback}
                onChangeText={setAdditionalFeedback}
                placeholder="Please share any additional thoughts or suggestions..."
                placeholderTextColor={appColors.grey4}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Confirmation Checkboxes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Confirmation</Text>
            <View style={styles.sectionContent}>
              <CheckBox
                title="I have read and understand the warning above"
                checked={hasReadWarning}
                onPress={() => setHasReadWarning(!hasReadWarning)}
                containerStyle={styles.confirmationCheckbox}
                textStyle={styles.confirmationText}
                checkedColor={appColors.AppBlue}
                uncheckedColor={appColors.grey4}
              />
              
              <View style={styles.separator} />
              
              <CheckBox
                title="I have backed up any important data"
                checked={hasBackedUpData}
                onPress={() => setHasBackedUpData(!hasBackedUpData)}
                containerStyle={styles.confirmationCheckbox}
                textStyle={styles.confirmationText}
                checkedColor={appColors.AppBlue}
                uncheckedColor={appColors.grey4}
              />
            </View>
          </View>

          {/* Final Confirmation */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Type "DELETE MY ACCOUNT" to confirm</Text>
            <View style={styles.sectionContent}>
              <TextInput
                style={[
                  styles.confirmationInput,
                  isConfirmationValid && styles.confirmationInputValid
                ]}
                value={confirmationText}
                onChangeText={setConfirmationText}
                placeholder="DELETE MY ACCOUNT"
                placeholderTextColor={appColors.grey4}
                autoCapitalize="characters"
              />
              {isConfirmationValid && (
                <View style={styles.validationMessage}>
                  <Icon name="check-circle" type="material" color="#4CAF50" size={16} />
                  <Text style={styles.validationText}>Confirmation text matches</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Delete Button */}
        <View style={styles.deleteButtonContainer}>
          <Button
            title={isLoading ? 'Deleting Account...' : 'Delete My Account Forever'}
            buttonStyle={[
              styles.deleteButton,
              !canProceed && styles.disabledDeleteButton
            ]}
            titleStyle={styles.deleteButtonText}
            onPress={handleDeleteAccount}
            loading={isLoading}
            disabled={!canProceed || isLoading}
          />
          <Text style={styles.deleteButtonSubtext}>
            This action cannot be undone
          </Text>
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
    color: '#F44336',
    fontFamily: appFonts.headerTextBold,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  warningCard: {
    backgroundColor: '#FFEBEE',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFCDD2',
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D32F2F',
    fontFamily: appFonts.headerTextBold,
    marginLeft: 12,
  },
  warningDescription: {
    fontSize: 14,
    color: '#D32F2F',
    fontFamily: appFonts.headerTextRegular,
    marginBottom: 12,
    lineHeight: 20,
  },
  warningList: {
    marginBottom: 16,
  },
  warningItem: {
    fontSize: 14,
    color: '#D32F2F',
    fontFamily: appFonts.headerTextRegular,
    marginBottom: 4,
    lineHeight: 18,
  },
  warningFooter: {
    fontSize: 14,
    color: '#D32F2F',
    fontFamily: appFonts.headerTextBold,
    fontWeight: 'bold',
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
  backupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  backupLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backupContent: {
    marginLeft: 12,
  },
  backupTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextMedium,
    marginBottom: 2,
  },
  backupSubtitle: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    margin: 0,
    padding: 16,
  },
  checkboxText: {
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.headerTextRegular,
  },
  reasonContent: {
    marginLeft: 8,
    flex: 1,
  },
  reasonTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextMedium,
    marginBottom: 2,
  },
  reasonDescription: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: appColors.grey5,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.headerTextRegular,
    height: 100,
    textAlignVertical: 'top',
    margin: 16,
  },
  confirmationCheckbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    margin: 0,
    padding: 16,
  },
  confirmationText: {
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.headerTextMedium,
    marginLeft: 8,
  },
  confirmationInput: {
    borderWidth: 2,
    borderColor: '#F44336',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    margin: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  confirmationInputValid: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E8',
  },
  validationMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -8,
    marginBottom: 16,
  },
  validationText: {
    fontSize: 14,
    color: '#4CAF50',
    fontFamily: appFonts.headerTextMedium,
    marginLeft: 4,
  },
  separator: {
    height: 1,
    backgroundColor: appColors.grey6,
  },
  deleteButtonContainer: {
    padding: 20,
    backgroundColor: appColors.CardBackground,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 8,
  },
  disabledDeleteButton: {
    backgroundColor: appColors.grey4,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  deleteButtonSubtext: {
    fontSize: 12,
    color: appColors.grey4,
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default DeleteAccountScreen;
