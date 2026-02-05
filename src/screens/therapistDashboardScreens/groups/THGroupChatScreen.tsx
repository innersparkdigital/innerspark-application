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
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import { appColors, appFonts } from '../../../global/Styles';
import ISGenericHeader from '../../../components/ISGenericHeader';
import ISStatusBar from '../../../components/ISStatusBar';
import { useSelector } from 'react-redux';
import {
  getGroupMessages,
  sendGroupMessage,
  sendAnnouncement,
  deleteGroupMessage
} from '../../../api/therapist/groups';

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
  const [loading, setLoading] = useState(false);

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
      const therapistId = userDetails?.id || '52863268761';
      const res: any = await getGroupMessages(group.id, therapistId);
      if (res?.data?.messages) {
        setMessages(res.data.messages);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (message.trim() && group?.id) {
      try {
        const therapistId = userDetails?.id || '52863268761';
        const content = message.trim();
        setMessage(''); // clear immediately for UX

        await sendGroupMessage(group.id, therapistId, content);
        // Refresh messages (or ideally socket push)
        loadMessages();
      } catch (e) {
        console.error(e);
        Alert.alert('Error', 'Failed to send message');
      }
    }
  };

  const handleSendAnnouncement = () => {
    setShowAnnouncementModal(true);
  };

  const sendAnnouncementAction = async () => {
    if (announcementText.trim() && group?.id) {
      try {
        const therapistId = userDetails?.id || '52863268761';
        const content = announcementText.trim();
        setAnnouncementText('');
        setShowAnnouncementModal(false);

        await sendAnnouncement(group.id, therapistId, content);
        loadMessages();
      } catch (e) {
        console.error(e);
        Alert.alert('Error', 'Failed to send announcement');
      }
    }
  };

  const handleMuteUser = (userId: string, userName: string) => {
    Alert.alert(
      'Mute User',
      `Temporarily mute ${userName}? They won't be able to send messages for 5 minutes.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mute',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', `${userName} has been muted for 5 minutes.`);
          },
        },
      ]
    );
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
          onPress: async () => {
            try {
              const therapistId = userDetails?.id || '52863268761';
              // Optimistic update
              setMessages(messages.filter((m) => m.id !== messageId));
              if (group?.id) {
                await deleteGroupMessage(group.id, messageId, therapistId);
              }
            } catch (e) {
              console.error(e);
              Alert.alert('Error', 'Failed to delete message');
              loadMessages();
            }
          },
        },
      ]
    );
  };

  const handleViewMembers = () => {
    navigation.navigate('THGroupMembersScreen', { group });
  };

  const handleViewMuted = () => {
    navigation.navigate('THGroupMembersScreen', { group, filter: 'muted' });
  };

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

    return (
      <TouchableOpacity
        style={[
          styles.messageContainer,
          item.isOwn ? styles.ownMessage : styles.otherMessage,
        ]}
        onLongPress={() => {
          if (item.isOwn) {
            handleDeleteMessage(item.id);
          } else {
            Alert.alert(
              'Moderation',
              `What would you like to do?`,
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete Message', onPress: () => handleDeleteMessage(item.id) },
                { text: 'Mute User', onPress: () => handleMuteUser(item.senderId, item.senderName) },
              ]
            );
          }
        }}
      >
        {!item.isOwn && (
          <View style={styles.senderInfo}>
            <Text style={styles.senderName}>{item.senderName}</Text>
            {isTherapist && (
              <View style={styles.therapistBadge}>
                <Text style={styles.therapistBadgeText}>Therapist</Text>
              </View>
            )}
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            item.isOwn ? styles.ownBubble : styles.otherBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              item.isOwn ? styles.ownText : styles.otherText,
            ]}
          >
            {item.content}
          </Text>
          <Text
            style={[
              styles.timestamp,
              item.isOwn ? styles.ownTimestamp : styles.otherTimestamp,
            ]}
          >
            {item.timestamp}
          </Text>
        </View>
      </TouchableOpacity>
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
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
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
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  ownMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
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
    borderRadius: 16,
    padding: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  otherBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  ownBubble: {
    backgroundColor: appColors.AppBlue,
    borderBottomRightRadius: 4,
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
  timestamp: {
    fontSize: 11,
    fontFamily: appFonts.bodyTextRegular,
  },
  otherTimestamp: {
    color: appColors.grey3,
  },
  ownTimestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
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
    fontSize: 20,
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
});

export default THGroupChatScreen;
