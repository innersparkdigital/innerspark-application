import axios from 'axios';
import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { signin } from '../../features/user/userSlice'
import { 
    View, 
    Text, 
    StyleSheet, 
    Dimensions, 
    Image,
    ImageBackground,
    TextInput,
    ScrollView,
    StatusBar,
    ActivityIndicator,
    Pressable,

} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { appColors, parameters } from '../../global/Styles'
import { Button, Icon} from '@rneui/base'
import { useToast } from 'native-base';
import { storeItemLS } from '../../global/StorageActions';
import { appImages } from '../../global/Data';
import { APIGlobaltHeaders, baseUrlRoot, baseUrlV1 } from '../../api/LHAPI';
import LHGenericHeader from '../../components/LHGenericHeader';
import LHLoaderModal from '../../components/forms/LHLoaderModal';
import { isValidEmailAddress, isValidPhoneNumber, isValidEmailOrPhone } from '../../global/LHValidators'
import { normalizePhone } from '../../global/LHShortcuts';
import LHGenericFeatureModal from '../../components/LHGenericFeatureModal';


const baseUrl = baseUrlRoot + baseUrlV1; // Base URL for API requests
APIGlobaltHeaders(); // API Global headers

export default function SigninScreen({navigation}){

    const dispatch = useDispatch();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState(""); // represents email or phone number
    const [isFeatureModalVisible, setIsFeatureModalVisible] = useState(false); 
    // const [userToken, setUserToken] = useState(null); // do we need this ?

    const countryCodes = { 'ug' : '+256' }; // country calling code

    // Toast Notifications
    const notifyWithToast = (description) => {
        toast.show({
            description: description,
            duration: 2000,
        })
    }

    // Toggle Password Handler
    const togglePassword = () => { if (showPassword) { setShowPassword(false); } else { setShowPassword(true); } }

    // Name Handler - email or phone number
    const onChangeUsernameHandler = (username) => { setUsername(username); }

    // Password Handler
    const onChangePasswordHandler = (password) => { setPassword(password); }

    /* Validate Signin Inputs */
    const validateSigninInputs = () => {
        // validate email or phone number
        if (!isValidEmailOrPhone(username.trim())) {
            notifyWithToast("Enter a valid email or phone number.");
            return false;
        }
        // validate password
        if (password.trim().length < 3) {
            notifyWithToast("Enter a valid password.");
            return false;
        }
        
        return true;
    }


    /** Smart User Login Select
     * @param {event} event - The event object.
     * @returns {void}
    */
    const smartLoginSelect = async (event) => {

        // validate inputs
        if (!validateSigninInputs()) {
            return;
        }   

        setIsLoading(true);  // set loading state

        // select the login method based on the username (email or password)
        if (isValidEmailOrPhone(username)) {
           // check if provided username is email otherwise phone
           if (isValidEmailAddress(username)) {
              userLoginWithEmailHandler();  // login with email

           } else if (isValidPhoneNumber(username)) {
              userLoginWithPhoneHandler(); // login with phone

           }
        }
          
    }

    
    /** Login With Email Email Form Handler 
     * @param {event} event - The event object.
     * @returns {void}
    */
    const userLoginWithEmailHandler = async (event) => {
            
        // making a request to the API to login with email
        try {
            
            let trimmedEmail = username.toLocaleLowerCase().trim(); // trimmed email or username
            let trimmedPassword = password.trim(); // trimmed Password

            console.log("Email: ", trimmedEmail);
            console.log("Password: ", trimmedPassword);
           
            const response = await axios.post( `${baseUrl}/auth/login`, {
                email: trimmedEmail,
                password: trimmedPassword,
            });
            
            // checking the status
            if (response.status === 200) {

                // IF status is successful
                // JSON.stringify(response.data)
                if (response.data.status === "success"){

                    console.log(response.data); // just for debugging
                    
                    // redirect to OTP Screen
                    navigation.navigate(
                        'SigninOTPScreen', 
                        { 
                            userId: response.data.user.user_id,
                            loginData: {
                                type: 'email',
                                email: trimmedEmail,
                                password: trimmedPassword 
                            } 
                        }
                    );

                    setIsLoading(false);
                    setPassword(''); // reset password

                } else {
                    console.log(response.data); // what happened
                    notifyWithToast("Email or Password is incorrect!"); // Notify
                    setIsLoading(false);
                    setPassword(''); // reset sensitive fields
                }

            } else {

                throw new Error("Whoops! Something went wrong.");

            }


        } catch (error) {
            console.log(error.message);
            notifyWithToast("Whoops! Something went wrong."); // Notify with Toasts
            setIsLoading(false);
        }

    }




    /**
     * Login With Phone Number Form Handler
     * @param {event} event - The event object.
     * @returns {void}
     */
    const userLoginWithPhoneHandler = async (event) => {
        
        // making a request to the API to login with phone number
        try {
            
            let trimmedPhone = username.toLocaleLowerCase().trim(); // trimmed phone number
            // Normalize phone number
            let normalizedPhone = normalizePhone(trimmedPhone, countryCodes.ug);
            let trimmedPassword = password.trim(); // trimmed Password

            const response = await axios.post( `${baseUrl}/auth/login`, {
                phone: normalizedPhone,
                password: trimmedPassword,
            });
            
            // checking the status
            if (response.status === 200) {

                // IF status is successful
                // JSON.stringify(response.data)
                if (response.data.status === "success"){

                    console.log(response.data);
                    // redirect to OTP Screen
                    navigation.navigate(
                        'SigninOTPScreen', 
                        { 
                            userId: response.data.user.user_id,
                            loginData: {
                                type: 'phone',
                                phone: normalizedPhone,
                                password: trimmedPassword 
                            }  
                        }
                    );

                    setIsLoading(false);
                    setPassword(''); // reset password

                } else {
                    console.log(response.data); // what happened
                    setIsLoading(false);
                    notifyWithToast("Phone or Password is incorrect!"); // Notify
                    setPassword(''); // reset sensitive fields
                }

            } else {

                throw new Error("Oops! We encountered an error!");

            }


        } catch (error) {
            console.log(error.message);
            setIsLoading(false); // set loading state
            notifyWithToast("Oops! We encountered an error!"); // Notify with Toasts
        }

    }


    return(
       <SafeAreaView style={ styles.container }>
            <ImageBackground source={appImages.bgPatterns} style={{ flex: 1, backgroundColor:appColors.CardBackground }}>
                <View style={{ paddingVertical:parameters.headerHeightTinier }}>
                    <LHGenericHeader
                        title='Sign In' 
                        showTitle={false}
                        showLeftIcon={true}
                        leftIconPressed={ () => { navigation.goBack(); } } 
                    />
                </View>

                <ScrollView contentContainerStyle={{ flex:1, justifyContent:'center'}}>
                    <View style={{ paddingHorizontal:20, paddingVertical:10, paddingBottom:20 }}>

                        {/* Logo and Welcome Text */}
                        <View style={{ paddingVertical:2 }}>
                            <View style={{ justifyContent: "center", alignItems:"center" }}>
                                <Image source={appImages.logoDefault} style={{ width:280, height:140, resizeMode:'contain' }} />
                            </View>
                            <View style={{ justifyContent:'center', alignItems:'center', paddingVertical:10, paddingBottom:15 }}>
                                <Text style={{ fontSize:16, color:appColors.grey2, fontWeight:'500', paddingVertical:5 }}>
                                Your Journey to mental wellness
                                </Text>
                            </View>
                        </View>

                        <View style={{ paddingHorizontal:10 }}>

                            {/* Email, Phone Input Block */}
                            <View style={ styles.inputBlockRow }>
                                <View style={{ justifyContent: "center", alignItems:"center", paddingRight:10 }}>
                                    <Icon type="material-icons" name="alternate-email" color={appColors.grey4} size={25} />
                                </View>

                                <TextInput 
                                    placeholderTextColor={ appColors.grey3 } 
                                    style={{ flex:3, fontSize:15, color:appColors.black, paddingVertical:0 }}
                                    editable={!isLoading}
                                    placeholder='Email or Phone'
                                    value={username}
                                    maxLength={30}
                                    onChangeText={ onChangeUsernameHandler }
                                />  
                            </View>

                            {/* Password Input Block */}
                            <View style={ styles.inputBlockRow }>
                                <View style={{ justifyContent: "center", alignItems:"center", paddingRight:10 }}>
                                    <Icon type="material-community" name="lock"  color={appColors.grey4} size={25} />
                                </View>
                                <TextInput 
                                    placeholderTextColor={ appColors.grey3 } 
                                    style={{ flex:3, fontSize:15, color:appColors.black, paddingVertical:0 }}
                                    secureTextEntry={!showPassword} 
                                    editable={!isLoading}
                                    placeholder='Password' 
                                    value={password}
                                    onChangeText={ onChangePasswordHandler }
                                />  
                                <View style={{ justifyContent: "center", alignItems:"center", paddingLeft:10, }}>
                                    <Icon 
                                        type="material-community" 
                                        name={ showPassword ? "eye-off-outline" : "eye-outline" }  
                                        color={appColors.grey4} 
                                        size={25} 
                                        onPress={ () => togglePassword() }
                                    />
                                </View> 
                            </View>

                            {/* { isLoading && 
                                <View style={{ flexDirection:'row', justifyContent:'center', paddingVertical:5 }}>
                                    <ActivityIndicator style={{ marginHorizontal:5 }} color={appColors.AppBlue} />
                                    <Text style={{ color:appColors.black }}>Login in progress...</Text>
                                </View>
                            } */}
                            
                            <View style={{ paddingVertical:15 }}>
                                <Button 
                                    title="Sign In"
                                    buttonStyle={ parameters.appButtonXLBlue }
                                    titleStyle={ parameters.appButtonXLTitleBlue } 
                                    onPress={ 
                                        () => {
                                            
                                            // testing the feature modal
                                            // setIsFeatureModalVisible(true);

                                            // the username and password are global variables
                                            smartLoginSelect(); 
                                            
                                            // Just temporary fix
                                            // dispatch user token to the signin action
                                            
                                            /*
                                            storeItemLS(
                                                "userToken", 
                                                {
                                                    userId: "123456",
                                                    name: "Alphonse J",
                                                    email: "alphonse@juakaly.com",
                                                    phone: "+256700000000",
                                                }
                                            ); 
                                            */

                                            /*
                                            dispatch(signin({
                                                userId: "123456",
                                                name: "Alphonse J",
                                                email: "alphonse@juakaly.com",
                                                phone: "+256700000000",
                                            }));
                                            */

                                        } 
                                    }
                                /> 
                            </View>

                        </View>
                    
                        {/* Forgot Password Section */}
                        <View style={{  paddingVertical:5 }}>
                            <Pressable
                                style={{ flexDirection:'row', alignItems:'center', justifyContent:'center', }}
                                onPress={ 
                                    () => { 
                                        navigation.navigate('PasswordResetScreen'); 
                                    } 
                                }
                            >
                                <Text 
                                    style={{ fontSize:14, textAlign:'center', color:appColors.AppBlue, marginRight:5 }} 
                                >
                                    Forgot password?
                                </Text>
                                <Text style={{ fontSize:14, color:appColors.AppBlue, fontWeight:'bold' }}>Reset Password</Text>
                            </Pressable>
                        </View>

                        {/* Don't have an account? */}
                        <View style={{ justifyContent:'center', paddingVertical:5, flexDirection: 'row' }}>
                            <Text style={{ color:appColors.AppBlue }}>Don't have an account?</Text>
                            <Text 
                                style={{ color:appColors.AppBlue, fontWeight:'bold' }} 
                                onPress={ 
                                    () => { 
                                        navigation.navigate('SignupScreen'); 
                                    } 
                                }
                            > Sign up</Text>
                        </View>


                        {/* Terms of Service - with separate links */}
                        {/* <View style={{ justifyContent:'center', alignItems:'center', paddingVertical:15 }}>
                            <Text style={{ color:appColors.grey3, fontSize:12, textAlign:'center' }}>
                                By continuing, you accept our {' '}
                                <Text 
                                    style={{ color:appColors.AppBlue, textDecorationLine:'underline' }} 
                                    onPress={() => { navigation.navigate('TermsOfServiceScreen'); } }
                                >Terms of Service</Text>
                                {' '}and{' '}
                                <Text 
                                    style={{ color:appColors.AppBlue, textDecorationLine:'underline' }} 
                                    onPress={() => { navigation.navigate('PrivacyPolicyScreen'); } }
                                >Privacy Policy</Text>
                            </Text>
                        </View> */}
                       
                    </View>
                </ScrollView>

                {/** Generic Feature Modal */}
                <LHGenericFeatureModal 
                    isModVisible={ isFeatureModalVisible } 
                    visibilitySetter={setIsFeatureModalVisible} 
                    isDismissable={true}
                    title="Stay Tuned"
                    description="This feature is in progress. Check back soon."
                />

                {/* Loader Modal */}
                <LHLoaderModal visible={isLoading} message="Please wait, signing in..." transparent={false} />

            </ImageBackground>
        </SafeAreaView>
    )
}


// Local Styles
const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:appColors.CardBackground,
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

})