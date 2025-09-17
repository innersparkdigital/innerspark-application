import { createSlice } from "@reduxjs/toolkit"

 /**
  * Signup Flow Object data
  *  Signup flow data structures
    name: 'janek',
    gender: 'male|female',
    dob = {
        dd: 11,
        mm: 11,
        yy: 1994
    },
    location: 'Kampala'

*/

export const signupFlowSlice = createSlice({
    name: 'signupFlow',
    initialState: {
        name: null,
        gender: "M",
        dob: null,
        location: null,
        city: null,
        country: null,
    },
    reducers: {
        updateName: (state, action) => {
            state.name = action.payload
        },
        updateGender: (state, action) => {
            state.gender = action.payload
        },
        updateDOB: (state, action) => {
            state.dob = action.payload
        },
        updateLocation: (state, action) => {
            state.location = action.payload
        },
        updateCity: (state, action) => {
            state.city = action.payload
        },
        updateCountry: (state, action) => {
            state.country = action.payload
        },

    }
})

// Action creators are generated for each case function
export const {
    updateName,
    updateGender,
    updateDOB,
    updateLocation,
    updateCity,
    updateCountry,

} = signupFlowSlice.actions 

export default signupFlowSlice.reducer