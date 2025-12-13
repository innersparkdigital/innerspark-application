import { createSlice } from "@reduxjs/toolkit";

 /* User Details object structure
    userDetails = {
        userId: 13552,
        name: 'Janee',
        email: 'user@gmail.io',
        phone: '+25689888885',
        image: '',
        city: '', 
        country: '',
        balance: 0.0,
        gender: '',
        pin: 0,
        email_verified: 0,
        phone_verified: 0,
    }
*/
export const userDataSlice = createSlice({
    name: 'userData',
    initialState: {
      userDetails: {
            userId: 0,
            name: "App User",
            email: "standard@example.com",
            phone: "+25689888885",
            city: "Kampala", 
            country: "Uganda",
            balance : 0.0,
            gender: "",
            image: "",
            pin: "0",
            email_verified: 0,
            phone_verified: 0,
      },
      userProfile: null,
      userAvatar: null,
      sessionUserId: null, 
      userNotifications: [],
      userNotificationCount: 0,
      pushNotifications:[],
      pushNotificationCount: 0,

    
    },
    reducers: {
        updateUserDetails: (state, action) => {
            state.userDetails = action.payload
        },

        setUserProfile: (state, action) => {
            state.userProfile = action.payload;
        },

        mergeUserProfile: (state, action) => {
            state.userProfile = {
                ...(state.userProfile || {}),
                ...(action.payload || {}),
            };
        },

        updateUserAvatar: (state, action) => {
            state.userAvatar = action.payload            
        },

        updateSessionUserId: (state, action) => {
            state.sessionUserId = action.payload            
        },

        updateUserNotifications: (state, action) => {
            state.userNotifications = action.payload            
        },

        updateUserNotificationCount: (state, action) => {
            state.userNotificationCount = action.payload            
        },

        updatePushNotifications: (state, action) => {
            state.pushNotifications = action.payload            
        },

        updatePushNotificationCount: (state, action) => {
            state.pushNotificationCount = action.payload            
        },

    }
})

// Action creators are generated for each case function
export const { 
    updateUserDetails, 
    setUserProfile,
    mergeUserProfile,
    updateUserAvatar, 
    updateSessionUserId,
    updateUserNotifications,
    updateUserNotificationCount,
    updatePushNotifications,
    updatePushNotificationCount,

} = userDataSlice.actions

export default userDataSlice.reducer