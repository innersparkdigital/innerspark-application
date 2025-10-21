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
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import { appColors, appFonts } from '../../../global/Styles';
import ISGenericHeader from '../../../components/ISGenericHeader';
import ISStatusBar from '../../../components/ISStatusBar';

const THChatConversationScreen = ({ navigation, route }: any) => {
  const { chat } = route.params || {};
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hi Dr. Smith, I wanted to follow up on our last session.',
      sender: 'client',
      timestamp: '10:30 AM',
      date: 'Today',
    },
    {
      id: '2',
      text: 'Hello! Of course, how have you been feeling since then?',
      sender: 'therapist',
      timestamp: '10:32 AM',
      date: 'Today',
    },
    {
      id: '3',
      text: 'I\'ve been practicing the breathing exercises you taught me.',
      sender: 'client',
      timestamp: '10:33 AM',
      date: 'Today',
    },
    {
      id: '4',
      text: 'They really help when I feel anxious.',
      sender: 'client',
      timestamp: '10:33 AM',
      date: 'Today',
    },
    {
      id: '5',
      text: 'That\'s wonderful to hear! I\'m glad the techniques are working for you. Have you noticed any patterns in when the anxiety occurs?',
      sender: 'therapist',
      timestamp: '10:35 AM',
      date: 'Today',
    },
    {
      id: '6',
      text: 'Usually in the mornings before work.',
      sender: 'client',
      timestamp: '10:36 AM',
      date: 'Today',
    },
    {
      id: '7',
      text: 'Thank you for the session today',
      sender: 'client',
      timestamp: '2m ago',
      date: 'Today',
    },
  ]);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: 'therapist',
        timestamp: 'Just now',
        date: 'Today',
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleViewClientProfile = () => {
    Alert.alert('Client Profile', 'View full client profile and session history');
  };

  const handleScheduleSession = () => {
    Alert.alert('Schedule Session', 'Schedule a new session with ' + chat.clientName);
  };

  const handleViewNotes = () => {
    Alert.alert('Session Notes', 'View therapy notes for ' + chat.clientName);
  };

  const renderMessage = ({ item }: any) => {
    const isTherapist = item.sender === 'therapist';
    
    return (
      <View style={[styles.messageContainer, isTherapist ? styles.therapistMessage : styles.clientMessage]}>
        <View style={[styles.messageBubble, isTherapist ? styles.therapistBubble : styles.clientBubble]}>
          <Text style={[styles.messageText, isTherapist ? styles.therapistText : styles.clientText]}>
            {item.text}
          </Text>
          <Text style={[styles.timestamp, isTherapist ? styles.therapistTimestamp : styles.clientTimestamp]}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ISStatusBar />
      <ISGenericHeader 
        title={chat?.clientName || 'Chat'} 
        navigation={navigation}
        hasRightIcon={true}
        rightIconName="info"
        rightIconOnPress={handleViewClientProfile}
      />

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Quick Actions Bar */}
        <View style={styles.quickActionsBar}>
          <TouchableOpacity style={styles.quickAction} onPress={handleViewNotes}>
            <Icon type="material" name="description" size={16} color={appColors.AppBlue} />
            <Text style={styles.quickActionText}>Notes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={handleScheduleSession}>
            <Icon type="material" name="event" size={16} color={appColors.AppBlue} />
            <Text style={styles.quickActionText}>Schedule</Text>
          </TouchableOpacity>
          <View style={styles.quickAction}>
            <View style={styles.onlineStatus}>
              <View style={[styles.statusDot, { backgroundColor: chat?.online ? appColors.AppGreen : appColors.grey3 }]} />
              <Text style={styles.quickActionText}>{chat?.online ? 'Online' : 'Offline'}</Text>
            </View>
          </View>
        </View>

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
  quickActionsBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey6,
    gap: 16,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quickActionText: {
    fontSize: 13,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextMedium,
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  clientMessage: {
    alignSelf: 'flex-start',
  },
  therapistMessage: {
    alignSelf: 'flex-end',
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
  clientBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  therapistBubble: {
    backgroundColor: appColors.AppBlue,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: 4,
  },
  clientText: {
    color: appColors.grey1,
  },
  therapistText: {
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 11,
    fontFamily: appFonts.bodyTextRegular,
  },
  clientTimestamp: {
    color: appColors.grey3,
  },
  therapistTimestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
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
});

export default THChatConversationScreen;
