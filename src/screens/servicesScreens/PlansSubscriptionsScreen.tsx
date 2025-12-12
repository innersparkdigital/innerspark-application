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
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';
import { useToast } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentSubscription } from '../../api/client/subscriptions';
import { mockCurrentPlan, mockCurrentSubscription } from '../../global/MockData';
import { 
  setCurrentSubscription as setCurrentSubscriptionRedux,
  toggleAutoRenew as toggleAutoRenewRedux,
  cancelSubscription as cancelSubscriptionRedux
} from '../../features/subscription/subscriptionSlice';

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
  const dispatch = useDispatch();
  const userId = useSelector((state: any) => state.userData.userDetails.userId);
  const [currentPlan, setCurrentPlan] = useState<CurrentPlan | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    setIsLoading(true);
    try {
      console.log('📞 Calling getCurrentSubscription API...');
      console.log('User ID:', userId);

      const response = await getCurrentSubscription(userId);
      console.log('✅ Subscription response:', response);

      // Map API response to local format
      if (response.subscription) {
        const sub = response.subscription;
        const mappedSubscription: UserSubscription = {
          id: sub.id || sub.subscription_id,
          planId: sub.plan_id || sub.planId,
          planName: sub.plan_name || sub.planName,
          status: sub.status || 'active',
          startDate: sub.start_date || sub.startDate,
          endDate: sub.end_date || sub.endDate,
          nextBillingDate: sub.next_billing_date || sub.nextBillingDate,
          autoRenew: sub.auto_renew !== undefined ? sub.auto_renew : sub.autoRenew !== undefined ? sub.autoRenew : true,
          groupsJoined: sub.groups_joined || sub.groupsJoined || 0,
          groupsLimit: sub.groups_limit || sub.groupsLimit || 0,
          directChatActive: sub.direct_chat_active !== undefined ? sub.direct_chat_active : sub.directChatActive || false,
        };
        setCurrentSubscription(mappedSubscription);
        dispatch(setCurrentSubscriptionRedux(mappedSubscription)); // ✅ Redux dispatch

        // Set current plan from subscription data
        if (response.plan) {
          const plan = response.plan;
          const mappedPlan: CurrentPlan = {
            id: plan.id || plan.plan_id,
            name: plan.name,
            price: plan.price,
            currency: plan.currency || 'UGX',
            billingCycle: plan.billing_cycle || plan.billingCycle || 'monthly',
            supportGroupsLimit: plan.support_groups_limit || plan.supportGroupsLimit || 0,
            directChatAccess: plan.direct_chat_access || plan.directChatAccess || false,
          };
          setCurrentPlan(mappedPlan);
        } else {
          setCurrentPlan(mockCurrentPlan);
        }
      } else {
        // No active subscription - user on free plan
        console.log('⚠️ No active subscription, user is on free plan');
        setCurrentSubscription(null);
        setCurrentPlan(null);
      }
    } catch (error: any) {
      console.error('❌ Error loading subscription:', error);
      
      // Fallback to mock data on error
      setCurrentPlan(mockCurrentPlan);
      setCurrentSubscription(mockCurrentSubscription);
      
      toast.show({
        description: 'Using offline data. Some features may be limited.',
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
      
      // ⚠️ MISSING ENDPOINT: cancelSubscription(userId, subscriptionId, reason)
      // Using local state update only
      console.log('⚠️ MISSING API: cancelSubscription - using mock behavior');
      
      toast.show({
        description: 'Subscription cancelled successfully (offline mode)',
        duration: 3000,
      });
      
      if (currentSubscription) {
        setCurrentSubscription({
          ...currentSubscription,
          status: 'cancelled',
          autoRenew: false,
        });
        dispatch(cancelSubscriptionRedux()); // ✅ Redux dispatch
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
      // ⚠️ MISSING ENDPOINT: toggleAutoRenew(userId, subscriptionId)
      console.log('⚠️ MISSING API: toggleAutoRenew - using local state only');

      setCurrentSubscription(prev => prev ? { ...prev, autoRenew: !prev.autoRenew } : null);
      dispatch(toggleAutoRenewRedux()); // ✅ Redux dispatch
      
      toast.show({
        description: `Auto-renewal ${!currentSubscription.autoRenew ? 'enabled' : 'disabled'} (offline mode)`,
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

  const FreePlanCard: React.FC = () => (
    <View style={styles.subscriptionCard}>
      <View style={styles.subscriptionHeader}>
        <Text style={styles.subscriptionTitle}>Current Plan</Text>
        <View style={[styles.statusBadge, { backgroundColor: appColors.grey3 }]}>
          <Text style={styles.statusText}>FREE</Text>
        </View>
      </View>
      
      <Text style={styles.subscriptionPlan}>Free Plan</Text>
      <Text style={styles.freePlanDescription}>
        You're currently on the free plan. Upgrade to unlock premium features like support groups and direct therapist chat.
      </Text>
      
      <View style={styles.subscriptionDetails}>
        <View style={styles.detailRow}>
          <Icon name="groups" type="material" color={appColors.grey4} size={20} />
          <Text style={[styles.detailLabel, { marginLeft: 8, flex: 1 }]}>Support Groups:</Text>
          <Text style={[styles.detailValue, { color: appColors.grey4 }]}>Not Available</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="chat" type="material" color={appColors.grey4} size={20} />
          <Text style={[styles.detailLabel, { marginLeft: 8, flex: 1 }]}>Direct Chat:</Text>
          <Text style={[styles.detailValue, { color: appColors.grey4 }]}>Not Available</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="event" type="material" color={appColors.AppBlue} size={20} />
          <Text style={[styles.detailLabel, { marginLeft: 8, flex: 1 }]}>Appointments:</Text>
          <Text style={[styles.detailValue, { color: appColors.AppBlue }]}>Pay Per Use</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="calendar-today" type="material" color={appColors.AppBlue} size={20} />
          <Text style={[styles.detailLabel, { marginLeft: 8, flex: 1 }]}>Events:</Text>
          <Text style={[styles.detailValue, { color: appColors.AppBlue }]}>Pay Per Use</Text>
        </View>
      </View>

      {/* Upgrade CTA */}
      <View style={styles.upgradeCtaContainer}>
        <Icon name="star" type="material" color={appColors.AppBlue} size={24} />
        <View style={styles.upgradeCtaContent}>
          <Text style={styles.upgradeCtaTitle}>Unlock Premium Features</Text>
          <Text style={styles.upgradeCtaText}>Join support groups, chat with therapists, and more</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.upgradePrimaryButton}
        onPress={handleUpgradePlan}
      >
        <Text style={styles.upgradePrimaryButtonText}>View Plans</Text>
        <Icon name="arrow-forward" type="material" color={appColors.CardBackground} size={20} />
      </TouchableOpacity>
    </View>
  );

  const CurrentSubscriptionCard: React.FC = () => {
    if (!currentSubscription) return <FreePlanCard />;

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
  freePlanDescription: {
    fontSize: 14,
    color: appColors.grey2,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 16,
    fontFamily: appFonts.headerTextRegular,
  },
  upgradeCtaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  upgradeCtaContent: {
    flex: 1,
    marginLeft: 12,
  },
  upgradeCtaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  upgradeCtaText: {
    fontSize: 13,
    color: appColors.grey2,
    marginTop: 2,
    fontFamily: appFonts.headerTextRegular,
  },
  upgradePrimaryButton: {
    backgroundColor: appColors.AppBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  upgradePrimaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.CardBackground,
    marginRight: 8,
    fontFamily: appFonts.headerTextBold,
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
