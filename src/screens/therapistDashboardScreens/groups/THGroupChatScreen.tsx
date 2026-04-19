/**
 * Therapist Group Chat Screen - Manage group conversations with moderation tools
 */
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
  Modal,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import { appColors, appFonts } from '../../../global/Styles';
import { moderateScale } from '../../../global/Scaling';
import ISGenericHeader from '../../../components/ISGenericHeader';
import ISStatusBar from '../../../components/ISStatusBar';
import ISAlert, { useISAlert } from '../../../components/alerts/ISAlert';
import { useSelector } from 'react-redux';
import {
  getGroupMessages,
  sendGroupMessage,
  sendAnnouncement,
  deleteGroupMessage,
  muteGroupMember
} from '../../../api/therapist';
import { messageSchema, announcementSchema } from '../../../global/LHValidators';

interface GroupMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'therapist' | 'moderator' | 'member';
  content: string;
  timestamp: string;
  isOwn: boolean;
  type: 'text' | 'system' | 'announcement';
}

const THGroupChatScreen = ({ navigation, route }: any) => {
  const { group } = route.params || {};
  const userDetails = useSelector((state: any) => state.userData.userDetails);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const alert = useISAlert();

  const [showModTools, setShowModTools] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    if (!group?.id) return;
    try {
      setLoading(true);
      const therapistId = userDetails?.userId;
      const res: any = await getGroupMessages(group.id, therapistId);
      if (res?.data?.messages) {
        const userId = userDetails?.userId;
        const mappedMessages = res.data.messages.map((msg: any) => ({
          ...msg,
          isOwn: String(msg.senderId || msg.sender_id) === String(userId)
        }));
        // Sort oldest-first so messages flow top-to-bottom naturally
        mappedMessages.sort((a: GroupMessage, b: GroupMessage) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setMessages(mappedMessages);
      }
    } catch (error: any) {
      const errorMessage = error.backendMessage || error.message || 'Failed to load messages';
      console.error('Group Messages Error:', errorMessage);
    }
    finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMessages();
  };

  // Scroll to bottom only after the very first successful load
  const hasScrolledOnceRef = useRef(false);
  useEffect(() => {
    if (messages.length > 0 && !hasScrolledOnceRef.current) {
      hasScrolledOnceRef.current = true;
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!group?.id) return;

    const result = messageSchema.safeParse(message);
    if (!result.success) {
      alert.show({ type: 'warning', title: 'Invalid Message', message: result.error.issues[0].message });
      return;
    }

    try {
      const therapistId = userDetails?.userId;
      const content = message.trim();
      setMessage(''); // clear immediately for UX

      await sendGroupMessage(group.id, therapistId, content);
      loadMessages();
    } catch (error: any) {
      const errorMessage = error.backendMessage || error.message || 'Failed to send message';
      console.error('Send Message Error:', errorMessage);
      alert.show({ type: 'error', title: 'Error', message: errorMessage });
    }
  };

  const handleSendAnnouncement = () => {
    setShowAnnouncementModal(true);
  };

  const sendAnnouncementAction = async () => {
    if (!group?.id) return;

    const result = announcementSchema.safeParse(announcementText);
    if (!result.success) {
      alert.show({ type: 'warning', title: 'Invalid Announcement', message: result.error.issues[0].message });
      return;
    }

    try {
      const therapistId = userDetails?.userId;
      const content = announcementText.trim();
      setAnnouncementText('');
      setShowAnnouncementModal(false);

      await sendAnnouncement(group.id, therapistId, content);
      loadMessages();
    } catch (error: any) {
      const errorMessage = error.backendMessage || error.message || 'Failed to send announcement';
      console.error('Announcement Error:', errorMessage);
      alert.show({ type: 'error', title: 'Error', message: errorMessage });
    }
  };

  const handleMuteUser = (userId: string, userName: string) => {
    alert.show({
      type: 'warning',
      title: 'Mute User',
      message: `Temporarily mute ${userName}? They won't be able to send messages for 5 minutes.`,
      confirmText: 'Mute',
      cancelText: 'Cancel',
      onConfirm: async () => {
        try {
          const therapistId = userDetails?.userId;
          // Mute for 5 minutes (300 seconds)
          await muteGroupMember(group.id, userId, therapistId, 300);
          alert.show({ type: 'success', title: 'User Muted', message: `${userName} has been muted for 5 minutes.` });
        } catch (error: any) {
          alert.show({ type: 'error', title: 'Error', message: error.backendMessage || 'Failed to mute user' });
        }
      },
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    alert.show({
      type: 'destructive',
      title: 'Delete Message',
      message: 'Are you sure you want to delete this message?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: async () => {
        try {
          const therapistId = userDetails?.userId;
          // Optimistic update
          setMessages(messages.filter((m) => m.id !== messageId));
          if (group?.id) {
            await deleteGroupMessage(group.id, messageId, therapistId);
          }
        } catch (error: any) {
          const errorMessage = error.backendMessage || error.message || 'Failed to delete message';
          console.error('Delete Message Error:', errorMessage);
          alert.show({ type: 'error', title: 'Error', message: errorMessage });
          loadMessages();
        }
      },
    });
  };

  const handleViewMembers = () => {
    navigation.navigate('THGroupMembersScreen', { group });
  };

  const handleViewMuted = () => {
    navigation.navigate('THGroupMembersScreen', { group, filter: 'muted' });
  };

  const formatTime = (ts: string) => {
    if (!ts) return '';
    try {
      const date = new Date(ts);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return ts;
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Icon type="material" name="chat-bubble-outline" size={48} color={appColors.AppBlue} />
      </View>
      <Text style={styles.emptyTitle}>No messages yet</Text>
      <Text style={styles.emptySubtitle}>
        Start the conversation by sending a message or post an announcement to the group.
      </Text>
    </View>
  );

  const renderMessage = ({ item }: { item: GroupMessage }) => {
    const isTherapist = item.senderRole === 'therapist';
    const isAnnouncement = item.type === 'announcement';

    if (isAnnouncement) {
      return (
        <View style={styles.announcementContainer}>
          <View style={styles.announcementBubble}>
            <Icon type="material" name="campaign" size={16} color={appColors.AppBlue} />
            <Text style={styles.announcementLabel}>Announcement</Text>
          </View>
          <Text style={styles.announcementText}>{item.content}</Text>
          <Text style={styles.announcementTime}>{item.timestamp}</Text>
        </View>
      );
    }

    const isOwn = item.isOwn;

    return (
      <View style={[
        styles.messageWrapper,
        isOwn ? styles.ownWrapper : styles.otherWrapper
      ]}>
        {!isOwn && (
          <View style={styles.senderInfo}>
            <Text style={styles.senderName}>{item.senderName}</Text>
            {isTherapist && (
              <View style={styles.therapistBadge}>
                <Text style={styles.therapistBadgeText}>Therapist</Text>
              </View>
            )}
          </View>
        )}
        
        <TouchableOpacity
          style={[
            styles.messageBubble,
            isOwn ? styles.ownBubble : styles.otherBubble,
          ]}
          onLongPress={() => {
            if (isOwn) {
              handleDeleteMessage(item.id);
            } else {
              alert.show({
                type: 'info',
                title: 'Moderation',
                message: `What would you like to do?`,
                actions: [
                  { text: 'Delete Message', style: 'destructive', onPress: () => handleDeleteMessage(item.id) },
                  { text: 'Mute User', onPress: () => handleMuteUser(item.senderId, item.senderName) },
                  { text: 'Cancel', style: 'cancel' }
                ]
              });
            }
          }}
          activeOpacity={0.9}
        >
          <Text
            style={[
              styles.messageText,
              isOwn ? styles.ownText : styles.otherText,
            ]}
          >
            {item.content}
          </Text>
          <View style={styles.bubbleFooter}>
            <Text
              style={[
                styles.timestamp,
                isOwn ? styles.ownTimestamp : styles.otherTimestamp,
              ]}
            >
              {formatTime(item.timestamp)}
            </Text>
            {isOwn && (
              <Icon 
                type="material" 
                name="done-all" 
                size={14} 
                color="rgba(255, 255, 255, 0.7)" 
                style={{ marginLeft: 4 }} 
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ISStatusBar />
      <ISGenericHeader
        title={group?.name || 'Group Chat'}
        navigation={navigation}
        hasRightIcon={true}
        rightIconName="more-vert"
        rightIconOnPress={() => setShowModTools(!showModTools)}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Moderation Tools Bar */}
        {showModTools && (
          <View style={styles.modToolsBar}>
            <TouchableOpacity style={styles.modTool} onPress={handleSendAnnouncement}>
              <Icon type="material" name="campaign" size={20} color={appColors.AppBlue} />
              <Text style={styles.modToolText}>Announcement</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modTool} onPress={handleViewMembers}>
              <Icon type="material" name="people" size={20} color={appColors.AppBlue} />
              <Text style={styles.modToolText}>Members ({group?.members})</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modTool} onPress={handleViewMuted}>
              <Icon type="material" name="block" size={20} color="#F44336" />
              <Text style={[styles.modToolText, { color: '#F44336' }]}>Muted</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.messagesList, messages.length === 0 && { flex: 1 }]}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => messages.length > 0 && flatListRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[appColors.AppBlue]}
              tintColor={appColors.AppBlue}
            />
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

      {/* Announcement Modal */}
      <Modal
        visible={showAnnouncementModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAnnouncementModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Icon type="material" name="campaign" size={24} color={appColors.AppBlue} />
              <Text style={styles.modalTitle}>Send Announcement</Text>
            </View>

            <Text style={styles.modalDescription}>
              This message will be highlighted for all group members
            </Text>

            <TextInput
              style={styles.announcementInput}
              placeholder="Enter your announcement..."
              placeholderTextColor={appColors.grey3}
              value={announcementText}
              onChangeText={setAnnouncementText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={300}
              autoFocus
            />

            <Text style={styles.charCount}>{announcementText.length}/300</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => {
                  setAnnouncementText('');
                  setShowAnnouncementModal(false);
                }}
              >
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButtonSend,
                  !announcementText.trim() && styles.modalButtonDisabled,
                ]}
                onPress={sendAnnouncementAction}
                disabled={!announcementText.trim()}
              >
                <Icon type="material" name="send" size={18} color="#FFFFFF" />
                <Text style={styles.modalButtonSendText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <ISAlert ref={alert.ref} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  keyboardView: {
    flex: 1,
  },
  modToolsBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey6,
    gap: 16,
  },
  modTool: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modToolText: {
    fontSize: 13,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextMedium,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageWrapper: {
    marginBottom: 12,
    maxWidth: '85%',
  },
  ownWrapper: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherWrapper: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  senderName: {
    fontSize: 13,
    fontWeight: '600',
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextMedium,
  },
  therapistBadge: {
    backgroundColor: appColors.AppBlue + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  therapistBadgeText: {
    fontSize: 10,
    color: appColors.AppBlue,
    fontWeight: 'bold',
    fontFamily: appFonts.bodyTextBold,
  },
  messageBubble: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  otherBubble: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 4,
  },
  ownBubble: {
    backgroundColor: appColors.AppBlue,
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: 4,
  },
  otherText: {
    color: appColors.grey1,
  },
  ownText: {
    color: '#FFFFFF',
  },
  bubbleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 10,
    fontFamily: appFonts.bodyTextRegular,
  },
  otherTimestamp: {
    color: appColors.grey3,
  },
  ownTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  announcementContainer: {
    backgroundColor: appColors.AppBlue + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: appColors.AppBlue,
  },
  announcementBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  announcementLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextBold,
    textTransform: 'uppercase',
  },
  announcementText: {
    fontSize: 15,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: 22,
    marginBottom: 6,
  },
  announcementTime: {
    fontSize: 11,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  modalDescription: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: 16,
  },
  announcementInput: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
    minHeight: 100,
    borderWidth: 1,
    borderColor: appColors.grey6,
  },
  charCount: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'right',
    marginTop: 8,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButtonCancel: {
    flex: 1,
    backgroundColor: appColors.grey6,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
  },
  modalButtonSend: {
    flex: 1,
    backgroundColor: appColors.AppBlue,
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  modalButtonDisabled: {
    backgroundColor: appColors.grey5,
  },
  modalButtonSendText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: appFonts.bodyTextMedium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: appColors.AppBlue + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default THGroupChatScreen;
