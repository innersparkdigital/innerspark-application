/**
 * Emergency Landing Screen - Main emergency help hub
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button, Skeleton } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import { NavigationProp } from '@react-navigation/native';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isAvailable: boolean;
  lastContact?: string;
}

interface CrisisLine {
  id: string;
  name: string;
  phone: string;
  description: string;
  availability: string;
  location: string;
  category: 'general' | 'suicide' | 'domestic' | 'mental_health' | 'youth';
  isActive: boolean;
}

interface EmergencyLandingScreenProps {
  navigation: NavigationProp<any>;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const EmergencyLandingScreen: React.FC<EmergencyLandingScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [crisisLines, setCrisisLines] = useState<CrisisLine[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadEmergencyData();
  }, []);

  const loadEmergencyData = async () => {
    setIsLoading(true);
    try {
      // Mock emergency contacts
      const mockContacts: EmergencyContact[] = [
        {
          id: '1',
          name: 'Dr. Sarah Johnson',
          phone: '+256-700-123-456',
          relationship: 'Primary Therapist',
          isAvailable: true,
          lastContact: '2024-03-20',
        },
        {
          id: '2',
          name: 'John Doe',
          phone: '+256-700-789-012',
          relationship: 'Emergency Contact',
          isAvailable: true,
          lastContact: '2024-03-18',
        },
        {
          id: '3',
          name: 'Crisis Counselor',
          phone: '+256-800-CRISIS',
          relationship: 'Crisis Support',
          isAvailable: true,
        },
      ];

      // Mock crisis lines
      const mockCrisisLines: CrisisLine[] = [
        {
          id: '1',
          name: 'Uganda National Crisis Line',
          phone: '+256-800-567-890',
          description: 'Free 24/7 crisis support for mental health emergencies',
          availability: '24/7',
          location: 'Uganda',
          category: 'general',
          isActive: true,
        },
        {
          id: '2',
          name: 'Suicide Prevention Hotline',
          phone: '+256-900-HELP',
          description: 'Immediate support for suicidal thoughts and crisis intervention',
          availability: '24/7',
          location: 'Uganda',
          category: 'suicide',
          isActive: true,
        },
        {
          id: '3',
          name: 'Mental Health Crisis Line',
          phone: '+256-700-MIND',
          description: 'Professional mental health crisis support and guidance',
          availability: 'Mon-Fri 8AM-8PM',
          location: 'Kampala',
          category: 'mental_health',
          isActive: true,
        },
        {
          id: '4',
          name: 'Youth Crisis Support',
          phone: '+256-800-YOUTH',
          description: 'Specialized crisis support for young people under 25',
          availability: '24/7',
          location: 'Uganda',
          category: 'youth',
          isActive: true,
        },
      ];

      setEmergencyContacts(mockContacts);
      setCrisisLines(mockCrisisLines);
    } catch (error) {
      toast.show({
        description: 'Failed to load emergency data',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadEmergencyData();
    setIsRefreshing(false);
  };

  const handleCall = async (phone: string, name: string) => {
    try {
      const phoneUrl = `tel:${phone}`;
      const canOpen = await Linking.canOpenURL(phoneUrl);
      
      if (canOpen) {
        Alert.alert(
          'Emergency Call',
          `Call ${name} at ${phone}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Call Now', 
              style: 'destructive',
              onPress: () => Linking.openURL(phoneUrl)
            }
          ]
        );
      } else {
        toast.show({
          description: 'Unable to make calls on this device',
          duration: 3000,
        });
      }
    } catch (error) {
      toast.show({
        description: 'Failed to initiate call',
        duration: 2000,
      });
    }
  };

  const handlePanicButton = () => {
    navigation.navigate('PanicButtonScreen');
  };

  const handleSafetyPlan = () => {
    navigation.navigate('SafetyPlanScreen');
  };

  const handleCalmingAudio = () => {
    toast.show({
      description: 'Starting calming audio session...',
      duration: 3000,
    });
    // Future: Navigate to audio player or start audio
  };

  const categories = [
    { key: 'all', label: 'All', icon: 'help' },
    { key: 'general', label: 'General', icon: 'support' },
    { key: 'suicide', label: 'Suicide Prevention', icon: 'psychology' },
    { key: 'mental_health', label: 'Mental Health', icon: 'healing' },
    { key: 'youth', label: 'Youth Support', icon: 'child-care' },
  ];

  const filteredCrisisLines = selectedCategory === 'all' 
    ? crisisLines 
    : crisisLines.filter(line => line.category === selectedCategory);

  const QuickActionsCard: React.FC = () => (
    <View style={styles.quickActionsCard}>
      <Text style={styles.cardTitle}>Quick Emergency Actions</Text>
      
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity style={styles.quickActionButton} onPress={handlePanicButton}>
          <View style={[styles.quickActionIcon, { backgroundColor: '#F44336' }]}>
            <Icon name="warning" type="material" color="#FFF" size={24} />
          </View>
          <Text style={styles.quickActionText}>Panic Button</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickActionButton} 
          onPress={() => emergencyContacts.length > 0 && handleCall(emergencyContacts[0].phone, emergencyContacts[0].name)}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: '#FF9800' }]}>
            <Icon name="phone" type="material" color="#FFF" size={24} />
          </View>
          <Text style={styles.quickActionText}>Call Counselor</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionButton} onPress={handleCalmingAudio}>
          <View style={[styles.quickActionIcon, { backgroundColor: '#4CAF50' }]}>
            <Icon name="music-note" type="material" color="#FFF" size={24} />
          </View>
          <Text style={styles.quickActionText}>Calming Audio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionButton} onPress={handleSafetyPlan}>
          <View style={[styles.quickActionIcon, { backgroundColor: '#2196F3' }]}>
            <Icon name="security" type="material" color="#FFF" size={24} />
          </View>
          <Text style={styles.quickActionText}>Safety Plan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const EmergencyContactsCard: React.FC = () => (
    <View style={styles.contactsCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Emergency Contacts</Text>
        <TouchableOpacity onPress={() => toast.show({ description: 'Manage contacts feature coming soon' })}>
          <Text style={styles.manageText}>Manage</Text>
        </TouchableOpacity>
      </View>

      {emergencyContacts.map((contact) => (
        <View key={contact.id} style={styles.contactItem}>
          <View style={styles.contactInfo}>
            <View style={styles.contactHeader}>
              <Text style={styles.contactName}>{contact.name}</Text>
              {contact.isAvailable && (
                <View style={styles.availableBadge}>
                  <Text style={styles.availableText}>Available</Text>
                </View>
              )}
            </View>
            <Text style={styles.contactRelationship}>{contact.relationship}</Text>
            <Text style={styles.contactPhone}>{contact.phone}</Text>
            {contact.lastContact && (
              <Text style={styles.lastContact}>Last contact: {contact.lastContact}</Text>
            )}
          </View>
          <TouchableOpacity 
            style={styles.callButton}
            onPress={() => handleCall(contact.phone, contact.name)}
          >
            <Icon name="phone" type="material" color="#FFF" size={20} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const CrisisLinesCard: React.FC = () => (
    <View style={styles.crisisLinesCard}>
      <Text style={styles.cardTitle}>Crisis Support Lines</Text>
      
      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilter}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.key}
            style={[
              styles.categoryChip,
              selectedCategory === category.key && styles.activeCategoryChip
            ]}
            onPress={() => setSelectedCategory(category.key)}
          >
            <Icon 
              name={category.icon} 
              type="material" 
              color={selectedCategory === category.key ? '#FFF' : appColors.grey3} 
              size={16} 
            />
            <Text style={[
              styles.categoryText,
              selectedCategory === category.key && styles.activeCategoryText
            ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filteredCrisisLines.map((line) => (
        <View key={line.id} style={styles.crisisLineItem}>
          <View style={styles.crisisLineInfo}>
            <View style={styles.crisisLineHeader}>
              <Text style={styles.crisisLineName}>{line.name}</Text>
              {line.isActive && (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeText}>Active</Text>
                </View>
              )}
            </View>
            <Text style={styles.crisisLineDescription}>{line.description}</Text>
            <View style={styles.crisisLineMeta}>
              <Text style={styles.crisisLineAvailability}>📞 {line.availability}</Text>
              <Text style={styles.crisisLineLocation}>📍 {line.location}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.crisisCallButton}
            onPress={() => handleCall(line.phone, line.name)}
          >
            <Icon name="phone" type="material" color="#FFF" size={20} />
            <Text style={styles.callButtonText}>Call</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" type="material" color={appColors.grey1} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Emergency Help</Text>
          <View style={styles.placeholder} />
        </View>
        
        <ScrollView style={styles.scrollView}>
          <View style={styles.loadingContainer}>
            <Skeleton animation="pulse" width="100%" height={120} style={{ marginBottom: 20 }} />
            <Skeleton animation="pulse" width="100%" height={200} style={{ marginBottom: 20 }} />
            <Skeleton animation="pulse" width="100%" height={300} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>Emergency Help</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={handleRefresh}
        >
          <Icon name="refresh" type="material" color={appColors.AppBlue} size={24} />
        </TouchableOpacity>
      </View>

      {/* Emergency Banner */}
      <View style={styles.emergencyBanner}>
        <Icon name="warning" type="material" color="#F44336" size={24} />
        <View style={styles.bannerText}>
          <Text style={styles.bannerTitle}>Need immediate help?</Text>
          <Text style={styles.bannerSubtitle}>If you're in immediate danger, call emergency services</Text>
        </View>
        <TouchableOpacity 
          style={styles.emergencyCallButton}
          onPress={() => handleCall('911', 'Emergency Services')}
        >
          <Text style={styles.emergencyCallText}>911</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[appColors.AppBlue]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <QuickActionsCard />
        <EmergencyContactsCard />
        <CrisisLinesCard />
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  },
  refreshButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  emergencyBanner: {
    backgroundColor: '#FFEBEE',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  bannerText: {
    flex: 1,
    marginLeft: 12,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C62828',
    fontFamily: appFonts.headerTextBold,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#D32F2F',
    fontFamily: appFonts.headerTextRegular,
    marginTop: 2,
  },
  emergencyCallButton: {
    backgroundColor: '#F44336',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 12,
  },
  emergencyCallText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    padding: 20,
  },
  quickActionsCard: {
    backgroundColor: appColors.CardBackground,
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextMedium,
    textAlign: 'center',
  },
  contactsCard: {
    backgroundColor: appColors.CardBackground,
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  manageText: {
    fontSize: 14,
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextMedium,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey6,
  },
  contactInfo: {
    flex: 1,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  availableBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  availableText: {
    fontSize: 10,
    color: '#FFF',
    fontFamily: appFonts.headerTextBold,
  },
  contactRelationship: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 14,
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextMedium,
    marginBottom: 2,
  },
  lastContact: {
    fontSize: 12,
    color: appColors.grey4,
    fontFamily: appFonts.headerTextRegular,
  },
  callButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    padding: 10,
    marginLeft: 12,
  },
  crisisLinesCard: {
    backgroundColor: appColors.CardBackground,
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryFilter: {
    marginBottom: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.grey6,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  activeCategoryChip: {
    backgroundColor: appColors.AppBlue,
  },
  categoryText: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: 4,
  },
  activeCategoryText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  crisisLineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey6,
  },
  crisisLineInfo: {
    flex: 1,
  },
  crisisLineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  crisisLineName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  activeBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  activeText: {
    fontSize: 10,
    color: '#FFF',
    fontFamily: appFonts.headerTextBold,
  },
  crisisLineDescription: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    marginBottom: 8,
    lineHeight: 20,
  },
  crisisLineMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  crisisLineAvailability: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  crisisLineLocation: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  crisisCallButton: {
    backgroundColor: '#F44336',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  callButtonText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
    marginLeft: 4,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default EmergencyLandingScreen;
