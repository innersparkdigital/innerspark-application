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
} from 'react-native';
import { Avatar, Icon } from '@rneui/base';
import { appColors, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import { useToast } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import { loadConversations, refreshConversations } from '../../utils/chatManager';
import { selectConversations, selectChatLoading, selectChatRefreshing } from '../../features/chat/chatSlice';
import { getImageSource, FALLBACK_IMAGES } from '../../utils/imageHelpers';
import ISAlert, { useISAlert } from '../../components/alerts/ISAlert';

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
  const alert = useISAlert();
  const dispatch = useDispatch();
  const userId = useSelector((state: any) => state.userData.userDetails.userId);
  const conversations = useSelector(selectConversations);
  const isLoading = useSelector(selectChatLoading);
  const isRefreshing = useSelector(selectChatRefreshing);

  useEffect(() => {
    loadConversationsData();
  }, []);

  const loadConversationsData = async () => {
    const result = await (dispatch as any)(loadConversations(userId));
    if (!result.success) {
      toast.show({
        description: 'Failed to load conversations',
        duration: 3000,
      });
    }
  };

  const handleRefresh = async () => {
    await (dispatch as any)(refreshConversations(userId));
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
    alert.show({
      type: 'destructive',
      title: 'Delete Conversation',
      message: `Are you sure you want to delete your conversation with ${partnerName}?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => {
        // TODO: Implement delete conversation API call
        toast.show({
          description: 'Conversation deleted',
          duration: 2000,
        });
      },
    });
  };

  const getAvatarInitials = (name: string) => {
    if (!name) return '??';
    return name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase();
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
            size={scale(60)}
            rounded
          />
        ) : (
          <Avatar
            title={getAvatarInitials(item.partnerName)}
            size={scale(60)}
            rounded
            containerStyle={{ backgroundColor: appColors.AppBlue }}
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
      <Icon name="chat-bubble-outline" type="material" color={appColors.grey3} size={moderateScale(80)} />
      <Text style={styles.emptyTitle}>No conversations yet</Text>
      <Text style={styles.emptySubtitle}>
        Start a conversation with your therapist
      </Text>
      <TouchableOpacity
        style={styles.startChatButton}
        onPress={() => navigation.navigate('NewMessageScreen')}
      >
        <Text style={styles.startChatButtonText}>Message Therapist</Text>
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
      <ISAlert ref={alert.ref} />
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
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    marginHorizontal: scale(16),
    marginVertical: scale(4),
    borderRadius: scale(12),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
  },
  avatarContainer: {
    position: 'relative',
    marginRight: scale(12),
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: scale(2),
    right: scale(2),
    width: scale(16),
    height: scale(16),
    borderRadius: scale(8),
    backgroundColor: '#4CAF50',
    borderWidth: scale(2),
    borderColor: appColors.CardBackground,
  },
  avatarText: {
    fontSize: moderateScale(18),
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
    marginBottom: scale(4),
  },
  partnerName: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    flex: 1,
  },
  lastMessageTime: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  conversationBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(4),
  },
  lastMessage: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    flex: 1,
  },
  unreadMessage: {
    fontWeight: 'bold',
    color: appColors.grey1,
  },
  unreadBadge: {
    backgroundColor: appColors.AppBlue,
    borderRadius: scale(12),
    minWidth: scale(24),
    height: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: scale(8),
  },
  unreadCount: {
    color: appColors.CardBackground,
    fontSize: moderateScale(12),
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  lastSeen: {
    fontSize: moderateScale(12),
    color: appColors.grey4,
    fontFamily: appFonts.bodyTextRegular,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(40),
  },
  emptyTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: appColors.grey2,
    marginTop: scale(20),
    marginBottom: scale(8),
    fontFamily: appFonts.headerTextBold,
  },
  emptySubtitle: {
    fontSize: moderateScale(16),
    color: appColors.grey3,
    textAlign: 'center',
    marginBottom: scale(30),
    fontFamily: appFonts.bodyTextRegular,
  },
  startChatButton: {
    backgroundColor: appColors.AppBlue,
    paddingHorizontal: scale(30),
    paddingVertical: scale(12),
    borderRadius: scale(25),
  },
  startChatButtonText: {
    color: appColors.CardBackground,
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  // Skeleton loading styles
  skeletonItem: {
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    marginHorizontal: scale(16),
    marginVertical: scale(4),
    borderRadius: scale(12),
  },
  skeletonAvatar: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    backgroundColor: appColors.grey6,
    marginRight: scale(12),
  },
  skeletonContent: {
    flex: 1,
    justifyContent: 'center',
  },
  skeletonLine: {
    height: scale(16),
    backgroundColor: appColors.grey6,
    borderRadius: scale(8),
    marginBottom: scale(8),
  },
  skeletonLineShort: {
    width: '60%',
  },
});

export default ConversationsListScreen;
