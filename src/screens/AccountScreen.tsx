/**
 * Account Screen - User account management and settings
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { performLogout } from '../utils/authManager';
import { appColors, parameters, appFonts } from '../global/Styles';
import { scale, moderateScale } from '../global/Scaling';
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
    ImageBackground,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button, Avatar, BottomSheet } from '@rneui/base';
import { appImages, appLinks } from '../global/Data';
import LHGenericHeader from '../components/LHGenericHeader';
import { storeItemLS, removeItemLS, retrieveItemLS } from '../global/StorageActions';
import { getFullname } from '../global/LHShortcuts';
import ISStatusBar from '../components/ISStatusBar';
import ISAlert, { useISAlert } from '../components/alerts/ISAlert';

// Returns a touchable opacity button that opens a url on press
const OpenURLButton = ({ url, title, alertRef }) => {
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

    return (
        <Button
            title={title}
            buttonStyle={parameters.appButtonXL}
            titleStyle={parameters.appButtonXLTitle}
            onPress={handlePress}
        />);
};

export default function AccountScreen({ navigation }) {

    const toast = useToast(); // Toast notifications helper
    const dispatch = useDispatch();
    const alert = useISAlert();
    const userToken = useSelector(state => state.user.userToken); // User token data (userId, email, name, phone)
    const userDetails = useSelector(state => state.userData.userDetails); // User details from redux store
    const userProfile = useSelector((state: any) => state.userData.userProfile);

    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

    // Animation Values
    const scrollY = useRef(new Animated.Value(0)).current;

    // Interpolations for the Main Banner fade out
    const headerOpacity = scrollY.interpolate({
        inputRange: [0, scale(100)],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const headerTranslateY = scrollY.interpolate({
        inputRange: [0, scale(100)],
        outputRange: [0, scale(-50)],
        extrapolate: 'clamp',
    });

    const headerScale = scrollY.interpolate({
        inputRange: [-scale(100), 0, scale(100)],
        outputRange: [1.2, 1, 0.8],
        extrapolate: 'clamp',
    });

    // Interpolations for the Sticky Top Bar fade in
    const stickyHeaderOpacity = scrollY.interpolate({
        inputRange: [scale(80), scale(120)],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    // Toast Notifications
    const notifyWithToast = (description) => {
        toast.show({
            description: description,
            duration: 2000,
        })
    }

    /** 
     * Signout current user
     * Uses authManager utility to perform comprehensive data wipe
     */
    const signOutHandler = () => {
        performLogout();
    }

    const MenuRow = ({ icon, iconType = "material", title, subtitle, onPress, showChevron = true, isLast = false, iconColor = appColors.AppBlue }) => (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <View style={isLast ? styles.listRowLast : styles.listRow}>
                <View style={[styles.iconCircle, { backgroundColor: iconColor + '15' }]}>
                    <Icon type={iconType} name={icon} color={iconColor} size={moderateScale(22)} />
                </View>
                <View style={styles.itemTextContainer}>
                    <Text style={styles.menuText}>{title}</Text>
                    {subtitle && <Text style={styles.menuSubtext}>{subtitle}</Text>}
                </View>
                {showChevron && (
                    <Icon type="material" name="chevron-right" color={appColors.grey4} size={moderateScale(22)} />
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ISStatusBar />

            {/* Sticky Compact Header (Fades in on scroll) */}
            <Animated.View style={[styles.stickyHeader, { opacity: stickyHeaderOpacity }]}>
                <View style={styles.stickyHeaderContent}>
                    <Avatar
                        rounded
                        size={scale(36)}
                        source={(userProfile?.profileImage || userDetails?.image) ? { uri: userProfile?.profileImage || userDetails?.image } : undefined}
                        icon={!(userProfile?.profileImage || userDetails?.image) ? { name: 'person', type: 'material', size: scale(24), color: appColors.CardBackground } : undefined}
                        containerStyle={styles.stickyAvatarContainer}
                    />
                    <View style={styles.stickyNameRow}>
                        <Text style={styles.stickyUserName} numberOfLines={1}>
                            {getFullname(
                                userProfile?.firstName || userDetails?.firstName || '',
                                userProfile?.lastName || userDetails?.lastName || ''
                            ) || 'Innerspark User'}
                        </Text>
                        <Icon name="verified" type="material" color="#FFFFFF" size={scale(14)} style={{ marginLeft: scale(4) }} />
                    </View>
                </View>
            </Animated.View>

            <Animated.ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
            >
                {/* Curved Header with Profile (Fades out on scroll) */}
                <Animated.View style={[
                    styles.curvedHeader,
                    {
                        opacity: headerOpacity,
                        transform: [
                            { translateY: headerTranslateY },
                            { scale: headerScale }
                        ]
                    }
                ]}>
                    <View style={styles.profileSection}>
                        <View style={styles.avatarContainer}>
                            <Avatar
                                rounded
                                size={scale(85)}
                                source={(userProfile?.profileImage || userDetails?.image) ? { uri: userProfile?.profileImage || userDetails?.image } : undefined}
                                icon={!(userProfile?.profileImage || userDetails?.image) ? { name: 'person', type: 'material', size: scale(64), color: appColors.CardBackground } : undefined}
                                containerStyle={styles.avatarStyle}
                                avatarStyle={styles.avatarImageStyle}
                            />
                        </View>

                        <View style={styles.nameBadgeRow}>
                            <Text style={styles.userName}>
                                {getFullname(
                                    userProfile?.firstName || userDetails?.firstName || '',
                                    userProfile?.lastName || userDetails?.lastName || ''
                                ) || 'Innerspark User'}
                            </Text>
                            <View style={styles.inlineBadge}>
                                <Icon name="verified" type="material" color="#FFFFFF" size={moderateScale(14)} />
                            </View>
                        </View>

                        <Text style={styles.userEmail}>
                            {userProfile?.email || userDetails?.email || 'user@example.com'}
                        </Text>
                    </View>
                </Animated.View>

                {/* Spacer to push content down below absolute header visually if needed, but since it's inside ScrollView, 
                    the header scrolls with the content naturally! */}

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
                                <Icon name="flag" type="material" color="#FFC107" size={moderateScale(24)} />
                            </View>
                            <Text style={styles.shortcutText}>Goals</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.shortcutCard}
                            onPress={() => navigation.navigate('AppointmentsScreen')}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.shortcutIconContainer, { backgroundColor: '#2196F3' + '15' }]}>
                                <Icon name="event" type="material" color="#2196F3" size={moderateScale(24)} />
                            </View>
                            <Text style={styles.shortcutText}>Appointments</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.shortcutCard}
                            onPress={() => navigation.navigate('EventsScreen')}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.shortcutIconContainer, { backgroundColor: '#E91E63' + '15' }]}>
                                <Icon name="celebration" type="material" color="#E91E63" size={moderateScale(24)} />
                            </View>
                            <Text style={styles.shortcutText}>Events</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 
                  HIDDEN FOR MVP: The platform is currently operating on a Pay-Per-Use model. 
                  Subscriptions and Events packages will be restored Post-MVP.
                */}
                {/* <View style={styles.menuSection}>
                    <Text style={styles.menuSectionTitle}>My Services</Text>
                    <MenuRow
                        icon="card-membership"
                        title="My Subscription"
                        subtitle="Manage your plan and billing"
                        onPress={() => navigation.navigate('ServicesScreen', { initialTab: 'subscription' })}
                        iconColor="#FF9800"
                    />

                    <MenuRow
                        icon="event-available"
                        title="My Events"
                        subtitle="View registered events and workshops"
                        onPress={() => navigation.navigate('EventsScreen')}
                        iconColor="#E91E63"
                        isLast={true}
                    />
                </View> */}

                {/* Account Section */}
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
                        isLast={true}
                    />
                </View>

                {/* Support Section */}
                <View style={styles.menuSection}>
                    <Text style={styles.menuSectionTitle}>Support</Text>
                    <MenuRow
                        icon="emergency"
                        title="Emergency"
                        subtitle="Crisis support and hotlines"
                        onPress={() => navigation.navigate('EmergencyScreen')}
                        iconColor="#F44336"
                    />

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
                        isLast={true}
                    />
                </View>

                {/* Test Section */}
                {/* <View style={styles.logoutSection}>
                <TouchableOpacity 
                    style={styles.logoutButton}
                    onPress={() => navigation.navigate('DevTestScreen')}
                    activeOpacity={0.8}
                >
                    <View style={styles.logoutIconContainer}>
                        <Icon name="settings" type="material" color="#197019ff" size={22} />
                    </View>
                    <Text style={styles.logoutText}>Test API Endpoints</Text>
                </TouchableOpacity>
            </View> */}

                {/* Logout Section */}
                <View style={styles.logoutSection}>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={() => setIsLogoutModalVisible(true)}
                        activeOpacity={0.8}
                    >
                        <View style={styles.logoutIconContainer}>
                            <Icon name="logout" type="material" color="#F44336" size={moderateScale(22)} />
                        </View>
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.bottomSpacing} />
            </Animated.ScrollView>

            {/** Logout BottomSheet Modal */}
            <BottomSheet
                containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.5)' }}
                modalProps={{ presentationStyle: "overFullScreen", visible: isLogoutModalVisible, }}
                onBackdropPress={() => { setIsLogoutModalVisible(false); }}
            >
                <View style={parameters.doffeeModalContainer}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 20, }}>
                        <Icon
                            type="material"
                            name="logout"
                            color={appColors.AppBlue}
                            size={moderateScale(50)}
                        />
                        <Text
                            style={{
                                fontSize: moderateScale(18),
                                paddingVertical: scale(15),
                                color: appColors.AppBlue,
                                textAlign: "center",
                                fontFamily: appFonts.headerTextBold,
                            }}
                        >
                            Are you sure you want to log out?
                        </Text>
                        <Text
                            style={{
                                fontSize: moderateScale(14),
                                color: appColors.AppGray,
                                textAlign: "center",
                                fontFamily: appFonts.headerTextRegular,
                                paddingHorizontal: scale(20),
                            }}
                        >
                            You'll need to sign in again to access your account.
                        </Text>
                    </View>
                    <View style={{ paddingVertical: 5 }}></View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1, paddingHorizontal: 10 }}>
                            <Button
                                title="Cancel"
                                buttonStyle={[parameters.appButtonXL, { backgroundColor: appColors.AppLightGray }]}
                                titleStyle={[parameters.appButtonXLTitle, { color: appColors.AppBlue }]}
                                onPress={() => setIsLogoutModalVisible(false)}
                            />
                        </View>
                        <View style={{ flex: 1, paddingHorizontal: 10 }}>
                            <Button
                                title="Log Out"
                                buttonStyle={[parameters.appButtonXL, { backgroundColor: '#F44336' }]}
                                titleStyle={parameters.appButtonXLTitle}
                                onPress={() => {
                                    signOutHandler();
                                    setIsLogoutModalVisible(false);
                                }}
                            />
                        </View>
                    </View>
                    <View style={{ paddingVertical: 25 }}></View>
                </View>
            </BottomSheet>
            {/* -- Logout BottomSheet Modal ends */}

            <ISAlert ref={alert.ref} />
        </SafeAreaView>
    )
}

// local stylesheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appColors.AppLightGray,
    },
    curvedHeader: {
        backgroundColor: appColors.AppBlue,
        borderBottomLeftRadius: scale(30),
        borderBottomRightRadius: scale(30),
        paddingBottom: scale(30),
        paddingTop: scale(20),
    },
    stickyHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: scale(80),
        backgroundColor: appColors.AppBlue,
        zIndex: 20,
        justifyContent: 'flex-end',
        paddingBottom: scale(10),
        paddingHorizontal: scale(20),
    },
    stickyHeaderContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stickyAvatarContainer: {
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.8)',
    },
    stickyNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: scale(10),
        flex: 1,
    },
    stickyUserName: {
        fontSize: moderateScale(16),
        color: appColors.CardBackground,
        fontFamily: appFonts.headerTextBold,
        fontWeight: '700',
    },
    nameBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inlineBadge: {
        marginLeft: scale(6),
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: scale(12),
        padding: scale(3),
    },
    profileSection: {
        alignItems: 'center',
        paddingHorizontal: scale(20),
    },
    avatarContainer: {
        marginBottom: scale(15),
        alignItems: 'center',
    },
    avatarStyle: {
        borderWidth: scale(3),
        borderColor: appColors.CardBackground,
        backgroundColor: 'transparent',
    },
    avatarImageStyle: {
        resizeMode: 'cover',
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: appColors.AppBlue,
        width: scale(32),
        height: scale(32),
        borderRadius: scale(16),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: scale(3),
        borderColor: appColors.CardBackground,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    userName: {
        fontSize: moderateScale(24),
        fontWeight: 'bold',
        color: appColors.CardBackground,
        marginBottom: scale(4),
        fontFamily: appFonts.headerTextBold,
    },
    userEmail: {
        fontSize: moderateScale(15),
        color: appColors.CardBackground,
        opacity: 0.9,
        fontFamily: appFonts.headerTextRegular,
        marginBottom: scale(8),
    },
    memberBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: scale(12),
        paddingVertical: scale(6),
        borderRadius: scale(20),
        marginTop: scale(4),
    },
    memberText: {
        fontSize: moderateScale(13),
        color: appColors.CardBackground,
        fontFamily: appFonts.headerTextMedium,
        marginLeft: scale(4),
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
        backgroundColor: appColors.AppLightGray,
    },
    shortcutsSection: {
        paddingHorizontal: scale(20),
        marginBottom: scale(20),
        marginTop: scale(20),
    },
    shortcutsTitle: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        color: appColors.grey2,
        fontFamily: appFonts.headerTextBold,
        marginBottom: scale(12),
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    shortcutsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    shortcutCard: {
        flex: 1,
        backgroundColor: appColors.CardBackground,
        borderRadius: scale(12),
        paddingVertical: scale(12),
        paddingHorizontal: scale(6),
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        marginHorizontal: scale(4),
        minHeight: scale(80),
        justifyContent: 'center',
    },
    shortcutIconContainer: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: scale(6),
    },
    shortcutText: {
        fontSize: moderateScale(11),
        color: appColors.grey1,
        fontWeight: '600',
        textAlign: 'center',
        fontFamily: appFonts.headerTextMedium,
        lineHeight: moderateScale(14),
    },
    menuSection: {
        backgroundColor: appColors.CardBackground,
        marginHorizontal: scale(20),
        borderRadius: scale(20),
        paddingVertical: scale(5),
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        marginBottom: scale(20),
    },

    accountImageContainer: {
        paddingVertical: scale(30),
        paddingHorizontal: scale(20),
        alignItems: 'center',
        backgroundColor: appColors.CardBackground,
        borderBottomWidth: scale(1),
        borderBottomColor: appColors.AppLightGray,
    },


    menuSectionTitle: {
        fontSize: moderateScale(14),
        fontWeight: 'bold',
        color: appColors.grey3,
        fontFamily: appFonts.headerTextBold,
        paddingHorizontal: scale(20),
        paddingTop: scale(16),
        paddingBottom: scale(8),
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    listRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(20),
        paddingVertical: scale(16),
        borderBottomWidth: scale(0.5),
        borderBottomColor: appColors.grey6,
    },
    listRowLast: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(20),
        paddingVertical: scale(16),
        justifyContent: 'space-between',
        borderBottomLeftRadius: scale(15),
        borderBottomRightRadius: scale(15),
    },
    iconCircle: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: scale(12),
    },
    listRowItem: {
        padding: scale(5),
    },
    itemTextContainer: {
        flex: 1,
        paddingVertical: scale(2),
    },
    menuText: {
        fontSize: moderateScale(16),
        color: appColors.grey1,
        fontWeight: '600',
        fontFamily: appFonts.headerTextBold,
        marginBottom: scale(2),
    },
    menuSubtext: {
        fontSize: moderateScale(13),
        color: appColors.grey3,
        fontFamily: appFonts.headerTextRegular,
        lineHeight: moderateScale(18),
    },
    logoutSection: {
        marginHorizontal: scale(20),
        marginTop: scale(20),
    },
    logoutButton: {
        backgroundColor: appColors.CardBackground,
        borderRadius: scale(16),
        paddingVertical: scale(18),
        paddingHorizontal: scale(20),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderWidth: scale(1),
        borderColor: '#FFEBEE',
    },
    logoutIconContainer: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
        backgroundColor: '#FFEBEE',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: scale(12),
    },
    logoutText: {
        fontSize: moderateScale(16),
        color: '#F44336',
        fontWeight: '600',
        fontFamily: appFonts.headerTextBold,
    },

    bottomSpacing: {
        height: scale(40),
    },
});
