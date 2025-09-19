import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Image, Pressable, Dimensions } from 'react-native';
import { Icon } from '@rneui/base';
import { appColors, appImages } from '../global/Styles';

import HomeScreen from '../screens/HomeScreen';
import MoodScreen from '../screens/MoodScreen';
import TherapistsScreen from '../screens/TherapistsScreen';
import AccountScreen from '../screens/AccountScreen';
import EmergencyScreen from '../screens/EmergencyScreen';

const BottomTab = createBottomTabNavigator();
const SCREEN_WIDTH = Dimensions.get('window').width;

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const [activeTab, setActiveTab] = useState('HomeScreen');

  const isActive = (tabName) => activeTab === tabName;

  const getTabIcon = (name, isActive) => {
    const iconMap = {
      HomeScreen: { icon: 'home', type: 'material' },
      MoodScreen: { icon: 'mood', type: 'material' },
      TherapistsScreen: { icon: 'people', type: 'material' },
      AccountScreen: { icon: 'person', type: 'material' },
      EmergencyScreen: { icon: 'emergency', type: 'material' },
    };

    const iconConfig = iconMap[name];
    
    if (iconConfig) {
      return (
        <Icon
          name={iconConfig.icon}
          type={iconConfig.type}
          color={isActive ? appColors.AppBlue : appColors.CardBackground}
          size={22}
        />
      );
    } else {
      // Fallback to a default icon if the mapping is not available
      return (
        <Icon
          name="help-outline"
          type="material"
          color={isActive ? appColors.AppBlue : appColors.CardBackground}
          size={22}
        />
      );
    }
  };

  const TabButton = ({ name, label }) => (
    <Pressable
      style={[styles.footerTab, isActive(name) ? styles.footerTabActive : styles.footerTabInactive]}
      onPress={() => {
        setActiveTab(name);
        navigation.navigate(name);
      }}
    >
      <View style={styles.footerTabContent}>
        {getTabIcon(name, isActive(name))}
        <Text style={isActive(name) ? styles.footerTabTextActive : styles.footerTabText}>
          {label}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.footerContainer}>
      <View style={styles.footerTabsContainer}>
        <TabButton name="HomeScreen" label="Home" />
        <TabButton name="MoodScreen" label="Mood" />
        <TabButton name="TherapistsScreen" label="Therapists" />
        <TabButton name="AccountScreen" label="Account" />
        <TabButton name="EmergencyScreen" label="Emergency" />
      </View>
    </View>
  );
};

const LHBottomTabs = () => {
  return (
    <BottomTab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <BottomTab.Screen name="HomeScreen" component={HomeScreen} />
      <BottomTab.Screen name="MoodScreen" component={MoodScreen} />
      <BottomTab.Screen name="TherapistsScreen" component={TherapistsScreen} />
      <BottomTab.Screen name="AccountScreen" component={AccountScreen} />
      <BottomTab.Screen name="EmergencyScreen" component={EmergencyScreen} />
    </BottomTab.Navigator>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: appColors.AppBlue,
  },
  footerTabsContainer: {
    flexDirection: "row",
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 5,
    borderTopColor: appColors.AppBlue,
    borderTopWidth: 2,
  },
  footerTab: {
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    flex: 1,
    borderRadius: 50,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  footerTabActive: {
    backgroundColor: appColors.CardBackground,
  },
  footerTabInactive: {
    backgroundColor: appColors.AppBlue,
  },
  footerTabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  footerTabText: {
    color: appColors.CardBackground,
    fontWeight: "600",
    fontSize: 9,
    marginTop: 3,
    textAlign: 'center',
  },
  footerTabTextActive: {
    color: appColors.AppBlue,
    fontWeight: "800",
    fontSize: 9,
    textAlign: 'center',
  },
  footerTabIcon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
});

export default LHBottomTabs;