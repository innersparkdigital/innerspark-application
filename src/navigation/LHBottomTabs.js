import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Image, Pressable, Dimensions } from 'react-native';
import { Icon } from '@rneui/base';
import { appColors, appImages } from '../global/Styles';

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

  const getTabIcon = (name, isActive) => {
    const iconMap = {
      HomeScreen: { active: appImages?.homeFooterIcon1, inactive: appImages?.homeFooterIcon1Inactive },
      ExploreScreen: { active: appImages?.homeFooterIcon2, inactive: appImages?.homeFooterIcon2Inactive },
      BookingsScreen: { active: appImages?.homeFooterIcon3, inactive: appImages?.homeFooterIcon3Inactive },
      ProfileScreen: { active: appImages?.homeFooterIcon4, inactive: appImages?.homeFooterIcon4Inactive },
      MoreScreen: { active: appImages?.homeFooterIcon5, inactive: appImages?.homeFooterIcon5Inactive },
    };

    const icon = isActive ? iconMap[name]?.active : iconMap[name]?.inactive;

    if (icon) {
      return <Image source={icon} style={styles.footerTabIcon} />;
    } else {
      // Fallback to a default icon if the image is not available
      return (
        <Icon
          name="question-mark-circle"
          type="material-community"
          color={isActive ? appColors.AppBlue : appColors.CardBackground}
          size={25}
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
        <TabButton name="ExploreScreen" label="Explore" />
        <TabButton name="BookingsScreen" label="Bookings" />
        <TabButton name="ProfileScreen" label="Profile" />
        <TabButton name="MoreScreen" label="More" />
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
  footerTabIcon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
});

export default LHBottomTabs;