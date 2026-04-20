import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateAppNeedsUpdate } from '../../features/appStart/appStartSlice';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Pressable,
    ActivityIndicator,
    ImageBackground,
    Linking,
    StatusBar,

} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Icon } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import ISAlert, { useISAlert } from '../../components/alerts/ISAlert';
import { appImages, appLinks } from '../../global/Data';
import { checkVersion } from 'react-native-check-version';


// Returns a touchable opacity button that opens a url on press
const OpenURLButton = ({ url, title, children, alertRef }) => {
    const handlePress = useCallback(async () => {
        const finalUrl = url || appLinks.appGooglePlayURL;

        try {
            // Devices & Emulators often falsely report 'unsupported' for store links in canOpenURL.
            // It's safer to just try opening it directly and catch any actual errors.
            await Linking.openURL(finalUrl);
        } catch (error) {
            alertRef?.current?.show({
                type: 'info',
                title: 'Cannot Open URL',
                message: `Failed to open the store link. Are you using an Emulator? URL: ${finalUrl}`,
                confirmText: 'OK',
            });
        }
    }, [url]);

    // return <TouchableOpacity onPress={handlePress}>{children}</TouchableOpacity>;

    return (
        <Button
            title={title}
            buttonStyle={parameters.appButtonXLBlue}
            titleStyle={parameters.appButtonXLBlueTitle}
            onPress={handlePress}
        />);

};


export default function VerifyAppVersionScreen({ navigation }) {

    const dispatch = useDispatch();
    const alert = useISAlert();

    // default update url
    const [updateURL, setUpdateURL] = useState(appLinks.appGooglePlayURL);

    // the function running the whole thing
    const checkAppUpdate = async () => {
        try {
            const version = await checkVersion();

            if (version?.url) {
                setUpdateURL(version.url);
            }
        } catch (error) {
            console.warn("Could not fetch store url from checkVersion:", error);
        }
    }

    useEffect(
        () => { checkAppUpdate(); }, []
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle='dark-content' backgroundColor='transparent' translucent />
            <ImageBackground source={appImages.bgPatterns} style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: scale(20) }}>

                    {/* Premium Icon Container */}
                    <View style={{
                        width: moderateScale(130),
                        height: moderateScale(130),
                        borderRadius: moderateScale(65),
                        backgroundColor: appColors.AppBlue + '12', // subtle blue tint
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: scale(30),
                    }}>
                        <View style={{
                            width: moderateScale(90),
                            height: moderateScale(90),
                            borderRadius: moderateScale(45),
                            backgroundColor: appColors.AppBlue + '20', // slightly darker inner circle
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Icon type="material-community" name="rocket-launch-outline" color={appColors.AppBlue} size={moderateScale(45)} />
                        </View>
                    </View>

                    <Text style={{
                        fontSize: moderateScale(26),
                        color: appColors.AppBlue,
                        fontWeight: '800',
                        textAlign: 'center',
                        fontFamily: appFonts.headerTextBold,
                        marginBottom: scale(15)
                    }}>
                        Update Available!
                    </Text>

                    <Text style={{
                        color: appColors.grey1,
                        fontSize: moderateScale(16),
                        textAlign: 'center',
                        fontFamily: appFonts.bodyTextRegular,
                        lineHeight: moderateScale(24),
                        paddingHorizontal: scale(15)
                    }}>
                        Innerspark just got better! We’ve added new features and performance improvements to elevate your wellness journey.
                    </Text>
                </View>

                {/* Bottom Action Area */}
                <View style={{ paddingVertical: scale(20), paddingHorizontal: scale(25), paddingBottom: scale(40) }}>
                    <OpenURLButton title="Update Now" url={updateURL} alertRef={alert.ref} />

                    <Pressable
                        style={{ marginTop: scale(20), paddingVertical: scale(12), alignItems: 'center' }}
                        onPress={
                            () => {
                                dispatch(updateAppNeedsUpdate(false));
                            }
                        }
                    >
                        <Text style={{
                            color: appColors.grey2,
                            fontSize: moderateScale(16),
                            fontWeight: '600',
                            fontFamily: appFonts.bodyTextMedium
                        }}>
                            Maybe Later
                        </Text>
                    </Pressable>
                </View>
            </ImageBackground>
            <ISAlert ref={alert.ref} />
        </SafeAreaView>
    );
}


// local stylesheet for the screen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: '#fff',
    },

});