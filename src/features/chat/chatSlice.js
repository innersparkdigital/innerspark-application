import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  isRefreshing: false,
  isSending: false,
  error: null,
  lastUpdated: null,
  unreadCount: 0,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
      state.lastUpdated = Date.now();
      state.unreadCount = action.payload.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
      const convIndex = state.conversations.findIndex(c => c.id === action.payload.chatId);
      if (convIndex !== -1) {
        state.conversations[convIndex].lastMessage = action.payload.content;
        state.conversations[convIndex].lastMessageTime = action.payload.timestamp;
      }
    },
    updateMessageStatus: (state, action) => {
      const { messageId, status } = action.payload;
      const msgIndex = state.messages.findIndex(m => m.id === messageId);
      if (msgIndex !== -1) {
        state.messages[msgIndex].status = status;
      }
    },
    markConversationAsRead: (state, action) => {
      const convIndex = state.conversations.findIndex(c => c.id === action.payload);
      if (convIndex !== -1) {
        const prevUnread = state.conversations[convIndex].unreadCount || 0;
        state.conversations[convIndex].unreadCount = 0;
        state.unreadCount = Math.max(0, state.unreadCount - prevUnread);
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setRefreshing: (state, action) => {
      state.isRefreshing = action.payload;
    },
    setSending: (state, action) => {
      state.isSending = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearChat: (state) => {
      state.conversations = [];
      state.currentConversation = null;
      state.messages = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  setConversations,
  setCurrentConversation,
  setMessages,
  addMessage,
  updateMessageStatus,
  markConversationAsRead,
  setLoading,
  setRefreshing,
  setSending,
  setError,
  clearError,
  clearChat,
} = chatSlice.actions;

export const selectConversations = (state) => state.chat.conversations;
export const selectCurrentConversation = (state) => state.chat.currentConversation;
export const selectMessages = (state) => state.chat.messages;
export const selectChatLoading = (state) => state.chat.isLoading;
export const selectChatRefreshing = (state) => state.chat.isRefreshing;
export const selectChatSending = (state) => state.chat.isSending;
export const selectUnreadCount = (state) => state.chat.unreadCount;

export default chatSlice.reducer;
