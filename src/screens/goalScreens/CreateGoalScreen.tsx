/**
 * Create Goal Screen - Form to create new mental health goals
 */
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import { useToast } from 'native-base';
import { NavigationProp } from '@react-navigation/native';
import ISStatusBar from '../../components/ISStatusBar';
import { createNewGoal } from '../../utils/goalsManager';
import ISAlert, { useISAlert } from '../../components/alerts/ISAlert';

interface CreateGoalScreenProps {
  navigation: NavigationProp<any>;
}

const CreateGoalScreen: React.FC<CreateGoalScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const alert = useISAlert();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const categories = [
    'Mindfulness', 'Physical Health', 'Professional Help',
    'Self-Awareness', 'Relationships', 'Lifestyle', 'Learning'
  ];

  const priorities = [
    { value: 'high', label: 'High', color: '#F44336' },
    { value: 'medium', label: 'Medium', color: '#FF9800' },
    { value: 'low', label: 'Low', color: '#4CAF50' },
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!dueDate.trim()) {
      newErrors.dueDate = 'Due date is required';
    } else {
      // Simple date validation (YYYY-MM-DD format)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(dueDate)) {
        newErrors.dueDate = 'Please use YYYY-MM-DD format';
      } else {
        const selectedDate = new Date(dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
          newErrors.dueDate = 'Due date cannot be in the past';
        }
      }
    }

    if (!category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.show({
        description: 'Please fix the errors before saving',
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      // Prepare goal data according to API format
      const goalData = {
        title: title.trim(),
        description: description.trim(),
        dueDate,
        category,
        priority,
      };

      // Create goal via API
      const result = await createNewGoal(goalData);

      if (result.success) {
        toast.show({
          description: 'Goal created successfully! 🎯',
          duration: 3000,
        });

        navigation.goBack();
      } else {
        toast.show({
          description: result.error || 'Failed to create goal. Please try again.',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.show({
        description: 'Failed to create goal. Please try again.',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (title || description || dueDate || category !== '') {
      alert.show({
        type: 'destructive',
        title: 'Discard Changes',
        message: 'Are you sure you want to discard your changes?',
        confirmText: 'Discard',
        cancelText: 'Keep Editing',
        onConfirm: () => navigation.goBack(),
      });
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar backgroundColor={appColors.AppBlue} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
          <Icon name="close" type="material" color={appColors.CardBackground} size={moderateScale(24)} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Goal</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Title Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Goal Title *</Text>
            <TextInput
              style={[styles.textInput, errors.title && styles.errorInput]}
              placeholder="e.g., Daily Meditation Practice"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
              placeholderTextColor={appColors.AppGray}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
            <Text style={styles.characterCount}>{title.length}/100</Text>
          </View>

          {/* Description Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Description *</Text>
            <TextInput
              style={[styles.textArea, errors.description && styles.errorInput]}
              placeholder="Describe your goal in detail. What do you want to achieve and why is it important to you?"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={500}
              placeholderTextColor={appColors.AppGray}
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
            <Text style={styles.characterCount}>{description.length}/500</Text>
          </View>

          {/* Due Date Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Due Date *</Text>
            <TextInput
              style={[styles.textInput, errors.dueDate && styles.errorInput]}
              placeholder="YYYY-MM-DD (e.g., 2024-02-15)"
              value={dueDate}
              onChangeText={setDueDate}
              placeholderTextColor={appColors.AppGray}
            />
            {errors.dueDate && <Text style={styles.errorText}>{errors.dueDate}</Text>}
            <Text style={styles.helpText}>When do you want to achieve this goal?</Text>
          </View>

          {/* Category Selection */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Category *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    category === cat && styles.selectedCategoryChip
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[
                    styles.categoryChipText,
                    category === cat && styles.selectedCategoryText
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
          </View>

          {/* Priority Selection */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Priority</Text>
            <View style={styles.priorityContainer}>
              {priorities.map((p) => (
                <TouchableOpacity
                  key={p.value}
                  style={[
                    styles.priorityChip,
                    priority === p.value && { backgroundColor: p.color + '20', borderColor: p.color }
                  ]}
                  onPress={() => setPriority(p.value as 'high' | 'medium' | 'low')}
                >
                  <View style={[styles.priorityDot, { backgroundColor: p.color }]} />
                  <Text style={[
                    styles.priorityText,
                    priority === p.value && { color: p.color }
                  ]}>
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Goal Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 Tips for Effective Goals</Text>
            <Text style={styles.tipText}>• Be specific and measurable</Text>
            <Text style={styles.tipText}>• Set realistic deadlines</Text>
            <Text style={styles.tipText}>• Break large goals into smaller steps</Text>
            <Text style={styles.tipText}>• Focus on progress, not perfection</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.bottomContainer}>
        <Button
          title="Create Goal"
          onPress={handleSave}
          loading={isLoading}
          disabled={isLoading}
          buttonStyle={styles.saveButton}
          titleStyle={styles.saveButtonText}
        />
      </View>
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
    backgroundColor: appColors.AppBlue,
    paddingTop: scale(parameters.headerHeightS),
    paddingBottom: scale(15),
    paddingHorizontal: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
  },
  backButton: {
    padding: scale(8),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  placeholder: {
    width: scale(40),
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: scale(20),
  },
  fieldContainer: {
    marginBottom: scale(24),
  },
  fieldLabel: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: scale(8),
    fontFamily: appFonts.headerTextBold,
  },
  textInput: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(12),
    padding: scale(16),
    fontSize: moderateScale(16),
    color: appColors.grey1,
    borderWidth: scale(1),
    borderColor: appColors.AppLightGray,
    fontFamily: appFonts.headerTextRegular,
  },
  textArea: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(12),
    padding: scale(16),
    fontSize: moderateScale(16),
    color: appColors.grey1,
    borderWidth: scale(1),
    borderColor: appColors.AppLightGray,
    minHeight: scale(100),
    textAlignVertical: 'top',
    fontFamily: appFonts.headerTextRegular,
  },
  errorInput: {
    borderColor: '#F44336',
    borderWidth: scale(2),
  },
  errorText: {
    color: '#F44336',
    fontSize: moderateScale(12),
    marginTop: scale(4),
    fontFamily: appFonts.headerTextRegular,
  },
  characterCount: {
    fontSize: moderateScale(12),
    color: appColors.grey2,
    textAlign: 'right',
    marginTop: scale(4),
    fontFamily: appFonts.headerTextRegular,
  },
  helpText: {
    fontSize: moderateScale(12),
    color: appColors.grey2,
    marginTop: scale(4),
    fontFamily: appFonts.headerTextRegular,
  },
  categoryScroll: {
    marginBottom: scale(8),
  },
  categoryChip: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(20),
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    marginRight: scale(8),
    borderWidth: scale(1),
    borderColor: appColors.AppLightGray,
  },
  selectedCategoryChip: {
    backgroundColor: appColors.AppBlue,
    borderColor: appColors.AppBlue,
  },
  categoryChipText: {
    fontSize: moderateScale(14),
    color: appColors.grey1,
    fontFamily: appFonts.headerTextMedium,
  },
  selectedCategoryText: {
    color: appColors.CardBackground,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(12),
    padding: scale(12),
    marginHorizontal: scale(4),
    borderWidth: scale(1),
    borderColor: appColors.AppLightGray,
  },
  priorityDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    marginRight: scale(8),
  },
  priorityText: {
    fontSize: moderateScale(14),
    color: appColors.grey1,
    fontFamily: appFonts.headerTextMedium,
  },
  tipsContainer: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(12),
    padding: scale(16),
    marginTop: scale(8),
  },
  tipsTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: scale(12),
    fontFamily: appFonts.headerTextBold,
  },
  tipText: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    marginBottom: scale(4),
    fontFamily: appFonts.headerTextRegular,
  },
  bottomContainer: {
    backgroundColor: appColors.CardBackground,
    padding: scale(20),
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(-2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
  },
  saveButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: scale(25),
    paddingVertical: scale(15),
  },
  saveButtonText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
});

export default CreateGoalScreen;
