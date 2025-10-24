/**
 * Booking Checkout Screen - Checkout screen for session booking
 */
import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Avatar, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';

const BookingCheckoutScreen = ({ navigation, route }) => {
  const { 
    therapist, 
    selectedSlot,
    isExistingAppointment = false,
    appointmentId = null,
    sessionType = 'Individual Therapy',
    location = '2 Avenue Street, Nakawa - Kampala Uganda, 3 km',
  } = route.params;
  const toast = useToast();
  
  const [message, setMessage] = useState('');
  const [reason, setReason] = useState(isExistingAppointment ? 'Payment for scheduled appointment' : '');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('wellness_vault');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock appointment details
  const appointmentDetails = {
    date: selectedSlot?.date || 'Thu, 09 Apr',
    time: selectedSlot?.time || '08:00 AM',
    duration: '50 minutes',
    sessionType: sessionType,
    price: therapist.price?.replace?.('$', '') || therapist.price,
    currency: 'UGX',
    location: location,
  };

  const paymentMethods = [
    {
      id: 'wellness_vault',
      name: 'WellnessVault',
      balance: 'UGX 350,000',
      icon: 'account-balance-wallet',
      selected: true,
    },
  ];

  const handlePaymentMethodSelect = (methodId) => {
    setSelectedPaymentMethod(methodId);
  };

  const handlePayNow = async () => {
    if (!isExistingAppointment && !reason.trim()) {
      toast.show({
        description: 'Please provide a reason for the visit',
        duration: 2000,
      });
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      if (isExistingAppointment) {
        // Payment for existing appointment
        toast.show({
          description: 'Payment successful! Your appointment is now confirmed.',
          duration: 3000,
        });
        
        // Navigate back to appointments screen
        navigation.navigate('AppointmentsScreen');
      } else {
        // New booking flow
        navigation.navigate('BookingConfirmationScreen', {
          therapist,
          appointmentDetails: {
            ...appointmentDetails,
            message,
            reason,
            paymentMethod: paymentMethods.find(method => method.id === selectedPaymentMethod),
            bookingId: 'BK' + Date.now().toString().slice(-6),
          },
        });
      }
    }, 2000);
  };

  const formatPrice = (price) => {
    // Price is already in UGX format like "UGX 50,000"
    return price;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={appColors.AppBlue} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={24} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>
          {isExistingAppointment ? 'Complete Payment' : `${therapist.name} Confirmation`}
        </Text>
        </View>
        <Avatar
          source={therapist.image}
          size={40}
          rounded
        />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Appointment Details */}
        <View style={styles.appointmentCard}>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.appointmentDate}>{appointmentDetails.date}</Text>
            <Text style={styles.appointmentTime}>{appointmentDetails.time}</Text>
          </View>
          
          <View style={styles.locationContainer}>
            <Icon name="location-on" type="material" color={appColors.grey2} size={18} />
            <Text style={styles.locationText}>{appointmentDetails.location}</Text>
          </View>
          
          <View style={styles.sessionDetails}>
            <Text style={styles.sessionType}>{appointmentDetails.sessionType}</Text>
            <Text style={styles.sessionDuration}>{appointmentDetails.duration}</Text>
          </View>
        </View>

        {/* Message Input - Only show for new bookings */}
        {!isExistingAppointment && (
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Message (Optional)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Any specific concerns or topics you'd like to discuss..."
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={3}
              placeholderTextColor={appColors.grey3}
            />
          </View>
        )}

        {/* Reason Input - Only show for new bookings */}
        {!isExistingAppointment && (
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Reason for Visit *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Brief description of what you'd like help with..."
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={2}
              placeholderTextColor={appColors.grey3}
            />
          </View>
        )}

        {/* Payment Summary */}
        <View style={styles.paymentSummaryCard}>
          <Text style={styles.sectionTitle}>Session Payment Summary</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.priceAmount}>{formatPrice(appointmentDetails.price)}</Text>
            <Text style={styles.priceLabel}>Session Fee</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentMethodsCard}>
          <View style={styles.paymentHeader}>
            <Text style={styles.sectionTitle}>Pay via WellnessVault</Text>
            <TouchableOpacity style={styles.manageVaultButton}>
              <Text style={styles.manageVaultText}>Manage Vault</Text>
              <Icon name="chevron-right" type="material" color={appColors.AppBlue} size={20} />
            </TouchableOpacity>
          </View>

          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethodItem,
                selectedPaymentMethod === method.id && styles.selectedPaymentMethod
              ]}
              onPress={() => handlePaymentMethodSelect(method.id)}
            >
              <View style={styles.paymentMethodLeft}>
                <View style={[
                  styles.paymentMethodIcon,
                  method.id === 'wellness_vault' && styles.wellnessVaultIcon
                ]}>
                  <Icon 
                    name={method.icon} 
                    type="material" 
                    color={method.id === 'wellness_vault' ? '#FFF' : appColors.AppBlue} 
                    size={24} 
                  />
                </View>
                <View style={styles.paymentMethodInfo}>
                  <Text style={styles.paymentMethodName}>{method.name}</Text>
                  <Text style={styles.paymentMethodBalance}>{method.balance}</Text>
                </View>
              </View>
              
              {selectedPaymentMethod === method.id && (
                <Icon name="check-circle" type="material" color="#4CAF50" size={24} />
              )}
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* Pay Now Button */}
      <View style={styles.paymentFooter}>
        <Button
          title={isProcessing ? "Processing..." : "Pay now"}
          buttonStyle={[
            styles.payButton,
            isProcessing && styles.processingButton
          ]}
          titleStyle={styles.payButtonText}
          onPress={handlePayNow}
          disabled={isProcessing}
          loading={isProcessing}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  header: {
    backgroundColor: appColors.AppBlue,
    paddingTop: parameters.headerHeightS,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    marginRight: 15,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.appTextBold,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  appointmentCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  appointmentDate: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginRight: 20,
    fontFamily: appFonts.appTextBold,
  },
  appointmentTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    fontFamily: appFonts.appTextBold,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationText: {
    fontSize: 14,
    color: appColors.grey2,
    marginLeft: 8,
    flex: 1,
    fontFamily: appFonts.appTextRegular,
  },
  sessionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionType: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.appTextMedium,
  },
  sessionDuration: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.appTextRegular,
  },
  inputCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey1,
    marginBottom: 10,
    fontFamily: appFonts.appTextMedium,
  },
  textInput: {
    fontSize: 15,
    color: appColors.grey1,
    fontFamily: appFonts.appTextRegular,
    textAlignVertical: 'top',
    minHeight: 60,
  },
  paymentSummaryCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: 15,
    fontFamily: appFonts.appTextBold,
  },
  priceContainer: {
    alignItems: 'center',
  },
  priceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.appTextBold,
    marginBottom: 5,
  },
  priceLabel: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.appTextRegular,
  },
  paymentMethodsCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  manageVaultButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  manageVaultText: {
    fontSize: 14,
    color: appColors.AppBlue,
    fontFamily: appFonts.appTextMedium,
    marginRight: 5,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: appColors.grey4,
  },
  selectedPaymentMethod: {
    borderColor: '#4CAF50',
    backgroundColor: '#F8FFF8',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: appColors.AppLightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  wellnessVaultIcon: {
    backgroundColor: '#FF9800',
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.appTextMedium,
    marginBottom: 3,
  },
  paymentMethodBalance: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.appTextRegular,
  },
  paymentFooter: {
    backgroundColor: appColors.CardBackground,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  payButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 15,
    paddingVertical: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  processingButton: {
    backgroundColor: appColors.grey3,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.appTextBold,
  },
});

export default BookingCheckoutScreen;
