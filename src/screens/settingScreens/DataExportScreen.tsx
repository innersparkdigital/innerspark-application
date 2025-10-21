/**
 * Data Export Screen - Download and export user data
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

interface DataExportScreenProps {
  navigation: NavigationProp<any>;
}

interface DataCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  size: string;
  included: boolean;
}

const DataExportScreen: React.FC<DataExportScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'pdf'>('json');
  const [dataCategories, setDataCategories] = useState<DataCategory[]>([
    {
      id: 'profile',
      title: 'Profile Information',
      description: 'Name, email, phone, and account details',
      icon: 'person',
      iconColor: appColors.AppBlue,
      size: '< 1 MB',
      included: true,
    },
    {
      id: 'mood',
      title: 'Mood Tracking Data',
      description: 'All mood entries, patterns, and insights',
      icon: 'mood',
      iconColor: '#FF5722',
      size: '~2 MB',
      included: true,
    },
    {
      id: 'journal',
      title: 'Journal Entries',
      description: 'Personal reflections and notes',
      icon: 'book',
      iconColor: '#9C27B0',
      size: '~5 MB',
      included: true,
    },
    {
      id: 'therapy',
      title: 'Therapy Sessions',
      description: 'Session notes and progress records',
      icon: 'psychology',
      iconColor: '#4CAF50',
      size: '~3 MB',
      included: true,
    },
    {
      id: 'goals',
      title: 'Wellness Goals',
      description: 'Goals, milestones, and achievements',
      icon: 'flag',
      iconColor: '#FFC107',
      size: '< 1 MB',
      included: true,
    },
    {
      id: 'messages',
      title: 'Messages & Conversations',
      description: 'Chat history with therapists and support',
      icon: 'chat',
      iconColor: '#2196F3',
      size: '~4 MB',
      included: false,
    },
    {
      id: 'activity',
      title: 'Activity History',
      description: 'App usage and activity logs',
      icon: 'history',
      iconColor: '#607D8B',
      size: '< 1 MB',
      included: false,
    },
  ]);

  const toggleCategory = (id: string) => {
    setDataCategories(prev =>
      prev.map(cat =>
        cat.id === id ? { ...cat, included: !cat.included } : cat
      )
    );
  };

  const toggleAllCategories = (include: boolean) => {
    setDataCategories(prev =>
      prev.map(cat => ({ ...cat, included: include }))
    );
  };

  const handleExport = async () => {
    const selectedCategories = dataCategories.filter(cat => cat.included);
    
    if (selectedCategories.length === 0) {
      toast.show({
        description: 'Please select at least one data category to export',
        duration: 2000,
      });
      return;
    }

    Alert.alert(
      'Export Your Data',
      `You're about to export ${selectedCategories.length} data categories in ${exportFormat.toUpperCase()} format. This may take a few moments.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: async () => {
            setIsExporting(true);
            try {
              // Simulate export process
              await new Promise(resolve => setTimeout(resolve, 3000));
              
              toast.show({
                description: 'Data export complete! Check your email for the download link.',
                duration: 5000,
              });
              
              navigation.goBack();
            } catch (error) {
              toast.show({
                description: 'Export failed. Please try again.',
                duration: 3000,
              });
            } finally {
              setIsExporting(false);
            }
          },
        },
      ]
    );
  };

  const getTotalSize = () => {
    const included = dataCategories.filter(cat => cat.included);
    return `~${included.length * 2} MB`;
  };

  const renderDataCategory = (category: DataCategory) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryCard,
        category.included && styles.categoryCardSelected
      ]}
      onPress={() => toggleCategory(category.id)}
      activeOpacity={0.7}
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
          <Text style={styles.categoryTitle}>{category.title}</Text>
          <Text style={styles.categoryDescription}>{category.description}</Text>
          <Text style={styles.categorySize}>{category.size}</Text>
        </View>
      </View>
      <CheckBox
        checked={category.included}
        onPress={() => toggleCategory(category.id)}
        containerStyle={styles.checkbox}
        checkedColor={appColors.AppBlue}
        uncheckedColor={appColors.grey4}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ISGenericHeader
        title="Export Your Data"
        navigation={navigation}
        hasLightBackground={true}
      />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Icon name="cloud-download" type="material" color={appColors.AppBlue} size={48} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Download Your Data</Text>
            <Text style={styles.infoText}>
              Get a complete copy of your data. We'll send you a secure download link via email within 24 hours.
            </Text>
          </View>
        </View>

        {/* Export Format */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EXPORT FORMAT</Text>
          <View style={styles.formatContainer}>
            <TouchableOpacity
              style={[styles.formatButton, exportFormat === 'json' && styles.formatButtonActive]}
              onPress={() => setExportFormat('json')}
            >
              <Icon
                name="code"
                type="material"
                color={exportFormat === 'json' ? '#FFF' : appColors.grey3}
                size={20}
              />
              <Text style={[
                styles.formatText,
                exportFormat === 'json' && styles.formatTextActive
              ]}>
                JSON
              </Text>
              <Text style={[
                styles.formatSubtext,
                exportFormat === 'json' && styles.formatSubtextActive
              ]}>
                Machine readable
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.formatButton, exportFormat === 'csv' && styles.formatButtonActive]}
              onPress={() => setExportFormat('csv')}
            >
              <Icon
                name="table-chart"
                type="material"
                color={exportFormat === 'csv' ? '#FFF' : appColors.grey3}
                size={20}
              />
              <Text style={[
                styles.formatText,
                exportFormat === 'csv' && styles.formatTextActive
              ]}>
                CSV
              </Text>
              <Text style={[
                styles.formatSubtext,
                exportFormat === 'csv' && styles.formatSubtextActive
              ]}>
                Spreadsheet
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.formatButton, exportFormat === 'pdf' && styles.formatButtonActive]}
              onPress={() => setExportFormat('pdf')}
            >
              <Icon
                name="picture-as-pdf"
                type="material"
                color={exportFormat === 'pdf' ? '#FFF' : appColors.grey3}
                size={20}
              />
              <Text style={[
                styles.formatText,
                exportFormat === 'pdf' && styles.formatTextActive
              ]}>
                PDF
              </Text>
              <Text style={[
                styles.formatSubtext,
                exportFormat === 'pdf' && styles.formatSubtextActive
              ]}>
                Human readable
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Data Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>SELECT DATA TO EXPORT</Text>
            <View style={styles.selectButtons}>
              <TouchableOpacity onPress={() => toggleAllCategories(true)}>
                <Text style={styles.selectButton}>All</Text>
              </TouchableOpacity>
              <Text style={styles.selectDivider}>|</Text>
              <TouchableOpacity onPress={() => toggleAllCategories(false)}>
                <Text style={styles.selectButton}>None</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.categoriesContainer}>
            {dataCategories.map(renderDataCategory)}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Selected Categories:</Text>
            <Text style={styles.summaryValue}>
              {dataCategories.filter(cat => cat.included).length} of {dataCategories.length}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Estimated Size:</Text>
            <Text style={styles.summaryValue}>{getTotalSize()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Format:</Text>
            <Text style={styles.summaryValue}>{exportFormat.toUpperCase()}</Text>
          </View>
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyCard}>
          <Icon name="lock" type="material" color={appColors.AppBlue} size={20} />
          <View style={styles.privacyContent}>
            <Text style={styles.privacyTitle}>Privacy & Security</Text>
            <Text style={styles.privacyText}>
              Your data will be encrypted and sent to your registered email. The download link expires in 7 days.
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Export Button */}
      <View style={styles.exportButtonContainer}>
        <Button
          title={isExporting ? 'Preparing Export...' : 'Export My Data'}
          buttonStyle={styles.exportButton}
          titleStyle={styles.exportButtonText}
          onPress={handleExport}
          loading={isExporting}
          disabled={isExporting}
        />
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
  infoCard: {
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    lineHeight: 20,
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
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
    fontWeight: '600',
  },
  selectDivider: {
    fontSize: 14,
    color: appColors.grey4,
    marginHorizontal: 8,
  },
  formatContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  formatButton: {
    flex: 1,
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: appColors.grey5,
  },
  formatButtonActive: {
    backgroundColor: appColors.AppBlue,
    borderColor: appColors.AppBlue,
  },
  formatText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginTop: 8,
  },
  formatTextActive: {
    color: '#FFF',
  },
  formatSubtext: {
    fontSize: 12,
    color: appColors.grey4,
    fontFamily: appFonts.headerTextRegular,
    marginTop: 2,
  },
  formatSubtextActive: {
    color: '#FFF',
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
    borderColor: appColors.AppBlue,
    backgroundColor: appColors.AppBlue + '05',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
  categoryDescription: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginBottom: 4,
  },
  categorySize: {
    fontSize: 12,
    color: appColors.grey4,
    fontFamily: appFonts.headerTextRegular,
  },
  checkbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    margin: 0,
    padding: 0,
  },
  summaryCard: {
    backgroundColor: appColors.AppBlue + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 15,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  privacyCard: {
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  privacyContent: {
    flex: 1,
    marginLeft: 12,
  },
  privacyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  privacyText: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    lineHeight: 18,
  },
  exportButtonContainer: {
    padding: 20,
    backgroundColor: appColors.CardBackground,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  exportButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 12,
    paddingVertical: 16,
  },
  exportButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default DataExportScreen;
