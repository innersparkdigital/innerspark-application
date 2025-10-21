/**
 * Data Deletion Screen - Selective deletion of user data for privacy
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button, CheckBox } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import { NavigationProp } from '@react-navigation/native';
import ISGenericHeader from '../../components/ISGenericHeader';

interface DataDeletionScreenProps {
  navigation: NavigationProp<any>;
}

interface DataCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  itemCount: string;
  selected: boolean;
  canDelete: boolean;
  warning?: string;
}

const DataDeletionScreen: React.FC<DataDeletionScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [dataCategories, setDataCategories] = useState<DataCategory[]>([
    {
      id: 'mood_history',
      title: 'Mood Tracking History',
      description: 'All mood entries and emotional patterns',
      icon: 'mood',
      iconColor: '#FF5722',
      itemCount: '234 entries',
      selected: false,
      canDelete: true,
      warning: 'This will permanently delete all your mood tracking data',
    },
    {
      id: 'journal_entries',
      title: 'Journal Entries',
      description: 'Personal reflections and notes',
      icon: 'book',
      iconColor: '#9C27B0',
      itemCount: '87 entries',
      selected: false,
      canDelete: true,
      warning: 'Your journal entries will be permanently deleted',
    },
    {
      id: 'therapy_notes',
      title: 'Therapy Session Notes',
      description: 'Session records and progress notes',
      icon: 'psychology',
      iconColor: '#4CAF50',
      itemCount: '12 sessions',
      selected: false,
      canDelete: true,
      warning: 'Therapy session data will be permanently removed',
    },
    {
      id: 'messages',
      title: 'Messages & Conversations',
      description: 'Chat history with therapists',
      icon: 'chat',
      iconColor: '#2196F3',
      itemCount: '156 messages',
      selected: false,
      canDelete: true,
      warning: 'All conversation history will be deleted',
    },
    {
      id: 'goals',
      title: 'Wellness Goals',
      description: 'Goals and achievements',
      icon: 'flag',
      iconColor: '#FFC107',
      itemCount: '8 goals',
      selected: false,
      canDelete: true,
    },
    {
      id: 'activity_logs',
      title: 'Activity Logs',
      description: 'App usage and activity history',
      icon: 'history',
      iconColor: '#607D8B',
      itemCount: '90 days',
      selected: false,
      canDelete: true,
    },
    {
      id: 'profile_data',
      title: 'Profile Information',
      description: 'Name, email, and account details',
      icon: 'person',
      iconColor: appColors.AppBlue,
      itemCount: 'Account data',
      selected: false,
      canDelete: false,
      warning: 'Cannot delete profile data. Use "Delete Account" instead',
    },
  ]);

  const toggleCategory = (id: string) => {
    setDataCategories(prev =>
      prev.map(cat =>
        cat.id === id && cat.canDelete
          ? { ...cat, selected: !cat.selected }
          : cat
      )
    );
  };

  const toggleAllDeletable = (select: boolean) => {
    setDataCategories(prev =>
      prev.map(cat =>
        cat.canDelete ? { ...cat, selected: select } : cat
      )
    );
  };

  const handleDeleteData = async () => {
    const selectedCategories = dataCategories.filter(cat => cat.selected);
    
    if (selectedCategories.length === 0) {
      toast.show({
        description: 'Please select at least one data category to delete',
        duration: 2000,
      });
      return;
    }

    const categoryNames = selectedCategories.map(cat => cat.title).join(', ');

    Alert.alert(
      'Confirm Data Deletion',
      `You are about to permanently delete:\n\n${categoryNames}\n\nThis action cannot be undone. Are you sure?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              // Simulate API call
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              toast.show({
                description: `Successfully deleted ${selectedCategories.length} data categories`,
                duration: 3000,
              });
              
              // Reset selections
              setDataCategories(prev =>
                prev.map(cat => ({ ...cat, selected: false }))
              );
              
              navigation.goBack();
            } catch (error) {
              toast.show({
                description: 'Failed to delete data. Please try again.',
                duration: 3000,
              });
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const renderDataCategory = (category: DataCategory) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryCard,
        category.selected && styles.categoryCardSelected,
        !category.canDelete && styles.categoryCardDisabled,
      ]}
      onPress={() => toggleCategory(category.id)}
      activeOpacity={category.canDelete ? 0.7 : 1}
      disabled={!category.canDelete}
    >
      <View style={styles.categoryLeft}>
        <View style={[styles.iconContainer, { backgroundColor: category.iconColor + '15' }]}>
          <Icon
            name={category.icon}
            type="material"
            color={category.iconColor}
            size={24}
          />
        </View>
        <View style={styles.categoryContent}>
          <Text style={[
            styles.categoryTitle,
            !category.canDelete && styles.categoryTitleDisabled
          ]}>
            {category.title}
          </Text>
          <Text style={styles.categoryDescription}>{category.description}</Text>
          <Text style={styles.categoryCount}>{category.itemCount}</Text>
          {category.warning && category.selected && (
            <View style={styles.warningBox}>
              <Icon name="warning" type="material" color="#FF9800" size={14} />
              <Text style={styles.warningText}>{category.warning}</Text>
            </View>
          )}
        </View>
      </View>
      {category.canDelete ? (
        <CheckBox
          checked={category.selected}
          onPress={() => toggleCategory(category.id)}
          containerStyle={styles.checkbox}
          checkedColor="#F44336"
          uncheckedColor={appColors.grey4}
        />
      ) : (
        <Icon name="lock" type="material" color={appColors.grey4} size={20} />
      )}
    </TouchableOpacity>
  );

  const selectedCount = dataCategories.filter(cat => cat.selected).length;

  return (
    <SafeAreaView style={styles.container}>
      <ISGenericHeader
        title="Delete My Data"
        navigation={navigation}
        hasLightBackground={true}
      />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Warning Card */}
        <View style={styles.warningCard}>
          <Icon name="warning" type="material" color="#F44336" size={32} />
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>Permanent Data Deletion</Text>
            <Text style={styles.warningDescription}>
              Selected data will be permanently deleted and cannot be recovered. This action is irreversible.
            </Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Icon name="info" type="material" color={appColors.AppBlue} size={20} />
          <Text style={styles.infoText}>
            You can selectively delete specific types of data while keeping your account active. To delete your entire account, use the "Delete Account" option.
          </Text>
        </View>

        {/* Data Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>SELECT DATA TO DELETE</Text>
            <View style={styles.selectButtons}>
              <TouchableOpacity onPress={() => toggleAllDeletable(true)}>
                <Text style={styles.selectButton}>All</Text>
              </TouchableOpacity>
              <Text style={styles.selectDivider}>|</Text>
              <TouchableOpacity onPress={() => toggleAllDeletable(false)}>
                <Text style={styles.selectButton}>None</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.categoriesContainer}>
            {dataCategories.map(renderDataCategory)}
          </View>
        </View>

        {/* Alternative Options */}
        <View style={styles.alternativesCard}>
          <Text style={styles.alternativesTitle}>Consider These Alternatives</Text>
          
          <TouchableOpacity
            style={styles.alternativeItem}
            onPress={() => navigation.navigate('DataExportScreen')}
          >
            <Icon name="download" type="material" color={appColors.AppBlue} size={20} />
            <View style={styles.alternativeContent}>
              <Text style={styles.alternativeTitle}>Download Your Data First</Text>
              <Text style={styles.alternativeSubtitle}>Export before deleting</Text>
            </View>
            <Icon name="chevron-right" type="material" color={appColors.grey4} size={20} />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.alternativeItem}
            onPress={() => navigation.navigate('DeactivateAccountScreen')}
          >
            <Icon name="pause-circle" type="material" color="#FF9800" size={20} />
            <View style={styles.alternativeContent}>
              <Text style={styles.alternativeTitle}>Deactivate Account</Text>
              <Text style={styles.alternativeSubtitle}>Temporary, keeps your data safe</Text>
            </View>
            <Icon name="chevron-right" type="material" color={appColors.grey4} size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Delete Button */}
      <View style={styles.deleteButtonContainer}>
        {selectedCount > 0 && (
          <Text style={styles.selectionCount}>
            {selectedCount} {selectedCount === 1 ? 'category' : 'categories'} selected
          </Text>
        )}
        <Button
          title={isDeleting ? 'Deleting Data...' : 'Delete Selected Data'}
          buttonStyle={[
            styles.deleteButton,
            selectedCount === 0 && styles.disabledButton
          ]}
          titleStyle={styles.deleteButtonText}
          onPress={handleDeleteData}
          loading={isDeleting}
          disabled={isDeleting || selectedCount === 0}
        />
        <Text style={styles.deleteButtonSubtext}>
          This action cannot be undone
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: '#FFEBEE',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FFCDD2',
  },
  warningContent: {
    flex: 1,
    marginLeft: 16,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D32F2F',
    fontFamily: appFonts.headerTextBold,
    marginBottom: 6,
  },
  warningDescription: {
    fontSize: 14,
    color: '#D32F2F',
    fontFamily: appFonts.headerTextRegular,
    lineHeight: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: appColors.AppBlue + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: 12,
    lineHeight: 18,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectButton: {
    fontSize: 14,
    color: '#F44336',
    fontFamily: appFonts.headerTextBold,
    fontWeight: '600',
  },
  selectDivider: {
    fontSize: 14,
    color: appColors.grey4,
    marginHorizontal: 8,
  },
  categoriesContainer: {
    gap: 12,
  },
  categoryCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: appColors.grey6,
  },
  categoryCardSelected: {
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  categoryCardDisabled: {
    opacity: 0.5,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 2,
  },
  categoryTitleDisabled: {
    color: appColors.grey3,
  },
  categoryDescription: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: appColors.grey4,
    fontFamily: appFonts.headerTextRegular,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
  },
  warningText: {
    fontSize: 12,
    color: '#E65100',
    fontFamily: appFonts.headerTextRegular,
    marginLeft: 6,
    flex: 1,
  },
  checkbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    margin: 0,
    padding: 0,
  },
  alternativesCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  alternativesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 12,
  },
  alternativeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  alternativeContent: {
    flex: 1,
    marginLeft: 12,
  },
  alternativeTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextMedium,
    marginBottom: 2,
  },
  alternativeSubtitle: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  separator: {
    height: 1,
    backgroundColor: appColors.grey6,
    marginVertical: 4,
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
  selectionCount: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextMedium,
    textAlign: 'center',
    marginBottom: 12,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 8,
  },
  disabledButton: {
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

export default DataDeletionScreen;
