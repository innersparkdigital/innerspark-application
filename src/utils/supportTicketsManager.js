/**
 * Support Tickets Manager
 * Handles all support ticket operations with Redux integration
 */
import {
  setTickets,
  setCurrentTicket,
  addTicket,
  updateTicket,
  addMessageToTicket,
  markTicketAsRead,
  setLoading,
  setRefreshing,
  setSubmitting,
  setError,
  clearError,
} from '../features/supportTickets/supportTicketsSlice';

import {
  getTickets,
  getTicketById,
  createTicket,
  addTicketMessage,
  closeTicket,
  reopenTicket,
} from '../api/client/supportTickets';

/**
 * Load all tickets for a user
 */
export const loadTickets = (userId) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearError());
  
  try {
    console.log('📞 Loading support tickets for user:', userId);
    const response = await getTickets(userId);
    console.log('✅ Tickets loaded:', response);
    
    // Handle different response structures
    const tickets = response.data?.tickets || response.tickets || [];
    
    if (tickets.length > 0) {
      // Map API response to local format
      const mappedTickets = tickets.map(ticket => ({
        id: ticket.id || ticket.ticket_id,
        subject: ticket.subject,
        category: ticket.category,
        status: ticket.status || 'Open',
        priority: ticket.priority || 'Medium',
        createdAt: ticket.created_at || ticket.createdAt,
        updatedAt: ticket.updated_at || ticket.updatedAt,
        lastResponse: ticket.last_response || ticket.lastResponse,
        responseCount: ticket.response_count || ticket.responseCount || 0,
        isUnread: ticket.is_unread !== undefined ? ticket.is_unread : ticket.isUnread !== undefined ? ticket.isUnread : false,
        messages: ticket.messages || [],
      }));
      
      dispatch(setTickets(mappedTickets));
    } else {
      // Empty state - no tickets
      console.log('ℹ️ No tickets found - showing empty state');
      dispatch(setTickets([]));
    }
    
    dispatch(setLoading(false));
    return { success: true };
  } catch (error) {
    console.error('❌ Error loading tickets:', error);
    dispatch(setError(error.response?.data?.error || 'Failed to load tickets'));
    dispatch(setTickets([])); // Empty state on error
    dispatch(setLoading(false));
    return { success: false, error };
  }
};

/**
 * Refresh tickets (for pull-to-refresh)
 */
export const refreshTickets = (userId) => async (dispatch) => {
  dispatch(setRefreshing(true));
  dispatch(clearError());
  
  try {
    console.log('🔄 Refreshing support tickets for user:', userId);
    const response = await getTickets(userId);
    
    const tickets = response.data?.tickets || response.tickets || [];
    
    if (tickets.length > 0) {
      const mappedTickets = tickets.map(ticket => ({
        id: ticket.id || ticket.ticket_id,
        subject: ticket.subject,
        category: ticket.category,
        status: ticket.status || 'Open',
        priority: ticket.priority || 'Medium',
        createdAt: ticket.created_at || ticket.createdAt,
        updatedAt: ticket.updated_at || ticket.updatedAt,
        lastResponse: ticket.last_response || ticket.lastResponse,
        responseCount: ticket.response_count || ticket.responseCount || 0,
        isUnread: ticket.is_unread !== undefined ? ticket.is_unread : ticket.isUnread !== undefined ? ticket.isUnread : false,
        messages: ticket.messages || [],
      }));
      
      dispatch(setTickets(mappedTickets));
    } else {
      dispatch(setTickets([]));
    }
    
    dispatch(setRefreshing(false));
    return { success: true };
  } catch (error) {
    console.error('❌ Error refreshing tickets:', error);
    dispatch(setError(error.response?.data?.error || 'Failed to refresh tickets'));
    dispatch(setRefreshing(false));
    return { success: false, error };
  }
};

/**
 * Load a specific ticket by ID
 */
export const loadTicketById = (userId, ticketId) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearError());
  
  try {
    console.log('📞 Loading ticket:', ticketId);
    const response = await getTicketById(userId, ticketId);
    console.log('✅ Ticket loaded:', response);
    
    const ticket = response.data?.ticket || response.ticket;
    
    if (ticket) {
      const mappedTicket = {
        id: ticket.id || ticket.ticket_id,
        subject: ticket.subject,
        category: ticket.category,
        status: ticket.status || 'Open',
        priority: ticket.priority || 'Medium',
        createdAt: ticket.created_at || ticket.createdAt,
        updatedAt: ticket.updated_at || ticket.updatedAt,
        description: ticket.description,
        lastResponse: ticket.last_response || ticket.lastResponse,
        responseCount: ticket.response_count || ticket.responseCount || 0,
        isUnread: ticket.is_unread !== undefined ? ticket.is_unread : ticket.isUnread !== undefined ? ticket.isUnread : false,
        messages: ticket.messages || [],
      };
      
      dispatch(setCurrentTicket(mappedTicket));
      dispatch(markTicketAsRead(ticketId));
    } else {
      dispatch(setCurrentTicket(null));
    }
    
    dispatch(setLoading(false));
    return { success: true, ticket: ticket };
  } catch (error) {
    console.error('❌ Error loading ticket:', error);
    dispatch(setError(error.response?.data?.error || 'Failed to load ticket'));
    dispatch(setCurrentTicket(null));
    dispatch(setLoading(false));
    return { success: false, error };
  }
};

/**
 * Create a new support ticket
 */
export const createNewTicket = (userId, ticketData) => async (dispatch) => {
  dispatch(setSubmitting(true));
  dispatch(clearError());
  
  try {
    console.log('📞 Creating new ticket:', ticketData);
    const response = await createTicket(userId, ticketData);
    console.log('✅ Ticket created:', response);
    
    const ticket = response.data?.ticket || response.ticket;
    
    if (ticket) {
      const mappedTicket = {
        id: ticket.id || ticket.ticket_id,
        subject: ticket.subject,
        category: ticket.category,
        status: ticket.status || 'Open',
        priority: ticket.priority || 'Medium',
        createdAt: ticket.created_at || ticket.createdAt || new Date().toISOString(),
        updatedAt: ticket.updated_at || ticket.updatedAt || new Date().toISOString(),
        lastResponse: null,
        responseCount: 0,
        isUnread: false,
        messages: [],
      };
      
      dispatch(addTicket(mappedTicket));
    }
    
    dispatch(setSubmitting(false));
    return { success: true, ticket };
  } catch (error) {
    console.error('❌ Error creating ticket:', error);
    dispatch(setError(error.response?.data?.error || 'Failed to create ticket'));
    dispatch(setSubmitting(false));
    return { success: false, error };
  }
};

/**
 * Add a message to a ticket
 */
export const addMessageToTicketAction = (userId, ticketId, message) => async (dispatch) => {
  dispatch(setSubmitting(true));
  dispatch(clearError());
  
  try {
    console.log('📞 Adding message to ticket:', ticketId);
    const response = await addTicketMessage(userId, ticketId, message);
    console.log('✅ Message added:', response);
    
    const newMessage = response.data?.message || response.message || {
      id: Date.now().toString(),
      message: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    dispatch(addMessageToTicket({ ticketId, message: newMessage }));
    dispatch(setSubmitting(false));
    return { success: true, message: newMessage };
  } catch (error) {
    console.error('❌ Error adding message:', error);
    dispatch(setError(error.response?.data?.error || 'Failed to send message'));
    dispatch(setSubmitting(false));
    return { success: false, error };
  }
};

/**
 * Close a ticket
 */
export const closeTicketAction = (userId, ticketId) => async (dispatch) => {
  dispatch(setSubmitting(true));
  dispatch(clearError());
  
  try {
    console.log('📞 Closing ticket:', ticketId);
    const response = await closeTicket(userId, ticketId);
    console.log('✅ Ticket closed:', response);
    
    dispatch(updateTicket({ id: ticketId, status: 'Resolved' }));
    dispatch(setSubmitting(false));
    return { success: true };
  } catch (error) {
    console.error('❌ Error closing ticket:', error);
    dispatch(setError(error.response?.data?.error || 'Failed to close ticket'));
    dispatch(setSubmitting(false));
    return { success: false, error };
  }
};

/**
 * Reopen a ticket
 */
export const reopenTicketAction = (userId, ticketId) => async (dispatch) => {
  dispatch(setSubmitting(true));
  dispatch(clearError());
  
  try {
    console.log('📞 Reopening ticket:', ticketId);
    const response = await reopenTicket(userId, ticketId);
    console.log('✅ Ticket reopened:', response);
    
    dispatch(updateTicket({ id: ticketId, status: 'Open' }));
    dispatch(setSubmitting(false));
    return { success: true };
  } catch (error) {
    console.error('❌ Error reopening ticket:', error);
    dispatch(setError(error.response?.data?.error || 'Failed to reopen ticket'));
    dispatch(setSubmitting(false));
    return { success: false, error };
  }
};
