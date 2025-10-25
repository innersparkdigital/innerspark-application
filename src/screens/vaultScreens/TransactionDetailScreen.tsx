/**
 * Transaction Detail Screen - Full details of a single transaction
 */
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { appColors, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';

const TransactionDetailScreen = ({ navigation, route }) => {
  const toast = useToast();
  const { transaction } = route.params || {};

  // Mock transaction detail - in real app this would come from API
  const transactionDetail = transaction || {
    id: 'TXN-2025-001234',
    description: 'Therapy Session Payment',
    amount: '-30,000 UGX',
    rawAmount: 30000,
    time: 'Yesterday',
    date: 'Oct 24, 2025',
    fullDate: 'October 24, 2025 at 2:30 PM',
    type: 'debit',
    icon: 'remove-circle',
    category: 'Therapy',
    status: 'Completed',
    paymentMethod: 'Wellness Vault',
    recipient: 'Dr. Sarah Johnson',
    sessionType: 'Individual Therapy',
    duration: '60 minutes',
    breakdown: {
      subtotal: 28000,
      serviceFee: 2000,
      total: 30000,
    },
  };


  const DetailRow = ({ label, value, valueColor = appColors.grey1 }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, { color: valueColor }]}>{value}</Text>
    </View>
  );

  const StatusBadge = ({ status }) => {
    const getStatusColor = () => {
      switch (status?.toLowerCase()) {
        case 'completed': return '#4CAF50';
        case 'pending': return '#FF9800';
        case 'failed': return '#F44336';
        case 'refunded': return '#2196F3';
        default: return appColors.grey3;
      }
    };

    return (
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
        <Icon 
          name={status?.toLowerCase() === 'completed' ? 'check-circle' : 'schedule'} 
          type="material" 
          color={getStatusColor()} 
          size={16} 
        />
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {status}
        </Text>
      </View>
    );
  };

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
        <Text style={styles.headerTitle}>Transaction Details</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Amount Card */}
        <View style={styles.amountCard}>
          <View style={[
            styles.amountIconContainer,
            { backgroundColor: transactionDetail.type === 'credit' ? '#4CAF50' + '15' : '#F44336' + '15' }
          ]}>
            <Icon
              name={transactionDetail.icon}
              type="material"
              color={transactionDetail.type === 'credit' ? '#4CAF50' : '#F44336'}
              size={40}
            />
          </View>
          <Text style={styles.amountDescription}>{transactionDetail.description}</Text>
          <Text style={[
            styles.amountText,
            transactionDetail.type === 'credit' ? styles.creditAmount : styles.debitAmount
          ]}>
            {transactionDetail.amount}
          </Text>
          <Text style={styles.amountDate}>{transactionDetail.fullDate}</Text>
          <StatusBadge status={transactionDetail.status} />
        </View>

        {/* Transaction Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction Information</Text>
          <View style={styles.card}>
            <DetailRow label="Transaction ID" value={transactionDetail.id} />
            <DetailRow label="Category" value={transactionDetail.category} />
            <DetailRow label="Payment Method" value={transactionDetail.paymentMethod} />
            {transactionDetail.recipient && (
              <DetailRow label="Recipient" value={transactionDetail.recipient} />
            )}
            {transactionDetail.sessionType && (
              <DetailRow label="Session Type" value={transactionDetail.sessionType} />
            )}
            {transactionDetail.duration && (
              <DetailRow label="Duration" value={transactionDetail.duration} />
            )}
          </View>
        </View>

        {/* Payment Breakdown */}
        {transactionDetail.breakdown && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Breakdown</Text>
            <View style={styles.card}>
              <DetailRow 
                label="Subtotal" 
                value={`UGX ${transactionDetail.breakdown.subtotal.toLocaleString()}`} 
              />
              <DetailRow 
                label="Service Fee" 
                value={`UGX ${transactionDetail.breakdown.serviceFee.toLocaleString()}`} 
              />
              <View style={styles.divider} />
              <DetailRow 
                label="Total" 
                value={`UGX ${transactionDetail.breakdown.total.toLocaleString()}`}
                valueColor={transactionDetail.type === 'credit' ? '#4CAF50' : '#F44336'}
              />
            </View>
          </View>
        )}

        {/* Help Note */}
        <View style={styles.helpNote}>
          <Icon name="info-outline" type="material" color={appColors.grey3} size={20} />
          <Text style={styles.helpNoteText}>
            Need help with this transaction? Contact our support team for assistance.
          </Text>
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
  scrollView: {
    flex: 1,
  },
  amountCard: {
    backgroundColor: appColors.CardBackground,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  amountIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  amountDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
    marginBottom: 10,
    textAlign: 'center',
  },
  amountText: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
    marginBottom: 8,
  },
  amountDate: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: 15,
  },
  creditAmount: {
    color: '#4CAF50',
  },
  debitAmount: {
    color: '#F44336',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: appFonts.bodyTextMedium,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 10,
  },
  card: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: appFonts.bodyTextMedium,
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: appColors.grey6,
    marginVertical: 5,
  },
  helpNote: {
    flexDirection: 'row',
    backgroundColor: appColors.grey6,
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 10,
    padding: 15,
    gap: 10,
  },
  helpNoteText: {
    flex: 1,
    fontSize: 13,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: 18,
  },
});

export default TransactionDetailScreen;
