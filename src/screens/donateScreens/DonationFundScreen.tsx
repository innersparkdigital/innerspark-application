/**
 * Donation Fund Screen - Support Innerspark's Community Therapy Fund
 * Donations help subsidize therapy sessions for members in need
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
import { Icon, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import LHPhoneInput from '../../components/forms/LHPhoneInput';
import { isValidPhoneNumber } from '../../global/LHValidators';
import { getPhoneNumberOperator } from '../../global/LHShortcuts';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface DonationFundScreenProps {
  navigation: any;
}

const DonationFundScreen: React.FC<DonationFundScreenProps> = ({ navigation }) => {
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

  // Predefined amounts with impact descriptions
  const predefinedAmounts = [
    { amount: '5000', impact: '1 subsidized session' },
    { amount: '10000', impact: '2 subsidized sessions' },
    { amount: '25000', impact: '5 subsidized sessions' },
    { amount: '50000', impact: '10 subsidized sessions' },
    { amount: '100000', impact: '20 subsidized sessions' },
  ];

  // Mock impact stats
  const impactStats = {
    membersHelped: 234,
    sessionsSubsidized: 1847,
    fundBalance: 'UGX 2,450,000',
    thisMonth: 89,
  };

  // Handle donation amount change
  const onChangeDonationAmountHandler = (amount: string) => {
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

    // Validate phone number
    if (!phone || !isValidPhoneNumber(formattedPhone)) {
      toast.show({
        description: 'Please enter a valid phone number',
        duration: 3000,
      });
      return;
    }

    // Check is phone is valid MTN or AIRTEL Number. if operator is OTHER, show error
    const operator = getPhoneNumberOperator(formattedPhone);
    if (operator === 'OTHER') {
      toast.show({
        description: 'Please enter a valid MTN or AIRTEL phone number',
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsLoading(false);
      setShowSuccessModal(true);
      
      // Form will be reset when modal closes
      
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
    // Reset form after modal closes
    setDonationAmount('');
    setPhone('');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={appColors.AppBlue} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support Our Community</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroCard}>
          <Icon name="favorite" type="material" color={appColors.AppBlue} size={48} />
          <Text style={styles.heroTitle}>Help Make Therapy Accessible</Text>
          <Text style={styles.heroMessage}>
            Your donation goes directly to Innerspark's Community Therapy Fund, helping members access affordable mental health support.
          </Text>
        </View>

        {/* Impact Stats */}
        <View style={styles.impactSection}>
          <Text style={styles.sectionTitle}>Our Impact</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{impactStats.membersHelped}</Text>
              <Text style={styles.statLabel}>Members Helped</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{impactStats.sessionsSubsidized}</Text>
              <Text style={styles.statLabel}>Sessions Subsidized</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{impactStats.thisMonth}</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{impactStats.fundBalance}</Text>
              <Text style={styles.statLabel}>Active Fund</Text>
            </View>
          </View>
        </View>

        {/* How It Works */}
        <View style={styles.howItWorksCard}>
          <Text style={styles.sectionTitle}>How Your Donation Helps</Text>
          <View style={styles.howItWorksItem}>
            <Icon name="check-circle" type="material" color="#4CAF50" size={24} />
            <Text style={styles.howItWorksText}>
              100% of donations go to subsidizing therapy sessions
            </Text>
          </View>
          <View style={styles.howItWorksItem}>
            <Icon name="check-circle" type="material" color="#4CAF50" size={24} />
            <Text style={styles.howItWorksText}>
              Members in need receive discounted or free sessions
            </Text>
          </View>
          <View style={styles.howItWorksItem}>
            <Icon name="check-circle" type="material" color="#4CAF50" size={24} />
            <Text style={styles.howItWorksText}>
              Transparent fund management and regular impact reports
            </Text>
          </View>
          <View style={styles.howItWorksItem}>
            <Icon name="check-circle" type="material" color="#4CAF50" size={24} />
            <Text style={styles.howItWorksText}>
              Supporting mental health accessibility for all
            </Text>
          </View>
        </View>

        {/* Donation Amount Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Your Contribution</Text>
          
          {/* Predefined Amounts with Impact */}
          <View style={styles.predefinedAmountsContainer}>
            {predefinedAmounts.map((item) => (
              <TouchableOpacity
                key={item.amount}
                style={[
                  styles.amountChip,
                  donationAmount === item.amount && styles.selectedAmountChip
                ]}
                onPress={() => selectPredefinedAmount(item.amount)}
              >
                <Text style={[
                  styles.amountChipText,
                  donationAmount === item.amount && styles.selectedAmountChipText
                ]}>
                  UGX {parseInt(item.amount).toLocaleString()}
                </Text>
                <Text style={[
                  styles.impactText,
                  donationAmount === item.amount && styles.selectedImpactText
                ]}>
                  {item.impact}
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
          />
        </View>

        {/* Donation Summary */}
        {donationAmount && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Donation Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Recipient:</Text>
              <Text style={styles.summaryValue}>Innerspark Therapy Fund</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Amount:</Text>
              <Text style={styles.summaryValue}>UGX {parseInt(donationAmount).toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Payment Method:</Text>
              <Text style={styles.summaryValue}>Mobile Money</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax Deductible:</Text>
              <Text style={styles.summaryValue}>Yes</Text>
            </View>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Donate Button */}
      <View style={styles.footer}>
        <Button
          title={isLoading ? "Processing..." : "Donate to Fund"}
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
            <Icon name="favorite" type="material" color={appColors.AppBlue} size={48} />
            <Text style={styles.modalTitle}>Confirm Donation</Text>
            <Text style={styles.modalMessage}>
              You are about to donate UGX {parseInt(donationAmount).toLocaleString()} to Innerspark's Community Therapy Fund.
            </Text>
            <Text style={styles.modalSubMessage}>
              A mobile money prompt will be sent to {formattedPhone}.
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
            <Icon name="check-circle" type="material" color="#4CAF50" size={48} />
            <Text style={styles.modalTitle}>Thank You!</Text>
            <Text style={styles.modalMessage}>
              Your generous donation of UGX {parseInt(donationAmount || '0').toLocaleString()} has been received.
            </Text>
            <Text style={styles.modalSubMessage}>
              You're helping make mental health care accessible to those who need it most. Together, we're building a healthier community.
            </Text>
            
            <Button
              title="Done"
              buttonStyle={styles.successButton}
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
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  heroCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 25,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: appFonts.headerTextBold,
  },
  heroMessage: {
    fontSize: 15,
    color: appColors.grey2,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: appFonts.headerTextRegular,
  },
  impactSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: 15,
    fontFamily: appFonts.headerTextBold,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 15,
    width: '48%',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    marginBottom: 5,
    fontFamily: appFonts.headerTextBold,
  },
  statLabel: {
    fontSize: 12,
    color: appColors.grey2,
    textAlign: 'center',
    fontFamily: appFonts.headerTextRegular,
  },
  howItWorksCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  howItWorksItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  howItWorksText: {
    flex: 1,
    fontSize: 14,
    color: appColors.grey2,
    marginLeft: 12,
    lineHeight: 20,
    fontFamily: appFonts.headerTextRegular,
  },
  section: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: appColors.grey2,
    marginBottom: 15,
    fontFamily: appFonts.headerTextRegular,
  },
  predefinedAmountsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  amountChip: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: appColors.grey4,
    width: '48%',
    alignItems: 'center',
  },
  selectedAmountChip: {
    backgroundColor: appColors.AppBlue + '15',
    borderColor: appColors.AppBlue,
  },
  amountChipText: {
    fontSize: 16,
    color: appColors.grey1,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  selectedAmountChipText: {
    color: appColors.AppBlue,
  },
  impactText: {
    fontSize: 11,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  selectedImpactText: {
    color: appColors.AppBlue,
    fontWeight: '600',
  },
  customAmountContainer: {
    marginTop: 10,
  },
  customAmountLabel: {
    fontSize: 14,
    color: appColors.grey2,
    marginBottom: 10,
    fontFamily: appFonts.headerTextRegular,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.AppLightGray,
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: appColors.grey4,
  },
  currencyPrefix: {
    fontSize: 16,
    color: appColors.grey2,
    marginRight: 10,
    fontFamily: appFonts.headerTextRegular,
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    color: appColors.grey1,
    paddingVertical: 15,
    fontFamily: appFonts.headerTextRegular,
  },
  summaryCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderLeftWidth: 4,
    borderLeftColor: appColors.AppBlue,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: 15,
    fontFamily: appFonts.headerTextBold,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  bottomSpacing: {
    height: 20,
  },
  footer: {
    backgroundColor: appColors.CardBackground,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  donateButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 25,
    paddingVertical: 15,
  },
  donateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  disabledButton: {
    backgroundColor: appColors.grey4,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: appFonts.headerTextBold,
  },
  modalMessage: {
    fontSize: 16,
    color: appColors.grey2,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 10,
    fontFamily: appFonts.headerTextRegular,
  },
  modalSubMessage: {
    fontSize: 14,
    color: appColors.grey3,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 25,
    fontFamily: appFonts.headerTextRegular,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: 20,
    paddingVertical: 12,
    flex: 1,
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
  },
  confirmButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 20,
    paddingVertical: 12,
    flex: 1,
    marginLeft: 10,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  successButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 40,
    minWidth: 120,
  },
});

export default DonationFundScreen;
