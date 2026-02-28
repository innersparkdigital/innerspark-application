/**
 * Mood Points Screen - Loyalty points earned from mood check-ins
 */
import React, { useState, useEffect } from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, Animated, RefreshControl, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button, Skeleton } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { scale, moderateScale, verticalScale } from '../../global/Scaling';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
import { useToast } from 'native-base';
import { NavigationProp } from '@react-navigation/native';
import ISAlert, { useISAlert } from '../../components/alerts/ISAlert';

interface PointsTransaction {
  id: string;
  type: 'earned' | 'redeemed';
  amount: number;
  source: 'mood_checkin' | 'streak_bonus' | 'therapy_discount' | 'service_discount';
  description: string;
  date: string;
  timestamp: string;
}

interface RedemptionOption {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  discountAmount: number;
  category: 'therapy' | 'services' | 'premium';
  icon: string;
  available: boolean;
}

interface MoodPointsScreenProps {
  navigation: NavigationProp<any>;
}

const MoodPointsScreen: React.FC<MoodPointsScreenProps> = ({ navigation }) => {
  const tabWidth = (SCREEN_WIDTH - scale(40)) / 2;
  const toast = useToast();
  const alert = useISAlert();
  const [pointsBalance, setPointsBalance] = useState(0);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [redemptionOptions, setRedemptionOptions] = useState<RedemptionOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'balance' | 'history' | 'redeem'>('balance');

  useEffect(() => {
    loadPointsData();
  }, []);

  const loadPointsData = async () => {
    setIsLoading(true);
    try {
      // Mock points balance
      setPointsBalance(8500);

      // Mock transaction history
      const mockTransactions: PointsTransaction[] = [
        {
          id: '1',
          type: 'earned',
          amount: 500,
          source: 'mood_checkin',
          description: 'Daily mood check-in',
          date: new Date().toDateString(),
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          type: 'earned',
          amount: 1000,
          source: 'streak_bonus',
          description: '7-day streak bonus',
          date: new Date(Date.now() - 86400000).toDateString(),
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '3',
          type: 'earned',
          amount: 500,
          source: 'mood_checkin',
          description: 'Daily mood check-in',
          date: new Date(Date.now() - 86400000).toDateString(),
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '4',
          type: 'redeemed',
          amount: -2000,
          source: 'therapy_discount',
          description: '10,000 UGX therapy session discount',
          date: new Date(Date.now() - 172800000).toDateString(),
          timestamp: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: '5',
          type: 'earned',
          amount: 500,
          source: 'mood_checkin',
          description: 'Daily mood check-in',
          date: new Date(Date.now() - 172800000).toDateString(),
          timestamp: new Date(Date.now() - 172800000).toISOString(),
        },
      ];

      // Mock redemption options
      const mockRedemptions: RedemptionOption[] = [
        {
          id: '1',
          title: '5,000 UGX Therapy Discount',
          description: 'Get 5,000 UGX off your next therapy session',
          pointsRequired: 1000,
          discountAmount: 5000,
          category: 'therapy',
          icon: 'psychology',
          available: true,
        },
        {
          id: '2',
          title: '10,000 UGX Therapy Discount',
          description: 'Get 10,000 UGX off your next therapy session',
          pointsRequired: 2000,
          discountAmount: 10000,
          category: 'therapy',
          icon: 'psychology',
          available: true,
        },
        {
          id: '3',
          title: 'Free Premium Service',
          description: 'Unlock one premium mental health service for free',
          pointsRequired: 3000,
          discountAmount: 25000,
          category: 'services',
          icon: 'star',
          available: true,
        },
        {
          id: '4',
          title: '20,000 UGX Therapy Discount',
          description: 'Get 20,000 UGX off your next therapy session',
          pointsRequired: 4000,
          discountAmount: 20000,
          category: 'therapy',
          icon: 'psychology',
          available: true,
        },
        {
          id: '5',
          title: 'Premium Plan - 1 Month Free',
          description: 'Get 1 month of Premium subscription for free',
          pointsRequired: 6000,
          discountAmount: 120000,
          category: 'premium',
          icon: 'workspace_premium',
          available: true,
        },
        {
          id: '6',
          title: 'Family Plan - 1 Month Free',
          description: 'Get 1 month of Family subscription for free',
          pointsRequired: 10000,
          discountAmount: 200000,
          category: 'premium',
          icon: 'family_restroom',
          available: false,
        },
      ];

      setTransactions(mockTransactions);
      setRedemptionOptions(mockRedemptions);

    } catch (error) {
      toast.show({
        description: 'Failed to load points data',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadPointsData();
    setIsRefreshing(false);
  };

  const handleRedeem = (option: RedemptionOption) => {
    if (pointsBalance < option.pointsRequired) {
      toast.show({
        description: `You need ${option.pointsRequired - pointsBalance} more points to redeem this offer`,
        duration: 3000,
      });
      return;
    }

    alert.show({
      type: 'confirm',
      title: 'Redeem Points',
      message: `Redeem ${option.pointsRequired} points for "${option.title}"?\n\nThis will give you ${option.discountAmount.toLocaleString()} UGX discount on your next purchase.`,
      confirmText: 'Redeem',
      cancelText: 'Cancel',
      onConfirm: () => processRedemption(option),
    });
  };

  const processRedemption = async (option: RedemptionOption) => {
    try {
      // Simulate API call
      await new Promise<void>(resolve => setTimeout(resolve, 1000));

      // Update balance
      setPointsBalance(prev => prev - option.pointsRequired);

      // Add transaction
      const newTransaction: PointsTransaction = {
        id: Date.now().toString(),
        type: 'redeemed',
        amount: -option.pointsRequired,
        source: option.category === 'therapy' ? 'therapy_discount' : 'service_discount',
        description: option.title,
        date: new Date().toDateString(),
        timestamp: new Date().toISOString(),
      };

      setTransactions(prev => [newTransaction, ...prev]);

      toast.show({
        description: `Successfully redeemed! Your discount will be applied at checkout.`,
        duration: 4000,
      });

    } catch (error) {
      toast.show({
        description: 'Redemption failed. Please try again.',
        duration: 3000,
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const BalanceCard: React.FC = () => (
    <View style={styles.balanceCard}>
      <View style={styles.balanceHeader}>
        <Icon name="stars" type="material" color="#FFD700" size={moderateScale(32)} />
        <Text style={styles.balanceTitle}>Loyalty Points</Text>
      </View>
      <Text style={styles.balanceAmount}>{pointsBalance.toLocaleString()}</Text>
      <Text style={styles.balanceSubtitle}>
        Earned from daily mood check-ins • 500 points per check-in
      </Text>

      <View style={styles.balanceActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('TodayMoodScreen')}
        >
          <Icon name="mood" type="material" color={appColors.AppBlue} size={moderateScale(20)} />
          <Text style={styles.actionButtonText}>Daily Check-in</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setSelectedTab('redeem')}
        >
          <Icon name="redeem" type="material" color={appColors.AppBlue} size={moderateScale(20)} />
          <Text style={styles.actionButtonText}>Redeem Points</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const TransactionItem: React.FC<{ item: PointsTransaction }> = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        <Icon
          name={item.type === 'earned' ? 'add' : 'remove'}
          type="material"
          color={item.type === 'earned' ? '#4CAF50' : '#F44336'}
          size={moderateScale(20)}
        />
      </View>

      <View style={styles.transactionInfo}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionDate}>
          {formatDate(item.date)} at {formatTime(item.timestamp)}
        </Text>
      </View>

      <Text style={[
        styles.transactionAmount,
        { color: item.type === 'earned' ? '#4CAF50' : '#F44336' }
      ]}>
        {item.type === 'earned' ? '+' : ''}{item.amount}
      </Text>
    </View>
  );

  const RedemptionItem: React.FC<{ item: RedemptionOption }> = ({ item }) => (
    <View style={[styles.redemptionItem, !item.available && styles.unavailableItem]}>
      <View style={styles.redemptionIcon}>
        <Icon
          name={item.icon}
          type="material"
          color={item.available ? appColors.AppBlue : appColors.grey3}
          size={moderateScale(24)}
        />
      </View>

      <View style={styles.redemptionInfo}>
        <Text style={[styles.redemptionTitle, !item.available && styles.unavailableText]}>
          {item.title}
        </Text>
        <Text style={[styles.redemptionDescription, !item.available && styles.unavailableText]}>
          {item.description}
        </Text>
        <View style={styles.redemptionMeta}>
          <Text style={styles.redemptionPoints}>{item.pointsRequired} points</Text>
          <Text style={styles.redemptionValue}>
            Worth {item.discountAmount.toLocaleString()} UGX
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.redeemButton,
          (!item.available || pointsBalance < item.pointsRequired) && styles.disabledRedeemButton
        ]}
        onPress={() => handleRedeem(item)}
        disabled={!item.available || pointsBalance < item.pointsRequired}
      >
        <Text style={[
          styles.redeemButtonText,
          (!item.available || pointsBalance < item.pointsRequired) && styles.disabledRedeemButtonText
        ]}>
          {!item.available ? 'Coming Soon' : pointsBalance < item.pointsRequired ? 'Need More' : 'Redeem'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const TabBar: React.FC = () => (
    <View style={styles.tabBar}>
      {[
        { key: 'balance', label: 'Balance', icon: 'account-balance-wallet' },
        { key: 'history', label: 'History', icon: 'history' },
        { key: 'redeem', label: 'Redeem', icon: 'redeem' },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, selectedTab === tab.key && styles.activeTab]}
          onPress={() => setSelectedTab(tab.key as any)}
        >
          <Icon
            name={tab.icon}
            type="material"
            color={selectedTab === tab.key ? appColors.AppBlue : appColors.grey3}
            size={moderateScale(20)}
          />
          <Text style={[
            styles.tabText,
            selectedTab === tab.key && styles.activeTabText
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Skeleton animation="pulse" width="100%" height={200} style={{ marginBottom: 20 }} />
          {Array(5).fill(0).map((_, index) => (
            <View key={index} style={styles.transactionItem}>
              <Skeleton animation="pulse" width={40} height={40} />
              <View style={styles.transactionInfo}>
                <Skeleton animation="pulse" width="80%" height={16} />
                <Skeleton animation="pulse" width="60%" height={12} style={{ marginTop: 4 }} />
              </View>
              <Skeleton animation="pulse" width={60} height={20} />
            </View>
          ))}
        </View>
      );
    }

    switch (selectedTab) {
      case 'balance':
        return (
          <View>
            <BalanceCard />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How to Earn Points</Text>
              <View style={styles.earnMethodItem}>
                <Icon name="mood" type="material" color={appColors.AppBlue} size={moderateScale(24)} />
                <View style={styles.earnMethodInfo}>
                  <Text style={styles.earnMethodTitle}>Daily Mood Check-in</Text>
                  <Text style={styles.earnMethodDescription}>Complete your daily mood tracking</Text>
                </View>
                <Text style={styles.earnMethodPoints}>+500 points</Text>
              </View>
              <View style={styles.earnMethodItem}>
                <Icon name="local-fire-department" type="material" color="#FF5722" size={moderateScale(24)} />
                <View style={styles.earnMethodInfo}>
                  <Text style={styles.earnMethodTitle}>Weekly Streak Bonus</Text>
                  <Text style={styles.earnMethodDescription}>Complete 7 consecutive days</Text>
                </View>
                <Text style={styles.earnMethodPoints}>+1000 points</Text>
              </View>
            </View>
          </View>
        );

      case 'history':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Transaction History</Text>
            <FlatList
              data={transactions}
              keyExtractor={(item: any) => item.id}
              renderItem={({ item }: { item: any }) => (
                <TransactionItem item={item} />)}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );

      case 'redeem':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Redeem Your Points</Text>
            <Text style={styles.sectionSubtitle}>
              Use your loyalty points to get discounts on therapy sessions and premium services
            </Text>
            <FlatList
              data={redemptionOptions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <RedemptionItem item={item} />}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={moderateScale(24)} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Loyalty Points</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
        >
          <Icon name="refresh" type="material" color={appColors.CardBackground} size={moderateScale(24)} />
        </TouchableOpacity>
      </View>

      {/* Tab Bar */}
      <TabBar />

      {/* Content */}
      <FlatList
        data={[1]} // Dummy data to use FlatList for refresh control
        keyExtractor={() => 'content'}
        renderItem={() => renderContent()}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[appColors.AppBlue]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
      <ISAlert ref={alert.ref} />
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
    paddingTop: scale(parameters.headerHeightS),
    paddingBottom: scale(20),
    paddingHorizontal: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: scale(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.2,
    shadowRadius: scale(4),
  },
  backButton: {
    padding: scale(5),
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  refreshButton: {
    padding: scale(8),
  },
  infoButton: {
    padding: scale(5),
  },
  loadingContainer: {
    padding: scale(20),
  },
  scrollView: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: appColors.grey6,
    marginHorizontal: scale(20),
    padding: scale(4),
    borderRadius: scale(12),
    marginBottom: scale(20),
    position: 'relative',
  },
  tab: {
    flex: 1,
    paddingVertical: scale(10),
    alignItems: 'center',
    zIndex: 1,
  },
  activeTab: {
    backgroundColor: appColors.AppBlue + '15',
  },
  activeTabIndicator: {
    position: 'absolute',
    height: '100%',
    top: scale(4),
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(10),
    elevation: scale(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
  },
  tabText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: appColors.grey3,
    fontFamily: appFonts.headerTextSemiBold,
  },
  activeTabText: {
    color: appColors.AppBlue,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  balanceCard: {
    backgroundColor: appColors.CardBackground,
    margin: scale(20),
    padding: scale(20),
    borderRadius: scale(16),
    alignItems: 'center',
    elevation: scale(3),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(3),
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(16),
  },
  balanceTitle: {
    fontSize: moderateScale(14),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginTop: scale(12),
  },
  balanceAmount: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: scale(4),
  },
  balanceValue: {
    fontSize: moderateScale(40),
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  pointsLabel: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.AppBlue,
    marginLeft: scale(4),
    fontFamily: appFonts.headerTextBold,
  },
  balanceSubtitle: {
    fontSize: moderateScale(14),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginBottom: scale(20),
  },
  balanceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.AppLightGray,
    borderRadius: scale(20),
    paddingHorizontal: scale(16),
    paddingVertical: scale(10),
    flex: 1,
    marginHorizontal: scale(4),
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: moderateScale(12),
    color: appColors.AppBlue,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
    marginLeft: scale(6),
  },
  section: {
    backgroundColor: appColors.CardBackground,
    margin: scale(20),
    marginTop: 0,
    borderRadius: scale(16),
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
    fontFamily: appFonts.headerTextBold,
    padding: scale(20),
    paddingBottom: scale(12),
  },
  sectionSubtitle: {
    fontSize: moderateScale(14),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    paddingHorizontal: scale(20),
    paddingBottom: scale(16),
  },
  earnMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: scale(16),
    borderBottomWidth: scale(1),
    borderBottomColor: appColors.grey6,
  },
  earnMethodInfo: {
    flex: 1,
    marginLeft: scale(16),
  },
  earnMethodTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  earnMethodDescription: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginTop: scale(2),
  },
  earnMethodPoints: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: '#4CAF50',
    fontFamily: appFonts.headerTextBold,
  },
  listContainer: {
    paddingHorizontal: scale(20),
    paddingBottom: scale(20),
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.CardBackground,
    padding: scale(16),
    borderRadius: scale(12),
    marginBottom: scale(12),
    elevation: scale(1),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.05,
    shadowRadius: scale(2),
  },
  transactionIcon: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: appColors.AppLightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  transactionInfo: {
    flex: 1,
    marginLeft: scale(16),
  },
  transactionType: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  transactionDescription: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  transactionDate: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginTop: scale(2),
  },
  transactionPoints: {
    alignItems: 'flex-end',
  },
  pointsValue: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  transactionAmount: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  redemptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: scale(16),
    borderBottomWidth: scale(1),
    borderBottomColor: appColors.grey6,
  },
  unavailableItem: {
    opacity: 0.6,
  },
  redemptionIcon: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: appColors.AppLightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  redemptionInfo: {
    flex: 1,
    marginLeft: scale(16),
  },
  redemptionTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  redemptionDescription: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginTop: scale(2),
    marginBottom: scale(8),
  },
  redemptionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  redemptionPoints: {
    fontSize: moderateScale(12),
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  redemptionValue: {
    fontSize: moderateScale(12),
    color: '#4CAF50',
    fontFamily: appFonts.headerTextBold,
  },
  unavailableText: {
    color: appColors.grey3,
  },
  redeemButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: scale(16),
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    marginLeft: scale(12),
  },
  disabledRedeemButton: {
    backgroundColor: appColors.grey5,
  },
  redeemButtonText: {
    fontSize: 12,
    color: appColors.CardBackground,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  disabledRedeemButtonText: {
    color: appColors.grey3,
  },
});

export default MoodPointsScreen;
