import axios from 'axios';
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
import LHGenericHeader from '../../components/LHGenericHeader';
import { APIGlobaltHeaders, baseUrlRoot, baseUrlV1 } from '../../api/LHAPI';

// GLOBAL AXIOS DEFAULTS
const baseUrl = baseUrlRoot + baseUrlV1;
APIGlobaltHeaders(); // API Global headers

export default function PasswordResetScreen( { navigation } ){

    const dispatch = useDispatch();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false); 
    const [emailOrPhone, setEmailOrPhone] = useState(""); // email or phone input state

    /* Email or Phone Handler --- onChange */
    const onChangeEmailOrPhoneHandler = (emailOrPhone) => {
        setEmailOrPhone(emailOrPhone);
    }

    /* Toast Notifications */
    const notifyWithToast = (description) => {
        toast.show({
            description: description,
            duration: 1000,
        })
    }

    /* Submit Email Form Handler --- Reset Password With Email */
    const onSubmitFormEmailHandler = async (event) => {
        // some basic validation --- do more validation later
        if (!emailOrPhone.trim()) {
            notifyWithToast("Provide a valid Email address!");  // Notify with toast
            return;
        }
        console.log("Email: " + emailOrPhone);
        // set loading state
        setIsLoading(true);

        // making a request to the API
        try {

            const response = await axios.post(`${baseUrl}/forgot-pwd`, {
                email : emailOrPhone,
                phone : '',
            });
            
            // checking the status
            if (response.status === 200) {

                // IF status is successful
                // JSON.stringify(response.data);
                if (response.data.status == "success"){

                    console.log(response.data);

                    notifyWithToast("Password reset accepted, OTP Sent!"); // notify with Toast
                   
                    // Verify OTP? 
                    // Redirect to OPT Verification Page
                    navigation.navigate('PasswordResetOTPScreen')
                    setIsLoading(false); // loading state change
                    setEmailOrPhone(''); // clear the email input field

                } else {
                    console.log(response.data); // what happened
                    notifyWithToast(response.data.message);  // notify with Toast
                    setIsLoading(false);
                }

            } else {

                throw new Error("Oops! an error has occurred!");

            }

        } catch (error) {
            console.log(error.message);
            // Notify with Toasts
            notifyWithToast("Oops? Something Went Wrong!");
            setIsLoading(false);
        }

    }


    /* Submit Phone Form Handler --- Reset Password with Phone Number */
    const onSubmitFormPhoneHandler = async (event) => {
        // some basic validation
        if (!emailOrPhone.trim()) {
            notifyWithToast("Enter a valid phone Number!");
            return;
        }
        // set loading state
        setIsLoading(true);


        // making a request to the API
        try {

            const response = await axios.post(`${baseUrl}/forgot-pwd`, {
                email : '',
                phone : emailOrPhone,  // Calling Code + phone:sliced
            });

            // checking the status
            if (response.status === 200) {

                 // IF status is successful
                if (response.data.status === "success"){ 

                    console.log(response.data);
                    notifyWithToast("Password reset accepted, OTP Sent!");  // notify with Toast

                    // Redirect to Verify OTP? 
                    // Redirect to OPT Verification Page
                    navigation.navigate('PasswordResetOTPScreen');

                    setIsLoading(false); // Loading state
                    setEmailOrPhone(''); // clearing the phone input field

                } else {

                    console.log(response.data);
                    notifyWithToast(response.data.message); // Notify with Toasts
                    setIsLoading(false); // Loading state change

                }

            } else {

                throw new Error("Oops! an error has occurred!");

            }

        } catch (error) {
            console.log(error.message);
            notifyWithToast("Oops? Something went wrong!");  // Notify With Toasts
            setIsLoading(false);
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
                                        maxLength={30}
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
                                        // onPress={ onSubmitFormPhoneHandler }
                                        onPress={ () => { console.log("Reset Password"); } }
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