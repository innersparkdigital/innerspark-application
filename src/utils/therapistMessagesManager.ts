/**
 * Therapist Messages Manager
 * Handles messages/chat API calls with graceful error handling
 * Returns empty arrays for 404 (no data available)
 */
import {
    getConversations,
    getChatMessages,
    sendMessage as sendMessageAPI,
    markChatAsRead as markChatAsReadAPI,
} from '../api/therapist/messages';

/**
 * Load conversations list from API
 * Returns empty array if endpoint returns 404 (no data)
 */
export const loadConversations = async (therapistId: string) => {
    try {
        console.log('💬 Loading therapist conversations from API');
        const response = await getConversations(therapistId);

        if (response.success && response.data) {
            const conversations = response.data.conversations || [];
            console.log('📊 Conversations count:', conversations.length);
            return { success: true, conversations };
        } else {
            console.log('⚠️ API response missing success or data:', response);
            return { success: false, error: 'Invalid response format', conversations: [] };
        }
    } catch (error: any) {
        console.log('❌ Error loading conversations:', {
            message: error?.message,
            status: error?.response?.status,
            data: error?.response?.data,
        });

        // Handle 404 - no data available, return empty state
        if (error?.response?.status === 404) {
            console.log('📦 GET /th/conversations endpoint returns 404, showing empty state');
            return { success: false, error: 'No conversations available', isEmpty: true, conversations: [] };
        }

        // Other errors - return empty data
        console.log('⚠️ Non-404 error, showing empty state');
        return { success: false, error: error?.message || 'Failed to load conversations', conversations: [] };
    }
};

/**
 * Load chat messages with a specific client
 */
export const loadChatMessages = async (clientId: string, therapistId: string, page: number = 1, limit: number = 50) => {
    try {
        console.log('💬 Loading chat messages for client:', clientId);
        const response = await getChatMessages(clientId, therapistId, page, limit);

        if (response.success && response.data) {
            const messages = response.data.messages || [];
            console.log('📊 Messages count:', messages.length);
            return { success: true, messages };
        } else {
            console.log('⚠️ API response missing success or data:', response);
            return { success: false, error: 'Invalid response format', messages: [] };
        }
    } catch (error: any) {
        console.log('❌ Error loading chat messages:', error?.message);

        // Handle 404 - no messages or endpoint not implemented
        if (error?.response?.status === 404) {
            console.log('📦 GET /th/conversations/:clientId/messages endpoint returns 404');
            return { success: false, error: 'No messages available', isEmpty: true, messages: [] };
        }

        return { success: false, error: error?.message || 'Failed to load messages', messages: [] };
    }
};

/**
 * Send a message to a client
 */
export const sendMessage = async (clientId: string, content: string, therapistId: string) => {
    try {
        console.log('💬 Sending message to client:', clientId);
        const response = await sendMessageAPI(clientId, content, therapistId);

        if (response.success) {
            console.log('✅ Message sent successfully');
            return { success: true, message: response.data };
        } else {
            return { success: false, error: response.message || 'Failed to send message' };
        }
    } catch (error: any) {
        console.log('❌ Error sending message:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Send message endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to send message' };
    }
};

/**
 * Mark chat as read
 */
export const markChatAsRead = async (clientId: string, therapistId: string) => {
    try {
        console.log('✉️ Marking chat as read for client:', clientId);
        const response = await markChatAsReadAPI(clientId, therapistId);

        if (response.success) {
            console.log('✅ Chat marked as read');
            return { success: true };
        } else {
            return { success: false, error: response.message || 'Failed to mark as read' };
        }
    } catch (error: any) {
        console.log('❌ Error marking chat as read:', error?.message);

        if (error?.response?.status === 404) {
            // Silently fail for 404 on read receipts
            console.log('📦 Mark as read endpoint not implemented, continuing');
            return { success: true }; // Return success anyway
        }

        return { success: false, error: error?.message || 'Failed to mark as read' };
    }
};
