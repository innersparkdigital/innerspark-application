/**
 * My Subscription Screen - Manage current subscription and view usage
 * Focus: Support Groups usage tracking + Direct Chat status
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button, Skeleton } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import ISStatusBar from '../../components/ISStatusBar';
import { useToast } from 'native-base';

interface CurrentPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'annual';
  supportGroupsLimit: number | 'unlimited';
  directChatAccess: boolean;
}

interface UserSubscription {
  id: string;
  planId: string;
  planName: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: string;
  endDate: string;
  nextBillingDate: string;
  autoRenew: boolean;
  groupsJoined: number;
  groupsLimit: number | 'unlimited';
  directChatActive: boolean;
}

interface MySubscriptionScreenProps {
  navigation: any;
  onSwitchTab?: (tab: 'plans' | 'subscription') => void;
}

const MySubscriptionScreen: React.FC<MySubscriptionScreenProps> = ({ navigation, onSwitchTab }) => {
  const toast = useToast();
  const [currentPlan, setCurrentPlan] = useState<CurrentPlan | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Mock current plan
  const mockCurrentPlan: CurrentPlan = {
    id: 'premium',
    name: 'Premium Plan',
    price: 120000,
    currency: 'UGX',
    billingCycle: 'monthly',
    supportGroupsLimit: 4,
    directChatAccess: true,
  };

  // Mock current subscription
  const mockSubscription: UserSubscription = {
    id: 'sub_001',
    planId: 'premium',
    planName: 'Premium Plan',
    status: 'active',
    startDate: '2025-01-01',
    endDate: '2026-01-01',
    nextBillingDate: '2025-02-01',
    autoRenew: true,
    groupsJoined: 3,
    groupsLimit: 4,
    directChatActive: true,
  };

  // Old mock plans (remove)
  const _oldMockPlans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      description: 'Essential mental health support for individuals',
      price: 50000,
      currency: 'UGX',
      billingCycle: 'monthly',
      features: [
        '4 therapy sessions per month',
        'Basic wellness resources',
        'Email support',
        'Progress tracking',
        'Mobile app access'
      ],
      isPopular: false,
      isCurrentPlan: false,
      maxSessions: 4,
      supportLevel: 'basic',
      trialDays: 7,
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      description: 'Comprehensive mental health care with priority support',
      price: 120000,
      currency: 'UGX',
      billingCycle: 'monthly',
      features: [
        'Unlimited therapy sessions',
        'Group therapy access',
        'Premium wellness resources',
        'Priority support (24/7)',
        'Crisis intervention',
        'Family counseling sessions',
        'Mindfulness programs',
        'Progress analytics'
      ],
      isPopular: true,
      isCurrentPlan: true,
      maxSessions: 'unlimited',
      supportLevel: 'premium',
      trialDays: 14,
    }];

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls
      await new Promise<void>(resolve => setTimeout(resolve, 1000));
      
      setCurrentPlan(mockCurrentPlan);
      setCurrentSubscription(mockSubscription);
    } catch (error) {
      toast.show({
        description: 'Failed to load subscription data',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadSubscriptionData();
    setIsRefreshing(false);
  };

  const handleUpgradePlan = () => {
    // Switch to Browse Plans tab if callback is available
    if (onSwitchTab) {
      onSwitchTab('plans');
    } else {
      // Fallback: Navigate to ServicesScreen
      navigation.navigate('ServicesScreen', { initialTab: 'plans' });
    }
  };

  const handleCancelSubscription = () => {
    setShowCancelModal(true);
  };

  const confirmCancelSubscription = async () => {
    try {
      setShowCancelModal(false);
      toast.show({
        description: 'Subscription cancelled successfully',
        duration: 3000,
      });
      
      if (currentSubscription) {
        setCurrentSubscription({
          ...currentSubscription,
          status: 'cancelled',
          autoRenew: false,
        });
      }
    } catch (error) {
      toast.show({
        description: 'Failed to cancel subscription',
        duration: 3000,
      });
    }
  };

  const handleToggleAutoRenew = async () => {
    if (!currentSubscription) return;

    try {
      const newAutoRenew = !currentSubscription.autoRenew;
      setCurrentSubscription({
        ...currentSubscription,
        autoRenew: newAutoRenew,
      });
      
      toast.show({
        description: `Auto-renewal ${newAutoRenew ? 'enabled' : 'disabled'}`,
        duration: 2000,
      });
    } catch (error) {
      toast.show({
        description: 'Failed to update auto-renewal',
        duration: 3000,
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'trial':
        return '#2196F3';
      case 'cancelled':
        return '#FF9800';
      case 'expired':
        return '#F44336';
      default:
        return appColors.grey3;
    }
  };

  const getUsagePercentage = () => {
    if (!currentSubscription || currentSubscription.groupsLimit === 'unlimited') return 100;
    return (currentSubscription.groupsJoined / currentSubscription.groupsLimit) * 100;
  };

  const CurrentSubscriptionCard: React.FC = () => {
    if (!currentSubscription) return null;

    return (
      <View style={styles.subscriptionCard}>
        <View style={styles.subscriptionHeader}>
          <Text style={styles.subscriptionTitle}>Current Subscription</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentSubscription.status) }]}>
            <Text style={styles.statusText}>{currentSubscription.status?.toUpperCase() || 'UNKNOWN'}</Text>
          </View>
        </View>
        
        <Text style={styles.subscriptionPlan}>{currentSubscription.planName}</Text>
        
        <View style={styles.subscriptionDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Next Billing:</Text>
            <Text style={styles.detailValue}>{formatDate(currentSubscription.nextBillingDate)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Support Groups:</Text>
            <Text style={styles.detailValue}>
              {currentSubscription.groupsJoined}
              {currentSubscription.groupsLimit !== 'unlimited' && ` / ${currentSubscription.groupsLimit}`}
              {currentSubscription.groupsLimit === 'unlimited' && ' (Unlimited)'}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Direct Chat:</Text>
            <Text style={[styles.detailValue, { color: currentSubscription.directChatActive ? '#4CAF50' : appColors.grey4 }]}>
              {currentSubscription.directChatActive ? 'Active' : 'Not Available'}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Auto-Renewal:</Text>
            <TouchableOpacity onPress={handleToggleAutoRenew}>
              <Text style={[styles.detailValue, { color: currentSubscription.autoRenew ? '#4CAF50' : '#F44336' }]}>
                {currentSubscription.autoRenew ? 'Enabled' : 'Disabled'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Usage Progress Bar for Groups */}
        {currentSubscription.groupsLimit !== 'unlimited' && (
          <View style={styles.usageProgressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${getUsagePercentage()}%` }]} />
            </View>
            <Text style={styles.usageText}>
              {currentSubscription.groupsJoined} of {currentSubscription.groupsLimit} groups joined
            </Text>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('GroupsScreen')}
          >
            <Icon name="groups" type="material" color={appColors.AppBlue} size={20} />
            <Text style={styles.actionButtonText}>Browse Groups</Text>
          </TouchableOpacity>
          
          {currentSubscription.directChatActive && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('ChatScreen')}
            >
              <Icon name="chat" type="material" color={appColors.AppBlue} size={20} />
              <Text style={styles.actionButtonText}>Message Therapist</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.subscriptionActions}>
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={handleUpgradePlan}
          >
            <Text style={styles.upgradeButtonText}>Change Plan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelSubscription}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[appColors.AppBlue]}
          />
        }
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Skeleton animation="pulse" width="100%" height={300} style={{ borderRadius: 16 }} />
          </View>
        ) : (
          <CurrentSubscriptionCard />
        )}

        {/* Billing History Link */}
        <TouchableOpacity
          style={styles.billingLink}
          onPress={() => navigation.navigate('BillingHistoryScreen')}
        >
          <Icon name="receipt" type="material" color={appColors.AppBlue} size={24} />
          <View style={styles.billingLinkContent}>
            <Text style={styles.billingLinkTitle}>Billing History</Text>
            <Text style={styles.billingLinkSubtitle}>View invoices and payments</Text>
          </View>
          <Icon name="chevron-right" type="material" color={appColors.grey3} size={24} />
        </TouchableOpacity>
      </ScrollView>

      {/* Cancel Subscription Modal */}
      <Modal
        visible={showCancelModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cancel Subscription</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your current billing period.
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowCancelModal(false)}
              >
                <Text style={styles.modalCancelText}>Keep Plan</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalConfirmButton}
                onPress={confirmCancelSubscription}
              >
                <Text style={styles.modalConfirmText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRightPlaceholder: {
    width: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  headerSubtitle: {
    fontSize: 14,
    color: appColors.CardBackground,
    opacity: 0.9,
    marginTop: 4,
    fontFamily: appFonts.headerTextRegular,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    padding: 20,
  },
  subscriptionCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 10,
    color: appColors.CardBackground,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  subscriptionPlan: {
    fontSize: 16,
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 16,
  },
  subscriptionDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  detailValue: {
    fontSize: 14,
    color: appColors.grey1,
    fontFamily: appFonts.headerTextMedium,
  },
  subscriptionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // Usage Progress
  usageProgressContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: appColors.grey6,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: appColors.AppBlue,
    borderRadius: 4,
  },
  usageText: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
  },
  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.AppBlue + '15',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  actionButtonText: {
    fontSize: 14,
    color: appColors.AppBlue,
    fontWeight: '600',
    fontFamily: appFonts.headerTextBold,
    marginLeft: 8,
  },
  upgradeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: appColors.AppBlue,
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 14,
    color: appColors.AppBlue,
    fontWeight: '600',
    fontFamily: appFonts.headerTextBold,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F44336',
    borderRadius: 8,
    paddingVertical: 12,
    marginLeft: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    color: appColors.CardBackground,
    fontWeight: '600',
    fontFamily: appFonts.headerTextBold,
  },
  planCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  currentPlanCard: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  popularPlanCard: {
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 20,
    backgroundColor: '#FF9800',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    zIndex: 1,
  },
  popularText: {
    fontSize: 12,
    color: appColors.CardBackground,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  currentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#4CAF50' + '20',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 12,
  },
  currentText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
    marginLeft: 4,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    flex: 1,
  },
  supportBadge: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  supportText: {
    fontSize: 10,
    color: appColors.CardBackground,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  planDescription: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    marginBottom: 16,
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  billingCycle: {
    fontSize: 16,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: 4,
  },
  trialText: {
    fontSize: 12,
    color: '#4CAF50',
    fontFamily: appFonts.headerTextBold,
    marginBottom: 16,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: 8,
    flex: 1,
  },
  moreFeatures: {
    fontSize: 12,
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
    marginTop: 4,
  },
  selectButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 16,
    color: appColors.CardBackground,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  currentPlanButton: {
    backgroundColor: appColors.grey6,
  },
  currentPlanButtonText: {
    color: appColors.grey3,
  },
  // Billing Link
  billingLink: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  billingLinkContent: {
    flex: 1,
    marginLeft: 16,
  },
  billingLinkTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  billingLinkSubtitle: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginTop: 2,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: appColors.CardBackground,
    margin: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: appColors.grey4,
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    color: appColors.grey2,
    fontWeight: '600',
    fontFamily: appFonts.headerTextBold,
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: '#F44336',
    borderRadius: 8,
    paddingVertical: 12,
    marginLeft: 8,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 14,
    color: appColors.CardBackground,
    fontWeight: '600',
    fontFamily: appFonts.headerTextBold,
  },
});

export default MySubscriptionScreen;
