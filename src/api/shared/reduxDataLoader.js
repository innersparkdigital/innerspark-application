/**
 * Redux Data Loader - Background service for loading critical data into Redux
 * 
 * This service loads essential user data in the background and populates Redux stores.
 * It should be called once after successful authentication to ensure critical data
 * is available throughout the app without blocking the UI.
 * 
 * Usage:
 * import { loadCriticalDataToRedux } from '../api/shared/reduxDataLoader';
 * 
 * // After login/authentication
 * loadCriticalDataToRedux(userId, dispatch);
 */

import { getEmergencyContacts, getCrisisLines, getSafetyPlan } from '../client/emergency';
import { getProfile as getClientProfile } from '../client/profile';
import { getPlans, getCurrentSubscription, getBillingHistory } from '../client/subscriptions';
import { getPrivacySettings, getNotificationSettings, getAppearanceSettings } from '../client/settings';
import { 
  setEmergencyContacts, 
  setCrisisLines, 
  setSafetyPlan 
} from '../../features/emergency/emergencySlice';
import { 
  setAvailablePlans, 
  setCurrentSubscription, 
  setBillingHistory 
} from '../../features/subscription/subscriptionSlice';
import { setUserProfile } from '../../features/user/userDataSlice';
import { 
  setPrivacySettings, 
  setNotificationSettings, 
  setAppearanceSettings 
} from '../../features/settings/userSettingsSlice';

/**
 * Load all critical data into Redux stores
 * This runs in the background and doesn't block the UI
 * 
 * @param {string} userId - The authenticated user's ID
 * @param {Function} dispatch - Redux dispatch function
 * @returns {Promise<Object>} Status object with success/failure counts
 */
export const loadCriticalDataToRedux = async (userId, dispatch) => {
  console.log('🔄 Starting background Redux data load for user:', userId);
  
  // Clear all emergency data first to prevent stale data
  dispatch(setEmergencyContacts([]));
  dispatch(setCrisisLines([]));
  
  const results = {
    success: [],
    failed: [],
    total: 0,
  };

  // Privacy Settings
  try {
    const privacyResponse = await getPrivacySettings(userId);
    const privacyData = privacyResponse?.data;

    if (privacyData) {
      dispatch(setPrivacySettings({
        allowMessages: privacyData.allowMessages ?? true,
        dataSharing: privacyData.dataSharing ?? false,
        profileVisibility: privacyData.profileVisibility ?? 'private',
        showOnlineStatus: privacyData.showOnlineStatus ?? true,
      }));
      results.success.push('privacy-settings');
      console.log('✅ Privacy settings loaded to Redux');
    } else {
      results.success.push('privacy-settings');
      console.log('ℹ️ Using default privacy settings');
    }
  } catch (error) {
    console.error('❌ Failed to load privacy settings:', error);
    results.failed.push('privacy-settings');
  }
  results.total++;

  // Notification Settings
  try {
    const notificationResponse = await getNotificationSettings(userId);
    const notificationData = notificationResponse?.data;

    if (notificationData) {
      dispatch(setNotificationSettings({
        appointmentReminders: notificationData.appointmentReminders ?? true,
        emailNotifications: notificationData.emailNotifications ?? true,
        eventUpdates: notificationData.eventUpdates ?? true,
        goalReminders: notificationData.goalReminders ?? true,
        pushNotifications: notificationData.pushNotifications ?? true,
        smsNotifications: notificationData.smsNotifications ?? false,
      }));
      results.success.push('notification-settings');
      console.log('✅ Notification settings loaded to Redux');
    } else {
      results.success.push('notification-settings');
      console.log('ℹ️ Using default notification settings');
    }
  } catch (error) {
    console.error('❌ Failed to load notification settings:', error);
    results.failed.push('notification-settings');
  }
  results.total++;

  // Appearance Settings
  try {
    const appearanceResponse = await getAppearanceSettings(userId);
    const appearanceData = appearanceResponse?.data;

    if (appearanceData) {
      dispatch(setAppearanceSettings({
        theme: appearanceData.theme ?? 'light',
        useSystemTheme: appearanceData.useSystemTheme ?? false,
        accentColor: appearanceData.accentColor ?? '#5D7BF5',
        fontStyle: appearanceData.fontStyle ?? 'system',
        highContrast: appearanceData.highContrast ?? false,
        reducedMotion: appearanceData.reducedMotion ?? false,
        largeText: appearanceData.largeText ?? false,
      }));
      results.success.push('appearance-settings');
      console.log('✅ Appearance settings loaded to Redux');
    } else {
      results.success.push('appearance-settings');
      console.log('ℹ️ Using default appearance settings');
    }
  } catch (error) {
    console.error('❌ Failed to load appearance settings:', error);
    results.failed.push('appearance-settings');
  }
  results.total++;

  // Profile (full user profile)
  try {
    const profileResponse = await getClientProfile(userId);
    const profileData = profileResponse?.data || null;

    if (profileData) {
      const mappedProfile = {
        bio: profileData.bio ?? null,
        dateOfBirth: profileData.dateOfBirth ?? null,
        email: profileData.email ?? null,
        firstName: profileData.firstName ?? null,
        gender: profileData.gender ?? null,
        joinedDate: profileData.joinedDate ?? null,
        lastName: profileData.lastName ?? null,
        phoneNumber: profileData.phoneNumber ?? null,
        profileImage: profileData.profileImage ?? null,
      };

      dispatch(setUserProfile(mappedProfile));
      results.success.push('profile');
      console.log('✅ Profile loaded to Redux');
    } else {
      dispatch(setUserProfile(null));
      results.success.push('profile');
      console.log('ℹ️ No profile data found');
    }
  } catch (error) {
    console.error('❌ Failed to load profile:', error);
    results.failed.push('profile');
  }
  results.total++;

  // Emergency Contacts
  try {
    const contactsResponse = await getEmergencyContacts(userId);
    const contactsData = contactsResponse.data?.contacts || contactsResponse.contacts || [];
    
    if (contactsData.length > 0) {
      const mappedContacts = contactsData.map((contact) => ({
        id: contact.id || contact.contact_id,
        name: contact.name,
        relationship: contact.relationship,
        phone: contact.phone || contact.phoneNumber || contact.phone_number,
        email: contact.email,
        isPrimary: contact.isPrimary || contact.is_primary || false,
      }));
      dispatch(setEmergencyContacts(mappedContacts));
      results.success.push('emergency_contacts');
      console.log('✅ Emergency contacts loaded to Redux:', mappedContacts.length);
    } else {
      dispatch(setEmergencyContacts([]));
      results.success.push('emergency_contacts');
      console.log('ℹ️ No emergency contacts found');
    }
  } catch (error) {
    console.error('❌ Failed to load emergency contacts:', error);
    // Always dispatch empty array on error to clear stale data
    dispatch(setEmergencyContacts([]));
    results.failed.push('emergency_contacts');
  }
  results.total++;

  // Crisis Lines
  try {
    const crisisLinesResponse = await getCrisisLines(userId);
    const crisisLinesData = crisisLinesResponse.data?.hotlines || crisisLinesResponse.hotlines || [];
    
    if (crisisLinesData.length > 0) {
      const mappedCrisisLines = crisisLinesData.map((line) => ({
        id: line.id,
        name: line.name,
        phone: line.phoneNumber || line.phone_number || line.phone,
        description: line.description,
        available24h: line.available === '24/7' || line.available24h || true,
        icon: line.icon || 'phone-in-talk',
        color: line.color || '#F44336',
      }));
      dispatch(setCrisisLines(mappedCrisisLines));
      results.success.push('crisis_lines');
      console.log('✅ Crisis lines loaded to Redux:', mappedCrisisLines.length);
    } else {
      dispatch(setCrisisLines([]));
      results.success.push('crisis_lines');
      console.log('ℹ️ No crisis lines found');
    }
  } catch (error) {
    console.error('❌ Failed to load crisis lines:', error);
    results.failed.push('crisis_lines');
  }
  results.total++;

  // Safety Plan
  try {
    const safetyPlanResponse = await getSafetyPlan(userId);
    const planData = safetyPlanResponse.data?.safetyPlan || safetyPlanResponse.safetyPlan || safetyPlanResponse.data || {};
    
    const mappedPlan = {
      warningSignsPersonal: planData.warning_signs_personal || planData.warningSignsPersonal || [],
      warningSignsCrisis: planData.warning_signs_crisis || planData.warningSignsCrisis || [],
      copingStrategies: planData.coping_strategies || planData.copingStrategies || [],
      socialContacts: planData.social_contacts || planData.socialContacts || [],
      professionalContacts: planData.professional_contacts || planData.professionalContacts || [],
      environmentSafety: planData.environment_safety || planData.environmentSafety || [],
      reasonsToLive: planData.reasons_to_live || planData.reasonsToLive || [],
      emergencyContacts: planData.emergency_contacts || planData.emergencyContacts || [],
      lastUpdated: planData.last_updated || planData.lastUpdated || null,
    };
    
    dispatch(setSafetyPlan(mappedPlan));
    results.success.push('safety_plan');
    console.log('✅ Safety plan loaded to Redux');
  } catch (error) {
    console.error('❌ Failed to load safety plan:', error);
    results.failed.push('safety_plan');
  }
  results.total++;

  // Available Subscription Plans
  try {
    const plansResponse = await getPlans(userId);
    const plansData = plansResponse.plans || [];
    
    if (plansData.length > 0) {
      const mappedPlans = plansData.map((plan) => ({
        id: plan.id || plan.plan_id,
        name: plan.name,
        description: plan.description,
        weeklyPrice: plan.weeklyPrice || plan.weekly_price || 0,
        monthlyPrice: plan.monthlyPrice || plan.monthly_price || 0,
        currency: plan.currency || 'UGX',
        billingCycle: plan.billingCycle || plan.billing_cycle || 'monthly',
        isPopular: plan.isPopular || plan.is_popular || false,
        isCurrent: plan.isCurrent || plan.is_current || false,
        supportGroupsLimit: plan.supportGroupsLimit || plan.support_groups_limit || 0,
        directChatAccess: plan.directChatAccess || plan.direct_chat_access || false,
        features: plan.features || [],
      }));
      dispatch(setAvailablePlans(mappedPlans));
      results.success.push('subscription_plans');
      console.log('✅ Subscription plans loaded to Redux:', mappedPlans.length);
    } else {
      dispatch(setAvailablePlans([]));
      results.success.push('subscription_plans');
      console.log('ℹ️ No subscription plans found');
    }
  } catch (error) {
    console.error('❌ Failed to load subscription plans:', error);
    results.failed.push('subscription_plans');
  }
  results.total++;

  // Current Subscription
  try {
    const subscriptionResponse = await getCurrentSubscription(userId);
    
    if (subscriptionResponse.subscription) {
      const sub = subscriptionResponse.subscription;
      const mappedSubscription = {
        id: sub.id || sub.subscription_id,
        planId: sub.planId || sub.plan_id,
        planName: sub.planName || sub.plan_name,
        status: sub.status || 'active',
        startDate: sub.start_date || sub.startDate,
        endDate: sub.end_date || sub.endDate,
        nextBillingDate: sub.next_billing_date || sub.nextBillingDate,
        billingCycle: sub.billing_cycle || sub.billingCycle || 'monthly',
        amount: sub.amount,
        currency: sub.currency || 'UGX',
        autoRenew: sub.auto_renew !== undefined ? sub.auto_renew : sub.autoRenew !== undefined ? sub.autoRenew : true,
        groupsJoined: sub.groups_joined || sub.groupsJoined || 0,
        groupsLimit: sub.groups_limit || sub.groupsLimit || 0,
        directChatActive: sub.direct_chat_active !== undefined ? sub.direct_chat_active : sub.directChatActive || false,
      };
      dispatch(setCurrentSubscription(mappedSubscription));
      results.success.push('current_subscription');
      console.log('✅ Current subscription loaded to Redux');
    } else {
      dispatch(setCurrentSubscription(null));
      results.success.push('current_subscription');
      console.log('ℹ️ No active subscription found');
    }
  } catch (error) {
    console.error('❌ Failed to load current subscription:', error);
    results.failed.push('current_subscription');
  }
  results.total++;

  // Billing History (last 20 records)
  try {
    const billingResponse = await getBillingHistory(userId, 1, 20);
    const billingsData = billingResponse.data?.billings || [];
    
    if (billingsData.length > 0) {
      const mappedInvoices = billingsData.map((billing) => ({
        id: billing.id || billing.billing_id,
        date: billing.date || billing.billing_date,
        amount: billing.amount,
        currency: billing.currency || 'UGX',
        status: billing.status,
        planName: billing.planName || billing.plan_name,
        billingCycle: billing.billingCycle || billing.billing_cycle,
        paymentMethod: billing.paymentMethod || billing.payment_method,
        invoiceUrl: billing.invoiceUrl || billing.invoice_url,
      }));
      dispatch(setBillingHistory(mappedInvoices));
      results.success.push('billing_history');
      console.log('✅ Billing history loaded to Redux:', mappedInvoices.length);
    } else {
      dispatch(setBillingHistory([]));
      results.success.push('billing_history');
      console.log('ℹ️ No billing history found');
    }
  } catch (error) {
    console.error('❌ Failed to load billing history:', error);
    results.failed.push('billing_history');
  }
  results.total++;

  // Summary
  console.log('📊 Redux data load complete:');
  console.log(`   ✅ Success: ${results.success.length}/${results.total}`);
  console.log(`   ❌ Failed: ${results.failed.length}/${results.total}`);
  
  if (results.failed.length > 0) {
    console.log('   Failed items:', results.failed.join(', '));
  }

  return results;
};

/**
 * Load only emergency-related data (lighter version)
 * Use this when you only need emergency data
 * 
 * @param {string} userId - The authenticated user's ID
 * @param {Function} dispatch - Redux dispatch function
 */
export const loadEmergencyDataToRedux = async (userId, dispatch) => {
  console.log('🔄 Loading emergency data to Redux...');
  
  try {
    // Emergency Contacts
    const contactsResponse = await getEmergencyContacts(userId);
    const contactsData = contactsResponse.data?.contacts || contactsResponse.contacts || [];
    
    if (contactsData.length > 0) {
      const mappedContacts = contactsData.map((contact) => ({
        id: contact.id || contact.contact_id,
        name: contact.name,
        relationship: contact.relationship,
        phone: contact.phone || contact.phoneNumber || contact.phone_number,
        email: contact.email,
        isPrimary: contact.isPrimary || contact.is_primary || false,
      }));
      dispatch(setEmergencyContacts(mappedContacts));
    } else {
      dispatch(setEmergencyContacts([]));
    }

    // Crisis Lines
    const crisisLinesResponse = await getCrisisLines(userId);
    const crisisLinesData = crisisLinesResponse.data?.hotlines || crisisLinesResponse.hotlines || [];
    
    if (crisisLinesData.length > 0) {
      const mappedCrisisLines = crisisLinesData.map((line) => ({
        id: line.id,
        name: line.name,
        phone: line.phoneNumber || line.phone_number || line.phone,
        description: line.description,
        available24h: line.available === '24/7' || line.available24h || true,
        icon: line.icon || 'phone-in-talk',
        color: line.color || '#F44336',
      }));
      dispatch(setCrisisLines(mappedCrisisLines));
    } else {
      dispatch(setCrisisLines([]));
    }

    console.log('✅ Emergency data loaded to Redux');
  } catch (error) {
    console.error('❌ Failed to load emergency data:', error);
  }
};

/**
 * Load only subscription-related data (lighter version)
 * Use this when you only need subscription data
 * 
 * @param {string} userId - The authenticated user's ID
 * @param {Function} dispatch - Redux dispatch function
 */
export const loadSubscriptionDataToRedux = async (userId, dispatch) => {
  console.log('🔄 Loading subscription data to Redux...');
  
  try {
    // Available Plans
    const plansResponse = await getPlans(userId);
    const plansData = plansResponse.plans || [];
    
    if (plansData.length > 0) {
      const mappedPlans = plansData.map((plan) => ({
        id: plan.id || plan.plan_id,
        name: plan.name,
        description: plan.description,
        weeklyPrice: plan.weeklyPrice || plan.weekly_price || 0,
        monthlyPrice: plan.monthlyPrice || plan.monthly_price || 0,
        currency: plan.currency || 'UGX',
        billingCycle: plan.billingCycle || plan.billing_cycle || 'monthly',
        isPopular: plan.isPopular || plan.is_popular || false,
        isCurrent: plan.isCurrent || plan.is_current || false,
        supportGroupsLimit: plan.supportGroupsLimit || plan.support_groups_limit || 0,
        directChatAccess: plan.directChatAccess || plan.direct_chat_access || false,
        features: plan.features || [],
      }));
      dispatch(setAvailablePlans(mappedPlans));
    } else {
      dispatch(setAvailablePlans([]));
    }

    // Current Subscription
    const subscriptionResponse = await getCurrentSubscription(userId);
    
    if (subscriptionResponse.subscription) {
      const sub = subscriptionResponse.subscription;
      const mappedSubscription = {
        id: sub.id || sub.subscription_id,
        planId: sub.planId || sub.plan_id,
        planName: sub.planName || sub.plan_name,
        status: sub.status || 'active',
        startDate: sub.start_date || sub.startDate,
        endDate: sub.end_date || sub.endDate,
        nextBillingDate: sub.next_billing_date || sub.nextBillingDate,
        billingCycle: sub.billing_cycle || sub.billingCycle || 'monthly',
        amount: sub.amount,
        currency: sub.currency || 'UGX',
        autoRenew: sub.auto_renew !== undefined ? sub.auto_renew : sub.autoRenew !== undefined ? sub.autoRenew : true,
        groupsJoined: sub.groups_joined || sub.groupsJoined || 0,
        groupsLimit: sub.groups_limit || sub.groupsLimit || 0,
        directChatActive: sub.direct_chat_active !== undefined ? sub.direct_chat_active : sub.directChatActive || false,
      };
      dispatch(setCurrentSubscription(mappedSubscription));
    } else {
      dispatch(setCurrentSubscription(null));
    }

    console.log('✅ Subscription data loaded to Redux');
  } catch (error) {
    console.error('❌ Failed to load subscription data:', error);
  }
};
