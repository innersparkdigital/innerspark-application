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
    Pressable,
    ScrollView,

} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button, Avatar } from '@rneui/base';
import { appColors, parameters, appFonts } from '../global/Styles';
import { useToast } from 'native-base';
import { appImages } from '../global/Data';
import VersionInfo from 'react-native-version-info';
import { appLinks, appContents } from '../global/Data';
import HeaderBackButton from '../components/HeaderBackButton';
import LHGenericHeader from '../components/LHGenericHeader';
import ISGenericHeader from '../components/ISGenericHeader'; // generic header for Innerspark
import ISAlert, { useISAlert } from '../components/alerts/ISAlert';
import { scale, moderateScale } from '../global/Scaling';


// App version
const appVersion = VersionInfo.appVersion;


// Returns a touchable opacity button that opens a url on press
const OpenURLButton = ({ url, children, alertRef }: any) => {
    const handlePress = useCallback(async () => {

        // Checking if the link is supported for links with custom URL scheme.
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            // Opening the link with some app, if the URL scheme is "http" the web link should be opened
            // by some browser in the mobile
            await Linking.openURL(url);
        } else {
            alertRef?.current?.show({
                type: 'info',
                title: 'Cannot Open URL',
                message: `Don't know how to open this URL: ${url}`,
                confirmText: 'OK',
            });
        }

    }, [url]);

    return <TouchableOpacity onPress={handlePress}>{children}</TouchableOpacity>;
};


export default function AboutAppScreen({ navigation }: any) {
    const toast = useToast();
    const alert = useISAlert();

    // Toast Notifications
    const notifyWithToast = (description: any) => { toast.show({ description: description, }) }

    return (
        <SafeAreaView style={styles.container}>
            {/* Custom Header */}
            <ISGenericHeader
                navigation={navigation}
                title="About"
            />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <View style={{ margin: scale(20) }}>
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
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>

                    <OpenURLButton url={appLinks.appWebsite} alertRef={alert.ref}>
                        <View style={styles.actionRow}>
                            <View style={styles.actionIconContainer}>
                                <Icon type="material" name="language" color={appColors.AppBlue} size={moderateScale(24)} />
                            </View>
                            <View style={styles.actionContent}>
                                <Text style={styles.actionTitle}>Visit Website</Text>
                                <Text style={styles.actionSubtitle}>Learn more about us</Text>
                            </View>
                            <Icon type="material" name="chevron-right" color={appColors.grey3} size={moderateScale(20)} />
                        </View>
                    </OpenURLButton>

                    <OpenURLButton url={appLinks.appSupportEmail} alertRef={alert.ref}>
                        <View style={styles.actionRow}>
                            <View style={styles.actionIconContainer}>
                                <Icon type="material" name="support-agent" color={appColors.AppBlue} size={moderateScale(24)} />
                            </View>
                            <View style={styles.actionContent}>
                                <Text style={styles.actionTitle}>Get Support</Text>
                                <Text style={styles.actionSubtitle}>We're here to help</Text>
                            </View>
                            <Icon type="material" name="chevron-right" color={appColors.grey3} size={moderateScale(20)} />
                        </View>
                    </OpenURLButton>

                    <OpenURLButton url={appLinks.appGooglePlayURL} alertRef={alert.ref}>
                        <View style={styles.actionRow}>
                            <View style={styles.actionIconContainer}>
                                <Icon type="material" name="system-update" color={appColors.AppBlue} size={moderateScale(24)} />
                            </View>
                            <View style={styles.actionContent}>
                                <Text style={styles.actionTitle}>Check Updates</Text>
                                <Text style={styles.actionSubtitle}>Stay up to date</Text>
                            </View>
                            <Icon type="material" name="chevron-right" color={appColors.grey3} size={moderateScale(20)} />
                        </View>
                    </OpenURLButton>
                </View>

                {/* Connect With Us */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Connect With Us</Text>
                    <View style={styles.socialContainer}>
                        <OpenURLButton url={appLinks.appLinkedIn} alertRef={alert.ref}>
                            <View style={styles.socialButton}>
                                <Icon type="material-community" name="linkedin" color={appColors.CardBackground} size={moderateScale(24)} />
                            </View>
                        </OpenURLButton>

                        <OpenURLButton url={appLinks.appFacebook} alertRef={alert.ref}>
                            <View style={styles.socialButton}>
                                <Icon type="material-community" name="facebook" color={appColors.CardBackground} size={moderateScale(24)} />
                            </View>
                        </OpenURLButton>

                        <OpenURLButton url={appLinks.appTwitter} alertRef={alert.ref}>
                            <View style={styles.socialButton}>
                                <Icon type="material-community" name="twitter" color={appColors.CardBackground} size={moderateScale(24)} />
                            </View>
                        </OpenURLButton>

                        <OpenURLButton url={appLinks.appInstagram} alertRef={alert.ref}>
                            <View style={styles.socialButton}>
                                <Icon type="material-community" name="instagram" color={appColors.CardBackground} size={moderateScale(24)} />
                            </View>
                        </OpenURLButton>
                    </View>
                </View>


                <View style={styles.versionContainer}>
                    <Text style={styles.versionText}>Innerspark v{appVersion}</Text>
                </View>

                <View style={styles.bottomSpacing} />
            </ScrollView>
            <ISAlert ref={alert.ref} />
        </SafeAreaView>
    )
}

// local stylesheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: appColors.CardBackground,
        backgroundColor: appColors.AppLightGray,
    },
    header: {
        backgroundColor: appColors.AppBlue,
        paddingTop: parameters.headerHeightS,
        paddingBottom: scale(20),
        paddingHorizontal: scale(20),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: scale(2) },
        shadowOpacity: 0.1,
        shadowRadius: scale(4),
    },
    backButton: {
        padding: scale(8),
        borderRadius: scale(20),
    },
    headerTitle: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        color: appColors.CardBackground,
        fontFamily: appFonts.headerTextBold,
    },
    headerSpacer: {
        width: scale(40),
    },
    scrollView: {
        flex: 1,
    },
    heroSection: {
        backgroundColor: appColors.CardBackground,
        marginBottom: scale(25),
        // borderRadius: 20,
        paddingHorizontal: scale(5),
        paddingVertical: scale(10),
        // alignItems: 'center',
        // elevation: 3,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
    },
    logoContainer: {
        marginBottom: scale(10),
    },
    logoImage: {
        width: scale(250),
        height: scale(70),
        resizeMode: 'contain',
    },
    descriptionCard: {
        //backgroundColor: appColors.CardBackground,
        // borderRadius: 15,
        padding: scale(5),
        width: '100%',
    },
    descriptionText: {
        fontSize: moderateScale(16),
        lineHeight: moderateScale(24),
        color: appColors.grey1,
        fontFamily: appFonts.headerTextRegular,
        textAlign: 'left',
    },
    section: {
        marginHorizontal: scale(20),
        marginBottom: scale(25),
    },
    sectionTitle: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        color: appColors.grey1,
        fontFamily: appFonts.headerTextBold,
        marginBottom: scale(15),
    },
    actionRow: {
        backgroundColor: appColors.CardBackground,
        borderRadius: scale(15),
        padding: scale(20),
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: scale(12),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: scale(1) },
        shadowOpacity: 0.1,
        shadowRadius: scale(2),
    },
    actionIconContainer: {
        backgroundColor: appColors.AppLightGray,
        borderRadius: scale(25),
        width: scale(45),
        height: scale(45),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: scale(15),
    },
    actionContent: {
        flex: 1,
    },
    actionTitle: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        color: appColors.grey1,
        fontFamily: appFonts.headerTextBold,
        marginBottom: scale(3),
    },
    actionSubtitle: {
        fontSize: moderateScale(13),
        color: appColors.grey2,
        fontFamily: appFonts.headerTextRegular,
        lineHeight: moderateScale(18),
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: appColors.CardBackground,
        borderRadius: scale(15),
        padding: scale(20),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: scale(1) },
        shadowOpacity: 0.1,
        shadowRadius: scale(2),
    },
    socialButton: {
        backgroundColor: appColors.AppBlue,
        borderRadius: scale(25),
        width: scale(50),
        height: scale(50),
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: scale(10),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: scale(1) },
        shadowOpacity: 0.2,
        shadowRadius: scale(2),
    },
    infoCard: {
        backgroundColor: appColors.CardBackground,
        borderRadius: scale(15),
        padding: scale(20),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: scale(1) },
        shadowOpacity: 0.1,
        shadowRadius: scale(2),
    },

    infoCardPlain: {
        // backgroundColor: appColors.AppLightGray,
        // borderRadius: 15,
        padding: scale(20),
        //elevation: 2,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.1,
        // shadowRadius: 2,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: scale(8),
    },
    infoText: {
        fontSize: moderateScale(14),
        color: appColors.grey1,
        fontFamily: appFonts.headerTextRegular,
        marginLeft: scale(12),
        flex: 1,
    },
    bottomSpacing: {
        height: scale(20),
    },

    /* App Version Information styles */
    versionContainer: {
        alignItems: 'center',
        marginTop: scale(30),
        marginBottom: scale(20),
    },
    versionText: {
        fontSize: moderateScale(14),
        color: appColors.grey3,
        fontFamily: appFonts.headerTextMedium,
        marginBottom: scale(4),
    },
    buildText: {
        fontSize: moderateScale(12),
        color: appColors.grey4,
        fontFamily: appFonts.headerTextRegular,
    },
});