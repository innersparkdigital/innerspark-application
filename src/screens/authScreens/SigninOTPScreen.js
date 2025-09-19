import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signin } from '../../features/user/userSlice';
import { 
    updateUserAvatar, 
    updateUserDetails, 
} from '../../features/user/userDataSlice';
import { getAppHomeData } from '../../api/LHFunctions';

import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    StatusBar, 
    Image, 
    Pressable, 
    Keyboard, 
    ActivityIndicator, 
    ImageBackground,
    LogBox,

 } from 'react-native';
 import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Icon, BottomSheet } from '@rneui/base';
import { useToast } from 'native-base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { appImages } from '../../global/Data';
import LHGenericHeader from '../../components/LHGenericHeader';
import LHLoginSuccessModal from '../../components/modals/LHLoginSuccessModal';
import { APIGlobaltHeaders, baseUrlRoot, baseUrlV1 } from '../../api/LHAPI';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import RNOtpVerify from 'react-native-otp-verify';
import { storeItemLS } from '../../global/StorageActions';
import { maskEmail, maskPhoneNumber } from '../../global/LHShortcuts';
import { isEmailLoginType } from '../../global/LHValidators';

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore 'Log Notification Error by RNElement Timer
// LogBox.ignoreAllLogs(); // Ignore all log notifications

const baseUrl = baseUrlRoot + baseUrlV1;
APIGlobaltHeaders(); // API Global headers


export default function SigninOTPScreen( { navigation, route } ){

    const dispatch = useDispatch();
    const toast = useToast();

    // previous screen data
    const {userId, loginData, loginPayload} = route.params; 

    const [finalOTP, setFinalOTP] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isReloadingOTP, setIsReloadingOTP] = useState(false);
    const [isLoadingOTP, setIsLoadingOTP] = useState(false); // Toggles OTP Loading states
    const [isLoadingAppData, setIsLoadingAppData] = useState(false); // Toggles App Home Data Loading states
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
    const [showResendCode, setShowResendCode] = useState(false); // Toggle Resend OTP Button upon expiry

    const [isLoggedInModalVisible, setIsLoggedInModalVisible] = useState(false); // Logged In Success Modal
    const [userTokenData, setUserTokenData] = useState(null);  // user token data
    const [userDetails, setUserDetails] = useState(null); // user details

    // OTP Verify -------------------------------------------------
    const [otpCode, setOTPCode] = useState('');
    const [restartSMSListener, setRestartSMSListener] = useState(false);


    // OTP SMS Handler --- Access Code from Received SMS
    const OTPSMSHandler = (message) => {

        console.log("message", message);
        
        try {
          
          if (message) {
            const otp = /(\d{6})/g.exec(message)[1];
            console.log("otp", otp);
            setOTPCode(otp); // set OTP Code
            setFinalOTP(otp);  // set final OTP

            // Start Verification 
            console.log('OTP received. Verify Now');

            // enable the button now
            setIsSubmitEnabled(true);

            OTPVerificationHandler(otp); // we can actually run the Verification automatically
            // delay it for 1 second
            // setTimeout( OTPVerificationHandler(otp), 1000); // Verify automatically after a short delay

          } else {
            console.log("No message received");
          }
    
      } catch(error) {
         console.log('An error occured...');
         // console.log(error.message);
         //setRestartListener(true);
         restartSMSListener ? setRestartSMSListener(false) : setRestartSMSListener(true);
      }
    
    }

    useEffect( () => {
        // Get Hash
        RNOtpVerify.getHash()
        .then(console.log)
        .catch(console.log);
    
        // Verify OTP
        RNOtpVerify.getOtp()
        .then( p => RNOtpVerify.addListener(OTPSMSHandler))
        .catch(p => console.log(p));
    
        return () => {
          // effect
          RNOtpVerify.removeListener();
          Keyboard.dismiss();
        }
    
      }, [restartSMSListener] );


     // Toast Notifications
    const notifyWithToast = (description) => {
        toast.show({ 
            description: description, 
            duration: 1000
        })
    }



    /** Resend OTP Code Handler
     * This function is used to resend the OTP Code to the user's phone number or email address
     * 
    */
    const resendOTPCode = async () => {
       
        console.log(`Resending login OTP Code with ${loginData.type}`);
        setIsReloadingOTP(true);

        // making a request to the API
        try {

            let response;
            if (isEmailLoginType(loginData.type)) {
                response = await axios.post(`${baseUrl}/auth/resend-verification`, {
                    email: loginData.email,
                });
            } else {
                response = await axios.post(`${baseUrl}/auth/resend-verification`, {
                    phone: loginData.phone,
                });
            }
            
            // checking the status
            if (response.status === 200) {

                // IF status is successful
                if (response.data.status == "success"){

                    // console.log(response.data);
                    notifyWithToast("OTP sent successfully!"); // Notify Resend
                    setIsReloadingOTP(false);

                } else {
                    // console.log(response.data); // what happened
                    notifyWithToast("Something went wrong."); // Notify
                    setIsReloadingOTP(false);
                  
                }

            } else {

                throw new Error("Oops! Something went wrong!");

            }

        } catch (error) {
            // console.log(error.message);
            notifyWithToast("Oops? Something went wrong!"); // Notify with Toasts
            setIsReloadingOTP(false);
        }

    }


     /**
     * Initialize Critical User Session Data
     * This function is used to initialize the critical user session data
     * Get the data from the loginPayload
     */
     const initializeUserSessionData = () => {
    
        // Store Insider User token data
        setUserTokenData({
            userId: loginPayload.userId,
            firstName: loginPayload.firstName,
            lastName: loginPayload.lastName,
            email: loginPayload.email,
            phone: loginPayload.phone,
            role: loginPayload.role,
            email_verified: loginPayload.email_verified,
            phone_verified: loginPayload.phone_verified,
            
        });

        // Set User Details Object 
        setUserDetails({
            userId: loginPayload.userId,
            firstName: loginPayload.firstName,
            lastName: loginPayload.lastName,
            email: loginPayload.email,
            phone: loginPayload.phone,
            role: loginPayload.role,
            email_verified: loginPayload.email_verified,
            phone_verified: loginPayload.phone_verified,
        });

        // Dispatch update user dettails
        dispatch(updateUserDetails({
            userId: loginPayload.userId,
            firstName: loginPayload.firstName,
            lastName: loginPayload.lastName,
            email: loginPayload.email,
            phone: loginPayload.phoneNumber,
            role: loginPayload.role,
            email_verified: loginPayload.email_verified,
            phone_verified: loginPayload.phone_verified,
        })); 
        
        // store user login data
        storeItemLS("userDetailsLS", { 
            userId: loginPayload.userId,
            firstName: loginPayload.firstName,
            lastName: loginPayload.lastName,
            email: loginPayload.email,
            phone: loginPayload.phoneNumber,
            role: loginPayload.role,
            email_verified: loginPayload.email_verified,
            phone_verified: loginPayload.phone_verified,
        });


        // ### Implement Later -- When Endpoint Available - #KNEXT
        // Run the getAppHomeData to get the user's app home data
        // getAppHomeData(
        //     { 
        //         dispatch:dispatch, 
        //         userID:loginPayload.userId, 
        //         loadingSetter:setIsLoadingAppData 
        //     }
        // );
        
    }


    /** OTP Verification Handler
     * This function is used to verify the OTP Code from the user's phone number or email address
     * 
    */
    const OTPVerificationHandler = async (code) => {
        // Just some basic validation
        if ( !isSubmitEnabled ) {
            console.log('All fields are required!');
            // notifyWithToast("All fields are required!"); // Notify with Toast
            // return; 
        }

        // Construct the original code 
        //let OTP_Code = finalOTP;
    
        let OTP_Code = code; // the code from OTP Inputs

        if (OTP_Code.length < 6) {
            // console.log('All fields are required!');
            notifyWithToast("Enter OTP Code To Proceed"); // Notify with Toast
            return; 
        }

        // set loading state
        setIsLoading(true);

        //let OTP_Code = otpCode;

        // making API request to verify OTP Code
            try {

                let response; // response variable initialized
                if (isEmailLoginType(loginData.type)) {
                    response = await axios.post(`${baseUrl}/auth/verify-email`, {
                        email: loginData.email,
                        otpcode: OTP_Code,
                    });
                } else {
                    response = await axios.post(`${baseUrl}/auth/verify-phone`, {
                        phone: loginData.phone,
                        otpcode: OTP_Code,
                    });
                }

            // checking the status
            if (response.status === 200) {

                // If status is successful
                if (response.data.status === "success"){ 
                    
                    console.log(response.data); // console results

                    // Initialize critical user session data
                    initializeUserSessionData();
                    setIsLoggedInModalVisible(true); // Show the Logged In Success Modal
                    setIsLoading(false); // Toggle Loading State
                    
                } else {
                    notifyWithToast(response?.data?.message); // Notify with toasts
                    setIsLoading(false); // Toggle Loading State
                }

            } else {

                throw new Error("Oops! something went wrong!");

                }

            } catch (error) {
                console.log(error.message);
                notifyWithToast("Oops, something went wrong!");  // Notify with toasts
                setIsLoading(false); // Toggle Loading State
            }
    
        }


    return(
        <SafeAreaView style={ styles.container }>
            <ImageBackground source={appImages.bgPatterns} style={{ flex: 1, backgroundColor:appColors.CardBackground }}>
                {/* Header back button */}
                <View style={{ paddingVertical:parameters.headerHeightTinier }}>
                    <LHGenericHeader
                        title='Enter OTP Code' 
                        showTitle={false}
                        showLeftIcon={true}
                        leftIconPressed={ () => { navigation.goBack(); } } 
                    />
                </View>

                {/* OTP Container */}
                <View style={{ flex:1, paddingVertical:20 }}>
                    <View style={ styles.OPTContainer }>
                        {/* Logo */}
                        <View style={{ justifyContent: "center", alignItems:"center" }}>
                            <Image source={appImages.logoRound} style={{ width:280, height:60, resizeMode:'contain' }} />
                        </View>
                  
                        {/* OTP Header */}
                        <View style={{ justifyContent:'center', alignItems:'center', paddingVertical:10 }}>
                            <Text style={{ fontSize:26, color:appColors.AppBlue, fontWeight:'bold', paddingVertical:5 }}>Verify {isEmailLoginType(loginData.type) ? "Email" : "Phone"}</Text>
                           <Text style={{ fontSize:14, color:appColors.AppBlue, fontWeight:'400', paddingVertical:5, textAlign:'center' }}>
                                Enter the code sent to your {isEmailLoginType(loginData.type) ? "email " : "phone "} 
                                {isEmailLoginType(loginData.type) ? maskEmail(loginData.email) : maskPhoneNumber(loginData.phone)} to continue.
                           </Text>
                        </View>

                        {/* OTP Input Container */}
                        <View style={ styles.OTPInputContainer }>
                            <OTPInputView
                                style={{ width: '100%', height: 60}}
                                pinCount={6}
                                code={otpCode} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                                onCodeChanged = {
                                    code => { 
                                        setOTPCode(code);
                                        if (code.length < 6 ) {
                                            setIsSubmitEnabled(false);
                                        } else {
                                            setIsSubmitEnabled(true);
                                        }

                                        //setFinalOTP(code);
                                        // console.log(code);
                                    }
                                
                                }
                                autoFocusOnLoad = {true}
                                codeInputFieldStyle={styles.OTPVerifyInput}
                                keyboardType='number-pad'
                                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                                onCodeFilled = { (code) => {
                                    // Enable the submit OTP button
                                    setOTPCode(code);
                                    setFinalOTP(code);
                                    OTPVerificationHandler(code); // Run the Verification automatically
                                    // setTimeout( OTPVerificationHandler, 1000);
                                    // setIsSubmitEnabled(true);

                                }}
                            />
                        </View>

                        { isLoading && 
                            <View style={{ flexDirection:'row', justifyContent:'center' }}>
                                <ActivityIndicator style={{ marginHorizontal:5 }} color={appColors.AppBlue} />
                                <Text style={{ color:appColors.AppBlue }}>Checking OTP...</Text>
                            </View>
                        }

                        {/* Resend OTP Code */}
                        <View style={{ paddingVertical:5, alignItems:'center', flexDirection:'row', justifyContent:'center' }}>
                            <Text style={{ fontSize:14, color:appColors.grey2, }}>Didn't receive the code? </Text>
                            <Pressable 
                                onPress={ 
                                    () => { 
                                        resendOTPCode(); // Resend OTP Code
                                    } 
                                }
                            >
                                <Text style={{ fontSize:14, color:appColors.AppBlue, fontWeight:'bold', textDecorationLine:'underline' }}>Resend Code</Text>
                            </Pressable>
                            { isReloadingOTP && 
                                <View style={{ justifyContent:'center', paddingVertical:5 }}>
                                    <ActivityIndicator style={{ marginHorizontal:5 }} color={appColors.AppBlue} size="small" />
                                </View>
                            }
                        </View>

                        {/* Verify OTP Code Button */}
                        <View style={{ paddingVertical:15, paddingHorizontal:15}}>
                            <Button 
                                title="Verify"
                                buttonStyle={ parameters.appButtonXLBlue }
                                titleStyle={ parameters.appButtonXLTitle } 
                                onPress={ 
                                    () => { 
                                        OTPVerificationHandler(finalOTP);
                                    } 
                                }
                                disabled={isLoading || !isSubmitEnabled}
                            /> 
                        </View>
                        
                    </View>  
                </View>

                {/* Login Success Modal */}
                <LHLoginSuccessModal 
                    isModVisible={isLoggedInModalVisible} 
                    isLoading={isLoadingAppData}
                    title="Welcome, let’s begin!"
                    description="You’re Successfully Verified!"
                    loadingText="Please wait, getting ready..."
                    buttonTitle="Continue"
                    onPressAction={ 
                        () => { 
                            storeItemLS("userToken", userTokenData); // Local Session to keep user loggedin
                            dispatch(signin(userTokenData)); // Dispatch user token to the signin action
                            setIsLoggedInModalVisible(false); // Close the success modal
                        } 
                    }
                />

            </ImageBackground>
        </SafeAreaView>
    )
}

// local stylesheet for the screen
const styles = StyleSheet.create({
    container : {
        flex: 1,
        //backgroundColor: '#fff',
    },

    OPTContainer: {
        paddingHorizontal:20, 
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        flex:1, 
        //borderTopLeftRadius:50,
        //borderTopRightRadius:50,

        // Implementing box shadow
       // shadowColor: 'black',
       // shadowOpacity: 0.16,
       // shadowOffset: { width: 0, height: 3},
       // shadowRadius: 10,
       // elevation: 30,

    },

    OTPContainerHeader: {
        justifyContent:'center', 
        alignItems:'center', 
        paddingVertical:15, 
        paddingHorizontal:12, 
        marginTop:15,
    },

    OTPInputContainer: {
        //backgroundColor:colors.CardBackground, 
        paddingVertical:25, 
        paddingHorizontal:10, 
        borderRadius:10, 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems:'center',
    },

    OTPInput: {
        paddingHorizontal:8,
        paddingVertical:10,
        borderRadius:10, 
        backgroundColor:appColors.grey6, 
        marginVertical:5,
        color: appColors.grey1,
        fontWeight: 'bold',
        fontSize: 25,
        flex:1,
        textAlign: 'center',
        margin:4, 
        borderWidth:2,
        borderColor:appColors.grey4,
        
    },

    // OTP Verify Inputs styles -------------
    OTPVerifyInput: {
        paddingHorizontal:8,
        paddingVertical:8,
        borderRadius:50, 
        backgroundColor:appColors.grey6, 
        marginVertical:5,
        color: appColors.grey2,
        fontWeight: 'bold',
        fontSize: 25,
        flex:1,
        textAlign: 'center',
        margin:2, 
        borderWidth:2,
        borderColor:appColors.grey4,
        width: 50,
        
    },

    borderStyleBase: {
        width: 40,
        height: 45
    },
    
    borderStyleHighLighted: {
        borderColor: "orange",
    },
    
    underlineStyleHighLighted: {
        borderColor: appColors.AppBlue,
    },

    roundButton: {
        width:50,
        height:50,
        backgroundColor:appColors.AppBlue,
        padding:10,
        borderRadius:50,
        alignItems:'center',
        justifyContent:'center',
   },
    

});