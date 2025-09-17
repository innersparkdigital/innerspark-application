import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, StyleSheet, StatusBar, Image, Pressable, ImageBackground } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { updateIntroSlider } from '../../features/app/appStartSlice';
import { slides, appImages } from '../../global/Data';
import { storeItemLS } from '../../global/StorageActions';
import { Button, Icon } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';


export default function AppIntroSliderScreen(){

    const [showRealApp, setShowRealApp] = useState(false);
    const [isSlideBlack, setIsSlideBlack] = useState(false);
    const dispatch = useDispatch();

    const renderItem = ({ item }) => {
            return ( 
                <View style={styles.slide}>
                    {/* <View style={ styles.imageContainer }>
                        <Image source={item.image} style={styles.image} />
                    </View> */}

                    <ImageBackground 
                        source={item.image} 
                        resizeMode='contain' 
                        style={ styles.imageContainer }
                    ></ImageBackground>

                    <View style={ styles.titleContainer }>
                        <Text style={styles.title}>{item.title} 
                            <Text style={ styles.titleTag }> {item.titleTag}</Text>
                        </Text>
                    </View>

                    {/* <View style={ styles.titleContainer }>
                        <Text style={styles.title}>{item.title}</Text>
                    </View> */}
                    {/* <View style={ styles.textContainer }>
                        <Text style={styles.text}>{item.text}</Text>
                    </View> */}
                </View>
            )            
      }
    const onDone = () => {

        dispatch(updateIntroSlider(true)); // update slider status

        // store the appStart slider status on local storage - key = "introSlider"
        // use the same key as the redux store for consistency

        /** ACTIVATE THIS TO STOP REPEATING THE SLIDER ON EVERY APP START */
        // storeItemLS("introSlider", true);

    }

    // OnSkip Handler
    const onSkip = () => {
        console.log("You skip the slider. Login Now");
    }
    
    const keyExtractor = (item) => item.key;

    return (
        <View style={styles.container}>
            <StatusBar 
                translucent={false} 
                backgroundColor={appColors.CardBackground}
                barStyle="dark-content"
            />

            <View style={{ paddingVertical:15, paddingHorizontal:15, }}>
                <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
                    <Text style={{ fontSize:18, color: appColors.AppBlue, paddingRight:10, fontFamily: appFonts.bodyTextRegular }}>Hi there,</Text>
                    <Pressable onPress={onDone} style={{ paddingHorizontal:10 }}>
                        <Text style={{ fontSize:16, color: appColors.AppBlue, textDecorationLine:'underline', fontFamily: appFonts.bodyTextRegular }}>Skip</Text>
                    </Pressable>
                </View>
                <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'flex-start' }}>
                    <Text style={{ fontSize:22, color: appColors.AppBlue, fontWeight:'500', fontFamily: appFonts.bodyTextMedium }}>Welcome to</Text>
                    <Image style={{ width:220, height:45, resizeMode:'contain', marginBottom:-3 }} source={ appImages.logoRecBlue } />
                </View>
            </View>

            {/* App slider Start */}
            <AppIntroSlider 
                renderItem={renderItem} 
                keyExtractor={keyExtractor} 
                data={slides} 
                onDone={onDone}
                activeDotStyle={{ backgroundColor: appColors.AppBlue }}
                dotStyle={{ backgroundColor: appColors.grey3 }}
                showDoneButton={false}
                // doneLabel="Get Started"
                // renderDoneButton={ 
                //     () => <View style={{ paddingHorizontal:15, paddingVertical:15 }}>
                //              <Button 
                //                 title="Get Started" 
                //                 buttonStyle={ parameters.appButtonXLGreen }
                //                 titleStyle={ parameters.appButtonXLTitleGreen }  
                //                 onPress={onDone}
                //               />
                //            </View> 
                // }
                bottomButton={true}
                showNextButton={false}
                // renderNextButton={
                //     () => <View style={{ paddingHorizontal:15, paddingVertical:15 }}>
                //             <View style={parameters.appButtonXLGreen}>
                //                 <View style={{ justifyContent:'center', alignItems:'center' }}>
                //                     <Text style={parameters.appButtonXLTitleGreen}>Next</Text>
                //                 </View>
                //             </View> 
                //         </View>
                // }
                onSkip={onSkip}
                // showSkipButton = {true}
                // renderSkipButton = {
                //     () =>  <View style={{ backgroundColor:'yellow' }}>
                //                 <View style={{ paddingHorizontal:15, paddingVertical:15 }}>
                //                     <Button 
                //                         title="LET’S GET STARTED" 
                //                         buttonStyle={ parameters.appButtonXLGreen }
                //                         titleStyle={ parameters.appButtonXLTitleGreen }  
                //                         onPress={onSkip}
                //                     />
                //                 </View>
                //                 <View style={{ alignItems:'center' }}>
                //                     <Text style={{ fontSize:15, paddingBottom:20,color: appColors.AppBlue }}>Already have an account? 
                //                         <Text style={{ fontWeight:'900' }}> Sign In</Text>
                //                     </Text>
                //                 </View>
                //             </View>
                // }
            />
            {/* -- App slider end */}

            <View style={{ paddingTop:5, marginBottom:25, paddingHorizontal:15, }}>
                <View style={{  paddingVertical:15 }}>
                    <Button 
                        title="LET’S GET STARTED" 
                        buttonStyle={ parameters.appButtonXLBlue }
                        titleStyle={ parameters.appButtonXLTitleBlue }  
                        onPress={onDone}
                    />
                </View>
                <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'center' }}>
                    <Text style={{ fontSize:15,color: appColors.AppBlue, fontFamily: appFonts.bodyTextRegular }}>Already have an account?</Text>
                    <Pressable onPress={onDone}>
                        <Text style={{ fontSize:15,color: appColors.AppBlue, fontFamily: appFonts.bodyTextBold }}> Sign In</Text>
                    </Pressable>
                </View>
            </View>

        </View>
        
    );
    
}

// local stylesheet for the screen
const styles = StyleSheet.create({
    container : {
        flex: 1,
        paddingVertical:parameters.headerHeightTiny,
        backgroundColor: appColors.CardBackground,
    },

    slideBlack: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: appColors.YoGreen,
        backgroundColor:  appColors.black,
      },

    slide: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: appColors.CardBackground,
        // backgroundColor: appColors.grey4,
      },
      
    image: {
        width: 200,
        height: 200,
        //marginVertical: 32,
        resizeMode:'contain',
    },

    text: {
        //color: 'rgba(255, 255, 255, 0.8)',
        color: appColors.AppBlue,
        textAlign: 'center',
        fontSize: 15,
        fontFamily: appFonts.bodyTextRegular,
        //paddingVertical:10,
    },

    title: {
        fontSize: 22,
        color: appColors.AppBlue,
        //color: 'white',
        textAlign: 'center',
        fontWeight: '400',
        paddingVertical: 10,
        fontFamily: appFonts.bodyTextMedium,
    },

    titleTag: {
        // fontSize: 22,
        // color: appColors.AppBlue,
        // textAlign: 'center',
        fontWeight: '900',
        // paddingVertical: 10,
    },

    // title: {
    //     fontSize: 24,
    //     color: appColors.AppBlue,
    //     //color: 'white',
    //     textAlign: 'center',
    //     fontWeight: '700',
    //     paddingVertical: 10,
    // },

    imageContainer: {
        marginVertical: 10,
        flex:3,
        // backgroundColor:'pink',
        alignItems:'center',
    },

    textContainer: {
        paddingHorizontal: 30,
    },

    titleContainer: {
        paddingHorizontal:10,
        flex: 1,
    }

});