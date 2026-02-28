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
import { appImages } from '../../global/Data';
import { checkVersion } from 'react-native-check-version';


// Returns a touchable opacity button that opens a url on press
const OpenURLButton = ({ url, title, children, alertRef }) => {
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
    const [updateURL, setUpdateURL] = useState("https://play.google.com/store/apps/details?id=com.innersparkafrica.innerspark");
    //const [updateURL, setUpdateURL] = useState("https://play.google.com/store/apps/");
    //const [updateURL, setUpdateURL] = useState("#");

    // the function running the whole thing
    const checkAppUpdate = async () => {
        const version = await checkVersion();
        //console.log("Got version info: ", version);
        const url = version.url;
        setUpdateURL(url);
    }

    useEffect(
        () => { checkAppUpdate(); }, []
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle='light-content' backgroundColor={appColors.AppBlue} />
            <ImageBackground source={appImages.bgPatterns} style={{ flex: 1, }}>
                <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center', paddingHorizontal: scale(15) }}>
                    <Icon type="material-icons" name="update" color={appColors.AppBlue} size={moderateScale(90)} />
                    <Text style={{ fontSize: moderateScale(22), paddingVertical: scale(10), color: appColors.AppBlue, fontWeight: 'bold', textAlign: 'center', fontFamily: appFonts.headerTextBold }}>
                        Innerspark has a new update!
                    </Text>
                    <View style={{ padding: scale(8) }}>
                        <Text style={{ color: appColors.black, fontSize: moderateScale(15), textAlign: 'center', fontFamily: appFonts.bodyTextRegular }}>
                            Update the app to unlock new features.
                        </Text>
                    </View>
                </View>

                <View style={{ flex: 1, paddingVertical: scale(20), paddingHorizontal: scale(25) }}>
                    {/* ... (buttons remain same, OpenURLButton title is fixed) */}
                    <OpenURLButton title="Update" url={updateURL} alertRef={alert.ref} />
                    <Pressable
                        style={{ marginVertical: scale(10), paddingVertical: scale(5), alignItems: 'center' }}
                        onPress={
                            () => {
                                dispatch(updateAppNeedsUpdate(false));
                            }
                        }
                    >
                        <Text style={{ color: appColors.grey2, fontSize: moderateScale(15), fontWeight: 'bold', fontFamily: appFonts.bodyTextMedium }}>Not Now</Text>
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