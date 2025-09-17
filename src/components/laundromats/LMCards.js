/**
 * Various Laundromat Cards UI Component
 */
import React from "react";
import { StyleSheet, Text, View, Image, Dimensions, Pressable, ImageBackground } from "react-native";
import { Icon, Button, Avatar } from "@rneui/base";
import { appColors, parameters, appFonts } from '../../global/Styles';
import { appImages } from "../../global/Data";


// get the screen Width
const SCREEN_WIDTH = Dimensions.get('window').width;


/** 
 * Laundromat Card UI
 * 
 */
export const LaundromatCard = ({ 
    name="Laundromat",
    image,
    imagePlaceholder = appImages.laundromatDefault,
    awayDistance="O.3 Km",
    awayTime="2Hrs-48Hrs",
    price="4k",
    priceUnit="kg",
    rating="4.5",
    deliveryFee="2000",
    onPressAction,
    onBookmarkPress,
   
 }) => {
    return (
        <Pressable style={styles.laundromatBox} onPress={onPressAction}>
            <View style={{ padding:5 }}>
                <View style={{ backgroundColor:appColors.grey4, height:100, borderRadius:15, overflow:'hidden' }}>
                    {
                        image && <ImageBackground source={{ uri: image }} style={{ width:'100%', height:'100%', }} resizeMode="cover"></ImageBackground>
                          ||
                        <ImageBackground source={imagePlaceholder} style={{ width:'100%', height:'100%' }} resizeMode="cover"></ImageBackground>
                    }
                    <View style={{ minWidth:50, paddingHorizontal:2, position:'absolute', top:5, left:5 }}>
                        <View style={{ flexDirection:'row', alignItems:'center' }}>
                            <Pressable style={{ marginRight:3, }} onPress={onBookmarkPress}>
                                <Icon name="bookmark" type="material-community" color={appColors.CardBackground} size={20} />
                            </Pressable>

                            <View style={{ backgroundColor:appColors.AppBlueDark, paddingVertical:2, paddingHorizontal:3, borderRadius:5, }}>
                              <View style={{ flexDirection:'row', alignItems:'center' }}>
                                  <Text style={{ color:appColors.CardBackground, fontSize:10, fontWeight:'500', paddingHorizontal:2 }}>{rating}</Text>
                                  <Icon name="star-outline" type="material-community" color={appColors.CardBackground} size={13} />
                              </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{  }}>
                    <View style={{ paddingHorizontal:2, paddingVertical:5 }}>
                      <Text style={{ color:appColors.CardBackground, fontSize:13, paddingBottom:3, fontFamily:appFonts.headerTextBold }} numberOfLines={1} ellipsizeMode='tail'>{name}</Text>
                      <View style={{ paddingBottom:2, flexDirection:'row', justifyContent:'space-between' }}>
                          <View style={{ flexDirection:'row', alignItems:'center', paddingRight:1 }}>
                              <Icon name="map-marker" type="material-community" color={appColors.CardBackground} size={10} />
                              <Text style={{ color:appColors.CardBackground, fontSize:10, paddingHorizontal:2, fontFamily: appFonts.bodyTextRegular }}>{awayDistance}</Text>
                          </View>
                          {/* <View style={{ flexDirection:'row', alignItems:'center', paddingHorizontal:1 }}>
                              <Icon name="timer" type="material-community" color={appColors.CardBackground} size={10} />
                              <Text style={{ color:appColors.CardBackground, fontSize:10, fontWeight:'400', paddingHorizontal:2 }}>{awayTime}</Text>
                          </View> */}
                          <View style={{ flexDirection:'row', alignItems:'center', paddingHorizontal:1 }}>
                              {/* <Icon name="checkbox-blank" type="material-community" color={appColors.CardBackground} size={10} /> */}
                              <Image style={{ width:11, height:11, resizeMode:'contain' }} source={ appImages.ugxIconWhite } />
                              <Text style={{ color:appColors.CardBackground, fontSize:10, paddingHorizontal:2, fontFamily: appFonts.bodyTextRegular }}>{price}/{priceUnit}</Text>
                          </View>
                          <View style={{ flexDirection:'row', alignItems:'center', paddingHorizontal:1 }}>
                              <Icon name="bike" type="material-community" color={appColors.CardBackground} size={10} />
                              <Text style={{ color:appColors.CardBackground, fontSize:10, paddingHorizontal:2, fontFamily: appFonts.bodyTextRegular }}>{deliveryFee} UGX</Text>
                          </View>
                      </View>
                    </View>
                </View>
            </View>
        </Pressable>
    )
}



/** 
 * Laundromat Card UI - Horizontal View Format
 * 
 */
export const LaundromatCardH = ({ 
  name="Laundromat",
  image,
  imagePlaceholder = appImages.laundromatDefault,
  awayDistance="O.3 Km",
  awayTime="2Hrs-48Hrs",
  price="4k",
  deliveryFee="2000",
  priceUnit="kg",
  rating="4.5",
  onPressAction,
  onBookmarkPress,
  onFavoritePress,
 
}) => {
  return (
      <Pressable style={styles.laundromatBoxH} onPress={onPressAction}>
          <View style={{ flex:1, padding:5, flexDirection:'row' }}>
              <View style={{ flex:1, backgroundColor:appColors.grey4, borderRadius:15, overflow:'hidden', marginRight:3 }}>
                  {
                      image && <ImageBackground source={{ uri: image }} style={{ width:'100%', height:'100%', }} resizeMode="cover"></ImageBackground>
                        ||
                      <ImageBackground source={imagePlaceholder} style={{ width:'100%', height:'100%' }} resizeMode="cover"></ImageBackground>
                  }
                  <View style={{ minWidth:50, paddingHorizontal:2, position:'absolute', top:5, left:5 }}>
                    <View style={{ flexDirection:'row', alignItems:'center' }}>
                        <View 
                            style={{ marginRight:3, justifyContent:'center', alignItems:'center', width:15, height:15, borderRadius:20, backgroundColor:appColors.CardBackground }} 
                            onPress={onFavoritePress}
                        >
                           <Icon name="star" type="material-community" color={appColors.AppBlue} size={12} />
                        </View>

                        <View style={{ backgroundColor:appColors.CardBackground, paddingHorizontal:3, borderRadius:5, }}>
                          <View style={{ flexDirection:'row', alignItems:'center' }}>
                              <Text style={{ color:appColors.AppBlueDark, fontSize:10, paddingHorizontal:2, fontFamily: appFonts.bodyTextMedium }}>{rating}</Text>
                              {/* <Icon name="star-outline" type="material-community" color={appColors.CardBackground} size={13} /> */}
                          </View>
                      </View>
                    </View>
                  </View>
              </View>

              <View style={{ flex:2, paddingHorizontal:3 }}>
                  <View style={{ paddingHorizontal:2, }}>
                    <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
                        <View style={{ flex:1 }}>
                           <Text 
                              style={{ 
                                color:appColors.CardBackground, 
                                fontSize:14, 
                                paddingBottom:3,
                                fontFamily: appFonts.bodyTextBold,
                              }} 
                              numberOfLines={1} 
                              ellipsizeMode='tail'
                            >
                              {name}
                          </Text>
                        </View>
                        <Pressable style={{  }} onPress={onBookmarkPress}>
                          <Icon name="bookmark" type="material-community" color={appColors.CardBackground} size={20} />
                        </Pressable>
                    </View>
                   
                    <View style={{ paddingBottom:2, }}>
                        <View style={{ flexDirection:'row', alignItems:'center', paddingBottom:1 }}>
                            {/* <Icon name="checkbox-blank" type="material-community" color={appColors.CardBackground} size={10} /> */}
                            <Image style={{ width:11, height:11, resizeMode:'contain' }} source={ appImages.ugxIconWhite } />
                            <Text style={{ color:appColors.CardBackground, fontSize:11, paddingHorizontal:2, fontFamily: appFonts.bodyTextRegular }}>{price}/{priceUnit}</Text>
                        </View>
                        <View style={{ flexDirection:'row', alignItems:'center', paddingBottom:1 }}>
                            <Icon name="map-marker" type="material-community" color={appColors.CardBackground} size={11} />
                            <Text style={{ color:appColors.CardBackground, fontSize:11, paddingHorizontal:2, fontFamily: appFonts.bodyTextRegular }}>{awayDistance}</Text>
                        </View>
                        <View style={{ flexDirection:'row', alignItems:'center', paddingBottom:1 }}>
                            <Icon name="bike" type="material-community" color={appColors.CardBackground} size={11} />
                            <Text style={{ color:appColors.CardBackground, fontSize:11, paddingHorizontal:2, fontFamily: appFonts.bodyTextRegular }}>{deliveryFee} UGX</Text>
                        </View>
                        {/* <View style={{ flexDirection:'row', alignItems:'center', paddingBottom:1 }}>
                            <Icon name="timer" type="material-community" color={appColors.CardBackground} size={11} />
                            <Text style={{ color:appColors.CardBackground, fontSize:11, fontWeight:'400', paddingHorizontal:2 }}>{awayTime}</Text>
                        </View> */}
                    </View>
                  </View>
              </View> 
          </View>
      </Pressable>
  )
}


/** 
 * Featured Service Card UI - Standard Format
 * 
 */
export const FeaturedServiceCard = ({ 
  name="Laundromat",
  image,
  imagePlaceholder = appImages.laundromatDefault,
  services="Laundry, Folding",
  onPressAction,
 
}) => {
  return (
      <Pressable style={styles.featuredServiceBox} onPress={onPressAction}>
          <View style={{ padding:5 }}>
              <View style={{ backgroundColor:appColors.grey4, height:80, borderRadius:15, overflow:'hidden' }}>
                  {
                      image && <ImageBackground source={{ uri: image }} style={{ width:'100%', height:'100%', }} resizeMode="cover"></ImageBackground>
                        ||
                      <ImageBackground source={imagePlaceholder} style={{ width:'100%', height:'100%' }} resizeMode="cover"></ImageBackground>
                  }
                  <View style={{ minWidth:20, paddingHorizontal:2, position:'absolute', top:4, left:3 }}>
                      <View style={{ backgroundColor:appColors.AppBlueDark, paddingVertical:2, paddingHorizontal:3, borderRadius:5, }}>
                        <View style={{ flexDirection:'row', alignItems:'center' }}>
                            <Icon name="tag" type="material-community" color={appColors.CardBackground} size={10} />
                            {/* <Text style={{ color:appColors.CardBackground, fontSize:8, fontWeight:'400', paddingHorizontal:2 }}>Sponsored</Text> */}
                        </View>
                      </View>
                  </View>
              </View>
              
              <View style={{ paddingHorizontal:2, paddingVertical:5 }}>
                  <Text style={styles.featuredServiceTitle} numberOfLines={1} ellipsizeMode='tail'>{name}</Text>
                  <View style={{ flexDirection:'row', alignItems:'center', paddingHorizontal:1 }}>
                      {/* <Icon name="timer" type="material-community" color={appColors.CardBackground} size={10} /> */}
                      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.featuredServiceDescription}>{services}</Text>
                  </View>
              </View>  
          </View>
      </Pressable>
  )
}



/** 
 * Booking Card UI - Standard Format
 * Status: 1 - Confirmed, 2 - Pending, 3 - Completed
 * 
 */
export const BookingCard = ({ 
  name="Laundromat",
  image,
  imagePlaceholder = appImages.laundromatDefault,
  rating="4.5",
  status=1,
  statusText="Confirmed",
  onPressAction,
  onViewReceiptPress,
  onReviewPress,
 
}) => {
  return (
      <Pressable onPress={onPressAction}>
          <View style={{...styles.bookingBox, backgroundColor: status===1 ? appColors.AppBlue : appColors.CardBackground }}>

              <View style={{ flex:1, padding:5, flexDirection:'row' }}>
                    {/* Laundromat Image */}
                    <View style={{ flex:1, backgroundColor:appColors.grey4, borderRadius:15, overflow:'hidden', marginRight:3 }}>
                      {
                          image && <ImageBackground source={{ uri: image }} style={{ width:'100%', height:'100%', }} resizeMode="cover"></ImageBackground>
                            ||
                          <ImageBackground source={imagePlaceholder} style={{ width:'100%', height:'100%' }} resizeMode="cover"></ImageBackground>
                      }
                      <View style={{ minWidth:50, paddingHorizontal:2, position:'absolute', top:5, left:5 }}>
                          <View style={{ flexDirection:'row', alignItems:'center' }}>
                              <View 
                                  style={{ marginRight:3, justifyContent:'center', alignItems:'center', width:15, height:15, borderRadius:15, backgroundColor:appColors.CardBackground }} 
                                  onPress={ () => { console.log("save to favorite!"); }}>
                                <Icon name="star" type="material-community" color={appColors.AppBlue} size={13} />
                              </View>

                              <View style={{ backgroundColor:appColors.CardBackground,  paddingHorizontal:4, borderRadius:5, }}>
                                <View style={{ flexDirection:'row', alignItems:'center' }}>
                                    <Text style={{ color:appColors.AppBlueDark, fontSize:10, fontWeight:'600', paddingHorizontal:2 }}>{rating}</Text>
                                    {/* <Icon name="star-outline" type="material-community" color={appColors.CardBackground} size={13} /> */}
                                </View>
                            </View>
                          </View>
                      </View>
                    </View>
                    {/* Laundromat Image End */}

                    {/* Laundromat Details */}
                    <View style={{ flex:2, paddingHorizontal:3 }}>
                        <View style={{ paddingHorizontal:2, }}>
                          <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
                              <View style={{ flex:1, paddingRight:5 }}>
                                <Text 
                                      style={{ 
                                        color: status===1 ? appColors.CardBackground : appColors.AppBlue,
                                        fontSize:14, 
                                        //fontWeight:'700', 
                                        paddingBottom:3,
                                        fontFamily: appFonts.bodyTextTitle,
                                      }} 
                                      numberOfLines={1} 
                                      ellipsizeMode='tail'
                                  >
                                    {name}
                                  </Text>
                              </View>

                              {/* Status Button */}
                              <Pressable 
                                  style={{ }} 
                                  onPress={onPressAction}
                              >
                                  <View style={{ backgroundColor: status===1 ? appColors.CardBackground : appColors.AppBlue, paddingVertical:1, paddingHorizontal:4, borderRadius:5, }}>
                                      <Text 
                                        style={{ 
                                          color:status===1 ? appColors.AppBlue : appColors.CardBackground, 
                                          fontSize:10, 
                                          // fontWeight:'500', 
                                          paddingHorizontal:2,
                                          fontFamily: appFonts.bodyTextMedium,
                                        }}
                                      >
                                        { statusText }
                                      </Text>
                                  </View>
                              </Pressable>
                          </View>
                      
                          <View style={{ paddingBottom:2, }}>
                              <View style={{ flexDirection:'row', alignItems:'center', paddingBottom:1 }}>
                                  <Icon name="calendar" type="material-community" color={status===1 ? appColors.CardBackground : appColors.AppBlue} size={12} />
                                  <Text 
                                      style={{ 
                                        color: status===1 ? appColors.CardBackground : appColors.AppBlue, 
                                        fontSize:12, 
                                        // fontWeight:'400', 
                                        paddingHorizontal:3,
                                        fontFamily: appFonts.bodyTextRegular,
                                      }}
                                  >
                                      Aug 08,2024 | 10:00 AM
                                  </Text>
                              </View>

                              <View style={{ flexDirection:'row', alignItems:'center', paddingBottom:1 }}>
                                  <Icon 
                                      name="map" 
                                      type="material-community" 
                                      color={status===1 ? appColors.CardBackground : appColors.AppBlue} 
                                      size={12} 
                                  />
                                  <Text 
                                    style={{ 
                                      color:status===1 ? appColors.CardBackground : appColors.AppBlue, 
                                      fontSize:12, 
                                      // fontWeight:'400', 
                                      paddingHorizontal:3,
                                      fontFamily: appFonts.bodyTextRegular,
                                    }}
                                  >
                                    Kampala, Makindye
                                  </Text>
                              </View>

                              <View style={{ height:1,paddingVertical:3, borderColor:appColors.grey5, borderBottomWidth:0.5 }}></View>

                              <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingBottom:1 }}>
                                  {/* <Icon name="calendar" type="material-community" color={appColors.CardBackground} size={12} /> */}
                                  <Text style={{ color:status===1 ? appColors.CardBackground : appColors.AppBlue, fontSize:11, paddingHorizontal:3, fontFamily: appFonts.bodyTextRegular }}>Total Amount</Text>
                                  <Text style={{ color:status===1 ? appColors.CardBackground : appColors.AppBlue, fontSize:11, paddingHorizontal:3, fontFamily: appFonts.bodyTextExtraBold }}>UGX 45,000</Text>
                              </View>

                              <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingBottom:1 }}>
                                  {/* <Icon name="calendar" type="material-community" color={appColors.CardBackground} size={12} /> */}
                                  <Text style={{ color:status===1 ? appColors.CardBackground : appColors.AppBlue, fontSize:11, paddingHorizontal:3, fontFamily: appFonts.bodyTextRegular }}>Balance </Text>
                                  <Text style={{ color:status===1 ? appColors.CardBackground : appColors.AppBlue, fontSize:11, paddingHorizontal:3, fontFamily: appFonts.bodyTextExtraBold }}>UGX 0</Text>
                              </View>
                          </View>

                      </View> 
                    </View> 
                    {/* Laundromat Details End */}

              </View>

              {/* Action Buttons */}
              {/* show only if status is completed */}
              { status===3 && (
                <View style={{ flex:1, paddingHorizontal:5, marginBottom:3, paddingVertical:4 }}>
                  {/* A divider */}
                <View style={{ height:1, backgroundColor:appColors.grey6, marginVertical:5 }}></View>

                {/* Action Buttons Container */}  
                  <View style={{ padding:2 }}>
                      <View style={{ flexDirection:'row' }}>
                          <View style={{ flex:1 }}>
                              <Button 
                                  title="View e-receipt"
                                  buttonStyle={{ 
                                    ...parameters.appButtonXLBlue, 
                                    backgroundColor:appColors.CardBackground, 
                                    borderRadius:5, 
                                    borderWidth:1, 
                                    borderColor:appColors.AppBlue 
                                  }}
                                  titleStyle={{ ...parameters.appButtonXLTitle, color:appColors.AppBlue }} 
                                  onPress={ onViewReceiptPress }
                              />
                          </View>
                          <View style={{ paddingHorizontal:1 }}></View>
                          <View style={{ flex:1 }}>
                              <Button 
                                  title="Leave a review"
                                  buttonStyle={{ 
                                    ...parameters.appButtonXLBlue, 
                                    borderRadius:5, 
                                    borderWidth:1, 
                                    borderColor:appColors.grey6 
                                  }}
                                  titleStyle={ parameters.appButtonXLTitle } 
                                  onPress={ onReviewPress }
                              /> 
                          </View>
                      </View>
                  </View>

                </View>
              )}
              {/* Action Buttons End */}

          </View>
      </Pressable>
  )
}



const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },

  /* Laundromat Card Styles */ 
  laundromatBox: {
    backgroundColor: appColors.AppBlue,
    // backgroundColor: appColors.grey4,
    // paddingVertical:25,
    // paddingHorizontal: 25,
    borderRadius: 15,
    width: SCREEN_WIDTH*0.90/2,
    marginRight:10,
    overflow:'hidden',
    marginBottom:3,
    // width:SCREEN_WIDTH*0.90/3, 
    // backgroundColor:'yellow', 
    minHeight:160,

    // Implementing box shadow
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 2},
    shadowRadius: 10,
    elevation: 2,
  },

  /* Laundromat Card Horizontal Card Styles */ 
  laundromatBoxH: {
    flex:1,
    backgroundColor: appColors.AppBlue,
    // backgroundColor: appColors.grey4,
    // paddingVertical:25,
    // paddingHorizontal: 25,
    borderRadius: 15,
    marginBottom:5,
    minHeight:100,

    // Implementing box shadow
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 2},
    shadowRadius: 10,
    elevation: 2,
  },

  /* Featured Service Card Styles */
  featuredServiceBox: {
    // backgroundColor: appColors.AppBlue,
    backgroundColor: appColors.grey7,
    borderRadius: 15,
    width: SCREEN_WIDTH*0.95/3,
    marginRight:6,
    overflow:'hidden',
    minHeight:100,
    marginBottom:3,

    // Implementing box shadow
    shadowColor: 'black',
    shadowOpacity: 0.10,
    shadowOffset: { width: 0, height: 2},
    shadowRadius: 10,
    elevation: 2,
  },

  featuredServiceTitle: {
    color:appColors.AppBlue, 
    fontSize:12, 
    // fontWeight:'700', 
    paddingBottom:3,
    fontFamily: appFonts.bodyTextBold,

  },

  featuredServiceDescription: {
    color:appColors.AppBlue, 
    fontSize:10, 
    paddingHorizontal:2,
    fontFamily: appFonts.bodyTextRegular,
  },

  /* Booking Card Styles */
  bookingBox: {
    flex:1,
    backgroundColor: appColors.AppBlue,
    // backgroundColor: appColors.grey4,
    // paddingVertical:25,
    // paddingHorizontal: 25,
    borderRadius: 15,
    minHeight:100,
    marginBottom:8,
    marginHorizontal:2,
    marginTop:2,

    // Implementing box shadow
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3},
    shadowRadius: 10,
    elevation: 3,
  },


  
});