/**
 * Therapist Messages & Chat API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get list of all conversations
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, data: Object}>} Conversations with last message and unread count
 * @example
 * const result = await getConversations(therapistId);
 * // Returns:
 * // {
 * //   success: true,
 * //   data: {
 * //     conversations: [{
 * //       id: "chat_001",
 * //       clientId: "client_123",
 * //       clientName: "John Doe",
 * //       clientAvatar: "👨",
 * //       lastMessage: "Thank you for the session",
 * //       lastMessageTime: "2025-10-23T16:45:00Z",
 * //       unreadCount: 2,
 * //       isOnline: true
 * //     }]
 * //   }
 * // }
 */
export const getConversations = async (therapistId) => {
    const response = await APIInstance.get('/th/chats', {
        params: { therapist_id: therapistId }
    });
    return response.data;
};

/**
 * Get chat messages with a client
 * @param {string} clientId - Client ID
 * @param {string} therapistId - Therapist ID
 * @param {number} [page=1] - Page number
 * @param {number} [limit=50] - Messages per page
 * @returns {Promise<{success: boolean, data: Object}>} Chat messages with pagination
 * @example
 * const result = await getChatMessages(clientId, therapistId, 1, 50);
 * // Returns:
 * // {
 * //   success: true,
 * //   data: {
 * //     messages: [{
 * //       id: "msg_001",
 * //       senderId: "client_123",
 * //       senderType: "client",
 * //       content: "Hello, I need help with anxiety",
 * //       timestamp: "2025-10-23T16:30:00Z",
 * //       read: true
 * //     }],
 * //     pagination: { currentPage: 1, totalPages: 3, hasMore: true }
 * //   }
 * // }
 */
export const getChatMessages = async (clientId, therapistId, page = 1, limit = 50) => {
    const response = await APIInstance.get(`/th/chats/${clientId}/messages`, {
        params: { therapist_id: therapistId, page, limit }
    });
    return response.data;
};

/**
 * Send message to client
 * @param {string} clientId - Client ID
 * @param {string} therapistId - Therapist ID
 * @param {string} content - Message content
 * @returns {Promise<{success: boolean, data: Object}>} Sent message with timestamp
 * @example
 * const result = await sendMessage(clientId, therapistId, "How are you feeling today?");
 * // Returns:
 * // {
 * //   success: true,
 * //   data: {
 * //     messageId: "msg_003",
 * //     timestamp: "2025-10-23T16:45:00Z"
 * //   }
 * // }
 */
export const sendMessage = async (clientId, therapistId, content) => {
    const response = await APIInstance.post(`/th/chats/${clientId}/messages`, {
        therapist_id: therapistId,
        content
    });
    return response.data;
};

/**
 * Mark chat as read
 * @param {string} clientId - Client ID
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, message: string}>} Success confirmation
 * @example
 * const result = await markChatAsRead(clientId, therapistId);
 * // Returns: { success: true, message: "Conversation marked as read" }
 */
export const markChatAsRead = async (clientId, therapistId) => {
    const response = await APIInstance.put(`/th/chats/${clientId}/read`, null, {
        params: { therapist_id: therapistId }
    });
    return response.data;
};
