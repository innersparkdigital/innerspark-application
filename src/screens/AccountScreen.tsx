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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button, Avatar, BottomSheet } from '@rneui/base';
import { appImages, appLinks } from '../global/Data';
import LHGenericHeader from '../components/LHGenericHeader';
import { storeItemLS, removeItemLS, retrieveItemLS } from '../global/StorageActions';
import { getFullname } from '../global/LHShortcuts';

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
        <StatusBar backgroundColor={appColors.AppBlue} barStyle="light-content" translucent={false} animated={true} />
        
        {/* Curved Header with Profile */}
        <View style={styles.curvedHeader}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Avatar 
                rounded 
                size={80} 
                source={userDetails?.image || appImages.avatarDefault}
                containerStyle={styles.avatarStyle}
                avatarStyle={styles.avatarImageStyle}
              />
            </View>
            <Text style={styles.userName}>
              {getFullname(userDetails?.firstName, userDetails?.lastName) || 'Jane Doe'}
            </Text>
            <Text style={styles.userEmail}>
              {userDetails?.email || 'user@example.com'}
            </Text>
          </View>
        </View>
             
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            
            {/* Wellness Shortcuts */}
            <View style={styles.shortcutsSection}>
              <View style={styles.shortcutsGrid}>
                <TouchableOpacity 
                  style={styles.shortcutCard}
                  onPress={() => notifyWithToast('Goals feature coming soon!')}
                >
                  <Icon name="flag" type="material" color="#333" size={24} />
                  <Text style={styles.shortcutText}>Goals</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.shortcutCard}
                  onPress={() => navigation.navigate('AppointmentsScreen')}
                >
                  <Icon name="event" type="material" color="#333" size={24} />
                  <Text style={styles.shortcutText}>Appointments</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.shortcutCard}
                  onPress={() => navigation.navigate('WellnessVaultScreen')}
                >
                  <Icon name="health-and-safety" type="material" color="#333" size={24} />
                  <Text style={styles.shortcutText}>WellnessVault</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Menu Section */}
            <View style={styles.menuSection}>
                <MenuRow
                    icon="person"
                    title="Profile"
                    onPress={() => notifyWithToast('Profile feature coming soon!')}
                />
                
                <MenuRow
                    icon="settings"
                    title="Settings"
                    onPress={() => notifyWithToast('Settings feature coming soon!')}
                />
                
                <MenuRow
                    icon="assessment"
                    title="My Weekly Report"
                    onPress={() => navigation.navigate('WeeklyReportScreen')}
                />
                
                <MenuRow
                    icon="help"
                    title="Help Center"
                    onPress={() => navigation.navigate('HelpCenterScreen')}
                />
                
                <MenuRow
                    icon="info"
                    title="About App"
                    onPress={() => navigation.navigate('AboutAppScreen')}
                />
                
                {/* <MenuRow
                    icon="logout"
                    title="Logout"
                    onPress={() => setIsLogoutModalVisible(true)}
                    isLast={true}
                    iconColor="#F44336"
                /> */}
            
            </View>

            {/* Mental Health Section */}
            {/* <View style={styles.section}>
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
            </View> */}




            {/* App Section */}
            {/* <View style={styles.section}>
                <Text style={styles.sectionTitle}>App</Text>
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
            </View> */}

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
        backgroundColor: appColors.AppLightGray,
    },
    curvedHeader: {
        backgroundColor: appColors.AppBlue,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingBottom: 30,
        paddingTop: 20,
    },
    profileSection: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    avatarContainer: {
        marginBottom: 15,
        alignItems: 'center',
        backgroundColor: appColors.AppBlue,
    },
    avatarStyle: {
        borderWidth: 2,
        borderColor: appColors.CardBackground,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarImageStyle: {
        width: 76,
        height: 76,
        borderRadius: 40,
        resizeMode: 'cover',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: appColors.CardBackground,
        marginBottom: 8,
        fontFamily: appFonts.appTextBold,
    },
    userEmail: {
        fontSize: 16,
        color: appColors.CardBackground,
        opacity: 0.9,
        fontFamily: appFonts.appTextRegular,
    },
    scrollView: {
        flex: 1,
        backgroundColor: appColors.AppLightGray,
        paddingTop: 20,
    },
    shortcutsSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    shortcutsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    shortcutCard: {
        width: '30%',
        backgroundColor: appColors.CardBackground,
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 10,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        marginBottom: 10,
        minHeight: 90,
        justifyContent: 'center',
    },
    shortcutText: {
        fontSize: 11,
        color: '#333',
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 6,
        fontFamily: appFonts.appTextMedium,
        lineHeight: 14,
    },
    menuSection: {
        backgroundColor: appColors.CardBackground,
        marginHorizontal: 20,
        borderRadius: 20,
        paddingVertical: 5,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        marginBottom: 20,
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
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal: 20,
        paddingVertical: 18,
        borderBottomWidth: 0.5,
        borderBottomColor: appColors.AppLightGray,
    },
    listRowLast: {
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal: 20,
        paddingVertical: 18,
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
        color: '#333',
        fontWeight: '500',
        fontFamily: appFonts.appTextMedium,
    },

    bottomSpacing: {
        height: 40,
    },
});
