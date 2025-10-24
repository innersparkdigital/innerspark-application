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
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Icon } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';

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
  const flatListRef = useRef<FlatList>(null);
  const { partnerId, partnerName, partnerAvatar, isOnline, lastSeen, partnerEmail } = route.params;

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Mock messages data
  const mockMessages: Message[] = [
    {
      id: '1',
      senderId: 'current_user',
      senderName: 'You',
      content: 'Hi Dr. Johnson, I wanted to follow up on our session yesterday.',
      createdAt: '2025-01-27T10:30:00Z',
      isRead: true,
      isSent: true,
      isOwn: true,
      type: 'text',
    },
    {
      id: '2',
      senderId: partnerId,
      senderName: partnerName,
      content: 'Hello! I\'m glad you reached out. How are you feeling today?',
      createdAt: '2025-01-27T10:32:00Z',
      isRead: true,
      isSent: true,
      isOwn: false,
      type: 'text',
    },
    {
      id: '3',
      senderId: 'current_user',
      senderName: 'You',
      content: 'I\'ve been practicing the breathing exercises you taught me, and they really help with my anxiety.',
      createdAt: '2025-01-27T10:35:00Z',
      isRead: true,
      isSent: true,
      isOwn: true,
      type: 'text',
    },
    {
      id: '4',
      senderId: partnerId,
      senderName: partnerName,
      content: 'That\'s wonderful to hear! Consistency is key with these techniques. Have you noticed any particular times when they work best for you?',
      createdAt: '2025-01-27T10:38:00Z',
      isRead: true,
      isSent: true,
      isOwn: false,
      type: 'text',
    },
    {
      id: '5',
      senderId: 'current_user',
      senderName: 'You',
      content: 'Definitely in the mornings before work. It helps me start the day with a clearer mind.',
      createdAt: '2025-01-27T10:40:00Z',
      isRead: true,
      isSent: true,
      isOwn: true,
      type: 'text',
    },
    {
      id: '6',
      senderId: partnerId,
      senderName: partnerName,
      content: 'Thank you for the session today. Remember to practice the breathing exercises we discussed.',
      createdAt: '2025-01-27T14:20:00Z',
      isRead: false,
      isSent: true,
      isOwn: false,
      type: 'text',
    },
  ];

  useEffect(() => {
    loadMessages();
    // Mark messages as read when viewing
    markMessagesAsRead();
  }, []);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setMessages(mockMessages);
        setIsLoading(false);
        scrollToBottom();
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      toast.show({
        description: 'Failed to load messages',
        duration: 3000,
      });
    }
  };

  const markMessagesAsRead = () => {
    // Mark all unread messages from partner as read
    setMessages(prev => 
      prev.map(msg => 
        !msg.isOwn && !msg.isRead 
          ? { ...msg, isRead: true }
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

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'current_user',
      senderName: 'You',
      content: messageText.trim(),
      createdAt: new Date().toISOString(),
      isRead: false,
      isSent: false,
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
              ? { ...msg, isSent: true }
              : msg
          )
        );
        setIsSending(false);
      }, 1000);
    } catch (error) {
      setIsSending(false);
      // Show retry option
      Alert.alert(
        'Failed to send message',
        'Would you like to try again?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Retry', onPress: () => handleSendMessage() },
        ]
      );
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
            <Avatar
              source={partnerAvatar}
              size={32}
              rounded
              containerStyle={styles.messageAvatar}
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
                    <Icon name="schedule" type="material" color={appColors.grey4} size={16} />
                  ) : item.isRead ? (
                    <Icon name="done-all" type="material" color={appColors.AppBlue} size={16} />
                  ) : (
                    <Icon name="done" type="material" color={appColors.grey4} size={16} />
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
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={24} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          {partnerAvatar && (
            <Avatar
              source={partnerAvatar}
              size={40}
              rounded
              containerStyle={styles.headerAvatar}
            />
          )}
          <View style={styles.headerText}>
            <Text style={styles.headerName}>{partnerName}</Text>
            <Text style={styles.headerStatus}>
              {isOnline ? 'Online' : `Last seen ${lastSeen}`}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.navigate('TherapistProfileViewScreen', { 
            therapist: { partnerId, partnerName, partnerAvatar, isOnline, lastSeen, partnerEmail } 
          })}
        >
          <Icon name="info" type="material" color={appColors.CardBackground} size={24} />
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
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
        />

        {/* Message Composer */}
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
    backgroundColor: appColors.AppBlue,
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
  headerAvatar: {
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  headerStatus: {
    fontSize: 12,
    color: appColors.CardBackground + 'CC',
    fontFamily: appFonts.regularText,
  },
  headerButton: {
    padding: 8,
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
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 2,
    paddingHorizontal: 16,
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  partnerMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    marginRight: 8,
    alignSelf: 'flex-end',
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
  partnerMessageBubble: {
    backgroundColor: appColors.CardBackground,
    borderBottomLeftRadius: 6,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: appFonts.regularText,
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
    marginTop: 4,
  },
  messageTime: {
    fontSize: 12,
    fontFamily: appFonts.regularText,
  },
  ownMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  partnerMessageTime: {
    color: appColors.grey3,
  },
  messageStatus: {
    marginLeft: 4,
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

export default DMThreadScreen;
