import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@rneui/themed';
import { appColors } from '../global/Styles';

// Import therapist screens
import THDashboardScreen from '../screens/therapistDashboardScreens/THDashboardScreen';
import THAppointmentsScreen from '../screens/therapistDashboardScreens/THAppointmentsScreen';
import THGroupsScreen from '../screens/therapistDashboardScreens/THGroupsScreen';
import THChatsScreen from '../screens/therapistDashboardScreens/THChatsScreen';
import THAccountScreen from '../screens/therapistDashboardScreens/THAccountScreen';

const Tab = createBottomTabNavigator();

const LHTherapistBottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: appColors.AppBlue,
        tabBarInactiveTintColor: appColors.grey3,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: appColors.CardBackground,
          borderTopWidth: 1,
          borderTopColor: appColors.grey6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="THDashboard"
        component={THDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Icon type="material" name="dashboard" color={color} size={size} />
          ),
        }}
      />
      
      <Tab.Screen
        name="THAppointments"
        component={THAppointmentsScreen}
        options={{
          tabBarLabel: 'Sessions', // named 'sessions' to use less space
          tabBarIcon: ({ color, size }) => (
            <Icon type="material" name="calendar-today" color={color} size={size} />
          ),
        }}
      />
      
      <Tab.Screen
        name="THGroups"
        component={THGroupsScreen}
        options={{
          tabBarLabel: 'Groups',
          tabBarIcon: ({ color, size }) => (
            <Icon type="material" name="forum" color={color} size={size} />
          ),
        }}
      />
      
      <Tab.Screen
        name="THChats"
        component={THChatsScreen}
        options={{
          tabBarLabel: 'Chats',
          tabBarIcon: ({ color, size }) => (
            <Icon type="material" name="chat" color={color} size={size} />
          ),
        }}
      />
      
      <Tab.Screen
        name="THAccount"
        component={THAccountScreen}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color, size }) => (
            <Icon type="material" name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default LHTherapistBottomTabs;
