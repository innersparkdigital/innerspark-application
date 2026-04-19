/**
 * Booking Checkout Screen - Checkout screen for session booking
 */
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
import { scale, moderateScale } from '../../global/Scaling';
import { useToast } from 'native-base';
import { useSelector } from 'react-redux';
import { selectBalance, selectCurrency } from '../../features/wallet/walletSlice';
import { refreshWalletBalance } from '../../utils/walletManager';
import { createAppointment } from '../../utils/appointmentsManager';
import ISAlert, { useISAlert } from '../../components/alerts/ISAlert';
import LHLoaderModal from '../../components/forms/LHLoaderModal';
import { z } from 'zod';

const checkoutSchema = z.object({
  reason: z.string()
    .min(10, 'Please provide a more detailed reason (at least 10 characters) so the therapist can prepare.')
    .max(500, 'Reason must not exceed 500 characters.')
});

const BookingCheckoutScreen = ({ navigation, route }: any) => {
  const {
    therapist,
    selectedSlot,
    isExistingAppointment = false,
    appointmentId = null,
    sessionId = 1,
    sessionType = 'Individual Therapy',
    sessionPrice = null,
    sessionDuration = '60 minutes',
    location = 'Virtual Session',
  } = route.params;
  const toast = useToast();

  const balance = useSelector(selectBalance);
  const currency = useSelector(selectCurrency);
  const userId = useSelector((state: any) => state.userData?.userDetails?.userId || state.user?.userToken?.userId);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        refreshWalletBalance(userId);
      }
    }, [userId])
  );

  const alert = useISAlert();
  const [reason, setReason] = useState(isExistingAppointment ? 'Payment for scheduled appointment' : '');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('wellness_vault');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock appointment details
  const appointmentDetails = {
    date: selectedSlot?.date || 'Thu, 09 Apr',
    time: selectedSlot?.time || '08:00 AM',
    duration: sessionDuration || '60 minutes',
    sessionType: sessionType,
    price: sessionPrice || (therapist.price?.replace?.('$', '') || therapist.price),
    currency: 'UGX',
    location: location,
  };

  const paymentMethods = [
    {
      id: 'wellness_vault',
      name: 'WellnessVault',
      balance: `${currency} ${balance.toLocaleString()}`,
      icon: 'account-balance-wallet',
      selected: true,
    },
  ];

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const handlePayNow = async () => {
    if (!isExistingAppointment) {
      try {
        checkoutSchema.parse({ reason: reason.trim() });
      } catch (error) {
        if (error instanceof z.ZodError) {
          alert.show({
            type: 'error',
            title: 'Action Required',
            message: error.errors[0].message,
          });
          return;
        }
      }

      // Pre-flight wellness vault balance check for new appointments
      const rawPrice = appointmentDetails.price.toString().replace(/[^0-9.]/g, '');
      const requiredAmount = parseFloat(rawPrice);

      if (balance < requiredAmount) {
        alert.show({
          type: 'error',
          title: 'Insufficient Balance',
          message: `Your WellnessVault balance (UGX ${balance.toLocaleString()}) is lower than the required amount (UGX ${requiredAmount.toLocaleString()}). Please top up your vault to proceed.`
        });
        return;
      }
    }

    alert.show({
      type: 'info',
      title: 'Confirm Payment',
      message: `You are about to pay ${formatPrice(appointmentDetails.price)} from your WellnessVault for a ${appointmentDetails.duration} session with ${therapist?.name || 'your therapist'}.\n\nProceed?`,
      confirmText: 'Yes, Pay Now',
      cancelText: 'Cancel',
      dismissible: false,
      onConfirm: async () => {
        setIsProcessing(true);

        try {
          if (isExistingAppointment) {
            setIsProcessing(false);
            navigation.navigate('BookingConfirmationScreen', {
              therapist,
              appointmentDetails: {
                ...appointmentDetails,
                reason: reason || 'Paid existing appointment',
                paymentMethod: paymentMethods.find(method => method.id === selectedPaymentMethod),
                bookingId: appointmentId || 'BK' + Date.now().toString().slice(-6),
              },
            });
          } else {
            // New booking flow
            const durationValue = parseInt(appointmentDetails.duration.toString().replace(/[^0-9]/g, ''), 10) || 60;

            // Format time accurately to remove AM/PM strings for backend strictly (e.g. 02:30 PM -> 14:30)
            const get24hTime = (timeStr: string) => {
              if (!timeStr) return '';
              const match = timeStr.trim().match(/^(\d+):(\d+)\s*(AM|PM)$/i);
              if (match) {
                let [, hours, minutes, modifier] = match;
                let hrs = parseInt(hours, 10);
                if (modifier.toUpperCase() === 'PM' && hrs < 12) hrs += 12;
                if (modifier.toUpperCase() === 'AM' && hrs === 12) hrs = 0;
                return `${hrs.toString().padStart(2, '0')}:${minutes}`;
              }
              // Fallback: strip string manually
              return timeStr.replace(/\s*(AM|PM)/gi, '').trim();
            };

            const result = await createAppointment({
              therapistId: therapist.id.toString(),
              slotId: selectedSlot?.id?.toString() || '',
              sessionType: sessionId.toString(),
              date: selectedSlot?.date || '',
              time: get24hTime(selectedSlot?.time || ''),
              reason: reason.trim(),
              paymentMethod: selectedPaymentMethod,
            });

            setIsProcessing(false);

            if (result.success) {
              navigation.navigate('BookingConfirmationScreen', {
                therapist,
                appointmentDetails: {
                  ...appointmentDetails,
                  reason,
                  paymentMethod: paymentMethods.find(method => method.id === selectedPaymentMethod),
                  bookingId: result.data?.id || 'BK' + Date.now().toString().slice(-6),
                  meetingLink: result.data?.meetingLink,
                },
              });
            } else {
              alert.show({
                type: 'error',
                title: 'Booking Failed',
                message: result.error || 'Failed to book appointment',
              });
            }
          }
        } catch (error: any) {
          setIsProcessing(false);
          alert.show({
            type: 'error',
            title: 'Error',
            message: error?.backendMessage || error?.message || 'An error occurred during booking',
          });
        }
      }
    });
  };

  const formatPrice = (price: any) => {
    // Determine if price already contains UGX or USD tag. If it's a raw number, append it.
    if (typeof price === 'number' || (typeof price === 'string' && !isNaN(Number(price)))) {
      return `UGX ${Number(price).toLocaleString()}`;
    }
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
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={moderateScale(24)} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>
            {isExistingAppointment ? 'Complete Payment' : 'Confirm Booking'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Appointment Details */}
        <View style={styles.appointmentCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: scale(20), paddingBottom: scale(15), borderBottomWidth: 1, borderBottomColor: appColors.AppLightGray }}>
            <Avatar
              source={therapist?.image}
              size={scale(60)}
              rounded
              containerStyle={{ borderWidth: 2, borderColor: appColors.AppLightGray }}
              avatarStyle={{ width: '100%', height: '100%', resizeMode: 'cover' }}
            />
            <View style={{ marginLeft: scale(15), flex: 1 }}>
              <Text style={{ fontSize: moderateScale(18), fontWeight: 'bold', color: appColors.grey1, fontFamily: appFonts.headerTextBold }}>{therapist?.name || 'Therapist Name'}</Text>
              <Text style={{ fontSize: moderateScale(14), color: appColors.grey2, fontFamily: appFonts.bodyTextRegular, marginTop: scale(2) }}>{appointmentDetails.sessionType}</Text>
            </View>
          </View>

          <View style={styles.dateTimeContainer}>
            <View style={styles.dateBlock}>
              <Text style={styles.appointmentDate}>{appointmentDetails.date}</Text>
            </View>
            <View style={styles.timeBlock}>
              <Text style={styles.appointmentTime}>{appointmentDetails.time}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Icon name="videocam" type="material" color={appColors.grey2} size={moderateScale(18)} />
              <Text style={styles.metaText}>{appointmentDetails.location}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Icon name="schedule" type="material" color={appColors.grey2} size={moderateScale(18)} />
              <Text style={styles.metaText}>{appointmentDetails.duration}</Text>
            </View>
          </View>
        </View>



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
            <TouchableOpacity
              style={styles.manageVaultButton}
              onPress={() => navigation.navigate('WellnessVaultScreen', { fromCheckout: true })}
            >
              <Text style={styles.manageVaultText}>Manage Vault</Text>
              <Icon name="chevron-right" type="material" color={appColors.AppBlue} size={moderateScale(20)} />
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
                    size={moderateScale(24)}
                  />
                </View>
                <View style={styles.paymentMethodInfo}>
                  <Text style={styles.paymentMethodName}>{method.name}</Text>
                  <Text style={styles.paymentMethodBalance}>{method.balance}</Text>
                </View>
              </View>

              {selectedPaymentMethod === method.id && (
                <Icon name="check-circle" type="material" color="#4CAF50" size={moderateScale(24)} />
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

      <ISAlert ref={alert.ref} />
      <LHLoaderModal visible={isProcessing} message="Securing your appointment..." />
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
    paddingBottom: scale(20),
    paddingHorizontal: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: scale(8),
    borderRadius: scale(20),
    marginRight: scale(15),
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    flex: 1,
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  scrollView: {
    flex: 1,
    padding: scale(20),
  },
  appointmentCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(20),
    padding: scale(25),
    marginBottom: scale(20),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(15),
  },
  appointmentDate: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextBold,
  },
  appointmentTime: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: '#4CAF50',
    fontFamily: appFonts.bodyTextBold,
  },
  dateBlock: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: appColors.AppLightGray,
    paddingRight: scale(10),
  },
  timeBlock: {
    flex: 1,
    paddingLeft: scale(20),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: scale(12),
    padding: scale(12),
    marginTop: scale(5),
  },
  metaItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaText: {
    fontSize: moderateScale(13),
    color: appColors.grey2,
    marginLeft: scale(6),
    fontFamily: appFonts.bodyTextMedium,
  },
  metaDivider: {
    width: 1,
    height: scale(20),
    backgroundColor: appColors.AppLightGray,
    marginHorizontal: scale(10),
  },
  inputCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(15),
    padding: scale(20),
    marginBottom: scale(15),
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  inputLabel: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: appColors.grey1,
    marginBottom: scale(10),
    fontFamily: appFonts.bodyTextMedium,
  },
  textInput: {
    fontSize: moderateScale(15),
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
    textAlignVertical: 'top',
    minHeight: scale(60),
  },
  paymentSummaryCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(15),
    padding: scale(20),
    marginBottom: scale(15),
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: scale(15),
    fontFamily: appFonts.bodyTextBold,
  },
  priceContainer: {
    alignItems: 'center',
  },
  priceAmount: {
    fontSize: moderateScale(32),
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextBold,
    marginBottom: scale(5),
  },
  priceLabel: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
  },
  paymentMethodsCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(15),
    padding: scale(20),
    marginBottom: scale(20),
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
    marginBottom: scale(15),
  },
  manageVaultButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  manageVaultText: {
    fontSize: moderateScale(14),
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextMedium,
    marginRight: scale(5),
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(15),
    paddingHorizontal: scale(15),
    borderRadius: scale(12),
    marginBottom: scale(10),
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
    width: scale(45),
    height: scale(45),
    borderRadius: scale(22.5),
    backgroundColor: appColors.AppLightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(15),
  },
  wellnessVaultIcon: {
    backgroundColor: '#FF9800',
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
    marginBottom: scale(3),
  },
  paymentMethodBalance: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
  },
  paymentFooter: {
    backgroundColor: appColors.CardBackground,
    padding: scale(20),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  payButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: scale(15),
    paddingVertical: scale(15),
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
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.buttonTextBold,
  },
});

export default BookingCheckoutScreen;
