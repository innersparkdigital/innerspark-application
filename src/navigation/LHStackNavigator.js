import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import YoBottomTabs from './YoBottomTabs';
import LHBottomTabs from './LHBottomTabs';

// Auth Screens
// import SigninScreen from '../screens/authScreens/SigninScreen';

// Home Footer - Bottom Tabs
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MoreScreen from '../screens/MoreScreen';
import BookingsScreen from '../screens/BookingsScreen';
import ExploreScreen from '../screens/ExploreScreen';

// Wellness Vault Screens
import WellnessVaultScreen from '../screens/vaultScreens/WellnessVaultScreen';
import MoMoTopupScreen from '../screens/vaultScreens/MoMoTopupScreen';

import AboutAppScreen from '../screens/AboutAppScreen';
// import ProfileInfoScreen from '../screens/profileScreens/ProfileInfoScreen';

// Booking Screens - Pickup Details & Service Item Selection and more
import ServiceItemSelectScreen from '../screens/bookingScreens/ServiceItemSelectScreen';

// More Screens
import PrivacyPolicyScreen from '../screens/moreScreens/PrivacyPolicyScreen';

// Settings Screens
import SettingsScreen from '../screens/settingScreens/SettingsScreen';

// Location Sreens
import NewAddressScreen from '../screens/locationScreens/NewAddressScreen';


// Verification Screens
import VerifyPhoneScreen from '../screens/verificationScreens/VerifyPhoneScreen';
import VerifyEmailScreen from '../screens/verificationScreens/VerifyEmailScreen';

// Therapist Screens
import TherapistsScreen from '../screens/TherapistsScreen';
import TherapistDetailScreen from '../screens/therapistScreens/TherapistDetailScreen';
import BookingCheckoutScreen from '../screens/therapistScreens/BookingCheckoutScreen';
import BookingConfirmationScreen from '../screens/therapistScreens/BookingConfirmationScreen';
import DonateToTherapistScreen from '../screens/therapistScreens/DonateToTherapistScreen';
import TherapistMatchingQuizScreen from '../screens/therapistScreens/TherapistMatchingQuizScreen';
import TherapistSuggestionsScreen from '../screens/therapistScreens/TherapistSuggestionsScreen';
import PostSessionFeedbackScreen from '../screens/therapistScreens/PostSessionFeedbackScreen';

// Chat Screens
import ChatScreen from '../screens/ChatScreen';
import ConversationsListScreen from '../screens/chatScreens/ConversationsListScreen';
import DMThreadScreen from '../screens/chatScreens/DMThreadScreen';
import NewMessageScreen from '../screens/chatScreens/NewMessageScreen';
import GroupMessagesViewScreen from '../screens/chatScreens/GroupMessagesViewScreen';

// Group Screens
import GroupsScreen from '../screens/GroupsScreen';
import GroupsListScreen from '../screens/groupScreens/GroupsListScreen';
import MyGroupsScreen from '../screens/groupScreens/MyGroupsScreen';
import GroupDetailScreen from '../screens/groupScreens/GroupDetailScreen';
import GroupChatScreen from '../screens/groupScreens/GroupChatScreen';
import GroupMessagesHistoryScreen from '../screens/groupScreens/GroupMessagesHistoryScreen';

// Event Screens
import EventDetailScreen from '../screens/eventScreens/EventDetailScreen';
import EventsScreen from '../screens/EventsScreen';

// Support Screens
import HelpCenterScreen from '../screens/HelpCenterScreen';
import MyTicketsScreen from '../screens/supportTicketScreens/MyTicketsScreen';
import TicketDetailScreen from '../screens/supportTicketScreens/TicketDetailScreen';
import CreateTicketScreen from '../screens/supportTicketScreens/CreateTicketScreen';

// Notification Screens
import NotificationScreen from '../screens/NotificationScreen';
import NotificationDetailScreen from '../screens/NotificationDetailScreen';

// Goal Screens
import GoalsScreen from '../screens/GoalsScreen';
import CreateGoalScreen from '../screens/goalScreens/CreateGoalScreen';
import GoalDetailScreen from '../screens/goalScreens/GoalDetailScreen';
import AppointmentsScreen from '../screens/therapistScreens/AppointmentsScreen';

// Services Screens
import ServicesCatalogScreen from '../screens/servicesScreens/ServicesCatalogScreen';
import PlansSubscriptionsScreen from '../screens/servicesScreens/PlansSubscriptionsScreen';
import BillingHistoryScreen from '../screens/servicesScreens/BillingHistoryScreen';

// Mood Screens
import TodayMoodScreen from '../screens/moodScreens/TodayMoodScreen';
import MoodHistoryScreen from '../screens/moodScreens/MoodHistoryScreen';
import MoodPointsScreen from '../screens/moodScreens/MoodPointsScreen';

// Report Screens
import WeeklyReportScreen from '../screens/reportScreens/WeeklyReportScreen';
import ReportDetailScreen from '../screens/reportScreens/ReportDetailScreen';

// Emergency Screens
import EmergencyLandingScreen from '../screens/emergencyScreens/EmergencyLandingScreen';
import PanicButtonScreen from '../screens/emergencyScreens/PanicButtonScreen';
import SafetyPlanScreen from '../screens/emergencyScreens/SafetyPlanScreen';

/** A new library will be used for Location Services */
// Yo Location Screens
// import LocationPickerScreen from '../screens/locationScreens/LocationPickerScreen';

// Yo Test Screen
import TestScreen from '../screens/TestScreen';
import VerifyAppVersionScreen from '../screens/verificationScreens/VerifyAppVersionScreen';


const LHStack = createStackNavigator(); // Initialize the stack navigator

export default function LHStackNavigator(){

    return(
        <LHStack.Navigator>

             <LHStack.Screen
                name="LHBottomTabs"
                component={LHBottomTabs}
                options={{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            {/* Note: Bottom Tab screens (HomeScreen, MoodScreen, TherapistsScreen, AccountScreen, EmergencyScreen) 
                 are now only defined in LHBottomTabs to avoid navigation conflicts */}

            <LHStack.Screen
                name="AboutAppScreen"
                component={AboutAppScreen}
                options={{
                    headerShown: false,
                    title: '',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            {/* Wellness Vault Screens */}
            <LHStack.Screen
                name="WellnessVaultScreen"
                component={WellnessVaultScreen}
                options={{
                    headerShown: false,
                    title: '',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            {/* MoMo Topup Screen */}
            <LHStack.Screen
                name="MoMoTopupScreen"
                component={MoMoTopupScreen}
                options={{
                    headerShown: false,
                    title: '',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />



            {/* Profile Screens */}
            {/* <LHStack.Screen
                name="ProfileInfoScreen"
                component={ProfileInfoScreen}
                options={{
                    headerShown: false,
                    title: 'Profile Info',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            /> */}

           

            {/* More Screens */}
            <LHStack.Screen
                name="PrivacyPolicyScreen"
                component={PrivacyPolicyScreen}
                options={{
                    headerShown: false,
                    title: 'Privacy Policy',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            {/* Settings Screens */}
            <LHStack.Screen
                name="SettingsScreen"
                component={SettingsScreen}
                options={{
                    headerShown: false,
                    title: 'Settings',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />


            {/* Booking Screens */}
            <LHStack.Screen
                name="ServiceItemSelectScreen"
                component={ServiceItemSelectScreen}
                options={{
                    headerShown: false,
                    title: 'Select Service Items',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />


            <LHStack.Screen
                name="NewAddressScreen"
                component={NewAddressScreen}
                options={{
                    headerShown: false,
                    title: 'Add New Address',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            {/* <YoStack.Screen
                name = "LocationPickerScreen"
                component = {LocationPickerScreen}
                options = {{
                    headerShown: false,
                    title: '',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            /> */}

            <LHStack.Screen
                name="TestScreen"
                component={TestScreen}
                options={{
                    headerShown: true,
                    title: 'Test Screen',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            {/* Verification Screens */}
            <LHStack.Screen
                name="VerifyAppVersionScreen"
                component={VerifyAppVersionScreen}
                options={{
                    headerShown: false,
                    title: 'App Update Screen',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="VerifyPhoneScreen"
                component={VerifyPhoneScreen}
                options={{
                    headerShown: false,
                    title: 'Verify Phone Number',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="VerifyEmailScreen"
                component={VerifyEmailScreen}
                options={{
                    headerShown: false,
                    title: 'Verify Email Address',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            {/* Event Screens */}
            {/* <LHStack.Screen
                name="EventsScreen"
                component={EventsScreen}
                options={{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />
            <LHStack.Screen
                name="EventDetailScreen"
                component={EventDetailScreen}
                options={{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            /> */}

             {/* Notification Screen */}
             <LHStack.Screen
                name="NotificationScreen"
                component={NotificationScreen}
                options={{
                    headerShown: false,
                    title: 'Notifications',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />


            <LHStack.Screen
                name="NotificationDetailScreen"
                component={NotificationDetailScreen}
                options={{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            {/* Goal Screens */}
            <LHStack.Screen
                name="GoalsScreen"
                component={GoalsScreen}
                options={{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />
            <LHStack.Screen
                name="CreateGoalScreen"
                component={CreateGoalScreen}
                options={{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />
            <LHStack.Screen
                name="GoalDetailScreen"
                component={GoalDetailScreen}
                options={{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            {/* Therapist Screens */}
            <LHStack.Screen
                name="TherapistsScreen"
                component={TherapistsScreen}
                options={{
                    headerShown: false,
                    title: 'Find Therapists',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="TherapistDetailScreen"
                component={TherapistDetailScreen}
                options={{
                    headerShown: false,
                    title: 'Therapist Profile',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="BookingCheckoutScreen"
                component={BookingCheckoutScreen}
                options={{
                    headerShown: false,
                    title: 'Booking Checkout',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="BookingConfirmationScreen"
                component={BookingConfirmationScreen}
                options={{
                    headerShown: false,
                    title: 'Booking Confirmed',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="AppointmentsScreen"
                component={AppointmentsScreen}
                options={{
                    headerShown: false,
                    title: 'My Appointments',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="PostSessionFeedbackScreen"
                component={PostSessionFeedbackScreen}
                options={{
                    headerShown: false,
                    title: 'Session Feedback',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="DonateToTherapistScreen"
                component={DonateToTherapistScreen}
                options={{
                    headerShown: false,
                    title: 'Donate to Therapist',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="TherapistMatchingQuizScreen"
                component={TherapistMatchingQuizScreen}
                options={{
                    headerShown: false,
                    title: 'Therapist Matching Quiz',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="TherapistSuggestionsScreen"
                component={TherapistSuggestionsScreen}
                options={{
                    headerShown: false,
                    title: 'Therapist Suggestions',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            {/* Chat Screens */}
            <LHStack.Screen
                name="ChatScreen"
                component={ChatScreen}
                options={{
                    headerShown: false,
                    title: 'Messages',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="ConversationsListScreen"
                component={ConversationsListScreen}
                options={{
                    headerShown: false,
                    title: 'Conversations',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="DMThreadScreen"
                component={DMThreadScreen}
                options={{
                    headerShown: false,
                    title: 'Chat',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="NewMessageScreen"
                component={NewMessageScreen}
                options={{
                    headerShown: false,
                    title: 'New Message',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="GroupMessagesViewScreen"
                component={GroupMessagesViewScreen}
                options={{
                    headerShown: false,
                    title: 'Group Messages',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            {/* Group Screens */}
            <LHStack.Screen
                name="GroupsScreen"
                component={GroupsScreen}
                options={{
                    headerShown: false,
                    title: 'Groups',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="GroupsListScreen"
                component={GroupsListScreen}
                options={{
                    headerShown: false,
                    title: 'Groups Directory',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="MyGroupsScreen"
                component={MyGroupsScreen}
                options={{
                    headerShown: false,
                    title: 'My Groups',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="GroupDetailScreen"
                component={GroupDetailScreen}
                options={{
                    headerShown: false,
                    title: 'Group Details',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="GroupChatScreen"
                component={GroupChatScreen}
                options={{
                    headerShown: false,
                    title: 'Group Chat',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="GroupMessagesHistoryScreen"
                component={GroupMessagesHistoryScreen}
                options={{
                    headerShown: false,
                    title: 'Message History',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            {/* Event Screens */}
            <LHStack.Screen
                name="EventsScreen"
                component={EventsScreen}
                options={{
                    headerShown: false,
                    title: 'Events',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="EventDetailScreen"
                component={EventDetailScreen}
                options={{
                    headerShown: false,
                    title: 'Event Details',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            {/* Support Screens */}
            <LHStack.Screen
                name="HelpCenterScreen"
                component={HelpCenterScreen}
                options={{
                    headerShown: false,
                    title: 'Help Center',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="MyTicketsScreen"
                component={MyTicketsScreen}
                options={{
                    headerShown: false,
                    title: 'My Support Tickets',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="TicketDetailScreen"
                component={TicketDetailScreen}
                options={{
                    headerShown: false,
                    title: 'Ticket Details',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="CreateTicketScreen"
                component={CreateTicketScreen}
                options={{
                    headerShown: false,
                    title: 'Create Support Ticket',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            {/* Services Screens */}
            <LHStack.Screen
                name="ServicesCatalogScreen"
                component={ServicesCatalogScreen}
                options={{
                    headerShown: false,
                    title: 'Services & Plans',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="PlansSubscriptionsScreen"
                component={PlansSubscriptionsScreen}
                options={{
                    headerShown: false,
                    title: 'Plans & Subscriptions',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            {/* Mood Screens */}
            <LHStack.Screen
                name="TodayMoodScreen"
                component={TodayMoodScreen}
                options={{
                    headerShown: false,
                    title: 'Daily Mood Check-in',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="MoodHistoryScreen"
                component={MoodHistoryScreen}
                options={{
                    headerShown: false,
                    title: 'Mood History',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="MoodPointsScreen"
                component={MoodPointsScreen}
                options={{
                    headerShown: false,
                    title: 'Loyalty Points',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            {/* Report Screens */}
            <LHStack.Screen
                name="WeeklyReportScreen"
                component={WeeklyReportScreen}
                options={{
                    headerShown: false,
                    title: 'Weekly Report',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="ReportDetailScreen"
                component={ReportDetailScreen}
                options={{
                    headerShown: false,
                    title: 'Report Details',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            {/* Emergency Screens */}
            <LHStack.Screen
                name="EmergencyLandingScreen"
                component={EmergencyLandingScreen}
                options={{
                    headerShown: false,
                    title: 'Emergency Help',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="PanicButtonScreen"
                component={PanicButtonScreen}
                options={{
                    headerShown: false,
                    title: 'Emergency Panic Button',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="SafetyPlanScreen"
                component={SafetyPlanScreen}
                options={{
                    headerShown: false,
                    title: 'Safety Plan',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

        </LHStack.Navigator>
    );
};