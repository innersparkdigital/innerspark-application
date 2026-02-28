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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { appImages } from '../../global/Data';
import { scale, moderateScale } from '../../global/Scaling';
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
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

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
    // setShowTopupModal(true);
    // proceed to MoMoTopupScreen for now
    navigation.navigate('MoMoTopupScreen'); // 
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
      {/* <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Wellness Vault</Text>
          <Text style={styles.headerSubtitle}>Your wellness funding hub</Text>
        </View>
      </View> */}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Branded Balance Card */}
        <View style={styles.balanceSection}>
          <View style={styles.brandedCard}>
            {/* Top Row: Label and Logo */}
            <View style={styles.cardTopRow}>
              <Text style={styles.cardVaultTitle}>Wellness Vault</Text>
              <Image source={appImages.appIconWhite} style={styles.cardLogo} resizeMode="contain" />
            </View>

            {/* Middle Row: Balance */}
            <View style={styles.cardMiddleRow}>
              <View style={styles.balanceInfoBox}>
                <Text style={styles.cardLabel}>Available Balance</Text>
                <View style={styles.balanceDisplayRow}>
                  <Text style={styles.cardCurrency}>{vaultData.currency}</Text>
                  <Text style={styles.cardAmount}>
                    {isBalanceHidden ? '••••' : formatCurrency(vaultData.balance, vaultData.currency)}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.hideBalanceButton}
                onPress={() => setIsBalanceHidden(!isBalanceHidden)}
                activeOpacity={0.7}
              >
                <Icon
                  name={isBalanceHidden ? "visibility-off" : "visibility"}
                  type="material"
                  color={appColors.CardBackground}
                  size={scale(18)}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.quickActionsSection}>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionItem} onPress={handleTopUp} activeOpacity={0.7}>
              <View style={[styles.quickActionIconC, { backgroundColor: '#E3F2FD' }]}>
                <Icon name="add" type="material" color={appColors.AppBlue} size={scale(24)} />
              </View>
              <Text style={styles.quickActionText}>Top Up</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionItem} onPress={() => navigation.navigate('TherapistsScreen')} activeOpacity={0.7}>
              <View style={[styles.quickActionIconC, { backgroundColor: '#E8F5E9' }]}>
                <Icon name="event-available" type="material" color="#4CAF50" size={scale(24)} />
              </View>
              <Text style={styles.quickActionText}>Book Session</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionItem} onPress={handleViewAll} activeOpacity={0.7}>
              <View style={[styles.quickActionIconC, { backgroundColor: '#FFF3E0' }]}>
                <Icon name="history" type="material" color="#FF9800" size={scale(24)} />
              </View>
              <Text style={styles.quickActionText}>History</Text>
            </TouchableOpacity>
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
    paddingBottom: scale(25),
    paddingHorizontal: scale(15),
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
    textAlign: 'center',
    marginBottom: scale(8),
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
  balanceSection: {
    paddingHorizontal: scale(15),
    marginTop: scale(25), // Normal margin, not overlapping the header
    marginBottom: scale(25),
  },
  brandedCard: {
    backgroundColor: appColors.AppBlue,
    borderRadius: scale(20), // More rounded corners like a real card
    padding: scale(24), // More inner padding
    elevation: 8,
    shadowColor: appColors.AppBlue,
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.3,
    shadowRadius: scale(8),
    minHeight: scale(180), // Increased minimum height significantly
    justifyContent: 'space-between', // Spread content to fill the new height
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: scale(15),
  },
  cardVaultTitle: {
    fontSize: moderateScale(20),
    color: 'rgba(255, 255, 255, 1)', // Fully opaque, prominent white
    fontFamily: appFonts.headerTextBold, // Explicitly strong font weight
    fontWeight: '900', // Heaviest weight possible
    letterSpacing: 0.5,
  },
  cardLabel: {
    fontSize: moderateScale(13),
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: scale(4),
  },
  cardLogo: {
    width: scale(36), // A slightly squarer proportion fitting an app icon, not a long wordmark
    height: scale(36),
    tintColor: appColors.CardBackground,
  },
  cardMiddleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 'auto', // Pushes this block to the bottom of the card
  },
  balanceInfoBox: {
    flex: 1,
  },
  balanceDisplayRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  cardCurrency: {
    fontSize: moderateScale(16),
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
    marginRight: scale(6),
  },
  cardAmount: {
    fontSize: moderateScale(42), // Massive bold text for the main balance
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
    letterSpacing: 1,
    lineHeight: moderateScale(48), // Keeps the towering text from clipping
  },
  hideBalanceButton: {
    padding: scale(6),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: scale(24),
    marginBottom: scale(4), // Aligns it nicely with the massive text baseline
  },
  quickActionsSection: {
    paddingHorizontal: scale(15),
    marginBottom: scale(25),
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scale(15),
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(16),
    padding: scale(15),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
  },
  quickActionItem: {
    alignItems: 'center',
    width: '30%',
  },
  quickActionIconC: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(8),
  },
  quickActionText: {
    fontSize: moderateScale(12),
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: scale(15),
    marginBottom: scale(25),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(15),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#333',
    fontFamily: appFonts.headerTextBold,
  },
  topUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(15),
  },
  topUpText: {
    color: appColors.CardBackground,
    fontSize: moderateScale(12),
    fontWeight: '600',
    marginRight: scale(4),
    fontFamily: appFonts.bodyTextMedium,
  },
  viewAllText: {
    color: appColors.AppBlue,
    fontSize: moderateScale(14),
    fontWeight: '600',
    fontFamily: appFonts.bodyTextMedium,
  },
  fundingGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fundingCard: {
    width: '32%',
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(12),
    paddingVertical: scale(15),
    paddingHorizontal: scale(8),
    alignItems: 'center',
    elevation: 2,
    shadowColor: appColors.black,
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
  },
  fundingIconContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(8),
  },
  fundingName: {
    fontSize: moderateScale(12),
    color: appColors.grey1,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: scale(8),
    marginBottom: scale(4),
    fontFamily: appFonts.bodyTextMedium,
  },
  fundingAmount: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.AppBlue,
    textAlign: 'center',
    fontFamily: appFonts.headerTextBold,
  },
  fundingCurrency: {
    fontSize: moderateScale(10),
    color: appColors.grey2,
    textAlign: 'center',
    fontFamily: appFonts.bodyTextRegular,
  },
  fundingEquivalent: {
    fontSize: moderateScale(9),
    color: appColors.grey3,
    textAlign: 'center',
    fontFamily: appFonts.bodyTextRegular,
    marginTop: scale(2),
    fontStyle: 'italic',
  },
  activitiesContainer: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(10),
    padding: scale(15),
    elevation: 2,
    shadowColor: appColors.black,
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(12),
    borderBottomWidth: 0.5,
    borderBottomColor: appColors.grey6,
  },
  activityContent: {
    flex: 1,
    marginLeft: scale(12),
  },
  activityDescription: {
    fontSize: moderateScale(13),
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
    marginBottom: scale(2),
  },
  activityTime: {
    fontSize: moderateScale(11),
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  activityAmount: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    fontFamily: appFonts.bodyTextMedium,
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
    paddingVertical: scale(20),
    paddingHorizontal: scale(15),
  },
  emptyActivitiesTitle: {
    fontSize: moderateScale(18),
    fontFamily: appFonts.headerTextBold,
    color: appColors.grey1,
    marginTop: scale(12),
    marginBottom: scale(8),
    textAlign: 'center',
  },
  emptyActivitiesText: {
    fontSize: moderateScale(14),
    fontFamily: appFonts.headerTextRegular,
    color: appColors.grey3,
    textAlign: 'center',
    lineHeight: scale(20),
    marginBottom: scale(16),
  },
  emptyActivitiesButton: {
    backgroundColor: appColors.AppBlue,
    paddingHorizontal: scale(32),
    paddingVertical: scale(12),
    borderRadius: scale(8),
  },
  emptyActivitiesButtonText: {
    fontSize: moderateScale(16),
    fontFamily: appFonts.headerTextSemiBold,
    color: appColors.CardBackground,
  },
});

export default WellnessVaultScreen;
