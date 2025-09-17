import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, Pressable } from 'react-native';
import { Icon } from '@rneui/base';
import { appColors, parameters } from '../global/Styles';
import { appImages } from '../global/Data';

export default function YoHomeHeader({
    leftIconPressed,
    rightIconPressed,
    leftIconName,
    leftIconType,
    rightIconName,
    rightIconType,
    hasCustomStatusBar=true,
    hasNoRightIcon=false,
    hasNoLeftIcon=true,
    hasFilterIcon=true,
    hasEditProfileIcon=false,
    hasSettingsIcon=false,

}){


    return(

        <View style={styles.header}>

            { hasCustomStatusBar && 
            <StatusBar backgroundColor={appColors.YoPink} /> }
          
            {/* <View style={{...styles.headerIconsLR, marginLeft:15}}>
                <Icon 
                    type={ leftIconType ? leftIconType : "material-community" }
                    name={leftIconName ? leftIconName : "account-circle-outline"}
                    color={colors.CardBackground}
                    size={32}
                    onPress={ leftIconPressed }
               />
            </View> */}

            { hasSettingsIcon &&  
                <View style={{...styles.headerIconsLR, marginLeft:15}}>
                    <Icon 
                        type={ leftIconType ? leftIconType : "material-community" }
                        name={ leftIconName ? leftIconName : "account-circle-outline"}
                        color={colors.CardBackground}
                        size={32}
                        onPress={ leftIconPressed }
                />
                </View>
            }

            {
                hasNoLeftIcon && 
                <View style={{...styles.headerIconsLR, marginLeft:15}}>
                     <View style={{ width:32 }}></View>
                </View>
            }
           

            <View style={styles.headerLogo}>
                <Image 
                    source={appImages.logoRecBlue} 
                    style={styles.headerLogoImage}
                />
            </View>

            {/* <View style={{ ...styles.headerIconsLR, marginRight:15 }}>
                <Icon 
                    type={ rightIconType ? rightIconType : "material-community" }
                    name={ rightIconName ? rightIconName : "dots-vertical" }
                    size={32}
                    color={colors.CardBackground}
                    onPress={ rightIconPressed }
                />
            </View> */}

            { hasNoRightIcon && 
               <View style={{...styles.headerIconsLR, marginRight:15}}>
                <View style={{ width:32 }}></View>
              </View>
            }

            { hasEditProfileIcon && 
                <View style={{ ...styles.headerIconsLR, marginRight:15 }}>
                    <Icon 
                        type={ rightIconType ? rightIconType : "material-community" }
                        name={ rightIconName ? rightIconName : "dots-vertical" }
                        size={25}
                        color={colors.CardBackground}
                        onPress={ rightIconPressed }
                    />
                </View>
            }

        </View>
        
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection:'row',
        backgroundColor:appColors.YoPink,
        height:parameters.headerHeightL,
        justifyContent:'space-between',
    },

    headerLogo: {
        alignItems:"center", 
        justifyContent:"center", 
        flex:1,
        // marginBottom:3
        
    },

    headerLogoImage: {
        width:120, 
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