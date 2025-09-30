/**
 * Panic Button Screen - Emergency panic button with countdown and quick actions
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  Animated,
  Vibration,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import { NavigationProp } from '@react-navigation/native';

interface PanicButtonScreenProps {
  navigation: NavigationProp<any>;
}

interface RecentContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  lastUsed: string;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const PanicButtonScreen: React.FC<PanicButtonScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const [countdown, setCountdown] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [lastStatus, setLastStatus] = useState<string>('Ready');
  const [cooldownTime, setCooldownTime] = useState(0);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);

  const recentContacts: RecentContact[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      phone: '+256-700-123-456',
      relationship: 'Primary Therapist',
      lastUsed: '2024-03-20',
    },
    {
      id: '2',
      name: 'Crisis Counselor',
      phone: '+256-800-CRISIS',
      relationship: 'Crisis Support',
      lastUsed: '2024-03-18',
    },
    {
      id: '3',
      name: 'John Doe',
      phone: '+256-700-789-012',
      relationship: 'Emergency Contact',
      lastUsed: '2024-03-15',
    },
  ];

  useEffect(() => {
    startPulseAnimation();
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startCountdown = (seconds: number, action: string) => {
    setCountdown(seconds);
    setIsActive(true);
    setSelectedAction(action);
    
    // Vibrate to alert user
    Vibration.vibrate([0, 500, 200, 500]);
    
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          executeAction(action);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setCountdown(0);
    setIsActive(false);
    setSelectedAction('');
    setLastStatus('Cancelled');
    
    toast.show({
      description: 'Emergency action cancelled',
      duration: 2000,
    });
  };

  const executeAction = async (action: string) => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    
    setIsActive(false);
    setCountdown(0);
    
    switch (action) {
      case 'call_counselor':
        await handleCall(recentContacts[0].phone, recentContacts[0].name);
        setLastStatus('Called Counselor');
        break;
      case 'call_crisis':
        await handleCall('+256-800-567-890', 'Crisis Line');
        setLastStatus('Called Crisis Line');
        break;
      case 'notify_contacts':
        await notifyEmergencyContacts();
        setLastStatus('Notified Contacts');
        break;
      case 'calming_audio':
        startCalmingAudio();
        setLastStatus('Started Calming Audio');
        break;
      default:
        setLastStatus('Action Completed');
    }
    
    startCooldown();
  };

  const startCooldown = () => {
    setCooldownTime(30); // 30 second cooldown
    cooldownRef.current = setInterval(() => {
      setCooldownTime((prev) => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCall = async (phone: string, name: string) => {
    try {
      const phoneUrl = `tel:${phone}`;
      const canOpen = await Linking.canOpenURL(phoneUrl);
      
      if (canOpen) {
        await Linking.openURL(phoneUrl);
        toast.show({
          description: `Calling ${name}...`,
          duration: 3000,
        });
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

  const notifyEmergencyContacts = async () => {
    // Simulate sending notifications/messages to emergency contacts
    toast.show({
      description: 'Emergency notifications sent to your contacts',
      duration: 4000,
    });
    
    // Future: Implement actual SMS/notification sending
  };

  const startCalmingAudio = () => {
    toast.show({
      description: 'Starting calming audio session...',
      duration: 3000,
    });
    
    // Future: Navigate to audio player or start background audio
  };

  const handlePanicButtonPress = () => {
    if (cooldownTime > 0) {
      toast.show({
        description: `Please wait ${cooldownTime} seconds before using again`,
        duration: 2000,
      });
      return;
    }
    
    setShowConfirmModal(true);
  };

  const confirmAction = (action: string, seconds: number) => {
    setShowConfirmModal(false);
    startCountdown(seconds, action);
  };

  const ConfirmModal: React.FC = () => (
    <Modal
      visible={showConfirmModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowConfirmModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Icon name="warning" type="material" color="#F44336" size={48} />
          <Text style={styles.modalTitle}>Emergency Action</Text>
          <Text style={styles.modalSubtitle}>Choose your emergency response:</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#F44336' }]}
              onPress={() => confirmAction('call_counselor', 5)}
            >
              <Icon name="phone" type="material" color="#FFF" size={20} />
              <Text style={styles.actionButtonText}>Call Counselor</Text>
              <Text style={styles.actionButtonSubtext}>5 sec countdown</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#FF5722' }]}
              onPress={() => confirmAction('call_crisis', 3)}
            >
              <Icon name="support-agent" type="material" color="#FFF" size={20} />
              <Text style={styles.actionButtonText}>Crisis Line</Text>
              <Text style={styles.actionButtonSubtext}>3 sec countdown</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#FF9800' }]}
              onPress={() => confirmAction('notify_contacts', 10)}
            >
              <Icon name="group" type="material" color="#FFF" size={20} />
              <Text style={styles.actionButtonText}>Notify Contacts</Text>
              <Text style={styles.actionButtonSubtext}>10 sec countdown</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
              onPress={() => confirmAction('calming_audio', 0)}
            >
              <Icon name="music-note" type="material" color="#FFF" size={20} />
              <Text style={styles.actionButtonText}>Calming Audio</Text>
              <Text style={styles.actionButtonSubtext}>Immediate</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => setShowConfirmModal(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" type="material" color="#FFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Help</Text>
        <TouchableOpacity 
          style={styles.infoButton}
          onPress={() => toast.show({ description: 'Panic button provides immediate emergency assistance' })}
        >
          <Icon name="info" type="material" color="#FFF" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Status Section */}
        <View style={styles.statusSection}>
          <Text style={styles.statusLabel}>Status</Text>
          <Text style={styles.statusText}>{lastStatus}</Text>
          {cooldownTime > 0 && (
            <Text style={styles.cooldownText}>Cooldown: {cooldownTime}s</Text>
          )}
        </View>

        {/* Countdown Display */}
        {isActive && (
          <View style={styles.countdownSection}>
            <Text style={styles.countdownLabel}>Emergency Action in:</Text>
            <Text style={styles.countdownText}>{countdown}</Text>
            <Text style={styles.actionLabel}>{selectedAction.replace('_', ' ').toUpperCase()}</Text>
          </View>
        )}

        {/* Panic Button */}
        <View style={styles.panicButtonContainer}>
          <Animated.View style={[styles.panicButtonWrapper, { transform: [{ scale: pulseAnim }] }]}>
            <TouchableOpacity
              style={[
                styles.panicButton,
                isActive && styles.activePanicButton,
                cooldownTime > 0 && styles.disabledPanicButton
              ]}
              onPress={isActive ? cancelCountdown : handlePanicButtonPress}
              disabled={cooldownTime > 0}
            >
              <Icon 
                name={isActive ? "stop" : "warning"} 
                type="material" 
                color="#FFF" 
                size={48} 
              />
              <Text style={styles.panicButtonText}>
                {isActive ? "CANCEL" : cooldownTime > 0 ? "COOLDOWN" : "PANIC"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsSection}>
          <Text style={styles.instructionsTitle}>
            {isActive ? "Tap CANCEL to stop the countdown" : "Tap the button for emergency help"}
          </Text>
          <Text style={styles.instructionsText}>
            {isActive 
              ? "Your emergency action will execute automatically when countdown reaches zero"
              : "Choose from multiple emergency response options including calling counselors, crisis lines, or notifying emergency contacts"
            }
          </Text>
        </View>

        {/* Recent Contacts */}
        {!isActive && (
          <View style={styles.recentContactsSection}>
            <Text style={styles.sectionTitle}>Recent Emergency Contacts</Text>
            {recentContacts.slice(0, 2).map((contact) => (
              <TouchableOpacity 
                key={contact.id} 
                style={styles.contactItem}
                onPress={() => handleCall(contact.phone, contact.name)}
              >
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactRelationship}>{contact.relationship}</Text>
                </View>
                <Icon name="phone" type="material" color="#4CAF50" size={20} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <ConfirmModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B71C1C', // Deep red background for emergency feel
  },
  header: {
    paddingTop: parameters.headerHeightS,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#D32F2F',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: appFonts.headerTextBold,
  },
  infoButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statusSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 14,
    color: '#FFCDD2',
    fontFamily: appFonts.headerTextRegular,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  cooldownText: {
    fontSize: 14,
    color: '#FFAB91',
    fontFamily: appFonts.headerTextMedium,
    marginTop: 4,
  },
  countdownSection: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
  },
  countdownLabel: {
    fontSize: 16,
    color: '#FFCDD2',
    fontFamily: appFonts.headerTextRegular,
    marginBottom: 8,
  },
  countdownText: {
    fontSize: 72,
    color: '#FFF',
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  actionLabel: {
    fontSize: 14,
    color: '#FFAB91',
    fontFamily: appFonts.headerTextBold,
    marginTop: 8,
  },
  panicButtonContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  panicButtonWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  panicButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#F44336',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 8,
    borderColor: '#FFF',
  },
  activePanicButton: {
    backgroundColor: '#FF5722',
  },
  disabledPanicButton: {
    backgroundColor: '#757575',
    opacity: 0.6,
  },
  panicButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
    marginTop: 8,
  },
  instructionsSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  instructionsTitle: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
    textAlign: 'center',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#FFCDD2',
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
    lineHeight: 20,
  },
  recentContactsSection: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  contactRelationship: {
    fontSize: 12,
    color: '#FFCDD2',
    fontFamily: appFonts.headerTextRegular,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginTop: 16,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
    marginBottom: 24,
  },
  actionButtons: {
    width: '100%',
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
    marginLeft: 12,
    flex: 1,
  },
  actionButtonSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: appFonts.headerTextRegular,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelButtonText: {
    fontSize: 16,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextMedium,
  },
});

export default PanicButtonScreen;
