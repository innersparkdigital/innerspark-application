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
      name: 'National Suicide Prevention Lifeline',
      number: '988',
      description: '24/7 free and confidential support',
      type: 'crisis',
      icon: 'phone',
    },
    {
      id: 2,
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      description: 'Free 24/7 support via text',
      type: 'text',
      icon: 'message',
    },
    {
      id: 3,
      name: 'Emergency Services',
      number: '911',
      description: 'For immediate medical emergencies',
      type: 'emergency',
      icon: 'local-hospital',
    },
    {
      id: 4,
      name: 'SAMHSA National Helpline',
      number: '1-800-662-4357',
      description: 'Treatment referral and information service',
      type: 'support',
      icon: 'support-agent',
    },
  ];

  const quickActions = [
    {
      id: 1,
      title: 'Breathing Exercise',
      description: 'Guided breathing to help calm anxiety',
      icon: 'air',
      color: '#4CAF50',
      action: 'breathing',
    },
    {
      id: 2,
      title: 'Grounding Technique',
      description: '5-4-3-2-1 sensory grounding method',
      icon: 'psychology',
      color: '#2196F3',
      action: 'grounding',
    },
    {
      id: 3,
      title: 'Safe Space',
      description: 'Visualize your calm, safe place',
      icon: 'home',
      color: '#FF9800',
      action: 'safe_space',
    },
    {
      id: 4,
      title: 'Emergency Contacts',
      description: 'Quick access to your personal contacts',
      icon: 'contacts',
      color: '#9C27B0',
      action: 'contacts',
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
      <StatusBar backgroundColor={appColors.StatusBarColor} barStyle="light-content" />
      
      <LHGenericHeader
        title="Emergency Support"
        subtitle="Immediate help and crisis resources"
        navigation={navigation}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          
          {/* Crisis Alert */}
          <View style={styles.crisisAlert}>
            <Icon
              name="warning"
              type="material"
              color="#F44336"
              size={30}
            />
            <View style={styles.crisisContent}>
              <Text style={styles.crisisTitle}>In Crisis?</Text>
              <Text style={styles.crisisText}>
                If you're having thoughts of self-harm or suicide, please reach out immediately.
              </Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Coping Tools</Text>
            <View style={styles.actionsGrid}>
              {quickActions.map((action) => (
                <QuickActionCard key={action.id} action={action} />
              ))}
            </View>
          </View>

          {/* Emergency Contacts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Emergency Contacts</Text>
            {emergencyContacts.map((contact) => (
              <EmergencyContactCard key={contact.id} contact={contact} />
            ))}
          </View>

          {/* Additional Resources */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Resources</Text>
            
            <TouchableOpacity
              style={styles.resourceCard}
              onPress={() => notifyWithToast('Opening mental health resources...')}
            >
              <Icon
                name="library-books"
                type="material"
                color={appColors.AppBlue}
                size={25}
              />
              <View style={styles.resourceContent}>
                <Text style={styles.resourceTitle}>Mental Health Resources</Text>
                <Text style={styles.resourceDescription}>
                  Articles, guides, and educational materials
                </Text>
              </View>
              <Icon
                name="chevron-right"
                type="material"
                color={appColors.AppGray}
                size={20}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resourceCard}
              onPress={() => navigation.navigate('TherapistsScreen')}
            >
              <Icon
                name="people"
                type="material"
                color={appColors.AppBlue}
                size={25}
              />
              <View style={styles.resourceContent}>
                <Text style={styles.resourceTitle}>Find a Therapist</Text>
                <Text style={styles.resourceDescription}>
                  Connect with mental health professionals
                </Text>
              </View>
              <Icon
                name="chevron-right"
                type="material"
                color={appColors.AppGray}
                size={20}
              />
            </TouchableOpacity>
          </View>

          {/* Safety Planning */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Safety Planning</Text>
            <TouchableOpacity
              style={styles.safetyCard}
              onPress={() => notifyWithToast('Safety plan feature coming soon!')}
            >
              <Icon
                name="security"
                type="material"
                color={appColors.AppBlue}
                size={30}
              />
              <View style={styles.safetyContent}>
                <Text style={styles.safetyTitle}>Create Safety Plan</Text>
                <Text style={styles.safetyDescription}>
                  Build a personalized plan for managing crisis situations
                </Text>
              </View>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.CardBackground,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  crisisAlert: {
    flexDirection: 'row',
    backgroundColor: '#FFEBEE',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    marginBottom: 15,
    fontFamily: appFonts.appTextBold,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (SCREEN_WIDTH - 55) / 2,
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    textAlign: 'center',
    marginBottom: 5,
    fontFamily: appFonts.appTextBold,
  },
  actionDescription: {
    fontSize: 12,
    color: appColors.AppGray,
    textAlign: 'center',
    lineHeight: 16,
    fontFamily: appFonts.appTextRegular,
  },
  contactCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  emergencyCard: {
    borderWidth: 2,
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 15,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    marginBottom: 5,
    fontFamily: appFonts.appTextBold,
  },
  emergencyText: {
    color: '#F44336',
  },
  contactNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.AppBlue,
    marginBottom: 3,
    fontFamily: appFonts.appTextMedium,
  },
  contactDescription: {
    fontSize: 12,
    color: appColors.AppGray,
    fontFamily: appFonts.appTextRegular,
  },
  resourceCard: {
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  resourceContent: {
    marginLeft: 15,
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    marginBottom: 5,
    fontFamily: appFonts.appTextBold,
  },
  resourceDescription: {
    fontSize: 14,
    color: appColors.AppGray,
    fontFamily: appFonts.appTextRegular,
  },
  safetyCard: {
    flexDirection: 'row',
    backgroundColor: appColors.AppLightBlue,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  safetyContent: {
    marginLeft: 15,
    flex: 1,
  },
  safetyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    marginBottom: 5,
    fontFamily: appFonts.appTextBold,
  },
  safetyDescription: {
    fontSize: 14,
    color: appColors.AppBlue,
    lineHeight: 20,
    fontFamily: appFonts.appTextRegular,
  },
});

export default EmergencyScreen;
