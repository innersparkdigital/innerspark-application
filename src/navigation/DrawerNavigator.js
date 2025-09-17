import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import RootClientTabs from './ClientTabs'
import BusinessConsoleScreen from '../screens/BusinessConsoleScreen'
import DrawerContent from '../components/DrawerContent'
import { Icon } from 'react-native-elements'
import { colors } from '../global/styles'
import DoffeeBottomTabs from './DoffeeBottomTabs'



const Drawer = createDrawerNavigator()

export default function(){
    return(
        <Drawer.Navigator 
                drawerContent = { props => <DrawerContent {...props} /> }
        >

            <Drawer.Screen 
                name = "RootClientTabs"
                component = {DoffeeBottomTabs}
                options = {{
                    title: 'Client',
                    drawerIcon: ({focused, size}) => (
                        <Icon
                            type = "material-community"
                            name = "home"
                            color = {focused ? '#7CC' : colors.grey2}
                            size = {size}
                        />
                    )
                }}
            
            />

            <Drawer.Screen 
                name = "BusinessConsoleScreen"
                component = {BusinessConsoleScreen}
                options = {{
                    title: 'Business Console',
                    drawerIcon: ({focused, size}) => (
                        <Icon
                            type = "material"
                            name = "business"
                            color = {focused ? '#7CC' : colors.grey2}
                            size = {size}
                        />
                    )
                }}
            
            />


        </Drawer.Navigator>
    )
}