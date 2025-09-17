import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors, appColors } from '../global/Styles';
import { Icon } from '@rneui/base';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

import MoreScreen from '../screens/MoreScreen';
import BookingsScreen from '../screens/BookingsScreen';
import ExploreScreen from '../screens/ExploreScreen';

const BottomTab = createBottomTabNavigator()

export default function YoBottomTabs(){
    return(
        <BottomTab.Navigator 
            //screenOptions = {{ activeTintColor: appColors.AppBlue  }} 
            // activeColor="#f0edf6"
            // inactiveColor="#3e2465"
            // barStyle={{ backgroundColor: '#5655' }}

            screenOptions={
                ({ route }) => ({

                    /* 
                    tabBarIcon: ({ focused, color, size }) => {
                      let iconName;
          
                      if (route.name === 'HomeScreen') {
                        iconName = focused
                          ? 'ios-information-circle'
                          : 'ios-information-circle-outline';
                      } else if (route.name === 'Settings') {
                        iconName = focused ? 'ios-list-box' : 'ios-list';
                      }
          
                      // You can return any component that you like here!
                      // return <Ionicons name={iconName} size={size} color={color} />;
                      return <Icon name={iconName}  type="material-community" size={size} color={color} />;
                    },

                    */

                    tabBarActiveTintColor: appColors.grey4,
                    tabBarInactiveTintColor: appColors.CardBackground,
                    //tabBarShowLabel: false,
                    tabBarStyle: { 
                        backgroundColor:appColors.AppBlue,
                        paddingVertical:10,
                        height:65,
                        paddingBottom:5,
                    
                    },
                  })
            }
            
            >

            <BottomTab.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={
                    {
                       
                        tabBarLabel: "Home",
                        headerShown:false,
                        tabBarIcon: ({focused, color, size}) => (
                            <Icon name="home" type="material-community" color={color} size={35} />
                        ),

                        // tabBarItemStyle:{
                        //     backgroundColor:'pink',
                        //     padding: 5,
                            
                        // }

                    }
                }

            /> 

            <BottomTab.Screen
                name="ExploreScreen"
                component={ExploreScreen}
                options={
                    {
                       
                        tabBarLabel: "Explore",
                        headerShown:false,
                        tabBarIcon: ({focused, color, size}) => (
                            <Icon name="map" type="material-community" color={color} size={35} />
                        ),

                    }
                }
            /> 

            <BottomTab.Screen
                name="BookingsScreen"
                component={BookingsScreen}
                options={
                    {
                        tabBarLabel: "Bookings",
                        headerShown:false,
                        tabBarIcon: ({color, size}) => (
                            <Icon name="calendar-plus" type="material-community" color={color} size={35} />
                        )
                    }
                }
            /> 

            <BottomTab.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={
                    {
                        tabBarLabel: "Profile",
                        headerShown:false,
                        tabBarIcon: ({color, size}) => (
                            <Icon name="account-tie" type="material-community" color={color} size={35} />
                        )
                    }
                }

            /> 

            <BottomTab.Screen
                name="MoreScreen"
                component={MoreScreen}
                options={
                    {
                        tabBarLabel: "More",
                        headerShown:false,
                        tabBarIcon: ({color, size}) => (
                            <Icon name="addchart" type="material-icons" color={color} size={35} />
                        )
                    }
                }
            /> 

        </BottomTab.Navigator>
    )
}