/**
 * About App Screen
 */
import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    View, 
    Text, 
    StyleSheet, 
    Image, 
    TouchableOpacity, 
    Linking, 
    Alert, 
    Pressable, 
    ScrollView,

} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { Icon, Button, Avatar } from '@rneui/base';
import { appColors, parameters, appFonts } from '../global/Styles';
import { useToast } from 'native-base';
import { appImages } from '../global/Data';
import VersionInfo from 'react-native-version-info';
import { appLinks, appContents } from '../global/Data';
import HeaderBackButton from '../components/HeaderBackButton';
import LHGenericHeader from '../components/LHGenericHeader';


// App version
const appVersion = VersionInfo.appVersion;


// Returns a touchable opacity button that opens a url on press
const OpenURLButton = ({ url, children }) => {
    const handlePress = useCallback(async () => {
  
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url);
  
      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
  
    }, [url]);
  
    return <TouchableOpacity onPress={handlePress}>{children}</TouchableOpacity>;
};


export default function AboutAppScreen({ navigation }){

    // Toast Notifications
    const notifyWithToast = (description) => { toast.show({ description: description, }) }

    return(
        <SafeAreaView style={ styles.container }>
            <View style={{ paddingVertical:parameters.headerHeightTinier }}>
                <LHGenericHeader showLeftIcon={true} title='About' leftIconPressed={ () => { navigation.goBack(); } } />
            </View>

            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={ styles.accountImageContainer }>
                    <Image style={{ width:250, height:80, resizeMode:'contain' }} source={ appImages.logoRecBlue } />
                </View>
                <View style={ styles.rowDivider }></View>

                <View style={ styles.listRow }>
                    <View style={ styles.listRowItem }>
                        <Text style={{ fontSize:15, color:appColors.grey1, fontFamily: appFonts.bodyTextRegular }}>
                           {appContents.aboutAppText}
                        </Text>
                    </View>
                </View>

                <View style={{...styles.listRow, paddingHorizontal:20 }}>
                    <View style={ styles.socialRowItem }>
                        <OpenURLButton url={appLinks.appLinkedIn}>
                            <Icon 
                                type="material-community" 
                                name="linkedin" 
                                color={appColors.AppBlue} size={25} 
                            />
                        </OpenURLButton>
                    </View>
                    <View style={ styles.socialRowItem }>
                        <OpenURLButton url={appLinks.appFacebook} >
                            <Icon 
                                type="material-community" 
                                name="facebook" 
                                color={appColors.AppBlue} 
                                size={25} 
                            />
                        </OpenURLButton>
                    </View>
                    <View style={ styles.socialRowItem }>
                        <OpenURLButton url={appLinks.appTwitter} >
                            <Icon 
                                type="material-community" 
                                name="twitter" 
                                color={appColors.AppBlue} 
                                size={25} 
                            />
                        </OpenURLButton>
                    </View>
                    <View style={ styles.socialRowItem }>
                        <OpenURLButton url={appLinks.appInstagram} >
                            <Icon 
                                type="material-community" 
                                name="instagram" 
                                color={appColors.AppBlue} 
                                size={25} 
                            />
                        </OpenURLButton>
                    </View>
                </View>

                <OpenURLButton url={appLinks.appWebsite} >
                    <View style={ styles.listRow }>
                        <View style={ styles.listRowItem }>
                            <Icon type="material-community" name="web" color={appColors.AppBlue} size={30} />
                        </View>
                        <View style={ styles.itemTextContainer }>
                            <Text style={{ color:appColors.AppBlue, fontFamily: appFonts.bodyTextBold }}>Visit Website</Text>
                        </View>
                        <View style={ styles.listRowItem }>
                            <Icon type="material-community" name="chevron-right" color={appColors.AppBlue} size={25} />
                        </View>
                    </View>
                </OpenURLButton>

                <OpenURLButton url={appLinks.appSupportEmail} >
                    <View style={ styles.listRow }>
                        <View style={ styles.listRowItem }>
                            <Icon type="material-community" name="help-circle" color={appColors.AppBlue} size={30} />
                        </View>
                        <View style={ styles.itemTextContainer }>
                            <Text style={{ color:appColors.AppBlue, fontFamily: appFonts.bodyTextBold }}>Contact Support</Text>
                        </View>
                        <View style={ styles.listRowItem }>
                            <Icon type="material-community" name="chevron-right" color={appColors.AppBlue} size={25} />
                        </View>
                    </View>
                </OpenURLButton>

                <OpenURLButton url={appLinks.appGooglePlayURL} >
                    <View style={ styles.listRow }>
                        <View style={ styles.listRowItem }>
                            <Icon type="material-community" name="update" color={appColors.AppBlue} size={30} />
                        </View>
                        <View style={ styles.itemTextContainer }>
                            <Text style={{ color:appColors.AppBlue, fontFamily: appFonts.bodyTextBold }}>Check Updates</Text>
                        </View>
                        <View style={ styles.listRowItem }>
                            <Icon type="material-community" name="chevron-right" color={appColors.AppBlue} size={25} />
                        </View>
                    </View>
                </OpenURLButton>

                <View style={ styles.versionRow }>
                    <View style={styles.versionRowItem}>
                        <Text style={{ fontSize:16, color:appColors.grey1, fontFamily: appFonts.bodyTextRegular }}> Version: {appVersion}</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

// local stylesheet
const styles = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor: appColors.CardBackground,
    },

    scrollView: {
        flex: 1,
        // backgroundColor: appColors.CardBackground,
    },

    listRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
    },
    listRowItem: {
        padding: 8,
        // backgroundColor: appColors.DoffeeYellow
    },
    versionRow: {
        flexDirection: 'row',
        paddingVertical: 25,
        paddingHorizontal: 10,
        //backgroundColor: 'yellow',
    },
    socialRowItem: { 
        padding: 5,
        backgroundColor:appColors.grey5,  
        borderRadius: 50,
    },
    versionRowItem: { 
        padding: 10,
        //backgroundColor:colors.grey5,  
        flex:1,
        justifyContent:"center",
        alignItems:"center",
    },
    itemTextContainer: {
        flex:1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        justifyContent:"center",
    },
    accountImageContainer: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        
    },
    rowDivider: {
        backgroundColor:appColors.grey7, 
        paddingVertical:5,
    },
    profileAvatarContainer: {
        flex:1,
        width:100, 
        height:100, 
        borderRadius:80, 
        backgroundColor:appColors.grey7,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileImageAvatar: {
        width:100, 
        height:100, 
        resizeMode:"cover", 
        borderRadius:60,
    },

});