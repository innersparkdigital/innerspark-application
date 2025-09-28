/**
 * Main Groups Screen with bottom tabs for Groups Directory and My Groups
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
import GroupsListScreen from './groupScreens/GroupsListScreen';
import MyGroupsScreen from './groupScreens/MyGroupsScreen';

interface GroupsScreenProps {
  navigation: any;
}

const GroupsScreen: React.FC<GroupsScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'directory' | 'mygroups'>('directory');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'directory':
        return <GroupsListScreen navigation={navigation} />;
      case 'mygroups':
        return <MyGroupsScreen navigation={navigation} />;
      default:
        return <GroupsListScreen navigation={navigation} />;
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
        <Text style={styles.headerTitle}>Support Groups</Text>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.navigate('GroupMessagesHistoryScreen')}
        >
          <Icon name="history" type="material" color={appColors.CardBackground} size={24} />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'directory' && styles.activeTab]}
          onPress={() => setActiveTab('directory')}
        >
          <Icon 
            name="explore" 
            type="material" 
            color={activeTab === 'directory' ? appColors.AppBlue : appColors.grey3} 
            size={20} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'directory' && styles.activeTabText
          ]}>
            Directory
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'mygroups' && styles.activeTab]}
          onPress={() => setActiveTab('mygroups')}
        >
          <Icon 
            name="group" 
            type="material" 
            color={activeTab === 'mygroups' ? appColors.AppBlue : appColors.grey3} 
            size={20} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'mygroups' && styles.activeTabText
          ]}>
            My Groups
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
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
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
    fontFamily: appFonts.regularText,
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

export default GroupsScreen;
