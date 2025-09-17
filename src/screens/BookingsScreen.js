/**
 * App Bookings Screen
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
import { Icon, Button, BottomSheet, Tab, TabView, } from '@rneui/base';
import { appColors, parameters, appFonts } from '../global/Styles';
import YoHomeHeader from '../components/YoHomeHeader';
import { useToast } from 'native-base';
import { LaundromatCardH, BookingCard } from '../components/laundromats/LMCards';
import { appImages, laundromatsData } from '../global/Data';
import LHGenericHeader from '../components/LHGenericHeader';
import LHHomeFooter from '../components/LHHomeFooter';

import { APIGlobaltHeaders, baseUrlRoot, baseUrlV1,   } from '../api/LHAPI';

const baseUrl = baseUrlRoot + baseUrlV1;
APIGlobaltHeaders(); // API Global headers

// get the screen Width
const SCREEN_WIDTH = Dimensions.get('window').width;


const BookingsScreen = ({navigation, route}) => {

  const dispatch = useDispatch();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false); // loading state
  const [index, setIndex] = React.useState(0);

  // control active tab index from incoming screen
  // const { activeTabIndex } = route.params; 


  useEffect( 
    () => { 
       //  getAppHomeData({ dispatch:dispatch, userID:userToken.userId } ); 

       if (route.params) {
           // check if active tab index is set
           if (route.params.activeTabIndex) {
              // console.log("Wallet Active Tab is set!");
              setIndex(route.params.activeTabIndex); // activate the tab index
           }
       }

    }, [index] );


  return (
    <SafeAreaView style={{ flex:1}}>
        <StatusBar barStyle='light-content' backgroundColor={appColors.AppBlue} />
        <View style={ styles.container }>
          <ImageBackground source={appImages.laundryBg} style={{ flex: 1, }}>
            
              <View style={{ paddingVertical:parameters.headerHeightTinier }}>
                <LHGenericHeader showLeftIcon={true} title='My Bookings' leftIconPressed={ () => { navigation.goBack(); } } />
              </View>
            
              <View style={{ flex:1, paddingHorizontal:10 }}>

                    <View style={{ paddingHorizontal:10, paddingVertical:5 }}>
                        <Text style={{ color:appColors.AppBlue, fontSize:16, fontFamily: appFonts.bodyTextBold }}>Book Laundry Service</Text>
                    </View>

                    {/* Book or Pickup Button */}
                    <Pressable onPress={ () => {  navigation.navigate("ExploreScreen"); } } style={{ marginTop:6, marginBottom:6, }}>
                        <View 
                            style={{ 
                                backgroundColor:appColors.CardBackground,
                                borderRadius:10,
                                flexDirection:"row",
                                alignItems:"center",
                                paddingHorizontal:15,
                                marginHorizontal:10,
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
                                <Icon type="material-community" color={appColors.AppBlue} name="plus-circle" size={25} />
                            </View>
                            <Text style={{ color:appColors.grey4, flex:8, fontFamily: appFonts.bodyTextRegular, fontSize:13 }}>Book Service or Request Pickup.</Text>
                        </View>
                    </Pressable>


                    {/* Bookings Tabs Container */}
                    <View style={{ flex:1 }}>

                        {/** Tabs controls Start */}
                        <View style={{ minHeight:50, paddingVertical:5 }}>
                            <View style={{  }}>
                                <Tab
                                    value={index}
                                    onChange={(e) => setIndex(e)}
                                    indicatorStyle={{ 
                                        backgroundColor: 'transparent', 
                                        borderWidth:0, 
                                        borderColor:appColors.AppBlue, 
                                        // height: 55,
                                        // width:120, 
                                        // height:0,
                                        // borderRadius:30,
                                        // marginHorizontal:2 
                                    }}
                                    variant="default"
                                    containerStyle={{ backgroundColor:'transparent'}}
                                    
                                >
                                

                                {
                                    (index == 0) &&  <Tab.Item
                                                        title="Active"
                                                        titleStyle={{ fontSize: 13, color:appColors.AppBlue, fontFamily: appFonts.bodyTextTitle }}
                                                        containerStyle={{ 
                                                            // backgroundColor:appColors.grey6,  
                                                            borderBottomWidth:5, 
                                                            borderBottomColor:appColors.AppBlue,
                                                        }}
                                                    />

                                        ||

                                        <Tab.Item
                                            title="Active"
                                            titleStyle={{ fontSize: 13, color:appColors.AppBlue, fontFamily: appFonts.bodyTextMedium }}
                                            containerStyle={{ borderBottomColor:appColors.AppBlue, borderBottomWidth:1 }}
                                        />       
                                }

                                {
                                    (index == 1) &&  <Tab.Item
                                                        title="In Progress"
                                                        titleStyle={{ fontSize: 13, color:appColors.AppBlue, fontFamily: appFonts.bodyTextTitle }}
                                                        containerStyle={{ 
                                                            // backgroundColor:appColors.grey6 
                                                            borderBottomWidth:5, 
                                                            borderBottomColor:appColors.AppBlue,
                                                        }}
                                                    />

                                        ||

                                    <Tab.Item
                                        title="In Progress"
                                        titleStyle={{ fontSize: 13, color:appColors.AppBlue, fontFamily: appFonts.bodyTextMedium }}
                                        containerStyle={{ borderBottomColor:appColors.AppBlue, borderBottomWidth:1 }}
                                    />       
                                }

                                {
                                    (index == 2) &&  <Tab.Item
                                                        title="Completed"
                                                        titleStyle={{ fontSize: 13, color:appColors.AppBlue, fontFamily: appFonts.bodyTextTitle }}
                                                        containerStyle={{
                                                            // backgroundColor:appColors.grey6, 
                                                            borderBottomWidth:5, 
                                                            borderBottomColor:appColors.AppBlue,
                                                        }}
                                                    />

                                        ||

                                        <Tab.Item
                                            title="Completed"
                                            titleStyle={{ fontSize: 13, color:appColors.AppBlue, fontFamily: appFonts.bodyTextMedium }}
                                            containerStyle={{ borderBottomColor:appColors.AppBlue, borderBottomWidth:1 }}
                                        />        
                                }
                                </Tab>
                            </View>
                        </View>
                        {/* --- Tabs Controls end */}

                        {/** TabView Content Start  */}
                        <View style={{ flex:1 }}>
                            <TabView value={index} onChange={setIndex} animationType="timing" containerStyle={{ minHeight:400, }}>
                            
                                {/** Active Bookings Tab */}
                                <TabView.Item style={{ width: '100%' }}>
                                    <View style={{ }}>  
                                        { laundromatsData && (laundromatsData.length >= 1) && !isLoading && 
                                            <View style={{ }}>
                                                <View style={{ paddingVertical:5, paddingHorizontal:5 }}>
                                                    <FlatList 
                                                        showsVerticalScrollIndicator={false}
                                                        horizontal={false}
                                                        data={laundromatsData}
                                                        renderItem={({item, index}) => (
                                                            <BookingCard 
                                                                key={index} 
                                                                image={item.image}
                                                                name={item.name}
                                                                awayDistance={item.awayDistance}
                                                                awayTime={item.awayTime}
                                                                price={item.price}
                                                                priceUnit={item.priceUnit}
                                                            />
                                                        )}
                                                        
                                                    />
                                                </View>
                                            </View>
                                        }

                                        { ( !laundromatsData || laundromatsData.length<1 && !isLoading) &&
                                            <View style={{ justifyContent:'center', alignItems:'center' }}>
                                                <View style={{ paddingVertical:15 }}>
                                                    <Icon type="material-icons" name="local-laundry-service" color={appColors.grey4} size={60} /> 
                                                </View>
                                                <Text style={{ fontSize:18, color:appColors.grey2, fontWeight:'bold' }}>No Service Providers.</Text>
                                            </View>
                                        }
                                    </View>
                                </TabView.Item>

                                {/** In Progress Bookings Tab */}
                                <TabView.Item style={{ width: '100%' }}>
                                    <View style={{ flex:1, }}>
                                        <View style={{ flex:1, }}>
                                            
                                            { laundromatsData && (laundromatsData.length >= 1) && !isLoading && 
                                                <View style={{  }}>
                                                    <View style={{ paddingVertical:5, paddingHorizontal:5 }}>
                                                        <FlatList 
                                                            showsVerticalScrollIndicator={false}
                                                            horizontal={false}
                                                            data={laundromatsData}
                                                            renderItem={({item, index}) => (
                                                                <BookingCard 
                                                                    key={index} 
                                                                    image={item.image}
                                                                    name={item.name}
                                                                    price={item.price}
                                                                    status={2}
                                                                    statusText='Track Order'
                                                                    onPressAction={
                                                                        () => {
                                                                            // navigate to TrackOrderScreen
                                                                            navigation.navigate('TrackOrderScreen');
                                                                        }

                                                                    }

                                                                />
                                                            )}
                                                        />
                                                    </View>
                                                </View>
                                            }

                                        </View> 
                                    </View>
                                </TabView.Item>

                                {/** Completed Bookings Tab */}
                                <TabView.Item style={{ width: '100%' }}>
                                    <View style={{ flex:1 }}>
                                        <View style={{ flex:1 }}>

                                            { laundromatsData && (laundromatsData.length >= 1) && !isLoading && 
                                                <View style={{  }}>
                                                    <View style={{ paddingVertical:5, paddingHorizontal:5 }}>
                                                        <FlatList 
                                                            showsVerticalScrollIndicator={false}
                                                            horizontal={false}
                                                            data={laundromatsData}
                                                            renderItem={({item, index}) => (
                                                                <BookingCard 
                                                                    key={index} 
                                                                    image={item.image}
                                                                    name={item.name}
                                                                    price={item.price}
                                                                    status={3}
                                                                    statusText='Order Completed'
                                                                    onReviewPress={ 
                                                                        () => { 
                                                                            navigation.navigate('LaundromatScreen'); 
                                                                        } 
                                                                    }
                                                                    onViewReceiptPress={ 
                                                                        () => { 
                                                                            navigation.navigate('EReceiptScreen'); 
                                                                        } 
                                                                    }
                                                                />
                                                            )}
                                                            
                                                        />
                                                    </View>
                                                </View>
                                            }
                                            
                                        </View> 
                                    </View>
                                </TabView.Item>

                            </TabView>
                        </View>
                        {/** TabView Content End */}

                    </View>
                    {/* --- Booking Tabs end */}

              </View>
          </ImageBackground>
        </View>
        <LHHomeFooter 
            activeTab="bookings"
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

export default BookingsScreen;
