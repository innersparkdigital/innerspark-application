/**
 * Subscription Slice - Redux state management for subscription plans and user subscriptions
 * Manages available plans, current subscription, billing, and payment flow
 */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Available subscription plans
  availablePlans: [
    {
      id: 'free',
      name: 'Free',
      description: 'Get started with basic features',
      weeklyPrice: 0,
      monthlyPrice: 0,
      currency: 'UGX',
      isPopular: false,
      supportGroupsLimit: 0,
      directChatAccess: false,
      features: [
        'Browse support groups',
        'Book appointments (pay-per-use)',
        'Attend events (pay-per-use)',
        'Access wellness resources',
        'Community forum access',
      ],
    },
    {
      id: 'basic',
      name: 'Basic',
      description: 'Join support groups and connect with peers',
      weeklyPrice: 10000,
      monthlyPrice: 35000,
      currency: 'UGX',
      isPopular: false,
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
      supportGroupsLimit: 4,
      directChatAccess: true,
      features: [
        'Join up to 4 support groups',
        'Direct chat with therapist',
        'Priority support 24/7',
        'Crisis intervention access',
        'All Basic plan features',
      ],
    },
    {
      id: 'unlimited',
      name: 'Unlimited',
      description: 'Unlimited groups and premium support',
      weeklyPrice: 40000,
      monthlyPrice: 150000,
      currency: 'UGX',
      isPopular: false,
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
  ],
  
  // Current user subscription
  currentSubscription: {
    planId: 'premium',
    planName: 'Premium Plan',
    status: 'active',
    startDate: '2024-10-01',
    endDate: '2024-12-31',
    nextBillingDate: '2024-11-01',
    billingCycle: 'monthly',
    amount: 90000,
    currency: 'UGX',
    autoRenew: true,
    groupsJoined: 3,
    groupsLimit: 4,
    directChatActive: true,
  },
  
  // Billing history
  billingHistory: [],
  
  // Payment flow state
  checkoutData: null,
  paymentInProgress: false,
  paymentError: null,
  
  // Loading states
  isLoadingPlans: false,
  isLoadingSubscription: false,
  isProcessingPayment: false,
  error: null,
  
  // Last updated
  lastUpdated: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setAvailablePlans: (state, action) => {
      state.availablePlans = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    
    setCurrentSubscription: (state, action) => {
      state.currentSubscription = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    
    updateSubscriptionStatus: (state, action) => {
      if (state.currentSubscription) {
        state.currentSubscription.status = action.payload;
      }
    },
    
    toggleAutoRenew: (state) => {
      if (state.currentSubscription) {
        state.currentSubscription.autoRenew = !state.currentSubscription.autoRenew;
      }
    },
    
    updateGroupsJoined: (state, action) => {
      if (state.currentSubscription) {
        state.currentSubscription.groupsJoined = action.payload;
      }
    },
    
    setBillingHistory: (state, action) => {
      state.billingHistory = action.payload;
    },
    
    addBillingRecord: (state, action) => {
      state.billingHistory.unshift(action.payload);
    },
    
    setCheckoutData: (state, action) => {
      state.checkoutData = action.payload;
    },
    
    clearCheckoutData: (state) => {
      state.checkoutData = null;
      state.paymentError = null;
    },
    
    startPayment: (state) => {
      state.paymentInProgress = true;
      state.paymentError = null;
    },
    
    paymentSuccess: (state, action) => {
      state.paymentInProgress = false;
      state.paymentError = null;
      state.currentSubscription = action.payload.subscription;
      
      if (action.payload.billingRecord) {
        state.billingHistory.unshift(action.payload.billingRecord);
      }
      
      state.lastUpdated = new Date().toISOString();
    },
    
    paymentFailure: (state, action) => {
      state.paymentInProgress = false;
      state.paymentError = action.payload;
    },
    
    cancelSubscription: (state) => {
      if (state.currentSubscription) {
        state.currentSubscription.status = 'cancelled';
        state.currentSubscription.autoRenew = false;
      }
    },
    
    reactivateSubscription: (state) => {
      if (state.currentSubscription) {
        state.currentSubscription.status = 'active';
        state.currentSubscription.autoRenew = true;
      }
    },
    
    setLoadingPlans: (state, action) => {
      state.isLoadingPlans = action.payload;
    },
    
    setLoadingSubscription: (state, action) => {
      state.isLoadingSubscription = action.payload;
    },
    
    setProcessingPayment: (state, action) => {
      state.isProcessingPayment = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    resetSubscriptionState: () => initialState,
  },
});

export const {
  setAvailablePlans,
  setCurrentSubscription,
  updateSubscriptionStatus,
  toggleAutoRenew,
  updateGroupsJoined,
  setBillingHistory,
  addBillingRecord,
  setCheckoutData,
  clearCheckoutData,
  startPayment,
  paymentSuccess,
  paymentFailure,
  cancelSubscription,
  reactivateSubscription,
  setLoadingPlans,
  setLoadingSubscription,
  setProcessingPayment,
  setError,
  clearError,
  resetSubscriptionState,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
