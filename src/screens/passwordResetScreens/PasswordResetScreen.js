import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    Pressable,
    Image, 
    ScrollView, 
    ActivityIndicator, 
    ImageBackground,
    //SafeAreaView,

} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@rneui/base';
import { useToast } from 'native-base';
import { Icon, Tab, TabView } from '@rneui/themed';
import { appColors, parameters } from '../../global/Styles';
import { appImages } from '../../global/Data';
import { isValidEmailAddress, isValidPhoneNumber, isValidEmailOrPhone } from '../../global/LHValidators';
import LHGenericHeader from '../../components/LHGenericHeader';
import { APIInstance } from '../../api/LHAPI';
import { resetPassword } from '../../api/shared/auth';

export default function PasswordResetScreen( { navigation } ){

    const dispatch = useDispatch();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false); 
    const [emailOrPhone, setEmailOrPhone] = useState(""); // email or phone input state

    /* Email or Phone Handler --- onChange */
    const onChangeEmailOrPhoneHandler = (emailOrPhone) => {
        setEmailOrPhone(emailOrPhone.trim()); // trim whitespace
    }

    /* Toast Notifications */
    const notifyWithToast = (description) => {
        toast.show({
            description: description,
            duration: 1000,
        })
    }

     /* Validate Password Reset Inputs */
    const validatePasswordResetInputs = () => {
        // validate email or phone number
        if (!isValidEmailOrPhone(emailOrPhone.trim())) {
            notifyWithToast("Enter a valid email or phone number.");
            return false;
        }
        
        // if it's a ugandan phone
        // if (isValidPhoneNumber(emailOrPhone) && !emailOrPhone.startsWith('+256')) {
        //     notifyWithToast("Uganda phone numbers must start with +256");
        //     return false;
        // }
        
        return true;
    }


    /** Smart Password Reset Select
     * @param {event} event - The event object.
     * @returns {void}
    */
    const smartPasswordResetSelect = async (event) => {
        // validate inputs
        if (!validatePasswordResetInputs()) {
            return;
        }   

        // select the login method based on the username (email or password)
        if (isValidEmailOrPhone(emailOrPhone)) {
            // check if provided value is email otherwise phone
            if (isValidEmailAddress(emailOrPhone)) {
                resetPasswordWithEmail(); // reset with email
            } else if (isValidPhoneNumber(emailOrPhone)) {
                // resetPasswordWithPhone(); // reset with phone
                // Password reset with phone not available
                notifyWithToast("Password reset via phone not available. Please use email.");
                return;
            }
        } else {
            notifyWithToast("Enter a valid email or phone number.");
            return;
        }
            
    }

    /* Reset Password with Email */
    const resetPasswordWithEmail = async () => {
        setIsLoading(true);  // set loading state

        // making a request to the API using auth.js resetPassword function
        try {
            const response = await resetPassword(emailOrPhone); 
            
            // checking the status
            if (response.status === 200) {

                // IF status is successful
                if (response.data.status === "success") {
                    console.log(response.data); // Debug: log the response data

                    notifyWithToast("OTP has been sent to your email!"); // notify with Toast
                   
                    // Redirect to OTP Verification Page
                    navigation.navigate(
                        'PasswordResetOTPScreen', 
                        {
                            passwordResetData: {
                                type: 'email',
                                email: emailOrPhone
                            }, 
                        }
                    ); 
                    setIsLoading(false); // loading state change
                    setEmailOrPhone(''); // clear the email input field

                } else {
                    console.log(response.data); // what happened
                    notifyWithToast(response.data.message || "Failed to send reset code");  // notify with Toast
                    setIsLoading(false);
                }

            } else {
                throw new Error("Oops! an error has occurred!");
            }

        } catch (error) {
            console.log(error.message);
            notifyWithToast("Oops! Something went wrong. Please try again."); // Notify with Toasts
            setIsLoading(false); // Reset loading state
        }
    }

 

    return(
        <SafeAreaView style={ styles.container }>
            <ImageBackground source={appImages.laundryBg} style={{ flex: 1, }}>
                <View style={{ flex:1, backgroundColor:appColors.CardBackgroundFade2 }}>
                    {/* Header Block */}
                    <View style={{ paddingVertical:parameters.headerHeightTinier }}>
                        <LHGenericHeader
                            title='Reset Password' 
                            showTitle={false}
                            showLeftIcon={true}
                            leftIconPressed={ () => { navigation.goBack(); } } 
                        />
                    </View>

                    {/* Scroll View */}
                    <ScrollView contentContainerStyle={{  }}>
                        <View style={{ flex:1, paddingHorizontal:20, paddingVertical:30 }}>

                            {/* Logo and Header Text */}
                            <View style={{ paddingVertical:2 }}>
                                <View style={{ justifyContent: "center", alignItems:"center" }}>
                                    <Image source={appImages.logoRound} style={{ width:280, height:60, resizeMode:'contain' }} />
                                </View>
                                <View style={{ justifyContent:'center', alignItems:'center', paddingVertical:20, paddingHorizontal:10 }}>
                                    <Text style={{ fontSize:28, color:appColors.AppBlue, fontWeight:'bold', paddingVertical:5 }}>Reset Password</Text>
                                    <Text style={{ fontSize:15, color:appColors.AppBlue, fontWeight:'400', paddingVertical:5, textAlign:'center' }}>
                                    Reset your password via phone or email.
                                    </Text>
                                </View>
                            </View>

                            {/* Email and Phone Input Block */}
                            <View style={{ paddingVertical:15 }}>
                                
                                {/* Email, Phone Input Block */}
                                <View style={ styles.inputBlockRow }>
                                    <View style={{ justifyContent: "center", alignItems:"center", paddingRight:10 }}>
                                        <Icon type="material-icons" name="alternate-email" color={appColors.grey4} size={25} />
                                    </View>

                                    <TextInput 
                                        placeholderTextColor={ appColors.grey3 } 
                                        style={{ flex:3, fontSize:15, color:appColors.black, paddingVertical:0 }}
                                        editable={!isLoading}
                                        placeholder='Enter email or phone number'
                                        value={emailOrPhone}
                                        maxLength={100}
                                        onChangeText={ onChangeEmailOrPhoneHandler }
                                        
                                    />  
                                </View>

                                { isLoading && 
                                    <View style={{ flexDirection:'row', justifyContent:'center', marginTop:10 }}>
                                        <ActivityIndicator style={{ marginHorizontal:5 }} />
                                        <Text style={{ color:appColors.black }}>Requesting Password Reset...</Text>
                                    </View>
                                }
                                
                                <View style={{ paddingVertical:15 }}>
                                    <Button 
                                        title="Reset Password"
                                        buttonStyle={ parameters.appButtonXLBlue }
                                        titleStyle={ parameters.appButtonXLTitleBlue } 
                                        onPress={ smartPasswordResetSelect }
                                        // onPress={ () => { console.log("Reset Password"); } }
                                        disabled={isLoading}
                                    /> 
                                </View>
                            </View>


                        </View>
                    </ScrollView>
                </View> 
            </ImageBackground>
        </SafeAreaView>
    )
}

// local stylesheet for the screen
const styles = StyleSheet.create({
    container : {
        flex: 1,
    },
    genericInput: {
        paddingHorizontal:10, 
        borderRadius:20, 
        //backgroundColor:colors.grey6, 
        marginVertical:8,
        color: appColors.grey1,
        borderWidth:1,
        borderColor: appColors.grey4,
        //paddingVertical:20,
        fontSize:18, 
        fontWeight:'bold', 
       
    },

    inputBlockRow: {
        flexDirection:'row', 
        alignItems:'center', 
        paddingHorizontal:12, 
        paddingVertical:8, 
        borderWidth:1,
        borderColor: appColors.grey4,
        borderRadius:25, 
        marginVertical:8
    },

});