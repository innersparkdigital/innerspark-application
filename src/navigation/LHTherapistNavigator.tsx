import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import LHTherapistBottomTabs from './LHTherapistBottomTabs';

// Import therapist-specific screens
import THRequestsScreen from '../screens/therapistDashboardScreens/THRequestsScreen';
import THNotificationsScreen from '../screens/therapistDashboardScreens/THNotificationsScreen';
import THAppointmentDetailsScreen from '../screens/therapistDashboardScreens/appointments/THAppointmentDetailsScreen';
import THScheduleAppointmentScreen from '../screens/therapistDashboardScreens/appointments/THScheduleAppointmentScreen';
import THGroupDetailsScreen from '../screens/therapistDashboardScreens/groups/THGroupDetailsScreen';
import THGroupChatScreen from '../screens/therapistDashboardScreens/groups/THGroupChatScreen';
import THGroupMembersScreen from '../screens/therapistDashboardScreens/groups/THGroupMembersScreen';
import THGroupMemberProfileScreen from '../screens/therapistDashboardScreens/groups/THGroupMemberProfileScreen';
import THCreateGroupScreen from '../screens/therapistDashboardScreens/groups/THCreateGroupScreen';
import THScheduleGroupSessionScreen from '../screens/therapistDashboardScreens/groups/THScheduleGroupSessionScreen';
import THClientProfileScreen from '../screens/therapistDashboardScreens/clients/THClientProfileScreen';
import THAddClientNoteScreen from '../screens/therapistDashboardScreens/clients/THAddClientNoteScreen';
import THChatConversationScreen from '../screens/therapistDashboardScreens/chats/THChatConversationScreen';
import THSelectClientScreen from '../screens/therapistDashboardScreens/chats/THSelectClientScreen';
import THAvailabilityScreen from '../screens/therapistDashboardScreens/account/THAvailabilityScreen';
import THPricingScreen from '../screens/therapistDashboardScreens/account/THPricingScreen';
import THAnalyticsScreen from '../screens/therapistDashboardScreens/account/THAnalyticsScreen';
import THReviewsScreen from '../screens/therapistDashboardScreens/account/THReviewsScreen';
import THTransactionHistoryScreen from '../screens/therapistDashboardScreens/account/THTransactionHistoryScreen';

// Import shared screens from the main app
import AboutAppScreen from '../screens/AboutAppScreen';
import ProfileSettingsScreen from '../screens/settingScreens/ProfileSettingsScreen';
import SendFeedbackScreen from '../screens/settingScreens/SendFeedbackScreen';

// Test screens
import DevTestScreen from '../screens/DevTestScreen';

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
        name="THScheduleAppointmentScreen"
        component={THScheduleAppointmentScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />

      <THStack.Screen
        name="THClientProfileScreen"
        component={THClientProfileScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />

      <THStack.Screen
        name="THAddClientNoteScreen"
        component={THAddClientNoteScreen}
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
        name="THGroupChatScreen"
        component={THGroupChatScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />

      <THStack.Screen
        name="THGroupMembersScreen"
        component={THGroupMembersScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />

      <THStack.Screen
        name="THGroupMemberProfileScreen"
        component={THGroupMemberProfileScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />

      <THStack.Screen
        name="THCreateGroupScreen"
        component={THCreateGroupScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />

      <THStack.Screen
        name="THScheduleGroupSessionScreen"
        component={THScheduleGroupSessionScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />

      <THStack.Screen
        name="THSelectClientScreen"
        component={THSelectClientScreen}
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

      <THStack.Screen
        name="THAvailabilityScreen"
        component={THAvailabilityScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />

      <THStack.Screen
        name="THPricingScreen"
        component={THPricingScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />

      <THStack.Screen
        name="THAnalyticsScreen"
        component={THAnalyticsScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />

      <THStack.Screen
        name="THReviewsScreen"
        component={THReviewsScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />

      <THStack.Screen
        name="THTransactionHistoryScreen"
        component={THTransactionHistoryScreen}
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

      {/* Test screens */}
      <THStack.Screen
        name="DevTestScreen"
        component={DevTestScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />

    </THStack.Navigator>
  );
};

export default LHTherapistNavigator;
