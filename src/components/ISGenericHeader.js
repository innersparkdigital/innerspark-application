/**
 * Innerspark Generic Header
 */
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native';
import { Icon } from '@rneui/base';
import { appColors, appFonts, parameters } from '../global/Styles';

export default function ISGenericHeader({
    hasCustomStatusBar=true,
    hasLightBackground=false,
    title="Header Title",
    navigation,
}){

    return(
        <View style={hasLightBackground ? styles.headerLight : styles.header}>
            { hasCustomStatusBar && <StatusBar backgroundColor={appColors.AppBlue} barStyle='light-content' /> }
             <TouchableOpacity 
                style={hasLightBackground ? styles.backButtonLight : styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Icon name="arrow-back" type="material" color={hasLightBackground ? appColors.grey1 : appColors.CardBackground} size={24} />
            </TouchableOpacity>
            <Text style={hasLightBackground ? styles.headerTitleLight : styles.headerTitle}>{title}</Text>
            <View style={hasLightBackground ? styles.placeholderLight : styles.headerSpacer} />
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
        fontSize: 20,
        fontWeight: 'bold',
        color: appColors.CardBackground,
        fontFamily: appFonts.headerTextBold,
    },
    headerSpacer: {
        width: 40,
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
        fontWeight: 'bold',
        color: appColors.grey1,
        fontFamily: appFonts.headerTextBold,
      },
      placeholderLight: {
        width: 40,
      },


})