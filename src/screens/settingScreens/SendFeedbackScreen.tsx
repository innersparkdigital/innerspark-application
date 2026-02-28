/**
 * Send Feedback Screen - Allow users to submit feedback and suggestions
 */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
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
import { scale, moderateScale } from '../../global/Scaling';
import { useToast } from 'native-base';
import { NavigationProp } from '@react-navigation/native';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';
import { submitFeedback } from '../../api/client/feedback';
import { validateSendFeedback, SendFeedbackErrors } from '../../global/LHValidators';
import ISAlert, { useISAlert } from '../../components/alerts/ISAlert';

interface SendFeedbackScreenProps {
  navigation: NavigationProp<any>;
}

type FeedbackType = 'bug' | 'feature' | 'improvement' | 'compliment' | 'other';

const SendFeedbackScreen: React.FC<SendFeedbackScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const userDetails = useSelector((state: any) => state.userData.userDetails);

  const [selectedType, setSelectedType] = useState<FeedbackType>('improvement');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<SendFeedbackErrors>({});
  const alert = useISAlert();

  const handleFieldChange = (field: string, value: any) => {
    if (field === 'subject') setSubject(value);
    if (field === 'message') setMessage(value);
    if (field === 'email') setEmail(value);

    if (errors[field as keyof SendFeedbackErrors]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof SendFeedbackErrors];
        return newErrors;
      });
    }
  };

  const feedbackTypes = [
    { id: 'bug' as FeedbackType, label: 'Bug Report', icon: 'bug-report', color: '#F44336' },
    { id: 'feature' as FeedbackType, label: 'Feature Request', icon: 'lightbulb', color: '#FFC107' },
    { id: 'improvement' as FeedbackType, label: 'Improvement', icon: 'trending-up', color: '#2196F3' },
    { id: 'compliment' as FeedbackType, label: 'Compliment', icon: 'favorite', color: '#E91E63' },
    { id: 'other' as FeedbackType, label: 'Other', icon: 'chat', color: '#9C27B0' },
  ];

  const handleSubmit = async () => {
    const feedbackData = {
      type: selectedType,
      subject: subject.trim(),
      message: message.trim(),
      email: email.trim(),
    };

    const formErrors = validateSendFeedback(feedbackData);

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const userId = userDetails?.userId || 'guest_user';

      await submitFeedback(userId, {
        type: selectedType,
        subject: subject.trim(),
        message: message.trim(),
        email: email.trim() || undefined,
      });

      setIsSubmitting(false);
      toast.show({
        description: 'Thank you! Your feedback has been submitted successfully.',
        duration: 3000,
      });

      // Reset form
      setSubject('');
      setMessage('');
      setEmail('');

      // Navigate back after a short delay
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
      setIsSubmitting(false);
      console.error('Error submitting feedback:', error);
      toast.show({
        description: 'Failed to submit feedback. Please try again.',
        duration: 3000,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />
      <ISGenericHeader
        title="Send Feedback"
        navigation={navigation}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.headerCard}>
            <Icon name="feedback" type="material" color={appColors.AppBlue} size={moderateScale(48)} />
            <Text style={styles.headerTitle}>We Value Your Feedback</Text>
            <Text style={styles.headerSubtitle}>
              Help us improve Innerspark by sharing your thoughts, suggestions, or reporting issues.
            </Text>
          </View>

          {/* Feedback Type Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>FEEDBACK TYPE</Text>
            <View style={styles.typeContainer}>
              {feedbackTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeButton,
                    selectedType === type.id && styles.typeButtonActive,
                    { borderColor: selectedType === type.id ? type.color : appColors.grey5 }
                  ]}
                  onPress={() => setSelectedType(type.id)}
                  activeOpacity={0.7}
                >
                  <Icon
                    name={type.icon}
                    type="material"
                    color={selectedType === type.id ? type.color : appColors.grey4}
                    size={moderateScale(24)}
                  />
                  <Text style={[
                    styles.typeLabel,
                    selectedType === type.id && { color: type.color }
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Subject Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SUBJECT</Text>
            <View style={[styles.inputContainer, errors.subject ? styles.inputError : {}]}>
              <TextInput
                style={styles.input}
                placeholder="Brief summary of your feedback"
                placeholderTextColor={appColors.grey4}
                value={subject}
                onChangeText={(text) => handleFieldChange('subject', text)}
                maxLength={100}
              />
              <Text style={styles.charCount}>{subject.length}/100</Text>
            </View>
            {errors.subject && <Text style={styles.fieldErrorText}>{errors.subject}</Text>}
          </View>

          {/* Message Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>MESSAGE</Text>
            <View style={[styles.inputContainer, errors.message ? styles.inputError : {}]}>
              <TextInput
                style={[styles.input, styles.messageInput]}
                placeholder="Please provide detailed feedback..."
                placeholderTextColor={appColors.grey4}
                value={message}
                onChangeText={(text) => handleFieldChange('message', text)}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
                maxLength={1000}
              />
              <Text style={styles.charCount}>{message.length}/1000</Text>
            </View>
            {errors.message && <Text style={styles.fieldErrorText}>{errors.message}</Text>}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EMAIL (OPTIONAL)</Text>
            <View style={[styles.inputContainer, errors.email ? styles.inputError : {}]}>
              <Icon name="email" type="material" color={appColors.grey4} size={moderateScale(20)} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.emailInput]}
                placeholder="your.email@example.com"
                placeholderTextColor={appColors.grey4}
                value={email}
                onChangeText={(text) => handleFieldChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && <Text style={styles.fieldErrorText}>{errors.email}</Text>}
            <Text style={styles.helperText}>
              We'll only use this to follow up on your feedback if needed
            </Text>
          </View>

          <View style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <Icon name="tips-and-updates" type="material" color={appColors.AppBlue} size={moderateScale(20)} />
              <Text style={styles.tipsTitle}>Tips for Great Feedback</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.tipText}>Be specific about the issue or suggestion</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.tipText}>Include steps to reproduce bugs</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.tipText}>Share what you love about the app too!</Text>
            </View>
          </View>

          {/* Submit Button */}
          <View style={styles.submitContainer}>
            <Button
              title={isSubmitting ? "Submitting..." : "Submit Feedback"}
              buttonStyle={parameters.appButtonXLBlue}
              titleStyle={parameters.appButtonXLTitleBlue}
              onPress={handleSubmit}
              disabled={isSubmitting}
              loading={isSubmitting}
            />
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: scale(20),
  },
  headerCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(16),
    padding: scale(24),
    alignItems: 'center',
    marginTop: scale(20),
    marginBottom: scale(20),
  },
  headerTitle: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginTop: scale(16),
    marginBottom: scale(8),
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: moderateScale(15),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
    lineHeight: scale(22),
  },
  section: {
    marginBottom: scale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    marginBottom: scale(12),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(12),
  },
  typeButton: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(12),
    borderWidth: 2,
    padding: scale(12),
    alignItems: 'center',
    minWidth: '30%',
    flex: 1,
  },
  typeButtonActive: {
    backgroundColor: appColors.AppBlue + '10',
  },
  typeLabel: {
    fontSize: moderateScale(13),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextMedium,
    marginTop: scale(6),
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(12),
    padding: scale(16),
    position: 'relative',
  },
  input: {
    fontSize: moderateScale(16),
    color: appColors.grey1,
    fontFamily: appFonts.headerTextRegular,
    padding: 0,
  },
  messageInput: {
    minHeight: scale(150),
    paddingBottom: scale(24),
  },
  emailInput: {
    paddingLeft: scale(32),
  },
  inputIcon: {
    position: 'absolute',
    left: scale(16),
    top: scale(18),
  },
  charCount: {
    position: 'absolute',
    right: scale(16),
    bottom: scale(12),
    fontSize: moderateScale(12),
    color: appColors.grey4,
    fontFamily: appFonts.headerTextRegular,
  },
  helperText: {
    fontSize: moderateScale(13),
    color: appColors.grey4,
    fontFamily: appFonts.headerTextRegular,
    marginTop: scale(8),
    marginLeft: scale(4),
  },
  tipsCard: {
    backgroundColor: appColors.AppBlue + '10',
    borderRadius: scale(12),
    padding: scale(16),
    marginBottom: scale(24),
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  tipsTitle: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginLeft: scale(8),
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: scale(6),
  },
  bullet: {
    fontSize: moderateScale(14),
    color: appColors.AppBlue,
    marginRight: scale(8),
    fontWeight: 'bold',
  },
  tipText: {
    flex: 1,
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    lineHeight: scale(20),
  },
  submitContainer: {
    marginBottom: scale(20),
  },
  bottomSpacing: {
    height: scale(20),
  },
  fieldErrorText: {
    fontSize: moderateScale(12),
    color: '#F44336',
    fontFamily: appFonts.headerTextRegular,
    marginTop: scale(6),
    marginLeft: scale(4),
  },
  inputError: {
    borderColor: '#F44336',
    borderWidth: 1.5,
  },
});

export default SendFeedbackScreen;
