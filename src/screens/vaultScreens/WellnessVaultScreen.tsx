/**
 * Wellness Vault Screen - Points, rewards, and wellness credits management
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';

const SCREEN_WIDTH = Dimensions.get('window').width;

const WellnessVaultScreen = ({ navigation }) => {
  const toast = useToast();
  const userDetails = useSelector(state => state.userData.userDetails);

  // Conversion rate: 100 points = 1000 UGX (10 UGX per point)
  const POINTS_TO_UGX_RATE = 10;

  const fundingChannels = [
    {
      id: 1,
      name: 'MoMo Funds',
      amount: 50000,
      currency: 'UGX',
      icon: 'account-balance-wallet',
      color: '#FF9800',
    },
    {
      id: 2,
      name: 'Reward Points',
      amount: 1500,
      currency: 'Points',
      icon: 'stars',
      color: '#4CAF50',
      cashEquivalent: 15000, // 1500 points * 10 UGX
    },
    {
      id: 3,
      name: 'Wellness Credits',
      amount: 20000,
      currency: 'UGX',
      icon: 'volunteer-activism',
      color: '#2196F3',
      description: 'Platform donation funds',
    },
  ];

  // Calculate total balance: MoMo + Rewards (converted) + Wellness Credits
  const calculateTotalBalance = () => {
    const momoFunds = fundingChannels[0].amount;
    const rewardsInCash = fundingChannels[1].cashEquivalent;
    const wellnessCredits = fundingChannels[2].amount;
    return momoFunds + rewardsInCash + wellnessCredits;
  };

  const vaultData = {
    balance: calculateTotalBalance(),
    currency: 'UGX'
  };

  const recentActivities = [
    {
      id: 1,
      description: 'MoMo Top-up',
      amount: '+50,000 UGX',
      time: '2 hours ago',
      type: 'credit',
      icon: 'add-circle',
    },
    {
      id: 2,
      description: 'Therapy Session Payment',
      amount: '-30,000 UGX',
      time: 'Yesterday',
      type: 'debit',
      icon: 'remove-circle',
    },
    {
      id: 3,
      description: 'Wellness Credits Received',
      amount: '+20,000 UGX',
      time: '2 days ago',
      type: 'credit',
      icon: 'volunteer-activism',
    },
    {
      id: 4,
      description: 'Event Registration',
      amount: '-15,000 UGX',
      time: '3 days ago',
      type: 'debit',
      icon: 'remove-circle',
    },
    {
      id: 5,
      description: 'Reward Points Redeemed',
      amount: '+5,000 UGX',
      time: '5 days ago',
      type: 'credit',
      icon: 'stars',
    },
  ];

  const handleTopUp = () => {
    navigation.navigate('MoMoTopupScreen'); // Navigate to MoMo Topup Screen

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
            <TouchableOpacity onPress={handleViewAll}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.activitiesContainer}>
            {recentActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
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
});

export default WellnessVaultScreen;
