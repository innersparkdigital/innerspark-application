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
import ProfileInfoScreen from '../screens/profileScreens/ProfileInfoScreen';

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
import EventDetailScreen from '../screens/eventScreens/EventDetailScreen';
import EventsScreen from '../screens/EventsScreen';

// Notification Screens
import NotificationScreen from '../screens/NotificationScreen';
import NotificationDetailScreen from '../screens/NotificationDetailScreen';

// Goal Screens
import GoalsScreen from '../screens/GoalsScreen';
import CreateGoalScreen from '../screens/goalScreens/CreateGoalScreen';
import GoalDetailScreen from '../screens/goalScreens/GoalDetailScreen';
import AppointmentsScreen from '../screens/therapistScreens/AppointmentsScreen';

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
            <LHStack.Screen
                name="ProfileInfoScreen"
                component={ProfileInfoScreen}
                options={{
                    headerShown: false,
                    title: 'Profile Info',
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
            <LHStack.Screen
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
            />

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


        </LHStack.Navigator>
    )
}