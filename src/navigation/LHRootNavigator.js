//import 'react-native-gesture-handler'
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { restoreToken } from '../features/user/userSlice';
import { updateUserDetails, updateYoAppBio,} from '../features/user/userDataSlice';
import { updateAppNeedsUpdate } from '../features/appStart/appStartSlice';
import { updateIntroSlider } from '../features/appStart/appStartSlice';
import { NavigationContainer } from '@react-navigation/native';
import UpdateAppNavigator from './UpdateAppNavigator';
import EncryptedStorage from 'react-native-encrypted-storage';
import AppIntroSliderScreen from '../screens/sliderScreens/AppIntroSliderScreen';
import LHSplashScreen from '../components/LHSplashScreen';
import {  retrieveItemLS, storeItemLS } from '../global/StorageActions';
import { checkVersion } from 'react-native-check-version';
import LHAuthNavigator from './LHAuthNavigator';
import LHStackNavigator from './LHStackNavigator';
import LHTherapistNavigator from './LHTherapistNavigator';
import { loadCriticalDataToRedux } from '../api/shared';


export default function LHRootNavigator() {

    const user = useSelector(state => state.user); // user state from the store
    const userDetails = useSelector(state => state.userData.userDetails); // user details with role
    const introSliderStatus = useSelector(state => state.appStart.introSlider);
    const appNeedsUpdate = useSelector(state => state.appStart.appNeedsUpdate);
    const dispatch = useDispatch();

    useEffect(
        
        () => {
        // Fetch the token from the storage then navigate to our appropriate place
        const userStoredTokenAsync = async () => {
            let userToken; // user token on local storage
            let userDetailsLS; // User Local Details
            let userAvatarLS; // User avatar on local storage
            let yoAppBioLS; // User App Bio Data stored locally 
            try {
                 userToken = await EncryptedStorage.getItem("userToken");
                 userDetailsLS = await EncryptedStorage.getItem("userDetailsLS");
                 userAvatarLS = await EncryptedStorage.getItem("userAvatarLS");
                 yoAppBioLS = await EncryptedStorage.getItem("yoAppBioLS");
                 
                 // Local storage user token
                 if (userToken !== undefined ) {
                    // Token is defined
                    // console.log(userToken);
                }

                // User details local store data
                if (userDetailsLS !== undefined ) {
                    // Token is defined
                     console.log(userDetailsLS);
                     console.log('------------');
                     const parsedUserDetails = JSON.parse(userDetailsLS);
                     console.log(parsedUserDetails);
                     dispatch(updateUserDetails(parsedUserDetails));

                     // Load critical data into Redux in the background (non-blocking)
                     // Only if user token exists (user is logged in)
                     if (userToken && parsedUserDetails?.userId) {
                         loadCriticalDataToRedux(parsedUserDetails.userId, dispatch)
                             .then((results) => {
                                 console.log('✅ Background data load on app startup:', results);
                             })
                             .catch((error) => {
                                 console.error('❌ Background data load failed on startup:', error);
                             });
                     }
                }

            
                // AppBio local storage
                if ( yoAppBioLS !== undefined ) {
                     //console.log(yoAppBioLS);
                     //console.log('----Yo App Bio Data ----');
                     //console.log(JSON.parse(yoAppBioLS));
                     dispatch(updateYoAppBio(JSON.parse(yoAppBioLS)));
                }


            } catch (error) {
                // restoring token failed, what now?
                console.log(error.code);
            }

            // Let's just confirm the token is authentic anyway
            // After restoring token, we may need to validate it in production apps

            // This will switch to the App screen or Auth screen and this loading
            // screen will be unmounted and thrown away.
            dispatch(restoreToken(userToken));
            // storeItemLS("userDetailsLS", )
            //dispatch(updateUserAvatar(userAvatarLS));

        };

        userStoredTokenAsync(); // the cleanup function

    }, []);


    /*
    
    // Checking the App Intro Slider Status
    useEffect(
        
        () => {
        // Fetch the intro slider status from the storage then update the status accordingly
        const appSliderStatusAsync = async () => {

            let introSlider;

            try {
                introSlider = await EncryptedStorage.getItem("introSlider");
                 if (introSlider !== undefined ) {
                    //  console.log("Status is defined!");
                }
            } catch (error) {
                console.log(error.code);
            }
            // screen will be unmounted and thrown away.
            dispatch(updateIntroSlider(introSlider));
        };

        appSliderStatusAsync(); // the cleanup function

    }, []);

    */

    /*
        // Load splashscreen while fetching the token from local storage
        if (introSliderStatus.isLoading) {
            // We haven't finished checking for the token yet
            return <YoSplashScreen />;
        }
    */


        /*
        // checking if a new app version is available
        useEffect( 
            () => {

                let isUpdateAvailable = false; // default

                const checkAppUpdateAvailable = async () => {
                    const version = await checkVersion();
                    // console.log("Got version info: ", version);
                    // console.log(version);

                    if (version.needsUpdate) {
                        // console.log(`App has a ${version.updateType} update pending.`);
                        // dispatch(updateAppNeedsUpdate(version.needsUpdate));
                        isUpdateAvailable = version.needsUpdate;
                    }

                        dispatch(updateAppNeedsUpdate(isUpdateAvailable));

                };

                checkAppUpdateAvailable();

            }, []
        );

        */
       

        // Load splashscreen while fetching the token from local storage
        if (user.isLoading) {
            // We haven't finished checking for the token yet
            return <LHSplashScreen />;
        }

        // load the starter for the first time -- this is the welcome screen
        // the welcome screen is the first screen that the user sees when the app is launched
        // the welcome screen is the app intro slider screen
        // we disable the slider for now
        // we will use the slider to check if the user has completed the onboarding process
        /* if (!introSliderStatus) {
            // the app is running for the first time
            return <AppIntroSliderScreen />;
        } */


    
    // check user token
    return(
        <NavigationContainer>
            { 
                appNeedsUpdate && <UpdateAppNavigator /> 
                    || 
                user.userToken == null && <LHAuthNavigator /> 
                    ||
                user.userToken != null && userDetails?.role === 'therapist' && <LHTherapistNavigator /> 
                    ||
                <LHStackNavigator /> 
            }
        </NavigationContainer>
    )

}
