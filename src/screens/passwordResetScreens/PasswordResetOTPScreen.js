import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSessionUserId } from '../../features/user/userDataSlice';
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput,  
    Image, 
    Pressable, 
    ActivityIndicator, 
    ImageBackground,

} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';  
import { Button, Icon } from '@rneui/base';
import { useToast } from 'native-base';
import { appColors, parameters } from '../../global/Styles';
import { appImages } from '../../global/Data';
import LHGenericHeader from '../../components/LHGenericHeader';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { verifyResetCode, resetPassword } from '../../api/shared/auth';


export default function PasswordResetOTPScreen({ navigation, route }){

    const dispatch = useDispatch();
    const toast = useToast();
    
    // Get data from previous screen
    const { passwordResetData } = route.params; 
    const userEmail = passwordResetData?.email || ''; // email or phone number
    const resetType = passwordResetData?.type || 'email'; // password reset type: email or phone
    
    const [finalOTP, setFinalOTP] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isReloadingOTP, setIsReloadingOTP] = useState(false);
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

    // OTP Verify -------------------------------------------------
    const [otpCode, setOTPCode] = useState('');
    const [restartSMSListener, setRestartSMSListener] = useState(false);

     // Toast Notifications
     const notifyWithToast = (description) => {
        toast.show({
            description: description,
            duration: 1000,
        })
    }

    /** OTP Verification Handler */
    const OTPVerificationHandler = async (code) => {
        // Validation
        if (!isSubmitEnabled) {
            console.log('OTP not complete');
            return; 
        }

        let OTP_Code = code || finalOTP;

        if (OTP_Code.length < 6) {
            notifyWithToast("Enter complete OTP code");
            return; 
        }

        setIsLoading(true);

        // Debug: Log what we're sending
        // console.log('🔍 Verifying OTP:');
        // console.log('  Email:', userEmail);
        // console.log('  OTP Code:', OTP_Code);
        // console.log('  OTP Type:', typeof OTP_Code);

        // making API request to verify OTP Code using auth.js
        try {
            const response = await verifyResetCode(userEmail, OTP_Code);
            
            // checking the status
            if (response.status === 200) {

                // IF status is successful
                if (response.data.status === "success") { 

                    console.log(response.data);
                    notifyWithToast("OTP Verified Successfully!");

                    // Get resetToken from response
                    const resetToken = response.data.resetToken;

                    // Navigate to New Password Screen with resetToken
                    navigation.navigate('NewPasswordScreen', {
                        resetToken: resetToken,
                        email: userEmail,
                    });
                    
                    setIsLoading(false);
                    
                } else {
                    console.log(response.data);
                    notifyWithToast(response.data.message || "OTP Verification Failed!");
                    setIsLoading(false);
                }

            } else {
                throw new Error("Oops! Something went wrong!");
            }

        } catch (error) {
            console.log(error.message);
            notifyWithToast("Oops, Something went wrong!");
            setIsLoading(false);
        }
    }
    

    return(
        <SafeAreaView style={ styles.container }>
            <ImageBackground source={appImages.laundryBg} style={{ flex: 1, backgroundColor:appColors.CardBackground }}>
                <View style={{ flex:1, backgroundColor:appColors.CardBackgroundFade2 }}>

                    {/* Header Back Button */}
                    <View style={{ paddingVertical:parameters.headerHeightTinier }}>
                        <LHGenericHeader
                            title='Sign In' 
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
                                <Text style={{ fontSize:28, color:appColors.AppBlue, fontWeight:'bold', paddingVertical:5 }}>Verify OTP</Text>
                                <Text style={{ fontSize:14, color:appColors.AppBlue, fontWeight:'500', paddingVertical:5, textAlign:'center' }}>
                                   Please enter the 6-digit code sent to your { resetType === 'email' ? 'email address' : 'phone number'} to complete verification.
                                </Text>
                            </View>

                            {/* OTP Input Container */}
                            <View style={ styles.OTPInputContainer }>
                                <OTPInputView
                                    style={{ width: '100%', height: 70}}
                                    pinCount={6}
                                    code={otpCode} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                                    onCodeChanged = {
                                        code => { 
                                            setOTPCode(code);
                                            if (code.length < 6) {
                                                setIsSubmitEnabled(false);
                                            } else {
                                                setIsSubmitEnabled(true);
                                            }
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
                                        setIsSubmitEnabled(true);

                                    }}
                                />
                            </View>

                            { isLoading && 
                                <View style={{ flexDirection:'row', justifyContent:'center', paddingVertical:8 }}>
                                    <ActivityIndicator style={{ marginHorizontal:5 }} color={appColors.AppBlue} size="small" />
                                    <Text style={{ color:appColors.black }}>Checking OTP...</Text>
                                </View>
                            }

                            {/* Resend OTP Code */}
                            <View style={{ paddingVertical:5, alignItems:'center', flexDirection:'row', justifyContent:'center' }}>
                                <Text style={{ fontSize:14, color:appColors.grey2, }}>Didn't receive the code? </Text>
                                <Pressable 
                                    onPress={async () => {
                                        setIsReloadingOTP(true);
                                        try {
                                            const response = await resetPassword(userEmail);
                                            if (response.status === 200 && response.data.status === "success") {
                                                notifyWithToast("OTP sent successfully!");
                                            } else {
                                                notifyWithToast("Failed to resend OTP");
                                            }
                                        } catch (error) {
                                            notifyWithToast("Something went wrong!");
                                        }
                                        setIsReloadingOTP(false);
                                    }}
                                    disabled={isReloadingOTP}
                                >
                                    <Text style={{ fontSize:14, color:appColors.AppBlue, fontWeight:'bold', textDecorationLine:'underline' }}>Resend Code</Text>
                                </Pressable>
                                { isReloadingOTP && 
                                    <View style={{ justifyContent:'center', paddingVertical:5 }}>
                                        <ActivityIndicator style={{ marginHorizontal:5 }} color={appColors.AppBlue} size="small" />
                                    </View>
                                }
                            </View>


                            {/* Verify OTP Button */}
                            <View style={{ paddingVertical:15 , paddingHorizontal:15}}>
                                <Button 
                                    title="Verify"
                                    buttonStyle={ parameters.appButtonXLBlue }
                                    titleStyle={ parameters.appButtonXLTitleBlue } 
                                    onPress={() => OTPVerificationHandler(finalOTP)}
                                    disabled={isLoading || !isSubmitEnabled}
                                /> 
                            </View>

                        </View>  
                    </View>



                </View>
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
        // backgroundColor:appColors.CardBackground, 
        flex:1, 
    },

    OTPContainerHeader: {
        justifyContent:'center', 
        alignItems:'center', 
        paddingVertical:15, 
        paddingHorizontal:12, 
        marginTop:15,
    },

    OTPInputContainer: {
        //backgroundColor:appColors.CardBackground, 
        paddingVertical:30, 
        paddingHorizontal:12, 
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
        fontSize: 30,
        flex:1,
        textAlign: 'center',
        margin:5, 
        borderWidth:2,
        borderColor:appColors.grey4,
        
    },

    // OTP Verify Inputs styles -----------------
    OTPVerifyInput: {
        paddingHorizontal:8,
        paddingVertical:10,
        borderRadius:40, 
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
        width: 60,
        
    },

    borderStyleBase: {
        width: 30,
        height: 45
    },
    
    borderStyleHighLighted: {
        borderColor: "orange",
    },
    
    underlineStyleHighLighted: {
        borderColor: appColors.AppBlue,
    },
    

});