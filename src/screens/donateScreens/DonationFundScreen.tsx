/**
 * Donation Fund Screen - Support Innerspark's Community Therapy Fund
 * Donations help subsidize therapy sessions for members in need
 */
import React, { useState, useEffect } from 'react';
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
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import { useToast } from 'native-base';
import LHPhoneInput from '../../components/forms/LHPhoneInput';
import { isValidPhoneNumber } from '../../global/LHValidators';
import { getPhoneNumberOperator } from '../../global/LHShortcuts';
import ImpactStatsCard from '../../components/donate/ImpactStatsCard';
import WalletSelectionCard from '../../components/donate/WalletSelectionCard';
import LHLoaderModal from '../../components/forms/LHLoaderModal';
import { getWalletBalance, makeDonation } from '../../api/client/wallet';
import { updateUserDetails } from '../../features/user/userDataSlice';
import ISAlert, { useISAlert } from '../../components/alerts/ISAlert';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface DonationFundScreenProps {
  navigation: any;
}

const DonationFundScreen: React.FC<DonationFundScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const userDetails = useSelector((state: any) => state.userData.userDetails);
  const alert = useISAlert();

  // Form state
  const [donationAmount, setDonationAmount] = useState('');
  const [note, setNote] = useState('');
  const [walletBalance, setWalletBalance] = useState(userDetails?.balance || 0);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'mobile_money'>('wallet');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [donationResponse, setDonationResponse] = useState<any>(null);

  // Load balance on mount
  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    if (!userDetails?.userId) return;
    setIsRefreshingBalance(true);
    try {
      const response = await getWalletBalance(userDetails.userId);
      if (response && response.success) {
        // Only update if we received actual balance data
        const fetchedBalance = response.balance !== undefined ? response.balance : response.data?.total_balance;
        
        if (fetchedBalance !== undefined && fetchedBalance !== null && !isNaN(fetchedBalance)) {
          setWalletBalance(fetchedBalance);
          // Also sync to Redux if different
          if (fetchedBalance !== userDetails.balance) {
            dispatch(updateUserDetails({
              ...userDetails,
              balance: fetchedBalance
            }));
          }
        }
      }
    } catch (error) {
      console.log('Error fetching balance:', error);
    } finally {
      setIsRefreshingBalance(false);
    }
  };

  // Predefined amounts with impact descriptions
  const predefinedAmounts = [
    { amount: '5000', impact: '1 subsidized session' },
    { amount: '10000', impact: '2 subsidized sessions' },
    { amount: '25000', impact: '5 subsidized sessions' },
    { amount: '50000', impact: '10 subsidized sessions' },
    { amount: '100000', impact: '20 subsidized sessions' },
  ];

  // Mock impact stats --- FOR DEMO PURPOSES ONLY
  const impactStats = {
    membersHelped: 234,
    sessionsSubsidized: 1847,
    fundBalance: 'UGX 2,450,000',
    thisMonth: 89,
  };

  // Handle donation amount change
  const onChangeDonationAmountHandler = (amount: string) => {
    let numericAmount = amount.replace(/[^0-9]/g, '');
    
    // Strip leading zeros to prevent duplicate 0's at start
    if (numericAmount.length > 0) {
      numericAmount = numericAmount.replace(/^0+/, '');
    }
    
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
  
  const onChangeNoteHandler = (text: string) => {
    setNote(text);
  };

  // Handle donation submission
  const handleDonationSubmit = () => {
    const amount = parseInt(donationAmount);
    if (!donationAmount || isNaN(amount) || amount <= 0) {
      toast.show({
        description: 'Please enter a valid donation amount',
        duration: 3000,
      });
      return;
    }

    if (amount < 1000) {
      alert.show({
        type: 'info',
        title: 'Minimum Donation',
        message: 'To make your support count, the minimum donation is 1,000 UGX 🙌',
        confirmText: 'Okay',
      });
      return;
    }

    if (paymentMethod === 'wallet' && amount > walletBalance) {
      toast.show({
        description: `Insufficient balance. You need UGX ${amount.toLocaleString()}`,
        status: 'error',
        duration: 4000,
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
      const response = await makeDonation(
        userDetails.userId,
        parseInt(donationAmount),
        note
      );

      if (response.success) {
        setDonationResponse(response.data);
        
        // Update local and global balance
        const newBalance = response.data.wallet_balance;
        setWalletBalance(newBalance);
        dispatch(updateUserDetails({
          ...userDetails,
          balance: newBalance
        }));

        setIsLoading(false);
        setShowSuccessModal(true);
      } else {
        throw new Error(response.message || 'Donation failed');
      }
    } catch (error: any) {
      setIsLoading(false);
      
      const errorMessage = error.response?.data?.error?.message || 
                          error.response?.data?.message || 
                          error.message || 
                          'Donation failed. Please try again.';
      
      toast.show({
        description: errorMessage,
        duration: 4000,
        status: 'error'
      });
    }
  };

  // Handle success modal close
  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setDonationAmount('');
    setNote('');
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
        <Text style={styles.headerTitle}>Support Our Community</Text>
        <View style={{ width: scale(24) }} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshingBalance}
            onRefresh={fetchBalance}
            colors={[appColors.AppBlue]}
            tintColor={appColors.AppBlue}
          />
        }
      >
        {/* Hero Section */}
        <View style={styles.heroCard}>
          <Icon name="favorite" type="material" color={appColors.AppBlue} size={moderateScale(48)} />
          <Text style={styles.heroTitle}>Help Make Therapy Accessible</Text>
          <Text style={styles.heroMessage}>
            Your donation goes directly to Innerspark's Community Therapy Fund, helping members access affordable mental health support.
          </Text>
        </View>

        {/* Impact Stats - COMMENTED OUT: No API endpoint available for real data */}
        {/* See: DOCS/DONATION_SCREEN_API_ANALYSIS.md */}
        {/* <ImpactStatsCard stats={impactStats} />  */}

        {/* How It Works */}
        <View style={styles.howItWorksCard}>
          <Text style={styles.sectionTitle}>How Your Donation Helps</Text>
          <View style={styles.howItWorksItem}>
            <Icon name="check-circle" type="material" color="#4CAF50" size={moderateScale(24)} />
            <Text style={styles.howItWorksText}>
              100% of donations go to subsidizing therapy sessions
            </Text>
          </View>
          <View style={styles.howItWorksItem}>
            <Icon name="check-circle" type="material" color="#4CAF50" size={moderateScale(24)} />
            <Text style={styles.howItWorksText}>
              Members in need receive discounted or free sessions
            </Text>
          </View>
          <View style={styles.howItWorksItem}>
            <Icon name="check-circle" type="material" color="#4CAF50" size={moderateScale(24)} />
            <Text style={styles.howItWorksText}>
              Transparent fund management and regular impact reports
            </Text>
          </View>
          <View style={styles.howItWorksItem}>
            <Icon name="check-circle" type="material" color="#4CAF50" size={moderateScale(24)} />
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

        {/* Payment Method Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          <Text style={styles.sectionSubtitle}>
            Your donation will be deducted from your chosen payment method
          </Text>

          <WalletSelectionCard 
            balance={walletBalance}
            isSelected={paymentMethod === 'wallet'}
            onPress={() => setPaymentMethod('wallet')}
          />
          
          {/* Mobile Money Section - Commented out for now as requested */}
          {/* 
          <View style={[styles.section, { padding: 0, marginTop: 10, opacity: 0.6 }]}>
            <Text style={[styles.sectionTitle, { fontSize: moderateScale(16) }]}>Mobile Money</Text>
            <LHPhoneInput
              inputValue={phone}
              inputValueSetter={setPhone}
              formattedValueSetter={setFormattedPhone}
              countrySupportSetter={setIsCountrySupported}
            />
          </View>
          */}
        </View>

        {/* Note Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add a Note (Optional)</Text>
          <View style={styles.amountInputContainer}>
            <Icon name="edit" type="material" color={appColors.grey3} size={moderateScale(20)} style={{ marginRight: 10 }} />
            <TextInput
              style={styles.amountInput}
              placeholder="Keep up the good work!"
              value={note}
              onChangeText={onChangeNoteHandler}
              maxLength={100}
            />
          </View>
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
              <Text style={styles.summaryValue}>{paymentMethod === 'wallet' ? 'Wellness Vault' : 'Mobile Money'}</Text>
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
          title="Donate to Fund"
          buttonStyle={[
            styles.donateButton,
            (!donationAmount || isNaN(parseInt(donationAmount, 10)) || parseInt(donationAmount, 10) <= 0) && styles.disabledButton
          ]}
          titleStyle={styles.donateButtonText}
          disabledTitleStyle={{ color: appColors.grey3 }}
          onPress={handleDonationSubmit}
          disabled={!donationAmount || isNaN(parseInt(donationAmount, 10)) || parseInt(donationAmount, 10) <= 0}
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
            <Text style={styles.modalMessage}>
              You are about to donate UGX {parseInt(donationAmount).toLocaleString()} to Innerspark's Community Therapy Fund.
            </Text>
            <Text style={styles.modalSubMessage}>
              The amount will be deducted from your Wellness Vault.
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
            <Text style={styles.modalTitle}>Thank You!</Text>
            <Text style={styles.modalMessage}>
              Your generous donation of UGX {parseInt(donationAmount || '0').toLocaleString()} has been received.
            </Text>
            <View style={styles.receiptContainer}>
                <Text style={styles.receiptLabel}>Transaction Reference:</Text>
                <Text style={styles.receiptValue}>{donationResponse?.reference || 'N/A'}</Text>
            </View>
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

      <ISAlert ref={alert.ref} />
      <LHLoaderModal visible={isLoading} message="Processing Donation..." />
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
    paddingHorizontal: scale(15),
    paddingTop: scale(20),
  },
  heroCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(15),
    padding: scale(25),
    marginBottom: scale(20),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: appColors.grey1,
    marginTop: scale(15),
    marginBottom: scale(10),
    textAlign: 'center',
    fontFamily: appFonts.headerTextBold,
  },
  heroMessage: {
    fontSize: moderateScale(15),
    color: appColors.grey2,
    textAlign: 'center',
    lineHeight: moderateScale(22),
    fontFamily: appFonts.headerTextRegular,
  },
  impactSection: {
    marginBottom: scale(20),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: scale(15),
    fontFamily: appFonts.headerTextBold,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(12),
    padding: scale(15),
    width: '48%',
    marginBottom: scale(12),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
    alignItems: 'center',
  },
  statNumber: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: appColors.AppBlue,
    marginBottom: scale(5),
    fontFamily: appFonts.headerTextBold,
  },
  statLabel: {
    fontSize: moderateScale(12),
    color: appColors.grey2,
    textAlign: 'center',
    fontFamily: appFonts.headerTextRegular,
  },
  howItWorksCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(15),
    padding: scale(20),
    marginBottom: scale(20),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
  },
  howItWorksItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: scale(12),
  },
  howItWorksText: {
    flex: 1,
    fontSize: moderateScale(14),
    color: appColors.grey2,
    marginLeft: scale(12),
    lineHeight: moderateScale(20),
    fontFamily: appFonts.headerTextRegular,
  },
  section: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(15),
    padding: scale(20),
    marginBottom: scale(20),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
  },
  sectionSubtitle: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    marginBottom: scale(15),
    fontFamily: appFonts.headerTextRegular,
  },
  predefinedAmountsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: scale(20),
  },
  amountChip: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: scale(15),
    paddingVertical: scale(12),
    paddingHorizontal: scale(15),
    marginBottom: scale(10),
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
    fontSize: moderateScale(16),
    color: appColors.grey1,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
    marginBottom: scale(4),
  },
  selectedAmountChipText: {
    color: appColors.AppBlue,
  },
  impactText: {
    fontSize: moderateScale(11),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  selectedImpactText: {
    color: appColors.AppBlue,
    fontWeight: '600',
  },
  customAmountContainer: {
    marginTop: scale(10),
  },
  customAmountLabel: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    marginBottom: scale(10),
    fontFamily: appFonts.headerTextRegular,
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
    fontFamily: appFonts.headerTextRegular,
  },
  amountInput: {
    flex: 1,
    fontSize: moderateScale(16),
    color: appColors.grey1,
    paddingVertical: scale(15),
    fontFamily: appFonts.headerTextRegular,
  },
  summaryCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(15),
    padding: scale(20),
    marginBottom: scale(20),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
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
    fontFamily: appFonts.headerTextRegular,
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
    shadowOffset: { width: 0, height: scale(-2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
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
    backgroundColor: appColors.grey4,
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
    lineHeight: moderateScale(22),
    marginBottom: scale(10),
    fontFamily: appFonts.headerTextRegular,
  },
  modalSubMessage: {
    fontSize: moderateScale(14),
    color: appColors.grey3,
    textAlign: 'center',
    lineHeight: moderateScale(20),
    marginBottom: scale(25),
    fontFamily: appFonts.headerTextRegular,
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
    fontFamily: appFonts.headerTextRegular,
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
  successButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: scale(20),
    paddingVertical: scale(12),
    paddingHorizontal: scale(40),
    minWidth: scale(120),
  },
  receiptContainer: {
    backgroundColor: appColors.AppLightGray,
    padding: scale(10),
    borderRadius: scale(8),
    width: '100%',
    alignItems: 'center',
    marginBottom: scale(15),
  },
  receiptLabel: {
    fontSize: moderateScale(11),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    textTransform: 'uppercase',
  },
  receiptValue: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginTop: scale(2),
  },
});

export default DonationFundScreen;
