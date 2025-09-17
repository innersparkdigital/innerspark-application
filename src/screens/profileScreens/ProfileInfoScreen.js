/**
 * App - Profile Info Screen
 */
import axios from 'axios';
import React, { useState, useEffect, useCallback }  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserDetails } from '../../features/user/userDataSlice';
import { appColors, parameters } from '../../global/Styles';
import { useToast } from 'native-base';
import { getAppHomeData } from '../../api/LHFunctions';
import { 
  StatusBar,
  SafeAreaView,
  ScrollView,
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Linking, 
  Alert, 
  Pressable,
  ImageBackground,
  TextInput,
  ActivityIndicator,

} from 'react-native';
import { Icon, Button, BottomSheet, Avatar } from '@rneui/base';
import { appImages, appLinks } from '../../global/Data';
import LHGenericHeader from '../../components/LHGenericHeader';
import { appFonts } from '../../global/Styles';
import { createFormData, notifyWithToast } from '../../global/LHShortcuts';
import { profileInstance, APIGlobaltHeaders, baseUrl } from '../../api/LHAPI';
import { launchCamera , launchImageLibrary} from 'react-native-image-picker';
import { isValidPhoneNumber, isValidEmailAddress } from '../../global/LHValidators';
import LHLoaderModal from '../../components/forms/LHLoaderModal';
import LHPhoneInput from '../../components/forms/LHPhoneInput';


APIGlobaltHeaders(); // Call API Global Headers



/**
 * Phone and Email Verification status component
 * @param {string} type - The type of verification (e.g., 'Email', 'Phone')
 * @param {boolean} isVerified - The verification status
 * @param {function} onVerifyPress - The function to call when the verification button is pressed
 * @returns {JSX.Element} - The verification status component
 */
const VerificationStatus = ({ type, isVerified, onVerifyPress }) => {
    // Convert numeric values to boolean
    const verified = Boolean(Number(isVerified));
    
    return (
        <TouchableOpacity 
            style={verified ? styles.verifiedBadge : styles.verifyButton} 
            onPress={!verified ? onVerifyPress : null}
            disabled={verified}
        >
            <Text style={verified ? styles.verifiedText : styles.verifyButtonText}>
                {verified ? 'Verified' : 'Verify Now'}
            </Text>
        </TouchableOpacity>
    );
};


/**
 * Check if the phone or email is verified
 * @param {number} isVerified - The verification status (eg. 1 or 0)
 * @returns {boolean} - The verification status
 */
const isThisVerified = (isVerified) => {
    // Convert numeric values to boolean
    const verified = Boolean(Number(isVerified));
    return verified;
};



// Edit Name Content Box
const EditNameContent = ({ onCancelPress, updatingStatus, nameValue, onChangeHandler, onApplyPress }) => {
    return (
        <View>
            <View style={{ }}>
                <Text style={ styles.editHeaderTitle }>Update Name</Text>
                <View style={ styles.editRow }>
                  <TextInput 
                        placeholderTextColor={ appColors.grey3 } 
                        style={{ flex:3, fontSize:16, color:appColors.AppBlue, paddingVertical:0, paddingHorizontal:10, fontFamily:appFonts.buttonTextRegular }}
                        placeholder='Enter your name' 
                        value={nameValue}
                        maxLength={60}
                        autoCapitalize='words'
                        onChangeText={ onChangeHandler } 
                    />  

                    { updatingStatus && <ActivityIndicator style={{ marginHorizontal:5 }} color={appColors.AppBlue} size={20} /> }
                </View>
            </View>

            {/* The Update controls  */}
            <View style={ styles.editControlsContainer }>
                <Pressable onPress={ onCancelPress } style={ styles.editControlsButtonL }>
                    <Text style={ styles.editControlsButtonTextL }>Cancel</Text>
                </Pressable>
                <Pressable onPress={ onApplyPress } style={ styles.editControlsButtonR }>
                    <Text style={ styles.editControlsButtonTextR }>Update</Text>
                </Pressable>
            </View>

        </View> 

 )
}




export default function ProfileInfoScreen({ navigation }){
     
    const dispatch = useDispatch();
    const toast = useToast();
    const userDetails = useSelector(state => state.userData.userDetails); // User details from redux store
    const userAvatar = useSelector(state => state.userData.userDetails.image); // User avatar from redux store

    const [tempAvatar, setTempAvatar] = useState(null);
    const [uploadingProfile, setUploadingProfile] = useState(false);

     // Profile Information fields
     const userNumber = useSelector(state => state.userData.userDetails.phone); // Phone from App Session
     const userEmail = useSelector(state => state.userData.userDetails.email); // email from app session 
 
     const [nameUpdate, setNameUpdate] = useState(userDetails.name);
     const [phoneUpdate, setPhoneUpdate] = useState(userNumber? userNumber.slice(4, userNumber.length) : "");
     const [emailUpdate, setEmailUpdate] = useState(userEmail? userEmail : "");

    // display the profile image if user has an image avatar
    const [editProfile, setEditProfile] = useState(false);
    const [editProfileImage, setEditProfileImage] = useState(false);

    // Phone related controls
    const [isCountrySupported, setIsCountrySupported] = useState(true);
    const [formattedPhone, setFormattedPhone] = useState(userNumber? userNumber : ""); // Formatted phone -- default userNumber
 
 
    // Validation errors
    const [nameError, setNameError] = useState(""); // name validation error
 
    const [isImageSourceModalVisible, setIsImageSourceModalVisible] = useState(false); // The Image Source Modal State
    const [isEditPhoneModalVisible, setIsEditPhoneModalVisible] = useState(false); // Edit Phone modal
    const [isEditEmailModalVisible, setIsEditEmailModalVisible] = useState(false); // Edit Email Modal
    const [isEditNameModalVisible, setIsEditNameModalVisible] = useState(false); // Edit Name Modal
 
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [isLoadingPhone, setIsLoadingPhone] = useState(false); // Phone Loading state
    const [isLoadingEmail, setIsLoadingEmail] = useState(false); // Email Loading state
    const [isUpdatingName, setIsUpdatingName] = useState(false); // updating Name state


    // Name update handler
    const onChangeNameUpdate = (name) => { setNameUpdate(name); }

    // Email update handler
    const onChangeEmailUpdate = (email) => { setEmailUpdate(email); }


     // Profile Photo Options
     const profileOptions = {
        mediaType: 'photo',
        maxWidth: 800,
        maxHeight: 800,
        selectionLimit: 1,
    }


    /** Pick Image from  - Photo gallery */
    const nxtLaunchLibrary = async () => {
        const result = await launchImageLibrary(profileOptions);

        // check if the user cancelled
        if (result.didCancel) {
            // console.log("The user Cancelled! --- Do Nothing!"); // just do nothing! // ##DEVLOG
        }

        // check if the result has asset object
        if (result.assets) {
            // assets data
            setTempAvatar(result.assets[0]);
            setEditProfileImage(true); // because there is some image data

            //const filename = result.assets.filename;
            //const type = result.assets.type;
            //const uri = result.assets.uri;

        }
    }



     /** Pich Image from Camera -- Launch Camera */
     const nxtLaunchCamera = async () => {
        const photoResult = await launchCamera(profileOptions);
    
        // check if the user cancelled
        if (photoResult.didCancel) {
          // console.log("The user Cancelled! --- Do Nothing!"); // Just do nothing! // ##DEVLOG
        }
    
         // check if the result has asset object
         if (photoResult.assets) {
          setTempAvatar(photoResult.assets[0]);  // assets data
          setEditProfileImage(true); // because there is some image data
          
        }
    
    }



     /** Handle Profile Photo Upload */
    const handleProfileUpload = async () => {

        setUploadingProfile(true); // loading state

        try {
            // the form data
            // const userImageData = createFormData(tempAvatar, 7281899149016 ); // the form data
            const userImageData = createFormData(tempAvatar, userDetails.userId ); // the form data --- using current user Id
            // console.log(userImageData);
            const response = await profileInstance.post(`/update-avatar`, userImageData );

            // check the response
            if ( response.status === 200 ) {

                // console -- debug
                // console.log(response.data); // ##DEVLOG
                
                // Success or Failure ?
                if ( response.data.status == "success" ) {
                    // Profile Has been updated successfully
                    getAppHomeData({ dispatch:dispatch, userID:userDetails.userId });
                    notifyWithToast(toast, 'Profile Image Updated Successfully!');

                    // clear the temp avatar
                    setTempAvatar(null);
                    
                    setUploadingProfile(false);
                    setEditProfileImage(false);

                } else {
                    // Profile updated failed
                    notifyWithToast(toast, 'Profile Image Update Failed!');

                    // clear the temp avatar
                    setTempAvatar(null);
                
                    setUploadingProfile(false);
                    setEditProfileImage(false);

                }

            } else {
                // did something happen ?
                throw new Error("There's been an error somewhere!");
            }

        } catch (error) {
            console.log(error);
            notifyWithToast(toast, "Something went wrong! Please try again.");
            setUploadingProfile(false);
            setEditProfileImage(false);

        }

    }



    /**
     * Confirm Phone Number Update Handler
     * This handles the phone update process
     */
        const confirmPhoneUpdate = async () => {

            // console.log("formattedPhone: ", formattedPhone);
            //console.log("phone update: ", phoneUpdate);

            // Validate phone number 
            if ( !isValidPhoneNumber(formattedPhone) ) {
                notifyWithToast(toast, "Enter Valid Phone Number.", "top");
                return;
            }

            // check if phone is the same as the old one
            if ( formattedPhone === userDetails.phone ) {
                notifyWithToast(toast, "The phone number remains the same.", "top");
                setIsEditPhoneModalVisible(false); // Hide the phone edit modal
                return;
            }
        
            
            // set updating email state
            setIsLoadingPhone(true);
            
            // making a request to the API
            try {
    
                const response = await axios.post( `${baseUrl}/update-phone`, {
                    user : userDetails.userId,
                    phone : formattedPhone,
                });
                
                // checking the status
                if (response.status === 200) {
                    // IF status is successful
                    if (response.data.status === "success"){
                        // console.log(response.data); // ##DEVLOG
    
                        setIsLoadingPhone(false); // finish the loading state
                        setIsEditPhoneModalVisible(false); // Hide the phone edit modal
    
                        // redirect to the verification screen
                        navigation.navigate("VerifyPhoneScreen", { verificationPhone: response.data.phone });
    
    
                    } else if (response.data.status === "failed"){
                        notifyWithToast(toast, response.data.message, "top");    
                        setIsLoadingPhone(false); // finish the loading state
    
                    } else {
    
                        notifyWithToast(toast, response.data.message, "top"); // display message from the API
                        setIsLoadingPhone(false); // profile updating state
                        // Hide the modal or something ?
                        
                    }
                   
                } else {
    
                    // Can we find out what status code it is? 
                    throw new Error("Oops! Something went wrong!");
    
                }
    
            } catch (error) {
                console.log(error);
                notifyWithToast(toast, "Oops!, Something went wrong!", "top");
                setIsLoadingPhone(false);
            }
    
        }
    
    
        /**
         * Confirm Email Update Handler
         * This handles the email update process
         */
        const confirmEmailUpdate = async () => {
    
            // validate email address
            if ( !isValidEmailAddress(emailUpdate) ) {
                notifyWithToast(toast, "Enter Valid Email Address.", "top");
                return;
            }
    
            // check if email is the same as the old one
            if ( emailUpdate.trim() === userDetails.email ) {
                notifyWithToast(toast, "No changes detected", "top");
                setIsEditEmailModalVisible(false); // Hide the email edit modal
                return;
            }
    
            // set updating email state
            setIsLoadingEmail(true);
            
    
            // making a request to the API
            try {
    
                const response = await axios.post( `${baseUrl}/update-email`, {
                    user : userDetails.userId,
                    email : emailUpdate,
                });
                
                // checking the status
                if (response.status === 200) {
                    // IF status is successful
                    if (response.data.status === "success"){
                        // console.log(response.data); // ##DEVLOG
    
                        setIsLoadingEmail(false); // finish the loading state
                        setIsEditEmailModalVisible(false); // Hide the email edit modal

                        navigation.navigate("VerifyEmailScreen", { verificationEmail: response.data.email });
                        
                    } else if (response.data.status === "failed"){
                        notifyWithToast(toast, response.data.message, "top");
                        setIsLoadingEmail(false); // finish the loading state
    
                    } else {
    
                        notifyWithToast(toast, response.data.message, "top"); // message from the API
                        setIsLoadingEmail(false); // profile updating state
                        
                    }
                   
                } else {
    
                    // Can we find out what status code it is? 
                    throw new Error("Oops! Something went wrong!");
    
                }
    
            } catch (error) {
                console.log(error); // ##DEVLOG
                notifyWithToast(toast, "Oops!, Something went wrong!", "top");
                setIsLoadingEmail(false);
            }
            
        }


        /** Handle Update Name */
        const handleUpdateName = async () => {

            // Update only when necessary
            // check if the name has changed
            if (nameUpdate == userDetails.name) {
                setIsEditNameModalVisible(false); // close the main modal
                return;
            }

            setIsUpdatingName(true); // updating state

            // making a request to the API to update the Name
            try {
                const response = await axios.post(`${baseUrl}/update-profile`, { 
                    user: userDetails.userId, 
                    name: nameUpdate.trim()
                
                });

                    // checking the status
                    if (response.status === 200) {
                        // If status is successful
                        if (response.data.status === "success"){ 

                            // Update or refresh the App State
                            getAppHomeData({
                                dispatch: dispatch,
                                userID: userDetails.userId,
                            });

                            notifyWithToast(toast, "Name updated successfully!", "top"); // Notify with Toast
                            setIsEditNameModalVisible(false);
                            setIsUpdatingName(false); // reset updating state
                            // setNameUpdate(""); // reset name update state
                        } else {
                            // console.log(response.data);
                            console.log("Failed updating Name."); // what exactly went wrong?
                            setIsUpdatingName(false); // reset updating state
                            // setNameUpdate(""); // reset name update state
                        }

                    } else {

                        throw new Error("error updating name.");

                    }

            } catch (error) {
                console.log(error.message);
                notifyWithToast(toast, "Oops? There's been an error!", "top");
                setIsUpdatingName(false); // reset updating state
                // setNameUpdate(""); // reset name update state
            }

        }
                


    return(
      <SafeAreaView style={{ flex:1}}>
        <View style={ styles.container }>
            <ImageBackground source={appImages.laundryBg} style={{ flex: 1, }}>
                {/* Header Section */}
                <View style={{ paddingVertical:parameters.headerHeightTinier }}>
                    <LHGenericHeader
                        title='Profile Info' 
                        showLeftIcon={true}
                        leftIconPressed={ () => { navigation.goBack(); } } 
                    />
                </View>

                {/* Content Section */}
                <View style={styles.content}>
                    <ScrollView>

                        <View style={styles.header}>
                            
                            <View style={{ alignItems: 'center' }}>

                                {/* Edit Profile Image Button */}
                                <View style={{ position:'absolute', bottom:20, zIndex:15, right:-10  }}>
                                    <TouchableOpacity 
                                        style={{
                                            backgroundColor:appColors.CardBackground, 
                                            alignItems:'center', 
                                            justifyContent:'center', 
                                            width:30,
                                            height:30,
                                            borderRadius:20,  

                                            // adding some box shadow effect to home features icon containers
                                            shadowColor: 'black',
                                            shadowOpacity: 0.16,
                                            shadowOffset: { width: 0, height: 3},
                                            shadowRadius: 10,
                                            elevation: 10,
                                        }} 
                                        onPress={ 
                                            () => { 
                                                // setIsImageSourceModalVisible(true);
                                                //setEditProfileImage(true);
                                                nxtLaunchLibrary(); // Pick from Gallery
                                            } 
                                        } 
                                    >
                                        <Icon 
                                            type="MaterialIcons" 
                                            name="edit" 
                                            color={appColors.AppBlue} 
                                            size={15} 
                                        />

                                    </TouchableOpacity>
                                </View>
                                {/* --- Edit Profile Image Button */}

                                {/* Profile Image Container */}
                                <View 
                                    style={{ 
                                        backgroundColor:appColors.grey6, 
                                        borderRadius:100, 
                                        alignItems:'center', 
                                        justifyContent:'center',
                                        padding:4,

                                        // adding some box shadow effect to home features icon containers
                                        // shadowColor: 'black',
                                        // shadowOpacity: 0.16,
                                        // shadowOffset: { width: 0, height: 3},
                                        // shadowRadius: 10,
                                        // elevation: 10,
                                    }}
                                >
                                    {

                                        tempAvatar && (
                                            <Image source={{ uri: tempAvatar.uri }} style={{ width:120, height:120, resizeMode:'cover', borderRadius:120 }}/>
                                            )
                                        ||

                                        (userAvatar && !tempAvatar) && ( 
                                            <Image source={{ uri: userAvatar }} style={{ width:120, height:120, resizeMode:'cover', borderRadius:120 }} /> 
                                        )
                                        ||
                                        (
                                            <Image source={appImages.avatarDefault} style={{ width:120, height:120, resizeMode:'contain', borderRadius:120 }} />
                                        )
                                    }
                                </View>

                            </View>

                            <Text style={styles.name}>{userDetails.name}</Text>
                        </View>

                        <View style={styles.form}>

                            {/* Name Section */}
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Name</Text>
                                <View style={styles.inputContainer}>
                                    <View style={{ flex: 1, }}>
                                        <Text style={styles.input}>{userDetails.name || "Enter your name"}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.changeButton} onPress={ () => { setIsEditNameModalVisible(true); } }>
                                        <Icon name="edit" type="MaterialIcons" size={20} color={appColors.AppBlue} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/* --- Name Section */}

                            {/* Phone Number Section */}
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Phone Number</Text>
                                <View style={styles.inputContainer}>
                                    <View style={{ flex: 1,}}>
                                        <Text style={styles.input}>{userDetails.phone || "Add phone number"}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        {userDetails.phone && (
                                            <VerificationStatus     
                                                type="Phone"
                                                isVerified={userDetails.phone_verified}
                                                onVerifyPress={
                                                    () => {
                                                        // navigation.navigate('VerifyPhone');
                                                        console.log("Verify Phone");
                                                    }
                                                }
                                            />
                                        )}
                                        
                                        {!isThisVerified(userDetails.phone_verified) && (
                                            <TouchableOpacity 
                                                style={styles.changeButton}
                                                onPress={ () => { setIsEditPhoneModalVisible(true); } }
                                            >
                                                <Icon name="edit" type="MaterialIcons" size={20} color={appColors.AppBlue} />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                    
                                </View>
                            </View>
                            {/* --- Phone Number Section */}

                            {/* Email Section */}
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Email</Text>
                                <View style={styles.inputContainer}>
                                    <View style={{ flex: 1, }}>
                                        <Text style={styles.input}>{userDetails.email || "Add your email"}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        {userDetails.email && (
                                            <VerificationStatus 
                                                type="Email"
                                                isVerified={userDetails.email_verified}
                                                onVerifyPress={
                                                    () => {
                                                        // navigation.navigate('VerifyEmail');
                                                        console.log("Verify Email");
                                                        // setIsEditEmailModalVisible(true);
                                                    }
                                                }
                                            />
                                        )}

                                        <TouchableOpacity 
                                            style={styles.changeButton}
                                            onPress={ () => { setIsEditEmailModalVisible(true); } }
                                        >
                                            <Icon name="edit" type="MaterialIcons" size={20} color={appColors.AppBlue} />
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </View>

                        </View>

                    </ScrollView>
                </View>


                 {/* Update Profile Image Button section */}
                 { tempAvatar && (
                    <View style={{ paddingHorizontal:20, paddingVertical:10, marginBottom:10, marginTop:10 }}>
                        <Button 
                            title="UPDATE PROFILE IMAGE" 
                            buttonStyle={ parameters.appButtonXLBlue }
                            titleStyle={ parameters.appButtonXLTitle }
                            onPress={
                            () => {
                                // Update Profile Image
                                handleProfileUpload();
                                }
                            }
                        />
                    </View>
                )
                }
                {/* --- Update Profile Image Button section */}


            </ImageBackground>


            {/* Various Action Modals */}

             {/* Choose Image Picker Source Modal */}
             <BottomSheet
                    containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.5)' }}
                    modalProps = {{ presentationStyle:"overFullScreen", visible: isImageSourceModalVisible, }}
                    onBackdropPress={ () => { setIsImageSourceModalVisible(false); } }
                >

                    <View style={ parameters.doffeeModalContainer }>

                        <View style={{ alignItems:'center' }}>
                            <Pressable 
                                style={{ width:30, backgroundColor:appColors.AppBlue, borderRadius:15, padding:8, alignItems:'center' }} 
                                onPress={ () => { setIsImageSourceModalVisible(false) } } >
                                <Icon type="material-icons" name="close" color={appColors.CardBackground} size={15}  />
                            </Pressable>
                        </View>
                            
                        {/* Modal Content */}
                        <View style={{ flex:1, justifyContent:"center", alignItems:"center", paddingVertical:25, }}>

                            <Text style={{ fontSize:25, fontWeight:"bold", paddingVertical:5 , color:appColors.AppBlue}}>Where is your Image?</Text>
                            <Text style={{ fontSize:14, paddingVertical:5, color: appColors.grey2, textAlign:'center' }}>Choose where to pick your profile from.</Text>

                            <View style={{flex:1, paddingVertical:10, marginVertical:20, flexDirection: 'row', justifyContent:'space-around' }}>
                                <TouchableOpacity 
                                    style={{ padding: 10, minWidth:45, alignItems:'center', flex:1 }}
                                    onPress={ 
                                        () => { 
                                            setIsImageSourceModalVisible(false);
                                            nxtLaunchCamera(); // Pick from Camera
                                        
                                        } }
                                    >
                                    <Icon type="material-community" name="camera" color={appColors.AppBlue} size={80} />
                                    <Text style={{ fontWeight:'bold', color:appColors.AppBlue, paddingVertical:2, fontSize:16 }}>Camera</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={{ padding: 10, minWidth:45, alignItems:'center', flex:1 }}
                                        onPress={ 
                                            () => { 
                                                setIsImageSourceModalVisible(false);
                                                nxtLaunchLibrary(); // Pick from Gallery
                                            
                                            } }
                                    >
                                    <Icon type="material-icons" name="image" color={appColors.AppBlue} size={80}  />
                                    <Text style={{ fontWeight:'bold', color:appColors.AppBlue, paddingVertical:2, fontSize:16 }}>Gallery</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </BottomSheet>
                {/* --- Choose Image Picker Source Modal */}



                {/* Edit Phone Modal */}
                <BottomSheet
                    containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.5)' }}
                    onBackdropPress={ 
                        () => { 
                            !isLoadingPhone && setIsEditPhoneModalVisible(false); 
                        } 
                    }
                    modalProps = {{ presentationStyle:"overFullScreen", visible: isEditPhoneModalVisible, }}
                >

                    <View style={ parameters.doffeeModalContainer }>

                        { isLoadingPhone && 
                            <View style={{ justifyContent:'center', paddingVertical:5, alignItems:'center' }}>
                                <ActivityIndicator size="large" style={{ marginHorizontal:5 }} color={appColors.AppBlue} />
                            </View>
                        }
                      
                        <View style={{ flex:1, justifyContent:"center", alignItems:"center", paddingVertical:25, }}>
                            <Text style={ styles.editHeaderTitle }>Update Phone Number</Text>
                            <Text style={ styles.editHeaderDescription }>
                                A verification code will be sent to this number. 
                            </Text> 
                        </View>

                         {/* Phone Input Block */}
                         <LHPhoneInput
                            placeholder="0750000000"
                            inputValue={phoneUpdate}
                            inputValueSetter={setPhoneUpdate}
                            countrySupportSetter={setIsCountrySupported}
                            formattedValueSetter={setFormattedPhone}
                            isInputEditable={!isLoadingPhone}
                            autoFocus={true}

                        />


                        {/* The following options  */}
                        <View style={{ flex:1, justifyContent:"center", marginVertical:15, }}>
                            <Button 
                                title ="NEXT" 
                                buttonStyle ={ parameters.appButtonXLBlue }
                                titleStyle ={ parameters.appButtonXLTitle }
                                disabled={!isValidPhoneNumber(phoneUpdate) || isLoadingPhone}
                                onPress = { 
                                    () => { 

                                        // console.log("Phone: " + phoneUpdate);
                                        // setIsEditPhoneModalVisible(false);

                                        // check if country is supported
                                        if (!isCountrySupported) {
                                            notifyWithToast(toast, "Country not supported!", "top");
                                            return;
                                        }
                                        
                                        confirmPhoneUpdate();

                                        // TODO: Let's use the following to test the phone verification
                                        // navigation.navigate(
                                        //     "VerifyPhoneScreen",
                                        //     {
                                        //         verificationType: 'PHONE',
                                        //         verificationPhone: '0123456789',
                                        //     }
                                        // );

                                    
                                    }
                                
                                }
                            />
                        </View>

                    </View>
                </BottomSheet>
                {/* --- Edit Phone Modal ends */}


                {/* Edit Email Modal */}
                <BottomSheet
                    containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.5)' }}
                    onBackdropPress={ () => { !isLoadingEmail && setIsEditEmailModalVisible(false); } }
                    modalProps = {{ presentationStyle:"overFullScreen", visible: isEditEmailModalVisible,  }} 
                >

                    <View style={ parameters.doffeeModalContainer }>

                        { isLoadingEmail && 
                            <View style={{ justifyContent:'center', paddingVertical:5, paddingHorizontal:10, }}>
                                <ActivityIndicator size="large" style={{ marginHorizontal:3 }} color={appColors.AppBlue} />
                            </View>
                        }

                        <View style={{ flex:1, justifyContent:"center", alignItems:"center", paddingVertical:25, }}>
                            <Text style={ styles.editHeaderTitle }>Update Email Address</Text>
                            <Text style={ styles.editHeaderDescription }>
                                Make sure your email is accurate to get your verification code. 
                            </Text> 
                        </View>

                        <View style={ styles.editRow }>
                            <TextInput 
                                placeholderTextColor={ appColors.grey3 } 
                                keyboardType='email-address'
                                style={{ 
                                    flex:1, 
                                    fontSize:16, 
                                    color:appColors.AppBlue, 
                                    paddingVertical:10, 
                                    paddingHorizontal:10, 
                                    borderBottomWidth:1,
                                    borderBottomColor:appColors.grey4,
                                    fontFamily: appFonts.bodyTextRegular,
                                }}
                                placeholder={userDetails.email || 'Enter email address'} 
                                maxLength={60}
                                onChangeText={onChangeEmailUpdate}
                                value={emailUpdate} 
                            />  
                               
                        </View>

                        {/* The following options  */}
                        <View style={{ flex:1, justifyContent:"center", marginVertical:15, }}>
                            <Button 
                                title="NEXT" 
                                buttonStyle={ parameters.appButtonXLBlue }
                                titleStyle={ parameters.appButtonXLTitle }
                                disabled={!isValidEmailAddress(emailUpdate) || isLoadingEmail}
                                onPress = { () => { 
                                    // setIsEditEmailModalVisible(false);

                                    confirmEmailUpdate();

                                    // TODO: Let's use the following to test the email verification
                                    // setIsEditEmailModalVisible(false);
                                    // navigation.navigate(
                                    //     "VerifyEmailScreen",
                                    //     {
                                    //         verificationType: 'EMAIL',
                                    //         verificationEmail: emailUpdate,
                                    //     }
                                    // );
                                
                                } }
                            />
                        </View>
                    </View>
                </BottomSheet>
                {/* --- Edit Email Modal ends */}

            
                {/* Edit Name Modal */}
                <BottomSheet
                    containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.5)' }}
                    onBackdropPress={ 
                        () => { 
                            !isUpdatingName && setIsEditNameModalVisible(false); // close the edit name box
                        } 
                    }
                    modalProps = {{ presentationStyle:"overFullScreen", visible: isEditNameModalVisible }}>

                    <View style={ parameters.doffeeModalContainer }>
                        {/* Modal Content */}
                        <View style={{ flex:1, paddingVertical:10 }}>
                            <EditNameContent 
                                onCancelPress={ 
                                    () => { 
                                        setIsEditNameModalVisible(false);
                                        setNameUpdate(userDetails.name); // reset name to default
                                    } 
                                } 

                                updatingStatus={isUpdatingName}
                                nameValue={nameUpdate}
                                onChangeHandler={onChangeNameUpdate}
                                onApplyPress={handleUpdateName}

                            /> 
                        </View>
                        {/* --- Modal Content */}
                    </View>
                </BottomSheet>
                {/* --- Edit Name Modal ends */}





                {/* Loader Modals */}
                <LHLoaderModal visible={uploadingProfile} message="Please wait, updating profile..." transparent={true} />


        </View>
      </SafeAreaView>
    )
}

// local stylesheet
const styles = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor: appColors.grey7,
    },

    header: {
        alignItems: 'center',
        marginVertical: 20,
    },

    content: {
        flex: 1,
        backgroundColor: appColors.CardBackground,
    },

    name: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
        color: appColors.AppBlue,
    },

    form: {
        marginHorizontal: 20,
    },
      
    formGroup: {
        marginVertical: 8,
    },
      
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: appColors.AppBlue,
        paddingBottom: 5,
    },

    input: {
        padding: 5,
        paddingVertical: 7,
        marginVertical: 5,
        color: appColors.AppBlue,
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
        borderWidth: 1,
        borderColor: appColors.AppBlueOpacity,
        borderRadius: 5,
        paddingHorizontal: 10,
    },

    changeButton: {
        padding: 8,
        borderRadius: 8,
        // backgroundColor: appColors.grey6,
    },

    changeButtonText: {
        color: appColors.AppBlue,
        fontSize: 16,
    },

    // phone verification styles
    verifiedBadge: {
        backgroundColor: appColors.grey3,
        padding: 5,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginRight: 5,
    },

    verifiedText: {
        color: appColors.CardBackground,
        fontSize: 11,
        fontWeight: '700',
    },

    verifyButton: {
        backgroundColor: appColors.AppBlue,
        padding: 5,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginRight: 5,
    },

    verifyButtonText: {
        color: appColors.CardBackground,
        fontSize: 11,
        fontWeight: '700',
    },

    inputBlockRow: {
        flexDirection:'row',
        backgroundColor: appColors.grey7,
        paddingHorizontal:12, 
        paddingVertical:15, 
        alignItems:'center',
        borderRadius:10, 
        marginVertical:8,
        marginHorizontal:5,
    
        // adding some box shadow effect to home features icon containers
        shadowColor: 'black',
        shadowOpacity: 0.16,
        shadowOffset: { width: 0, height: 3},
        shadowRadius: 10,
        elevation: 10,
    
    },
    
    inputContainerFlexRow : {
        flexDirection:'row', 
        alignItems:'center', 
        paddingHorizontal:15, 
        paddingVertical:15, 
        borderRadius:10, 
        marginVertical:8,
        backgroundColor:appColors.CardBackground,
    
        // adding some box shadow effect to home features icon containers
        shadowColor: 'black',
        shadowOpacity: 0.16,
        shadowOffset: { width: 0, height: 3},
        shadowRadius: 10,
        elevation: 3,
    },

    // Edit Modal Content Boxes
    editHeaderTitle: {
        textAlign:'center', 
        fontSize:20, 
        color:appColors.AppBlue, 
        //fontWeight:'700', 
        paddingBottom:10,
        fontFamily: appFonts.headerTextBold,
    },

    editHeaderDescription: {
        textAlign:'center', 
        fontSize:13, 
        color:appColors.AppBlue, 
        paddingBottom:10,
        fontFamily: appFonts.bodyTextRegular,
        // paddingVertical:5, 
    },

    editRow: {
        flexDirection:'row', 
        paddingVertical:10, 
        alignItems:'center', 
        marginVertical:2,
    },

    editColL: {
        justifyContent:'center',
    },

    editColR: {
        flex:1, 
        alignItems:'flex-end', 
        justifyContent:'center',
    },

    editItemTitle : {
        fontSize:16, 
        color:appColors.AppBlue, 
        fontWeight:'500',
    },

    editItemValue: {
        fontSize:16, 
        color:appColors.AppBlue, 
        fontWeight:'400', 
        paddingHorizontal:2, 
        marginRight:3,
    },

    editControlsContainer: {
        alignItems:"center", 
        justifyContent:'space-between', 
        marginTop:5, 
        flexDirection:'row',
        borderTopWidth:1,
        borderTopColor: appColors.grey6,
    },

    editControlsButtonL: {
        alignItems:'flex-start', 
        paddingVertical:10, 
        paddingRight:20,
    },

    editControlsButtonR: {
        alignItems:'flex-end', 
        paddingVertical:10, 
        paddingLeft:20,
    },

    editControlsButtonTextL: {
        fontSize:16, 
        color:appColors.grey1, 
        fontWeight:'900',
    },

    editControlsButtonTextR: {
        fontSize:16, 
        color:appColors.AppBlue, 
        fontWeight:'900',
    },
    
   
});