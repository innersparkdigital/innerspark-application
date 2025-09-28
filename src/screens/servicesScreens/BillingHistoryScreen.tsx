/**
 * Billing History Screen - View invoices and payment history
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Skeleton } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import LHGenericHeader from '../../components/LHGenericHeader';

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue' | 'failed';
  paymentMethod: string;
  description: string;
  planName: string;
  billingPeriod: string;
  downloadUrl?: string;
}

interface PaymentMethod {
  id: string;
  type: 'wellnessvault' | 'mobile_money' | 'card';
  name: string;
  details: string;
  isDefault: boolean;
}

interface BillingHistoryScreenProps {
  navigation: any;
}

const BillingHistoryScreen: React.FC<BillingHistoryScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

  // Mock invoices data
  const mockInvoices: Invoice[] = [
    {
      id: '1',
      invoiceNumber: 'INV-2025-001',
      date: '2025-01-27',
      dueDate: '2025-02-01',
      amount: 120000,
      currency: 'UGX',
      status: 'paid',
      paymentMethod: 'WellnessVault',
      description: 'Premium Plan - Monthly Subscription',
      planName: 'Premium Plan',
      billingPeriod: 'Jan 2025',
      downloadUrl: 'https://example.com/invoice-001.pdf',
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-012',
      date: '2024-12-27',
      dueDate: '2025-01-01',
      amount: 120000,
      currency: 'UGX',
      status: 'paid',
      paymentMethod: 'WellnessVault',
      description: 'Premium Plan - Monthly Subscription',
      planName: 'Premium Plan',
      billingPeriod: 'Dec 2024',
      downloadUrl: 'https://example.com/invoice-012.pdf',
    },
    {
      id: '3',
      invoiceNumber: 'INV-2024-011',
      date: '2024-11-27',
      dueDate: '2024-12-01',
      amount: 55000,
      currency: 'UGX',
      status: 'paid',
      paymentMethod: 'Mobile Money',
      description: 'Individual Therapy Session',
      planName: 'Pay Per Session',
      billingPeriod: 'Nov 2024',
      downloadUrl: 'https://example.com/invoice-011.pdf',
    },
    {
      id: '4',
      invoiceNumber: 'INV-2024-010',
      date: '2024-10-27',
      dueDate: '2024-11-01',
      amount: 120000,
      currency: 'UGX',
      status: 'paid',
      paymentMethod: 'WellnessVault',
      description: 'Premium Plan - Monthly Subscription',
      planName: 'Premium Plan',
      billingPeriod: 'Oct 2024',
      downloadUrl: 'https://example.com/invoice-010.pdf',
    },
    {
      id: '5',
      invoiceNumber: 'INV-2024-009',
      date: '2024-09-27',
      dueDate: '2024-10-01',
      amount: 85000,
      currency: 'UGX',
      status: 'paid',
      paymentMethod: 'WellnessVault',
      description: 'Family Counseling Session',
      planName: 'Pay Per Session',
      billingPeriod: 'Sep 2024',
      downloadUrl: 'https://example.com/invoice-009.pdf',
    },
    {
      id: '6',
      invoiceNumber: 'INV-2024-008',
      date: '2024-08-27',
      dueDate: '2024-09-01',
      amount: 120000,
      currency: 'UGX',
      status: 'failed',
      paymentMethod: 'Mobile Money',
      description: 'Premium Plan - Monthly Subscription',
      planName: 'Premium Plan',
      billingPeriod: 'Aug 2024',
    },
    {
      id: '7',
      invoiceNumber: 'INV-2025-002',
      date: '2025-01-28',
      dueDate: '2025-02-02',
      amount: 75000,
      currency: 'UGX',
      status: 'pending',
      paymentMethod: 'WellnessVault',
      description: 'Crisis Support Package',
      planName: 'Crisis Support',
      billingPeriod: 'Jan 2025',
    },
  ];

  // Mock payment methods
  const mockPaymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'wellnessvault',
      name: 'WellnessVault',
      details: 'UGX 350,000 available',
      isDefault: true,
    },
    {
      id: '2',
      type: 'mobile_money',
      name: 'Mobile Money',
      details: '**** **** 1234',
      isDefault: false,
    },
  ];

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInvoices(mockInvoices);
      setPaymentMethods(mockPaymentMethods);
    } catch (error) {
      toast.show({
        description: 'Failed to load billing history',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadBillingData();
    setIsRefreshing(false);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    if (!invoice.downloadUrl) {
      toast.show({
        description: 'Download not available for this invoice',
        duration: 2000,
      });
      return;
    }

    toast.show({
      description: `Downloading ${invoice.invoiceNumber}...`,
      duration: 2000,
    });
  };

  const handleRetryPayment = (invoice: Invoice) => {
    Alert.alert(
      'Retry Payment',
      `Retry payment for ${invoice.invoiceNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Retry', onPress: () => processRetryPayment(invoice) }
      ]
    );
  };

  const processRetryPayment = async (invoice: Invoice) => {
    try {
      toast.show({
        description: 'Processing payment...',
        duration: 2000,
      });
      
      // Update invoice status
      const updatedInvoices = invoices.map(inv =>
        inv.id === invoice.id ? { ...inv, status: 'paid' as const } : inv
      );
      setInvoices(updatedInvoices);
      
      toast.show({
        description: 'Payment successful!',
        duration: 3000,
      });
    } catch (error) {
      toast.show({
        description: 'Payment failed. Please try again.',
        duration: 3000,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'overdue':
        return '#F44336';
      case 'failed':
        return '#F44336';
      default:
        return appColors.grey3;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return 'check-circle';
      case 'pending':
        return 'schedule';
      case 'overdue':
        return 'error';
      case 'failed':
        return 'cancel';
      default:
        return 'help';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredInvoices = invoices.filter(invoice => 
    selectedFilter === 'all' || invoice.status === selectedFilter
  );

  const InvoiceCard: React.FC<{ invoice: Invoice }> = ({ invoice }) => (
    <View style={styles.invoiceCard}>
      <View style={styles.invoiceHeader}>
        <View style={styles.invoiceInfo}>
          <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
          <Text style={styles.invoiceDate}>{formatDate(invoice.date)}</Text>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(invoice.status) }]}>
          <Icon 
            name={getStatusIcon(invoice.status)} 
            type="material" 
            color={appColors.CardBackground} 
            size={14} 
          />
          <Text style={styles.statusText}>{invoice.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={styles.invoiceDescription}>{invoice.description}</Text>
      <Text style={styles.billingPeriod}>{invoice.billingPeriod}</Text>
      
      <View style={styles.invoiceDetails}>
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>
            {invoice.currency} {invoice.amount.toLocaleString()}
          </Text>
          <Text style={styles.paymentMethod}>via {invoice.paymentMethod}</Text>
        </View>
        
        {invoice.status === 'pending' && (
          <Text style={styles.dueDate}>Due: {formatDate(invoice.dueDate)}</Text>
        )}
      </View>
      
      <View style={styles.invoiceActions}>
        {invoice.downloadUrl && invoice.status === 'paid' && (
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={() => handleDownloadInvoice(invoice)}
          >
            <Icon name="download" type="material" color={appColors.AppBlue} size={16} />
            <Text style={styles.downloadButtonText}>Download</Text>
          </TouchableOpacity>
        )}
        
        {(invoice.status === 'failed' || invoice.status === 'overdue') && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => handleRetryPayment(invoice)}
          >
            <Icon name="refresh" type="material" color={appColors.CardBackground} size={16} />
            <Text style={styles.retryButtonText}>Retry Payment</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const InvoiceSkeleton: React.FC = () => (
    <View style={styles.invoiceCard}>
      <View style={styles.invoiceHeader}>
        <View style={styles.invoiceInfo}>
          <Skeleton animation="pulse" width="60%" height={16} style={{ marginBottom: 4 }} />
          <Skeleton animation="pulse" width="40%" height={14} />
        </View>
        <Skeleton animation="pulse" width={60} height={24} />
      </View>
      <Skeleton animation="pulse" width="100%" height={16} style={{ marginVertical: 8 }} />
      <Skeleton animation="pulse" width="30%" height={14} style={{ marginBottom: 12 }} />
      <Skeleton animation="pulse" width="50%" height={20} />
    </View>
  );

  const EmptyState: React.FC = () => (
    <View style={styles.emptyContainer}>
      <Icon name="receipt-long" type="material" color={appColors.grey3} size={80} />
      <Text style={styles.emptyTitle}>No Invoices Found</Text>
      <Text style={styles.emptySubtitle}>
        {selectedFilter === 'all' 
          ? 'Your billing history will appear here'
          : `No ${selectedFilter} invoices found`}
      </Text>
    </View>
  );

  const FilterChips: React.FC = () => (
    <View style={styles.filterContainer}>
      {(['all', 'paid', 'pending', 'overdue'] as const).map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[
            styles.filterChip,
            selectedFilter === filter && styles.selectedFilterChip
          ]}
          onPress={() => setSelectedFilter(filter)}
        >
          <Text style={[
            styles.filterChipText,
            selectedFilter === filter && styles.selectedFilterText
          ]}>
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const PaymentMethodsCard: React.FC = () => (
    <View style={styles.paymentMethodsCard}>
      <Text style={styles.sectionTitle}>Payment Methods</Text>
      {paymentMethods.map((method) => (
        <View key={method.id} style={styles.paymentMethodItem}>
          <View style={styles.paymentMethodInfo}>
            <Icon 
              name={method.type === 'wellnessvault' ? 'account-balance-wallet' : 'phone-android'} 
              type="material" 
              color={appColors.AppBlue} 
              size={24} 
            />
            <View style={styles.paymentMethodDetails}>
              <Text style={styles.paymentMethodName}>{method.name}</Text>
              <Text style={styles.paymentMethodDetailsText}>{method.details}</Text>
            </View>
          </View>
          {method.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LHGenericHeader
        title="Billing History"
        subtitle="View invoices and payment history"
      />

      <FlatList
        data={isLoading ? Array(5).fill({}) : filteredInvoices}
        keyExtractor={(item, index) => isLoading ? index.toString() : item.id}
        renderItem={({ item }) => 
          isLoading ? <InvoiceSkeleton /> : <InvoiceCard invoice={item} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[appColors.AppBlue]}
          />
        }
        ListHeaderComponent={
          !isLoading ? (
            <View>
              <PaymentMethodsCard />
              <FilterChips />
            </View>
          ) : null
        }
        ListEmptyComponent={!isLoading ? <EmptyState /> : null}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  paymentMethodsCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 16,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey6,
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodDetails: {
    marginLeft: 12,
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  paymentMethodDetailsText: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginTop: 2,
  },
  defaultBadge: {
    backgroundColor: appColors.AppBlue + '20',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  defaultText: {
    fontSize: 12,
    color: appColors.AppBlue,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  filterChip: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    elevation: 1,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedFilterChip: {
    backgroundColor: appColors.AppBlue,
  },
  filterChipText: {
    fontSize: 14,
    color: appColors.grey1,
    fontFamily: appFonts.headerTextMedium,
    textAlign: 'center',
  },
  selectedFilterText: {
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  invoiceCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  invoiceInfo: {
    flex: 1,
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  invoiceDate: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 10,
    color: appColors.CardBackground,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
    marginLeft: 4,
  },
  invoiceDescription: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    marginBottom: 4,
  },
  billingPeriod: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginBottom: 12,
  },
  invoiceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  amountContainer: {
    flex: 1,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  paymentMethod: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginTop: 2,
  },
  dueDate: {
    fontSize: 12,
    color: '#FF9800',
    fontFamily: appFonts.headerTextBold,
  },
  invoiceActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.AppBlue + '20',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
  },
  downloadButtonText: {
    fontSize: 12,
    color: appColors.AppBlue,
    fontWeight: '600',
    fontFamily: appFonts.headerTextBold,
    marginLeft: 4,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F44336',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
  },
  retryButtonText: {
    fontSize: 12,
    color: appColors.CardBackground,
    fontWeight: '600',
    fontFamily: appFonts.headerTextBold,
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default BillingHistoryScreen;
