/**
 * Therapist Clients Manager
 * Handles client API calls with graceful error handling
 * Returns empty arrays for 404 (no data available)
 */
import store from '../app/store';
import {
    updateClients,
    setSelectedClient,
    setClientsLoading,
} from '../features/therapist/clientsSlice';
import {
    getClients,
    getClientProfile,
} from '../api/therapist/clients';

/**
 * Load clients list from API
 * Returns empty array if endpoint returns 404 (no data)
 */
export const loadClients = async (therapistId: string, filters: any = {}) => {
    store.dispatch(setClientsLoading(true));

    try {
        console.log('👥 Loading therapist clients from API with filters:', filters);
        const response = await getClients(therapistId, filters);

        if (response.success && response.data) {
            const clients = response.data.clients || [];
            console.log('📊 Clients count:', clients.length);

            store.dispatch(updateClients(clients));
            return { success: true, clients };
        } else {
            console.log('⚠️ API response missing success or data:', response);
            store.dispatch(updateClients([]));
            return { success: false, error: 'Invalid response format' };
        }
    } catch (error: any) {
        console.log('❌ Error loading clients:', {
            message: error?.message,
            status: error?.response?.status,
            data: error?.response?.data,
        });

        // Handle 404 - no data available, return empty state
        if (error?.response?.status === 404) {
            console.log('📦 GET /th/clients endpoint returns 404, showing empty state');
            store.dispatch(updateClients([]));
            return { success: false, error: 'No clients available', isEmpty: true };
        }

        // Other errors - set empty data
        console.log('⚠️ Non-404 error, showing empty state');
        store.dispatch(updateClients([]));
        return { success: false, error: error?.message || 'Failed to load clients' };
    } finally {
        store.dispatch(setClientsLoading(false));
    }
};

/**
 * Load client profile by ID
 */
export const loadClientProfile = async (clientId: string, therapistId: string) => {
    try {
        console.log('👤 Loading client profile for ID:', clientId);
        const response = await getClientProfile(clientId, therapistId);

        if (response.success && response.data) {
            const client = response.data.client || response.data;
            console.log('✅ Client profile loaded:', client.name);

            store.dispatch(setSelectedClient(client));
            return { success: true, client };
        } else {
            console.log('⚠️ API response missing success or data:', response);
            return { success: false, error: 'Invalid response format' };
        }
    } catch (error: any) {
        console.log('❌ Error loading client profile:', error?.message);

        // Handle 404 - client not found or endpoint not implemented
        if (error?.response?.status === 404) {
            console.log('📦 GET /th/clients/:id endpoint returns 404');
            return { success: false, error: 'Client not found' };
        }

        return { success: false, error: error?.message || 'Failed to load client profile' };
    }
};
