import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import LHTherapistBottomTabs from './LHTherapistBottomTabs';

// Import therapist-specific screens
import THRequestsScreen from '../screens/therapistDashboardScreens/THRequestsScreen';
import THNotificationsScreen from '../screens/therapistDashboardScreens/THNotificationsScreen';
import THAppointmentDetailsScreen from '../screens/therapistDashboardScreens/appointments/THAppointmentDetailsScreen';
import THGroupDetailsScreen from '../screens/therapistDashboardScreens/groups/THGroupDetailsScreen';
import THChatConversationScreen from '../screens/therapistDashboardScreens/chats/THChatConversationScreen';

// Import shared screens from the main app
import AboutAppScreen from '../screens/AboutAppScreen';
import ProfileSettingsScreen from '../screens/settingScreens/ProfileSettingsScreen';
import SendFeedbackScreen from '../screens/settingScreens/SendFeedbackScreen';

const THStack = createStackNavigator();

const LHTherapistNavigator = () => {
  return (
    <THStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Main Bottom Tabs */}
      <THStack.Screen
        name="THMainTabs"
        component={LHTherapistBottomTabs}
      />
      
      {/* Therapist-specific screens */}
      <THStack.Screen
        name="THRequestsScreen"
        component={THRequestsScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      
      <THStack.Screen
        name="THNotificationsScreen"
        component={THNotificationsScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      
      <THStack.Screen
        name="THAppointmentDetailsScreen"
        component={THAppointmentDetailsScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      
      <THStack.Screen
        name="THGroupDetailsScreen"
        component={THGroupDetailsScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      
      <THStack.Screen
        name="THChatConversationScreen"
        component={THChatConversationScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      
      {/* Shared screens */}
      <THStack.Screen
        name="AboutAppScreen"
        component={AboutAppScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      
      <THStack.Screen
        name="ProfileSettingsScreen"
        component={ProfileSettingsScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      
      <THStack.Screen
        name="SendFeedbackScreen"
        component={SendFeedbackScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
    </THStack.Navigator>
  );
};

export default LHTherapistNavigator;
