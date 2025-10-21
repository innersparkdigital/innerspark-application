/**
 * Deactivate Account Screen - Temporary account deactivation with reactivation option
 */
import React, { useState } from 'react';
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
import { NavigationProp } from '@react-navigation/native';

interface DeactivateAccountScreenProps {
  navigation: NavigationProp<any>;
}

interface DeactivationReason {
  id: string;
  title: string;
  description?: string;
}

const DeactivateAccountScreen: React.FC<DeactivateAccountScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [additionalFeedback, setAdditionalFeedback] = useState('');
  const [hasReadInfo, setHasReadInfo] = useState(false);

  const canProceed = hasReadInfo && selectedReasons.length > 0;

  const deactivationReasons: DeactivationReason[] = [
    {
      id: 'taking_break',
      title: 'Taking a break from the app',
      description: 'Need some time away from mental health tracking',
    },
    {
      id: 'privacy_concerns',
      title: 'Privacy concerns',
      description: 'Worried about data privacy temporarily',
    },
    {
      id: 'too_many_notifications',
      title: 'Too many notifications',
      description: 'Overwhelmed by app notifications',
    },
    {
      id: 'trying_alternative',
      title: 'Trying a different approach',
      description: 'Exploring other mental health resources',
    },
    {
      id: 'therapist_recommendation',
      title: 'Therapist recommended a break',
      description: 'Healthcare provider suggested taking time off',
    },
    {
      id: 'feeling_better',
      title: 'Feeling better, don\'t need it now',
      description: 'My mental health has improved',
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

  const handleDeactivateAccount = async () => {
    Alert.alert(
      'Confirm Deactivation',
      'Your account will be temporarily disabled. You can reactivate it anytime by logging back in.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              // Simulate API call
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              toast.show({
                description: 'Account deactivated successfully. You can reactivate anytime.',
                duration: 5000,
              });
              
              // Navigate back or to confirmation screen
              navigation.reset({
                index: 0,
                routes: [{ name: 'SigninScreen' }],
              });
            } catch (error) {
              toast.show({
                description: 'Failed to deactivate account. Please try again.',
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" type="material" color={appColors.grey1} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Deactivate Account</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Info Section */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Icon name="pause-circle" type="material" color="#FF9800" size={28} />
              <Text style={styles.infoTitle}>Temporary Deactivation</Text>
            </View>
            <Text style={styles.infoDescription}>
              Deactivating your account is temporary and reversible. Here's what happens:
            </Text>
            <View style={styles.infoList}>
              <View style={styles.infoItem}>
                <Icon name="check-circle" type="material" color="#4CAF50" size={20} />
                <Text style={styles.infoItemText}>Your data is safely preserved</Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="check-circle" type="material" color="#4CAF50" size={20} />
                <Text style={styles.infoItemText}>Your profile becomes invisible to others</Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="check-circle" type="material" color="#4CAF50" size={20} />
                <Text style={styles.infoItemText}>You won't receive any notifications</Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="check-circle" type="material" color="#4CAF50" size={20} />
                <Text style={styles.infoItemText}>Reactivate anytime by logging back in</Text>
              </View>
            </View>
            <View style={styles.reactivationBox}>
              <Icon name="info" type="material" color={appColors.AppBlue} size={20} />
              <Text style={styles.reactivationText}>
                To reactivate, simply log in with your email and password
              </Text>
            </View>
          </View>

          {/* Comparison Card */}
          <View style={styles.comparisonCard}>
            <Text style={styles.comparisonTitle}>Deactivate vs Delete</Text>
            <View style={styles.comparisonRow}>
              <View style={styles.comparisonColumn}>
                <Text style={styles.comparisonLabel}>Deactivate</Text>
                <Text style={styles.comparisonValue}>✓ Temporary</Text>
                <Text style={styles.comparisonValue}>✓ Reversible</Text>
                <Text style={styles.comparisonValue}>✓ Data preserved</Text>
              </View>
              <View style={styles.comparisonDivider} />
              <View style={styles.comparisonColumn}>
                <Text style={styles.comparisonLabel}>Delete</Text>
                <Text style={styles.comparisonValue}>✗ Permanent</Text>
                <Text style={styles.comparisonValue}>✗ Irreversible</Text>
                <Text style={styles.comparisonValue}>✗ Data removed</Text>
              </View>
            </View>
          </View>

          {/* Reason Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Why are you deactivating? (Optional)</Text>
            <Text style={styles.sectionDescription}>
              Your feedback helps us improve (select all that apply)
            </Text>
            <View style={styles.sectionContent}>
              {deactivationReasons.map((reason, index) => (
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
                  {index < deactivationReasons.length - 1 && <View style={styles.separator} />}
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
                placeholder="Share any thoughts or suggestions..."
                placeholderTextColor={appColors.grey4}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Confirmation */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Confirmation</Text>
            <View style={styles.sectionContent}>
              <CheckBox
                title="I understand my account will be temporarily deactivated"
                checked={hasReadInfo}
                onPress={() => setHasReadInfo(!hasReadInfo)}
                containerStyle={styles.confirmationCheckbox}
                textStyle={styles.confirmationText}
                checkedColor={appColors.AppBlue}
                uncheckedColor={appColors.grey4}
              />
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Deactivate Button */}
        <View style={styles.deactivateButtonContainer}>
          <Button
            title={isLoading ? 'Deactivating...' : 'Deactivate My Account'}
            buttonStyle={[
              styles.deactivateButton,
              !canProceed && styles.disabledButton
            ]}
            titleStyle={styles.deactivateButtonText}
            onPress={handleDeactivateAccount}
            loading={isLoading}
            disabled={!canProceed || isLoading}
          />
          <Text style={styles.deactivateButtonSubtext}>
            You can reactivate anytime by logging back in
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
    color: '#FF9800',
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
  infoCard: {
    backgroundColor: '#FFF3E0',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFE0B2',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E65100',
    fontFamily: appFonts.headerTextBold,
    marginLeft: 12,
  },
  infoDescription: {
    fontSize: 14,
    color: '#E65100',
    fontFamily: appFonts.headerTextRegular,
    marginBottom: 16,
    lineHeight: 20,
  },
  infoList: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoItemText: {
    fontSize: 14,
    color: '#E65100',
    fontFamily: appFonts.headerTextRegular,
    marginLeft: 8,
    flex: 1,
  },
  reactivationBox: {
    flexDirection: 'row',
    backgroundColor: appColors.AppBlue + '15',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  reactivationText: {
    fontSize: 13,
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextMedium,
    marginLeft: 8,
    flex: 1,
    fontWeight: '600',
  },
  comparisonCard: {
    backgroundColor: appColors.CardBackground,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 16,
    textAlign: 'center',
  },
  comparisonRow: {
    flexDirection: 'row',
  },
  comparisonColumn: {
    flex: 1,
  },
  comparisonDivider: {
    width: 1,
    backgroundColor: appColors.grey5,
    marginHorizontal: 16,
  },
  comparisonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 8,
  },
  comparisonValue: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginBottom: 4,
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
  separator: {
    height: 1,
    backgroundColor: appColors.grey6,
  },
  deactivateButtonContainer: {
    padding: 20,
    backgroundColor: appColors.CardBackground,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  deactivateButton: {
    backgroundColor: '#FF9800',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 8,
  },
  disabledButton: {
    backgroundColor: appColors.grey4,
  },
  deactivateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  deactivateButtonSubtext: {
    fontSize: 12,
    color: appColors.grey4,
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default DeactivateAccountScreen;
