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
  const flatListRef = useRef<FlatList>(null);
  const { ticket } = route.params;

  const [responses, setResponses] = useState<TicketResponse[]>([]);
  const [newResponse, setNewResponse] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [hasNewReplies, setHasNewReplies] = useState(false);

  // Mock responses data
  const mockResponses: TicketResponse[] = [
    {
      id: '1',
      author: 'user',
      authorName: 'You',
      content: ticket.subject === 'Unable to book therapy session' 
        ? 'Hi, I\'ve been trying to book a therapy session for the past 2 days but the app keeps showing an error message "Session unavailable" even for slots that appear to be open. I\'ve tried restarting the app and my phone but the issue persists. Can you please help me resolve this?'
        : ticket.subject === 'Payment not processed correctly'
        ? 'Hello, I made a payment of UGX 55,000 for a therapy session yesterday but the payment shows as failed in the app, even though the money was deducted from my account. My transaction reference is TXN123456789. Please help me resolve this issue.'
        : 'I would like to request this feature for better user experience.',
      createdAt: ticket.createdAt,
    },
    {
      id: '2',
      author: 'support',
      authorName: 'Sarah from Support',
      content: ticket.subject === 'Unable to book therapy session'
        ? 'Thank you for contacting us. I understand how frustrating this must be. I\'ve checked your account and can see the booking attempts. This appears to be related to a synchronization issue with our booking system. Our technical team is currently investigating this issue.'
        : ticket.subject === 'Payment not processed correctly'
        ? 'Thank you for reaching out. I can see the payment discrepancy in your account. I\'ve escalated this to our billing team for immediate review. Could you please provide a screenshot of the transaction from your mobile money statement?'
        : 'Thank you for your suggestion! We appreciate user feedback and will consider this feature for future updates.',
      createdAt: '2025-01-25T14:30:00Z',
    },
    {
      id: '3',
      author: 'user',
      authorName: 'You',
      content: ticket.subject === 'Unable to book therapy session'
        ? 'Thank you for the quick response. I really need to book a session soon as I have been going through a difficult time. Is there any workaround I can use in the meantime? Or can you manually book a session for me?'
        : ticket.subject === 'Payment not processed correctly'
        ? 'I\'ve attached the screenshot of the transaction. The money was definitely deducted from my account. Please resolve this quickly as I need to book another session.'
        : 'Great! I think this would really improve the app experience for users like me who prefer dark themes.',
      createdAt: '2025-01-26T09:15:00Z',
    },
    {
      id: '4',
      author: 'support',
      authorName: 'Mike from Technical Support',
      content: ticket.subject === 'Unable to book therapy session'
        ? 'I completely understand your urgency. As a temporary workaround, I can manually book a session for you. I\'ve also implemented a fix that should resolve the booking issue. Please try booking again and let me know if you encounter any problems.'
        : ticket.subject === 'Payment not processed correctly'
        ? 'I\'ve reviewed your transaction and confirmed the payment was processed successfully on our end. I\'ve manually credited your account and you should now be able to book your session. We apologize for the inconvenience.'
        : 'We\'ve added your request to our feature backlog. While I can\'t provide a specific timeline, dark mode is definitely something we\'re considering for a future release.',
      createdAt: ticket.status === 'Resolved' ? '2025-01-27T11:45:00Z' : '2025-01-27T14:20:00Z',
    },
  ];

  useEffect(() => {
    loadResponses();
    // Mark ticket as read
    setTimeout(() => setHasNewReplies(false), 2000);
  }, []);

  const loadResponses = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setResponses(mockResponses);
        setIsLoading(false);
        scrollToBottom();
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      toast.show({
        description: 'Failed to load ticket details',
        duration: 3000,
      });
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSendResponse = async () => {
    if (!newResponse.trim() || isSending) return;

    if (ticket.status === 'Resolved') {
      Alert.alert(
        'Ticket Resolved',
        'This ticket has been resolved. You cannot add new responses to resolved tickets.',
        [{ text: 'OK' }]
      );
      return;
    }

    const response: TicketResponse = {
      id: Date.now().toString(),
      author: 'user',
      authorName: 'You',
      content: newResponse.trim(),
      createdAt: new Date().toISOString(),
    };

    setResponses(prev => [...prev, response]);
    setNewResponse('');
    setIsSending(true);
    scrollToBottom();

    try {
      // Simulate API call
      setTimeout(() => {
        setIsSending(false);
        toast.show({
          description: 'Response sent successfully',
          duration: 2000,
        });
      }, 1000);
    } catch (error) {
      setIsSending(false);
      toast.show({
        description: 'Failed to send response',
        duration: 3000,
      });
    }
  };

  const handleRequestClose = () => {
    if (ticket.status === 'Resolved') {
      toast.show({
        description: 'This ticket is already resolved',
        duration: 2000,
      });
      return;
    }

    Alert.alert(
      'Request Ticket Closure',
      'Are you sure you want to request closure of this ticket? This action will mark the ticket as resolved.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Request Closure', 
          onPress: () => {
            toast.show({
              description: 'Closure request sent to support team',
              duration: 3000,
            });
          }
        },
      ]
    );
  };

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
