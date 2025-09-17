// LHLoaderModal.js
// Reusable Loader Modal Component
import React from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { BottomSheet } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { appImages } from '../../global/Data';

export default function LHLoaderModal({ visible, message = "Processing...", transparent = true }) {
    return (
        <BottomSheet
            containerStyle={{ 
                backgroundColor: transparent ? 'rgba(255, 255, 255, 0.9)' : appColors.CardBackground, 
                justifyContent:'center' 
            }}
            modalProps={{
                presentationStyle: "overFullScreen",
                visible: visible,
            }}
        >
            <View style={{
                ...parameters.doffeeModalContainer,
                backgroundColor: 'transparent',
                borderWidth: 0,
                paddingVertical: 100
            }}>
                <View style={{ paddingVertical: 15 }}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 30 }}>
                        <View style={{ justifyContent: "center", alignItems: "center", position: "relative" }}>
                            <Image source={appImages.logoRound} style={{ width: 60, height: 40, resizeMode: 'contain' }} />
                            <ActivityIndicator
                                style={{ position: "absolute", width: 80, height: 80 }}
                                color={appColors.AppBlue}
                                size={80}
                            />
                        </View>

                        <View style={{ marginVertical: 30, paddingHorizontal: 5, paddingVertical: 10 }}>
                            <Text style={{
                                textAlign: 'center',
                                fontSize: 18,
                                color: appColors.AppBlue,
                                fontFamily: appFonts.headerTextExtraBold
                            }}>
                                {message}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </BottomSheet>
    );
} 