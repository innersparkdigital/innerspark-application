import React from 'react';
import { View, StyleSheet, Image, StatusBar } from 'react-native';
import { appColors } from '../global/Styles';
import { appImages } from '../global/Data';

export default function LHSplashScreen(){
    return(
        <View style={ styles.container }>
            <StatusBar backgroundColor={appColors.CardBackground} />
            <View style={ styles.imageContainer }>
                <Image source={ appImages.logoRound } style={styles.imageStyle} />
            </View>
        </View>
    )
}

// local stylesheet for the screen
const styles = StyleSheet.create({
    container : {
       flex: 1,
       alignItems: 'center',
       justifyContent: 'center',
       backgroundColor: appColors.CardBackground,
    },

    imageContainer: {
        alignItems:"center", 
        justifyContent:"center", 
    },

    imageStyle: {
        width:220, 
        // height:35,
        resizeMode:"contain"
    },


});