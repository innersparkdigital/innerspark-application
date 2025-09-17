import React from 'react';
import { useSelector } from "react-redux";
import { View, Text, StyleSheet, Image, Pressable, Dimensions } from 'react-native';
import { Icon } from '@rneui/base';
import { appColors } from '../global/Styles';
import { appImages } from '../global/Data';

// get the screen Width
const SCREEN_WIDTH = Dimensions.get('window').width; // Device screen width

export default function HomeFooter({  
    activeTab,
    onPressExplore,
    onPressBookings,
    onPressProfile,
    onPressMore,
    onPressHome,

}){

    // User Avatar from store
    const userAvatarURI = useSelector(state => state.userData.userAvatar); // avatar object { image: uri}

    // create boolean for active states
    const isActive = (tabName) => { return activeTab == tabName;  }

    return(
        <View style={ styles.footerContainer }>
           

            {/* <View style={ styles.footerBgContainer }>
                <Image source={images.footerBg} style={styles.footerBgImage} />
            </View> */}

            <View style={ styles.footerTabsContainer }>
                <Pressable style={ [styles.footerTab, isActive("home") ? styles.footerTabActive : styles.footerTabInactive] } onPress={onPressHome}>
                    <View style={styles.footerTabContent}>
                        <View>
                            {
                                isActive("home") && (<Image source={appImages.homeFooterIcon1} style={styles.footerTabIcon}/>)
                                ||
                                (<Image source={appImages.homeFooterIcon1Inactive} style={styles.footerTabIcon}/>)
                            } 
                        </View>
                        <View>
                            <Text style={ isActive("home") ? styles.footerTabTextActive : styles.footerTabText }>Home</Text>
                        </View>
                    </View>
                </Pressable>
                <Pressable style={ [styles.footerTab, isActive("explore") ? styles.footerTabActive : styles.footerTabInactive] } onPress={onPressExplore}>
                    <View style={styles.footerTabContent}>
                        <View>
                            {
                                isActive("explore") && (<Image source={appImages.homeFooterIcon2} style={styles.footerTabIcon}/>)
                                ||
                                (<Image source={appImages.homeFooterIcon2Inactive} style={styles.footerTabIcon}/>)
                            } 
                        </View>
                        <View>
                            <Text style={ isActive("explore") ? styles.footerTabTextActive : styles.footerTabText }>Explore</Text>
                        </View>
                    </View>
                </Pressable>
               
                <Pressable style={ [styles.footerTab, isActive("bookings") ? styles.footerTabActive : styles.footerTabInactive] } onPress={onPressBookings}>
                    <View style={styles.footerTabContent}>
                        <View>
                            {
                                isActive("bookings") && (<Image source={appImages.homeFooterIcon3} style={styles.footerTabIcon}/>)
                                ||
                                (<Image source={appImages.homeFooterIcon3Inactive} style={styles.footerTabIcon}/>)
                            } 
                        </View>
                        <View>
                            <Text style={ isActive("bookings") ? styles.footerTabTextActive : styles.footerTabText }>Bookings</Text>
                        </View>
                    </View>
                </Pressable>
                <Pressable style={ [styles.footerTab, isActive("profile") ? styles.footerTabActive : styles.footerTabInactive] } onPress={onPressProfile}>
                    <View style={styles.footerTabContent}>
                        <View>
                            {
                                isActive("profile") && (<Image source={appImages.homeFooterIcon4} style={styles.footerTabIcon}/>)
                                ||
                                (<Image source={appImages.homeFooterIcon4Inactive} style={styles.footerTabIcon}/>)
                            } 
                        </View>
                        <View>
                            <Text style={ isActive("profile") ? styles.footerTabTextActive : styles.footerTabText }>Profile</Text>
                        </View>
                    </View>
                </Pressable>
                <Pressable style={ [styles.footerTab, isActive("more") ? styles.footerTabActive : styles.footerTabInactive] } onPress={ onPressMore }>
                    <View style={styles.footerTabContent}>
                        <View>
                            {
                                isActive("more") && (<Image source={appImages.homeFooterIcon5} style={styles.footerTabIcon}/>)
                                ||
                                (<Image source={appImages.homeFooterIcon5Inactive} style={styles.footerTabIcon}/>)
                            } 
                        </View>
                        <View>
                            <Text style={ isActive("more") ? styles.footerTabTextActive : styles.footerTabText }>More</Text>
                        </View>
                    </View>
                </Pressable>
            </View> 
        </View>
        
    )
}

export const styles = StyleSheet.create({

    footerContainer: {
        // backgroundColor: "pink",
        // backgroundColor: "transparent",
    },

    footerBgContainer: {
        // backgroundColor: "yellow"
    },

    footerBgImage : { 
        width:"100%", 
        height:80,
        position: "relative",
        zIndex:-15,
        marginBottom: -80,
        //backgroundColor: appColors.grey5,
        backgroundColor: appColors.AppBlue,
    },

    sosButtonContainer: { 
        backgroundColor: "transparent",
        // backgroundColor: appColors.YoGreen,
        justifyContent: "center",
        alignItems:"center",
        // position: "relative",
        zIndex:25,
        // marginBottom: -50,
        width:120,
        // marginLeft: "auto",
        // marginRight: "auto",
        // borderRadius: 20,
        position:'absolute',
        left: (SCREEN_WIDTH/2)-60, // based on half of the container width
        top: -20,

    },
    sosButtonImage : {
        width:75, 
        height:75,
        resizeMode:"contain",
    },

    footerTabsContainer: { 
        backgroundColor:appColors.AppBlue, 
        flexDirection:"row", 
        justifyContent:'space-around',
        // paddingVertical:5,
        paddingTop:10,
        paddingBottom: 15,
        paddingHorizontal:5,
        zIndex: 20,
        borderTopColor:appColors.AppBlue,
        borderTopWidth:2,
       
    },

   
    footerTab : {
        backgroundColor:appColors.AppBlue,
        paddingVertical:5,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        flex:1,
        borderRadius: 50,
        overflow: 'hidden',

        // some shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    footerTabActive: {
        backgroundColor:appColors.CardBackground,
    },

    footerTabInactive: {
        backgroundColor:appColors.AppBlue,
    },

    footerTabContent: {
        // backgroundColor:'red', 
        //minWidth:"90%", 
        alignItems:'center', 
        justifyContent:'center',
        padding:8, 
        // borderRadius:50
    },

    footerTabText : {
        color:appColors.CardBackground, 
        fontWeight: "600",
        fontSize: 10,
        marginTop:3,
    },

    footerTabTextActive : {
        color:appColors.AppBlue, 
        fontWeight: "800",
        fontSize: 10,
    },

    footerAvatar: {
        width:25, 
        height:25, 
        resizeMode:"cover", 
        borderRadius:20,
    },

    footerTabIcon: {
        width:25, 
        height:25, 
        resizeMode:"contain", 
        // borderRadius:20,
    },


})