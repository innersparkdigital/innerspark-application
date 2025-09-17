import React from 'react';
import { View, StyleSheet, Image, StatusBar } from 'react-native';
import { Icon } from '@rneui/base';
import { appColors, parameters } from '../global/Styles';

export default function HeaderBackButton({
    leftIconPressed = null,
    rightIconPressed = null,
    leftIconName,
    leftIconType,
    leftIconColor = appColors.black,
    rightIconName,
    rightIconType,
    rightIconColor = appColors.black,
    hasCustomStatusBar=false,
    hasRightIcon=false,
    headerBackgroundColor="transparent",
    customBarBackgroundColor = appColors.YoGreen,
    customBarStyle="dark-content",

}){

    return(

        <View style={{ ...styles.header, backgroundColor:headerBackgroundColor }}>
            { hasCustomStatusBar && <StatusBar backgroundColor={customBarBackgroundColor} barStyle={customBarStyle} /> }
            <View style={{...styles.headerIconsLR, marginLeft:15}}>
                <Icon 
                    type={ leftIconType ? leftIconType : "material-icons" }
                    name={leftIconName ? leftIconName : "arrow-back"}
                    color={leftIconColor}
                    size={25}
                    onPress={ leftIconPressed }
               />
            </View>

            { hasRightIcon && 
            <View style={{ ...styles.headerIconsLR, marginRight:15 }}>
                <Icon 
                    type={ rightIconType ? rightIconType : "material-community" }
                    name={ rightIconName ? rightIconName : "dots-horizontal" }
                    size={30}
                    color={rightIconColor}
                    onPress={ rightIconPressed }
                />
            </View> }
        </View>
        
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection:'row',
        // backgroundColor:appColors.YoPink,
        height:parameters.headerHeight,
        justifyContent:'space-between',
    },

    headerLogo: {
        alignItems:"flex-end", 
        justifyContent:"center", 
        //flex:1,
        // marginBottom:3,
        //backgroundColor:'yellow'
    },

    headerLogoImage: {
        width:80, 
        height:40,
        resizeMode:"contain"
    },

    headerLeftIcon: {
        alignItems:"center",
        justifyContent:"center", 
        marginLeft:15
    },

    headerRightIcon: {
        alignItems:"center", 
        justifyContent:"center", 
        marginRight:15
    },

    headerIconsLR: {
        alignItems:"center", 
        justifyContent:"center", 
    }
})