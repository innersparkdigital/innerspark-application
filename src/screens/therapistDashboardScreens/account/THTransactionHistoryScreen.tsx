/**
 * Therapist Transaction History Screen
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import { appColors, appFonts } from '../../../global/Styles';
import ISGenericHeader from '../../../components/ISGenericHeader';
import ISStatusBar from '../../../components/ISStatusBar';

interface Transaction {
  id: string;
  client: string;
  amount: string;
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
  sessionType: string;
}

const THTransactionHistoryScreen = ({ navigation }: any) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  const [transactions] = useState<Transaction[]>([
    { id: '1', client: 'John Doe', amount: '280,000', date: 'Oct 20, 2025', time: '10:30 AM', status: 'completed', sessionType: 'Individual Session' },
    { id: '2', client: 'Sarah Williams', amount: '420,000', date: 'Oct 19, 2025', time: '2:00 PM', status: 'completed', sessionType: 'Couples Therapy' },
    { id: '3', client: 'Michael Brown', amount: '280,000', date: 'Oct 18, 2025', time: '11:00 AM', status: 'pending', sessionType: 'Individual Session' },
    { id: '4', client: 'Emily Chen', amount: '140,000', date: 'Oct 17, 2025', time: '4:30 PM', status: 'completed', sessionType: 'Group Session' },
    { id: '5', client: 'David Martinez', amount: '175,000', date: 'Oct 16, 2025', time: '9:00 AM', status: 'completed', sessionType: 'Initial Consultation' },
    { id: '6', client: 'Lisa Anderson', amount: '280,000', date: 'Oct 15, 2025', time: '1:00 PM', status: 'completed', sessionType: 'Individual Session' },
    { id: '7', client: 'James Wilson', amount: '420,000', date: 'Oct 14, 2025', time: '3:00 PM', status: 'failed', sessionType: 'Couples Therapy' },
    { id: '8', client: 'Maria Garcia', amount: '140,000', date: 'Oct 13, 2025', time: '10:00 AM', status: 'completed', sessionType: 'Group Session' },
  ]);

  const filteredTransactions = transactions.filter((transaction) => {
    if (selectedFilter === 'all') return true;
    return transaction.status === selectedFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return appColors.AppGreen;
      case 'pending':
        return '#FF9800';
      case 'failed':
        return '#F44336';
      default:
        return appColors.grey3;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'check-circle';
      case 'pending':
        return 'schedule';
      case 'failed':
        return 'error';
      default:
        return 'help';
    }
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <View style={styles.transactionLeft}>
          <View
            style={[
              styles.statusIcon,
              { backgroundColor: getStatusColor(item.status) + '20' },
            ]}
          >
            <Icon
              type="material"
              name={getStatusIcon(item.status)}
              size={24}
              color={getStatusColor(item.status)}
            />
          </View>
          <View style={styles.transactionInfo}>
            <Text style={styles.clientName}>{item.client}</Text>
            <Text style={styles.sessionType}>{item.sessionType}</Text>
            <Text style={styles.dateTime}>
              {item.date} • {item.time}
            </Text>
          </View>
        </View>
        <View style={styles.transactionRight}>
          <Text style={styles.amount}>UGX {item.amount}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) + '20' },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(item.status) },
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />
      <ISGenericHeader title="Transaction History" navigation={navigation} />

      <View style={styles.content}>
        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {['all', 'completed', 'pending', 'failed'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab,
                selectedFilter === filter && styles.filterTabActive,
              ]}
              onPress={() => setSelectedFilter(filter as any)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transactions List */}
        <FlatList
          data={filteredTransactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Icon type="material" name="receipt-long" size={60} color={appColors.grey3} />
              <Text style={styles.emptyText}>No transactions found</Text>
              <Text style={styles.emptySubtext}>
                {selectedFilter === 'all'
                  ? 'Your transaction history will appear here'
                  : `No ${selectedFilter} transactions`}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  content: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  filterTabActive: {
    backgroundColor: appColors.AppBlue,
  },
  filterText: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextMedium,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  sessionType: {
    fontSize: 13,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: 2,
  },
  dateTime: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: appFonts.bodyTextBold,
    textTransform: 'capitalize',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default THTransactionHistoryScreen;
