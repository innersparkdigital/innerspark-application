import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import VerifyAppVersionScreen from '../screens/verificationScreens/VerifyAppVersionScreen';

// instantiating the update stack navigator
const UpdateAppStack = createStackNavigator();

export default function UpdateAppNavigator(){
    return(
        <UpdateAppStack.Navigator>
            <UpdateAppStack.Screen 
                name="VerifyAppVersionScreen"
                component={VerifyAppVersionScreen}
                options={{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            /> 

        </UpdateAppStack.Navigator>

    )
}
