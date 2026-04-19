import React, { useState, useRef, useEffect } from 'react';
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
import { Icon, Avatar } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { appColors, appFonts } from '../../../global/Styles';
import { scale, moderateScale } from '../../../global/Scaling';
import ISStatusBar from '../../../components/ISStatusBar';
import ISAlert, { useISAlert } from '../../../components/alerts/ISAlert';
import { getChatMessages, sendMessage, markChatAsRead } from '../../../api/therapist';
import { sendChatHeartbeat } from '../../../api/client/messages';

const THChatConversationScreen = ({ navigation, route }: any) => {
  const { chat } = route.params || {};
  const userDetails = useSelector((state: any) => state.userData.userDetails);
  const alert = useISAlert();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages();
    // Optional: mark chat as read when opening
    if (chat?.id) {
      const therapistId = userDetails?.userId;
      markChatAsRead(chat.id, therapistId).catch(console.error);
    }
  }, [chat?.id]);

  const [peerOnline, setPeerOnline] = useState<boolean>(chat?.isOnline || false);

  const sendHeartbeat = async () => {
    if (!chat?.id || !userDetails?.userId) return;
    try {
      const response = await sendChatHeartbeat(chat.id, userDetails.userId);
      const isOnline = response.data?.is_peer_online ?? response.is_peer_online ?? false;
      setPeerOnline(isOnline);
    } catch (e) {
      console.warn('Heartbeat failed', e);
    }
  };

  useEffect(() => {
    sendHeartbeat();
    const hbInterval = setInterval(() => {
      sendHeartbeat();
    }, 10000);
    return () => clearInterval(hbInterval);
  }, []);

  // Scroll to bottom only on first load, not on every messages change
  const hasScrolledOnceRef = useRef(false);
  const isNearBottomRef = useRef(true);

  useEffect(() => {
    if (messages.length > 0 && !hasScrolledOnceRef.current) {
      hasScrolledOnceRef.current = true;
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [messages]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const therapistId = userDetails?.userId;
      if (!chat?.id) return;

      const response: any = await getChatMessages(chat.id, therapistId);

      if (response?.data?.messages) {
        const mappedMessages = response.data.messages.map((msg: any) => ({
          id: msg.id,
          text: msg.content,
          sender: msg.senderType, // 'client' or 'therapist'
          timestamp: msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Unknown',
          _sortKey: msg.timestamp || '',
        }));
        // Explicit ascending sort — guard against API returning newest-first
        mappedMessages.sort((a: any, b: any) => new Date(a._sortKey).getTime() - new Date(b._sortKey).getTime());
        setMessages(mappedMessages);
      } else {
        setMessages([]);
      }
    } catch (error: any) {
      const errorMessage = error.backendMessage || error.message || 'Failed to load messages';
      console.error('Messages Error:', errorMessage);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !chat?.id) return;

    // UI Optimistic Update
    const newMessage = {
      id: Date.now().toString(),
      text: message.trim(),
      sender: 'therapist',
      timestamp: 'Sending...',
    };
    setMessages([...messages, newMessage]);
    const messageToSend = message.trim();
    setMessage('');

    try {
      const therapistId = userDetails?.userId;
      const response: any = await sendMessage(chat.id, therapistId, messageToSend);

      if (response?.success) {
        // Optionally refresh the whole list or just update the timestamp
        // loadMessages(); 
      }
    } catch (error: any) {
      const errorMessage = error.backendMessage || 'Failed to send message';
      alert.show({ type: 'error', title: 'Error', message: errorMessage });
      console.error('Send Error:', error);
      // Remove the optimistic message if it failed
      setMessages(msgs => msgs.filter(m => m.id !== newMessage.id));
    }
  };

  const handleViewClientProfile = () => {
    navigation.navigate('THClientProfileScreen', { client: chat });
  };

  const handleScheduleSession = () => {
    navigation.navigate('THScheduleAppointmentScreen', { client: chat });
  };

  const handleViewNotes = () => {
    navigation.navigate('THClientProfileScreen', { client: chat, initialTab: 'notes' });
  };

  const renderMessage = ({ item }: any) => {
    const isTherapist = item.sender === 'therapist';

    return (
      <View style={[styles.messageContainer, isTherapist ? styles.therapistMessage : styles.clientMessage]}>
        <View style={[styles.messageBubble, isTherapist ? styles.therapistBubble : styles.clientBubble]}>
          <Text style={[styles.messageText, isTherapist ? styles.therapistText : styles.clientText]}>
            {item.text}
          </Text>
          <Text style={[styles.timestamp, isTherapist ? styles.therapistTimestamp : styles.clientTimestamp]}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ISStatusBar />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={moderateScale(24)} />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          {chat?.clientAvatar && (
            <Avatar source={chat.clientAvatar} size={scale(40)} rounded containerStyle={styles.headerAvatar} />
          )}
          <View style={styles.headerText}>
            <Text style={styles.headerName}>{chat?.clientName || 'Chat'}</Text>
            <Text style={styles.headerStatus}>
              {peerOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.headerButton} onPress={handleViewClientProfile}>
          <Icon name="info" type="material" color={appColors.CardBackground} size={moderateScale(24)} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Quick Actions Bar */}
        <View style={styles.quickActionsBar}>
          <TouchableOpacity style={styles.quickAction} onPress={handleViewNotes}>
            <Icon type="material" name="description" size={16} color={appColors.AppBlue} />
            <Text style={styles.quickActionText}>Notes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={handleScheduleSession}>
            <Icon type="material" name="event" size={16} color={appColors.AppBlue} />
            <Text style={styles.quickActionText}>Schedule</Text>
          </TouchableOpacity>
          <View style={styles.quickAction}>
            <View style={styles.onlineStatus}>
              <View style={[styles.statusDot, { backgroundColor: chat?.online ? appColors.AppGreen : appColors.grey3 }]} />
              <Text style={styles.quickActionText}>{chat?.online ? 'Online' : 'Offline'}</Text>
            </View>
          </View>
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.messagesList,
            messages.length === 0 && styles.emptyListContent
          ]}
          showsVerticalScrollIndicator={false}
          onScroll={(e) => {
            const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
            isNearBottomRef.current = contentSize.height - contentOffset.y - layoutMeasurement.height < 80;
          }}
          scrollEventThrottle={100}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyStateContainer}>
                <Icon type="material" name="chat" size={60} color={appColors.AppBlue + '40'} />
                <Text style={styles.emptyStateTitle}>No Messages Yet</Text>
                <Text style={styles.emptyStateText}>
                  Send a message to start the conversation with {chat?.clientName || 'this client'}.
                </Text>
              </View>
            ) : null
          }
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Icon type="material" name="attach-file" size={24} color={appColors.grey3} />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={appColors.grey3}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />

          <TouchableOpacity
            style={[styles.sendButton, message.trim() ? styles.sendButtonActive : null]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Icon
              type="material"
              name="send"
              size={24}
              color={message.trim() ? '#FFFFFF' : appColors.grey3}
            />
          </TouchableOpacity>
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
    paddingTop: moderateScale(10),
    paddingBottom: moderateScale(16),
    paddingHorizontal: moderateScale(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: scale(8),
    marginRight: scale(4),
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
  keyboardView: {
    flex: 1,
  },
  quickActionsBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey6,
    gap: 16,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quickActionText: {
    fontSize: 13,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextMedium,
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  clientMessage: {
    alignSelf: 'flex-start',
  },
  therapistMessage: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  clientBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  therapistBubble: {
    backgroundColor: appColors.AppBlue,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: 4,
  },
  clientText: {
    color: appColors.grey1,
  },
  therapistText: {
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 11,
    fontFamily: appFonts.bodyTextRegular,
  },
  clientTimestamp: {
    color: appColors.grey3,
  },
  therapistTimestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: appColors.grey6,
    gap: 8,
  },
  attachButton: {
    padding: 8,
    marginBottom: 4,
  },
  input: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: appColors.grey6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  sendButtonActive: {
    backgroundColor: appColors.AppBlue,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: appFonts.headerTextBold,
    color: appColors.grey2,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: appFonts.bodyTextRegular,
    color: appColors.grey3,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default THChatConversationScreen;
