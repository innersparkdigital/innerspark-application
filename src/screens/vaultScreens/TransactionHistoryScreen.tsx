/**
 * Transaction History Screen - Full history of all wallet transactions
 */
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useSelector } from 'react-redux';
import { RefreshControl, FlatList, ActivityIndicator } from 'react-native';
import {
  selectTransactions,
  selectWalletLoading,
  selectWalletRefreshing,
} from '../../features/wallet/walletSlice';
import { loadWalletTransactions, refreshWalletTransactions } from '../../utils/walletManager';

const TransactionHistoryScreen = ({ navigation }) => {
  const [filter, setFilter] = useState('all'); // all, credit, debit
  
  // Get transactions from Redux
  const allTransactions = useSelector(selectTransactions);
  const isLoading = useSelector(selectWalletLoading);
  const isRefreshing = useSelector(selectWalletRefreshing);

  // Load transactions on mount
  useEffect(() => {
    // TODO: Get userId from auth context/Redux
    const userId = 'current_user_id';
    loadWalletTransactions(userId, 1, 50); // Load more transactions for history
  }, []);

  const handleRefresh = async () => {
    const userId = 'current_user_id';
    await refreshWalletTransactions(userId, 1, 50);
  };

  // Original mock data structure for reference (now from Redux)
  const mockTransactions = [
    {
      id: 1,
      description: 'MoMo Top-up',
      amount: '+50,000 UGX',
      time: '2 hours ago',
      date: 'Oct 25, 2025',
      type: 'credit',
      icon: 'add-circle',
      category: 'Top-up',
    },
    {
      id: 2,
      description: 'Therapy Session Payment',
      amount: '-30,000 UGX',
      time: 'Yesterday',
      date: 'Oct 24, 2025',
      type: 'debit',
      icon: 'remove-circle',
      category: 'Therapy',
    },
    {
      id: 3,
      description: 'Wellness Credits Received',
      amount: '+20,000 UGX',
      time: '2 days ago',
      date: 'Oct 23, 2025',
      type: 'credit',
      icon: 'volunteer-activism',
      category: 'Credits',
    },
    {
      id: 4,
      description: 'Event Registration',
      amount: '-15,000 UGX',
      time: '3 days ago',
      date: 'Oct 22, 2025',
      type: 'debit',
      icon: 'remove-circle',
      category: 'Events',
    },
    {
      id: 5,
      description: 'Reward Points Redeemed',
      amount: '+5,000 UGX',
      time: '5 days ago',
      date: 'Oct 20, 2025',
      type: 'credit',
      icon: 'stars',
      category: 'Rewards',
    },
    {
      id: 6,
      description: 'Support Group Subscription',
      amount: '-25,000 UGX',
      time: '1 week ago',
      date: 'Oct 18, 2025',
      type: 'debit',
      icon: 'remove-circle',
      category: 'Subscription',
    },
    {
      id: 7,
      description: 'MoMo Top-up',
      amount: '+100,000 UGX',
      time: '1 week ago',
      date: 'Oct 17, 2025',
      type: 'credit',
      icon: 'add-circle',
      category: 'Top-up',
    },
    {
      id: 8,
      description: 'Appointment Booking',
      amount: '-40,000 UGX',
      time: '2 weeks ago',
      date: 'Oct 11, 2025',
      type: 'debit',
      icon: 'remove-circle',
      category: 'Appointment',
    },
    {
      id: 9,
      description: 'Wellness Credits Received',
      amount: '+15,000 UGX',
      time: '2 weeks ago',
      date: 'Oct 10, 2025',
      type: 'credit',
      icon: 'volunteer-activism',
      category: 'Credits',
    },
    {
      id: 10,
      description: 'Reward Points Redeemed',
      amount: '+8,000 UGX',
      time: '3 weeks ago',
      date: 'Oct 4, 2025',
      type: 'credit',
      icon: 'stars',
      category: 'Rewards',
    },
  ]; // End mock reference

  // Calculate stats from actual transactions
  const calculateStats = () => {
    const totalCredits = allTransactions
      .filter(txn => txn.type === 'credit')
      .reduce((sum, txn) => sum + (txn.amount || 0), 0);
    
    const totalDebits = allTransactions
      .filter(txn => txn.type === 'debit')
      .reduce((sum, txn) => sum + Math.abs(txn.amount || 0), 0);
    
    return { totalCredits, totalDebits };
  };

  const { totalCredits, totalDebits } = calculateStats();

  const filteredTransactions = allTransactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const TransactionItem = ({ transaction }) => (
    <TouchableOpacity 
      style={styles.transactionItem} 
      activeOpacity={0.7}
      onPress={() => navigation.navigate('TransactionDetailScreen', { transaction })}
    >
      <View style={[
        styles.iconContainer,
        { backgroundColor: transaction.type === 'credit' ? '#4CAF50' + '15' : '#F44336' + '15' }
      ]}>
        <Icon
          name={transaction.icon}
          type="material"
          color={transaction.type === 'credit' ? '#4CAF50' : '#F44336'}
          size={24}
        />
      </View>
      
      <View style={styles.transactionContent}>
        <Text style={styles.transactionDescription}>{transaction.description}</Text>
        <Text style={styles.transactionDate}>{transaction.date}</Text>
      </View>
      
      <View style={styles.transactionRight}>
        <Text style={[
          styles.transactionAmount,
          transaction.type === 'credit' ? styles.creditAmount : styles.debitAmount
        ]}>
          {transaction.amount}
        </Text>
        <Text style={styles.transactionCategory}>{transaction.category}</Text>
      </View>
      
      <Icon name="chevron-right" type="material" color={appColors.grey4} size={20} />
    </TouchableOpacity>
  );

  const FilterButton = ({ label, value }) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === value && styles.filterButtonActive]}
      onPress={() => setFilter(value)}
    >
      <Text style={[styles.filterText, filter === value && styles.filterTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction History</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <FilterButton label="All" value="all" />
        <FilterButton label="Credits" value="credit" />
        <FilterButton label="Debits" value="debit" />
      </View>

      {/* Summary Card - Only show if there are transactions */}
      {allTransactions.length > 0 && (
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Credits</Text>
            <Text style={[styles.summaryAmount, styles.creditAmount]}>
              +{totalCredits.toLocaleString()} UGX
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Debits</Text>
            <Text style={[styles.summaryAmount, styles.debitAmount]}>
              -{totalDebits.toLocaleString()} UGX
            </Text>
          </View>
        </View>
      )}

      {/* Transactions List */}
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[appColors.AppBlue]}
          />
        }
      >
        {allTransactions.length > 0 ? (
          <View style={styles.transactionsContainer}>
            <Text style={styles.sectionTitle}>
              {filter === 'all' ? 'All Transactions' : filter === 'credit' ? 'Credits Only' : 'Debits Only'}
              <Text style={styles.countText}> ({filteredTransactions.length})</Text>
            </Text>
            
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <View style={styles.emptyFiltered}>
                <Icon name="filter-list-off" type="material" color={appColors.grey4} size={48} />
                <Text style={styles.emptyFilteredText}>
                  No {filter === 'credit' ? 'credit' : 'debit'} transactions found
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="receipt-long" type="material" color={appColors.grey4} size={80} />
            <Text style={styles.emptyTitle}>No Transactions Yet</Text>
            <Text style={styles.emptyText}>
              Your transaction history will appear here once you start using your wellness vault.
            </Text>
            <Text style={styles.emptyText}>
              Top up your wallet to get started!
            </Text>
          </View>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: appColors.AppBlue,
    borderBottomWidth: 0,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  headerRightPlaceholder: {
    width: 40,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
    backgroundColor: appColors.CardBackground,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: appColors.grey6,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: appColors.AppBlue,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextMedium,
  },
  filterTextActive: {
    color: appColors.CardBackground,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: appColors.grey6,
    marginHorizontal: 15,
  },
  summaryLabel: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: 5,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  scrollView: {
    flex: 1,
  },
  transactionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 15,
  },
  countText: {
    fontSize: 14,
    color: appColors.grey3,
    fontWeight: 'normal',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionContent: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 11,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  creditAmount: {
    color: '#4CAF50',
  },
  debitAmount: {
    color: '#F44336',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: appFonts.headerTextBold,
    color: appColors.grey1,
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: appFonts.headerTextRegular,
    color: appColors.grey3,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },
  emptyFiltered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyFilteredText: {
    fontSize: 14,
    fontFamily: appFonts.headerTextRegular,
    color: appColors.grey3,
    marginTop: 16,
    textAlign: 'center',
  },
});

export default TransactionHistoryScreen;
