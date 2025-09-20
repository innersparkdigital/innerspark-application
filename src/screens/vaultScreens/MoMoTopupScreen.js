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
            <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={24} />
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
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 15,
  },
  headerBottomRow: {
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.appTextBold,
    textAlign: 'center',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: appColors.CardBackground,
    opacity: 0.9,
    fontFamily: appFonts.appTextRegular,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    backgroundColor: appColors.CardBackground,
    margin: 20,
    borderRadius: 20,
    padding: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  inputSection: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    color: appColors.grey1,
    fontWeight: '600',
    marginBottom: 15,
    fontFamily: appFonts.appTextMedium,
  },
  inputBlockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: appColors.grey4,
    borderRadius: 25,
    marginVertical: 8,
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    marginRight: 15,
    fontFamily: appFonts.appTextBold,
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    color: appColors.AppBlue,
    fontFamily: appFonts.appTextRegular,
    paddingVertical: 0,
  },
  buttonContainer: {
    marginTop: 20,
  },
  topupButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 12,
    paddingVertical: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  topupButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.appTextBold,
  },
});

export default MoMoTopupScreen;
