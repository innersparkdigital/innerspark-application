import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import DoffeeConnectionErrorScreen from '../screens/DoffeeConnectionErrorScreen'
import DoffeeLocationErrorScreen  from '../screens/DoffeeLocationErrorScreen';
import { useSelector, useDispatch } from 'react-redux';

const DoffeeErrorStack = createStackNavigator(); // Initialize the stack navigator

export default function AccessErrorNavigator(){

    const locationEnabledStatus = useSelector(state => state.region.isLocationEnabled); // the current device location state
    const networkInfoStatus = useSelector(state => state.netInfo) // network information

    return(
        <DoffeeErrorStack.Navigator>

           { !networkInfoStatus.isConnected && 
            <DoffeeErrorStack.Screen
                name = "DoffeeConnectionErrorScreen"
                component = {DoffeeConnectionErrorScreen}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            /> 
          }

            { !locationEnabledStatus && 
                <DoffeeErrorStack.Screen 
                    name = "DoffeeLocationErrorScreen"
                    component = {DoffeeLocationErrorScreen}
                    options = {{
                        headerShown: false,
                        ...TransitionPresets.RevealFromBottomAndroid
                    }}
                />
            }
        
        </DoffeeErrorStack.Navigator>
    )
}