/**
 * LH Generic Feature Modal Mod
 */
import React from "react";
import { StyleSheet, Text, View, Image, Dimensions, Pressable, } from "react-native";
import { Icon, BottomSheet, Button } from "@rneui/base";
import { appColors, parameters } from '../global/Styles';
import { appImages } from "../global/Data";

export default function LHGenericFeatureModal(
  { 
    title="Feature Title", 
    buttonTitle="OKAY",
    description="Feature Description", 
    visibilitySetter=null,
    image=appImages.logoRound,
    hasIcon=false,
    iconType="material-community",
    iconName="gift",
    isModVisible=false,
    isDismissable=false, 
    hasAction=false,
    onPressAction,  
  }
  ) {

  return (
    <View style={styles.container}>
        <BottomSheet
            containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.5)' }}
            modalProps = {{ presentationStyle:"overFullScreen", visible: isModVisible, }}
            onBackdropPress={ () => { if (isDismissable) { visibilitySetter(false); } } }
        >
            <View style={ parameters.doffeeModalContainer }>
                <View style={{ flex:1, justifyContent:"center", alignItems:"center", paddingVertical:15, paddingHorizontal:5 }}>
                    { hasIcon && <Icon type={iconType} name={iconName} color={appColors.AppBlue} size={50} /> 
                       ||
                      <Image source={image} style={{ width:80, height:50, resizeMode:"contain", marginBottom:5 }} />
                    }
                    <Text style={{ fontSize:25, fontWeight:"bold", paddingVertical:5, color:appColors.AppBlue}}>{title}</Text>
                    <Text style={{ fontSize:14, paddingVertical:5, color: appColors.grey2, textAlign:'center' }}>{description}</Text>
                </View>
                <View style={{ flex:1, justifyContent:"center", marginVertical:10, paddingHorizontal:5 }}>
                    <Button 
                        title={buttonTitle} 
                        buttonStyle={ parameters.appButtonXLBlue }
                        titleStyle={ parameters.appButtonXLTitleBlue }
                        onPress={ hasAction ? onPressAction : () => { visibilitySetter(false) } }
                    />
                </View>
            </View>
        </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: "center",
  },
  
});