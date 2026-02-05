/**
 * Therapist Transaction History Screen
 */
import React, { useState, useEffect } from 'react';
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
import { getTransactions } from '../../../api/therapist';
import { useSelector } from 'react-redux';
import { ActivityIndicator } from 'react-native';

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
  const userDetails = useSelector((state: any) => state.userData.userDetails);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const therapistId = userDetails?.id || '52863268761';
      const response: any = await getTransactions(therapistId);

      if (response?.data?.transactions) {
        setTransactions(response.data.transactions);
      }
    } catch (error) {
      console.error('Failed to load transactions:', error);
      // Fallback to empty list or keep current
    } finally {
      setLoading(false);
    }
  };

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
        {loading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={appColors.AppBlue} />
            <Text style={{ marginTop: 10, color: appColors.grey3 }}>Loading transactions...</Text>
          </View>
        ) : (
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
        )}
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
