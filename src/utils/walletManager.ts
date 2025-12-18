/**
 * Wallet Manager
 * Handles wallet API calls with graceful error handling
 * Returns empty data for 404 (endpoint not implemented yet)
 */
import store from '../app/store';
import {
  setBalance,
  setTransactions,
  addTransaction,
  setLoading,
  setRefreshing,
  setError,
} from '../features/wallet/walletSlice';
import {
  getWalletBalance,
  getWalletTransactions,
  getWalletTransaction,
  topupWallet,
  payoutWallet,
} from '../api/client/wallet';

/**
 * Load wallet balance from API
 * Returns empty balance if endpoint not implemented (404)
 */
export const loadWalletBalance = async (userId: string) => {
  store.dispatch(setLoading(true));
  
  try {
    console.log('💰 Loading wallet balance from API');
    const response = await getWalletBalance(userId);
    console.log('✅ API Response:', JSON.stringify(response, null, 2));
    
    if (response.success && response.data) {
      console.log('💵 Balance loaded successfully');
      store.dispatch(setBalance(response.data));
    } else {
      console.log('⚠️ API response missing success or data:', response);
      store.dispatch(setBalance({ balance: 0, currency: 'UGX', breakdown: {} }));
    }
  } catch (error: any) {
    console.log('❌ Error loading wallet balance:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });
    
    // Handle 404 - endpoint not implemented yet, return empty state
    if (error?.response?.status === 404) {
      console.log('📦 GET /client/wallet/balance endpoint returns 404, showing empty state');
      store.dispatch(setBalance({ balance: 0, currency: 'UGX', breakdown: {} }));
    } else {
      // Other errors - set error state with empty data
      console.log('⚠️ Non-404 error, showing empty state');
      store.dispatch(setBalance({ balance: 0, currency: 'UGX', breakdown: {} }));
      store.dispatch(setError(error?.message || 'Failed to load balance'));
    }
  } finally {
    store.dispatch(setLoading(false));
  }
};

/**
 * Refresh wallet balance
 */
export const refreshWalletBalance = async (userId: string) => {
  store.dispatch(setRefreshing(true));
  
  try {
    console.log('🔄 Refreshing wallet balance');
    const response = await getWalletBalance(userId);
    
    if (response.success && response.data) {
      store.dispatch(setBalance(response.data));
    } else {
      store.dispatch(setBalance({ balance: 0, currency: 'UGX', breakdown: {} }));
    }
  } catch (error: any) {
    console.log('Error refreshing balance:', error);
    
    // Handle 404 gracefully - show empty state
    if (error?.response?.status === 404) {
      store.dispatch(setBalance({ balance: 0, currency: 'UGX', breakdown: {} }));
    } else {
      store.dispatch(setBalance({ balance: 0, currency: 'UGX', breakdown: {} }));
      store.dispatch(setError(error?.message || 'Failed to refresh balance'));
    }
  } finally {
    store.dispatch(setRefreshing(false));
  }
};

/**
 * Load wallet transactions from API
 */
export const loadWalletTransactions = async (userId: string, page: number = 1, limit: number = 20) => {
  store.dispatch(setLoading(true));
  
  try {
    console.log('💳 Loading wallet transactions from API');
    const response = await getWalletTransactions(userId, page, limit);
    
    if (response.success && response.data) {
      const transactions = response.data.transactions || [];
      store.dispatch(setTransactions(transactions));
    } else {
      store.dispatch(setTransactions([]));
    }
  } catch (error: any) {
    console.log('❌ Error loading transactions:', error?.message);
    
    if (error?.response?.status === 404) {
      console.log('📦 GET /client/wallet/transactions endpoint returns 404');
      store.dispatch(setTransactions([]));
    } else {
      store.dispatch(setTransactions([]));
      store.dispatch(setError(error?.message || 'Failed to load transactions'));
    }
  } finally {
    store.dispatch(setLoading(false));
  }
};

/**
 * Refresh wallet transactions
 */
export const refreshWalletTransactions = async (userId: string, page: number = 1, limit: number = 20) => {
  store.dispatch(setRefreshing(true));
  
  try {
    console.log('🔄 Refreshing wallet transactions');
    const response = await getWalletTransactions(userId, page, limit);
    
    if (response.success && response.data) {
      const transactions = response.data.transactions || [];
      store.dispatch(setTransactions(transactions));
    } else {
      store.dispatch(setTransactions([]));
    }
  } catch (error: any) {
    console.log('Error refreshing transactions:', error);
    
    if (error?.response?.status === 404) {
      store.dispatch(setTransactions([]));
    } else {
      store.dispatch(setTransactions([]));
      store.dispatch(setError(error?.message || 'Failed to refresh transactions'));
    }
  } finally {
    store.dispatch(setRefreshing(false));
  }
};

/**
 * Get transaction details by ID
 */
export const getTransactionDetails = async (transactionId: string, userId: string) => {
  try {
    console.log('💳 Loading transaction details');
    const response = await getWalletTransaction(transactionId, userId);
    
    if (response.success && response.data) {
      return { success: true, data: response.data };
    } else {
      return { success: false, error: 'Transaction not found' };
    }
  } catch (error: any) {
    console.log('❌ Error loading transaction details:', error?.message);
    
    if (error?.response?.status === 404) {
      return { success: false, error: 'Transaction not found' };
    }
    
    return { success: false, error: error?.message || 'Failed to load transaction details' };
  }
};

/**
 * Top up wallet via Mobile Money
 */
export const topupWalletBalance = async (userId: string, amount: number, phoneNumber: string, provider: string) => {
  try {
    console.log('💰 Initiating wallet topup');
    const response = await topupWallet(userId, amount, phoneNumber, provider);
    
    if (response.success) {
      console.log('✅ Topup initiated successfully');
      
      // Refresh balance after topup
      await refreshWalletBalance(userId);
      
      return { success: true, data: response.data };
    } else {
      return { success: false, error: response.message || 'Failed to initiate topup' };
    }
  } catch (error: any) {
    console.log('❌ Error initiating topup:', error?.message);
    
    if (error?.response?.status === 404) {
      return { success: false, error: 'Topup endpoint not implemented yet' };
    }
    
    return { success: false, error: error?.message || 'Failed to initiate topup' };
  }
};

/**
 * Payout from wallet to Mobile Money
 */
export const payoutWalletBalance = async (userId: string, amount: number, phoneNumber: string, provider: string) => {
  try {
    console.log('💸 Initiating wallet payout');
    const response = await payoutWallet(userId, amount, phoneNumber, provider);
    
    if (response.success) {
      console.log('✅ Payout initiated successfully');
      
      // Refresh balance after payout
      await refreshWalletBalance(userId);
      
      return { success: true, data: response.data };
    } else {
      return { success: false, error: response.message || 'Failed to initiate payout' };
    }
  } catch (error: any) {
    console.log('❌ Error initiating payout:', error?.message);
    
    if (error?.response?.status === 404) {
      return { success: false, error: 'Payout endpoint not implemented yet' };
    }
    
    return { success: false, error: error?.message || 'Failed to initiate payout' };
  }
};
