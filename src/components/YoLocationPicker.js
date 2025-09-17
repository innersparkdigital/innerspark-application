import React, { useState, useEffect, useRef }  from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import { colors, parameters } from '../global/styles';
import { Icon, Button, ListItem } from '@rneui/base';

/** A new library will be used for Location Services ##KNEXT */
// import RNGooglePlaces from 'react-native-google-places';


export const YoLocationPicker = ({ 
    onBackPress,
    handleUpdateLocation = (d) => console.log(d), 
    searchPlaceholder = "Search a place"
}) => {

  const [showInput, setShowInput] = useState(false);
  const [addressQuery, setAddressQuery] = useState(''); // initialize with the current location or anything close
  const [predictions, setPredictions] = useState([]);
  let placeSearchInput; // will be referenced to the place search InputElement


    /** A new library will be used for Location Services */
   /* 
   // on Query change
   const onQueryChange = (text) => {
        // set the addressQuery to input text
        setAddressQuery(text);

        // search the entered place text if the length is > 2
        if (addressQuery.length >= 2) {

            // should searches be limited to only one country -> 'UG' ?
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
      // console.log(placeID);
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

    */


  return (
        <View style={ styles.container }>
            <View style={{ 
                 // backgroundColor:colors.YoPink,
                 paddingBottom:10
             }}> 
                <View style={ styles.placeSearchBar }>
                    <View style={{ flex:1 }}>
                        <Pressable onPress={ onBackPress }>
                            <Icon type="material-community" name="arrow-left" size={25} />
                        </Pressable>
                    </View>
                    <TextInput 
                        ref={input => placeSearchInput = input}
                        placeholder={searchPlaceholder}
                        placeholderTextColor={colors.grey3}
                        style={{ flex:8, color:colors.grey2 }}
                        underlineColorAndroid={'transparent'}
                        value={addressQuery}
                        onChangeText={ (text) => onQueryChange(text)}
                        autoFocus={true}
                    />
                </View>
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
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  placeSearchBar: {
    backgroundColor:colors.CardBackground,
    borderRadius:20,
    flexDirection:"row",
    alignItems:"center",
    paddingHorizontal:5,
    // marginHorizontal:12,
    marginTop:10,
    height:45,
    borderWidth:1,
    borderColor: colors.grey4,

  },

  searchResultsContainer: {
      // backgroundColor: colors.grey7,
      flex:1,
  },

  listWrapper: {
      marginTop: 16,
  }

});

