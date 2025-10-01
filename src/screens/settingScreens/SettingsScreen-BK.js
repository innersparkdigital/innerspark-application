/**
 * App - SettingsScreen
 */
import React, { useState, useEffect, useCallback }  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from 'native-base';
import { 
  StatusBar,
  SafeAreaView,
  ScrollView,
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Linking, 
  Alert, 
  Pressable,
  ImageBackground,

} from 'react-native';
import { Icon, Button, Avatar, BottomSheet } from '@rneui/base';
import { appImages, appLinks } from '../../global/Data';
import { appColors, parameters, appFonts } from '../../global/Styles';
import LHGenericHeader from '../../components/LHGenericHeader';


// Returns a touchable opacity button that opens a url on press
const OpenURLButton = ({ url, title }) => {
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
  
    return (
        <Button 
            title={title} 
            buttonStyle={ parameters.doffeeButtonXL }
            titleStyle={ parameters.doffeeButtonXLTitle } 
            onPress={handlePress}  
    />);
    
  };



export default function SettingsScreen({ navigation }){
    
    // display the profile image if user has an image avatar
    const dispatch = useDispatch();
    const userToken = useSelector(state => state.user.userToken); // User token data (userId, email, name, phone)
    const sessionUserData = useSelector(state => state.appSession.sessionUserData); // flexible user session data
    const toast = useToast();
    const userAvatarURI = useSelector(state => state.user.userAvatar); // user avatar object { image: uri}

    // Toast Notifications
    const notifyWithToast = (description) => { toast.show({ description: description, }) }


    return(
      <SafeAreaView style={{ flex:1}}>
        <View style={ styles.container }>
            <ImageBackground source={appImages.laundryBg} style={{ flex: 1, }}>
                <View style={{ paddingVertical:parameters.headerHeightTiny }}>
                    <LHGenericHeader
                        title='Settings' 
                        showLeftIcon={true}
                        leftIconPressed={ () => { navigation.goBack(); } } 
                    />
                </View>

                <ScrollView style={styles.scrollView}>

                    <TouchableOpacity>
                        <View style={ styles.listRow }>
                            <View style={ styles.listRowItem }>
                                <Icon type="material-community" name="account-circle-outline" color={appColors.AppBlue} size={25} />
                            </View>
                            <View style={ styles.itemTextContainer }>
                                <Text style={{ color:appColors.AppBlue, fontFamily: appFonts.headerTextBold }}>Account</Text>
                            </View>
                            <View style={ styles.listRowItem }>
                                <Icon type="material-community" name="chevron-down" color={appColors.AppBlue} size={25} />
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <View style={ styles.listRow }>
                            <View style={ styles.listRowItem }>
                                <Icon type="material-icons" name="lock" color={appColors.AppBlue} size={25} />
                            </View>
                            <View style={ styles.itemTextContainer }>
                                <Text style={{ color:appColors.AppBlue, fontFamily: appFonts.headerTextBold }}>Change Password</Text>
                            </View>
                            <View style={ styles.listRowItem }>
                                <Icon type="material-community" name="chevron-down" color={appColors.AppBlue} size={25}  />
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <View style={ styles.listRow }>
                            <View style={ styles.listRowItem }>
                                <Icon type="material-icons" name="settings" color={appColors.AppBlue} size={25} />
                            </View>
                            <View style={ styles.itemTextContainer }>
                                <Text style={{ color:appColors.AppBlue, fontFamily: appFonts.headerTextBold }}>Notifications</Text>
                            </View>
                            <View style={ styles.listRowItem }>
                                <Icon type="material-community" name="chevron-down" color={appColors.AppBlue} size={25}  />
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <View style={ styles.listRow }>
                            <View style={ styles.listRowItem }>
                                <Icon type="material-icons" name="language" color={appColors.AppBlue} size={25} />
                            </View>
                            <View style={ styles.itemTextContainer }>
                                <Text style={{ color:appColors.AppBlue, fontFamily: appFonts.headerTextBold }}>Languages</Text>
                            </View>
                            <View style={ styles.listRowItem }>
                                <Icon type="material-community" name="chevron-down" color={appColors.AppBlue} size={25}  />
                            </View>
                        </View>
                    </TouchableOpacity>

                </ScrollView>
            </ImageBackground>
        </View>
      </SafeAreaView>
    )
}

// local stylesheet
const styles = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor: appColors.grey7,
    },

    scrollView: {
        flex: 1,
        backgroundColor: appColors.CardBackground,
    },

    listRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
    },

    listRowLast: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        //borderBottomWidth: 0.5,
        //borderBottomColor: '#ccc',
    },

    listRowItem: {
        padding: 8,
    },
    itemTextContainer: {
        flex:1,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    accountImageContainer: {
        paddingVertical: 30,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    rowDivider: {
        backgroundColor:appColors.grey7, 
        paddingVertical:5
    },
    profileAvatarContainer: {
        width:95, 
        height:95, 
        borderRadius:80, 
        backgroundColor:appColors.AppBlueFade,
        //flex:1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileImageAvatar: {
        width:100, 
        height:100, 
        resizeMode:"cover", 
        borderRadius:60
    },
    profileAvatarUserName: {
        marginVertical:8, 
        fontSize:18, 
        fontWeight:'700',
        color: appColors.AppBlue,
    },


});