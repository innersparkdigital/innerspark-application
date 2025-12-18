/**
 * Post Session Feedback Screen - Collect user feedback after therapy sessions
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button, Slider } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { submitReview } from '../../utils/appointmentsManager';

interface SessionDetails {
  id: string;
  therapistName: string;
  therapistId: string;
  sessionDate: string;
  sessionTime: string;
  sessionDuration: number; // in minutes
  sessionType: 'individual' | 'group' | 'family' | 'couples';
  meetingLink?: string;
}

interface FeedbackData {
  overallRating: number;
  therapistRating: number;
  sessionEffectiveness: number;
  communicationRating: number;
  environmentRating: number;
  whatWentWell: string;
  areasForImprovement: string;
  specificConcerns: string;
  goalProgress: string;
  recommendToOthers: boolean | null;
  additionalComments: string;
  technicalIssues: string;
  followUpNeeded: boolean;
}

interface PostSessionFeedbackScreenProps {
  navigation: NavigationProp<any>;
  route: RouteProp<{ params: { sessionDetails?: SessionDetails; appointment?: any } }, 'params'>;
}

const PostSessionFeedbackScreen: React.FC<PostSessionFeedbackScreenProps> = ({ 
  navigation, 
  route 
}) => {
  // Handle both sessionDetails and appointment params
  const sessionDetails = route.params?.sessionDetails || route.params?.appointment || {
    id: '1',
    therapistName: 'Unknown Therapist',
    therapistId: '1',
    sessionDate: new Date().toLocaleDateString(),
    sessionTime: '12:00 PM',
    sessionDuration: 60,
    sessionType: 'individual' as const,
  };
  const toast = useToast();
  
  const [feedback, setFeedback] = useState<FeedbackData>({
    overallRating: 5,
    therapistRating: 5,
    sessionEffectiveness: 5,
    communicationRating: 5,
    environmentRating: 5,
    whatWentWell: '',
    areasForImprovement: '',
    specificConcerns: '',
    goalProgress: '',
    recommendToOthers: null,
    additionalComments: '',
    technicalIssues: '',
    followUpNeeded: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (feedback.whatWentWell.trim().length < 10) {
      errors.push('Please provide more detail about what went well (minimum 10 characters)');
    }

    if (feedback.goalProgress.trim().length < 5) {
      errors.push('Please describe your progress toward goals');
    }

    if (feedback.recommendToOthers === null) {
      errors.push('Please indicate if you would recommend this therapist');
    }

    if (feedback.overallRating < 1) {
      errors.push('Please provide an overall rating');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmitFeedback = async () => {
    if (!validateForm()) {
      toast.show({
        description: 'Please complete all required fields',
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare review data according to API format
      const reviewData = {
        rating: feedback.overallRating,
        comment: `${feedback.whatWentWell}\n\nProgress: ${feedback.goalProgress}${feedback.additionalComments ? `\n\n${feedback.additionalComments}` : ''}`,
        tags: [
          feedback.recommendToOthers ? 'recommended' : 'not-recommended',
          `therapist-rating-${feedback.therapistRating}`,
          `effectiveness-${feedback.sessionEffectiveness}`,
        ],
      };

      // Submit review via API
      const result = await submitReview(sessionDetails.id, reviewData);
      
      if (result.success) {
        // Log session data for wellness report
        const sessionLog = {
          sessionId: sessionDetails.id,
          therapistId: sessionDetails.therapistId,
          sessionDate: sessionDetails.sessionDate,
          sessionDuration: sessionDetails.sessionDuration,
          feedback: feedback,
          submittedAt: new Date().toISOString(),
        };

        console.log('Session logged for wellness report:', sessionLog);

        toast.show({
          description: 'Thank you! Your feedback has been submitted successfully.',
          duration: 4000,
        });

        // Navigate back to appointments
        navigation.navigate('AppointmentsScreen');
      } else {
        toast.show({
          description: result.error || 'Failed to submit feedback. Please try again.',
          duration: 3000,
        });
      }
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.show({
        description: 'Failed to submit feedback. Please try again.',
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipFeedback = () => {
    Alert.alert(
      'Skip Feedback',
      'Your feedback helps us improve our services. Are you sure you want to skip?',
      [
        { text: 'Continue Feedback', style: 'cancel' },
        { 
          text: 'Skip', 
          style: 'destructive',
          onPress: () => navigation.navigate('AppointmentsScreen')
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Return original if invalid
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
  };

  const RatingSlider: React.FC<{
    title: string;
    value: number;
    onValueChange: (value: number) => void;
    labels: string[];
  }> = ({ title, value, onValueChange, labels }) => (
    <View style={styles.ratingContainer}>
      <Text style={styles.ratingTitle}>{title}</Text>
      <View style={styles.sliderContainer}>
        <Slider
          value={value}
          onValueChange={(val) => {
            const roundedValue = Math.round(val);
            if (roundedValue !== value) {
              onValueChange(roundedValue);
            }
          }}
          onSlidingComplete={(val) => {
            const roundedValue = Math.round(val);
            onValueChange(roundedValue);
          }}
          minimumValue={1}
          maximumValue={5}
          step={1}
          thumbStyle={styles.sliderThumb}
          trackStyle={styles.sliderTrack}
          minimumTrackTintColor={appColors.AppBlue}
          maximumTrackTintColor={appColors.grey5}
          thumbTouchSize={{ width: 44, height: 44 }}
          style={{ width: '100%' }}
        />
        <View style={styles.ratingLabels}>
          <Text style={styles.ratingLabel}>{labels[0]}</Text>
          <Text style={[styles.ratingLabel, styles.ratingValue]}>{value}/5</Text>
          <Text style={styles.ratingLabel}>{labels[1]}</Text>
        </View>
      </View>
    </View>
  );

  const RecommendationButtons: React.FC = () => (
    <View style={styles.recommendationContainer}>
      <Text style={styles.sectionTitle}>Would you recommend this therapist to others?</Text>
      <View style={styles.recommendationButtons}>
        <TouchableOpacity
          style={[
            styles.recommendButton,
            feedback.recommendToOthers === true && styles.selectedRecommendButton
          ]}
          onPress={() => setFeedback(prev => ({ ...prev, recommendToOthers: true }))}
        >
          <Icon 
            name="thumb-up" 
            type="material" 
            color={feedback.recommendToOthers === true ? appColors.CardBackground : appColors.AppBlue} 
            size={20} 
          />
          <Text style={[
            styles.recommendButtonText,
            feedback.recommendToOthers === true && styles.selectedRecommendButtonText
          ]}>
            Yes, Recommend
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.recommendButton,
            feedback.recommendToOthers === false && styles.selectedRecommendButton
          ]}
          onPress={() => setFeedback(prev => ({ ...prev, recommendToOthers: false }))}
        >
          <Icon 
            name="thumb-down" 
            type="material" 
            color={feedback.recommendToOthers === false ? appColors.CardBackground : appColors.grey3} 
            size={20} 
          />
          <Text style={[
            styles.recommendButtonText,
            feedback.recommendToOthers === false && styles.selectedRecommendButtonText
          ]}>
            No, Don't Recommend
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Session Feedback</Text>
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={handleSkipFeedback}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Session Summary */}
          <View style={styles.sessionSummary}>
            <View style={styles.sessionHeader}>
              <Icon name="psychology" type="material" color={appColors.AppBlue} size={24} />
              <Text style={styles.sessionTitle}>Session with {sessionDetails.therapistName}</Text>
            </View>
            <Text style={styles.sessionDate}>
              {formatDate(sessionDetails.sessionDate)} at {sessionDetails.sessionTime}
            </Text>
            <Text style={styles.sessionDuration}>
              Duration: {sessionDetails.sessionDuration} minutes • {sessionDetails.sessionType}
            </Text>
          </View>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <View style={styles.errorContainer}>
              {validationErrors.map((error, index) => (
                <Text key={index} style={styles.errorText}>• {error}</Text>
              ))}
            </View>
          )}

          {/* Rating Sections */}
          <View style={styles.ratingsSection}>
            
          <RatingSlider
            title="Overall Session Rating"
            value={feedback.overallRating}
            onValueChange={(value) => {
              const numValue = Math.round(value);
              setFeedback(prev => ({ ...prev, overallRating: numValue }));
            }}
            labels={['Poor', 'Excellent']}
          />

          <RatingSlider
            title="Therapist Performance"
            value={feedback.therapistRating}
            onValueChange={(value) => {
              const numValue = Math.round(value);
              setFeedback(prev => ({ ...prev, therapistRating: numValue }));
            }}
            labels={['Poor', 'Excellent']}
          />

          <RatingSlider
            title="Session Effectiveness"
            value={feedback.sessionEffectiveness}
            onValueChange={(value) => {
              const numValue = Math.round(value);
              setFeedback(prev => ({ ...prev, sessionEffectiveness: numValue }));
            }}
            labels={['Not Helpful', 'Very Helpful']}
          />

          <RatingSlider
            title="Communication Quality"
            value={feedback.communicationRating}
            onValueChange={(value) => {
              const numValue = Math.round(value);
              setFeedback(prev => ({ ...prev, communicationRating: numValue }));
            }}
            labels={['Poor', 'Excellent']}
          />

          <RatingSlider
            title="Environment/Setting"
            value={feedback.environmentRating}
            onValueChange={(value) => {
              const numValue = Math.round(value);
              setFeedback(prev => ({ ...prev, environmentRating: numValue }));
            }}
            labels={['Poor', 'Excellent']}
          />
        </View>

        {/* Text Feedback Sections */}
        <View style={styles.textFeedbackSection}>
          <Text style={styles.sectionTitle}>Detailed Feedback</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>What went well in this session? *</Text>
              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={4}
                placeholder="Describe what you found helpful or positive about this session..."
                placeholderTextColor={appColors.grey3}
                value={feedback.whatWentWell}
                onChangeText={(text) => setFeedback(prev => ({ ...prev, whatWentWell: text }))}
                maxLength={500}
              />
              <Text style={styles.characterCount}>
                {feedback.whatWentWell.length}/500
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Progress toward your goals *</Text>
              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={3}
                placeholder="How did this session help you progress toward your mental health goals?"
                placeholderTextColor={appColors.grey3}
                value={feedback.goalProgress}
                onChangeText={(text) => setFeedback(prev => ({ ...prev, goalProgress: text }))}
                maxLength={300}
              />
              <Text style={styles.characterCount}>
                {feedback.goalProgress.length}/300
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Areas for improvement</Text>
              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={3}
                placeholder="What could be improved in future sessions?"
                placeholderTextColor={appColors.grey3}
                value={feedback.areasForImprovement}
                onChangeText={(text) => setFeedback(prev => ({ ...prev, areasForImprovement: text }))}
                maxLength={300}
              />
              <Text style={styles.characterCount}>
                {feedback.areasForImprovement.length}/300
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Specific concerns or issues</Text>
              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={3}
                placeholder="Any specific concerns you'd like to address?"
                placeholderTextColor={appColors.grey3}
                value={feedback.specificConcerns}
                onChangeText={(text) => setFeedback(prev => ({ ...prev, specificConcerns: text }))}
                maxLength={300}
              />
              <Text style={styles.characterCount}>
                {feedback.specificConcerns.length}/300
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Technical issues (if any)</Text>
              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={2}
                placeholder="Did you experience any technical problems during the online session?"
                placeholderTextColor={appColors.grey3}
                value={feedback.technicalIssues}
                onChangeText={(text) => setFeedback(prev => ({ ...prev, technicalIssues: text }))}
                maxLength={200}
              />
              <Text style={styles.characterCount}>
                {feedback.technicalIssues.length}/200
              </Text>
            </View>
          </View>

          {/* Recommendation Section */}
          <RecommendationButtons />

          {/* Follow-up Section */}
          <View style={styles.followUpSection}>
            <TouchableOpacity
              style={styles.followUpToggle}
              onPress={() => setFeedback(prev => ({ ...prev, followUpNeeded: !prev.followUpNeeded }))}
            >
              <View style={[
                styles.checkbox,
                feedback.followUpNeeded && styles.checkedCheckbox
              ]}>
                {feedback.followUpNeeded && (
                  <Icon name="check" type="material" color={appColors.CardBackground} size={16} />
                )}
              </View>
              <Text style={styles.followUpText}>
                I would like a follow-up contact from the wellness team
              </Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <View style={styles.submitSection}>
            <Button
              title="Submit Feedback"
              onPress={handleSubmitFeedback}
              loading={isSubmitting}
              disabled={isSubmitting}
              buttonStyle={styles.submitButton}
              titleStyle={styles.submitButtonText}
            />
            <Text style={styles.privacyNote}>
              Your feedback is confidential and helps us improve our services
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    backgroundColor: appColors.AppBlue,
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
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  skipButton: {
    padding: 8,
  },
  skipButtonText: {
    fontSize: 16,
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextMedium,
  },
  scrollView: {
    flex: 1,
  },
  sessionSummary: {
    backgroundColor: appColors.CardBackground,
    margin: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginLeft: 12,
    flex: 1,
  },
  sessionDate: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    marginBottom: 4,
  },
  sessionDuration: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
    margin: 20,
    padding: 16,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#C62828',
    fontFamily: appFonts.headerTextRegular,
    marginBottom: 4,
  },
  ratingsSection: {
    backgroundColor: appColors.CardBackground,
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 20,
  },
  ratingContainer: {
    marginBottom: 24,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 12,
  },
  sliderContainer: {
    paddingHorizontal: 8,
    width: '100%',
  },
  sliderThumb: {
    backgroundColor: appColors.AppBlue,
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  sliderTrack: {
    height: 6,
    borderRadius: 3,
  },
  ratingLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingLabel: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  textFeedbackSection: {
    backgroundColor: appColors.CardBackground,
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: appColors.grey5,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.headerTextRegular,
    textAlignVertical: 'top',
    minHeight: 100,
    backgroundColor: appColors.CardBackground,
  },
  characterCount: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'right',
    marginTop: 4,
  },
  recommendationContainer: {
    backgroundColor: appColors.CardBackground,
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  recommendationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recommendButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: appColors.grey5,
    marginHorizontal: 4,
  },
  selectedRecommendButton: {
    backgroundColor: appColors.AppBlue,
    borderColor: appColors.AppBlue,
  },
  recommendButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    marginLeft: 8,
  },
  selectedRecommendButtonText: {
    color: appColors.CardBackground,
  },
  followUpSection: {
    backgroundColor: appColors.CardBackground,
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  followUpToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: appColors.grey4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkedCheckbox: {
    backgroundColor: appColors.AppBlue,
    borderColor: appColors.AppBlue,
  },
  followUpText: {
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.headerTextRegular,
    flex: 1,
  },
  submitSection: {
    margin: 20,
    marginTop: 0,
    marginBottom: 40,
  },
  submitButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 25,
    paddingVertical: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  privacyNote: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 16,
  },
});

export default PostSessionFeedbackScreen;
