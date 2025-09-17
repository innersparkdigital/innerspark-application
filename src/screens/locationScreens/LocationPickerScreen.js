import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateLocation } from '../../features/signupFlow/signupFlowSlice';
import { updateUserMood, updateYoAppBio } from '../../features/user/userDataSlice';
import { 
    View, 
    Text, 
    StyleSheet, 
    Image,
    ImageBackground,
    TextInput,
    ScrollView,
    StatusBar,
    ActivityIndicator,
    Pressable,
    TouchableHighlight,

} from 'react-native';
import { colors, parameters } from '../../global/styles';
import { Button, Icon, ListItem} from '@rneui/base';
import { YodateImages } from '../../global/Data';
import { useToast } from 'native-base';
import YoGenericHeader from '../../components/YoGenericHeader';
import { baseUrlRoot, baseUrlV1, yoUpdateAppBioData } from '../../api/LHAPI';
import { storeItemLS } from '../../global/StorageActions';
import { notifyWithToast } from '../../global/LHShortcuts';
import RNGooglePlaces from 'react-native-google-places';

const baseUrl = baseUrlRoot + baseUrlV1;

export default function LocationPickerScreen({navigation}){

    const dispatch = useDispatch(); // dispatch actions
    const toast = useToast(); 
    const sessionLocation = useSelector( state => state.appSession.location ); // Session location [default:null]

    const userDetails = useSelector(state => state.userData.userDetails); // User details from redux store
    const yoAppBio = useSelector(state => state.userData.yoAppBio); // App Bio Data

    // const [location, setLocation] = useState(yoAppBio.location); // default is current location stored in the database
   //  const [isLoading, setIsLoading] = useState(false); // loading state
    const [isUpdating, setIsUpdating] = useState(); // updating state

    const [showInput, setShowInput] = useState(false);
    // const [addressQuery, setAddressQuery] = useState(''); // initialize with the current location or anything close
    const [addressQuery, setAddressQuery] = useState(yoAppBio.location); // initialize with the current location or anything close
    const [predictions, setPredictions] = useState([]);
    let placeSearchInput; // will be referenced to the place search InputElement


    // on Query change
   const onQueryChange = (text) => {
        // set the addressQuery to input text
        setAddressQuery(text);

        // search the entered place text if the length is > 2
        if (addressQuery.length >= 2) {

            // Should searches be limited to just one country -> 'UG' ?
            RNGooglePlaces.getAutocompletePredictions( addressQuery, { type: 'cities' }, ['placeID', 'location', 'name', 'address'] )
            .then((places) => {
                //console.log(places);
                setPredictions(places);
            })
            .catch(error => console.log(error.message));

        }

    }


    // onSelection Suggestion
    const onSelectionSuggestion = (placeID) => {
        //console.log(placeID);
        // getPlaceByID call 
        RNGooglePlaces.lookUpPlaceByID(placeID, ['placeID', 'location', 'name', 'address'])
        .then((results) => {
            console.log(results);
            setAddressQuery(results.address); // Set the address query value [place address]
            handleUpdateLocation(results.address); // Update user new location

        })
        .catch((error) => console.log(error.message));
        
        // reset the search settings state
        setShowInput(false);
        setPredictions([]);
        
        // update the search location from Redux store
        // here
  
        // the take the user back to the previous screen
       // navigation.goBack(); // take the user back programmatically, does it work?
    } 
  

     // Location Handler
    //  const onChangeLocationHandler = (location) => {
    //     setLocation(location);
    // }

    // Update Stored Location
    const onUpdateLocationHandler = (location) => {
        // some basic validation ?
        dispatch(updateLocation(location)); // updates stored location
    }


    /** Handle Update Location
     * args loc [location is a string] - default: user stored location
     */
    const handleUpdateLocation = async (loc=yoAppBio.location) => {

        // Update only when necessary
        // check if the location has changed
        if (loc.trim() == yoAppBio.location) {
            // notifyWithToast(toast, "Nothing to update", "top"); // Notify with Toast
            console.log("Nothing to update");
            navigation.goBack(); // go back to the previous screen
            return;
        }

        setIsUpdating(true); // updating state

        // making a request to the API to update the location
        try {
            const response = await axios.post(`${baseUrl}/set-location`, { 
                user: userDetails.userId, 
                location: loc.trim()
            
            });

            // checking the status
            if (response.status === 200) {
                // If status is successful
                if (response.data.status === "success"){ 
                    console.log(response.data);

                    // Update or refresh the App State
                    yoUpdateAppBioData({
                        userId: userDetails.userId,
                        dispatch: dispatch,
                        yoAppBioUpdater: updateYoAppBio,
                        userMoodUpdater: updateUserMood,
                        storageHandler: storeItemLS
                    });

                    //notifyWithToast(toast, "location updated!", "top"); // Notify with Toast
                    setIsUpdating(false); // reset updating state
                    navigation.goBack(); // go back to the previous screen

                } else {
                    console.log(response.data);
                    console.log("Location update failed."); // what exactly went wrong?
                   // notifyWithToast(toast, "location updated failed!", "top"); // Notify with Toast
                    setIsUpdating(false); // reset updating state
                }

            } else {

                throw new Error("location update failed.");

            }

        } catch (error) {
            console.log(error.message);
            notifyWithToast(toast, "Oops? Something went wrong!", "top");
            setIsUpdating(false); // reset updating state
        }

    }
    

    return(
       <View style = { styles.container }>
            <StatusBar barStyle='light-content' backgroundColor={colors.YoPink} />
            <YoGenericHeader leftIconPressed={ () => { navigation.goBack() } } />
            <ImageBackground source={YodateImages.worldmapBg} style={{ flex: 1, }}>
                <View style={{ flex:1, paddingHorizontal:25, paddingVertical:15 }}>

                    <View style={{ justifyContent:'center', alignItems:'center', paddingVertical:10 }}>
                        <Text style={{ fontSize:25, color:colors.YoPink, fontWeight:'bold'}}>What's your location?</Text>
                        <Text style={{ paddingVertical:8, color:colors.grey3 }}>Update your location to see people in your area.</Text>
                    </View>

                    {/* Location Input Block */}
                    <View style={ styles.inputBlockRow }>
                        <View style={{ justifyContent: "center", alignItems:"center", paddingRight:5 }}>
                            <Icon type= "font-awesome" name= "search"  color= {colors.grey4} size= {25} />
                        </View>
                        <TextInput 
                            placeholderTextColor={ colors.grey3 } 
                            ref={input => placeSearchInput = input}
                            style={{ flex:3, fontSize:16, color:colors.black, paddingVertical:0, paddingHorizontal:10 }}
                            placeholder='Search a city' 
                            underlineColorAndroid={'transparent'}
                            value={addressQuery}
                            maxLength={60}
                            onChangeText={ (text) => onQueryChange(text) } 
                            autoFocus={true}
                        />  

                        { isUpdating && 
                            <View style={{ justifyContent:'center', alignItems:"center", paddingVertical:3 }}>
                                <ActivityIndicator style={{ marginHorizontal:5 }} color={colors.YoPink} />
                            </View>
                        }
                    </View>

                    <View style={ styles.searchResultsContainer }>
                        <ScrollView>
                            { 
                                (predictions.length >= 1) && <View>
                                    {
                                        predictions.map((l, i) => (
                                        <ListItem 
                                            key={i} 
                                            bottomDivider 
                                            onPress={() => onSelectionSuggestion(l.placeID) }
                                        >
                                            <Icon type ="material-community" name ="map-marker" color={colors.YoPink} />
                                            <ListItem.Content>
                                                <ListItem.Title style={{ fontWeight:'bold' }}>{l.primaryText}</ListItem.Title>
                                                <ListItem.Subtitle>{l.secondaryText}</ListItem.Subtitle>
                                            </ListItem.Content>
                                            <ListItem.Chevron />
                                        </ListItem>
                                        ))
                                    }
                                </View>
                            }
                        </ScrollView>
                    </View>

                </View>
            </ImageBackground>
        </View>
    )
}


// Local Styles
const styles = StyleSheet.create({

    container: {
        flex:1,
        backgroundColor:colors.CardBackground,
    },

    inputBlockRow: {
        flexDirection:'row', 
        alignItems:'center', 
        paddingHorizontal:12, 
        paddingVertical:8, 
        borderWidth:1,
        borderColor: colors.grey4,
        borderRadius:25, 
        marginVertical:8
    },

    genericInput: {
        paddingHorizontal:8, 
        borderRadius:10, 
        backgroundColor:colors.grey7, 
        marginVertical:8,
        color: colors.grey1,
    },

    placeSearchBar: {
        backgroundColor:colors.grey6,
        borderRadius:20,
        flexDirection:"row",
        alignItems:"center",
        paddingHorizontal:15,
        marginHorizontal:15,
        marginTop:10,
        height:40,
    },
    
    searchResultsContainer: {
        //backgroundColor: colors.grey7,
        flex:1,
    },
    
    listWrapper: {
        // using height and width of the device to style stuffs? huh?
        marginTop: 16,
        //height: Dimensions.get('window').height - 70,
    }


})