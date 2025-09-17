import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateAppNeedsUpdate } from '../../features/appStart/appStartSlice';
import { 
    View, 
    Text, 
    StyleSheet, 
    Image, 
    Pressable, 
    ActivityIndicator,
    ImageBackground,
    Linking,
    Alert,
    StatusBar,

} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context'; 
import { Button, Icon } from '@rneui/base';
import { appColors, parameters } from '../../global/Styles';
import { appImages } from '../../global/Data';
import { checkVersion } from 'react-native-check-version';


// Returns a touchable opacity button that opens a url on press
const OpenURLButton = ({ url, title, children }) => {
    const handlePress = useCallback(async () => {
  
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url);
  
      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
  
    }, [url]);
  
    // return <TouchableOpacity onPress={handlePress}>{children}</TouchableOpacity>;

    return (
        <Button 
            title={title} 
            buttonStyle={ parameters.appButtonXL }
            titleStyle={ parameters.appButtonXLTitle } 
            onPress={handlePress}  
    />);

  };


export default function VerifyAppVersionScreen({navigation}){

    const dispatch = useDispatch();

    // default update url
    // const [updateURL, setUpdateURL] = useState("https://play.google.com/store/apps/details?id=com.innersparkafrica.innerspark");
    const [updateURL, setUpdateURL] = useState("https://play.google.com/store/apps/");
    //const [updateURL, setUpdateURL] = useState("#");

    // the function running the whole thing
    const checkAppUpdate = async () => {
        const version = await checkVersion();
        //console.log("Got version info: ", version);
        const url = version.url;
        setUpdateURL(url);
    }

    useEffect(
        () => { checkAppUpdate(); }, []
    );

    return(
        <SafeAreaView style={ styles.container }>
            <StatusBar barStyle='light-content' backgroundColor={appColors.AppBlue} />
            <ImageBackground source={appImages.bgPatterns} style={{ flex: 1, }}>
                <View style={{ flex:3, alignItems:'center', justifyContent:'center', paddingHorizontal:15 }}>
                    <Icon type="material-icons" name="update" color={ appColors.AppBlue } size={90} />
                    <Text style={{ fontSize:22, paddingVertical:10, color:appColors.AppBlue, fontWeight:'bold', textAlign:'center' }}>
                        Innerspark has a new update!
                    </Text>
                    <View style={{ padding:8 }}>
                        <Text style={{ color:appColors.black, fontSize:15, textAlign:'center' }}>
                            Update the app to unlock new features.
                        </Text>
                    </View> 
                </View>

                <View style={{ flex:1, paddingVertical:20, paddingHorizontal:25 }}>
                    {/* <Button 
                        title="Update"
                        buttonStyle={ parameters.doffeeButtonXL }
                        titleStyle={ parameters.doffeeButtonXLTitle }   
                        onPress={ () => { 
                            checkAppUpdate();
                         } }
                    />  
                    <Text></Text> */}
                    <OpenURLButton title="Update" url={updateURL} />
                    <Pressable 
                        style={{ marginVertical:10, paddingVertical:5, alignItems:'center' }}
                        onPress={ 
                            () => { 
                                dispatch(updateAppNeedsUpdate(false));
                                // console.log('Not now');
                            } 
                        }
                    >
                        <Text style={{ color:appColors.grey2, fontSize:15,fontWeight:'bold' }}>Not Now</Text>
                    </Pressable>
                </View> 
           </ImageBackground>
        </SafeAreaView>
       
    );
}


// local stylesheet for the screen
const styles = StyleSheet.create({
    container : {
        flex: 1,
        //backgroundColor: '#fff',
    },

});