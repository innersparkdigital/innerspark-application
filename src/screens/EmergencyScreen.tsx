/**
 * Emergency Screen - Comprehensive crisis support and emergency hub
 */
import React, { useState, useEffect } from 'react';
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
import { useSelector } from 'react-redux';
import LHGenericHeader from '../components/LHGenericHeader';
import ISStatusBar from '../components/ISStatusBar';
import { appContents } from '../global/Data';

const SCREEN_WIDTH = Dimensions.get('window').width;

const EmergencyScreen = ({ navigation }) => {
  const toast = useToast();
  const crisisLines = useSelector((state: any) => state.emergency.crisisLines || []);

  // Quick Actions Data - Dynamic data from API and app config
  const quickActionsData = [
    // First two items: Crisis hotlines from API (EmergencyContactsScreen)
    ...(crisisLines.length >= 1 ? [{
      id: 'crisis_1',
      title: crisisLines[0].phone,
      subtitle: crisisLines[0].name,
      contact: crisisLines[0].phone,
      name: crisisLines[0].name,
      icon: crisisLines[0].icon || 'phone',
      color: crisisLines[0].color || '#E91E63',
      type: 'call',
    }] : []),
    ...(crisisLines.length >= 2 ? [{
      id: 'crisis_2',
      title: crisisLines[1].phone,
      subtitle: crisisLines[1].name,
      contact: crisisLines[1].phone,
      name: crisisLines[1].name,
      icon: crisisLines[1].icon || 'local-hospital',
      color: crisisLines[1].color || '#F44336',
      type: 'call',
    }] : []),
    // Third item: Support contact from app config
    {
      id: 'support',
      title: appContents.supportPhone,
      subtitle: 'Innerspark Support',
      contact: appContents.supportPhone,
      name: 'Innerspark Support',
      icon: 'psychology',
      color: '#2196F3',
      type: 'call',
    },
    // Fourth item: Safety Plan (navigation)
    {
      id: 'safety_plan',
      title: 'Safety Plan',
      subtitle: 'View your plan',
      icon: 'security',
      color: '#4CAF50',
      type: 'navigation',
      screen: 'SafetyPlanScreen',
    },
  ];

  // Quick emergency actions - using quickActionsData as source
  const quickActions = [
    {
      id: 1,
      title: quickActionsData[0]?.title || 'Call 988',
      subtitle: quickActionsData[0]?.subtitle || 'Crisis Lifeline',
      icon: quickActionsData[0]?.icon || 'phone',
      color: quickActionsData[0]?.color || '#E91E63',
      action: () => quickActionsData[0]?.type === 'call' 
        ? handleCall({ number: quickActionsData[0].contact, name: quickActionsData[0].name })
        : null,
    },
    {
      id: 2,
      title: quickActionsData[1]?.title || 'Call 911',
      subtitle: quickActionsData[1]?.subtitle || 'Emergency',
      icon: quickActionsData[1]?.icon || 'local-hospital',
      color: quickActionsData[1]?.color || '#F44336',
      action: () => quickActionsData[1]?.type === 'call'
        ? handleCall({ number: quickActionsData[1].contact, name: quickActionsData[1].name })
        : null,
    },
    {
      id: 3,
      title: quickActionsData[2]?.title || 'Call Counselor',
      subtitle: quickActionsData[2]?.subtitle || 'Talk to someone',
      icon: quickActionsData[2]?.icon || 'psychology',
      color: quickActionsData[2]?.color || '#2196F3',
      action: () => quickActionsData[2]?.type === 'call'
        ? handleCall({ number: quickActionsData[2].contact, name: quickActionsData[2].name })
        : Alert.alert(
            'Crisis Counselor',
            'Connect with a trained crisis counselor for immediate support.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Call Now', onPress: () => handleCall({ number: quickActionsData[2]?.contact, name: 'Crisis Counselor' }) },
            ]
          ),
    },
    {
      id: 4,
      title: quickActionsData[3]?.title || 'Safety Plan',
      subtitle: quickActionsData[3]?.subtitle || 'View your plan',
      icon: quickActionsData[3]?.icon || 'security',
      color: quickActionsData[3]?.color || '#4CAF50',
      action: () => quickActionsData[3]?.type === 'navigation'
        ? navigation.navigate(quickActionsData[3].screen)
        : navigation.navigate('SafetyPlanScreen'),
    },
  ];


  const handleCall = (contact) => {
    const phoneNumber = contact.phone || contact.number;
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    
    Alert.alert(
      'Call ' + contact.name,
      'Are you sure you want to call ' + phoneNumber + '?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${cleanNumber}`);
          },
        },
      ]
    );
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
        
        {/* Crisis Alert Banner */}
        <View style={styles.crisisAlert}>
          <Icon name="warning" type="material" color="#F44336" size={24} />
          <Text style={styles.crisisText}>
            If you're in immediate danger or having thoughts of self-harm, please reach out now.
          </Text>
        </View>

        {/* Quick Emergency Actions */}
        <View style={styles.quickActionsCard}>
          <Text style={styles.quickActionsTitle}>Quick Emergency Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionButton}
                onPress={action.action}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <Icon name={action.icon} type="material" color="#FFF" size={24} />
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
                <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
  crisisAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 15,
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
  quickActionsCard: {
    backgroundColor: appColors.CardBackground,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    textAlign: 'center',
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: 11,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'center',
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: 16,
    fontFamily: appFonts.headerTextBold,
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
