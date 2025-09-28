/**
 * Plans & Subscriptions Screen - Manage subscription plans and billing
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
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button, Skeleton } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import LHGenericHeader from '../../components/LHGenericHeader';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  isPopular: boolean;
  isCurrentPlan: boolean;
  maxSessions: number | 'unlimited';
  supportLevel: 'basic' | 'premium' | 'priority';
  trialDays?: number;
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
  sessionsUsed: number;
  sessionsLimit: number | 'unlimited';
}

interface PlansSubscriptionsScreenProps {
  navigation: any;
}

const PlansSubscriptionsScreen: React.FC<PlansSubscriptionsScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  // Mock subscription plans
  const mockPlans: SubscriptionPlan[] = [
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
    },
    {
      id: 'family',
      name: 'Family Plan',
      description: 'Mental health support for the whole family',
      price: 180000,
      currency: 'UGX',
      billingCycle: 'monthly',
      features: [
        'Up to 5 family members',
        'Unlimited individual sessions',
        'Family therapy sessions',
        'Child & teen counseling',
        'Parenting support',
        'Crisis support for all members',
        'Educational resources',
        'Dedicated family coordinator'
      ],
      isPopular: false,
      isCurrentPlan: false,
      maxSessions: 'unlimited',
      supportLevel: 'priority',
    },
    {
      id: 'annual-premium',
      name: 'Premium Annual',
      description: 'Premium plan with annual billing (2 months free)',
      price: 1200000,
      currency: 'UGX',
      billingCycle: 'yearly',
      features: [
        'All Premium Plan features',
        '2 months free (annual billing)',
        'Priority booking',
        'Exclusive workshops',
        'Annual wellness assessment',
        'Personalized treatment plans'
      ],
      isPopular: false,
      isCurrentPlan: false,
      maxSessions: 'unlimited',
      supportLevel: 'priority',
    },
  ];

  // Mock current subscription
  const mockSubscription: UserSubscription = {
    id: 'sub_001',
    planId: 'premium',
    planName: 'Premium Plan',
    status: 'active',
    startDate: '2025-01-01',
    endDate: '2025-02-01',
    nextBillingDate: '2025-02-01',
    autoRenew: true,
    sessionsUsed: 8,
    sessionsLimit: 'unlimited',
  };

  useEffect(() => {
    loadPlansAndSubscription();
  }, []);

  const loadPlansAndSubscription = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mark current plan
      const updatedPlans = mockPlans.map(plan => ({
        ...plan,
        isCurrentPlan: plan.id === mockSubscription.planId
      }));
      
      setPlans(updatedPlans);
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
    await loadPlansAndSubscription();
    setIsRefreshing(false);
  };

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    if (plan.isCurrentPlan) {
      toast.show({
        description: 'This is your current plan',
        duration: 2000,
      });
      return;
    }

    setSelectedPlan(plan);
    Alert.alert(
      'Change Subscription Plan',
      `Switch to ${plan.name} for ${plan.currency} ${plan.price.toLocaleString()}/${plan.billingCycle}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => handlePlanChange(plan) }
      ]
    );
  };

  const handlePlanChange = async (plan: SubscriptionPlan) => {
    try {
      // Simulate API call
      toast.show({
        description: `Switching to ${plan.name}...`,
        duration: 2000,
      });
      
      // Update plans to reflect new current plan
      const updatedPlans = plans.map(p => ({
        ...p,
        isCurrentPlan: p.id === plan.id
      }));
      setPlans(updatedPlans);
      
      // Update current subscription
      if (currentSubscription) {
        setCurrentSubscription({
          ...currentSubscription,
          planId: plan.id,
          planName: plan.name,
        });
      }
    } catch (error) {
      toast.show({
        description: 'Failed to change plan',
        duration: 3000,
      });
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

  const getSupportLevelColor = (level: string) => {
    switch (level) {
      case 'basic':
        return '#9E9E9E';
      case 'premium':
        return '#2196F3';
      case 'priority':
        return '#FF9800';
      default:
        return appColors.grey3;
    }
  };

  const PlanCard: React.FC<{ plan: SubscriptionPlan }> = ({ plan }) => (
    <TouchableOpacity
      style={[
        styles.planCard,
        plan.isCurrentPlan && styles.currentPlanCard,
        plan.isPopular && styles.popularPlanCard
      ]}
      onPress={() => handlePlanSelect(plan)}
      activeOpacity={0.7}
    >
      {plan.isPopular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>Most Popular</Text>
        </View>
      )}
      
      {plan.isCurrentPlan && (
        <View style={styles.currentBadge}>
          <Icon name="check-circle" type="material" color="#4CAF50" size={16} />
          <Text style={styles.currentText}>Current Plan</Text>
        </View>
      )}
      
      <View style={styles.planHeader}>
        <Text style={styles.planName}>{plan.name}</Text>
        <View style={[styles.supportBadge, { backgroundColor: getSupportLevelColor(plan.supportLevel) }]}>
          <Text style={styles.supportText}>{plan.supportLevel.toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={styles.planDescription}>{plan.description}</Text>
      
      <View style={styles.priceContainer}>
        <Text style={styles.price}>
          {plan.currency} {plan.price.toLocaleString()}
        </Text>
        <Text style={styles.billingCycle}>/{plan.billingCycle}</Text>
      </View>
      
      {plan.trialDays && !plan.isCurrentPlan && (
        <Text style={styles.trialText}>
          {plan.trialDays}-day free trial
        </Text>
      )}
      
      <View style={styles.featuresContainer}>
        {plan.features.slice(0, 4).map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Icon name="check" type="material" color="#4CAF50" size={16} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
        {plan.features.length > 4 && (
          <Text style={styles.moreFeatures}>
            +{plan.features.length - 4} more features
          </Text>
        )}
      </View>
      
      <TouchableOpacity
        style={[
          styles.selectButton,
          plan.isCurrentPlan && styles.currentPlanButton
        ]}
        onPress={() => handlePlanSelect(plan)}
        disabled={plan.isCurrentPlan}
      >
        <Text style={[
          styles.selectButtonText,
          plan.isCurrentPlan && styles.currentPlanButtonText
        ]}>
          {plan.isCurrentPlan ? 'Current Plan' : 'Select Plan'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const PlanSkeleton: React.FC = () => (
    <View style={styles.planCard}>
      <Skeleton animation="pulse" width="60%" height={20} style={{ marginBottom: 8 }} />
      <Skeleton animation="pulse" width="100%" height={16} style={{ marginBottom: 12 }} />
      <Skeleton animation="pulse" width="40%" height={24} style={{ marginBottom: 16 }} />
      <Skeleton animation="pulse" width="100%" height={80} style={{ marginBottom: 16 }} />
      <Skeleton animation="pulse" width="100%" height={40} />
    </View>
  );

  const CurrentSubscriptionCard: React.FC = () => {
    if (!currentSubscription) return null;

    return (
      <View style={styles.subscriptionCard}>
        <View style={styles.subscriptionHeader}>
          <Text style={styles.subscriptionTitle}>Current Subscription</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentSubscription.status) }]}>
            <Text style={styles.statusText}>{currentSubscription.status.toUpperCase()}</Text>
          </View>
        </View>
        
        <Text style={styles.subscriptionPlan}>{currentSubscription.planName}</Text>
        
        <View style={styles.subscriptionDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Next Billing:</Text>
            <Text style={styles.detailValue}>{formatDate(currentSubscription.nextBillingDate)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Sessions Used:</Text>
            <Text style={styles.detailValue}>
              {currentSubscription.sessionsUsed}
              {currentSubscription.sessionsLimit !== 'unlimited' && ` / ${currentSubscription.sessionsLimit}`}
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
        
        <View style={styles.subscriptionActions}>
          <TouchableOpacity
            style={styles.manageButton}
            onPress={() => navigation.navigate('BillingHistoryScreen')}
          >
            <Text style={styles.manageButtonText}>View Billing</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelSubscription}
          >
            <Text style={styles.cancelButtonText}>Cancel Plan</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LHGenericHeader
        title="Plans & Subscriptions"
        subtitle="Manage your subscription and billing"
      />

      <FlatList
        data={isLoading ? Array(3).fill({}) : plans}
        keyExtractor={(item, index) => isLoading ? index.toString() : item.id}
        renderItem={({ item }) => 
          isLoading ? <PlanSkeleton /> : <PlanCard plan={item} />
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
        ListHeaderComponent={!isLoading ? <CurrentSubscriptionCard /> : null}
      />

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
  manageButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: appColors.AppBlue,
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  manageButtonText: {
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

export default PlansSubscriptionsScreen;
