/**
 * App - Tracking Order Screen
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
  Pressable,
  ImageBackground,

} from 'react-native';
import { Icon, Button, BottomSheet } from '@rneui/base';
import { appImages, appLinks } from '../../global/Data';
import LHGenericHeader from '../../components/LHGenericHeader';


export default function TrackOrderScreen({ navigation }){
    
    // display the profile image if user has an image avatar 
    const dispatch = useDispatch();
    const userToken = useSelector(state => state.user.userToken); // User token data (userId, email, name, phone)
    const sessionUserData = useSelector(state => state.appSession.sessionUserData); // flexible user session data
    const toast = useToast();

    // Toast Notifications
    const notifyWithToast = (description) => { toast.show({ description: description, }) }


    // steps data
    const steps = [
        {
          title: 'Booking Confirmed',
          time: '10:00AM',
          date: 'Aug 08, 2024',
          completed: true,
          icon: 'check-circle',
          iconType: 'material-community'
        },
        {
          title: 'Order Pick Up',
          time: '12:00PM',
          date: 'Aug 08, 2024',
          completed: true,
          icon: 'arrow-down-circle',
          iconType: 'material-community'
        },
        {
          title: 'Cleaning In Progress',
          time: '15:00PM',
          date: 'Aug 08, 2024',
          completed: false,
          icon: 'refresh',
          iconType: 'material-community'
        },
        {
          title: 'Ready For Drop Off',
          time: '10:00AM',
          date: 'Aug 08, 2024',
          completed: false,
          icon: 'arrow-down-circle',
          iconType: 'material-community'
        },
        {
          title: 'Order Shipped',
          time: '10:00AM',
          date: 'Aug 08, 2024',
          completed: false,
          icon: 'truck',
          iconType: 'material-community'
        },
        {
          title: 'Order Delivered',
          time: '10:00AM',
          date: 'Aug 08, 2024',
          completed: false,
          icon: 'check-circle',
          iconType: 'material-community'
        }
        
      ];



    return(
      <SafeAreaView style={{ flex:1}}>
        <View style={ styles.container }>
            <ImageBackground source={appImages.laundryBg} style={{ flex: 1, }}>
                <View style={{ paddingVertical:parameters.headerHeightTiny }}>
                    <LHGenericHeader
                        title='Track Order' 
                        showLeftIcon={true}
                        leftIconPressed={ () => { navigation.goBack(); } } 
                    />
                </View>

                <ScrollView style={styles.scrollView}>

                    {/* Laundromat Info */}
                    <View style={styles.laundromatInfo}>
                        <Text style={styles.laundromatName}>Fast Boots & Dry Cleaning</Text>
                        <Text style={styles.laundromatAddress}>7th Floor, Shop 8. Rumee Building.</Text>
                    </View>

                    {/* Timeline */}
                    <View style={styles.timeline}>
                    {steps.map((step, index) => (
                        <View key={index} style={styles.timelineItem}>
                        {/* Connector Line */}
                        {index !== 0 && (
                            <View
                                style={[
                                    styles.connector,
                                    {
                                        backgroundColor: step.completed ? appColors.AppBlue : appColors.AppBlueOpacity
                                    }
                                ]}
                            />
                        )}

                        {/* Step Circle */}
                        <View
                            style={[
                                styles.circle,
                                {
                                    backgroundColor: step.completed ? appColors.AppBlue : appColors.CardBackground,
                                    borderColor: step.completed ? appColors.AppBlue : appColors.AppBlueOpacity
                                }
                            ]}
                        >
                            <Icon
                                name={step.icon}
                                type={step.iconType}
                                color={step.completed ? appColors.CardBackground : appColors.AppBlueOpacity}
                                size={16}
                            />
                        </View>

                        {/* Step Content */}
                        <View style={styles.stepContent}>
                            <Text
                                style={[
                                    styles.stepTitle,
                                    { color: step.completed ? appColors.AppBlue : appColors.AppBlueOpacity }
                                ]}
                            >
                                {step.title}
                            </Text>
                            <Text style={ step.completed ? styles.stepTimeCompleted : styles.stepTime }>
                               Date & Time | {step.date} | {step.time}
                            </Text>
                        </View>
                        </View>
                        ))}
                    </View>

                    {/* space at the bottom */}
                    <View style={{ marginBottom:15 }}></View>

                </ScrollView>

                
                {/* E-Receipt Button section */}
                <View style={{ paddingHorizontal:20, paddingVertical:15, marginBottom:15, marginTop:15 }}>
                    <Button 
                        title="VIEW E-RECEIPT" 
                        buttonStyle={ parameters.appButtonXLBlue }
                        titleStyle={ parameters.appButtonXLTitle }
                        onPress={
                            () => {
                                // Proceed to the next step
                                // go to the e-receipt screen
                                navigation.navigate('EReceiptScreen');
                            }
                        }
                    />
                </View>

            </ImageBackground>
        </View>
      </SafeAreaView>
    )
}

// local stylesheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appColors.CardBackground,
    },
    
    scrollView: {
        flex: 1,
        padding: 10
    },

    laundromatInfo: {
        marginBottom: 32, 
        justifyContent:'center',
        alignItems:'center'
    },

    laundromatName: {
        fontSize: 18,
        fontWeight: '700',
        color: appColors.AppBlue,
        marginBottom: 5
    },

    laundromatAddress: {
        fontSize: 14,
        color: appColors.AppBlue
    },

    timeline: {
        flex: 1,
        marginLeft: 16
    },

    timelineItem: {
        flexDirection: 'row',
        marginBottom: 30,
        position: 'relative'
    },

    connector: {
        position: 'absolute',
        left: 12,
        top: -60,
        width: 5,
        height: 75, // connector height
        backgroundColor: appColors.AppBlueOpacity,
        zIndex: -1, // ensure the connector is below the circle
    },

    circle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16
    },

    stepContent: {
        flex: 1
    },

    stepTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4
    },

    stepTime: {
        fontSize: 13,
        color: appColors.AppBlueOpacity
    },

    stepTimeCompleted: {
        fontSize: 13,
        color: appColors.AppBlue
    },

});