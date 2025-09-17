import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Icon } from '@rneui/base';
import { appColors } from '../global/Styles';

import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import BookingsScreen from '../screens/BookingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MoreScreen from '../screens/MoreScreen';

const BottomTab = createBottomTabNavigator();
const SCREEN_WIDTH = Dimensions.get('window').width;

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const [activeTab, setActiveTab] = useState('HomeScreen');

  const isActive = (tabName) => activeTab === tabName;

  const TabButton = ({ name, label, iconName }) => (
    <Pressable
      style={[styles.footerTab, isActive(name) ? styles.footerTabActive : styles.footerTabInactive]}
      onPress={() => {
        setActiveTab(name);
        navigation.navigate(name);
      }}
    >
      <View style={styles.footerTabContent}>
        <Icon
          name={iconName}
          type="material-community"
          color={isActive(name) ? appColors.AppBlue : appColors.CardBackground}
          size={25}
        />
        <Text style={isActive(name) ? styles.footerTabTextActive : styles.footerTabText}>
          {label}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.footerContainer}>
      <View style={styles.footerTabsContainer}>
        <TabButton name="HomeScreen" label="Home" iconName="home" />
        <TabButton name="ExploreScreen" label="Explore" iconName="map" />
        <TabButton name="BookingsScreen" label="Bookings" iconName="calendar-plus" />
        <TabButton name="ProfileScreen" label="Profile" iconName="account" />
        <TabButton name="MoreScreen" label="More" iconName="dots-horizontal" />
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
      <BottomTab.Screen name="ExploreScreen" component={ExploreScreen} />
      <BottomTab.Screen name="BookingsScreen" component={BookingsScreen} />
      <BottomTab.Screen name="ProfileScreen" component={ProfileScreen} />
      <BottomTab.Screen name="MoreScreen" component={MoreScreen} />
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
    fontSize: 10,
    marginTop: 3,
  },
  footerTabTextActive: {
    color: appColors.AppBlue,
    fontWeight: "800",
    fontSize: 10,
  },
});

export default LHBottomTabs;