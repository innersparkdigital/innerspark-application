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
    onPressRecycle,
    onPressGroupGift,
    onPressWallet,
    onPressAccount,
    onPressHome,
    onPressGiftCard,

}){

    // User Avatar from store
    const userAvatarURI = useSelector(state => state.userData.userAvatar); // avatar object { image: uri}

    return(
        <View style={ styles.footerContainer }>
            <View style={ styles.sosButtonContainer }>
                <Pressable onPress={onPressHome}>
                   <Image source={appImages.logoRound} style={styles.sosButtonImage}  />
                </Pressable>
            </View>

            {/* <View style={ styles.footerBgContainer }>
                <Image source={images.footerBg} style={styles.footerBgImage} />
            </View> */}

            <View style={ styles.footerTabsContainer }>
                <Pressable style={ styles.footerTab } onPress={onPressWallet}>
                    <View>
                        <Icon 
                            type="material-community" 
                            name="wallet-outline" 
                            color={ activeTab == "wallet" ? appColors.YoGreen : appColors.grey3 } 
                            size={28} 
                        />
                    </View>
                    <View>
                        <Text style={ activeTab == "wallet" ? styles.footerTabTextActive : styles.footerTabText }>Wallet</Text>
                    </View>
                </Pressable>
                <Pressable style={styles.footerTab} onPress={onPressGroupGift}>
                    <View>
                        <Icon 
                            type="material-community" 
                            name="wallet-giftcard" 
                            color={ activeTab == "group-gift" ? appColors.YoGreen : appColors.grey3 } 
                            size={28} 
                        />
                    </View>
                    <View>
                        <Text style={ activeTab == "group-gift" ? styles.footerTabTextActive : styles.footerTabText }>Group Gift</Text>
                    </View>
                </Pressable>
                <View style={{ flex:2 }}></View>
                <Pressable style={styles.footerTab} onPress={onPressGiftCard}>
                    <View>
                        <Icon 
                            type="material-community" 
                            name="cards-outline" 
                            color={ activeTab == "giftcard" ? appColors.YoGreen : appColors.grey3 } 
                            size={28} 
                        />
                    </View>
                    <View>
                        <Text style={ activeTab == "giftcard" ? styles.footerTabTextActive : styles.footerTabText }>Gift Cards</Text>
                    </View>
                </Pressable>
                {/* <Pressable style={styles.footerTab} onPress={onPressRecycle}>
                    <View>
                        <Icon 
                            type="material-community" 
                            name="bucket" 
                            color={ activeTab == "recycle" ? appColors.black : appColors.CardBackground } 
                            size={28} 
                        />
                    </View>
                    <View>
                        <Text style={ activeTab == "recycle" ? styles.footerTabTextActive : styles.footerTabText }>Recycle</Text>
                    </View>
                </Pressable> */}
                <Pressable style={ styles.footerTab } onPress={ onPressAccount }>
                    <View>
                        {
                          userAvatarURI && <Image source={{ uri: userAvatarURI }} style={styles.footerAvatar}/>
                            ||
                          <Icon 
                              type="material-community" 
                              name="account-circle-outline" 
                              color={ activeTab == "account" ? appColors.YoGreen : appColors.grey3 }
                              size={28} 
                           />
                        } 
                    </View>
                    <View>
                        <Text style={ activeTab == "account" ? styles.footerTabTextActive : styles.footerTabText }>Account</Text>
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
        
        //resizeMode:"contain"
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
        paddingTop:3,
        paddingBottom: 5,
        paddingHorizontal:5,
        zIndex: 20,
        borderTopColor:appColors.AppBlue,
        borderTopWidth:2,
        
    },

    footerTab : {
        //backgroundColor:'yellow',
        paddingVertical:5,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        flex:1,
    },
    footerTabText : {
        color:appColors.grey3, 
        fontWeight: "600",
        fontSize: 10,
        marginTop:3,
    },

    footerTabTextActive : {
        color:appColors.CardBackground, 
        fontWeight: "700",
        fontSize: 10,
    },

    footerAvatar: {
        width:28, 
        height:28, 
        resizeMode:"cover", 
        borderRadius:20,
    },


})