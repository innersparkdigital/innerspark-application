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
                <View style={{ paddingVertical:15, }}>
                    {/* Modal Content */}
                    <View style={{ flex:1, justifyContent:"center", alignItems:"center", paddingVertical:20 }}>
                        <View style={{ justifyContent: "center", alignItems:"center", paddingVertical:15 }}>
                            <Icon type="material-community" name="check-circle" color={appColors.AppBlue} size={60} />
                        </View>
                        <View style={{ marginVertical:10, paddingHorizontal:5 }}>
                            <Text 
                                style={{ 
                                    fontSize:18, textAlign:'center', 
                                    paddingVertical:5, 
                                    color:appColors.AppBlue, 
                                    fontFamily:appFonts.headerTextBold 
                                }}>
                                {description}
                            </Text>
                            <Text 
                                style={{ 
                                    fontSize:22, textAlign:'center', 
                                    paddingVertical:5, 
                                    color:appColors.AppBlue, 
                                    fontFamily:appFonts.headerTextExtraBold 
                                }}>
                                {title}
                            </Text>
                        </View>
                    </View>

                    {/* The following options  */}
                    <View style={{ flex:1, justifyContent:"center", marginVertical:10, paddingHorizontal:10, }}>
                        { isLoading && 
                            <View style={{ flexDirection:'row', justifyContent:'center', alignItems:'center', paddingVertical:20, marginBottom:10 }}>
                                <ActivityIndicator size="small" style={{ marginHorizontal:5, }} color={appColors.AppBlue} /> 
                                <Text style={{ color:appColors.AppBlue, paddingHorizontal:5, fontSize:14 }}>{loadingText}</Text>
                            </View>
                        } 

                        { !isLoading && 
                            <Button 
                                title={buttonTitle} 
                                buttonStyle={ parameters.appButtonXLBlue }
                                titleStyle={ parameters.appButtonXLTitle }
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
