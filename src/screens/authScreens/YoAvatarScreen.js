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
import { colors, parameters } from '../../global/Styles'
import { Button, Icon, BottomSheet} from '@rneui/base'
import { useToast } from 'native-base'
import { YodateImages } from '../../global/Data'
import YoGenericHeader from '../../components/YoGenericHeader'
import { launchCamera , launchImageLibrary} from 'react-native-image-picker';
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



export default function YoAvatarScreen({navigation}){

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
      const userImageData = createFormData(tempAvatar, userDetails.userId ); // the form data --- using current user Id
      // const userImageData = createFormData(tempAvatar, 5588585 ); // the form data --- using current user Id
      // console.log(userImageData);
      const response = await profileInstance.post(`/photo`, userImageData );

      // check the response
      if ( response.status === 200 ) {

        // console -- debug
        console.log(response.data);
        
        // Success or Failure ?
        if ( response.data.status == "success" ){
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


    return(
       <View style = { styles.container }>
            <StatusBar barStyle='light-content' backgroundColor={colors.YoPink} />
            {/* <YoGenericHeader leftIconPressed={ () => { navigation.goBack() } } /> */}

            <ImageBackground source={YodateImages.worldmapBg} style={{ flex: 1, }}>
            
                <View style={{ flex:1, paddingHorizontal:25, paddingVertical:35 }}>
                       
                    <View style={{ justifyContent:'center', alignItems:'center', paddingVertical:20, paddingHorizontal:5 }}>
                        <Text style={{ fontSize:25, color:colors.YoPink, fontWeight:'bold'}}>Picture time!</Text>
                        <Text style={{ paddingHorizontal:20, fontSize:18, paddingVertical:8, color:colors.grey2, textAlign:'center' }}>
                            You need a photo to use YoDate
                        </Text>
                    </View>

                    <View style={{ justifyContent: "center", alignItems:"center", paddingVertical:30 }}>
                        {
                             tempAvatar && ( 
                                <View>
                                    <View style={ styles.avatarImageContainer }>
                                        <Image source={{ uri: tempAvatar.uri }} style={{ width:250, height:250,  resizeMode:'cover', }} /> 
                                    </View>
                                    <Pressable 
                                        style={{ position:'absolute', bottom:10, right:10, }}
                                        onPress={ () => { setIsImageSourceModalVisible(true) } 
                                    }>
                                        <Image source={YodateImages.logoPinkCircle} style={{  width:40, height:40, resizeMode:'contain' }} />
                                    </Pressable>
                                </View>
                              )
                              ||
                              (
                                <Pressable onPress={ () => { setIsImageSourceModalVisible(true) } }>
                                    <Image source={YodateImages.uploadAvatarIcon} style={{ width:250, height:250, resizeMode:'contain' }} />
                                </Pressable>
                              
                              )

                        }
                    </View>

                </View>

                <View style={{ paddingVertical: 20, paddingHorizontal:25, }}>

                        { uploadingProfile && 
                            <View style={{ flexDirection:'row', justifyContent:'center', paddingVertical:10 }}>
                                <ActivityIndicator style={{ marginHorizontal:5 }} color={colors.YoPink} />
                                <Text style={{ color:colors.black }}>Uploading Image...</Text>
                            </View>
                        }

                    <Button 
                        title="Upload Photo"
                        buttonStyle={ parameters.doffeeButtonXL }
                        titleStyle={ parameters.doffeeButtonXLTitle } 
                        disabled={!tempAvatar} 
                        onPress={ 
                            () => { 

                               handleProfileUpload(); // Upload the Profile Picture
                                
                            } 
                        } 
                    /> 
                </View>

                <View style={{ height:50 }} />



                {/* Choose Image Picker Source Modal */}
                <BottomSheet
                        containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.5)' }}
                        modalProps = {{
                            presentationStyle:"overFullScreen",
                            visible: isImageSourceModalVisible,
                            //transparent:false,
                        }} >

                        <View style={ parameters.doffeeModalContainer }>

                            <View style={{ paddingVertical:12, }}>
                                <Pressable style={{ padding:5, width:60 }}>
                                    <Icon 
                                        type= "font-awesome-5"
                                        name= "arrow-left"
                                        color= {colors.black}
                                        size= {22} 
                                        onPress={ () => { setIsImageSourceModalVisible(false) } }
                                    />
                                </Pressable>
                            </View>
                                
                            {/* Modal Content */}
                            <View style={{ flex:1, justifyContent:"center", alignItems:"center", paddingVertical:25, }}>

                                <Text style={{ fontSize:25, fontWeight:"bold", paddingVertical:5 , color:colors.YoPink}}>Upload photo from:</Text>
                                <View style={{flex:1, alignItems:'center', paddingVertical:10, marginVertical:20, flexDirection: 'row', justifyContent:'center' }}>
                                    <TouchableOpacity 
                                        style={{ 
                                            padding: 10, 
                                            justifyContent:'center', 
                                            minWidth:60, 
                                            alignItems:'center', 
                                            marginHorizontal:15, 
                                        
                                        }}
                                        onPress={ 
                                            () => { 
                                                setIsImageSourceModalVisible(false);
                                                nxtLaunchCamera(); // Pick from Camera
                                            
                                            } }
                                        >
                                        <View style={{ backgroundColor:colors.grey6, padding:15, borderRadius:45 }}>
                                            <Icon type="material-community" name="camera" color={colors.YoPink} size={60} />
                                        </View>
                                        <Text style={{ fontWeight:'bold', color:colors.black, paddingVertical:2, fontSize:16 }}>Camera</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity 
                                        style={{ 
                                            padding: 10, 
                                            minWidth:60, 
                                            alignItems:'center', 
                                            marginHorizontal:15, 
                                            justifyContent:'center',
                                        
                                        }}
                                        onPress={ 
                                            () => { 
                                                setIsImageSourceModalVisible(false);
                                                nxtLaunchLibrary(); // Pick from Gallery
                                            
                                            } }
                                        >

                                        <View style={{ backgroundColor:colors.grey6, padding:15, borderRadius:45 }}>
                                            <Icon type="material-icons" name="image" color={colors.YoPink} size={60} />
                                        </View>

                                        <Text style={{ fontWeight:'bold', color:colors.black, paddingVertical:2, fontSize:16 }}>Your Photos</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>

                            <View style={{ height:50 }} />

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
        flex:1,
        backgroundColor:colors.CardBackground,
    },

    avatarImageContainer: {
        backgroundColor:colors.YoPink, 
        width:200, 
        height:200,
        borderRadius: 120,
        overflow:'hidden',
        resizeMode:'cover',
        justifyContent:'center',
        alignItems:'center',
        borderColor: colors.YoPink,
        borderWidth: 5,
    },

    inputBlockRow: {
        flexDirection:'row',
        backgroundColor: colors.grey7,
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


})