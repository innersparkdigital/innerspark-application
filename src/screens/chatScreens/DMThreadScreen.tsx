/**
 * DM Thread Screen - Individual conversation with message bubbles and composer
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
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Icon } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { appImages } from '../../global/Data';
import { useToast } from 'native-base';
import { scale, moderateScale } from '../../global/Scaling';
import { useSelector, useDispatch } from 'react-redux';
import { getChatMessages, sendChatMessage, markChatAsRead, sendChatHeartbeat } from '../../api/client/messages';
import { displayNotification } from '../../api/LHNotifications';
import ISAlert, { useISAlert } from '../../components/alerts/ISAlert';
import ISTherapistAvatar from '../../components/ISTherapistAvatar';
import { getAvatarInitials } from '../../utils/textHelpers';

// Safe date parsing helper - respects server format without forcing UTC shift
const parseDateSafe = (dateStr: string, forceUTC = false) => {
  if (!dateStr) return new Date();
  // Force UTC only if requested and no timezone indicator is present
  const safeStr = (forceUTC && !dateStr.includes('Z') && !dateStr.includes('+')) 
    ? `${dateStr}Z` 
    : dateStr;
  return new Date(safeStr);
};

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  isSent: boolean;
  isOwn: boolean;
  type: 'text' | 'system';
}

interface DMThreadScreenProps {
  navigation: any;
  route: any;
}

const DMThreadScreen: React.FC<DMThreadScreenProps> = ({ navigation, route }) => {
  const toast = useToast();
  const alert = useISAlert();
  const flatListRef = useRef<FlatList>(null);

  // Accept `chatId` safely routed dynamically from the listing configuration
  const { chatId: routeChatId, partnerId, partnerName, partnerAvatar, isOnline, lastSeen, partnerEmail } = route.params;
  const userId = useSelector((state: any) => state.userData.userDetails.userId);
  const chatId = routeChatId || `chat_${userId}_${partnerId}`;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [isChatLocked, setIsChatLocked] = useState(false);
  const [chatStatus, setChatStatus] = useState<string>('ACTIVE');
  const [scheduledStartTime, setScheduledStartTime] = useState<string | null>(null);
  const [countdownText, setCountdownText] = useState<string>('');
  const [peerOnline, setPeerOnline] = useState<boolean>(isOnline || false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Track previously loaded messages to diff against polling results
  const prevMessagesRef = useRef<Message[]>([]);
  // Smart scroll: only auto-scroll if user is already near the bottom
  const isNearBottomRef = useRef(true);

  useEffect(() => {
    loadMessagesData();
    markMessagesAsRead();
    sendHeartbeat();

    const loadInterval = setInterval(() => {
      loadMessagesData(true);
      markMessagesAsRead();
    }, 5000);

    const hbInterval = setInterval(() => {
      sendHeartbeat();
    }, 10000);

    return () => {
      clearInterval(loadInterval);
      clearInterval(hbInterval);
    };
  }, []);

  useEffect(() => {
    if (chatStatus === 'LOCKED' && scheduledStartTime) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const start = new Date(scheduledStartTime).getTime();
        const diff = start - now;
        
        if (diff <= 0) {
          setCountdownText('Starting soon...');
          setChatStatus('ACTIVE');
          setIsChatLocked(false);
          clearInterval(timer);
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((diff % (1000 * 60)) / 1000);
          
          if (days > 0) {
             setCountdownText(`Unlocks in ${days}d ${hours}h`);
          } else {
             setCountdownText(`Unlocks in ${hours}h ${mins}m ${secs}s`);
          }
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [chatStatus, scheduledStartTime]);

  const sendHeartbeat = async () => {
    if (!chatId || !userId) return;
    try {
      const response = await sendChatHeartbeat(chatId, userId);
      const status = response.data?.chat_status || response.chat_status || 'ACTIVE';
      setChatStatus(status);
      setIsChatLocked(status === 'LOCKED');
      
      const peerStatus = response.data?.is_peer_online ?? response.is_peer_online ?? false;
      setPeerOnline(peerStatus);
      
      const startTime = response.data?.scheduled_start_time || response.scheduled_start_time;
      if (startTime) setScheduledStartTime(startTime);
    } catch (e) {
      console.warn('Heartbeat failed', e);
    }
  };

  const loadMessagesData = async (isSilent = false, page = 1) => {
    if (!isSilent && messages.length === 0) {
      setIsLoading(true);
    }
    try {
      const response = await getChatMessages(chatId, userId, page);
      const apiMessages = response.data?.messages || response.messages || [];
      const pagination = response.data?.pagination || response.pagination || {};
      
      setHasMore(pagination.hasMore ?? pagination.has_more ?? false);

      const mappedMessages = apiMessages.map((msg: any) => {
        const msgSenderId = String(msg.senderId || msg.sender_id || '');
        const isOwn = msg.isOwn ?? (msgSenderId === String(userId));
        const senderType = msg.senderType || (isOwn ? 'client' : 'therapist'); // Workaround for mixed mapping
        const isUTC = senderType === 'client';
        
        const dateObj = parseDateSafe(msg.createdAt || msg.created_at || msg.timestamp, isUTC);
        
        return {
          id: msg.id,
          senderId: msgSenderId,
          senderName: msg.senderName || msg.sender_name || (isOwn ? 'You' : partnerName),
          content: msg.content || msg.message || '',
          createdAt: dateObj.toISOString(),
          isRead: msg.isRead || msg.is_read || false,
          isSent: msg.isSent !== false,
          isOwn: isOwn,
          type: msg.type || 'text',
        };
      });

      // Explicit ascending sort — deterministic regardless of API response order
      mappedMessages.sort((a: Message, b: Message) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      // Check for new incoming messages from other party
      let hasNewMessages = false;
      if (isSilent && prevMessagesRef.current.length > 0) {
        const oldIds = new Set(prevMessagesRef.current.map(m => m.id));
        const newMessages = mappedMessages.filter((m: any) => !oldIds.has(m.id) && !m.isOwn);

        if (newMessages.length > 0) {
          hasNewMessages = true;
          newMessages.forEach((msg: any) => {
            displayNotification({
              title: partnerName,
              body: msg.type === 'image' ? 'Sent an image' : msg.content,
              data: { type: 'chat_message', chatId, partnerId }
            });
          });
        }
      }

      // Functional merge: Ensure we don't wipe out history during background polls
      setMessages(prev => {
        const combined = [...prev, ...mappedMessages];
        // Unique by ID
        const unique = Array.from(new Map(combined.map(m => [m.id, m])).values());
        // Final ascending sort
        const sorted = unique.sort((a: any, b: any) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        
        // Update ref for next notification comparison
        prevMessagesRef.current = sorted;
        return sorted;
      });

      if (!isSilent) {
        // Initial load: always scroll to bottom
        scrollToBottom();
      } else if (isNearBottomRef.current && hasNewMessages) {
        // Silent poll: only scroll if user is already near the bottom AND new messages arrived
        scrollToBottom();
      }
    } catch (error) {
      console.error('❌ Error loading direct messages:', error);
      if (!isSilent) {
        toast.show({
          description: 'Failed to load messages',
          duration: 3000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreMessages = async () => {
    if (!hasMore || isLoadingMore) return;
    
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    
    try {
      const response = await getChatMessages(chatId, userId, nextPage);
      const apiMessages = response.data?.messages || response.messages || [];
      const pagination = response.data?.pagination || response.pagination || {};
      
      if (apiMessages.length > 0) {
        const mappedOlder = apiMessages.map((msg: any) => {
          const msgSenderId = String(msg.senderId || msg.sender_id || '');
          const isOwn = msg.isOwn ?? (msgSenderId === String(userId));
          const senderType = msg.senderType || (isOwn ? 'client' : 'therapist');
          const isUTC = senderType === 'client';
          
          const dateObj = parseDateSafe(msg.createdAt || msg.created_at || msg.timestamp, isUTC);
          
          return {
            id: msg.id,
            senderId: msgSenderId,
            senderName: msg.senderName || msg.sender_name || (isOwn ? 'You' : partnerName),
            content: msg.content || msg.message || '',
            createdAt: dateObj.toISOString(),
            isRead: msg.isRead || msg.is_read || false,
            isSent: msg.isSent !== false,
            isOwn: isOwn,
            type: msg.type || 'text',
          };
        });

        // Add older messages to the beginning
        setMessages(prev => {
          const combined = [...mappedOlder, ...prev];
          // Determine unique by ID
          const unique = Array.from(new Map(combined.map(m => [m.id, m])).values());
          // Final ascending sort
          return unique.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        });
        
        setCurrentPage(nextPage);
      }
      
      setHasMore(pagination.hasMore ?? pagination.has_more ?? false);
    } catch (e) {
      console.warn('Could not load older messages', e);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setCurrentPage(1); // Reset to first page
    await loadMessagesData(false, 1);
    setIsRefreshing(false);
  };

  const markMessagesAsRead = async () => {
    if (!chatId || !userId) return;

    try {
      await markChatAsRead(chatId, String(userId));
    } catch (error: any) {
      console.error('❌ Error synchronizing thread read status:', error.message);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || isSending) return;

    const content = messageText.trim();
    setMessageText('');

    // Optimistic UI Append matching Live Chat structural speeds 
    const tempId = `temp_${Date.now()}`;
    const optimisticMsg: Message = {
      id: tempId,
      senderId: String(userId),
      senderName: 'You',
      content,
      createdAt: new Date().toISOString(),
      isRead: false,
      isSent: false,
      isOwn: true,
      type: 'text'
    };

    setMessages(prev => [...prev, optimisticMsg]);
    scrollToBottom();
    setIsSending(true);

    try {
      await sendChatMessage(chatId, String(userId), content);
      await loadMessagesData(true);
    } catch (error: any) {
      console.error('❌ Error sending message:', error);
      
      const hasEmoji = /\p{Extended_Pictographic}/u.test(content);
      if (error.response?.status === 500 && hasEmoji) {
        alert.show({
          type: 'error',
          title: 'Emoji Support',
          message: 'Your message contains emojis. Send without them?',
        });
      } else {
        toast.show({
          description: error.backendMessage || error.message || 'Failed to send message',
          duration: 3000,
        });
      }
      
      // Rollback optimism payload if failure resolves
      setMessages(prev => prev.filter(m => m.id !== tempId));
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    alert.show({
      type: 'destructive',
      title: 'Delete Message',
      message: 'Are you sure you want to delete this message?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => {
        // This component uses Redux for messages, so direct state manipulation like setMessages is not applicable here.
        // A Redux action would be dispatched to delete the message from the store.
        // For now, we'll just show a toast as the original code had a placeholder for setMessages.
        toast.show({
          description: 'Message deletion not implemented via Redux yet.',
          duration: 2000,
        });
      },
    });
  };

  const formatTime = (dateString: string) => {
    const date = parseDateSafe(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    const date = parseDateSafe(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const shouldShowDateSeparator = (currentMessage: Message, previousMessage?: Message) => {
    if (!previousMessage) return true;

    const currentDate = new Date(currentMessage.createdAt).toDateString();
    const previousDate = new Date(previousMessage.createdAt).toDateString();

    return currentDate !== previousDate;
  };



  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const previousMessage = index > 0 ? messages[index - 1] : undefined;
    const showDateSeparator = shouldShowDateSeparator(item, previousMessage);

    return (
      <View>
        {showDateSeparator && (
          <View style={styles.dateSeparator}>
            <Text style={styles.dateSeparatorText}>
              {formatDate(item.createdAt)}
            </Text>
          </View>
        )}

        <View style={[
          styles.messageContainer,
          item.isOwn ? styles.ownMessageContainer : styles.partnerMessageContainer
        ]}>
          {!item.isOwn && (
            <ISTherapistAvatar
              therapistId={partnerId}
              initialAvatar={partnerAvatar}
              size={scale(32)}
              rounded
              containerStyle={styles.messageAvatar}
              title={getAvatarInitials(partnerName)}
            />
          )}

          <TouchableOpacity
            style={[
              styles.messageBubble,
              item.isOwn ? styles.ownMessageBubble : styles.partnerMessageBubble
            ]}
            onLongPress={() => item.isOwn && handleDeleteMessage(item.id)}
          >
            <Text style={[
              styles.messageText,
              item.isOwn ? styles.ownMessageText : styles.partnerMessageText
            ]}>
              {item.content}
            </Text>

            <View style={styles.messageFooter}>
              <Text style={[
                styles.messageTime,
                item.isOwn ? styles.ownMessageTime : styles.partnerMessageTime
              ]}>
                {formatTime(item.createdAt)}
              </Text>

              {item.isOwn && (
                <View style={styles.messageStatus}>
                  {!item.isSent ? (
                    <Icon name="schedule" type="material" color={appColors.grey4} size={moderateScale(16)} />
                  ) : item.isRead ? (
                    <Icon name="done-all" type="material" color={appColors.AppBlue} size={moderateScale(16)} />
                  ) : (
                    <Icon name="done" type="material" color={appColors.grey4} size={moderateScale(16)} />
                  )}
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
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
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={moderateScale(24)} />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <ISTherapistAvatar
            therapistId={partnerId}
            initialAvatar={partnerAvatar}
            size={scale(40)}
            rounded
            containerStyle={styles.headerAvatar}
            title={getAvatarInitials(partnerName)}
            titleStyle={{ fontSize: moderateScale(14) }}
          />
          <View style={styles.headerText}>
            <Text style={styles.headerName}>{partnerName}</Text>
            <Text style={styles.headerStatus}>
              {peerOnline ? 'Online' : `Last seen ${lastSeen}`}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('TherapistProfileViewScreen', {
            therapist: { partnerId, partnerName, partnerAvatar, isOnline: peerOnline, lastSeen, partnerEmail }
          })}
        >
          <Icon name="info" type="material" color={appColors.CardBackground} size={moderateScale(24)} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.messagesContent,
            messages.length === 0 && { flexGrow: 1 }
          ]}
          onContentSizeChange={() => {
            // Auto-scroll to bottom on first load or when sending manual messages
            if (messages.length > 0 && !isLoadingMore) {
              scrollToBottom();
            }
          }}
          ListHeaderComponent={
            <View>
              {hasMore && (
                <TouchableOpacity 
                  style={styles.loadMoreButton} 
                  onPress={loadMoreMessages}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? (
                    <ActivityIndicator size="small" color={appColors.AppBlue} />
                  ) : (
                    <Text style={styles.loadMoreText}>↑ Load older messages</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          }
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.emptyStateContainer}>
                <Image 
                  source={appImages.no_messages || { uri: 'https://cdn-icons-png.flaticon.com/512/4076/4076402.png' }} 
                  style={styles.emptyStateImage}
                />
                <Text style={styles.emptyStateTitle}>No Messages Yet</Text>
                <Text style={styles.emptyStateText}>
                  Send a message to start the conversation with {partnerName}.
                </Text>
              </View>
            ) : null
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[appColors.AppBlue]}
            />
          }
          onScroll={(e) => {
            const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
            const distanceFromBottom = contentSize.height - contentOffset.y - layoutMeasurement.height;
            isNearBottomRef.current = distanceFromBottom < 80;
          }}
          scrollEventThrottle={16}
        />

        {/* Message Composer */}
        {isChatLocked ? (
          <View style={styles.lockedFooter}>
            <Icon name="lock" type="material" color={appColors.grey3} size={moderateScale(24)} />
            <Text style={styles.lockedTitle}>Session Locked</Text>
            <Text style={styles.lockedSubtitle}>
              {countdownText || 'This session has not started yet or has expired.'}
            </Text>
          </View>
        ) : (
          <View style={styles.composer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Type a message..."
                placeholderTextColor={appColors.grey3}
                value={messageText}
                onChangeText={setMessageText}
                multiline
                maxLength={1000}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  messageText.trim() ? styles.sendButtonActive : styles.sendButtonInactive
                ]}
                onPress={handleSendMessage}
                disabled={!messageText.trim() || isSending}
              >
                <Icon
                  name="send"
                  type="material"
                  color={messageText.trim() ? appColors.CardBackground : appColors.grey3}
                  size={moderateScale(20)}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  header: {
    backgroundColor: appColors.AppBlue,
    paddingTop: parameters.headerHeightS,
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
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    marginRight: scale(12),
  },
  headerText: {
    flex: 1,
  },
  headerName: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  headerStatus: {
    fontSize: moderateScale(12),
    color: appColors.CardBackground + 'CC',
    fontFamily: appFonts.bodyTextRegular,
  },
  headerButton: {
    padding: scale(8),
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: scale(16),
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: scale(16),
  },
  dateSeparatorText: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    backgroundColor: appColors.grey6,
    paddingHorizontal: scale(12),
    paddingVertical: scale(4),
    borderRadius: scale(12),
    fontFamily: appFonts.bodyTextRegular,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: scale(2),
    paddingHorizontal: scale(16),
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  partnerMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    marginRight: scale(8),
    alignSelf: 'flex-end',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderRadius: scale(20),
    marginVertical: scale(2),
  },
  ownMessageBubble: {
    backgroundColor: appColors.AppBlue,
    borderBottomRightRadius: scale(6),
  },
  partnerMessageBubble: {
    backgroundColor: appColors.CardBackground,
    borderBottomLeftRadius: scale(6),
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(1),
  },
  messageText: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(20),
    fontFamily: appFonts.bodyTextRegular,
  },
  ownMessageText: {
    color: appColors.CardBackground,
  },
  partnerMessageText: {
    color: appColors.grey1,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: scale(4),
  },
  messageTime: {
    fontSize: moderateScale(12),
    fontFamily: appFonts.bodyTextRegular,
  },
  ownMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  partnerMessageTime: {
    color: appColors.grey3,
  },
  messageStatus: {
    marginLeft: scale(4),
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
  lockedFooter: {
    backgroundColor: appColors.CardBackground,
    paddingHorizontal: scale(16),
    paddingVertical: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(-2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
  },
  lockedTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    marginTop: scale(8),
  },
  lockedSubtitle: {
    fontSize: moderateScale(14),
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextRegular,
    marginTop: scale(4),
    fontWeight: 'bold',
  },
});

export default DMThreadScreen;
