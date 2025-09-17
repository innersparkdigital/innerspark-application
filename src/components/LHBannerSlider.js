/**
 * Laundry House Banner Slider Component
 */
import React from "react";
import { StyleSheet, Text, View, Image, Dimensions, Pressable, } from "react-native";
import { Icon, } from "@rneui/base";
import { appColors, parameters } from '../global/Styles';
import { appImages } from "../global/Data";
import Swiper from 'react-native-swiper';

// get the screen Width
const SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * Home Banner Slider
 * @param data images data array 
 * @returns The Image slider component
 */
export const LHBannerSlider = (
  { 
    data=[
       { image:appImages.homeBanner1, title:"Slide Title", description:"Slide Description" },
       { image:appImages.homeBanner2, title:"Slide Title", description:"Slide Description" },
       { image:appImages.homeBanner3, title:"Slide Title", description:"Slide Description" },
       { image:appImages.homeBanner4, title:"Slide Title", description:"Slide Description" },
    ], // images data array
    
  }
  ) => {

  return (
    <View style={styles.sliderContainer}>
          <Swiper 
               autoplay={true} 
               showsPagination={true} 
               paginationStyle={{ bottom:-4, columnGap:5, }}
               autoplayTimeout={10} 
               horizontal={true} 
               // removeClippedSubviews={false}
               // autoplayDirection={true} 
               activeDotColor={appColors.AppBlue}
               containerStyle={{  }}
          >
              {
                // map all the images in the array
                data.map((item, index) => (
                    <View key={index} style={styles.bannerSlide}>
                        <Image source={item.image} style={styles.bannerSlideImage} />
                    </View>
                ))
              }
          </Swiper>
      </View>   
  );
}

const styles = StyleSheet.create({
  sliderContainer: {
      // flex:1,
      // height:100, 
      height:150, 
      // marginHorizontal:5,
      // backgroundColor:appColors.AppBlueFade, 
      // paddingVertical:5 
  },

   bannerSlide: {
    flex:1,
    //width: "100%",
    //height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'pink',
    // padding:10,
    // overflow:'hidden',
    // borderRadius: 15,
      
  },
  
  bannerSlideImage: {
    //width:"100%",
    width: SCREEN_WIDTH*0.92,
    //height: "100%",
    // height: 160,
    resizeMode:'contain',
    //flex:1,
    //borderRadius: 10,
    // borderWidth:5,
    // backgroundColor: '#9DD6EB',
  },

});