import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import LHBottomTabs from './LHBottomTabs';

// Auth Screens
// import SigninScreen from '../screens/authScreens/SigninScreen';

// Wellness Vault Screens
import WellnessVaultScreen from '../screens/vaultScreens/WellnessVaultScreen';
import MoMoTopupScreen from '../screens/vaultScreens/MoMoTopupScreen';
import TransactionHistoryScreen from '../screens/vaultScreens/TransactionHistoryScreen';
import TransactionDetailScreen from '../screens/vaultScreens/TransactionDetailScreen';

import AboutAppScreen from '../screens/AboutAppScreen';
import ProfileScreen from '../screens/profileScreens/ProfileScreen';
import ProfileUpdateScreen from '../screens/profileScreens/ProfileUpdateScreen';

// More Screens
import PrivacyPolicyScreen from '../screens/termsScreens/PrivacyPolicyScreen';

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
import DonationFundScreen from '../screens/donateScreens/DonationFundScreen';
import TherapistMatchingQuizScreen from '../screens/therapistScreens/TherapistMatchingQuizScreen';
import TherapistSuggestionsScreen from '../screens/therapistScreens/TherapistSuggestionsScreen';
import PostSessionFeedbackScreen from '../screens/therapistScreens/PostSessionFeedbackScreen';

// Chat Screens
import ChatScreen from '../screens/ChatScreen';
import ConversationsListScreen from '../screens/chatScreens/ConversationsListScreen';
import DMThreadScreen from '../screens/chatScreens/DMThreadScreen';
import NewMessageScreen from '../screens/chatScreens/NewMessageScreen';
import TherapistProfileViewScreen from '../screens/chatScreens/TherapistProfileViewScreen';
import GroupInfoScreen from '../screens/chatScreens/GroupInfoScreen';

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
import MyEventDetailScreen from '../screens/eventScreens/MyEventDetailScreen';

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
import AppointmentDetailsScreen from '../screens/therapistScreens/AppointmentDetailsScreen';

// Services Screens
import ServicesScreen from '../screens/ServicesScreen';
import ServicesCatalogScreen from '../screens/servicesScreens/ServicesCatalogScreen';
import PlansSubscriptionsScreen from '../screens/servicesScreens/PlansSubscriptionsScreen';
import SubscriptionCheckoutScreen from '../screens/servicesScreens/SubscriptionCheckoutScreen';
import BillingHistoryScreen from '../screens/servicesScreens/BillingHistoryScreen';

// Mood Screens
import TodayMoodScreen from '../screens/moodScreens/TodayMoodScreen';
import MoodHistoryScreen from '../screens/moodScreens/MoodHistoryScreen';
import MoodPointsScreen from '../screens/moodScreens/MoodPointsScreen';

// Report Screens
import WeeklyReportScreen from '../screens/reportScreens/WeeklyReportScreen';
import ReportDetailScreen from '../screens/reportScreens/ReportDetailScreen';

// Meditation Screens
import MeditationsScreen from '../screens/MeditationsScreen';
import ArticleDetailScreen from '../screens/meditationScreens/ArticleDetailScreen';
import SoundPlayerScreen from '../screens/meditationScreens/SoundPlayerScreen';

// Emergency Screens
import EmergencyScreen from '../screens/EmergencyScreen';
import EmergencyLandingScreen from '../screens/emergencyScreens/EmergencyLandingScreen';
import PanicButtonScreen from '../screens/emergencyScreens/PanicButtonScreen';
import SafetyPlanScreen from '../screens/emergencyScreens/SafetyPlanScreen';

// Settings Screens
import SettingsScreen from '../screens/settingScreens/SettingsScreen';
import ProfileSettingsScreen from '../screens/settingScreens/ProfileSettingsScreen';
import AccountSettingsScreen from '../screens/settingScreens/AccountSettingsScreen';
import SecuritySettingsScreen from '../screens/settingScreens/SecuritySettingsScreen';
import NotificationSettingsScreen from '../screens/settingScreens/NotificationSettingsScreen';
import MoodReminderSettingsScreen from '../screens/settingScreens/MoodReminderSettingsScreen';
import PrivacySettingsScreen from '../screens/settingScreens/PrivacySettingsScreen';
import PrivacyCheckupScreen from '../screens/settingScreens/PrivacyCheckupScreen';
import SendFeedbackScreen from '../screens/settingScreens/SendFeedbackScreen';
import EmergencyContactsScreen from '../screens/settingScreens/EmergencyContactsScreen';
import DeactivateAccountScreen from '../screens/settingScreens/DeactivateAccountScreen';
import DataExportScreen from '../screens/settingScreens/DataExportScreen';
import ChangePasswordScreen from '../screens/settingScreens/ChangePasswordScreen';
import DataDeletionScreen from '../screens/settingScreens/DataDeletionScreen';
import AppearanceSettingsScreen from '../screens/settingScreens/AppearanceSettingsScreen';
import LanguageRegionSettingsScreen from '../screens/settingScreens/LanguageRegionSettingsScreen';
import DeleteAccountScreen from '../screens/settingScreens/DeleteAccountScreen';

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

            {/* Note: Bottom Tab screens (HomeScreen, MoodScreen, TherapistsScreen, WellnessVaultScreen, AccountScreen) 
                 are now only defined in LHBottomTabs to avoid navigation conflicts.
                 EmergencyScreen was moved from bottom tabs to stack navigator. */}

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

            {/* Transaction History Screen */}
            <LHStack.Screen
                name="TransactionHistoryScreen"
                component={TransactionHistoryScreen}
                options={{
                    headerShown: false,
                    title: 'Transaction History',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            {/* Transaction Detail Screen */}
            <LHStack.Screen
                name="TransactionDetailScreen"
                component={TransactionDetailScreen}
                options={{
                    headerShown: false,
                    title: 'Transaction Details',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

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

            {/* Profile Screens */}
            <LHStack.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{
                    headerShown: false,
                    title: 'Profile',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="ProfileUpdateScreen"
                component={ProfileUpdateScreen}
                options={{
                    headerShown: false,
                    title: 'Edit Profile',
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
                    ...TransitionPresets.SlideFromRightIOS
                }}
            />

            <LHStack.Screen
                name="AppointmentDetailsScreen"
                component={AppointmentDetailsScreen}
                options={{
                    headerShown: false,
                    title: 'Appointment Details',
                    ...TransitionPresets.SlideFromRightIOS
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
                name="DonationFundScreen"
                component={DonationFundScreen}
                options={{
                    headerShown: false,
                    title: 'Support Our Community',
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
                name="TherapistProfileViewScreen"
                component={TherapistProfileViewScreen}
                options={{
                    headerShown: false,
                    title: 'Therapist Profile',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="GroupInfoScreen"
                component={GroupInfoScreen}
                options={{
                    headerShown: false,
                    title: 'Group Information',
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

            <LHStack.Screen
                name="MyEventDetailScreen"
                component={MyEventDetailScreen}
                options={{
                    headerShown: false,
                    title: 'My Event',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            {/* Meditation Screens */}
            <LHStack.Screen
                name="MeditationScreen"
                component={MeditationsScreen}
                options={{
                    headerShown: false,
                    title: 'Meditations',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="ArticleDetailScreen"
                component={ArticleDetailScreen}
                options={{
                    headerShown: false,
                    title: 'Article',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="SoundPlayerScreen"
                component={SoundPlayerScreen}
                options={{
                    headerShown: false,
                    title: 'Sound Player',
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
                name="ServicesScreen"
                component={ServicesScreen}
                options={{
                    headerShown: false,
                    title: 'Services',
                }}
            />
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

            <LHStack.Screen
                name="SubscriptionCheckoutScreen"
                component={SubscriptionCheckoutScreen}
                options={{
                    headerShown: false,
                    title: 'Checkout',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="BillingHistoryScreen"
                component={BillingHistoryScreen}
                options={{
                    headerShown: false,
                    title: 'Billing History',
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
                name="EmergencyScreen"
                component={EmergencyScreen}
                options={{
                    headerShown: false,
                    title: 'Emergency',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

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

            <LHStack.Screen
                name="ProfileSettingsScreen"
                component={ProfileSettingsScreen}
                options={{
                    headerShown: false,
                    title: 'Profile Settings',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="AccountSettingsScreen"
                component={AccountSettingsScreen}
                options={{
                    headerShown: false,
                    title: 'Account Settings',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="SecuritySettingsScreen"
                component={SecuritySettingsScreen}
                options={{
                    headerShown: false,
                    title: 'Security Settings',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="NotificationSettingsScreen"
                component={NotificationSettingsScreen}
                options={{
                    headerShown: false,
                    title: 'Notification Settings',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="MoodReminderSettingsScreen"
                component={MoodReminderSettingsScreen}
                options={{
                    headerShown: false,
                    title: 'Mood Reminders',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="PrivacySettingsScreen"
                component={PrivacySettingsScreen}
                options={{
                    headerShown: false,
                    title: 'Privacy Settings',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="PrivacyCheckupScreen"
                component={PrivacyCheckupScreen}
                options={{
                    headerShown: false,
                    title: 'Privacy Checkup',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="SendFeedbackScreen"
                component={SendFeedbackScreen}
                options={{
                    headerShown: false,
                    title: 'Send Feedback',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="EmergencyContactsScreen"
                component={EmergencyContactsScreen}
                options={{
                    headerShown: false,
                    title: 'Emergency Contacts',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="DeactivateAccountScreen"
                component={DeactivateAccountScreen}
                options={{
                    headerShown: false,
                    title: 'Deactivate Account',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="DataExportScreen"
                component={DataExportScreen}
                options={{
                    headerShown: false,
                    title: 'Export Data',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="ChangePasswordScreen"
                component={ChangePasswordScreen}
                options={{
                    headerShown: false,
                    title: 'Change Password',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="DataDeletionScreen"
                component={DataDeletionScreen}
                options={{
                    headerShown: false,
                    title: 'Delete Data',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="AppearanceSettingsScreen"
                component={AppearanceSettingsScreen}
                options={{
                    headerShown: false,
                    title: 'Appearance',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="LanguageRegionSettingsScreen"
                component={LanguageRegionSettingsScreen}
                options={{
                    headerShown: false,
                    title: 'Language & Region',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="DeleteAccountScreen"
                component={DeleteAccountScreen}
                options={{
                    headerShown: false,
                    title: 'Delete Account',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

        </LHStack.Navigator>
    );
};