/**
 * Conversations List Screen - Display all direct message conversations
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Avatar, Icon } from '@rneui/base';
import { appColors, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';

interface Conversation {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerEmail: string;
  partnerAvatar?: any;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  lastSeen?: string;
}

interface ConversationsListScreenProps {
  navigation: any;
}

const ConversationsListScreen: React.FC<ConversationsListScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock conversations data
  const mockConversations: Conversation[] = [
    {
      id: '1',
      partnerId: 'therapist_1',
      partnerName: 'Dr. Sarah Johnson',
      partnerEmail: 'sarah.johnson@innerspark.com',
      partnerAvatar: require('../../assets/images/dummy-people/d-person1.png'),
      lastMessage: 'Thank you for the session today. Remember to practice the breathing exercises we discussed.',
      lastMessageTime: '2 min ago',
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: '2',
      partnerId: 'therapist_2',
      partnerName: 'Dr. Clara Odding',
      partnerEmail: 'clara.odding@innerspark.com',
      partnerAvatar: require('../../assets/images/dummy-people/d-person2.png'),
      lastMessage: 'How are you feeling after our last session? Any questions about the homework?',
      lastMessageTime: '1 hour ago',
      unreadCount: 0,
      isOnline: false,
      lastSeen: '30 min ago',
    },
    {
      id: '3',
      partnerId: 'user_1',
      partnerName: 'Michael Chen',
      partnerEmail: 'michael.chen@email.com',
      partnerAvatar: require('../../assets/images/dummy-people/d-person3.png'),
      lastMessage: 'Hey! How did your therapy session go today?',
      lastMessageTime: '3 hours ago',
      unreadCount: 1,
      isOnline: true,
    },
    {
      id: '4',
      partnerId: 'therapist_3',
      partnerName: 'Dr. Martin Pilier',
      partnerEmail: 'martin.pilier@innerspark.com',
      partnerAvatar: require('../../assets/images/dummy-people/d-person1.png'),
      lastMessage: 'Your progress has been excellent. Keep up the good work!',
      lastMessageTime: '1 day ago',
      unreadCount: 0,
      isOnline: false,
      lastSeen: '2 hours ago',
    },
    {
      id: '5',
      partnerId: 'user_2',
      partnerName: 'Lisa Rodriguez',
      partnerEmail: 'lisa.rodriguez@email.com',
      lastMessage: 'Thanks for recommending that meditation app. It really helps!',
      lastMessageTime: '2 days ago',
      unreadCount: 0,
      isOnline: false,
      lastSeen: '1 day ago',
    },
  ];

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setConversations(mockConversations);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      toast.show({
        description: 'Failed to load conversations',
        duration: 3000,
      });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadConversations();
    setIsRefreshing(false);
  };

  const handleOpenConversation = (conversation: Conversation) => {
    navigation.navigate('DMThreadScreen', { 
      partnerId: conversation.partnerId,
      partnerName: conversation.partnerName,
      partnerAvatar: conversation.partnerAvatar,
      isOnline: conversation.isOnline,
      lastSeen: conversation.lastSeen,
    });
  };

  const handleDeleteConversation = (conversationId: string, partnerName: string) => {
    Alert.alert(
      'Delete Conversation',
      `Are you sure you want to delete your conversation with ${partnerName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setConversations(prev => prev.filter(conv => conv.id !== conversationId));
            toast.show({
              description: 'Conversation deleted',
              duration: 2000,
            });
          }
        },
      ]
    );
  };

  const getAvatarInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity 
      style={styles.conversationItem}
      onPress={() => handleOpenConversation(item)}
      onLongPress={() => handleDeleteConversation(item.id, item.partnerName)}
    >
      <View style={styles.avatarContainer}>
        {item.partnerAvatar ? (
          <Avatar
            source={item.partnerAvatar}
            size={60}
            rounded
          />
        ) : (
          <Avatar
            title={getAvatarInitials(item.partnerName)}
            size={60}
            rounded
            backgroundColor={appColors.AppBlue}
            titleStyle={styles.avatarText}
          />
        )}
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.partnerName} numberOfLines={1}>
            {item.partnerName}
          </Text>
          <Text style={styles.lastMessageTime}>
            {item.lastMessageTime}
          </Text>
        </View>

        <View style={styles.conversationBody}>
          <Text 
            style={[
              styles.lastMessage,
              item.unreadCount > 0 && styles.unreadMessage
            ]} 
            numberOfLines={1}
          >
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

        {!item.isOnline && item.lastSeen && (
          <Text style={styles.lastSeen}>Last seen {item.lastSeen}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="chat-bubble-outline" type="material" color={appColors.grey3} size={80} />
      <Text style={styles.emptyTitle}>No conversations yet</Text>
      <Text style={styles.emptySubtitle}>
        Start a conversation with a therapist or friend
      </Text>
      <TouchableOpacity 
        style={styles.startChatButton}
        onPress={() => navigation.navigate('NewMessageScreen')}
      >
        <Text style={styles.startChatButtonText}>Start New Chat</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSkeletonItem = () => (
    <View style={styles.skeletonItem}>
      <View style={styles.skeletonAvatar} />
      <View style={styles.skeletonContent}>
        <View style={styles.skeletonLine} />
        <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        {[...Array(6)].map((_, index) => (
          <View key={index}>{renderSkeletonItem()}</View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        renderItem={renderConversationItem}
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
        contentContainerStyle={conversations.length === 0 ? styles.emptyContainer : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  conversationItem: {
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
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: appColors.CardBackground,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.CardBackground,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    flex: 1,
  },
  lastMessageTime: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.regularText,
  },
  conversationBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.regularText,
    flex: 1,
  },
  unreadMessage: {
    fontWeight: 'bold',
    color: appColors.grey1,
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
  lastSeen: {
    fontSize: 12,
    color: appColors.grey4,
    fontFamily: appFonts.regularText,
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
    marginBottom: 30,
    fontFamily: appFonts.regularText,
  },
  startChatButton: {
    backgroundColor: appColors.AppBlue,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  startChatButtonText: {
    color: appColors.CardBackground,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  // Skeleton loading styles
  skeletonItem: {
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  skeletonAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: appColors.grey6,
    marginRight: 12,
  },
  skeletonContent: {
    flex: 1,
    justifyContent: 'center',
  },
  skeletonLine: {
    height: 16,
    backgroundColor: appColors.grey6,
    borderRadius: 8,
    marginBottom: 8,
  },
  skeletonLineShort: {
    width: '60%',
  },
});

export default ConversationsListScreen;
