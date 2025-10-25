/**
 * EmptySessionsCard - Shows when user has no upcoming therapy sessions
 * Provides clear CTA to book a session
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/base';
import { appColors, appFonts } from '../global/Styles';

interface EmptySessionsCardProps {
  onBookSession: () => void;
}

const EmptySessionsCard: React.FC<EmptySessionsCardProps> = ({ onBookSession }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon 
          name="event-available" 
          type="material" 
          color={appColors.AppBlue} 
          size={56} 
        />
      </View>
      
      <Text style={styles.title}>No Upcoming Sessions</Text>
      <Text style={styles.subtitle}>
        Book a session with a therapist to start your wellness journey
      </Text>
      
      <TouchableOpacity 
        style={styles.bookButton}
        onPress={onBookSession}
        activeOpacity={0.8}
      >
        <Icon 
          name="add-circle-outline" 
          type="material" 
          color={appColors.CardBackground} 
          size={20} 
        />
        <Text style={styles.bookButtonText}>Book a Session</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: appColors.AppBlue + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  bookButton: {
    flexDirection: 'row',
    backgroundColor: appColors.AppBlue,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: appColors.AppBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextSemiBold,
    marginLeft: 8,
  },
});

export default EmptySessionsCard;
