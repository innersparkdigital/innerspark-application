import { createSlice } from "@reduxjs/toolkit";

// The first time the App runs
// If the infobox or slider has run once set it to true, otherwise false
// Trigger is by the calling element, a button or any other pressable

export const appStartSlice = createSlice({
    name: 'appStart',
    initialState: {
        isLoading: true,
        introSlider: false, 
        yoMatchFeatureDiscovery: 0, 
        appNeedsUpdate: false,
        infobox: { 
            brandList: false,
         },  
    },


    reducers: {

        updateIntroSlider: (state, action) => {
            state.introSlider = action.payload,
            state.isLoading = false
        },

        updateAppNeedsUpdate: (state, action) => { 
            state.appNeedsUpdate = action.payload
        },
        
        updateYoMatchFeatureDiscovery: (state, action) => {
            state.yoMatchFeatureDiscovery = action.payload
        },
       
        // updateTrendsInfoBox: (state, action) => {
        //     state.infobox.trends = action.payload
        // },

    }
})

// Action creators will be generated for each case function
export const { 
    updateIntroSlider,
    updateYoMatchFeatureDiscovery,
    updateAppNeedsUpdate,
    // updateTrendsInfoBox,
    // updateOffersInfoBox,
    
    } = appStartSlice.actions 

export default appStartSlice.reducer 