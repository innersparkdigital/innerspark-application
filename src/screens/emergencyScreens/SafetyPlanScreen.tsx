/**
 * Safety Plan Screen - Personal safety plan creation and management
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
  Share,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import { NavigationProp } from '@react-navigation/native';

interface SafetyPlanData {
  warningSignsPersonal: string[];
  warningSignsCrisis: string[];
  copingStrategies: string[];
  socialContacts: { name: string; phone: string; relationship: string }[];
  professionalContacts: { name: string; phone: string; role: string }[];
  environmentSafety: string[];
  reasonsToLive: string[];
  emergencyContacts: { name: string; phone: string; available24h: boolean }[];
  lastUpdated: string;
}

interface SafetyPlanScreenProps {
  navigation: NavigationProp<any>;
}

const SafetyPlanScreen: React.FC<SafetyPlanScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const [safetyPlan, setSafetyPlan] = useState<SafetyPlanData>({
    warningSignsPersonal: [],
    warningSignsCrisis: [],
    copingStrategies: [],
    socialContacts: [],
    professionalContacts: [],
    environmentSafety: [],
    reasonsToLive: [],
    emergencyContacts: [],
    lastUpdated: '',
  });
  const [activeSection, setActiveSection] = useState<string>('warning_signs');
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    loadSafetyPlan();
  }, []);

  const loadSafetyPlan = async () => {
    try {
      // Mock safety plan data
      const mockPlan: SafetyPlanData = {
        warningSignsPersonal: [
          'Feeling overwhelmed or anxious',
          'Difficulty sleeping',
          'Loss of appetite',
          'Withdrawing from friends and family',
        ],
        warningSignsCrisis: [
          'Thoughts of self-harm',
          'Feeling hopeless',
          'Unable to cope with daily activities',
          'Substance use as coping mechanism',
        ],
        copingStrategies: [
          'Deep breathing exercises',
          'Listen to calming music',
          'Take a warm shower',
          'Write in journal',
          'Go for a walk',
        ],
        socialContacts: [
          { name: 'Sarah (Best Friend)', phone: '+256-700-111-222', relationship: 'Best Friend' },
          { name: 'Mom', phone: '+256-700-333-444', relationship: 'Mother' },
          { name: 'John (Brother)', phone: '+256-700-555-666', relationship: 'Brother' },
        ],
        professionalContacts: [
          { name: 'Dr. Sarah Johnson', phone: '+256-700-123-456', role: 'Primary Therapist' },
          { name: 'Crisis Counselor', phone: '+256-800-CRISIS', role: 'Crisis Support' },
        ],
        environmentSafety: [
          'Remove harmful objects from immediate environment',
          'Ask trusted person to stay with me',
          'Go to a safe, public place',
          'Avoid alcohol and substances',
        ],
        reasonsToLive: [
          'My family needs me',
          'My future goals and dreams',
          'My pets depend on me',
          'Things can get better with help',
          'I want to see what tomorrow brings',
        ],
        emergencyContacts: [
          { name: 'Emergency Services', phone: '911', available24h: true },
          { name: 'Crisis Hotline', phone: '+256-800-567-890', available24h: true },
          { name: 'Dr. Sarah Johnson', phone: '+256-700-123-456', available24h: false },
        ],
        lastUpdated: new Date().toISOString(),
      };

      setSafetyPlan(mockPlan);
    } catch (error) {
      toast.show({
        description: 'Failed to load safety plan',
        duration: 3000,
      });
    }
  };

  const saveSafetyPlan = async () => {
    try {
      const updatedPlan = {
        ...safetyPlan,
        lastUpdated: new Date().toISOString(),
      };
      
      setSafetyPlan(updatedPlan);
      setHasUnsavedChanges(false);
      setIsEditing(false);
      
      toast.show({
        description: 'Safety plan saved successfully',
        duration: 3000,
      });
    } catch (error) {
      toast.show({
        description: 'Failed to save safety plan',
        duration: 3000,
      });
    }
  };

  const handleShare = async () => {
    try {
      const planText = `My Safety Plan\n\n` +
        `Warning Signs:\n${safetyPlan.warningSignsPersonal.map(sign => `• ${sign}`).join('\n')}\n\n` +
        `Coping Strategies:\n${safetyPlan.copingStrategies.map(strategy => `• ${strategy}`).join('\n')}\n\n` +
        `Emergency Contacts:\n${safetyPlan.emergencyContacts.map(contact => `• ${contact.name}: ${contact.phone}`).join('\n')}\n\n` +
        `Last Updated: ${new Date(safetyPlan.lastUpdated).toLocaleDateString()}`;

      await Share.share({
        message: planText,
        title: 'My Safety Plan',
      });
    } catch (error) {
      toast.show({
        description: 'Failed to share safety plan',
        duration: 2000,
      });
    }
  };

  const addItem = (section: keyof SafetyPlanData, item: string | object) => {
    setSafetyPlan(prev => ({
      ...prev,
      [section]: [...(prev[section] as any[]), item],
    }));
    setHasUnsavedChanges(true);
  };

  const removeItem = (section: keyof SafetyPlanData, index: number) => {
    setSafetyPlan(prev => ({
      ...prev,
      [section]: (prev[section] as any[]).filter((_, i) => i !== index),
    }));
    setHasUnsavedChanges(true);
  };

  const sections = [
    { key: 'warning_signs', label: 'Warning Signs', icon: 'warning' },
    { key: 'coping', label: 'Coping Strategies', icon: 'psychology' },
    { key: 'contacts', label: 'Support Contacts', icon: 'people' },
    { key: 'safety', label: 'Environment Safety', icon: 'security' },
    { key: 'reasons', label: 'Reasons to Live', icon: 'favorite' },
    { key: 'emergency', label: 'Emergency Contacts', icon: 'emergency' },
  ];

  const renderWarningSignsSection = () => (
    <View style={styles.sectionContent}>
      <Text style={styles.subsectionTitle}>Personal Warning Signs</Text>
      <Text style={styles.subsectionDescription}>
        Early signs that indicate you may be struggling emotionally
      </Text>
      {safetyPlan.warningSignsPersonal.map((sign, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.listItemText}>{sign}</Text>
          {isEditing && (
            <TouchableOpacity onPress={() => removeItem('warningSignsPersonal', index)}>
              <Icon name="close" type="material" color="#F44336" size={20} />
            </TouchableOpacity>
          )}
        </View>
      ))}
      
      <Text style={[styles.subsectionTitle, { marginTop: 20 }]}>Crisis Warning Signs</Text>
      <Text style={styles.subsectionDescription}>
        More serious signs that indicate immediate help may be needed
      </Text>
      {safetyPlan.warningSignsCrisis.map((sign, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.listItemText}>{sign}</Text>
          {isEditing && (
            <TouchableOpacity onPress={() => removeItem('warningSignsCrisis', index)}>
              <Icon name="close" type="material" color="#F44336" size={20} />
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );

  const renderCopingSection = () => (
    <View style={styles.sectionContent}>
      <Text style={styles.subsectionDescription}>
        Healthy activities and strategies that help you cope with difficult emotions
      </Text>
      {safetyPlan.copingStrategies.map((strategy, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.listItemText}>{strategy}</Text>
          {isEditing && (
            <TouchableOpacity onPress={() => removeItem('copingStrategies', index)}>
              <Icon name="close" type="material" color="#F44336" size={20} />
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );

  const renderContactsSection = () => (
    <View style={styles.sectionContent}>
      <Text style={styles.subsectionTitle}>Social Support Contacts</Text>
      <Text style={styles.subsectionDescription}>
        Friends and family members who provide emotional support
      </Text>
      {safetyPlan.socialContacts.map((contact, index) => (
        <View key={index} style={styles.contactItem}>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>{contact.name}</Text>
            <Text style={styles.contactDetails}>{contact.phone} • {contact.relationship}</Text>
          </View>
          {isEditing && (
            <TouchableOpacity onPress={() => removeItem('socialContacts', index)}>
              <Icon name="close" type="material" color="#F44336" size={20} />
            </TouchableOpacity>
          )}
        </View>
      ))}
      
      <Text style={[styles.subsectionTitle, { marginTop: 20 }]}>Professional Contacts</Text>
      <Text style={styles.subsectionDescription}>
        Mental health professionals and counselors
      </Text>
      {safetyPlan.professionalContacts.map((contact, index) => (
        <View key={index} style={styles.contactItem}>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>{contact.name}</Text>
            <Text style={styles.contactDetails}>{contact.phone} • {contact.role}</Text>
          </View>
          {isEditing && (
            <TouchableOpacity onPress={() => removeItem('professionalContacts', index)}>
              <Icon name="close" type="material" color="#F44336" size={20} />
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );

  const renderSafetySection = () => (
    <View style={styles.sectionContent}>
      <Text style={styles.subsectionDescription}>
        Steps to make your environment safer during a crisis
      </Text>
      {safetyPlan.environmentSafety.map((step, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.listItemText}>{step}</Text>
          {isEditing && (
            <TouchableOpacity onPress={() => removeItem('environmentSafety', index)}>
              <Icon name="close" type="material" color="#F44336" size={20} />
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );

  const renderReasonsSection = () => (
    <View style={styles.sectionContent}>
      <Text style={styles.subsectionDescription}>
        Important reasons that motivate you to keep going during difficult times
      </Text>
      {safetyPlan.reasonsToLive.map((reason, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.listItemText}>{reason}</Text>
          {isEditing && (
            <TouchableOpacity onPress={() => removeItem('reasonsToLive', index)}>
              <Icon name="close" type="material" color="#F44336" size={20} />
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );

  const renderEmergencySection = () => (
    <View style={styles.sectionContent}>
      <Text style={styles.subsectionDescription}>
        Immediate contacts for crisis situations
      </Text>
      {safetyPlan.emergencyContacts.map((contact, index) => (
        <View key={index} style={styles.contactItem}>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>{contact.name}</Text>
            <Text style={styles.contactDetails}>
              {contact.phone} • {contact.available24h ? '24/7 Available' : 'Limited Hours'}
            </Text>
          </View>
          <View style={styles.contactActions}>
            {contact.available24h && (
              <View style={styles.availableBadge}>
                <Text style={styles.availableText}>24/7</Text>
              </View>
            )}
            {isEditing && (
              <TouchableOpacity onPress={() => removeItem('emergencyContacts', index)}>
                <Icon name="close" type="material" color="#F44336" size={20} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </View>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'warning_signs':
        return renderWarningSignsSection();
      case 'coping':
        return renderCopingSection();
      case 'contacts':
        return renderContactsSection();
      case 'safety':
        return renderSafetySection();
      case 'reasons':
        return renderReasonsSection();
      case 'emergency':
        return renderEmergencySection();
      default:
        return renderWarningSignsSection();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            if (hasUnsavedChanges) {
              Alert.alert(
                'Unsaved Changes',
                'You have unsaved changes. Do you want to save before leaving?',
                [
                  { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
                  { text: 'Save', onPress: () => { saveSafetyPlan(); navigation.goBack(); } },
                  { text: 'Cancel', style: 'cancel' },
                ]
              );
            } else {
              navigation.goBack();
            }
          }}
        >
          <Icon name="arrow-back" type="material" color={appColors.grey1} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Safety Plan</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Icon name="share" type="material" color={appColors.AppBlue} size={20} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => setIsEditing(!isEditing)}
          >
            <Icon 
              name={isEditing ? "check" : "edit"} 
              type="material" 
              color={isEditing ? "#4CAF50" : appColors.AppBlue} 
              size={20} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Section Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
        {sections.map((section) => (
          <TouchableOpacity
            key={section.key}
            style={[
              styles.tab,
              activeSection === section.key && styles.activeTab
            ]}
            onPress={() => setActiveSection(section.key)}
          >
            <Icon 
              name={section.icon} 
              type="material" 
              color={activeSection === section.key ? appColors.AppBlue : appColors.grey3} 
              size={18} 
            />
            <Text style={[
              styles.tabText,
              activeSection === section.key && styles.activeTabText
            ]}>
              {section.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <KeyboardAvoidingView 
        style={styles.content} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>
              {sections.find(s => s.key === activeSection)?.label}
            </Text>
            {renderSectionContent()}
          </View>

          {/* Last Updated */}
          <View style={styles.lastUpdatedCard}>
            <Icon name="update" type="material" color={appColors.grey3} size={16} />
            <Text style={styles.lastUpdatedText}>
              Last updated: {new Date(safetyPlan.lastUpdated).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Save Button */}
        {hasUnsavedChanges && (
          <View style={styles.saveButtonContainer}>
            <Button
              title="Save Safety Plan"
              buttonStyle={styles.saveButton}
              titleStyle={styles.saveButtonText}
              onPress={saveSafetyPlan}
            />
          </View>
        )}
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
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  tabsContainer: {
    backgroundColor: appColors.CardBackground,
    paddingVertical: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: appColors.AppBlue + '15',
  },
  tabText: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: 6,
  },
  activeTabText: {
    color: appColors.AppBlue,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  sectionCard: {
    backgroundColor: appColors.CardBackground,
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 16,
  },
  sectionContent: {
    flex: 1,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 8,
  },
  subsectionDescription: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginBottom: 16,
    lineHeight: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: appColors.AppLightGray,
    borderRadius: 8,
    marginBottom: 8,
  },
  listItemText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    flex: 1,
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: appColors.AppLightGray,
    borderRadius: 8,
    marginBottom: 8,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 2,
  },
  contactDetails: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availableBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  availableText: {
    fontSize: 10,
    color: '#FFF',
    fontFamily: appFonts.headerTextBold,
  },
  lastUpdatedCard: {
    backgroundColor: appColors.CardBackground,
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  lastUpdatedText: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: 8,
  },
  saveButtonContainer: {
    padding: 20,
    backgroundColor: appColors.CardBackground,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 12,
    paddingVertical: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default SafetyPlanScreen;
