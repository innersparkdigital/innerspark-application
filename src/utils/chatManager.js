import {
  setConversations,
  setCurrentConversation,
  setMessages,
  addMessage,
  markConversationAsRead,
  setLoading,
  setRefreshing,
  setSending,
  setError,
  clearError,
} from '../features/chat/chatSlice';
import {
  getChats,
  getChatMessages,
  sendChatMessage as sendMessageAPI,
  markChatAsRead,
} from '../api/client/messages';

export const loadConversations = (userId) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearError());

  try {
    const response = await getChats(userId);
    
    if (response.success && response.data?.conversations) {
      dispatch(setConversations(response.data.conversations));
      return { success: true, conversations: response.data.conversations };
    } else {
      console.log('ℹ️ No conversations found - empty state');
      dispatch(setConversations([]));
      return { success: true, conversations: [] };
    }
  } catch (error) {
    console.error('❌ Error loading conversations:', error);
    dispatch(setError(error.message || 'Failed to load conversations'));
    dispatch(setConversations([]));
    return { success: false, error };
  } finally {
    dispatch(setLoading(false));
  }
};

export const refreshConversations = (userId) => async (dispatch) => {
  dispatch(setRefreshing(true));
  dispatch(clearError());

  try {
    const response = await getChats(userId);
    
    if (response.success && response.data?.conversations) {
      dispatch(setConversations(response.data.conversations));
      return { success: true, conversations: response.data.conversations };
    } else {
      dispatch(setConversations([]));
      return { success: true, conversations: [] };
    }
  } catch (error) {
    console.error('❌ Error refreshing conversations:', error);
    dispatch(setConversations([]));
    return { success: false, error };
  } finally {
    dispatch(setRefreshing(false));
  }
};

export const loadMessages = (userId, chatId, page = 1) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearError());

  try {
    const response = await getChatMessages(chatId, userId, page);
    
    if (response.success && response.data?.messages) {
      dispatch(setMessages(response.data.messages));
      return { success: true, messages: response.data.messages };
    } else {
      console.log('ℹ️ No messages found - empty state');
      dispatch(setMessages([]));
      return { success: true, messages: [] };
    }
  } catch (error) {
    console.error('❌ Error loading messages:', error);
    dispatch(setError(error.message || 'Failed to load messages'));
    dispatch(setMessages([]));
    return { success: false, error };
  } finally {
    dispatch(setLoading(false));
  }
};

export const sendChatMessage = (userId, chatId, content, type = 'text') => async (dispatch) => {
  dispatch(setSending(true));
  dispatch(clearError());

  try {
    const response = await sendMessageAPI(chatId, userId, content, type);
    
    if (response.success && response.data) {
      const newMessage = {
        id: response.data.messageId,
        chatId,
        senderId: userId,
        content,
        timestamp: response.data.timestamp,
        status: response.data.status || 'sent',
        type,
      };
      dispatch(addMessage(newMessage));
      return { success: true, message: newMessage };
    } else {
      dispatch(setError('Failed to send message'));
      return { success: false, error: 'Failed to send message' };
    }
  } catch (error) {
    console.error('❌ Error sending message:', error);
    dispatch(setError(error.message || 'Failed to send message'));
    return { success: false, error };
  } finally {
    dispatch(setSending(false));
  }
};

export const markConversationRead = (userId, chatId) => async (dispatch) => {
  try {
    const response = await markChatAsRead(chatId, userId);
    
    if (response.success) {
      dispatch(markConversationAsRead(chatId));
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error('❌ Error marking as read:', error);
    return { success: false, error };
  }
};
