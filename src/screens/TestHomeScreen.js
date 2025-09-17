import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable, FlatList, Image, Dimensions } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { appColors, parameters } from '../global/Styles';
import { filterData, restaurantsData } from '../global/Data';
import FoodCard from '../components/FoodCard';

// get the screen Width
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function TestHomeScreen({navigation}){
    const [delivery, setDelivery] = useState(true)
    const [indexCheck, setIndexCheck] = useState("0")

    return(
        <View style={styles.container}>


            <ScrollView  stickyHeaderIndices = {[0]} showsVerticalScrollIndicator = {true}>

                {/* Delivery - Pickup Buttons Flip */}
                <View style ={{backgroundColor:appColors.CardBackground,paddingBottom:5}}> 
                        <View style ={{marginTop:10, flexDirection:'row',justifyContent:"space-evenly"}}>
                                <TouchableOpacity
                                        onPress ={()=>{
                                            setDelivery(true)
                                        }}
                                    >
                                    <View style ={{...styles.deliveryButton,backgroundColor:delivery?appColors.buttons :appColors.grey5}}>
                                        <Text style ={styles.deliveryText}>Delivery</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                        onPress ={()=>{
                                        setDelivery(false)
                                        navigation.navigate("RestaurantsMapScreen")
                                    }}
                                    >
                                    <View style ={{...styles.deliveryButton,backgroundColor:delivery?appColors.grey5 :appColors.buttons}}>
                                        <Text style ={styles.deliveryText}>Pick Up</Text>
                                    </View>
                                </TouchableOpacity> 
                    
                        </View>
                </View> 

            {/* Filter View */}
            <View style ={styles.filterView}>
                <View style={styles.addressView}>
                    <View style ={{flexDirection:"row",alignItems:"center",paddingLeft:10}}>
                        <Icon 
                            type = "material-community"
                            name ="map-marker"
                            color = {appColors.grey1}
                            size = {26}
                        />

                        <Text style ={{marginLeft:5}}>22 Beessie Street</Text>
                    </View>

                    <View style ={styles.clockView}>
                        <Icon 
                            type = "material-community"
                            name ="clock-time-four"
                            color = {appColors.grey1}
                            size = {26}
                        />

                        <Text style ={{marginLeft:5}}>Now</Text>
                    </View>
                </View>

                <View>
                    <Icon 
                            type = "material-community"
                            name ="tune"
                            color = {appColors.grey1}
                            size = {26}
                        />
                </View>
            </View> 

            <View style ={styles.headerTextView}>
                <Text style ={styles.headerText}>Categories</Text>
            </View>

            {/* FoodCard Flatlist Section */}
            <View>
                <FlatList 
                    horizontal= {true}
                    showsHorizontalScrollIndicator = {false}
                    data = {filterData}
                    keyExtractor = {(item) => item.id}
                    extraData = {indexCheck}
                    renderItem = { ({item, index}) => (
                        <Pressable onPress={() => { setIndexCheck(item.id) }}>
                            <View style={ indexCheck === item.id ? {...styles.smallCardSelected} : {...styles.smallCard} }>
                                <Image 
                                    style={{ height:60, width: 60, borderRadius:30 }}
                                    source = {item.image}
                                />
                                <View>
                                    <Text style={indexCheck === item.id ? {...styles.smallCardTextSected} : {...styles.smallCardText}}>{item.name}</Text>
                                </View>
                            </View>
                        </Pressable>
                    ) }
                />
            </View>

            <View style ={styles.headerTextView}>
                <Text style ={styles.headerText}>Free Delivery Now</Text>
            </View>

            {/* FoodCard View  - Free Delivery Now */}
            <View>
                <FlatList
                    style = {{ marginTop:10, marginBottom:10 }}
                    horizontal = {true}
                    showsHorizontalScrollIndicator = {false}
                    data = {restaurantsData}
                    keyExtractor = {(item,index) => index.toString()}
                    renderItem = {({item}) => (
                        <View style={{marginRight:5}}>
                            <FoodCard
                                screenWidth = {SCREEN_WIDTH*0.8}
                                restaurantName = {item.restaurantName}
                                farAway = {item.farAway}
                                businessAddress = {item.businessAddress}
                                averageReview = {item.averageReview}
                                numberOfReview = {item.numberOfReview}
                                images = {item.images}
                                imagesLocal = {item.imagesLocal}
                            
                            />
                        </View>
                    )}
                />
            </View>

            <View style ={styles.headerTextView}>
                <Text style ={styles.headerText}>Promotions Available</Text>
            </View>

             {/* Promotions Available */}
             <View>
                <FlatList
                    style = {{ marginTop:10, marginBottom:10 }}
                    horizontal = {true}
                    showsHorizontalScrollIndicator = {false}
                    data = {restaurantsData}
                    keyExtractor = {(item,index) => index.toString()}
                    renderItem = {({item}) => (
                        <View style={{marginRight:5}}>
                            <FoodCard
                                screenWidth = {SCREEN_WIDTH*0.8}
                                restaurantName = {item.restaurantName}
                                farAway = {item.farAway}
                                businessAddress = {item.businessAddress}
                                averageReview = {item.averageReview}
                                numberOfReview = {item.numberOfReview}
                                images = {item.images}
                                imagesLocal = {item.imagesLocal}
                            
                            />
                        </View>
                    )}
                />
            </View>

            <View style ={styles.headerTextView}>
                <Text style ={styles.headerText}>Restaurants in Your Area</Text>
            </View>

             {/* Restaurants in Your Area */}
             <View style={{ width:SCREEN_WIDTH, paddingTop:10 }}>

                 {
                     restaurantsData.map(item => (
                         <View key={item.id} style={{ paddingBottom:20 }}>
                            <FoodCard
                                screenWidth = {SCREEN_WIDTH*0.95}
                                restaurantName = {item.restaurantName}
                                farAway = {item.farAway}
                                businessAddress = {item.businessAddress}
                                averageReview = {item.averageReview}
                                numberOfReview = {item.numberOfReview}
                                images = {item.images}
                                imagesLocal = {item.imagesLocal}
                            
                            />
                         </View>
                     ))
                 }

                {/* <FlatList
                    style = {{ marginTop:10, marginBottom:10 }}
                    
                    showsHorizontalScrollIndicator = {false}
                    data = {restaurantsData}
                    keyExtractor = {(item,index) => index.toString()}
                    renderItem = {({item}) => (
                        <View style={{ marginBottom:10}}>
                            <FoodCard
                                screenWidth = {SCREEN_WIDTH*0.95}
                                restaurantName = {item.restaurantName}
                                farAway = {item.farAway}
                                businessAddress = {item.businessAddress}
                                averageReview = {item.averageReview}
                                numberOfReview = {item.numberOfReview}
                                images = {item.images}
                                imagesLocal = {item.imagesLocal}
                            
                            />
                        </View>
                    )}
                /> */}


            </View>

        </ScrollView>

        {/* Float Button */}
        { delivery &&
            <View style={styles.floatButton}>
                <TouchableOpacity 
                    onPress={()=>navigation.navigate("RestaurantsMapScreen")}
                >
                    <Icon 
                        name = "place"
                        type = "material"
                        size = {28}
                        color = {appColors.DoffeeButtons}
                    
                    />
                    <Text style={{ color:appColors.grey2 }}>Map</Text>
                </TouchableOpacity>
            </View>
        }

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    
    deliveryButton:{
        paddingHorizontal:20,
         borderRadius:15,
         paddingVertical:5
    },

    deliveryText:{
        marginLeft:5,
        fontSize:16
    },

    filterView:{
        flexDirection:"row" ,
        alignItems:"center", 
        justifyContent:"space-evenly",
        marginHorizontal:10,
        marginVertical:10
    },

    clockView:{
        flexDirection:"row",
        alignItems:'center',
        marginLeft:20,
        backgroundColor:appColors.CardBackground,
        borderRadius:15,
        paddingHorizontal:5,
        marginRight:20
        },
    addressView:{
        flexDirection:"row",
        backgroundColor:appColors.grey5,
        borderRadius:15,
        paddingVertical:3,
        justifyContent:"space-between",
        paddingHorizontal:20
    },

    headerText:{
        color:appColors.grey2,
        fontSize:24,
        fontWeight:"bold",
        paddingLeft:10,
        
    },
    headerTextView:{
        backgroundColor:appColors.grey5,
        paddingVertical:3,
        marginVertical:5
    },

    smallCard :{
        borderRadius:30,
        backgroundColor:appColors.grey5,
        justifyContent:"center",
        alignItems:'center',
        padding:5,
        width:80,
        margin:10,
        height:100
    },

    smallCardSelected:{
        borderRadius:30,
        backgroundColor:appColors.DoffeeGreen,
        justifyContent:"center",
        alignItems:'center',
        padding:5,
        width:80,
        margin:10,
        height:100
    },

    smallCardTextSected :{
        fontWeight:"bold",
        color:appColors.CardBackground
    },

    smallCardText :{
        fontWeight:"bold",
        color:appColors.grey2
    },

    floatButton:{
        position:'absolute',
        bottom:10,
        right:15,
        backgroundColor:'white',
        elevation:10,
        width:60,height:60,
        borderRadius:30,
        alignItems:'center',
        padding:5
    }

})