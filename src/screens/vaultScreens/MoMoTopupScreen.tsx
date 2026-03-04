/**
 * MoMo Topup Screen - Add money to your WellnessVault
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
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import { useToast } from 'native-base';
import LHPhoneInput from '../../components/forms/LHPhoneInput';
import LHLoaderModal from '../../components/forms/LHLoaderModal';
import { topupWalletBalance } from '../../utils/walletManager';
import ISAlert, { useISAlert } from '../../components/alerts/ISAlert';

const SCREEN_WIDTH = Dimensions.get('window').width;

const MoMoTopupScreen = ({ navigation }: any) => {
  const toast = useToast();
  const userDetails = useSelector((state: any) => state.userData.userDetails);

  const alert = useISAlert();

  // Helper to detect country info and strip prefix from prefilled number
  const getPhoneDetails = (fullPhone: string) => {
    if (!fullPhone) return { phone: '', countryCode: 'UG', callingCode: '256' };

    let clean = fullPhone.trim().replace(/[\s\(\)\-]/g, '');
    const mapping = [
      { prefix: '+256', code: 'UG', calling: '256' },
      { prefix: '+254', code: 'KE', calling: '254' },
      { prefix: '+250', code: 'RW', calling: '250' },
      { prefix: '+255', code: 'TZ', calling: '255' },
      { prefix: '256', code: 'UG', calling: '256' },
      { prefix: '254', code: 'KE', calling: '254' },
      { prefix: '250', code: 'RW', calling: '250' },
      { prefix: '255', code: 'TZ', calling: '255' },
    ];

    for (const item of mapping) {
      if (clean.startsWith(item.prefix)) {
        return {
          phone: clean.slice(item.prefix.length),
          countryCode: item.code,
          callingCode: item.calling
        };
      }
    }

    // Handle leading zero
    if (clean.startsWith('0')) {
      return { phone: clean.slice(1), countryCode: 'UG', callingCode: '256' };
    }

    return { phone: clean, countryCode: 'UG', callingCode: '256' };
  };

  const phoneDetails = getPhoneDetails(userDetails?.phone || '');

  // Form state
  const [topupAmount, setTopupAmount] = useState('');
  const [phone, setPhone] = useState(phoneDetails.phone);
  const [formattedPhone, setFormattedPhone] = useState(userDetails?.phone || '');
  const [isCountrySupported, setIsCountrySupported] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Handle topup amount change
  const onChangeTopupAmountHandler = (amount: any) => {
    // Remove any non-numeric characters except decimal point
    const numericAmount = amount.replace(/[^0-9]/g, '');
    setTopupAmount(numericAmount);
  };

  // Handle phone change
  const onChangePhoneHandler = (phone: any) => {
    setPhone(phone);
  };

  // Handle topup submission
  const handleTopUpSubmit = async () => {
    if (!topupAmount || topupAmount === '0') {
      toast.show({
        description: 'Please enter a valid amount',
        duration: 2000,
      });
      return;
    }

    if (!formattedPhone) {
      toast.show({
        description: 'Please enter a valid phone number',
        duration: 2000,
      });
      return;
    }

    if (!isCountrySupported) {
      toast.show({
        description: 'Country not supported yet!',
        duration: 2000,
      });
      return;
    }

    // Process topup Confirmation
    const amount = parseInt(topupAmount, 10);

    alert.show({
      type: 'info',
      title: 'Confirm Top-up',
      message: `You are about to top-up ${amount.toLocaleString()} UGX from mobile number ${formattedPhone}.\n\nProceed?`,
      confirmText: 'Yes, Top-up',
      cancelText: 'Cancel',
      dismissible: false,
      onConfirm: async () => {
        setIsLoading(true);

        try {
          const userId = userDetails?.userId || userDetails?.id;
          const response = await topupWalletBalance(userId, amount, formattedPhone, 'MOBILE_MONEY');

          if (response && response.success) {
            alert.show({
              type: 'success',
              title: 'Top-up Initiated',
              message: `${response.data?.message || 'Transaction processing.'}\n\nPlease finalize the transaction by entering your PIN when prompted by your Mobile Money service provider.`,
              confirmText: 'Back to Wallet',
              dismissible: false,
              onConfirm: () => navigation.goBack()
            });

            // Clear form
            setTopupAmount('');
            setPhone('');
            setFormattedPhone('');
          } else {
            alert.show({
              type: 'error',
              title: 'Top-up Failed',
              message: response?.error || 'Failed to initiate topup. Please try again.',
            });
          }
        } catch (error) {
          alert.show({
            type: 'error',
            title: 'Error',
            message: 'An unexpected error occurred. Please try again.',
          });
        } finally {
          setIsLoading(false);
        }
      } // End onConfirm
    });
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={appColors.AppBlue} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={moderateScale(24)} />
          </TouchableOpacity>
        </View>

        <View style={styles.headerBottomRow}>
          <Text style={styles.headerTitle}>MoMo Top-up</Text>
          <Text style={styles.headerSubtitle}>Add more funds to your WellnessVault</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>

          {/* Topup Amount Section */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Topup Amount</Text>
            <View style={styles.inputBlockRow}>
              <Text style={styles.currencyPrefix}>UGX</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="eg: 5000"
                placeholderTextColor={appColors.grey3}
                value={topupAmount}
                onChangeText={onChangeTopupAmountHandler}
                keyboardType="numeric"
                editable={!isLoading}
              />
            </View>
          </View>

          {/* MoMo Number Section */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>MoMo Number</Text>
            <LHPhoneInput
              placeholder="0750000000"
              inputValue={phone}
              inputValueSetter={setPhone}
              formattedValueSetter={setFormattedPhone}
              countrySupportSetter={() => { }} // Not strictly used here since read-only
              isInputEditable={false}
              defaultCountryCode={phoneDetails.countryCode}
              defaultCallingCode={phoneDetails.callingCode}
            />
            <Text style={styles.inputHint}>This is your primary number registered with your account</Text>
          </View>

          {/* Topup Button */}
          <View style={styles.buttonContainer}>
            <Button
              title={isLoading ? "PROCESSING..." : "TOPUP"}
              buttonStyle={styles.topupButton}
              titleStyle={styles.topupButtonText}
              disabled={isLoading}
              onPress={handleTopUpSubmit}
            />
          </View>

        </View>
      </ScrollView>

      {/* Global Actions mapped directly above modals securely */}
      <ISAlert ref={alert.ref} />

      {/* Central LHLoaderModal securely blocks screen during API request explicitly safely natively */}
      <LHLoaderModal visible={isLoading} message="Processing Top-up..." />

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
    paddingTop: parameters.headerHeightS + scale(10),
    paddingBottom: scale(40),
    paddingHorizontal: scale(20),
    borderBottomLeftRadius: scale(30),
    borderBottomRightRadius: scale(30),
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: scale(15),
  },
  headerBottomRow: {
    alignItems: 'center',
  },
  backButton: {
    padding: scale(8),
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
    textAlign: 'center',
    marginBottom: scale(5),
  },
  headerSubtitle: {
    fontSize: moderateScale(16),
    color: appColors.CardBackground,
    opacity: 0.9,
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    backgroundColor: appColors.CardBackground,
    margin: scale(20),
    borderRadius: scale(20),
    padding: scale(30),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.15,
    shadowRadius: scale(3),
  },
  inputSection: {
    marginBottom: scale(30),
  },
  inputLabel: {
    fontSize: moderateScale(16),
    color: appColors.grey1,
    fontWeight: '600',
    marginBottom: scale(15),
    fontFamily: appFonts.bodyTextMedium,
  },
  inputHint: {
    fontSize: moderateScale(11),
    color: appColors.grey3,
    marginTop: scale(5),
    marginLeft: scale(15),
    fontFamily: appFonts.bodyTextRegular,
    fontStyle: 'italic',
  },
  inputBlockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    borderWidth: 1,
    borderColor: appColors.grey4,
    borderRadius: scale(25),
    marginVertical: scale(8),
  },
  currencyPrefix: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.AppBlue,
    marginRight: scale(15),
    fontFamily: appFonts.headerTextBold,
  },
  amountInput: {
    flex: 1,
    fontSize: moderateScale(16),
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextRegular,
    paddingVertical: 0,
  },
  buttonContainer: {
    marginTop: scale(20),
  },
  topupButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: scale(12),
    paddingVertical: scale(18),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
  },
  topupButtonText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
});

export default MoMoTopupScreen;
