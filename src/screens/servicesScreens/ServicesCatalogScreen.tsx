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
  weeklyPrice: number;
  monthlyPrice: number;
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
  const [billingCycle, setBillingCycle] = useState<'weekly' | 'monthly'>('weekly');
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock subscription plans - Focus on Support Groups + Direct Chat
  const mockPlans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Free',
      description: 'Get started with basic features',
      weeklyPrice: 0,
      monthlyPrice: 0,
      currency: 'UGX',
      isPopular: false,
      isCurrent: true,
      supportGroupsLimit: 0,
      directChatAccess: false,
      features: [
        'Browse support groups',
        'Book appointments (pay-per-use)',
        'Attend events (pay-per-use)',
        'Access wellness resources',
        'Community forum access',
      ],
      badge: 'FREE',
    },
    {
      id: 'basic',
      name: 'Basic',
      description: 'Join support groups and connect with peers',
      weeklyPrice: 10000,
      monthlyPrice: 35000,
      currency: 'UGX',
      isPopular: false,
      isCurrent: false,
      supportGroupsLimit: 3,
      directChatAccess: false,
      features: [
        'Join up to 3 support groups',
        'Group chat participation',
        'Priority booking for appointments',
        'All Free plan features',
        'Weekly wellness tips',
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Full access to groups plus direct therapist chat',
      weeklyPrice: 25000,
      monthlyPrice: 90000,
      currency: 'UGX',
      isPopular: true,
      isCurrent: false,
      supportGroupsLimit: 4,
      directChatAccess: true,
      features: [
        'Join up to 4 support groups',
        'Direct chat with therapist',
        'Priority support 24/7',
        'Crisis intervention access',
        'All Basic plan features',
      ],
      badge: 'MOST POPULAR',
    },
    {
      id: 'unlimited',
      name: 'Unlimited',
      description: 'Unlimited groups and premium support',
      weeklyPrice: 40000,
      monthlyPrice: 150000,
      currency: 'UGX',
      isPopular: false,
      isCurrent: false,
      supportGroupsLimit: 'unlimited',
      directChatAccess: true,
      features: [
        'Unlimited support groups',
        'Direct chat with therapist',
        'Dedicated wellness coordinator',
        'Priority crisis support',
        'All Premium plan features',
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
      toast.show({
        description: 'You are already on this plan',
        duration: 2000,
      });
      return;
    }

    // Navigate to checkout screen
    navigation.navigate('SubscriptionCheckoutScreen', {
      plan: {
        ...plan,
        billingCycle: billingCycle,
      }
    });
  };

  const getPrice = (plan: SubscriptionPlan) => {
    return billingCycle === 'weekly' ? plan.weeklyPrice : plan.monthlyPrice;
  };

  const getSavingsText = (plan: SubscriptionPlan) => {
    if (billingCycle === 'monthly' && plan.monthlyPrice > 0 && plan.weeklyPrice > 0) {
      const weeklyCost = plan.weeklyPrice * 4;
      const savings = weeklyCost - plan.monthlyPrice;
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
          <Text style={styles.billingCycleText}>/{billingCycle === 'weekly' ? 'week' : 'month'}</Text>
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

  const BillingCycleToggle = () => (
    <View style={styles.billingToggleContainer}>
      <TouchableOpacity
        style={[styles.billingToggleButton, billingCycle === 'weekly' && styles.activeBillingToggle]}
        onPress={() => setBillingCycle('weekly')}
      >
        <Text style={[styles.billingToggleText, billingCycle === 'weekly' && styles.activeBillingToggleText]}>
          Weekly
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.billingToggleButton, billingCycle === 'monthly' && styles.activeBillingToggle]}
        onPress={() => setBillingCycle('monthly')}
      >
        <Text style={[styles.billingToggleText, billingCycle === 'monthly' && styles.activeBillingToggleText]}>
          Monthly
        </Text>
        {billingCycle === 'monthly' && (
          <View style={styles.saveBadge}>
            <Text style={styles.saveBadgeText}>Save More</Text>
          </View>
        )}
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
    <View style={styles.container}>
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
        ListFooterComponent={<View style={{ height: 20 }} />}
      />
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
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  // Info Card
  infoCard: {
    backgroundColor: appColors.AppBlue + '15',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 20,
  },
  infoCardContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  infoCardText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    lineHeight: 20,
  },
  boldText: {
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  // Billing Toggle
  billingToggleContainer: {
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  billingToggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeBillingToggle: {
    backgroundColor: appColors.AppBlue,
  },
  billingToggleText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextMedium,
  },
  activeBillingToggleText: {
    color: appColors.CardBackground,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  saveBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  saveBadgeText: {
    fontSize: 10,
    color: appColors.CardBackground,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  // Plan Card
  planCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  currentPlanCard: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  popularPlanCard: {
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: 20,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    zIndex: 1,
  },
  popularBadge: {
    backgroundColor: '#FF9800',
  },
  freeBadge: {
    backgroundColor: appColors.grey4,
  },
  badgeText: {
    fontSize: 11,
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
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 8,
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
    fontSize: 32,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  billingCycleText: {
    fontSize: 16,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: 4,
  },
  savingsText: {
    fontSize: 13,
    color: '#4CAF50',
    fontFamily: appFonts.headerTextBold,
    marginBottom: 16,
  },
  // Premium Features
  premiumFeaturesContainer: {
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: appColors.grey6,
  },
  premiumFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  premiumFeatureText: {
    fontSize: 15,
    color: appColors.grey1,
    fontFamily: appFonts.headerTextMedium,
    marginLeft: 12,
    flex: 1,
  },
  disabledFeatureText: {
    color: appColors.grey4,
  },
  // Features List
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  // Select Button
  selectButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  currentPlanButton: {
    backgroundColor: appColors.grey6,
  },
  freeButton: {
    backgroundColor: appColors.grey5,
  },
  selectButtonText: {
    fontSize: 16,
    color: appColors.CardBackground,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  currentPlanButtonText: {
    color: appColors.grey3,
  },
  // Footer Links
  footerLinks: {
    marginTop: 20,
    marginBottom: 20,
  },
  footerLink: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  footerLinkText: {
    fontSize: 16,
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
});

export default SubscriptionPlansScreen;
