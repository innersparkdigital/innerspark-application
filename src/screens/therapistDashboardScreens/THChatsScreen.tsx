import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import { appColors, appFonts } from '../../global/Styles';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';

// Mock data for chats
const mockChats = [
  {
    id: '1',
    clientName: 'John Doe',
    lastMessage: 'Thank you for the session today',
    time: '2m ago',
    unread: 2,
    online: true,
    avatar: '👨',
  },
  {
    id: '2',
    clientName: 'Sarah Williams',
    lastMessage: 'Can we reschedule tomorrow?',
    time: '15m ago',
    unread: 1,
    online: true,
    avatar: '👩',
  },
  {
    id: '3',
    clientName: 'Michael Brown',
    lastMessage: 'I\'ve been practicing the techniques',
    time: '1h ago',
    unread: 0,
    online: false,
    avatar: '👨‍💼',
  },
  {
    id: '4',
    clientName: 'Emily Chen',
    lastMessage: 'Looking forward to our next session',
    time: '3h ago',
    unread: 0,
    online: false,
    avatar: '👩‍💼',
  },
  {
    id: '5',
    clientName: 'David Martinez',
    lastMessage: 'The breathing exercises really helped',
    time: 'Yesterday',
    unread: 0,
    online: false,
    avatar: '👨‍🦱',
  },
];

const THChatsScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleNewMessage = () => {
    navigation.navigate('THSelectClientScreen');
  };

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
        <ScrollView style={styles.chatsList} showsVerticalScrollIndicator={false}>
          {mockChats.map((chat) => (
            <TouchableOpacity 
              key={chat.id} 
              style={styles.chatCard}
              onPress={() => navigation.navigate('THChatConversationScreen', { chat })}
              activeOpacity={0.7}
            >
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarEmoji}>{chat.avatar}</Text>
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
          ))}
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
  avatarEmoji: {
    fontSize: 24,
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
});

export default THChatsScreen;
