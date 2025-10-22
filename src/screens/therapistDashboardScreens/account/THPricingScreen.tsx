/**
 * Therapist Pricing & Payments Management Screen
 */
import React, { useState } from 'react';
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

interface SessionRate {
  type: string;
  duration: string;
  price: string;
  icon: string;
  color: string;
}

const THPricingScreen = ({ navigation }: any) => {
  const [showEditModal, setShowEditModal] = useState(false);
  
  const [rates] = useState<SessionRate[]>([
    { type: 'Individual Session', duration: '60 min', price: '280,000', icon: 'person', color: appColors.AppBlue },
    { type: 'Couples Therapy', duration: '90 min', price: '420,000', icon: 'people', color: '#9C27B0' },
    { type: 'Group Session', duration: '60 min', price: '140,000', icon: 'groups', color: appColors.AppGreen },
    { type: 'Initial Consultation', duration: '30 min', price: '175,000', icon: 'chat', color: '#FF9800' },
  ]);

  const [recentTransactions] = useState([
    { id: '1', client: 'John Doe', amount: '280,000', date: 'Oct 20, 2025', status: 'completed' },
    { id: '2', client: 'Sarah Williams', amount: '420,000', date: 'Oct 19, 2025', status: 'completed' },
    { id: '3', client: 'Michael Brown', amount: '280,000', date: 'Oct 18, 2025', status: 'pending' },
  ]);

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
          <Text style={styles.summaryAmount}>UGX 11,340,000</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Sessions</Text>
              <Text style={styles.summaryValue}>42</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Avg. Rate</Text>
              <Text style={styles.summaryValue}>270K</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Pending</Text>
              <Text style={styles.summaryValue}>840K</Text>
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
