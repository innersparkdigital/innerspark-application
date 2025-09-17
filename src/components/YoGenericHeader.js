import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native';
import { Icon } from '@rneui/base';
import { appColors, parameters } from '../global/Styles';
import { appImages } from '../global/Data';

export default function YoGenericHeader({
    leftIconPressed,
    rightIconPressed,
    leftIconName,
    leftIconType,
    rightIconName,
    rightIconType,
    hasCustomStatusBar=true,
    hasRightIcon=true,

}){

    const iconWhiteR = appImages.logoDefault;

    return(

        <View style={styles.header}>

            { hasCustomStatusBar && 
            <StatusBar backgroundColor={appColors.AppBlue} /> }
          
            <View style={{...styles.headerIconsLR, marginLeft:15}}>
                <Icon 
                    type={ leftIconType ? leftIconType : "material-icons" }
                    name={leftIconName ? leftIconName : "arrow-back"}
                    color={appColors.AppBlue}
                    size={32}
                    onPress={ leftIconPressed }
               />
            </View>

            { hasRightIcon && 
            <View style={styles.headerLogo}>
                <Image source={iconWhiteR} style={styles.headerLogoImage} />
            </View> }

            {/* <View style={{ ...styles.headerIconsLR, marginRight:15 }}>
                <Icon 
                    type={ rightIconType ? rightIconType : "material-community" }
                    name={ rightIconName ? rightIconName : "dots-vertical" }
                    size={32}
                    color={appColors.CardBackground}
                    onPress={ rightIconPressed }
                />
            </View> */}

        </View>
        
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection:'row',
        backgroundColor:appColors.AppBlue,
        height:parameters.headerHeightL,
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