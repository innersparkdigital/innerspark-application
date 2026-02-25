/**
 * Therapist Pricing & Payments Management Screen
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button } from '@rneui/themed';
import { appColors, appFonts } from '../../../global/Styles';
import ISGenericHeader from '../../../components/ISGenericHeader';
import ISStatusBar from '../../../components/ISStatusBar';
import { getPricingRates } from '../../../api/therapist/earnings';
import { getAnalyticsOverview, getRevenueAnalytics } from '../../../api/therapist/analytics';
import { useSelector, useDispatch } from 'react-redux';
import { updateRevenueAnalytics } from '../../../features/therapist/analyticsSlice';

interface SessionRate {
  type: string;
  duration: string;
  price: string;
  icon: string;
  color: string;
}

const THPricingScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const userDetails = useSelector((state: any) => state.userData.userDetails);
  const therapistRevenueRedux = useSelector((state: any) => state.therapistAnalytics.revenueAnalytics);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(!therapistRevenueRedux);

  const [rates, setRates] = useState<SessionRate[]>([
    { type: 'Individual Session', duration: '60 min', price: '280,000', icon: 'person', color: appColors.AppBlue },
    { type: 'Couples Therapy', duration: '90 min', price: '420,000', icon: 'people', color: '#9C27B0' },
    { type: 'Group Session', duration: '60 min', price: '140,000', icon: 'groups', color: appColors.AppGreen },
    { type: 'Initial Consultation', duration: '30 min', price: '175,000', icon: 'chat', color: '#FF9800' },
  ]);

  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState<any>(null);

  useEffect(() => {
    if (therapistRevenueRedux) {
      setSummaryData({
        ...therapistRevenueRedux,
        total: therapistRevenueRedux.totalRevenue || therapistRevenueRedux.total,
        pendingPayout: therapistRevenueRedux.pendingPayments || therapistRevenueRedux.pendingPayout
      });
    }
    loadPricingData();
  }, []);

  const loadPricingData = async () => {
    try {
      setLoading(true);
      const therapistId = userDetails?.userId;
      const today = new Date();

      const [pricingRes, analyticsRes, revenueRes] = await Promise.all([
        getPricingRates(therapistId).catch(e => ({ error: e })),
        getAnalyticsOverview(therapistId, 'month').catch(e => ({ error: e })),
        getRevenueAnalytics(therapistId, 'month').catch(e => ({ error: e }))
      ]);

      if (pricingRes && !(pricingRes as any).error) {
        const pData = (pricingRes as any).data;
        if (pData?.sessionTypes?.length > 0) {
          setRates(pData.sessionTypes.map((t: any) => ({
            type: t.type,
            duration: `${t.duration} min`,
            price: t.price.toLocaleString(),
            icon: t.type.toLowerCase().includes('couple') ? 'people'
              : t.type.toLowerCase().includes('group') ? 'groups'
                : t.type.toLowerCase().includes('consult') ? 'chat' : 'person',
            color: t.type.toLowerCase().includes('couple') ? '#9C27B0'
              : t.type.toLowerCase().includes('group') ? appColors.AppGreen
                : t.type.toLowerCase().includes('consult') ? '#FF9800' : appColors.AppBlue
          })));
        }
      }

      const mergedSummary: any = {};

      if (analyticsRes && !(analyticsRes as any).error) {
        const aData = (analyticsRes as any).data;
        mergedSummary.sessionCount = aData?.sessions?.total || 0;
      }

      if (revenueRes && !(revenueRes as any).error) {
        const rData = (revenueRes as any).data;
        mergedSummary.total = rData?.totalRevenue || 0;
        mergedSummary.currency = rData?.currency || 'UGX';
        mergedSummary.pendingPayout = rData?.pendingPayments || 0;
      }

      setSummaryData(mergedSummary);
      dispatch(updateRevenueAnalytics(mergedSummary));

    } catch (error: any) {
      const errorMessage = error.backendMessage || error.message || 'Failed to load pricing data';
      console.error('Pricing Error:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRate = () => {
    setShowEditModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />
      <ISGenericHeader title="Pricing & Payments" navigation={navigation} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Revenue Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>This Month</Text>
          <Text style={styles.summaryAmount}>
            {summaryData?.currency || 'UGX'} {(summaryData?.total || 0).toLocaleString()}
          </Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Sessions</Text>
              <Text style={styles.summaryValue}>{summaryData?.sessionCount ?? 0}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Avg. Rate</Text>
              <Text style={styles.summaryValue}>{summaryData?.total && summaryData.sessionCount ? Math.round(summaryData.total / summaryData.sessionCount).toLocaleString() : '0'}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Pending</Text>
              <Text style={styles.summaryValue}>{summaryData?.pendingPayout ? summaryData.pendingPayout.toLocaleString() : '0'}</Text>
            </View>
          </View>
        </View>

        {/* Session Rates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Rates</Text>
          {rates.map((rate, index) => (
            <View key={index} style={styles.rateCard}>
              <View style={styles.rateLeft}>
                <View style={[styles.rateIcon, { backgroundColor: rate.color + '20' }]}>
                  <Icon type="material" name={rate.icon} size={24} color={rate.color} />
                </View>
                <View style={styles.rateInfo}>
                  <Text style={styles.rateType}>{rate.type}</Text>
                  <Text style={styles.rateDuration}>{rate.duration}</Text>
                </View>
              </View>
              <View style={styles.rateRight}>
                <Text style={styles.ratePrice}>UGX {rate.price}</Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={handleEditRate}
                >
                  <Icon type="material" name="edit" size={18} color={appColors.AppBlue} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          <View style={styles.paymentCard}>
            <View style={styles.paymentLeft}>
              <View style={styles.paymentIcon}>
                <Icon
                  type="material"
                  name="account-balance-wallet"
                  size={24}
                  color={appColors.AppBlue}
                />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentType}>Wellness Vault</Text>
                <Text style={styles.paymentDetails}>
                  System Payment Gateway
                </Text>
              </View>
            </View>
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Icon type="material" name="info-outline" size={16} color={appColors.grey3} />
            <Text style={styles.infoText}>
              All payments are processed through Wellness Vault for security and compliance.
            </Text>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('THTransactionHistoryScreen')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionLeft}>
                <View
                  style={[
                    styles.transactionIcon,
                    {
                      backgroundColor:
                        transaction.status === 'completed'
                          ? appColors.AppGreen + '20'
                          : '#FF9800' + '20',
                    },
                  ]}
                >
                  <Icon
                    type="material"
                    name={transaction.status === 'completed' ? 'check-circle' : 'schedule'}
                    size={20}
                    color={transaction.status === 'completed' ? appColors.AppGreen : '#FF9800'}
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionClient}>{transaction.client}</Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text style={styles.transactionAmount}>UGX {transaction.amount}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        transaction.status === 'completed'
                          ? appColors.AppGreen + '20'
                          : '#FF9800' + '20',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: transaction.status === 'completed' ? appColors.AppGreen : '#FF9800',
                      },
                    ]}
                  >
                    {transaction.status}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Edit Rate Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Icon type="material" name="lock" size={32} color={appColors.AppBlue} />
              <Text style={styles.modalTitle}>Rate Management</Text>
            </View>

            <Text style={styles.modalMessage}>
              Session rates are managed centrally for consistency and compliance.
            </Text>

            <View style={styles.modalOptions}>
              <View style={styles.optionCard}>
                <Icon type="material" name="computer" size={24} color={appColors.AppBlue} />
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Web Dashboard</Text>
                  <Text style={styles.optionText}>Login to your web dashboard to request rate changes</Text>
                </View>
              </View>

              <View style={styles.optionCard}>
                <Icon type="material" name="support-agent" size={24} color={appColors.AppGreen} />
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Contact Administrator</Text>
                  <Text style={styles.optionText}>Reach out to support for assistance with pricing</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowEditModal(false)}
            >
              <Text style={styles.modalCloseText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  summaryCard: {
    backgroundColor: appColors.AppBlue,
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: appFonts.headerTextBold,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  summaryLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: appFonts.headerTextBold,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 12,
  },
  addButton: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextMedium,
  },
  viewAllText: {
    fontSize: 14,
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextMedium,
  },
  rateCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  rateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rateIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rateInfo: {
    flex: 1,
  },
  rateType: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
    marginBottom: 4,
  },
  rateDuration: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  rateRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: appColors.AppBlue + '10',
  },
  paymentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: appColors.AppBlue + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentType: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
    marginBottom: 4,
  },
  paymentDetails: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  defaultBadge: {
    backgroundColor: appColors.AppGreen + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  defaultText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: appColors.AppGreen,
    fontFamily: appFonts.bodyTextBold,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionClient: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 6,
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
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.grey6,
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginTop: 12,
  },
  modalMessage: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalOptions: {
    gap: 12,
    marginBottom: 24,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.AppLightGray,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  optionText: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: 18,
  },
  modalCloseButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: appFonts.headerTextBold,
  },
});

export default THPricingScreen;
