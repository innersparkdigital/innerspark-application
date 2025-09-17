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
    Image, 
    Pressable, 
    ActivityIndicator,
    FlatList,
    StatusBar,
} from "react-native";

import { Button, Icon, ListItem } from '@rneui/base';
import { ScrollView, useToast } from 'native-base';
import { appColors, appColorscolors, parameters } from '../global/Styles';
import { appImages } from '../global/Data';


export default function OrdersScreen({navigation}) {

  const dispatch = useDispatch();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Redux Store Data
  const userDetails = useSelector(state => state.userData.userDetails);


  return (
        <View style={styles.container}>
          <StatusBar backgroundColor={appColors.AppBlue} barStyle="light-content" />
            <View style={{ flex:1, justifyContent:'center', alignItems:'center'}}>
                <View style={{ paddingVertical:15 }}>
                    <Icon type="font-awesome-5" name="bell" color={appColors.grey3} size={80} /> 
                </View>
                <Text style={{ fontSize:18, color:appColors.grey2, fontWeight:'bold' }}>No Notifications.</Text>
                <View style={{ paddingVertical:30 }}></View>
            </View>
                
        </View>
    );

    }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.grey7,
    
  },
  
});