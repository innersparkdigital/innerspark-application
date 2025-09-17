import axios from 'axios';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateGender } from '../../features/flow/signupFlowSlice';
import { 
    View, 
    Text, 
    StyleSheet, 
    Dimensions, 
    Image,
    ImageBackground,
    TextInput,
    ScrollView,
    Pressable,
    ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { Button, Icon, BottomSheet} from '@rneui/base';
import { useToast } from 'native-base';
import { appImages } from '../../global/Data';
import LHGenericHeader from '../../components/LHGenericHeader';
import { APIGlobaltHeaders, baseUrlRoot, baseUrlV1 } from '../../api/LHAPI';
import LHPhoneInput from '../../components/forms/LHPhoneInput';
import { 
    isValidPhoneNumber, 
    isValidEmailAddress, 
    isValidPassword, 
    isValidName 
} from '../../global/LHValidators';
import LHLoaderModal from '../../components/forms/LHLoaderModal';
import LHGenericFeatureModal from '../../components/LHGenericFeatureModal';

import Config from 'react-native-config';

const baseUrl = baseUrlRoot + baseUrlV1; // Base URL for API requests
APIGlobaltHeaders(); // API Global headers

export default function SignupScreen({navigation}){

    const dispatch = useDispatch(); // dispatch actions
    const toast = useToast();
    
    // Redux selectors
    const storedGender = useSelector(state => state.signupFlow.gender); // gender default value
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showVerifyPassword, setShowVerifyPassword] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isFeatureModalVisible, setIsFeatureModalVisible] = useState(false); // Feature Modal

    // Signup Inputs
    const [name, setName] = useState(""); // full name 
    const [firstName, setFirstName] = useState(""); // first name
    const [lastName, setLastName] = useState(""); // last name
    const [gender, setGender] = useState(storedGender); // gender default value
    const [email, setEmail] = useState(""); // email address    
    const [phone, setPhone] = useState(""); // phone number
    const [password, setPassword] = useState(""); // password
    const [verifyPassword, setVerifyPassword] = useState(""); // verify password

    // Phone related controls
    const [isCountrySupported, setIsCountrySupported] = useState(true);
    const [formattedPhone, setFormattedPhone] = useState(""); // Formatted phone


    // Toggle Password Handler
    const togglePassword = () => { 
        showPassword ? setShowPassword(false) : setShowPassword(true); 
    }

    // Toggle Verify Password
    const toggleVerifyPassword = () => {
        showVerifyPassword ? setShowVerifyPassword(false) : setShowVerifyPassword(true);
    }

    // Gender handlers with Redux dispatch
    const handleMaleSelection = () => { 
        setGender("M"); 
        dispatch(updateGender("M")); 
        console.log("Gender: ", gender);
    }
    const handleFemaleSelection = () => { 
        setGender("F"); 
        dispatch(updateGender("F")); 
        console.log("Gender: ", gender);
    }

    // Name Handler
    const onChangeNameHandler = (name) => { setName(name); }   

    // First Name Handler
    const onChangeFirstNameHandler = (firstName) => { setFirstName(firstName); }   

    // Last Name Handler
    const onChangeLastNameHandler = (lastName) => { setLastName(lastName); }   

    // Email Handler
     const onChangeEmailHandler = (email) => { setEmail(email); }

    // Get Formatted Gender value
    const getGender = (gender) => { return (gender == 'M') ? 'Male' : 'Female'; }

    // Phone Handler
    const onChangePhoneHandler = (phone) => { setPhone(phone); }

    // Password Handler
    const onChangePasswordHandler = (password) => { setPassword(password); }            

    // Verify Password Handler
    const onChangeVerifyPasswordHandler = (password) => { setVerifyPassword(password); }

    // Toast Notifications
    const notifyWithToast = (description) => {
        toast.show({
            description: description,
            duration: 1000,
        })
    }


    // Test if env variables are being loaded
    useEffect(() => {
        console.log("API Base URL: ", Config.API_BASE_URL);
        console.log("API Version: ", Config.API_VERSION);
        console.log("API Auth Token: ", Config.AUTH_TOKEN);
    }, []);


    /*
    * Signup Validation
    */
    const validateSignupInputs = () => {
        // Validate Name
        if ( !isValidName(firstName) ) {
            notifyWithToast("Enter valid First Name.");
            return false;
        }

        // Validate Last Name
        if ( !isValidName(lastName) ) {
            notifyWithToast("Enter valid Last Name.");
            return false;
        }

        // Validate Email
        if ( !isValidEmailAddress(email) ) {
            notifyWithToast("Enter valid Email.");
            return false;
        }


        // check if country is supported
        if ( !isCountrySupported ) {
            notifyWithToast("Country not supported yet!");
            return false;
        }

        // Validate Phone
        if ( !isValidPhoneNumber(formattedPhone) ) {
            notifyWithToast("Enter valid Phone Number.");
            return false;
        }

        // Validate Password
        if ( !isValidPassword(password) ) {
            notifyWithToast("Password must be at least 8 characters");
            return false;
        }

        // Validate Password and Verify Password
        if ( password != verifyPassword ) {
            notifyWithToast("Passwords do not match!");
            return false;
        }

        // All inputs are valid
        return true;

    }


    /** 
     * New User Signup Handler
     * This method creates a new Innerspark User
     */
    const UserSignupHandler = async (event) => {
        
        // Validate Signup Inputs
        if ( !validateSignupInputs() ) {
            return;
        }

        setIsLoading(true); // Set loading state
        // reset password and verify password toggles
        setShowPassword(false);
        setShowVerifyPassword(false);



           // testing state variables
        //    console.log("--------- User Signup Data Before Submit ---------");
        //    console.log("Firstname: ", firstName);
        //    console.log("Lastname: ", lastName);
        //    console.log("Email: ", email);
        //    console.log("Password: ", password);
        //    console.log("Confirm Password: ", verifyPassword);
        //    console.log("Gender: ", getGender(gender));
        //    console.log("Formatted Phone: ", formattedPhone);
        //    console.log("--------- User Signup Data---------");


        // making a request to the API for signup
        try {

            const response = await axios.post( `${baseUrl}/auth/register`, {
                firstName : firstName.trim(),
                lastName : lastName.trim(),
                email : email.trim(),
                phoneNumber : formattedPhone, // Formatted phone
                password : password.trim(),
                role : "user", // We are creating a new user
                gender : getGender(gender) // Gender Extraction

            });
            
            // checking the status
            if (response.status === 200) {

                // IF status is successful
                // JSON.stringify(response.data)
                if (response.data.status == "success"){

                    console.log(response.data);
                    setIsLoading(false); // Set loading state
                    setShowSuccessModal(true); // Show Success modal

                    // Login the user with email or phone automatically

                    setFirstName(''); // Clear first name
                    setLastName(''); // Clear last name
                    setPhone(''); // Clear phone
                    setEmail(''); // Clear email
                    setPassword(''); // Clear password
                    setVerifyPassword(''); // Clear verify password

                } else {

                    console.log(response.data);
                    setIsLoading(false); // Set loading state
                    notifyWithToast(response.data.message);  // Notify with Toasts
                   
                    // clear sensitive inputs
                    setPassword(''); // Clear password
                    setVerifyPassword(''); // Clear verify password
                }
                
            } else {

                // Can we find out what status code it is? 
                throw new Error("Whoops! Something went wrong.");

            }

        } catch (error) {
            console.log(error.message); // Customize error for proper user experience
            setIsLoading(false); // Set loading state
            notifyWithToast("Whoops! Something went wrong."); // Notify with Toasts
        }

}
    

    return(
       <SafeAreaView style={ styles.container }>
            <ImageBackground source={appImages.laundryBg} style={{ flex: 1, }}>
                <View style={{ paddingVertical:parameters.headerHeightTinier }}>
                    <LHGenericHeader
                        title='Signup' 
                        showTitle={false}
                        showLeftIcon={true}
                        leftIconPressed={ () => { navigation.goBack(); } } 
                    />
                </View>
               <ScrollView>
                    <View style={{ flex:1, paddingHorizontal:25, paddingVertical:5 }}>
                        <View style={{ justifyContent: "center", alignItems:"center" }}>
                            <Image source={appImages.logoRecBlue} style={{ width:280, height:60, resizeMode:'contain' }} />
                        </View>
                        <View style={{ justifyContent:'center', alignItems:'center', paddingVertical:15 }}>
                            <Text style={{ fontSize:18, color:appColors.AppBlue, fontWeight:'500', paddingVertical:5, textAlign:'center' }}>
                                Start Your Wellness Journey Today!
                            </Text>
                            <Text style={{ fontSize:15, color:appColors.grey2, fontWeight:'400', paddingVertical:5, textAlign:'center' }}>
                                Create an account to get started
                            </Text>
                        </View>

                        {/* First Name Input block */}
                        <View style={ styles.inputBlockRow }>
                            <View style={{ justifyContent: "center", alignItems:"center", paddingRight:10 }}>
                                <Icon type="material-icons" name="person"  color={appColors.grey4} size={25} />
                            </View>
                            <TextInput 
                                placeholderTextColor={ appColors.grey3 } 
                                style={{ flex:3, fontSize:16, color:appColors.AppBlue, paddingVertical:0 }}
                                editable={!isLoading}
                                placeholder='First Name' 
                                value={firstName}
                                maxLength={30}
                                onChangeText={ onChangeFirstNameHandler }
                            />  
                        </View>
                            
                        {/* Last Name Input block */}
                        <View style={ styles.inputBlockRow }>
                            <View style={{ justifyContent: "center", alignItems:"center", paddingRight:10 }}>
                                <Icon type="material-icons" name="person"  color={appColors.grey4} size={25} />
                            </View>
                            <TextInput 
                                placeholderTextColor={ appColors.grey3 } 
                                style={{ flex:3, fontSize:16, color:appColors.AppBlue, paddingVertical:0 }}
                                editable={!isLoading}
                                placeholder='Last Name' 
                                value={lastName}
                                maxLength={30}
                                onChangeText={ onChangeLastNameHandler }
                            />  
                        </View>
                            
                        {/* Gender Input block */}
                        <View style={{ flexDirection:'row', marginVertical:5, justifyContent:'space-between' }}>
                            <View style={{ flex:1, paddingHorizontal:2, marginRight:5 }}>
                                <Button 
                                    title="Male"
                                    buttonStyle={gender == "M" ? styles.genderButtonActive : styles.genderButtonInactive}
                                    titleStyle={gender == "M" ? styles.genderButtonTitleActive : styles.genderButtonTitleInactive}
                                    iconPosition='left'
                                    iconContainerStyle={{ marginRight: 15 }}
                                    icon={{ name: 'male', type: 'font-awesome', size: 18, color: appColors.grey4 }}
                                    onPress={handleMaleSelection}
                                />
                            </View>

                            <View style={{ flex:1, paddingHorizontal:2, marginLeft:5 }}>
                                <Button 
                                    title="Female"
                                    buttonStyle={ gender == "F" ? styles.genderButtonActive : styles.genderButtonInactive }
                                    titleStyle={gender == "F" ? styles.genderButtonTitleActive : styles.genderButtonTitleInactive}
                                    iconPosition='left'
                                    iconContainerStyle={{ marginRight: 15 }}
                                    icon={{ name: 'female', type: 'font-awesome', size: 18, color: appColors.grey4 }}
                                    onPress={handleFemaleSelection}
                                />
                            </View>
                        </View>

                       {/* Email Input Block */}
                       <View style={ styles.inputBlockRow }>
                            <View style={{ justifyContent: "center", alignItems:"center", paddingRight:10 }}>
                                <Icon type= "material-community" name= "email"  color= {appColors.grey4} size= {25} />
                            </View>
                            <TextInput 
                                placeholderTextColor={ appColors.grey3 } 
                                style={{ flex:3, fontSize:16, color:appColors.AppBlue, paddingVertical:0 }}
                                placeholder='Your email address' 
                                keyboardType='email-address'
                                editable={!isLoading}
                                value={email}
                                onChangeText={ onChangeEmailHandler }
                            />   
                        </View>

                        {/* Phone Input Block */}
                        <LHPhoneInput
                            placeholder="78xxxxxxx"
                            inputValue={phone}
                            inputValueSetter={setPhone}
                            countrySupportSetter={setIsCountrySupported}
                            formattedValueSetter={setFormattedPhone}
                            isInputEditable={!isLoading}

                        />

                        {/* Password Input Block */}
                        <View style={ styles.inputBlockRow }>
                            <View style={{ justifyContent: "center", alignItems:"center", paddingRight:10 }}>
                                <Icon type="material-community" name="lock"  color={appColors.grey4} size= {25} />
                            </View>

                            <TextInput 
                                placeholderTextColor={ appColors.grey3 } 
                                style={{ flex:3, fontSize:16, color:appColors.AppBlue, paddingVertical:0 }}
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

                        {/* Verify Password Input Block */}
                        <View style={ styles.inputBlockRow }>
                            <View style={{ justifyContent: "center", alignItems:"center", paddingRight:10 }}>
                                <Icon type="material-community" name="lock"  color= {appColors.grey4} size= {25} />
                            </View>

                            <TextInput 
                                placeholderTextColor={ appColors.grey3 } 
                                style={{ flex:3, fontSize:16, color:appColors.AppBlue, paddingVertical:0 }}
                                secureTextEntry={!showVerifyPassword} 
                                editable={!isLoading}
                                placeholder='Confirm Password' 
                                value={verifyPassword}
                                onChangeText={ onChangeVerifyPasswordHandler }
                                
                            />  

                            <View style={{ justifyContent: "center", alignItems:"center", paddingLeft:10, }}>
                                <Icon 
                                    type="material-community" 
                                    name={ showVerifyPassword ? "eye-off-outline" : "eye-outline" }  
                                    color={appColors.grey4} 
                                    size={25} 
                                    onPress={ () => toggleVerifyPassword() }
                                />
                            </View> 
                        </View>

                        {/* Terms of Service */}
                        <View style={{ justifyContent:'center', alignItems:'center', paddingVertical:15, flexDirection: 'row' }}>
                            <Text style={{ color:appColors.grey3, fontSize:12, textAlign:'center', lineHeight:18 }}>By signing up, you accept our
                                <Text 
                                    style={{ color:appColors.AppBlue, fontSize:12, textDecorationLine:'underline' }} 
                                    onPress={ 
                                        () => { 
                                            navigation.navigate('TermsOfServiceScreen');
                                        } 
                                    }
                                > Terms of Service.</Text>
                                <Text> Learn more about the use of your data in our </Text> 
                                <Text 
                                    style={{ color:appColors.AppBlue, fontSize:12, textDecorationLine:'underline' }}
                                    onPress={ 
                                        () => { 
                                            navigation.navigate('PrivacyPolicyScreen');
                                        } 
                                    }
                                >Privacy Policy</Text>.
                            </Text>
                        </View>

                        <View style={{ paddingVertical:15 }}>
                            <Button 
                                title="Sign Up"
                                buttonStyle={ parameters.appButtonXLBlue }
                                titleStyle={ parameters.appButtonXLTitleBlue } 
                                disabled={ isLoading }
                                onPress={ 
                                    () => {
                                        // Proceed to signup now
                                        UserSignupHandler();

                                        // testing Generic modal
                                        // setIsFeatureModalVisible(true);
                                        
                                    } 
                                }  
                            /> 
                        </View>
                        
                        {/* Already have an Account? */}
                        <View style={{ justifyContent:'center', paddingVertical:10, flexDirection: 'row' }}>
                            <Text style={{ color:appColors.AppBlue }}>Already have an account? </Text>
                            <Text 
                                style={{ color:appColors.AppBlue, fontWeight:'bold' }} 
                                onPress={ () => { navigation.navigate('SigninScreen') } }
                            >Sign In</Text>
                        </View>

                    </View>
                </ScrollView>

                {/** Generic Feature Modal */}
                <LHGenericFeatureModal 
                    isModVisible={ isFeatureModalVisible } 
                    visibilitySetter={setIsFeatureModalVisible} 
                    isDismissable={true}
                    title="Stay Tuned"
                    description="Features currently under development. Please try again later."
                />

                {/* LH Fullscreen Loader Modal */}
                <LHLoaderModal 
                    visible={isLoading} 
                    message="Getting Your Account Ready..." 
                />

              {/* Account Created Success Modal  */}
              <BottomSheet
                    // containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.5)' }}
                    containerStyle={{ backgroundColor: appColors.CardBackground }}
                    modalProps = {{
                        presentationStyle:"overFullScreen",
                        visible: showSuccessModal,
                        //transparent:false,
                    }} 
               >

                    <View style={{ ...parameters.doffeeModalContainer, paddingVertical:180 }}>
                        <View style={{ paddingVertical:15, }}>

                            {/* Modal Content */}
                            <View style={{ flex:1, justifyContent:"center", alignItems:"center", paddingVertical:30 }}>
                                {/* <View style={{ justifyContent: "center", alignItems:"center", paddingVertical:20, }}>
                                    <Image source={appImages.logoRound} style={{ width:100, height:80, resizeMode:'contain' }} />
                                </View> */}

                                <View style={{ justifyContent: "center", alignItems:"center", paddingVertical:20 }}>
                                    <Icon type="font-awesome-5" name="user-check" color={appColors.AppBlue} size={80} />
                                </View>

                                <View style={{ marginVertical:10, paddingHorizontal:5 }}>
                                    <Text style={{ fontSize:18, textAlign:'center', paddingVertical:5, color:appColors.AppBlue, fontFamily:appFonts.headerTextBold }}>
                                        Excited to have you join us! 
                                    </Text>
                                    <Text style={{ fontSize:22, textAlign:'center', fontWeight:'bold', paddingVertical:5, color:appColors.AppBlue, fontFamily:appFonts.headerTextExtraBold }}>
                                        Welcome, let’s get started!
                                    </Text>
                                </View>
                            </View>

                            {/* The following options  */}
                            <View style={{ flex:1, justifyContent:"center", marginVertical:15, paddingHorizontal:10, }}>
                                <View style = {{ marginHorizontal:15, marginVertical:15, justifyContent:'center', alignItems:'center' }}>
                                    <Pressable 
                                        style={ styles.roundButton } 
                                        onPress={ 
                                            () => { 

                                                setShowSuccessModal(false);
                                                // Login the user or Navigate to HomeScreen
                                                // You can clear the stack to disable Going back
                                                navigation.popToTop(); // This clear stack history
                                                navigation.navigate('SigninScreen'); // Redirect to Signin Page
                                                // dispatch(signin(userTokenData));

                                            } 
                                        }>
                                        <Icon name="arrow-forward" type="material-icons" color={appColors.CardBackground} size={40} />
                                    </Pressable>   
                                </View> 
                            </View>

                        </View>

                    </View>
                </BottomSheet>
                {/* -- Account Created Success Modal ends */}

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

    roundButton: {
        width:50,
        height:50,
        backgroundColor:appColors.AppBlue,
        padding:5,
        borderRadius:60,
        alignItems:'center',
        justifyContent:'center'
   },

    genderButtons: {
        paddingHorizontal:20,
        // backgroundColor:' pink',
        flex:1, 
        width: '100%',
        borderRadius: 25,

    },

    // Custom Gender Button Styles
    genderButtonActive: {
       // copy the styles from appButtonXLBlue
       // paddingHorizontal:20,
       // backgroundColor:' pink',
       // flex:1, 
       // width: '100%',
       ...parameters.appButtonXLBlue,
       borderRadius: 25,
       height:45,
    },

    genderButtonInactive: {
       // copy the styles from appButtonXLOutline
       // paddingHorizontal:20,
       // backgroundColor:' pink',
       // flex:1, 
       //width: '100%',
       
       ...parameters.appButtonXLOutline,
       borderRadius: 25,
       height:45,
    },

    genderButtonTitleActive: {
        // copy the styles from appButtonXLTitleBlue
        ...parameters.appButtonXLTitle,
        color: appColors.grey4,
        fontWeight:"600",
    },

    genderButtonTitleInactive: {
        // copy the styles from appButtonXLTitle
        ...parameters.appButtonXLOutlineTitle,
        color: appColors.grey4,
        fontWeight:"600",
    },

})