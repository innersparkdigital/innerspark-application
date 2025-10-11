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

    // Dummy people photos
    dPerson1 : require("../assets/images/dummy-people/d-person1.png"),
    dPerson2 : require("../assets/images/dummy-people/d-person2.png"),
    dPerson3 : require("../assets/images/dummy-people/d-person3.png"),
    dPerson4 : require("../assets/images/dummy-people/d-person4.png"),

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
    appUserGuide : "https://www.innersparkafrica.com/",  

};


/* App Content: Text Descriptions, intro, etc. */
export const appContents = {
    aboutAppText: "Innerspark helps you care for your mental well-being with ease. Book therapy sessions, track your moods, join support groups, and access wellness resources—all in one simple, supportive app.",
    supportPhone : "+256 (0) 780-570-987", // support phone number 
    supportEmail : "support@innersparkafrica.com", // support email address
    supportHours : "Monday - Friday, 9 AM - 6 PM", // support working hours

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
 * App FAQ Data
 * This is TEST Data
 */
export const faqData = [

    {
      id: '1',
      question: 'How do I book a therapy session?',
      answer: 'Go to the Therapists tab, browse available therapists, select one that fits your needs, and choose an available time slot. You can pay securely through the app.',
      category: 'Booking',
    },
    {
      id: '2',
      question: 'How do I join a support group?',
      answer: 'Navigate to the Groups section from the home screen, browse available groups, and tap "Join Group" on any group that interests you. Some groups may require approval from the therapist.',
      category: 'Groups',
    },
    {
      id: '3',
      question: 'Is my data secure and private?',
      answer: 'Yes, we use industry-standard encryption to protect your data. All conversations with therapists are confidential and comply with healthcare privacy regulations.',
      category: 'Privacy',
    },
    {
      id: '4',
      question: 'How do I track my mood?',
      answer: 'Use the Mood tab to log your daily mood. You can add notes and view insights about your mood patterns over time.',
      category: 'Features',
    },
    {
      id: '5',
      question: 'What if I need emergency help?',
      answer: 'Use the Emergency tab for immediate crisis support. You\'ll find emergency contacts, coping tools, and safety planning resources.',
      category: 'Emergency',
    },
    {
      id: '6',
      question: 'How do I cancel or reschedule an appointment?',
      answer: 'Go to your appointments in the Sessions section, find the appointment you want to change, and use the cancel or reschedule options. Please note cancellation policies.',
      category: 'Booking',
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




];

