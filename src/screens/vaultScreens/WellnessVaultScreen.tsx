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

  // Mock data - in real app this would come from API/Redux
  const vaultData = {
    balance: 350000,
    currency: 'UGX'
  };

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
      name: 'Rewards',
      amount: 1500,
      currency: 'Points',
      icon: 'stars',
      color: '#4CAF50',
    },
    {
      id: 3,
      name: 'Wellness Credits',
      amount: 20000,
      currency: 'UGX',
      icon: 'health-and-safety',
      color: '#2196F3',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      description: 'Wellness Vault credited with 50,000 UGX...',
      time: '10:00 AM',
      type: 'credit',
    },
    {
      id: 2,
      description: 'Wellness Vault credited with 30,000 UGX...',
      time: '10:00 AM',
      type: 'credit',
    },
    {
      id: 3,
      description: 'Wellness Vault credited with 30,000 UGX...',
      time: '10:00 AM',
      type: 'credit',
    },
    {
      id: 4,
      description: 'Wellness Vault credited with 50,000 UGX...',
      time: '10:00 AM',
      type: 'credit',
    },
    {
      id: 5,
      description: 'Wellness Vault credited with 50,000 UGX...',
      time: '10:00 AM',
      type: 'credit',
    },
  ];

  const handleTopUp = () => {
    navigation.navigate('MoMoTopupScreen'); // Navigate to MoMo Topup Screen

  };

  const handleViewAll = () => {
    toast.show({
      description: 'View all activities feature coming soon!',
      duration: 2000,
    });
  };

  const formatCurrency = (amount, currency) => {
    if (currency === 'Points') {
      return amount.toLocaleString();
    }
    return amount.toLocaleString();
  };

  const FundingChannelCard = ({ channel }) => (
    <View style={styles.fundingCard}>
      <Icon
        name={channel.icon}
        type="material"
        color={channel.color}
        size={24}
      />
      <Text style={styles.fundingName}>{channel.name}</Text>
      <Text style={styles.fundingAmount}>
        {formatCurrency(channel.amount, channel.currency)}
      </Text>
      <Text style={styles.fundingCurrency}>{channel.currency}</Text>
    </View>
  );

  const ActivityItem = ({ activity }) => (
    <View style={styles.activityItem}>
      <Icon
        name="trending-up"
        type="material"
        color={appColors.AppBlue}
        size={20}
      />
      <View style={styles.activityContent}>
        <Text style={styles.activityDescription}>{activity.description}</Text>
      </View>
      <Text style={styles.activityTime}>{activity.time}</Text>
    </View>
  );

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
          
          <TouchableOpacity style={styles.moodButton}>
            <Icon name="mood" type="material" color={appColors.CardBackground} size={28} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerBottomRow}>
          <Text style={styles.headerTitle}>WellnessVault</Text>
          <Text style={styles.headerSubtitle}>View your points, top-ups, and rewards</Text>
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
              <View style={styles.verifiedBadge}>
                <Icon name="check" type="material" color={appColors.CardBackground} size={16} />
              </View>
            </View>
          </View>
        </View>

        {/* Vault Funding Channels */}
        <View style={styles.section}>
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
        </View>

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
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  moodButton: {
    padding: 8,
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
  verifiedBadge: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: appColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    borderBottomColor: appColors.grey4,
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityDescription: {
    fontSize: 12,
    color: appColors.grey1,
    fontFamily: appFonts.appTextRegular,
  },
  activityTime: {
    fontSize: 10,
    color: appColors.grey3,
    fontFamily: appFonts.appTextRegular,
  },
});

export default WellnessVaultScreen;
