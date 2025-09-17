/**
 * App HomeScreen
 */

import axios from 'axios';
import React, { useState, useEffect, useRef, useCallback }  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  FlatList,
  Pressable,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
  TextInput,
  ImageBackground,

} from 'react-native';
import { Icon, Button, BottomSheet } from '@rneui/base';
import { appColors, parameters, appFonts } from '../global/Styles';
import { useToast } from 'native-base';
import { servicesData, laundromatsData } from '../global/Data';
import { LHBannerSlider } from '../components/LHBannerSlider';
import { LaundromatCard, FeaturedServiceCard } from '../components/laundromats/LMCards'; 
import { APIGlobaltHeaders, baseUrlRoot, baseUrlV1,   } from '../api/LHAPI';
import { appImages } from '../global/Data';
import LHGenericFeatureModal from '../components/LHGenericFeatureModal';
import LHHomeFooter from '../components/LHHomeFooter';
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
          <ImageBackground source={appImages.laundryBg} style={{ flex: 1, }}>
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

                <ScrollView contentContainerStyle={{  }}>
                    <View style={{ flex:1, }}>

                      {/* Dynamic Home Banner Ads section */}
                      <View style={{ paddingHorizontal:10, paddingBottom:10, }}>
                          <LHBannerSlider /> 
                      </View>
                      
                  </View> 
              </ScrollView>


               {/** Generic Feature Modal */}
                <LHGenericFeatureModal 
                    isModVisible={ isFeatureModalVisible } 
                    visibilitySetter={setIsFeatureModalVisible} 
                    isDismissable={true}
                    title="Laundromats"
                    description="Featured Laudromats coming soon. View Laundromats business info and services."
                />

            </ImageBackground>
        </View>
        <LHHomeFooter  
            activeTab="home"
            onPressHome={ () => { navigation.navigate('HomeScreen') } }
            onPressExplore={ () => { navigation.navigate('ExploreScreen') } }
            onPressBookings={ () => { navigation.navigate('BookingsScreen') } }
            onPressProfile={ () => { navigation.navigate('ProfileScreen') }  }
            onPressMore={ () => { navigation.navigate('MoreScreen') } }
        />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: appColors.CardBackground
  },

  locationBoxContainer: {
    flexDirection:'row', 
    alignItems:'center',
    backgroundColor:appColors.grey6,
    borderRadius: 10,
    paddingVertical:5,

    // adding some box shadow effect to home features icon containers
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 3},
    shadowRadius: 10,
    elevation: 10,

  },

  servicesInfobox: {
    backgroundColor:appColors.AppBlue, 
    width:80, 
    height:80, 
    borderRadius:50, 
    overflow:'hidden', 
    marginHorizontal:5,
    borderColor:appColors.grey2,
    alignItems:'center',
    padding:8,

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





});

export default HomeScreen;
