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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Icon } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import { scale, moderateScale } from '../../global/Scaling';
import { useSelector, useDispatch } from 'react-redux';
import { loadMessages, sendChatMessage, markConversationRead } from '../../utils/chatManager';
import { selectMessages, selectChatLoading, selectChatSending } from '../../features/chat/chatSlice';
import ISAlert, { useISAlert } from '../../components/alerts/ISAlert';

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
  const dispatch = useDispatch();
  const flatListRef = useRef<FlatList>(null);
  const { partnerId, partnerName, partnerAvatar, isOnline, lastSeen, partnerEmail } = route.params;
  const userId = useSelector((state: any) => state.userData.userDetails.userId);
  const chatId = `${userId}_${partnerId}`;

  const messages = useSelector(selectMessages);
  const isLoading = useSelector(selectChatLoading);
  const isSending = useSelector(selectChatSending);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    loadMessagesData();
    markMessagesAsRead();
  }, []);

  const loadMessagesData = async () => {
    const result = await dispatch(loadMessages(userId, chatId));
    if (!result.success) {
      toast.show({
        description: 'Failed to load messages',
        duration: 3000,
      });
    } else {
      scrollToBottom();
    }
  };

  const markMessagesAsRead = async () => {
    await dispatch(markConversationRead(userId, chatId));
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
    scrollToBottom();

    const result = await dispatch(sendChatMessage(userId, chatId, content));
    if (!result.success) {
      toast.show({
        description: 'Failed to send message',
        duration: 3000,
      });
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
              size={scale(32)}
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
          {partnerAvatar && (
            <Avatar
              source={partnerAvatar}
              size={scale(40)}
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
                size={moderateScale(20)}
              />
            </TouchableOpacity>
          </View>
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
});

export default DMThreadScreen;
