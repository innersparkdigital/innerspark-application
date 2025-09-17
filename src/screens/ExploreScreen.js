/**
 * App ExploreScreen
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
  ActivityIndicator,
  TextInput,
  ImageBackground,

} from 'react-native';
import { Icon, Button, BottomSheet } from '@rneui/base';
import { appColors, parameters, appFonts } from '../global/Styles';
import LHGenericHeader from '../components/LHGenericHeader';
import { appImages, laundromatsData } from '../global/Data';
import { useToast } from 'native-base';
import { LaundromatCardH, FeaturedServiceCard } from '../components/laundromats/LMCards';
import LHHomeFooter from '../components/LHHomeFooter';

import { APIGlobaltHeaders, baseUrlRoot, baseUrlV1, } from '../api/LHAPI';

const baseUrl = baseUrlRoot + baseUrlV1;
APIGlobaltHeaders(); // API Global headers

// get the screen Width
const SCREEN_WIDTH = Dimensions.get('window').width;


// Service categories
const serviceCategories = [
    { name: "Shoe Cleaning", active:true, id:0 },
    { name: "Ironing", active:false, id:1 },
    { name: "Washing", active:false, id:2 },
    { name: "Dry Cleaning", active:false, id:4 },
    { name: "Cleaning", active:false, id:5 },
    { name: "Shoes Care", active:false, id:6 },
];


const ExploreScreen = ({navigation}) => {

  const dispatch = useDispatch();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false); // loading state
  const [serviceCatTabIndex, setServiceCatTabIndex] = useState(0); // Default: 0


  return (
    <SafeAreaView style={{ flex:1}}>
        <StatusBar barStyle='light-content' backgroundColor={appColors.AppBlue} />
        <View style={ styles.container }>
            <ImageBackground source={appImages.laundryBg} style={{ flex: 1, }}>
               <View style={{ paddingVertical:parameters.headerHeightTiny }}>
                  <LHGenericHeader showLeftIcon={true} title='Explore Services' leftIconPressed={ () => { navigation.goBack(); } } />
               </View>
            
                <View style={{ flex:1, paddingHorizontal:10 }}>

                    {/* Explore Services Tab */}
                    <View style={{ paddingVertical:5, marginBottom:5 }}>
                        {/* Services Tabbed Menu */}
                        <View style={ styles.tabbedMenuContainer }>
                            <FlatList 
                                showsHorizontalScrollIndicator = {false}
                                horizontal = {true}
                                data = {serviceCategories}
                                keyExtractor = { (item) => item.id }
                                extraData={serviceCatTabIndex}
                                renderItem = {({item, index}) => (
                                    <Pressable 
                                        style={{ 
                                            paddingHorizontal:3, 
                                            paddingVertical:2, 
                                            marginHorizontal:2, 
                                            borderBottomWidth: (serviceCatTabIndex == item.id) ? 3 : 0,
                                            borderBottomColor: appColors.AppBlue, 
                                        }}
                                        onPress={ () => { setServiceCatTabIndex(item.id) } }
                                    >
                                        <View style={{ borderRadius:5, minHeight:30, minWidth:70, justifyContent:'center', alignItems: 'center' }}>
                                            <Text style={{ color:appColors.AppBlue, fontSize:15, fontFamily: (serviceCatTabIndex == item.id) ? appFonts.bodyTextBold : appFonts.bodyTextRegular }}>{item.name}</Text> 
                                        </View>
                                    </Pressable>
                                )}
                            />
                        </View>  
                    </View>

                    {/* Explore Search bar section */}
                    <View style={{ marginVertical:5 }}>
                        <Pressable onPress={ () => { } } >
                            <View 
                                style={{ 
                                    backgroundColor:appColors.CardBackground,
                                    borderRadius:10,
                                    flexDirection:"row",
                                    alignItems:"center",
                                    paddingHorizontal:10,
                                    marginHorizontal:8,
                                    height:45,

                                    // adding some box shadow effect to home features icon containers
                                    shadowColor: 'black',
                                    shadowOpacity: 0.86,
                                    shadowOffset: { width: 1, height: 5},
                                    shadowRadius: 5,
                                    elevation: 5,
                                }}
                            >
                                <View style={{ flex:1 }}>
                                    <Icon type="material" color={appColors.AppBlue} name="search" size={25} />
                                </View>
                                <Text style={{ flex:8, color:appColors.grey3, fontSize:12, fontFamily: appFonts.bodyTextRegular }}>Search for service. Washing, Folding...</Text>
                            </View>
                        </Pressable>
                    </View>


                    <ScrollView>
                        {/* Featured Services Section */}
                        <View style={{  marginVertical:5, }}>
                            <View style={{ paddingHorizontal:5, flexDirection:'row', alignItems:'center', justifyContent:'space-between' }}>
                                <Text style={{ color: appColors.AppBlue, fontSize:16, fontFamily: appFonts.headerTextBold }}>Featured Services</Text>
                                <View style={{ flexDirection:'row', alignItems:'center' }}>
                                    <Text style={{ color: appColors.AppBlue, fontSize:14, paddingHorizontal:5, fontFamily: appFonts.bodyTextRegular }}>Sponsored</Text>
                                    <Icon type="material-community" name="tag" color={appColors.AppBlue} size={18} />
                                </View>
                            </View>

                            <View style={{ paddingVertical:5 }}>
                                { isLoading && 
                                    <View style={{ flexDirection:'row', justifyContent:'flex-start', alignItems:'center', paddingVertical:15 }}>
                                        <View style={{ paddingHorizontal:10 }}>
                                            <ActivityIndicator size={20} style={{ marginHorizontal:5, }} color={appColors.AppBlueFade} />
                                        </View>
                                        <Text style={{ fontSize:14, color:appColors.AppBlue, fontFamily: appFonts.bodyTextMedium }}>Loading Featured Services...</Text>
                                        <View style={{ paddingVertical:5 }}></View>
                                    </View>
                                } 

                            </View>
                        </View>


                        {/* Laundromats : Service Providers List */}
                        <View style={{ flex:1, marginVertical:2 }}>
                            <View style={{ flex:1, }}>
                                { isLoading && 
                                    <View style={{ flexDirection:'row', justifyContent:'center', alignItems:'center', paddingVertical:15 }}>
                                        <View style={{ paddingHorizontal:10 }}>
                                            <ActivityIndicator size={30} style={{ marginHorizontal:5, }} color={appColors.AppBlueFade} />
                                        </View>
                                        <Text style={{ fontSize:16, color:appColors.AppBlue, fontWeight:'600' }}>Loading Service Providers...</Text>
                                        <View style={{ paddingVertical:5 }}></View>
                                    </View>
                                } 

                            </View>
                        </View>

                    </ScrollView>

                </View>
            </ImageBackground>
        </View>
        <LHHomeFooter 
            activeTab="explore"
            onPressExplore={ () => { navigation.navigate('ExploreScreen') } }
            onPressBookings={ () => { navigation.navigate('BookingsScreen') } }
            onPressProfile={ () => { navigation.navigate('ProfileScreen') }  }
            onPressMore={ () => { navigation.navigate('MoreScreen') } }
            onPressHome={ () => { navigation.navigate('HomeScreen') } }
        />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: appColors.CardBackground
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

export default ExploreScreen;
