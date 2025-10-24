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
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../global/Styles';
import { useToast } from 'native-base';
import LHGenericHeader from '../components/LHGenericHeader';
import ISStatusBar from '../components/ISStatusBar';

const SCREEN_WIDTH = Dimensions.get('window').width;

const EmergencyScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const emergencyContacts = [
    {
      id: 1,
      name: 'Crisis Lifeline',
      number: '988',
      description: '24/7 suicide & crisis support',
      icon: 'phone',
      color: '#E91E63',
    },
    {
      id: 2,
      name: 'Emergency Services',
      number: '911',
      description: 'Immediate medical emergency',
      icon: 'local-hospital',
      color: '#F44336',
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
    setActiveModal(action);
  };

  const getModalContent = () => {
    switch (activeModal) {
      case 'breathing':
        return {
          title: 'Deep Breathing Exercise',
          icon: 'air',
          color: '#4CAF50',
          content: (
            <View>
              <Text style={styles.modalText}>Follow the 4-7-8 breathing technique:</Text>
              <View style={styles.modalSteps}>
                <Text style={styles.modalStep}>1. Breathe in through your nose for 4 seconds</Text>
                <Text style={styles.modalStep}>2. Hold your breath for 7 seconds</Text>
                <Text style={styles.modalStep}>3. Exhale slowly through your mouth for 8 seconds</Text>
                <Text style={styles.modalStep}>4. Repeat 3-4 times</Text>
              </View>
              <Text style={styles.modalFooter}>This helps calm your nervous system and reduce anxiety.</Text>
            </View>
          ),
        };
      case 'grounding':
        return {
          title: '5-4-3-2-1 Grounding',
          icon: 'psychology',
          color: '#2196F3',
          content: (
            <View>
              <Text style={styles.modalText}>Take a deep breath and identify:</Text>
              <View style={styles.modalSteps}>
                <Text style={styles.modalStep}>• 5 things you can SEE</Text>
                <Text style={styles.modalStep}>• 4 things you can TOUCH</Text>
                <Text style={styles.modalStep}>• 3 things you can HEAR</Text>
                <Text style={styles.modalStep}>• 2 things you can SMELL</Text>
                <Text style={styles.modalStep}>• 1 thing you can TASTE</Text>
              </View>
              <Text style={styles.modalFooter}>This helps bring you back to the present moment.</Text>
            </View>
          ),
        };
      case 'safe_space':
        return {
          title: 'Safe Space Visualization',
          icon: 'home',
          color: '#FF9800',
          content: (
            <View>
              <Text style={styles.modalText}>Close your eyes and imagine a place where you feel completely safe and calm.</Text>
              <View style={styles.modalSteps}>
                <Text style={styles.modalStep}>This could be:</Text>
                <Text style={styles.modalStep}>• A childhood bedroom</Text>
                <Text style={styles.modalStep}>• A peaceful beach</Text>
                <Text style={styles.modalStep}>• A cozy cabin</Text>
                <Text style={styles.modalStep}>• Anywhere you feel secure</Text>
              </View>
              <Text style={styles.modalFooter}>Focus on the details: colors, sounds, smells, and feelings of safety.</Text>
            </View>
          ),
        };
      case 'relaxation':
        return {
          title: 'Progressive Relaxation',
          icon: 'self-improvement',
          color: '#9C27B0',
          content: (
            <View>
              <Text style={styles.modalText}>Tense and relax each muscle group:</Text>
              <View style={styles.modalSteps}>
                <Text style={styles.modalStep}>1. Start with your toes - tense for 5 seconds, then release</Text>
                <Text style={styles.modalStep}>2. Move to your calves, then thighs</Text>
                <Text style={styles.modalStep}>3. Continue up through your body</Text>
                <Text style={styles.modalStep}>4. End with your face and head</Text>
              </View>
              <Text style={styles.modalFooter}>This releases physical tension and promotes relaxation.</Text>
            </View>
          ),
        };
      default:
        return null;
    }
  };

  const modalContent = getModalContent();

  const notifyWithToast = (description) => {
    toast.show({
      description: description,
      duration: 2000,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar backgroundColor="#E91E63" barStyle="light-content" /> */}
      <ISStatusBar backgroundColor='#E91E63' />
      
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
            <Icon name="warning" type="material" color="#F44336" size={24} />
            <Text style={styles.crisisText}>
              If you're in immediate danger or having thoughts of self-harm, please reach out now.
            </Text>
          </View>

          {/* Urgent Contacts */}
          <View style={styles.urgentContacts}>
            {emergencyContacts.map((contact) => (
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

      {/* Coping Tool Modal */}
      <Modal
        visible={activeModal !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {modalContent && (
              <>
                <View style={[styles.modalHeader, { backgroundColor: modalContent.color + '15' }]}>
                  <Icon name={modalContent.icon} type="material" color={modalContent.color} size={32} />
                  <Text style={styles.modalTitle}>{modalContent.title}</Text>
                </View>
                <View style={styles.modalBody}>
                  {modalContent.content}
                </View>
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: modalContent.color }]}
                    onPress={() => setActiveModal(null)}
                  >
                    <Text style={styles.modalButtonText}>Got It</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    fontFamily: appFonts.headerTextBold,
    marginBottom: 3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: appColors.CardBackground,
    opacity: 0.9,
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'center',
  },
  emergencyIndicator: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  crisisSection: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  crisisAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  crisisText: {
    fontSize: 14,
    color: '#D32F2F',
    lineHeight: 20,
    fontFamily: appFonts.bodyTextRegular,
    marginLeft: 12,
    flex: 1,
  },
  urgentContacts: {
    gap: 12,
  },
  urgentContactCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    fontFamily: appFonts.headerTextBold,
    marginBottom: 3,
  },
  urgentContactNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E91E63',
    fontFamily: appFonts.headerTextBold,
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
    marginTop: 25,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: 15,
    marginHorizontal: 20,
    fontFamily: appFonts.headerTextBold,
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
    fontFamily: appFonts.headerTextBold,
    textAlign: 'center',
    marginBottom: 5,
  },
  copingDescription: {
    fontSize: 12,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'center',
    lineHeight: 16,
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
    fontFamily: appFonts.headerTextBold,
    marginTop: 15,
    marginBottom: 15,
  },
  encouragementText: {
    fontSize: 15,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomSpacing: {
    height: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    flex: 1,
  },
  modalBody: {
    padding: 20,
  },
  modalText: {
    fontSize: 15,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: 15,
    lineHeight: 22,
  },
  modalSteps: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  modalStep: {
    fontSize: 14,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: 8,
    lineHeight: 20,
  },
  modalFooter: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  modalActions: {
    padding: 20,
    paddingTop: 0,
  },
  modalButton: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
});

export default EmergencyScreen;
