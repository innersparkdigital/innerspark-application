/**
 * App - Notification Screen
 * @format
 */
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';

import { 
    StyleSheet, 
    Text, 
    View,
    SafeAreaView,
    Image, 
    Pressable, 
    ActivityIndicator,
    FlatList,
    StatusBar,
    ImageBackground,
} from "react-native";

import { Button, Icon, ListItem } from '@rneui/base';
import { ScrollView, useToast } from 'native-base';
import { appColors, parameters, appFonts } from '../global/Styles';
import { appImages } from '../global/Data';
import LHGenericHeader from '../components/LHGenericHeader';


export default function NotificationScreen({navigation}) {

  const dispatch = useDispatch();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);


  return (
    <SafeAreaView style={{ flex:1 }}>
        <StatusBar backgroundColor={appColors.AppBlue} barStyle="light-content" />
        <View style={styles.container}>
          <ImageBackground source={appImages.laundryBg} style={{ flex: 1, }}>
              <View style={{ paddingVertical:parameters.headerHeightTiny }}>
                <LHGenericHeader
                  title='Notifications'
                  showLeftIcon={true}
                  showRightIcon={false}
                  leftIconPressed={ () => { navigation.goBack(); } } 
                />
              </View>

              <View style={{ flex:1, justifyContent:'center', alignItems:'center'}}>
                  <View style={{ paddingVertical:15 }}>
                      <Icon type="font-awesome-5" name="bell" color={appColors.grey4} size={80} /> 
                  </View>
                  <Text style={{ fontSize:18, color:appColors.AppBlue, fontFamily: appFonts.bodyTextBold }}>No Notifications.</Text>
                  <View style={{ paddingVertical:30 }}></View>
              </View>

          </ImageBackground>
        </View>
    </SafeAreaView>
    );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.grey7,
    
  },
  
});