/**
 * Account Screen - User account management and settings
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
import { getFirstName } from '../global/LHShortcuts';

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
            buttonStyle={ parameters.appButtonXL }
            titleStyle={ parameters.appButtonXLTitle } 
            onPress={handlePress}  
    />);
};

export default function AccountScreen({ navigation }){
    
    const toast = useToast(); // Toast notifications helper
    const dispatch = useDispatch();
    const userToken = useSelector(state => state.user.userToken); // User token data (userId, email, name, phone)
    const userDetails = useSelector(state => state.userData.userDetails); // User details from redux store
    
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

    // Toast Notifications
    const notifyWithToast = (description) => {
        toast.show({
            description: description,
            duration: 2000,
        })
    }

    /** Signout current user */  
    const signOutHandler = () => {
        dispatch(signout());

        // remove local storage session as well if there's one
        if (retrieveItemLS("userToken")) { removeItemLS("userToken"); }

        // Remove all stored data if available
        //if (retrieveItemLS("userDetailsLS")) { removeItemLS("userDetailsLS"); } 
        //if (retrieveItemLS("userAvatarLS")) { removeItemLS("userAvatarLS"); } 
    }

    const MenuRow = ({ icon, iconType = "material", title, onPress, showChevron = true, isLast = false, iconColor = appColors.AppBlue }) => (
        <TouchableOpacity onPress={onPress}>
            <View style={isLast ? styles.listRowLast : styles.listRow}>
                <View style={styles.listRowItem}>
                    <Icon type={iconType} name={icon} color={iconColor} size={25} />
                </View>
                <View style={styles.itemTextContainer}>
                    <Text style={styles.menuText}>{title}</Text>
                </View>
                {showChevron && (
                    <View style={styles.listRowItem}>
                        <Icon type="material" name="chevron-right" color={appColors.AppBlue} size={25} />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    return(
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={appColors.StatusBarColor} barStyle="light-content" />
        
        <LHGenericHeader
            title='Account' 
            subtitle='Manage your profile and settings'
            navigation={navigation}
        />
             
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Profile Header */}
            <View style={styles.accountImageContainer}>
                <View style={styles.profileAvatarContainer}>
                    <Avatar 
                        rounded 
                        avatarStyle={{ width: 90, height: 90 }} 
                        size={90} 
                        source={userDetails?.image || appImages.avatarDefault} 
                    />
                </View>
                <Text style={styles.profileAvatarUserName}>
                    {userDetails?.firstName || 'User'}
                </Text>
                <Text style={styles.profileEmail}>
                    {userDetails?.email || 'user@example.com'}
                </Text>
            </View>

            {/* Account Management Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account</Text>
                
                <MenuRow
                    icon="person-outline"
                    title="Personal Information"
                    onPress={() => navigation.navigate("ProfileInfoScreen")}
                />
                
                <MenuRow
                    icon="security"
                    title="Privacy & Security"
                    onPress={() => notifyWithToast('Privacy settings coming soon!')}
                />
                
                <MenuRow
                    icon="notifications-outline"
                    title="Notifications"
                    onPress={() => notifyWithToast('Notification settings coming soon!')}
                />
                
                <MenuRow
                    icon="payment"
                    title="Payment Methods"
                    onPress={() => navigation.navigate("PaymentOptionsScreen")}
                />
            </View>

            {/* Mental Health Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mental Health</Text>
                
                <MenuRow
                    icon="mood"
                    title="Mood History"
                    onPress={() => navigation.navigate("MoodScreen")}
                />
                
                <MenuRow
                    icon="people"
                    title="My Therapists"
                    onPress={() => navigation.navigate("TherapistsScreen")}
                />
                
                <MenuRow
                    icon="event"
                    title="Appointments"
                    onPress={() => navigation.navigate("BookingsScreen")}
                />
                
                <MenuRow
                    icon="emergency"
                    title="Emergency Contacts"
                    onPress={() => navigation.navigate("EmergencyScreen")}
                />
            </View>

            {/* App Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>App</Text>
                
                <MenuRow
                    icon="settings"
                    title="Settings"
                    onPress={() => navigation.navigate("SettingsScreen")}
                />
                
                <MenuRow
                    icon="help-outline"
                    title="Help & Support"
                    onPress={() => notifyWithToast('Help center coming soon!')}
                />
                
                <MenuRow
                    icon="info-outline"
                    title="About App"
                    onPress={() => navigation.navigate("AboutAppScreen")}
                />
                
                <MenuRow
                    icon="privacy-tip"
                    title="Privacy Policy"
                    onPress={() => navigation.navigate("PrivacyPolicyScreen")}
                />
                
                <MenuRow
                    icon="description"
                    title="Terms of Service"
                    onPress={() => navigation.navigate("TermsOfServiceScreen")}
                />
            </View>

            {/* Logout Section */}
            <View style={styles.section}>
                <MenuRow
                    icon="logout"
                    title="Log Out"
                    onPress={() => setIsLogoutModalVisible(true)}
                    showChevron={false}
                    isLast={true}
                    iconColor="#F44336"
                />
            </View>

            <View style={styles.bottomSpacing} />
        </ScrollView>

        {/** Logout BottomSheet Modal */}
        <BottomSheet
            containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.5)' }}
            modalProps = {{ presentationStyle:"overFullScreen", visible: isLogoutModalVisible, }}
            onBackdropPress={ () => { setIsLogoutModalVisible(false); } }
        >
            <View style={ parameters.doffeeModalContainer }>
                <View style={{ flex:1, justifyContent:"center", alignItems:"center", paddingVertical:20, }}>
                    <Icon 
                        type="material"
                        name="logout"
                        color={appColors.AppBlue}
                        size={50}
                    />
                    <Text 
                        style={{ 
                            fontSize:18, 
                            paddingVertical:15, 
                            color:appColors.AppBlue, 
                            textAlign:"center",
                            fontFamily: appFonts.appTextBold,
                        }}
                    > 
                        Are you sure you want to log out?
                    </Text>
                    <Text 
                        style={{ 
                            fontSize:14, 
                            color:appColors.AppGray, 
                            textAlign:"center",
                            fontFamily: appFonts.appTextRegular,
                            paddingHorizontal: 20,
                        }}
                    > 
                        You'll need to sign in again to access your account.
                    </Text>
                </View>
                <View style={{ paddingVertical:5 }}></View>
                <View style={{ flexDirection:'row' }}>
                    <View style={{ flex:1, paddingHorizontal:10 }}>
                        <Button 
                            title="Cancel" 
                            buttonStyle={ [parameters.appButtonXL, { backgroundColor: appColors.AppLightGray }] }
                            titleStyle={ [parameters.appButtonXLTitle, { color: appColors.AppBlue }] }
                            onPress={() => setIsLogoutModalVisible(false)}
                        />
                    </View>
                    <View style={{ flex:1, paddingHorizontal:10 }}>
                        <Button 
                            title="Log Out" 
                            buttonStyle={ [parameters.appButtonXL, { backgroundColor: '#F44336' }] }
                            titleStyle={ parameters.appButtonXLTitle }
                            onPress={() => {
                                signOutHandler();
                                setIsLogoutModalVisible(false);
                            }}
                        />
                    </View>
                </View>
                <View style={{ paddingVertical:25 }}></View>
            </View>
        </BottomSheet>
        {/* -- Logout BottomSheet Modal ends */}

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
        backgroundColor: appColors.CardBackground,
    },

    accountImageContainer: {
        paddingVertical: 30,
        paddingHorizontal: 20,
        alignItems: 'center',
        backgroundColor: appColors.CardBackground,
        borderBottomWidth: 1,
        borderBottomColor: appColors.AppLightGray,
    },

    profileAvatarContainer: {
        width: 100, 
        height: 100, 
        borderRadius: 50, 
        backgroundColor: appColors.AppLightBlue,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },

    profileAvatarUserName: {
        fontSize: 22, 
        color: appColors.AppBlue,
        fontFamily: appFonts.appTextBold,
        marginBottom: 5,
    },

    profileEmail: {
        fontSize: 16, 
        color: appColors.AppGray,
        fontFamily: appFonts.appTextRegular,
    },

    section: {
        marginTop: 20,
        backgroundColor: appColors.CardBackground,
        borderRadius: 15,
        marginHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: appColors.AppBlue,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        fontFamily: appFonts.appTextBold,
    },

    listRow: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderBottomColor: appColors.AppLightGray,
    },

    listRowLast: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },

    listRowItem: {
        padding: 5,
    },

    itemTextContainer: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 5,
    },

    menuText: {
        fontSize: 16,
        color: appColors.AppBlue,
        fontFamily: appFonts.appTextMedium,
    },

    bottomSpacing: {
        height: 40,
    },
});
