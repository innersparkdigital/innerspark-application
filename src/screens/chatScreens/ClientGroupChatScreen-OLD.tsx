/**
 * Client Group Chat Screen - Privacy-focused group chat for clients
 * - Anonymous member names (Member 1, Member 2, etc.)
 * - Only therapist messages show real names
 * - No moderation tools for clients
 * - No member list access
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Icon } from '@rneui/base';
import { appColors, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';

interface GroupMessage {
  id: string;
  senderId: string;
  senderName: string; // Will be anonymized for non-therapists
  senderType: 'therapist' | 'member' | 'system';
  content: string;
  timestamp: string;
  isOwn: boolean;
  messageType: 'text' | 'announcement' | 'system';
}

interface ClientGroupChatScreenProps {
  navigation: any;
  route: any;
}

const ClientGroupChatScreen: React.FC<ClientGroupChatScreenProps> = ({ navigation, route }) => {
  const toast = useToast();
  const flatListRef = useRef<FlatList>(null);
  const { group } = route.params || {};

  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Mock messages with privacy - member names are anonymous
  const mockMessages: GroupMessage[] = [
    {
      id: '1',
      senderId: 'therapist_1',
      senderName: 'Dr. Sarah Johnson',
      senderType: 'therapist',
      content: 'Welcome everyone to today\'s group session. Let\'s start by checking in with how everyone is feeling.',
      timestamp: '2025-01-27T14:00:00Z',
      isOwn: false,
      messageType: 'text',
    },
    {
      id: '2',
      senderId: 'member_1',
      senderName: 'Group Member', // Anonymous
      senderType: 'member',
      content: 'I\'ve been feeling a bit anxious this week, but the breathing exercises are helping.',
      timestamp: '2025-01-27T14:02:00Z',
      isOwn: false,
      messageType: 'text',
    },
    {
      id: '3',
      senderId: 'current_user',
      senderName: 'You',
      senderType: 'member',
      content: 'Thank you for sharing. I can relate to that feeling.',
      timestamp: '2025-01-27T14:05:00Z',
      isOwn: true,
      messageType: 'text',
    },
    {
      id: '4',
      senderId: 'member_2',
      senderName: 'Group Member', // Anonymous
      senderType: 'member',
      content: 'Same here. It\'s comforting to know we\'re not alone in this.',
      timestamp: '2025-01-27T14:07:00Z',
      isOwn: false,
      messageType: 'text',
    },
    {
      id: '5',
      senderId: 'therapist_1',
      senderName: 'Dr. Sarah Johnson',
      senderType: 'therapist',
      content: 'That\'s wonderful to hear. Remember, this is a safe space for everyone to share.',
      timestamp: '2025-01-27T14:10:00Z',
      isOwn: false,
      messageType: 'announcement',
    },
    {
      id: '6',
      senderId: 'member_3',
      senderName: 'Group Member', // Anonymous
      senderType: 'member',
      content: 'I tried the meditation technique we discussed last week. It really helped me sleep better.',
      timestamp: '2025-01-27T14:15:00Z',
      isOwn: false,
      messageType: 'text',
    },
  ];

  useEffect(() => {
    loadMessages();
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadMessages();
    setIsRefreshing(false);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || isSending) return;

    setIsSending(true);
    try {
      const newMessage: GroupMessage = {
        id: Date.now().toString(),
        senderId: 'current_user',
        senderName: 'You',
        senderType: 'member',
        content: messageText.trim(),
        timestamp: new Date().toISOString(),
        isOwn: true,
        messageType: 'text',
      };

      setMessages(prev => [...prev, newMessage]);
      setMessageText('');
      scrollToBottom();

      // TODO: Send to API
      // await APIInstance.post(`/api/v1/groups/${group.id}/messages`, { content: messageText });

      setIsSending(false);
    } catch (error) {
      setIsSending(false);
      toast.show({
        description: 'Failed to send message',
        duration: 3000,
      });
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }: { item: GroupMessage }) => {
    const isAnnouncement = item.messageType === 'announcement';
    const isTherapist = item.senderType === 'therapist';

    if (isAnnouncement) {
      return (
        <View style={styles.announcementContainer}>
          <View style={styles.announcementBadge}>
            <Icon name="campaign" type="material" size={14} color={appColors.CardBackground} />
            <Text style={styles.announcementBadgeText}>Announcement</Text>
          </View>
          <Text style={styles.announcementText}>{item.content}</Text>
          <Text style={styles.announcementTime}>{formatTime(item.timestamp)}</Text>
        </View>
      );
    }

    return (
      <View style={[styles.messageContainer, item.isOwn && styles.ownMessageContainer]}>
        {!item.isOwn && (
          <View style={styles.avatarContainer}>
            {isTherapist ? (
              <Avatar
                rounded
                size={32}
                icon={{ name: 'medical-services', type: 'material', color: appColors.CardBackground }}
                containerStyle={{ backgroundColor: appColors.AppBlue }}
              />
            ) : (
              <Avatar
                rounded
                size={32}
                title="M"
                containerStyle={{ backgroundColor: appColors.grey3 }}
                titleStyle={{ fontSize: 14, color: appColors.CardBackground }}
              />
            )}
          </View>
        )}

        <View style={[styles.messageBubble, item.isOwn ? styles.ownBubble : styles.otherBubble]}>
          {!item.isOwn && (
            <Text style={[styles.senderName, isTherapist && styles.therapistName]}>
              {item.senderName}
              {isTherapist && ' (Therapist)'}
            </Text>
          )}
          <Text style={[styles.messageText, item.isOwn && styles.ownMessageText]}>
            {item.content}
          </Text>
          <Text style={[styles.messageTime, item.isOwn && styles.ownMessageTime]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.groupInfoCard}>
      <View style={styles.groupIconContainer}>
        <Text style={styles.groupIcon}>{group?.icon || '💬'}</Text>
      </View>
      <View style={styles.groupInfo}>
        <Text style={styles.groupName}>{group?.name || 'Support Group'}</Text>
        <Text style={styles.groupDescription}>{group?.description || 'A safe space to share and support each other'}</Text>
        <View style={styles.privacyNotice}>
          <Icon name="lock" type="material" size={14} color={appColors.grey3} />
          <Text style={styles.privacyText}>Member identities are protected for privacy</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ISStatusBar />
      <ISGenericHeader
        title={group?.name || 'Group Chat'}
        hasLightBackground={false}
        navigation={navigation}
        hasRightIcon={true}
        rightIconName="info"
        rightIconOnPress={() => {
          navigation.navigate('GroupInfoScreen', { group });
        }}
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          ListHeaderComponent={renderHeader}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={[appColors.AppBlue]} />
          }
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
        />

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={appColors.grey3}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!messageText.trim() || isSending}
          >
            <Icon
              name="send"
              type="material"
              size={24}
              color={messageText.trim() ? appColors.CardBackground : appColors.grey4}
            />
          </TouchableOpacity>
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
  messagesList: {
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
  groupIcon: {
    fontSize: 32,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  groupDescription: {
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
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    alignItems: 'flex-end',
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  avatarContainer: {
    marginRight: 8,
    marginBottom: 4,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  ownBubble: {
    backgroundColor: appColors.AppBlue,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: appColors.CardBackground,
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  therapistName: {
    color: appColors.AppBlue,
  },
  messageText: {
    fontSize: 15,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: 20,
  },
  ownMessageText: {
    color: appColors.CardBackground,
  },
  messageTime: {
    fontSize: 11,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginTop: 4,
  },
  ownMessageTime: {
    color: appColors.CardBackground + 'CC',
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
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: appColors.CardBackground,
    borderTopWidth: 1,
    borderTopColor: appColors.grey6,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
    borderRadius: 24,
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
    backgroundColor: appColors.AppBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: appColors.grey5,
  },
});

export default ClientGroupChatScreen;
