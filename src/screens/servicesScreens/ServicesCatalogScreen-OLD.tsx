/**
 * Subscription Plans Screen - Browse and select subscription tiers
 * Focus: Support Groups Access + Direct Therapist Chat
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Skeleton } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import ISStatusBar from '../../components/ISStatusBar';
import { useToast } from 'native-base';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  currency: string;
  isPopular: boolean;
  isCurrent: boolean;
  supportGroupsLimit: number | 'unlimited';
  directChatAccess: boolean;
  features: string[];
  badge?: string;
}

interface SubscriptionPlansScreenProps {
  navigation: any;
}

const SubscriptionPlansScreen: React.FC<SubscriptionPlansScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock subscription plans - Focus on Support Groups + Direct Chat
  const mockPlans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Free',
      description: 'Basic access to explore the platform',
      monthlyPrice: 0,
      annualPrice: 0,
      currency: 'UGX',
      isPopular: false,
      isCurrent: false,
      supportGroupsLimit: 0,
      directChatAccess: false,
      features: [
        'Browse support groups',
        'Access wellness resources',
        'Book appointments (pay per session)',
        'Join events (pay per event)',
        'Mood tracking',
      ],
      badge: 'FREE',
    },
    {
      id: 'basic',
      name: 'Basic',
      description: 'Essential support for your mental health journey',
      monthlyPrice: 50000,
      annualPrice: 500000,
      currency: 'UGX',
      isPopular: false,
      isCurrent: false,
      supportGroupsLimit: 3,
      directChatAccess: false,
      features: [
        'Join up to 3 support groups',
        'Group chat participation',
        'Priority appointment booking',
        'Wellness resources library',
        'Progress tracking & analytics',
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Comprehensive mental health support with direct therapist access',
      monthlyPrice: 120000,
      annualPrice: 1200000,
      currency: 'UGX',
      isPopular: true,
      isCurrent: true,
      supportGroupsLimit: 4,
      directChatAccess: true,
      features: [
        'Join up to 4 support groups',
        'Direct chat with therapist',
        'Priority support (24/7)',
        'Crisis intervention access',
        'Exclusive workshops & resources',
        'Personalized wellness plans',
      ],
      badge: 'MOST POPULAR',
    },
    {
      id: 'unlimited',
      name: 'Unlimited',
      description: 'Complete access to all premium features without limits',
      monthlyPrice: 200000,
      annualPrice: 2000000,
      currency: 'UGX',
      isPopular: false,
      isCurrent: false,
      supportGroupsLimit: 'unlimited',
      directChatAccess: true,
      features: [
        'Join unlimited support groups',
        'Direct chat with therapist',
        'Priority support (24/7)',
        'Crisis intervention access',
        'All workshops & resources',
        'Dedicated wellness coordinator',
        'Family member add-ons available',
      ],
    },
  ];

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise<void>(resolve => setTimeout(resolve, 1000));
      setPlans(mockPlans);
    } catch (error) {
      toast.show({
        description: 'Failed to load plans',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadPlans();
    setIsRefreshing(false);
  };

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (plan.isCurrent) {
      navigation.navigate('PlansSubscriptionsScreen');
      return;
    }
    
    if (plan.id === 'free') {
      toast.show({
        description: 'This is the free tier',
        duration: 2000,
      });
      return;
    }

    // Navigate to payment flow
    toast.show({
      description: `Subscribing to ${plan.name} plan...`,
      duration: 2000,
    });
  };

  const getPrice = (plan: SubscriptionPlan) => {
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
    return price;
  };

  const getSavingsText = (plan: SubscriptionPlan) => {
    if (billingCycle === 'annual' && plan.annualPrice > 0) {
      const monthlyCost = plan.monthlyPrice * 12;
      const savings = monthlyCost - plan.annualPrice;
      if (savings > 0) {
        return `Save ${plan.currency} ${savings.toLocaleString()}`;
      }
    }
    return null;
  };

  const PlanCard: React.FC<{ plan: SubscriptionPlan }> = ({ plan }) => {
    const price = getPrice(plan);
    const savings = getSavingsText(plan);

    return (
      <TouchableOpacity
        style={[
          styles.planCard,
          plan.isCurrent && styles.currentPlanCard,
          plan.isPopular && styles.popularPlanCard,
        ]}
        onPress={() => handleSelectPlan(plan)}
        activeOpacity={0.7}
      >
        {plan.badge && (
          <View style={[
            styles.badge,
            plan.isPopular ? styles.popularBadge : styles.freeBadge
          ]}>
            <Text style={styles.badgeText}>{plan.badge}</Text>
          </View>
        )}

        {plan.isCurrent && (
          <View style={styles.currentBadge}>
            <Icon name="check-circle" type="material" color="#4CAF50" size={16} />
            <Text style={styles.currentText}>Current Plan</Text>
          </View>
        )}

        <Text style={styles.planName}>{plan.name}</Text>
        <Text style={styles.planDescription}>{plan.description}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {plan.currency} {price.toLocaleString()}
          </Text>
          <Text style={styles.billingCycleText}>/{billingCycle}</Text>
        </View>

        {savings && (
          <Text style={styles.savingsText}>{savings}</Text>
        )}

        {/* Premium Features Highlight */}
        <View style={styles.premiumFeaturesContainer}>
          <View style={styles.premiumFeature}>
            <Icon name="groups" type="material" color={appColors.AppBlue} size={20} />
            <Text style={styles.premiumFeatureText}>
              {plan.supportGroupsLimit === 'unlimited'
                ? 'Unlimited Groups'
                : plan.supportGroupsLimit === 0
                ? 'No Group Access'
                : `Up to ${plan.supportGroupsLimit} Groups`}
            </Text>
          </View>

          <View style={styles.premiumFeature}>
            <Icon
              name={plan.directChatAccess ? 'chat' : 'chat-bubble-outline'}
              type="material"
              color={plan.directChatAccess ? appColors.AppBlue : appColors.grey4}
              size={20}
            />
            <Text style={[
              styles.premiumFeatureText,
              !plan.directChatAccess && styles.disabledFeatureText
            ]}>
              {plan.directChatAccess ? 'Direct Therapist Chat' : 'No Direct Chat'}
            </Text>
          </View>
        </View>

        {/* Features List */}
        <View style={styles.featuresContainer}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Icon name="check" type="material" color="#4CAF50" size={16} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.selectButton,
            plan.isCurrent && styles.currentPlanButton,
            plan.id === 'free' && styles.freeButton,
          ]}
          onPress={() => handleSelectPlan(plan)}
        >
          <Text style={[
            styles.selectButtonText,
            plan.isCurrent && styles.currentPlanButtonText,
          ]}>
            {plan.isCurrent ? 'Manage Plan' : plan.id === 'free' ? 'Current Tier' : 'Select Plan'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const PlanSkeleton: React.FC = () => (
    <View style={styles.planCard}>
      <Skeleton animation="pulse" width="60%" height={24} style={{ marginBottom: 8 }} />
      <Skeleton animation="pulse" width="100%" height={16} style={{ marginBottom: 16 }} />
      <Skeleton animation="pulse" width="40%" height={32} style={{ marginBottom: 16 }} />
      <Skeleton animation="pulse" width="100%" height={120} style={{ marginBottom: 16 }} />
      <Skeleton animation="pulse" width="100%" height={48} />
    </View>
  );

  const BillingCycleToggle: React.FC = () => (
    <View style={styles.billingToggleContainer}>
      <TouchableOpacity
        style={[
          styles.billingToggleButton,
          billingCycle === 'monthly' && styles.activeBillingToggle,
        ]}
        onPress={() => setBillingCycle('monthly')}
      >
        <Text style={[
          styles.billingToggleText,
          billingCycle === 'monthly' && styles.activeBillingToggleText,
        ]}>
          Monthly
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.billingToggleButton,
          billingCycle === 'annual' && styles.activeBillingToggle,
        ]}
        onPress={() => setBillingCycle('annual')}
      >
        <Text style={[
          styles.billingToggleText,
          billingCycle === 'annual' && styles.activeBillingToggleText,
        ]}>
          Annual
        </Text>
        <View style={styles.saveBadge}>
          <Text style={styles.saveBadgeText}>Save 17%</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const InfoCard: React.FC = () => (
    <View style={styles.infoCard}>
      <Icon name="info-outline" type="material" color={appColors.AppBlue} size={24} />
      <View style={styles.infoCardContent}>
        <Text style={styles.infoCardTitle}>What's Included?</Text>
        <Text style={styles.infoCardText}>
          Subscriptions unlock <Text style={styles.boldText}>Support Groups</Text> and <Text style={styles.boldText}>Direct Therapist Chat</Text>. Appointments and Events are pay-per-use.
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={24} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Subscription Plans</Text>
            <Text style={styles.headerSubtitle}>Choose the plan that fits your needs</Text>
          </View>
          <View style={styles.headerRightPlaceholder} />
        </View>
      </View>

      <FlatList
        data={isLoading ? Array(4).fill({}) : plans}
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
        ListHeaderComponent={
          <View>
            <InfoCard />
            <BillingCycleToggle />
          </View>
        }
        ListFooterComponent={
          <View style={styles.footerLinks}>
            <TouchableOpacity
              style={styles.footerLink}
              onPress={() => navigation.navigate('PlansSubscriptionsScreen')}
            >
              <Text style={styles.footerLinkText}>Manage My Subscription</Text>
              <Icon name="chevron-right" type="material" color={appColors.AppBlue} size={20} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.footerLink}
              onPress={() => navigation.navigate('BillingHistoryScreen')}
            >
              <Text style={styles.footerLinkText}>View Billing History</Text>
              <Icon name="chevron-right" type="material" color={appColors.AppBlue} size={20} />
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
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
  content: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: appColors.AppBlue + '15',
  },
  tabText: {
    fontSize: 14,
    color: appColors.grey3,
    marginLeft: 6,
    fontFamily: appFonts.headerTextRegular,
  },
  activeTabText: {
    color: appColors.AppBlue,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  serviceCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FF9800',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 1,
  },
  popularText: {
    fontSize: 12,
    color: appColors.CardBackground,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  serviceImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  serviceContent: {
    padding: 16,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginRight: 12,
  },
  categoryBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 10,
    color: appColors.CardBackground,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  serviceDescription: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    marginBottom: 12,
    lineHeight: 20,
  },
  serviceMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: 4,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: appColors.grey6,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
  },
  serviceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: appColors.AppBlue,
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 14,
    color: appColors.AppBlue,
    fontWeight: '600',
    fontFamily: appFonts.headerTextBold,
  },
  subscribeButton: {
    flex: 1,
    backgroundColor: appColors.AppBlue,
    borderRadius: 8,
    paddingVertical: 12,
    marginLeft: 8,
    alignItems: 'center',
  },
  subscribeButtonText: {
    fontSize: 14,
    color: appColors.CardBackground,
    fontWeight: '600',
    fontFamily: appFonts.headerTextBold,
  },
  navigationCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 16,
  },
  navigationCardContent: {
    flex: 1,
    marginLeft: 16,
  },
  navigationCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  navigationCardSubtitle: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  skeletonImage: {
    borderRadius: 0,
  },
  skeletonActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
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
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryButtonText: {
    fontSize: 14,
    color: appColors.CardBackground,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
});

export default SubscriptionPlansScreen;
