/**
 * Profile Screen
 */
import React, { useState, useRef, useEffect, useCallback }  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signout } from '../features/user/userSlice';
import { appColors, parameters, appFonts } from '../global/Styles';
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
import { appImages, appLinks } from '../global/Data';
import LHGenericHeader from '../components/LHGenericHeader';
import { storeItemLS, removeItemLS, retrieveItemLS } from '../global/StorageActions';


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


export default function ProfileScreen({ navigation }){
    
    const toast = useToast(); // Toast notifications helper
    // display the profile image if user has an image avatar
    const dispatch = useDispatch();
    const userToken = useSelector(state => state.user.userToken); // User token data (userId, email, name, phone)
    const userDetails = useSelector(state => state.userData.userDetails); // User details from redux store
    // const userAvatar = useSelector(state => state.userData.userDetails.image); // User avatar from redux store
    // const sessionUserData = useSelector(state => state.appSession.sessionUserData); // flexible user session data
   
    // const userAvatarURI = useSelector(state => state.user.userAvatar); // user avatar object { image: uri}
    // const [userAvatar, setUserAvatar] = useState(userAvatarURI);
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

    // Toast Notifications
    const notifyWithToast = (description) => {
        toast.show({
            description: description,
        })
    }


    /** Yo Signout current user */  
    const signOutHandler = () => {
        dispatch(signout());

        // remove local storage session as well if there's one
        if (retrieveItemLS("userToken")) { removeItemLS("userToken"); }

        // Remove all stored data if available
        //if (retrieveItemLS("userDetailsLS")) { removeItemLS("userDetailsLS"); } 
        //if (retrieveItemLS("userAvatarLS")) { removeItemLS("userAvatarLS"); } 
    }

    

    return(
      <SafeAreaView style={{ flex:1}}>
        <View style={ styles.container }>
            <ImageBackground source={appImages.laundryBg} style={{ flex: 1, }}>
                <View style={{ paddingVertical:parameters.headerHeightTinier }}>
                    <LHGenericHeader
                        title='Profile' 
                        showLeftIcon={true}
                        leftIconPressed={ () => { navigation.goBack(); } } 
                    />
                </View>
             
                <ScrollView style={styles.scrollView}>
                    <View style={ styles.accountImageContainer }>
                        <View style={ styles.profileAvatarContainer }>
                            <Avatar rounded avatarStyle={{ width:90, height:90 }} size={90} source={appImages.avatarDefault} />
                        </View>
                        <Text style={ styles.profileAvatarUserName }>John</Text>
                    </View>
        
                    <TouchableOpacity onPress={ () => { navigation.navigate("ProfileInfoScreen"); } }>
                        <View style={ styles.listRow }>
                            <View style={ styles.listRowItem }>
                                <Icon type="material-community" name="account-circle-outline" color={appColors.AppBlue} size={25} />
                            </View>
                            <View style={ styles.itemTextContainer }>
                                <Text style={{ color:appColors.AppBlue, fontFamily: appFonts.bodyTextBold }}>Profile</Text>
                            </View>
                            <View style={ styles.listRowItem }>
                                <Icon type="material-community" name="chevron-right" color={appColors.AppBlue} size={25} />
                            </View>
                        </View>
                    </TouchableOpacity>

                  

                    {/* Test Screen container */}
                    <TouchableOpacity onPress={ () => { navigation.navigate("TestScreen")} } >
                        <View style={ styles.listRow }>
                            <View style={ styles.listRowItem }>
                                <Icon type="material-community" name="cog" color={appColors.black} size={25} />
                            </View>
                            <View style={ styles.itemTextContainer }>
                                <Text style={{ fontWeight:"bold", color:appColors.black }}>Test Screen</Text>
                            </View>
                            <View style={ styles.listRowItem }>
                                <Icon type="material-community" name="chevron-right" color={appColors.grey3} size={25} />
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={ () => {  navigation.navigate("BookingsScreen"); } } >
                        <View style={ styles.listRow }>
                            <View style={ styles.listRowItem }>
                                <Icon type="font-awesome" name="calendar" color={appColors.AppBlue} size={25} />
                            </View>
                            <View style={ styles.itemTextContainer }>
                                <Text style={{ fontFamily: appFonts.bodyTextBold, color:appColors.AppBlue }}>Bookings</Text>
                            </View>
                            <View style={ styles.listRowItem }>
                                <Icon type="material-community" name="chevron-right" color={appColors.AppBlue} size={25} />
                            </View>
                        </View>
                    </TouchableOpacity>

    

                    {/* About App */}
                    <TouchableOpacity onPress={ () => { navigation.navigate("AboutAppScreen")} }>
                        <View style={ styles.listRow }>
                            <View style={ styles.listRowItem }>
                                <Icon type="material-icons" name="info-outline" color={appColors.AppBlue} size={25} />
                            </View>
                            <View style={ styles.itemTextContainer }>
                                <Text style={{ fontFamily: appFonts.bodyTextBold, color:appColors.AppBlue }}>About App</Text>
                            </View>
                            <View style={ styles.listRowItem }>
                                <Icon type="material-community" name="chevron-right" color={appColors.AppBlue} size={25} />
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={ () => setIsLogoutModalVisible(true) }>
                        <View style={ styles.listRowLast }>
                            <View style={ styles.listRowItem }>
                                <Icon type="material-community" name="power" color={appColors.AppBlue} size={25} />
                            </View>
                            <View style={ styles.itemTextContainer }>
                                <Text style={{ fontFamily: appFonts.bodyTextBold, color:appColors.AppBlue }}>Log Out</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                </ScrollView>


                {/** Logout BottomSheet Modal */}
                <BottomSheet
                    containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.5)' }}
                    modalProps = {{ presentationStyle:"overFullScreen", visible: isLogoutModalVisible, }}
                    onBackdropPress={ () => { setIsLogoutModalVisible(false); } }
                >
                    <View style={ parameters.doffeeModalContainer }>
                        <View style={{ flex:1, justifyContent:"center", alignItems:"center", paddingVertical:20, }}>
                            {/* <Image source={appImages.logoRound} style={{ width:50, height:50, resizeMode:"contain" }} /> */}
                            <Icon 
                                type="material-community"
                                name="logout"
                                color={appColors.AppBlue}
                                size={50}
                            />
                            <Text 
                                style={{ 
                                    fontSize:16, 
                                    // fontWeight:"700", 
                                    paddingVertical:15, 
                                    color:appColors.AppBlue, 
                                    textAlign:"center",
                                    fontFamily: appFonts.bodyTextBold,
                                }}
                            > 
                                Are you sure you want to log out?
                            </Text>
                        </View>
                        <View style={{ paddingVertical:5 }}></View>
                        <View style={{ flexDirection:'row' }}>
                            <View style={{ flex:1, paddingHorizontal:10 }}>
                                <Button 
                                    title="CONFIRM" 
                                    buttonStyle={ parameters.appButtonXLBlue }
                                    titleStyle={ parameters.appButtonXLTitle }
                                    onPress={
                                        () => {
                                            // signUserOut();
                                            signOutHandler();
                                        }
                                    }
                                />
                            </View>
                        </View>
                        <View style={{ paddingVertical:25 }}></View>
                    </View>
                </BottomSheet>
                {/* -- Logout BottomSheet Modal ends */}

            </ImageBackground>
        </View>
    </SafeAreaView>
    )
}

// local stylesheet
const styles = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor: '#fff',
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
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    rowDivider: {
        backgroundColor:appColors.grey7, 
        paddingVertical:5,
    },
    profileAvatarContainer: {
        width:95, 
        height:95, 
        borderRadius:80, 
        backgroundColor:appColors.AppBlueFade,
        //flex:1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileImageAvatar: {
        width:100, 
        height:100, 
        resizeMode:"cover", 
        borderRadius:60,
    },
    profileAvatarUserName: {
        marginVertical:8, 
        fontSize:18, 
        // fontWeight:'700',
        color: appColors.AppBlue,
        fontFamily: appFonts.headerTextBold,
    },


});