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
import NotificationScreen from '../screens/NotificationScreen';
import ProfileInfoScreen from '../screens/profileScreens/ProfileInfoScreen';

// Booking Screens - Pickup Details & Service Item Selection and more
import ServiceItemSelectScreen from '../screens/bookingScreens/ServiceItemSelectScreen';

// More Screens
import PrivacyPolicyScreen from '../screens/moreScreens/PrivacyPolicyScreen';

// Settings Screens
import SettingsScreen from '../screens/settingScreens/SettingsScreen';

// Location Sreens
import NewAddressScreen from '../screens/locationScreens/NewAddressScreen';


// Payment Screens
import PaymentOptionsScreen from '../screens/paymentScreens/PaymentOptionsScreen';

// Verification Screens
import VerifyPhoneScreen from '../screens/verificationScreens/VerifyPhoneScreen';
import VerifyEmailScreen from '../screens/verificationScreens/VerifyEmailScreen';

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

            {/* Bottom Tabs Screens */}
            <LHStack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    headerShown: false,
                    title: '',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{
                    headerShown: false,
                    title: '',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="MoreScreen"
                component={MoreScreen}
                options={{
                    headerShown: false,
                    title: '',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="BookingsScreen"
                component={BookingsScreen}
                options={{
                    headerShown: false,
                    title: '',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHStack.Screen
                name="ExploreScreen"
                component={ExploreScreen}
                options={{
                    headerShown: false,
                    title: '',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

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


            {/* Payment Screens */}
            <LHStack.Screen
                name="PaymentOptionsScreen"
                component={PaymentOptionsScreen}
                options={{
                    headerShown: false,
                    title: 'Payment Options',
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

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


        </LHStack.Navigator>
    )
}