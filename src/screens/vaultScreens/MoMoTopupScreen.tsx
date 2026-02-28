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

const SCREEN_WIDTH = Dimensions.get('window').width;

const MoMoTopupScreen = ({ navigation }) => {
  const toast = useToast();
  const userDetails = useSelector(state => state.userData.userDetails);

  // Form state
  const [topupAmount, setTopupAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const [isCountrySupported, setIsCountrySupported] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Handle topup amount change
  const onChangeTopupAmountHandler = (amount) => {
    // Remove any non-numeric characters except decimal point
    const numericAmount = amount.replace(/[^0-9]/g, '');
    setTopupAmount(numericAmount);
  };

  // Handle phone change
  const onChangePhoneHandler = (phone) => {
    setPhone(phone);
  };

  // Handle topup submission
  const handleTopUpSubmit = () => {
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

    // Process topup
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.show({
        description: `Successfully topped up UGX ${parseInt(topupAmount).toLocaleString()}`,
        duration: 3000,
      });

      // Clear form
      setTopupAmount('');
      setPhone('');
      setFormattedPhone('');

      // Navigate back
      navigation.goBack();
    }, 2000);
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
              countrySupportSetter={setIsCountrySupported}
              formattedValueSetter={setFormattedPhone}
              onPickerPress={() => { }}
              isInputEditable={!isLoading}
            />
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
    paddingBottom: scale(30),
    paddingHorizontal: scale(20),
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
