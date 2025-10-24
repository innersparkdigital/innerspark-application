/**
 * Main Chat Screen with bottom tabs for Chats and Groups
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { appColors, parameters, appFonts } from '../global/Styles';
import ConversationsListScreen from './chatScreens/ConversationsListScreen';
import GroupMessagesViewScreen from './chatScreens/GroupMessagesViewScreen';

interface ChatScreenProps {
  navigation: any;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'chats' | 'groups'>('chats');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chats':
        return <ConversationsListScreen navigation={navigation} />;
      case 'groups':
        return <GroupMessagesViewScreen navigation={navigation} />;
      default:
        return <ConversationsListScreen navigation={navigation} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={appColors.AppBlue} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.navigate('NewMessageScreen')}
        >
          <Icon name="edit" type="material" color={appColors.CardBackground} size={24} />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'chats' && styles.activeTab]}
          onPress={() => setActiveTab('chats')}
        >
          <Icon 
            name="chat" 
            type="material" 
            color={activeTab === 'chats' ? appColors.AppBlue : appColors.grey3} 
            size={20} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'chats' && styles.activeTabText
          ]}>
            Chats
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'groups' && styles.activeTab]}
          onPress={() => setActiveTab('groups')}
        >
          <Icon 
            name="group" 
            type="material" 
            color={activeTab === 'groups' ? appColors.AppBlue : appColors.grey3} 
            size={20} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'groups' && styles.activeTabText
          ]}>
            Groups
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.content}>
        {renderTabContent()}
      </View>
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
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: appColors.AppBlue + '15',
  },
  tabText: {
    fontSize: 14,
    color: appColors.grey3,
    marginLeft: 6,
    fontFamily: appFonts.headerTextRegular,
  },
  activeTabText: {
    color: appColors.AppBlue,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  content: {
    flex: 1,
  },
});

export default ChatScreen;
