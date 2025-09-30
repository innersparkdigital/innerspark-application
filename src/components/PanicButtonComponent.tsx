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

const PanicButtonComponent: React.FC<PanicButtonComponentProps> = ({
  position = 'bottom-right',
  size = 'medium',
  showLabel = false,
  quickAction = 'screen',
}) => {
  const navigation = useNavigation();
  const toast = useToast();
  const [isPressed, setIsPressed] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

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
    
    switch (quickAction) {
      case 'screen':
        navigation.navigate('PanicButtonScreen' as never);
        break;
      case 'modal':
        showQuickActionModal();
        break;
      case 'call':
        handleDirectCall();
        break;
      default:
        navigation.navigate('EmergencyLandingScreen' as never);
    }
    
    setTimeout(() => setIsPressed(false), 200);
  };

  const showQuickActionModal = () => {
    Alert.alert(
      'Emergency Help',
      'Choose your emergency response:',
      [
        {
          text: 'Call Counselor',
          onPress: () => handleCall('+256-700-123-456', 'Counselor'),
          style: 'destructive',
        },
        {
          text: 'Crisis Line',
          onPress: () => handleCall('+256-800-567-890', 'Crisis Line'),
          style: 'destructive',
        },
        {
          text: 'Emergency Screen',
          onPress: () => navigation.navigate('EmergencyLandingScreen' as never),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

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
});

export default PanicButtonComponent;
