/**
 * Emergency Screen - Crisis support and emergency contacts
 */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../global/Styles';
import { useToast } from 'native-base';
import LHGenericHeader from '../components/LHGenericHeader';

const SCREEN_WIDTH = Dimensions.get('window').width;

const EmergencyScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const emergencyContacts = [
    {
      id: 1,
      name: 'Crisis Lifeline',
      number: '988',
      description: '24/7 suicide & crisis support',
      type: 'crisis',
      icon: 'phone',
      color: '#E91E63',
      urgent: true,
    },
    {
      id: 2,
      name: 'Emergency Services',
      number: '911',
      description: 'Immediate medical emergency',
      type: 'emergency',
      icon: 'local-hospital',
      color: '#F44336',
      urgent: true,
    },
    {
      id: 3,
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      description: 'Free 24/7 support via text',
      type: 'text',
      icon: 'message',
      color: '#2196F3',
      urgent: false,
    },
    {
      id: 4,
      name: 'SAMHSA Helpline',
      number: '1-800-662-4357',
      description: 'Treatment referral service',
      type: 'support',
      icon: 'support-agent',
      color: '#4CAF50',
      urgent: false,
    },
  ];

  const copingTools = [
    {
      id: 1,
      title: 'Deep Breathing',
      description: '4-7-8 breathing technique',
      icon: 'air',
      color: '#4CAF50',
      action: 'breathing',
    },
    {
      id: 2,
      title: '5-4-3-2-1 Grounding',
      description: 'Focus on your senses',
      icon: 'psychology',
      color: '#2196F3',
      action: 'grounding',
    },
    {
      id: 3,
      title: 'Safe Space',
      description: 'Visualize calm place',
      icon: 'home',
      color: '#FF9800',
      action: 'safe_space',
    },
    {
      id: 4,
      title: 'Progressive Relaxation',
      description: 'Muscle tension release',
      icon: 'self-improvement',
      color: '#9C27B0',
      action: 'relaxation',
    },
  ];

  const safetyResources = [
    {
      id: 1,
      title: 'Safety Plan',
      description: 'Create your personal crisis plan',
      icon: 'security',
      action: 'safety_plan',
    },
    {
      id: 2,
      title: 'Find Therapist',
      description: 'Connect with professionals',
      icon: 'psychology',
      action: 'therapists',
    },
    {
      id: 3,
      title: 'Support Groups',
      description: 'Join peer support communities',
      icon: 'groups',
      action: 'support_groups',
    },
  ];

  const handleCall = (contact) => {
    const phoneNumber = contact.number.replace(/[^0-9]/g, '');
    
    Alert.alert(
      'Call ' + contact.name,
      'Are you sure you want to call ' + contact.number + '?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${phoneNumber}`);
          },
        },
      ]
    );
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'breathing':
        navigation.navigate('BreathingExercise');
        break;
      case 'grounding':
        showGroundingTechnique();
        break;
      case 'safe_space':
        showSafeSpaceVisualization();
        break;
      case 'contacts':
        navigation.navigate('EmergencyContacts');
        break;
      default:
        toast.show({
          description: 'Feature coming soon!',
          duration: 2000,
        });
    }
  };

  const showGroundingTechnique = () => {
    Alert.alert(
      '5-4-3-2-1 Grounding Technique',
      'Take a deep breath and identify:\n\n' +
      '• 5 things you can SEE\n' +
      '• 4 things you can TOUCH\n' +
      '• 3 things you can HEAR\n' +
      '• 2 things you can SMELL\n' +
      '• 1 thing you can TASTE\n\n' +
      'This helps bring you back to the present moment.',
      [{ text: 'OK' }]
    );
  };

  const showSafeSpaceVisualization = () => {
    Alert.alert(
      'Safe Space Visualization',
      'Close your eyes and imagine a place where you feel completely safe and calm.\n\n' +
      'This could be:\n' +
      '• A childhood bedroom\n' +
      '• A peaceful beach\n' +
      '• A cozy cabin\n' +
      '• Anywhere you feel secure\n\n' +
      'Focus on the details: colors, sounds, smells, and feelings of safety.',
      [{ text: 'Start Visualization' }]
    );
  };

  const notifyWithToast = (description) => {
    toast.show({
      description: description,
      duration: 2000,
    });
  };

  const EmergencyContactCard = ({ contact }) => (
    <TouchableOpacity
      style={[
        styles.contactCard,
        contact.type === 'emergency' && styles.emergencyCard
      ]}
      onPress={() => handleCall(contact)}
    >
      <View style={styles.contactHeader}>
        <Icon
          name={contact.icon}
          type="material"
          color={contact.type === 'emergency' ? '#F44336' : appColors.AppBlue}
          size={30}
        />
        <View style={styles.contactInfo}>
          <Text style={[
            styles.contactName,
            contact.type === 'emergency' && styles.emergencyText
          ]}>
            {contact.name}
          </Text>
          <Text style={styles.contactNumber}>{contact.number}</Text>
          <Text style={styles.contactDescription}>{contact.description}</Text>
        </View>
        <Icon
          name="phone"
          type="material"
          color={contact.type === 'emergency' ? '#F44336' : appColors.AppBlue}
          size={25}
        />
      </View>
    </TouchableOpacity>
  );

  const QuickActionCard = ({ action }) => (
    <TouchableOpacity
      style={styles.actionCard}
      onPress={() => handleQuickAction(action.action)}
    >
      <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
        <Icon
          name={action.icon}
          type="material"
          color={action.color}
          size={30}
        />
      </View>
      <Text style={styles.actionTitle}>{action.title}</Text>
      <Text style={styles.actionDescription}>{action.description}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#E91E63" barStyle="light-content" />
      
      {/* Emergency Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={24} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Crisis Support</Text>
            <Text style={styles.headerSubtitle}>You're not alone - help is available</Text>
          </View>
          <View style={styles.emergencyIndicator}>
            <Icon name="emergency" type="material" color={appColors.CardBackground} size={28} />
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Immediate Crisis Alert */}
        <View style={styles.crisisSection}>
          <View style={styles.crisisAlert}>
            <Icon name="warning" type="material" color="#F44336" size={32} />
            <View style={styles.crisisContent}>
              <Text style={styles.crisisTitle}>In Immediate Danger?</Text>
              <Text style={styles.crisisText}>
                If you're having thoughts of self-harm or are in immediate danger, please reach out now.
              </Text>
            </View>
          </View>

          {/* Urgent Contacts */}
          <View style={styles.urgentContacts}>
            {emergencyContacts.filter(contact => contact.urgent).map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={[styles.urgentContactCard, { borderLeftColor: contact.color }]}
                onPress={() => handleCall(contact)}
              >
                <View style={[styles.urgentIconContainer, { backgroundColor: contact.color + '15' }]}>
                  <Icon name={contact.icon} type="material" color={contact.color} size={24} />
                </View>
                <View style={styles.urgentContactInfo}>
                  <Text style={styles.urgentContactName}>{contact.name}</Text>
                  <Text style={styles.urgentContactNumber}>{contact.number}</Text>
                </View>
                <View style={[styles.callButton, { backgroundColor: contact.color }]}>
                  <Icon name="phone" type="material" color={appColors.CardBackground} size={20} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Immediate Coping Tools */}
        <View style={styles.copingSection}>
          <Text style={styles.sectionTitle}>Immediate Coping Tools</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.copingScrollContainer}
          >
            {copingTools.map((tool) => (
              <TouchableOpacity
                key={tool.id}
                style={styles.copingCard}
                onPress={() => handleQuickAction(tool.action)}
              >
                <View style={[styles.copingIconContainer, { backgroundColor: tool.color + '15' }]}>
                  <Icon name={tool.icon} type="material" color={tool.color} size={28} />
                </View>
                <Text style={styles.copingTitle}>{tool.title}</Text>
                <Text style={styles.copingDescription}>{tool.description}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Additional Support Contacts */}
        {/* <View style={styles.supportSection}>
          <Text style={styles.sectionTitle}>Additional Support</Text>
          
          <View style={styles.supportContainer}>
            {emergencyContacts.filter(contact => !contact.urgent).map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={styles.supportContactCard}
                onPress={() => handleCall(contact)}
              >
                <View style={[styles.supportIconContainer, { backgroundColor: contact.color + '15' }]}>
                  <Icon name={contact.icon} type="material" color={contact.color} size={22} />
                </View>
                <View style={styles.supportContactInfo}>
                  <Text style={styles.supportContactName}>{contact.name}</Text>
                  <Text style={styles.supportContactDescription}>{contact.description}</Text>
                  <Text style={styles.supportContactNumber}>{contact.number}</Text>
                </View>
                <Icon name="phone" type="material" color={appColors.grey3} size={20} />
              </TouchableOpacity>
            ))}
          </View>
        </View> */}

        {/* Safety & Resources */}
        <View style={styles.resourcesSection}>
          <Text style={styles.sectionTitle}>Safety & Resources</Text>
          
          {safetyResources.map((resource) => (
            <TouchableOpacity
              key={resource.id}
              style={styles.resourceCard}
              onPress={() => {
                if (resource.action === 'therapists') {
                  navigation.navigate('TherapistsScreen');
                } else {
                  notifyWithToast(`${resource.title} feature coming soon!`);
                }
              }}
            >
              <View style={styles.resourceIconContainer}>
                <Icon name={resource.icon} type="material" color={appColors.AppBlue} size={24} />
              </View>
              <View style={styles.resourceContent}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <Text style={styles.resourceDescription}>{resource.description}</Text>
              </View>
              <Icon name="chevron-right" type="material" color={appColors.grey3} size={20} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Encouraging Message */}
        <View style={styles.encouragementSection}>
          <View style={styles.encouragementCard}>
            <Icon name="favorite" type="material" color="#E91E63" size={32} />
            <Text style={styles.encouragementTitle}>You Matter</Text>
            <Text style={styles.encouragementText}>
              Your life has value and meaning. Crisis situations are temporary, but recovery and hope are possible. 
              You deserve support and care.
            </Text>
          </View>
        </View>

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
    backgroundColor: '#E91E63',
    paddingTop: parameters.headerHeightS,
    paddingBottom: 25,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.appTextBold,
    marginBottom: 3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: appColors.CardBackground,
    opacity: 0.9,
    fontFamily: appFonts.appTextRegular,
    textAlign: 'center',
  },
  emergencyIndicator: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  crisisSection: {
    backgroundColor: appColors.CardBackground,
    margin: 20,
    borderRadius: 20,
    padding: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  crisisAlert: {
    flexDirection: 'row',
    backgroundColor: '#FFEBEE',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#F44336',
  },
  crisisContent: {
    marginLeft: 15,
    flex: 1,
  },
  crisisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 5,
    fontFamily: appFonts.appTextBold,
  },
  crisisText: {
    fontSize: 14,
    color: '#D32F2F',
    lineHeight: 20,
    fontFamily: appFonts.appTextRegular,
  },
  urgentContacts: {
    gap: 12,
  },
  urgentContactCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  urgentIconContainer: {
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  urgentContactInfo: {
    flex: 1,
  },
  urgentContactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.appTextBold,
    marginBottom: 3,
  },
  urgentContactNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E91E63',
    fontFamily: appFonts.appTextBold,
  },
  callButton: {
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  copingSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: 15,
    marginHorizontal: 20,
    fontFamily: appFonts.appTextBold,
  },
  copingScrollContainer: {
    paddingHorizontal: 20,
  },
  copingCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: 160,
    marginRight: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  copingIconContainer: {
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  copingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.appTextBold,
    textAlign: 'center',
    marginBottom: 5,
  },
  copingDescription: {
    fontSize: 12,
    color: appColors.grey2,
    fontFamily: appFonts.appTextRegular,
    textAlign: 'center',
    lineHeight: 16,
  },
  supportSection: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  supportContainer: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  supportContactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: appColors.grey4,
  },
  supportIconContainer: {
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  supportContactInfo: {
    flex: 1,
  },
  supportContactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.appTextBold,
    marginBottom: 2,
  },
  supportContactDescription: {
    fontSize: 13,
    color: appColors.grey2,
    fontFamily: appFonts.appTextRegular,
    marginBottom: 3,
  },
  supportContactNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.AppBlue,
    fontFamily: appFonts.appTextMedium,
  },
  resourcesSection: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  resourceCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  resourceIconContainer: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: 25,
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.appTextBold,
    marginBottom: 3,
  },
  resourceDescription: {
    fontSize: 13,
    color: appColors.grey2,
    fontFamily: appFonts.appTextRegular,
    lineHeight: 18,
  },
  encouragementSection: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  encouragementCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E91E63',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  encouragementTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E91E63',
    fontFamily: appFonts.appTextBold,
    marginTop: 15,
    marginBottom: 15,
  },
  encouragementText: {
    fontSize: 15,
    color: appColors.grey1,
    fontFamily: appFonts.appTextRegular,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomSpacing: {
    height: 30,
  },
});

export default EmergencyScreen;
