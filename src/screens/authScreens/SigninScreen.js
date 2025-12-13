import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signin } from '../../features/user/userSlice';
import { updateUserAvatar, updateUserDetails } from '../../features/user/userDataSlice';
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

} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appColors, parameters } from '../../global/Styles';
import { Button, Icon} from '@rneui/base';
import { useToast } from 'native-base';
import { storeItemLS } from '../../global/StorageActions';
import { appImages } from '../../global/Data';
import { AuthInstance } from '../../api/LHAPI';
import { resendVerificationCode } from '../../api/shared/auth';
import LHGenericHeader from '../../components/LHGenericHeader';
import LHLoaderModal from '../../components/forms/LHLoaderModal';
import LHLoginSuccessModal from '../../components/modals/LHLoginSuccessModal';
import { isValidEmailAddress, isValidPhoneNumber, isValidEmailOrPhone } from '../../global/LHValidators';
import { normalizePhone } from '../../global/LHShortcuts';
import LHGenericFeatureModal from '../../components/LHGenericFeatureModal';
import { isEmailVerified, isPhoneVerified } from '../../global/LHValidators';

export default function SigninScreen({navigation}){

    const dispatch = useDispatch();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState(""); // represents email or phone number
    const [isFeatureModalVisible, setIsFeatureModalVisible] = useState(false); 
    // const [userToken, setUserToken] = useState(null); // do we need this ?
    const [isLoadingAppData, setIsLoadingAppData] = useState(false); // Toggles App Home Data Loading states
    const [loginPayload, setLoginPayload] = useState(null); // user login payload data

    const [isLoggedInModalVisible, setIsLoggedInModalVisible] = useState(false); // Login Success Modal
    const [userTokenData, setUserTokenData] = useState(null);  // user token data
    const [userDetails, setUserDetails] = useState(null); // user details

    // country calling code
    const countryCodes = { 'ug' : '+256' }; // country calling code

    // Toast Notifications
    const notifyWithToast = (description) => {
        toast.show({
            description: description,
            duration: 1000,
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

        // select the login method based on the username (email or password)
        if (isValidEmailOrPhone(username)) {
           // check if provided username is email otherwise phone
           if (isValidEmailAddress(username)) {
              userLoginWithEmailHandler(); // login with email
           } else if (isValidPhoneNumber(username)) {
              userLoginWithPhoneHandler(); // login with phone
           }
        } else {
            notifyWithToast("Enter a valid email or phone number.");
            return;
        }
          
    }

    
    /** Login With Email Email Form Handler 
     * @param {event} event - The event object.
     * @returns {void}
    */
    const userLoginWithEmailHandler = async (event) => {

        setIsLoading(true); // set loading state
            
        // making a request to the API to login with email
        try {
            
            let trimmedEmail = username.toLocaleLowerCase().trim(); // trimmed email or username
            let trimmedPassword = password.trim(); // trimmed Password

            // testing console.log
            // console.log("User Login With Email")
            // console.log("Username: " + username);
            // console.log("Email: " + trimmedEmail);
            // console.log("Password: " + trimmedPassword);
           
            const response = await AuthInstance.post( '/auth/login', {
                email: trimmedEmail,
                password: trimmedPassword,
            });
            
            // checking the status
            if (response.status === 200) {

                // IF status is successful
                if (response.data.status === "success"){
                    console.log(response.data); // just for debugging

                    // Prepare the login payload data
                    setLoginPayload({
                        userId: response.data.user.user_id,
                        firstName: response.data.user.firstName,
                        lastName: response.data.user.lastName,
                        email: response.data.user.email,
                        phone: response.data.user.phoneNumber,
                        role: response.data.user.role,
                        email_verified: response.data.user.email_verified,
                        phone_verified: response.data.user.phone_verified,
                    });

                    // redirect to OTP Verification Screen if email is not verified 
                    if (response.data.user.email_verified === 0) {

                        // invoke resend verification code -- before redirecting to OTP Verification Screen
                        await resendVerificationCode(trimmedEmail);

                        // redirect to OTP Verification Screen
                        navigation.navigate(
                            'SigninOTPScreen', 
                            { 
                                userId: response.data.user.user_id,
                                loginData: {
                                    type: 'email',
                                    email: trimmedEmail,
                                    password: trimmedPassword 
                                }, 
                                loginPayload: {
                                    userId: response.data.user.user_id,
                                    firstName: response.data.user.firstName,
                                    lastName: response.data.user.lastName,
                                    email: response.data.user.email,
                                    phone: response.data.user.phoneNumber,
                                    role: response.data.user.role,
                                    email_verified: response.data.user.email_verified,
                                    phone_verified: response.data.user.phone_verified,
                                }
                            }
                        );

                    } else {

                        // Store Insider User token data
                        // get it from the response
                        setUserTokenData({
                            userId: response.data.user.user_id,
                            firstName: response.data.user.firstName,
                            lastName: response.data.user.lastName,
                            email: response.data.user.email,
                            phone: response.data.user.phoneNumber,
                            role: response.data.user.role,
                            email_verified: response.data.user.email_verified,
                            phone_verified: response.data.user.phone_verified,
                            
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
                            phone_verified: response.data.user.phone_verified,
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
                            phone_verified: response.data.user.phone_verified,
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
                            phone_verified: response.data.user.phone_verified,
                        });

                        // ### Implement Later -- When Endpoint Available - #KNEXT
                        // Run the getAppHomeData to get the user's app home data
                        // getAppHomeData({ dispatch:dispatch, userID:response.data.user.user_id, loadingSetter:setIsLoadingAppData });
                       
                        setIsLoggedInModalVisible(true); // Show the Logged In Success Modal
                       
                    }

                    setIsLoading(false); // Toggle Loading State
                    setPassword(''); // reset password

                } else {
                    console.log(response.data); // what happened?
                    notifyWithToast("Email or Password is incorrect!"); // Notify
                    setIsLoading(false);
                    setPassword(''); // reset sensitive fields
                }

            } else if (response.status === 400) {
                console.log(response.data); // what happened?
                notifyWithToast("Email or Password is incorrect!"); // Email or Password is incorrect!
                setIsLoading(false);
                setPassword(''); // reset sensitive fields
                
            } else {

                throw new Error("Whoops! Something went wrong.");

            }


        } catch (error) {
            console.log("Login Error:", error.message);
            console.log("Error Response:", error.response?.status, error.response?.data);
            
            // Better error handling for network issues
            if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                notifyWithToast("Request timed out. Please check your connection and try again.");
            } else if (error.response?.status === 524) {
                notifyWithToast("Server timeout. Please try again.");
            } else if (error.response?.status === 401 || error.response?.status === 403) {
                notifyWithToast("Authentication failed. Please check your credentials.");
            } else if (!error.response) {
                notifyWithToast("Network error. Please check your internet connection.");
            } else {
                notifyWithToast("Login failed. Check details and try again.");
            }
            
            setIsLoading(false);
            setPassword(''); // reset sensitive fields
        }

    }




    /**
     * Login With Phone Number Form Handler
     * @param {event} event - The event object.
     * @returns {void}
     */
    const userLoginWithPhoneHandler = async (event) => {

        setIsLoading(true); // set loading state

        // making a request to the API to login with phone number
        try {
            
            let trimmedPhone = username.toLocaleLowerCase().trim(); // trimmed phone number
            // Normalize phone number
            let normalizedPhone = normalizePhone(trimmedPhone, countryCodes.ug);
            let trimmedPassword = password.trim(); // trimmed Password

            const response = await AuthInstance.post( '/auth/login', {
                phone: normalizedPhone,
                password: trimmedPassword,
            });
            
            // checking the status
            if (response.status === 200) {

                // IF status is successful
                if (response.data.status === "success"){

                    console.log(response.data); // log response data

                     // Prepare the login payload data
                     setLoginPayload({
                        userId: response.data.user.user_id,
                        firstName: response.data.user.firstName,
                        lastName: response.data.user.lastName,
                        email: response.data.user.email,
                        phone: response.data.user.phoneNumber,
                        role: response.data.user.role,
                        email_verified: response.data.user.email_verified,
                        phone_verified: response.data.user.phone_verified,
                    });


                    // redirect to OTP Screen if phone is not verified
                    if (response.data.user.phone_verified === 0) {
                        navigation.navigate(
                            'SigninOTPScreen', 
                            { 
                                userId: response.data.user.user_id,
                                loginData: {
                                    type: 'phone',
                                    phone: normalizedPhone,
                                    password: trimmedPassword 
                                },
                                loginPayload: {
                                    userId: response.data.user.user_id,
                                    firstName: response.data.user.firstName,
                                    lastName: response.data.user.lastName,
                                    email: response.data.user.email,
                                    phone: response.data.user.phoneNumber,
                                    role: response.data.user.role,
                                    email_verified: response.data.user.email_verified,
                                    phone_verified: response.data.user.phone_verified,
                                } 
                            }
                        );

                    } else {
                        
                        // Store Insider User token data
                        // get it from the response
                        setUserTokenData({
                            userId: response.data.user.user_id,
                            firstName: response.data.user.firstName,
                            lastName: response.data.user.lastName,
                            email: response.data.user.email,
                            phone: response.data.user.phoneNumber,
                            role: response.data.user.role,
                            email_verified: response.data.user.email_verified,
                            phone_verified: response.data.user.phone_verified,
                            
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
                            phone_verified: response.data.user.phone_verified,
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
                            phone_verified: response.data.user.phone_verified,
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
                            phone_verified: response.data.user.phone_verified,
                        });

                        // ### Implement Later -- When Endpoint Available - #KNEXT
                        // Run the getAppHomeData to get the user's app home data
                        // getAppHomeData({ dispatch:dispatch, userID:response.data.user.user_id, loadingSetter:setIsLoadingAppData });
                       
                        setIsLoggedInModalVisible(true); // Show the Logged In Success Modal

                    }

                    setIsLoading(false); // Toggle Loading State
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
            console.log("Login Error:", error.message);
            console.log("Error Response:", error.response?.status, error.response?.data);
            
            // Better error handling for network issues
            if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                notifyWithToast("Request timed out. Please check your connection and try again.");
            } else if (error.response?.status === 524) {
                notifyWithToast("Server timeout. Please try again.");
            } else if (error.response?.status === 401 || error.response?.status === 403) {
                notifyWithToast("Authentication failed. Please check your credentials.");
            } else if (!error.response) {
                notifyWithToast("Network error. Please check your internet connection.");
            } else {
                notifyWithToast("Login failed. Check details and try again.");
            }
            
            setIsLoading(false); // set loading state
            setPassword(''); // reset sensitive fields
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

                                            // Select Login Method (Email or Phone)
                                            smartLoginSelect(); 
                                        } 
                                    }
                                /> 
                            </View>

                            {/* A temporary link to bypass the login and setup default user session data */}
                            {/*  Start of skip login section */}
                            {/* 
                            <View style={{ paddingVertical:15 }}>
                                <Button 
                                    title="Skip Login"
                                    buttonStyle={ parameters.appButtonXLBlue }
                                    titleStyle={ parameters.appButtonXLTitleBlue } 
                                    onPress={ 
                                        () => {
                                            // Temporary skip login with hardcoded test data
                                            // Using same field structure as UserLoginWithEmailHandler
                                            const defaultUserTokenData = {
                                                userId: 'TestUser-123',
                                                firstName: 'Alpha',
                                                lastName: 'Onyekanwa',
                                                email: 'alpha@innersparkafrica.us',
                                                phone: '+256700000000',
                                                role: 'user',
                                                email_verified: 1,
                                                phone_verified: 1,
                                            };

                                            // Store user token data (same as UserLoginWithEmailHandler)
                                            storeItemLS("userToken", defaultUserTokenData);
                                            
                                            // Dispatch signin action (same as UserLoginWithEmailHandler)
                                            dispatch(signin(defaultUserTokenData));
                                            
                                            // Dispatch update user details (same as UserLoginWithEmailHandler)
                                            dispatch(updateUserDetails(defaultUserTokenData));
                                            
                                            // Store user details in local storage (same as UserLoginWithEmailHandler)
                                            storeItemLS("userDetailsLS", defaultUserTokenData);
                                            
                                            // Navigate to home (bypassing the success modal for testing)
                                            // navigation.replace('HomeScreen');
                                        } 
                                    }
                                /> 
                            </View>
                            */}
                            {/*  End of skip login section */}
                            
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

                        {/* Test Therapist Login Link */}
                        <View style={{ justifyContent:'center', paddingVertical:10, paddingTop:20 }}>
                            <Pressable
                                style={{ flexDirection:'row', alignItems:'center', justifyContent:'center' }}
                                onPress={ 
                                    () => { 
                                        // Test therapist login with default data
                                        const therapistTestData = {
                                            userId: 'TestTherapist-001',
                                            firstName: 'Hellen',
                                            lastName: 'Mugyenyi',
                                            email: 'therapist@innerspark.test',
                                            phone: '+256700111222',
                                            role: 'therapist',
                                            email_verified: 1,
                                            phone_verified: 1,
                                        };

                                        // Store user token data
                                        storeItemLS("userToken", therapistTestData);
                                        
                                        // Dispatch signin action
                                        dispatch(signin(therapistTestData));
                                        
                                        // Dispatch update user details
                                        dispatch(updateUserDetails(therapistTestData));
                                        
                                        // Store user details in local storage
                                        storeItemLS("userDetailsLS", therapistTestData);
                                        
                                        // Show success message
                                        notifyWithToast("🩺 Therapist mode activated!");
                                    } 
                                }
                            >
                                <Icon type="material" name="medical-services" color={appColors.grey3} size={14} style={{ marginRight:5 }} />
                                <Text style={{ fontSize:12, color:appColors.grey3, textDecorationLine:'underline' }}>
                                    Try Therapist Dashboard
                                </Text>
                            </Pressable>
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

                {/* Generic Feature Modal */}
                <LHGenericFeatureModal 
                    isModVisible={ isFeatureModalVisible } 
                    visibilitySetter={setIsFeatureModalVisible} 
                    isDismissable={true}
                    title="Stay Tuned"
                    description="This feature is in progress. Check back soon."
                />

                {/* Login Success Modal */}
                <LHLoginSuccessModal 
                    isModVisible={isLoggedInModalVisible} 
                    isLoading={isLoadingAppData}
                    title="Welcome aboard!"
                    description="You’re all set!"
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