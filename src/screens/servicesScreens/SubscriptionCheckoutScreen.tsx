/**
 * Subscription Checkout Screen - Select duration and complete payment
 * Reuses PaymentModal and PaymentSuccessModal from EventDetailScreen
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';
import { subscribe } from '../../api/client/subscriptions';
import {
  startPayment,
  paymentSuccess,
  paymentFailure
} from '../../features/subscription/subscriptionSlice';
import { Icon } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import PaymentModal, { PaymentMethodKey, MmStep } from '../../components/payments/PaymentModal';
import PaymentSuccessModal from '../../components/payments/PaymentSuccessModal';
import { useToast } from 'native-base';
import { isValidPhoneNumber } from '../../global/LHValidators';
import { getPhoneNumberOperator } from '../../global/LHShortcuts';

interface SubscriptionCheckoutScreenProps {
  navigation: NavigationProp<any>;
  route: any;
}

interface PlanData {
  id: string;
  name: string;
  description: string;
  weeklyPrice: number;
  monthlyPrice: number;
  currency: string;
  billingCycle: 'weekly' | 'monthly';
  supportGroupsLimit: number | 'unlimited';
  directChatAccess: boolean;
  features: string[];
}

const SubscriptionCheckoutScreen: React.FC<SubscriptionCheckoutScreenProps> = ({ navigation, route }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const userId = useSelector((state: any) => state.userData.userDetails.userId);
  const { plan } = route.params as { plan: PlanData };

  // Duration options based on billing cycle
  const weeklyDurations = [1, 2, 3, 4, 8, 12];
  const monthlyDurations = [1, 2, 3, 6, 12];
  const durations = plan.billingCycle === 'weekly' ? weeklyDurations : monthlyDurations;

  const [selectedDuration, setSelectedDuration] = useState(plan.billingCycle === 'weekly' ? 4 : 1);

  // Payment states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodKey>('wellnessvault');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mobile Money states
  const [mmStep, setMmStep] = useState<MmStep>('phone');
  const [mmPhone, setMmPhone] = useState('');
  const [mmFormattedPhone, setMmFormattedPhone] = useState('');
  const [mmCountrySupported, setMmCountrySupported] = useState(true);
  const [mmOtp, setMmOtp] = useState('');
  const [mmError, setMmError] = useState('');
  const [mmOtpAttempts, setMmOtpAttempts] = useState(0);
  const [mmOtpExpiry, setMmOtpExpiry] = useState<number | null>(null);

  const basePrice = plan.billingCycle === 'weekly' ? plan.weeklyPrice : plan.monthlyPrice;
  const totalAmount = basePrice * selectedDuration;

  const getDurationLabel = (duration: number) => {
    if (plan.billingCycle === 'weekly') {
      return duration === 1 ? '1 week' : `${duration} weeks`;
    } else {
      return duration === 1 ? '1 month' : `${duration} months`;
    }
  };

  const handleProceedToPayment = () => {
    setShowPaymentModal(true);
  };

  const handleSubscribe = async () => {
    if (!selectedPaymentMethod) {
      toast.show({
        description: 'Please select a payment method',
        duration: 2000,
      });
      return;
    }

    if (selectedPaymentMethod === 'mobile_money' && !mmPhone.trim()) {
      toast.show({
        description: 'Please enter your phone number',
        duration: 2000,
      });
      return;
    }

    setIsProcessing(true);
    dispatch(startPayment()); // Redux dispatch
    try {
      if (selectedPaymentMethod === 'mobile_money') {
        if (mmStep === 'phone') {
          if (!mmCountrySupported) {
            setMmError('Your selected country is not supported for Mobile Money');
            return;
          }
          if (!mmFormattedPhone || !isValidPhoneNumber(mmFormattedPhone)) {
            setMmError('Please enter a valid phone number');
            return;
          }
          const operator = getPhoneNumberOperator(mmFormattedPhone);
          if (operator === 'OTHER') {
            setMmError('Please enter a valid MTN or AIRTEL phone number');
            return;
          }

          setMmError('');
          setIsProcessing(true);
          await new Promise<void>((resolve) => setTimeout(() => resolve(), 800));
          setIsProcessing(false);
          setMmStep('otp');
          setMmOtp('');
          setMmOtpAttempts(0);
          setMmOtpExpiry(Date.now() + 2 * 60 * 1000);
          return;
        }

        if (mmStep === 'otp') {
          if (mmOtp.length !== 6) {
            setMmError('Please enter the 6-digit OTP');
            return;
          }
          setMmError('');
          setMmStep('processing');
          setIsProcessing(true);

          try {
            console.log('📞 Calling subscribe API with Mobile Money...');
            console.log('User ID:', userId);
            console.log('Plan ID:', plan.id);
            console.log('Billing Cycle:', plan.billingCycle);
            console.log('Phone:', mmFormattedPhone);

            const response = await subscribe(
              userId,
              plan.id,
              plan.billingCycle,
              'mobile_money',
              mmFormattedPhone
            );
            console.log('✅ Subscribe response:', response);

            setIsProcessing(false);
            setShowPaymentModal(false);
            setShowSuccessModal(true);

            // Dispatch success to Redux
            const newSubscription = {
              id: response.data?.subscription?.id || response.subscription?.id,
              planId: plan.id,
              planName: plan.name,
              status: 'active',
              startDate: new Date().toISOString(),
              endDate: response.data?.subscription?.endDate || response.subscription?.end_date,
              nextBillingDate: response.data?.subscription?.nextBillingDate || response.subscription?.next_billing_date,
              billingCycle: selectedDuration,
              amount: selectedDuration === 'weekly' ? plan.weeklyPrice : plan.monthlyPrice,
              currency: plan.currency,
              autoRenew: true,
            };

            dispatch(paymentSuccess({
              subscription: newSubscription,
              billingRecord: {
                id: response.data?.billing?.id || Date.now().toString(),
                date: new Date().toISOString(),
                amount: newSubscription.amount,
                currency: plan.currency,
                status: 'paid',
                planName: plan.name,
                billingCycle: selectedDuration,
                paymentMethod: selectedPaymentMethod,
              }
            })); // Redux dispatch

            toast.show({
              description: 'Subscription activated successfully!',
              duration: 3000,
            });

            // Navigate to success screen or back to subscriptions
            navigation.navigate('PlansSubscriptionsScreen');
          } catch (error: any) {
            console.error('❌ Error subscribing:', error);
            setIsProcessing(false);
            setMmStep('phone');
            setShowPaymentModal(false);
            dispatch(paymentFailure(error.response?.data?.error || 'Payment failed'));
            toast.show({
              description: error.response?.data?.error || 'Subscription failed. Please try again.',
              duration: 3000,
            });
          }
          return;
        }
      }

      if (selectedPaymentMethod === 'wellnessvault') {
        try {
          console.log('📞 Calling subscribe API...');
          console.log('User ID:', userId);
          console.log('Plan ID:', plan.id);
          console.log('Billing Cycle:', plan.billingCycle);
          console.log('Duration:', selectedDuration);

          const response = await subscribe(
            userId,
            plan.id,
            plan.billingCycle,
            'wellnessvault',
            '' // No phone number for wellnessvault
          );
          console.log('✅ Subscribe response:', response);

          setIsProcessing(false);
          setShowPaymentModal(false);
          setShowSuccessModal(true);

          // Dispatch success to Redux
          const newSubscription = {
            id: response.data?.subscription?.id || response.subscription?.id,
            planId: plan.id,
            planName: plan.name,
            status: 'active',
            startDate: new Date().toISOString(),
            endDate: response.data?.subscription?.endDate || response.subscription?.end_date,
            nextBillingDate: response.data?.subscription?.nextBillingDate || response.subscription?.next_billing_date,
            billingCycle: selectedDuration,
            amount: selectedDuration === 'weekly' ? plan.weeklyPrice : plan.monthlyPrice,
            currency: plan.currency,
            autoRenew: true,
          };

          dispatch(paymentSuccess({
            subscription: newSubscription,
            billingRecord: {
              id: response.data?.billing?.id || Date.now().toString(),
              date: new Date().toISOString(),
              amount: newSubscription.amount,
              currency: plan.currency,
              status: 'paid',
              planName: plan.name,
              billingCycle: selectedDuration,
              paymentMethod: selectedPaymentMethod,
            }
          }));

          toast.show({
            description: 'Subscription activated successfully!',
            duration: 3000,
          });

          navigation.navigate('PlansSubscriptionsScreen');
        } catch (error: any) {
          console.error('❌ Error subscribing:', error);
          setIsProcessing(false);
          setShowPaymentModal(false);
          dispatch(paymentFailure(error.response?.data?.error || 'Payment failed'));
          toast.show({
            description: error.response?.data?.error || 'Failed to process subscription. Please try again.',
            duration: 3000,
          });
        }
      }
    } catch (error: any) {
      console.error('❌ Error in payment flow:', error);
      setIsProcessing(false);
      dispatch(paymentFailure(error.response?.data?.error || 'Payment failed'));
      toast.show({
        description: error.response?.data?.error || 'Failed to process subscription. Please try again.',
        duration: 3000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResendOtp = async () => {
    setMmOtpAttempts(mmOtpAttempts + 1);
    setMmOtp('');
    setMmOtpExpiry(Date.now() + 2 * 60 * 1000);
    toast.show({ description: 'OTP resent successfully', duration: 2000 });
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
    setMmStep('phone');
    setMmPhone('');
    setMmFormattedPhone('');
    setMmOtp('');
    setMmError('');
    setIsProcessing(false);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigation.navigate('ServicesScreen', { initialTab: 'subscription' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={moderateScale(24)} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.planSummaryCard}>
          <View style={styles.planHeader}>
            <Text style={styles.planName}>{plan.name}</Text>
            {plan.id !== 'free' && (
              <View style={styles.priceBadge}>
                <Text style={styles.priceBadgeText}>
                  {plan.currency} {basePrice.toLocaleString()}/{plan.billingCycle === 'weekly' ? 'week' : 'month'}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.planDescription}>{plan.description}</Text>
          <View style={styles.featuresContainer}>
            <View style={styles.featureRow}>
              <Icon name="groups" type="material" color={appColors.AppBlue} size={moderateScale(20)} />
              <Text style={styles.featureText}>
                {plan.supportGroupsLimit === 'unlimited' ? 'Unlimited Support Groups' : `Up to ${plan.supportGroupsLimit} Support Groups`}
              </Text>
            </View>
            <View style={styles.featureRow}>
              <Icon name="chat" type="material" color={plan.directChatAccess ? appColors.AppBlue : appColors.grey4} size={moderateScale(20)} />
              <Text style={[styles.featureText, !plan.directChatAccess && styles.disabledFeature]}>
                {plan.directChatAccess ? 'Direct Therapist Chat' : 'No Direct Chat'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Duration</Text>
          <Text style={styles.sectionSubtitle}>Minimum {plan.billingCycle === 'weekly' ? '1 week' : '1 month'}</Text>
          <View style={styles.durationGrid}>
            {durations.map((duration) => (
              <TouchableOpacity
                key={duration}
                style={[styles.durationChip, selectedDuration === duration && styles.selectedDurationChip]}
                onPress={() => setSelectedDuration(duration)}
              >
                <Text style={[styles.durationChipText, selectedDuration === duration && styles.selectedDurationChipText]}>
                  {getDurationLabel(duration)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.priceBreakdownCard}>
          <Text style={styles.breakdownTitle}>Price Summary</Text>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Plan Price</Text>
            <Text style={styles.breakdownValue}>{plan.currency} {basePrice.toLocaleString()}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Duration</Text>
            <Text style={styles.breakdownValue}>{getDurationLabel(selectedDuration)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.breakdownRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>{plan.currency} {totalAmount.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.infoNote}>
          <Icon name="info-outline" type="material" color={appColors.AppBlue} size={moderateScale(20)} />
          <Text style={styles.infoNoteText}>
            Your subscription will be active immediately after payment. You can manage or cancel anytime from My Subscription.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomAction}>
        <View style={styles.bottomPriceRow}>
          <Text style={styles.bottomPriceLabel}>Total</Text>
          <Text style={styles.bottomPriceValue}>{plan.currency} {totalAmount.toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.proceedButton} onPress={handleProceedToPayment}>
          <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
          <Icon name="arrow-forward" type="material" color={appColors.CardBackground} size={moderateScale(20)} />
        </TouchableOpacity>
      </View>

      <PaymentModal
        visible={showPaymentModal}
        summaryTitle={plan.name}
        summarySubtitle={`${getDurationLabel(selectedDuration)} subscription`}
        currency={plan.currency}
        amount={totalAmount}
        selectedPaymentMethod={selectedPaymentMethod}
        onSelectPaymentMethod={setSelectedPaymentMethod}
        isProcessing={isProcessing}
        onRequestClose={handlePaymentCancel}
        onConfirm={handleSubscribe}
        onCancel={handlePaymentCancel}
        mmStep={mmStep}
        mmPhone={mmPhone}
        mmFormattedPhone={mmFormattedPhone}
        mmOtp={mmOtp}
        mmError={mmError}
        mmOtpAttempts={mmOtpAttempts}
        mmOtpExpiry={mmOtpExpiry}
        onChangeMmPhone={setMmPhone}
        onChangeMmFormattedPhone={setMmFormattedPhone}
        onChangeMmCountrySupport={setMmCountrySupported}
        onChangeMmOtp={setMmOtp}
        onChangeMmStep={setMmStep}
        onResendOtp={handleResendOtp}
      />

      <PaymentSuccessModal
        visible={showSuccessModal}
        title="Subscription Activated!"
        subtitle={`Your ${plan.name} is now active. Enjoy your premium features!`}
        buttonText="Go to My Subscription"
        onClose={handleSuccessClose}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: appColors.AppLightGray },
  header: { backgroundColor: appColors.AppBlue, paddingTop: parameters.headerHeightS, paddingBottom: scale(20), paddingHorizontal: scale(20), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { padding: scale(8), borderRadius: scale(20), backgroundColor: 'rgba(255,255,255,0.2)' },
  headerTitle: { fontSize: moderateScale(24), fontWeight: 'bold', color: appColors.CardBackground, fontFamily: appFonts.headerTextBold },
  headerRightPlaceholder: { width: scale(40) },
  content: { flex: 1, padding: scale(20) },
  planSummaryCard: { backgroundColor: appColors.CardBackground, borderRadius: scale(16), padding: scale(20), marginBottom: scale(20), elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: scale(8) },
  planName: { fontSize: moderateScale(24), fontWeight: 'bold', color: appColors.grey1, fontFamily: appFonts.headerTextBold },
  priceBadge: { backgroundColor: appColors.AppBlue + '15', borderRadius: scale(8), paddingHorizontal: scale(12), paddingVertical: scale(6) },
  priceBadgeText: { fontSize: moderateScale(14), color: appColors.AppBlue, fontWeight: 'bold', fontFamily: appFonts.headerTextBold },
  planDescription: { fontSize: moderateScale(14), color: appColors.grey2, fontFamily: appFonts.headerTextRegular, marginBottom: scale(16) },
  featuresContainer: { borderTopWidth: 1, borderTopColor: appColors.grey6, paddingTop: scale(16) },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: scale(12) },
  featureText: { fontSize: moderateScale(15), color: appColors.grey1, fontFamily: appFonts.headerTextMedium, marginLeft: scale(12) },
  disabledFeature: { color: appColors.grey4 },
  section: { marginBottom: scale(20) },
  sectionTitle: { fontSize: moderateScale(18), fontWeight: 'bold', color: appColors.grey1, fontFamily: appFonts.headerTextBold, marginBottom: scale(4) },
  sectionSubtitle: { fontSize: moderateScale(14), color: appColors.grey3, fontFamily: appFonts.headerTextRegular, marginBottom: scale(16) },
  durationGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: scale(12) },
  durationChip: { backgroundColor: appColors.CardBackground, borderRadius: scale(10), paddingVertical: scale(12), paddingHorizontal: scale(20), borderWidth: 2, borderColor: appColors.grey6, minWidth: scale(100), alignItems: 'center' },
  selectedDurationChip: { backgroundColor: appColors.AppBlue + '15', borderColor: appColors.AppBlue },
  durationChipText: { fontSize: moderateScale(14), color: appColors.grey2, fontFamily: appFonts.headerTextMedium },
  selectedDurationChipText: { color: appColors.AppBlue, fontWeight: 'bold', fontFamily: appFonts.headerTextBold },
  priceBreakdownCard: { backgroundColor: appColors.CardBackground, borderRadius: scale(16), padding: scale(20), marginBottom: scale(20), elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  breakdownTitle: { fontSize: moderateScale(18), fontWeight: 'bold', color: appColors.grey1, fontFamily: appFonts.headerTextBold, marginBottom: scale(16) },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: scale(12) },
  breakdownLabel: { fontSize: moderateScale(14), color: appColors.grey2, fontFamily: appFonts.headerTextRegular },
  breakdownValue: { fontSize: moderateScale(14), color: appColors.grey1, fontFamily: appFonts.headerTextMedium },
  divider: { height: 1, backgroundColor: appColors.grey6, marginVertical: scale(12) },
  totalLabel: { fontSize: moderateScale(16), fontWeight: 'bold', color: appColors.grey1, fontFamily: appFonts.headerTextBold },
  totalValue: { fontSize: moderateScale(20), fontWeight: 'bold', color: appColors.AppBlue, fontFamily: appFonts.headerTextBold },
  infoNote: { flexDirection: 'row', backgroundColor: appColors.AppBlue + '10', borderRadius: scale(12), padding: scale(16), marginBottom: scale(100) },
  infoNoteText: { flex: 1, fontSize: moderateScale(13), color: appColors.grey2, fontFamily: appFonts.headerTextRegular, marginLeft: scale(12), lineHeight: moderateScale(20) },
  bottomAction: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: appColors.CardBackground, padding: scale(20), borderTopWidth: 1, borderTopColor: appColors.grey6, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  bottomPriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: scale(12) },
  bottomPriceLabel: { fontSize: moderateScale(14), color: appColors.grey2, fontFamily: appFonts.headerTextRegular },
  bottomPriceValue: { fontSize: moderateScale(20), fontWeight: 'bold', color: appColors.AppBlue, fontFamily: appFonts.headerTextBold },
  proceedButton: { backgroundColor: appColors.AppBlue, borderRadius: scale(12), paddingVertical: scale(16), flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  proceedButtonText: { fontSize: moderateScale(16), color: appColors.CardBackground, fontWeight: 'bold', fontFamily: appFonts.headerTextBold, marginRight: scale(8) },
});

export default SubscriptionCheckoutScreen;
