/**
 * App HomeScreen
 */
import axios from 'axios';
import React, { useState, useEffect, useRef, useCallback }  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  FlatList,
  Pressable,
  ActivityIndicator,
  TextInput,
  ImageBackground,

} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { Icon, Button, BottomSheet } from '@rneui/base';
import { appColors, parameters, appFonts } from '../global/Styles';
import { useToast } from 'native-base';
import { APIGlobaltHeaders, baseUrlRoot, baseUrlV1,   } from '../api/LHAPI';
import { appImages } from '../global/Data';
import { getFirstName } from '../global/LHShortcuts';


const baseUrl = baseUrlRoot + baseUrlV1;
APIGlobaltHeaders(); // API Global headers

// get the screen Width
const SCREEN_WIDTH = Dimensions.get('window').width;

const HomeScreen = ({navigation}) => {

  const dispatch = useDispatch();
  const toast = useToast();

  const userDetails = useSelector(state => state.userData.userDetails); // User details from redux store
  // const userAvatar = useSelector(state => state.userData.userDetails.image); // User avatar from redux store

  const [isLoading, setIsLoading] = useState(false); // loading state
  const [isFeatureModalVisible, setIsFeatureModalVisible] = useState(false);
 

  return (
    <SafeAreaView style={{ flex:1 }}>
        <StatusBar barStyle='light-content' backgroundColor={appColors.AppBlue} />
        <View style={ styles.container }>
          <ImageBackground source={appImages.bgPatterns} style={{ flex: 1, }}>

                {/* Home Header Section */}
                <View style={{ paddingTop:parameters.headerHeightS, paddingBottom:5 }}>
                     {/* Header section */}
                     <View style={{ paddingHorizontal:15, paddingVertical:5, flexDirection:'row', alignItems:'center', marginVertical:5 }}>
                        <View style={{ flex:1 }}>
                            <Text style={{ color: appColors.AppBlue, fontSize:16, paddingBottom:5, fontFamily: appFonts.bodyTextMedium }}>Salut John,</Text>
                            <Text style={{ color: appColors.AppBlue, fontSize:16, fontFamily: appFonts.headerTextBold }}>Quel est votre objectif aujourd'hui?</Text>
                        </View>
                        <Pressable style={{ }} onPress={ () => { navigation.navigate("NotificationScreen"); } }>
                            <Icon type="material-community" name="bell-badge-outline" color={appColors.AppBlue} size={35} />
                        </Pressable>
                     </View>
                </View>

                <ScrollView contentContainerStyle={{ flex:1, }}>
                    <View style={{ flex:1, }}>

                      
                      
                  </View> 
              </ScrollView>
            </ImageBackground>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: appColors.CardBackground
  },


});

export default HomeScreen;
