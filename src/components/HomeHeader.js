import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Icon, withBadge } from 'react-native-elements';
import { appColors, parameters } from '../global/Styles';
import { appImages } from '../global/Data';

export default function HomeHeader({navigation}){

    const BadgeIcon = withBadge(0)(Icon);

    return(

        <View style={styles.header}>
            <View style ={{alignItems:"center",justifyContent:'center', marginLeft:15}}>
                <Icon 
                    type = "material-community"
                    name = "menu"
                    color = {appColors.CardBackground}
                    size = {32}
                    onPress = {() => {
                        navigation.toggleDrawer();
                    }}
                    
               />
            </View>

            {/* <View style ={{alignItems:"center", justifyContent:"center"}}>
               <Text style ={{color:colors.CardBackground, fontSize:25,fontWeight:'bold'}}>Doffeelo</Text>
            </View> */}

            <View style ={{
                    alignItems:"center", 
                    justifyContent:"center", 
                    // backgroundColor:"orange",
                    paddingHorizontal:10,
                    marginBottom:3

                    
                    }}>
                <Image
                    source={appImages.logoRecBlue}
                    style={{ width:120, height:35}}
                />
            </View>

            <View style ={{alignItems:"center", justifyContent:"center", marginRight:15}}>
                <BadgeIcon 
                    type ="material-community"
                    name ="cart"
                    size = {35}
                    color ={appColors.CardBackground}
                />
            </View>
            
        </View>

    )
}

const styles = StyleSheet.create({

    header:{
        flexDirection:'row',
        backgroundColor:appColors.DoffeeGreen,
        height:parameters.headerHeight,
        justifyContent:'space-between'
    }
})