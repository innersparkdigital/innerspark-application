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
import ISStatusBar from '../components/ISStatusBar';

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

    const MenuRow = ({ icon, iconType = "material", title, subtitle, onPress, showChevron = true, isLast = false, iconColor = appColors.AppBlue }) => (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <View style={isLast ? styles.listRowLast : styles.listRow}>
                <View style={[styles.iconCircle, { backgroundColor: iconColor + '15' }]}>
                    <Icon type={iconType} name={icon} color={iconColor} size={22} />
                </View>
                <View style={styles.itemTextContainer}>
                    <Text style={styles.menuText}>{title}</Text>
                    {subtitle && <Text style={styles.menuSubtext}>{subtitle}</Text>}
                </View>
                {showChevron && (
                    <Icon type="material" name="chevron-right" color={appColors.grey4} size={22} />
                )}
            </View>
        </TouchableOpacity>
    );

    return(
      <SafeAreaView style={styles.container}>
        <ISStatusBar />
        
        {/* Curved Header with Profile */}
        <View style={styles.curvedHeader}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Avatar 
                rounded 
                size={90} 
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
            <View style={styles.memberBadge}>
              <Icon name="verified" type="material" color="#4CAF50" size={14} />
              <Text style={styles.memberText}>Verified Member</Text>
            </View>
          </View>
        </View>
             
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            
            {/* Wellness Shortcuts */}
            <View style={styles.shortcutsSection}>
              <Text style={styles.shortcutsTitle}>Quick Actions</Text>
              <View style={styles.shortcutsGrid}>
                <TouchableOpacity 
                  style={styles.shortcutCard}
                  onPress={() => navigation.navigate('GoalsScreen')}
                  activeOpacity={0.8}
                >
                  <View style={[styles.shortcutIconContainer, { backgroundColor: '#FFC107' + '15' }]}>
                    <Icon name="flag" type="material" color="#FFC107" size={26} />
                  </View>
                  <Text style={styles.shortcutText}>Goals</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.shortcutCard}
                  onPress={() => navigation.navigate('AppointmentsScreen')}
                  activeOpacity={0.8}
                >
                  <View style={[styles.shortcutIconContainer, { backgroundColor: '#2196F3' + '15' }]}>
                    <Icon name="event" type="material" color="#2196F3" size={26} />
                  </View>
                  <Text style={styles.shortcutText}>Appointments</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.shortcutCard}
                  onPress={() => navigation.navigate('WellnessVaultScreen')}
                  activeOpacity={0.8}
                >
                  <View style={[styles.shortcutIconContainer, { backgroundColor: '#4CAF50' + '15' }]}>
                    <Icon name="health-and-safety" type="material" color="#4CAF50" size={26} />
                  </View>
                  <Text style={styles.shortcutText}>Wellness Vault</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Menu Section */}
            <View style={styles.menuSection}>
                <Text style={styles.menuSectionTitle}>Account</Text>
                <MenuRow
                    icon="person"
                    title="Profile"
                    subtitle="Manage your personal information"
                    onPress={() => navigation.navigate('ProfileScreen')}
                    iconColor={appColors.AppBlue}
                />
                
                <MenuRow
                    icon="settings"
                    title="Settings"
                    subtitle="App preferences and configuration"
                    onPress={() => navigation.navigate('SettingsScreen')}
                    iconColor="#9C27B0"
                />
                
                <MenuRow
                    icon="assessment"
                    title="My Weekly Report"
                    subtitle="View your wellness progress"
                    onPress={() => navigation.navigate('WeeklyReportScreen')}
                    iconColor="#FF5722"
                />
            </View>

            {/* Support Section */}
            <View style={styles.menuSection}>
                <Text style={styles.menuSectionTitle}>Support</Text>
                <MenuRow
                    icon="help"
                    title="Help Center"
                    subtitle="Get help and support"
                    onPress={() => navigation.navigate('HelpCenterScreen')}
                    iconColor="#00BCD4"
                />
                
                <MenuRow
                    icon="info"
                    title="About App"
                    subtitle="Version, terms, and privacy"
                    onPress={() => navigation.navigate('AboutAppScreen')}
                    iconColor="#607D8B"
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
            <View style={styles.logoutSection}>
                <TouchableOpacity 
                    style={styles.logoutButton}
                    onPress={() => setIsLogoutModalVisible(true)}
                    activeOpacity={0.8}
                >
                    <View style={styles.logoutIconContainer}>
                        <Icon name="logout" type="material" color="#F44336" size={22} />
                    </View>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
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
        width: 86,
        height: 86,
        borderRadius: 45,
        resizeMode: 'cover',
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: appColors.AppBlue,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: appColors.CardBackground,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: appColors.CardBackground,
        marginBottom: 4,
        fontFamily: appFonts.headerTextBold,
    },
    userEmail: {
        fontSize: 15,
        color: appColors.CardBackground,
        opacity: 0.9,
        fontFamily: appFonts.headerTextRegular,
        marginBottom: 8,
    },
    memberBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 4,
    },
    memberText: {
        fontSize: 13,
        color: appColors.CardBackground,
        fontFamily: appFonts.headerTextMedium,
        marginLeft: 4,
        fontWeight: '600',
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
    shortcutsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: appColors.grey2,
        fontFamily: appFonts.headerTextBold,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
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
        paddingVertical: 16,
        paddingHorizontal: 8,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        marginBottom: 10,
        minHeight: 100,
        justifyContent: 'center',
    },
    shortcutIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    shortcutText: {
        fontSize: 12,
        color: appColors.grey1,
        fontWeight: '600',
        textAlign: 'center',
        fontFamily: appFonts.headerTextMedium,
        lineHeight: 16,
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

    menuSectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: appColors.grey3,
        fontFamily: appFonts.headerTextBold,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    listRow: {
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: appColors.grey6,
    },
    listRowLast: {
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        justifyContent: 'space-between',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    listRowItem: {
        padding: 5,
    },
    itemTextContainer: {
        flex: 1,
        paddingVertical: 2,
    },
    menuText: {
        fontSize: 16,
        color: appColors.grey1,
        fontWeight: '600',
        fontFamily: appFonts.headerTextBold,
        marginBottom: 2,
    },
    menuSubtext: {
        fontSize: 13,
        color: appColors.grey3,
        fontFamily: appFonts.headerTextRegular,
        lineHeight: 18,
    },
    logoutSection: {
        marginHorizontal: 20,
        marginTop: 20,
    },
    logoutButton: {
        backgroundColor: appColors.CardBackground,
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: '#FFEBEE',
    },
    logoutIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFEBEE',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    logoutText: {
        fontSize: 16,
        color: '#F44336',
        fontWeight: '600',
        fontFamily: appFonts.headerTextBold,
    },

    bottomSpacing: {
        height: 40,
    },
});
