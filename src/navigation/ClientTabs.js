import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { colors } from '../global/styles'
import { Icon } from 'react-native-elements'
import HomeScreen from '../screens/HomeScreen'
import SearchScreen from '../screens/SearchScreen'
import MyAccountScreen from '../screens/MyAccountScreen'
import MyOrdersScreen from '../screens/MyOrdersScreen'

const ClientTabs = createBottomTabNavigator()

export default function RootClientTabs(){
    return(
        <ClientTabs.Navigator 
            tabBarOptions = {{
                activeTintColor: colors.DoffeeGreen
            }}

        >
           
            <ClientTabs.Screen
                name = "HomeScreen"
                component = {HomeScreen}
                options = {
                    {
                        tabBarLabel: "Home",
                        tabBarIcon: ({color, size}) => (
                            <Icon
                                name="home"
                                type="material"
                                color={color}
                                size={size}
                            />
                        )
                    }
                }
            
            /> 


            <ClientTabs.Screen
                name = "SearchScreen"
                component = {SearchScreen}
                options = {
                    {
                        tabBarLabel: "Search",
                        tabBarIcon: ({color, size}) => (
                            <Icon
                                name="search"
                                type="material"
                                color={color}
                                size={size}
                            />
                        )
                    }
                }
            
            /> 

            <ClientTabs.Screen
                name = "MyOrdersScreen"
                component = {MyOrdersScreen}
                options = {
                    {
                        tabBarLabel: "Orders",
                        tabBarIcon: ({color, size}) => (
                            <Icon
                                name="view-list"
                                type="material"
                                color={color}
                                size={size}
                            />
                        )
                    }
                }
            
            /> 

            <ClientTabs.Screen
                name = "MyAccountScreen"
                component = {MyAccountScreen}
                options = {
                    {
                        tabBarLabel: "Account",
                        tabBarIcon: ({color, size}) => (
                            <Icon
                                name="person"
                                type="material"
                                color={color}
                                size={size}
                            />
                        )
                    }
                }
            
            /> 

        </ClientTabs.Navigator>
    )
}
