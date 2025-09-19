import { appColors } from "./Styles";

/* App Assets, Images,logos, etc. */
export const appImages = { 
    // App Logos, Icons
    logoDefault : require("../assets/icons/app-icon.png"),
    logoRound : require("../assets/icons/app-icon-round.png"),
    logoRecBlue : require("../assets/icons/app-logo.png"),
    
    avatarDefault : require("../assets/icons/avatar.png"),
    isDefaultImage: require("../assets/images/is-default.png"),
    UGFlag : require("../assets/icons/flag-ug.png"),

    // custom backgrounds
    laundryBg : require("../assets/backgrounds/bg-patterns.png"),
    bgPatterns : require("../assets/backgrounds/bg-patterns.png"),

};


/* App Useful External Links */
export const appLinks = { 
    appTerms : "https://www.innersparkafrica.com/", // terms & conditions link
    appPrivacy : "https://www.innersparkafrica.com/",  // Privacy policy link
    appFacebook : "https://facebook.com/",  
    appTwitter : "https://x.com/",  
    appInstagram : "https://instagram.com/",  
    appLinkedIn : "https://linkedin.com/",  
    appWebsite : "https://www.innersparkafrica.com/",  
    appSupportEmail : "mailto:info@innersparkafrica.com",  
    appGooglePlayURL : "https://www.innersparkafrica.com/",  

};


/* App Content: Text Descriptions, intro, etc. */
export const appContents = {
    aboutAppText : "Enjoy hassle-free, efficient service designed to meet all your laundry needs. Schedule pick-ups, track your laundry in real-time, and manage payments all in one convenient app.",
}


/**
 * App Start Intro Slides
 */
export const slides = [
    {
        key: 'one',
        title: 'Welcome to Innerspark',
        text: "Your Digital Partner for Mental Wellness.",
        hasImage: true, // use to show or hide image instead of icon
        image: require('../assets/introSlider/s-slide-1.png'),
        iconName: "info-outline",
        iconType: "material-community",
        iconColor: appColors.AppBlue,
    },

    {
      key: 'two',
      title: 'Wellness at a Tap',
      text: "Track your mood, reflect daily, and earn rewards effortlessly.",
      hasImage: true, // use to show or hide image instead of icon
      image: require('../assets/introSlider/s-i-mood.png'),
      iconName: "info-outline",
      iconType: "material-community",
      iconColor: appColors.AppBlue,
    },

    {
      key: 'three',
      title: 'Online Therapy on Demand',
      text: "Connect with licensed therapists for private sessions anytime, anywhere.",
      hasImage: true, // use to show or hide image instead of icon
      image: require('../assets/introSlider/s-i-therapist.png'),
      iconName: "info-outline",
      iconType: "material-community",
      iconColor: appColors.AppBlue,
    },

    {
      key: 'four',
      title: 'Join Support Groups', 
      text: "Share experiences and learn with like-minded communities.",
      hasImage: true, // use to show or hide image instead of icon
      image: require('../assets/introSlider/s-i-community.png'),
      iconName: "info-outline",
      iconType: "material-community",
      iconColor: appColors.AppBlue,

    },

    {
      key: 'five',
      title: 'Your Wellness Vault', 
      text: "Use points, MoMo, or donations to pay for therapy securely.",
      hasImage: true, // use to show or hide image instead of icon
      image: require('../assets/introSlider/s-i-vault.png'),
      iconName: "info-outline",
      iconType: "material-community",
      iconColor: appColors.AppBlue,

    },

    {
      key: 'six',
      title: 'We’re Here to Help', 
      text: "Get instant emergency help, right when you need it.",
      hasImage: true, // use to show or hide image instead of icon
      image: require('../assets/introSlider/s-i-help.png'),
      iconName: "info-outline",
      iconType: "material-community",
      iconColor: appColors.AppBlue,

    },


  ];


/**
 * Laundromats test data --- Remove Later
 * This is TEST Data
 */
export const laundromatsData = [ 
        {
            name:"Shine Laundry & Dry Cleaning",
            image : "https://laundryhouse.app/assets/images/About/About-1.jpg",
            awayDistance: "O.3 Km",
            awayTime: "2Hrs-48Hrs",
            price: "4k",
            priceUnit: "kg",
            rating: "4.5",
            description : "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod dolore magna consectetur adipisicing elit, sed do eiusmod dolore magna aliqua.",
            cid : "25585",
        },

        {
            // image : "https://onpoint-laundry.com/wp-content/uploads/2021/07/pexels-pixabay-325876.jpg",
            name : "Spot Dry Cleaners",
            awayDistance: "O.3 Km",
            awayTime: "2Hrs-48Hrs",
            price: "4k",
            priceUnit: "kg",
            rating: "4.5",
            cid : "25523",
        },

        {
          
          cid : "25524",
          image : "https://laundryhouse.app/assets/images/About/About-1.jpg",
          name : "The Laundry Guru"
        },


];



// Laundromats Test Data - Better format
export const laundromatsDataTest = [
  {
    id: 1,
    name: "Shine Laundry & Dry Cleaning",
    image: "https://laundryhouse.app/assets/images/About/About-1.jpg",
    location: {
      distance: "0.3 Km",
      time: "2Hrs-48Hrs",
      latitude: 37.7749,
      longitude: -122.4194
    },
    price: 4,
    priceUnit: "KG",
    rating: 4.5,
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod dolore magna aliqua."
  },
  {
    id: 2,
    name: "Spot Dry Cleaners",
    image: "https://onpoint-laundry.com/wp-content/uploads/2021/07/pexels-pixabay-325876.jpg",
    location: {
      distance: "0.3 Km",
      time: "2Hrs-48Hrs",
      latitude: 37.7859,
      longitude: -122.4364
    },
    price: 4,
    priceUnit: "KG",
    rating: 4.5
  },
  
];


/**
 *  E-Receipt Data for testing
 */
export const receiptTestData = {
    laundromatName: 'Fast Boots & Dry Cleaning',
    laundromatAddress: '7th Floor, Shop 8. Rumee Building.',
    customerName: 'Ms Katy',
    customerContact: '0778-753-768',
    receiptNo: '7789',
    pickUpAddress: 'Buziga, Makindye, Kampala',
    pickUpDateTime: 'Aug 08, 2024 | 10:00AM',
    services: {
      Washing: 15000,
      Ironing: 7000,
      Beddings: 30000,
      'Pick Up Fees': 10000
    },
    total: 62000,
    paymentMethod: 'Cash On Pick Up',
    amountPaid: 62000,
    balance: 0,
    transactionId: 'FcD678Jmdg7RRSJ9'
};