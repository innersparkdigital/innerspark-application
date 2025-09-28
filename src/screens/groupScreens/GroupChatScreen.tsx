/**
 * Group Chat Screen - Real-time group chat with typing indicators and message management
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
import { Avatar, Icon } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';

interface GroupMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'therapist' | 'moderator' | 'member';
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
}

interface GroupChatScreenProps {
  navigation: any;
  route: any;
}

const GroupChatScreen: React.FC<GroupChatScreenProps> = ({ navigation, route }) => {
  const toast = useToast();
  const flatListRef = useRef<FlatList>(null);
  const { groupId, groupName, groupIcon, memberCount, userRole } = route.params;

  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Mock messages data
  const mockMessages: GroupMessage[] = [
    {
      id: '1',
      senderId: 'therapist_1',
      senderName: 'Dr. Sarah Johnson',
      senderRole: 'therapist',
      content: 'Welcome everyone to today\'s group session. Let\'s start by sharing how everyone is feeling today.',
      createdAt: '2025-01-27T19:00:00Z',
      isDelivered: true,
      isSeen: true,
      isOwn: false,
      type: 'announcement',
    },
    {
      id: '2',
      senderId: 'member_1',
      senderName: 'Michael',
      senderRole: 'member',
      content: 'Hi everyone! I\'ve been practicing the breathing exercises we learned last week and they\'ve really helped with my anxiety.',
      createdAt: '2025-01-27T19:02:00Z',
      isDelivered: true,
      isSeen: true,
      isOwn: false,
      type: 'text',
    },
    {
      id: '3',
      senderId: 'current_user',
      senderName: 'You',
      senderRole: 'member',
      content: 'That\'s great to hear, Michael! I\'ve been struggling a bit this week but I\'m trying to stay positive.',
      createdAt: '2025-01-27T19:03:00Z',
      isDelivered: true,
      isSeen: false,
      isOwn: true,
      type: 'text',
    },
    {
      id: '4',
      senderId: 'moderator_1',
      senderName: 'Lisa (Moderator)',
      senderRole: 'moderator',
      content: 'Remember, it\'s okay to have difficult days. What matters is that you\'re here and you\'re trying. That takes courage.',
      createdAt: '2025-01-27T19:05:00Z',
      isDelivered: true,
      isSeen: true,
      isOwn: false,
      type: 'text',
    },
    {
      id: '5',
      senderId: 'member_2',
      senderName: 'Emma',
      senderRole: 'member',
      content: 'I agree with Lisa. We\'re all here to support each other. @You, you\'re doing great by being here and sharing.',
      createdAt: '2025-01-27T19:06:00Z',
      isDelivered: true,
      isSeen: true,
      isOwn: false,
      type: 'text',
    },
    {
      id: '6',
      senderId: 'therapist_1',
      senderName: 'Dr. Sarah Johnson',
      senderRole: 'therapist',
      content: 'Let\'s try a quick mindfulness exercise together. Take a deep breath in for 4 counts, hold for 4, and exhale for 6.',
      createdAt: '2025-01-27T19:08:00Z',
      isDelivered: true,
      isSeen: false,
      isOwn: false,
      type: 'text',
    },
  ];

  useEffect(() => {
    loadMessages();
    // Simulate socket connection
    simulateSocketEvents();
    
    return () => {
      // Cleanup socket connection
      handleSocketLeave();
    };
  }, []);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setMessages(mockMessages);
        setIsLoading(false);
        scrollToBottom();
        markMessagesAsSeen();
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      toast.show({
        description: 'Failed to load messages',
        duration: 3000,
      });
    }
  };

  const simulateSocketEvents = () => {
    // Simulate typing indicators
    setTimeout(() => {
      setTypingUsers([{ id: 'member_3', name: 'James' }]);
    }, 3000);

    setTimeout(() => {
      setTypingUsers([]);
      // Simulate new message received
      const newMessage: GroupMessage = {
        id: Date.now().toString(),
        senderId: 'member_3',
        senderName: 'James',
        senderRole: 'member',
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
    // Simulate joining socket room
    console.log(`Joined group chat: ${groupId}`);
  };

  const handleSocketLeave = () => {
    // Simulate leaving socket room
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
    if (!messageText.trim() || isSending) return;

    const newMessage: GroupMessage = {
      id: Date.now().toString(),
      senderId: 'current_user',
      senderName: 'You',
      senderRole: userRole || 'member',
      content: messageText.trim(),
      createdAt: new Date().toISOString(),
      isDelivered: false,
      isSeen: false,
      isOwn: true,
      type: 'text',
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageText('');
    setIsSending(true);
    scrollToBottom();

    try {
      // Simulate API call
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, isDelivered: true }
              : msg
          )
        );
        setIsSending(false);
      }, 1000);
    } catch (error) {
      setIsSending(false);
      Alert.alert(
        'Failed to send message',
        'Please check your connection and try again.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Retry', onPress: () => handleSendMessage() },
        ]
      );
    }
  };

  const handleTyping = (text: string) => {
    setMessageText(text);
    
    if (text.length > 0 && !isTyping) {
      setIsTyping(true);
      // Simulate socket emit typing start
    } else if (text.length === 0 && isTyping) {
      setIsTyping(false);
      // Simulate socket emit typing stop
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

  const renderMessage = ({ item, index }: { item: GroupMessage; index: number }) => {
    const previousMessage = index > 0 ? messages[index - 1] : undefined;
    const showDateSeparator = shouldShowDateSeparator(item, previousMessage);

    if (item.type === 'system' || item.type === 'announcement') {
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
              title={item.senderName.charAt(0)}
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
                {item.senderName}
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

    return (
      <View style={styles.typingContainer}>
        <Text style={styles.typingText}>
          {typingUsers.map(user => user.name).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
        </Text>
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
        
        <View style={styles.headerInfo}>
          <Icon name={groupIcon} type="material" color={appColors.AppBlue} size={32} />
          <View style={styles.headerText}>
            <Text style={styles.headerName}>{groupName}</Text>
            <Text style={styles.headerStatus}>
              {memberCount} members • {isOnline ? 'Connected' : 'Offline'}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.navigate('GroupDetailScreen', { group: { id: groupId, name: groupName, icon: groupIcon } })}
        >
          <Icon name="info" type="material" color={appColors.grey1} size={24} />
        </TouchableOpacity>
      </View>

      {/* Offline Banner */}
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Icon name="wifi-off" type="material" color={appColors.CardBackground} size={16} />
          <Text style={styles.offlineBannerText}>You're offline. Messages will be sent when connection is restored.</Text>
        </View>
      )}

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
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
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
                messageText.trim() ? styles.sendButtonActive : styles.sendButtonInactive
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
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  headerStatus: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.regularText,
  },
  headerButton: {
    padding: 8,
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
    fontFamily: appFonts.regularText,
    marginLeft: 8,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
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
    fontFamily: appFonts.regularText,
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
    fontFamily: appFonts.regularText,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 2,
    paddingHorizontal: 16,
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    marginRight: 8,
    alignSelf: 'flex-end',
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
    fontFamily: appFonts.regularText,
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
    fontFamily: appFonts.regularText,
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
    fontFamily: appFonts.regularText,
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
});

export default GroupChatScreen;
