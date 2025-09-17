import React, { useEffect } from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import WelcomeStarterScreen from '../screens/starterScreens/WelcomeStarterScreen';
import SigninScreen from '../screens/authScreens/SigninScreen';
import SignupScreen from '../screens/signupScreens/SignupScreen';


/** A new library will be used for Location Services */
// import YoLocationScreen from '../screens/signupScreens/YoLocationScreen';

import SigninOTPScreen from '../screens/authScreens/SigninOTPScreen';

// password reset screens
import PasswordResetScreen from '../screens/passwordResetScreens/PasswordResetScreen';
import PasswordResetOTPScreen from '../screens/passwordResetScreens/PasswordResetOTPScreen';
import NewPasswordScreen from '../screens/passwordResetScreens/NewPasswordScreen';

// Terms and Privacy Policy screens
import TermsOfServiceScreen from '../screens/termsScreens/TermsOfServiceScreen';
import PrivacyPolicyScreen from '../screens/termsScreens/PrivacyPolicyScreen';


const LHAuthStack = createStackNavigator(); // Initialize the stack navigator

export default function LHAuthNavigator(){

    return(
        <LHAuthStack.Navigator>

            <LHAuthStack.Screen 
                name = "WelcomeStarterScreen"
                component = {WelcomeStarterScreen}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHAuthStack.Screen 
                name = "SigninScreen"
                component = {SigninScreen}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHAuthStack.Screen 
                name = "SigninOTPScreen"
                component = {SigninOTPScreen}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHAuthStack.Screen 
                name = "SignupScreen"
                component = {SignupScreen}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />


            {/** Password Reset Screens Flow  */}
            <LHAuthStack.Screen 
                name = "PasswordResetScreen"
                component = {PasswordResetScreen}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHAuthStack.Screen 
                name = "PasswordResetOTPScreen"
                component = {PasswordResetOTPScreen}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHAuthStack.Screen 
                name = "NewPasswordScreen"
                component = {NewPasswordScreen}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            {/* Terms of Service and Privacy Policy Screens */}
            <LHAuthStack.Screen 
                name = "TermsOfServiceScreen"
                component = {TermsOfServiceScreen}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <LHAuthStack.Screen 
                name = "PrivacyPolicyScreen"
                component = {PrivacyPolicyScreen}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />
            

        </LHAuthStack.Navigator>
    )
}