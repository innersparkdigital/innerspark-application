import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Skeleton } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { appColors, appFonts } from '../../global/Styles';
import { appImages } from '../../global/Data';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';
import ISClientAvatar from '../../components/ISClientAvatar';
import { getConversations } from '../../api/therapist';
import { useFocusEffect } from '@react-navigation/native';

const THChatsScreen = ({ navigation }: any) => {
  const userDetails = useSelector((state: any) => state.userData.userDetails);
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  // Reload conversations whenever this tab comes into focus
  // (e.g. after sending messages, starting new chats, or returning from a conversation)
  useFocusEffect(
    useCallback(() => {
      loadConversations();
    }, [])
  );

  const loadConversations = async () => {
    try {
      setLoading(true);
      const therapistId = userDetails?.userId;
      const response: any = await getConversations(therapistId);

      if (response?.data?.conversations) {
        const mappedChats = response.data.conversations.map((conv: any) => ({
          id: conv.clientId, // Required for navigation to works using the clientId
          clientName: conv.clientName,
          lastMessage: conv.lastMessage,
          time: new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          unread: conv.unreadCount,
          online: conv.isOnline,
          avatar: conv.clientAvatar || '👤',
        }));
        setChats(mappedChats);
      } else {
        setChats([]);
      }
    } catch (error: any) {
      const errorMessage = error.backendMessage || error.message || 'Failed to load conversations';
      console.error('Chats Error:', errorMessage);
      setChats([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadConversations();
  }, []);

  const handleNewMessage = () => {
    navigation.navigate('THSelectClientScreen');
  };

  // Filter based on search query
  const filteredChats = chats.filter(chat =>
    chat.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ChatCardSkeleton = () => (
    <View style={styles.chatCard}>
      <View style={styles.avatarContainer}>
        <Skeleton animation="pulse" width={50} height={50} style={{ borderRadius: 25 }} />
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Skeleton animation="pulse" width={120} height={18} style={{ borderRadius: 4 }} />
          <Skeleton animation="pulse" width={40} height={12} style={{ borderRadius: 4 }} />
        </View>
        <View style={styles.messageRow}>
          <Skeleton animation="pulse" width="80%" height={14} style={{ borderRadius: 4, marginTop: 8 }} />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />

      <ISGenericHeader
        title="Chats"
        navigation={navigation}
      />

      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon type="material" name="search" size={20} color={appColors.grey3} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor={appColors.grey3}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Chats List */}
        <ScrollView
          style={styles.chatsList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={filteredChats.length === 0 ? styles.emptyListContent : { paddingBottom: 80 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[appColors.AppBlue]} />
          }
        >
          {loading && !refreshing ? (
            [1, 2, 3, 4, 5, 6].map(i => <ChatCardSkeleton key={i} />)
          ) : filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <TouchableOpacity
                key={chat.id}
                style={styles.chatCard}
                onPress={() => navigation.navigate('THChatConversationScreen', { chat })}
                activeOpacity={0.7}
              >
                <View style={styles.avatarContainer}>
                  <ISClientAvatar 
                    clientId={chat.id} 
                    initialAvatar={chat.avatar} 
                    size={50} 
                    rounded 
                  />
                  {chat.online && <View style={styles.onlineIndicator} />}
                </View>

                <View style={styles.chatInfo}>
                  <View style={styles.chatHeader}>
                    <Text style={styles.clientName}>{chat.clientName}</Text>
                    <Text style={styles.timeText}>{chat.time}</Text>
                  </View>
                  <View style={styles.messageRow}>
                    <Text style={styles.lastMessage} numberOfLines={1}>
                      {chat.lastMessage}
                    </Text>
                    {chat.unread > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{chat.unread}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Icon type="material" name="chat-bubble-outline" size={60} color={appColors.grey4} />
              <Text style={styles.emptyStateTitle}>No Conversations</Text>
              <Text style={styles.emptyStateText}>
                {searchQuery.trim() ? "No chats match your search." : "You don't have any active conversations. Start a new chat to connect with your clients."}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={handleNewMessage}
          activeOpacity={0.8}
        >
          <Icon type="material" name="message" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
  },
  chatsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: appColors.AppBlue + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: appColors.AppGreen,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  timeText: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  unreadBadge: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: appFonts.bodyTextMedium,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: appColors.AppBlue,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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

export default THChatsScreen;
