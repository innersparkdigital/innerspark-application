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
    const toast = useToast();

    // Toast Notifications
    const notifyWithToast = (description) => { toast.show({ description: description, }) }

    return(
        <SafeAreaView style={styles.container}>
            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>About Innerspark</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <View style={styles.logoContainer}>
                        <Image 
                            style={styles.logoImage} 
                            source={appImages.logoRecBlue} 
                        />
                    </View>
                    
                    <View style={styles.descriptionCard}>
                        <Text style={styles.descriptionText}>
                            {appContents.aboutAppText}
                        </Text>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    
                    <OpenURLButton url={appLinks.appWebsite}>
                        <View style={styles.actionRow}>
                            <View style={styles.actionIconContainer}>
                                <Icon type="material" name="language" color={appColors.AppBlue} size={24} />
                            </View>
                            <View style={styles.actionContent}>
                                <Text style={styles.actionTitle}>Visit Website</Text>
                                <Text style={styles.actionSubtitle}>Learn more about us</Text>
                            </View>
                            <Icon type="material" name="chevron-right" color={appColors.grey3} size={20} />
                        </View>
                    </OpenURLButton>

                    <OpenURLButton url={appLinks.appSupportEmail}>
                        <View style={styles.actionRow}>
                            <View style={styles.actionIconContainer}>
                                <Icon type="material" name="support-agent" color={appColors.AppBlue} size={24} />
                            </View>
                            <View style={styles.actionContent}>
                                <Text style={styles.actionTitle}>Get Support</Text>
                                <Text style={styles.actionSubtitle}>We're here to help</Text>
                            </View>
                            <Icon type="material" name="chevron-right" color={appColors.grey3} size={20} />
                        </View>
                    </OpenURLButton>

                    <OpenURLButton url={appLinks.appGooglePlayURL}>
                        <View style={styles.actionRow}>
                            <View style={styles.actionIconContainer}>
                                <Icon type="material" name="system-update" color={appColors.AppBlue} size={24} />
                            </View>
                            <View style={styles.actionContent}>
                                <Text style={styles.actionTitle}>Check Updates</Text>
                                <Text style={styles.actionSubtitle}>Stay up to date</Text>
                            </View>
                            <Icon type="material" name="chevron-right" color={appColors.grey3} size={20} />
                        </View>
                    </OpenURLButton>
                </View>

                {/* Connect With Us */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Connect With Us</Text>
                    <View style={styles.socialContainer}>
                        <OpenURLButton url={appLinks.appLinkedIn}>
                            <View style={styles.socialButton}>
                                <Icon type="material-community" name="linkedin" color={appColors.CardBackground} size={24} />
                            </View>
                        </OpenURLButton>

                        <OpenURLButton url={appLinks.appFacebook}>
                            <View style={styles.socialButton}>
                                <Icon type="material-community" name="facebook" color={appColors.CardBackground} size={24} />
                            </View>
                        </OpenURLButton>

                        <OpenURLButton url={appLinks.appTwitter}>
                            <View style={styles.socialButton}>
                                <Icon type="material-community" name="twitter" color={appColors.CardBackground} size={24} />
                            </View>
                        </OpenURLButton>

                        <OpenURLButton url={appLinks.appInstagram}>
                            <View style={styles.socialButton}>
                                <Icon type="material-community" name="instagram" color={appColors.CardBackground} size={24} />
                            </View>
                        </OpenURLButton>
                    </View>
                </View>

                {/* App Info */}
                <View style={styles.section}>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Icon type="material" name="info" color={appColors.AppBlue} size={20} />
                            <Text style={styles.infoText}>Version {appVersion}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Icon type="material" name="copyright" color={appColors.AppBlue} size={20} />
                            <Text style={styles.infoText}>© {new Date().getFullYear()} Innerspark. All rights reserved.</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Icon type="material" name="favorite" color="#E91E63" size={20} />
                            <Text style={styles.infoText}>Made with love for your wellness</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.bottomSpacing} />
            </ScrollView>
        </SafeAreaView>
    )
}

// local stylesheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appColors.AppLightGray,
    },
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
        fontFamily: appFonts.appTextBold,
    },
    headerSpacer: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    heroSection: {
        backgroundColor: appColors.CardBackground,
        margin: 20,
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    logoContainer: {
        marginBottom: 25,
    },
    logoImage: {
        width: 280,
        height: 70,
        resizeMode: 'contain',
    },
    descriptionCard: {
        backgroundColor: appColors.AppLightGray,
        borderRadius: 15,
        padding: 20,
        width: '100%',
    },
    descriptionText: {
        fontSize: 16,
        lineHeight: 24,
        color: appColors.grey1,
        fontFamily: appFonts.appTextRegular,
        textAlign: 'center',
    },
    section: {
        marginHorizontal: 20,
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: appColors.grey1,
        fontFamily: appFonts.appTextBold,
        marginBottom: 15,
    },
    actionRow: {
        backgroundColor: appColors.CardBackground,
        borderRadius: 15,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    actionIconContainer: {
        backgroundColor: appColors.AppLightGray,
        borderRadius: 25,
        width: 45,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    actionContent: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: appColors.grey1,
        fontFamily: appFonts.appTextBold,
        marginBottom: 3,
    },
    actionSubtitle: {
        fontSize: 13,
        color: appColors.grey2,
        fontFamily: appFonts.appTextRegular,
        lineHeight: 18,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: appColors.CardBackground,
        borderRadius: 15,
        padding: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    socialButton: {
        backgroundColor: appColors.AppBlue,
        borderRadius: 25,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    infoCard: {
        backgroundColor: appColors.CardBackground,
        borderRadius: 15,
        padding: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    infoText: {
        fontSize: 14,
        color: appColors.grey1,
        fontFamily: appFonts.appTextRegular,
        marginLeft: 12,
        flex: 1,
    },
    bottomSpacing: {
        height: 30,
    },
});