/**
 * App - Privacy Policy Screen
 */
import React, { useState, useEffect, useCallback }  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { appColors, parameters } from '../../global/Styles';
import { useToast } from 'native-base';
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

} from 'react-native';
import { Icon, Button, BottomSheet } from '@rneui/base';
import { appImages, appLinks } from '../../global/Data';
import LHGenericHeader from '../../components/LHGenericHeader';
import { appFonts } from '../../global/Styles';


export default function PrivacyPolicyScreen({ navigation }){
    
    // display the profile image if user has an image avatar 
    const dispatch = useDispatch();
    const userToken = useSelector(state => state.user.userToken); // User token data (userId, email, name, phone)
    const sessionUserData = useSelector(state => state.appSession.sessionUserData); // flexible user session data
    const toast = useToast();

    // Toast Notifications
    const notifyWithToast = (description) => { toast.show({ description: description, }) }

    return(
      <SafeAreaView style={{ flex:1}}>
        <View style={ styles.container }>
            <ImageBackground source={appImages.laundryBg} style={{ flex: 1, }}>
                <View style={{ paddingVertical:parameters.headerHeightTiny }}>
                    <LHGenericHeader
                        title='Privacy Policy' 
                        showLeftIcon={true}
                        leftIconPressed={ () => { navigation.goBack(); } } 
                    />
                </View>

                <View style={{ flex:1, justifyContent:'center', alignItems:'center'}}>
                    <View style={{ paddingVertical:15 }}>
                        <Icon type="material-community" name="shield-outline" color={appColors.AppBlue} size={80} /> 
                    </View>
                    <Text style={{ fontSize:20, color:appColors.AppBlue, fontFamily:appFonts.bodyTextBold }}>Privacy Policy</Text>
                    <View style={{ paddingVertical:30 }}>
                        <Text style={{ fontSize:16, color:appColors.AppBlue, fontFamily:appFonts.bodyTextRegular }}>
                            This is the privacy policy screen.
                        </Text>
                    </View>
                </View>

            </ImageBackground>
        </View>
      </SafeAreaView>
    )
}

// local stylesheet
const styles = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor: '#fff',
    },

   
});