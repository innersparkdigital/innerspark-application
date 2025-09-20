
// IS App global  colors
export const appColors = {
    buttons: "#ff8c52",
    grey1: "#43484d",
    grey2: "#5e6977",
    grey3: "#86939e",
    grey4: "#bdc6cf",
    grey5: "#e1e8ee",
    grey6: "#F2F2F2",
    grey7: "#F6F6F6",
    CardComment: "#86939e",
    CardBackground: "#FFFFFF",
    CardBackgroundFade: "rgba(255,255,255,0.5)", // white with opacity
    CardBackgroundFade2: "rgba(255,255,255,0.4)", // white with opacity
    CardBackgroundFade3: "rgba(255,255,255,0.3)", // white with opacity
    CardBackgroundFade4: "rgba(255,255,255,0.2)", // white with opacity

    AppBlue: "#2C7A7C", // base color  -- same as dark
    AppBlueFade: "rgba(15,123,169,0.4)", // blue fade alternative
    AppBlueOpacity: "#F1F9F9", // opacity
    AppBlueDark: "#2C7A7C", // alternative base color
    AppOrange: "#EE7810", // base color  -- same as dark
    AppGreen: "#64D64E",
    AppLightGray: "#F6F6F6",

    DoffeeGreen: "#2C7A7C",
    DoffeeYellow: "#FFC12F",
    DoffeeButtons: "#1AA382",
    statusBar: "#800080",
    headerText: "white",

    YoGreen: '#2C7A7C',
    YoPink: '#C93775',
    YoPurple: '#B800C4',
    YoGreenFade: '#E7F6DC',
    YoBlue: '#2C7A7C',
    YoGrey: '#A9AEB1',
    black: '#000000',

    /* App Teal Colors - and shades variations */
    YoTeal: '#64D64E',
    YoTeal0: '#64D64E',
    YoTeal1: '#64D64E',
    YoTeal2: '#64D64E',
    YoTeal3: '#64D64E',
    YoTeal4: '#64D64E',
    YoTealFade: '#E7F6DC',
    YoTealDark: '#64D64E',
    
}


// LH App global fonts
// variants for different font weights eg: headerTextBold, headerTextRegular,etc. 
export const appFonts = {
    headerTextBlack: 'RobotoSlabBlack',
    headerTextExtraBold: 'RobotoSlabExtraBold',
    headerTextBold: 'RobotoSlabBold',
    headerTextSemiBold: 'RobotoSlabSemiBold',
    headerTextMedium: 'RobotoSlabMedium',
    headerTextRegular: 'RobotoSlabRegular',

    bodyTextTitle: 'RobotoSlabExtraBold',
    bodyTextExtraBold: 'RobotoSlabExtraBold',
    bodyTextBold: 'RobotoSlabBold',
    bodyTextSemiBold: 'RobotoSlabSemiBold',
    bodyTextMedium: 'RobotoSlabMedium', 
    bodyTextRegular: 'RobotoSlabRegular',
    bodyTextLight: 'RobotoSlabLight',
    bodyTextThin: 'RobotoSlabThin',

    buttonTextBold: 'RobotoSlabBold',
    buttonTextRegular: 'RobotoSlabRegular',
    buttonTextMedium: 'RobotoSlabMedium',
    buttonTextLight: 'RobotoSlabLight',
    buttonTextThin: 'RobotoSlabThin',
}

// some parameters
export const parameters = {
    headerHeightTinier: 10,
    headerHeightTiny: 15,
    headerHeightS: 30,
    headerHeight: 45,
    headerHeightM: 50,
    headerHeightL: 60,
    headerHeightXL: 70,
    headerHeightXXL: 80,

    doffeeButtonXL : {
        backgroundColor:appColors.black,
        alignContent:"center",
        justifyContent:"center",
        borderRadius:10,
        borderWidth:1, 
        borderColor:appColors.AppBlue,
        height:50,
        paddingHorizontal:20,
    },

    doffeeButtonXLTitle: {
        color:appColors.CardBackground,
        fontSize:16,  
        fontWeight:"700",
        fontFamily: appFonts.buttonTextBold,
        alignItems:"center",
        justifyContent:"center",
        marginTop:-3,
    },

    // App Button - Blue
    appButtonXLBlue : {
        backgroundColor:appColors.AppBlue,
        alignContent:"center",
        justifyContent:"center",
        borderRadius:10,
        borderWidth:1, 
        borderColor:appColors.grey4,
        height:50,
        paddingHorizontal:20,
    },

    appButtonXLTitleBlue: {
        color:appColors.CardBackground,
        fontSize:16,  
        fontWeight:"700",
        fontFamily: appFonts.buttonTextBold,
        alignItems:"center",
        justifyContent:"center",
        marginTop:-3,
    },

    appButtonXL : {
        backgroundColor:appColors.black,
        alignContent:"center",
        justifyContent:"center",
        borderRadius:10,
        borderWidth:1, 
        borderColor:appColors.AppBlue,
        height:50,
        paddingHorizontal:20,
    },

    appButtonXLTitle: {
        color:appColors.CardBackground,
        fontSize:16,  
        fontWeight:"700",
        fontFamily: appFonts.buttonTextBold,
        alignItems:"center",
        justifyContent:"center",
        marginTop:-3,
    },

    appButtonXLOutline : {
        backgroundColor:appColors.CardBackground,
        alignContent:"center",
        justifyContent:"center",
        borderRadius:10,
        borderWidth:1, 
        borderColor:appColors.AppBlue,
        height:50,
        paddingHorizontal:20,
    },

    appButtonXLOutlineTitle : { 
        color:appColors.AppBlue,
        fontSize:16,  
        fontWeight:"700",
        fontFamily: appFonts.buttonTextBold,
        alignItems:"center",
        justifyContent:"center",
        marginTop:-3,
    },

    appModalContainer: {
        flex:1,
        backgroundColor:appColors.CardBackground,
        padding:20,
        borderTopRightRadius:25,
        borderTopLeftRadius:25,
    },

    styledButton: {
        backgroundColor:"#1AA382",
        alignContent:"center",
        justifyContent:"center",
        borderRadius:10,
        borderWidth:1, 
        borderColor:"#ff8c52",
        height:50,
        paddingHorizontal:20,
        width:'100%',
    },

    buttonTitle: {
        color:"white",
        fontSize:20,  
        fontWeight:"700",
        fontFamily: appFonts.buttonTextBold,
        alignItems:"center",
        justifyContent:"center",
        marginTop:-3,
    },

    yoModalContainerCenter: {
        backgroundColor:appColors.CardBackground,
        padding:20,
        borderRadius:10,
        justifyContent: 'center',
        marginHorizontal: 25,
    },

    doffeeModalContainer: {
        flex:1,
        backgroundColor:appColors.CardBackground,
        padding:20,
        borderTopRightRadius:25,
        borderTopLeftRadius:25,
    },

}