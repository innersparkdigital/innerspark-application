/**
 * App - Privacy Policy Screen
 */
import React, { useState } from 'react';
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
  ActivityIndicator,
  Dimensions,

} from 'react-native';
import { Icon, Button, Avatar, BottomSheet } from '@rneui/base';
import { appImages, appLinks } from '../../global/Data';
import { appColors, parameters, appFonts } from '../../global/Styles';
import LHGenericHeader from '../../components/LHGenericHeader';
import WebView from 'react-native-webview';


export default function PrivacyPolicyScreen({ navigation }){
    
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Toast Notifications
    const notifyWithToast = (description) => { toast.show({ description: description, }) }

    // Add loading component
    const LoadingSpinner = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size={80} color={appColors.AppBlue} />
            <Text style={styles.loadingText}>Loading Privacy Policy...</Text>
        </View>
    );

    // Add error component
    const ErrorDisplay = () => (
        <View style={styles.errorContainer}>
            <View style={{ paddingHorizontal: 10, paddingVertical: 20, alignItems: 'center' }}>
                <Icon name="error-outline" type="material" size={60} color={appColors.AppBlue} />
                <Text style={styles.errorText}>
                    {/* {errorMessage || "Unable to load Privacy Policy. Please check your internet connection and try again."} */}
                    {"Unable to load Privacy Policy. Please check your internet connection and try again."}
                </Text>
            </View>
            <Button
                title="Retry"
                onPress={() => {
                    setHasError(false);
                    setIsLoading(true);
                }}
                buttonStyle={parameters.appButtonXLBlue}
                titleStyle={parameters.appButtonXLTitleBlue}
            />
        </View>
    );

    return(
      <SafeAreaView style={{ flex:1}}>
        <View style={ styles.container }>
            <ImageBackground source={appImages.laundryBg} style={{ flex: 1, }}>
                <View style={{ paddingVertical:parameters.headerHeightTinier }}>
                    <LHGenericHeader
                        title='Privacy Policy' 
                        showLeftIcon={true}
                        leftIconPressed={ () => { navigation.goBack(); } } 
                    />
                </View>
              
                <View style={styles.contentContainer}>
                    {isLoading && <LoadingSpinner />}
                    
                    {hasError ? (
                        <ErrorDisplay />
                    ) : (
                        <WebView 
                            source={{ uri: appLinks.appPrivacy }} 
                            style={{ flex: 1, opacity: isLoading ? 0 : 1 }}
                            onLoadStart={() => setIsLoading(true)}
                            onLoadEnd={() => setIsLoading(false)}
                            onError={(syntheticEvent) => {
                                const { nativeEvent } = syntheticEvent;
                                setErrorMessage(nativeEvent.description);
                                setHasError(true);
                                setIsLoading(false);
                            }}
                            renderError={(errorDomain, errorCode, errorDesc) => {
                                setErrorMessage(errorDesc);
                                setHasError(true);
                                setIsLoading(false);
                                return <ErrorDisplay />;
                            }}
                            startInLoadingState={true}
                            cacheEnabled={true}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            androidLayerType="hardware"
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </View>
               
            </ImageBackground>
        </View>
      </SafeAreaView>
    )
}

// local stylesheet
const styles = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor: appColors.grey7,
    },

    contentContainer: {
        flex: 1,
        padding:10,
        backgroundColor: appColors.CardBackground,
    },

    loadingContainer: {
        position: 'absolute',
        top: 10,
        left: 0,
        right: 0,
    },

    loadingText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'center',
        color: appColors.AppBlue,
    },

    errorContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        padding: 20,    
    },

    errorCodeText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'center',
        color: appColors.AppBlue,
    },

    errorText: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 20,
        textAlign: 'center',
        color: appColors.AppBlue,
    },
});