import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native';
import { Icon } from '@rneui/base';
import { appColors, appFonts, parameters } from '../global/Styles';
import { appImages } from '../global/Data';

export default function LHGenericHeader({
    leftIconPressed,
    leftIconName,
    leftIconType,
    hasCustomStatusBar=true,
    title="Header Title",
    showLeftIcon = true,
    showTitle = true,
}){

    return(
        <View style={styles.header}>
            { hasCustomStatusBar && <StatusBar backgroundColor={appColors.AppBlue} barStyle='light-content' /> }
          
            {showLeftIcon && 
            <View style={{...styles.headerIconsLR, marginLeft:10 }}>
                <Icon 
                    type={ leftIconType ? leftIconType : "material-community" }
                    name={leftIconName ? leftIconName : "chevron-left-circle"}
                    color={appColors.AppBlue}
                    size={32}
                    onPress={ leftIconPressed }
               />
            </View>
            }

            {/* The Header Title */}
            <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
                { showTitle && <Text numberOfLines={1} ellipsizeMode='tail' style={styles.headerText}>{title}</Text> }
            </View>
            {/* The Right space to balance the header */}
            <View style={{ marginRight:10, paddingHorizontal:8 }}></View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection:'row',
        //backgroundColor:appColors.AppBlue,
        height:parameters.headerHeightL,
        // justifyContent:'space-between',
        alignItems:'center',
    },

    headerLeftIcon: {
        alignItems:"center",
        justifyContent:"center", 
        marginLeft:10
    },

    headerIconsLR: {
        alignItems:"center", 
        justifyContent:"center", 
    },

    headerText: {
        color: appColors.AppBlue,
        fontSize: 20,
        paddingHorizontal:5,
        fontFamily: appFonts.headerTextBold,
        textAlign:'center',
    }
})