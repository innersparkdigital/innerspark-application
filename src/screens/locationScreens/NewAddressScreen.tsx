/**
 * App - New Address Screen
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { appColors, parameters } from '../../global/Styles';
import { useToast } from 'native-base';
import {
    StatusBar,
    ScrollView,
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Pressable,
    ImageBackground,
    TextInput,
    Platform,
    KeyboardAvoidingView,

} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button, BottomSheet } from '@rneui/base';
import { appImages, appLinks } from '../../global/Data';
import LHGenericHeader from '../../components/LHGenericHeader';
import { appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';

import MapView, { Marker } from 'react-native-maps';




export default function NewAddressScreen({ navigation }: any) {

    const dispatch = useDispatch();
    const toast = useToast();

    // Toast Notifications
    const notifyWithToast = (description: any) => { toast.show({ description: description, }) }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <ImageBackground source={appImages.laundryBg} style={{ flex: 1, }}>
                    <View style={{ paddingVertical: parameters.headerHeightTinier }}>
                        <LHGenericHeader
                            title='Add New Address'
                            showLeftIcon={true}
                            leftIconPressed={() => { navigation.goBack(); }}
                        />
                    </View>


                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, backgroundColor: appColors.CardBackground }}>




                            <View style={{ flex: 1, padding: scale(16) }}>
                                <MapView
                                    style={{ flex: 1 }}
                                    initialRegion={{
                                        latitude: 37.7749,
                                        longitude: -122.4194,
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }}
                                >
                                    <Marker
                                        coordinate={{ latitude: 37.7749, longitude: -122.4194 }}
                                        title="Add Location"
                                    />
                                </MapView>

                            </View>

                            <View style={{ padding: scale(16), backgroundColor: appColors.CardBackground }}>

                                {/* add labels and the input fields in a wrapper view */}
                                <View style={{ padding: scale(5), }}>
                                    <Text style={{ color: appColors.AppBlue, fontSize: moderateScale(16), fontWeight: 'bold', fontFamily: appFonts.headerTextBold }}>
                                        Name of new address
                                    </Text>
                                    <TextInput
                                        style={{
                                            height: scale(48),
                                            borderWidth: 1,
                                            borderColor: appColors.grey4,
                                            borderRadius: scale(8),
                                            paddingHorizontal: scale(16),
                                            marginVertical: scale(16),
                                            backgroundColor: appColors.grey7,
                                            fontSize: moderateScale(14),
                                        }}
                                        placeholder="Name of new address"
                                        placeholderTextColor={appColors.grey4}
                                    />
                                </View>

                                {/* add labels and the input fields in a wrapper view */}
                                <View style={{ padding: scale(5), }}>
                                    <Text style={{ color: appColors.AppBlue, fontSize: moderateScale(16), fontWeight: 'bold', fontFamily: appFonts.headerTextBold }}>
                                        Type of address
                                    </Text>
                                    <TextInput
                                        style={{
                                            height: scale(48),
                                            borderWidth: 1,
                                            borderColor: appColors.grey4,
                                            borderRadius: scale(8),
                                            paddingHorizontal: scale(16),
                                            marginVertical: scale(16),
                                            fontSize: moderateScale(14),
                                        }}
                                        placeholder="Home, Office, Work...etc"
                                        placeholderTextColor={appColors.grey4}
                                    />
                                </View>

                                {/* add labels and the input fields in a wrapper view */}
                                <View style={{ padding: scale(5), }}>
                                    <Text style={{ color: appColors.AppBlue, fontSize: moderateScale(16), fontWeight: 'bold', fontFamily: appFonts.headerTextBold }}>
                                        Apartment Number, Physical landmark...
                                    </Text>
                                    <TextInput
                                        style={{
                                            height: scale(48),
                                            borderWidth: 1,
                                            borderColor: appColors.grey4,
                                            borderRadius: scale(8),
                                            paddingHorizontal: scale(16),
                                            marginVertical: scale(16),
                                            fontSize: moderateScale(14),

                                        }}
                                        placeholder="Apartment Number, Physical landmark..."
                                        placeholderTextColor={appColors.grey4}
                                    />
                                </View>

                            </View>



                        </View>


                        {/* Add Address Button section */}
                        <View style={{ paddingHorizontal: scale(20), paddingVertical: scale(10), marginBottom: scale(10), marginTop: scale(10) }}>
                            <Button
                                title="ADD ADDRESS"
                                buttonStyle={[parameters.appButtonXLBlue, { height: scale(55) }]}
                                titleStyle={[parameters.appButtonXLTitle, { fontSize: moderateScale(16) }]}
                                onPress={
                                    () => {
                                        // Proceed to the next step
                                        // go Review Booking Details Screen

                                    }
                                }
                            />
                        </View>

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
        backgroundColor: appColors.grey7,
    },





});
