/**
 * Donate To Therapist Screen - Donate to support therapists via Mobile Money
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
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button, Avatar } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import { useToast } from 'native-base';
import LHPhoneInput from '../../components/forms/LHPhoneInput';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface DonateToTherapistScreenProps {
  navigation: any;
  route: {
    params: {
      therapist: {
        id: number;
        name: string;
        image: any;
        specialty: string;
      };
    };
  };
}

const DonateToTherapistScreen: React.FC<DonateToTherapistScreenProps> = ({ navigation, route }) => {
  const { therapist } = route.params;
  const toast = useToast();
  const userDetails = useSelector((state: any) => state.userData.userDetails);

  // Form state
  const [donationAmount, setDonationAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const [isCountrySupported, setIsCountrySupported] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Predefined amounts
  const predefinedAmounts = ['5000', '10000', '25000', '50000', '100000'];

  // Handle donation amount change
  const onChangeDonationAmountHandler = (amount: string) => {
    // Remove any non-numeric characters
    const numericAmount = amount.replace(/[^0-9]/g, '');
    setDonationAmount(numericAmount);
  };

  // Handle phone change
  const onChangePhoneHandler = (phone: string) => {
    setPhone(phone);
  };

  // Handle predefined amount selection
  const selectPredefinedAmount = (amount: string) => {
    setDonationAmount(amount);
  };

  // Handle donation submission
  const handleDonationSubmit = () => {
    if (!donationAmount || donationAmount === '0') {
      toast.show({
        description: 'Please enter a donation amount',
        duration: 3000,
      });
      return;
    }

    if (!phone || phone.length < 10) {
      toast.show({
        description: 'Please enter a valid phone number',
        duration: 3000,
      });
      return;
    }

    setShowConfirmModal(true);
  };

  // Confirm donation
  const confirmDonation = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(() => resolve(null), 2000));

      setIsLoading(false);
      setShowSuccessModal(true);

      // Reset form
      setDonationAmount('');
      setPhone('');

    } catch (error) {
      setIsLoading(false);
      toast.show({
        description: 'Donation failed. Please try again.',
        duration: 3000,
      });
    }
  };

  // Handle success modal close
  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={appColors.AppBlue} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={moderateScale(24)} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Donate to Therapist</Text>
        <View style={{ width: scale(24) }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Therapist Info */}
        <View style={styles.therapistCard}>
          <Avatar
            source={therapist.image}
            size={scale(80)}
            rounded
            containerStyle={styles.therapistAvatar}
          />
          <View style={styles.therapistInfo}>
            <Text style={styles.therapistName}>{therapist.name}</Text>
            <Text style={styles.therapistSpecialty}>{therapist.specialty}</Text>
            <Text style={styles.donationMessage}>
              Your donation helps support mental health professionals and makes therapy more accessible.
            </Text>
          </View>
        </View>

        {/* Donation Amount Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Donation Amount</Text>

          {/* Predefined Amounts */}
          <View style={styles.predefinedAmountsContainer}>
            {predefinedAmounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.amountChip,
                  donationAmount === amount && styles.selectedAmountChip
                ]}
                onPress={() => selectPredefinedAmount(amount)}
              >
                <Text style={[
                  styles.amountChipText,
                  donationAmount === amount && styles.selectedAmountChipText
                ]}>
                  UGX {parseInt(amount).toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Amount Input */}
          <View style={styles.customAmountContainer}>
            <Text style={styles.customAmountLabel}>Or enter custom amount:</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencyPrefix}>UGX</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0"
                value={donationAmount}
                onChangeText={onChangeDonationAmountHandler}
                keyboardType="numeric"
                maxLength={8}
              />
            </View>
          </View>
        </View>

        {/* Phone Number Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mobile Money Number</Text>
          <Text style={styles.sectionSubtitle}>
            Enter your mobile money number for payment
          </Text>

          <LHPhoneInput
            inputValue={phone}
            inputValueSetter={setPhone}
            formattedValueSetter={setFormattedPhone}
            countrySupportSetter={setIsCountrySupported}
            onPickerPress={() => { }}
          />
        </View>

        {/* Donation Summary */}
        {donationAmount && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Donation Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Recipient:</Text>
              <Text style={styles.summaryValue}>{therapist.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Amount:</Text>
              <Text style={styles.summaryValue}>UGX {parseInt(donationAmount).toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Payment Method:</Text>
              <Text style={styles.summaryValue}>Mobile Money</Text>
            </View>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Donate Button */}
      <View style={styles.footer}>
        <Button
          title={isLoading ? "Processing..." : "Donate Now"}
          buttonStyle={[
            styles.donateButton,
            (!donationAmount || !phone || isLoading) && styles.disabledButton
          ]}
          titleStyle={styles.donateButtonText}
          onPress={handleDonationSubmit}
          disabled={!donationAmount || !phone || isLoading}
          loading={isLoading}
        />
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Icon name="favorite" type="material" color={appColors.AppBlue} size={moderateScale(48)} />
            <Text style={styles.modalTitle}>Confirm Donation</Text>
            <Text style={styles.modalMessage}>
              You are about to donate UGX {parseInt(donationAmount).toLocaleString()} to {therapist.name}.
            </Text>
            <Text style={styles.modalSubMessage}>
              A mobile money prompt will be sent to {formattedPhone || phone}.
            </Text>

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                buttonStyle={styles.cancelButton}
                titleStyle={styles.cancelButtonText}
                onPress={() => setShowConfirmModal(false)}
              />
              <Button
                title="Confirm"
                buttonStyle={styles.confirmButton}
                titleStyle={styles.confirmButtonText}
                onPress={confirmDonation}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleSuccessClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Icon name="check-circle" type="material" color="#4CAF50" size={moderateScale(48)} />
            <Text style={styles.modalTitle}>Donation Successful!</Text>
            <Text style={styles.modalMessage}>
              Thank you for your generous donation of UGX {parseInt(donationAmount || '0').toLocaleString()} to {therapist.name}.
            </Text>
            <Text style={styles.modalSubMessage}>
              Your support helps make mental health care more accessible to everyone.
            </Text>

            <Button
              title="Done"
              buttonStyle={styles.confirmButton}
              titleStyle={styles.confirmButtonText}
              onPress={handleSuccessClose}
            />
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  scrollView: {
    flex: 1,
    padding: scale(20),
  },
  therapistCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(15),
    padding: scale(20),
    marginBottom: scale(20),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
  },
  therapistAvatar: {
    marginBottom: scale(15),
  },
  therapistInfo: {
    alignItems: 'center',
  },
  therapistName: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: scale(5),
    fontFamily: appFonts.headerTextBold,
  },
  therapistSpecialty: {
    fontSize: moderateScale(14),
    color: appColors.AppBlue,
    marginBottom: scale(15),
    fontFamily: appFonts.bodyTextRegular,
  },
  donationMessage: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    textAlign: 'center',
    lineHeight: scale(20),
    fontFamily: appFonts.bodyTextRegular,
  },
  section: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(15),
    padding: scale(20),
    marginBottom: scale(20),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: scale(5),
    fontFamily: appFonts.headerTextBold,
  },
  sectionSubtitle: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    marginBottom: scale(15),
    fontFamily: appFonts.bodyTextRegular,
  },
  predefinedAmountsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: scale(20),
  },
  amountChip: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: scale(20),
    paddingVertical: scale(10),
    paddingHorizontal: scale(15),
    marginBottom: scale(10),
    borderWidth: 1,
    borderColor: appColors.grey4,
    width: '48%',
    alignItems: 'center',
  },
  selectedAmountChip: {
    backgroundColor: appColors.AppBlue + '15',
    borderColor: appColors.AppBlue,
  },
  amountChipText: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontWeight: '500',
    fontFamily: appFonts.bodyTextRegular,
  },
  selectedAmountChipText: {
    color: appColors.AppBlue,
    fontWeight: 'bold',
  },
  customAmountContainer: {
    marginTop: scale(10),
  },
  customAmountLabel: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    marginBottom: scale(10),
    fontFamily: appFonts.bodyTextRegular,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.AppLightGray,
    borderRadius: scale(10),
    paddingHorizontal: scale(15),
    borderWidth: 1,
    borderColor: appColors.grey4,
  },
  currencyPrefix: {
    fontSize: moderateScale(16),
    color: appColors.grey2,
    marginRight: scale(10),
    fontFamily: appFonts.bodyTextRegular,
  },
  amountInput: {
    flex: 1,
    fontSize: moderateScale(16),
    color: appColors.grey1,
    paddingVertical: scale(15),
    fontFamily: appFonts.bodyTextRegular,
  },
  summaryCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(15),
    padding: scale(20),
    marginBottom: scale(20),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderLeftWidth: scale(4),
    borderLeftColor: appColors.AppBlue,
  },
  summaryTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: scale(15),
    fontFamily: appFonts.headerTextBold,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(10),
  },
  summaryLabel: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
  },
  summaryValue: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  bottomSpacing: {
    height: scale(20),
  },
  footer: {
    backgroundColor: appColors.CardBackground,
    padding: scale(20),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  donateButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: scale(25),
    paddingVertical: scale(15),
  },
  donateButtonText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  disabledButton: {
    backgroundColor: appColors.AppLightGray,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  modalContent: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(20),
    padding: scale(30),
    alignItems: 'center',
    width: '100%',
    maxWidth: scale(350),
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: appColors.grey1,
    marginTop: scale(15),
    marginBottom: scale(10),
    textAlign: 'center',
    fontFamily: appFonts.headerTextBold,
  },
  modalMessage: {
    fontSize: moderateScale(16),
    color: appColors.grey2,
    textAlign: 'center',
    lineHeight: scale(22),
    marginBottom: scale(10),
    fontFamily: appFonts.bodyTextRegular,
  },
  modalSubMessage: {
    fontSize: moderateScale(14),
    color: appColors.grey3,
    textAlign: 'center',
    lineHeight: scale(20),
    marginBottom: scale(25),
    fontFamily: appFonts.bodyTextRegular,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: scale(20),
    paddingVertical: scale(12),
    flex: 1,
    marginRight: scale(10),
  },
  cancelButtonText: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
  },
  confirmButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: scale(20),
    paddingVertical: scale(12),
    flex: 1,
    marginLeft: scale(10),
  },
  confirmButtonText: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
});

export default DonateToTherapistScreen;
