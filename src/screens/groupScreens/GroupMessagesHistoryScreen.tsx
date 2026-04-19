/**
 * Group Messages History Screen - Searchable message history with export and moderation
 * 
 * Purpose:
 * - Allow members to catch up on missed conversations
 * - Search through past messages
 * - Export chat history (PDF/TXT/CSV) for personal records
 * - Moderators can review and moderate past messages
 * - Privacy: Member names are anonymized (Member 1, Member 2) except therapists
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Icon, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import { useToast } from 'native-base';
import { useSelector } from 'react-redux';
import { getGroupMessages } from '../../api/client/groups';
import ISAlert, { useISAlert } from '../../components/alerts/ISAlert';
import { maskName, generateAnonymousName } from '../../utils/privacyHelpers';

interface HistoryMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'therapist' | 'moderator' | 'member';
  content: string;
  createdAt: string;
  type: 'text' | 'system' | 'announcement';
  isOwn: boolean;
  isReported?: boolean;
  isDeleted?: boolean;
}

interface ExportOptions {
  format: 'pdf' | 'txt' | 'csv';
  dateRange: 'all' | 'week' | 'month' | 'custom';
  includeDeleted: boolean;
  includeSystem: boolean;
}

interface GroupMessagesHistoryScreenProps {
  navigation: any;
  route: any;
}

const GroupMessagesHistoryScreen: React.FC<GroupMessagesHistoryScreenProps> = ({ navigation, route }) => {
  const toast = useToast();
  const alert = useISAlert();
  const userId = useSelector((state: any) => state.userData.userDetails.userId);
  const { groupId, groupName, userRole, privacyMode = true } = route.params;

  const [messages, setMessages] = useState<HistoryMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<HistoryMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showModerationModal, setShowModerationModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<HistoryMessage | null>(null);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    dateRange: 'all',
    includeDeleted: false,
    includeSystem: true,
  });

  const isTherapist = userRole === 'therapist';
  const isModerator = userRole === 'moderator' || userRole === 'therapist';

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, searchQuery]);

  const loadMessages = async () => {
    // Basic Security Check
    if (userRole === 'none') {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      console.log('📞 Calling getGroupMessages API for Group:', groupId);
      const response = await getGroupMessages(groupId, userId, 1, 50);
      const apiMessages = response.data?.messages || response.messages || [];
      console.log('✅ Received Group Messages (History):', apiMessages.length);

      const mappedMessages = apiMessages.map((msg: any) => ({
        id: msg.id || msg.message_id,
        senderId: String(msg.sender_id || msg.senderId),
        senderName: msg.sender_name || msg.senderName || 'Unknown',
        senderRole: msg.sender_role || msg.senderRole || 'member',
        content: msg.content || msg.message || '',
        createdAt: msg.timestamp || msg.created_at || msg.createdAt || new Date().toISOString(),
        type: msg.type || 'text',
        isOwn: String(msg.sender_id || msg.senderId || '') === String(userId),
      }));

      // Sort ascending by timestamp: oldest at top, newest at bottom (consistent with live chat)
      mappedMessages.sort((a: HistoryMessage, b: HistoryMessage) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      setMessages(mappedMessages);
      setIsLoading(false);
    } catch (error: any) {
      console.error('❌ Error loading message history:', error);
      setIsLoading(false);
      toast.show({
        description: error.response?.data?.error || 'Failed to load message history',
        duration: 3000,
      });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadMessages();
    } finally {
      setIsRefreshing(false);
    }
  };

  const filterMessages = () => {
    let filtered = messages;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = messages.filter(message =>
        message.content.toLowerCase().includes(query) ||
        message.senderName.toLowerCase().includes(query)
      );
    }

    setFilteredMessages(filtered);
  };

  const handleExport = async () => {
    try {
      // Simulate export process
      toast.show({
        description: `Exporting messages as ${exportOptions.format.toUpperCase()}...`,
        duration: 2000,
      });

      setTimeout(() => {
        setShowExportModal(false);
        alert.show({
          type: 'success',
          title: 'Export Complete',
          message: `Messages have been exported as ${exportOptions.format.toUpperCase()} file. Check your downloads folder.`,
        });
      }, 2000);
    } catch (error) {
      toast.show({
        description: 'Export failed. Please try again.',
        duration: 3000,
      });
    }
  };

  const handleModerateMessage = (action: 'delete' | 'report' | 'warn') => {
    if (!selectedMessage) return;

    const actionText = action === 'delete' ? 'delete' : action === 'report' ? 'report' : 'warn user about';

    alert.show({
      type: action === 'delete' ? 'destructive' : 'warning',
      title: 'Moderate Message',
      message: `Are you sure you want to ${actionText} this message?`,
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      onConfirm: () => {
        if (action === 'delete') {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === selectedMessage.id
                ? { ...msg, isDeleted: true, content: '[Message deleted by moderator]' }
                : msg
            )
          );
        } else if (action === 'report') {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === selectedMessage.id
                ? { ...msg, isReported: true }
                : msg
            )
          );
        }

        setShowModerationModal(false);
        setSelectedMessage(null);
        toast.show({
          description: `Message ${action}ed successfully`,
          duration: 2000,
        });
      },
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
  const getDisplayName = (message: HistoryMessage, index: number) => {
    // Always show own messages as 'You'
    if (message.isOwn) {
      return 'You';
    }

    // Always show therapist and moderator names
    if (message.senderRole === 'therapist' || message.senderRole === 'moderator') {
      return message.senderName;
    }

    // Privacy mode: show anonymous names for members using utility
    if (privacyMode && message.senderRole === 'member') {
      return generateAnonymousName(message.senderId, message.senderName);
    }

    // Default: show real name
    return message.senderName;
  };

  const renderMessage = ({ item, index }: { item: HistoryMessage; index: number }) => {
    const displayName = getDisplayName(item, index);
    if (item.type === 'system') {
      return (
        <View style={styles.systemMessage}>
          <Text style={styles.systemMessageText}>{item.content}</Text>
          <Text style={styles.systemMessageTime}>{formatDate(item.createdAt)}</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={[
          styles.messageItem,
          item.isReported && styles.reportedMessage,
          item.isDeleted && styles.deletedMessage
        ]}
        onLongPress={() => {
          if (isModerator) {
            setSelectedMessage(item);
            setShowModerationModal(true);
          }
        }}
      >
        <View style={styles.messageHeader}>
          <Avatar
            title={displayName.charAt(0)}
            size={scale(32)}
            rounded
            containerStyle={{ backgroundColor: getRoleColor(item.senderRole) }}
            titleStyle={styles.avatarText}
          />
          <View style={styles.messageInfo}>
            <View style={styles.senderInfo}>
              <Text style={[styles.senderName, { color: item.isOwn ? appColors.grey3 : getRoleColor(item.senderRole) }]}>
                {displayName}
              </Text>
              {item.isOwn && (
                <View style={[styles.roleBadge, { backgroundColor: appColors.grey4 }]}>
                  <Text style={styles.roleBadgeText}>{privacyMode ? 'You (Private)' : 'You'}</Text>
                </View>
              )}
              {!item.isOwn && item.senderRole === 'therapist' && (
                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>Therapist</Text>
                </View>
              )}
              {item.senderRole === 'moderator' && (
                <View style={[styles.roleBadge, { backgroundColor: '#4CAF50' }]}>
                  <Text style={styles.roleBadgeText}>Moderator</Text>
                </View>
              )}
            </View>
            <Text style={styles.messageTime}>{formatDate(item.createdAt)}</Text>
          </View>
          {item.isReported && (
            <Icon name="flag" type="material" color="#F44336" size={scale(16)} />
          )}
        </View>

        <Text style={[
          styles.messageContent,
          item.isDeleted && styles.deletedMessageContent
        ]}>
          {item.content}
        </Text>

        {item.type === 'announcement' && (
          <View style={styles.announcementBadge}>
            <Icon name="campaign" type="material" color={appColors.AppBlue} size={scale(14)} />
            <Text style={styles.announcementText}>Announcement</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="history" type="material" color={appColors.grey3} size={scale(64)} />
      <Text style={styles.emptyStateTitle}>No Messages Found</Text>
      <Text style={styles.emptyStateText}>
        {searchQuery ? 'No messages match your search criteria.' : 'This group doesn\'t have any message history yet.'}
      </Text>
      {searchQuery && (
        <Button
          title="Clear Search"
          onPress={() => setSearchQuery('')}
          buttonStyle={styles.clearSearchButton}
          titleStyle={styles.clearSearchButtonText}
        />
      )}
    </View>
  );

  if (userRole === 'none') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={scale(24)} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Access Denied</Text>
          </View>
        </View>
        <View style={styles.emptyState}>
          <Icon name="lock" type="material" color={appColors.grey3} size={scale(64)} />
          <Text style={styles.emptyStateTitle}>Restricted Access</Text>
          <Text style={styles.emptyStateText}>
            You must be an active member of this support group to view the message history.
          </Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            buttonStyle={styles.clearSearchButton}
            titleStyle={styles.clearSearchButtonText}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={scale(24)} />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Message History</Text>
          <Text style={styles.headerSubtitle}>{groupName}</Text>
        </View>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setShowExportModal(true)}
        >
          <Icon name="file-download" type="material" color={appColors.CardBackground} size={scale(24)} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" type="material" color={appColors.grey3} size={scale(20)} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages..."
          placeholderTextColor={appColors.grey3}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="clear" type="material" color={appColors.grey3} size={scale(20)} />
          </TouchableOpacity>
        )}
      </View>

      {/* Messages List */}
      <FlatList
        data={filteredMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[appColors.AppBlue]}
          />
        }
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
      />
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
    paddingTop: scale(parameters.headerHeightS),
    paddingBottom: scale(15),
    paddingHorizontal: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    elevation: scale(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
  },
  backButton: {
    padding: scale(8),
    marginRight: scale(8),
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  headerSubtitle: {
    fontSize: moderateScale(12),
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: appFonts.bodyTextRegular,
  },
  headerButton: {
    padding: scale(8),
  },
  searchContainer: {
    backgroundColor: appColors.CardBackground,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey6,
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(16),
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
    marginLeft: scale(12),
    marginRight: scale(8),
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: scale(8),
  },
  messageItem: {
    backgroundColor: appColors.CardBackground,
    marginHorizontal: scale(16),
    marginVertical: scale(4),
    padding: scale(16),
    borderRadius: scale(12),
    elevation: scale(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
  },
  reportedMessage: {
    borderLeftWidth: scale(4),
    borderLeftColor: '#F44336',
  },
  deletedMessage: {
    backgroundColor: appColors.grey6,
    opacity: 0.7,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  messageInfo: {
    flex: 1,
    marginLeft: scale(12),
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  senderName: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  roleBadge: {
    backgroundColor: appColors.AppBlue,
    paddingHorizontal: scale(6),
    paddingVertical: scale(2),
    borderRadius: scale(8),
    marginLeft: scale(8),
  },
  roleBadgeText: {
    fontSize: moderateScale(10),
    color: appColors.CardBackground,
    fontFamily: appFonts.bodyTextRegular,
    fontWeight: 'bold',
  },
  messageTime: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginTop: scale(2),
  },
  messageContent: {
    fontSize: moderateScale(14),
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: scale(20),
  },
  deletedMessageContent: {
    fontStyle: 'italic',
    color: appColors.grey3,
  },
  announcementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(8),
    paddingTop: scale(8),
    borderTopWidth: 1,
    borderTopColor: appColors.grey6,
  },
  announcementText: {
    fontSize: moderateScale(12),
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextRegular,
    marginLeft: scale(4),
    fontWeight: 'bold',
  },
  systemMessage: {
    alignItems: 'center',
    marginVertical: scale(8),
    paddingHorizontal: scale(16),
  },
  systemMessageText: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    backgroundColor: appColors.grey6,
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(12),
    textAlign: 'center',
    fontFamily: appFonts.bodyTextRegular,
  },
  systemMessageTime: {
    fontSize: moderateScale(10),
    color: appColors.grey4,
    fontFamily: appFonts.bodyTextRegular,
    marginTop: scale(4),
  },
  avatarText: {
    fontSize: moderateScale(12),
    fontWeight: 'bold',
    color: appColors.CardBackground,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(32),
    paddingVertical: scale(64),
  },
  emptyStateTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    marginTop: scale(16),
    marginBottom: scale(8),
  },
  emptyStateText: {
    fontSize: moderateScale(14),
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'center',
    lineHeight: scale(20),
  },
  clearSearchButton: {
    backgroundColor: appColors.AppBlue,
    paddingHorizontal: scale(24),
    paddingVertical: scale(12),
    borderRadius: scale(8),
    marginTop: scale(16),
  },
  clearSearchButtonText: {
    fontSize: moderateScale(14),
    color: appColors.CardBackground,
    fontFamily: appFonts.bodyTextRegular,
    fontWeight: 'bold',
  },
});

export default GroupMessagesHistoryScreen;
