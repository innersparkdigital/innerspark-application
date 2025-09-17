import { createSlice } from "@reduxjs/toolkit";

// The first time the App runs
// If the infobox or slider has run once set it to true, otherwise false
// Trigger is by the calling element, a button or any other pressable
// AppStart values are saved on local storage and loaded up on app start

export const appStartSlice = createSlice({
    name: 'appStart',
    initialState: {
        isLoading: true,
        introSlider: false, 
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

    }
})

// Action creators will be generated for each case function
export const { 
    updateIntroSlider,
    updateAppNeedsUpdate,
    
    } = appStartSlice.actions 

export default appStartSlice.reducer 