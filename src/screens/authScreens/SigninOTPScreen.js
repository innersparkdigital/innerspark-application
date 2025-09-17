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
    //SafeAreaView,

 } from 'react-native';
 import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Icon, BottomSheet } from '@rneui/base';
import { useToast } from 'native-base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { appImages } from '../../global/Data';
import LHGenericHeader from '../../components/LHGenericHeader';
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
    const {userId, loginData} = route.params; 

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
                response = await axios.post(`${baseUrl}/auth/login`, {
                    email: loginData.email,
                    password: loginData.password,
                });
            } else {
                response = await axios.post(`${baseUrl}/auth/login`, {
                    phone: loginData.phone,
                    password: loginData.password,
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

                let response;
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

            // const response = await axios.post(`${baseUrl}/auth/verify-otp`, { "otp" : OTP_Code });


            // checking the status
            if (response.status === 200) {

                    // IF status is successful
                if (response.data.status === "success"){ 
                    // console results
                    console.log(response.data);

                    // Store Insider User token data
                    // get it from the response after OTP Verification
                    setUserTokenData({
                        userId: response.data.user.user_id,
                        firstName: response.data.user.firstName,
                        lastName: response.data.user.lastName,
                        email: response.data.user.email,
                        phone: response.data.user.phoneNumber,
                        role: response.data.user.role,
                        email_verified: response.data.user.email_verified,
                        
                    });

                    // Set User Details Object 
                    setUserDetails({
                        userId: response.data.user.user_id,
                        firstName: response.data.user.firstName,
                        lastName: response.data.user.lastName,
                        email: response.data.user.email,
                        phone: response.data.user.phoneNumber,
                        role: response.data.user.role,
                        email_verified: response.data.user.email_verified,
                    });

                    // Dispatch update user dettails
                    dispatch(updateUserDetails({
                        userId: response.data.user.user_id,
                        firstName: response.data.user.firstName,
                        lastName: response.data.user.lastName,
                        email: response.data.user.email,
                        phone: response.data.user.phoneNumber,
                        role: response.data.user.role,
                        email_verified: response.data.user.email_verified,

                    })); 
                    
                    // store user login data
                    storeItemLS("userDetailsLS", { 
                        userId: response.data.user.user_id,
                        firstName: response.data.user.firstName,
                        lastName: response.data.user.lastName,
                        email: response.data.user.email,
                        phone: response.data.user.phoneNumber,
                        role: response.data.user.role,
                        email_verified: response.data.user.email_verified,
                    });

                    // ### Implement Later -- When Endpoint Available - #KNEXT
                    // Run the getAppHomeData to get the user's app home data
                    // getAppHomeData({ dispatch:dispatch, userID:response.data.user.user_id, loadingSetter:setIsLoadingAppData });
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


                {/* Logged In Success Modal */}
                <BottomSheet
                    // containerStyle={{ flex:1, justifyContent:'center', backgroundColor: 'rgba(0.5, 0.25, 0, 0.5)' }}
                    containerStyle={{ flex:1, justifyContent:'center', backgroundColor: appColors.CardBackground }}
                    modalProps = {{ presentationStyle:"overFullScreen", visible: isLoggedInModalVisible, }}>
                        <View style={{ ...parameters.doffeeModalContainer, paddingVertical:50, backgroundColor:appColors.CardBackground }}>
                            <View style={{ paddingVertical:15, }}>

                                {/* Modal Content */}
                                <View style={{ flex:1, justifyContent:"center", alignItems:"center", paddingVertical:20 }}>
                                    <View style={{ justifyContent: "center", alignItems:"center", paddingVertical:15 }}>
                                        <Icon type="material-community" name="check-circle" color={appColors.AppBlue} size={60} />
                                    </View>
                                    {/* <View style={{ marginVertical:5, paddingHorizontal:5 }}>
                                        <Text style={{ fontSize:18, textAlign:'center', fontWeight:"700", paddingVertical:5, color:appColors.black }}>
                                          Welcome back! You've logged in!
                                        </Text>
                                    </View> */}

                                    <View style={{ marginVertical:10, paddingHorizontal:5 }}>
                                        <Text style={{ fontSize:18, textAlign:'center', paddingVertical:5, color:appColors.AppBlue, fontFamily:appFonts.headerTextBold }}>
                                          You’re all set!
                                        </Text>
                                        <Text style={{ fontSize:22, textAlign:'center', paddingVertical:5, color:appColors.AppBlue, fontFamily:appFonts.headerTextExtraBold }}>
                                          Welcome back.
                                        </Text>
                                    </View>

                                </View>

                                {/* The following options  */}
                                <View style={{ flex:1, justifyContent:"center", marginVertical:10, paddingHorizontal:10, }}>
                                    { isLoadingAppData && 
                                        <View style={{ flexDirection:'row', justifyContent:'center', alignItems:'center', paddingVertical:20, marginBottom:10 }}>
                                            <ActivityIndicator size="small" style={{ marginHorizontal:5, }} color={appColors.AppBlue} /> 
                                            <Text style={{ color:appColors.AppBlue, paddingHorizontal:5, fontSize:14 }}>Just a moment, preparing for you...</Text>
                                        </View>
                                    } 

                                    { !isLoadingAppData && 
                                        <Button 
                                            title="Continue" 
                                            buttonStyle={ parameters.appButtonXLBlue }
                                            titleStyle={ parameters.appButtonXLTitle }
                                            disabled={isLoadingAppData}
                                            onPress = { 
                                                () => { 

                                                    // dispatch user token to the signin action
                                                    storeItemLS("userToken", userTokenData); // Local Session to keep user loggedin
                                                    dispatch(signin(userTokenData));

                                                   // setIsLoggedInModalVisible(false);
                                                
                                                }
                                            }
                                        />
                                    }

                                </View>
                            </View>
                        </View>
                   </BottomSheet>
                   {/* -- Logged In Success Modal ends */}

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