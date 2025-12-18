/**
 * Create Ticket Screen - Form to create new support tickets
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
import { Icon, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import { createNewTicket } from '../../utils/supportTicketsManager';
import { selectTicketsSubmitting } from '../../features/supportTickets/supportTicketsSlice';

interface FormData {
  subject: string;
  category: string;
  priority: string;
  description: string;
}

interface FormErrors {
  subject?: string;
  category?: string;
  description?: string;
}

interface CreateTicketScreenProps {
  navigation: any;
  route?: any;
}

const CreateTicketScreen: React.FC<CreateTicketScreenProps> = ({ navigation, route }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const userId = useSelector((state: any) => state.userData.userDetails.userId);
  const isSubmitting = useSelector(selectTicketsSubmitting);
  const preselectedCategory = route?.params?.category || '';

  const [formData, setFormData] = useState<FormData>({
    subject: '',
    category: preselectedCategory,
    priority: 'Medium',
    description: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const categories = [
    'Technical Issue',
    'Account Problem',
    'Billing',
    'Feature Request',
    'General',
  ];

  const priorities = [
    { value: 'Low', color: '#4CAF50', description: 'Not urgent, can wait' },
    { value: 'Medium', color: '#FF9800', description: 'Important but not critical' },
    { value: 'High', color: '#FF5722', description: 'Needs attention soon' },
    { value: 'Urgent', color: '#F44336', description: 'Critical issue, immediate attention needed' },
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const ticketData = {
      subject: formData.subject.trim(),
      category: formData.category,
      priority: formData.priority,
      description: formData.description.trim(),
    };

    const result = await dispatch(createNewTicket(userId, ticketData));

    if (result.success) {
      toast.show({
        description: 'Support ticket created successfully!',
        duration: 3000,
      });

      // Reset form
      setFormData({
        subject: '',
        category: '',
        priority: 'Medium',
        description: '',
      });
      setErrors({});

      // Navigate back to tickets list
      setTimeout(() => {
        navigation.navigate('MyTicketsScreen');
      }, 500);
    } else {
      toast.show({
        description: 'Failed to create support ticket. Please try again.',
        duration: 3000,
      });
    }
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const renderCategorySelector = () => (
    <View style={styles.formGroup}>
      <Text style={styles.label}>Category *</Text>
      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              formData.category === category && styles.categoryChipSelected
            ]}
            onPress={() => updateFormData('category', category)}
          >
            <Text style={[
              styles.categoryChipText,
              formData.category === category && styles.categoryChipTextSelected
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
    </View>
  );

  const renderPrioritySelector = () => (
    <View style={styles.formGroup}>
      <Text style={styles.label}>Priority</Text>
      <View style={styles.priorityContainer}>
        {priorities.map((priority) => (
          <TouchableOpacity
            key={priority.value}
            style={[
              styles.priorityOption,
              formData.priority === priority.value && styles.priorityOptionSelected
            ]}
            onPress={() => updateFormData('priority', priority.value)}
          >
            <View style={styles.priorityHeader}>
              <View style={[styles.priorityDot, { backgroundColor: priority.color }]} />
              <Text style={[
                styles.priorityText,
                formData.priority === priority.value && styles.priorityTextSelected
              ]}>
                {priority.value}
              </Text>
              {formData.priority === priority.value && (
                <Icon name="check" type="material" color={appColors.AppBlue} size={20} />
              )}
            </View>
            <Text style={styles.priorityDescription}>{priority.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

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
        
        <Text style={styles.headerTitle}>Create Support Ticket</Text>
        
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Help Text */}
          <View style={styles.helpSection}>
            <Icon name="info" type="material" color={appColors.AppBlue} size={24} />
            <Text style={styles.helpText}>
              Please provide as much detail as possible to help us resolve your issue quickly.
            </Text>
          </View>

          {/* Subject Field */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Subject *</Text>
            <TextInput
              style={[styles.textInput, errors.subject && styles.textInputError]}
              placeholder="Brief description of your issue"
              placeholderTextColor={appColors.grey3}
              value={formData.subject}
              onChangeText={(text) => updateFormData('subject', text)}
              maxLength={100}
            />
            <View style={styles.inputFooter}>
              {errors.subject && <Text style={styles.errorText}>{errors.subject}</Text>}
              <Text style={styles.characterCount}>{formData.subject.length}/100</Text>
            </View>
          </View>

          {/* Category Selector */}
          {renderCategorySelector()}

          {/* Priority Selector */}
          {renderPrioritySelector()}

          {/* Description Field */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[
                styles.textInput, 
                styles.textAreaInput,
                errors.description && styles.textInputError
              ]}
              placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce the problem, and what you expected to happen."
              placeholderTextColor={appColors.grey3}
              value={formData.description}
              onChangeText={(text) => updateFormData('description', text)}
              multiline
              numberOfLines={6}
              maxLength={1000}
              textAlignVertical="top"
            />
            <View style={styles.inputFooter}>
              {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
              <Text style={styles.characterCount}>{formData.description.length}/1000</Text>
            </View>
          </View>

          {/* Future Attachments Section */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Attachments</Text>
            <View style={styles.attachmentPlaceholder}>
              <Icon name="attach-file" type="material" color={appColors.grey3} size={24} />
              <Text style={styles.attachmentText}>
                File attachments will be available in a future update
              </Text>
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <Button
            title={isSubmitting ? "Creating Ticket..." : "Create Ticket"}
            onPress={handleSubmit}
            disabled={isSubmitting}
            loading={isSubmitting}
            buttonStyle={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled
            ]}
            titleStyle={styles.submitButtonText}
          />
          
          <Text style={styles.submitNote}>
            You'll receive email notifications about updates to your ticket
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
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  helpSection: {
    backgroundColor: appColors.AppBlue + '20',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  helpText: {
    flex: 1,
    fontSize: 14,
    color: appColors.AppBlue,
    fontFamily: appFonts.regularText,
    marginLeft: 12,
    lineHeight: 20,
  },
  formGroup: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: appColors.CardBackground,
    borderWidth: 1,
    borderColor: appColors.grey6,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.regularText,
  },
  textInputError: {
    borderColor: '#F44336',
  },
  textAreaInput: {
    minHeight: 120,
    paddingTop: 12,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#F44336',
    fontFamily: appFonts.regularText,
  },
  characterCount: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.regularText,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  categoryChip: {
    backgroundColor: appColors.grey6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryChipSelected: {
    backgroundColor: appColors.AppBlue + '20',
    borderColor: appColors.AppBlue,
  },
  categoryChipText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.regularText,
  },
  categoryChipTextSelected: {
    color: appColors.AppBlue,
    fontWeight: '600',
  },
  priorityContainer: {
    marginTop: 8,
  },
  priorityOption: {
    backgroundColor: appColors.CardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: appColors.grey6,
  },
  priorityOptionSelected: {
    borderColor: appColors.AppBlue,
    backgroundColor: appColors.AppBlue + '10',
  },
  priorityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  priorityText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  priorityTextSelected: {
    color: appColors.AppBlue,
  },
  priorityDescription: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.regularText,
    marginLeft: 24,
  },
  attachmentPlaceholder: {
    backgroundColor: appColors.grey6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: appColors.grey5,
    borderStyle: 'dashed',
  },
  attachmentText: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.regularText,
    marginLeft: 12,
  },
  bottomSpacer: {
    height: 100,
  },
  submitContainer: {
    backgroundColor: appColors.CardBackground,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitButton: {
    backgroundColor: appColors.AppBlue,
    paddingVertical: 16,
    borderRadius: 12,
  },
  submitButtonDisabled: {
    backgroundColor: appColors.grey4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  submitNote: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.regularText,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default CreateTicketScreen;
