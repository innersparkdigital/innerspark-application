import axios from 'axios';
import React, { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserAvatar, updateUserDetails } from '../../features/user/userDataSlice';

import {
    View,
    Text,
    StyleSheet,
    Image,
    ImageBackground,
    TextInput,
    ScrollView,
    StatusBar,
    Pressable,
    TouchableOpacity,
    ActivityIndicator,

} from 'react-native'
import { appColors, parameters } from '../../global/Styles'
import { Button, Icon, BottomSheet } from '@rneui/base'
import { useToast } from 'native-base'
import { YodateImages } from '../../global/Data'
import YoGenericHeader from '../../components/YoGenericHeader'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { baseUrlRoot, baseUrlV1 } from '../../api/LHAPI';
import { retrieveItemLS, storeItemLS } from '../../global/StorageActions';

const baseUrl = baseUrlRoot + baseUrlV1;

// Custom Axios instance
const profileInstance = axios.create({
    baseURL: baseUrl,
    //timeout: 1000,
});

// defaults AXIOS
profileInstance.defaults.headers.common['Authorization'] = 'fc890f71-65e6-4fa9-a01c-1b29fe8c27a0';
//profileInstance.defaults.headers.common['Accept'] = 'application/json';
profileInstance.defaults.headers.post['Content-Type'] = "multipart/form-data";


// Create Form data
const createFormData = (photo, user) => {

    const data = new FormData();

    // Append image data
    data.append('image', {
        name: photo.fileName,
        type: photo.type,
        uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
    });

    // Handling Body data keys:values
    // Object.keys(body).forEach((key) => {
    //   data.append(key, body[key]);
    // });

    data.append('user', user);

    // console data
    //console.log("data----");
    //console.log(data["_parts"][0][1]); // Image
    //console.log(data["_parts"][1][1]); // User

    // return the final data
    return data;

};



export default function YoAvatarScreen({ navigation }) {

    const dispatch = useDispatch(); // dispatch actions
    const toast = useToast();
    const [isImageSourceModalVisible, setIsImageSourceModalVisible] = useState(false); // The Image Source Modal State

    const userAvatarURI = useSelector(state => state.userData.userAvatar); // user avatar object { image: uri} 

    const userDetailsRS = useSelector(state => state.userData.userDetails); // User details from redux store
    const userDetailsLS = retrieveItemLS("userDetailsLS"); // User details from Local Storage
    const userDetails = userDetailsRS ? userDetailsRS : userDetailsLS; // User details data (userId, email, name, phone)

    //const userDetails = useSelector(state => state.userData.userDetails); // User details data (userId, email, name, phone)
    const userAvatarURIDetail = userDetails ? userDetails.image : null // user avatar image from Token session 
    const [userAvatar, setUserAvatar] = useState(userAvatarURI | userAvatarURIDetail);
    const [tempAvatar, setTempAvatar] = useState(null);
    const [uploadingProfile, setUploadingProfile] = useState(false);

    // Toast Notifications
    const notifyWithToast = (description) => {
        toast.show({
            description: description,
        })
    }


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
            console.log("The user Cancelled! --- Do Nothing!"); // just do nothing!
        }

        // check if the result has asset object
        if (result.assets) {
            // assets data
            setTempAvatar(result.assets[0]);
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
            console.log("The user Cancelled! --- Do Nothing!"); // Just do nothing!
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
            const userImageData = createFormData(tempAvatar, userDetails.userId); // the form data --- using current user Id
            // const userImageData = createFormData(tempAvatar, 5588585 ); // the form data --- using current user Id
            // console.log(userImageData);
            const response = await profileInstance.post(`/photo`, userImageData);

            // check the response
            if (response.status === 200) {

                // console -- debug
                console.log(response.data);

                // Success or Failure ?
                if (response.data.status == "success") {
                    dispatch(updateUserAvatar(response.data.image)); // update the store - user avatar uri
                    storeItemLS("userAvatarLS", response.data.image);
                    notifyWithToast('Picture Added Successfully!');
                    //console.log(response.data.image);
                    // navigation.popToTop(); // This clear stack history -- is there any screen to go back to ?
                    navigation.navigate('YoBottomTabs'); //Back to Home Screen

                    setUploadingProfile(false);

                } else {

                    notifyWithToast('Profile Update Failed!'); // Profile updated failed
                    // console.log('Profile Updated Failed!');
                    setUploadingProfile(false);

                }

            } else {
                // did something happen ?
                console.log("Is method different?");
                throw new Error("There's been an error somewhere!");
            }

        } catch (error) {
            //console.log("Oops? Something went wrong!");
            notifyWithToast("Oops? Something went wrong!");
            console.log(error.message); // for debugging purposes
            setUploadingProfile(false);

        }


    }


    return (
        <View style={styles.container}>
            <StatusBar barStyle='light-content' backgroundColor={appColors.YoPink} />
            {/* <YoGenericHeader leftIconPressed={ () => { navigation.goBack() } } /> */}

            <ImageBackground source={YodateImages.worldmapBg} style={{ flex: 1, }}>

                <View style={{ flex: 1, paddingHorizontal: scale(25), paddingVertical: scale(35) }}>

                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: scale(20), paddingHorizontal: scale(5) }}>
                        <Text style={{ fontSize: moderateScale(25), color: appColors.YoPink, fontWeight: 'bold' }}>Picture time!</Text>
                        <Text style={{ paddingHorizontal: scale(20), fontSize: moderateScale(18), paddingVertical: scale(8), color: appColors.grey2, textAlign: 'center' }}>
                            You need a photo to use YoDate
                        </Text>
                    </View>

                    <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: scale(30) }}>
                        {
                            tempAvatar && (
                                <View>
                                    <View style={styles.avatarImageContainer}>
                                        <Image source={{ uri: tempAvatar.uri }} style={{ width: scale(250), height: scale(250), resizeMode: 'cover', }} />
                                    </View>
                                    <Pressable
                                        style={{ position: 'absolute', bottom: scale(10), right: scale(10), }}
                                        onPress={() => { setIsImageSourceModalVisible(true) }
                                        }>
                                        <Image source={YodateImages.logoPinkCircle} style={{ width: scale(40), height: scale(40), resizeMode: 'contain' }} />
                                    </Pressable>
                                </View>
                            )
                            ||
                            (
                                <Pressable onPress={() => { setIsImageSourceModalVisible(true) }}>
                                    <Image source={YodateImages.uploadAvatarIcon} style={{ width: scale(250), height: scale(250), resizeMode: 'contain' }} />
                                </Pressable>

                            )

                        }
                    </View>

                </View>

                <View style={{ paddingVertical: scale(20), paddingHorizontal: scale(25), }}>

                    {uploadingProfile &&
                        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: scale(10) }}>
                            <ActivityIndicator style={{ marginHorizontal: scale(5) }} color={appColors.YoPink} />
                            <Text style={{ color: appColors.black }}>Uploading Image...</Text>
                        </View>
                    }

                    <Button
                        title="Upload Photo"
                        buttonStyle={parameters.doffeeButtonXL}
                        titleStyle={parameters.doffeeButtonXLTitle}
                        disabled={!tempAvatar}
                        onPress={
                            () => {

                                handleProfileUpload(); // Upload the Profile Picture

                            }
                        }
                    />
                </View>

                <View style={{ height: 50 }} />



                {/* Choose Image Picker Source Modal */}
                <BottomSheet
                    containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.5)' }}
                    modalProps={{
                        presentationStyle: "overFullScreen",
                        visible: isImageSourceModalVisible,
                        //transparent:false,
                    }} >

                    <View style={parameters.doffeeModalContainer}>

                        <View style={{ paddingVertical: scale(12), }}>
                            <Pressable style={{ padding: scale(5), width: scale(60) }}>
                                <Icon
                                    type="font-awesome-5"
                                    name="arrow-left"
                                    color={appColors.black}
                                    size={moderateScale(22)}
                                    onPress={() => { setIsImageSourceModalVisible(false) }}
                                />
                            </Pressable>
                        </View>

                        {/* Modal Content */}
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: scale(25), }}>

                            <Text style={{ fontSize: moderateScale(25), fontWeight: "bold", paddingVertical: scale(5), color: appColors.YoPink }}>Upload photo from:</Text>
                            <View style={{ flex: 1, alignItems: 'center', paddingVertical: scale(10), marginVertical: scale(20), flexDirection: 'row', justifyContent: 'center' }}>
                                <TouchableOpacity
                                    style={{
                                        padding: scale(10),
                                        justifyContent: 'center',
                                        minWidth: scale(60),
                                        alignItems: 'center',
                                        marginHorizontal: scale(15),

                                    }}
                                    onPress={
                                        () => {
                                            setIsImageSourceModalVisible(false);
                                            nxtLaunchCamera(); // Pick from Camera

                                        }}
                                >
                                    <View style={{ backgroundColor: appColors.grey6, padding: scale(15), borderRadius: scale(45) }}>
                                        <Icon type="material-community" name="camera" color={appColors.YoPink} size={moderateScale(60)} />
                                    </View>
                                    <Text style={{ fontWeight: 'bold', color: appColors.black, paddingVertical: scale(2), fontSize: moderateScale(16) }}>Camera</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{
                                        padding: scale(10),
                                        minWidth: scale(60),
                                        alignItems: 'center',
                                        marginHorizontal: scale(15),
                                        justifyContent: 'center',

                                    }}
                                    onPress={
                                        () => {
                                            setIsImageSourceModalVisible(false);
                                            nxtLaunchLibrary(); // Pick from Gallery

                                        }}
                                >

                                    <View style={{ backgroundColor: appColors.grey6, padding: scale(15), borderRadius: scale(45) }}>
                                        <Icon type="material-icons" name="image" color={appColors.YoPink} size={moderateScale(60)} />
                                    </View>

                                    <Text style={{ fontWeight: 'bold', color: appColors.black, paddingVertical: scale(2), fontSize: moderateScale(16) }}>Your Photos</Text>
                                </TouchableOpacity>
                            </View>

                        </View>

                        <View style={{ height: 50 }} />

                    </View>
                </BottomSheet>
                {/* --- Choose Image Picker Source Modal */}

            </ImageBackground>
        </View>
    )
}


// Local Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appColors.CardBackground,
    },

    avatarImageContainer: {
        backgroundColor: appColors.YoPink,
        width: scale(200),
        height: scale(200),
        borderRadius: scale(120),
        overflow: 'hidden',
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: appColors.YoPink,
        borderWidth: scale(5),
    },

    inputBlockRow: {
        flexDirection: 'row',
        backgroundColor: appColors.grey7,
        paddingHorizontal: scale(12),
        paddingVertical: scale(15),
        alignItems: 'center',
        borderRadius: scale(10),
        marginVertical: scale(8),
        marginHorizontal: scale(5),

        // adding some box shadow effect to home features icon containers
        shadowColor: 'black',
        shadowOpacity: 0.16,
        shadowOffset: { width: 0, height: scale(3) },
        shadowRadius: scale(10),
        elevation: 10,

    },


})