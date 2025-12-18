/**
 * Ticket Detail Screen - View ticket thread and add responses
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Icon, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import { loadTicketById, addMessageToTicketAction, closeTicketAction, reopenTicketAction } from '../../utils/supportTicketsManager';
import { selectCurrentTicket, selectTicketsLoading, selectTicketsSubmitting } from '../../features/supportTickets/supportTicketsSlice';

interface TicketResponse {
  id: string;
  author: 'user' | 'support';
  authorName: string;
  content: string;
  createdAt: string;
  isInternal?: boolean;
}

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: 'Open' | 'Pending' | 'Resolved';
  priority: string;
  createdAt: string;
  updatedAt: string;
  description: string;
}

interface TicketDetailScreenProps {
  navigation: any;
  route: any;
}

const TicketDetailScreen: React.FC<TicketDetailScreenProps> = ({ navigation, route }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const userId = useSelector((state: any) => state.userData.userDetails.userId);
  const flatListRef = useRef<FlatList>(null);
  const { ticketId } = route.params;
  
  const currentTicket = useSelector(selectCurrentTicket);
  const isLoading = useSelector(selectTicketsLoading);
  const isSending = useSelector(selectTicketsSubmitting);

  const [newResponse, setNewResponse] = useState('');
  const [hasNewReplies, setHasNewReplies] = useState(false);

  // Removed mock data - now using Redux state
  const responses = currentTicket?.messages || [];

  useEffect(() => {
    loadTicketData();
  }, [ticketId]);

  const loadTicketData = async () => {
    const result = await dispatch(loadTicketById(userId, ticketId));
    if (!result.success) {
      toast.show({
        description: 'Failed to load ticket details',
        duration: 3000,
      });
    }
  };

  const handleSendResponse = async () => {
    if (!newResponse.trim()) {
      toast.show({
        description: 'Please enter a message',
        duration: 2000,
      });
      return;
    }

    const result = await dispatch(addMessageToTicketAction(userId, ticketId, newResponse.trim()));

    if (result.success) {
      setNewResponse('');
      toast.show({
        description: 'Message sent successfully',
        duration: 2000,
      });
      // Scroll to bottom to show new message
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } else {
      toast.show({
        description: 'Failed to send message',
        duration: 3000,
      });
    }
  };

  const handleCloseTicket = async () => {
    Alert.alert(
      'Close Ticket',
      'Are you sure you want to close this ticket?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Close',
          onPress: async () => {
            const result = await dispatch(closeTicketAction(userId, ticketId));
            if (result.success) {
              toast.show({
                description: 'Ticket closed successfully',
                duration: 2000,
              });
              navigation.goBack();
            } else {
              toast.show({
                description: 'Failed to close ticket',
                duration: 3000,
              });
            }
          },
        },
      ]
    );
  };

  const handleReopenTicket = async () => {
    const result = await dispatch(reopenTicketAction(userId, ticketId));
    if (result.success) {
      toast.show({
        description: 'Ticket reopened successfully',
        duration: 2000,
      });
    } else {
      toast.show({
        description: 'Failed to reopen ticket',
        duration: 3000,
      });
    }
  };

  if (isLoading || !currentTicket) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading ticket...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // All old duplicate code removed - using Redux state and manager actions above

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return '#4CAF50';
      case 'Pending':
        return '#FF9800';
      case 'Resolved':
        return '#9E9E9E';
      default:
        return appColors.grey3;
    }
  };

  const renderResponse = ({ item, index }: { item: TicketResponse; index: number }) => {
    const isUser = item.author === 'user';
    const showNewBadge = index === responses.length - 1 && hasNewReplies && !isUser;

    return (
      <View style={[
        styles.responseContainer,
        isUser ? styles.userResponse : styles.supportResponse
      ]}>
        <View style={styles.responseHeader}>
          <Avatar
            title={item.authorName.charAt(0)}
            size={32}
            rounded
            backgroundColor={isUser ? appColors.AppBlue : '#4CAF50'}
            titleStyle={styles.avatarText}
          />
          <View style={styles.responseInfo}>
            <Text style={styles.authorName}>{item.authorName}</Text>
            <Text style={styles.responseTime}>{formatDateTime(item.createdAt)}</Text>
          </View>
          {showNewBadge && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>New</Text>
            </View>
          )}
        </View>
        
        <View style={[
          styles.responseContent,
          isUser ? styles.userResponseContent : styles.supportResponseContent
        ]}>
          <Text style={[
            styles.responseText,
            isUser ? styles.userResponseText : styles.supportResponseText
          ]}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.ticketHeader}>
      <View style={styles.ticketTitleRow}>
        <Text style={styles.ticketSubject}>{ticket.subject}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) }]}>
          <Text style={styles.statusText}>{ticket.status}</Text>
        </View>
      </View>
      
      <View style={styles.ticketMeta}>
        <View style={styles.metaItem}>
          <Icon name="confirmation-number" type="material" color={appColors.grey3} size={16} />
          <Text style={styles.metaText}>{ticket.id}</Text>
        </View>
        <View style={styles.metaItem}>
          <Icon name="category" type="material" color={appColors.grey3} size={16} />
          <Text style={styles.metaText}>{ticket.category}</Text>
        </View>
        <View style={styles.metaItem}>
          <Icon name="schedule" type="material" color={appColors.grey3} size={16} />
          <Text style={styles.metaText}>Created {formatDateTime(ticket.createdAt)}</Text>
        </View>
      </View>

      {ticket.status !== 'Resolved' && (
        <TouchableOpacity
          style={styles.closeRequestButton}
          onPress={handleRequestClose}
        >
          <Icon name="check-circle" type="material" color={appColors.AppBlue} size={20} />
          <Text style={styles.closeRequestText}>Request Closure</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" type="material" color={appColors.grey1} size={24} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Ticket Details</Text>
        
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          ref={flatListRef}
          data={responses}
          renderItem={renderResponse}
          keyExtractor={(item) => item.id}
          style={styles.responsesList}
          contentContainerStyle={styles.responsesContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          onContentSizeChange={scrollToBottom}
        />

        {/* Response Composer */}
        <View style={[
          styles.composer,
          ticket.status === 'Resolved' && styles.composerDisabled
        ]}>
          {ticket.status === 'Resolved' ? (
            <View style={styles.resolvedNotice}>
              <Icon name="check-circle" type="material" color="#4CAF50" size={20} />
              <Text style={styles.resolvedNoticeText}>
                This ticket has been resolved and is now closed for responses.
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Type your response..."
                  placeholderTextColor={appColors.grey3}
                  value={newResponse}
                  onChangeText={setNewResponse}
                  multiline
                  maxLength={1000}
                />
                <TouchableOpacity 
                  style={[
                    styles.sendButton,
                    newResponse.trim() ? styles.sendButtonActive : styles.sendButtonInactive
                  ]}
                  onPress={handleSendResponse}
                  disabled={!newResponse.trim() || isSending}
                >
                  <Icon 
                    name="send" 
                    type="material" 
                    color={newResponse.trim() ? appColors.CardBackground : appColors.grey3} 
                    size={20} 
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.characterCount}>
                {newResponse.length}/1000 characters
              </Text>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  header: {
    backgroundColor: appColors.CardBackground,
    paddingTop: parameters.headerHeightS,
    paddingBottom: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  ticketHeader: {
    backgroundColor: appColors.CardBackground,
    padding: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ticketTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  ticketSubject: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    lineHeight: 24,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    color: appColors.CardBackground,
    fontFamily: appFonts.regularText,
    fontWeight: 'bold',
  },
  ticketMeta: {
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.regularText,
    marginLeft: 8,
  },
  closeRequestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: appColors.AppBlue,
  },
  closeRequestText: {
    fontSize: 14,
    color: appColors.AppBlue,
    fontFamily: appFonts.regularText,
    fontWeight: '600',
    marginLeft: 8,
  },
  responsesList: {
    flex: 1,
  },
  responsesContent: {
    paddingVertical: 8,
  },
  responseContainer: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  userResponse: {
    alignItems: 'flex-end',
  },
  supportResponse: {
    alignItems: 'flex-start',
  },
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  responseInfo: {
    marginLeft: 12,
  },
  authorName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  responseTime: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.regularText,
  },
  newBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  newBadgeText: {
    fontSize: 10,
    color: appColors.CardBackground,
    fontFamily: appFonts.regularText,
    fontWeight: 'bold',
  },
  responseContent: {
    maxWidth: '85%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  userResponseContent: {
    backgroundColor: appColors.AppBlue,
    borderBottomRightRadius: 4,
  },
  supportResponseContent: {
    backgroundColor: appColors.CardBackground,
    borderBottomLeftRadius: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  responseText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: appFonts.regularText,
  },
  userResponseText: {
    color: appColors.CardBackground,
  },
  supportResponseText: {
    color: appColors.grey1,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: appColors.CardBackground,
  },
  composer: {
    backgroundColor: appColors.CardBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  composerDisabled: {
    backgroundColor: appColors.grey6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: appColors.grey6,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.regularText,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: appColors.AppBlue,
  },
  sendButtonInactive: {
    backgroundColor: 'transparent',
  },
  characterCount: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.regularText,
    textAlign: 'right',
    marginTop: 4,
  },
  resolvedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  resolvedNoticeText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.regularText,
    marginLeft: 8,
    textAlign: 'center',
  },
});

export default TicketDetailScreen;
