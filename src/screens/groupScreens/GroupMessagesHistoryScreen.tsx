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
  Alert,
  Modal,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Icon, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';

interface HistoryMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'therapist' | 'moderator' | 'member';
  content: string;
  createdAt: string;
  type: 'text' | 'system' | 'announcement';
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

  // Mock messages data
  const mockMessages: HistoryMessage[] = [
    {
      id: '1',
      senderId: 'therapist_1',
      senderName: 'Dr. Sarah Johnson',
      senderRole: 'therapist',
      content: 'Welcome to the Anxiety Support Group. This is a safe space for everyone to share their experiences.',
      createdAt: '2025-01-20T10:00:00Z',
      type: 'announcement',
    },
    {
      id: '2',
      senderId: 'member_1',
      senderName: 'Michael',
      senderRole: 'member',
      content: 'Thank you for creating this group. I\'ve been struggling with anxiety for years.',
      createdAt: '2025-01-20T10:05:00Z',
      type: 'text',
    },
    {
      id: '3',
      senderId: 'member_2',
      senderName: 'Emma',
      senderRole: 'member',
      content: 'I find that deep breathing exercises really help when I feel anxious. Has anyone else tried this?',
      createdAt: '2025-01-20T10:15:00Z',
      type: 'text',
    },
    {
      id: '4',
      senderId: 'member_3',
      senderName: 'James',
      senderRole: 'member',
      content: 'Yes Emma! I use the 4-7-8 breathing technique. Breathe in for 4, hold for 7, exhale for 8.',
      createdAt: '2025-01-20T10:20:00Z',
      type: 'text',
    },
    {
      id: '5',
      senderId: 'therapist_1',
      senderName: 'Dr. Sarah Johnson',
      senderRole: 'therapist',
      content: 'Those are excellent techniques! Breathing exercises are scientifically proven to activate the parasympathetic nervous system.',
      createdAt: '2025-01-20T10:25:00Z',
      type: 'text',
    },
    {
      id: '6',
      senderId: 'member_4',
      senderName: 'Lisa',
      senderRole: 'member',
      content: 'I\'ve been having panic attacks lately. Does anyone have advice for dealing with them?',
      createdAt: '2025-01-21T14:30:00Z',
      type: 'text',
    },
    {
      id: '7',
      senderId: 'moderator_1',
      senderName: 'Alex (Moderator)',
      senderRole: 'moderator',
      content: 'Lisa, I\'m sorry you\'re going through this. Remember the grounding technique: 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.',
      createdAt: '2025-01-21T14:35:00Z',
      type: 'text',
    },
    {
      id: '8',
      senderId: 'member_5',
      senderName: 'David',
      senderRole: 'member',
      content: 'I want to share that I had my first anxiety-free day in months yesterday! Thank you all for the support.',
      createdAt: '2025-01-22T09:15:00Z',
      type: 'text',
    },
    {
      id: '9',
      senderId: 'member_1',
      senderName: 'Michael',
      senderRole: 'member',
      content: 'That\'s amazing David! It gives me hope that I can have days like that too.',
      createdAt: '2025-01-22T09:20:00Z',
      type: 'text',
    },
    {
      id: '10',
      senderId: 'therapist_1',
      senderName: 'Dr. Sarah Johnson',
      senderRole: 'therapist',
      content: 'David, that\'s wonderful progress! Remember to celebrate these victories, no matter how small they might seem.',
      createdAt: '2025-01-22T09:25:00Z',
      type: 'text',
    },
    {
      id: '11',
      senderId: 'system',
      senderName: 'System',
      senderRole: 'member',
      content: 'Emma joined the group',
      createdAt: '2025-01-23T11:00:00Z',
      type: 'system',
    },
    {
      id: '12',
      senderId: 'member_6',
      senderName: 'Sophie',
      senderRole: 'member',
      content: 'Hi everyone! I\'m new here. Looking forward to connecting with people who understand what I\'m going through.',
      createdAt: '2025-01-23T11:05:00Z',
      type: 'text',
    },
    {
      id: '13',
      senderId: 'member_7',
      senderName: 'Tom',
      senderRole: 'member',
      content: 'This is inappropriate content that should be moderated',
      createdAt: '2025-01-24T16:30:00Z',
      type: 'text',
      isReported: true,
    },
    {
      id: '14',
      senderId: 'member_2',
      senderName: 'Emma',
      senderRole: 'member',
      content: 'I\'ve been practicing mindfulness meditation and it\'s really helping with my anxiety levels.',
      createdAt: '2025-01-25T08:45:00Z',
      type: 'text',
    },
    {
      id: '15',
      senderId: 'therapist_1',
      senderName: 'Dr. Sarah Johnson',
      senderRole: 'therapist',
      content: 'Mindfulness is an excellent tool Emma. For those interested, I can share some guided meditation resources.',
      createdAt: '2025-01-25T08:50:00Z',
      type: 'text',
    },
  ];

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, searchQuery]);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setMessages(mockMessages);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      toast.show({
        description: 'Failed to load message history',
        duration: 3000,
      });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate refresh
      setTimeout(() => {
        setIsRefreshing(false);
        toast.show({
          description: 'Messages refreshed',
          duration: 2000,
        });
      }, 1000);
    } catch (error) {
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
        Alert.alert(
          'Export Complete',
          `Messages have been exported as ${exportOptions.format.toUpperCase()} file. Check your downloads folder.`,
          [{ text: 'OK' }]
        );
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
    
    Alert.alert(
      'Moderate Message',
      `Are you sure you want to ${actionText} this message?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          style: action === 'delete' ? 'destructive' : 'default',
          onPress: () => {
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
          }
        },
      ]
    );
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
    // Always show therapist names
    if (message.senderRole === 'therapist') {
      return message.senderName;
    }
    
    // Privacy mode: show anonymous names for members
    if (privacyMode && message.senderRole === 'member') {
      // Use index + 1 as anonymous ID (simple approach)
      return `Member ${(index % 20) + 1}`;
    }
    
    // Moderators: show name with badge
    if (message.senderRole === 'moderator') {
      return privacyMode ? `Member ${(index % 20) + 1}` : message.senderName;
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
            size={32}
            rounded
            backgroundColor={getRoleColor(item.senderRole)}
            titleStyle={styles.avatarText}
          />
          <View style={styles.messageInfo}>
            <View style={styles.senderInfo}>
              <Text style={[styles.senderName, { color: getRoleColor(item.senderRole) }]}>
                {displayName}
              </Text>
              {item.senderRole === 'therapist' && (
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
            <Icon name="flag" type="material" color="#F44336" size={16} />
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
            <Icon name="campaign" type="material" color={appColors.AppBlue} size={14} />
            <Text style={styles.announcementText}>Announcement</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="history" type="material" color={appColors.grey3} size={64} />
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
        
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Message History</Text>
          <Text style={styles.headerSubtitle}>{groupName}</Text>
        </View>

        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => setShowExportModal(true)}
        >
          <Icon name="file-download" type="material" color={appColors.CardBackground} size={24} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" type="material" color={appColors.grey3} size={20} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages..."
          placeholderTextColor={appColors.grey3}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="clear" type="material" color={appColors.grey3} size={20} />
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
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: appFonts.bodyTextRegular,
  },
  headerButton: {
    padding: 8,
  },
  searchContainer: {
    backgroundColor: appColors.CardBackground,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey6,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
    marginLeft: 12,
    marginRight: 8,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 8,
  },
  messageItem: {
    backgroundColor: appColors.CardBackground,
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  reportedMessage: {
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  deletedMessage: {
    backgroundColor: appColors.grey6,
    opacity: 0.7,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageInfo: {
    flex: 1,
    marginLeft: 12,
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  senderName: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  roleBadge: {
    backgroundColor: appColors.AppBlue,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  roleBadgeText: {
    fontSize: 10,
    color: appColors.CardBackground,
    fontFamily: appFonts.bodyTextRegular,
    fontWeight: 'bold',
  },
  messageTime: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginTop: 2,
  },
  messageContent: {
    fontSize: 14,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: 20,
  },
  deletedMessageContent: {
    fontStyle: 'italic',
    color: appColors.grey3,
  },
  announcementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: appColors.grey6,
  },
  announcementText: {
    fontSize: 12,
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextRegular,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  systemMessage: {
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  systemMessageText: {
    fontSize: 12,
    color: appColors.grey3,
    backgroundColor: appColors.grey6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    textAlign: 'center',
    fontFamily: appFonts.bodyTextRegular,
  },
  systemMessageTime: {
    fontSize: 10,
    color: appColors.grey4,
    fontFamily: appFonts.bodyTextRegular,
    marginTop: 4,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: appColors.CardBackground,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'center',
    lineHeight: 20,
  },
  clearSearchButton: {
    backgroundColor: appColors.AppBlue,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  clearSearchButtonText: {
    fontSize: 14,
    color: appColors.CardBackground,
    fontFamily: appFonts.bodyTextRegular,
    fontWeight: 'bold',
  },
});

export default GroupMessagesHistoryScreen;
