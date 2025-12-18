/**
 * Wellness Vault Screen - Points, rewards, and wellness credits management
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import LHGenericFeatureModal from '../../components/LHGenericFeatureModal';
import {
  selectBalance,
  selectCurrency,
  selectBreakdown,
  selectTransactions,
  selectWalletLoading,
} from '../../features/wallet/walletSlice';
import { loadWalletBalance, loadWalletTransactions } from '../../utils/walletManager';

const SCREEN_WIDTH = Dimensions.get('window').width;

const WellnessVaultScreen = ({ navigation }) => {
  const toast = useToast();
  const userDetails = useSelector(state => state.userData.userDetails);
  const [showTopupModal, setShowTopupModal] = useState(false);
  
  // Get wallet data from Redux
  const balance = useSelector(selectBalance);
  const currency = useSelector(selectCurrency);
  const breakdown = useSelector(selectBreakdown);
  const transactions = useSelector(selectTransactions);
  const isLoading = useSelector(selectWalletLoading);

  // Load wallet data on mount
  useEffect(() => {
    // TODO: Get userId from auth context/Redux
    const userId = userDetails?.userId || 'current_user_id';
    loadWalletBalance(userId);
    loadWalletTransactions(userId, 1, 5); // Load recent 5 transactions
  }, [userDetails?.userId]);

  // Conversion rate: 100 points = 1000 UGX (10 UGX per point)
  const POINTS_TO_UGX_RATE = 10;

  // Build funding channels from Redux breakdown
  const fundingChannels = [
    {
      id: 1,
      name: 'MoMo Funds',
      amount: breakdown?.momoTopup || 0,
      currency: 'UGX',
      icon: 'account-balance-wallet',
      color: '#FF9800',
    },
    {
      id: 2,
      name: 'Reward Points',
      amount: (breakdown?.rewardPoints || 0) / POINTS_TO_UGX_RATE,
      currency: 'Points',
      icon: 'stars',
      color: '#4CAF50',
      cashEquivalent: breakdown?.rewardPoints || 0,
    },
    {
      id: 3,
      name: 'Wellness Credits',
      amount: breakdown?.wellnessCredits || 0,
      currency: 'UGX',
      icon: 'volunteer-activism',
      color: '#2196F3',
      description: 'Platform donation funds',
    },
  ];

  const vaultData = {
    balance: balance,
    currency: currency
  };

  // Get recent activities from transactions (limit to 5)
  const recentActivities = transactions.slice(0, 5).map(txn => ({
    id: txn.id,
    description: txn.description,
    amount: `${txn.amount >= 0 ? '+' : ''}${txn.amount.toLocaleString()} ${txn.currency}`,
    time: txn.date,
    type: txn.type,
    icon: txn.icon || (txn.type === 'credit' ? 'add-circle' : 'remove-circle'),
  }));

  const handleTopUp = () => {
    // Show coming soon modal instead of navigating
    setShowTopupModal(true);
    // navigation.navigate('MoMoTopupScreen');
  };

  const handleViewAll = () => {
    navigation.navigate('TransactionHistoryScreen');
  };

  const formatCurrency = (amount, currency) => {
    if (currency === 'Points') {
      return amount.toLocaleString();
    }
    return amount.toLocaleString();
  };

  const FundingChannelCard = ({ channel }) => (
    <View style={styles.fundingCard}>
      <View style={[styles.fundingIconContainer, { backgroundColor: channel.color + '20' }]}>
        <Icon
          name={channel.icon}
          type="material"
          color={channel.color}
          size={24}
        />
      </View>
      <Text style={styles.fundingName}>{channel.name}</Text>
      <Text style={styles.fundingAmount}>
        {formatCurrency(channel.amount, channel.currency)}
      </Text>
      <Text style={styles.fundingCurrency}>{channel.currency}</Text>
      {channel.cashEquivalent && (
        <Text style={styles.fundingEquivalent}>
          ≈ {formatCurrency(channel.cashEquivalent, 'UGX')} UGX
        </Text>
      )}
    </View>
  );

  const ActivityItem = ({ activity }) => (
    <View style={styles.activityItem}>
      <Icon
        name={activity.icon}
        type="material"
        color={activity.type === 'credit' ? '#4CAF50' : '#F44336'}
        size={20}
      />
      <View style={styles.activityContent}>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        <Text style={styles.activityTime}>{activity.time}</Text>
      </View>
      <Text style={[
        styles.activityAmount,
        activity.type === 'credit' ? styles.creditAmount : styles.debitAmount
      ]}>
        {activity.amount}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={appColors.AppBlue} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Wellness Vault</Text>
          <Text style={styles.headerSubtitle}>Your wellness funding hub</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <View style={styles.balanceSection}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Balance</Text>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceAmount}>
                {vaultData.currency} {formatCurrency(vaultData.balance, vaultData.currency)}
              </Text>
              <TouchableOpacity 
                style={styles.plusButton}
                onPress={handleTopUp}
                activeOpacity={0.7}
              >
                <Icon name="add" type="material" color={appColors.CardBackground} size={28} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Vault Funding Channels - HIDDEN FOR MVP */}
        {/* Reason: Reward points system still being studied, not giving points in MVP */}
        {/* Wellness credits not yet automated */}
        {/* TODO: Uncomment when reward points and wellness credits are ready */}
        {/* <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Vault Funding Channels</Text>
            <TouchableOpacity style={styles.topUpButton} onPress={handleTopUp}>
              <Text style={styles.topUpText}>Top Up</Text>
              <Icon name="add" type="material" color={appColors.CardBackground} size={16} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.fundingGrid}>
            {fundingChannels.map((channel) => (
              <FundingChannelCard key={channel.id} channel={channel} />
            ))}
          </View>
        </View> */}

        {/* Recent Activities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
            {recentActivities.length > 0 && (
              <TouchableOpacity onPress={handleViewAll}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {recentActivities.length > 0 ? (
            <View style={styles.activitiesContainer}>
              {recentActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </View>
          ) : (
            <View style={styles.emptyActivities}>
              <Icon name="receipt-long" type="material" color={appColors.grey4} size={60} />
              <Text style={styles.emptyActivitiesTitle}>No Transactions Yet</Text>
              <Text style={styles.emptyActivitiesText}>
                Your recent wallet activities will appear here once you make transactions.
              </Text>
              <TouchableOpacity 
                style={styles.emptyActivitiesButton}
                onPress={handleTopUp}
              >
                <Text style={styles.emptyActivitiesButtonText}>Top Up Wallet</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Wallet Topup Coming Soon Modal */}
      <LHGenericFeatureModal
        title="Wallet Top-Up"
        description="Wellness Vault top-up is currently unavailable. We're working on integrating mobile money payments. You'll be notified once this feature is ready!"
        buttonTitle="GOT IT"
        isModVisible={showTopupModal}
        visibilitySetter={setShowTopupModal}
        isDismissable={true}
        hasIcon={true}
        iconType="material"
        iconName="account-balance-wallet"
      />
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
  headerContent: {
    alignItems: 'center',
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
  balanceSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  balanceCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  balanceLabel: {
    fontSize: 14,
    color: appColors.grey2,
    marginBottom: 8,
    fontFamily: appFonts.appTextRegular,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.appTextBold,
  },
  plusButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: appFonts.appTextBold,
  },
  topUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  topUpText: {
    color: appColors.CardBackground,
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
    fontFamily: appFonts.appTextMedium,
  },
  viewAllText: {
    color: appColors.AppBlue,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: appFonts.appTextMedium,
  },
  fundingGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fundingCard: {
    width: '32%',
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: appColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  fundingIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  fundingName: {
    fontSize: 12,
    color: appColors.grey1,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
    fontFamily: appFonts.appTextMedium,
  },
  fundingAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    textAlign: 'center',
    fontFamily: appFonts.appTextBold,
  },
  fundingCurrency: {
    fontSize: 10,
    color: appColors.grey2,
    textAlign: 'center',
    fontFamily: appFonts.appTextRegular,
  },
  fundingEquivalent: {
    fontSize: 9,
    color: appColors.grey3,
    textAlign: 'center',
    fontFamily: appFonts.appTextRegular,
    marginTop: 2,
    fontStyle: 'italic',
  },
  activitiesContainer: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: appColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: appColors.grey6,
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityDescription: {
    fontSize: 13,
    color: appColors.grey1,
    fontFamily: appFonts.appTextMedium,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 11,
    color: appColors.grey3,
    fontFamily: appFonts.appTextRegular,
  },
  activityAmount: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: appFonts.appTextMedium,
  },
  creditAmount: {
    color: '#4CAF50',
  },
  debitAmount: {
    color: '#F44336',
  },
  emptyActivities: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyActivitiesTitle: {
    fontSize: 18,
    fontFamily: appFonts.headerTextBold,
    color: appColors.grey1,
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyActivitiesText: {
    fontSize: 14,
    fontFamily: appFonts.headerTextRegular,
    color: appColors.grey3,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyActivitiesButton: {
    backgroundColor: appColors.AppBlue,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyActivitiesButtonText: {
    fontSize: 16,
    fontFamily: appFonts.headerTextSemiBold,
    color: appColors.CardBackground,
  },
});

export default WellnessVaultScreen;
