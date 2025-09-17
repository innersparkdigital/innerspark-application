import { createSlice } from "@reduxjs/toolkit"

/** 
 * App session data for temporaty use
 * Data is not stored locally
 * Data is wiped after use unless needed
 */

export const appSessionSlice = createSlice({
    name: 'appSession',
    initialState: {
        sessionLocation: null,
    },
    reducers: {
        sessionUpdateLocation: (state, action) => {
            state.sessionLocation = action.payload
        },
    }
})

// Action creators are generated for each case function
export const {
    sessionUpdateLocation,

} = appSessionSlice.actions 

export default appSessionSlice.reducer