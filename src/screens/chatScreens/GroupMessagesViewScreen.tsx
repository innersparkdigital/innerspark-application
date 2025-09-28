/**
 * Group Messages View Screen - Group chat management and moderation
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Avatar, Icon, Button } from '@rneui/base';
import { appColors, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';

interface GroupChat {
  id: string;
  name: string;
  description: string;
  avatar?: any;
  memberCount: number;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isAdmin: boolean;
  isMember: boolean;
  type: 'therapy' | 'support' | 'general';
}

interface GroupMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
  isModerated: boolean;
}

interface GroupMessagesViewScreenProps {
  navigation: any;
}

const GroupMessagesViewScreen: React.FC<GroupMessagesViewScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const flatListRef = useRef<FlatList>(null);
  const [groups, setGroups] = useState<GroupChat[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GroupChat | null>(null);
  const [groupMessages, setGroupMessages] = useState<GroupMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showModerationModal, setShowModerationModal] = useState(false);

  // Mock group data
  const mockGroups: GroupChat[] = [
    {
      id: '1',
      name: 'Anxiety Support Group',
      description: 'A safe space to share experiences and coping strategies',
      avatar: require('../../assets/images/dummy-people/d-person1.png'),
      memberCount: 24,
      lastMessage: 'Thanks everyone for the support today!',
      lastMessageTime: '5 min ago',
      unreadCount: 3,
      isAdmin: true,
      isMember: true,
      type: 'therapy',
    },
    {
      id: '2',
      name: 'Mindfulness & Meditation',
      description: 'Daily meditation practices and mindfulness techniques',
      memberCount: 18,
      lastMessage: 'Today\'s meditation session was amazing',
      lastMessageTime: '1 hour ago',
      unreadCount: 0,
      isAdmin: false,
      isMember: true,
      type: 'support',
    },
    {
      id: '3',
      name: 'Depression Recovery',
      description: 'Supporting each other through recovery journey',
      memberCount: 31,
      lastMessage: 'Remember, small steps count too',
      lastMessageTime: '3 hours ago',
      unreadCount: 7,
      isAdmin: false,
      isMember: true,
      type: 'therapy',
    },
    {
      id: '4',
      name: 'General Wellness',
      description: 'General discussions about mental health and wellness',
      memberCount: 45,
      lastMessage: 'Great article about sleep hygiene!',
      lastMessageTime: '1 day ago',
      unreadCount: 0,
      isAdmin: true,
      isMember: true,
      type: 'general',
    },
  ];

  // Mock group messages for selected group
  const mockGroupMessages: GroupMessage[] = [
    {
      id: '1',
      groupId: '1',
      senderId: 'user_1',
      senderName: 'Sarah M.',
      content: 'I had a really tough day today, but the breathing exercises helped.',
      createdAt: '2025-01-27T14:30:00Z',
      isModerated: false,
    },
    {
      id: '2',
      groupId: '1',
      senderId: 'user_2',
      senderName: 'Mike R.',
      content: 'You\'re doing great Sarah! Keep it up.',
      createdAt: '2025-01-27T14:32:00Z',
      isModerated: false,
    },
    {
      id: '3',
      groupId: '1',
      senderId: 'therapist_1',
      senderName: 'Dr. Johnson',
      content: 'Remember everyone, it\'s okay to have difficult days. What matters is how we respond to them.',
      createdAt: '2025-01-27T14:35:00Z',
      isModerated: false,
    },
    {
      id: '4',
      groupId: '1',
      senderId: 'user_3',
      senderName: 'Lisa K.',
      content: 'Thanks everyone for the support today!',
      createdAt: '2025-01-27T15:20:00Z',
      isModerated: false,
    },
  ];

  useEffect(() => {
    loadGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      loadGroupMessages(selectedGroup.id);
    }
  }, [selectedGroup]);

  const loadGroups = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setGroups(mockGroups);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      toast.show({
        description: 'Failed to load groups',
        duration: 3000,
      });
    }
  };

  const loadGroupMessages = async (groupId: string) => {
    try {
      // Simulate API call
      setTimeout(() => {
        setGroupMessages(mockGroupMessages.filter(msg => msg.groupId === groupId));
      }, 500);
    } catch (error) {
      toast.show({
        description: 'Failed to load group messages',
        duration: 3000,
      });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadGroups();
    if (selectedGroup) {
      await loadGroupMessages(selectedGroup.id);
    }
    setIsRefreshing(false);
  };

  const handleGroupPress = (group: GroupChat) => {
    if (!group.isMember) {
      Alert.alert(
        'Access Denied',
        'You are not a member of this group.',
        [{ text: 'OK' }]
      );
      return;
    }
    setSelectedGroup(group);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedGroup || isSending) return;

    const newMessage: GroupMessage = {
      id: Date.now().toString(),
      groupId: selectedGroup.id,
      senderId: 'current_user',
      senderName: 'You',
      content: messageText.trim(),
      createdAt: new Date().toISOString(),
      isModerated: false,
    };

    setGroupMessages(prev => [...prev, newMessage]);
    setMessageText('');
    setIsSending(true);

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      // Simulate API call
      setTimeout(() => {
        setIsSending(false);
        toast.show({
          description: 'Message sent',
          duration: 1500,
        });
      }, 1000);
    } catch (error) {
      setIsSending(false);
      toast.show({
        description: 'Failed to send message',
        duration: 3000,
      });
    }
  };

  const handleExportMessages = () => {
    if (!selectedGroup) return;
    
    Alert.alert(
      'Export Messages',
      `Export all messages from "${selectedGroup.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Export', 
          onPress: () => {
            toast.show({
              description: 'Messages exported successfully',
              duration: 3000,
            });
            setShowExportModal(false);
          }
        },
      ]
    );
  };

  const handleModerateMessage = (messageId: string, action: 'hide' | 'delete') => {
    Alert.alert(
      'Moderate Message',
      `Are you sure you want to ${action} this message?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: action === 'hide' ? 'Hide' : 'Delete',
          style: 'destructive',
          onPress: () => {
            setGroupMessages(prev => 
              prev.map(msg => 
                msg.id === messageId 
                  ? { ...msg, isModerated: true }
                  : msg
              )
            );
            toast.show({
              description: `Message ${action}d successfully`,
              duration: 2000,
            });
            setShowModerationModal(false);
          }
        },
      ]
    );
  };

  const getGroupTypeColor = (type: string) => {
    switch (type) {
      case 'therapy':
        return appColors.AppBlue;
      case 'support':
        return '#4CAF50';
      case 'general':
        return '#FF9800';
      default:
        return appColors.grey3;
    }
  };

  const getGroupTypeIcon = (type: string) => {
    switch (type) {
      case 'therapy':
        return 'psychology';
      case 'support':
        return 'favorite';
      case 'general':
        return 'forum';
      default:
        return 'group';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const renderGroupItem = ({ item }: { item: GroupChat }) => (
    <TouchableOpacity 
      style={[
        styles.groupItem,
        !item.isMember && styles.groupItemDisabled
      ]}
      onPress={() => handleGroupPress(item)}
    >
      <View style={styles.groupAvatar}>
        {item.avatar ? (
          <Avatar
            source={item.avatar}
            size={60}
            rounded
          />
        ) : (
          <Avatar
            title={item.name.charAt(0)}
            size={60}
            rounded
            backgroundColor={getGroupTypeColor(item.type)}
            titleStyle={styles.avatarText}
          />
        )}
        <View style={[styles.groupTypeBadge, { backgroundColor: getGroupTypeColor(item.type) }]}>
          <Icon 
            name={getGroupTypeIcon(item.type)} 
            type="material" 
            color={appColors.CardBackground} 
            size={12} 
          />
        </View>
      </View>

      <View style={styles.groupContent}>
        <View style={styles.groupHeader}>
          <Text style={styles.groupName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.groupMeta}>
            <Text style={styles.lastMessageTime}>
              {item.lastMessageTime}
            </Text>
            {item.isAdmin && (
              <Icon name="admin-panel-settings" type="material" color={appColors.AppBlue} size={16} />
            )}
          </View>
        </View>

        <Text style={styles.groupDescription} numberOfLines={1}>
          {item.description}
        </Text>

        <View style={styles.groupFooter}>
          <Text style={styles.memberCount}>
            {item.memberCount} members
          </Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>
                {item.unreadCount > 99 ? '99+' : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderGroupMessageItem = ({ item }: { item: GroupMessage }) => (
    <View style={[styles.messageItem, item.isModerated && styles.moderatedMessage]}>
      <Text style={styles.messageSender}>{item.senderName}</Text>
      <Text style={styles.messageContent}>
        {item.isModerated ? '[Message moderated]' : item.content}
      </Text>
      <View style={styles.messageFooter}>
        <Text style={styles.messageTime}>{formatTime(item.createdAt)}</Text>
        {selectedGroup?.isAdmin && !item.isModerated && (
          <TouchableOpacity 
            style={styles.moderateButton}
            onPress={() => setShowModerationModal(true)}
          >
            <Icon name="more-vert" type="material" color={appColors.grey3} size={16} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="group" type="material" color={appColors.grey3} size={80} />
      <Text style={styles.emptyTitle}>No groups available</Text>
      <Text style={styles.emptySubtitle}>
        Join a therapy group to start connecting with others
      </Text>
    </View>
  );

  if (selectedGroup) {
    return (
      <View style={styles.container}>
        {/* Group Header */}
        <View style={styles.groupDetailHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedGroup(null)}
          >
            <Icon name="arrow-back" type="material" color={appColors.grey1} size={24} />
          </TouchableOpacity>
          
          <View style={styles.groupDetailInfo}>
            <Text style={styles.groupDetailName}>{selectedGroup.name}</Text>
            <Text style={styles.groupDetailMembers}>
              {selectedGroup.memberCount} members
            </Text>
          </View>

          <View style={styles.groupActions}>
            {selectedGroup.isAdmin && (
              <>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => setShowExportModal(true)}
                >
                  <Icon name="download" type="material" color={appColors.AppBlue} size={20} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => setShowModerationModal(true)}
                >
                  <Icon name="admin-panel-settings" type="material" color={appColors.AppBlue} size={20} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={groupMessages}
          renderItem={renderGroupMessageItem}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[appColors.AppBlue]}
            />
          }
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Message Composer */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
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

        {/* Export Modal */}
        <Modal
          visible={showExportModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowExportModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Export Messages</Text>
              <Text style={styles.modalMessage}>
                Export all messages from "{selectedGroup.name}" as a PDF file?
              </Text>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.modalCancelButton}
                  onPress={() => setShowExportModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.modalConfirmButton}
                  onPress={handleExportMessages}
                >
                  <Text style={styles.modalConfirmText}>Export</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Moderation Modal */}
        <Modal
          visible={showModerationModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowModerationModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Moderation Actions</Text>
              <Text style={styles.modalMessage}>
                Choose an action for this message:
              </Text>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.modalActionButton}
                  onPress={() => handleModerateMessage('1', 'hide')}
                >
                  <Text style={styles.modalActionText}>Hide Message</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.modalActionButton}
                  onPress={() => handleModerateMessage('1', 'delete')}
                >
                  <Text style={styles.modalActionText}>Delete Message</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.modalCancelButton}
                  onPress={() => setShowModerationModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={groups}
        renderItem={renderGroupItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[appColors.AppBlue]}
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={groups.length === 0 ? styles.emptyContainer : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  groupItem: {
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  groupItemDisabled: {
    opacity: 0.6,
  },
  groupAvatar: {
    position: 'relative',
    marginRight: 12,
  },
  groupTypeBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: appColors.CardBackground,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.CardBackground,
  },
  groupContent: {
    flex: 1,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    flex: 1,
  },
  groupMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastMessageTime: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.regularText,
    marginRight: 8,
  },
  groupDescription: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.regularText,
    marginBottom: 8,
  },
  groupFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberCount: {
    fontSize: 12,
    color: appColors.grey4,
    fontFamily: appFonts.regularText,
  },
  lastMessage: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.regularText,
    flex: 1,
    marginLeft: 12,
  },
  unreadBadge: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    color: appColors.CardBackground,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey2,
    marginTop: 20,
    marginBottom: 8,
    fontFamily: appFonts.headerTextBold,
  },
  emptySubtitle: {
    fontSize: 16,
    color: appColors.grey3,
    textAlign: 'center',
    fontFamily: appFonts.regularText,
  },
  // Group Detail Styles
  groupDetailHeader: {
    backgroundColor: appColors.CardBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  groupDetailInfo: {
    flex: 1,
  },
  groupDetailName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  groupDetailMembers: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.regularText,
  },
  groupActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messageItem: {
    backgroundColor: appColors.CardBackground,
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  moderatedMessage: {
    backgroundColor: appColors.grey6,
    opacity: 0.7,
  },
  messageSender: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  messageContent: {
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.regularText,
    marginBottom: 8,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageTime: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.regularText,
  },
  moderateButton: {
    padding: 4,
  },
  // Composer Styles
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
    fontFamily: appFonts.headerTextRegular,
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: appColors.CardBackground,
    margin: 20,
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: 15,
    fontFamily: appFonts.headerTextBold,
  },
  modalMessage: {
    fontSize: 16,
    color: appColors.grey2,
    textAlign: 'center',
    marginBottom: 25,
    fontFamily: appFonts.regularText,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: appColors.grey6,
    marginRight: 10,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: appColors.AppBlue,
    marginLeft: 10,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  modalActionButton: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: appColors.AppBlue + '20',
    marginBottom: 10,
    alignItems: 'center',
  },
  modalActionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
});

export default GroupMessagesViewScreen;
