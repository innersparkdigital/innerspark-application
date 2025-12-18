/**
 * LH Login Success Modal
 */
import React from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { Icon, BottomSheet, Button } from "@rneui/base";
import { appColors, parameters, appFonts } from '../../global/Styles';


export default function LHLoginSuccessModal(
  { 
    title="Success", 
    buttonTitle="Continue",
    description="Login Successful!", 
    loadingText="Please wait, getting ready...", 
    isModVisible=false,
    isLoading=false,
    onPressAction,  
  }
  ) {

  return (
    <View>
        <BottomSheet
            containerStyle={{ flex:1, justifyContent:'center', backgroundColor: appColors.CardBackground }}
            modalProps={{ presentationStyle:"overFullScreen", visible: isModVisible }}
        >
            <View style={{ ...parameters.doffeeModalContainer, paddingVertical:50, backgroundColor:appColors.CardBackground }}>
                <View style={{ paddingVertical:15, paddingHorizontal:20 }}>
                    
                    {/* Modal Content */}
                    <View style={{ justifyContent:"center", alignItems:"center", paddingVertical:20 }}>
                        
                        {/* Success Icon with Background Circle */}
                        <View style={{ 
                            justifyContent: "center", 
                            alignItems:"center",
                            backgroundColor: appColors.AppBlue + '15',
                            borderRadius: 80,
                            width: 140,
                            height: 140,
                            marginBottom: 20
                        }}>
                            <Icon 
                                type="material-community" 
                                name="check-circle" 
                                color={appColors.AppBlue} 
                                size={90} 
                            />
                        </View>

                        {/* Success Message */}
                        <View style={{ marginVertical:10, paddingHorizontal:15 }}>
                            <Text 
                                style={{ 
                                    fontSize: 24, 
                                    textAlign:'center', 
                                    fontWeight:"700", 
                                    paddingVertical:5, 
                                    color: appColors.black,
                                    letterSpacing: 0.3,
                                    fontFamily: appFonts.headerTextExtraBold
                                }}>
                                {title}
                            </Text>
                            <Text 
                                style={{ 
                                    fontSize: 15, 
                                    textAlign:'center', 
                                    paddingTop:8,
                                    color: appColors.grey2,
                                    lineHeight: 22
                                }}>
                                {description}
                            </Text>
                        </View>
                    </View>

                    {/* Action Button or Loading State */}
                    <View style={{ justifyContent:"center", marginTop:10, marginBottom:5, paddingHorizontal:10 }}>
                        { isLoading && 
                            <View style={{ flexDirection:'row', justifyContent:'center', alignItems:'center', paddingVertical:20, marginBottom:10 }}>
                                <ActivityIndicator size="small" style={{ marginHorizontal:5, }} color={appColors.AppBlue} /> 
                                <Text style={{ color:appColors.grey2, paddingHorizontal:5, fontSize:14 }}>{loadingText}</Text>
                            </View>
                        } 

                        { !isLoading && 
                            <Button 
                                title={buttonTitle} 
                                buttonStyle={{ 
                                    ...parameters.appButtonXLBlue,
                                    paddingVertical: 16,
                                    borderRadius: 12
                                }}
                                titleStyle={{ 
                                    ...parameters.appButtonXLTitle,
                                    fontSize: 16,
                                    fontWeight: '600',
                                    letterSpacing: 0.5
                                }}
                                disabled={isLoading}
                                onPress={ onPressAction }
                            />
                        }
                    </View>
                </View>
            </View>
        </BottomSheet>
    </View>
  );
}
