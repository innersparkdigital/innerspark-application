import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    View, 
    Text, 
    StyleSheet, 
    StatusBar, 
    Image, 
    Pressable, 
    ImageBackground 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppIntroSlider from 'react-native-app-intro-slider';
import { updateIntroSlider } from '../../features/app/appStartSlice';
import { slides, appImages } from '../../global/Data';
import { storeItemLS } from '../../global/StorageActions';
import { Button, Icon } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';


export default function WelcomeStarterScreen({ navigation }){

    const [showRealApp, setShowRealApp] = useState(false);
    const dispatch = useDispatch();

    const renderItem = ({ item }) => {
            return ( 
                <View style={styles.slide}>
                    <View style={ styles.slideContent }>
                        <View style={ styles.imageContainer }>
                            
                            { 
                                item.hasImage && <Image source={item.image} style={styles.image} /> 
                                ||
                                <Icon 
                                    name={item.iconName || "marker"} 
                                    type={item.iconName || "material-community"} 
                                    color={appColors.AppBlue} 
                                    size={100} 
                                />
                            }
                        </View>
                        <View style={ styles.titleContainer }>
                            <Text style={styles.title}>{item.title}</Text>
                            <View style={ styles.textContainer }>
                                <Text style={styles.text}>{item.text}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            )            
      }
    const onDone = () => {

        // dispatch(updateIntroSlider(true)); // update slider status
        // go to the signin screen
        navigation.navigate('SignupScreen');

    }

    // OnSkip Handler
    const onSkip = () => {
        // go to the signin screen
        navigation.navigate('SignupScreen');
    }

    // On signin handler
    const onSignin = () => {
        // go to the signin screen
        navigation.navigate('SigninScreen');
    }
    
    const keyExtractor = (item) => item.key;

    return (
        <SafeAreaView style={{ flex:1 }}>
            <StatusBar translucent={false} backgroundColor={appColors.CardBackground} barStyle="dark-content" />
            <View style={styles.container}>
                <ImageBackground source={appImages.bgPatterns} style={{ flex: 1, }}>

                    {/* App slider Start */}
                    <AppIntroSlider 
                        renderItem={renderItem} 
                        keyExtractor={keyExtractor} 
                        data={slides} 
                        onDone={onDone}
                        activeDotStyle={{ backgroundColor: appColors.AppGreen }}
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

                    {/* Action buttons start */}
                    <View 
                        style={{ 
                            paddingTop:8, 
                            marginBottom:20, 
                            paddingHorizontal:15,
                            borderTopWidth:1,
                            borderTopColor: appColors.grey5,
                        }}
                    >
                        <View style={{ 
                            flexDirection:'row', 
                            alignItems:'center', 
                            // backgroundColor: appColors.grey3,
                            paddingVertical:10,
                            }}
                        >
                            <View style={{ flex:1, paddingHorizontal:5 }}>
                                <Button 
                                    title="Sign In" 
                                    buttonStyle={ parameters.appButtonXLBlue }
                                    titleStyle={ parameters.appButtonXLTitleBlue }  
                                    onPress={onSignin}
                                />
                            </View>

                            <View style={{ flex:1, paddingHorizontal:5 }}>
                                <Button 
                                    title="Sign Up" 
                                    buttonStyle={ parameters.appButtonXLBlue }
                                    titleStyle={ parameters.appButtonXLTitleBlue }  
                                    onPress={onDone}
                                />
                            </View>

                        </View>
                        
                    </View>
                    {/* -- Action buttons end */}

                </ImageBackground>
            </View>
        </SafeAreaView>
    );
    
}

// local stylesheet for the screen
const styles = StyleSheet.create({
    container : {
        flex: 1,
        paddingVertical:parameters.headerHeightTiny,
        backgroundColor: appColors.CardBackground,
    },

    slide: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        // backgroundColor: appColors.CardBackground,
        backgroundColor: "rgba(255,255,255,0.5)",
    },

    slideContent: {
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor:'teal',
    },
      
    image: {
        width: 120,
        height: 120,
        //marginVertical: 32,
        resizeMode:'contain',
    },

    text: {
        color: appColors.AppBlue,
        textAlign: 'center',
        fontSize: 16,
        fontFamily: appFonts.bodyTextRegular,
        // paddingVertical:10,
    },

    title: {
        fontSize: 28,
        color: appColors.AppBlue,
        textAlign: 'center',
        fontWeight: '900',
        paddingVertical: 15,
        fontFamily: appFonts.bodyTextMedium,
    },

    imageContainer: {
        marginVertical: 10,
        paddingVertical:10,
        // backgroundColor:'pink',
        alignItems:'center',
    },

    textContainer: {
        paddingHorizontal: 30,
        // backgroundColor:'orange',
    },

    titleContainer: {
        paddingHorizontal:10,
        paddingVertical:10,
        // flex: 1,
        // backgroundColor:'yellow',
    }

});