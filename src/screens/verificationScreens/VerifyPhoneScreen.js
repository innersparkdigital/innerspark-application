import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAppHomeData } from '../../api/LHFunctions';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    StatusBar,
    Image,
    Pressable,
    ActivityIndicator,
    ImageBackground,
    LogBox

} from 'react-native';
import { Button, Icon, BottomSheet } from '@rneui/base';
import { useToast } from 'native-base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import { appImages } from '../../global/Data';
import { APIInstance } from '../../api/LHAPI';
import { notifyWithToast } from '../../global/LHShortcuts';

// import { Countdown } from "react-native-element-timer";
import OTPInputView from '@twotalltotems/react-native-otp-input';
// import RNOtpVerify from 'react-native-otp-verify';
import LHGenericHeader from '../../components/LHGenericHeader';
import { getProfile as getClientProfile } from '../../api/client/profile';
import { setUserProfile } from '../../features/user/userDataSlice';

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore 'Log Notification Error by RNElement Timer
// LogBox.ignoreAllLogs(); // Ignore all log notifications



export default function VerifyPhoneScreen({ navigation, route }) {

    const dispatch = useDispatch();
    const toast = useToast();
    // const countdownRef = useRef(null); // OTP countdown ref

    const userDetails = useSelector(state => state.userData.userDetails); // User details from redux store
    const [finalOTP, setFinalOTP] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingOTP, setIsLoadingOTP] = useState(false); // Toggles OTP Loading states
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

    // const [showResendCode, setShowResendCode] = useState(false); // Toggle Resend OTP Button upon expiry

    // route data
    const { verificationPhone, returnScreen } = route.params; // previous screen params

    // OTP Verify -------------------------------------------------
    const [otpCode, setOTPCode] = useState('');


    /** 
     * Resend OTP With Phone Number 
     * @returns {void}
    */
    const resendOTPWithPhone = async () => {
        // set loading state
        setIsLoadingOTP(true);
        //setShowResendCode(false); // do resend logic then trigger timer

        // Making a request to the API
        try {
            const response = await APIInstance.post('/update-phone', {
                user: userDetails.userId,
                phone: verificationPhone,
            });

            // checking the status
            if (response.status === 200) {
                // IF status is successful
                if (response.data.status == "success") {
                    console.log(response.data); // for debugging purposes 
                    notifyWithToast(toast, "The OTP has been sent!", "top"); // Notify with Toast
                    setIsLoadingOTP(false);

                } else if (response.data.status === "failed") {
                    console.log(response.data); // for debugging purposes
                    notifyWithToast(toast, response.data.message, "top");
                    setIsLoadingOTP(false); // finish the loading state

                } else {
                    console.log(response.data); // for debugging purposes
                    console.log("Something went wrong."); // what exactly went wrong?
                    notifyWithToast(toast, response.data.message, "top");
                    setIsLoadingOTP(false);

                }

            } else {

                throw new Error("Oops! an error has occurred!");

            }

        } catch (error) {
            console.log(error.message); // for debugging purposes
            notifyWithToast(toast, "Oops? something went wrong!", "top");
            setIsLoadingOTP(false);
        }

    }


    /* OTP Verification Handler
    * @param {string} code - The OTP code to verify
    * @returns {void}
    */
    const OTPVerificationHandler = async (code) => {

        // Just some basic validation
        if (!isSubmitEnabled) {
            console.log('All fields are required!'); // for debugging purposes
            // notifyWithToast("All fields are required!"); // Notify with Toast
            // return; 
        }

        console.log("Final OTP", finalOTP);
        setIsLoading(true);  // set loading state

        let OTP_Code = code; // the code from OTP Inputs

        // making API request to verify OTP Code
        try {

            const response = await APIInstance.post('/phone-otp', {
                "user": userDetails.userId,
                "phone": verificationPhone,
                "otp": OTP_Code,

            });

            // checking the status
            if (response.status === 200) {

                // IF status is successful
                if (response.data.status === "success") {

                    notifyWithToast(toast, "Phone number updated successfully!", "top")

                    // get the user's app home data to refresh the App State
                    getAppHomeData({ dispatch: dispatch, userID: userDetails.userId });

                    // refresh Redux profile (best-effort)
                    try {
                        const refreshedProfile = await getClientProfile(userDetails.userId);
                        if (refreshedProfile?.data) {
                            dispatch(setUserProfile(refreshedProfile.data));
                        }
                    } catch (e) {
                        // ignore refresh errors
                    }

                    setIsLoading(false);

                    // navigate back to the calling screen (fallback to ProfileInfoScreen)
                    navigation.navigate(returnScreen || "ProfileInfoScreen");

                } else {
                    //console.log(response.data)
                    notifyWithToast(toast, response.data.message, "top");  // Notify with toasts
                    setIsLoading(false);
                }

            } else {

                throw new Error("Oops! an error has occurred!");

            }

        } catch (error) {
            console.log(error.message); // for debugging purposes
            notifyWithToast(toast, "Oops, An error occurred!", "top");  // Notify with toasts
            setIsLoading(false);
        }

    }

    return (
        <View style={styles.container}>
            <ImageBackground source={appImages.laundryBg} style={{ flex: 1, backgroundColor: appColors.CardBackground }}>

                {/* Header back button */}
                <View style={{ paddingVertical: parameters.headerHeightTinier }}>
                    <LHGenericHeader
                        title='Enter OTP Code'
                        showTitle={false}
                        showLeftIcon={true}
                        leftIconPressed={() => { navigation.goBack(); }}
                    />
                </View>

                <View style={{ flex: 1, paddingVertical: 20 }}>
                    <View style={styles.OPTContainer}>
                        <View style={styles.OTPContainerHeader}>
                            <View style={{ paddingVertical: scale(10), justifyContent: "center", alignItems: "center" }}>
                                <Icon
                                    type="material-community"
                                    name="cellphone-message"
                                    color={appColors.AppBlue}
                                    size={moderateScale(80)}
                                />
                            </View>
                            <Text style={{ fontSize: moderateScale(28), paddingVertical: scale(5), color: appColors.AppBlue, fontFamily: appFonts.headerTextBold }}>Enter OTP Code</Text>
                            <Text style={{ paddingVertical: scale(5), paddingHorizontal: scale(5), color: appColors.grey1, fontSize: moderateScale(14), textAlign: 'center', fontFamily: appFonts.headerTextRegular }}>
                                Enter the code sent to your phone to continue.
                            </Text>
                        </View>

                        <View style={styles.OTPInputContainer}>
                            <OTPInputView
                                style={{ width: '100%', height: scale(70) }}
                                pinCount={5}
                                code={otpCode} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                                onCodeChanged={
                                    code => {
                                        setOTPCode(code);

                                        if (code.length < 5) {
                                            setIsSubmitEnabled(false);
                                        } else {
                                            setIsSubmitEnabled(true);
                                        }
                                        // setFinalOTP(code);
                                        // console.log(code);
                                    }
                                }
                                autoFocusOnLoad={true}
                                codeInputFieldStyle={styles.OTPVerifyInput}
                                keyboardType='number-pad'
                                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                                onCodeFilled={(code) => {
                                    // Enable the submit OTP button
                                    setOTPCode(code);
                                    setFinalOTP(code);

                                    OTPVerificationHandler(code); // Run the Verification automatically
                                    // setTimeout( OTPVerificationHandler, 1000);
                                    setIsSubmitEnabled(true);
                                }}

                                editable={!isLoadingOTP || !isLoading}
                            />
                        </View>

                        {isLoading &&
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <ActivityIndicator style={{ marginHorizontal: scale(5) }} color={appColors.AppBlue} />
                                <Text style={{ color: appColors.AppBlue, fontFamily: appFonts.headerTextBold }}>Verifying OTP...</Text>
                            </View>
                        }

                        <View style={{ paddingVertical: 15, paddingHorizontal: 15 }}>
                            <Button
                                title="VERIFY & PROCEED"
                                buttonStyle={parameters.appButtonXLBlue}
                                titleStyle={parameters.appButtonXLTitleBlue}
                                onPress={() => { OTPVerificationHandler(finalOTP) }}
                                disabled={isLoading || !isSubmitEnabled || isLoadingOTP}
                            />
                        </View>

                        <View style={{ paddingVertical: scale(2), alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ fontSize: moderateScale(13), color: appColors.grey3, fontFamily: appFonts.headerTextRegular }}>Didn't receive the code ? </Text>
                            <Pressable onPress={() => { resendOTPWithPhone(); }}>
                                <Text style={{ fontSize: moderateScale(13), color: appColors.AppBlue, fontFamily: appFonts.headerTextBold }}>Resend Code</Text>
                            </Pressable>
                            {isLoadingOTP &&
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <ActivityIndicator style={{ marginHorizontal: scale(5) }} color={appColors.AppBlue} size="small" />
                                </View>
                            }
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </View>
    )
}

// local stylesheet for the screen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appColors.CardBackground,
    },

    OPTContainer: {
        paddingHorizontal: scale(20),
        paddingVertical: scale(10),
        flex: 1,
    },

    OTPContainerHeader: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: scale(15),
        paddingHorizontal: scale(12),
        marginTop: scale(15),
    },

    OTPInputContainer: {
        paddingVertical: scale(30),
        paddingHorizontal: scale(12),
        borderRadius: scale(10),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    OTPInput: {
        paddingHorizontal: scale(8),
        paddingVertical: scale(10),
        borderRadius: scale(10),
        backgroundColor: appColors.grey6,
        marginVertical: scale(5),
        color: appColors.grey1,
        fontWeight: 'bold',
        fontSize: moderateScale(30),
        flex: 1,
        textAlign: 'center',
        margin: scale(5),
        borderWidth: scale(2),
        borderColor: appColors.grey4,
    },

    // OTP Verify Inputs styles -----------------
    OTPVerifyInput: {
        paddingHorizontal: scale(8),
        paddingVertical: scale(8),
        borderRadius: scale(40),
        backgroundColor: appColors.grey6,
        marginVertical: scale(5),
        color: appColors.grey2,
        fontWeight: 'bold',
        fontSize: moderateScale(25),
        flex: 1,
        textAlign: 'center',
        margin: scale(2),
        borderWidth: scale(2),
        borderColor: appColors.grey4,
        width: scale(60),
    },

    borderStyleBase: {
        width: scale(30),
        height: scale(45)
    },

    borderStyleHighLighted: {
        borderColor: "orange",
    },

    underlineStyleHighLighted: {
        borderColor: appColors.grey3,
    },

});