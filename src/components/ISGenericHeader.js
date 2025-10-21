/**
 * Innerspark Generic Header
 */
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { Icon } from '@rneui/base';
import { appColors, appFonts, parameters } from '../global/Styles';

export default function ISGenericHeader({
    hasCustomStatusBar=true,
    hasLightBackground=false,
    hasRightIcon=false,
    rightIconName="info",
    rightIconType="material",
    rightIconSize=20,
    rightIconOnPress=()=>{},
    title="Header Title",
    navigation,
}){

    // Determine status bar style based on background and platform
    const getStatusBarStyle = () => {
        if (Platform.OS === 'ios') {
            // On iOS, use dark-content for light backgrounds, light-content for dark backgrounds
            return hasLightBackground ? 'dark-content' : 'light-content';
        }
        // On Android, always use light-content (white icons)
        return 'light-content';
    };

    const statusBarBgColor = hasLightBackground ? appColors.CardBackground : appColors.AppBlue;

    return(
        <View style={hasLightBackground ? styles.headerLight : styles.header}>
            { hasCustomStatusBar && <StatusBar backgroundColor={statusBarBgColor} barStyle={getStatusBarStyle()} /> }
             <TouchableOpacity 
                style={hasLightBackground ? styles.backButtonLight : styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Icon name="arrow-back" type="material" color={hasLightBackground ? appColors.grey1 : appColors.CardBackground} size={24} />
            </TouchableOpacity>
            <Text style={hasLightBackground ? styles.headerTitleLight : styles.headerTitle}>{title}</Text>
            { hasRightIcon && <TouchableOpacity 
                style={hasLightBackground ? styles.rightButtonLight : styles.rightButton}
                onPress={rightIconOnPress}
            >
                <Icon name={rightIconName} type={rightIconType} color={hasLightBackground ? appColors.grey1 : appColors.CardBackground} size={rightIconSize} />
            </TouchableOpacity> }
            { !hasRightIcon && <View style={styles.headerSpacer} /> }
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: appColors.AppBlue,
        paddingTop: parameters.headerHeightS,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: appColors.CardBackground,
        fontFamily: appFonts.headerTextBold,
    },
    headerSpacer: {
        width: 40,
    },
    rightButton: {
        padding: 8,
    },

   
    /** Header alternative styles for light background */
    headerLight: {
        backgroundColor: appColors.CardBackground,
        paddingTop: parameters.headerHeightS,
        paddingBottom: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      backButtonLight: {
        padding: 8,
      },
      headerTitleLight: {
        fontSize: 18,
        fontWeight: '700',
        color: appColors.grey1,
        fontFamily: appFonts.headerTextBold,
      },
       rightButtonLight: {
        padding: 8,
    },


})