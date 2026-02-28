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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Icon, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import { useToast } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import { loadTicketById, addMessageToTicketAction, closeTicketAction, reopenTicketAction } from '../../utils/supportTicketsManager';
import { selectCurrentTicket, selectTicketsLoading, selectTicketsSubmitting } from '../../features/supportTickets/supportTicketsSlice';
import ISAlert, { useISAlert } from '../../components/alerts/ISAlert';

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
  const alert = useISAlert();
  const userId = useSelector((state: any) => state.userData.userDetails.userId);
  const flatListRef = useRef<FlatList>(null);
  const { ticketId } = route.params;

  const currentTicket = useSelector(selectCurrentTicket);
  const isLoading = useSelector(selectTicketsLoading);
  const isSending = useSelector(selectTicketsSubmitting);

  const [newResponse, setNewResponse] = useState('');
  const [hasNewReplies, setHasNewReplies] = useState(false);

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Removed mock data - now using Redux state
  const responses = currentTicket?.messages || [];

  useEffect(() => {
    loadTicketData();
  }, [ticketId]);

  const loadTicketData = async () => {
    const result = await (dispatch as any)(loadTicketById(userId, ticketId));
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

    const result = await (dispatch as any)(addMessageToTicketAction(userId, ticketId, newResponse.trim()));

    if (result.success) {
      setNewResponse('');
      toast.show({
        description: 'Message sent successfully',
        duration: 2000,
      });
      // Scroll to bottom to show new message
      scrollToBottom();
    } else {
      toast.show({
        description: 'Failed to send message',
        duration: 3000,
      });
    }
  };

  const handleCloseTicket = async () => {
    alert.show({
      type: 'warning',
      title: 'Close Ticket',
      message: 'Are you sure you want to close this ticket?',
      confirmText: 'Close',
      cancelText: 'Cancel',
      onConfirm: async () => {
        const result = await (dispatch as any)(closeTicketAction(userId, ticketId));
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
    });
  };

  const handleReopenTicket = async () => {
    const result = await (dispatch as any)(reopenTicketAction(userId, ticketId));
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
            size={scale(32)}
            rounded
            containerStyle={{ backgroundColor: isUser ? appColors.AppBlue : '#4CAF50' }}
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

  const renderHeader = () => {
    if (!currentTicket) return null;

    return (
      <View style={styles.ticketHeader}>
        <View style={styles.ticketTitleRow}>
          <Text style={styles.ticketSubject}>{currentTicket.subject}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentTicket.status) }]}>
            <Text style={styles.statusText}>{currentTicket.status}</Text>
          </View>
        </View>

        <View style={styles.ticketMeta}>
          <View style={styles.metaItem}>
            <Icon name="confirmation-number" type="material" color={appColors.grey3} size={moderateScale(16)} />
            <Text style={styles.metaText}>{currentTicket.id}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="category" type="material" color={appColors.grey3} size={moderateScale(16)} />
            <Text style={styles.metaText}>{currentTicket.category}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="schedule" type="material" color={appColors.grey3} size={moderateScale(16)} />
            <Text style={styles.metaText}>Created {formatDateTime(currentTicket.createdAt)}</Text>
          </View>
        </View>

        {currentTicket.status !== 'Resolved' && (
          <TouchableOpacity
            style={styles.closeRequestButton}
            onPress={handleCloseTicket}
          >
            <Icon name="check-circle" type="material" color={appColors.AppBlue} size={moderateScale(20)} />
            <Text style={styles.closeRequestText}>Request Closure</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

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
          currentTicket.status === 'Resolved' && styles.composerDisabled
        ]}>
          {currentTicket.status === 'Resolved' ? (
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
      <ISAlert ref={alert.ref} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: moderateScale(16),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
  },
  header: {
    backgroundColor: appColors.CardBackground,
    paddingTop: scale(parameters.headerHeightS),
    paddingBottom: scale(15),
    paddingHorizontal: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
  },
  backButton: {
    padding: scale(8),
    marginRight: scale(8),
  },
  headerTitle: {
    flex: 1,
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    textAlign: 'center',
  },
  headerSpacer: {
    width: scale(40),
  },
  content: {
    flex: 1,
  },
  ticketHeader: {
    backgroundColor: appColors.CardBackground,
    padding: scale(16),
    marginBottom: scale(8),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
  },
  ticketTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: scale(16),
  },
  ticketSubject: {
    flex: 1,
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    lineHeight: scale(24),
    marginRight: scale(12),
  },
  statusBadge: {
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(16),
  },
  statusText: {
    fontSize: moderateScale(12),
    color: appColors.CardBackground,
    fontFamily: appFonts.bodyTextRegular,
    fontWeight: 'bold',
  },
  ticketMeta: {
    marginBottom: scale(16),
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  metaText: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    marginLeft: scale(8),
  },
  closeRequestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    borderRadius: scale(8),
    borderWidth: scale(1),
    borderColor: appColors.AppBlue,
  },
  closeRequestText: {
    fontSize: moderateScale(14),
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextRegular,
    fontWeight: '600',
    marginLeft: scale(8),
  },
  responsesList: {
    flex: 1,
  },
  responsesContent: {
    paddingVertical: scale(8),
  },
  responseContainer: {
    marginHorizontal: scale(16),
    marginVertical: scale(6),
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
    marginBottom: scale(8),
  },
  responseInfo: {
    marginLeft: scale(12),
  },
  authorName: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  responseTime: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  newBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    borderRadius: scale(10),
    marginLeft: scale(8),
  },
  newBadgeText: {
    fontSize: moderateScale(10),
    color: appColors.CardBackground,
    fontFamily: appFonts.bodyTextRegular,
    fontWeight: 'bold',
  },
  responseContent: {
    maxWidth: '85%',
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderRadius: scale(16),
  },
  userResponseContent: {
    backgroundColor: appColors.AppBlue,
    borderBottomRightRadius: 4,
  },
  supportResponseContent: {
    backgroundColor: appColors.CardBackground,
    borderBottomLeftRadius: scale(4),
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(1),
  },
  responseText: {
    fontSize: moderateScale(14),
    lineHeight: scale(20),
    fontFamily: appFonts.bodyTextRegular,
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
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(-2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
  },
  composerDisabled: {
    backgroundColor: appColors.grey6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: appColors.grey6,
    borderRadius: scale(25),
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
  },
  textInput: {
    flex: 1,
    fontSize: moderateScale(16),
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
    maxHeight: scale(100),
    paddingVertical: scale(8),
  },
  sendButton: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: scale(8),
  },
  sendButtonActive: {
    backgroundColor: appColors.AppBlue,
  },
  sendButtonInactive: {
    backgroundColor: 'transparent',
  },
  characterCount: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'right',
    marginTop: scale(4),
  },
  resolvedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  resolvedNoticeText: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    marginLeft: scale(8),
    textAlign: 'center',
  },
});

export default TicketDetailScreen;
