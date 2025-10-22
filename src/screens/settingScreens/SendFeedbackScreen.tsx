/**
 * Send Feedback Screen - Allow users to submit feedback and suggestions
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
import { NavigationProp } from '@react-navigation/native';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';

interface SendFeedbackScreenProps {
  navigation: NavigationProp<any>;
}

type FeedbackType = 'bug' | 'feature' | 'improvement' | 'compliment' | 'other';

const SendFeedbackScreen: React.FC<SendFeedbackScreenProps> = ({ navigation }) => {
  const toast = useToast();
  
  const [selectedType, setSelectedType] = useState<FeedbackType>('improvement');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackTypes = [
    { id: 'bug' as FeedbackType, label: 'Bug Report', icon: 'bug-report', color: '#F44336' },
    { id: 'feature' as FeedbackType, label: 'Feature Request', icon: 'lightbulb', color: '#FFC107' },
    { id: 'improvement' as FeedbackType, label: 'Improvement', icon: 'trending-up', color: '#2196F3' },
    { id: 'compliment' as FeedbackType, label: 'Compliment', icon: 'favorite', color: '#E91E63' },
    { id: 'other' as FeedbackType, label: 'Other', icon: 'chat', color: '#9C27B0' },
  ];

  const handleSubmit = async () => {
    if (!subject.trim()) {
      toast.show({
        description: 'Please enter a subject',
        duration: 2000,
      });
      return;
    }

    if (!message.trim()) {
      toast.show({
        description: 'Please enter your feedback message',
        duration: 2000,
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
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
    }, 1500);
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
          {/* Header Message */}
          <View style={styles.headerCard}>
            <Icon name="feedback" type="material" color={appColors.AppBlue} size={48} />
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
                    size={24}
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
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Brief summary of your feedback"
                placeholderTextColor={appColors.grey4}
                value={subject}
                onChangeText={setSubject}
                maxLength={100}
              />
              <Text style={styles.charCount}>{subject.length}/100</Text>
            </View>
          </View>

          {/* Message Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>MESSAGE</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.messageInput]}
                placeholder="Please provide detailed feedback..."
                placeholderTextColor={appColors.grey4}
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
                maxLength={1000}
              />
              <Text style={styles.charCount}>{message.length}/1000</Text>
            </View>
          </View>

          {/* Optional Email */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EMAIL (OPTIONAL)</Text>
            <View style={styles.inputContainer}>
              <Icon name="email" type="material" color={appColors.grey4} size={20} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.emailInput]}
                placeholder="your.email@example.com"
                placeholderTextColor={appColors.grey4}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <Text style={styles.helperText}>
              We'll only use this to follow up on your feedback if needed
            </Text>
          </View>

          {/* Quick Tips */}
          <View style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <Icon name="tips-and-updates" type="material" color={appColors.AppBlue} size={20} />
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
    paddingHorizontal: 20,
  },
  headerCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 15,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
    lineHeight: 22,
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
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeButton: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    borderWidth: 2,
    padding: 12,
    alignItems: 'center',
    minWidth: '30%',
    flex: 1,
  },
  typeButtonActive: {
    backgroundColor: appColors.CardBackground,
  },
  typeLabel: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextMedium,
    marginTop: 6,
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 16,
    position: 'relative',
  },
  input: {
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.headerTextRegular,
    padding: 0,
  },
  messageInput: {
    minHeight: 150,
    paddingBottom: 24,
  },
  emailInput: {
    paddingLeft: 32,
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 18,
  },
  charCount: {
    position: 'absolute',
    right: 16,
    bottom: 12,
    fontSize: 12,
    color: appColors.grey4,
    fontFamily: appFonts.headerTextRegular,
  },
  helperText: {
    fontSize: 13,
    color: appColors.grey4,
    fontFamily: appFonts.headerTextRegular,
    marginTop: 8,
    marginLeft: 4,
  },
  tipsCard: {
    backgroundColor: appColors.AppBlue + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
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
    flexDirection: 'row',
    marginBottom: 6,
  },
  bullet: {
    fontSize: 14,
    color: appColors.AppBlue,
    marginRight: 8,
    fontWeight: 'bold',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    lineHeight: 20,
  },
  submitContainer: {
    marginBottom: 20,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default SendFeedbackScreen;
