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
  Linking,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import { NavigationProp } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';
import { getSafetyPlan, updateSafetyPlan } from '../../api/client/emergency';
import { mockSafetyPlan } from '../../global/MockData';
import { setSafetyPlan as setSafetyPlanRedux } from '../../features/emergency/emergencySlice';

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
  const dispatch = useDispatch();
  const userId = useSelector((state: any) => state.userData.userDetails?.id);
  
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
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadSafetyPlan();
  }, []);

  const loadSafetyPlan = async () => {
    setIsLoading(true);
    try {
      console.log('📞 Calling getSafetyPlan API...');
      console.log('User ID:', userId);

      const response = await getSafetyPlan(userId);
      console.log('✅ Safety plan response:', response);

      // Handle response - could be nested in data or at root level
      const planData = response.data?.safetyPlan || response.safetyPlan || response.data || {};

      // Map API response to local format
      const mappedPlan: SafetyPlanData = {
        warningSignsPersonal: planData.warningSignsPersonal || planData.warning_signs_personal || [],
        warningSignsCrisis: planData.warningSignsCrisis || planData.warning_signs_crisis || [],
        copingStrategies: planData.copingStrategies || planData.coping_strategies || [],
        socialContacts: (planData.socialContacts || planData.social_contacts || []).map((c: any) => ({
          name: c.name,
          phone: c.phone || c.phoneNumber || c.phone_number,
          relationship: c.relationship,
        })),
        professionalContacts: (planData.professionalContacts || planData.professional_contacts || []).map((c: any) => ({
          name: c.name,
          phone: c.phone || c.phoneNumber || c.phone_number,
          role: c.role,
        })),
        environmentSafety: planData.environmentSafety || planData.environment_safety || [],
        reasonsToLive: planData.reasonsToLive || planData.reasons_to_live || [],
        emergencyContacts: (planData.emergencyContacts || planData.emergency_contacts || []).map((c: any) => ({
          name: c.name,
          phone: c.phone || c.phoneNumber || c.phone_number,
          available24h: c.available24h || c.available_24h || false,
        })),
        lastUpdated: planData.lastUpdated || planData.last_updated || new Date().toISOString(),
      };

      // Check if plan has any data
      const hasData = Object.values(mappedPlan).some(value => 
        Array.isArray(value) ? value.length > 0 : value !== ''
      );

      if (hasData) {
        setSafetyPlan(mappedPlan);
        dispatch(setSafetyPlanRedux(mappedPlan)); // ✅ Redux dispatch
      } else {
        // Use mock data if API returns empty plan
        console.log('ℹ️ No safety plan data found - using mock data');
        setSafetyPlan(mockSafetyPlan);
        dispatch(setSafetyPlanRedux(mockSafetyPlan)); // ✅ Redux dispatch
      }
    } catch (error: any) {
      console.error('❌ Error loading safety plan:', error);
      
      // Fallback to mock data on error
      setSafetyPlan(mockSafetyPlan);
      dispatch(setSafetyPlanRedux(mockSafetyPlan)); // ✅ Redux dispatch
      
      toast.show({
        description: 'Using offline safety plan. Some features may be limited.',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadSafetyPlan();
    setIsRefreshing(false);
  };
  

  const handleCall = (phone: string, name: string) => {
    const cleanNumber = phone.replace(/[^0-9]/g, '');
    Alert.alert(
      'Call ' + name,
      'Are you sure you want to call ' + phone + '?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => Linking.openURL(`tel:${cleanNumber}`),
        },
      ]
    );
  };


  const sections = [
    { key: 'warning_signs', label: 'Warning Signs', icon: 'warning' },
    { key: 'coping', label: 'Coping Strategies', icon: 'psychology' },
    { key: 'safety', label: 'Environment Safety', icon: 'security' },
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
          <Icon name="circle" type="material" color={appColors.AppBlue} size={8} style={styles.bulletIcon} />
          <Text style={styles.listItemText}>{sign}</Text>
        </View>
      ))}
      
      <Text style={[styles.subsectionTitle, { marginTop: 20 }]}>Crisis Warning Signs</Text>
      <Text style={styles.subsectionDescription}>
        More serious signs that indicate immediate help may be needed
      </Text>
      {safetyPlan.warningSignsCrisis.map((sign, index) => (
        <View key={index} style={styles.listItem}>
          <Icon name="circle" type="material" color="#F44336" size={8} style={styles.bulletIcon} />
          <Text style={styles.listItemText}>{sign}</Text>
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
          <Icon name="circle" type="material" color="#4CAF50" size={8} style={styles.bulletIcon} />
          <Text style={styles.listItemText}>{strategy}</Text>
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
          <TouchableOpacity
            style={styles.callIconButton}
            onPress={() => handleCall(contact.phone, contact.name)}
          >
            <Icon name="phone" type="material" color={appColors.AppBlue} size={20} />
          </TouchableOpacity>
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
          <TouchableOpacity
            style={styles.callIconButton}
            onPress={() => handleCall(contact.phone, contact.name)}
          >
            <Icon name="phone" type="material" color={appColors.AppBlue} size={20} />
          </TouchableOpacity>
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
          <Icon name="circle" type="material" color="#FF9800" size={8} style={styles.bulletIcon} />
          <Text style={styles.listItemText}>{step}</Text>
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
          <Icon name="favorite" type="material" color="#E91E63" size={16} style={styles.bulletIcon} />
          <Text style={styles.listItemText}>{reason}</Text>
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
            <TouchableOpacity
              style={styles.callIconButton}
              onPress={() => handleCall(contact.phone, contact.name)}
            >
              <Icon name="phone" type="material" color="#F44336" size={20} />
            </TouchableOpacity>
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
      case 'safety':
        return renderSafetySection();
      case 'emergency':
        return renderEmergencySection();
      default:
        return renderWarningSignsSection();
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar backgroundColor={appColors.AppBlue} />
      
      {/* Header */}
      <ISGenericHeader
        title="Safety Plan"
        navigation={navigation}
        hasRightIcon={false}
      />

      {/* Section Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
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
      </View>

      {/* Content */}
      <KeyboardAvoidingView 
        style={styles.content} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[appColors.AppBlue]}
            />
          }
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={appColors.AppBlue} />
              <Text style={styles.loadingText}>Loading safety plan...</Text>
            </View>
          ) : (
            <>
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
            </>
          )}
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
  tabsWrapper: {
    backgroundColor: appColors.CardBackground,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  tabsContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
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
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: appColors.AppLightGray,
    borderRadius: 8,
    marginBottom: 8,
  },
  bulletIcon: {
    marginRight: 12,
    marginTop: 6,
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
  callIconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: appColors.CardBackground,
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
  bottomSpacing: {
    height: 20,
  },
  loadingContainer: {
    backgroundColor: appColors.CardBackground,
    margin: 20,
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  loadingText: {
    fontSize: 16,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginTop: 12,
  },
});

export default SafetyPlanScreen;
