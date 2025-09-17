/**
 * Innerspark App
 * The Innerspark App is a mobile application built with React Native that provides fast, reliable internet access to users. 
 * It enables users to manage data usage, top-up accounts, purchase data bundles, track payments, and access VPN for secure browsing.
 * 
 * https://github.com/innerspark
 * @author Innerspark Team
 * @format
 */

// Import BackHandler patch first to fix deprecated removeEventListener issue
import './src/utils/BackHandlerPatch';

import React, { useState, useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import { NativeBaseProvider, KeyboardAvoidingView } from 'native-base';
import LHRootNavigator from './src/navigation/LHRootNavigator';
import { Provider } from 'react-redux';
import store from './src/app/store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import SplashScreen from 'react-native-splash-screen';


const App = () => {

  const [hideSplash, setHideSplash] = useState(false);

  // Setting the timeout : 5s -- 2000
  useEffect( () => {
    setTimeout( () => {
      setHideSplash(true);
    }, 3000 ); // amount of time the splash is shown from the time the component is rendered
  }, [] );

  useEffect( () => {

     hideSplash && SplashScreen.hide();

  }, [hideSplash] );


  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView style={{ flex: 1 }}>
        <Provider store={store}>
            <NativeBaseProvider> 
              <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  style={{flex: 1}}>
                <LHRootNavigator />
              </KeyboardAvoidingView>
            </NativeBaseProvider>
        </Provider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};


export default App;
