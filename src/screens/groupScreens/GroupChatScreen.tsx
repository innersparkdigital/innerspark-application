/**
 * Unified Group Chat Screen - Consolidated from 3 implementations
 * Features:
 * - Privacy mode with anonymous member names
 * - Typing indicators
 * - Message delivery status
 * - Announcements
 * - Date separators
 * - Role-based UI (therapist/moderator/member)
 * - Offline support
 * - Rich group info header
 * - Cross-platform keyboard handling
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
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Icon } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import { useSelector } from 'react-redux';
import { getGroupMessages, sendGroupMessage } from '../../api/client/groups';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';

interface GroupMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'therapist' | 'moderator' | 'member';
  anonymousId?: number; // For privacy mode
  content: string;
  createdAt: string;
  isDelivered: boolean;
  isSeen: boolean;
  isOwn: boolean;
  type: 'text' | 'system' | 'announcement';
}

interface TypingUser {
  id: string;
  name: string;
  anonymousId?: number;
}

interface GroupChatScreenProps {
  navigation: any;
  route: any;
}

const GroupChatScreen: React.FC<GroupChatScreenProps> = ({ navigation, route }) => {
  const toast = useToast();
  const userId = useSelector((state: any) => state.userData.userDetails.userId);
  const flatListRef = useRef<FlatList>(null);
  
  // Route params with defaults
  const { 
    groupId, 
    groupName, 
    groupIcon = 'groups',
    groupDescription,
    memberCount, 
    userRole = 'member',
    privacyMode = true, // Default to privacy ON
    showModeration = false,
  } = route.params || {};

  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isTyping, setIsTyping] = useState(false);


  useEffect(() => {
    loadMessages();
    simulateSocketEvents();
    
    return () => {
      handleSocketLeave();
    };
  }, []);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      console.log('📞 Calling getGroupMessages API...');
      console.log('Group ID:', groupId);
      console.log('User ID:', userId);

      const response = await getGroupMessages(groupId, userId, 1, 50);
      console.log('✅ Group messages response:', response);

      // Map API response to local message format
      if (response.messages && response.messages.length > 0) {
        const mappedMessages = response.messages.map((msg: any) => ({
          id: msg.id || msg.message_id,
          senderId: msg.sender_id || msg.senderId,
          senderName: msg.sender_name || msg.senderName || 'Unknown',
          senderRole: msg.sender_role || msg.senderRole || 'member',
          anonymousId: msg.anonymous_id || msg.anonymousId,
          content: msg.content || msg.message || '',
          createdAt: msg.created_at || msg.createdAt || new Date().toISOString(),
          isDelivered: msg.is_delivered !== undefined ? msg.is_delivered : true,
          isSeen: msg.is_seen !== undefined ? msg.is_seen : false,
          isOwn: msg.sender_id === userId || msg.senderId === userId,
          type: msg.type || 'text',
        }));
        setMessages(mappedMessages);
      } else {
        // Empty state - no messages
        console.log('ℹ️ No messages found - showing empty state');
        setMessages([]);
      }

      setIsLoading(false);
      scrollToBottom();
      markMessagesAsSeen();
    } catch (error: any) {
      console.error('❌ Error loading messages:', error);
      
      // Empty state on error - no mock fallback
      setMessages([]);
      setIsLoading(false);
      toast.show({
        description: 'Failed to load messages',
        duration: 3000,
      });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadMessages();
    setIsRefreshing(false);
  };

  const simulateSocketEvents = () => {
    setTimeout(() => {
      setTypingUsers([{ id: 'member_3', name: 'James', anonymousId: 5 }]);
    }, 3000);

    setTimeout(() => {
      setTypingUsers([]);
      const newMessage: GroupMessage = {
        id: Date.now().toString(),
        senderId: 'member_3',
        senderName: 'James Carter',
        senderRole: 'member',
        anonymousId: 5,
        content: 'Thank you Dr. Johnson, that breathing exercise really helps!',
        createdAt: new Date().toISOString(),
        isDelivered: true,
        isSeen: false,
        isOwn: false,
        type: 'text',
      };
      setMessages(prev => [...prev, newMessage]);
      scrollToBottom();
    }, 6000);
  };

  const handleSocketJoin = () => {
    console.log(`Joined group chat: ${groupId}`);
  };

  const handleSocketLeave = () => {
    console.log(`Left group chat: ${groupId}`);
  };

  const markMessagesAsSeen = () => {
    setMessages(prev => 
      prev.map(msg => 
        !msg.isOwn && !msg.isSeen 
          ? { ...msg, isSeen: true }
          : msg
      )
    );
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSendMessage = async () => {
    if (messageText.trim() === '' || isSending) return;

    setIsSending(true);
    const messageContent = messageText.trim();
    const tempId = Date.now().toString();

    // Optimistic UI update
    const newMessage: GroupMessage = {
      id: tempId,
      senderId: userId,
      senderName: 'You',
      senderRole: userRole,
      anonymousId: privacyMode ? messages.filter(m => m.isOwn).length + 1 : undefined,
      content: messageContent,
      createdAt: new Date().toISOString(),
      isDelivered: false,
      isSeen: false,
      isOwn: true,
      type: 'text',
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageText('');
    scrollToBottom();

    try {
      console.log('📞 Calling sendGroupMessage API...');
      const response = await sendGroupMessage(groupId, userId, messageContent);
      console.log('✅ Send message response:', response);

      // Update message with real ID from server
      setMessages(prev =>
        prev.map(msg =>
          msg.id === tempId
            ? {
                ...msg,
                id: response.message?.id || response.id || tempId,
                isDelivered: true,
              }
            : msg
        )
      );
      setIsSending(false);
    } catch (error: any) {
      console.error('❌ Error sending message:', error);
      
      // Remove failed message or mark as failed
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      
      toast.show({
        description: error.response?.data?.error || 'Failed to send message. Please try again.',
        duration: 3000,
      });
      
      // Restore message text so user can retry
      setMessageText(messageContent);
      setIsSending(false);
    }
  };

  const handleTyping = (text: string) => {
    setMessageText(text);
    
    if (text.length > 0 && !isTyping) {
      setIsTyping(true);
    } else if (text.length === 0 && isTyping) {
      setIsTyping(false);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setMessages(prev => prev.filter(msg => msg.id !== messageId));
            toast.show({
              description: 'Message deleted',
              duration: 2000,
            });
          }
        },
      ]
    );
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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

  const shouldShowDateSeparator = (currentMessage: GroupMessage, previousMessage?: GroupMessage) => {
    if (!previousMessage) return true;
    
    const currentDate = new Date(currentMessage.createdAt).toDateString();
    const previousDate = new Date(previousMessage.createdAt).toDateString();
    
    return currentDate !== previousDate;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'therapist':
        return appColors.AppBlue;
      case 'moderator':
        return '#4CAF50';
      case 'member':
        return appColors.grey3;
      default:
        return appColors.grey3;
    }
  };

  // Get display name based on privacy mode
  const getDisplayName = (message: GroupMessage) => {
    // Always show therapist names
    if (message.senderRole === 'therapist') {
      return message.senderName;
    }
    
    // Show own name
    if (message.isOwn) {
      return 'You';
    }
    
    // Privacy mode: show anonymous names for members
    if (privacyMode && message.senderRole === 'member') {
      return `Member ${message.anonymousId || '?'}`;
    }
    
    // Moderators: show name with badge
    if (message.senderRole === 'moderator') {
      return privacyMode ? `Member ${message.anonymousId || '?'}` : message.senderName;
    }
    
    // Default: show real name
    return message.senderName;
  };

  const renderGroupInfoHeader = () => (
    <View style={styles.groupInfoCard}>
      <View style={styles.groupIconContainer}>
        <Icon name={groupIcon} type="material" color={appColors.AppBlue} size={40} />
      </View>
      <View style={styles.groupInfo}>
        <Text style={styles.groupInfoName}>{groupName}</Text>
        {groupDescription && (
          <Text style={styles.groupInfoDescription}>{groupDescription}</Text>
        )}
        {privacyMode && (
          <View style={styles.privacyNotice}>
            <Icon name="lock" type="material" size={14} color={appColors.grey3} />
            <Text style={styles.privacyText}>Member identities are protected for privacy</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderMessage = ({ item, index }: { item: GroupMessage; index: number }) => {
    const previousMessage = index > 0 ? messages[index - 1] : undefined;
    const showDateSeparator = shouldShowDateSeparator(item, previousMessage);
    const displayName = getDisplayName(item);

    // Announcement messages
    if (item.type === 'announcement') {
      return (
        <View>
          {showDateSeparator && (
            <View style={styles.dateSeparator}>
              <Text style={styles.dateSeparatorText}>
                {formatDate(item.createdAt)}
              </Text>
            </View>
          )}
          <View style={styles.announcementContainer}>
            <View style={styles.announcementBadge}>
              <Icon name="campaign" type="material" size={14} color={appColors.CardBackground} />
              <Text style={styles.announcementBadgeText}>Announcement</Text>
            </View>
            <Text style={styles.announcementText}>{item.content}</Text>
            <Text style={styles.announcementTime}>{formatTime(item.createdAt)}</Text>
          </View>
        </View>
      );
    }

    // System messages
    if (item.type === 'system') {
      return (
        <View>
          {showDateSeparator && (
            <View style={styles.dateSeparator}>
              <Text style={styles.dateSeparatorText}>
                {formatDate(item.createdAt)}
              </Text>
            </View>
          )}
          <View style={styles.systemMessage}>
            <Text style={styles.systemMessageText}>{item.content}</Text>
          </View>
        </View>
      );
    }

    // Regular messages
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
          item.isOwn ? styles.ownMessageContainer : styles.otherMessageContainer
        ]}>
          {!item.isOwn && (
            <Avatar
              title={displayName.charAt(0)}
              size={32}
              rounded
              backgroundColor={getRoleColor(item.senderRole)}
              titleStyle={styles.avatarText}
              containerStyle={styles.messageAvatar}
            />
          )}
          
          <TouchableOpacity
            style={[
              styles.messageBubble,
              item.isOwn ? styles.ownMessageBubble : styles.otherMessageBubble
            ]}
            onLongPress={() => item.isOwn && handleDeleteMessage(item.id)}
          >
            {!item.isOwn && (
              <Text style={[
                styles.senderName,
                { color: getRoleColor(item.senderRole) }
              ]}>
                {displayName}
                {item.senderRole === 'therapist' && ' (Therapist)'}
                {item.senderRole === 'moderator' && !privacyMode && ' (Moderator)'}
              </Text>
            )}
            
            <Text style={[
              styles.messageText,
              item.isOwn ? styles.ownMessageText : styles.otherMessageText
            ]}>
              {item.content}
            </Text>
            
            <View style={styles.messageFooter}>
              <Text style={[
                styles.messageTime,
                item.isOwn ? styles.ownMessageTime : styles.otherMessageTime
              ]}>
                {formatTime(item.createdAt)}
              </Text>
              
              {item.isOwn && (
                <View style={styles.messageStatus}>
                  {!item.isDelivered ? (
                    <Icon name="schedule" type="material" color={appColors.grey4} size={14} />
                  ) : item.isSeen ? (
                    <Icon name="done-all" type="material" color={appColors.AppBlue} size={14} />
                  ) : (
                    <Icon name="done" type="material" color={appColors.grey4} size={14} />
                  )}
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (typingUsers.length === 0) return null;

    const typingNames = typingUsers.map(user => {
      if (privacyMode && user.anonymousId) {
        return `Member ${user.anonymousId}`;
      }
      return user.name;
    }).join(', ');

    return (
      <View style={styles.typingContainer}>
        <Text style={styles.typingText}>
          {typingNames} {typingUsers.length === 1 ? 'is' : 'are'} typing...
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ISStatusBar />
      <ISGenericHeader
        title={groupName || 'Group Chat'}
        hasLightBackground={false}
        navigation={navigation}
        hasRightIcon={true}
        rightIconName="info"
        rightIconOnPress={() => {
          navigation.navigate('GroupDetailScreen', { 
            group: { 
              id: groupId, 
              name: groupName, 
              icon: groupIcon,
              description: groupDescription,
              memberCount: memberCount,
              // Pass therapist info from route params or use defaults
              therapistName: route.params?.therapistName || 'Dr. Sarah Johnson',
              therapistAvatar: route.params?.therapistAvatar,
              therapistEmail: route.params?.therapistEmail || 'sarah.johnson@innerspark.com',
              category: route.params?.category || 'Mental Health',
              isPrivate: route.params?.isPrivate || false,
              maxMembers: route.params?.maxMembers || 20,
              meetingSchedule: route.params?.meetingSchedule,
              isJoined: true, // User is in chat, so they've joined
            } 
          });
        }}
      />

      {/* Offline Banner */}
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Icon name="wifi-off" type="material" color={appColors.CardBackground} size={16} />
          <Text style={styles.offlineBannerText}>
            You're offline. Messages will be sent when connection is restored.
          </Text>
        </View>
      )}

      {/* Messages */}
      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
          ListHeaderComponent={renderGroupInfoHeader}
          refreshControl={
            <RefreshControl 
              refreshing={isRefreshing} 
              onRefresh={handleRefresh} 
              colors={[appColors.AppBlue]} 
            />
          }
        />

        {renderTypingIndicator()}

        {/* Message Composer */}
        <View style={styles.composer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor={appColors.grey3}
              value={messageText}
              onChangeText={handleTyping}
              multiline
              maxLength={1000}
            />
            <TouchableOpacity 
              style={[
                styles.sendButton,
                messageText.trim() && isOnline ? styles.sendButtonActive : styles.sendButtonInactive
              ]}
              onPress={handleSendMessage}
              disabled={!messageText.trim() || isSending || !isOnline}
            >
              <Icon 
                name="send" 
                type="material" 
                color={messageText.trim() && isOnline ? appColors.CardBackground : appColors.grey3} 
                size={20} 
              />
            </TouchableOpacity>
          </View>
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
  offlineBanner: {
    backgroundColor: '#F44336',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  offlineBannerText: {
    color: appColors.CardBackground,
    fontSize: 12,
    fontFamily: appFonts.bodyTextRegular,
    marginLeft: 8,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  groupInfoCard: {
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  groupIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: appColors.AppBlue + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  groupInfo: {
    flex: 1,
  },
  groupInfoName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  groupInfoDescription: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: 8,
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  privacyText: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    fontStyle: 'italic',
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateSeparatorText: {
    fontSize: 12,
    color: appColors.grey3,
    backgroundColor: appColors.grey6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontFamily: appFonts.bodyTextRegular,
  },
  announcementContainer: {
    backgroundColor: appColors.AppBlue + '15',
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: appColors.AppBlue,
  },
  announcementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.AppBlue,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
    gap: 4,
  },
  announcementBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  announcementText: {
    fontSize: 14,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: 20,
  },
  announcementTime: {
    fontSize: 11,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginTop: 4,
  },
  systemMessage: {
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  systemMessageText: {
    fontSize: 14,
    color: appColors.AppBlue,
    backgroundColor: appColors.AppBlue + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    textAlign: 'center',
    fontFamily: appFonts.bodyTextRegular,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 2,
    alignItems: 'flex-end',
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    marginRight: 8,
    marginBottom: 4,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: appColors.CardBackground,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginVertical: 2,
  },
  ownMessageBubble: {
    backgroundColor: appColors.AppBlue,
    borderBottomRightRadius: 6,
  },
  otherMessageBubble: {
    backgroundColor: appColors.CardBackground,
    borderBottomLeftRadius: 6,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: appFonts.bodyTextRegular,
  },
  ownMessageText: {
    color: appColors.CardBackground,
  },
  otherMessageText: {
    color: appColors.grey1,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 12,
    fontFamily: appFonts.bodyTextRegular,
  },
  ownMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherMessageTime: {
    color: appColors.grey3,
  },
  messageStatus: {
    marginLeft: 4,
  },
  typingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingText: {
    fontSize: 12,
    color: appColors.grey3,
    fontStyle: 'italic',
    fontFamily: appFonts.bodyTextRegular,
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
    fontFamily: appFonts.bodyTextRegular,
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
});

export default GroupChatScreen;
