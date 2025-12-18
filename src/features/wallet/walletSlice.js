/**
 * Wallet Redux Slice
 * Manages wallet balance, transactions, and loading states
 */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  balance: 0,
  currency: 'UGX',
  breakdown: {
    momoTopup: 0,
    rewardPoints: 0,
    wellnessCredits: 0,
  },
  transactions: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
  lastUpdated: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setBalance: (state, action) => {
      const { balance, currency, breakdown } = action.payload;
      state.balance = balance || 0;
      state.currency = currency || 'UGX';
      state.breakdown = breakdown || state.breakdown;
      state.lastUpdated = new Date().toISOString();
      state.error = null;
    },
    setTransactions: (state, action) => {
      state.transactions = action.payload || [];
      state.error = null;
    },
    addTransaction: (state, action) => {
      state.transactions.unshift(action.payload);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setRefreshing: (state, action) => {
      state.isRefreshing = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isRefreshing = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearWallet: (state) => {
      return initialState;
    },
  },
});

export const {
  setBalance,
  setTransactions,
  addTransaction,
  setLoading,
  setRefreshing,
  setError,
  clearError,
  clearWallet,
} = walletSlice.actions;

// Selectors
export const selectBalance = (state) => state.wallet.balance;
export const selectCurrency = (state) => state.wallet.currency;
export const selectBreakdown = (state) => state.wallet.breakdown;
export const selectTransactions = (state) => state.wallet.transactions;
export const selectWalletLoading = (state) => state.wallet.isLoading;
export const selectWalletRefreshing = (state) => state.wallet.isRefreshing;
export const selectWalletError = (state) => state.wallet.error;
export const selectWalletLastUpdated = (state) => state.wallet.lastUpdated;

export default walletSlice.reducer;
