/**
 * Panic Button Component - Always-visible emergency help button
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  Linking,
  Vibration,
  Modal,
  Dimensions,
} from 'react-native';
import { Icon } from '@rneui/base';
import { appColors, appFonts } from '../global/Styles';
import { useToast } from 'native-base';
import { useNavigation } from '@react-navigation/native';

interface PanicButtonComponentProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  quickAction?: 'modal' | 'screen' | 'call';
}

const { width, height } = Dimensions.get('window');

const PanicButtonComponent: React.FC<PanicButtonComponentProps> = ({
  position = 'bottom-right',
  size = 'medium',
  showLabel = false,
  quickAction = 'modal',
}) => {
  const navigation = useNavigation();
  const toast = useToast();
  const [isPressed, setIsPressed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const modalScale = useRef(new Animated.Value(0)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startPulseAnimation();
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handlePress = () => {
    // Haptic feedback
    Vibration.vibrate(100);
    
    // Scale animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setIsPressed(true);
    setModalVisible(true);
    showModalAnimation();
    
    setTimeout(() => setIsPressed(false), 200);
  };

  const showModalAnimation = () => {
    Animated.parallel([
      Animated.spring(modalScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideModalAnimation = () => {
    Animated.parallel([
      Animated.timing(modalScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      modalScale.setValue(0);
      modalOpacity.setValue(0);
    });
  };

  const handleCloseModal = () => {
    Vibration.vibrate(50);
    hideModalAnimation();
  };

  const emergencyActions = [
    {
      id: 1,
      icon: 'phone',
      label: 'Call\nCounselor',
      color: '#2196F3',
      action: () => {
        hideModalAnimation();
        setTimeout(() => handleCall('+256-700-123-456', 'Counselor'), 300);
      },
    },
    {
      id: 2,
      icon: 'local-hospital',
      label: 'Crisis\nLine',
      color: '#FF5722',
      action: () => {
        hideModalAnimation();
        setTimeout(() => handleCall('+256-800-567-890', 'Crisis Line'), 300);
      },
    },
    {
      id: 3,
      icon: 'support-agent',
      label: 'Crisis\nSupport',
      color: '#9C27B0',
      action: () => {
        hideModalAnimation();
        setTimeout(() => navigation.navigate('EmergencyScreen' as never), 300);
      },
    },
    {
      id: 4,
      icon: 'contacts',
      label: 'Notify\nContacts',
      color: '#4CAF50',
      action: () => {
        hideModalAnimation();
        setTimeout(() => {
          toast.show({
            description: 'Notifying emergency contacts...',
            duration: 2000,
          });
        }, 300);
      },
    },
  ];

  const handleDirectCall = () => {
    Alert.alert(
      'Emergency Call',
      'Call your primary crisis support contact?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Call Now',
          onPress: () => handleCall('+256-700-123-456', 'Primary Counselor'),
          style: 'destructive',
        },
      ]
    );
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

  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return { width: 50, height: 50, borderRadius: 25 };
      case 'large':
        return { width: 70, height: 70, borderRadius: 35 };
      default:
        return { width: 60, height: 60, borderRadius: 30 };
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 20;
      case 'large':
        return 32;
      default:
        return 24;
    }
  };

  const getPositionStyle = () => {
    const baseStyle = { position: 'absolute' as const, zIndex: 1000 };
    const offset = 20;
    
    switch (position) {
      case 'bottom-left':
        return { ...baseStyle, bottom: offset, left: offset };
      case 'top-right':
        return { ...baseStyle, top: offset + 50, right: offset };
      case 'top-left':
        return { ...baseStyle, top: offset + 50, left: offset };
      default:
        return { ...baseStyle, bottom: offset + 80, right: offset };
    }
  };

  const buttonSize = getButtonSize();
  const iconSize = getIconSize();
  const positionStyle = getPositionStyle();

  return (
    <>
      {/* Panic Button */}
      <View style={[styles.container, positionStyle]}>
        {showLabel && (
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Emergency Help</Text>
          </View>
        )}
        
        <Animated.View
          style={[
            styles.pulseContainer,
            buttonSize,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <Animated.View
            style={[
              styles.button,
              buttonSize,
              isPressed && styles.buttonPressed,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <TouchableOpacity
              style={[styles.touchable, buttonSize]}
              onPress={handlePress}
              activeOpacity={0.8}
            >
              <Icon
                name="warning"
                type="material"
                color="#FFF"
                size={iconSize}
              />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>

      {/* Circular Overlay Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={handleCloseModal}
      >
        <Animated.View
          style={[
            styles.modalOverlay,
            { opacity: modalOpacity },
          ]}
        >
          <TouchableOpacity
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={handleCloseModal}
          />
          
          {/* Title on Overlay (Above Circle) */}
          <View style={styles.modalHeaderOverlay}>
            <Icon name="warning" type="material" color="#F44336" size={36} />
            <Text style={styles.modalTitleOverlay}>Emergency Help</Text>
            <Text style={styles.modalSubtitleOverlay}>Choose your emergency response</Text>
          </View>

          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ scale: modalScale }],
                opacity: modalOpacity,
              },
            ]}
          >
            {/* Circular Action Buttons */}
            <View style={styles.actionsCircle}>
              {emergencyActions.map((action, index) => {
                const angle = (index * 90 - 45) * (Math.PI / 180);
                const radius = 110;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <TouchableOpacity
                    key={action.id}
                    style={[
                      styles.actionButton,
                      {
                        backgroundColor: action.color,
                        transform: [{ translateX: x }, { translateY: y }],
                      },
                    ]}
                    onPress={action.action}
                    activeOpacity={0.8}
                  >
                    <Icon
                      name={action.icon}
                      type="material"
                      color="#FFF"
                      size={24}
                    />
                    <Text style={styles.actionLabel}>{action.label}</Text>
                  </TouchableOpacity>
                );
              })}

              {/* Close Button - Absolutely Centered in Circle */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseModal}
                activeOpacity={0.8}
              >
                <Icon name="close" type="material" color="#666" size={32} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  labelContainer: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  labelText: {
    fontSize: 10,
    color: '#FFF',
    fontFamily: appFonts.headerTextBold,
    textAlign: 'center',
  },
  pulseContainer: {
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#F44336',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonPressed: {
    backgroundColor: '#D32F2F',
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  modalContent: {
    width: Math.min(width * 0.85, 380), // Max 380px for large screens
    aspectRatio: 1,
    backgroundColor: '#FFF',
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  modalHeaderOverlay: {
    position: 'absolute',
    top: '10%',
    alignItems: 'center',
    zIndex: 10,
  },
  modalTitleOverlay: {
    fontSize: 28,
    fontFamily: appFonts.headerTextBold,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
  },
  modalSubtitleOverlay: {
    fontSize: 15,
    fontFamily: appFonts.headerTextRegular,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 6,
  },
  actionsCircle: {
    width: '80%',
    aspectRatio: 1,
    maxWidth: 300,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  actionButton: {
    position: 'absolute',
    width: width * 0.22, // 22% of screen width
    height: width * 0.22,
    maxWidth: 90,
    maxHeight: 90,
    borderRadius: width * 0.11, // Half of width for perfect circle
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  actionLabel: {
    fontSize: 11,
    fontFamily: appFonts.headerTextBold,
    color: '#FFF',
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 13,
  },
  closeButton: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    top: '50%',
    left: '50%',
    marginTop: -32,
    marginLeft: -32,
  },
});

export default PanicButtonComponent;
